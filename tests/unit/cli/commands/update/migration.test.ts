/**
 * Unit Tests - Update Migration Module
 * Tests legacy deployment detection, directory migration, and gitignore migration
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import ora from 'ora';
import {
  detectLegacyDeployment,
  migrateLegacyDeployment,
  updateGitignoreForMigration,
} from '../../../../../src/cli/commands/update/migration.js';

describe('Update Migration Module', () => {
  let testDir: string;
  let originalCwd: string;
  let spinner: ReturnType<typeof ora>;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'trinity-migration-test-'));
    originalCwd = process.cwd();
    process.chdir(testDir);
    spinner = ora();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('detectLegacyDeployment', () => {
    it('should detect legacy trinity/ directory at root', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.writeFile('trinity/VERSION', '1.0.0');

      const result = await detectLegacyDeployment(spinner);

      expect(result.isLegacy).toBe(true);
      expect(result.legacyVersion).toBe('1.0.0');
    });

    it('should return false when no legacy directory exists', async () => {
      const result = await detectLegacyDeployment(spinner);

      expect(result.isLegacy).toBe(false);
      expect(result.legacyVersion).toBeNull();
    });

    it('should detect legacy directory without VERSION file', async () => {
      await fs.ensureDir('trinity/knowledge-base');

      const result = await detectLegacyDeployment(spinner);

      expect(result.isLegacy).toBe(true);
      expect(result.legacyVersion).toBeNull();
    });

    it('should return false when only .claude/trinity exists', async () => {
      await fs.ensureDir('.claude/trinity/knowledge-base');
      await fs.writeFile('.claude/trinity/VERSION', '2.2.0');

      const result = await detectLegacyDeployment(spinner);

      expect(result.isLegacy).toBe(false);
      expect(result.legacyVersion).toBeNull();
    });
  });

  describe('migrateLegacyDeployment', () => {
    it('should move trinity/ contents to .claude/trinity/', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.writeFile('trinity/VERSION', '1.0.0');
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'My architecture');

      await migrateLegacyDeployment(spinner);

      expect(await fs.pathExists('.claude/trinity/VERSION')).toBe(true);
      expect(await fs.pathExists('.claude/trinity/knowledge-base/ARCHITECTURE.md')).toBe(true);
      expect(await fs.readFile('.claude/trinity/VERSION', 'utf8')).toBe('1.0.0');
    });

    it('should preserve user knowledge base files', async () => {
      const userContent = 'Custom user architecture notes';
      await fs.ensureDir('trinity/knowledge-base');
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', userContent);
      await fs.writeFile('trinity/knowledge-base/To-do.md', 'User todos');
      await fs.writeFile('trinity/knowledge-base/ISSUES.md', 'User issues');
      await fs.writeFile('trinity/knowledge-base/Technical-Debt.md', 'User debt');

      await migrateLegacyDeployment(spinner);

      expect(await fs.readFile('.claude/trinity/knowledge-base/ARCHITECTURE.md', 'utf8')).toBe(
        userContent
      );
      expect(await fs.readFile('.claude/trinity/knowledge-base/To-do.md', 'utf8')).toBe(
        'User todos'
      );
      expect(await fs.readFile('.claude/trinity/knowledge-base/ISSUES.md', 'utf8')).toBe(
        'User issues'
      );
      expect(await fs.readFile('.claude/trinity/knowledge-base/Technical-Debt.md', 'utf8')).toBe(
        'User debt'
      );
    });

    it('should remove old trinity/ directory after migration', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.writeFile('trinity/VERSION', '1.0.0');

      await migrateLegacyDeployment(spinner);

      expect(await fs.pathExists('trinity')).toBe(false);
    });

    it('should create .claude agent and command directories', async () => {
      await fs.ensureDir('trinity');

      await migrateLegacyDeployment(spinner);

      expect(await fs.pathExists('.claude/agents/leadership')).toBe(true);
      expect(await fs.pathExists('.claude/agents/planning')).toBe(true);
      expect(await fs.pathExists('.claude/agents/deployment')).toBe(true);
      expect(await fs.pathExists('.claude/agents/audit')).toBe(true);
      expect(await fs.pathExists('.claude/agents/aj-team')).toBe(true);
      expect(await fs.pathExists('.claude/commands')).toBe(true);
    });

    it('should not overwrite existing .claude/trinity files', async () => {
      // Set up legacy dir with old content
      await fs.ensureDir('trinity');
      await fs.writeFile('trinity/VERSION', '1.0.0');

      // Set up new dir with existing content
      await fs.ensureDir('.claude/trinity');
      await fs.writeFile('.claude/trinity/VERSION', '2.2.0');

      await migrateLegacyDeployment(spinner);

      // New version should be preserved (not overwritten by old)
      expect(await fs.readFile('.claude/trinity/VERSION', 'utf8')).toBe('2.2.0');
    });
  });

  describe('updateGitignoreForMigration', () => {
    it('should replace old Trinity patterns with current ones', async () => {
      const oldGitignore = [
        'node_modules/',
        '',
        '# Trinity Method SDK',
        'trinity/',
        '*CLAUDE.md',
        'TRINITY.md',
        '',
        'dist/',
      ].join('\n');
      await fs.writeFile('.gitignore', oldGitignore);

      await updateGitignoreForMigration(spinner);

      const content = await fs.readFile('.gitignore', 'utf8');
      expect(content).toContain('.claude/');
      expect(content).toContain('*CLAUDE.md');
      expect(content).not.toMatch(/^trinity\/$/m);
      expect(content).not.toMatch(/^TRINITY\.md$/m);
      expect(content).toContain('node_modules/');
      expect(content).toContain('dist/');
    });

    it('should add Trinity section if none exists', async () => {
      await fs.writeFile('.gitignore', 'node_modules/\ndist/\n');

      await updateGitignoreForMigration(spinner);

      const content = await fs.readFile('.gitignore', 'utf8');
      expect(content).toContain('# Trinity Method SDK');
      expect(content).toContain('.claude/');
      expect(content).toContain('*CLAUDE.md');
    });

    it('should be idempotent', async () => {
      const gitignore = `${[
        'node_modules/',
        '',
        '# Trinity Method SDK',
        '.claude/',
        '*CLAUDE.md',
      ].join('\n')}\n`;
      await fs.writeFile('.gitignore', gitignore);

      const result = await updateGitignoreForMigration(spinner);

      // Should return false since nothing changed
      expect(result).toBe(false);
    });

    it('should return false when no .gitignore exists', async () => {
      const result = await updateGitignoreForMigration(spinner);

      expect(result).toBe(false);
    });

    it('should preserve non-Trinity entries', async () => {
      const gitignore = [
        'node_modules/',
        '.env',
        'coverage/',
        '',
        '# Trinity Method SDK',
        'trinity/',
        '*CLAUDE.md',
        '',
        'dist/',
        'build/',
      ].join('\n');
      await fs.writeFile('.gitignore', gitignore);

      await updateGitignoreForMigration(spinner);

      const content = await fs.readFile('.gitignore', 'utf8');
      expect(content).toContain('node_modules/');
      expect(content).toContain('.env');
      expect(content).toContain('coverage/');
      expect(content).toContain('dist/');
      expect(content).toContain('build/');
    });

    it('should handle gitignore with only Trinity section', async () => {
      const gitignore = '# Trinity Method SDK\ntrinity/\n*CLAUDE.md\n';
      await fs.writeFile('.gitignore', gitignore);

      await updateGitignoreForMigration(spinner);

      const content = await fs.readFile('.gitignore', 'utf8');
      expect(content).toContain('# Trinity Method SDK');
      expect(content).toContain('.claude/');
      expect(content).not.toMatch(/^trinity\/$/m);
    });

    it('should migrate v2.2.1 granular patterns to simplified patterns', async () => {
      const gitignore = [
        'node_modules/',
        '',
        '# Trinity Method SDK',
        '.claude/trinity/archive/',
        '.claude/trinity/templates/',
        '*CLAUDE.md',
      ].join('\n');
      await fs.writeFile('.gitignore', gitignore);

      await updateGitignoreForMigration(spinner);

      const content = await fs.readFile('.gitignore', 'utf8');
      expect(content).toContain('.claude/');
      expect(content).toContain('*CLAUDE.md');
      expect(content).not.toMatch(/^\.claude\/trinity\/archive\/$/m);
      expect(content).not.toMatch(/^\.claude\/trinity\/templates\/$/m);
      expect(content).toContain('node_modules/');
    });
  });
});
