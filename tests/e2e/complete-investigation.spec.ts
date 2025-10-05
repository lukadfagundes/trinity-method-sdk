/**
 * End-to-End Investigation Tests
 *
 * Tests complete investigation workflows from creation to completion
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { InvestigationWizard } from '../../src/wizard/InvestigationWizard';
import { InvestigationPlanner } from '../../src/planning/InvestigationPlanner';
import { MetricsCollector } from '../../src/analytics/MetricsCollector';
import { AnalyticsEngine } from '../../src/analytics/AnalyticsEngine';
import { TrinityHookLibrary } from '../../src/hooks/TrinityHookLibrary';
import * as fs from 'fs/promises';

describe('E2E: Complete Investigation Workflow', () => {
  let wizard: InvestigationWizard;
  let planner: InvestigationPlanner;
  let metricsCollector: MetricsCollector;
  let analyticsEngine: AnalyticsEngine;
  let hookLibrary: TrinityHookLibrary;

  const testTrinityRoot = './test-e2e-trinity';
  const testCodebase = './test-e2e-codebase';

  beforeEach(async () => {
    wizard = new InvestigationWizard(testCodebase, testTrinityRoot);
    planner = new InvestigationPlanner();
    metricsCollector = new MetricsCollector(`${testTrinityRoot}/metrics`);
    analyticsEngine = new AnalyticsEngine(metricsCollector);
    hookLibrary = new TrinityHookLibrary(`${testTrinityRoot}/hooks`);

    await fs.mkdir(testTrinityRoot, { recursive: true });
    await fs.mkdir(testCodebase, { recursive: true });

    // Create mock project structure
    await fs.writeFile(
      `${testCodebase}/package.json`,
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          react: '^18.0.0',
          next: '^14.0.0',
          express: '^4.18.0',
        },
        devDependencies: {
          jest: '^29.0.0',
          typescript: '^5.0.0',
        },
      })
    );

    await fs.mkdir(`${testCodebase}/src`, { recursive: true });
    await fs.writeFile(
      `${testCodebase}/src/index.ts`,
      'export const hello = () => "Hello World";'
    );
  });

  afterEach(async () => {
    await fs.rm(testTrinityRoot, { recursive: true, force: true });
    await fs.rm(testCodebase, { recursive: true, force: true });
  });

  describe('Security Audit Investigation', () => {
    it('should complete full security audit workflow', async () => {
      // Step 1: Create investigation using wizard
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        investigationGoal: 'Comprehensive security audit of Next.js application',
        investigationScope: ['src/**/*.ts', 'api/**/*.ts'],
        nonInteractive: true,
      });

      expect(wizardResult.success).toBe(true);
      expect(wizardResult.investigationId).toBeDefined();

      const investigationId = wizardResult.investigationId!;

      // Step 2: Generate investigation plan
      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'security-audit',
        scope: wizardResult.investigation!.scope.include,
      });

      expect(plan).toBeDefined();
      expect(plan.phases.length).toBeGreaterThan(0);
      expect(plan.resourceEstimate.totalHours).toBeGreaterThan(0);

      // Step 3: Start investigation with metrics
      await metricsCollector.startInvestigation(investigationId, 'security-audit');

      // Step 4: Execute investigation phases
      for (const phase of plan.phases) {
        for (const taskId of phase.tasks) {
          const agent = phase.assignedAgents?.[0] || 'TAN';
          const duration = Math.floor(Math.random() * 120) + 60;
          const tokens = Math.floor(Math.random() * 5000) + 3000;

          await metricsCollector.recordTaskStart(investigationId, taskId, agent);

          // Simulate task execution
          await new Promise(resolve => setTimeout(resolve, 50));

          await metricsCollector.recordTaskComplete(investigationId, taskId, agent, duration, tokens);
        }
      }

      // Step 5: Complete investigation
      await metricsCollector.endInvestigation(investigationId, 'completed');

      // Step 6: Generate analytics and reports
      const summary = await metricsCollector.getInvestigationSummary(investigationId);
      const report = await analyticsEngine.generateReport(investigationId);

      // Validate results
      expect(summary.investigationId).toBe(investigationId);
      expect(summary.type).toBe('security-audit');
      expect(summary.status).toBe('completed');
      expect(summary.taskCount).toBeGreaterThan(0);
      expect(summary.duration).toBeGreaterThan(0);

      expect(report).toContain('Investigation Report');
      expect(report).toContain(investigationId);
    }, 30000);

    it('should track security findings and metrics', async () => {
      const investigationId = 'sec-audit-001';

      await metricsCollector.startInvestigation(investigationId, 'security-audit');

      // Simulate security checks
      const vulnerabilities = [
        { severity: 'high', type: 'XSS', location: 'src/components/UserInput.tsx' },
        { severity: 'medium', type: 'CSRF', location: 'src/api/auth.ts' },
        { severity: 'low', type: 'Information Disclosure', location: 'src/utils/logger.ts' },
      ];

      for (let i = 0; i < vulnerabilities.length; i++) {
        await metricsCollector.recordEvent({
          investigationId,
          eventType: 'security_finding',
          agentId: 'JUNO',
          metadata: vulnerabilities[i],
        });
      }

      await metricsCollector.endInvestigation(investigationId, 'completed');

      const events = await metricsCollector.getEvents(investigationId);
      const findings = events.filter(e => e.eventType === 'security_finding');

      expect(findings).toHaveLength(3);
      expect(findings.some(f => f.metadata.severity === 'high')).toBe(true);
    });
  });

  describe('Performance Review Investigation', () => {
    it('should complete full performance review workflow', async () => {
      // Create investigation
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'performance-review',
        investigationGoal: 'Optimize Next.js application performance',
        nonInteractive: true,
      });

      expect(wizardResult.success).toBe(true);

      const investigationId = wizardResult.investigationId!;

      // Generate plan
      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'performance-review',
      });

      expect(plan.type).toBe('performance-review');

      // Execute investigation
      await metricsCollector.startInvestigation(investigationId, 'performance-review');

      // Simulate performance measurements
      const measurements = [
        { metric: 'LCP', value: 2.5, status: 'good' },
        { metric: 'FID', value: 100, status: 'needs-improvement' },
        { metric: 'CLS', value: 0.1, status: 'good' },
        { metric: 'TTFB', value: 600, status: 'needs-improvement' },
      ];

      for (const measurement of measurements) {
        await metricsCollector.recordEvent({
          investigationId,
          eventType: 'performance_measurement',
          agentId: 'AJ',
          metadata: measurement,
        });
      }

      // Record optimization tasks
      await metricsCollector.recordTaskComplete(investigationId, 'measure-metrics', 'AJ', 180, 7000);
      await metricsCollector.recordTaskComplete(investigationId, 'identify-bottlenecks', 'AJ', 240, 9000);
      await metricsCollector.recordTaskComplete(investigationId, 'recommend-optimizations', 'AJ', 120, 5000);

      await metricsCollector.endInvestigation(investigationId, 'completed');

      // Validate
      const summary = await metricsCollector.getInvestigationSummary(investigationId);
      expect(summary.type).toBe('performance-review');
      expect(summary.taskCount).toBe(3);

      const events = await metricsCollector.getEvents(investigationId);
      const perfMeasurements = events.filter(e => e.eventType === 'performance_measurement');
      expect(perfMeasurements).toHaveLength(4);
    });
  });

  describe('Architecture Analysis Investigation', () => {
    it('should complete architecture analysis with documentation', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'architecture-review',
        investigationGoal: 'Document and analyze application architecture',
        nonInteractive: true,
      });

      const investigationId = wizardResult.investigationId!;

      await metricsCollector.startInvestigation(investigationId, 'architecture-review');

      // Simulate architecture documentation
      await metricsCollector.recordTaskComplete(investigationId, 'map-components', 'ZEN', 300, 12000);
      await metricsCollector.recordTaskComplete(investigationId, 'analyze-dependencies', 'ZEN', 240, 9000);
      await metricsCollector.recordTaskComplete(investigationId, 'document-patterns', 'ZEN', 180, 7000);

      // Record architecture findings
      await metricsCollector.recordEvent({
        investigationId,
        eventType: 'architecture_finding',
        agentId: 'ZEN',
        metadata: {
          type: 'pattern',
          name: 'Layered Architecture',
          compliance: 0.85,
        },
      });

      await metricsCollector.endInvestigation(investigationId, 'completed');

      const summary = await metricsCollector.getInvestigationSummary(investigationId);
      expect(summary.type).toBe('architecture-review');
      expect(summary.totalTokens).toBe(28000);
    });
  });

  describe('Code Quality Investigation', () => {
    it('should complete code quality review with metrics', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'code-quality',
        investigationGoal: 'Assess and improve code quality',
        investigationScope: ['src/**/*.ts'],
        nonInteractive: true,
      });

      const investigationId = wizardResult.investigationId!;

      await metricsCollector.startInvestigation(investigationId, 'code-quality');

      // Simulate quality checks
      const qualityMetrics = [
        { metric: 'complexity', value: 12, threshold: 10 },
        { metric: 'duplication', value: 5.2, threshold: 3 },
        { metric: 'coverage', value: 78, threshold: 80 },
        { metric: 'maintainability', value: 65, threshold: 60 },
      ];

      for (const metric of qualityMetrics) {
        await metricsCollector.recordEvent({
          investigationId,
          eventType: 'quality_metric',
          agentId: 'JUNO',
          metadata: metric,
        });
      }

      await metricsCollector.recordTaskComplete(investigationId, 'analyze-complexity', 'JUNO', 150, 6000);
      await metricsCollector.recordTaskComplete(investigationId, 'check-duplication', 'JUNO', 120, 5000);
      await metricsCollector.recordTaskComplete(investigationId, 'review-coverage', 'JUNO', 90, 4000);

      await metricsCollector.endInvestigation(investigationId, 'completed');

      const summary = await metricsCollector.getInvestigationSummary(investigationId);
      expect(summary.qualityScore).toBeDefined();
      expect(summary.taskCount).toBe(3);
    });
  });

  describe('Investigation with Hooks', () => {
    it('should execute hooks during investigation lifecycle', async () => {
      // Register lifecycle hooks
      hookLibrary.registerHook({
        id: 'on-investigation-start',
        name: 'On Investigation Start',
        description: 'Executes when investigation starts',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Investigation {{investigationId}} started"',
        },
        enabled: true,
        createdAt: new Date(),
      });

      hookLibrary.registerHook({
        id: 'on-investigation-complete',
        name: 'On Investigation Complete',
        description: 'Executes when investigation completes',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_complete',
        action: {
          type: 'bash',
          command: 'echo "Investigation {{investigationId}} completed with status {{status}}"',
        },
        enabled: true,
        createdAt: new Date(),
      });

      // Create investigation
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const investigationId = wizardResult.investigationId!;

      // Execute start hook
      const startHookResults = await hookLibrary.executeHooksForEvent('investigation_start', {
        investigationId,
      });

      expect(startHookResults).toHaveLength(1);
      expect(startHookResults[0].success).toBe(true);
      expect(startHookResults[0].output).toContain(investigationId);

      // Start investigation
      await metricsCollector.startInvestigation(investigationId, 'security-audit');
      await metricsCollector.recordTaskComplete(investigationId, 'task-1', 'TAN', 120, 5000);
      await metricsCollector.endInvestigation(investigationId, 'completed');

      // Execute complete hook
      const completeHookResults = await hookLibrary.executeHooksForEvent('investigation_complete', {
        investigationId,
        status: 'completed',
      });

      expect(completeHookResults).toHaveLength(1);
      expect(completeHookResults[0].success).toBe(true);
      expect(completeHookResults[0].output).toContain('completed');
    });

    it('should track hook execution metrics', async () => {
      hookLibrary.registerHook({
        id: 'metrics-hook',
        name: 'Metrics Collection Hook',
        description: 'Collects metrics',
        category: 'investigation-lifecycle',
        triggerEvent: 'task_complete',
        action: {
          type: 'bash',
          command: 'echo "Collecting metrics for {{taskId}}"',
        },
        enabled: true,
        createdAt: new Date(),
      });

      const results = await hookLibrary.executeHooksForEvent('task_complete', {
        taskId: 'task-1',
        investigationId: 'inv-1',
      });

      expect(results[0].executionTime).toBeGreaterThan(0);

      const stats = hookLibrary.getHookStatistics('metrics-hook');
      expect(stats.totalExecutions).toBe(1);
      expect(stats.successRate).toBe(1.0);
    });
  });

  describe('Multi-Investigation Scenarios', () => {
    it('should handle concurrent investigations', async () => {
      const investigations = await Promise.all([
        wizard.createInvestigation({ investigationType: 'security-audit', nonInteractive: true }),
        wizard.createInvestigation({ investigationType: 'performance-review', nonInteractive: true }),
        wizard.createInvestigation({ investigationType: 'code-quality', nonInteractive: true }),
      ]);

      expect(investigations.every(inv => inv.success)).toBe(true);
      expect(new Set(investigations.map(inv => inv.investigationId)).size).toBe(3);

      // Execute all investigations concurrently
      await Promise.all(
        investigations.map(async (inv) => {
          const id = inv.investigationId!;
          await metricsCollector.startInvestigation(id, inv.investigation!.type as any);
          await metricsCollector.recordTaskComplete(id, 'task-1', 'TAN', 100, 5000);
          await metricsCollector.endInvestigation(id, 'completed');
        })
      );

      // Verify all investigations completed
      const systemMetrics = await analyticsEngine.getSystemMetrics();
      expect(systemMetrics.totalInvestigations).toBe(3);
    });

    it('should compare multiple investigations', async () => {
      // Create two security audits
      const inv1 = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const inv2 = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const id1 = inv1.investigationId!;
      const id2 = inv2.investigationId!;

      // Execute with different performance
      await metricsCollector.startInvestigation(id1, 'security-audit');
      await metricsCollector.recordTaskComplete(id1, 'task-1', 'TAN', 100, 5000);
      await metricsCollector.endInvestigation(id1, 'completed');

      await metricsCollector.startInvestigation(id2, 'security-audit');
      await metricsCollector.recordTaskComplete(id2, 'task-1', 'TAN', 200, 10000);
      await metricsCollector.endInvestigation(id2, 'completed');

      // Compare
      const comparison = await analyticsEngine.compareInvestigations([id1, id2]);

      expect(comparison.investigations).toHaveLength(2);
      expect(comparison.bestPerforming).toBe(id1); // Faster investigation
    });
  });

  describe('Error Handling and Recovery', () => {
    it('should handle investigation failures gracefully', async () => {
      const wizardResult = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const investigationId = wizardResult.investigationId!;

      await metricsCollector.startInvestigation(investigationId, 'security-audit');

      // Simulate task failures
      await metricsCollector.recordTaskStart(investigationId, 'task-1', 'TAN');
      await metricsCollector.recordError(investigationId, 'TAN', 'Task failed: File not found', {
        taskId: 'task-1',
      });

      await metricsCollector.endInvestigation(investigationId, 'failed');

      const summary = await metricsCollector.getInvestigationSummary(investigationId);
      expect(summary.status).toBe('failed');
      expect(summary.errorRate).toBeGreaterThan(0);
    });

    it('should track and report errors', async () => {
      const investigationId = 'error-test-inv';

      await metricsCollector.startInvestigation(investigationId);

      // Record multiple errors
      await metricsCollector.recordError(investigationId, 'TAN', 'Error 1', {});
      await metricsCollector.recordError(investigationId, 'ZEN', 'Error 2', {});
      await metricsCollector.recordError(investigationId, 'JUNO', 'Error 3', {});

      await metricsCollector.endInvestigation(investigationId, 'failed');

      const events = await metricsCollector.getEvents(investigationId);
      const errors = events.filter(e => e.eventType === 'error');

      expect(errors).toHaveLength(3);
    });
  });

  describe('Performance Validation', () => {
    it('should complete investigation workflow in reasonable time', async () => {
      const startTime = Date.now();

      const wizardResult = await wizard.createInvestigation({
        investigationType: 'code-quality',
        nonInteractive: true,
      });

      const plan = await planner.generatePlan({
        investigationGoal: wizardResult.investigation!.goal,
        targetCodebase: testCodebase,
        investigationType: 'code-quality',
      });

      await metricsCollector.startInvestigation(wizardResult.investigationId!);
      await metricsCollector.recordTaskComplete(wizardResult.investigationId!, 'task-1', 'JUNO', 100, 5000);
      await metricsCollector.endInvestigation(wizardResult.investigationId!, 'completed');

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(15000); // <15 seconds for complete workflow
    });
  });
});
