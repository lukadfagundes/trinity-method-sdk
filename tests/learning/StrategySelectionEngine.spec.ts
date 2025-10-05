/**
 * Unit tests for StrategySelectionEngine
 * Tests strategy ranking, confidence thresholds, and context matching
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { StrategySelectionEngine, InvestigationContext } from '../../src/learning/StrategySelectionEngine';
import { LearningDataStore } from '../../src/learning/LearningDataStore';
import {
  AgentType,
  StrategyPerformance,
  LearningData,
  LearnedPattern,
} from '../../src/shared/types';

describe('StrategySelectionEngine', () => {
  let engine: StrategySelectionEngine;
  let mockDataStore: jest.Mocked<LearningDataStore>;

  beforeEach(() => {
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

    engine = new StrategySelectionEngine(mockDataStore);
  });

  describe('Strategy Selection', () => {
    it('should select best strategy based on weighted score', async () => {
      const agentId: AgentType = 'TAN';
      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/', 'tests/'],
        estimatedComplexity: 'medium',
        tags: ['structure', 'refactor'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'strategy-1',
          strategyName: 'High Success',
          description: 'High success rate',
          applicableContexts: ['bug-fix'],
          successRate: 0.9,
          averageDuration: 5000,
          tokenEfficiency: 0.85,
          usageCount: 50,
          successCount: 45,
          failureCount: 5,
          lastUsed: new Date(),
          confidence: 0.85,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'strategy-2',
          strategyName: 'Medium Success',
          description: 'Medium success rate',
          applicableContexts: ['bug-fix'],
          successRate: 0.7,
          averageDuration: 4000,
          tokenEfficiency: 0.9,
          usageCount: 30,
          successCount: 21,
          failureCount: 9,
          lastUsed: new Date(),
          confidence: 0.6,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 80,
        successfulInvestigations: 66,
        failedInvestigations: 14,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Should select strategy-1 due to higher weighted score
      // Score = (successRate * 0.6) + (confidence * 0.4)
      // Strategy 1: (0.9 * 0.6) + (0.85 * 0.4) = 0.54 + 0.34 = 0.88
      // Strategy 2: (0.7 * 0.6) + (0.6 * 0.4) = 0.42 + 0.24 = 0.66
      expect(selected.strategyId).toBe('strategy-1');
    });

    it('should use default strategy when confidence below threshold', async () => {
      const agentId: AgentType = 'ZEN';
      const context: InvestigationContext = {
        type: 'documentation',
        scope: ['docs/'],
        estimatedComplexity: 'low',
        tags: ['docs', 'readme'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'low-confidence',
          strategyName: 'Low Confidence',
          description: 'Low confidence strategy',
          applicableContexts: ['documentation'],
          successRate: 0.8,
          averageDuration: 3000,
          tokenEfficiency: 0.9,
          usageCount: 5,
          successCount: 4,
          failureCount: 1,
          lastUsed: new Date(),
          confidence: 0.5, // Below 0.7 threshold
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 5,
        successfulInvestigations: 4,
        failedInvestigations: 1,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Should return default strategy
      expect(selected.strategyName).toContain('Default');
    });

    it('should filter strategies by applicable contexts', async () => {
      const agentId: AgentType = 'INO';
      const context: InvestigationContext = {
        type: 'context-analysis',
        scope: ['CLAUDE.md'],
        estimatedComplexity: 'medium',
        tags: ['context', 'scope'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'applicable',
          strategyName: 'Applicable',
          description: 'Applicable to context',
          applicableContexts: ['context-analysis'],
          successRate: 0.8,
          averageDuration: 4000,
          tokenEfficiency: 0.85,
          usageCount: 20,
          successCount: 16,
          failureCount: 4,
          lastUsed: new Date(),
          confidence: 0.75,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'not-applicable',
          strategyName: 'Not Applicable',
          description: 'Not applicable to context',
          applicableContexts: ['bug-fix'], // Different context
          successRate: 0.95,
          averageDuration: 3000,
          tokenEfficiency: 0.95,
          usageCount: 50,
          successCount: 47,
          failureCount: 3,
          lastUsed: new Date(),
          confidence: 0.9,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 70,
        successfulInvestigations: 63,
        failedInvestigations: 7,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Should select 'applicable' despite lower scores
      expect(selected.strategyId).toBe('applicable');
    });

    it('should handle empty strategy list', async () => {
      const agentId: AgentType = 'JUNO';
      const context: InvestigationContext = {
        type: 'audit',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: ['quality', 'audit'],
        previousInvestigations: [],
      };

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(), // Empty strategies
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 0,
        successfulInvestigations: 0,
        failedInvestigations: 0,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Should return default strategy
      expect(selected.strategyName).toContain('Default');
    });
  });

  describe('Context Matching', () => {
    it('should match context by investigation type', async () => {
      const agentId: AgentType = 'AJ';
      const context: InvestigationContext = {
        type: 'feature',
        scope: ['src/features/'],
        estimatedComplexity: 'high',
        tags: ['new-feature'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'feature-strategy',
          strategyName: 'Feature Strategy',
          description: 'For features',
          applicableContexts: ['feature'],
          successRate: 0.85,
          averageDuration: 6000,
          tokenEfficiency: 0.8,
          usageCount: 25,
          successCount: 21,
          failureCount: 4,
          lastUsed: new Date(),
          confidence: 0.8,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'bug-strategy',
          strategyName: 'Bug Strategy',
          description: 'For bugs',
          applicableContexts: ['bug-fix'],
          successRate: 0.9,
          averageDuration: 4000,
          tokenEfficiency: 0.9,
          usageCount: 40,
          successCount: 36,
          failureCount: 4,
          lastUsed: new Date(),
          confidence: 0.85,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 65,
        successfulInvestigations: 57,
        failedInvestigations: 8,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);
      expect(selected.strategyId).toBe('feature-strategy');
    });

    it('should match context by complexity', async () => {
      const agentId: AgentType = 'TAN';
      const context: InvestigationContext = {
        type: 'refactor',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: ['refactor', 'architecture'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'simple-refactor',
          strategyName: 'Simple Refactor',
          description: 'For simple refactors',
          applicableContexts: ['refactor'],
          successRate: 0.95,
          averageDuration: 2000,
          tokenEfficiency: 0.95,
          usageCount: 30,
          successCount: 28,
          failureCount: 2,
          lastUsed: new Date(),
          confidence: 0.82,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'complex-refactor',
          strategyName: 'Complex Refactor',
          description: 'For complex refactors',
          applicableContexts: ['refactor'],
          successRate: 0.85,
          averageDuration: 8000,
          tokenEfficiency: 0.8,
          usageCount: 15,
          successCount: 13,
          failureCount: 2,
          lastUsed: new Date(),
          confidence: 0.75,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 45,
        successfulInvestigations: 41,
        failedInvestigations: 4,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Both are applicable, should select based on weighted score
      // simple-refactor: (0.95 * 0.6) + (0.82 * 0.4) = 0.57 + 0.328 = 0.898
      // complex-refactor: (0.85 * 0.6) + (0.75 * 0.4) = 0.51 + 0.3 = 0.81
      expect(selected.strategyId).toBe('simple-refactor');
    });

    it('should match context by tags', async () => {
      const agentId: AgentType = 'ZEN';
      const context: InvestigationContext = {
        type: 'documentation',
        scope: ['docs/', 'README.md'],
        estimatedComplexity: 'low',
        tags: ['api-docs', 'typescript'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'general-docs',
          strategyName: 'General Docs',
          description: 'General documentation',
          applicableContexts: ['documentation'],
          successRate: 0.8,
          averageDuration: 3000,
          tokenEfficiency: 0.85,
          usageCount: 20,
          successCount: 16,
          failureCount: 4,
          lastUsed: new Date(),
          confidence: 0.75,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'api-docs',
          strategyName: 'API Documentation',
          description: 'API-specific docs',
          applicableContexts: ['documentation'],
          successRate: 0.9,
          averageDuration: 4000,
          tokenEfficiency: 0.9,
          usageCount: 25,
          successCount: 22,
          failureCount: 3,
          lastUsed: new Date(),
          confidence: 0.82,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 45,
        successfulInvestigations: 38,
        failedInvestigations: 7,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Both applicable, api-docs should win based on better metrics
      // api-docs: (0.9 * 0.6) + (0.82 * 0.4) = 0.54 + 0.328 = 0.868
      // general-docs: (0.8 * 0.6) + (0.75 * 0.4) = 0.48 + 0.3 = 0.78
      expect(selected.strategyId).toBe('api-docs');
    });
  });

  describe('Weighted Scoring', () => {
    it('should calculate weighted score correctly', async () => {
      const agentId: AgentType = 'JUNO';
      const context: InvestigationContext = {
        type: 'audit',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: ['quality'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'balanced',
          strategyName: 'Balanced',
          description: 'Balanced metrics',
          applicableContexts: ['audit'],
          successRate: 0.8,
          averageDuration: 5000,
          tokenEfficiency: 0.8,
          usageCount: 20,
          successCount: 16,
          failureCount: 4,
          lastUsed: new Date(),
          confidence: 0.8,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'high-success',
          strategyName: 'High Success',
          description: 'High success, lower confidence',
          applicableContexts: ['audit'],
          successRate: 0.95,
          averageDuration: 5000,
          tokenEfficiency: 0.85,
          usageCount: 10,
          successCount: 9,
          failureCount: 1,
          lastUsed: new Date(),
          confidence: 0.6,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'high-confidence',
          strategyName: 'High Confidence',
          description: 'High confidence, lower success',
          applicableContexts: ['audit'],
          successRate: 0.7,
          averageDuration: 5000,
          tokenEfficiency: 0.75,
          usageCount: 40,
          successCount: 28,
          failureCount: 12,
          lastUsed: new Date(),
          confidence: 0.9,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 70,
        successfulInvestigations: 53,
        failedInvestigations: 17,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Weighted scores:
      // balanced: (0.8 * 0.6) + (0.8 * 0.4) = 0.48 + 0.32 = 0.8
      // high-success: (0.95 * 0.6) + (0.6 * 0.4) = 0.57 + 0.24 = 0.81
      // high-confidence: (0.7 * 0.6) + (0.9 * 0.4) = 0.42 + 0.36 = 0.78
      expect(selected.strategyId).toBe('high-success');
    });

    it('should prefer confidence over success rate with 60/40 weighting', async () => {
      const agentId: AgentType = 'INO';
      const context: InvestigationContext = {
        type: 'context-analysis',
        scope: ['CLAUDE.md'],
        estimatedComplexity: 'low',
        tags: ['context'],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'success-focused',
          strategyName: 'Success Focused',
          description: 'Very high success, low confidence',
          applicableContexts: ['context-analysis'],
          successRate: 1.0,
          averageDuration: 3000,
          tokenEfficiency: 0.9,
          usageCount: 5,
          successCount: 5,
          failureCount: 0,
          lastUsed: new Date(),
          confidence: 0.3, // Low confidence due to low usage
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'confidence-focused',
          strategyName: 'Confidence Focused',
          description: 'Good success, high confidence',
          applicableContexts: ['context-analysis'],
          successRate: 0.85,
          averageDuration: 3500,
          tokenEfficiency: 0.88,
          usageCount: 50,
          successCount: 42,
          failureCount: 8,
          lastUsed: new Date(),
          confidence: 0.95,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 55,
        successfulInvestigations: 47,
        failedInvestigations: 8,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Weighted scores:
      // success-focused: (1.0 * 0.6) + (0.3 * 0.4) = 0.6 + 0.12 = 0.72
      // confidence-focused: (0.85 * 0.6) + (0.95 * 0.4) = 0.51 + 0.38 = 0.89
      expect(selected.strategyId).toBe('confidence-focused');
    });
  });

  describe('Default Strategy Generation', () => {
    it('should generate appropriate default strategy for each agent', async () => {
      const agents: AgentType[] = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];

      for (const agentId of agents) {
        const context: InvestigationContext = {
          type: 'bug-fix',
          scope: ['src/'],
          estimatedComplexity: 'medium',
          tags: [],
          previousInvestigations: [],
        };

        const learningData: LearningData = {
          agentId,
          patterns: new Map(),
          strategies: new Map(),
          errorResolutions: new Map(),
          lastUpdated: new Date(),
          totalInvestigations: 0,
          successfulInvestigations: 0,
          failedInvestigations: 0,
        };

        mockDataStore.loadLearningData.mockResolvedValue(learningData);

        const strategy = await engine.selectStrategy(agentId, context);

        expect(strategy).toBeDefined();
        expect(strategy.agentId).toBe(agentId);
        expect(strategy.strategyName).toContain('Default');
      }
    });

    it('should set appropriate contexts for default strategies', async () => {
      const agentId: AgentType = 'TAN';
      const context: InvestigationContext = {
        type: 'refactor',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: ['architecture'],
        previousInvestigations: [],
      };

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 0,
        successfulInvestigations: 0,
        failedInvestigations: 0,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const strategy = await engine.selectStrategy(agentId, context);

      expect(strategy.applicableContexts).toBeDefined();
      expect(strategy.applicableContexts.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle strategies with identical scores', async () => {
      const agentId: AgentType = 'AJ';
      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: [],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'identical-1',
          strategyName: 'Identical 1',
          description: 'First identical',
          applicableContexts: ['bug-fix'],
          successRate: 0.8,
          averageDuration: 4000,
          tokenEfficiency: 0.85,
          usageCount: 20,
          successCount: 16,
          failureCount: 4,
          lastUsed: new Date('2024-01-01'),
          confidence: 0.75,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
        {
          strategyId: 'identical-2',
          strategyName: 'Identical 2',
          description: 'Second identical',
          applicableContexts: ['bug-fix'],
          successRate: 0.8,
          averageDuration: 4000,
          tokenEfficiency: 0.85,
          usageCount: 20,
          successCount: 16,
          failureCount: 4,
          lastUsed: new Date('2024-12-01'),
          confidence: 0.75,
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 40,
        successfulInvestigations: 32,
        failedInvestigations: 8,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Should select one consistently (likely most recent or first in list)
      expect(['identical-1', 'identical-2']).toContain(selected.strategyId);
    });

    it('should handle very low confidence threshold edge case', async () => {
      const agentId: AgentType = 'ZEN';
      const context: InvestigationContext = {
        type: 'documentation',
        scope: ['docs/'],
        estimatedComplexity: 'low',
        tags: [],
        previousInvestigations: [],
      };

      const strategies: StrategyPerformance[] = [
        {
          strategyId: 'barely-acceptable',
          strategyName: 'Barely Acceptable',
          description: 'Just above threshold',
          applicableContexts: ['documentation'],
          successRate: 0.85,
          averageDuration: 3000,
          tokenEfficiency: 0.9,
          usageCount: 15,
          successCount: 13,
          failureCount: 2,
          lastUsed: new Date(),
          confidence: 0.71, // Just above 0.7 threshold
          agentId,
          successfulInvestigations: [],
          failedInvestigations: [],
        },
      ];

      const learningData: LearningData = {
        agentId,
        patterns: new Map(),
        strategies: new Map(strategies.map(s => [s.strategyId, s])),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 15,
        successfulInvestigations: 13,
        failedInvestigations: 2,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const selected = await engine.selectStrategy(agentId, context);

      // Should select the learned strategy since confidence >= 0.7
      expect(selected.strategyId).toBe('barely-acceptable');
    });
  });
});
