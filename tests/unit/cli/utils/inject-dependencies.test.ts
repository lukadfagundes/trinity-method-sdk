/**
 * Unit Tests - inject-dependencies.ts
 *
 * Tests dependency injection for Node.js (package.json) and Python (requirements-dev.txt)
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { injectLintingDependencies } from '../../../../src/cli/utils/inject-dependencies.js';

describe('injectLintingDependencies', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), '.tmp-test-inject-deps-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('Node.js Framework - package.json Injection', () => {
    it('should inject dependencies into new package.json devDependencies', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0',
      });

      const dependencies = ['eslint@^8.50.0', 'prettier@^3.0.0'];
      const scripts = { lint: 'eslint .' };

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies).toEqual({
        eslint: '^8.50.0',
        prettier: '^3.0.0',
      });
    });

    it('should inject scoped packages correctly', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        devDependencies: {},
      });

      const dependencies = [
        '@typescript-eslint/parser@^6.7.0',
        '@typescript-eslint/eslint-plugin@^6.7.0',
      ];

      await injectLintingDependencies(dependencies, {}, 'React');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies['@typescript-eslint/parser']).toBe('^6.7.0');
      expect(packageJson.devDependencies['@typescript-eslint/eslint-plugin']).toBe('^6.7.0');
    });

    it('should merge with existing devDependencies', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        devDependencies: {
          jest: '^29.0.0',
        },
      });

      const dependencies = ['eslint@^8.50.0'];

      await injectLintingDependencies(dependencies, {}, 'Next.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies.jest).toBe('^29.0.0');
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
    });

    it('should add scripts without overwriting existing scripts', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        scripts: {
          test: 'jest',
        },
      });

      const scripts = {
        lint: 'eslint .',
        format: 'prettier --write .',
      };

      await injectLintingDependencies([], scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.scripts.test).toBe('jest'); // Preserved
      expect(packageJson.scripts.lint).toBe('eslint .');
      expect(packageJson.scripts.format).toBe('prettier --write .');
    });

    it('should NOT overwrite existing scripts with same name', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        scripts: {
          lint: 'custom-linter --strict',
        },
      });

      const scripts = {
        lint: 'eslint .', // Should NOT replace existing
      };

      await injectLintingDependencies([], scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.scripts.lint).toBe('custom-linter --strict'); // Preserved
    });

    it('should create devDependencies section if missing', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        dependencies: { react: '^18.0.0' },
      });

      const dependencies = ['eslint@^8.50.0'];

      await injectLintingDependencies(dependencies, {}, 'React');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
    });

    it('should create scripts section if missing', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
      });

      const scripts = { lint: 'eslint .' };

      await injectLintingDependencies([], scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.lint).toBe('eslint .');
    });

    it('should handle empty dependencies array', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
      });

      await injectLintingDependencies([], {}, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies).toEqual({});
    });

    it('should handle empty scripts object', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
      });

      await injectLintingDependencies(['eslint@^8.50.0'], {}, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.scripts).toEqual({});
    });

    it('should warn and skip if package.json does not exist', async () => {
      // No package.json created
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await injectLintingDependencies(['eslint@^8.50.0'], {}, 'Node.js');

      expect(consoleSpy).toHaveBeenCalled();
      expect(await fs.pathExists('package.json')).toBe(false);

      consoleSpy.mockRestore();
    });

    it('should preserve formatting with 2-space indentation', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
      });

      await injectLintingDependencies(['eslint@^8.50.0'], { lint: 'eslint .' }, 'Node.js');

      const rawContent = await fs.readFile('package.json', 'utf8');

      expect(rawContent).toContain('  "name"');
      expect(rawContent).toContain('  "devDependencies"');
    });
  });

  describe('Python Framework - requirements-dev.txt Injection', () => {
    it('should create requirements-dev.txt with dependencies', async () => {
      const dependencies = ['black>=23.0.0', 'flake8>=6.0.0'];

      await injectLintingDependencies(dependencies, {}, 'Python');

      const content = await fs.readFile('requirements-dev.txt', 'utf8');

      expect(content).toContain('black>=23.0.0');
      expect(content).toContain('flake8>=6.0.0');
    });

    it('should append to existing requirements-dev.txt', async () => {
      await fs.writeFile('requirements-dev.txt', 'pytest>=7.0.0\n');

      const dependencies = ['black>=23.0.0'];

      await injectLintingDependencies(dependencies, {}, 'Python');

      const content = await fs.readFile('requirements-dev.txt', 'utf8');

      expect(content).toContain('pytest>=7.0.0');
      expect(content).toContain('black>=23.0.0');
    });

    it('should NOT duplicate existing dependencies', async () => {
      await fs.writeFile('requirements-dev.txt', 'black>=23.0.0\n');

      const dependencies = ['black>=24.0.0']; // Different version

      await injectLintingDependencies(dependencies, {}, 'Python');

      const content = await fs.readFile('requirements-dev.txt', 'utf8');
      const lines = content.split('\n').filter(Boolean);

      // Should only have 1 black entry (existing one preserved)
      expect(lines.filter((line) => line.startsWith('black')).length).toBe(1);
      expect(content).toContain('black>=23.0.0'); // Original preserved
    });

    it('should handle dependencies with == operator', async () => {
      const dependencies = ['black==23.9.1', 'flake8==6.1.0'];

      await injectLintingDependencies(dependencies, {}, 'Python');

      const content = await fs.readFile('requirements-dev.txt', 'utf8');

      expect(content).toContain('black==23.9.1');
      expect(content).toContain('flake8==6.1.0');
    });

    it('should handle empty dependencies array', async () => {
      await injectLintingDependencies([], {}, 'Python');

      if (await fs.pathExists('requirements-dev.txt')) {
        const content = await fs.readFile('requirements-dev.txt', 'utf8');
        expect(content).toBe('');
      }
    });
  });

  describe('Framework Routing', () => {
    it('should route Node.js to package.json injection', async () => {
      await fs.writeJson('package.json', { name: 'test' });

      await injectLintingDependencies(['eslint@^8.50.0'], {}, 'Node.js');

      const packageJson = await fs.readJson('package.json');
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
    });

    it('should route React to package.json injection', async () => {
      await fs.writeJson('package.json', { name: 'test' });

      await injectLintingDependencies(['eslint@^8.50.0'], {}, 'React');

      const packageJson = await fs.readJson('package.json');
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
    });

    it('should route Next.js to package.json injection', async () => {
      await fs.writeJson('package.json', { name: 'test' });

      await injectLintingDependencies(['eslint@^8.50.0'], {}, 'Next.js');

      const packageJson = await fs.readJson('package.json');
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
    });

    it('should route Python to requirements-dev.txt injection', async () => {
      await injectLintingDependencies(['black>=23.0.0'], {}, 'Python');

      expect(await fs.pathExists('requirements-dev.txt')).toBe(true);
    });

    it('should do nothing for Rust framework', async () => {
      await injectLintingDependencies(['some-dep@1.0.0'], {}, 'Rust');

      expect(await fs.pathExists('package.json')).toBe(false);
      expect(await fs.pathExists('requirements-dev.txt')).toBe(false);
    });

    it('should do nothing for Flutter framework', async () => {
      await injectLintingDependencies(['some-dep@1.0.0'], {}, 'Flutter');

      expect(await fs.pathExists('package.json')).toBe(false);
      expect(await fs.pathExists('requirements-dev.txt')).toBe(false);
    });

    it('should do nothing for Generic framework', async () => {
      await injectLintingDependencies(['some-dep@1.0.0'], {}, 'Generic');

      expect(await fs.pathExists('package.json')).toBe(false);
      expect(await fs.pathExists('requirements-dev.txt')).toBe(false);
    });
  });
});
