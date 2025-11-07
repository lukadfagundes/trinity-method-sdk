/**
 * LearningMetricsDashboard - Visual dashboard for learning system metrics and insights
 *
 * @see docs/knowledge-preservation.md - Learning metrics and continuous improvement
 * @see LearningDataStore.ts - Source of learning data
 * @see PerformanceTracker.ts - Performance metrics tracking
 * @see KnowledgeSharingBus.ts - Knowledge sharing statistics
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Visualizes learning system performance through comprehensive metrics dashboard. Shows pattern
 * discovery rates, match success, time savings, and system health at a glance. Enables teams
 * to measure and optimize their learning effectiveness through data-driven insights.
 *
 * **Why This Exists:**
 * Learning systems are invisible without metrics. Teams don't know if patterns are helpful,
 * which agents learn fastest, or if the system provides ROI. This dashboard surfaces critical
 * metrics: pattern discovery rate, match accuracy, time savings from pattern reuse, agent
 * performance, and learning system health. Makes learning progress visible and measurable.
 *
 * **Knowledge Preservation Architecture (Metrics Layer):**
 * Aggregates data from all three learning layers to provide comprehensive view of system
 * performance. Tracks Layer 1 (pattern growth), Layer 2 (match effectiveness), Layer 3
 * (reinforcement quality), plus cross-team knowledge sharing impact.
 *
 * @example
 * ```typescript
 * const dashboard = new LearningMetricsDashboard(learningData, performanceTracker);
 *
 * // Display full dashboard
 * await dashboard.displayFullDashboard();
 *
 * // Display specific metrics
 * await dashboard.displayPatternMetrics();
 * await dashboard.displayAgentPerformance();
 * await dashboard.displayTimeSavings();
 * ```
 *
 * @module learning/LearningMetricsDashboard
 */

import chalk from 'chalk';
import { LearningData } from './LearningDataStore.js';
import { PerformanceTracker } from './PerformanceTracker.js';
import { AgentType, LearnedPattern, StrategyPerformance } from '../shared/types/index.js';

/**
 * Dashboard metrics aggregation
 */
export interface DashboardMetrics {
  // Pattern metrics
  totalPatterns: number;
  patternsByCategory: Map<string, number>;
  highConfidencePatterns: number; // ≥0.8
  recentPatterns: number; // Last 30 days
  patternDiscoveryRate: number; // Patterns per investigation

  // Match metrics
  totalMatches: number;
  successfulMatches: number;
  matchSuccessRate: number;
  averageConfidence: number;

  // Performance metrics
  totalInvestigations: number;
  averageInvestigationTime: number; // minutes
  estimatedTimeSavings: number; // minutes saved from pattern reuse
  timeSavingsPercent: number;

  // Agent metrics
  agentStats: Map<
    AgentType,
    {
      patterns: number;
      investigations: number;
      successRate: number;
      avgDuration: number;
    }
  >;

  // Health metrics
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
  healthScore: number; // 0-100
  recommendations: string[];
}

/**
 * Time-series metrics for trend analysis
 */
export interface TrendMetrics {
  period: '7d' | '30d' | '90d' | 'all';
  dataPoints: Array<{
    date: Date;
    patterns: number;
    investigations: number;
    avgDuration: number;
    successRate: number;
  }>;
}

/**
 * Learning Metrics Dashboard - Visualize learning system performance
 */
export class LearningMetricsDashboard {
  constructor(
    private learningData: Map<AgentType, LearningData>,
    private performanceTracker?: PerformanceTracker
  ) {}

  /**
   * Display complete learning metrics dashboard
   */
  async displayFullDashboard(): Promise<void> {
    console.log('\n' + chalk.bold.cyan('═'.repeat(80)));
    console.log(chalk.bold.cyan('  TRINITY METHOD - LEARNING SYSTEM DASHBOARD'));
    console.log(chalk.bold.cyan('═'.repeat(80)) + '\n');

    const metrics = await this.calculateMetrics();

    // System health overview
    this.displaySystemHealth(metrics);
    console.log('');

    // Pattern metrics
    this.displayPatternMetrics(metrics);
    console.log('');

    // Performance metrics
    this.displayPerformanceMetrics(metrics);
    console.log('');

    // Agent performance
    this.displayAgentPerformance(metrics);
    console.log('');

    // Recommendations
    this.displayRecommendations(metrics);

    console.log('\n' + chalk.bold.cyan('═'.repeat(80)) + '\n');
  }

  /**
   * Display system health overview
   */
  private displaySystemHealth(metrics: DashboardMetrics): void {
    console.log(chalk.bold.white('📊 System Health Overview\n'));

    const healthIcon = this.getHealthIcon(metrics.systemHealth);
    const healthColor = this.getHealthColor(metrics.systemHealth);

    console.log(`  ${healthIcon} Status: ${healthColor(metrics.systemHealth.toUpperCase())}`);
    console.log(`  🎯 Health Score: ${this.renderHealthBar(metrics.healthScore)}`);
    console.log(`  📈 Total Investigations: ${chalk.cyan(metrics.totalInvestigations.toString())}`);
    console.log(`  🧠 Total Patterns: ${chalk.cyan(metrics.totalPatterns.toString())}`);
    console.log(`  ⚡ Time Savings: ${chalk.green(Math.round(metrics.estimatedTimeSavings) + ' min')} (${chalk.green(metrics.timeSavingsPercent.toFixed(1) + '%')})`);
  }

  /**
   * Display pattern metrics
   */
  private displayPatternMetrics(metrics: DashboardMetrics): void {
    console.log(chalk.bold.white('🧠 Pattern Library Metrics\n'));

    console.log(`  Total Patterns: ${chalk.cyan(metrics.totalPatterns.toString())}`);
    console.log(`  High Confidence (≥0.8): ${chalk.green(metrics.highConfidencePatterns.toString())} (${((metrics.highConfidencePatterns / Math.max(metrics.totalPatterns, 1)) * 100).toFixed(1)}%)`);
    console.log(`  Recent (30 days): ${chalk.yellow(metrics.recentPatterns.toString())}`);
    console.log(`  Discovery Rate: ${chalk.cyan(metrics.patternDiscoveryRate.toFixed(2))} patterns/investigation\n`);

    // Pattern categories
    console.log(chalk.gray('  Pattern Categories:'));
    const sortedCategories = Array.from(metrics.patternsByCategory.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    for (const [category, count] of sortedCategories.slice(0, 5)) {
      const bar = this.renderBar(count, metrics.totalPatterns, 20);
      console.log(
        `    ${category.padEnd(20)} ${bar} ${chalk.cyan(count.toString())}`
      );
    }

    if (sortedCategories.length > 5) {
      console.log(chalk.gray(`    ... and ${sortedCategories.length - 5} more`));
    }
  }

  /**
   * Display performance metrics
   */
  private displayPerformanceMetrics(metrics: DashboardMetrics): void {
    console.log(chalk.bold.white('⚡ Performance Metrics\n'));

    console.log(`  Pattern Matches: ${chalk.cyan(metrics.totalMatches.toString())}`);
    console.log(`  Match Success Rate: ${metrics.matchSuccessRate >= 0.7 ? chalk.green(metrics.matchSuccessRate.toFixed(1) + '%') : chalk.yellow(metrics.matchSuccessRate.toFixed(1) + '%')}`);
    console.log(`  Average Confidence: ${this.renderConfidenceScore(metrics.averageConfidence)}`);
    console.log(`  Avg Investigation Time: ${chalk.cyan(Math.round(metrics.averageInvestigationTime) + ' min')}`);

    if (metrics.estimatedTimeSavings > 0) {
      console.log(
        `\n  ${chalk.bold.green('💰 Estimated Time Savings:')}`
      );
      console.log(`     ${chalk.green(Math.round(metrics.estimatedTimeSavings) + ' minutes')} saved through pattern reuse`);
      console.log(`     ${chalk.green(metrics.timeSavingsPercent.toFixed(1) + '%')} faster investigations with patterns`);
      console.log(`     ${chalk.green('~' + Math.round(metrics.estimatedTimeSavings / 60) + ' hours')} of developer time saved`);
    }
  }

  /**
   * Display agent performance breakdown
   */
  private displayAgentPerformance(metrics: DashboardMetrics): void {
    console.log(chalk.bold.white('🤖 Agent Performance\n'));

    const sortedAgents = Array.from(metrics.agentStats.entries()).sort(
      (a, b) => b[1].investigations - a[1].investigations
    );

    console.log(chalk.gray('  Agent'.padEnd(12) + 'Patterns'.padEnd(12) + 'Investigations'.padEnd(18) + 'Success Rate'.padEnd(16) + 'Avg Duration'));
    console.log(chalk.gray('  ' + '─'.repeat(76)));

    for (const [agent, stats] of sortedAgents) {
      const successRateColor =
        stats.successRate >= 0.8 ? chalk.green : stats.successRate >= 0.6 ? chalk.yellow : chalk.red;

      console.log(
        `  ${agent.padEnd(12)}` +
          `${stats.patterns.toString().padEnd(12)}` +
          `${stats.investigations.toString().padEnd(18)}` +
          `${successRateColor((stats.successRate * 100).toFixed(1) + '%').padEnd(16)}` +
          `${Math.round(stats.avgDuration)}min`
      );
    }
  }

  /**
   * Display system recommendations
   */
  private displayRecommendations(metrics: DashboardMetrics): void {
    if (metrics.recommendations.length === 0) {
      console.log(chalk.bold.green('✅ No recommendations - system performing optimally!\n'));
      return;
    }

    console.log(chalk.bold.yellow('💡 Recommendations\n'));

    for (let i = 0; i < metrics.recommendations.length; i++) {
      console.log(`  ${i + 1}. ${metrics.recommendations[i]}`);
    }
  }

  /**
   * Calculate comprehensive dashboard metrics
   */
  private async calculateMetrics(): Promise<DashboardMetrics> {
    let totalPatterns = 0;
    let highConfidencePatterns = 0;
    let recentPatterns = 0;
    let totalInvestigations = 0;
    let totalMatches = 0;
    let successfulMatches = 0;
    let totalConfidence = 0;
    let totalInvestigationTime = 0;

    const patternsByCategory = new Map<string, number>();
    const agentStats = new Map<
      AgentType,
      {
        patterns: number;
        investigations: number;
        successRate: number;
        avgDuration: number;
      }
    >();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Aggregate data from all agents
    for (const [agent, data] of this.learningData.entries()) {
      const patterns = Array.from(data.patterns.values());
      const investigations = data.totalInvestigations || 0;
      const successful = data.successfulInvestigations || 0;
      const failed = data.failedInvestigations || 0;

      totalPatterns += patterns.length;
      totalInvestigations += investigations;

      let agentInvestigationTime = 0;
      let agentMatches = 0;
      let agentSuccessfulMatches = 0;

      // Pattern analysis
      for (const pattern of patterns) {
        totalConfidence += pattern.confidence;

        if (pattern.confidence >= 0.8) {
          highConfidencePatterns++;
        }

        // Category counting
        const category = pattern.category || 'uncategorized';
        patternsByCategory.set(category, (patternsByCategory.get(category) || 0) + 1);

        // Recent patterns (if lastDetected is available)
        if (pattern.lastDetected && new Date(pattern.lastDetected) >= thirtyDaysAgo) {
          recentPatterns++;
        }

        // Match statistics
        const usageCount = pattern.usageCount || 0;
        const successCount = pattern.successCount || 0;
        agentMatches += usageCount;
        agentSuccessfulMatches += successCount;
      }

      totalMatches += agentMatches;
      successfulMatches += agentSuccessfulMatches;

      // Agent stats
      agentStats.set(agent, {
        patterns: patterns.length,
        investigations,
        successRate: investigations > 0 ? successful / investigations : 0,
        avgDuration: investigations > 0 ? agentInvestigationTime / investigations : 0,
      });
    }

    // Calculate derived metrics
    const averageConfidence = totalPatterns > 0 ? totalConfidence / totalPatterns : 0;
    const matchSuccessRate = totalMatches > 0 ? (successfulMatches / totalMatches) * 100 : 0;
    const patternDiscoveryRate =
      totalInvestigations > 0 ? totalPatterns / totalInvestigations : 0;
    const averageInvestigationTime =
      totalInvestigations > 0 ? totalInvestigationTime / totalInvestigations : 0;

    // Estimate time savings (15% faster with pattern matches)
    const estimatedTimeSavings = successfulMatches * averageInvestigationTime * 0.15;
    const timeSavingsPercent =
      totalInvestigationTime > 0 ? (estimatedTimeSavings / totalInvestigationTime) * 100 : 0;

    // Calculate health score
    const healthScore = this.calculateHealthScore({
      totalPatterns,
      highConfidencePatterns,
      matchSuccessRate,
      averageConfidence,
      patternDiscoveryRate,
      totalInvestigations,
    });

    const systemHealth = this.determineSystemHealth(healthScore);
    const recommendations = this.generateRecommendations({
      totalPatterns,
      highConfidencePatterns,
      matchSuccessRate,
      averageConfidence,
      totalInvestigations,
      recentPatterns,
    });

    return {
      totalPatterns,
      patternsByCategory,
      highConfidencePatterns,
      recentPatterns,
      patternDiscoveryRate,
      totalMatches,
      successfulMatches,
      matchSuccessRate,
      averageConfidence,
      totalInvestigations,
      averageInvestigationTime,
      estimatedTimeSavings,
      timeSavingsPercent,
      agentStats,
      systemHealth,
      healthScore,
      recommendations,
    };
  }

  /**
   * Calculate overall health score (0-100)
   */
  private calculateHealthScore(metrics: {
    totalPatterns: number;
    highConfidencePatterns: number;
    matchSuccessRate: number;
    averageConfidence: number;
    patternDiscoveryRate: number;
    totalInvestigations: number;
  }): number {
    let score = 0;

    // Pattern library size (max 20 points)
    score += Math.min((metrics.totalPatterns / 50) * 20, 20);

    // High confidence patterns (max 25 points)
    if (metrics.totalPatterns > 0) {
      score += (metrics.highConfidencePatterns / metrics.totalPatterns) * 25;
    }

    // Match success rate (max 25 points)
    score += (metrics.matchSuccessRate / 100) * 25;

    // Average confidence (max 20 points)
    score += metrics.averageConfidence * 20;

    // Pattern discovery rate (max 10 points)
    score += Math.min(metrics.patternDiscoveryRate * 5, 10);

    return Math.round(score);
  }

  /**
   * Determine system health level
   */
  private determineSystemHealth(
    score: number
  ): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(metrics: {
    totalPatterns: number;
    highConfidencePatterns: number;
    matchSuccessRate: number;
    averageConfidence: number;
    totalInvestigations: number;
    recentPatterns: number;
  }): string[] {
    const recommendations: string[] = [];

    // Pattern library size
    if (metrics.totalPatterns < 10) {
      recommendations.push(
        'Pattern library is small. Complete more investigations to build pattern library.'
      );
    }

    // High confidence patterns
    const highConfidenceRatio =
      metrics.totalPatterns > 0
        ? metrics.highConfidencePatterns / metrics.totalPatterns
        : 0;
    if (highConfidenceRatio < 0.3) {
      recommendations.push(
        'Low proportion of high-confidence patterns. Focus on validating patterns through repeated use.'
      );
    }

    // Match success rate
    if (metrics.matchSuccessRate < 60) {
      recommendations.push(
        'Pattern match success rate is low. Review pattern matching criteria and refine patterns.'
      );
    }

    // Average confidence
    if (metrics.averageConfidence < 0.6) {
      recommendations.push(
        'Average pattern confidence is low. Continue investigations to strengthen pattern validation.'
      );
    }

    // Recent activity
    if (metrics.recentPatterns === 0 && metrics.totalPatterns > 0) {
      recommendations.push(
        'No recent pattern activity. Patterns may be outdated. Run new investigations to refresh library.'
      );
    }

    // Investigation count
    if (metrics.totalInvestigations < 5) {
      recommendations.push(
        'Limited investigation history. Complete more investigations to improve learning effectiveness.'
      );
    }

    return recommendations;
  }

  /**
   * Render horizontal bar for visualization
   */
  private renderBar(value: number, max: number, width: number): string {
    const filled = Math.round((value / Math.max(max, 1)) * width);
    const empty = width - filled;
    return chalk.cyan('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
  }

  /**
   * Render health score bar
   */
  private renderHealthBar(score: number): string {
    const width = 20;
    const filled = Math.round((score / 100) * width);
    const empty = width - filled;

    const color = score >= 80 ? chalk.green : score >= 60 ? chalk.yellow : chalk.red;

    return (
      color('█'.repeat(filled)) +
      chalk.gray('░'.repeat(empty)) +
      ` ${color(score.toString())}/100`
    );
  }

  /**
   * Render confidence score with color
   */
  private renderConfidenceScore(confidence: number): string {
    const percent = (confidence * 100).toFixed(1);
    if (confidence >= 0.8) return chalk.green(percent + '%');
    if (confidence >= 0.6) return chalk.yellow(percent + '%');
    return chalk.red(percent + '%');
  }

  /**
   * Get health icon
   */
  private getHealthIcon(health: string): string {
    switch (health) {
      case 'excellent':
        return '🌟';
      case 'good':
        return '✅';
      case 'fair':
        return '⚠️';
      case 'poor':
        return '🔴';
      default:
        return '❓';
    }
  }

  /**
   * Get health color function
   */
  private getHealthColor(health: string): (text: string) => string {
    switch (health) {
      case 'excellent':
        return chalk.green;
      case 'good':
        return chalk.cyan;
      case 'fair':
        return chalk.yellow;
      case 'poor':
        return chalk.red;
      default:
        return chalk.gray;
    }
  }
}