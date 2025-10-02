import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { deployCITemplates } from '../../src/utils/deploy-ci.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('deploy-ci', () => {
  let tempDir;
  let originalCwd;
  let consoleLogSpy;

  beforeEach(async () => {
    // Create temp directory for tests
    tempDir = path.join(__dirname, `test-temp-${Date.now()}`);
    await fs.ensureDir(tempDir);
    originalCwd = process.cwd();
    process.chdir(tempDir);

    // Suppress console output
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(async () => {
    // Restore original directory and cleanup
    process.chdir(originalCwd);
    await fs.remove(tempDir);
    consoleLogSpy.mockRestore();
  });

  describe('deployCITemplates', () => {
    it('should deploy GitHub Actions workflow for GitHub repository', async () => {
      // Setup: Create .git/config with GitHub remote
      await fs.ensureDir('.git');
      await fs.writeFile('.git/config', `
[remote "origin"]
  url = https://github.com/user/repo.git
`);

      const stats = await deployCITemplates({ yes: true });

      expect(stats.deployed).toContain('.github/workflows/trinity-ci.yml');
      expect(await fs.pathExists('.github/workflows/trinity-ci.yml')).toBe(true);
    });

    it('should deploy GitLab CI workflow for GitLab repository', async () => {
      // Setup: Create .git/config with GitLab remote
      await fs.ensureDir('.git');
      await fs.writeFile('.git/config', `
[remote "origin"]
  url = https://gitlab.com/user/repo.git
`);

      const stats = await deployCITemplates({ yes: true });

      expect(stats.deployed).toContain('.gitlab-ci.yml');
      expect(await fs.pathExists('.gitlab-ci.yml')).toBe(true);
    });

    it('should deploy generic CI template to trinity/templates/ci', async () => {
      const stats = await deployCITemplates({ yes: true });

      expect(stats.deployed).toContain('trinity/templates/ci/generic-ci.yml');
      expect(await fs.pathExists('trinity/templates/ci/generic-ci.yml')).toBe(true);
    });

    it('should deploy GitHub Actions by default for unknown platforms', async () => {
      // No .git directory - unknown platform
      const stats = await deployCITemplates({ yes: true });

      expect(stats.deployed).toContain('.github/workflows/trinity-ci.yml');
      expect(await fs.pathExists('.github/workflows/trinity-ci.yml')).toBe(true);
    });

    it('should skip existing GitLab CI file without --force flag', async () => {
      // Setup GitLab repo with existing .gitlab-ci.yml
      await fs.ensureDir('.git');
      await fs.writeFile('.git/config', `
[remote "origin"]
  url = https://gitlab.com/user/repo.git
`);
      await fs.writeFile('.gitlab-ci.yml', 'existing content');

      const stats = await deployCITemplates({ yes: true });

      expect(stats.skipped.some(s => s.includes('.gitlab-ci.yml'))).toBe(true);
      const content = await fs.readFile('.gitlab-ci.yml', 'utf8');
      expect(content).toBe('existing content');
    });

    it('should overwrite existing GitLab CI file with --force flag', async () => {
      // Setup GitLab repo with existing .gitlab-ci.yml
      await fs.ensureDir('.git');
      await fs.writeFile('.git/config', `
[remote "origin"]
  url = https://gitlab.com/user/repo.git
`);
      await fs.writeFile('.gitlab-ci.yml', 'existing content');

      const stats = await deployCITemplates({ yes: true, force: true });

      expect(stats.deployed).toContain('.gitlab-ci.yml');
      const content = await fs.readFile('.gitlab-ci.yml', 'utf8');
      expect(content).not.toBe('existing content');
      expect(content).toContain('stages:');
    });

    it('should return error statistics for deployment failures', async () => {
      // Setup: Make trinity/templates/ci read-only to cause failure
      await fs.ensureDir('trinity/templates/ci');

      // Create a mock that throws an error
      const originalPathExists = fs.pathExists;
      jest.spyOn(fs, 'pathExists').mockImplementation(async (p) => {
        if (p.includes('generic-ci.yml')) {
          throw new Error('Permission denied');
        }
        return originalPathExists.call(fs, p);
      });

      const stats = await deployCITemplates({ yes: true });

      expect(stats.errors.length).toBeGreaterThan(0);

      fs.pathExists.mockRestore();
    });

    it('should handle deployment when templates directory is accessible', async () => {
      // Test that deployment works with normal file system access
      const stats = await deployCITemplates({ yes: true });

      // Should always deploy generic template at minimum
      expect(stats.deployed.length).toBeGreaterThan(0);
      expect(stats.deployed).toContain('trinity/templates/ci/generic-ci.yml');
    });
  });

  describe('GitHub Actions template content', () => {
    it('should contain required GitHub Actions workflow structure', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile('.git/config', `
[remote "origin"]
  url = https://github.com/user/repo.git
`);

      await deployCITemplates({ yes: true });

      const content = await fs.readFile('.github/workflows/trinity-ci.yml', 'utf8');

      expect(content).toContain('name: Trinity Method CI');
      expect(content).toContain('on:');
      expect(content).toContain('jobs:');
      expect(content).toContain('test:');
      expect(content).toContain('build:');
      expect(content).toContain('npm test');
      expect(content).toContain('npx trinity deploy --agent claude --ci-deploy --yes');
    });
  });

  describe('GitLab CI template content', () => {
    it('should contain required GitLab CI structure', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile('.git/config', `
[remote "origin"]
  url = https://gitlab.com/user/repo.git
`);

      await deployCITemplates({ yes: true });

      const content = await fs.readFile('.gitlab-ci.yml', 'utf8');

      expect(content).toContain('stages:');
      expect(content).toContain('- test');
      expect(content).toContain('- build');
      expect(content).toContain('- deploy');
      expect(content).toContain('test:unit:');
      expect(content).toContain('test:coverage:');
      expect(content).toContain('deploy:trinity:');
      expect(content).toContain('npx trinity deploy --agent claude --ci-deploy --yes');
    });
  });

  describe('Generic CI template content', () => {
    it('should contain platform-agnostic CI configuration', async () => {
      await deployCITemplates({ yes: true });

      const content = await fs.readFile('trinity/templates/ci/generic-ci.yml', 'utf8');

      expect(content).toContain('# Generic CI/CD Template');
      expect(content).toContain('install_dependencies:');
      expect(content).toContain('lint:');
      expect(content).toContain('test:');
      expect(content).toContain('build:');
      expect(content).toContain('deploy_trinity:');
      expect(content).toContain('npx trinity deploy --agent claude --ci-deploy --yes');
    });
  });
});
