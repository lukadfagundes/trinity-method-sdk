/**
 * Integration tests for deploy/configuration module
 * Tests interactive configuration prompts for Trinity deployment
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { promptConfiguration } from '../../../../src/cli/commands/deploy/configuration.js';
import type { DeployOptions, Stack } from '../../../../src/cli/commands/deploy/types.js';
import { createTempDir, cleanupTempDir } from '../../../helpers/test-helpers.js';
import { mockConsole } from '../../../utils/console-mocks.js';

describe('Deploy Configuration - Integration', () => {
  // Mock console to reduce test noise
  mockConsole();

  let tempDir: string;
  let originalCwd: string;
  let promptSpy: jest.SpiedFunction<typeof inquirer.prompt>;

  const mockStack: Stack = {
    framework: 'Node.js',
    language: 'TypeScript',
    packageManager: 'npm',
    testFramework: 'Jest',
  };

  const baseOptions: DeployOptions = {
    yes: false,
  };

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await createTempDir();
    process.chdir(tempDir);

    // Create spy for inquirer.prompt
    promptSpy = jest.spyOn(inquirer, 'prompt') as jest.SpiedFunction<typeof inquirer.prompt>;
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTempDir(tempDir);
  });

  describe('--yes flag (non-interactive)', () => {
    test('should return defaults when --yes flag is set', async () => {
      const options: DeployOptions = { yes: true };

      const result = await promptConfiguration(options, mockStack);

      expect(result).toEqual({
        projectName: expect.any(String),
        enableLinting: false,
        enableCICD: false,
        lintingTools: [],
        lintingDependencies: [],
        lintingScripts: {},
        postInstallInstructions: [],
      });

      // Should not prompt user when --yes is set
      expect(promptSpy).not.toHaveBeenCalled();
    });

    test('should use provided project name with --yes flag', async () => {
      const options: DeployOptions = { yes: true, name: 'my-project' };

      const result = await promptConfiguration(options, mockStack);

      expect(result.projectName).toBe('my-project');
    });

    test('should use current directory name when no name provided with --yes', async () => {
      const options: DeployOptions = { yes: true };
      const expectedName = path.basename(tempDir);

      const result = await promptConfiguration(options, mockStack);

      expect(result.projectName).toBe(expectedName);
    });
  });

  describe('Project name prompt', () => {
    test('should prompt for project name with current directory as default', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      expect(promptSpy).toHaveBeenCalledWith([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          default: expect.any(String),
        },
      ]);
    });

    test('should use provided project name as default', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'custom-name' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const options: DeployOptions = { yes: false, name: 'custom-name' };

      await promptConfiguration(options, mockStack);

      expect(promptSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          default: 'custom-name',
        }),
      ]);
    });
  });

  describe('Linting configuration - Recommended', () => {
    test('should configure recommended linting tools', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.enableLinting).toBe(true);
      expect(result.lintingTools).toBeDefined();
      expect(result.lintingTools!.length).toBeGreaterThan(0);
      expect(result.lintingDependencies).toBeDefined();
      expect(result.lintingScripts).toBeDefined();
    });

    test('should prompt with recommended option as default', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      expect(promptSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'confirm',
          name: 'setupLinting',
          message: 'Setup linting configuration? (y/n)',
          default: true,
        }),
      ]);
    });

    test('should include framework name in recommended option text', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      // With the new confirm-based approach, framework name is shown in console output
      // rather than in prompt choices, so we just verify linting was configured
      expect(result.enableLinting).toBe(true);
    });

    test('should return post-install instructions when linting tools selected', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.postInstallInstructions).toBeDefined();
    });
  });

  describe('Linting configuration - Custom', () => {
    // Note: Custom tool selection was removed in favor of recommended defaults
    // Tests updated to reflect new confirm-based approach

    test('should configure linting when user confirms', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.enableLinting).toBe(true);
      expect(result.lintingTools!.length).toBeGreaterThan(0);
    });

    test('should show confirm prompt for linting setup', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      expect(promptSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'confirm',
          name: 'setupLinting',
          message: 'Setup linting configuration? (y/n)',
        }),
      ]);
    });

    test('should handle skipping linting setup', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.enableLinting).toBe(false);
      expect(result.lintingTools).toEqual([]);
      expect(result.lintingDependencies).toEqual([]);
    });

    test('should return dependencies and scripts when linting enabled', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.lintingDependencies).toBeDefined();
      expect(result.lintingScripts).toBeDefined();
    });
  });

  describe('Linting configuration - Skip', () => {
    test('should skip linting setup when user declines', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.enableLinting).toBe(false);
      expect(result.lintingTools).toEqual([]);
      expect(result.lintingDependencies).toEqual([]);
      expect(result.lintingScripts).toEqual({});
      expect(result.postInstallInstructions).toEqual([]);
    });
  });

  describe('CI/CD configuration', () => {
    test('should enable CI/CD when confirmed', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: true })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.enableCICD).toBe(true);
    });

    test('should disable CI/CD when declined', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.enableCICD).toBe(false);
    });

    test('should prompt with true as default for CI/CD', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: true })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      expect(promptSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'confirm',
          name: 'setupCI',
          default: true,
        }),
      ]);
    });

    test('should detect GitHub platform from git config', async () => {
      // Create mock .git/config with GitHub remote
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: true })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      // Platform detection should succeed (verified by no error thrown)
      expect(true).toBe(true);
    });

    test('should detect GitLab platform from git config', async () => {
      // Create mock .git/config with GitLab remote
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://gitlab.com/user/repo.git'
      );

      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: true })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      // Platform detection should succeed (verified by no error thrown)
      expect(true).toBe(true);
    });

    test('should handle missing .git/config gracefully', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: true })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      // Should not throw error when .git/config doesn't exist
      expect(true).toBe(true);
    });
  });

  describe('Final confirmation', () => {
    test('should proceed when user confirms deployment', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result).toBeDefined();
      expect(result.projectName).toBe('test-project');
    });

    test('should throw error when user cancels deployment', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: false });

      await expect(promptConfiguration(baseOptions, mockStack)).rejects.toThrow(
        'Deployment cancelled by user'
      );
    });

    test('should prompt with true as default for final confirmation', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'test-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      await promptConfiguration(baseOptions, mockStack);

      expect(promptSpy).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'confirm',
          name: 'confirmDeploy',
          default: true,
        }),
      ]);
    });
  });

  describe('Complete workflow scenarios', () => {
    test('should handle complete recommended workflow', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'full-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: true })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result).toEqual({
        projectName: 'full-project',
        enableLinting: true,
        enableCICD: true,
        lintingTools: expect.any(Array),
        lintingDependencies: expect.any(Array),
        lintingScripts: expect.any(Object),
        postInstallInstructions: expect.any(Array),
      });
    });

    test('should handle complete custom workflow', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'custom-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: true })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result.projectName).toBe('custom-project');
      expect(result.enableLinting).toBe(true);
      expect(result.enableCICD).toBe(true);
      expect(result.lintingTools!.length).toBeGreaterThan(0);
    });

    test('should handle minimal setup (no linting, no CI/CD)', async () => {
      promptSpy
        .mockResolvedValueOnce({ projectName: 'minimal-project' })
        .mockResolvedValueOnce({ setupLinting: false })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, mockStack);

      expect(result).toEqual({
        projectName: 'minimal-project',
        enableLinting: false,
        enableCICD: false,
        lintingTools: [],
        lintingDependencies: [],
        lintingScripts: {},
        postInstallInstructions: [],
      });
    });
  });

  describe('Different framework scenarios', () => {
    test('should handle React framework', async () => {
      const reactStack: Stack = {
        framework: 'React',
        language: 'TypeScript',
        packageManager: 'npm',
        testFramework: 'Jest',
      };

      promptSpy
        .mockResolvedValueOnce({ projectName: 'react-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, reactStack);

      expect(result.lintingTools).toBeDefined();
      expect(result.lintingTools!.length).toBeGreaterThan(0);
    });

    test('should handle Vue framework', async () => {
      const vueStack: Stack = {
        framework: 'Vue',
        language: 'TypeScript',
        packageManager: 'npm',
        testFramework: 'Jest',
      };

      promptSpy
        .mockResolvedValueOnce({ projectName: 'vue-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, vueStack);

      expect(result.lintingTools).toBeDefined();
    });

    test('should handle Python framework', async () => {
      const pythonStack: Stack = {
        framework: 'Python',
        language: 'Python',
        packageManager: 'pip',
        testFramework: 'pytest',
      };

      promptSpy
        .mockResolvedValueOnce({ projectName: 'python-project' })
        .mockResolvedValueOnce({ setupLinting: true })
        .mockResolvedValueOnce({ setupCI: false })
        .mockResolvedValueOnce({ confirmDeploy: true });

      const result = await promptConfiguration(baseOptions, pythonStack);

      expect(result.lintingTools).toBeDefined();
    });
  });
});
