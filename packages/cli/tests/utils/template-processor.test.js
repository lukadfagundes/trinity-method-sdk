import { describe, it, expect } from '@jest/globals';
import { processTemplate, extractVariables, formatMetrics } from '../../src/utils/template-processor.js';

describe('processTemplate', () => {
  it('should replace PROJECT_NAME placeholder', () => {
    const template = '# {{PROJECT_NAME}} - Documentation';
    const variables = { projectName: 'My Awesome Project' };

    const result = processTemplate(template, variables);

    expect(result).toBe('# My Awesome Project - Documentation');
  });

  it('should replace TECH_STACK placeholder', () => {
    const template = 'Technology: {{TECH_STACK}}';
    const variables = { techStack: 'Node.js + React' };

    const result = processTemplate(template, variables);

    expect(result).toBe('Technology: Node.js + React');
  });

  it('should replace FRAMEWORK placeholder', () => {
    const template = 'Framework: {{FRAMEWORK}}';
    const variables = { framework: 'Next.js' };

    const result = processTemplate(template, variables);

    expect(result).toBe('Framework: Next.js');
  });

  it('should replace SOURCE_DIR placeholder', () => {
    const template = 'Source directory: {{SOURCE_DIR}}';
    const variables = { sourceDir: 'src/app' };

    const result = processTemplate(template, variables);

    expect(result).toBe('Source directory: src/app');
  });

  it('should replace DEPLOYMENT_TIMESTAMP placeholder', () => {
    const template = 'Deployed at: {{DEPLOYMENT_TIMESTAMP}}';
    const timestamp = '2025-09-30T14:30:00.000Z';
    const variables = { timestamp };

    const result = processTemplate(template, variables);

    expect(result).toBe(`Deployed at: ${timestamp}`);
  });

  it('should replace multiple placeholders in one template', () => {
    const template = `# {{PROJECT_NAME}}

Technology Stack: {{TECH_STACK}}
Framework: {{FRAMEWORK}}
Source: {{SOURCE_DIR}}
Deployed: {{DEPLOYMENT_TIMESTAMP}}`;

    const variables = {
      projectName: 'Test Project',
      techStack: 'Python',
      framework: 'Flask',
      sourceDir: 'app',
      timestamp: '2025-09-30T14:30:00.000Z',
    };

    const result = processTemplate(template, variables);

    expect(result).toContain('# Test Project');
    expect(result).toContain('Technology Stack: Python');
    expect(result).toContain('Framework: Flask');
    expect(result).toContain('Source: app');
    expect(result).toContain('Deployed: 2025-09-30T14:30:00.000Z');
  });

  it('should handle missing variables with defaults', () => {
    const template = '{{PROJECT_NAME}} - {{TECH_STACK}}';
    const variables = {}; // No variables provided

    const result = processTemplate(template, variables);

    expect(result).toBe('Unknown Project - Unknown');
  });

  it('should replace same placeholder multiple times', () => {
    const template = '{{PROJECT_NAME}} is the best. Welcome to {{PROJECT_NAME}}!';
    const variables = { projectName: 'Trinity SDK' };

    const result = processTemplate(template, variables);

    expect(result).toBe('Trinity SDK is the best. Welcome to Trinity SDK!');
  });

  it('should handle template with no placeholders', () => {
    const template = 'This is a plain text file with no placeholders.';
    const variables = { projectName: 'Test' };

    const result = processTemplate(template, variables);

    expect(result).toBe('This is a plain text file with no placeholders.');
  });

  it('should not replace malformed placeholders', () => {
    const template = '{PROJECT_NAME} {{PROJECT_NAME {{PROJECT_NAME}}';
    const variables = { projectName: 'Test' };

    const result = processTemplate(template, variables);

    expect(result).toBe('{PROJECT_NAME} {{PROJECT_NAME Test');
  });
});

describe('extractVariables', () => {
  it('should extract variables from stack object', () => {
    const stack = {
      framework: 'Node.js',
      language: 'JavaScript',
      sourceDir: 'src',
      packageManager: 'npm'
    };
    const projectName = 'Test Project';

    const result = extractVariables(stack, projectName);

    expect(result.projectName).toBe('Test Project');
    expect(result.techStack).toBe('JavaScript / Node.js');
    expect(result.framework).toBe('Node.js');
    expect(result.sourceDir).toBe('src');
    expect(result.language).toBe('JavaScript');
    expect(result.packageManager).toBe('npm');
    expect(result.timestamp).toBeDefined();
  });

  it('should use default project name if not provided', () => {
    const stack = {
      framework: 'Python',
      language: 'Python',
      sourceDir: 'app',
      packageManager: 'pip'
    };

    const result = extractVariables(stack);

    expect(result.projectName).toBe('My Project');
  });
});
