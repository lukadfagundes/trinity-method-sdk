/**
 * Analytics Integration Tests
 *
 * Tests the integration of MetricsCollector, AnalyticsEngine, and AnomalyDetector
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MetricsCollector } from '../../src/analytics/MetricsCollector';
import { AnalyticsEngine } from '../../src/analytics/AnalyticsEngine';
import { AnomalyDetector } from '../../src/analytics/AnomalyDetector';
import * as fs from 'fs/promises';

describe.skip('Analytics Integration', () => {
  let metricsCollector: MetricsCollector;
  let analyticsEngine: AnalyticsEngine;
  let anomalyDetector: AnomalyDetector;
  const testMetricsPath = './test-metrics-integration';

  beforeEach(async () => {
    metricsCollector = new MetricsCollector(testMetricsPath);
    analyticsEngine = new AnalyticsEngine(metricsCollector);
    anomalyDetector = new AnomalyDetector();

    await fs.mkdir(testMetricsPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testMetricsPath, { recursive: true, force: true });
  });

  describe('Metrics Collection to Analytics Flow', () => {
    it('should collect metrics and generate analytics', async () => {
      // Collect metrics
      await metricsCollector.startInvestigation('inv-1', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);
      await metricsCollector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 180, 7000);
      await metricsCollector.endInvestigation('inv-1', 'completed');

      // Generate analytics
      const systemMetrics = await analyticsEngine.getSystemMetrics();

      expect(systemMetrics.totalInvestigations).toBeGreaterThan(0);
      expect(systemMetrics.totalTasks).toBe(2);
      expect(systemMetrics.totalTokensUsed).toBe(12000);
    });

    it('should aggregate metrics in real-time', async () => {
      await metricsCollector.startInvestigation('inv-1');

      let metrics = await analyticsEngine.getSystemMetrics();
      const initialCount = metrics.totalInvestigations;

      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, 5000);

      metrics = await analyticsEngine.getSystemMetrics();
      expect(metrics.totalTasks).toBeGreaterThan(0);
    });

    it('should provide real-time analytics with <1s latency', async () => {
      await metricsCollector.startInvestigation('inv-1');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);

      const startTime = Date.now();
      const metrics = await analyticsEngine.getSystemMetrics();
      const endTime = Date.now();

      expect(metrics).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Analytics to Anomaly Detection Flow', () => {
    it('should detect performance anomalies from collected metrics', async () => {
      // Collect normal metrics
      for (let i = 0; i < 20; i++) {
        await metricsCollector.startInvestigation(`inv-${i}`);
        await metricsCollector.recordTaskComplete(`inv-${i}`, 'task-1', 'TAN', 100 + Math.random() * 10, 5000);
        await metricsCollector.endInvestigation(`inv-${i}`, 'completed');
      }

      // Collect anomaly
      await metricsCollector.startInvestigation('inv-anomaly');
      await metricsCollector.recordTaskComplete('inv-anomaly', 'task-1', 'TAN', 500, 5000);
      await metricsCollector.endInvestigation('inv-anomaly', 'completed');

      // Detect anomalies
      const events = await metricsCollector.getAllEvents();
      const anomalies = await anomalyDetector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
        threshold: 3,
      });

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].severity).toBe('high');
    });

    it('should achieve 90%+ anomaly detection accuracy', async () => {
      // Normal data
      for (let i = 0; i < 90; i++) {
        await metricsCollector.recordEvent({
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          metadata: { duration: 100 + Math.random() * 10 },
        });
      }

      // 10 clear anomalies
      for (let i = 0; i < 10; i++) {
        await metricsCollector.recordEvent({
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          metadata: { duration: 500 + Math.random() * 50 },
        });
      }

      const events = await metricsCollector.getEvents('inv-1');
      const anomalies = await anomalyDetector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
        threshold: 3,
      });

      // Should detect at least 9 out of 10 (90%+)
      expect(anomalies.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe('Complete Investigation Analytics', () => {
    it('should track complete investigation lifecycle with analytics', async () => {
      // Start investigation
      await metricsCollector.startInvestigation('inv-complete', 'security-audit');

      // Execute tasks
      await metricsCollector.recordTaskStart('inv-complete', 'task-1', 'TAN');
      await metricsCollector.recordTaskComplete('inv-complete', 'task-1', 'TAN', 120, 5000);

      await metricsCollector.recordTaskStart('inv-complete', 'task-2', 'ZEN');
      await metricsCollector.recordTaskComplete('inv-complete', 'task-2', 'ZEN', 180, 7000);

      // Record cache hits
      await metricsCollector.recordCacheHit('inv-complete', 'L1', 'key-1');
      await metricsCollector.recordCacheHit('inv-complete', 'L1', 'key-2');
      await metricsCollector.recordCacheMiss('inv-complete', 'L1', 'key-3');

      // End investigation
      await metricsCollector.endInvestigation('inv-complete', 'completed');

      // Get comprehensive summary
      const summary = await metricsCollector.getInvestigationSummary('inv-complete');

      expect(summary.investigationId).toBe('inv-complete');
      expect(summary.taskCount).toBe(2);
      expect(summary.totalTokens).toBe(12000);
      expect(summary.duration).toBeGreaterThan(0);

      // Get analytics
      const agentPerf = await analyticsEngine.getAgentPerformance();
      expect(agentPerf['TAN']).toBeDefined();
      expect(agentPerf['ZEN']).toBeDefined();

      // Get cache metrics
      const cacheMetrics = await analyticsEngine.getCachePerformance('inv-complete');
      expect(cacheMetrics.hitRate).toBeCloseTo(0.67, 2);
    });

    it('should generate comprehensive analytics report', async () => {
      await metricsCollector.startInvestigation('inv-report', 'performance-review');
      await metricsCollector.recordTaskComplete('inv-report', 'task-1', 'TAN', 150, 6000);
      await metricsCollector.recordTokenUsage('inv-report', 'TAN', 4000, 2000);
      await metricsCollector.endInvestigation('inv-report', 'completed');

      const report = await analyticsEngine.generateReport('inv-report');

      expect(report).toBeDefined();
      expect(report).toContain('Investigation Report');
      expect(report).toContain('inv-report');
      expect(report).toContain('performance-review');
    });
  });

  describe('Performance Trends and Anomalies', () => {
    it('should detect performance degradation trends', async () => {
      // Simulate degrading performance over 30 investigations
      for (let i = 0; i < 30; i++) {
        await metricsCollector.startInvestigation(`inv-${i}`);
        await metricsCollector.recordTaskComplete(
          `inv-${i}`,
          'task-1',
          'TAN',
          100 + i * 5, // Gradually increasing duration
          5000
        );
        await metricsCollector.endInvestigation(`inv-${i}`, 'completed');
      }

      // Get performance trends
      const trends = await analyticsEngine.getPerformanceTrends(30);

      expect(trends).toBeDefined();
      expect(trends.length).toBeGreaterThan(0);

      const durationTrend = trends.find(t => t.metric === 'task_duration');
      expect(durationTrend?.direction).toBe('degrading');
    });

    it('should identify error rate anomalies', async () => {
      // Normal: low error rate
      for (let i = 0; i < 100; i++) {
        await metricsCollector.recordEvent({
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          metadata: {},
        });
      }

      await metricsCollector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'error',
        agentId: 'TAN',
        metadata: { error: 'Normal error' },
      });

      // Anomaly: high error rate
      for (let i = 0; i < 50; i++) {
        await metricsCollector.recordEvent({
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          metadata: {},
        });
      }

      for (let i = 0; i < 20; i++) {
        await metricsCollector.recordEvent({
          investigationId: 'inv-1',
          eventType: 'error',
          agentId: 'TAN',
          metadata: { error: 'Anomaly error' },
        });
      }

      const events = await metricsCollector.getEvents('inv-1');
      const anomalies = await anomalyDetector.detectErrorRateAnomalies(events, {
        windowSize: 50,
      });

      expect(anomalies.length).toBeGreaterThan(0);
    });
  });

  describe('Agent Performance Analytics', () => {
    it('should track and compare agent performance', async () => {
      // TAN: Fast agent
      for (let i = 0; i < 10; i++) {
        await metricsCollector.recordTaskComplete('inv-1', `task-tan-${i}`, 'TAN', 80, 4000);
      }

      // ZEN: Average agent
      for (let i = 0; i < 10; i++) {
        await metricsCollector.recordTaskComplete('inv-1', `task-zen-${i}`, 'ZEN', 120, 6000);
      }

      // JUNO: Slow agent
      for (let i = 0; i < 10; i++) {
        await metricsCollector.recordTaskComplete('inv-1', `task-juno-${i}`, 'JUNO', 180, 9000);
      }

      const agentPerf = await analyticsEngine.getAgentPerformance();

      expect(agentPerf['TAN'].averageDuration).toBeLessThan(agentPerf['ZEN'].averageDuration);
      expect(agentPerf['ZEN'].averageDuration).toBeLessThan(agentPerf['JUNO'].averageDuration);

      const rankings = await analyticsEngine.getAgentRankings();
      expect(rankings[0].agentId).toBe('TAN'); // Fastest
      expect(rankings[2].agentId).toBe('JUNO'); // Slowest
    });
  });

  describe('Cache Performance Analytics', () => {
    it('should analyze cache performance across layers', async () => {
      // L1: High hit rate
      for (let i = 0; i < 80; i++) {
        await metricsCollector.recordCacheHit('inv-1', 'L1', `key-${i}`);
      }
      for (let i = 0; i < 20; i++) {
        await metricsCollector.recordCacheMiss('inv-1', 'L1', `key-miss-${i}`);
      }

      // L2: Medium hit rate
      for (let i = 0; i < 50; i++) {
        await metricsCollector.recordCacheHit('inv-1', 'L2', `key-${i}`);
      }
      for (let i = 0; i < 50; i++) {
        await metricsCollector.recordCacheMiss('inv-1', 'L2', `key-miss-${i}`);
      }

      // L3: Low hit rate
      for (let i = 0; i < 20; i++) {
        await metricsCollector.recordCacheHit('inv-1', 'L3', `key-${i}`);
      }
      for (let i = 0; i < 80; i++) {
        await metricsCollector.recordCacheMiss('inv-1', 'L3', `key-miss-${i}`);
      }

      const cacheMetrics = await analyticsEngine.getCachePerformance('inv-1');

      expect(cacheMetrics.byLayer['L1'].hitRate).toBeGreaterThan(0.7);
      expect(cacheMetrics.byLayer['L2'].hitRate).toBeCloseTo(0.5, 1);
      expect(cacheMetrics.byLayer['L3'].hitRate).toBeLessThan(0.3);
    });

    it('should detect cache performance anomalies', async () => {
      // Normal cache performance
      for (let i = 0; i < 80; i++) {
        await metricsCollector.recordCacheHit('inv-1', 'L1', `key-${i}`);
      }
      for (let i = 0; i < 20; i++) {
        await metricsCollector.recordCacheMiss('inv-1', 'L1', `key-miss-${i}`);
      }

      // Anomaly: Cache degradation
      for (let i = 0; i < 20; i++) {
        await metricsCollector.recordCacheHit('inv-1', 'L1', `key-anomaly-${i}`);
      }
      for (let i = 0; i < 80; i++) {
        await metricsCollector.recordCacheMiss('inv-1', 'L1', `key-anomaly-miss-${i}`);
      }

      const events = await metricsCollector.getEvents('inv-1');
      const anomalies = await anomalyDetector.detectCacheAnomalies(events, {
        windowSize: 100,
      });

      expect(anomalies.length).toBeGreaterThan(0);
    });
  });

  describe('Token Usage Analytics', () => {
    it('should track and analyze token usage patterns', async () => {
      await metricsCollector.recordTokenUsage('inv-1', 'TAN', 5000, 2000);
      await metricsCollector.recordTokenUsage('inv-1', 'ZEN', 3000, 1500);
      await metricsCollector.recordTokenUsage('inv-1', 'JUNO', 7000, 3000);

      const tokenAnalysis = await analyticsEngine.getTokenUsageAnalysis('inv-1');

      expect(tokenAnalysis.totalTokens).toBe(21500);
      expect(tokenAnalysis.totalInputTokens).toBe(15000);
      expect(tokenAnalysis.totalOutputTokens).toBe(6500);
      expect(tokenAnalysis.byAgent['TAN']).toBe(7000);
      expect(tokenAnalysis.byAgent['ZEN']).toBe(4500);
      expect(tokenAnalysis.byAgent['JUNO']).toBe(10000);
      expect(tokenAnalysis.estimatedCost).toBeGreaterThan(0);
    });

    it('should detect token usage anomalies', async () => {
      // Normal token usage
      for (let i = 0; i < 20; i++) {
        await metricsCollector.recordTokenUsage('inv-1', 'TAN', 4000 + Math.random() * 2000, 1000);
      }

      // Anomaly: Very high token usage
      await metricsCollector.recordTokenUsage('inv-1', 'TAN', 50000, 10000);

      const events = await metricsCollector.getEvents('inv-1');
      const anomalies = await anomalyDetector.detectTokenAnomalies(events);

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].type).toBe('token_usage');
    });
  });

  describe('System-Wide Analytics', () => {
    it('should provide system-wide metrics across multiple investigations', async () => {
      // Create multiple investigations
      for (let i = 0; i < 5; i++) {
        await metricsCollector.startInvestigation(`inv-${i}`, 'security-audit');
        await metricsCollector.recordTaskComplete(`inv-${i}`, 'task-1', 'TAN', 120, 5000);
        await metricsCollector.recordTaskComplete(`inv-${i}`, 'task-2', 'ZEN', 180, 7000);
        await metricsCollector.endInvestigation(`inv-${i}`, 'completed');
      }

      const systemMetrics = await analyticsEngine.getSystemMetrics();

      expect(systemMetrics.totalInvestigations).toBe(5);
      expect(systemMetrics.totalTasks).toBe(10);
      expect(systemMetrics.totalTokensUsed).toBe(60000);
    });

    it('should compare investigations', async () => {
      await metricsCollector.startInvestigation('inv-1', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, 5000);
      await metricsCollector.endInvestigation('inv-1', 'completed');

      await metricsCollector.startInvestigation('inv-2', 'security-audit');
      await metricsCollector.recordTaskComplete('inv-2', 'task-1', 'TAN', 150, 7000);
      await metricsCollector.endInvestigation('inv-2', 'completed');

      const comparison = await analyticsEngine.compareInvestigations(['inv-1', 'inv-2']);

      expect(comparison.investigations).toHaveLength(2);
      expect(comparison.bestPerforming).toBe('inv-1');
      expect(comparison.summary).toBeDefined();
    });
  });
});
