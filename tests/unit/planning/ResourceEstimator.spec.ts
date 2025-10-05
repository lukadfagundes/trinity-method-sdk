/**
 * Resource Estimator Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { ResourceEstimator } from '../../../src/planning/ResourceEstimator';
import type { InvestigationPhase, InvestigationScope } from '../../../src/shared/types';

describe('ResourceEstimator', () => {
  let estimator: ResourceEstimator;

  beforeEach(() => {
    estimator = new ResourceEstimator();
  });

  describe('Resource Estimation', () => {
    it('should estimate resources for security audit', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Security Analysis',
          description: 'Analyze security vulnerabilities',
          tasks: ['task-1', 'task-2', 'task-3'],
          estimatedDuration: 10,
          dependencies: [],
        },
        {
          id: 'phase-2',
          name: 'Penetration Testing',
          description: 'Test security weaknesses',
          tasks: ['task-4', 'task-5'],
          estimatedDuration: 15,
          dependencies: ['phase-1'],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**/*.ts'],
        exclude: ['**/test/**'],
        focusAreas: ['authentication', 'authorization', 'input-validation'],
        technologies: ['TypeScript', 'Node.js'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.totalHours).toBeGreaterThan(0);
      expect(estimate.estimatedTokens).toBeGreaterThan(0);
      expect(estimate.estimatedCost).toBeGreaterThanOrEqual(0);
      expect(estimate.confidence).toBeGreaterThan(0);
      expect(estimate.confidence).toBeLessThanOrEqual(1);
    });

    it('should estimate higher resources for larger scope', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Analysis',
          description: 'Code analysis',
          tasks: ['task-1'],
          estimatedDuration: 5,
          dependencies: [],
        },
      ];

      const smallScope: InvestigationScope = {
        targetPath: '.',
        include: ['src/utils/**/*.ts'],
        exclude: [],
        focusAreas: ['error-handling'],
        technologies: ['TypeScript'],
      };

      const largeScope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**/*.ts', 'lib/**/*.ts', 'api/**/*.ts'],
        exclude: [],
        focusAreas: ['security', 'performance', 'architecture', 'quality'],
        technologies: ['TypeScript', 'React', 'Express', 'PostgreSQL'],
      };

      const smallEstimate = estimator.estimateResources(phases, smallScope);
      const largeEstimate = estimator.estimateResources(phases, largeScope);

      expect(largeEstimate.totalHours).toBeGreaterThan(smallEstimate.totalHours);
      expect(largeEstimate.estimatedTokens).toBeGreaterThan(smallEstimate.estimatedTokens);
    });

    it('should include breakdown by phase', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Phase 1',
          description: 'First phase',
          tasks: ['task-1'],
          estimatedDuration: 5,
          dependencies: [],
        },
        {
          id: 'phase-2',
          name: 'Phase 2',
          description: 'Second phase',
          tasks: ['task-2', 'task-3'],
          estimatedDuration: 8,
          dependencies: ['phase-1'],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**'],
        exclude: [],
        focusAreas: ['code-quality'],
        technologies: ['JavaScript'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.breakdown).toBeDefined();
      expect(estimate.breakdown?.byPhase).toHaveLength(2);
      expect(estimate.breakdown?.byPhase[0].phaseId).toBe('phase-1');
      expect(estimate.breakdown?.byPhase[1].phaseId).toBe('phase-2');
    });
  });

  describe('Historical Data Integration', () => {
    it('should use historical data when available', () => {
      // Add historical data
      estimator.addHistoricalData({
        investigationType: 'security-audit',
        actualHours: 20,
        estimatedHours: 18,
        actualTokens: 150000,
        codebaseSize: 50000,
        focusAreas: ['authentication', 'authorization'],
      });

      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Security Audit',
          description: 'Security audit',
          tasks: ['task-1'],
          estimatedDuration: 18,
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**/*.ts'],
        exclude: [],
        focusAreas: ['authentication', 'authorization'],
        technologies: ['TypeScript'],
      };

      const estimate = estimator.estimateResources(phases, scope, true);

      expect(estimate.historicalBased).toBe(true);
      expect(estimate.confidence).toBeGreaterThan(0.5);
    });

    it('should fall back to rule-based when no historical data', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Custom Investigation',
          description: 'Custom investigation',
          tasks: ['task-1'],
          estimatedDuration: 10,
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**'],
        exclude: [],
        focusAreas: ['custom-area'],
        technologies: ['TypeScript'],
      };

      const estimate = estimator.estimateResources(phases, scope, true);

      expect(estimate.historicalBased).toBe(false);
      expect(estimate.confidence).toBeLessThan(0.8);
    });
  });

  describe('Agent Capacity Analysis', () => {
    it('should estimate agent utilization', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Analysis',
          description: 'Analysis phase',
          tasks: ['task-1', 'task-2'],
          estimatedDuration: 10,
          dependencies: [],
          assignedAgents: ['TAN', 'ZEN'],
        },
        {
          id: 'phase-2',
          name: 'Review',
          description: 'Review phase',
          tasks: ['task-3'],
          estimatedDuration: 5,
          dependencies: ['phase-1'],
          assignedAgents: ['JUNO'],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**'],
        exclude: [],
        focusAreas: ['quality'],
        technologies: ['TypeScript'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.breakdown?.byAgent).toBeDefined();
      expect(estimate.breakdown!.byAgent!.length).toBeGreaterThan(0);
    });

    it('should identify overloaded agents', () => {
      const phases: InvestigationPhase[] = Array.from({ length: 10 }, (_, i) => ({
        id: `phase-${i}`,
        name: `Phase ${i}`,
        description: `Phase ${i}`,
        tasks: [`task-${i}`],
        estimatedDuration: 20,
        dependencies: [],
        assignedAgents: ['TAN'], // All assigned to TAN
      }));

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**'],
        exclude: [],
        focusAreas: ['security'],
        technologies: ['TypeScript'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.warnings).toBeDefined();
      expect(estimate.warnings?.some(w => w.includes('overloaded'))).toBe(true);
    });
  });

  describe('Token Estimation', () => {
    it('should estimate token usage based on codebase size', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Analysis',
          description: 'Code analysis',
          tasks: ['task-1'],
          estimatedDuration: 10,
          dependencies: [],
        },
      ];

      const smallScope: InvestigationScope = {
        targetPath: '.',
        include: ['src/utils/**/*.ts'],
        exclude: [],
        focusAreas: ['quality'],
        technologies: ['TypeScript'],
      };

      const largeScope: InvestigationScope = {
        targetPath: '.',
        include: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
        exclude: ['node_modules/**'],
        focusAreas: ['security', 'performance', 'quality'],
        technologies: ['TypeScript', 'React', 'Node.js'],
      };

      const smallEstimate = estimator.estimateResources(phases, smallScope);
      const largeEstimate = estimator.estimateResources(phases, largeScope);

      expect(largeEstimate.estimatedTokens).toBeGreaterThan(smallEstimate.estimatedTokens);
    });

    it('should estimate tokens per phase', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Phase 1',
          description: 'First phase',
          tasks: ['task-1'],
          estimatedDuration: 5,
          dependencies: [],
        },
        {
          id: 'phase-2',
          name: 'Phase 2',
          description: 'Second phase',
          tasks: ['task-2'],
          estimatedDuration: 10,
          dependencies: ['phase-1'],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**'],
        exclude: [],
        focusAreas: ['quality'],
        technologies: ['TypeScript'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.breakdown?.byPhase).toBeDefined();
      for (const phaseBreakdown of estimate.breakdown!.byPhase!) {
        expect(phaseBreakdown.estimatedTokens).toBeGreaterThan(0);
      }
    });
  });

  describe('Cost Estimation', () => {
    it('should estimate cost based on token usage', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Analysis',
          description: 'Analysis',
          tasks: ['task-1'],
          estimatedDuration: 10,
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**/*.ts'],
        exclude: [],
        focusAreas: ['security'],
        technologies: ['TypeScript'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.estimatedCost).toBeGreaterThan(0);
      expect(estimate.costBreakdown).toBeDefined();
      expect(estimate.costBreakdown?.inputTokenCost).toBeGreaterThanOrEqual(0);
      expect(estimate.costBreakdown?.outputTokenCost).toBeGreaterThanOrEqual(0);
    });

    it('should use custom pricing model if provided', () => {
      estimator.setPricingModel({
        inputTokensPerDollar: 500000,
        outputTokensPerDollar: 250000,
      });

      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Analysis',
          description: 'Analysis',
          tasks: ['task-1'],
          estimatedDuration: 10,
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**'],
        exclude: [],
        focusAreas: ['quality'],
        technologies: ['TypeScript'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.estimatedCost).toBeGreaterThan(0);
    });
  });

  describe('Confidence Calculation', () => {
    it('should have higher confidence with historical data', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Security Audit',
          description: 'Security audit',
          tasks: ['task-1'],
          estimatedDuration: 20,
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['src/**'],
        exclude: [],
        focusAreas: ['security'],
        technologies: ['TypeScript'],
      };

      // Without historical data
      const estimateWithoutHistory = estimator.estimateResources(phases, scope, false);

      // Add historical data
      estimator.addHistoricalData({
        investigationType: 'security-audit',
        actualHours: 22,
        estimatedHours: 20,
        actualTokens: 180000,
        codebaseSize: 60000,
        focusAreas: ['security'],
      });

      // With historical data
      const estimateWithHistory = estimator.estimateResources(phases, scope, true);

      expect(estimateWithHistory.confidence).toBeGreaterThan(estimateWithoutHistory.confidence);
    });

    it('should have lower confidence for uncertain estimates', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Unknown Investigation',
          description: 'Unknown type',
          tasks: ['task-1'],
          estimatedDuration: 100, // Very high estimate
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: ['**/*'],
        exclude: [],
        focusAreas: ['unknown-area'],
        technologies: ['Unknown'],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.confidence).toBeLessThan(0.7);
    });
  });

  describe('Validation', () => {
    it('should validate phase estimates', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Phase 1',
          description: 'First phase',
          tasks: [],
          estimatedDuration: 0,
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: [],
        exclude: [],
        focusAreas: [],
        technologies: [],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.warnings).toBeDefined();
      expect(estimate.warnings!.length).toBeGreaterThan(0);
    });

    it('should warn about empty scope', () => {
      const phases: InvestigationPhase[] = [
        {
          id: 'phase-1',
          name: 'Phase 1',
          description: 'First phase',
          tasks: ['task-1'],
          estimatedDuration: 10,
          dependencies: [],
        },
      ];

      const scope: InvestigationScope = {
        targetPath: '.',
        include: [],
        exclude: [],
        focusAreas: [],
        technologies: [],
      };

      const estimate = estimator.estimateResources(phases, scope);

      expect(estimate.warnings?.some(w => w.includes('empty'))).toBe(true);
    });
  });
});
