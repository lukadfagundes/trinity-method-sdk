/**
 * Analytics Engine Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { AnalyticsEngine } from '../../../src/analytics/AnalyticsEngine';
import { MetricsCollector } from '../../../src/analytics/MetricsCollector';

describe.skip('AnalyticsEngine', () => {
  let engine: AnalyticsEngine;
  let metricsCollector: MetricsCollector;

  beforeEach(() => {
    metricsCollector = new MetricsCollector('./test-metrics');
    engine = new AnalyticsEngine(metricsCollector);
  });

  describe('System Metrics', () => {
    it('should get system-wide metrics', async () => {
      // Add some test data
      await metricsCollector.startInvestigation('inv-1', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, { input: 5000, output: 0 });
      await metricsCollector.endInvestigation('inv-1');

      const metrics = await engine.getSystemMetrics();

      expect(metrics.totalInvestigations).toBeGreaterThan(0);
      expect(metrics.totalTasks).toBeGreaterThan(0);
      expect(metrics.totalTokensUsed).toBeGreaterThan(0);
      expect(metrics.averageInvestigationDuration).toBeDefined();
    });

    it('should filter metrics by time range', async () => {
      const startDate = new Date();
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.endInvestigation('inv-1');

      const metrics = await engine.getSystemMetrics({
        startDate,
        endDate: new Date(),
      });

      expect(metrics.totalInvestigations).toBeGreaterThan(0);
    });

    it('should filter metrics by investigation type', async () => {
      await metricsCollector.startInvestigation('inv-1', 'security-audit');
      await metricsCollector.endInvestigation('inv-1');

      await metricsCollector.startInvestigation('inv-2', 'performance-review');
      await metricsCollector.endInvestigation('inv-2');

      const metrics = await engine.getSystemMetrics({
        investigationType: 'security-audit',
      });

      expect(metrics.totalInvestigations).toBe(1);
    });
  });

  describe('Metric Aggregation', () => {
    it('should calculate sum aggregation', async () => {
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, { input: 5000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 150, { input: 7000, output: 0 });

      const totalDuration = await engine.getMetricValue('task_duration', 'sum', {
        investigationId: 'inv-1',
      });

      expect(totalDuration).toBe(250);
    });

    it('should calculate average aggregation', async () => {
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, { input: 5000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 200, { input: 7000, output: 0 });

      const avgDuration = await engine.getMetricValue('task_duration', 'avg', {
        investigationId: 'inv-1',
      });

      expect(avgDuration).toBe(150);
    });

    it('should calculate min and max aggregations', async () => {
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, { input: 5000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 200, { input: 7000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-3', 'JUNO', 150, { input: 6000, output: 0 });

      const minDuration = await engine.getMetricValue('task_duration', 'min', {
        investigationId: 'inv-1',
      });
      const maxDuration = await engine.getMetricValue('task_duration', 'max', {
        investigationId: 'inv-1',
      });

      expect(minDuration).toBe(100);
      expect(maxDuration).toBe(200);
    });

    it('should calculate percentile aggregations', async () => {
      // Add 100 tasks with varying durations
      for (let i = 0; i < 100; i++) {
        await metricsCollector.recordTaskComplete('inv-1', `task-${i}`, 'TAN', i + 1);
      }

      const p50 = await engine.getMetricValue('task_duration', 'p50', {
        investigationId: 'inv-1',
      });
      const p95 = await engine.getMetricValue('task_duration', 'p95', {
        investigationId: 'inv-1',
      });
      const p99 = await engine.getMetricValue('task_duration', 'p99', {
        investigationId: 'inv-1',
      });

      expect(p50).toBeGreaterThan(0);
      expect(p95).toBeGreaterThan(p50);
      expect(p99).toBeGreaterThan(p95);
    });
  });

  describe('Performance Trends', () => {
    it('should identify performance trends over time', async () => {
      // Simulate investigations over 30 days
      const baseDate = new Date('2025-01-01');

      for (let day = 0; day < 30; day++) {
        const invDate = new Date(baseDate);
        invDate.setDate(baseDate.getDate() + day);

        await metricsCollector.startInvestigation(`inv-${day}`);
        await metricsCollector.recordTaskComplete(`inv-${day}`, 'task-1', 'TAN', 100 + day * 2);
        await metricsCollector.endInvestigation(`inv-${day}`);
      }

      const trends = await engine.getPerformanceTrends(30);

      expect(trends).toBeDefined();
      expect(trends.length).toBeGreaterThan(0);
    });

    it('should calculate trend direction', async () => {
      const baseDate = new Date('2025-01-01');

      // Improving trend (decreasing task duration)
      for (let day = 0; day < 10; day++) {
        await metricsCollector.startInvestigation(`inv-${day}`);
        await metricsCollector.recordTaskComplete(`inv-${day}`, 'task-1', 'TAN', 200 - day * 10);
        await metricsCollector.endInvestigation(`inv-${day}`);
      }

      const trends = await engine.getPerformanceTrends(10);
      const durationTrend = trends.find(t => t.metric === 'task_duration');

      expect(durationTrend).toBeDefined();
      expect(durationTrend?.direction).toBe('improving');
    });

    it('should detect stable trends', async () => {
      // Stable trend (consistent task duration)
      for (let day = 0; day < 10; day++) {
        await metricsCollector.startInvestigation(`inv-${day}`);
        await metricsCollector.recordTaskComplete(`inv-${day}`, 'task-1', 'TAN', 150);
        await metricsCollector.endInvestigation(`inv-${day}`);
      }

      const trends = await engine.getPerformanceTrends(10);
      const durationTrend = trends.find(t => t.metric === 'task_duration');

      expect(durationTrend?.direction).toBe('stable');
    });
  });

  describe('Agent Performance', () => {
    it('should analyze agent performance', async () => {
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, { input: 5000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-2', 'TAN', 120, { input: 6000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-3', 'ZEN', 90, { input: 4000, output: 0 });

      const agentPerf = await engine.getAgentPerformance();

      expect(agentPerf['TAN']).toBeDefined();
      expect(agentPerf['TAN'].taskCount).toBe(2);
      expect(agentPerf['TAN'].averageDuration).toBeCloseTo(110, 1);
      expect(agentPerf['TAN'].totalTokens).toBe(11000);

      expect(agentPerf['ZEN']).toBeDefined();
      expect(agentPerf['ZEN'].taskCount).toBe(1);
    });

    it('should calculate agent efficiency score', async () => {
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, { input: 5000, output: 0 });

      const agentPerf = await engine.getAgentPerformance();
      expect(agentPerf['TAN'].efficiencyScore).toBeDefined();
      expect(agentPerf['TAN'].efficiencyScore).toBeGreaterThan(0);
    });

    it('should rank agents by performance', async () => {
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 80, { input: 4000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 120, { input: 6000, output: 0 });
      await metricsCollector.recordTaskComplete('inv-1', 'task-3', 'JUNO', 100, { input: 5000, output: 0 });

      const rankings = await engine.getAgentRankings();

      expect(rankings.length).toBe(3);
      expect(rankings[0].rank).toBe(1);
      expect(rankings[1].rank).toBe(2);
      expect(rankings[2].rank).toBe(3);
    });
  });

  describe('Cache Performance', () => {
    it('should analyze cache performance', async () => {
      await metricsCollector.recordCacheHit('inv-1', 'key-1');
      await metricsCollector.recordCacheHit('inv-1', 'key-2');
      await metricsCollector.recordCacheMiss('inv-1', 'key-3');

      const cachePerf = await engine.getCachePerformance('inv-1');

      expect(cachePerf.hitRate).toBeCloseTo(0.67, 2);
      expect(cachePerf.totalHits).toBe(2);
      expect(cachePerf.totalMisses).toBe(1);
    });

    it('should analyze cache performance by layer', async () => {
      await metricsCollector.recordCacheHit('inv-1', 'key-1');
      await metricsCollector.recordCacheHit('inv-1', 'key-2-L2');
      await metricsCollector.recordCacheMiss('inv-1', 'key-3-L3');

      const cachePerf = await engine.getCachePerformance('inv-1');

      expect(cachePerf.byLayer).toBeDefined();
      expect(cachePerf.byLayer['L1']).toBeDefined();
      expect(cachePerf.byLayer['L2']).toBeDefined();
      expect(cachePerf.byLayer['L3']).toBeDefined();
    });
  });

  describe('Token Usage Analysis', () => {
    it('should analyze token usage patterns', async () => {
      await metricsCollector.recordTokenUsage('inv-1', 'TAN', 5000, 2000);
      await metricsCollector.recordTokenUsage('inv-1', 'ZEN', 3000, 1500);

      const tokenAnalysis = await engine.getTokenUsageAnalysis('inv-1');

      expect(tokenAnalysis.totalTokens).toBe(11500);
      expect(tokenAnalysis.totalInputTokens).toBe(8000);
      expect(tokenAnalysis.totalOutputTokens).toBe(3500);
    });

    it('should calculate token usage by agent', async () => {
      await metricsCollector.recordTokenUsage('inv-1', 'TAN', 5000, 2000);
      await metricsCollector.recordTokenUsage('inv-1', 'ZEN', 3000, 1500);

      const tokenAnalysis = await engine.getTokenUsageAnalysis('inv-1');

      expect(tokenAnalysis.byAgent).toBeDefined();
      expect(tokenAnalysis.byAgent['TAN']).toBe(7000);
      expect(tokenAnalysis.byAgent['ZEN']).toBe(4500);
    });

    it('should estimate cost from token usage', async () => {
      await metricsCollector.recordTokenUsage('inv-1', 'TAN', 100000, 50000);

      const tokenAnalysis = await engine.getTokenUsageAnalysis('inv-1');

      expect(tokenAnalysis.estimatedCost).toBeDefined();
      expect(tokenAnalysis.estimatedCost).toBeGreaterThan(0);
    });
  });

  describe('Quality Metrics', () => {
    it('should calculate investigation quality score', async () => {
      await metricsCollector.startInvestigation('inv-1', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, { input: 5000, output: 0 });
      await metricsCollector.endInvestigation('inv-1');

      const quality = await engine.getQualityMetrics('inv-1');

      expect(quality.qualityScore).toBeDefined();
      expect(quality.qualityScore).toBeGreaterThanOrEqual(0);
      expect(quality.qualityScore).toBeLessThanOrEqual(1);
    });

    it('should identify quality factors', async () => {
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, { input: 5000, output: 0 });
      await metricsCollector.endInvestigation('inv-1');

      const quality = await engine.getQualityMetrics('inv-1');

      expect(quality.factors).toBeDefined();
      expect(quality.factors.length).toBeGreaterThan(0);
    });
  });

  describe('Investigation Comparison', () => {
    it('should compare multiple investigations', async () => {
      await metricsCollector.startInvestigation('inv-1', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, { input: 5000, output: 0 });
      await metricsCollector.endInvestigation('inv-1');

      await metricsCollector.startInvestigation('inv-2', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-2', 'task-1', 'TAN', 120, { input: 6000, output: 0 });
      await metricsCollector.endInvestigation('inv-2');

      const comparison = await engine.compareInvestigations(['inv-1', 'inv-2']);

      expect(comparison.investigations).toHaveLength(2);
      expect(comparison.summary).toBeDefined();
    });

    it('should identify best performing investigation', async () => {
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, { input: 5000, output: 0 });
      await metricsCollector.endInvestigation('inv-1');

      await metricsCollector.startInvestigation('inv-2');
      await metricsCollector.recordTaskComplete('inv-2', 'task-1', 'TAN', 150, { input: 7000, output: 0 });
      await metricsCollector.endInvestigation('inv-2');

      const comparison = await engine.compareInvestigations(['inv-1', 'inv-2']);

      expect(comparison.bestPerforming).toBeDefined();
    });
  });

  describe('Reporting', () => {
    it('should generate analytics report', async () => {
      await metricsCollector.startInvestigation('inv-1', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, { input: 5000, output: 0 });
      await metricsCollector.endInvestigation('inv-1');

      const report = await engine.generateReport('inv-1');

      expect(report).toBeDefined();
      expect(report).toContain('Investigation Report');
      expect(report).toContain('inv-1');
    });

    it('should generate system-wide report', async () => {
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.endInvestigation('inv-1');

      const report = await engine.generateSystemReport();

      expect(report).toBeDefined();
      expect(report).toContain('System Analytics Report');
    });

    it('should export report as JSON', async () => {
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.endInvestigation('inv-1');

      const report = await engine.generateReport('inv-1', 'json');

      expect(() => JSON.parse(report)).not.toThrow();
    });
  });

  describe('Real-time Analytics', () => {
    it('should provide real-time metrics', async () => {
      await metricsCollector.startInvestigation('inv-1');

      const startTime = Date.now();
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, { input: 5000, output: 0 });

      const metrics = await engine.getSystemMetrics();
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(1000); // <1s latency
      expect(metrics).toBeDefined();
    });

    it('should update metrics in real-time', async () => {
      await metricsCollector.startInvestigation('inv-1');

      let metrics = await engine.getSystemMetrics();
      const initialTaskCount = metrics.totalTasks;

      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, { input: 5000, output: 0 });

      metrics = await engine.getSystemMetrics();
      expect(metrics.totalTasks).toBe(initialTaskCount + 1);
    });
  });

  describe('Custom Metrics', () => {
    it('should register custom metrics', async () => {
      engine.registerCustomMetric('custom_score', (events) => {
        return events.length * 10;
      });

      await metricsCollector.recordEvent({
        investigationId: 'inv-1',
        type: 'custom-event',
        agentId: 'TAN',
        data: {},
      });

      const customValue = await engine.getMetricValue('custom_score', 'custom', {
        investigationId: 'inv-1',
      });

      expect(customValue).toBe(10);
    });

    it('should handle multiple custom metrics', async () => {
      engine.registerCustomMetric('metric1', () => 100);
      engine.registerCustomMetric('metric2', () => 200);

      const value1 = await engine.getMetricValue('metric1', 'custom');
      const value2 = await engine.getMetricValue('metric2', 'custom');

      expect(value1).toBe(100);
      expect(value2).toBe(200);
    });
  });

  describe('Data Export', () => {
    it('should export analytics data as CSV', async () => {
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, { input: 5000, output: 0 });
      await metricsCollector.endInvestigation('inv-1');

      const csv = await engine.exportData('csv');

      expect(csv).toContain(',');
      expect(csv).toBeDefined();
    });

    it('should export analytics data as JSON', async () => {
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.endInvestigation('inv-1');

      const json = await engine.exportData('json');

      expect(() => JSON.parse(json)).not.toThrow();
    });
  });
});
