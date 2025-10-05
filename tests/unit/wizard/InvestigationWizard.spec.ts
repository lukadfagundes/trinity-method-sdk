/**
 * Investigation Wizard Unit Tests
 *
 * Tests the Investigation Wizard's core functionality including:
 * - Template registration and retrieval
 * - Investigation creation
 * - Context detection integration
 * - Preference management
 * - Quick create mode
 * - Custom investigation creation
 * - Option validation
 *
 * @module tests/unit/wizard/InvestigationWizard.spec
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { InvestigationWizard } from '../../../src/wizard/InvestigationWizard';
import { SecurityAuditTemplate } from '../../../src/wizard/templates/SecurityAuditTemplate';
import { PerformanceReviewTemplate } from '../../../src/wizard/templates/PerformanceReviewTemplate';
import { ArchitectureAnalysisTemplate } from '../../../src/wizard/templates/ArchitectureAnalysisTemplate';
import { CodeQualityTemplate } from '../../../src/wizard/templates/CodeQualityTemplate';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('InvestigationWizard', () => {
  let wizard: InvestigationWizard;
  const testTrinityRoot = './test-trinity-wizard';
  const testCodebasePath = './test-codebase';

  beforeEach(async () => {
    wizard = new InvestigationWizard(testCodebasePath, testTrinityRoot);

    // Register all templates
    wizard.registerTemplate(new SecurityAuditTemplate());
    wizard.registerTemplate(new PerformanceReviewTemplate());
    wizard.registerTemplate(new ArchitectureAnalysisTemplate());
    wizard.registerTemplate(new CodeQualityTemplate());

    // Create test directory structure
    await fs.mkdir(testTrinityRoot, { recursive: true });
    await fs.mkdir(testCodebasePath, { recursive: true });

    // Create mock package.json for context detection
    await fs.writeFile(
      path.join(testCodebasePath, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        dependencies: {
          react: '^18.0.0',
          'next': '^14.0.0',
        },
        devDependencies: {
          jest: '^29.0.0',
          typescript: '^5.0.0',
        },
      }),
      'utf-8'
    );

    // Create mock tsconfig.json
    await fs.writeFile(
      path.join(testCodebasePath, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
        },
      }),
      'utf-8'
    );
  });

  afterEach(async () => {
    // Cleanup test directories
    await fs.rm(testTrinityRoot, { recursive: true, force: true });
    await fs.rm(testCodebasePath, { recursive: true, force: true });
  });

  describe('Template Management', () => {
    it('should register templates correctly', () => {
      const templates = wizard.getAvailableTemplates();

      expect(templates).toHaveLength(4);
      expect(templates.map((t) => t.id)).toContain('security-audit');
      expect(templates.map((t) => t.id)).toContain('performance-review');
      expect(templates.map((t) => t.id)).toContain('architecture-review');
      expect(templates.map((t) => t.id)).toContain('code-quality');
    });

    it('should retrieve template metadata', () => {
      const templates = wizard.getAvailableTemplates();
      const securityTemplate = templates.find((t) => t.id === 'security-audit');

      expect(securityTemplate).toBeDefined();
      expect(securityTemplate?.name).toBe('Security Audit');
      expect(securityTemplate?.description).toContain('security');
      expect(securityTemplate?.estimatedDuration).toBeGreaterThan(0);
    });
  });

  describe('Investigation Creation', () => {
    it('should create a security audit investigation', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      expect(result.investigation).toBeDefined();
      expect(result.tasks).toBeDefined();
      expect(result.tasks!.length).toBeGreaterThan(0);
      expect(result.investigationId).toBeDefined();
      expect(result.setupTime).toBeDefined();
      expect(result.setupTime!).toBeLessThan(10000); // Should be under 10 seconds
      expect(result.templateUsed).toBe('Security Audit');
    });

    it('should create a performance review investigation', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'performance-review',
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      expect(result.investigation?.type).toBe('performance-review');
      expect(result.tasks!.length).toBeGreaterThan(0);
    });

    it('should auto-detect investigation type', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'auto',
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      expect(result.investigation?.type).toBeDefined();
      expect(['security-audit', 'performance-review', 'architecture-review', 'code-quality']).toContain(
        result.investigation?.type
      );
    });

    it('should include framework and language in context', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      expect(result.investigation?.scope.technologies).toBeDefined();
      expect(result.investigation?.scope.technologies).toContain('Next.js');
      expect(result.investigation?.scope.technologies).toContain('TypeScript');
    });

    it('should generate unique investigation IDs', async () => {
      const result1 = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const result2 = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      expect(result1.investigationId).not.toBe(result2.investigationId);
    });

    it('should handle invalid investigation type', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'invalid-type' as any,
        nonInteractive: true,
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should apply custom investigation scope', async () => {
      const customScope = ['src/**/*.ts', 'lib/**/*.js'];

      const result = await wizard.createInvestigation({
        investigationType: 'code-quality',
        investigationScope: customScope,
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      expect(result.investigation?.scope.include).toEqual(customScope);
    });

    it('should apply custom investigation goal', async () => {
      const customGoal = 'Find and fix all XSS vulnerabilities in user input handling';

      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        investigationGoal: customGoal,
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      expect(result.investigation?.goal).toBe(customGoal);
    });
  });

  describe('Quick Create Mode', () => {
    it('should create investigation quickly with minimal options', async () => {
      const startTime = Date.now();

      const result = await wizard.quickCreate('security-audit');

      const elapsed = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(result.setupTime!).toBeLessThan(10000); // Under 10 seconds
      expect(elapsed).toBeLessThan(15000); // Total time under 15 seconds
    });

    it('should use smart defaults in quick create', async () => {
      const result = await wizard.quickCreate('performance-review');

      expect(result.success).toBe(true);
      expect(result.investigation?.scope.include).toBeDefined();
      expect(result.investigation?.scope.exclude).toBeDefined();
      expect(result.tasks).toBeDefined();
    });
  });

  describe('Custom Investigation', () => {
    it('should create custom investigation', async () => {
      const result = await wizard.createCustomInvestigation(
        'Custom Security Check',
        'Check API security for payment endpoints',
        ['src/api/payment/**/*.ts'],
        ['TAN', 'JUNO']
      );

      expect(result.success).toBe(true);
      expect(result.investigation?.name).toBe('Custom Security Check');
      expect(result.investigation?.goal).toBe('Check API security for payment endpoints');
      expect(result.investigation?.scope.include).toEqual(['src/api/payment/**/*.ts']);
      expect(result.investigation?.resources.agents).toEqual(['TAN', 'JUNO']);
    });
  });

  describe('Preference Management', () => {
    it('should save investigation as profile', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        saveAsProfile: 'my-security-profile',
        nonInteractive: true,
      });

      expect(result.success).toBe(true);

      const profiles = await wizard.listProfiles();
      const savedProfile = profiles.find((p) => p.name === 'my-security-profile');

      expect(savedProfile).toBeDefined();
      expect(savedProfile?.investigationType).toBe('security-audit');
    });

    it('should use saved profile', async () => {
      // First, create a profile
      await wizard.createInvestigation({
        investigationType: 'performance-review',
        investigationScope: ['src/**/*.ts'],
        saveAsProfile: 'perf-profile',
        nonInteractive: true,
      });

      // Then use the profile
      const result = await wizard.createInvestigation({
        profileName: 'perf-profile',
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      expect(result.investigation?.type).toBe('performance-review');
      expect(result.investigation?.scope.include).toEqual(['src/**/*.ts']);
    });

    it('should update last used settings', async () => {
      await wizard.createInvestigation({
        investigationType: 'code-quality',
        nonInteractive: true,
      });

      const prefsManager = wizard.getPreferencesManager();
      const lastUsed = await prefsManager.getLastUsed();

      expect(lastUsed).toBeDefined();
      expect(lastUsed?.investigationType).toBe('code-quality');
    });

    it('should use last used settings when useSavedPreferences is true', async () => {
      // Create an investigation to establish last used settings
      await wizard.createInvestigation({
        investigationType: 'architecture-review',
        investigationScope: ['lib/**/*.ts'],
        nonInteractive: true,
      });

      // Create another investigation with useSavedPreferences
      const result = await wizard.createInvestigation({
        useSavedPreferences: true,
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      expect(result.investigation?.type).toBe('architecture-review');
    });
  });

  describe('Option Validation', () => {
    it('should validate valid options', () => {
      const validation = wizard.validateOptions({
        investigationType: 'security-audit',
        reportFormat: 'markdown',
        agents: ['TAN', 'JUNO'],
      });

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject invalid investigation type', () => {
      const validation = wizard.validateOptions({
        investigationType: 'invalid-type' as any,
      });

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('Invalid investigation type');
    });

    it('should reject invalid report format', () => {
      const validation = wizard.validateOptions({
        reportFormat: 'invalid-format' as any,
      });

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('Invalid report format');
    });

    it('should reject invalid agent', () => {
      const validation = wizard.validateOptions({
        agents: ['INVALID_AGENT' as any],
      });

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors[0]).toContain('Invalid agent');
    });
  });

  describe('Context Detection', () => {
    it('should detect codebase context', async () => {
      const context = await wizard.getContext();

      expect(context.framework).toBe('Next.js');
      expect(context.language).toBe('TypeScript');
      expect(context.testingFramework).toBe('Jest');
      expect(context.dependencies.length).toBeGreaterThan(0);
    });
  });

  describe('Statistics', () => {
    it('should return wizard statistics', () => {
      const stats = wizard.getStatistics();

      expect(stats.totalTemplates).toBe(4);
      expect(stats.averageSetupTime).toBeDefined();
      expect(stats.averageSetupTime).toBeLessThan(10000); // Target under 10 seconds
    });
  });

  describe('Task Generation', () => {
    it('should generate tasks with proper structure', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      expect(result.tasks).toBeDefined();
      expect(result.tasks!.length).toBeGreaterThan(0);

      const task = result.tasks![0];
      expect(task.id).toBeDefined();
      expect(task.description).toBeDefined();
      expect(task.agentType).toBeDefined();
      expect(task.priority).toBeDefined();
      expect(task.dependencies).toBeDefined();
      expect(task.estimatedDuration).toBeDefined();
    });

    it('should generate tasks with valid dependencies', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const taskIds = new Set(result.tasks!.map((t) => t.id));

      for (const task of result.tasks!) {
        for (const dep of task.dependencies) {
          expect(taskIds.has(dep)).toBe(true);
        }
      }
    });

    it('should set proper agent types for tasks', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      const validAgents = ['TAN', 'ZEN', 'INO', 'JUNO'];

      for (const task of result.tasks!) {
        expect(validAgents).toContain(task.agentType);
      }
    });
  });

  describe('Performance', () => {
    it('should achieve 90% setup time reduction (50min → 5min target)', async () => {
      const result = await wizard.createInvestigation({
        investigationType: 'security-audit',
        nonInteractive: true,
      });

      expect(result.success).toBe(true);
      // 5 minutes = 300,000 ms, target is under that
      expect(result.setupTime!).toBeLessThan(300000);
      // Realistically, should be under 10 seconds with automation
      expect(result.setupTime!).toBeLessThan(10000);
    });

    it('should handle multiple concurrent investigations', async () => {
      const promises = [
        wizard.createInvestigation({ investigationType: 'security-audit', nonInteractive: true }),
        wizard.createInvestigation({ investigationType: 'performance-review', nonInteractive: true }),
        wizard.createInvestigation({ investigationType: 'code-quality', nonInteractive: true }),
      ];

      const results = await Promise.all(promises);

      expect(results.every((r) => r.success)).toBe(true);
      expect(results.map((r) => r.investigationId)).toHaveLength(3);
      expect(new Set(results.map((r) => r.investigationId)).size).toBe(3); // All unique
    });
  });
});
