/**
 * Unit tests for KnowledgeSharingBus
 * Tests cross-agent pattern sharing, validation, and subscription mechanisms
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { KnowledgeSharingBus } from '../../src/learning/KnowledgeSharingBus';
import { LearningDataStore } from '../../src/learning/LearningDataStore';
import {
  AgentType,
  LearnedPattern,
  LearningData,
} from '../../src/shared/types';

describe('KnowledgeSharingBus', () => {
  let sharingBus: KnowledgeSharingBus;
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

    sharingBus = new KnowledgeSharingBus(mockDataStore);
  });

  describe('Pattern Broadcasting', () => {
    it('should broadcast high-confidence pattern to subscribed agents', async () => {
      const sourceAgent: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'broadcast-test-1',
        patternType: 'code-structure',
        description: 'High confidence structure pattern',
        detectionCriteria: 'Test criteria',
        accuracy: 0.9,
        confidence: 0.85, // Above 0.8 threshold
        usageCount: 30,
        successCount: 27,
        lastSeen: new Date(),
        agentId: sourceAgent,
        investigationIds: ['inv-1', 'inv-2'],
        tags: ['structure', 'pattern'],
        filePaths: ['/src/test.ts'],
        errorTypes: [],
      };

      // Subscribe AJ to receive code-structure patterns
      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('AJ', (receivedPattern) => {
        receivedPatterns.push(receivedPattern);
      });

      mockDataStore.savePattern.mockResolvedValue();

      await sharingBus.broadcastPattern(pattern, sourceAgent);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 10));

      // AJ should receive the pattern (accepts code-structure)
      expect(receivedPatterns.length).toBe(1);
      expect(receivedPatterns[0].patternId).toBe('broadcast-test-1');
    });

    it('should not broadcast low-confidence patterns', async () => {
      const sourceAgent: AgentType = 'ZEN';
      const pattern: LearnedPattern = {
        patternId: 'low-confidence',
        patternType: 'research-source',
        description: 'Low confidence pattern',
        detectionCriteria: 'Test',
        accuracy: 0.7,
        confidence: 0.5, // Below 0.8 threshold
        usageCount: 5,
        successCount: 3,
        lastSeen: new Date(),
        agentId: sourceAgent,
        investigationIds: [],
        tags: ['research'],
        filePaths: [],
        errorTypes: [],
      };

      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('INO', (receivedPattern) => {
        receivedPatterns.push(receivedPattern);
      });

      await sharingBus.broadcastPattern(pattern, sourceAgent);

      await new Promise(resolve => setTimeout(resolve, 10));

      // Pattern should not be broadcast due to low confidence
      expect(receivedPatterns.length).toBe(0);
    });

    it('should not broadcast pattern to source agent', async () => {
      const sourceAgent: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'self-broadcast-test',
        patternType: 'code-structure',
        description: 'Self broadcast test',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.85,
        usageCount: 20,
        successCount: 18,
        lastSeen: new Date(),
        agentId: sourceAgent,
        investigationIds: [],
        tags: ['test'],
        filePaths: [],
        errorTypes: [],
      };

      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('TAN', (receivedPattern) => {
        receivedPatterns.push(receivedPattern);
      });

      mockDataStore.savePattern.mockResolvedValue();

      await sharingBus.broadcastPattern(pattern, sourceAgent);

      await new Promise(resolve => setTimeout(resolve, 10));

      // TAN should not receive its own pattern
      expect(receivedPatterns.length).toBe(0);
    });
  });

  describe('Pattern Validation', () => {
    it('should validate TAN accepts only code-structure patterns', async () => {
      const validPattern: LearnedPattern = {
        patternId: 'tan-valid',
        patternType: 'code-structure',
        description: 'Valid for TAN',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.85,
        usageCount: 15,
        successCount: 14,
        lastSeen: new Date(),
        agentId: 'AJ',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      const invalidPattern: LearnedPattern = {
        ...validPattern,
        patternId: 'tan-invalid',
        patternType: 'research-source',
      };

      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('TAN', (pattern) => {
        receivedPatterns.push(pattern);
      });

      mockDataStore.savePattern.mockResolvedValue();

      await sharingBus.broadcastPattern(validPattern, 'AJ');
      await sharingBus.broadcastPattern(invalidPattern, 'ZEN');

      await new Promise(resolve => setTimeout(resolve, 10));

      // TAN should only receive code-structure pattern
      expect(receivedPatterns.length).toBe(1);
      expect(receivedPatterns[0].patternType).toBe('code-structure');
    });

    it('should validate ZEN accepts research-source and validation-rule patterns', async () => {
      const researchPattern: LearnedPattern = {
        patternId: 'zen-research',
        patternType: 'research-source',
        description: 'Research pattern',
        detectionCriteria: 'Test',
        accuracy: 0.85,
        confidence: 0.82,
        usageCount: 12,
        successCount: 10,
        lastSeen: new Date(),
        agentId: 'INO',
        investigationIds: [],
        tags: ['research'],
        filePaths: [],
        errorTypes: [],
      };

      const validationPattern: LearnedPattern = {
        patternId: 'zen-validation',
        patternType: 'validation-rule',
        description: 'Validation pattern',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.88,
        usageCount: 18,
        successCount: 16,
        lastSeen: new Date(),
        agentId: 'JUNO',
        investigationIds: [],
        tags: ['validation'],
        filePaths: [],
        errorTypes: [],
      };

      const codePattern: LearnedPattern = {
        patternId: 'zen-code',
        patternType: 'code-structure',
        description: 'Code pattern',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.85,
        usageCount: 20,
        successCount: 18,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: ['code'],
        filePaths: [],
        errorTypes: [],
      };

      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('ZEN', (pattern) => {
        receivedPatterns.push(pattern);
      });

      mockDataStore.savePattern.mockResolvedValue();

      await sharingBus.broadcastPattern(researchPattern, 'INO');
      await sharingBus.broadcastPattern(validationPattern, 'JUNO');
      await sharingBus.broadcastPattern(codePattern, 'TAN');

      await new Promise(resolve => setTimeout(resolve, 10));

      // ZEN should receive research-source and validation-rule, but not code-structure
      expect(receivedPatterns.length).toBe(2);
      expect(receivedPatterns.map(p => p.patternType)).toContain('research-source');
      expect(receivedPatterns.map(p => p.patternType)).toContain('validation-rule');
      expect(receivedPatterns.map(p => p.patternType)).not.toContain('code-structure');
    });

    it('should validate INO accepts all pattern types', async () => {
      const patterns: LearnedPattern[] = [
        {
          patternId: 'ino-code',
          patternType: 'code-structure',
          description: 'Code',
          detectionCriteria: 'Test',
          accuracy: 0.9,
          confidence: 0.85,
          usageCount: 10,
          successCount: 9,
          lastSeen: new Date(),
          agentId: 'TAN',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'ino-research',
          patternType: 'research-source',
          description: 'Research',
          detectionCriteria: 'Test',
          accuracy: 0.85,
          confidence: 0.82,
          usageCount: 8,
          successCount: 7,
          lastSeen: new Date(),
          agentId: 'ZEN',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'ino-validation',
          patternType: 'validation-rule',
          description: 'Validation',
          detectionCriteria: 'Test',
          accuracy: 0.88,
          confidence: 0.86,
          usageCount: 12,
          successCount: 11,
          lastSeen: new Date(),
          agentId: 'JUNO',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'ino-anti',
          patternType: 'anti-pattern',
          description: 'Anti-pattern',
          detectionCriteria: 'Test',
          accuracy: 0.92,
          confidence: 0.9,
          usageCount: 15,
          successCount: 14,
          lastSeen: new Date(),
          agentId: 'AJ',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
      ];

      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('INO', (pattern) => {
        receivedPatterns.push(pattern);
      });

      mockDataStore.savePattern.mockResolvedValue();

      for (const pattern of patterns) {
        await sharingBus.broadcastPattern(pattern, pattern.agentId);
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // INO should receive all pattern types
      expect(receivedPatterns.length).toBe(4);
      expect(receivedPatterns.map(p => p.patternType)).toContain('code-structure');
      expect(receivedPatterns.map(p => p.patternType)).toContain('research-source');
      expect(receivedPatterns.map(p => p.patternType)).toContain('validation-rule');
      expect(receivedPatterns.map(p => p.patternType)).toContain('anti-pattern');
    });

    it('should validate JUNO accepts validation-rule and anti-pattern patterns', async () => {
      const patterns: LearnedPattern[] = [
        {
          patternId: 'juno-validation',
          patternType: 'validation-rule',
          description: 'Validation',
          detectionCriteria: 'Test',
          accuracy: 0.9,
          confidence: 0.87,
          usageCount: 14,
          successCount: 13,
          lastSeen: new Date(),
          agentId: 'INO',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'juno-anti',
          patternType: 'anti-pattern',
          description: 'Anti',
          detectionCriteria: 'Test',
          accuracy: 0.92,
          confidence: 0.9,
          usageCount: 18,
          successCount: 17,
          lastSeen: new Date(),
          agentId: 'AJ',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'juno-code',
          patternType: 'code-structure',
          description: 'Code',
          detectionCriteria: 'Test',
          accuracy: 0.88,
          confidence: 0.85,
          usageCount: 16,
          successCount: 14,
          lastSeen: new Date(),
          agentId: 'TAN',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
      ];

      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('JUNO', (pattern) => {
        receivedPatterns.push(pattern);
      });

      mockDataStore.savePattern.mockResolvedValue();

      for (const pattern of patterns) {
        await sharingBus.broadcastPattern(pattern, pattern.agentId);
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // JUNO should receive validation-rule and anti-pattern only
      expect(receivedPatterns.length).toBe(2);
      expect(receivedPatterns.map(p => p.patternType)).toContain('validation-rule');
      expect(receivedPatterns.map(p => p.patternType)).toContain('anti-pattern');
      expect(receivedPatterns.map(p => p.patternType)).not.toContain('code-structure');
    });

    it('should validate AJ accepts code-structure and anti-pattern patterns', async () => {
      const patterns: LearnedPattern[] = [
        {
          patternId: 'aj-code',
          patternType: 'code-structure',
          description: 'Code',
          detectionCriteria: 'Test',
          accuracy: 0.9,
          confidence: 0.86,
          usageCount: 12,
          successCount: 11,
          lastSeen: new Date(),
          agentId: 'TAN',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'aj-anti',
          patternType: 'anti-pattern',
          description: 'Anti',
          detectionCriteria: 'Test',
          accuracy: 0.93,
          confidence: 0.91,
          usageCount: 20,
          successCount: 19,
          lastSeen: new Date(),
          agentId: 'JUNO',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'aj-research',
          patternType: 'research-source',
          description: 'Research',
          detectionCriteria: 'Test',
          accuracy: 0.85,
          confidence: 0.82,
          usageCount: 10,
          successCount: 8,
          lastSeen: new Date(),
          agentId: 'ZEN',
          investigationIds: [],
          tags: [],
          filePaths: [],
          errorTypes: [],
        },
      ];

      const receivedPatterns: LearnedPattern[] = [];
      await sharingBus.subscribe('AJ', (pattern) => {
        receivedPatterns.push(pattern);
      });

      mockDataStore.savePattern.mockResolvedValue();

      for (const pattern of patterns) {
        await sharingBus.broadcastPattern(pattern, pattern.agentId);
      }

      await new Promise(resolve => setTimeout(resolve, 10));

      // AJ should receive code-structure and anti-pattern only
      expect(receivedPatterns.length).toBe(2);
      expect(receivedPatterns.map(p => p.patternType)).toContain('code-structure');
      expect(receivedPatterns.map(p => p.patternType)).toContain('anti-pattern');
      expect(receivedPatterns.map(p => p.patternType)).not.toContain('research-source');
    });
  });

  describe('Subscription Management', () => {
    it('should allow multiple subscribers for the same agent', async () => {
      const pattern: LearnedPattern = {
        patternId: 'multi-sub-test',
        patternType: 'code-structure',
        description: 'Multi subscriber test',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.85,
        usageCount: 15,
        successCount: 14,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      const received1: LearnedPattern[] = [];
      const received2: LearnedPattern[] = [];

      await sharingBus.subscribe('AJ', (p) => received1.push(p));
      await sharingBus.subscribe('AJ', (p) => received2.push(p));

      mockDataStore.savePattern.mockResolvedValue();

      await sharingBus.broadcastPattern(pattern, 'TAN');

      await new Promise(resolve => setTimeout(resolve, 10));

      // Both subscribers should receive the pattern
      expect(received1.length).toBe(1);
      expect(received2.length).toBe(1);
    });

    it('should support unsubscribe functionality', async () => {
      const pattern: LearnedPattern = {
        patternId: 'unsub-test',
        patternType: 'validation-rule',
        description: 'Unsubscribe test',
        detectionCriteria: 'Test',
        accuracy: 0.88,
        confidence: 0.84,
        usageCount: 10,
        successCount: 9,
        lastSeen: new Date(),
        agentId: 'INO',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      const received: LearnedPattern[] = [];
      const unsubscribe = await sharingBus.subscribe('JUNO', (p) => received.push(p));

      mockDataStore.savePattern.mockResolvedValue();

      // First broadcast - should receive
      await sharingBus.broadcastPattern(pattern, 'INO');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(received.length).toBe(1);

      // Unsubscribe
      unsubscribe();

      // Second broadcast - should not receive
      const pattern2: LearnedPattern = { ...pattern, patternId: 'unsub-test-2' };
      await sharingBus.broadcastPattern(pattern2, 'INO');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(received.length).toBe(1); // Still only 1
    });
  });

  describe('Threshold Configuration', () => {
    it('should use configurable confidence threshold', async () => {
      const customBus = new KnowledgeSharingBus(mockDataStore, 0.9); // Higher threshold

      const pattern: LearnedPattern = {
        patternId: 'threshold-test',
        patternType: 'anti-pattern',
        description: 'Threshold test',
        detectionCriteria: 'Test',
        accuracy: 0.88,
        confidence: 0.85, // Above 0.8 but below 0.9
        usageCount: 20,
        successCount: 17,
        lastSeen: new Date(),
        agentId: 'AJ',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      const received: LearnedPattern[] = [];
      await customBus.subscribe('JUNO', (p) => received.push(p));

      await customBus.broadcastPattern(pattern, 'AJ');
      await new Promise(resolve => setTimeout(resolve, 10));

      // Should not broadcast due to higher threshold
      expect(received.length).toBe(0);
    });

    it('should expose sharing threshold getter', () => {
      expect(sharingBus.getSharingThreshold()).toBe(0.8);

      const customBus = new KnowledgeSharingBus(mockDataStore, 0.75);
      expect(customBus.getSharingThreshold()).toBe(0.75);
    });
  });

  describe('Pattern Retrieval', () => {
    it('should retrieve relevant patterns for agent', async () => {
      const agentId: AgentType = 'TAN';
      const patterns = new Map<string, LearnedPattern>([
        ['pattern-1', {
          patternId: 'pattern-1',
          patternType: 'code-structure',
          description: 'Pattern 1',
          detectionCriteria: 'Test',
          accuracy: 0.9,
          confidence: 0.85,
          usageCount: 15,
          successCount: 14,
          lastSeen: new Date(),
          agentId: 'AJ',
          investigationIds: [],
          tags: ['structure'],
          filePaths: [],
          errorTypes: [],
        }],
        ['pattern-2', {
          patternId: 'pattern-2',
          patternType: 'research-source',
          description: 'Pattern 2',
          detectionCriteria: 'Test',
          accuracy: 0.85,
          confidence: 0.82,
          usageCount: 10,
          successCount: 8,
          lastSeen: new Date(),
          agentId: 'ZEN',
          investigationIds: [],
          tags: ['research'],
          filePaths: [],
          errorTypes: [],
        }],
      ]);

      const learningData: LearningData = {
        agentId,
        patterns,
        strategies: new Map(),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 25,
        successfulInvestigations: 22,
        failedInvestigations: 3,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const retrieved = await sharingBus.getSharedPatterns(agentId);

      // TAN should only get code-structure patterns
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].patternType).toBe('code-structure');
    });

    it('should filter patterns by tags', async () => {
      const agentId: AgentType = 'INO';
      const patterns = new Map<string, LearnedPattern>([
        ['pattern-1', {
          patternId: 'pattern-1',
          patternType: 'validation-rule',
          description: 'Context pattern',
          detectionCriteria: 'Test',
          accuracy: 0.9,
          confidence: 0.86,
          usageCount: 12,
          successCount: 11,
          lastSeen: new Date(),
          agentId: 'JUNO',
          investigationIds: [],
          tags: ['context', 'scope'],
          filePaths: [],
          errorTypes: [],
        }],
        ['pattern-2', {
          patternId: 'pattern-2',
          patternType: 'anti-pattern',
          description: 'Quality pattern',
          detectionCriteria: 'Test',
          accuracy: 0.88,
          confidence: 0.84,
          usageCount: 10,
          successCount: 9,
          lastSeen: new Date(),
          agentId: 'JUNO',
          investigationIds: [],
          tags: ['quality', 'audit'],
          filePaths: [],
          errorTypes: [],
        }],
      ]);

      const learningData: LearningData = {
        agentId,
        patterns,
        strategies: new Map(),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 22,
        successfulInvestigations: 20,
        failedInvestigations: 2,
      };

      mockDataStore.loadLearningData.mockResolvedValue(learningData);

      const retrieved = await sharingBus.getSharedPatterns(agentId, ['context']);

      // Should only get patterns with 'context' tag
      expect(retrieved.length).toBe(1);
      expect(retrieved[0].tags).toContain('context');
    });
  });

  describe('Error Handling', () => {
    it('should handle data store errors gracefully', async () => {
      const agentId: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'error-test',
        patternType: 'code-structure',
        description: 'Error test',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.85,
        usageCount: 10,
        successCount: 9,
        lastSeen: new Date(),
        agentId,
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      mockDataStore.savePattern.mockRejectedValue(new Error('Database error'));

      const received: LearnedPattern[] = [];
      await sharingBus.subscribe('AJ', (p) => received.push(p));

      // Should not throw
      await expect(sharingBus.broadcastPattern(pattern, agentId)).resolves.not.toThrow();
    });

    it('should handle subscriber callback errors', async () => {
      const pattern: LearnedPattern = {
        patternId: 'callback-error',
        patternType: 'validation-rule',
        description: 'Callback error test',
        detectionCriteria: 'Test',
        accuracy: 0.88,
        confidence: 0.84,
        usageCount: 12,
        successCount: 10,
        lastSeen: new Date(),
        agentId: 'INO',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      await sharingBus.subscribe('JUNO', () => {
        throw new Error('Callback error');
      });

      mockDataStore.savePattern.mockResolvedValue();

      // Should not throw even if callback throws
      await expect(sharingBus.broadcastPattern(pattern, 'INO')).resolves.not.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle large number of subscribers efficiently', async () => {
      const pattern: LearnedPattern = {
        patternId: 'perf-test',
        patternType: 'code-structure',
        description: 'Performance test',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.85,
        usageCount: 100,
        successCount: 90,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      // Subscribe 100 times
      const subscribers: LearnedPattern[][] = [];
      for (let i = 0; i < 100; i++) {
        const received: LearnedPattern[] = [];
        subscribers.push(received);
        await sharingBus.subscribe('AJ', (p) => received.push(p));
      }

      mockDataStore.savePattern.mockResolvedValue();

      const start = Date.now();
      await sharingBus.broadcastPattern(pattern, 'TAN');
      await new Promise(resolve => setTimeout(resolve, 50));
      const duration = Date.now() - start;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(1000);

      // All subscribers should receive
      expect(subscribers.every(s => s.length === 1)).toBe(true);
    });
  });
});
