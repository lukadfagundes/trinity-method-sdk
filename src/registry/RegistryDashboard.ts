/**
 * Registry Dashboard
 *
 * CLI dashboard for viewing investigation history and statistics.
 */

import { InvestigationRegistry } from './InvestigationRegistry';
import { RegistryQueryAPI } from './RegistryQueryAPI';
import { InvestigationRecord, RegistryQuery } from './types';
import { createLogger } from '../utils/Logger';

const logger = createLogger('RegistryDashboard');

export class RegistryDashboard {
  constructor(
    private registry: InvestigationRegistry,
    private queryAPI: RegistryQueryAPI
  ) {}

  /**
   * Display investigation history
   */
  async displayHistory(query: RegistryQuery = {}): Promise<void> {
    logger.info('\n📚 Investigation History');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const result = await this.queryAPI.search({
      limit: 20,
      sortBy: 'startTime',
      sortOrder: 'desc',
      ...query,
    });

    if (result.records.length === 0) {
      logger.info('No investigations found.\n');
      return;
    }

    logger.info(`Found ${result.total} investigation(s)\n`);

    for (const record of result.records) {
      this.displayInvestigation(record);
    }

    if (result.hasMore) {
      logger.info(`\n... and ${result.total - result.records.length} more`);
    }

    logger.info('');
  }

  /**
   * Display single investigation
   */
  displayInvestigation(record: InvestigationRecord): void {
    const status = this.getStatusIcon(record.status);
    const duration = record.duration
      ? `${(record.duration / 1000).toFixed(1)}s`
      : 'N/A';
    const qualityScore = record.qualityScore
      ? `${record.qualityScore.toFixed(1)}/100`
      : 'N/A';

    logger.info(`${status} ${record.name}`);
    logger.info(`   Type: ${record.type}`);
    logger.info(`   Started: ${record.startTime.toLocaleString()}`);
    logger.info(`   Duration: ${duration} | Tokens: ${record.tokensUsed} | Quality: ${qualityScore}`);
    logger.info(`   Agents: ${record.agents.join(', ')}`);

    if (record.tags.length > 0) {
      logger.info(`   Tags: ${record.tags.join(', ')}`);
    }

    logger.info('');
  }

  /**
   * Display statistics
   */
  displayStatistics(): void {
    logger.info('\n📊 Registry Statistics');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const stats = this.registry.getStatistics();

    logger.info(`Total Investigations: ${stats.totalInvestigations}`);
    logger.info('');

    logger.info('By Type:');
    for (const [type, count] of Object.entries(stats.byType)) {
      const percentage = ((count / stats.totalInvestigations) * 100).toFixed(1);
      logger.info(`  ${type}: ${count} (${percentage}%)`);
    }
    logger.info('');

    logger.info('By Status:');
    for (const [status, count] of Object.entries(stats.byStatus)) {
      const icon = this.getStatusIcon(status as any);
      const percentage = ((count / stats.totalInvestigations) * 100).toFixed(1);
      logger.info(`  ${icon} ${status}: ${count} (${percentage}%)`);
    }
    logger.info('');

    logger.info('Averages:');
    logger.info(`  Duration: ${(stats.avgDuration / 1000).toFixed(1)}s`);
    logger.info(`  Tokens Used: ${Math.round(stats.avgTokensUsed)}`);
    logger.info(`  Quality Score: ${stats.avgQualityScore.toFixed(1)}/100`);
    logger.info('');

    logger.info('Date Range:');
    logger.info(`  Earliest: ${stats.dateRange.earliest.toLocaleDateString()}`);
    logger.info(`  Latest: ${stats.dateRange.latest.toLocaleDateString()}`);
    logger.info('');
  }

  /**
   * Display similar investigations
   */
  async displaySimilar(investigationId: string, limit: number = 5): Promise<void> {
    logger.info('\n🔍 Similar Investigations');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const similar = await this.queryAPI.findSimilar(investigationId, limit);

    if (similar.length === 0) {
      logger.info('No similar investigations found.\n');
      return;
    }

    for (const { record, similarity, reasons } of similar) {
      logger.info(`${similarity}% Match - ${record.name}`);
      logger.info(`   Type: ${record.type}`);
      logger.info(`   Started: ${record.startTime.toLocaleString()}`);
      logger.info(`   Reasons: ${reasons.join(', ')}`);
      logger.info('');
    }
  }

  /**
   * Display recommendations for a new investigation
   */
  async displayRecommendations(
    type: string,
    codebase: string,
    tags: string[] = [],
    limit: number = 5
  ): Promise<void> {
    logger.info('\n💡 Recommended Investigations');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const recommendations = await this.queryAPI.recommend(
      type,
      codebase,
      tags,
      limit
    );

    if (recommendations.length === 0) {
      logger.info('No recommendations found.\n');
      return;
    }

    logger.info(`Based on: Type="${type}", Codebase="${codebase}"`);
    if (tags.length > 0) {
      logger.info(`Tags: ${tags.join(', ')}`);
    }
    logger.info('');

    for (const { record, similarity, reasons } of recommendations) {
      logger.info(`${similarity}% Match - ${record.name}`);
      logger.info(`   Type: ${record.type}`);
      logger.info(`   Started: ${record.startTime.toLocaleString()}`);
      logger.info(`   Duration: ${record.duration ? (record.duration / 1000).toFixed(1) + 's' : 'N/A'}`);
      logger.info(`   Quality: ${record.qualityScore?.toFixed(1) || 'N/A'}/100`);
      logger.info(`   Reasons: ${reasons.join(', ')}`);
      logger.info('');
    }
  }

  /**
   * Display investigation details
   */
  displayDetails(investigationId: string): void {
    logger.info('\n📋 Investigation Details');
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const record = this.registry.getById(investigationId);

    if (!record) {
      logger.info(`Investigation ${investigationId} not found.\n`);
      return;
    }

    const status = this.getStatusIcon(record.status);

    logger.info(`${status} ${record.name}`);
    logger.info(`ID: ${record.id}`);
    logger.info('');

    logger.info('General:');
    logger.info(`  Type: ${record.type}`);
    logger.info(`  Codebase: ${record.codebase}`);
    logger.info(`  Status: ${record.status}`);
    logger.info('');

    logger.info('Timing:');
    logger.info(`  Started: ${record.startTime.toLocaleString()}`);
    if (record.endTime) {
      logger.info(`  Ended: ${record.endTime.toLocaleString()}`);
    }
    if (record.duration) {
      logger.info(`  Duration: ${(record.duration / 1000).toFixed(1)}s`);
    }
    logger.info('');

    logger.info('Performance:');
    logger.info(`  Tokens Used: ${record.tokensUsed}`);
    if (record.qualityScore) {
      logger.info(`  Quality Score: ${record.qualityScore.toFixed(1)}/100`);
    }
    if (record.findings !== undefined) {
      logger.info(`  Findings: ${record.findings}`);
    }
    logger.info('');

    logger.info('Agents:');
    for (const agent of record.agents) {
      logger.info(`  - ${agent}`);
    }
    logger.info('');

    if (record.tags.length > 0) {
      logger.info('Tags:');
      for (const tag of record.tags) {
        logger.info(`  - ${tag}`);
      }
      logger.info('');
    }

    if (Object.keys(record.metadata).length > 0) {
      logger.info('Metadata:');
      logger.info(JSON.stringify(record.metadata, null, 2));
      logger.info('');
    }
  }

  /**
   * Get status icon
   */
  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      completed: '✅',
      failed: '❌',
      partial: '⚠️',
      running: '⏳',
    };

    return icons[status] || '❓';
  }
}
