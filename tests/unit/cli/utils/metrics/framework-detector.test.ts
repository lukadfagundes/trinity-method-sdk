/**
 * Unit Tests - framework-detector.ts
 *
 * Tests framework version detection and package manager detection
 * across all supported frameworks: React, Next.js, Node.js, Flutter, Python, Rust
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import {
  detectFrameworkVersion,
  detectPackageManager,
} from '../../../../../src/cli/utils/metrics/framework-detector.js';
import { mockConsole } from '../../../../utils/console-mocks.js';

describe('Framework Detector', () => {
  mockConsole();
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), `.tmp-test-fw-detector-${Date.now()}`);
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('detectFrameworkVersion', () => {
    describe('Node.js', () => {
      it('should detect Node.js version from CLI', async () => {
        const version = await detectFrameworkVersion('Node.js');

        // Node.js is always available in the test environment
        expect(version).toMatch(/^v?\d+\.\d+\.\d+/);
      });
    });

    describe('React', () => {
      it('should detect React version from package.json', async () => {
        await fs.writeJson('package.json', {
          dependencies: { react: '^18.2.0' },
        });

        const version = await detectFrameworkVersion('React');

        expect(version).toBe('18.2.0');
      });

      it('should strip tilde prefix from version', async () => {
        await fs.writeJson('package.json', {
          dependencies: { react: '~17.0.2' },
        });

        const version = await detectFrameworkVersion('React');

        expect(version).toBe('17.0.2');
      });

      it('should fall back to Node.js version when react not in dependencies', async () => {
        await fs.writeJson('package.json', {
          dependencies: { lodash: '^4.0.0' },
        });

        const version = await detectFrameworkVersion('React');

        // Falls back to detectNodeVersion() which returns node --version
        expect(version).toMatch(/^v?\d+\.\d+\.\d+/);
      });

      it('should return Unknown when package.json missing', async () => {
        const version = await detectFrameworkVersion('React');

        expect(version).toBe('Unknown');
      });
    });

    describe('Next.js', () => {
      it('should detect Next.js version from package.json', async () => {
        await fs.writeJson('package.json', {
          dependencies: { next: '^14.1.0' },
        });

        const version = await detectFrameworkVersion('Next.js');

        expect(version).toBe('14.1.0');
      });

      it('should fall back to Node.js version when next not in dependencies', async () => {
        await fs.writeJson('package.json', {
          dependencies: { react: '^18.0.0' },
        });

        const version = await detectFrameworkVersion('Next.js');

        // Falls back to detectNodeVersion()
        expect(version).toMatch(/^v?\d+\.\d+\.\d+/);
      });

      it('should return Unknown when package.json missing', async () => {
        const version = await detectFrameworkVersion('Next.js');

        expect(version).toBe('Unknown');
      });
    });

    describe('Flutter', () => {
      it('should detect Flutter SDK version from pubspec.yaml', async () => {
        await fs.writeFile(
          'pubspec.yaml',
          ['name: my_app', 'environment:', '  sdk: ">=3.2.0 <4.0.0"', ''].join('\n')
        );

        const version = await detectFrameworkVersion('Flutter');

        expect(version).toBe('3.2.0');
      });

      it('should return Unknown when pubspec.yaml missing', async () => {
        const version = await detectFrameworkVersion('Flutter');

        expect(version).toBe('Unknown');
      });

      it('should return Unknown when sdk constraint not found', async () => {
        await fs.writeFile('pubspec.yaml', 'name: my_app\nversion: 1.0.0\n');

        const version = await detectFrameworkVersion('Flutter');

        expect(version).toBe('Unknown');
      });
    });

    describe('Python', () => {
      it('should detect Python version or return Unknown', async () => {
        const version = await detectFrameworkVersion('Python');

        // Python may or may not be installed in test environment
        expect(typeof version).toBe('string');
        expect(version.length).toBeGreaterThan(0);
      });
    });

    describe('Rust', () => {
      it('should detect Rust version or return Unknown', async () => {
        const version = await detectFrameworkVersion('Rust');

        // Rust may or may not be installed in test environment
        expect(typeof version).toBe('string');
        expect(version.length).toBeGreaterThan(0);
      });
    });

    describe('Unknown framework', () => {
      it('should return Unknown for unrecognized framework', async () => {
        const version = await detectFrameworkVersion('Elixir');

        expect(version).toBe('Unknown');
      });
    });

    describe('Error handling', () => {
      it('should return Unknown when detector throws', async () => {
        // Malformed package.json will cause readJson to throw
        await fs.writeFile('package.json', '{bad json!!!}');

        const version = await detectFrameworkVersion('React');

        expect(version).toBe('Unknown');
      });
    });
  });

  describe('detectPackageManager', () => {
    it('should detect npm from package-lock.json', async () => {
      await fs.writeFile('package-lock.json', '{}');

      const pm = await detectPackageManager();

      expect(pm).toBe('npm');
    });

    it('should detect yarn from yarn.lock', async () => {
      await fs.writeFile('yarn.lock', '');

      const pm = await detectPackageManager();

      expect(pm).toBe('yarn');
    });

    it('should detect pnpm from pnpm-lock.yaml', async () => {
      await fs.writeFile('pnpm-lock.yaml', '');

      const pm = await detectPackageManager();

      expect(pm).toBe('pnpm');
    });

    it('should detect pub from pubspec.yaml', async () => {
      await fs.writeFile('pubspec.yaml', 'name: my_app\n');

      const pm = await detectPackageManager();

      expect(pm).toBe('pub');
    });

    it('should detect pip from requirements.txt', async () => {
      await fs.writeFile('requirements.txt', 'requests==2.28.0\n');

      const pm = await detectPackageManager();

      expect(pm).toBe('pip');
    });

    it('should detect cargo from Cargo.toml', async () => {
      await fs.writeFile('Cargo.toml', '[package]\nname = "app"\n');

      const pm = await detectPackageManager();

      expect(pm).toBe('cargo');
    });

    it('should return Unknown when no lock files found', async () => {
      const pm = await detectPackageManager();

      expect(pm).toBe('Unknown');
    });

    it('should prioritize pnpm over yarn and npm', async () => {
      await fs.writeFile('pnpm-lock.yaml', '');
      await fs.writeFile('yarn.lock', '');
      await fs.writeFile('package-lock.json', '{}');

      const pm = await detectPackageManager();

      expect(pm).toBe('pnpm');
    });

    it('should prioritize yarn over npm', async () => {
      await fs.writeFile('yarn.lock', '');
      await fs.writeFile('package-lock.json', '{}');

      const pm = await detectPackageManager();

      expect(pm).toBe('yarn');
    });
  });
});
