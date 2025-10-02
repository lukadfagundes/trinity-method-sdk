import { describe, it, expect } from '@jest/globals';
import {
  getToolsForFramework,
  getRecommendedTools,
  getDependenciesForTools,
  getScriptsForTools,
  getPostInstallInstructions
} from '../../src/utils/linting-tools.js';

describe('linting-tools', () => {
  describe('getToolsForFramework', () => {
    it('should return Node.js tools for Node.js framework', () => {
      const tools = getToolsForFramework('Node.js', 'JavaScript');

      expect(tools).toBeInstanceOf(Array);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some(t => t.id === 'eslint')).toBe(true);
      expect(tools.some(t => t.id === 'prettier')).toBe(true);
      expect(tools.some(t => t.id === 'precommit')).toBe(true);
    });

    it('should return Python tools for Python framework', () => {
      const tools = getToolsForFramework('Python', 'Python');

      expect(tools).toBeInstanceOf(Array);
      expect(tools.some(t => t.id === 'black')).toBe(true);
      expect(tools.some(t => t.id === 'flake8')).toBe(true);
      expect(tools.some(t => t.id === 'isort')).toBe(true);
      expect(tools.some(t => t.id === 'precommit')).toBe(true);
    });

    it('should return Flutter tools for Flutter framework', () => {
      const tools = getToolsForFramework('Flutter', 'Dart');

      expect(tools).toBeInstanceOf(Array);
      expect(tools.some(t => t.id === 'dartanalyzer')).toBe(true);
      expect(tools.some(t => t.id === 'precommit')).toBe(true);
    });

    it('should return Rust tools for Rust framework', () => {
      const tools = getToolsForFramework('Rust', 'Rust');

      expect(tools).toBeInstanceOf(Array);
      expect(tools.some(t => t.id === 'clippy')).toBe(true);
      expect(tools.some(t => t.id === 'rustfmt')).toBe(true);
      expect(tools.some(t => t.id === 'precommit')).toBe(true);
    });

    it('should include TypeScript ESLint for TypeScript projects', () => {
      const tools = getToolsForFramework('Node.js', 'TypeScript');

      const tsEslint = tools.find(t => t.id === 'typescript-eslint');
      expect(tsEslint).toBeDefined();
      expect(tsEslint.recommended).toBe(true);
    });

    it('should exclude TypeScript ESLint for JavaScript projects', () => {
      const tools = getToolsForFramework('Node.js', 'JavaScript');

      const tsEslint = tools.find(t => t.id === 'typescript-eslint');
      expect(tsEslint).toBeUndefined();
    });

    it('should return React tools for React framework', () => {
      const tools = getToolsForFramework('React', 'JavaScript');

      expect(tools).toBeInstanceOf(Array);
      expect(tools.some(t => t.id === 'eslint')).toBe(true);
      expect(tools.some(t => t.id === 'prettier')).toBe(true);
    });

    it('should fallback to Node.js tools for unknown framework', () => {
      const tools = getToolsForFramework('UnknownFramework', 'JavaScript');

      expect(tools).toBeInstanceOf(Array);
      expect(tools.some(t => t.id === 'eslint')).toBe(true);
    });
  });

  describe('getRecommendedTools', () => {
    it('should return only recommended tools', () => {
      const tools = getRecommendedTools('Node.js', 'JavaScript');

      expect(tools.every(t => t.recommended === true)).toBe(true);
    });

    it('should include ESLint and Prettier for Node.js', () => {
      const tools = getRecommendedTools('Node.js', 'JavaScript');

      expect(tools.some(t => t.id === 'eslint')).toBe(true);
      expect(tools.some(t => t.id === 'prettier')).toBe(true);
    });

    it('should include Black, Flake8, isort for Python', () => {
      const tools = getRecommendedTools('Python', 'Python');

      expect(tools.some(t => t.id === 'black')).toBe(true);
      expect(tools.some(t => t.id === 'flake8')).toBe(true);
      expect(tools.some(t => t.id === 'isort')).toBe(true);
    });

    it('should mark TypeScript ESLint as recommended for TypeScript', () => {
      const tools = getRecommendedTools('Node.js', 'TypeScript');

      const tsEslint = tools.find(t => t.id === 'typescript-eslint');
      expect(tsEslint).toBeDefined();
      expect(tsEslint.recommended).toBe(true);
    });
  });

  describe('getDependenciesForTools', () => {
    it('should extract dependencies from tools', () => {
      const tools = [
        { id: 'eslint', dependencies: ['eslint@^8.50.0'] },
        { id: 'prettier', dependencies: ['prettier@^3.0.0'] }
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps).toContain('eslint@^8.50.0');
      expect(deps).toContain('prettier@^3.0.0');
      expect(deps.length).toBe(2);
    });

    it('should handle tools with no dependencies', () => {
      const tools = [
        { id: 'clippy', dependencies: [] },
        { id: 'rustfmt', dependencies: [] }
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps).toHaveLength(0);
    });

    it('should handle tools with multiple dependencies', () => {
      const tools = [
        {
          id: 'typescript-eslint',
          dependencies: [
            '@typescript-eslint/parser@^6.7.0',
            '@typescript-eslint/eslint-plugin@^6.7.0'
          ]
        }
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps).toHaveLength(2);
      expect(deps).toContain('@typescript-eslint/parser@^6.7.0');
      expect(deps).toContain('@typescript-eslint/eslint-plugin@^6.7.0');
    });

    it('should handle tools with undefined dependencies', () => {
      const tools = [
        { id: 'tool1' },
        { id: 'tool2', dependencies: null }
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps).toHaveLength(0);
    });

    it('should flatten dependencies from multiple tools', () => {
      const tools = [
        { id: 'eslint', dependencies: ['eslint@^8.50.0', 'eslint-config-standard@^17.0.0'] },
        { id: 'prettier', dependencies: ['prettier@^3.0.0'] }
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps).toHaveLength(3);
    });
  });

  describe('getScriptsForTools', () => {
    it('should extract scripts from tools', () => {
      const tools = [
        {
          id: 'eslint',
          scripts: {
            lint: 'eslint .',
            'lint:fix': 'eslint . --fix'
          }
        }
      ];

      const scripts = getScriptsForTools(tools);

      expect(scripts.lint).toBe('eslint .');
      expect(scripts['lint:fix']).toBe('eslint . --fix');
    });

    it('should merge scripts from multiple tools', () => {
      const tools = [
        { id: 'eslint', scripts: { lint: 'eslint .' } },
        { id: 'prettier', scripts: { format: 'prettier --write .' } }
      ];

      const scripts = getScriptsForTools(tools);

      expect(scripts.lint).toBe('eslint .');
      expect(scripts.format).toBe('prettier --write .');
      expect(Object.keys(scripts).length).toBe(2);
    });

    it('should handle tools with no scripts', () => {
      const tools = [
        { id: 'precommit' },
        { id: 'clippy', scripts: null }
      ];

      const scripts = getScriptsForTools(tools);

      expect(Object.keys(scripts).length).toBe(0);
    });

    it('should handle empty tools array', () => {
      const scripts = getScriptsForTools([]);

      expect(scripts).toEqual({});
    });

    it('should override duplicate script names (last wins)', () => {
      const tools = [
        { id: 'tool1', scripts: { test: 'test command 1' } },
        { id: 'tool2', scripts: { test: 'test command 2' } }
      ];

      const scripts = getScriptsForTools(tools);

      expect(scripts.test).toBe('test command 2');
    });
  });

  describe('getPostInstallInstructions', () => {
    it('should return post-install instructions for tools', () => {
      const tools = [
        {
          id: 'precommit',
          name: 'Pre-commit hooks',
          postInstall: 'pip install pre-commit && pre-commit install'
        }
      ];

      const instructions = getPostInstallInstructions(tools, 'Node.js');

      expect(instructions).toHaveLength(1);
      expect(instructions[0].tool).toBe('Pre-commit hooks');
      expect(instructions[0].command).toContain('pre-commit install');
    });

    it('should return empty array for tools with no post-install', () => {
      const tools = [
        { id: 'eslint', name: 'ESLint' },
        { id: 'prettier', name: 'Prettier' }
      ];

      const instructions = getPostInstallInstructions(tools, 'Node.js');

      expect(instructions).toHaveLength(0);
    });

    it('should handle mixed tools (some with, some without post-install)', () => {
      const tools = [
        { id: 'eslint', name: 'ESLint' },
        {
          id: 'precommit',
          name: 'Pre-commit',
          postInstall: 'pre-commit install'
        },
        { id: 'prettier', name: 'Prettier' }
      ];

      const instructions = getPostInstallInstructions(tools, 'Node.js');

      expect(instructions).toHaveLength(1);
      expect(instructions[0].tool).toBe('Pre-commit');
    });

    it('should handle empty tools array', () => {
      const instructions = getPostInstallInstructions([], 'Node.js');

      expect(instructions).toEqual([]);
    });

    it('should collect multiple post-install instructions', () => {
      const tools = [
        {
          id: 'tool1',
          name: 'Tool 1',
          postInstall: 'install command 1'
        },
        {
          id: 'tool2',
          name: 'Tool 2',
          postInstall: 'install command 2'
        }
      ];

      const instructions = getPostInstallInstructions(tools, 'Node.js');

      expect(instructions).toHaveLength(2);
      expect(instructions[0].command).toBe('install command 1');
      expect(instructions[1].command).toBe('install command 2');
    });
  });
});
