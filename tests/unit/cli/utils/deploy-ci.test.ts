/**
 * Unit Tests - deploy-ci.ts
 *
 * Tests CI template deployment for GitHub Actions, GitLab CI, and generic workflows
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { deployCITemplates } from '../../../../src/cli/utils/deploy-ci.js';
import { cleanupTempDir } from '../../../helpers/test-helpers.js';

describe('deploy-ci', () => {
  let testDir: string;
  let originalCwd: string;
  let templatesPath: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), `.tmp-test-deploy-ci-${Date.now()}`);
    await fs.ensureDir(testDir);
    process.chdir(testDir);

    // Create mock template files in dist structure
    // Note: deploy-ci.ts uses __dirname which points to dist/cli/utils
    // Templates are at dist/templates/ci
    templatesPath = path.join(testDir, 'dist', 'templates', 'ci');
    await fs.ensureDir(templatesPath);

    // Create template files (CI only - no CD)
    await fs.writeFile(
      path.join(templatesPath, 'ci.yml.template'),
      'name: {{PROJECT_NAME}} CI\non:\n  push:\njobs:\n  test:\n    runs-on: ubuntu-latest'
    );
    await fs.writeFile(path.join(templatesPath, 'gitlab-ci.yml'), 'stages:\n  - test\n  - deploy');
    await fs.writeFile(
      path.join(templatesPath, 'generic-ci.yml'),
      'version: 1\nsteps:\n  - run: npm test'
    );

    // Mock the __dirname path resolution by creating the expected structure
    // The module uses path.join(__dirname, '../../templates/ci')
    // If __dirname is dist/cli/utils, then ../../templates/ci = dist/templates/ci
    await fs.ensureDir(path.join(testDir, 'dist', 'cli', 'utils'));
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTempDir(testDir);
  });

  describe('GitHub Platform Detection', () => {
    it('should deploy GitHub Actions CI workflow when .git/config contains github.com', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://github.com/user/repo.git'
      );

      const stats = await deployCITemplates();

      expect(stats.deployed).toContain('.github/workflows/ci.yml');
      expect(await fs.pathExists('.github/workflows/ci.yml')).toBe(true);
    });

    it('should deploy generic template regardless of platform', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://github.com/user/repo.git'
      );

      const stats = await deployCITemplates();

      expect(stats.deployed).toContain('trinity/templates/ci/generic-ci.yml');
      expect(await fs.pathExists('trinity/templates/ci/generic-ci.yml')).toBe(true);
    });
  });

  describe('GitLab Platform Detection', () => {
    it('should deploy GitLab CI when .git/config contains gitlab.com', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://gitlab.com/user/repo.git'
      );

      const stats = await deployCITemplates();

      expect(stats.deployed).toContain('.gitlab-ci.yml');
      expect(await fs.pathExists('.gitlab-ci.yml')).toBe(true);
    });

    it('should detect self-hosted GitLab instances', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://gitlab.mycompany.com/user/repo.git'
      );

      const stats = await deployCITemplates();

      expect(stats.deployed).toContain('.gitlab-ci.yml');
    });

    it('should skip existing .gitlab-ci.yml without --force', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://gitlab.com/user/repo.git'
      );
      await fs.writeFile('.gitlab-ci.yml', 'existing content');

      const stats = await deployCITemplates();

      expect(stats.skipped).toContain('.gitlab-ci.yml (already exists)');
      const content = await fs.readFile('.gitlab-ci.yml', 'utf8');
      expect(content).toBe('existing content'); // Preserved
    });

    it('should overwrite existing .gitlab-ci.yml with --force', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://gitlab.com/user/repo.git'
      );
      await fs.writeFile('.gitlab-ci.yml', 'existing content');

      const stats = await deployCITemplates({ force: true });

      expect(stats.deployed).toContain('.gitlab-ci.yml');
      const content = await fs.readFile('.gitlab-ci.yml', 'utf8');
      expect(content).toContain('stages:'); // New content
    });
  });

  describe('Unknown Platform Handling', () => {
    it('should deploy GitHub Actions for unknown platform', async () => {
      // No .git directory
      const stats = await deployCITemplates();

      expect(stats.deployed).toContain('.github/workflows/ci.yml');
      expect(stats.deployed).toContain('trinity/templates/ci/generic-ci.yml');
    });

    it('should deploy GitHub Actions when .git/config has no known remote', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile('.git/config', '[core]\n\tbare = false');

      const stats = await deployCITemplates();

      expect(stats.deployed).toContain('.github/workflows/ci.yml');
    });
  });

  describe('Deployment Statistics', () => {
    it('should return deployment statistics', async () => {
      const stats = await deployCITemplates();

      expect(stats).toHaveProperty('deployed');
      expect(stats).toHaveProperty('skipped');
      expect(stats).toHaveProperty('errors');
      expect(Array.isArray(stats.deployed)).toBe(true);
      expect(Array.isArray(stats.skipped)).toBe(true);
      expect(Array.isArray(stats.errors)).toBe(true);
    });

    it('should track multiple deployed files', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://github.com/user/repo.git'
      );

      const stats = await deployCITemplates();

      expect(stats.deployed.length).toBeGreaterThanOrEqual(2); // ci.yml, generic-ci.yml
    });

    it('should have no errors on successful deployment', async () => {
      const stats = await deployCITemplates();

      expect(stats.errors.length).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing template files gracefully', async () => {
      // Remove template files
      await fs.remove(templatesPath);

      const stats = await deployCITemplates();

      // Should still return stats without crashing
      expect(stats).toHaveProperty('deployed');
      expect(stats).toHaveProperty('errors');
    });

    it('should continue deployment if one file fails', async () => {
      await fs.ensureDir('.git');
      await fs.writeFile(
        '.git/config',
        '[remote "origin"]\n\turl = https://github.com/user/repo.git'
      );

      // Create a directory where ci.yml should be (will cause write error)
      // Must use --force to bypass the existence check and trigger write error
      await fs.ensureDir('.github/workflows/ci.yml');

      const stats = await deployCITemplates({ force: true });

      // Should have some errors but continue with other files
      expect(stats.errors.length).toBeGreaterThan(0);
      // Generic template should still be deployed
      expect(stats.deployed).toContain('trinity/templates/ci/generic-ci.yml');
    });
  });

  describe('Directory Creation', () => {
    it('should create .github/workflows directory if missing', async () => {
      expect(await fs.pathExists('.github/workflows')).toBe(false);

      await deployCITemplates();

      expect(await fs.pathExists('.github/workflows')).toBe(true);
    });

    it('should create trinity/templates/ci directory if missing', async () => {
      expect(await fs.pathExists('trinity/templates/ci')).toBe(false);

      await deployCITemplates();

      expect(await fs.pathExists('trinity/templates/ci')).toBe(true);
    });
  });

  describe('File Content', () => {
    it('should preserve template content in deployed files', async () => {
      await deployCITemplates();

      const ciContent = await fs.readFile('.github/workflows/ci.yml', 'utf8');
      expect(ciContent).toContain('CI');
    });

    it('should deploy generic template with correct content', async () => {
      await deployCITemplates();

      const genericContent = await fs.readFile('trinity/templates/ci/generic-ci.yml', 'utf8');
      expect(genericContent).toContain('test');
    });
  });

  describe('Template Variable Processing', () => {
    it('should process template variables in deployed CI workflow', async () => {
      const variables = {
        PROJECT_NAME: 'TestProject',
        FRAMEWORK: 'Node.js',
        TRINITY_VERSION: '2.1.0',
      };

      await deployCITemplates({}, variables);

      const ciContent = await fs.readFile('.github/workflows/ci.yml', 'utf8');
      expect(ciContent).toContain('TestProject');
      expect(ciContent).not.toContain('{{PROJECT_NAME}}');
    });

    it('should use default values when no variables provided', async () => {
      await deployCITemplates();

      const ciContent = await fs.readFile('.github/workflows/ci.yml', 'utf8');
      // processTemplate fills defaults: PROJECT_NAME → 'Unknown Project'
      expect(ciContent).toContain('Unknown Project');
      expect(ciContent).not.toContain('{{PROJECT_NAME}}');
    });
  });

  describe('--force Flag Protection', () => {
    it('should skip existing ci.yml without --force', async () => {
      await fs.ensureDir('.github/workflows');
      await fs.writeFile('.github/workflows/ci.yml', 'existing ci content');

      const stats = await deployCITemplates();

      expect(stats.skipped).toContain('.github/workflows/ci.yml (already exists)');
      const content = await fs.readFile('.github/workflows/ci.yml', 'utf8');
      expect(content).toBe('existing ci content');
    });

    it('should overwrite existing ci.yml with --force', async () => {
      await fs.ensureDir('.github/workflows');
      await fs.writeFile('.github/workflows/ci.yml', 'existing ci content');

      const stats = await deployCITemplates({ force: true });

      expect(stats.deployed).toContain('.github/workflows/ci.yml');
      const content = await fs.readFile('.github/workflows/ci.yml', 'utf8');
      expect(content).not.toBe('existing ci content');
    });
  });
});
