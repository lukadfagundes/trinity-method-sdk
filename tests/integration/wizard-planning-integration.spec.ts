/**
 * Wizard + Planning Integration Tests
 *
 * Tests the integration between InvestigationWizard and InvestigationPlanner
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { InvestigationWizard } from '../../src/wizard/InvestigationWizard';
import { InvestigationPlanner } from '../../src/planning/InvestigationPlanner';
import * as fs from 'fs/promises';

describe('Wizard + Planning Integration', () => {
  let wizard: InvestigationWizard;
  let planner: InvestigationPlanner;
  const testTrinityRoot = './test-integration-wizard-planning';
  const testCodebase = './test-codebase-integration';

  beforeEach(async () => {
    wizard = new InvestigationWizard(testCodebase, testTrinityRoot);
    planner = new InvestigationPlanner();

    await fs.mkdir(testTrinityRoot, { recursive: true });
    await fs.mkdir(testCodebase, { recursive: true });

    // Create mock package.json
    await fs.writeFile(
      `${testCodebase}/package.json`,
      JSON.stringify({
        name: 'test-project',
        dependencies: {
          react: '^18.0.0',
          next: '^14.0.0',
        },
        devDependencies: {
          jest: '^29.0.0',
          typescript: '^5.0.0',
        },
      })
    );
  });

  afterEach(async () => {
    await fs.rm(testTrinityRoot, { recursive: true, force: true });
    await fs.rm(testCodebase, { recursive: true, force: true });
  });

  describe('Wizard to Planner Flow', () => {
    it('should create investigation and generate plan', async () => {
      // Step 1: Create investigation using wizard
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      expect(wizardResult.success).toBe(true);
      expect(wizardResult.investigation).toBeDefined();

      // Step 2: Generate plan using planner
      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: wizardResult.investigation!.scope.targetPath,
        investigationType: 'security-audit',
      });

      expect(plan).toBeDefined();
      expect(plan.type).toBe('security-audit');
      expect(plan.phases.length).toBeGreaterThan(0);
      expect(plan.resourceEstimate).toBeDefined();
    });

    it('should use wizard context in plan generation', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'performance-review',
        nonInteractive: true,
      });

      const context = await wizard.getContext();

      const plan = await planner.generatePlan({
        investigationGoal: 'Optimize Next.js application performance',
        targetCodebase: testCodebase,
        investigationType: 'performance-review',
        context: {
          framework: context.framework,
          language: context.language,
          technologies: context.dependencies,
        },
      });

      expect(plan.scope.technologies).toContain('Next.js');
      expect(plan.scope.technologies).toContain('TypeScript');
    });

    it('should estimate resources based on wizard scope', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        investigationScope: ['src/**/*.ts', 'api/**/*.ts'],
        nonInteractive: true,
      });

      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'security-audit',
        scope: wizardResult.investigation!.scope.include,
      });

      expect(plan.resourceEstimate.totalHours).toBeGreaterThan(0);
      expect(plan.resourceEstimate.estimatedTokens).toBeGreaterThan(0);
    });
  });

  describe('Planning Strategy Integration', () => {
    it('should apply comprehensive strategy from wizard template', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const plan = await planner.generatePlan(
        {
          investigationGoal: wizardResult.investigation!.goal,
          targetCodebase: testCodebase,
          investigationType: 'security-audit',
        },
        'comprehensive'
      );

      expect(plan.scope.focusAreas.length).toBeGreaterThanOrEqual(6);
      expect(plan.phases.length).toBeGreaterThanOrEqual(3);
    });

    it('should apply rapid strategy for quick investigations', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'code-quality',
        nonInteractive: true,
      });

      const plan = await planner.generatePlan(
        {
          investigationGoal: 'Quick code quality check',
          targetCodebase: testCodebase,
          investigationType: 'code-quality',
        },
        'rapid'
      );

      expect(plan.resourceEstimate.totalHours).toBeLessThan(10);
    });
  });

  describe('Template to Plan Mapping', () => {
    it('should map security audit template to security plan', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'security-audit',
      });

      expect(plan.type).toBe('security-audit');
      expect(plan.scope.focusAreas).toContain('authentication');
      expect(plan.scope.focusAreas).toContain('authorization');
    });

    it('should map performance template to performance plan', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'performance-review',
        nonInteractive: true,
      });

      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'performance-review',
      });

      expect(plan.type).toBe('performance-review');
      expect(plan.scope.focusAreas.some(area =>
        area.includes('performance') || area.includes('optimization')
      )).toBe(true);
    });
  });

  describe('End-to-End Workflow', () => {
    it('should complete full wizard -> plan -> visualization flow', async () => {
      // Create investigation
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'architecture-review',
        investigationGoal: 'Review Next.js application architecture',
        nonInteractive: true,
      });

      expect(wizardResult.success).toBe(true);

      // Generate plan
      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'architecture-review',
      });

      expect(plan.phases).toBeDefined();
      expect(plan.resourceEstimate).toBeDefined();

      // Visualize plan
      const visualization = planner.visualizePlan(plan);

      expect(visualization.ganttChart).toContain('gantt');
      expect(visualization.flowchart).toContain('flowchart');
      expect(visualization.summary).toBeDefined();
    });

    it('should save investigation and plan together', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'security-audit',
      });

      // Save plan to investigation
      await wizard.attachPlanToInvestigation(
        wizardResult.investigationId!,
        plan
      );

      // Verify plan was saved
      const savedInvestigation = await wizard.getInvestigation(
        wizardResult.investigationId!
      );

      expect(savedInvestigation.plan).toBeDefined();
      expect(savedInvestigation.plan?.id).toBe(plan.id);
    });
  });

  describe('Performance', () => {
    it('should complete wizard + planning in under 10 seconds', async () => {
      const startTime = Date.now();

      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'security-audit',
      });

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(wizardResult.success).toBe(true);
      expect(plan).toBeDefined();
      expect(totalTime).toBeLessThan(10000); // <10 seconds
    });

    it('should handle multiple concurrent wizard + planning workflows', async () => {
      const workflows = [
        wizard.createInvestigation({ investigationType: 'security-audit', nonInteractive: true }),
        wizard.createInvestigation({ investigationType: 'performance-review', nonInteractive: true }),
        wizard.createInvestigation({ investigationType: 'code-quality', nonInteractive: true }),
      ];

      const results = await Promise.all(workflows);

      expect(results.every(r => r.success)).toBe(true);

      const plans = await Promise.all(
        results.map(r =>
          planner.generatePlan({
            investigationGoal: r.investigation!.goal,
            targetCodebase: testCodebase,
            investigationType: r.investigation!.type as any,
          })
        )
      );

      expect(plans.length).toBe(3);
      expect(plans.every(p => p.phases.length > 0)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle planning errors gracefully', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      // Invalid investigation type for planner
      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: '/invalid/path/that/does/not/exist',
        investigationType: 'security-audit',
      });

      expect(plan).toBeDefined();
      expect(plan.risks.length).toBeGreaterThan(0);
    });

    it('should validate wizard output before planning', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      expect(wizardResult.investigation).toBeDefined();
      expect(wizardResult.investigation!.goal).toBeDefined();
      expect(wizardResult.investigation!.scope).toBeDefined();

      // Should not throw when used in planner
      await expect(
        planner.generatePlan({
          investigationGoal: wizardResult.investigation!.goal,
          targetCodebase: testCodebase,
          investigationType: 'security-audit',
        })
      ).resolves.toBeDefined();
    });
  });
});
