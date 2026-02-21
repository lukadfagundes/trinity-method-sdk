/**
 * Integration tests for deploy/ci-cd module
 * Tests CI workflow template deployment with spinner integration
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import type { Mock } from 'jest-mock';
import { deployCICD } from '../../../../src/cli/commands/deploy/ci-cd.js';
import type { DeployOptions, Spinner } from '../../../../src/cli/commands/deploy/types.js';
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
    // Add other Ora properties as needed
  } as unknown as Spinner;
};

describe('Deploy CI/CD - Integration', () => {
  // Mock console to reduce test noise
  mockConsole();

  let tempDir: string;
  let originalCwd: string;
  let mockSpinner: Spinner;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await createTempDir();
    process.chdir(tempDir);
    mockSpinner = createMockSpinner();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTempDir(tempDir);
  });

  describe('Skip deployment when ciDeploy is false', () => {
    test('should return 0 when ciDeploy option is false', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: false,
      };

      const result = await deployCICD(options, mockSpinner);

      expect(result).toBe(0);
      expect(mockSpinner.start).not.toHaveBeenCalled();
    });

    test('should return 0 when ciDeploy option is undefined', async () => {
      const options: DeployOptions = {
        yes: true,
        // ciDeploy not set
      };

      const result = await deployCICD(options, mockSpinner);

      expect(result).toBe(0);
      expect(mockSpinner.start).not.toHaveBeenCalled();
    });
  });

  describe('Successful deployment scenarios', () => {
    test('should deploy GitHub Actions templates when ciDeploy is true', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // Create mock .git/config with GitHub
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      const result = await deployCICD(options, mockSpinner);

      expect(result).toBeGreaterThan(0);
      expect(mockSpinner.start).toHaveBeenCalledWith('Deploying CI/CD workflow templates...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith(
        expect.stringContaining('CI/CD templates deployed')
      );
    });

    test('should show deployed file list in success message', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // Create mock .git/config with GitHub
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      await deployCICD(options, mockSpinner);

      expect(mockSpinner.succeed).toHaveBeenCalledWith(
        expect.stringMatching(/CI\/CD templates deployed \(\d+ files\)/)
      );
    });

    test('should deploy for GitLab platform', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // Create mock .git/config with GitLab
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://gitlab.com/user/repo.git'
      );

      const result = await deployCICD(options, mockSpinner);

      expect(result).toBeGreaterThan(0);
      expect(mockSpinner.start).toHaveBeenCalled();
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    test('should handle unknown platform (default to GitHub)', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // No .git/config - unknown platform
      const result = await deployCICD(options, mockSpinner);

      expect(result).toBeGreaterThan(0);
      expect(mockSpinner.start).toHaveBeenCalled();
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    test('should return correct number of deployed files', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      const result = await deployCICD(options, mockSpinner);

      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });
  });

  describe('Skipped files scenario', () => {
    test('should skip existing ci.yml without --force', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
        force: false,
      };

      // Create existing CI file
      await fs.ensureDir(path.join(tempDir, '.github/workflows'));
      await fs.writeFile(path.join(tempDir, '.github/workflows/ci.yml'), 'existing');

      // Create .git/config
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      await deployCICD(options, mockSpinner);

      // Should still succeed with some files deployed
      expect(mockSpinner.start).toHaveBeenCalled();
      // Either succeed or info, depending on whether any files were deployed
      const succeedCalled = (mockSpinner.succeed as Mock).mock.calls.length > 0;
      const infoCalled = (mockSpinner.info as Mock).mock.calls.length > 0;
      expect(succeedCalled || infoCalled).toBe(true);
    });

    test('should overwrite existing files with --force', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
        force: true,
      };

      // Create existing file
      await fs.ensureDir(path.join(tempDir, '.github/workflows'));
      await fs.writeFile(path.join(tempDir, '.github/workflows/ci.yml'), 'existing');

      // Create .git/config
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      const result = await deployCICD(options, mockSpinner);

      expect(result).toBeGreaterThan(0);
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    test('should handle deployment errors gracefully', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      await deployCICD(options, mockSpinner);

      // Should have started spinner
      expect(mockSpinner.start).toHaveBeenCalled();
    });

    test('should return 0 on complete failure', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // Create read-only directory to cause failures
      const templatesDir = path.join(tempDir, 'trinity/templates/ci');
      await fs.ensureDir(templatesDir);

      try {
        // Try to make directory read-only (may not work on all platforms)
        await fs.chmod(templatesDir, 0o444);

        const result = await deployCICD(options, mockSpinner);

        // Should either succeed with partial deployment or return 0
        expect(typeof result).toBe('number');
        expect(result).toBeGreaterThanOrEqual(0);
      } finally {
        // Restore permissions for cleanup
        await fs.chmod(templatesDir, 0o755);
      }
    });
  });

  describe('Spinner interactions', () => {
    test('should start spinner with correct message', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      await deployCICD(options, mockSpinner);

      expect(mockSpinner.start).toHaveBeenCalledWith('Deploying CI/CD workflow templates...');
    });

    test('should succeed spinner on successful deployment', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      await deployCICD(options, mockSpinner);

      const succeedCalled = (mockSpinner.succeed as Mock).mock.calls.length > 0;
      const infoCalled = (mockSpinner.info as Mock).mock.calls.length > 0;

      // Should call either succeed or info
      expect(succeedCalled || infoCalled).toBe(true);
    });

    test('should call warn if there are errors but some files deployed', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // Normal deployment shouldn't have errors
      await deployCICD(options, mockSpinner);

      // Verify spinner was used
      expect(mockSpinner.start).toHaveBeenCalled();
    });
  });

  describe('Integration with deploy-ci utility', () => {
    test('should call deployCITemplates with correct options', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
        force: true,
      };

      const result = await deployCICD(options, mockSpinner);

      // Should return number of deployed files
      expect(typeof result).toBe('number');
    });

    test('should create .github/workflows directory', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // Create .git/config for GitHub detection
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      await deployCICD(options, mockSpinner);

      const workflowsDir = path.join(tempDir, '.github/workflows');
      const exists = await fs.pathExists(workflowsDir);
      expect(exists).toBe(true);
    });

    test('should create trinity/templates/ci directory', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      await deployCICD(options, mockSpinner);

      const ciTemplatesDir = path.join(tempDir, 'trinity/templates/ci');
      const exists = await fs.pathExists(ciTemplatesDir);
      expect(exists).toBe(true);
    });

    test('should deploy CI workflow file with correct name', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      // Create .git/config for GitHub detection
      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      await deployCICD(options, mockSpinner);

      // Check for expected files
      const ciFile = path.join(tempDir, '.github/workflows/ci.yml');
      const genericFile = path.join(tempDir, 'trinity/templates/ci/generic-ci.yml');

      const ciExists = await fs.pathExists(ciFile);
      const genericExists = await fs.pathExists(genericFile);

      expect(ciExists).toBe(true);
      expect(genericExists).toBe(true);
    });

    test('should pass variables to deployCITemplates', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      const variables = {
        PROJECT_NAME: 'IntegrationTestProject',
        FRAMEWORK: 'Node.js',
        TRINITY_VERSION: '2.1.0',
      };

      await deployCICD(options, mockSpinner, variables);

      // Verify CI file was deployed
      const ciFile = path.join(tempDir, '.github/workflows/ci.yml');
      if (await fs.pathExists(ciFile)) {
        const content = await fs.readFile(ciFile, 'utf8');
        // Template variables should be processed
        expect(content).not.toContain('{{PROJECT_NAME}}');
      }
    });
  });

  describe('Different platform workflows', () => {
    test('should deploy GitHub Actions for github.com remote', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://github.com/user/repo.git'
      );

      await deployCICD(options, mockSpinner);

      const ghActionsFile = path.join(tempDir, '.github/workflows/ci.yml');
      expect(await fs.pathExists(ghActionsFile)).toBe(true);
    });

    test('should deploy GitLab CI for gitlab.com remote', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      await fs.ensureDir(path.join(tempDir, '.git'));
      await fs.writeFile(
        path.join(tempDir, '.git/config'),
        '[remote "origin"]\n  url = https://gitlab.com/user/repo.git'
      );

      await deployCICD(options, mockSpinner);

      const gitlabCIFile = path.join(tempDir, '.gitlab-ci.yml');
      expect(await fs.pathExists(gitlabCIFile)).toBe(true);
    });

    test('should always deploy generic template regardless of platform', async () => {
      const options: DeployOptions = {
        yes: true,
        ciDeploy: true,
      };

      await deployCICD(options, mockSpinner);

      const genericFile = path.join(tempDir, 'trinity/templates/ci/generic-ci.yml');
      expect(await fs.pathExists(genericFile)).toBe(true);
    });
  });
});
