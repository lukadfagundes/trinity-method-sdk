/**
 * Unit Tests - dependency-parser.ts
 *
 * Tests dependency parsing across all supported frameworks:
 * Node.js (package.json), Flutter (pubspec.yaml), Python (requirements.txt), Rust (Cargo.toml)
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { parseDependencies } from '../../../../../src/cli/utils/metrics/dependency-parser.js';
import { mockConsole } from '../../../../utils/console-mocks.js';

describe('parseDependencies', () => {
  mockConsole();
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), `.tmp-test-dep-parser-${Date.now()}`);
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('Default / Unknown framework', () => {
    it('should return empty metrics for unknown framework', async () => {
      const result = await parseDependencies('Unknown');

      expect(result).toEqual({
        dependencies: {},
        dependencyCount: 0,
        devDependencies: {},
        devDependencyCount: 0,
      });
    });

    it('should return empty metrics for Go (no parser registered)', async () => {
      await fs.writeFile('go.mod', 'module example.com/app\n\ngo 1.21\n');

      const result = await parseDependencies('Go');

      expect(result).toEqual({
        dependencies: {},
        dependencyCount: 0,
        devDependencies: {},
        devDependencyCount: 0,
      });
    });
  });

  describe('Node.js (package.json)', () => {
    it('should parse dependencies and devDependencies', async () => {
      await fs.writeJson('package.json', {
        name: 'test-app',
        dependencies: {
          express: '^4.18.0',
          lodash: '~4.17.21',
        },
        devDependencies: {
          jest: '^29.0.0',
          typescript: '^5.0.0',
        },
      });

      const result = await parseDependencies('Node.js');

      expect(result.dependencies).toEqual({
        express: '^4.18.0',
        lodash: '~4.17.21',
      });
      expect(result.dependencyCount).toBe(2);
      expect(result.devDependencies).toEqual({
        jest: '^29.0.0',
        typescript: '^5.0.0',
      });
      expect(result.devDependencyCount).toBe(2);
    });

    it('should handle package.json with only dependencies', async () => {
      await fs.writeJson('package.json', {
        name: 'test-app',
        dependencies: { express: '^4.18.0' },
      });

      const result = await parseDependencies('Node.js');

      expect(result.dependencyCount).toBe(1);
      expect(result.devDependencies).toEqual({});
      expect(result.devDependencyCount).toBe(0);
    });

    it('should handle package.json with no dependencies at all', async () => {
      await fs.writeJson('package.json', { name: 'test-app' });

      const result = await parseDependencies('Node.js');

      expect(result.dependencies).toEqual({});
      expect(result.dependencyCount).toBe(0);
      expect(result.devDependencies).toEqual({});
      expect(result.devDependencyCount).toBe(0);
    });

    it('should return empty when package.json does not exist', async () => {
      const result = await parseDependencies('Node.js');

      expect(result).toEqual({
        dependencies: {},
        dependencyCount: 0,
        devDependencies: {},
        devDependencyCount: 0,
      });
    });

    it('should also work for React framework (shares parser)', async () => {
      await fs.writeJson('package.json', {
        dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' },
      });

      const result = await parseDependencies('React');

      expect(result.dependencyCount).toBe(2);
      expect(result.dependencies).toHaveProperty('react');
    });

    it('should also work for Next.js framework (shares parser)', async () => {
      await fs.writeJson('package.json', {
        dependencies: { next: '^14.0.0' },
      });

      const result = await parseDependencies('Next.js');

      expect(result.dependencyCount).toBe(1);
      expect(result.dependencies).toHaveProperty('next');
    });
  });

  describe('Flutter (pubspec.yaml)', () => {
    it('should parse dependencies from pubspec.yaml', async () => {
      await fs.writeFile(
        'pubspec.yaml',
        [
          'name: my_app',
          'dependencies:',
          '  flutter:',
          '    sdk: flutter',
          '  http: ^0.13.0',
          '  provider: ^6.0.0',
          'dev_dependencies:',
          '  flutter_test:',
          '    sdk: flutter',
          '  mockito: ^5.0.0',
          '',
        ].join('\n')
      );

      const result = await parseDependencies('Flutter');

      expect(result.dependencyCount).toBeGreaterThanOrEqual(1);
      expect(result.devDependencyCount).toBeGreaterThanOrEqual(1);
    });

    it('should return empty when pubspec.yaml does not exist', async () => {
      const result = await parseDependencies('Flutter');

      expect(result).toEqual({
        dependencies: {},
        dependencyCount: 0,
        devDependencies: {},
        devDependencyCount: 0,
      });
    });

    it('should handle pubspec.yaml with only dependencies section', async () => {
      await fs.writeFile(
        'pubspec.yaml',
        ['name: my_app', 'dependencies:', '  http: ^0.13.0', ''].join('\n')
      );

      const result = await parseDependencies('Flutter');

      expect(result.dependencyCount).toBeGreaterThanOrEqual(1);
      expect(result.devDependencyCount).toBe(0);
    });

    it('should handle pubspec.yaml with no dependencies', async () => {
      await fs.writeFile('pubspec.yaml', 'name: my_app\nversion: 1.0.0\n');

      const result = await parseDependencies('Flutter');

      expect(result.dependencyCount).toBe(0);
      expect(result.devDependencyCount).toBe(0);
    });
  });

  describe('Python (requirements.txt)', () => {
    it('should parse dependencies from requirements.txt', async () => {
      await fs.writeFile(
        'requirements.txt',
        ['requests==2.28.0', 'flask>=2.0.0', 'sqlalchemy<2.0', 'pytest', ''].join('\n')
      );

      const result = await parseDependencies('Python');

      expect(result.dependencyCount).toBe(4);
      expect(result.dependencies).toHaveProperty('requests');
      expect(result.dependencies).toHaveProperty('flask');
      expect(result.dependencies).toHaveProperty('sqlalchemy');
      expect(result.dependencies).toHaveProperty('pytest');
    });

    it('should skip comment lines', async () => {
      await fs.writeFile(
        'requirements.txt',
        ['# This is a comment', 'requests==2.28.0', '# Another comment', 'flask>=2.0.0', ''].join(
          '\n'
        )
      );

      const result = await parseDependencies('Python');

      expect(result.dependencyCount).toBe(2);
    });

    it('should skip empty lines', async () => {
      await fs.writeFile(
        'requirements.txt',
        ['requests==2.28.0', '', '', 'flask>=2.0.0', ''].join('\n')
      );

      const result = await parseDependencies('Python');

      expect(result.dependencyCount).toBe(2);
    });

    it('should return empty devDependencies (Python has no distinction)', async () => {
      await fs.writeFile('requirements.txt', 'requests==2.28.0\n');

      const result = await parseDependencies('Python');

      expect(result.devDependencies).toEqual({});
      expect(result.devDependencyCount).toBe(0);
    });

    it('should return empty when requirements.txt does not exist', async () => {
      const result = await parseDependencies('Python');

      expect(result).toEqual({
        dependencies: {},
        dependencyCount: 0,
        devDependencies: {},
        devDependencyCount: 0,
      });
    });

    it('should handle empty requirements.txt', async () => {
      await fs.writeFile('requirements.txt', '');

      const result = await parseDependencies('Python');

      expect(result.dependencyCount).toBe(0);
    });
  });

  describe('Rust (Cargo.toml)', () => {
    it('should parse dependencies and dev-dependencies', async () => {
      await fs.writeFile(
        'Cargo.toml',
        [
          '[package]',
          'name = "my_app"',
          'version = "0.1.0"',
          '',
          '[dependencies]',
          'serde = "1.0"',
          'tokio = { version = "1.0", features = ["full"] }',
          '',
          '[dev-dependencies]',
          'criterion = "0.5"',
          '',
        ].join('\n')
      );

      const result = await parseDependencies('Rust');

      expect(result.dependencyCount).toBe(2);
      expect(result.dependencies).toHaveProperty('serde');
      expect(result.dependencies).toHaveProperty('tokio');
      expect(result.devDependencyCount).toBe(1);
      expect(result.devDependencies).toHaveProperty('criterion');
    });

    it('should handle Cargo.toml with only [dependencies]', async () => {
      await fs.writeFile(
        'Cargo.toml',
        ['[package]', 'name = "my_app"', '', '[dependencies]', 'serde = "1.0"', ''].join('\n')
      );

      const result = await parseDependencies('Rust');

      expect(result.dependencyCount).toBe(1);
      expect(result.devDependencyCount).toBe(0);
    });

    it('should return empty when Cargo.toml does not exist', async () => {
      const result = await parseDependencies('Rust');

      expect(result).toEqual({
        dependencies: {},
        dependencyCount: 0,
        devDependencies: {},
        devDependencyCount: 0,
      });
    });

    it('should handle Cargo.toml with no dependencies section', async () => {
      await fs.writeFile(
        'Cargo.toml',
        ['[package]', 'name = "my_app"', 'version = "0.1.0"', ''].join('\n')
      );

      const result = await parseDependencies('Rust');

      expect(result.dependencyCount).toBe(0);
      expect(result.devDependencyCount).toBe(0);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed package.json gracefully', async () => {
      await fs.writeFile('package.json', '{invalid json!!!}');

      const result = await parseDependencies('Node.js');

      expect(result).toEqual({
        dependencies: {},
        dependencyCount: 0,
        devDependencies: {},
        devDependencyCount: 0,
      });
    });
  });
});
