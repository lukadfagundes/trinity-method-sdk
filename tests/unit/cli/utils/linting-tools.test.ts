/**
 * Unit Tests - linting-tools.ts
 *
 * Tests linting tool configuration and selection logic
 */

import { describe, it, expect } from '@jest/globals';
import {
  lintingTools,
  getToolsForFramework,
  getRecommendedTools,
  getDependenciesForTools,
  getScriptsForTools,
  getPostInstallInstructions,
} from '../../../../src/cli/utils/linting-tools.js';
import type { LintingTool } from '../../../../src/cli/types.js';

describe('linting-tools', () => {
  describe('lintingTools Data Structure', () => {
    it('should have tools defined for Node.js', () => {
      expect(lintingTools['Node.js']).toBeDefined();
      expect(lintingTools['Node.js'].length).toBeGreaterThan(0);
    });

    it('should have tools defined for React', () => {
      expect(lintingTools['React']).toBeDefined();
      expect(lintingTools['React'].length).toBeGreaterThan(0);
    });

    it('should have tools defined for Python', () => {
      expect(lintingTools['Python']).toBeDefined();
      expect(lintingTools['Python'].length).toBeGreaterThan(0);
    });

    it('should have tools defined for Flutter', () => {
      expect(lintingTools['Flutter']).toBeDefined();
      expect(lintingTools['Flutter'].length).toBeGreaterThan(0);
    });

    it('should have tools defined for Rust', () => {
      expect(lintingTools['Rust']).toBeDefined();
      expect(lintingTools['Rust'].length).toBeGreaterThan(0);
    });

    it('should include ESLint for Node.js', () => {
      const eslint = lintingTools['Node.js'].find((tool) => tool.id === 'eslint');
      expect(eslint).toBeDefined();
      expect(eslint?.name).toBe('ESLint');
      expect(eslint?.recommended).toBe(true);
    });

    it('should include Prettier for Node.js', () => {
      const prettier = lintingTools['Node.js'].find((tool) => tool.id === 'prettier');
      expect(prettier).toBeDefined();
      expect(prettier?.name).toBe('Prettier');
      expect(prettier?.recommended).toBe(true);
    });

    it('should include Black for Python', () => {
      const black = lintingTools['Python'].find((tool) => tool.id === 'black');
      expect(black).toBeDefined();
      expect(black?.name).toBe('Black');
      expect(black?.dependencies).toContain('black>=23.0.0');
    });

    it('should include Dart Analyzer for Flutter', () => {
      const analyzer = lintingTools['Flutter'].find((tool) => tool.id === 'dartanalyzer');
      expect(analyzer).toBeDefined();
      expect(analyzer?.name).toBe('Dart Analyzer');
    });

    it('should include Clippy for Rust', () => {
      const clippy = lintingTools['Rust'].find((tool) => tool.id === 'clippy');
      expect(clippy).toBeDefined();
      expect(clippy?.name).toBe('Clippy');
    });
  });

  describe('getToolsForFramework', () => {
    it('should return tools for Node.js framework', () => {
      const tools = getToolsForFramework('Node.js', 'JavaScript');

      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.id === 'eslint')).toBe(true);
      expect(tools.some((t) => t.id === 'prettier')).toBe(true);
    });

    it('should return tools for React framework', () => {
      const tools = getToolsForFramework('React', 'JavaScript/TypeScript');

      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.id === 'eslint')).toBe(true);
    });

    it('should return tools for Python framework', () => {
      const tools = getToolsForFramework('Python', 'Python');

      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.id === 'black')).toBe(true);
      expect(tools.some((t) => t.id === 'flake8')).toBe(true);
    });

    it('should return tools for Flutter framework', () => {
      const tools = getToolsForFramework('Flutter', 'Dart');

      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.id === 'dartanalyzer')).toBe(true);
    });

    it('should return tools for Rust framework', () => {
      const tools = getToolsForFramework('Rust', 'Rust');

      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.id === 'clippy')).toBe(true);
      expect(tools.some((t) => t.id === 'rustfmt')).toBe(true);
    });

    it('should fall back to Node.js tools for unknown framework', () => {
      const tools = getToolsForFramework('UnknownFramework', 'JavaScript');

      expect(tools.length).toBeGreaterThan(0);
      expect(tools.some((t) => t.id === 'eslint')).toBe(true);
    });

    it('should handle empty framework gracefully', () => {
      const tools = getToolsForFramework('', 'JavaScript');

      expect(tools).toBeDefined();
      expect(Array.isArray(tools)).toBe(true);
    });
  });

  describe('getRecommendedTools', () => {
    it('should return only recommended tools for Node.js', () => {
      const recommended = getRecommendedTools('Node.js', 'JavaScript');

      expect(recommended.every((tool) => tool.recommended)).toBe(true);
      expect(recommended.some((t) => t.id === 'eslint')).toBe(true);
      expect(recommended.some((t) => t.id === 'prettier')).toBe(true);
    });

    it('should return only recommended tools for React', () => {
      const recommended = getRecommendedTools('React', 'JavaScript');

      expect(recommended.every((tool) => tool.recommended)).toBe(true);
    });

    it('should return only recommended tools for Python', () => {
      const recommended = getRecommendedTools('Python', 'Python');

      expect(recommended.every((tool) => tool.recommended)).toBe(true);
      expect(recommended.some((t) => t.id === 'black')).toBe(true);
      expect(recommended.some((t) => t.id === 'flake8')).toBe(true);
    });

    it('should filter out non-recommended tools', () => {
      const allTools = getToolsForFramework('Node.js', 'JavaScript');
      const recommended = getRecommendedTools('Node.js', 'JavaScript');

      expect(recommended.length).toBeLessThanOrEqual(allTools.length);
    });
  });

  describe('getDependenciesForTools', () => {
    it('should extract dependencies from selected tools', () => {
      const tools: LintingTool[] = [
        {
          id: 'eslint',
          name: 'ESLint',
          description: 'Linter',
          file: '.eslintrc.json',
          recommended: true,
          dependencies: ['eslint@^8.50.0'],
        },
        {
          id: 'prettier',
          name: 'Prettier',
          description: 'Formatter',
          file: '.prettierrc.json',
          recommended: true,
          dependencies: ['prettier@^3.0.0'],
        },
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps).toContain('eslint@^8.50.0');
      expect(deps).toContain('prettier@^3.0.0');
      expect(deps.length).toBe(2);
    });

    it('should handle tools with no dependencies', () => {
      const tools: LintingTool[] = [
        {
          id: 'dartanalyzer',
          name: 'Dart Analyzer',
          description: 'Linter',
          file: 'analysis_options.yaml',
          recommended: true,
          dependencies: [],
        },
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps).toEqual([]);
    });

    it('should include husky deps for Node.js precommit tool', () => {
      const precommit = lintingTools['Node.js'].find((t) => t.id === 'precommit');
      expect(precommit).toBeDefined();
      expect(precommit?.dependencies).toContain('husky@^9.1.7');
      expect(precommit?.dependencies).toContain('lint-staged@^16.2.0');
    });

    it('should handle tools with multiple dependencies', () => {
      const tools: LintingTool[] = [
        {
          id: 'typescript-eslint',
          name: 'TS ESLint',
          description: 'Linter',
          file: '.eslintrc.json',
          recommended: true,
          dependencies: [
            '@typescript-eslint/parser@^6.7.0',
            '@typescript-eslint/eslint-plugin@^6.7.0',
          ],
        },
      ];

      const deps = getDependenciesForTools(tools);

      expect(deps.length).toBe(2);
      expect(deps).toContain('@typescript-eslint/parser@^6.7.0');
      expect(deps).toContain('@typescript-eslint/eslint-plugin@^6.7.0');
    });

    it('should handle empty tools array', () => {
      const deps = getDependenciesForTools([]);

      expect(deps).toEqual([]);
    });

    it('should flatten dependencies from multiple tools', () => {
      const tools = getRecommendedTools('React', 'JavaScript');
      const deps = getDependenciesForTools(tools);

      expect(Array.isArray(deps)).toBe(true);
      expect(deps.length).toBeGreaterThan(0);
    });
  });

  describe('getScriptsForTools', () => {
    it('should extract scripts from selected tools', () => {
      const tools: LintingTool[] = [
        {
          id: 'eslint',
          name: 'ESLint',
          description: 'Linter',
          file: '.eslintrc.json',
          recommended: true,
          dependencies: ['eslint@^8.50.0'],
          scripts: {
            lint: 'eslint .',
            'lint:fix': 'eslint . --fix',
          },
        },
      ];

      const scripts = getScriptsForTools(tools);

      expect(scripts.lint).toBe('eslint .');
      expect(scripts['lint:fix']).toBe('eslint . --fix');
    });

    it('should merge scripts from multiple tools', () => {
      const tools: LintingTool[] = [
        {
          id: 'eslint',
          name: 'ESLint',
          description: 'Linter',
          file: '.eslintrc.json',
          recommended: true,
          dependencies: ['eslint@^8.50.0'],
          scripts: {
            lint: 'eslint .',
          },
        },
        {
          id: 'prettier',
          name: 'Prettier',
          description: 'Formatter',
          file: '.prettierrc.json',
          recommended: true,
          dependencies: ['prettier@^3.0.0'],
          scripts: {
            format: 'prettier --write .',
          },
        },
      ];

      const scripts = getScriptsForTools(tools);

      expect(scripts.lint).toBe('eslint .');
      expect(scripts.format).toBe('prettier --write .');
    });

    it('should handle tools with no scripts', () => {
      const tools: LintingTool[] = [
        {
          id: 'dartanalyzer',
          name: 'Dart Analyzer',
          description: 'Linter',
          file: 'analysis_options.yaml',
          recommended: true,
          dependencies: [],
        },
      ];

      const scripts = getScriptsForTools(tools);

      expect(scripts).toEqual({});
    });

    it('should include prepare script for Node.js precommit tool', () => {
      const precommit = lintingTools['Node.js'].find((t) => t.id === 'precommit');
      expect(precommit).toBeDefined();
      expect(precommit?.scripts).toBeDefined();
      expect(precommit?.scripts?.prepare).toBe('husky');
    });

    it('should handle empty tools array', () => {
      const scripts = getScriptsForTools([]);

      expect(scripts).toEqual({});
    });
  });

  describe('getPostInstallInstructions', () => {
    it('should extract post-install instructions', () => {
      const tools: any[] = [
        {
          id: 'precommit',
          name: 'Pre-commit',
          description: 'Hooks',
          file: '.pre-commit-config.yaml',
          recommended: true,
          dependencies: [],
          postInstall: 'pre-commit install',
        },
      ];

      const instructions = getPostInstallInstructions(tools, 'Node.js');

      expect(instructions.length).toBe(1);
      expect(instructions[0].command).toBe('pre-commit install');
      expect(instructions[0].description).toBe('Setup Pre-commit');
    });

    it('should handle tools without post-install', () => {
      const tools: LintingTool[] = [
        {
          id: 'eslint',
          name: 'ESLint',
          description: 'Linter',
          file: '.eslintrc.json',
          recommended: true,
          dependencies: ['eslint@^8.50.0'],
        },
      ];

      const instructions = getPostInstallInstructions(tools, 'Node.js');

      expect(instructions).toEqual([]);
    });

    it('should handle empty tools array', () => {
      const instructions = getPostInstallInstructions([], 'Node.js');

      expect(instructions).toEqual([]);
    });

    it('should handle multiple tools with post-install', () => {
      const tools: any[] = [
        {
          id: 'tool1',
          name: 'Tool 1',
          description: 'Test',
          file: 'config.json',
          recommended: true,
          postInstall: 'tool1 init',
        },
        {
          id: 'tool2',
          name: 'Tool 2',
          description: 'Test',
          file: 'config2.json',
          recommended: true,
          postInstall: 'tool2 setup',
        },
      ];

      const instructions = getPostInstallInstructions(tools, 'Node.js');

      expect(instructions.length).toBe(2);
      expect(instructions[0].command).toBe('tool1 init');
      expect(instructions[1].command).toBe('tool2 setup');
    });
  });
});
