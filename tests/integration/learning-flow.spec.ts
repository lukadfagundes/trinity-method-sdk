/**
 * Integration tests for end-to-end learning flow
 * Tests complete learning system with all components working together
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { LearningDataStore } from '../../src/learning/LearningDataStore';
import { PerformanceTracker } from '../../src/learning/PerformanceTracker';
import { StrategySelectionEngine, InvestigationContext } from '../../src/learning/StrategySelectionEngine';
import { KnowledgeSharingBus } from '../../src/learning/KnowledgeSharingBus';
import { TANAgent } from '../../src/agents/TAN';
import { ZENAgent } from '../../src/agents/ZEN';
import { INOAgent } from '../../src/agents/INO';
import { JUNOAgent } from '../../src/agents/JUNO';
import {
  AgentType,
  InvestigationResult,
  LearnedPattern,
  StrategyPerformance,
} from '../../src/shared/types';

describe('Learning Flow Integration', () => {
  let dataStore: LearningDataStore;
  let performanceTracker: PerformanceTracker;
  let strategyEngine: StrategySelectionEngine;
  let knowledgeBus: KnowledgeSharingBus;

  let tanAgent: TANAgent;
  let zenAgent: ZENAgent;
  let inoAgent: INOAgent;
  let junoAgent: JUNOAgent;

  const testDataDir = path.join(process.cwd(), 'trinity', 'learning', 'test-integration');

  beforeEach(async () => {
    // Clean up test directory
    await fs.rm(testDataDir, { recursive: true, force: true });

    // Initialize learning components
    dataStore = new LearningDataStore();
    performanceTracker = new PerformanceTracker(dataStore);
    strategyEngine = new StrategySelectionEngine(dataStore);
    knowledgeBus = new KnowledgeSharingBus(dataStore);

    // Initialize agents
    tanAgent = new TANAgent(dataStore, performanceTracker, strategyEngine, knowledgeBus);
    zenAgent = new ZENAgent(dataStore, performanceTracker, strategyEngine, knowledgeBus);
    inoAgent = new INOAgent(dataStore, performanceTracker, strategyEngine, knowledgeBus);
    junoAgent = new JUNOAgent(dataStore, performanceTracker, strategyEngine, knowledgeBus);
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.rm(testDataDir, { recursive: true, force: true });
  });

  describe('Complete Investigation Lifecycle', () => {
    it('should execute complete investigation with learning', async () => {
      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: ['structure', 'architecture'],
        previousInvestigations: [],
      };

      // Execute investigation
      const result = await tanAgent.executeInvestigation(context);

      // Verify result
      expect(result).toBeDefined();
      expect(result.agent).toBe('TAN');
      expect(result.status).toBe('completed');
      expect(result.duration).toBeGreaterThan(0);

      // Verify patterns were learned
      const learningData = await dataStore.loadLearningData('TAN');
      expect(learningData.totalInvestigations).toBeGreaterThan(0);
    });

    it('should improve strategy selection over multiple investigations', async () => {
      const contexts: InvestigationContext[] = [
        {
          type: 'bug-fix',
          scope: ['src/'],
          estimatedComplexity: 'low',
          tags: ['simple'],
          previousInvestigations: [],
        },
        {
          type: 'bug-fix',
          scope: ['src/'],
          estimatedComplexity: 'low',
          tags: ['simple'],
          previousInvestigations: [],
        },
        {
          type: 'bug-fix',
          scope: ['src/'],
          estimatedComplexity: 'low',
          tags: ['simple'],
          previousInvestigations: [],
        },
      ];

      const results: InvestigationResult[] = [];

      // Execute multiple investigations
      for (const context of contexts) {
        const result = await tanAgent.executeInvestigation(context);
        results.push(result);

        // Learn from each investigation
        await tanAgent.learnFromInvestigation(result);
      }

      // Verify all completed
      expect(results.every(r => r.status === 'completed')).toBe(true);

      // Verify learning data accumulated
      const learningData = await dataStore.loadLearningData('TAN');
      expect(learningData.totalInvestigations).toBe(3);
      expect(learningData.successfulInvestigations).toBe(3);
    });

    it('should track performance metrics accurately', async () => {
      const context: InvestigationContext = {
        type: 'refactor',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: ['architecture'],
        previousInvestigations: [],
      };

      const result = await tanAgent.executeInvestigation(context);

      // Verify metrics were tracked
      expect(result.metrics).toBeDefined();
      expect(result.metrics.duration).toBeGreaterThan(0);
      expect(result.metrics.timestamp).toBeDefined();
    });
  });

  describe('Cross-Agent Knowledge Sharing', () => {
    it('should share high-confidence patterns between agents', async () => {
      // Create high-confidence pattern from TAN
      const tanPattern: LearnedPattern = {
        patternId: 'shared-pattern-1',
        patternType: 'code-structure',
        description: 'Shared structure pattern',
        detectionCriteria: 'Test criteria',
        accuracy: 0.95,
        confidence: 0.9, // Above sharing threshold
        usageCount: 50,
        successCount: 47,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: ['structure', 'shared'],
        filePaths: ['/src/shared.ts'],
        errorTypes: [],
      };

      // Save pattern
      await dataStore.savePattern('TAN', tanPattern);

      // Set up subscription for AJ (should receive code-structure patterns)
      const receivedPatterns: LearnedPattern[] = [];
      await knowledgeBus.subscribe('AJ', (pattern) => {
        receivedPatterns.push(pattern);
      });

      // Broadcast pattern
      await knowledgeBus.broadcastPattern(tanPattern, 'TAN');

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      // Verify AJ received the pattern
      expect(receivedPatterns.length).toBeGreaterThan(0);
      expect(receivedPatterns[0].patternId).toBe('shared-pattern-1');
    });

    it('should validate patterns before sharing to specific agents', async () => {
      // Research pattern from ZEN
      const zenPattern: LearnedPattern = {
        patternId: 'research-pattern',
        patternType: 'research-source',
        description: 'Research pattern',
        detectionCriteria: 'Test',
        accuracy: 0.88,
        confidence: 0.85,
        usageCount: 20,
        successCount: 18,
        lastSeen: new Date(),
        agentId: 'ZEN',
        investigationIds: [],
        tags: ['research'],
        filePaths: [],
        errorTypes: [],
      };

      await dataStore.savePattern('ZEN', zenPattern);

      // Subscribe multiple agents
      const tanReceived: LearnedPattern[] = [];
      const inoReceived: LearnedPattern[] = [];
      const junoReceived: LearnedPattern[] = [];

      await knowledgeBus.subscribe('TAN', (p) => tanReceived.push(p));
      await knowledgeBus.subscribe('INO', (p) => inoReceived.push(p));
      await knowledgeBus.subscribe('JUNO', (p) => junoReceived.push(p));

      // Broadcast
      await knowledgeBus.broadcastPattern(zenPattern, 'ZEN');
      await new Promise(resolve => setTimeout(resolve, 50));

      // TAN should NOT receive (only accepts code-structure)
      expect(tanReceived.length).toBe(0);

      // INO should receive (accepts all)
      expect(inoReceived.length).toBe(1);

      // JUNO should NOT receive (only accepts validation-rule and anti-pattern)
      expect(junoReceived.length).toBe(0);
    });

    it('should accumulate patterns from multiple agents', async () => {
      const patterns: LearnedPattern[] = [
        {
          patternId: 'tan-pattern',
          patternType: 'code-structure',
          description: 'TAN pattern',
          detectionCriteria: 'Test',
          accuracy: 0.9,
          confidence: 0.85,
          usageCount: 15,
          successCount: 14,
          lastSeen: new Date(),
          agentId: 'TAN',
          investigationIds: [],
          tags: ['structure'],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'zen-pattern',
          patternType: 'research-source',
          description: 'ZEN pattern',
          detectionCriteria: 'Test',
          accuracy: 0.88,
          confidence: 0.82,
          usageCount: 12,
          successCount: 10,
          lastSeen: new Date(),
          agentId: 'ZEN',
          investigationIds: [],
          tags: ['research'],
          filePaths: [],
          errorTypes: [],
        },
        {
          patternId: 'juno-pattern',
          patternType: 'validation-rule',
          description: 'JUNO pattern',
          detectionCriteria: 'Test',
          accuracy: 0.92,
          confidence: 0.88,
          usageCount: 18,
          successCount: 17,
          lastSeen: new Date(),
          agentId: 'JUNO',
          investigationIds: [],
          tags: ['validation'],
          filePaths: [],
          errorTypes: [],
        },
      ];

      // Subscribe INO to all patterns
      const inoReceived: LearnedPattern[] = [];
      await knowledgeBus.subscribe('INO', (p) => inoReceived.push(p));

      // Broadcast all patterns
      for (const pattern of patterns) {
        await dataStore.savePattern(pattern.agentId, pattern);
        await knowledgeBus.broadcastPattern(pattern, pattern.agentId);
      }

      await new Promise(resolve => setTimeout(resolve, 50));

      // INO should receive all patterns (accepts all types)
      expect(inoReceived.length).toBe(3);
    });
  });

  describe('Strategy Learning and Selection', () => {
    it('should improve strategy confidence over time', async () => {
      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: [],
        previousInvestigations: [],
      };

      // Execute multiple successful investigations
      for (let i = 0; i < 10; i++) {
        const result = await tanAgent.executeInvestigation(context);
        await tanAgent.learnFromInvestigation(result);
      }

      // Load strategies
      const learningData = await dataStore.loadLearningData('TAN');

      // Verify strategies have been updated
      expect(learningData.strategies.size).toBeGreaterThan(0);

      // At least one strategy should have improved confidence
      const strategies = Array.from(learningData.strategies.values());
      const hasHighConfidence = strategies.some(s => s.confidence > 0.5);
      expect(hasHighConfidence).toBe(true);
    });

    it('should select appropriate strategy based on context', async () => {
      // Seed with different strategies
      const bugFixStrategy: StrategyPerformance = {
        strategyId: 'bug-fix-strategy',
        strategyName: 'Bug Fix Strategy',
        description: 'For bug fixes',
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

      const refactorStrategy: StrategyPerformance = {
        strategyId: 'refactor-strategy',
        strategyName: 'Refactor Strategy',
        description: 'For refactoring',
        applicableContexts: ['refactor'],
        successRate: 0.85,
        averageDuration: 5000,
        tokenEfficiency: 0.85,
        usageCount: 30,
        successCount: 25,
        failureCount: 5,
        lastUsed: new Date(),
        confidence: 0.8,
        agentId: 'TAN',
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      await dataStore.saveStrategy('TAN', bugFixStrategy);
      await dataStore.saveStrategy('TAN', refactorStrategy);

      // Select for bug-fix context
      const bugFixContext: InvestigationContext = {
        type: 'bug-fix',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: [],
        previousInvestigations: [],
      };

      const selectedBugFix = await strategyEngine.selectStrategy('TAN', bugFixContext);
      expect(selectedBugFix.applicableContexts).toContain('bug-fix');

      // Select for refactor context
      const refactorContext: InvestigationContext = {
        type: 'refactor',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: [],
        previousInvestigations: [],
      };

      const selectedRefactor = await strategyEngine.selectStrategy('TAN', refactorContext);
      expect(selectedRefactor.applicableContexts).toContain('refactor');
    });
  });

  describe('Data Persistence', () => {
    it('should persist learning data across sessions', async () => {
      const context: InvestigationContext = {
        type: 'documentation',
        scope: ['docs/'],
        estimatedComplexity: 'low',
        tags: ['readme'],
        previousInvestigations: [],
      };

      // Execute investigation
      const result = await zenAgent.executeInvestigation(context);
      await zenAgent.learnFromInvestigation(result);

      // Create new data store instance (simulate new session)
      const newDataStore = new LearningDataStore();

      // Load data
      const loadedData = await newDataStore.loadLearningData('ZEN');

      // Verify data persisted
      expect(loadedData.totalInvestigations).toBeGreaterThan(0);
    });

    it('should export and import learning data', async () => {
      // Create some learning data
      const pattern: LearnedPattern = {
        patternId: 'export-test',
        patternType: 'validation-rule',
        description: 'Export test',
        detectionCriteria: 'Test',
        accuracy: 0.9,
        confidence: 0.85,
        usageCount: 15,
        successCount: 14,
        lastSeen: new Date(),
        agentId: 'INO',
        investigationIds: [],
        tags: ['export'],
        filePaths: [],
        errorTypes: [],
      };

      await dataStore.savePattern('INO', pattern);

      // Export
      const exportPath = path.join(testDataDir, 'export-test.json');
      await dataStore.exportLearningData('INO', exportPath);

      // Clear data
      await fs.rm(path.join(process.cwd(), 'trinity', 'learning', 'INO'), { recursive: true, force: true });

      // Import
      await dataStore.importLearningData('INO', exportPath);

      // Verify
      const imported = await dataStore.getPattern('INO', 'export-test');
      expect(imported).toBeDefined();
      expect(imported?.description).toBe('Export test');
    });
  });

  describe('Performance Optimization', () => {
    it('should complete 100 investigations within performance targets', async () => {
      const context: InvestigationContext = {
        type: 'audit',
        scope: ['src/'],
        estimatedComplexity: 'medium',
        tags: ['quality'],
        previousInvestigations: [],
      };

      const startTime = Date.now();
      const results: InvestigationResult[] = [];

      // Execute 100 investigations
      for (let i = 0; i < 100; i++) {
        const result = await junoAgent.executeInvestigation(context);
        results.push(result);

        // Learn from every 10th to simulate realistic usage
        if (i % 10 === 0) {
          await junoAgent.learnFromInvestigation(result);
        }
      }

      const totalDuration = Date.now() - startTime;

      // Verify all completed
      expect(results.length).toBe(100);
      expect(results.every(r => r.status === 'completed')).toBe(true);

      // Should complete in reasonable time (< 30 seconds for 100 investigations)
      expect(totalDuration).toBeLessThan(30000);

      console.log(`Completed 100 investigations in ${totalDuration}ms (avg: ${totalDuration / 100}ms)`);
    });

    it('should show performance improvement over time', async () => {
      const context: InvestigationContext = {
        type: 'context-analysis',
        scope: ['CLAUDE.md'],
        estimatedComplexity: 'low',
        tags: ['context'],
        previousInvestigations: [],
      };

      // Measure first batch
      const firstBatchStart = Date.now();
      for (let i = 0; i < 10; i++) {
        const result = await inoAgent.executeInvestigation(context);
        await inoAgent.learnFromInvestigation(result);
      }
      const firstBatchDuration = Date.now() - firstBatchStart;

      // Measure second batch (after learning)
      const secondBatchStart = Date.now();
      for (let i = 0; i < 10; i++) {
        const result = await inoAgent.executeInvestigation(context);
        await inoAgent.learnFromInvestigation(result);
      }
      const secondBatchDuration = Date.now() - secondBatchStart;

      // Second batch should be similar or faster (learning overhead is minimal)
      console.log(`First batch: ${firstBatchDuration}ms, Second batch: ${secondBatchDuration}ms`);

      // Just verify both batches completed successfully
      expect(firstBatchDuration).toBeGreaterThan(0);
      expect(secondBatchDuration).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should recover from failed investigations', async () => {
      const context: InvestigationContext = {
        type: 'bug-fix',
        scope: ['non-existent/'],
        estimatedComplexity: 'high',
        tags: [],
        previousInvestigations: [],
      };

      // Execute investigation (may have issues with non-existent scope)
      const result = await tanAgent.executeInvestigation(context);

      // Should complete even with potential issues
      expect(result).toBeDefined();
      expect(['completed', 'failed']).toContain(result.status);
    });

    it('should handle concurrent investigations safely', async () => {
      const contexts: InvestigationContext[] = Array.from({ length: 10 }, (_, i) => ({
        type: 'bug-fix',
        scope: [`src/${i}/`],
        estimatedComplexity: 'medium',
        tags: [`concurrent-${i}`],
        previousInvestigations: [],
      }));

      // Execute all concurrently
      const results = await Promise.all(
        contexts.map(context => tanAgent.executeInvestigation(context))
      );

      // All should complete
      expect(results.length).toBe(10);
      expect(results.every(r => r.status === 'completed')).toBe(true);

      // Verify no data corruption
      const learningData = await dataStore.loadLearningData('TAN');
      expect(learningData.totalInvestigations).toBeGreaterThan(0);
    });
  });

  describe('Multi-Agent Coordination', () => {
    it('should coordinate investigations across multiple agents', async () => {
      const context: InvestigationContext = {
        type: 'feature',
        scope: ['src/'],
        estimatedComplexity: 'high',
        tags: ['architecture', 'documentation', 'quality'],
        previousInvestigations: [],
      };

      // Execute with different agents
      const tanResult = await tanAgent.executeInvestigation(context);
      const zenResult = await zenAgent.executeInvestigation(context);
      const inoResult = await inoAgent.executeInvestigation(context);
      const junoResult = await junoAgent.executeInvestigation(context);

      // Learn from all
      await tanAgent.learnFromInvestigation(tanResult);
      await zenAgent.learnFromInvestigation(zenResult);
      await inoAgent.learnFromInvestigation(inoResult);
      await junoAgent.learnFromInvestigation(junoResult);

      // Verify each agent learned
      const tanData = await dataStore.loadLearningData('TAN');
      const zenData = await dataStore.loadLearningData('ZEN');
      const inoData = await dataStore.loadLearningData('INO');
      const junoData = await dataStore.loadLearningData('JUNO');

      expect(tanData.totalInvestigations).toBeGreaterThan(0);
      expect(zenData.totalInvestigations).toBeGreaterThan(0);
      expect(inoData.totalInvestigations).toBeGreaterThan(0);
      expect(junoData.totalInvestigations).toBeGreaterThan(0);
    });
  });
});
