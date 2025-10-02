import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { injectLintingDependencies } from '../../src/utils/inject-dependencies.js';

describe('inject-dependencies', () => {
  const testDir = path.join(process.cwd(), 'test-temp-inject');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    const originalDir = path.join(process.cwd(), '../..');
    process.chdir(originalDir);
    await fs.remove(testDir);
  });

  describe('Node.js dependency injection', () => {
    it('should inject dependencies into package.json', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0'
      });

      const dependencies = ['eslint@^8.50.0', 'prettier@^3.0.0'];
      const scripts = {
        lint: 'eslint .',
        format: 'prettier --write .'
      };

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
      expect(packageJson.devDependencies.prettier).toBe('^3.0.0');
    });

    it('should inject scripts into package.json', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0'
      });

      const dependencies = [];
      const scripts = {
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
        format: 'prettier --write .'
      };

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.lint).toBe('eslint .');
      expect(packageJson.scripts['lint:fix']).toBe('eslint . --fix');
      expect(packageJson.scripts.format).toBe('prettier --write .');
    });

    it('should merge with existing devDependencies', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0',
        devDependencies: {
          jest: '^29.0.0'
        }
      });

      const dependencies = ['eslint@^8.50.0'];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies.jest).toBe('^29.0.0');
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
    });

    it('should not override existing scripts', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0',
        scripts: {
          test: 'jest',
          lint: 'custom lint command'
        }
      });

      const dependencies = [];
      const scripts = {
        lint: 'eslint .',
        format: 'prettier --write .'
      };

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.scripts.test).toBe('jest');
      expect(packageJson.scripts.lint).toBe('custom lint command'); // Should NOT be overridden
      expect(packageJson.scripts.format).toBe('prettier --write .'); // Should be added
    });

    it('should handle missing package.json gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const dependencies = ['eslint@^8.50.0'];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('package.json not found')
      );

      consoleSpy.mockRestore();
    });

    it('should work for React framework', async () => {
      await fs.writeJson('package.json', {
        name: 'react-app',
        version: '1.0.0'
      });

      const dependencies = ['eslint@^8.50.0', 'eslint-plugin-react@^7.33.0'];
      const scripts = { lint: 'eslint .' };

      await injectLintingDependencies(dependencies, scripts, 'React');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
      expect(packageJson.devDependencies['eslint-plugin-react']).toBe('^7.33.0');
    });

    it('should work for Next.js framework', async () => {
      await fs.writeJson('package.json', {
        name: 'nextjs-app',
        version: '1.0.0'
      });

      const dependencies = ['eslint@^8.50.0', 'eslint-config-next@^13.0.0'];
      const scripts = { lint: 'next lint' };

      await injectLintingDependencies(dependencies, scripts, 'Next.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
      expect(packageJson.devDependencies['eslint-config-next']).toBe('^13.0.0');
    });

    it('should create devDependencies object if it does not exist', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0',
        dependencies: {
          express: '^4.18.0'
        }
      });

      const dependencies = ['eslint@^8.50.0'];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
      expect(packageJson.dependencies.express).toBe('^4.18.0');
    });

    it('should create scripts object if it does not exist', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0'
      });

      const dependencies = [];
      const scripts = { lint: 'eslint .' };

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts.lint).toBe('eslint .');
    });
  });

  describe('Python dependency injection', () => {
    it('should create requirements-dev.txt with dependencies', async () => {
      const dependencies = ['black>=23.0.0', 'flake8>=6.0.0', 'isort>=5.12.0'];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Python');

      const reqDevExists = await fs.pathExists('requirements-dev.txt');
      expect(reqDevExists).toBe(true);

      const content = await fs.readFile('requirements-dev.txt', 'utf8');
      expect(content).toContain('black>=23.0.0');
      expect(content).toContain('flake8>=6.0.0');
      expect(content).toContain('isort>=5.12.0');
    });

    it('should append to existing requirements-dev.txt', async () => {
      await fs.writeFile('requirements-dev.txt', 'pytest>=7.0.0\n');

      const dependencies = ['black>=23.0.0', 'flake8>=6.0.0'];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Python');

      const content = await fs.readFile('requirements-dev.txt', 'utf8');
      expect(content).toContain('pytest>=7.0.0');
      expect(content).toContain('black>=23.0.0');
      expect(content).toContain('flake8>=6.0.0');
    });

    it('should not duplicate existing dependencies', async () => {
      await fs.writeFile('requirements-dev.txt', 'black>=23.0.0\npytest>=7.0.0\n');

      const dependencies = ['black>=23.0.0', 'flake8>=6.0.0'];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Python');

      const content = await fs.readFile('requirements-dev.txt', 'utf8');
      const blackMatches = (content.match(/black/g) || []).length;

      expect(blackMatches).toBe(1); // Should only appear once
      expect(content).toContain('flake8>=6.0.0');
    });
  });

  describe('Flutter and Rust frameworks', () => {
    it('should do nothing for Flutter (built-in tools)', async () => {
      const dependencies = [];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Flutter');

      // Should not create any files
      const packageJsonExists = await fs.pathExists('package.json');
      const requirementsExists = await fs.pathExists('requirements-dev.txt');

      expect(packageJsonExists).toBe(false);
      expect(requirementsExists).toBe(false);
    });

    it('should do nothing for Rust (built-in tools)', async () => {
      const dependencies = [];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Rust');

      // Should not create any files
      const packageJsonExists = await fs.pathExists('package.json');
      const requirementsExists = await fs.pathExists('requirements-dev.txt');

      expect(packageJsonExists).toBe(false);
      expect(requirementsExists).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty dependencies array', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0'
      });

      const dependencies = [];
      const scripts = { lint: 'eslint .' };

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies).toEqual({});
      expect(packageJson.scripts.lint).toBe('eslint .');
    });

    it('should handle empty scripts object', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0'
      });

      const dependencies = ['eslint@^8.50.0'];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
      expect(packageJson.scripts).toEqual({});
    });

    it('should parse dependency versions correctly', async () => {
      await fs.writeJson('package.json', {
        name: 'test-project',
        version: '1.0.0'
      });

      const dependencies = [
        'eslint@^8.50.0',
        '@typescript-eslint/parser@^6.7.0',
        'prettier@~3.0.0'
      ];
      const scripts = {};

      await injectLintingDependencies(dependencies, scripts, 'Node.js');

      const packageJson = await fs.readJson('package.json');

      expect(packageJson.devDependencies.eslint).toBe('^8.50.0');
      expect(packageJson.devDependencies['@typescript-eslint/parser']).toBe('^6.7.0');
      expect(packageJson.devDependencies.prettier).toBe('~3.0.0');
    });
  });
});
