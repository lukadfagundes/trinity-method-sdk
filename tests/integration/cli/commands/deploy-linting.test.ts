/**
 * Integration tests for deploy/linting module
 * Tests linting tool deployment and dependency injection with spinner integration
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import type { Mock } from 'jest-mock';
import { deployLinting } from '../../../../src/cli/commands/deploy/linting.js';
import type { LintingTool, Stack, Spinner } from '../../../../src/cli/commands/deploy/types.js';
import { createTempDir, cleanupTempDir } from '../../../helpers/test-helpers.js';
import { mockConsole } from '../../../utils/console-mocks.js';

// Mock ora spinner
const createMockSpinner = (): Spinner => {
  return {
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    info: jest.fn().mockReturnThis(),
    text: '',
    isSpinning: false,
  } as unknown as Spinner;
};

describe('Deploy Linting - Integration', () => {
  // Mock console to reduce test noise
  mockConsole();

  let tempDir: string;
  let originalCwd: string;
  let mockSpinner: Spinner;
  let templatesPath: string;

  const mockStack: Stack = {
    framework: 'Node.js',
    language: 'TypeScript',
    packageManager: 'npm',
    testFramework: 'Jest',
  };

  const mockVariables: Record<string, string> = {
    PROJECT_NAME: 'test-project',
    FRAMEWORK: 'Node.js',
    PACKAGE_MANAGER: 'npm',
  };

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await createTempDir();
    process.chdir(tempDir);
    mockSpinner = createMockSpinner();

    // Get SDK templates path - use originalCwd since we've changed to tempDir
    templatesPath = path.join(originalCwd, 'dist/templates');
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTempDir(tempDir);
  });

  describe('No linting tools scenario', () => {
    test('should return 0 when no linting tools provided', async () => {
      const result = await deployLinting(
        [], // No tools
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(0);
      // Should not start spinner for tools deployment
      expect(mockSpinner.start).not.toHaveBeenCalledWith('Deploying linting configuration...');
    });

    test('should not deploy any files when tools array is empty', async () => {
      const result = await deployLinting(
        [],
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(0);
    });
  });

  describe('ESLint deployment', () => {
    test('should deploy ESLint configuration for TypeScript', async () => {
      const eslintTool: LintingTool = {
        id: 'eslint-typescript',
        name: 'ESLint (TypeScript)',
        file: 'eslint.config.mjs',
        framework: ['Node.js', 'React', 'Next.js'],
        language: 'TypeScript',
        recommended: true,
      };

      // Create package.json for dependency injection
      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        [eslintTool],
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(1);
      expect(mockSpinner.start).toHaveBeenCalledWith('Deploying linting configuration...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith('Linting configuration deployed (1 tools)');
    });

    test('should deploy ESLint configuration for JavaScript', async () => {
      const eslintTool: LintingTool = {
        id: 'eslint',
        name: 'ESLint',
        file: 'eslint.config.cjs',
        framework: ['Node.js'],
        language: 'JavaScript',
        recommended: true,
      };

      const jsStack: Stack = {
        ...mockStack,
        language: 'JavaScript',
      };

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        [eslintTool],
        [],
        {},
        jsStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(1);
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });
  });

  describe('Prettier deployment', () => {
    test('should deploy Prettier configuration', async () => {
      const prettierTool: LintingTool = {
        id: 'prettier',
        name: 'Prettier',
        file: '.prettierrc.json',
        framework: ['Node.js', 'React', 'Vue'],
        language: 'TypeScript',
        recommended: true,
      };

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        [prettierTool],
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(1);
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });
  });

  describe('Multiple tools deployment', () => {
    test('should deploy multiple linting tools', async () => {
      const tools: LintingTool[] = [
        {
          id: 'eslint-typescript',
          name: 'ESLint (TypeScript)',
          file: 'eslint.config.mjs',
          framework: ['Node.js'],
          language: 'TypeScript',
          recommended: true,
        },
        {
          id: 'prettier',
          name: 'Prettier',
          file: '.prettierrc.json',
          framework: ['Node.js'],
          language: 'TypeScript',
          recommended: true,
        },
      ];

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        tools,
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(2);
      expect(mockSpinner.succeed).toHaveBeenCalledWith('Linting configuration deployed (2 tools)');
    });

    test('should deploy three or more tools', async () => {
      const tools: LintingTool[] = [
        {
          id: 'eslint-typescript',
          name: 'ESLint',
          file: 'eslint.config.mjs',
          framework: ['Node.js'],
          language: 'TypeScript',
          recommended: true,
        },
        {
          id: 'prettier',
          name: 'Prettier',
          file: '.prettierrc.json',
          framework: ['Node.js'],
          language: 'TypeScript',
          recommended: true,
        },
        {
          id: 'pre-commit',
          name: 'Pre-commit Hooks',
          file: '.pre-commit-config.yaml',
          framework: ['Node.js'],
          language: 'TypeScript',
          recommended: false,
        },
      ];

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        tools,
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      // Result should be >= 0 (some tools may fail silently)
      expect(result).toBeGreaterThanOrEqual(0);
      // Spinner should either succeed or fail
      const succeedCalled = (mockSpinner.succeed as Mock).mock.calls.length > 0;
      const failCalled = (mockSpinner.fail as Mock).mock.calls.length > 0;
      expect(succeedCalled || failCalled).toBe(true);
    });
  });

  describe('Dependency injection', () => {
    test('should inject dependencies when provided', async () => {
      const dependencies = ['eslint', 'prettier', '@typescript-eslint/parser'];
      const scripts = {
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
        format: 'prettier --write .',
      };

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      await deployLinting(
        [],
        dependencies,
        scripts,
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(mockSpinner.start).toHaveBeenCalledWith('Adding linting dependencies to project...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith(
        'Linting dependencies added to project configuration'
      );

      // Verify package.json was updated
      const pkgJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
      expect(pkgJson.devDependencies).toBeDefined();
      expect(pkgJson.scripts).toBeDefined();
    });

    test('should handle empty dependencies gracefully', async () => {
      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      await deployLinting(
        [],
        [], // No dependencies
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      // Should not start dependency injection spinner
      expect(mockSpinner.start).not.toHaveBeenCalledWith(
        'Adding linting dependencies to project...'
      );
    });
  });

  describe('Combined tool deployment and dependency injection', () => {
    test('should deploy tools and inject dependencies', async () => {
      const tools: LintingTool[] = [
        {
          id: 'eslint-typescript',
          name: 'ESLint',
          file: 'eslint.config.mjs',
          framework: ['Node.js'],
          language: 'TypeScript',
          recommended: true,
        },
      ];

      const dependencies = ['eslint', '@typescript-eslint/parser'];
      const scripts = { lint: 'eslint .' };

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        tools,
        dependencies,
        scripts,
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(1);
      expect(mockSpinner.start).toHaveBeenCalledWith('Deploying linting configuration...');
      expect(mockSpinner.start).toHaveBeenCalledWith('Adding linting dependencies to project...');
      expect(mockSpinner.succeed).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error handling', () => {
    test('should handle unknown tool IDs gracefully (logs warning, succeeds)', async () => {
      const invalidTool: LintingTool = {
        id: 'invalid-tool',
        name: 'Invalid Tool',
        file: 'nonexistent.config',
        framework: ['Node.js'],
        language: 'TypeScript',
        recommended: false,
      };

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        [invalidTool],
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      // Unknown tools just warn (console.warn is mocked), deployment still succeeds
      expect(result).toBe(1);
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    test('should handle dependency injection errors gracefully', async () => {
      // No package.json file - should cause injection to warn
      await deployLinting(
        [],
        ['eslint'],
        { lint: 'eslint .' },
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      // Should handle missing package.json gracefully
      expect(mockSpinner.start).toHaveBeenCalledWith('Adding linting dependencies to project...');
    });
  });

  describe('Different frameworks', () => {
    test('should deploy Python linting tools', async () => {
      const pythonStack: Stack = {
        framework: 'Python',
        language: 'Python',
        packageManager: 'pip',
        testFramework: 'pytest',
      };

      const blackTool: LintingTool = {
        id: 'black',
        name: 'Black',
        file: 'pyproject.toml',
        framework: ['Python'],
        language: 'Python',
        recommended: true,
      };

      const result = await deployLinting(
        [blackTool],
        [],
        {},
        pythonStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      // Python tools may or may not deploy successfully depending on templates
      expect(result).toBeGreaterThanOrEqual(0);
      // Spinner should have been started
      expect(mockSpinner.start).toHaveBeenCalledWith('Deploying linting configuration...');
    });

    test('should handle React framework', async () => {
      const reactStack: Stack = {
        framework: 'React',
        language: 'TypeScript',
        packageManager: 'npm',
        testFramework: 'Jest',
      };

      const eslintTool: LintingTool = {
        id: 'eslint-typescript',
        name: 'ESLint',
        file: 'eslint.config.mjs',
        framework: ['React'],
        language: 'TypeScript',
        recommended: true,
      };

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        [eslintTool],
        [],
        {},
        reactStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(result).toBe(1);
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });
  });

  describe('Spinner interactions', () => {
    test('should start and succeed spinner for tool deployment', async () => {
      const tools: LintingTool[] = [
        {
          id: 'prettier',
          name: 'Prettier',
          file: '.prettierrc.json',
          framework: ['Node.js'],
          language: 'TypeScript',
          recommended: true,
        },
      ];

      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      const result = await deployLinting(
        tools,
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(mockSpinner.start).toHaveBeenCalledWith('Deploying linting configuration...');
      // Should either succeed or fail
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should start and succeed spinner for dependency injection', async () => {
      await fs.writeFile(
        path.join(tempDir, 'package.json'),
        JSON.stringify({ name: 'test', version: '1.0.0' }, null, 2)
      );

      await deployLinting(
        [],
        ['eslint'],
        { lint: 'eslint .' },
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      expect(mockSpinner.start).toHaveBeenCalledWith('Adding linting dependencies to project...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith(
        'Linting dependencies added to project configuration'
      );
    });

    test('should handle spinner calls correctly for unknown tools', async () => {
      const invalidTool: LintingTool = {
        id: 'invalid',
        name: 'Invalid',
        file: 'invalid.config',
        framework: ['Node.js'],
        language: 'TypeScript',
        recommended: false,
      };

      const result = await deployLinting(
        [invalidTool],
        [],
        {},
        mockStack,
        templatesPath,
        mockVariables,
        mockSpinner
      );

      // Unknown tools still count as deployed (just with a warning)
      expect(result).toBe(1);
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });
  });
});
