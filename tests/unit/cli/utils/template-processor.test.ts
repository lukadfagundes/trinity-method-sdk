/**
 * Unit Tests - template-processor.ts
 *
 * Tests template variable substitution and metrics formatting
 */

import { describe, it, expect } from '@jest/globals';
import { processTemplate, extractVariables, formatMetrics } from '../../../../src/cli/utils/template-processor.js';
import type { Stack, CodebaseMetrics } from '../../../../src/cli/types.js';

describe('processTemplate', () => {
  describe('Basic Variable Substitution', () => {
    it('should replace single variable', () => {
      const template = 'Project: {{PROJECT_NAME}}';
      const variables = { PROJECT_NAME: 'My App' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Project: My App');
    });

    it('should replace multiple variables', () => {
      const template = '{{PROJECT_NAME}} uses {{FRAMEWORK}}';
      const variables = { PROJECT_NAME: 'My App', FRAMEWORK: 'React' };

      const result = processTemplate(template, variables);

      expect(result).toBe('My App uses React');
    });

    it('should replace same variable multiple times', () => {
      const template = '{{PROJECT_NAME}} and {{PROJECT_NAME}} and {{PROJECT_NAME}}';
      const variables = { PROJECT_NAME: 'Test' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Test and Test and Test');
    });

    it('should handle variables with special characters', () => {
      const template = 'Path: {{SOURCE_DIR}}';
      const variables = { SOURCE_DIR: 'src/components' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Path: src/components');
    });
  });

  describe('Fallback Variables', () => {
    it('should use fallback for missing PROJECT_NAME', () => {
      const template = '{{PROJECT_NAME}}';
      const variables = {};

      const result = processTemplate(template, variables);

      expect(result).toBe('Unknown Project');
    });

    it('should use fallback for missing FRAMEWORK', () => {
      const template = '{{FRAMEWORK}}';
      const variables = {};

      const result = processTemplate(template, variables);

      expect(result).toBe('Generic');
    });

    it('should use fallback for missing SOURCE_DIR', () => {
      const template = '{{SOURCE_DIR}}';
      const variables = {};

      const result = processTemplate(template, variables);

      expect(result).toBe('src');
    });

    it('should use fallback for missing PACKAGE_MANAGER', () => {
      const template = '{{PACKAGE_MANAGER}}';
      const variables = {};

      const result = processTemplate(template, variables);

      expect(result).toBe('npm');
    });
  });

  describe('Backwards Compatibility', () => {
    it('should accept lowercase projectName and convert to PROJECT_NAME', () => {
      const template = '{{PROJECT_NAME}}';
      const variables = { projectName: 'Legacy App' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Legacy App');
    });

    it('should prioritize uppercase over lowercase', () => {
      const template = '{{FRAMEWORK}}';
      const variables = { FRAMEWORK: 'Next.js', framework: 'React' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Next.js');
    });

    it('should support techStack fallback', () => {
      const template = '{{TECH_STACK}}';
      const variables = { techStack: 'TypeScript / React' };

      const result = processTemplate(template, variables);

      expect(result).toBe('TypeScript / React');
    });
  });

  describe('Date and Timestamp Variables', () => {
    it('should use CURRENT_DATE when provided', () => {
      const template = 'Date: {{CURRENT_DATE}}';
      const variables = { CURRENT_DATE: '2025-12-20' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Date: 2025-12-20');
    });

    it('should generate CURRENT_DATE if not provided', () => {
      const template = 'Date: {{CURRENT_DATE}}';
      const variables = {};

      const result = processTemplate(template, variables);

      expect(result).toMatch(/Date: \d{4}-\d{2}-\d{2}/);
    });

    it('should use DEPLOYMENT_TIMESTAMP when provided', () => {
      const template = 'Deployed: {{DEPLOYMENT_TIMESTAMP}}';
      const variables = { DEPLOYMENT_TIMESTAMP: '2025-12-20T10:30:00Z' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Deployed: 2025-12-20T10:30:00Z');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty template', () => {
      const template = '';
      const variables = { PROJECT_NAME: 'Test' };

      const result = processTemplate(template, variables);

      expect(result).toBe('');
    });

    it('should handle template with no variables', () => {
      const template = 'Plain text with no variables';
      const variables = { PROJECT_NAME: 'Test' };

      const result = processTemplate(template, variables);

      expect(result).toBe('Plain text with no variables');
    });

    it('should preserve unknown placeholders', () => {
      const template = '{{UNKNOWN_VAR}}';
      const variables = { PROJECT_NAME: 'Test' };

      const result = processTemplate(template, variables);

      expect(result).toBe('{{UNKNOWN_VAR}}');
    });

    it('should handle malformed placeholder (single brace)', () => {
      const template = '{PROJECT_NAME}';
      const variables = { PROJECT_NAME: 'Test' };

      const result = processTemplate(template, variables);

      expect(result).toBe('{PROJECT_NAME}');
    });

    it('should handle nested placeholders gracefully', () => {
      const template = '{{PROJECT_{{NAME}}}}';
      const variables = { PROJECT_NAME: 'Test' };

      const result = processTemplate(template, variables);

      // Should not process nested placeholders
      expect(result).toContain('{{');
    });
  });
});

describe('extractVariables', () => {
  it('should extract variables from Node.js stack', () => {
    const stack: Stack = {
      language: 'JavaScript/TypeScript',
      framework: 'React',
      sourceDir: 'src',
      sourceDirs: ['src'],
      packageManager: 'npm',
    };

    const result = extractVariables(stack, 'My React App');

    expect(result.projectName).toBe('My React App');
    expect(result.framework).toBe('React');
    expect(result.language).toBe('JavaScript/TypeScript');
    expect(result.sourceDir).toBe('src');
    expect(result.packageManager).toBe('npm');
    expect(result.techStack).toBe('JavaScript/TypeScript / React');
    expect(result.timestamp).toBeDefined();
  });

  it('should extract variables from Python stack', () => {
    const stack: Stack = {
      language: 'Python',
      framework: 'Flask',
      sourceDir: 'app',
      sourceDirs: ['app'],
    };

    const result = extractVariables(stack, 'Python API');

    expect(result.framework).toBe('Flask');
    expect(result.language).toBe('Python');
    expect(result.sourceDir).toBe('app');
    expect(result.packageManager).toBe('npm'); // Fallback
  });

  it('should use default project name if not provided', () => {
    const stack: Stack = {
      language: 'JavaScript/TypeScript',
      framework: 'Node.js',
      sourceDir: 'src',
      sourceDirs: ['src'],
    };

    const result = extractVariables(stack, '');

    expect(result.projectName).toBe('My Project');
  });
});

describe('formatMetrics', () => {
  describe('With Valid Metrics', () => {
    it('should format basic metrics', () => {
      const metrics: CodebaseMetrics = {
        totalFiles: 150,
        todoCount: 25,
        filesOver500: 8,
        dependencyCount: 42,
      };

      const result = formatMetrics(metrics);

      expect(result.TOTAL_FILES).toBe(150);
      expect(result.TODO_COUNT).toBe(25);
      expect(result.FILES_500).toBe(8);
      expect(result.DEPENDENCY_COUNT).toBe(42);
    });

    it('should format extended metrics', () => {
      const metrics: any = {
        totalFiles: 150,
        todoCount: 25,
        filesOver500: 8,
        filesOver1000: 3,
        filesOver3000: 1,
        dependencyCount: 42,
        devDependencyCount: 15,
        todoComments: 20,
        fixmeComments: 5,
        hackComments: 2,
        consoleStatements: 30,
        commentedCodeBlocks: 10,
        avgFileLength: 250,
        commitCount: 500,
        contributors: 5,
        lastCommitDate: '2025-12-20',
        frameworkVersion: 'React 18.2.0',
        packageManager: 'pnpm',
      };

      const result = formatMetrics(metrics);

      expect(result.FILES_1000).toBe(3);
      expect(result.FILES_3000).toBe(1);
      expect(result.TODO_COMMENTS).toBe(20);
      expect(result.FIXME_COUNT).toBe(5);
      expect(result.HACK_COUNT).toBe(2);
      expect(result.CONSOLE_COUNT).toBe(30);
      expect(result.COMMENTED_BLOCKS).toBe(10);
      expect(result.AVG_LENGTH).toBe(250);
      expect(result.COMMIT_COUNT).toBe(500);
      expect(result.CONTRIBUTOR_COUNT).toBe(5);
      expect(result.LAST_COMMIT).toBe('2025-12-20');
      expect(result.FRAMEWORK_VERSION).toBe('React 18.2.0');
      expect(result.PACKAGE_MANAGER).toBe('pnpm');
    });

    it('should keep agent-only metrics as placeholders', () => {
      const metrics: CodebaseMetrics = {
        totalFiles: 150,
        todoCount: 25,
        filesOver500: 8,
        dependencyCount: 42,
      };

      const result = formatMetrics(metrics);

      expect(result.OVERALL_COVERAGE).toBe('{{OVERALL_COVERAGE}}');
      expect(result.UNIT_COVERAGE).toBe('{{UNIT_COVERAGE}}');
      expect(result.DEPRECATED_COUNT).toBe('{{DEPRECATED_COUNT}}');
      expect(result.ANTIPATTERN_COUNT).toBe('{{ANTIPATTERN_COUNT}}');
      expect(result.PERF_ISSUE_COUNT).toBe('{{PERF_ISSUE_COUNT}}');
      expect(result.SECURITY_COUNT).toBe('{{SECURITY_COUNT}}');
    });

    it('should keep architecture metrics as placeholders', () => {
      const metrics: CodebaseMetrics = {
        totalFiles: 150,
        todoCount: 25,
        filesOver500: 8,
        dependencyCount: 42,
      };

      const result = formatMetrics(metrics);

      expect(result.COMPONENT_1).toBe('{{COMPONENT_1}}');
      expect(result.BACKEND_FRAMEWORK).toBe('{{BACKEND_FRAMEWORK}}');
      expect(result.DATABASE_TYPE).toBe('{{DATABASE_TYPE}}');
      expect(result.AUTH_TYPE).toBe('{{AUTH_TYPE}}');
      expect(result.STYLING_SOLUTION).toBe('{{STYLING_SOLUTION}}');
    });
  });

  describe('With Missing Metrics (Skip Audit)', () => {
    it('should return all placeholders when metrics is undefined', () => {
      const result = formatMetrics(undefined);

      expect(result.TOTAL_FILES).toBe('{{TOTAL_FILES}}');
      expect(result.TODO_COUNT).toBe('{{TODO_COUNT}}');
      expect(result.FILES_500).toBe('{{FILES_500}}');
      expect(result.DEPENDENCY_COUNT).toBe('{{DEPENDENCY_COUNT}}');
    });

    it('should return all placeholders when metrics is empty object', () => {
      const result = formatMetrics({} as CodebaseMetrics);

      expect(result.TOTAL_FILES).toBe('{{TOTAL_FILES}}');
      expect(result.TODO_COUNT).toBe('{{TODO_COUNT}}');
    });
  });

  describe('Edge Cases', () => {
    it('should handle metrics with zero values', () => {
      const metrics: CodebaseMetrics = {
        totalFiles: 0,
        todoCount: 0,
        filesOver500: 0,
        dependencyCount: 0,
      };

      const result = formatMetrics(metrics);

      expect(result.TOTAL_FILES).toBe(0);
      expect(result.TODO_COUNT).toBe(0);
    });

    it('should round average file length', () => {
      const metrics: any = {
        totalFiles: 10,
        todoCount: 0,
        filesOver500: 0,
        dependencyCount: 0,
        avgFileLength: 123.456,
      };

      const result = formatMetrics(metrics);

      expect(result.AVG_LENGTH).toBe(123);
    });

    it('should use fallback for missing optional fields', () => {
      const metrics: CodebaseMetrics = {
        totalFiles: 150,
        todoCount: 25,
        filesOver500: 8,
        dependencyCount: 42,
      };

      const result = formatMetrics(metrics);

      expect(result.TODO_COMMENTS).toBe(0);
      expect(result.FIXME_COUNT).toBe(0);
      expect(result.DEV_DEPENDENCY_COUNT).toBe(0);
    });
  });
});
