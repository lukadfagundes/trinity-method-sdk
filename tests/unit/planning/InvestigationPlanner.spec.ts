/**
 * Investigation Planner Unit Tests
 */

import { describe, it, expect } from '@jest/globals';
import { InvestigationPlanner } from '../../../src/planning/InvestigationPlanner';

describe('InvestigationPlanner', () => {
  let planner: InvestigationPlanner;

  beforeEach(() => {
    planner = new InvestigationPlanner();
  });

  describe('Plan Generation', () => {
    it('should generate security audit plan', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Security audit for production',
        targetCodebase: '.',
        investigationType: 'security-audit',
      });

      expect(plan.type).toBe('security-audit');
      expect(plan.scope.focusAreas.length).toBeGreaterThan(0);
      expect(plan.phases.length).toBeGreaterThanOrEqual(3);
      expect(plan.resourceEstimate).toBeDefined();
    });

    it('should auto-detect investigation type from goal', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Find performance bottlenecks',
        targetCodebase: '.',
      });

      expect(plan.type).toBe('performance-review');
    });

    it('should generate phases with deliverables', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Code quality review',
        targetCodebase: '.',
        investigationType: 'code-quality',
      });

      for (const phase of plan.phases) {
        expect(phase.deliverables).toBeDefined();
        expect(phase.deliverables!.length).toBeGreaterThan(0);
      }
    });

    it('should estimate resources', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Architecture review',
        targetCodebase: '.',
        investigationType: 'architecture-review',
      });

      expect(plan.resourceEstimate.totalHours).toBeGreaterThan(0);
      expect(plan.resourceEstimate.estimatedTokens).toBeGreaterThan(0);
      expect(plan.resourceEstimate.estimatedCost).toBeGreaterThanOrEqual(0);
      expect(plan.resourceEstimate.confidence).toBeGreaterThan(0);
    });

    it('should identify risks', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Large codebase security audit',
        targetCodebase: '.',
        investigationType: 'security-audit',
        timeAvailable: 5, // Very limited time
      });

      expect(plan.risks.length).toBeGreaterThan(0);
    });

    it('should calculate quality and completeness scores', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Comprehensive security audit',
        targetCodebase: '.',
        investigationType: 'security-audit',
      }, 'comprehensive');

      expect(plan.metadata.qualityScore).toBeDefined();
      expect(plan.metadata.completenessScore).toBeDefined();
      expect(plan.metadata.qualityScore).toBeGreaterThan(0);
      expect(plan.metadata.completenessScore).toBeGreaterThan(0);
    });
  });

  describe('Planning Strategies', () => {
    it('should apply comprehensive strategy', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Security audit',
        targetCodebase: '.',
        investigationType: 'security-audit',
      }, 'comprehensive');

      expect(plan.scope.focusAreas.length).toBeGreaterThanOrEqual(6);
    });

    it('should apply rapid strategy', async () => {
      const plan = await planner.generatePlan({
        investigationGoal: 'Quick security check',
        targetCodebase: '.',
        investigationType: 'security-audit',
      }, 'rapid');

      expect(plan.resourceEstimate.totalHours).toBeLessThan(10);
    });
  });
});
