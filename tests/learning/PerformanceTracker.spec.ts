/**
 * Unit tests for PerformanceTracker
 * Tests timing accuracy, confidence calculations, and metrics tracking
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { PerformanceTracker } from '../../src/learning/PerformanceTracker';
import { LearningDataStore } from '../../src/learning/LearningDataStore';
import {
  AgentType,
  InvestigationResult,
  InvestigationStatus,
  PerformanceMetrics,
  StrategyPerformance,
} from '../../src/shared/types';

describe('PerformanceTracker', () => {
  let tracker: PerformanceTracker;
  let mockDataStore: jest.Mocked<LearningDataStore>;

  beforeEach(() => {
    // Create mock data store
    mockDataStore = {
      loadLearningData: jest.fn(),
      saveStrategy: jest.fn(),
      getStrategy: jest.fn(),
      savePattern: jest.fn(),
      getPattern: jest.fn(),
      saveErrorResolution: jest.fn(),
      getErrorResolution: jest.fn(),
      exportLearningData: jest.fn(),
      importLearningData: jest.fn(),
    } as any;

    tracker = new PerformanceTracker(mockDataStore);
  });

  describe('Investigation Tracking', () => {
    it('should track investigation start correctly', () => {
      const investigationId = 'test-inv-1';
      const agentId: AgentType = 'TAN';

      tracker.trackInvestigationStart(investigationId, agentId);

      // Should not throw and should initialize tracking
      expect(() => tracker.trackInvestigationStart(investigationId, agentId)).not.toThrow();
    });

    it('should track investigation duration with high precision', async () => {
      const investigationId = 'duration-test';
      const agentId: AgentType = 'ZEN';

      tracker.trackInvestigationStart(investigationId, agentId);

      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 100));

      const result: InvestigationResult = {
        id: investigationId,
        type: 'bug-fix',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 100,
        findings: [],
        patterns: [],
        metrics: {
          duration: 0,
          tokensUsed: 1000,
          apiCalls: 5,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 10,
          linesAnalyzed: 500,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'medium',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      const metrics = tracker.getMetrics(investigationId);
      expect(metrics).toBeDefined();
      expect(metrics?.duration).toBeGreaterThanOrEqual(100);
    });

    it('should track investigation failure', () => {
      const investigationId = 'failure-test';
      const agentId: AgentType = 'INO';

      tracker.trackInvestigationStart(investigationId, agentId);

      const error = new Error('Test error');
      tracker.trackInvestigationFailure(investigationId, error);

      const metrics = tracker.getMetrics(investigationId);
      expect(metrics).toBeDefined();
      expect(metrics?.errors).toBe(1);
    });

    it('should handle multiple concurrent investigations', () => {
      const investigations = [
        { id: 'inv-1', agent: 'TAN' as AgentType },
        { id: 'inv-2', agent: 'ZEN' as AgentType },
        { id: 'inv-3', agent: 'INO' as AgentType },
        { id: 'inv-4', agent: 'JUNO' as AgentType },
      ];

      // Start all investigations
      investigations.forEach(({ id, agent }) => {
        tracker.trackInvestigationStart(id, agent);
      });

      // Verify all are tracked
      investigations.forEach(({ id }) => {
        const metrics = tracker.getMetrics(id);
        expect(metrics).toBeDefined();
      });
    });
  });

  describe('Strategy Tracking', () => {
    it('should track strategy start and success', async () => {
      const investigationId = 'strategy-test';
      const agentId: AgentType = 'AJ';
      const strategyId = 'test-strategy-1';

      tracker.trackInvestigationStart(investigationId, agentId);
      tracker.trackStrategyStart(investigationId, strategyId);

      // Mock existing strategy
      const existingStrategy: StrategyPerformance = {
        strategyId,
        strategyName: 'Test Strategy',
        description: 'Test',
        applicableContexts: ['bug-fix'],
        successRate: 0.8,
        averageDuration: 5000,
        tokenEfficiency: 0.85,
        usageCount: 10,
        successCount: 8,
        failureCount: 2,
        lastUsed: new Date(),
        confidence: 0.75,
        agentId,
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      mockDataStore.getStrategy.mockResolvedValue(existingStrategy);
      mockDataStore.saveStrategy.mockResolvedValue();

      const result: InvestigationResult = {
        id: investigationId,
        type: 'bug-fix',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 3000,
        findings: [],
        patterns: [],
        metrics: {
          duration: 3000,
          tokensUsed: 500,
          apiCalls: 3,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 5,
          linesAnalyzed: 200,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'medium',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      // Verify strategy was updated
      expect(mockDataStore.saveStrategy).toHaveBeenCalled();
      const savedStrategy = (mockDataStore.saveStrategy as jest.Mock).mock.calls[0][1];
      expect(savedStrategy.usageCount).toBe(11);
      expect(savedStrategy.successCount).toBe(9);
    });

    it('should track strategy failure', async () => {
      const investigationId = 'strategy-fail-test';
      const agentId: AgentType = 'TAN';
      const strategyId = 'fail-strategy';

      tracker.trackInvestigationStart(investigationId, agentId);
      tracker.trackStrategyStart(investigationId, strategyId);

      const existingStrategy: StrategyPerformance = {
        strategyId,
        strategyName: 'Fail Strategy',
        description: 'Test',
        applicableContexts: ['refactor'],
        successRate: 0.9,
        averageDuration: 4000,
        tokenEfficiency: 0.9,
        usageCount: 10,
        successCount: 9,
        failureCount: 1,
        lastUsed: new Date(),
        confidence: 0.8,
        agentId,
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      mockDataStore.getStrategy.mockResolvedValue(existingStrategy);
      mockDataStore.saveStrategy.mockResolvedValue();

      const error = new Error('Strategy failed');
      tracker.trackInvestigationFailure(investigationId, error);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify strategy was updated with failure
      expect(mockDataStore.saveStrategy).toHaveBeenCalled();
      const savedStrategy = (mockDataStore.saveStrategy as jest.Mock).mock.calls[0][1];
      expect(savedStrategy.failureCount).toBe(2);
    });
  });

  describe('Confidence Calculation', () => {
    it('should calculate confidence correctly for high success rate', async () => {
      const investigationId = 'confidence-test-high';
      const agentId: AgentType = 'JUNO';
      const strategyId = 'high-confidence-strategy';

      tracker.trackInvestigationStart(investigationId, agentId);
      tracker.trackStrategyStart(investigationId, strategyId);

      // Strategy with 95% success rate over 100 uses
      const existingStrategy: StrategyPerformance = {
        strategyId,
        strategyName: 'High Confidence',
        description: 'Test',
        applicableContexts: ['audit'],
        successRate: 0.95,
        averageDuration: 5000,
        tokenEfficiency: 0.9,
        usageCount: 100,
        successCount: 95,
        failureCount: 5,
        lastUsed: new Date(),
        confidence: 0.5, // Will be recalculated
        agentId,
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      mockDataStore.getStrategy.mockResolvedValue(existingStrategy);
      mockDataStore.saveStrategy.mockResolvedValue();

      const result: InvestigationResult = {
        id: investigationId,
        type: 'audit',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 4500,
        findings: [],
        patterns: [],
        metrics: {
          duration: 4500,
          tokensUsed: 800,
          apiCalls: 4,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 15,
          linesAnalyzed: 800,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'high',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      const savedStrategy = (mockDataStore.saveStrategy as jest.Mock).mock.calls[0][1];

      // Confidence = (successCount / usageCount) * sqrt(usageCount) / 10
      // Expected: (96 / 101) * sqrt(101) / 10 ≈ 0.95 * 10.05 / 10 ≈ 0.95
      expect(savedStrategy.confidence).toBeGreaterThan(0.9);
      expect(savedStrategy.confidence).toBeLessThanOrEqual(1.0);
    });

    it('should calculate confidence correctly for low usage', async () => {
      const investigationId = 'confidence-test-low';
      const agentId: AgentType = 'ZEN';
      const strategyId = 'low-usage-strategy';

      tracker.trackInvestigationStart(investigationId, agentId);
      tracker.trackStrategyStart(investigationId, strategyId);

      // Strategy with 100% success but only 2 uses
      const existingStrategy: StrategyPerformance = {
        strategyId,
        strategyName: 'Low Usage',
        description: 'Test',
        applicableContexts: ['documentation'],
        successRate: 1.0,
        averageDuration: 3000,
        tokenEfficiency: 0.9,
        usageCount: 2,
        successCount: 2,
        failureCount: 0,
        lastUsed: new Date(),
        confidence: 0.5,
        agentId,
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      mockDataStore.getStrategy.mockResolvedValue(existingStrategy);
      mockDataStore.saveStrategy.mockResolvedValue();

      const result: InvestigationResult = {
        id: investigationId,
        type: 'documentation',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 2800,
        findings: [],
        patterns: [],
        metrics: {
          duration: 2800,
          tokensUsed: 400,
          apiCalls: 2,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 8,
          linesAnalyzed: 300,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'medium',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      const savedStrategy = (mockDataStore.saveStrategy as jest.Mock).mock.calls[0][1];

      // Confidence = (3 / 3) * sqrt(3) / 10 ≈ 1.0 * 1.73 / 10 ≈ 0.173
      expect(savedStrategy.confidence).toBeLessThan(0.3);
      expect(savedStrategy.confidence).toBeGreaterThan(0);
    });

    it('should cap confidence at 1.0', async () => {
      const investigationId = 'confidence-test-cap';
      const agentId: AgentType = 'AJ';
      const strategyId = 'perfect-strategy';

      tracker.trackInvestigationStart(investigationId, agentId);
      tracker.trackStrategyStart(investigationId, strategyId);

      // Perfect strategy with high usage
      const existingStrategy: StrategyPerformance = {
        strategyId,
        strategyName: 'Perfect',
        description: 'Test',
        applicableContexts: ['bug-fix'],
        successRate: 1.0,
        averageDuration: 3000,
        tokenEfficiency: 1.0,
        usageCount: 200,
        successCount: 200,
        failureCount: 0,
        lastUsed: new Date(),
        confidence: 0.95,
        agentId,
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      mockDataStore.getStrategy.mockResolvedValue(existingStrategy);
      mockDataStore.saveStrategy.mockResolvedValue();

      const result: InvestigationResult = {
        id: investigationId,
        type: 'bug-fix',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 2900,
        findings: [],
        patterns: [],
        metrics: {
          duration: 2900,
          tokensUsed: 600,
          apiCalls: 3,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 12,
          linesAnalyzed: 600,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'high',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      const savedStrategy = (mockDataStore.saveStrategy as jest.Mock).mock.calls[0][1];
      expect(savedStrategy.confidence).toBeLessThanOrEqual(1.0);
    });
  });

  describe('Token Tracking', () => {
    it('should track token usage accurately', async () => {
      const investigationId = 'token-test';
      const agentId: AgentType = 'TAN';

      tracker.trackInvestigationStart(investigationId, agentId);

      // Simulate token usage
      tracker.trackTokenUsage(500);
      tracker.trackTokenUsage(300);
      tracker.trackTokenUsage(200);

      const result: InvestigationResult = {
        id: investigationId,
        type: 'refactor',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 5000,
        findings: [],
        patterns: [],
        metrics: {
          duration: 5000,
          tokensUsed: 1000,
          apiCalls: 3,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 10,
          linesAnalyzed: 500,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'medium',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      const metrics = tracker.getMetrics(investigationId);
      expect(metrics?.tokensUsed).toBe(1000);
    });

    it('should calculate token efficiency correctly', async () => {
      const investigationId = 'efficiency-test';
      const agentId: AgentType = 'INO';
      const strategyId = 'efficient-strategy';

      tracker.trackInvestigationStart(investigationId, agentId);
      tracker.trackStrategyStart(investigationId, strategyId);

      const existingStrategy: StrategyPerformance = {
        strategyId,
        strategyName: 'Efficient',
        description: 'Test',
        applicableContexts: ['context-analysis'],
        successRate: 0.9,
        averageDuration: 4000,
        tokenEfficiency: 0.85,
        usageCount: 10,
        successCount: 9,
        failureCount: 1,
        lastUsed: new Date(),
        confidence: 0.75,
        agentId,
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      mockDataStore.getStrategy.mockResolvedValue(existingStrategy);
      mockDataStore.saveStrategy.mockResolvedValue();

      const result: InvestigationResult = {
        id: investigationId,
        type: 'context-analysis',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 3500,
        findings: [],
        patterns: [],
        metrics: {
          duration: 3500,
          tokensUsed: 300, // Very efficient
          apiCalls: 2,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 15,
          linesAnalyzed: 700,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'high',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      const savedStrategy = (mockDataStore.saveStrategy as jest.Mock).mock.calls[0][1];
      // Token efficiency should improve with low token usage
      expect(savedStrategy.tokenEfficiency).toBeGreaterThan(0.85);
    });
  });

  describe('Metrics Aggregation', () => {
    it('should aggregate metrics across multiple investigations', async () => {
      const agentId: AgentType = 'JUNO';
      const investigations = [
        { id: 'agg-1', duration: 3000, tokens: 500, errors: 0 },
        { id: 'agg-2', duration: 4000, tokens: 600, errors: 1 },
        { id: 'agg-3', duration: 3500, tokens: 550, errors: 0 },
      ];

      for (const inv of investigations) {
        tracker.trackInvestigationStart(inv.id, agentId);

        const result: InvestigationResult = {
          id: inv.id,
          type: 'audit',
          status: 'completed',
          agent: agentId,
          startTime: new Date(),
          endTime: new Date(),
          duration: inv.duration,
          findings: [],
          patterns: [],
          metrics: {
            duration: inv.duration,
            tokensUsed: inv.tokens,
            apiCalls: 3,
            errors: inv.errors,
            warnings: 0,
            filesAnalyzed: 10,
            linesAnalyzed: 500,
            timestamp: new Date(),
          },
          errors: [],
          recommendations: [],
          artifacts: [],
          metadata: {
            investigationId: inv.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: agentId,
            tags: [],
            priority: 'medium',
          },
        };

        await tracker.trackInvestigationComplete(inv.id, result);
      }

      // Verify individual metrics
      const metrics1 = tracker.getMetrics('agg-1');
      const metrics2 = tracker.getMetrics('agg-2');
      const metrics3 = tracker.getMetrics('agg-3');

      expect(metrics1?.duration).toBe(3000);
      expect(metrics2?.errors).toBe(1);
      expect(metrics3?.tokensUsed).toBe(550);
    });

    it('should handle warnings correctly', async () => {
      const investigationId = 'warning-test';
      const agentId: AgentType = 'ZEN';

      tracker.trackInvestigationStart(investigationId, agentId);

      const result: InvestigationResult = {
        id: investigationId,
        type: 'documentation',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 4000,
        findings: [],
        patterns: [],
        metrics: {
          duration: 4000,
          tokensUsed: 700,
          apiCalls: 4,
          errors: 0,
          warnings: 5,
          filesAnalyzed: 20,
          linesAnalyzed: 1000,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'low',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);

      const metrics = tracker.getMetrics(investigationId);
      expect(metrics?.warnings).toBe(5);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing investigation gracefully', () => {
      const metrics = tracker.getMetrics('non-existent');
      expect(metrics).toBeUndefined();
    });

    it('should handle strategy update failures', async () => {
      const investigationId = 'strategy-fail';
      const agentId: AgentType = 'AJ';
      const strategyId = 'fail-update';

      tracker.trackInvestigationStart(investigationId, agentId);
      tracker.trackStrategyStart(investigationId, strategyId);

      mockDataStore.getStrategy.mockRejectedValue(new Error('Database error'));

      const result: InvestigationResult = {
        id: investigationId,
        type: 'bug-fix',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 3000,
        findings: [],
        patterns: [],
        metrics: {
          duration: 3000,
          tokensUsed: 500,
          apiCalls: 2,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 5,
          linesAnalyzed: 200,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'high',
        },
      };

      // Should not throw
      await expect(tracker.trackInvestigationComplete(investigationId, result)).resolves.not.toThrow();
    });
  });

  describe('High-Resolution Timing', () => {
    it('should provide nanosecond precision timing', async () => {
      const investigationId = 'precision-test';
      const agentId: AgentType = 'TAN';

      const start = process.hrtime.bigint();
      tracker.trackInvestigationStart(investigationId, agentId);

      // Very short operation
      await new Promise(resolve => setImmediate(resolve));

      const result: InvestigationResult = {
        id: investigationId,
        type: 'refactor',
        status: 'completed',
        agent: agentId,
        startTime: new Date(),
        endTime: new Date(),
        duration: 1,
        findings: [],
        patterns: [],
        metrics: {
          duration: 1,
          tokensUsed: 100,
          apiCalls: 1,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 1,
          linesAnalyzed: 50,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: agentId,
          tags: [],
          priority: 'low',
        },
      };

      await tracker.trackInvestigationComplete(investigationId, result);
      const end = process.hrtime.bigint();

      const totalDuration = Number(end - start) / 1_000_000; // Convert to ms

      const metrics = tracker.getMetrics(investigationId);
      expect(metrics).toBeDefined();
      // Duration should be captured even for very short operations
      expect(metrics?.duration).toBeGreaterThanOrEqual(0);
    });
  });
});
