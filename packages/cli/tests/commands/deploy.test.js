import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { deploy } from '../../src/commands/deploy.js';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('deploy command', () => {
  const testDir = path.join(process.cwd(), 'test-temp-deploy');
  const originalCwd = process.cwd();

  let consoleLogSpy;
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  // ========================================
  // TEST GROUP 1: STACK DETECTION (4 tests)
  // ========================================

  describe('Stack Detection', () => {
    it('should detect Node.js project from package.json', async () => {
      await fs.writeJson('package.json', { name: 'test-project', version: '1.0.0' });

      await deploy({ yes: true, name: 'test-nodejs' });

      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('CLAUDE.md')).toBe(true);

      const rootClaude = await fs.readFile('CLAUDE.md', 'utf8');
      expect(rootClaude).toContain('test-nodejs');
    });

    it('should detect Python project from requirements.txt', async () => {
      await fs.writeFile('requirements.txt', 'flask==2.3.0\nrequests==2.31.0\n');

      await deploy({ yes: true, name: 'test-python' });

      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('CLAUDE.md')).toBe(true);

      const rootClaude = await fs.readFile('CLAUDE.md', 'utf8');
      expect(rootClaude).toContain('Python');
    });

    it('should detect Flutter project from pubspec.yaml', async () => {
      await fs.writeFile('pubspec.yaml',
        'name: test_app\nversion: 1.0.0\ndependencies:\n  flutter:\n    sdk: flutter\n');

      await deploy({ yes: true, name: 'test-flutter' });

      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('CLAUDE.md')).toBe(true);

      const rootClaude = await fs.readFile('CLAUDE.md', 'utf8');
      expect(rootClaude).toContain('Flutter');
    });

    it('should handle unknown project type with generic deployment', async () => {
      // No package.json, requirements.txt, or pubspec.yaml

      await deploy({ yes: true, name: 'test-generic' });

      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('CLAUDE.md')).toBe(true);

      const rootClaude = await fs.readFile('CLAUDE.md', 'utf8');
      expect(rootClaude).toContain('test-generic');
    });
  });

  // ========================================
  // TEST GROUP 2: STRUCTURE DEPLOYMENT (5 tests)
  // ========================================

  describe('Structure Deployment', () => {
    beforeEach(async () => {
      await fs.writeJson('package.json', { name: 'test', version: '1.0.0' });
    });

    it('should create all Trinity directories', async () => {
      await deploy({ yes: true, name: 'test' });

      // Verify all required directories
      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base')).toBe(true);
      expect(await fs.pathExists('trinity/investigations')).toBe(true);
      expect(await fs.pathExists('trinity/patterns')).toBe(true);
      expect(await fs.pathExists('trinity/sessions')).toBe(true);
      expect(await fs.pathExists('trinity/templates')).toBe(true);
      expect(await fs.pathExists('trinity/work-orders')).toBe(true);
    });

    it('should create all knowledge base files', async () => {
      await deploy({ yes: true, name: 'test' });

      expect(await fs.pathExists('trinity/knowledge-base/ARCHITECTURE.md')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base/ISSUES.md')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base/To-do.md')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base/Technical-Debt.md')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base/Trinity.md')).toBe(true);

      // Verify content is processed
      const archContent = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
      expect(archContent).toContain('test'); // Project name replaced
    });

    it('should create work order templates', async () => {
      await deploy({ yes: true, name: 'test' });

      const templates = await fs.readdir('trinity/templates');
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some(f => f.includes('INVESTIGATION') || f.includes('TEMPLATE'))).toBe(true);
    });

    it('should create Claude Code agent configurations', async () => {
      await deploy({ yes: true, name: 'test' });

      expect(await fs.pathExists('.claude')).toBe(true);
      expect(await fs.pathExists('.claude/agents')).toBe(true);

      const agentsDir = await fs.readdir('.claude/agents', { withFileTypes: true });
      const hasAgentFiles = agentsDir.some(entry =>
        entry.isDirectory() || (entry.isFile() && entry.name.endsWith('.md'))
      );
      expect(hasAgentFiles).toBe(true);
    });

    it('should create hierarchical CLAUDE.md files', async () => {
      await deploy({ yes: true, name: 'test-hierarchy' });

      // Root CLAUDE.md
      expect(await fs.pathExists('CLAUDE.md')).toBe(true);
      const rootContent = await fs.readFile('CLAUDE.md', 'utf8');
      expect(rootContent).toContain('test-hierarchy');

      // Trinity CLAUDE.md
      expect(await fs.pathExists('trinity/CLAUDE.md')).toBe(true);
      const trinityContent = await fs.readFile('trinity/CLAUDE.md', 'utf8');
      expect(trinityContent).toContain('Trinity Method');
    });
  });

  // ========================================
  // TEST GROUP 3: METRICS & AUDIT (3 tests)
  // ========================================

  describe('Metrics and Audit', () => {
    beforeEach(async () => {
      await fs.writeJson('package.json', { name: 'test', version: '1.0.0' });
      await fs.ensureDir('src');
      await fs.writeFile('src/test.js', '// TODO: implement\nfunction test() {}\n');
    });

    it('should collect codebase metrics by default', async () => {
      await deploy({ yes: true, name: 'test' });

      const debtFile = await fs.readFile('trinity/knowledge-base/Technical-Debt.md', 'utf8');
      expect(debtFile).toContain('TODO');
    });

    it('should skip metrics with --skip-audit flag', async () => {
      await deploy({
        
        skipAudit: true,
        yes: true,
        name: 'test-no-audit'
      });

      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base/Technical-Debt.md')).toBe(true);
    });

    it('should handle metrics collection errors gracefully', async () => {
      // Empty project, no src folder
      await fs.remove('src');

      await deploy({ yes: true, name: 'test-no-source' });

      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base/Technical-Debt.md')).toBe(true);
    });
  });

  // ========================================
  // TEST GROUP 4: FLAGS & OPTIONS (3 tests)
  // ========================================

  describe('Flags and Options', () => {
    beforeEach(async () => {
      await fs.writeJson('package.json', { name: 'test', version: '1.0.0' });
    });

    it('should skip prompts when --yes flag used', async () => {
      await deploy({ yes: true, name: 'test-auto' });

      // Should deploy without errors
      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('CLAUDE.md')).toBe(true);
    });

    it('should overwrite existing deployment with --force flag', async () => {
      // Create existing deployment
      await fs.ensureDir('trinity');
      await fs.writeFile('trinity/VERSION', '0.5.0');
      await fs.writeFile('CLAUDE.md', 'old content');

      await deploy({ force: true, yes: true, name: 'test-force' });

      // Should have overwritten
      expect(await fs.pathExists('trinity')).toBe(true);
      const content = await fs.readFile('CLAUDE.md', 'utf8');
      expect(content).not.toBe('old content');
      expect(content).toContain('test-force');
    });

    it('should use project name from options', async () => {
      await deploy({ yes: true, name: 'custom-project-name' });

      const claudeMd = await fs.readFile('CLAUDE.md', 'utf8');
      expect(claudeMd).toContain('custom-project-name');
    });
  });

  // ========================================
  // TEST GROUP 5: ERROR HANDLING (2 tests)
  // ========================================

  describe('Error Handling', () => {
    beforeEach(async () => {
      await fs.writeJson('package.json', { name: 'test', version: '1.0.0' });
    });

    it('should throw error when Trinity already exists without --force', async () => {
      await fs.ensureDir('trinity');
      await fs.writeFile('trinity/VERSION', '1.0.0');

      // Should throw error without force flag
      await expect(deploy({ yes: true, name: 'test' }))
        .rejects.toThrow('Trinity already deployed');
    });

    it('should deploy Claude Code-exclusive files', async () => {
      await deploy({ yes: true, name: 'test-claude-exclusive' });

      expect(await fs.pathExists('trinity')).toBe(true);
      expect(await fs.pathExists('.claude')).toBe(true);
      // Should NOT create non-Claude directories
      expect(await fs.pathExists('.cursor')).toBe(false);
      expect(await fs.pathExists('.github/copilot')).toBe(false);
      expect(await fs.pathExists('.aider')).toBe(false);
    });
  });

  // ========================================
  // TEST GROUP 6: VERSION & METADATA (2 tests)
  // ========================================

  describe('Version and Metadata', () => {
    beforeEach(async () => {
      await fs.writeJson('package.json', { name: 'test', version: '1.0.0' });
    });

    it('should create VERSION file in trinity directory', async () => {
      await deploy({ yes: true, name: 'test' });

      expect(await fs.pathExists('trinity/VERSION')).toBe(true);
      const version = await fs.readFile('trinity/VERSION', 'utf8');
      expect(version.trim()).toMatch(/^\d+\.\d+\.\d+$/); // Semver format
    });

    it('should process template variables in deployed files', async () => {
      await deploy({ yes: true, name: 'test-vars' });

      const archFile = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
      expect(archFile).toContain('test-vars');
      expect(archFile).not.toContain('{{PROJECT_NAME}}'); // Placeholder should be replaced
    });
  });
  // ========================================
  // TEST GROUP 7: SLASH COMMANDS (2 tests)
  // ========================================

  describe('Slash Commands Deployment', () => {
    beforeEach(async () => {
      await fs.writeJson('package.json', { name: 'test', version: '1.0.0' });
    });

    it('should deploy all 8 trinity slash commands', async () => {
      await deploy({ yes: true, name: 'test-commands' });

      const commands = [
        '.claude/commands/trinity-init.md',
        '.claude/commands/trinity-verify.md',
        '.claude/commands/trinity-docs.md',
        '.claude/commands/trinity-start.md',
        '.claude/commands/trinity-continue.md',
        '.claude/commands/trinity-end.md',
        '.claude/commands/trinity-workorder.md',
        '.claude/commands/trinity-agents.md'
      ];

      for (const cmd of commands) {
        expect(await fs.pathExists(cmd)).toBe(true);
      }
    });

    it('should deploy Claude Code-exclusive structure', async () => {
      await deploy({ yes: true, name: 'test-claude-only' });

      // Verify .claude directory and subdirectories
      expect(await fs.pathExists('.claude')).toBe(true);
      expect(await fs.pathExists('.claude/agents')).toBe(true);
      expect(await fs.pathExists('.claude/commands')).toBe(true);
      expect(await fs.pathExists('.claude/hooks')).toBe(true);
      expect(await fs.pathExists('.claude/settings.json')).toBe(true);
    });
  });
});
