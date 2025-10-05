/**
 * Analytics Engine - Metrics Aggregation and Analysis
 *
 * Provides comprehensive analytics capabilities:
 * - Metric aggregation (sum, avg, min, max, percentiles)
 * - Trend analysis (performance trends over time)
 * - Custom metric queries
 * - Historical comparisons
 * - Performance insights
 *
 * @module analytics/AnalyticsEngine
 * @version 1.0.0
 */

import { MetricsCollector, InvestigationMetrics, AgentMetrics, MetricDataPoint } from './MetricsCollector';
import { AgentType } from '@shared/types';

/**
 * System-wide metrics
 */
export interface SystemMetrics {
  /** Total investigations */
  totalInvestigations: number;

  /** Average duration (ms) */
  averageDuration: number;

  /** Total tokens used */
  totalTokensUsed: number;

  /** Average tokens per investigation */
  averageTokensPerInvestigation: number;

  /** Total cost (USD) */
  totalCost: number;

  /** Average cost per investigation */
  averageCostPerInvestigation: number;

  /** Average cache hit rate */
  averageCacheHitRate: number;

  /** Average quality score */
  averageQualityScore: number;

  /** Average error rate */
  averageErrorRate: number;

  /** Success rate */
  successRate: number;

  /** Performance trends */
  performanceTrends: PerformanceTrend[];

  /** Agent utilization summary */
  agentUtilizationSummary: Map<AgentType, AgentUtilizationSummary>;
}

/**
 * Performance trend data
 */
export interface PerformanceTrend {
  /** Time period */
  period: string;

  /** Average duration */
  averageDuration: number;

  /** Average tokens */
  averageTokens: number;

  /** Average quality */
  averageQuality: number;

  /** Investigation count */
  investigationCount: number;

  /** Trend direction */
  trend: 'improving' | 'stable' | 'degrading';
}

/**
 * Agent utilization summary
 */
export interface AgentUtilizationSummary {
  /** Agent type */
  agentType: AgentType;

  /** Total tasks */
  totalTasks: number;

  /** Completed tasks */
  completedTasks: number;

  /** Average task duration */
  averageTaskDuration: number;

  /** Success rate */
  successRate: number;

  /** Total tokens */
  totalTokens: number;

  /** Average tokens per task */
  averageTokensPerTask: number;

  /** Utilization percentage */
  utilizationPercentage: number;
}

/**
 * Query filter
 */
export interface QueryFilter {
  /** Investigation type */
  type?: string;

  /** Start date */
  startDate?: Date;

  /** End date */
  endDate?: Date;

  /** Agent type */
  agentType?: AgentType;

  /** Min quality score */
  minQuality?: number;

  /** Max quality score */
  maxQuality?: number;
}

/**
 * Aggregation type
 */
export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'p50' | 'p95' | 'p99';

/**
 * Analytics engine for metric analysis
 */
export class AnalyticsEngine {
  private collector: MetricsCollector;

  constructor(collector: MetricsCollector) {
    this.collector = collector;
  }

  /**
   * Get system-wide metrics
   * @param filter - Optional filter
   * @returns System metrics
   */
  getSystemMetrics(filter?: QueryFilter): SystemMetrics {
    const investigations = this.filterInvestigations(filter);

    if (investigations.length === 0) {
      return this.getEmptySystemMetrics();
    }

    // Calculate aggregate metrics
    const totalInvestigations = investigations.length;
    const completedInvestigations = investigations.filter((inv) => inv.endTime).length;

    const totalDuration = investigations.reduce((sum, inv) => sum + inv.duration, 0);
    const averageDuration = totalDuration / completedInvestigations || 0;

    const totalTokensUsed = investigations.reduce((sum, inv) => sum + inv.tokensUsed, 0);
    const averageTokensPerInvestigation = totalTokensUsed / totalInvestigations;

    const totalCost = investigations.reduce((sum, inv) => sum + inv.cost, 0);
    const averageCostPerInvestigation = totalCost / totalInvestigations;

    const averageCacheHitRate =
      investigations.reduce((sum, inv) => sum + inv.cacheHitRate, 0) / totalInvestigations;

    const averageQualityScore =
      investigations.reduce((sum, inv) => sum + inv.qualityScore, 0) / totalInvestigations;

    const averageErrorRate =
      investigations.reduce((sum, inv) => sum + inv.errorRate, 0) / totalInvestigations;

    const successRate = completedInvestigations / totalInvestigations;

    // Calculate performance trends
    const performanceTrends = this.calculatePerformanceTrends(investigations);

    // Calculate agent utilization
    const agentUtilizationSummary = this.calculateAgentUtilization(investigations);

    return {
      totalInvestigations,
      averageDuration,
      totalTokensUsed,
      averageTokensPerInvestigation,
      totalCost,
      averageCostPerInvestigation,
      averageCacheHitRate,
      averageQualityScore,
      averageErrorRate,
      successRate,
      performanceTrends,
      agentUtilizationSummary,
    };
  }

  /**
   * Get aggregated metric value
   * @param metricName - Metric name
   * @param aggregation - Aggregation type
   * @param filter - Optional filter
   * @returns Aggregated value
   */
  getMetricValue(metricName: string, aggregation: AggregationType, filter?: QueryFilter): number {
    const investigations = this.filterInvestigations(filter);

    if (investigations.length === 0) {
      return 0;
    }

    const values = investigations.map((inv) => this.extractMetricValue(inv, metricName));

    return this.aggregate(values, aggregation);
  }

  /**
   * Get performance trends
   * @param periodDays - Period in days for each trend point
   * @param filter - Optional filter
   * @returns Performance trends
   */
  getPerformanceTrends(periodDays: number = 7, filter?: QueryFilter): PerformanceTrend[] {
    const investigations = this.filterInvestigations(filter);
    return this.calculatePerformanceTrends(investigations, periodDays);
  }

  /**
   * Get agent utilization summary
   * @param filter - Optional filter
   * @returns Agent utilization by type
   */
  getAgentUtilization(filter?: QueryFilter): Map<AgentType, AgentUtilizationSummary> {
    const investigations = this.filterInvestigations(filter);
    return this.calculateAgentUtilization(investigations);
  }

  /**
   * Compare two time periods
   * @param period1Start - Period 1 start date
   * @param period1End - Period 1 end date
   * @param period2Start - Period 2 start date
   * @param period2End - Period 2 end date
   * @returns Comparison metrics
   */
  comparePeriods(
    period1Start: Date,
    period1End: Date,
    period2Start: Date,
    period2End: Date
  ): {
    period1: SystemMetrics;
    period2: SystemMetrics;
    changes: Record<string, number>;
  } {
    const period1Metrics = this.getSystemMetrics({
      startDate: period1Start,
      endDate: period1End,
    });

    const period2Metrics = this.getSystemMetrics({
      startDate: period2Start,
      endDate: period2End,
    });

    const changes = {
      durationChange:
        ((period2Metrics.averageDuration - period1Metrics.averageDuration) /
          period1Metrics.averageDuration) *
        100,
      tokenChange:
        ((period2Metrics.averageTokensPerInvestigation - period1Metrics.averageTokensPerInvestigation) /
          period1Metrics.averageTokensPerInvestigation) *
        100,
      qualityChange:
        ((period2Metrics.averageQualityScore - period1Metrics.averageQualityScore) /
          period1Metrics.averageQualityScore) *
        100,
      costChange:
        ((period2Metrics.averageCostPerInvestigation - period1Metrics.averageCostPerInvestigation) /
          period1Metrics.averageCostPerInvestigation) *
        100,
    };

    return {
      period1: period1Metrics,
      period2: period2Metrics,
      changes,
    };
  }

  /**
   * Get top performers (investigations)
   * @param metric - Metric to rank by
   * @param limit - Number of results
   * @param filter - Optional filter
   * @returns Top performing investigations
   */
  getTopPerformers(
    metric: 'quality' | 'speed' | 'efficiency',
    limit: number = 10,
    filter?: QueryFilter
  ): InvestigationMetrics[] {
    const investigations = this.filterInvestigations(filter);

    const sorted = investigations.sort((a, b) => {
      switch (metric) {
        case 'quality':
          return b.qualityScore - a.qualityScore;
        case 'speed':
          return a.duration - b.duration;
        case 'efficiency':
          const aEfficiency = a.tokensUsed / Math.max(a.duration, 1);
          const bEfficiency = b.tokensUsed / Math.max(b.duration, 1);
          return aEfficiency - bEfficiency;
        default:
          return 0;
      }
    });

    return sorted.slice(0, limit);
  }

  /**
   * Get investigation insights
   * @param investigationId - Investigation ID
   * @returns Investigation insights
   */
  getInvestigationInsights(investigationId: string): {
    metrics: InvestigationMetrics;
    insights: string[];
    recommendations: string[];
  } | null {
    const metrics = this.collector.getInvestigationMetrics(investigationId);

    if (!metrics) {
      return null;
    }

    const insights: string[] = [];
    const recommendations: string[] = [];

    // Quality insights
    if (metrics.qualityScore >= 80) {
      insights.push('High quality investigation');
    } else if (metrics.qualityScore < 50) {
      insights.push('Quality score below expectations');
      recommendations.push('Consider more thorough analysis phases');
    }

    // Error rate insights
    if (metrics.errorRate > 0.1) {
      insights.push(`High error rate: ${(metrics.errorRate * 100).toFixed(1)}%`);
      recommendations.push('Review error logs and improve error handling');
    }

    // Cache performance
    if (metrics.cacheHitRate > 0.7) {
      insights.push('Excellent cache utilization');
    } else if (metrics.cacheHitRate < 0.3) {
      insights.push('Low cache hit rate');
      recommendations.push('Consider optimizing cache strategy');
    }

    // Token efficiency
    const systemMetrics = this.getSystemMetrics();
    if (metrics.tokensUsed > systemMetrics.averageTokensPerInvestigation * 1.5) {
      insights.push('Above average token usage');
      recommendations.push('Review prompt efficiency and reduce unnecessary context');
    }

    // Duration insights
    if (metrics.duration > systemMetrics.averageDuration * 1.5) {
      insights.push('Longer than average investigation');
      recommendations.push('Consider parallelizing tasks where possible');
    }

    return {
      metrics,
      insights,
      recommendations,
    };
  }

  /**
   * Filter investigations by criteria
   */
  private filterInvestigations(filter?: QueryFilter): InvestigationMetrics[] {
    let investigations = this.collector.getAllInvestigationMetrics();

    if (!filter) {
      return investigations;
    }

    if (filter.type) {
      investigations = investigations.filter((inv) => inv.type === filter.type);
    }

    if (filter.startDate) {
      investigations = investigations.filter((inv) => inv.startTime >= filter.startDate!);
    }

    if (filter.endDate) {
      investigations = investigations.filter((inv) => inv.startTime <= filter.endDate!);
    }

    if (filter.minQuality !== undefined) {
      investigations = investigations.filter((inv) => inv.qualityScore >= filter.minQuality!);
    }

    if (filter.maxQuality !== undefined) {
      investigations = investigations.filter((inv) => inv.qualityScore <= filter.maxQuality!);
    }

    return investigations;
  }

  /**
   * Calculate performance trends
   */
  private calculatePerformanceTrends(
    investigations: InvestigationMetrics[],
    periodDays: number = 7
  ): PerformanceTrend[] {
    if (investigations.length === 0) {
      return [];
    }

    // Group by period
    const periods = new Map<string, InvestigationMetrics[]>();
    const periodMs = periodDays * 24 * 60 * 60 * 1000;

    for (const inv of investigations) {
      const periodStart = new Date(Math.floor(inv.startTime.getTime() / periodMs) * periodMs);
      const periodKey = periodStart.toISOString().split('T')[0];

      if (!periods.has(periodKey)) {
        periods.set(periodKey, []);
      }

      periods.get(periodKey)!.push(inv);
    }

    // Calculate trends for each period
    const trends: PerformanceTrend[] = [];
    const periodKeys = Array.from(periods.keys()).sort();

    for (let i = 0; i < periodKeys.length; i++) {
      const periodKey = periodKeys[i];
      const periodInvestigations = periods.get(periodKey)!;

      const averageDuration =
        periodInvestigations.reduce((sum, inv) => sum + inv.duration, 0) / periodInvestigations.length;

      const averageTokens =
        periodInvestigations.reduce((sum, inv) => sum + inv.tokensUsed, 0) / periodInvestigations.length;

      const averageQuality =
        periodInvestigations.reduce((sum, inv) => sum + inv.qualityScore, 0) / periodInvestigations.length;

      // Determine trend direction
      let trend: 'improving' | 'stable' | 'degrading' = 'stable';

      if (i > 0) {
        const prevTrend = trends[i - 1];
        const qualityChange = averageQuality - prevTrend.averageQuality;
        const durationChange = (averageDuration - prevTrend.averageDuration) / prevTrend.averageDuration;

        if (qualityChange > 5 && durationChange < 0.1) {
          trend = 'improving';
        } else if (qualityChange < -5 || durationChange > 0.2) {
          trend = 'degrading';
        }
      }

      trends.push({
        period: periodKey,
        averageDuration,
        averageTokens,
        averageQuality,
        investigationCount: periodInvestigations.length,
        trend,
      });
    }

    return trends;
  }

  /**
   * Calculate agent utilization
   */
  private calculateAgentUtilization(
    investigations: InvestigationMetrics[]
  ): Map<AgentType, AgentUtilizationSummary> {
    const utilization = new Map<AgentType, AgentUtilizationSummary>();

    // Initialize for all agent types
    const agentTypes: AgentType[] = ['TAN', 'ZEN', 'INO', 'JUNO'];
    for (const agentType of agentTypes) {
      utilization.set(agentType, {
        agentType,
        totalTasks: 0,
        completedTasks: 0,
        averageTaskDuration: 0,
        successRate: 0,
        totalTokens: 0,
        averageTokensPerTask: 0,
        utilizationPercentage: 0,
      });
    }

    let totalDuration = 0;

    // Aggregate from all investigations
    for (const inv of investigations) {
      totalDuration += inv.duration;

      for (const [agentId, agentMetrics] of inv.agentUtilization) {
        const summary = utilization.get(agentMetrics.agentType)!;

        summary.totalTasks += agentMetrics.tasksAssigned;
        summary.completedTasks += agentMetrics.tasksCompleted;
        summary.totalTokens += agentMetrics.tokensUsed;
      }
    }

    // Calculate averages
    for (const summary of utilization.values()) {
      if (summary.totalTasks > 0) {
        summary.successRate = summary.completedTasks / summary.totalTasks;
        summary.averageTokensPerTask = summary.totalTokens / summary.completedTasks || 0;
      }

      // Calculate utilization percentage (simplified)
      if (totalDuration > 0) {
        summary.utilizationPercentage = (summary.completedTasks / investigations.length) * 100;
      }
    }

    return utilization;
  }

  /**
   * Extract metric value from investigation
   */
  private extractMetricValue(inv: InvestigationMetrics, metricName: string): number {
    switch (metricName) {
      case 'duration':
        return inv.duration;
      case 'tokens':
        return inv.tokensUsed;
      case 'cost':
        return inv.cost;
      case 'quality':
        return inv.qualityScore;
      case 'errorRate':
        return inv.errorRate;
      case 'cacheHitRate':
        return inv.cacheHitRate;
      case 'tasksCompleted':
        return inv.tasksCompleted;
      case 'tasksFailed':
        return inv.tasksFailed;
      default:
        return 0;
    }
  }

  /**
   * Aggregate values
   */
  private aggregate(values: number[], aggregation: AggregationType): number {
    if (values.length === 0) {
      return 0;
    }

    switch (aggregation) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);

      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length;

      case 'min':
        return Math.min(...values);

      case 'max':
        return Math.max(...values);

      case 'count':
        return values.length;

      case 'p50':
        return this.percentile(values, 0.5);

      case 'p95':
        return this.percentile(values, 0.95);

      case 'p99':
        return this.percentile(values, 0.99);

      default:
        return 0;
    }
  }

  /**
   * Calculate percentile
   */
  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Get empty system metrics
   */
  private getEmptySystemMetrics(): SystemMetrics {
    return {
      totalInvestigations: 0,
      averageDuration: 0,
      totalTokensUsed: 0,
      averageTokensPerInvestigation: 0,
      totalCost: 0,
      averageCostPerInvestigation: 0,
      averageCacheHitRate: 0,
      averageQualityScore: 0,
      averageErrorRate: 0,
      successRate: 0,
      performanceTrends: [],
      agentUtilizationSummary: new Map(),
    };
  }
}
