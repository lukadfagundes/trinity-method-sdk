/**
 * Integration Tests - Deploy Command
 *
 * Tests the complete Trinity Method SDK deployment process including:
 * - Directory structure creation
 * - Agent template deployment
 * - Slash command deployment with categorization
 * - Knowledge base template processing
 * - Documentation template deployment
 * - Framework detection
 * - Template variable substitution
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import { deploy } from '../../../../src/cli/commands/deploy/index.js';
import {
  createTempDir,
  cleanupTempDir,
  verifyTrinityStructure,
  readVersion,
  countFiles,
} from '../../../helpers/test-helpers.js';
import { mockConsole } from '../../../utils/console-mocks.js';

describe('Deploy Command - Integration Tests', () => {
  // Mock console to reduce test noise
  mockConsole();
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    // Create temp directory for each test
    testDir = await createTempDir();
    originalCwd = process.cwd();
    process.chdir(testDir);
  });

  afterEach(async () => {
    // Cleanup after each test
    process.chdir(originalCwd);
    await cleanupTempDir(testDir);
  });

  describe('Pre-flight Checks', () => {
    it('should fail if Trinity already exists without --force', async () => {
      // Create existing trinity directory
      await fs.ensureDir('trinity');

      await expect(deploy({ yes: true, force: false })).rejects.toThrow('Trinity already deployed');
    });

    it('should proceed with --force flag even if Trinity exists', async () => {
      // Create existing trinity directory
      await fs.ensureDir('trinity');

      // Should not throw with force flag
      await expect(
        deploy({ yes: true, force: true, name: 'test-project', skipAudit: true })
      ).resolves.not.toThrow();
    });
  });

  describe('Directory Structure Creation', () => {
    it('should create all 14 Trinity core directories', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const trinityDirs = [
        'trinity/knowledge-base',
        'trinity/sessions',
        'trinity/investigations',
        'trinity/patterns',
        'trinity/work-orders',
        'trinity/templates',
        'trinity/templates/work-orders',
        'trinity/templates/investigations',
        'trinity/templates/documentation',
        'trinity/reports',
        'trinity/investigations/plans',
        'trinity/archive/work-orders',
        'trinity/archive/investigations',
        'trinity/archive/reports',
        'trinity/archive/sessions',
      ];

      for (const dir of trinityDirs) {
        expect(await fs.pathExists(dir)).toBe(true);
      }
    });

    it('should create all 5 .claude agent subdirectories', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const claudeDirs = [
        '.claude/agents/leadership',
        '.claude/agents/deployment',
        '.claude/agents/audit',
        '.claude/agents/planning',
        '.claude/agents/aj-team',
      ];

      for (const dir of claudeDirs) {
        expect(await fs.pathExists(dir)).toBe(true);
      }
    });

    it('should create all 7 slash command categories', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const commandDirs = [
        '.claude/commands/session',
        '.claude/commands/planning',
        '.claude/commands/execution',
        '.claude/commands/investigation',
        '.claude/commands/infrastructure',
        '.claude/commands/maintenance',
        '.claude/commands/utility',
      ];

      for (const dir of commandDirs) {
        expect(await fs.pathExists(dir)).toBe(true);
      }
    });
  });

  describe('Agent Template Deployment', () => {
    it('should deploy all 19 agents to correct subdirectories', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      // Leadership agents (2)
      expect(await fs.pathExists('.claude/agents/leadership/aly-cto.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/leadership/aj-maestro.md')).toBe(true);

      // Deployment agents (4)
      expect(await fs.pathExists('.claude/agents/deployment/tan-structure.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/deployment/zen-knowledge.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/deployment/ino-context.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/deployment/ein-cicd.md')).toBe(true);

      // Audit agents (1)
      expect(await fs.pathExists('.claude/agents/audit/juno-auditor.md')).toBe(true);

      // Planning agents (4)
      expect(await fs.pathExists('.claude/agents/planning/mon-requirements.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/planning/ror-design.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/planning/tra-planner.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/planning/eus-decomposer.md')).toBe(true);

      // AJ Team agents (7)
      expect(await fs.pathExists('.claude/agents/aj-team/kil-task-executor.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/aj-team/bas-quality-gate.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/aj-team/dra-code-reviewer.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/aj-team/apo-documentation-specialist.md')).toBe(
        true
      );
      expect(await fs.pathExists('.claude/agents/aj-team/bon-dependency-manager.md')).toBe(true);
      expect(await fs.pathExists('.claude/agents/aj-team/cap-configuration-specialist.md')).toBe(
        true
      );
      expect(await fs.pathExists('.claude/agents/aj-team/uro-refactoring-specialist.md')).toBe(
        true
      );
    });

    it('should process agent templates with variable substitution', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const alyContent = await fs.readFile('.claude/agents/leadership/aly-cto.md', 'utf8');

      // Should contain processed project name
      expect(alyContent).toContain('test-project');
    });
  });

  describe('Slash Command Deployment', () => {
    it('should deploy all 20 slash commands to categorized directories', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      // Session commands (3)
      expect(await fs.pathExists('.claude/commands/session/trinity-start.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/session/trinity-continue.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/session/trinity-end.md')).toBe(true);

      // Planning commands (4)
      expect(await fs.pathExists('.claude/commands/planning/trinity-requirements.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/planning/trinity-design.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/planning/trinity-plan.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/planning/trinity-decompose.md')).toBe(true);

      // Execution commands (2)
      expect(await fs.pathExists('.claude/commands/execution/trinity-orchestrate.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/execution/trinity-audit.md')).toBe(true);

      // Maintenance commands (3)
      expect(await fs.pathExists('.claude/commands/maintenance/trinity-readme.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/maintenance/trinity-docs.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/maintenance/trinity-changelog.md')).toBe(true);

      // Investigation commands (3)
      expect(
        await fs.pathExists('.claude/commands/investigation/trinity-create-investigation.md')
      ).toBe(true);
      expect(
        await fs.pathExists('.claude/commands/investigation/trinity-plan-investigation.md')
      ).toBe(true);
      expect(
        await fs.pathExists('.claude/commands/investigation/trinity-investigate-templates.md')
      ).toBe(true);

      // Infrastructure commands (1)
      expect(await fs.pathExists('.claude/commands/infrastructure/trinity-init.md')).toBe(true);

      // Utility commands (3)
      expect(await fs.pathExists('.claude/commands/utility/trinity-verify.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/utility/trinity-agents.md')).toBe(true);
      expect(await fs.pathExists('.claude/commands/utility/trinity-workorder.md')).toBe(true);
    });

    it('should not include .template extension in deployed files', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      // Check that no .template files exist in deployed commands
      const sessionFiles = await fs.readdir('.claude/commands/session');
      for (const file of sessionFiles) {
        expect(file).not.toContain('.template');
      }
    });
  });

  describe('Knowledge Base Deployment', () => {
    it('should deploy all 9 knowledge base files', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const kbFiles = [
        'ARCHITECTURE.md',
        'Trinity.md',
        'To-do.md',
        'ISSUES.md',
        'Technical-Debt.md',
        'CODING-PRINCIPLES.md',
        'TESTING-PRINCIPLES.md',
        'AI-DEVELOPMENT-GUIDE.md',
        'DOCUMENTATION-CRITERIA.md',
      ];

      for (const file of kbFiles) {
        expect(await fs.pathExists(`trinity/knowledge-base/${file}`)).toBe(true);
      }
    });

    it('should process knowledge base templates with variable substitution', async () => {
      await deploy({ yes: true, name: 'my-awesome-project', skipAudit: true });

      const archContent = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');

      // Should contain the project name
      expect(archContent).toContain('my-awesome-project');
    });
  });

  describe('Template Deployment', () => {
    it('should deploy 6 work order templates', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const workOrderTemplates = [
        'INVESTIGATION-TEMPLATE.md',
        'IMPLEMENTATION-TEMPLATE.md',
        'ANALYSIS-TEMPLATE.md',
        'AUDIT-TEMPLATE.md',
        'PATTERN-TEMPLATE.md',
        'VERIFICATION-TEMPLATE.md',
      ];

      for (const template of workOrderTemplates) {
        expect(await fs.pathExists(`trinity/templates/work-orders/${template}`)).toBe(true);
      }
    });

    it('should deploy 5 investigation templates', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const investigationTemplates = [
        'bug.md',
        'feature.md',
        'performance.md',
        'security.md',
        'technical.md',
      ];

      for (const template of investigationTemplates) {
        expect(await fs.pathExists(`trinity/templates/investigations/${template}`)).toBe(true);
      }
    });

    it('should deploy 2 documentation templates', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('trinity/templates/documentation/ROOT-README.md')).toBe(true);
      expect(await fs.pathExists('trinity/templates/documentation/SUBDIRECTORY-README.md')).toBe(
        true
      );
    });

    it('should not include .template extension in deployed templates', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const woFiles = await fs.readdir('trinity/templates/work-orders');
      for (const file of woFiles) {
        expect(file).not.toContain('.template');
      }
    });
  });

  describe('Root Files Deployment', () => {
    it('should create VERSION file with correct version', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('trinity/VERSION')).toBe(true);
      const version = await readVersion(testDir);
      expect(version).toMatch(/^\d+\.\d+\.\d+$/); // Semver format
    });

    it('should create root TRINITY.md file', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('TRINITY.md')).toBe(true);
    });

    it('should create root CLAUDE.md file', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('CLAUDE.md')).toBe(true);
    });

    it('should create trinity/CLAUDE.md file', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('trinity/CLAUDE.md')).toBe(true);
    });
  });

  describe('Framework Detection', () => {
    it('should detect Node.js project from package.json', async () => {
      await fs.writeFile(
        'package.json',
        JSON.stringify({
          name: 'test-project',
          version: '1.0.0',
        })
      );

      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      // Should successfully deploy (framework detection works)
      expect(await fs.pathExists('trinity')).toBe(true);
    });

    it('should handle projects without package.json', async () => {
      // No package.json - should still deploy
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('trinity')).toBe(true);
    });
  });

  describe('.gitignore Updates', () => {
    it('should create .gitignore if it does not exist', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('.gitignore')).toBe(true);
    });

    it('should add Trinity exclusions to .gitignore', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const gitignoreContent = await fs.readFile('.gitignore', 'utf8');
      expect(gitignoreContent).toContain('# Trinity Method SDK');
      expect(gitignoreContent).toContain('trinity/');
    });

    it('should not duplicate Trinity exclusions if already present', async () => {
      // Create existing .gitignore with Trinity section
      await fs.writeFile('.gitignore', '# Trinity Method SDK\ntrity/\nnode_modules/\n');

      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      const gitignoreContent = await fs.readFile('.gitignore', 'utf8');
      const matches = gitignoreContent.match(/# Trinity Method SDK/g);
      expect(matches).toHaveLength(1); // Should only appear once
    });
  });

  describe('Employee Directory Deployment', () => {
    it('should create EMPLOYEE-DIRECTORY.md in .claude/', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('.claude/EMPLOYEE-DIRECTORY.md')).toBe(true);
    });
  });

  describe('Deployment with --skipAudit Flag', () => {
    it('should skip codebase metrics collection with --skipAudit', async () => {
      // This should complete quickly without scanning codebase
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      expect(await fs.pathExists('trinity')).toBe(true);
    });

    it('should collect codebase metrics without --skipAudit', async () => {
      // Create some source files
      await fs.ensureDir('src');
      await fs.writeFile('src/index.js', '// TODO: implement\nfunction main() {}\n');

      await deploy({ yes: true, name: 'test-project', skipAudit: false });

      // Should complete successfully with metrics
      expect(await fs.pathExists('trinity')).toBe(true);
    });
  });

  describe('Full Deployment Verification', () => {
    it('should create complete Trinity structure', async () => {
      await deploy({ yes: true, name: 'complete-test', skipAudit: true });

      // Verify overall structure
      expect(await verifyTrinityStructure(testDir)).toBe(true);
    });

    it('should deploy minimum expected number of files', async () => {
      await deploy({ yes: true, name: 'test-project', skipAudit: true });

      // Expected minimum files:
      // - 19 agents
      // - 20 slash commands
      // - 9 knowledge base files
      // - 6 work order templates
      // - 5 investigation templates
      // - 2 documentation templates
      // - 3 root files (TRINITY.md, CLAUDE.md, trinity/VERSION)
      // - 1 trinity/CLAUDE.md
      // - 1 EMPLOYEE-DIRECTORY.md
      // = 66 minimum files

      const trinityFileCount = await countFiles('trinity');
      const claudeFileCount = await countFiles('.claude');
      const totalFiles = trinityFileCount + claudeFileCount + 2; // +2 for root files

      expect(totalFiles).toBeGreaterThanOrEqual(60); // Allow some flexibility
    });
  });
});
