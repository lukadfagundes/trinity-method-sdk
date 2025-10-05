/**
 * Metrics Collector Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MetricsCollector } from '../../../src/analytics/MetricsCollector';
import * as fs from 'fs/promises';

describe('MetricsCollector', () => {
  let collector: MetricsCollector;
  const testMetricsPath = './test-metrics';

  beforeEach(async () => {
    collector = new MetricsCollector(testMetricsPath);
    await fs.mkdir(testMetricsPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testMetricsPath, { recursive: true, force: true });
  });

  describe('Event Recording', () => {
    it('should record metric event', async () => {
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        metadata: { taskId: 'task-1', duration: 120 },
      });

      const events = await collector.getEvents('inv-1');
      expect(events).toHaveLength(1);
      expect(events[0].eventType).toBe('task_complete');
      expect(events[0].agentId).toBe('TAN');
    });

    it('should auto-generate event ID and timestamp', async () => {
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'investigation_start',
        agentId: 'system',
        metadata: {},
      });

      const events = await collector.getEvents('inv-1');
      expect(events[0].id).toBeDefined();
      expect(events[0].timestamp).toBeDefined();
    });

    it('should record events with <1s latency', async () => {
      const startTime = Date.now();

      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'cache_hit',
        agentId: 'system',
        metadata: {},
      });

      const endTime = Date.now();
      const latency = endTime - startTime;

      expect(latency).toBeLessThan(1000); // <1 second
    });

    it('should handle multiple events for same investigation', async () => {
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_start',
        agentId: 'TAN',
        metadata: { taskId: 'task-1' },
      });

      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        metadata: { taskId: 'task-1' },
      });

      const events = await collector.getEvents('inv-1');
      expect(events).toHaveLength(2);
    });

    it('should handle events from multiple investigations', async () => {
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'investigation_start',
        agentId: 'system',
        metadata: {},
      });

      await collector.recordEvent({
        investigationId: 'inv-2',
        eventType: 'investigation_start',
        agentId: 'system',
        metadata: {},
      });

      const events1 = await collector.getEvents('inv-1');
      const events2 = await collector.getEvents('inv-2');

      expect(events1).toHaveLength(1);
      expect(events2).toHaveLength(1);
    });
  });

  describe('Investigation Lifecycle', () => {
    it('should track investigation start', async () => {
      await collector.startInvestigation('inv-1', 'security-audit');

      const events = await collector.getEvents('inv-1');
      expect(events.some(e => e.eventType === 'investigation_start')).toBe(true);
    });

    it('should track investigation end', async () => {
      await collector.startInvestigation('inv-1');
      await collector.endInvestigation('inv-1', 'completed');

      const events = await collector.getEvents('inv-1');
      expect(events.some(e => e.eventType === 'investigation_end')).toBe(true);
    });

    it('should calculate investigation duration', async () => {
      await collector.startInvestigation('inv-1');

      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 100));

      await collector.endInvestigation('inv-1', 'completed');

      const summary = await collector.getInvestigationSummary('inv-1');
      expect(summary.duration).toBeGreaterThan(0);
    });

    it('should track investigation status changes', async () => {
      await collector.startInvestigation('inv-1');
      await collector.recordStatusChange('inv-1', 'in-progress');
      await collector.recordStatusChange('inv-1', 'paused');
      await collector.recordStatusChange('inv-1', 'in-progress');
      await collector.endInvestigation('inv-1', 'completed');

      const events = await collector.getEvents('inv-1');
      const statusChanges = events.filter(e => e.eventType === 'status_change');
      expect(statusChanges.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Task Metrics', () => {
    it('should record task completion', async () => {
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);

      const events = await collector.getEvents('inv-1');
      const taskEvent = events.find(e => e.eventType === 'task_complete');

      expect(taskEvent).toBeDefined();
      expect(taskEvent?.metadata.taskId).toBe('task-1');
      expect(taskEvent?.metadata.duration).toBe(120);
      expect(taskEvent?.metadata.tokensUsed).toBe(5000);
    });

    it('should track task start and end', async () => {
      await collector.recordTaskStart('inv-1', 'task-1', 'ZEN');
      await collector.recordTaskComplete('inv-1', 'task-1', 'ZEN', 180, 8000);

      const events = await collector.getEvents('inv-1');
      expect(events.some(e => e.eventType === 'task_start')).toBe(true);
      expect(events.some(e => e.eventType === 'task_complete')).toBe(true);
    });

    it('should calculate average task duration', async () => {
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 100, 5000);
      await collector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 200, 8000);
      await collector.recordTaskComplete('inv-1', 'task-3', 'JUNO', 150, 6000);

      const summary = await collector.getInvestigationSummary('inv-1');
      expect(summary.averageTaskDuration).toBeCloseTo(150, 1);
    });
  });

  describe('Agent Metrics', () => {
    it('should track agent utilization', async () => {
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);
      await collector.recordTaskComplete('inv-1', 'task-2', 'TAN', 180, 7000);
      await collector.recordTaskComplete('inv-1', 'task-3', 'ZEN', 90, 4000);

      const agentMetrics = await collector.getAgentMetrics('inv-1');

      expect(agentMetrics['TAN']).toBeDefined();
      expect(agentMetrics['TAN'].taskCount).toBe(2);
      expect(agentMetrics['TAN'].totalDuration).toBe(300);
      expect(agentMetrics['TAN'].totalTokens).toBe(12000);

      expect(agentMetrics['ZEN']).toBeDefined();
      expect(agentMetrics['ZEN'].taskCount).toBe(1);
    });

    it('should calculate agent efficiency', async () => {
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);

      const agentMetrics = await collector.getAgentMetrics('inv-1');
      expect(agentMetrics['TAN'].efficiency).toBeDefined();
      expect(agentMetrics['TAN'].efficiency).toBeGreaterThan(0);
    });
  });

  describe('Cache Metrics', () => {
    it('should track cache hits', async () => {
      await collector.recordCacheHit('inv-1', 'L1', 'cache-key-1');

      const events = await collector.getEvents('inv-1');
      expect(events.some(e => e.eventType === 'cache_hit')).toBe(true);
    });

    it('should track cache misses', async () => {
      await collector.recordCacheMiss('inv-1', 'L2', 'cache-key-2');

      const events = await collector.getEvents('inv-1');
      expect(events.some(e => e.eventType === 'cache_miss')).toBe(true);
    });

    it('should calculate cache hit rate', async () => {
      await collector.recordCacheHit('inv-1', 'L1', 'key-1');
      await collector.recordCacheHit('inv-1', 'L1', 'key-2');
      await collector.recordCacheMiss('inv-1', 'L1', 'key-3');
      await collector.recordCacheHit('inv-1', 'L1', 'key-4');

      const cacheMetrics = await collector.getCacheMetrics('inv-1');
      expect(cacheMetrics.hitRate).toBeCloseTo(0.75, 2); // 3 hits / 4 total = 75%
    });

    it('should track cache metrics by layer', async () => {
      await collector.recordCacheHit('inv-1', 'L1', 'key-1');
      await collector.recordCacheHit('inv-1', 'L2', 'key-2');
      await collector.recordCacheMiss('inv-1', 'L1', 'key-3');

      const cacheMetrics = await collector.getCacheMetrics('inv-1');
      expect(cacheMetrics.byLayer).toBeDefined();
      expect(cacheMetrics.byLayer['L1']).toBeDefined();
      expect(cacheMetrics.byLayer['L2']).toBeDefined();
    });
  });

  describe('Token Usage', () => {
    it('should track token usage', async () => {
      await collector.recordTokenUsage('inv-1', 'TAN', 5000, 2000);

      const events = await collector.getEvents('inv-1');
      const tokenEvent = events.find(e => e.eventType === 'token_usage');

      expect(tokenEvent).toBeDefined();
      expect(tokenEvent?.metadata.inputTokens).toBe(5000);
      expect(tokenEvent?.metadata.outputTokens).toBe(2000);
    });

    it('should calculate total token usage', async () => {
      await collector.recordTokenUsage('inv-1', 'TAN', 5000, 2000);
      await collector.recordTokenUsage('inv-1', 'ZEN', 3000, 1500);

      const summary = await collector.getInvestigationSummary('inv-1');
      expect(summary.totalTokens).toBe(11500); // 5000 + 2000 + 3000 + 1500
    });
  });

  describe('Error Tracking', () => {
    it('should track errors', async () => {
      await collector.recordError('inv-1', 'TAN', 'File not found', { taskId: 'task-1' });

      const events = await collector.getEvents('inv-1');
      expect(events.some(e => e.eventType === 'error')).toBe(true);
    });

    it('should calculate error rate', async () => {
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);
      await collector.recordError('inv-1', 'TAN', 'Error', {});
      await collector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 180, 7000);

      const summary = await collector.getInvestigationSummary('inv-1');
      expect(summary.errorRate).toBeGreaterThan(0);
    });
  });

  describe('Query and Filtering', () => {
    it('should query events by type', async () => {
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_start',
        agentId: 'TAN',
        metadata: {},
      });
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'cache_hit',
        agentId: 'system',
        metadata: {},
      });
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        metadata: {},
      });

      const taskEvents = await collector.queryEvents('inv-1', { eventType: 'task_start' });
      expect(taskEvents).toHaveLength(1);
      expect(taskEvents[0].eventType).toBe('task_start');
    });

    it('should query events by agent', async () => {
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        metadata: {},
      });
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'ZEN',
        metadata: {},
      });

      const tanEvents = await collector.queryEvents('inv-1', { agentId: 'TAN' });
      expect(tanEvents).toHaveLength(1);
      expect(tanEvents[0].agentId).toBe('TAN');
    });

    it('should query events by time range', async () => {
      const startTime = new Date();

      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_start',
        agentId: 'TAN',
        metadata: {},
      });

      await new Promise(resolve => setTimeout(resolve, 50));
      const midTime = new Date();
      await new Promise(resolve => setTimeout(resolve, 50));

      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        metadata: {},
      });

      const endTime = new Date();

      const recentEvents = await collector.queryEvents('inv-1', {
        startTime: midTime,
        endTime,
      });

      expect(recentEvents.length).toBeGreaterThan(0);
    });
  });

  describe('Auto-Save and Persistence', () => {
    it('should auto-save metrics periodically', async () => {
      await collector.recordEvent({
        investigationId: 'inv-1',
        eventType: 'task_complete',
        agentId: 'TAN',
        metadata: {},
      });

      // Trigger auto-save
      await collector.flush();

      // Create new collector instance to verify persistence
      const collector2 = new MetricsCollector(testMetricsPath);
      const events = await collector2.getEvents('inv-1');

      expect(events).toHaveLength(1);
    });

    it('should handle concurrent writes', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        collector.recordEvent({
          investigationId: 'inv-1',
          eventType: 'task_complete',
          agentId: 'TAN',
          metadata: { index: i },
        })
      );

      await Promise.all(promises);

      const events = await collector.getEvents('inv-1');
      expect(events).toHaveLength(10);
    });
  });

  describe('Summary Generation', () => {
    it('should generate comprehensive investigation summary', async () => {
      await collector.startInvestigation('inv-1', 'security-audit');
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);
      await collector.recordTaskComplete('inv-1', 'task-2', 'ZEN', 180, 7000);
      await collector.recordCacheHit('inv-1', 'L1', 'key-1');
      await collector.endInvestigation('inv-1', 'completed');

      const summary = await collector.getInvestigationSummary('inv-1');

      expect(summary.investigationId).toBe('inv-1');
      expect(summary.type).toBe('security-audit');
      expect(summary.status).toBe('completed');
      expect(summary.taskCount).toBe(2);
      expect(summary.duration).toBeGreaterThan(0);
      expect(summary.totalTokens).toBe(12000);
    });

    it('should include quality metrics in summary', async () => {
      await collector.startInvestigation('inv-1');
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);

      const summary = await collector.getInvestigationSummary('inv-1');
      expect(summary.qualityScore).toBeDefined();
    });
  });

  describe('Real-time Metrics', () => {
    it('should provide real-time metrics with <1s latency', async () => {
      await collector.startInvestigation('inv-1');

      const startTime = Date.now();
      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);

      const summary = await collector.getInvestigationSummary('inv-1');
      const endTime = Date.now();

      expect(summary).toBeDefined();
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should update metrics in real-time', async () => {
      await collector.startInvestigation('inv-1');

      let summary = await collector.getInvestigationSummary('inv-1');
      expect(summary.taskCount).toBe(0);

      await collector.recordTaskComplete('inv-1', 'task-1', 'TAN', 120, 5000);

      summary = await collector.getInvestigationSummary('inv-1');
      expect(summary.taskCount).toBe(1);
    });
  });
});
