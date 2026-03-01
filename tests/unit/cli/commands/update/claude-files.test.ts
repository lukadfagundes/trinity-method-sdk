/**
 * Unit Tests - Update Claude Files Module
 * Tests CLAUDE.md context file and EMPLOYEE-DIRECTORY updates during trinity update
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import ora from 'ora';
import type { UpdateStats } from '../../../../../src/cli/commands/update/types.js';

// Mock getSDKPath before importing the module under test
const mockGetSDKPath = jest.fn<() => Promise<string>>();
jest.unstable_mockModule('../../../../../src/cli/commands/update/utils.js', () => ({
  getSDKPath: mockGetSDKPath,
}));

// Dynamic import of module under test (must come after mock setup)
const { updateClaudeFiles } =
  await import('../../../../../src/cli/commands/update/claude-files.js');

describe('Update Claude Files Module', () => {
  let testDir: string;
  let sdkDir: string;
  let originalCwd: string;
  let spinner: ReturnType<typeof ora>;
  let stats: UpdateStats;

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'trinity-claude-files-test-'));
    sdkDir = path.join(testDir, 'sdk');
    originalCwd = process.cwd();
    process.chdir(testDir);

    spinner = ora();
    stats = {
      agentsUpdated: 0,
      templatesUpdated: 0,
      knowledgeBaseUpdated: 0,
      commandsUpdated: 0,
      claudeFilesUpdated: 0,
      filesUpdated: 0,
      legacyMigrated: false,
      gitignoreUpdated: false,
    };

    // Set up mock SDK templates directory
    const templatesDir = path.join(sdkDir, 'dist/templates');

    // Root CLAUDE.md template
    await fs.ensureDir(path.join(templatesDir, 'root'));
    await fs.writeFile(
      path.join(templatesDir, 'root', 'CLAUDE.md.template'),
      '# {{PROJECT_NAME}} - Root Context\n\nFramework: {{FRAMEWORK}}\n'
    );

    // Trinity CLAUDE.md template
    await fs.ensureDir(path.join(templatesDir, 'trinity'));
    await fs.writeFile(
      path.join(templatesDir, 'trinity', 'CLAUDE.md.template'),
      '# Trinity Context for {{PROJECT_NAME}}\n'
    );

    // Source CLAUDE.md templates
    await fs.ensureDir(path.join(templatesDir, 'source'));
    await fs.writeFile(
      path.join(templatesDir, 'source', 'nodejs-CLAUDE.md.template'),
      '# Node.js Source - {{SOURCE_DIR}}\n'
    );
    await fs.writeFile(
      path.join(templatesDir, 'source', 'base-CLAUDE.md.template'),
      '# Source - {{SOURCE_DIR}}\n'
    );
    await fs.writeFile(
      path.join(templatesDir, 'source', 'tests-CLAUDE.md.template'),
      '# Tests - {{TEST_FRAMEWORK}}\n'
    );

    // EMPLOYEE-DIRECTORY template
    await fs.ensureDir(path.join(templatesDir, '.claude'));
    await fs.writeFile(
      path.join(templatesDir, '.claude', 'EMPLOYEE-DIRECTORY.md.template'),
      '# Employee Directory - {{PROJECT_NAME}}\n'
    );

    // Create package.json so detectStack works
    await fs.writeJson('package.json', {
      name: 'test-project',
      devDependencies: { jest: '^29.0.0' },
    });

    // Create src/ directory so detectStack finds it
    await fs.ensureDir('src');

    // Configure mock
    mockGetSDKPath.mockResolvedValue(sdkDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
    jest.restoreAllMocks();
  });

  describe('Root CLAUDE.md', () => {
    it('should deploy root CLAUDE.md when missing', async () => {
      await updateClaudeFiles(spinner, stats);

      expect(await fs.pathExists('CLAUDE.md')).toBe(true);
      const content = await fs.readFile('CLAUDE.md', 'utf8');
      expect(content).toContain('test-project');
      expect(stats.claudeFilesUpdated).toBeGreaterThanOrEqual(1);
    });

    it('should overwrite root CLAUDE.md when it already exists', async () => {
      await fs.writeFile('CLAUDE.md', 'old content');

      await updateClaudeFiles(spinner, stats);

      const content = await fs.readFile('CLAUDE.md', 'utf8');
      expect(content).not.toBe('old content');
      expect(content).toContain('test-project');
    });
  });

  describe('.claude/trinity/CLAUDE.md', () => {
    it('should deploy trinity CLAUDE.md when missing', async () => {
      await updateClaudeFiles(spinner, stats);

      expect(await fs.pathExists('.claude/trinity/CLAUDE.md')).toBe(true);
      const content = await fs.readFile('.claude/trinity/CLAUDE.md', 'utf8');
      expect(content).toContain('test-project');
    });

    it('should overwrite trinity CLAUDE.md when it already exists', async () => {
      await fs.ensureDir('.claude/trinity');
      await fs.writeFile('.claude/trinity/CLAUDE.md', 'old content');

      await updateClaudeFiles(spinner, stats);

      const content = await fs.readFile('.claude/trinity/CLAUDE.md', 'utf8');
      expect(content).not.toBe('old content');
    });
  });

  describe('Source directory CLAUDE.md', () => {
    it('should deploy source dir CLAUDE.md when missing', async () => {
      await updateClaudeFiles(spinner, stats);

      expect(await fs.pathExists('src/CLAUDE.md')).toBe(true);
      const content = await fs.readFile('src/CLAUDE.md', 'utf8');
      expect(content).toContain('src');
    });

    it('should skip source dir CLAUDE.md when it already exists', async () => {
      await fs.writeFile('src/CLAUDE.md', 'user customized content');

      await updateClaudeFiles(spinner, stats);

      const content = await fs.readFile('src/CLAUDE.md', 'utf8');
      expect(content).toBe('user customized content');
    });
  });

  describe('tests/CLAUDE.md', () => {
    it('should deploy tests/CLAUDE.md when tests/ exists but CLAUDE.md is missing', async () => {
      await fs.ensureDir('tests');

      await updateClaudeFiles(spinner, stats);

      expect(await fs.pathExists('tests/CLAUDE.md')).toBe(true);
      const content = await fs.readFile('tests/CLAUDE.md', 'utf8');
      expect(content).toContain('# Tests');
    });

    it('should skip tests/CLAUDE.md when it already exists', async () => {
      await fs.ensureDir('tests');
      await fs.writeFile('tests/CLAUDE.md', 'user test context');

      await updateClaudeFiles(spinner, stats);

      const content = await fs.readFile('tests/CLAUDE.md', 'utf8');
      expect(content).toBe('user test context');
    });

    it('should not deploy tests/CLAUDE.md when tests/ does not exist', async () => {
      await updateClaudeFiles(spinner, stats);

      expect(await fs.pathExists('tests/CLAUDE.md')).toBe(false);
    });
  });

  describe('EMPLOYEE-DIRECTORY.md', () => {
    it('should deploy EMPLOYEE-DIRECTORY.md when missing', async () => {
      await updateClaudeFiles(spinner, stats);

      expect(await fs.pathExists('.claude/EMPLOYEE-DIRECTORY.md')).toBe(true);
      const content = await fs.readFile('.claude/EMPLOYEE-DIRECTORY.md', 'utf8');
      expect(content).toContain('test-project');
    });

    it('should overwrite EMPLOYEE-DIRECTORY.md when it already exists', async () => {
      await fs.ensureDir('.claude');
      await fs.writeFile('.claude/EMPLOYEE-DIRECTORY.md', 'old directory');

      await updateClaudeFiles(spinner, stats);

      const content = await fs.readFile('.claude/EMPLOYEE-DIRECTORY.md', 'utf8');
      expect(content).not.toBe('old directory');
    });
  });

  describe('Stats tracking', () => {
    it('should correctly increment claudeFilesUpdated', async () => {
      await fs.ensureDir('tests');

      await updateClaudeFiles(spinner, stats);

      // Root + Trinity + src/CLAUDE.md + tests/CLAUDE.md + EMPLOYEE-DIRECTORY = 5
      expect(stats.claudeFilesUpdated).toBe(5);
    });

    it('should count fewer when source and test CLAUDE.md already exist', async () => {
      await fs.writeFile('src/CLAUDE.md', 'existing');
      await fs.ensureDir('tests');
      await fs.writeFile('tests/CLAUDE.md', 'existing');

      await updateClaudeFiles(spinner, stats);

      // Root + Trinity + EMPLOYEE-DIRECTORY = 3 (skipped src and tests)
      expect(stats.claudeFilesUpdated).toBe(3);
    });
  });

  describe('Edge cases', () => {
    it('should handle missing template files gracefully', async () => {
      // Remove all templates entirely
      await fs.remove(path.join(sdkDir, 'dist'));

      await updateClaudeFiles(spinner, stats);

      expect(stats.claudeFilesUpdated).toBe(0);
    });

    it('should process templates with correct variable substitution', async () => {
      await updateClaudeFiles(spinner, stats);

      const content = await fs.readFile('CLAUDE.md', 'utf8');
      // Should not contain unresolved template variables
      expect(content).not.toContain('{{PROJECT_NAME}}');
    });
  });
});
