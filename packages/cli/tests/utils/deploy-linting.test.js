import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { deployLintingTool } from '../../src/utils/deploy-linting.js';

describe('deploy-linting', () => {
  const testDir = path.join(process.cwd(), 'test-temp-linting');
  const templatesPath = path.join(process.cwd(), '../templates');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    const originalDir = path.join(process.cwd(), '../..');
    process.chdir(originalDir);
    await fs.remove(testDir);
  });

  describe('deployLintingTool - ESLint (Node.js)', () => {
    it('should deploy ESLint with ESM configuration for ESM projects', async () => {
      const tool = { id: 'eslint', name: 'ESLint' };
      const stack = {
        framework: 'Node.js',
        language: 'JavaScript',
        moduleType: 'esm'
      };
      const variables = {
        TECH_STACK: 'Node.js',
        FRAMEWORK: 'Express',
        SOURCE_DIR: 'src'
      };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const eslintExists = await fs.pathExists('.eslintrc.json');
      expect(eslintExists).toBe(true);

      const content = await fs.readFile('.eslintrc.json', 'utf8');
      expect(content).toContain('sourceType');
      expect(content).toContain('module');
    });

    it('should deploy ESLint with CommonJS configuration for CommonJS projects', async () => {
      const tool = { id: 'eslint', name: 'ESLint' };
      const stack = {
        framework: 'Node.js',
        language: 'JavaScript',
        moduleType: 'commonjs'
      };
      const variables = {
        TECH_STACK: 'Node.js',
        SOURCE_DIR: 'src'
      };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const eslintExists = await fs.pathExists('.eslintrc.json');
      expect(eslintExists).toBe(true);

      const content = await fs.readFile('.eslintrc.json', 'utf8');
      expect(content).toContain('env');
    });

    it('should deploy ESLint with TypeScript configuration for TypeScript projects', async () => {
      const tool = { id: 'eslint', name: 'ESLint' };
      const stack = {
        framework: 'Node.js',
        language: 'TypeScript',
        moduleType: 'esm'
      };
      const variables = {
        TECH_STACK: 'Node.js',
        SOURCE_DIR: 'src'
      };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const eslintExists = await fs.pathExists('.eslintrc.json');
      expect(eslintExists).toBe(true);

      const content = await fs.readFile('.eslintrc.json', 'utf8');
      expect(content).toContain('typescript');
    });
  });

  describe('deployLintingTool - Prettier (Node.js)', () => {
    it('should deploy Prettier configuration', async () => {
      const tool = { id: 'prettier', name: 'Prettier' };
      const stack = { framework: 'Node.js', language: 'JavaScript' };
      const variables = { TECH_STACK: 'Node.js' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const prettierExists = await fs.pathExists('.prettierrc.json');
      expect(prettierExists).toBe(true);

      const content = await fs.readFile('.prettierrc.json', 'utf8');
      const config = JSON.parse(content);
      expect(config).toHaveProperty('semi');
      expect(config).toHaveProperty('singleQuote');
    });
  });

  describe('deployLintingTool - Pre-commit hooks', () => {
    it('should deploy pre-commit hooks for Node.js', async () => {
      const tool = { id: 'precommit', name: 'Pre-commit hooks' };
      const stack = { framework: 'Node.js', language: 'JavaScript' };
      const variables = { TECH_STACK: 'Node.js' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const precommitExists = await fs.pathExists('.pre-commit-config.yaml');
      expect(precommitExists).toBe(true);

      const content = await fs.readFile('.pre-commit-config.yaml', 'utf8');
      expect(content).toContain('repos:');
    });

    it('should deploy pre-commit hooks for Python', async () => {
      const tool = { id: 'precommit', name: 'Pre-commit hooks' };
      const stack = { framework: 'Python', language: 'Python' };
      const variables = { TECH_STACK: 'Python' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const precommitExists = await fs.pathExists('.pre-commit-config.yaml');
      expect(precommitExists).toBe(true);

      const content = await fs.readFile('.pre-commit-config.yaml', 'utf8');
      expect(content).toContain('repos:');
    });
  });

  describe('deployLintingTool - TypeScript ESLint', () => {
    it('should enhance existing ESLint config with TypeScript support', async () => {
      // Create a basic ESLint config first
      await fs.writeJson('.eslintrc.json', {
        env: { node: true },
        extends: ['eslint:recommended']
      });

      const tool = { id: 'typescript-eslint', name: 'TypeScript ESLint' };
      const stack = { framework: 'Node.js', language: 'TypeScript' };
      const variables = { TECH_STACK: 'Node.js' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const config = await fs.readJson('.eslintrc.json');
      expect(config.extends).toContain('plugin:@typescript-eslint/recommended');
      expect(config.parser).toBe('@typescript-eslint/parser');
      expect(config.plugins).toContain('@typescript-eslint');
    });

    it('should not duplicate TypeScript ESLint config if already present', async () => {
      await fs.writeJson('.eslintrc.json', {
        extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint']
      });

      const tool = { id: 'typescript-eslint', name: 'TypeScript ESLint' };
      const stack = { framework: 'Node.js', language: 'TypeScript' };
      const variables = { TECH_STACK: 'Node.js' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const config = await fs.readJson('.eslintrc.json');
      const tsExtends = config.extends.filter(e => e === 'plugin:@typescript-eslint/recommended');
      const tsPlugins = config.plugins.filter(p => p === '@typescript-eslint');

      expect(tsExtends.length).toBe(1);
      expect(tsPlugins.length).toBe(1);
    });
  });

  describe('deployLintingTool - Python tools', () => {
    it('should deploy Black configuration in pyproject.toml', async () => {
      const tool = { id: 'black', name: 'Black' };
      const stack = { framework: 'Python', language: 'Python' };
      const variables = { TECH_STACK: 'Python' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const pyprojectExists = await fs.pathExists('pyproject.toml');
      expect(pyprojectExists).toBe(true);

      const content = await fs.readFile('pyproject.toml', 'utf8');
      expect(content).toContain('[tool.black]');
    });

    it('should deploy isort configuration in pyproject.toml', async () => {
      const tool = { id: 'isort', name: 'isort' };
      const stack = { framework: 'Python', language: 'Python' };
      const variables = { TECH_STACK: 'Python' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const pyprojectExists = await fs.pathExists('pyproject.toml');
      expect(pyprojectExists).toBe(true);

      const content = await fs.readFile('pyproject.toml', 'utf8');
      expect(content).toContain('[tool.isort]');
    });

    it('should deploy Flake8 configuration', async () => {
      const tool = { id: 'flake8', name: 'Flake8' };
      const stack = { framework: 'Python', language: 'Python' };
      const variables = { TECH_STACK: 'Python' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const flake8Exists = await fs.pathExists('.flake8');
      expect(flake8Exists).toBe(true);

      const content = await fs.readFile('.flake8', 'utf8');
      expect(content).toContain('[flake8]');
    });
  });

  describe('deployLintingTool - Flutter tools', () => {
    it('should deploy Dart analyzer configuration', async () => {
      const tool = { id: 'dartanalyzer', name: 'Dart Analyzer' };
      const stack = { framework: 'Flutter', language: 'Dart' };
      const variables = { TECH_STACK: 'Flutter' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const analysisExists = await fs.pathExists('analysis_options.yaml');
      expect(analysisExists).toBe(true);

      const content = await fs.readFile('analysis_options.yaml', 'utf8');
      expect(content).toContain('linter:');
    });
  });

  describe('deployLintingTool - Rust tools', () => {
    it('should deploy Clippy configuration', async () => {
      const tool = { id: 'clippy', name: 'Clippy' };
      const stack = { framework: 'Rust', language: 'Rust' };
      const variables = { TECH_STACK: 'Rust' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const clippyExists = await fs.pathExists('clippy.toml');
      expect(clippyExists).toBe(true);
    });

    it('should deploy Rustfmt configuration', async () => {
      const tool = { id: 'rustfmt', name: 'Rustfmt' };
      const stack = { framework: 'Rust', language: 'Rust' };
      const variables = { TECH_STACK: 'Rust' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const rustfmtExists = await fs.pathExists('rustfmt.toml');
      expect(rustfmtExists).toBe(true);
    });
  });

  describe('deployLintingTool - React framework', () => {
    it('should deploy ESLint for React using nodejs templates', async () => {
      const tool = { id: 'eslint', name: 'ESLint' };
      const stack = {
        framework: 'React',
        language: 'JavaScript',
        moduleType: 'esm'
      };
      const variables = {
        TECH_STACK: 'React',
        FRAMEWORK: 'React',
        SOURCE_DIR: 'src'
      };

      await deployLintingTool(tool, stack, templatesPath, variables);

      const eslintExists = await fs.pathExists('.eslintrc.json');
      expect(eslintExists).toBe(true);
    });
  });

  describe('deployLintingTool - Unknown tool', () => {
    it('should warn for unknown tool but not throw error', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const tool = { id: 'unknown-tool', name: 'Unknown Tool' };
      const stack = { framework: 'Node.js', language: 'JavaScript' };
      const variables = { TECH_STACK: 'Node.js' };

      await deployLintingTool(tool, stack, templatesPath, variables);

      expect(consoleSpy).toHaveBeenCalledWith('Unknown linting tool: unknown-tool');

      consoleSpy.mockRestore();
    });
  });
});
