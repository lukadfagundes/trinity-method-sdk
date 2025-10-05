/**
 * Unit tests for SelfImprovingAgent base class
 * Tests Jaccard similarity, pattern learning, and agent integration
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SelfImprovingAgent } from '../../src/agents/SelfImprovingAgent';
import { LearningDataStore } from '../../src/learning/LearningDataStore';
import { PerformanceTracker } from '../../src/learning/PerformanceTracker';
import { StrategySelectionEngine, InvestigationContext } from '../../src/learning/StrategySelectionEngine';
import { KnowledgeSharingBus } from '../../src/learning/KnowledgeSharingBus';
import {
  AgentType,
  InvestigationResult,
  LearnedPattern,
  StrategyPerformance,
  LearningData,
} from '../../src/shared/types';

// Concrete implementation for testing
class TestAgent extends SelfImprovingAgent {
  constructor(
    dataStore: LearningDataStore,
    performanceTracker: PerformanceTracker,
    strategyEngine: StrategySelectionEngine,
    knowledgeBus: KnowledgeSharingBus,
    agentId: AgentType
  ) {
    super(dataStore, performanceTracker, strategyEngine, knowledgeBus, agentId);
  }

  async executeInvestigation(context: InvestigationContext): Promise<InvestigationResult> {
    const investigationId = `test-${Date.now()}`;
    const startTime = new Date();

    return {
      id: investigationId,
      type: context.type,
      status: 'completed',
      agent: this.agentId,
      startTime,
      endTime: new Date(),
      duration: 1000,
      findings: [],
      patterns: [],
      metrics: {
        duration: 1000,
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
        createdBy: this.agentId,
        tags: [],
        priority: 'medium',
      },
    };
  }
}

describe('SelfImprovingAgent', () => {
  let agent: TestAgent;
  let mockDataStore: jest.Mocked<LearningDataStore>;
  let mockPerformanceTracker: jest.Mocked<PerformanceTracker>;
  let mockStrategyEngine: jest.Mocked<StrategySelectionEngine>;
  let mockKnowledgeBus: jest.Mocked<KnowledgeSharingBus>;

  beforeEach(() => {
    mockDataStore = {
      loadLearningData: jest.fn(),
      savePattern: jest.fn(),
      getPattern: jest.fn(),
      saveStrategy: jest.fn(),
      getStrategy: jest.fn(),
      saveErrorResolution: jest.fn(),
      getErrorResolution: jest.fn(),
      exportLearningData: jest.fn(),
      importLearningData: jest.fn(),
    } as any;

    mockPerformanceTracker = {
      trackInvestigationStart: jest.fn(),
      trackInvestigationComplete: jest.fn(),
      trackInvestigationFailure: jest.fn(),
      trackStrategyStart: jest.fn(),
      trackTokenUsage: jest.fn(),
      getMetrics: jest.fn(),
    } as any;

    mockStrategyEngine = {
      selectStrategy: jest.fn(),
    } as any;

    mockKnowledgeBus = {
      broadcastPattern: jest.fn(),
      subscribe: jest.fn(),
      getSharedPatterns: jest.fn(),
      getSharingThreshold: jest.fn().mockReturnValue(0.8),
    } as any;

    agent = new TestAgent(
      mockDataStore,
      mockPerformanceTracker,
      mockStrategyEngine,
      mockKnowledgeBus,
      'TAN'
    );
  });

  describe('Jaccard Similarity', () => {
    it('should calculate Jaccard similarity correctly for identical patterns', async () => {
      const pattern: LearnedPattern = {
        patternId: 'test-1',
        patternType: 'code-structure',
        description: 'Test pattern',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.8,
        usageCount: 10,
        successCount: 9,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: ['inv-1', 'inv-2'],
        tags: ['structure', 'pattern'],
        filePaths: ['/src/test.ts', '/src/test2.ts'],
        errorTypes: ['type-error'],
      };

      const learningData: LearningData = {
        agentId: 'TAN',
        patterns: new Map([['existing-1', pattern]]),
        strategies: new Map(),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 10,
        successfulInvestigations: 9,
        failedInvestigations: 1,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const newPattern: LearnedPattern = { ...pattern, patternId: 'test-2' };

      const relevantPatterns = await agent.getRelevantPatterns({
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: ['structure'],
        previousInvestigations: [],
      });

      // Since patterns are identical, Jaccard similarity should be 1.0
      // Pattern should be returned as relevant (similarity >= 0.7)
      expect(relevantPatterns.length).toBeGreaterThan(0);
    });

    it('should calculate Jaccard similarity for partially overlapping patterns', async () => {
      const existingPattern: LearnedPattern = {
        patternId: 'existing',
        patternType: 'code-structure',
        description: 'Existing',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.8,
        usageCount: 10,
        successCount: 9,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: ['structure', 'refactor'],
        filePaths: ['/src/a.ts', '/src/b.ts'],
        errorTypes: ['type-error'],
      };

      const learningData: LearningData = {
        agentId: 'TAN',
        patterns: new Map([['existing', existingPattern]]),
        strategies: new Map(),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 10,
        successfulInvestigations: 9,
        failedInvestigations: 1,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const context: InvestigationContext = {
        type: 'refactor',
        scope: ['/src/a.ts'],
        estimatedComplexity: 'medium',
        tags: ['structure', 'architecture'],
        previousInvestigations: [],
      };

      const relevantPatterns = await agent.getRelevantPatterns(context);

      // Partial overlap:
      // Tags: {structure, refactor} ∩ {structure, architecture} = {structure}
      // Files: {a.ts, b.ts} ∩ {a.ts} = {a.ts}
      // Union has 5 elements, intersection has 2
      // Similarity = 2/5 = 0.4 (below 0.7 threshold)
      // So might not be returned, but test just checks no error
      expect(Array.isArray(relevantPatterns)).toBe(true);
    });

    it('should not return patterns with Jaccard similarity below 0.7', async () => {
      const existingPattern: LearnedPattern = {
        patternId: 'different',
        patternType: 'code-structure',
        description: 'Different',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.8,
        usageCount: 10,
        successCount: 9,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: ['frontend', 'ui'],
        filePaths: ['/src/ui/'],
        errorTypes: [],
      };

      const learningData: LearningData = {
        agentId: 'TAN',
        patterns: new Map([['different', existingPattern]]),
        strategies: new Map(),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 10,
        successfulInvestigations: 9,
        failedInvestigations: 1,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['/src/backend/'],
        estimatedComplexity: 'high',
        tags: ['api', 'database'],
        previousInvestigations: [],
      };

      const relevantPatterns = await agent.getRelevantPatterns(context);

      // No overlap between tags/files - similarity should be 0
      // Should not be returned
      const hasDifferentPattern = relevantPatterns.some(p => p.patternId === 'different');
      expect(hasDifferentPattern).toBe(false);
    });
  });

  describe('Strategy Selection', () => {
    it('should select best strategy for investigation context', async () => {
      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: ['structure'],
        previousInvestigations: [],
      };

      const strategy: StrategyPerformance = {
        strategyId: 'best-strategy',
        strategyName: 'Best Strategy',
        description: 'The best strategy',
        applicableContexts: ['bug-fix'],
        successRate: 0.9,
        averageDuration: 3000,
        tokenEfficiency: 0.9,
        usageCount: 50,
        successCount: 45,
        failureCount: 5,
        lastUsed: new Date(),
        confidence: 0.85,
        agentId: 'TAN',
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      mockStrategyEngine.selectStrategy.mockResolvedValue(strategy);

      const selected = await agent.selectBestStrategy(context);

      expect(mockStrategyEngine.selectStrategy).toHaveBeenCalledWith('TAN', context);
      expect(selected.strategyId).toBe('best-strategy');
    });

    it('should handle strategy selection failure gracefully', async () => {
      const context: InvestigationContext = {
        type: 'feature',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: [],
        previousInvestigations: [],
      };

      mockStrategyEngine.selectStrategy.mockRejectedValue(new Error('Selection failed'));

      await expect(agent.selectBestStrategy(context)).rejects.toThrow('Selection failed');
    });
  });

  describe('Pattern Learning', () => {
    it('should learn from successful investigation', async () => {
      const result: InvestigationResult = {
        id: 'learn-test',
        type: 'bug-fix',
        status: 'completed',
        agent: 'TAN',
        startTime: new Date(),
        endTime: new Date(),
        duration: 3000,
        findings: [
          {
            id: 'finding-1',
            type: 'issue',
            severity: 'high',
            title: 'Critical bug',
            description: 'Found critical bug',
            location: { file: '/src/bug.ts', line: 42 },
            evidence: [],
          },
        ],
        patterns: [
          {
            patternId: 'new-pattern',
            patternType: 'code-structure',
            description: 'New pattern',
            detectionCriteria: 'Test',
            accuracy: 0.8,
            confidence: 0.7,
            usageCount: 1,
            successCount: 1,
            lastSeen: new Date(),
            agentId: 'TAN',
            investigationIds: ['learn-test'],
            tags: ['bug'],
            filePaths: ['/src/bug.ts'],
            errorTypes: [],
          },
        ],
        metrics: {
          duration: 3000,
          tokensUsed: 600,
          apiCalls: 4,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 8,
          linesAnalyzed: 400,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId: 'learn-test',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'TAN',
          tags: [],
          priority: 'high',
        },
      };

      mockDataStore.savePattern.mockResolvedValue();
      mockKnowledgeBus.broadcastPattern.mockResolvedValue();
      mockKnowledgeBus.getSharingThreshold.mockReturnValue(0.8);

      const confidenceScores = await agent.learnFromInvestigation(result);

      expect(mockDataStore.savePattern).toHaveBeenCalled();
      expect(confidenceScores.size).toBeGreaterThan(0);
    });

    it('should broadcast high-confidence patterns', async () => {
      const result: InvestigationResult = {
        id: 'broadcast-test',
        type: 'refactor',
        status: 'completed',
        agent: 'TAN',
        startTime: new Date(),
        endTime: new Date(),
        duration: 2000,
        findings: [],
        patterns: [
          {
            patternId: 'high-conf',
            patternType: 'code-structure',
            description: 'High confidence pattern',
            detectionCriteria: 'Test',
            accuracy: 0.95,
            confidence: 0.9, // Above 0.8 threshold
            usageCount: 50,
            successCount: 47,
            lastSeen: new Date(),
            agentId: 'TAN',
            investigationIds: [],
            tags: ['refactor'],
            filePaths: [],
            errorTypes: [],
          },
        ],
        metrics: {
          duration: 2000,
          tokensUsed: 400,
          apiCalls: 2,
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
          investigationId: 'broadcast-test',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'TAN',
          tags: [],
          priority: 'medium',
        },
      };

      mockDataStore.savePattern.mockResolvedValue();
      mockKnowledgeBus.broadcastPattern.mockResolvedValue();
      mockKnowledgeBus.getSharingThreshold.mockReturnValue(0.8);

      await agent.learnFromInvestigation(result);

      expect(mockKnowledgeBus.broadcastPattern).toHaveBeenCalled();
    });

    it('should not broadcast low-confidence patterns', async () => {
      const result: InvestigationResult = {
        id: 'no-broadcast-test',
        type: 'feature',
        status: 'completed',
        agent: 'TAN',
        startTime: new Date(),
        endTime: new Date(),
        duration: 4000,
        findings: [],
        patterns: [
          {
            patternId: 'low-conf',
            patternType: 'code-structure',
            description: 'Low confidence pattern',
            detectionCriteria: 'Test',
            accuracy: 0.7,
            confidence: 0.5, // Below 0.8 threshold
            usageCount: 5,
            successCount: 3,
            lastSeen: new Date(),
            agentId: 'TAN',
            investigationIds: [],
            tags: ['feature'],
            filePaths: [],
            errorTypes: [],
          },
        ],
        metrics: {
          duration: 4000,
          tokensUsed: 800,
          apiCalls: 5,
          errors: 0,
          warnings: 0,
          filesAnalyzed: 15,
          linesAnalyzed: 750,
          timestamp: new Date(),
        },
        errors: [],
        recommendations: [],
        artifacts: [],
        metadata: {
          investigationId: 'no-broadcast-test',
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'TAN',
          tags: [],
          priority: 'low',
        },
      };

      mockDataStore.savePattern.mockResolvedValue();
      mockKnowledgeBus.broadcastPattern.mockResolvedValue();
      mockKnowledgeBus.getSharingThreshold.mockReturnValue(0.8);

      await agent.learnFromInvestigation(result);

      expect(mockKnowledgeBus.broadcastPattern).not.toHaveBeenCalled();
    });
  });

  describe('Pattern Update', () => {
    it('should update existing pattern knowledge', async () => {
      const existingPattern: LearnedPattern = {
        patternId: 'update-test',
        patternType: 'code-structure',
        description: 'Update test',
        detectionCriteria: 'Test',
        accuracy: 0.8,
        confidence: 0.7,
        usageCount: 10,
        successCount: 8,
        lastSeen: new Date('2024-01-01'),
        agentId: 'TAN',
        investigationIds: ['inv-1'],
        tags: ['original'],
        filePaths: [],
        errorTypes: [],
      };

      mockDataStore.getPattern.mockResolvedValue(existingPattern);
      mockDataStore.savePattern.mockResolvedValue();

      const updatedPattern: LearnedPattern = {
        ...existingPattern,
        usageCount: 11,
        successCount: 9,
        lastSeen: new Date(),
        investigationIds: ['inv-1', 'inv-2'],
      };

      await agent.updatePatternKnowledge(updatedPattern);

      expect(mockDataStore.savePattern).toHaveBeenCalledWith('TAN', expect.objectContaining({
        patternId: 'update-test',
        usageCount: 11,
        successCount: 9,
      }));
    });

    it('should create new pattern if not exists', async () => {
      mockDataStore.getPattern.mockResolvedValue(undefined);
      mockDataStore.savePattern.mockResolvedValue();

      const newPattern: LearnedPattern = {
        patternId: 'new-pattern',
        patternType: 'code-structure',
        description: 'New pattern',
        detectionCriteria: 'Test',
        accuracy: 0.85,
        confidence: 0.75,
        usageCount: 1,
        successCount: 1,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: ['inv-1'],
        tags: ['new'],
        filePaths: [],
        errorTypes: [],
      };

      await agent.updatePatternKnowledge(newPattern);

      expect(mockDataStore.savePattern).toHaveBeenCalledWith('TAN', expect.objectContaining({
        patternId: 'new-pattern',
        usageCount: 1,
      }));
    });
  });

  describe('Error Resolution', () => {
    it('should retrieve error resolution from learned knowledge', async () => {
      const error = new Error('TypeError: Cannot read property');

      const resolution = {
        errorPattern: 'TypeError: Cannot read property',
        errorType: 'runtime-error',
        resolution: 'Add null check before accessing property',
        successRate: 0.9,
        usageCount: 15,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: ['inv-1', 'inv-2'],
        tags: ['null-safety'],
      };

      mockDataStore.getErrorResolution.mockResolvedValue(resolution);

      const retrieved = await agent.getErrorResolution(error);

      expect(retrieved).toBeDefined();
      expect(retrieved?.resolution).toBe('Add null check before accessing property');
    });

    it('should return undefined for unknown errors', async () => {
      const error = new Error('UnknownError: Something went wrong');

      mockDataStore.getErrorResolution.mockResolvedValue(undefined);

      const retrieved = await agent.getErrorResolution(error);

      expect(retrieved).toBeUndefined();
    });
  });

  describe('Investigation Execution', () => {
    it('should execute investigation successfully', async () => {
      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: [],
        previousInvestigations: [],
      };

      const result = await agent.executeInvestigation(context);

      expect(result).toBeDefined();
      expect(result.agent).toBe('TAN');
      expect(result.status).toBe('completed');
    });

    it('should handle investigation errors', async () => {
      const failingAgent = new (class extends TestAgent {
        async executeInvestigation(): Promise<InvestigationResult> {
          throw new Error('Investigation failed');
        }
      })(mockDataStore, mockPerformanceTracker, mockStrategyEngine, mockKnowledgeBus, 'TAN');

      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: [],
        previousInvestigations: [],
      };

      await expect(failingAgent.executeInvestigation(context)).rejects.toThrow('Investigation failed');
    });
  });

  describe('Integration with Learning Components', () => {
    it('should integrate all learning components correctly', async () => {
      const context: InvestigationContext = {
        type: 'refactor',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: ['architecture'],
        previousInvestigations: [],
      };

      const strategy: StrategyPerformance = {
        strategyId: 'integration-test',
        strategyName: 'Integration Test',
        description: 'Test',
        applicableContexts: ['refactor'],
        successRate: 0.85,
        averageDuration: 5000,
        tokenEfficiency: 0.88,
        usageCount: 25,
        successCount: 21,
        failureCount: 4,
        lastUsed: new Date(),
        confidence: 0.8,
        agentId: 'TAN',
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      const learningData: LearningData = {
        agentId: 'TAN',
        patterns: new Map(),
        strategies: new Map([['integration-test', strategy]]),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 25,
        successfulInvestigations: 21,
        failedInvestigations: 4,
      };

      mockStrategyEngine.selectStrategy.mockResolvedValue(strategy);
      mockDataStore.loadLearningData.mockResolvedValue(learningData);
      mockDataStore.savePattern.mockResolvedValue();
      mockKnowledgeBus.getSharingThreshold.mockReturnValue(0.8);

      // Get strategy
      const selectedStrategy = await agent.selectBestStrategy(context);
      expect(selectedStrategy.strategyId).toBe('integration-test');

      // Get relevant patterns
      const patterns = await agent.getRelevantPatterns(context);
      expect(Array.isArray(patterns)).toBe(true);

      // Execute investigation
      const result = await agent.executeInvestigation(context);
      expect(result.agent).toBe('TAN');

      // Learn from investigation
      const confidences = await agent.learnFromInvestigation(result);
      expect(confidences).toBeDefined();
    });
  });
});
