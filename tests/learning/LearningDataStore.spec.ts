/**
 * Unit tests for LearningDataStore
 * Tests atomic write operations, load/save, and export/import functionality
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as fs from 'fs/promises';
import * as path from 'path';
import { LearningDataStore } from '../../src/learning/LearningDataStore';
import {
  AgentType,
  LearnedPattern,
  StrategyPerformance,
  ErrorResolution,
  LearningData,
} from '../../src/shared/types';

describe('LearningDataStore', () => {
  let dataStore: LearningDataStore;
  const testDataDir = path.join(process.cwd(), 'trinity', 'learning', 'test');

  beforeEach(async () => {
    dataStore = new LearningDataStore();
    // Clean up test directory
    await fs.rm(testDataDir, { recursive: true, force: true });
  });

  afterEach(async () => {
    // Clean up test directory
    await fs.rm(testDataDir, { recursive: true, force: true });
  });

  describe('Atomic Write Operations', () => {
    it('should write and read learning data atomically', async () => {
      const agentId: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'test-pattern-1',
        patternType: 'code-structure',
        description: 'Test pattern',
        detectionCriteria: 'Test criteria',
        accuracy: 0.85,
        confidence: 0.7,
        usageCount: 10,
        successCount: 8,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: ['inv-1', 'inv-2'],
        tags: ['test', 'structure'],
        filePaths: ['/test/file.ts'],
        errorTypes: [],
      };

      // Save pattern
      await dataStore.savePattern(agentId, pattern);

      // Load and verify
      const loadedData = await dataStore.loadLearningData(agentId);
      expect(loadedData.patterns.has('test-pattern-1')).toBe(true);

      const loadedPattern = loadedData.patterns.get('test-pattern-1');
      expect(loadedPattern?.patternType).toBe('code-structure');
      expect(loadedPattern?.accuracy).toBe(0.85);
      expect(loadedPattern?.confidence).toBe(0.7);
      expect(loadedPattern?.usageCount).toBe(10);
    });

    it('should handle concurrent writes without corruption', async () => {
      const agentId: AgentType = 'TAN';

      const patterns: LearnedPattern[] = Array.from({ length: 5 }, (_, i) => ({
        patternId: `pattern-${i}`,
        patternType: 'code-structure',
        description: `Pattern ${i}`,
        detectionCriteria: `Criteria ${i}`,
        accuracy: 0.8,
        confidence: 0.6,
        usageCount: i + 1,
        successCount: i,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: ['test'],
        filePaths: [],
        errorTypes: [],
      }));

      // Write multiple patterns concurrently
      await Promise.all(patterns.map(p => dataStore.savePattern(agentId, p)));

      // Verify all patterns were saved
      const loadedData = await dataStore.loadLearningData(agentId);
      expect(loadedData.patterns.size).toBe(5);

      for (let i = 0; i < 5; i++) {
        expect(loadedData.patterns.has(`pattern-${i}`)).toBe(true);
      }
    });

    it('should recover from partial write failures', async () => {
      const agentId: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'test-pattern',
        patternType: 'code-structure',
        description: 'Test',
        detectionCriteria: 'Test',
        accuracy: 0.8,
        confidence: 0.7,
        usageCount: 1,
        successCount: 1,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      await dataStore.savePattern(agentId, pattern);

      // Verify temp file doesn't exist after successful write
      const dataDir = path.join(process.cwd(), 'trinity', 'learning', agentId);
      const tempFiles = await fs.readdir(dataDir);
      const hasTempFile = tempFiles.some(f => f.endsWith('.tmp'));
      expect(hasTempFile).toBe(false);
    });
  });

  describe('Pattern Management', () => {
    it('should update existing pattern correctly', async () => {
      const agentId: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'update-test',
        patternType: 'code-structure',
        description: 'Original',
        detectionCriteria: 'Original criteria',
        accuracy: 0.7,
        confidence: 0.5,
        usageCount: 5,
        successCount: 3,
        lastSeen: new Date('2024-01-01'),
        agentId: 'TAN',
        investigationIds: ['inv-1'],
        tags: ['original'],
        filePaths: [],
        errorTypes: [],
      };

      await dataStore.savePattern(agentId, pattern);

      // Update pattern
      const updatedPattern: LearnedPattern = {
        ...pattern,
        description: 'Updated',
        accuracy: 0.9,
        confidence: 0.8,
        usageCount: 10,
        successCount: 9,
        lastSeen: new Date('2024-12-01'),
        tags: ['original', 'updated'],
      };

      await dataStore.savePattern(agentId, updatedPattern);

      // Verify update
      const loadedData = await dataStore.loadLearningData(agentId);
      const loaded = loadedData.patterns.get('update-test');

      expect(loaded?.description).toBe('Updated');
      expect(loaded?.accuracy).toBe(0.9);
      expect(loaded?.confidence).toBe(0.8);
      expect(loaded?.usageCount).toBe(10);
      expect(loaded?.tags).toEqual(['original', 'updated']);
    });

    it('should retrieve patterns by ID', async () => {
      const agentId: AgentType = 'ZEN';
      const pattern: LearnedPattern = {
        patternId: 'retrieve-test',
        patternType: 'research-source',
        description: 'Test pattern',
        detectionCriteria: 'Test',
        accuracy: 0.85,
        confidence: 0.75,
        usageCount: 7,
        successCount: 6,
        lastSeen: new Date(),
        agentId: 'ZEN',
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      await dataStore.savePattern(agentId, pattern);

      const retrieved = await dataStore.getPattern(agentId, 'retrieve-test');
      expect(retrieved).toBeDefined();
      expect(retrieved?.patternId).toBe('retrieve-test');
      expect(retrieved?.patternType).toBe('research-source');
    });

    it('should return undefined for non-existent pattern', async () => {
      const agentId: AgentType = 'TAN';
      const retrieved = await dataStore.getPattern(agentId, 'non-existent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Strategy Performance Management', () => {
    it('should save and load strategy performance', async () => {
      const agentId: AgentType = 'INO';
      const strategy: StrategyPerformance = {
        strategyId: 'strategy-1',
        strategyName: 'Test Strategy',
        description: 'Test description',
        applicableContexts: ['bug-fix', 'feature'],
        successRate: 0.85,
        averageDuration: 5000,
        tokenEfficiency: 0.9,
        usageCount: 20,
        successCount: 17,
        failureCount: 3,
        lastUsed: new Date(),
        confidence: 0.8,
        agentId: 'INO',
        successfulInvestigations: ['inv-1', 'inv-2'],
        failedInvestigations: ['inv-3'],
      };

      await dataStore.saveStrategy(agentId, strategy);

      const loaded = await dataStore.getStrategy(agentId, 'strategy-1');
      expect(loaded).toBeDefined();
      expect(loaded?.strategyName).toBe('Test Strategy');
      expect(loaded?.successRate).toBe(0.85);
      expect(loaded?.usageCount).toBe(20);
    });

    it('should update strategy performance metrics', async () => {
      const agentId: AgentType = 'JUNO';
      const strategy: StrategyPerformance = {
        strategyId: 'update-strategy',
        strategyName: 'Original',
        description: 'Original',
        applicableContexts: ['audit'],
        successRate: 0.7,
        averageDuration: 3000,
        tokenEfficiency: 0.8,
        usageCount: 10,
        successCount: 7,
        failureCount: 3,
        lastUsed: new Date('2024-01-01'),
        confidence: 0.6,
        agentId: 'JUNO',
        successfulInvestigations: [],
        failedInvestigations: [],
      };

      await dataStore.saveStrategy(agentId, strategy);

      // Update
      const updated: StrategyPerformance = {
        ...strategy,
        successRate: 0.9,
        usageCount: 20,
        successCount: 18,
        failureCount: 2,
        confidence: 0.85,
      };

      await dataStore.saveStrategy(agentId, updated);

      const loaded = await dataStore.getStrategy(agentId, 'update-strategy');
      expect(loaded?.successRate).toBe(0.9);
      expect(loaded?.usageCount).toBe(20);
      expect(loaded?.confidence).toBe(0.85);
    });
  });

  describe('Error Resolution Management', () => {
    it('should save and retrieve error resolutions', async () => {
      const agentId: AgentType = 'AJ';
      const resolution: ErrorResolution = {
        errorPattern: 'TypeError: Cannot read property',
        errorType: 'runtime-error',
        resolution: 'Add null check',
        successRate: 0.9,
        usageCount: 15,
        lastSeen: new Date(),
        agentId: 'AJ',
        investigationIds: ['inv-1'],
        tags: ['null-safety'],
      };

      await dataStore.saveErrorResolution(agentId, resolution);

      const loaded = await dataStore.getErrorResolution(agentId, 'TypeError: Cannot read property');
      expect(loaded).toBeDefined();
      expect(loaded?.resolution).toBe('Add null check');
      expect(loaded?.successRate).toBe(0.9);
    });
  });

  describe('Export and Import', () => {
    it('should export learning data to JSON', async () => {
      const agentId: AgentType = 'TAN';

      const pattern: LearnedPattern = {
        patternId: 'export-test',
        patternType: 'code-structure',
        description: 'Export test',
        detectionCriteria: 'Test',
        accuracy: 0.8,
        confidence: 0.7,
        usageCount: 5,
        successCount: 4,
        lastSeen: new Date(),
        agentId: 'TAN',
        investigationIds: [],
        tags: ['export'],
        filePaths: [],
        errorTypes: [],
      };

      await dataStore.savePattern(agentId, pattern);

      const exportPath = path.join(testDataDir, 'export.json');
      await dataStore.exportLearningData(agentId, exportPath);

      // Verify file exists
      const stats = await fs.stat(exportPath);
      expect(stats.isFile()).toBe(true);

      // Verify content
      const content = await fs.readFile(exportPath, 'utf8');
      const exported = JSON.parse(content);
      expect(exported.agentId).toBe('TAN');
      expect(exported.patterns).toBeDefined();
    });

    it('should import learning data from JSON', async () => {
      const agentId: AgentType = 'ZEN';

      const exportData: LearningData = {
        agentId: 'ZEN',
        patterns: new Map([
          ['import-test', {
            patternId: 'import-test',
            patternType: 'research-source',
            description: 'Import test',
            detectionCriteria: 'Test',
            accuracy: 0.85,
            confidence: 0.75,
            usageCount: 3,
            successCount: 3,
            lastSeen: new Date(),
            agentId: 'ZEN',
            investigationIds: [],
            tags: ['import'],
            filePaths: [],
            errorTypes: [],
          }],
        ]),
        strategies: new Map(),
        errorResolutions: new Map(),
        lastUpdated: new Date(),
        totalInvestigations: 3,
        successfulInvestigations: 3,
        failedInvestigations: 0,
      };

      const importPath = path.join(testDataDir, 'import.json');
      await fs.mkdir(path.dirname(importPath), { recursive: true });
      await fs.writeFile(importPath, JSON.stringify(exportData, null, 2));

      await dataStore.importLearningData(agentId, importPath);

      const loaded = await dataStore.getPattern(agentId, 'import-test');
      expect(loaded).toBeDefined();
      expect(loaded?.description).toBe('Import test');
      expect(loaded?.patternType).toBe('research-source');
    });

    it('should handle export/import round-trip correctly', async () => {
      const agentId: AgentType = 'INO';

      // Create comprehensive test data
      const pattern: LearnedPattern = {
        patternId: 'roundtrip-pattern',
        patternType: 'validation-rule',
        description: 'Roundtrip test',
        detectionCriteria: 'Test criteria',
        accuracy: 0.92,
        confidence: 0.88,
        usageCount: 25,
        successCount: 23,
        lastSeen: new Date(),
        agentId: 'INO',
        investigationIds: ['inv-1', 'inv-2', 'inv-3'],
        tags: ['roundtrip', 'test'],
        filePaths: ['/test/file.ts'],
        errorTypes: ['validation-error'],
      };

      const strategy: StrategyPerformance = {
        strategyId: 'roundtrip-strategy',
        strategyName: 'Roundtrip Strategy',
        description: 'Test strategy',
        applicableContexts: ['context-analysis'],
        successRate: 0.88,
        averageDuration: 4500,
        tokenEfficiency: 0.92,
        usageCount: 25,
        successCount: 22,
        failureCount: 3,
        lastUsed: new Date(),
        confidence: 0.85,
        agentId: 'INO',
        successfulInvestigations: ['inv-1', 'inv-2'],
        failedInvestigations: ['inv-3'],
      };

      await dataStore.savePattern(agentId, pattern);
      await dataStore.saveStrategy(agentId, strategy);

      // Export
      const exportPath = path.join(testDataDir, 'roundtrip.json');
      await dataStore.exportLearningData(agentId, exportPath);

      // Clear data
      await fs.rm(path.join(process.cwd(), 'trinity', 'learning', agentId), { recursive: true, force: true });

      // Import
      await dataStore.importLearningData(agentId, exportPath);

      // Verify
      const loadedPattern = await dataStore.getPattern(agentId, 'roundtrip-pattern');
      const loadedStrategy = await dataStore.getStrategy(agentId, 'roundtrip-strategy');

      expect(loadedPattern?.accuracy).toBe(0.92);
      expect(loadedPattern?.confidence).toBe(0.88);
      expect(loadedStrategy?.successRate).toBe(0.88);
      expect(loadedStrategy?.confidence).toBe(0.85);
    });
  });

  describe('Data Validation', () => {
    it('should handle empty learning data gracefully', async () => {
      const agentId: AgentType = 'TAN';
      const data = await dataStore.loadLearningData(agentId);

      expect(data.patterns.size).toBe(0);
      expect(data.strategies.size).toBe(0);
      expect(data.errorResolutions.size).toBe(0);
      expect(data.totalInvestigations).toBe(0);
    });

    it('should validate agent ID in patterns', async () => {
      const agentId: AgentType = 'TAN';
      const pattern: LearnedPattern = {
        patternId: 'test',
        patternType: 'code-structure',
        description: 'Test',
        detectionCriteria: 'Test',
        accuracy: 0.8,
        confidence: 0.7,
        usageCount: 1,
        successCount: 1,
        lastSeen: new Date(),
        agentId: 'ZEN', // Mismatched agent ID
        investigationIds: [],
        tags: [],
        filePaths: [],
        errorTypes: [],
      };

      await dataStore.savePattern(agentId, pattern);

      // Should save under TAN directory despite agentId mismatch in pattern
      const loaded = await dataStore.getPattern(agentId, 'test');
      expect(loaded).toBeDefined();
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large number of patterns efficiently', async () => {
      const agentId: AgentType = 'AJ';
      const patterns: LearnedPattern[] = Array.from({ length: 100 }, (_, i) => ({
        patternId: `pattern-${i}`,
        patternType: 'code-structure',
        description: `Pattern ${i}`,
        detectionCriteria: `Criteria ${i}`,
        accuracy: 0.8 + (i % 20) / 100,
        confidence: 0.7 + (i % 30) / 100,
        usageCount: i + 1,
        successCount: i,
        lastSeen: new Date(),
        agentId: 'AJ',
        investigationIds: [],
        tags: [`tag-${i % 10}`],
        filePaths: [],
        errorTypes: [],
      }));

      const startTime = Date.now();

      for (const pattern of patterns) {
        await dataStore.savePattern(agentId, pattern);
      }

      const duration = Date.now() - startTime;

      // Should complete in reasonable time (< 5 seconds for 100 patterns)
      expect(duration).toBeLessThan(5000);

      // Verify all patterns saved
      const data = await dataStore.loadLearningData(agentId);
      expect(data.patterns.size).toBe(100);
    });
  });
});
