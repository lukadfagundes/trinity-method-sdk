/**
 * Unit Tests - deploy-linting.ts
 *
 * Tests linting tool deployment (file creation with template processing)
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { deployLintingTool } from '../../../../src/cli/utils/deploy-linting.js';
import type { LintingTool, Stack } from '../../../../src/cli/types.js';

describe('deploy-linting', () => {
  let testDir: string;
  let originalCwd: string;
  let templatesPath: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), `.tmp-test-deploy-linting-${Date.now()}`);
    await fs.ensureDir(testDir);
    process.chdir(testDir);

    // Create mock template files
    templatesPath = path.join(testDir, 'templates');
    await fs.ensureDir(path.join(templatesPath, 'root', 'linting', 'nodejs'));
    await fs.ensureDir(path.join(templatesPath, 'root', 'linting', 'python'));
    await fs.ensureDir(path.join(templatesPath, 'root', 'linting', 'flutter'));
    await fs.ensureDir(path.join(templatesPath, 'root', 'linting', 'rust'));

    // Create template files
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'nodejs', '.eslintrc-commonjs.json.template'),
      '{"env": {"node": true}, "project": "{{PROJECT_NAME}}"}'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'nodejs', '.eslintrc-typescript.json.template'),
      '{"extends": ["plugin:@typescript-eslint/recommended"], "project": "{{PROJECT_NAME}}"}'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'nodejs', '.prettierrc.json.template'),
      '{"semi": true, "project": "{{PROJECT_NAME}}"}'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'nodejs', '.pre-commit-config.yaml.template'),
      'repos:\n  - repo: local\n    hooks:\n      - id: test'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'python', 'pyproject.toml.template'),
      '[tool.black]\nline-length = 88'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'python', '.flake8.template'),
      '[flake8]\nmax-line-length = 88'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'flutter', 'analysis_options.yaml.template'),
      'analyzer:\n  strong-mode: true'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'rust', 'clippy.toml.template'),
      'msrv = "1.70.0"'
    );
    await fs.writeFile(
      path.join(templatesPath, 'root', 'linting', 'rust', 'rustfmt.toml.template'),
      'max_width = 100'
    );
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('Framework Directory Mapping', () => {
    it('should map Node.js to nodejs directory', async () => {
      const tool: LintingTool = {
        id: 'prettier',
        name: 'Prettier',
        description: 'Formatter',
        file: '.prettierrc.json',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'JavaScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, { PROJECT_NAME: 'Test' });

      expect(await fs.pathExists('.prettierrc.json')).toBe(true);
    });

    it('should map React to nodejs directory', async () => {
      const tool: LintingTool = {
        id: 'prettier',
        name: 'Prettier',
        description: 'Formatter',
        file: '.prettierrc.json',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'JavaScript/TypeScript',
        framework: 'React',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, { PROJECT_NAME: 'React App' });

      expect(await fs.pathExists('.prettierrc.json')).toBe(true);
    });

    it('should map Next.js to nodejs directory', async () => {
      const tool: LintingTool = {
        id: 'prettier',
        name: 'Prettier',
        description: 'Formatter',
        file: '.prettierrc.json',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'JavaScript/TypeScript',
        framework: 'Next.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, { PROJECT_NAME: 'Next App' });

      expect(await fs.pathExists('.prettierrc.json')).toBe(true);
    });
  });

  describe('ESLint Deployment', () => {
    it('should deploy CommonJS ESLint config for JavaScript', async () => {
      const tool: LintingTool = {
        id: 'eslint',
        name: 'ESLint',
        description: 'Linter',
        file: '.eslintrc.json',
        recommended: true,
        dependencies: ['eslint@^8.50.0'],
      };
      const stack: Stack = {
        language: 'JavaScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, { PROJECT_NAME: 'My Project' });

      const config = await fs.readJson('.eslintrc.json');
      expect(config.env.node).toBe(true);
      expect(config.project).toBe('My Project');
    });

    it('should deploy TypeScript ESLint config for TypeScript', async () => {
      const tool: LintingTool = {
        id: 'eslint',
        name: 'ESLint',
        description: 'Linter',
        file: '.eslintrc.json',
        recommended: true,
        dependencies: ['eslint@^8.50.0'],
      };
      const stack: Stack = {
        language: 'TypeScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, { PROJECT_NAME: 'TS Project' });

      const config = await fs.readJson('.eslintrc.json');
      expect(config.extends).toContain('plugin:@typescript-eslint/recommended');
      expect(config.project).toBe('TS Project');
    });
  });

  describe('Prettier Deployment', () => {
    it('should deploy Prettier config with template variables', async () => {
      const tool: LintingTool = {
        id: 'prettier',
        name: 'Prettier',
        description: 'Formatter',
        file: '.prettierrc.json',
        recommended: true,
        dependencies: ['prettier@^3.0.0'],
      };
      const stack: Stack = {
        language: 'JavaScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, { PROJECT_NAME: 'Prettier Test' });

      const config = await fs.readJson('.prettierrc.json');
      expect(config.semi).toBe(true);
      expect(config.project).toBe('Prettier Test');
    });
  });

  describe('Pre-commit Hooks Deployment', () => {
    it('should deploy pre-commit config', async () => {
      const tool: LintingTool = {
        id: 'precommit',
        name: 'Pre-commit',
        description: 'Hooks',
        file: '.pre-commit-config.yaml',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'JavaScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const content = await fs.readFile('.pre-commit-config.yaml', 'utf8');
      expect(content).toContain('repos:');
      expect(content).toContain('hooks:');
    });
  });

  describe('TypeScript ESLint Extension', () => {
    it('should extend existing ESLint config with TypeScript', async () => {
      // Create existing .eslintrc.json
      await fs.writeJson('.eslintrc.json', {
        env: { node: true },
        rules: { semi: ['error', 'always'] },
      });

      const tool: LintingTool = {
        id: 'typescript-eslint',
        name: 'TypeScript ESLint',
        description: 'TS Linter',
        file: '.eslintrc.json',
        recommended: false,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'TypeScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const config = await fs.readJson('.eslintrc.json');
      expect(config.extends).toContain('plugin:@typescript-eslint/recommended');
      expect(config.parser).toBe('@typescript-eslint/parser');
      expect(config.plugins).toContain('@typescript-eslint');
      expect(config.rules.semi).toEqual(['error', 'always']); // Preserved
    });

    it('should not duplicate TypeScript ESLint config', async () => {
      // Create existing .eslintrc.json with TS already configured
      await fs.writeJson('.eslintrc.json', {
        extends: ['plugin:@typescript-eslint/recommended'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
      });

      const tool: LintingTool = {
        id: 'typescript-eslint',
        name: 'TypeScript ESLint',
        description: 'TS Linter',
        file: '.eslintrc.json',
        recommended: false,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'TypeScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const config = await fs.readJson('.eslintrc.json');
      // Should not duplicate
      expect(
        config.extends.filter((e: string) => e === 'plugin:@typescript-eslint/recommended').length
      ).toBe(1);
      expect(config.plugins.filter((p: string) => p === '@typescript-eslint').length).toBe(1);
    });
  });

  describe('Python Tools Deployment', () => {
    it('should deploy Black config in pyproject.toml', async () => {
      const tool: LintingTool = {
        id: 'black',
        name: 'Black',
        description: 'Formatter',
        file: 'pyproject.toml',
        recommended: true,
        dependencies: ['black>=23.0.0'],
      };
      const stack: Stack = {
        language: 'Python',
        framework: 'Python',
        sourceDir: 'app',
        sourceDirs: ['app'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const content = await fs.readFile('pyproject.toml', 'utf8');
      expect(content).toContain('[tool.black]');
      expect(content).toContain('line-length = 88');
    });

    it('should deploy Flake8 config', async () => {
      const tool: LintingTool = {
        id: 'flake8',
        name: 'Flake8',
        description: 'Linter',
        file: '.flake8',
        recommended: true,
        dependencies: ['flake8>=6.0.0'],
      };
      const stack: Stack = {
        language: 'Python',
        framework: 'Python',
        sourceDir: 'app',
        sourceDirs: ['app'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const content = await fs.readFile('.flake8', 'utf8');
      expect(content).toContain('[flake8]');
      expect(content).toContain('max-line-length = 88');
    });
  });

  describe('Flutter Tools Deployment', () => {
    it('should deploy Dart Analyzer config', async () => {
      const tool: LintingTool = {
        id: 'dartanalyzer',
        name: 'Dart Analyzer',
        description: 'Linter',
        file: 'analysis_options.yaml',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'Dart',
        framework: 'Flutter',
        sourceDir: 'lib',
        sourceDirs: ['lib'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const content = await fs.readFile('analysis_options.yaml', 'utf8');
      expect(content).toContain('analyzer:');
      expect(content).toContain('strong-mode: true');
    });
  });

  describe('Rust Tools Deployment', () => {
    it('should deploy Clippy config', async () => {
      const tool: LintingTool = {
        id: 'clippy',
        name: 'Clippy',
        description: 'Linter',
        file: 'clippy.toml',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'Rust',
        framework: 'Rust',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const content = await fs.readFile('clippy.toml', 'utf8');
      expect(content).toContain('msrv = "1.70.0"');
    });

    it('should deploy Rustfmt config', async () => {
      const tool: LintingTool = {
        id: 'rustfmt',
        name: 'Rustfmt',
        description: 'Formatter',
        file: 'rustfmt.toml',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'Rust',
        framework: 'Rust',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      const content = await fs.readFile('rustfmt.toml', 'utf8');
      expect(content).toContain('max_width = 100');
    });
  });

  describe('Unknown Tool Handling', () => {
    it('should warn for unknown tool ID', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const tool: LintingTool = {
        id: 'unknown-tool',
        name: 'Unknown',
        description: 'Test',
        file: 'test.json',
        recommended: true,
        dependencies: [],
      };
      const stack: Stack = {
        language: 'JavaScript',
        framework: 'Node.js',
        sourceDir: 'src',
        sourceDirs: ['src'],
      };

      await deployLintingTool(tool, stack, templatesPath, {});

      expect(consoleSpy).toHaveBeenCalledWith('Unknown linting tool: unknown-tool');

      consoleSpy.mockRestore();
    });
  });
});
