/**
 * Learning Metrics Dashboard
 * CLI dashboard for visualizing learning system performance and metrics
 */

import { LearningDataStore, LearningData as LearningDataStoreType } from '../learning/LearningDataStore';
import { PerformanceTracker } from '../learning/PerformanceTracker';
import {
  AgentType,
  LearningData,
  LearnedPattern,
  StrategyPerformance,
} from '../shared/types';

export interface DashboardMetrics {
  agentId: AgentType;
  totalInvestigations: number;
  successfulInvestigations: number;
  failedInvestigations: number;
  successRate: number;
  totalPatterns: number;
  highConfidencePatterns: number;
  totalStrategies: number;
  topStrategies: StrategyPerformance[];
  topPatterns: LearnedPattern[];
  averageConfidence: number;
  learningProgress: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  recommendations: string[];
}

export class LearningMetricsDashboard {
  private dataStore: LearningDataStore;

  constructor(dataStore: LearningDataStore) {
    this.dataStore = dataStore;
  }

  /**
   * Get comprehensive metrics for an agent
   */
  async getMetrics(agentId: AgentType): Promise<DashboardMetrics> {
    const learningData = await this.dataStore.loadLearningData(agentId);

    const totalPatterns = learningData.patterns.size;
    const patterns = Array.from(learningData.patterns.values());
    const highConfidencePatterns = patterns.filter(p => p.confidence >= 0.8).length;

    const totalStrategies = learningData.strategies.size;
    const strategies = Array.from(learningData.strategies.values());

    // Calculate average confidence
    const averageConfidence = this.calculateAverageConfidence(patterns, strategies);

    // Get top strategies
    const topStrategies = this.getTopStrategies(strategies, 5);

    // Get top patterns
    const topPatterns = this.getTopPatterns(patterns, 5);

    // Calculate success rate
    const successRate = learningData.totalInvestigations > 0
      ? learningData.successfulInvestigations / learningData.totalInvestigations
      : 0;

    // Determine learning progress
    const learningProgress = this.determineLearningProgress(learningData as any as LearningData);

    // Generate recommendations
    const recommendations = this.generateRecommendations(learningData as any as LearningData, successRate, averageConfidence);

    return {
      agentId,
      totalInvestigations: learningData.totalInvestigations,
      successfulInvestigations: learningData.successfulInvestigations,
      failedInvestigations: learningData.failedInvestigations,
      successRate,
      totalPatterns,
      highConfidencePatterns,
      totalStrategies,
      topStrategies,
      topPatterns,
      averageConfidence,
      learningProgress,
      recommendations,
    };
  }

  /**
   * Get metrics for all agents
   */
  async getAllAgentsMetrics(): Promise<Map<AgentType, DashboardMetrics>> {
    const agents: AgentType[] = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];
    const metricsMap = new Map<AgentType, DashboardMetrics>();

    for (const agentId of agents) {
      try {
        const metrics = await this.getMetrics(agentId);
        metricsMap.set(agentId, metrics);
      } catch (error) {
        // Agent may not have learning data yet, skip
        continue;
      }
    }

    return metricsMap;
  }

  /**
   * Display dashboard in CLI format
   */
  async displayDashboard(agentId?: AgentType): Promise<string> {
    let output = '';

    if (agentId) {
      // Display single agent dashboard
      const metrics = await this.getMetrics(agentId);
      output = this.formatAgentDashboard(metrics);
    } else {
      // Display all agents dashboard
      const allMetrics = await this.getAllAgentsMetrics();
      output = this.formatAllAgentsDashboard(allMetrics);
    }

    return output;
  }

  /**
   * Format single agent dashboard
   */
  private formatAgentDashboard(metrics: DashboardMetrics): string {
    const lines: string[] = [];

    // Header
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push(`  LEARNING METRICS DASHBOARD - ${metrics.agentId}`);
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');

    // Overview
    lines.push('OVERVIEW');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  Learning Progress:  ${this.formatProgressBadge(metrics.learningProgress)}`);
    lines.push(`  Total Investigations: ${metrics.totalInvestigations}`);
    lines.push(`  Success Rate:       ${this.formatPercentage(metrics.successRate)}`);
    lines.push(`  Avg Confidence:     ${this.formatPercentage(metrics.averageConfidence)}`);
    lines.push('');

    // Patterns
    lines.push('LEARNED PATTERNS');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  Total Patterns:     ${metrics.totalPatterns}`);
    lines.push(`  High Confidence:    ${metrics.highConfidencePatterns} (≥80%)`);
    lines.push('');

    if (metrics.topPatterns.length > 0) {
      lines.push('  Top Patterns:');
      metrics.topPatterns.forEach((pattern, index) => {
        lines.push(`    ${index + 1}. ${pattern.description}`);
        lines.push(`       Confidence: ${this.formatPercentage(pattern.confidence)} | ` +
                    `Accuracy: ${this.formatPercentage(pattern.accuracy)} | ` +
                    `Used: ${pattern.usageCount}x`);
      });
      lines.push('');
    }

    // Strategies
    lines.push('STRATEGIES');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  Total Strategies:   ${metrics.totalStrategies}`);
    lines.push('');

    if (metrics.topStrategies.length > 0) {
      lines.push('  Top Performing Strategies:');
      metrics.topStrategies.forEach((strategy, index) => {
        lines.push(`    ${index + 1}. ${strategy.strategyName}`);
        lines.push(`       Success: ${this.formatPercentage(strategy.successRate)} | ` +
                    `Confidence: ${this.formatPercentage(strategy.confidence)} | ` +
                    `Used: ${strategy.usageCount}x`);
      });
      lines.push('');
    }

    // Recommendations
    if (metrics.recommendations.length > 0) {
      lines.push('RECOMMENDATIONS');
      lines.push('───────────────────────────────────────────────────────────────');
      metrics.recommendations.forEach(rec => {
        lines.push(`  • ${rec}`);
      });
      lines.push('');
    }

    lines.push('═══════════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  /**
   * Format all agents dashboard
   */
  private formatAllAgentsDashboard(allMetrics: Map<AgentType, DashboardMetrics>): string {
    const lines: string[] = [];

    // Header
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('  TRINITY LEARNING SYSTEM - ALL AGENTS');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');

    // Summary table
    lines.push('AGENT SUMMARY');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('Agent | Investigations | Success Rate | Patterns | Confidence');
    lines.push('───────────────────────────────────────────────────────────────');

    const agents: AgentType[] = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];
    for (const agentId of agents) {
      const metrics = allMetrics.get(agentId);
      if (metrics) {
        const agent = agentId.padEnd(5);
        const invs = metrics.totalInvestigations.toString().padEnd(14);
        const success = this.formatPercentage(metrics.successRate).padEnd(12);
        const patterns = metrics.totalPatterns.toString().padEnd(8);
        const conf = this.formatPercentage(metrics.averageConfidence);
        lines.push(`${agent} | ${invs} | ${success} | ${patterns} | ${conf}`);
      } else {
        lines.push(`${agentId.padEnd(5)} | No learning data yet`);
      }
    }

    lines.push('');

    // Overall statistics
    let totalInvestigations = 0;
    let totalPatterns = 0;
    let totalStrategies = 0;
    let totalSuccess = 0;

    for (const metrics of allMetrics.values()) {
      totalInvestigations += metrics.totalInvestigations;
      totalPatterns += metrics.totalPatterns;
      totalStrategies += metrics.totalStrategies;
      totalSuccess += metrics.successfulInvestigations;
    }

    const overallSuccessRate = totalInvestigations > 0 ? totalSuccess / totalInvestigations : 0;

    lines.push('OVERALL STATISTICS');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  Total Investigations:  ${totalInvestigations}`);
    lines.push(`  Overall Success Rate:  ${this.formatPercentage(overallSuccessRate)}`);
    lines.push(`  Total Patterns Learned: ${totalPatterns}`);
    lines.push(`  Total Strategies:      ${totalStrategies}`);
    lines.push('');

    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');
    lines.push('Run "/trinity-learning-status <agent>" for detailed metrics');

    return lines.join('\n');
  }

  /**
   * Calculate average confidence across patterns and strategies
   */
  private calculateAverageConfidence(
    patterns: LearnedPattern[],
    strategies: StrategyPerformance[]
  ): number {
    const allConfidences = [
      ...patterns.map(p => p.confidence),
      ...strategies.map(s => s.confidence),
    ];

    if (allConfidences.length === 0) return 0;

    const sum = allConfidences.reduce((acc, conf) => acc + conf, 0);
    return sum / allConfidences.length;
  }

  /**
   * Get top N strategies by weighted score
   */
  private getTopStrategies(strategies: StrategyPerformance[], limit: number): StrategyPerformance[] {
    return strategies
      .map(strategy => ({
        strategy,
        score: (strategy.successRate * 0.6) + (strategy.confidence * 0.4),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.strategy);
  }

  /**
   * Get top N patterns by confidence and usage
   */
  private getTopPatterns(patterns: LearnedPattern[], limit: number): LearnedPattern[] {
    return patterns
      .map(pattern => ({
        pattern,
        score: (pattern.confidence * 0.7) + (Math.min(pattern.usageCount / 100, 1) * 0.3),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.pattern);
  }

  /**
   * Determine learning progress level
   */
  private determineLearningProgress(learningData: LearningData): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const totalInvestigations = learningData.totalInvestigations;
    const totalPatterns = learningData.patterns instanceof Map ? learningData.patterns.size : learningData.patterns.length;
    const totalStrategies = learningData.strategies instanceof Map ? learningData.strategies.size : learningData.strategies.length;

    const score = totalInvestigations + (totalPatterns * 2) + (totalStrategies * 3);

    if (score < 20) return 'beginner';
    if (score < 100) return 'intermediate';
    if (score < 300) return 'advanced';
    return 'expert';
  }

  /**
   * Generate recommendations based on metrics
   */
  private generateRecommendations(
    learningData: LearningData,
    successRate: number,
    averageConfidence: number
  ): string[] {
    const recommendations: string[] = [];

    // Low investigation count
    if (learningData.totalInvestigations < 10) {
      recommendations.push('Run more investigations to build learning foundation (target: 10+)');
    }

    // Low success rate
    if (successRate < 0.7 && learningData.totalInvestigations >= 5) {
      recommendations.push('Success rate below 70% - review investigation strategies');
    }

    // Low average confidence
    const patternsCount = learningData.patterns instanceof Map ? learningData.patterns.size : learningData.patterns.length;
    const strategiesCount = learningData.strategies instanceof Map ? learningData.strategies.size : learningData.strategies.length;

    if (averageConfidence < 0.6 && patternsCount > 0) {
      recommendations.push('Low average confidence - more investigations needed to validate patterns');
    }

    // Few patterns
    if (patternsCount < 5 && learningData.totalInvestigations >= 10) {
      recommendations.push('Few patterns learned - ensure investigations extract meaningful patterns');
    }

    // Few strategies
    if (strategiesCount < 3 && learningData.totalInvestigations >= 20) {
      recommendations.push('Limited strategies - diversify investigation types to learn new approaches');
    }

    // High success rate
    if (successRate >= 0.9 && learningData.totalInvestigations >= 20) {
      recommendations.push('Excellent success rate! Consider tackling more complex investigations');
    }

    // High confidence
    if (averageConfidence >= 0.8 && patternsCount >= 10) {
      recommendations.push('Strong pattern confidence - share knowledge with other agents');
    }

    // No recommendations
    if (recommendations.length === 0) {
      recommendations.push('Learning system performing well - continue current approach');
    }

    return recommendations;
  }

  /**
   * Format percentage for display
   */
  private formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  /**
   * Format progress badge with color/symbol
   */
  private formatProgressBadge(progress: string): string {
    const badges: Record<string, string> = {
      'beginner': '⭐ Beginner',
      'intermediate': '⭐⭐ Intermediate',
      'advanced': '⭐⭐⭐ Advanced',
      'expert': '⭐⭐⭐⭐ Expert',
    };

    return badges[progress] || progress;
  }

  /**
   * Export metrics to JSON
   */
  async exportMetrics(agentId: AgentType, outputPath: string): Promise<void> {
    const metrics = await this.getMetrics(agentId);
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(metrics, null, 2), 'utf8');
  }

  /**
   * Export all agents metrics to JSON
   */
  async exportAllMetrics(outputPath: string): Promise<void> {
    const allMetrics = await this.getAllAgentsMetrics();
    const metricsObject = Object.fromEntries(allMetrics);
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(metricsObject, null, 2), 'utf8');
  }

  /**
   * Get learning trends over time (for visualization)
   */
  async getLearningTrends(agentId: AgentType): Promise<{
    investigationTrend: Array<{ date: Date; count: number }>;
    confidenceTrend: Array<{ date: Date; avgConfidence: number }>;
    successRateTrend: Array<{ date: Date; successRate: number }>;
  }> {
    const learningData = await this.dataStore.loadLearningData(agentId);

    // Group patterns by date
    const patternsByDate = new Map<string, LearnedPattern[]>();
    for (const pattern of learningData.patterns.values()) {
      const dateKey = pattern.lastSeen.toISOString().split('T')[0];
      if (!patternsByDate.has(dateKey)) {
        patternsByDate.set(dateKey, []);
      }
      patternsByDate.get(dateKey).push(pattern);
    }

    // Calculate trends
    const investigationTrend: Array<{ date: Date; count: number }> = [];
    const confidenceTrend: Array<{ date: Date; avgConfidence: number }> = [];
    const successRateTrend: Array<{ date: Date; successRate: number }> = [];

    for (const [dateKey, patterns] of patternsByDate) {
      const date = new Date(dateKey);
      investigationTrend.push({ date, count: patterns.length });

      const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
      confidenceTrend.push({ date, avgConfidence });

      const successCount = patterns.reduce((sum, p) => sum + p.successCount, 0);
      const totalCount = patterns.reduce((sum, p) => sum + p.usageCount, 0);
      const successRate = totalCount > 0 ? successCount / totalCount : 0;
      successRateTrend.push({ date, successRate });
    }

    return {
      investigationTrend,
      confidenceTrend,
      successRateTrend,
    };
  }
}
