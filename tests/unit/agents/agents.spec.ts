/**
 * Critical Agents Tests
 *
 * Basic tests for TAN, ZEN, INO, JUNO agents
 */

import { TANAgent } from '../../../src/agents/TAN';
import { ZENAgent } from '../../../src/agents/ZEN';
import { INOAgent } from '../../../src/agents/INO';
import { JUNOAgent } from '../../../src/agents/JUNO';
import { InvestigationContext } from '../../../src/learning/StrategySelectionEngine';
import { LearningDataStore } from '../../../src/learning/LearningDataStore';
import { PerformanceTracker } from '../../../src/learning/PerformanceTracker';
import { StrategySelectionEngine } from '../../../src/learning/StrategySelectionEngine';
import { KnowledgeSharingBus } from '../../../src/learning/KnowledgeSharingBus';

describe('Critical Trinity Agents', () => {
  let dataStore: LearningDataStore;
  let performanceTracker: PerformanceTracker;
  let strategyEngine: StrategySelectionEngine;
  let knowledgeBus: KnowledgeSharingBus;

  beforeEach(() => {
    dataStore = new LearningDataStore('trinity/learning-test');
    performanceTracker = new PerformanceTracker(dataStore);
    strategyEngine = new StrategySelectionEngine(dataStore, performanceTracker);
    knowledgeBus = new KnowledgeSharingBus(dataStore);
  });

  describe('TAN Agent (Structure Specialist)', () => {
    it('should create TAN agent instance', () => {
      const tanAgent = new TANAgent('TAN', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      expect(tanAgent).toBeDefined();
    });

    it('should execute architecture analysis investigation', async () => {
      const tanAgent = new TANAgent('TAN', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      const context: InvestigationContext = {
        type: 'architecture-analysis',
        scope: ['src'],
        estimatedComplexity: 'medium',
      };

      const result = await tanAgent.executeInvestigation(context);

      expect(result).toBeDefined();
      expect(result.agent).toBe('TAN');
      expect(result.status).toBe('completed');
      expect(result.findings.length).toBeGreaterThan(0);
    });
  });

  describe('ZEN Agent (Documentation Specialist)', () => {
    it('should create ZEN agent instance', () => {
      const zenAgent = new ZENAgent('ZEN', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      expect(zenAgent).toBeDefined();
    });

    it('should execute custom investigation', async () => {
      const zenAgent = new ZENAgent('ZEN', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      const context: InvestigationContext = {
        type: 'custom',
        scope: ['docs'],
        estimatedComplexity: 'low',
      };

      const result = await zenAgent.executeInvestigation(context);

      expect(result).toBeDefined();
      expect(result.agent).toBe('ZEN');
      expect(result.status).toBe('completed');
      expect(result.findings.length).toBeGreaterThan(0);
    });
  });

  describe('INO Agent (Context Specialist)', () => {
    it('should create INO agent instance', () => {
      const inoAgent = new INOAgent('INO', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      expect(inoAgent).toBeDefined();
    });

    it('should execute custom investigation', async () => {
      const inoAgent = new INOAgent('INO', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      const context: InvestigationContext = {
        type: 'custom',
        scope: ['CLAUDE.md'],
        estimatedComplexity: 'low',
      };

      const result = await inoAgent.executeInvestigation(context);

      expect(result).toBeDefined();
      expect(result.agent).toBe('INO');
      expect(result.status).toBe('completed');
      expect(result.findings.length).toBeGreaterThan(0);
    });
  });

  describe('JUNO Agent (Quality Auditor)', () => {
    it('should create JUNO agent instance', () => {
      const junoAgent = new JUNOAgent('JUNO', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      expect(junoAgent).toBeDefined();
    });

    it('should execute code quality audit', async () => {
      const junoAgent = new JUNOAgent('JUNO', dataStore, performanceTracker, strategyEngine, knowledgeBus);
      const context: InvestigationContext = {
        type: 'code-quality',
        scope: ['src'],
        estimatedComplexity: 'medium',
      };

      const result = await junoAgent.executeInvestigation(context);

      expect(result).toBeDefined();
      expect(result.agent).toBe('JUNO');
      expect(result.status).toBe('completed');
      expect(result.findings.length).toBeGreaterThan(0);
    });
  });
});
