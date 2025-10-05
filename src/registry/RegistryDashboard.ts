/**
 * Registry Dashboard
 *
 * CLI dashboard for viewing investigation history and statistics.
 */

import { InvestigationRegistry } from './InvestigationRegistry';
import { RegistryQueryAPI } from './RegistryQueryAPI';
import { InvestigationRecord, RegistryQuery } from './types';

export class RegistryDashboard {
  constructor(
    private registry: InvestigationRegistry,
    private queryAPI: RegistryQueryAPI
  ) {}

  /**
   * Display investigation history
   */
  async displayHistory(query: RegistryQuery = {}): Promise<void> {
    console.log('\n📚 Investigation History');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const result = await this.queryAPI.search({
      limit: 20,
      sortBy: 'startTime',
      sortOrder: 'desc',
      ...query,
    });

    if (result.records.length === 0) {
      console.log('No investigations found.\n');
      return;
    }

    console.log(`Found ${result.total} investigation(s)\n`);

    for (const record of result.records) {
      this.displayInvestigation(record);
    }

    if (result.hasMore) {
      console.log(`\n... and ${result.total - result.records.length} more`);
    }

    console.log();
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

    console.log(`${status} ${record.name}`);
    console.log(`   Type: ${record.type}`);
    console.log(`   Started: ${record.startTime.toLocaleString()}`);
    console.log(`   Duration: ${duration} | Tokens: ${record.tokensUsed} | Quality: ${qualityScore}`);
    console.log(`   Agents: ${record.agents.join(', ')}`);

    if (record.tags.length > 0) {
      console.log(`   Tags: ${record.tags.join(', ')}`);
    }

    console.log();
  }

  /**
   * Display statistics
   */
  displayStatistics(): void {
    console.log('\n📊 Registry Statistics');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const stats = this.registry.getStatistics();

    console.log(`Total Investigations: ${stats.totalInvestigations}`);
    console.log();

    console.log('By Type:');
    for (const [type, count] of Object.entries(stats.byType)) {
      const percentage = ((count / stats.totalInvestigations) * 100).toFixed(1);
      console.log(`  ${type}: ${count} (${percentage}%)`);
    }
    console.log();

    console.log('By Status:');
    for (const [status, count] of Object.entries(stats.byStatus)) {
      const icon = this.getStatusIcon(status as any);
      const percentage = ((count / stats.totalInvestigations) * 100).toFixed(1);
      console.log(`  ${icon} ${status}: ${count} (${percentage}%)`);
    }
    console.log();

    console.log('Averages:');
    console.log(`  Duration: ${(stats.avgDuration / 1000).toFixed(1)}s`);
    console.log(`  Tokens Used: ${Math.round(stats.avgTokensUsed)}`);
    console.log(`  Quality Score: ${stats.avgQualityScore.toFixed(1)}/100`);
    console.log();

    console.log('Date Range:');
    console.log(`  Earliest: ${stats.dateRange.earliest.toLocaleDateString()}`);
    console.log(`  Latest: ${stats.dateRange.latest.toLocaleDateString()}`);
    console.log();
  }

  /**
   * Display similar investigations
   */
  async displaySimilar(investigationId: string, limit: number = 5): Promise<void> {
    console.log('\n🔍 Similar Investigations');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const similar = await this.queryAPI.findSimilar(investigationId, limit);

    if (similar.length === 0) {
      console.log('No similar investigations found.\n');
      return;
    }

    for (const { record, similarity, reasons } of similar) {
      console.log(`${similarity}% Match - ${record.name}`);
      console.log(`   Type: ${record.type}`);
      console.log(`   Started: ${record.startTime.toLocaleString()}`);
      console.log(`   Reasons: ${reasons.join(', ')}`);
      console.log();
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
    console.log('\n💡 Recommended Investigations');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const recommendations = await this.queryAPI.recommend(
      type,
      codebase,
      tags,
      limit
    );

    if (recommendations.length === 0) {
      console.log('No recommendations found.\n');
      return;
    }

    console.log(`Based on: Type="${type}", Codebase="${codebase}"`);
    if (tags.length > 0) {
      console.log(`Tags: ${tags.join(', ')}`);
    }
    console.log();

    for (const { record, similarity, reasons } of recommendations) {
      console.log(`${similarity}% Match - ${record.name}`);
      console.log(`   Type: ${record.type}`);
      console.log(`   Started: ${record.startTime.toLocaleString()}`);
      console.log(`   Duration: ${record.duration ? (record.duration / 1000).toFixed(1) + 's' : 'N/A'}`);
      console.log(`   Quality: ${record.qualityScore?.toFixed(1) || 'N/A'}/100`);
      console.log(`   Reasons: ${reasons.join(', ')}`);
      console.log();
    }
  }

  /**
   * Display investigation details
   */
  displayDetails(investigationId: string): void {
    console.log('\n📋 Investigation Details');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const record = this.registry.getById(investigationId);

    if (!record) {
      console.log(`Investigation ${investigationId} not found.\n`);
      return;
    }

    const status = this.getStatusIcon(record.status);

    console.log(`${status} ${record.name}`);
    console.log(`ID: ${record.id}`);
    console.log();

    console.log('General:');
    console.log(`  Type: ${record.type}`);
    console.log(`  Codebase: ${record.codebase}`);
    console.log(`  Status: ${record.status}`);
    console.log();

    console.log('Timing:');
    console.log(`  Started: ${record.startTime.toLocaleString()}`);
    if (record.endTime) {
      console.log(`  Ended: ${record.endTime.toLocaleString()}`);
    }
    if (record.duration) {
      console.log(`  Duration: ${(record.duration / 1000).toFixed(1)}s`);
    }
    console.log();

    console.log('Performance:');
    console.log(`  Tokens Used: ${record.tokensUsed}`);
    if (record.qualityScore) {
      console.log(`  Quality Score: ${record.qualityScore.toFixed(1)}/100`);
    }
    if (record.findings !== undefined) {
      console.log(`  Findings: ${record.findings}`);
    }
    console.log();

    console.log('Agents:');
    for (const agent of record.agents) {
      console.log(`  - ${agent}`);
    }
    console.log();

    if (record.tags.length > 0) {
      console.log('Tags:');
      for (const tag of record.tags) {
        console.log(`  - ${tag}`);
      }
      console.log();
    }

    if (Object.keys(record.metadata).length > 0) {
      console.log('Metadata:');
      console.log(JSON.stringify(record.metadata, null, 2));
      console.log();
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
