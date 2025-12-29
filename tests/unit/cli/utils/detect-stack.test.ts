/**
 * Unit Tests - detect-stack.ts
 *
 * Tests technology stack detection across multiple frameworks and languages
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { detectStack } from '../../../../src/cli/utils/detect-stack.js';
import { mockConsole } from '../../../utils/console-mocks.js';

describe('detectStack', () => {
  // Mock console to reduce test noise
  mockConsole();
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), `.tmp-test-detect-stack-${Date.now()}`);
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('Flutter Detection', () => {
    it('should detect Flutter project from pubspec.yaml', async () => {
      await fs.writeFile('pubspec.yaml', 'name: my_app\n');

      const stack = await detectStack();

      expect(stack.language).toBe('Dart');
      expect(stack.framework).toBe('Flutter');
      expect(stack.sourceDir).toBe('lib');
    });

    it('should detect Flutter even with package.json present', async () => {
      // pubspec.yaml should take precedence
      await fs.writeFile('pubspec.yaml', 'name: my_app\n');
      await fs.writeJson('package.json', { name: 'test' });

      const stack = await detectStack();

      expect(stack.framework).toBe('Flutter');
      expect(stack.language).toBe('Dart');
    });
  });

  describe('Rust Detection', () => {
    it('should detect Rust project from Cargo.toml', async () => {
      await fs.writeFile('Cargo.toml', '[package]\nname = "my_app"\n');

      const stack = await detectStack();

      expect(stack.language).toBe('Rust');
      expect(stack.framework).toBe('Generic');
      expect(stack.sourceDir).toBe('src');
    });
  });

  describe('Go Detection', () => {
    it('should detect Go project from go.mod', async () => {
      await fs.writeFile('go.mod', 'module example.com/my_app\n');

      const stack = await detectStack();

      expect(stack.language).toBe('Go');
      expect(stack.framework).toBe('Generic');
      expect(stack.sourceDir).toBe('.');
    });
  });

  describe('Node.js Framework Detection', () => {
    it('should detect React project', async () => {
      await fs.writeJson('package.json', {
        name: 'my-app',
        dependencies: { react: '^18.0.0' },
      });

      const stack = await detectStack();

      expect(stack.language).toBe('JavaScript/TypeScript');
      expect(stack.framework).toBe('React');
      expect(stack.sourceDir).toBe('src');
    });

    it('should detect Next.js project', async () => {
      await fs.writeJson('package.json', {
        name: 'my-app',
        dependencies: { next: '^14.0.0', react: '^18.0.0' },
      });

      const stack = await detectStack();

      expect(stack.framework).toBe('Next.js');
    });

    it('should detect Vue project', async () => {
      await fs.writeJson('package.json', {
        name: 'my-app',
        dependencies: { vue: '^3.0.0' },
      });

      const stack = await detectStack();

      expect(stack.framework).toBe('Vue');
    });

    it('should detect Angular project', async () => {
      await fs.writeJson('package.json', {
        name: 'my-app',
        dependencies: { '@angular/core': '^17.0.0' },
      });

      const stack = await detectStack();

      expect(stack.framework).toBe('Angular');
      expect(stack.sourceDir).toBe('src/app');
    });

    it('should detect Express project', async () => {
      await fs.writeJson('package.json', {
        name: 'my-app',
        dependencies: { express: '^4.0.0' },
      });

      const stack = await detectStack();

      expect(stack.framework).toBe('Express');
    });

    it('should detect generic Node.js project', async () => {
      await fs.writeJson('package.json', {
        name: 'my-app',
        dependencies: { lodash: '^4.0.0' },
      });

      const stack = await detectStack();

      expect(stack.framework).toBe('Node.js');
    });
  });

  describe('Package Manager Detection', () => {
    it('should detect npm as default', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });

      const stack = await detectStack();

      expect(stack.packageManager).toBe('npm');
    });

    it('should detect yarn from yarn.lock', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.writeFile('yarn.lock', '');

      const stack = await detectStack();

      expect(stack.packageManager).toBe('yarn');
    });

    it('should detect pnpm from pnpm-lock.yaml', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.writeFile('pnpm-lock.yaml', '');

      const stack = await detectStack();

      expect(stack.packageManager).toBe('pnpm');
    });

    it('should prioritize pnpm over yarn', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.writeFile('yarn.lock', '');
      await fs.writeFile('pnpm-lock.yaml', '');

      const stack = await detectStack();

      expect(stack.packageManager).toBe('pnpm');
    });
  });

  describe('Python Detection', () => {
    it('should detect Python from requirements.txt', async () => {
      await fs.writeFile('requirements.txt', 'requests==2.28.0\n');

      const stack = await detectStack();

      expect(stack.language).toBe('Python');
      expect(stack.framework).toBe('Generic');
      expect(stack.sourceDir).toBe('app');
    });

    it('should detect Python from setup.py', async () => {
      await fs.writeFile('setup.py', 'from setuptools import setup\n');

      const stack = await detectStack();

      expect(stack.language).toBe('Python');
    });

    it('should detect Python from pyproject.toml', async () => {
      await fs.writeFile('pyproject.toml', '[tool.poetry]\n');

      const stack = await detectStack();

      expect(stack.language).toBe('Python');
    });

    it('should detect Flask framework', async () => {
      await fs.writeFile('requirements.txt', 'flask==2.0.1\nrequests==2.28.0\n');

      const stack = await detectStack();

      expect(stack.framework).toBe('Flask');
    });

    it('should detect Flask case-insensitively', async () => {
      await fs.writeFile('requirements.txt', 'Flask==2.0.0\n');

      const stack = await detectStack();

      expect(stack.framework).toBe('Flask');
    });
  });

  describe('Source Directory Detection', () => {
    it('should detect single src directory', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.ensureDir('src');

      const stack = await detectStack();

      expect(stack.sourceDirs).toContain('src');
      expect(stack.sourceDir).toBe('src');
    });

    it('should detect multiple top-level source directories', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.ensureDir('src');
      await fs.ensureDir('lib');
      await fs.ensureDir('app');

      const stack = await detectStack();

      expect(stack.sourceDirs).toContain('src');
      expect(stack.sourceDirs).toContain('lib');
      expect(stack.sourceDirs).toContain('app');
      expect(stack.sourceDirs.length).toBeGreaterThanOrEqual(3);
    });

    it('should detect nested source directories (backend/src)', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.ensureDir('backend/src');

      const stack = await detectStack();

      expect(stack.sourceDirs).toContain('backend/src');
    });

    it('should detect monorepo with frontend and backend', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.ensureDir('frontend/src');
      await fs.ensureDir('backend/src');

      const stack = await detectStack();

      expect(stack.sourceDirs).toContain('frontend/src');
      expect(stack.sourceDirs).toContain('backend/src');
    });

    it('should detect deeply nested directories (3 levels)', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.ensureDir('src/backend/src');

      const stack = await detectStack();

      expect(stack.sourceDirs).toContain('src/backend/src');
      expect(stack.sourceDirs).toContain('src/backend'); // Intermediate dir
    });

    it('should use first detected directory as primary sourceDir', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });
      await fs.ensureDir('lib');
      await fs.ensureDir('app');

      const stack = await detectStack();

      expect(stack.sourceDirs).toContain(stack.sourceDir);
    });

    it('should default to ["src"] when no directories found', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });

      const stack = await detectStack();

      expect(stack.sourceDirs).toEqual(['src']);
      expect(stack.sourceDir).toBe('src');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty directory gracefully', async () => {
      const stack = await detectStack();

      expect(stack.language).toBe('Unknown');
      expect(stack.framework).toBe('Generic');
      expect(stack.sourceDir).toBe('src');
      expect(stack.sourceDirs).toEqual(['src']);
    });

    it('should handle malformed package.json', async () => {
      await fs.writeFile('package.json', 'invalid json{{{');

      const stack = await detectStack();

      // Should fall back to Unknown/Generic without crashing
      expect(stack.language).toBe('Unknown');
      expect(stack.framework).toBe('Generic');
    });

    it('should handle package.json with missing dependencies', async () => {
      await fs.writeJson('package.json', { name: 'my-app' });

      const stack = await detectStack();

      expect(stack.language).toBe('JavaScript/TypeScript');
      expect(stack.framework).toBe('Node.js');
    });

    it('should handle custom targetDir parameter', async () => {
      const customDir = path.join(testDir, 'custom');
      await fs.ensureDir(customDir);
      await fs.writeJson(path.join(customDir, 'package.json'), {
        dependencies: { react: '^18.0.0' },
      });

      const stack = await detectStack(customDir);

      expect(stack.framework).toBe('React');
    });

    it('should handle non-existent targetDir gracefully', async () => {
      const nonExistent = path.join(testDir, 'does-not-exist');

      const stack = await detectStack(nonExistent);

      expect(stack.language).toBe('Unknown');
      expect(stack.framework).toBe('Generic');
    });
  });

  describe('Priority Order', () => {
    it('should prioritize Flutter over Node.js when both files exist', async () => {
      await fs.writeFile('pubspec.yaml', 'name: my_app\n');
      await fs.writeJson('package.json', {
        dependencies: { react: '^18.0.0' },
      });

      const stack = await detectStack();

      expect(stack.framework).toBe('Flutter');
      expect(stack.language).toBe('Dart');
    });

    it('should prioritize Rust over Node.js when both files exist', async () => {
      await fs.writeFile('Cargo.toml', '[package]\nname = "my_app"\n');
      await fs.writeJson('package.json', { name: 'test' });

      const stack = await detectStack();

      expect(stack.framework).toBe('Generic');
      expect(stack.language).toBe('Rust');
    });

    it('should prioritize Go over Node.js when both files exist', async () => {
      await fs.writeFile('go.mod', 'module example.com/my_app\n');
      await fs.writeJson('package.json', { name: 'test' });

      const stack = await detectStack();

      expect(stack.language).toBe('Go');
    });
  });
});
