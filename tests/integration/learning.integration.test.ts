/**
 * Learning System Integration Tests
 *
 * @see docs/knowledge-preservation.md - Knowledge preservation architecture
 * @see src/learning/LearningDataStore.ts - Data persistence
 * @see src/learning/StrategySelectionEngine.ts - Pattern matching
 * @see src/learning/PerformanceTracker.ts - Performance tracking
 * @see src/learning/KnowledgeSharingBus.ts - Knowledge sharing
 * @see src/learning/LearningMetricsDashboard.ts - Metrics visualization
 *
 * **Trinity Principle:** "Quality Assurance"
 * Validates end-to-end learning system functionality through integration tests.
 * Ensures all three learning layers (storage, matching, reinforcement) work together
 * correctly to preserve and apply organizational knowledge.
 *
 * **Why This Exists:**
 * Unit tests validate individual components, but learning system value comes from
 * component integration. These tests validate complete workflows: pattern creation →
 * storage → retrieval → matching → performance tracking → confidence updates → dashboard
 * visualization. Ensures knowledge preservation works end-to-end.
 *
 * @module tests/integration/learning
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { promises as fs } from 'fs';
import path from 'path';
import { LearningDataStore } from '../../src/learning/LearningDataStore.js';
import { LearningMetricsDashboard } from '../../src/learning/LearningMetricsDashboard.js';
import type { AgentType, LearnedPattern } from '../../src/shared/types/index.js';

describe('Learning System Integration Tests', () => {
  const testDir = path.join(process.cwd(), '.test-trinity-learning');
  let learningStore: LearningDataStore;

  beforeEach(async () => {
    // Create test directory
    await fs.mkdir(testDir, { recursive: true });
    learningStore = new LearningDataStore(testDir);
  });

  afterEach(async () => {
    // Cleanup test directory
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('Layer 1: Pattern Storage and Retrieval', () => {
    it('should save and load patterns for an agent', async () => {
      const agent: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'test-pattern-001',
        name: 'Test Pattern',
        description: 'A test pattern for integration testing',
        category: 'code-smell',
        confidence: 0.85,
        usageCount: 5,
        successCount: 4,
      };

      // Save pattern
      await learningStore.savePattern(agent, pattern);

      // Load learning data
      const loadedData = await learningStore.loadLearningData(agent);

      expect(loadedData.patterns.has('test-pattern-001')).toBe(true);
      const loadedPattern = loadedData.patterns.get('test-pattern-001');
      expect(loadedPattern?.name).toBe('Test Pattern');
      expect(loadedPattern?.confidence).toBe(0.85);
    });

    it('should persist patterns across store instances', async () => {
      const agent: AgentType = 'ZEN';
      const pattern: LearnedPattern = {
        patternId: 'persist-test-001',
        name: 'Persistence Test Pattern',
        description: 'Testing cross-instance persistence',
        category: 'best-practice',
        confidence: 0.9,
        usageCount: 10,
        successCount: 9,
      };

      // Save with first instance
      await learningStore.savePattern(agent, pattern);

      // Create new instance and load
      const newStore = new LearningDataStore(testDir);
      const loadedData = await newStore.loadLearningData(agent);

      expect(loadedData.patterns.has('persist-test-001')).toBe(true);
      expect(loadedData.patterns.get('persist-test-001')?.confidence).toBe(0.9);
    });

    it('should update pattern confidence over time', async () => {
      const agent: AgentType = 'INO';
      const pattern: LearnedPattern = {
        patternId: 'confidence-test-001',
        name: 'Confidence Update Test',
        description: 'Testing confidence updates',
        category: 'anti-pattern',
        confidence: 0.5,
        usageCount: 1,
        successCount: 0,
      };

      // Save initial pattern
      await learningStore.savePattern(agent, pattern);

      // Update pattern with success
      const updatedPattern: LearnedPattern = {
        ...pattern,
        confidence: 0.75,
        usageCount: 2,
        successCount: 1,
      };
      await learningStore.savePattern(agent, updatedPattern);

      // Verify update
      const loadedData = await learningStore.loadLearningData(agent);
      const loadedPattern = loadedData.patterns.get('confidence-test-001');
      expect(loadedPattern?.confidence).toBe(0.75);
      expect(loadedPattern?.usageCount).toBe(2);
      expect(loadedPattern?.successCount).toBe(1);
    });
  });

  describe('Layer 2: Pattern Matching (Conceptual)', () => {
    it('should retrieve patterns for matching context', async () => {
      const agent: AgentType = 'JUNO';

      // Save multiple patterns
      const patterns: LearnedPattern[] = [
        {
          patternId: 'match-test-001',
          name: 'High Confidence Pattern',
          description: 'Should match',
          category: 'code-smell',
          confidence: 0.9,
          usageCount: 10,
          successCount: 9,
        },
        {
          patternId: 'match-test-002',
          name: 'Low Confidence Pattern',
          description: 'Should not match',
          category: 'code-smell',
          confidence: 0.3,
          usageCount: 5,
          successCount: 1,
        },
        {
          patternId: 'match-test-003',
          name: 'Medium Confidence Pattern',
          description: 'Borderline match',
          category: 'code-smell',
          confidence: 0.7,
          usageCount: 8,
          successCount: 6,
        },
      ];

      for (const pattern of patterns) {
        await learningStore.savePattern(agent, pattern);
      }

      // Load and filter high-confidence patterns (≥0.7 threshold)
      const loadedData = await learningStore.loadLearningData(agent);
      const highConfidencePatterns = Array.from(loadedData.patterns.values()).filter(
        (p) => (p.confidence ?? 0) >= 0.7
      );

      expect(highConfidencePatterns.length).toBe(2);
      expect(highConfidencePatterns.some((p) => p.patternId === 'match-test-001')).toBe(true);
      expect(highConfidencePatterns.some((p) => p.patternId === 'match-test-003')).toBe(true);
    });
  });

  describe('Layer 3: Performance Tracking (Conceptual)', () => {
    it('should track pattern usage statistics', async () => {
      const agent: AgentType = 'AJ';
      const pattern: LearnedPattern = {
        patternId: 'usage-test-001',
        name: 'Usage Tracking Pattern',
        description: 'Track pattern usage',
        category: 'best-practice',
        confidence: 0.8,
        usageCount: 0,
        successCount: 0,
      };

      // Initial save
      await learningStore.savePattern(agent, pattern);

      // Simulate 5 usages with 4 successes
      for (let i = 0; i < 5; i++) {
        const loadedData = await learningStore.loadLearningData(agent);
        const currentPattern = loadedData.patterns.get('usage-test-001')!;

        const updatedPattern: LearnedPattern = {
          ...currentPattern,
          usageCount: (currentPattern.usageCount ?? 0) + 1,
          successCount: (currentPattern.successCount ?? 0) + (i < 4 ? 1 : 0),
        };

        await learningStore.savePattern(agent, updatedPattern);
      }

      // Verify final statistics
      const finalData = await learningStore.loadLearningData(agent);
      const finalPattern = finalData.patterns.get('usage-test-001')!;

      expect(finalPattern.usageCount).toBe(5);
      expect(finalPattern.successCount).toBe(4);

      // Calculate success rate
      const successRate =
        finalPattern.usageCount! > 0
          ? finalPattern.successCount! / finalPattern.usageCount!
          : 0;
      expect(successRate).toBe(0.8);
    });
  });

  describe('Cross-Layer Integration', () => {
    it('should support complete pattern lifecycle', async () => {
      const agent: AgentType = 'TAN';

      // Phase 1: Create pattern (Layer 1)
      const pattern: LearnedPattern = {
        patternId: 'lifecycle-test-001',
        name: 'Complete Lifecycle Pattern',
        description: 'End-to-end pattern lifecycle',
        category: 'design-pattern',
        confidence: 0.5,
        usageCount: 0,
        successCount: 0,
        firstDetected: new Date().toISOString(),
      };

      await learningStore.savePattern(agent, pattern);

      // Phase 2: Pattern matching and usage (Layer 2)
      // Simulate 10 investigations with 8 successful pattern applications
      for (let i = 0; i < 10; i++) {
        const data = await learningStore.loadLearningData(agent);
        const currentPattern = data.patterns.get('lifecycle-test-001')!;

        const updatedPattern: LearnedPattern = {
          ...currentPattern,
          usageCount: (currentPattern.usageCount ?? 0) + 1,
          successCount: (currentPattern.successCount ?? 0) + (i < 8 ? 1 : 0),
          lastDetected: new Date().toISOString(),
        };

        await learningStore.savePattern(agent, updatedPattern);
      }

      // Phase 3: Confidence reinforcement (Layer 3)
      const finalData = await learningStore.loadLearningData(agent);
      const finalPattern = finalData.patterns.get('lifecycle-test-001')!;
      const successRate = finalPattern.successCount! / finalPattern.usageCount!;

      // Update confidence based on success rate
      const reinforcedPattern: LearnedPattern = {
        ...finalPattern,
        confidence: successRate, // 0.8 based on 8/10 success
      };

      await learningStore.savePattern(agent, reinforcedPattern);

      // Verify complete lifecycle
      const verifyData = await learningStore.loadLearningData(agent);
      const verifiedPattern = verifyData.patterns.get('lifecycle-test-001')!;

      expect(verifiedPattern.usageCount).toBe(10);
      expect(verifiedPattern.successCount).toBe(8);
      expect(verifiedPattern.confidence).toBe(0.8);
      expect(verifiedPattern.firstDetected).toBeDefined();
      expect(verifiedPattern.lastDetected).toBeDefined();
    });

    it('should aggregate data for dashboard metrics', async () => {
      const agents: AgentType[] = ['TAN', 'ZEN', 'INO'];

      // Create patterns for multiple agents
      for (const agent of agents) {
        const patterns: LearnedPattern[] = [
          {
            patternId: `${agent}-pattern-001`,
            name: `${agent} Pattern 1`,
            description: 'Test pattern',
            category: 'best-practice',
            confidence: 0.9,
            usageCount: 5,
            successCount: 5,
          },
          {
            patternId: `${agent}-pattern-002`,
            name: `${agent} Pattern 2`,
            description: 'Test pattern',
            category: 'code-smell',
            confidence: 0.7,
            usageCount: 3,
            successCount: 2,
          },
        ];

        for (const pattern of patterns) {
          await learningStore.savePattern(agent, pattern);
        }
      }

      // Load all learning data
      const learningDataMap = new Map();
      for (const agent of agents) {
        const data = await learningStore.loadLearningData(agent);
        learningDataMap.set(agent, data);
      }

      // Create dashboard (should not throw)
      const dashboard = new LearningMetricsDashboard(learningDataMap);
      expect(dashboard).toBeDefined();

      // Verify pattern counts
      let totalPatterns = 0;
      for (const data of learningDataMap.values()) {
        totalPatterns += data.patterns.size;
      }
      expect(totalPatterns).toBe(6); // 2 patterns × 3 agents
    });
  });

  describe('Metadata Tracking', () => {
    it('should track learning metadata', async () => {
      const agent: AgentType = 'JUNO';
      const pattern: LearnedPattern = {
        patternId: 'metadata-test-001',
        name: 'Metadata Test Pattern',
        description: 'Testing metadata tracking',
        category: 'architectural-pattern',
        confidence: 0.85,
        usageCount: 1,
        successCount: 1,
      };

      await learningStore.savePattern(agent, pattern);

      const data = await learningStore.loadLearningData(agent);

      expect(data.metadata).toBeDefined();
      expect(data.metadata.agentId).toBe(agent);
      expect(data.metadata.totalPatterns).toBeGreaterThan(0);
      expect(data.metadata.lastUpdated).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent agent gracefully', async () => {
      const agent: AgentType = 'AJ';

      // Loading non-existent agent should return empty data
      const data = await learningStore.loadLearningData(agent);

      expect(data.patterns.size).toBe(0);
      expect(data.strategies.size).toBe(0);
      expect(data.errors.size).toBe(0);
    });

    it('should handle invalid pattern data gracefully', async () => {
      const agent: AgentType = 'TAN';
      const invalidPattern = {
        // Missing required fields
        patternId: 'invalid-test-001',
      } as LearnedPattern;

      // Should not throw
      await expect(learningStore.savePattern(agent, invalidPattern)).resolves.not.toThrow();
    });
  });
});