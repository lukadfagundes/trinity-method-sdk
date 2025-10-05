/**
 * Anomaly Detector Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { AnomalyDetector } from '../../../src/analytics/AnomalyDetector';
import type { MetricEvent } from '../../../src/shared/types';

describe('AnomalyDetector', () => {
  let detector: AnomalyDetector;

  beforeEach(() => {
    detector = new AnomalyDetector();
  });

  describe('Anomaly Detection', () => {
    it('should detect performance anomalies using z-score method', async () => {
      const events: MetricEvent[] = [];

      // Normal durations: 100-110 seconds
      for (let i = 0; i < 20; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { taskId: `task-${i}`, duration: 100 + Math.random() * 10 },
        });
      }

      // Anomaly: 500 seconds (significantly higher)
      events.push({
        id: 'event-anomaly',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { taskId: 'task-anomaly', duration: 500 },
      });

      const anomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
        threshold: 3,
      });

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].eventId).toBe('event-anomaly');
      expect(anomalies[0].severity).toBe('high');
    });

    it('should detect anomalies using IQR method', async () => {
      const events: MetricEvent[] = [];

      // Normal values: 100-110
      for (let i = 0; i < 50; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 + Math.random() * 10 },
        });
      }

      // Outlier
      events.push({
        id: 'event-outlier',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 300 },
      });

      const anomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'iqr',
      });

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies.some(a => a.eventId === 'event-outlier')).toBe(true);
    });

    it('should achieve 90%+ detection accuracy', async () => {
      const events: MetricEvent[] = [];

      // Normal data
      for (let i = 0; i < 90; i++) {
        events.push({
          id: `normal-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 + Math.random() * 10 },
        });
      }

      // 10 clear anomalies
      for (let i = 0; i < 10; i++) {
        events.push({
          id: `anomaly-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 500 + Math.random() * 50 },
        });
      }

      const anomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
        threshold: 3,
      });

      // Should detect at least 9 out of 10 anomalies (90%+ accuracy)
      expect(anomalies.length).toBeGreaterThanOrEqual(9);
    });
  });

  describe('Token Usage Anomalies', () => {
    it('should detect unusual token usage', async () => {
      const events: MetricEvent[] = [];

      // Normal token usage: 4000-6000
      for (let i = 0; i < 20; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'token_usage',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { inputTokens: 4000 + Math.random() * 2000, outputTokens: 1000 },
        });
      }

      // Anomaly: 50000 tokens
      events.push({
        id: 'event-high-tokens',
        investigationId: 'inv-1',
        eventType: 'token_usage',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { inputTokens: 50000, outputTokens: 2000 },
      });

      const anomalies = await detector.detectTokenAnomalies(events);

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].type).toBe('token_usage');
    });

    it('should classify token anomaly severity', async () => {
      const events: MetricEvent[] = [];

      for (let i = 0; i < 20; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'token_usage',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { inputTokens: 5000, outputTokens: 1000 },
        });
      }

      // Very high anomaly
      events.push({
        id: 'extreme',
        investigationId: 'inv-1',
        eventType: 'token_usage',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { inputTokens: 100000, outputTokens: 5000 },
      });

      const anomalies = await detector.detectTokenAnomalies(events);

      expect(anomalies.some(a => a.severity === 'high')).toBe(true);
    });
  });

  describe('Error Rate Anomalies', () => {
    it('should detect unusual error rates', async () => {
      const events: MetricEvent[] = [];

      // Normal: 1 error per 100 tasks
      for (let i = 0; i < 100; i++) {
        events.push({
          id: `task-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: {},
        });
      }

      events.push({
        id: 'error-1',
        investigationId: 'inv-1',
        eventType: 'error',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { error: 'Normal error' },
      });

      // Anomaly period: 20 errors in next 50 tasks
      for (let i = 0; i < 50; i++) {
        events.push({
          id: `task-anomaly-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: {},
        });
      }

      for (let i = 0; i < 20; i++) {
        events.push({
          id: `error-anomaly-${i}`,
          investigationId: 'inv-1',
          eventType: 'error',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { error: 'Anomaly error' },
        });
      }

      const anomalies = await detector.detectErrorRateAnomalies(events, {
        windowSize: 50,
      });

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].type).toBe('error_rate');
    });

    it('should provide error rate threshold', async () => {
      const anomaly = await detector.detectErrorRateAnomalies([], {
        windowSize: 100,
      });

      expect(detector.getErrorRateThreshold()).toBeDefined();
      expect(detector.getErrorRateThreshold()).toBeGreaterThan(0);
    });
  });

  describe('Quality Anomalies', () => {
    it('should detect quality degradation', async () => {
      const events: MetricEvent[] = [];

      // Normal quality: 0.85-0.95
      for (let i = 0; i < 20; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'quality_check',
          agentId: 'JUNO',
          timestamp: new Date(),
          metadata: { qualityScore: 0.85 + Math.random() * 0.1 },
        });
      }

      // Quality degradation: 0.3
      events.push({
        id: 'low-quality',
        investigationId: 'inv-1',
        eventType: 'quality_check',
        agentId: 'JUNO',
        timestamp: new Date(),
        metadata: { qualityScore: 0.3 },
      });

      const anomalies = await detector.detectQualityAnomalies(events);

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies[0].type).toBe('quality');
    });

    it('should track quality trends', async () => {
      const events: MetricEvent[] = [];

      // Gradual quality decline
      for (let i = 0; i < 50; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'quality_check',
          agentId: 'JUNO',
          timestamp: new Date(),
          metadata: { qualityScore: 0.9 - (i * 0.01) }, // 0.9 down to 0.4
        });
      }

      const anomalies = await detector.detectQualityAnomalies(events, {
        detectTrends: true,
      });

      expect(anomalies.some(a => a.description.includes('trend'))).toBe(true);
    });
  });

  describe('Cache Anomalies', () => {
    it('should detect unusual cache miss rates', async () => {
      const events: MetricEvent[] = [];

      // Normal: 80% hit rate
      for (let i = 0; i < 80; i++) {
        events.push({
          id: `hit-${i}`,
          investigationId: 'inv-1',
          eventType: 'cache_hit',
          agentId: 'system',
          timestamp: new Date(),
          metadata: { layer: 'L1' },
        });
      }

      for (let i = 0; i < 20; i++) {
        events.push({
          id: `miss-${i}`,
          investigationId: 'inv-1',
          eventType: 'cache_miss',
          agentId: 'system',
          timestamp: new Date(),
          metadata: { layer: 'L1' },
        });
      }

      // Anomaly period: 80% miss rate
      for (let i = 0; i < 20; i++) {
        events.push({
          id: `anomaly-hit-${i}`,
          investigationId: 'inv-1',
          eventType: 'cache_hit',
          agentId: 'system',
          timestamp: new Date(),
          metadata: { layer: 'L1' },
        });
      }

      for (let i = 0; i < 80; i++) {
        events.push({
          id: `anomaly-miss-${i}`,
          investigationId: 'inv-1',
          eventType: 'cache_miss',
          agentId: 'system',
          timestamp: new Date(),
          metadata: { layer: 'L1' },
        });
      }

      const anomalies = await detector.detectCacheAnomalies(events, {
        windowSize: 100,
      });

      expect(anomalies.length).toBeGreaterThan(0);
    });

    it('should analyze cache anomalies by layer', async () => {
      const events: MetricEvent[] = [];

      // L1: normal performance
      for (let i = 0; i < 50; i++) {
        events.push({
          id: `l1-${i}`,
          investigationId: 'inv-1',
          eventType: i < 40 ? 'cache_hit' : 'cache_miss',
          agentId: 'system',
          timestamp: new Date(),
          metadata: { layer: 'L1' },
        });
      }

      // L2: poor performance
      for (let i = 0; i < 50; i++) {
        events.push({
          id: `l2-${i}`,
          investigationId: 'inv-1',
          eventType: i < 10 ? 'cache_hit' : 'cache_miss',
          agentId: 'system',
          timestamp: new Date(),
          metadata: { layer: 'L2' },
        });
      }

      const anomalies = await detector.detectCacheAnomalies(events);

      expect(anomalies.some(a => a.metadata?.layer === 'L2')).toBe(true);
    });
  });

  describe('Anomaly Severity Classification', () => {
    it('should classify anomalies by severity', async () => {
      const events: MetricEvent[] = [];

      // Normal baseline
      for (let i = 0; i < 30; i++) {
        events.push({
          id: `normal-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 },
        });
      }

      // Low severity: 1.5x normal
      events.push({
        id: 'low',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 150 },
      });

      // Medium severity: 3x normal
      events.push({
        id: 'medium',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 300 },
      });

      // High severity: 10x normal
      events.push({
        id: 'high',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 1000 },
      });

      const anomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
      });

      expect(anomalies.some(a => a.severity === 'low')).toBe(true);
      expect(anomalies.some(a => a.severity === 'medium')).toBe(true);
      expect(anomalies.some(a => a.severity === 'high')).toBe(true);
    });
  });

  describe('Anomaly Reporting', () => {
    it('should generate anomaly report', async () => {
      const events: MetricEvent[] = [];

      for (let i = 0; i < 20; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 },
        });
      }

      events.push({
        id: 'anomaly',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 500 },
      });

      const anomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
      });

      const report = detector.generateReport(anomalies);

      expect(report).toBeDefined();
      expect(report).toContain('Anomaly Report');
      expect(report).toContain('high');
    });

    it('should include recommendations in report', async () => {
      const events: MetricEvent[] = [];

      for (let i = 0; i < 20; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'error',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { error: 'Test error' },
        });
      }

      const anomalies = await detector.detectErrorRateAnomalies(events);
      const report = detector.generateReport(anomalies);

      expect(report).toContain('Recommendation');
    });
  });

  describe('Real-time Detection', () => {
    it('should detect anomalies in streaming data', async () => {
      // Initialize with baseline
      const baseline: MetricEvent[] = [];
      for (let i = 0; i < 50; i++) {
        baseline.push({
          id: `baseline-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 + Math.random() * 10 },
        });
      }

      await detector.trainBaseline(baseline, { metric: 'task_duration' });

      // Test real-time detection
      const anomaly = await detector.detectRealtime({
        id: 'realtime-1',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 500 },
      });

      expect(anomaly).toBeDefined();
      expect(anomaly?.isAnomaly).toBe(true);
    });

    it('should update baseline with new data', async () => {
      const baseline: MetricEvent[] = [];
      for (let i = 0; i < 30; i++) {
        baseline.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 },
        });
      }

      await detector.trainBaseline(baseline, { metric: 'task_duration' });

      // Update baseline with new normal data
      await detector.updateBaseline({
        id: 'new',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 105 },
      });

      const stats = detector.getBaselineStats();
      expect(stats.sampleSize).toBe(31);
    });
  });

  describe('Configuration', () => {
    it('should allow custom thresholds', async () => {
      detector.setThreshold('z-score', 2.5); // More sensitive

      const events: MetricEvent[] = [];

      for (let i = 0; i < 30; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 },
        });
      }

      events.push({
        id: 'mild-anomaly',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 200 },
      });

      const anomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
      });

      expect(anomalies.length).toBeGreaterThan(0);
    });

    it('should support multiple detection methods', async () => {
      const events: MetricEvent[] = [];

      for (let i = 0; i < 50; i++) {
        events.push({
          id: `event-${i}`,
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          timestamp: new Date(),
          metadata: { duration: 100 },
        });
      }

      events.push({
        id: 'anomaly',
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        timestamp: new Date(),
        metadata: { duration: 500 },
      });

      const zScoreAnomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'z-score',
      });

      const iqrAnomalies = await detector.detectAnomalies(events, {
        metric: 'task_duration',
        method: 'iqr',
      });

      expect(zScoreAnomalies.length).toBeGreaterThan(0);
      expect(iqrAnomalies.length).toBeGreaterThan(0);
    });
  });
});
