/**
 * Unit Tests - codebase-metrics.ts
 *
 * Tests codebase metrics collection (code quality, file complexity, dependencies, git)
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import {
  countPattern,
  analyzeFileComplexity,
  parseDependencies,
  detectFrameworkVersion,
  detectPackageManager,
} from '../../../../src/cli/utils/codebase-metrics.js';

describe('codebase-metrics', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), '.tmp-test-metrics-' + Date.now());
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('countPattern', () => {
    it('should count TODO comments in JavaScript files', async () => {
      await fs.ensureDir('src');
      await fs.writeFile(
        'src/index.js',
        '// TODO: implement feature\nconst x = 1;\n// TODO: fix bug'
      );

      const count = await countPattern('src', /\/\/\s*TODO/gi);

      expect(count).toBe(2);
    });

    it('should count TODO comments in Python files', async () => {
      await fs.ensureDir('app');
      await fs.writeFile('app/main.py', '# TODO: implement\ndef main():\n  # TODO: test\n  pass');

      const count = await countPattern('app', /#\s*TODO/gi);

      expect(count).toBe(2);
    });

    it('should count FIXME comments', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/index.ts', '// FIXME: broken\nconst x = 1;\n// FIXME: refactor');

      const count = await countPattern('src', /\/\/\s*FIXME/gi);

      expect(count).toBe(2);
    });

    it('should count console statements', async () => {
      await fs.ensureDir('src');
      await fs.writeFile(
        'src/debug.js',
        'console.log("test");\nconsole.warn("warning");\nconsole.error("error");'
      );

      const count = await countPattern('src', /console\.(log|warn|error|debug|info)/gi);

      expect(count).toBe(3);
    });

    it('should ignore node_modules directory', async () => {
      await fs.ensureDir('src');
      await fs.ensureDir('node_modules');
      await fs.writeFile('src/index.js', '// TODO: test');
      await fs.writeFile('node_modules/lib.js', '// TODO: should be ignored');

      const count = await countPattern('.', /\/\/\s*TODO/gi);

      expect(count).toBe(1); // Only src/index.js counted
    });

    it('should ignore dist and build directories', async () => {
      await fs.ensureDir('src');
      await fs.ensureDir('dist');
      await fs.ensureDir('build');
      await fs.writeFile('src/index.js', '// TODO: test');
      await fs.writeFile('dist/index.js', '// TODO: ignore');
      await fs.writeFile('build/index.js', '// TODO: ignore');

      const count = await countPattern('.', /\/\/\s*TODO/gi);

      expect(count).toBe(1);
    });

    it('should return 0 for non-existent directory', async () => {
      const count = await countPattern('nonexistent', /TODO/gi);

      expect(count).toBe(0);
    });

    it('should handle empty directory', async () => {
      await fs.ensureDir('empty');

      const count = await countPattern('empty', /TODO/gi);

      expect(count).toBe(0);
    });
  });

  describe('analyzeFileComplexity', () => {
    it('should count total files', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/a.js', 'const x = 1;');
      await fs.writeFile('src/b.ts', 'const y = 2;');
      await fs.writeFile('src/c.jsx', 'const z = 3;');

      const metrics = await analyzeFileComplexity('src');

      expect(metrics.totalFiles).toBe(3);
    });

    it('should count files over 500 lines', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/small.js', 'const x = 1;\n'.repeat(100));
      await fs.writeFile('src/large.js', 'const x = 1;\n'.repeat(600));

      const metrics = await analyzeFileComplexity('src');

      expect(metrics.filesOver500).toBe(1);
    });

    it('should count files over 1000 lines', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/huge.js', 'const x = 1;\n'.repeat(1200));

      const metrics = await analyzeFileComplexity('src');

      expect(metrics.filesOver1000).toBe(1);
    });

    it('should count files over 3000 lines', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/massive.js', 'const x = 1;\n'.repeat(3500));

      const metrics = await analyzeFileComplexity('src');

      expect(metrics.filesOver3000).toBe(1);
    });

    it('should calculate average file length', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/a.js', 'line1\nline2\nline3'); // 3 lines
      await fs.writeFile('src/b.js', 'line1\nline2\nline3\nline4\nline5'); // 5 lines

      const metrics = await analyzeFileComplexity('src');

      expect(metrics.avgFileLength).toBe(4); // (3 + 5) / 2 = 4
    });

    it('should return largest files sorted by size', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/small.js', 'x');
      await fs.writeFile('src/medium.js', 'x\nx\nx');
      await fs.writeFile('src/large.js', 'x\nx\nx\nx\nx');

      const metrics = await analyzeFileComplexity('src');

      expect(metrics.largestFiles.length).toBe(3);
      expect(metrics.largestFiles[0].file).toContain('large.js');
      expect(metrics.largestFiles[0].lines).toBe(5);
      expect(metrics.largestFiles[2].file).toContain('small.js');
    });

    it('should return empty metrics for non-existent directory', async () => {
      const metrics = await analyzeFileComplexity('nonexistent');

      expect(metrics.totalFiles).toBe(0);
      expect(metrics.filesOver500).toBe(0);
      expect(metrics.avgFileLength).toBe(0);
      expect(metrics.largestFiles).toEqual([]);
    });

    it('should handle empty directory', async () => {
      await fs.ensureDir('empty');

      const metrics = await analyzeFileComplexity('empty');

      expect(metrics.totalFiles).toBe(0);
      expect(metrics.avgFileLength).toBe(0);
    });

    it('should support multiple file extensions', async () => {
      await fs.ensureDir('src');
      await fs.writeFile('src/file.js', 'js');
      await fs.writeFile('src/file.ts', 'ts');
      await fs.writeFile('src/file.jsx', 'jsx');
      await fs.writeFile('src/file.tsx', 'tsx');
      await fs.writeFile('src/file.dart', 'dart');
      await fs.writeFile('src/file.py', 'py');
      await fs.writeFile('src/file.rs', 'rs');

      const metrics = await analyzeFileComplexity('src');

      expect(metrics.totalFiles).toBe(7);
    });
  });

  describe('parseDependencies', () => {
    describe('Node.js / React / Next.js', () => {
      it('should parse package.json dependencies', async () => {
        await fs.writeJson('package.json', {
          dependencies: {
            react: '^18.0.0',
            lodash: '^4.17.21',
          },
          devDependencies: {
            jest: '^29.0.0',
          },
        });

        const deps = await parseDependencies('Node.js');

        expect(deps.dependencyCount).toBe(2);
        expect(deps.dependencies.react).toBe('^18.0.0');
        expect(deps.dependencies.lodash).toBe('^4.17.21');
        expect(deps.devDependencyCount).toBe(1);
        expect(deps.devDependencies.jest).toBe('^29.0.0');
      });

      it('should handle missing dependencies section', async () => {
        await fs.writeJson('package.json', {
          name: 'test',
        });

        const deps = await parseDependencies('React');

        expect(deps.dependencyCount).toBe(0);
        expect(deps.devDependencyCount).toBe(0);
      });

      it('should handle missing package.json', async () => {
        const deps = await parseDependencies('Next.js');

        expect(deps.dependencyCount).toBe(0);
        expect(deps.devDependencyCount).toBe(0);
      });
    });

    describe('Flutter', () => {
      it('should parse pubspec.yaml dependencies', async () => {
        await fs.writeFile(
          'pubspec.yaml',
          `dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.0

dev_dependencies:
  flutter_test:
    sdk: flutter`
        );

        const deps = await parseDependencies('Flutter');

        expect(deps.dependencyCount).toBe(2); // flutter + http
        expect(deps.devDependencyCount).toBe(1); // flutter_test
      });

      it('should handle missing pubspec.yaml', async () => {
        const deps = await parseDependencies('Flutter');

        expect(deps.dependencyCount).toBe(0);
      });
    });

    describe('Python', () => {
      it('should parse requirements.txt', async () => {
        await fs.writeFile(
          'requirements.txt',
          `flask>=2.0.0
requests==2.28.0
numpy<1.20.0`
        );

        const deps = await parseDependencies('Python');

        expect(deps.dependencyCount).toBe(3);
        expect(deps.dependencies.flask).toBe('latest');
        expect(deps.dependencies.requests).toBe('latest');
        expect(deps.dependencies.numpy).toBe('latest');
      });

      it('should skip comment lines in requirements.txt', async () => {
        await fs.writeFile(
          'requirements.txt',
          `# This is a comment
flask>=2.0.0
# Another comment
requests==2.28.0`
        );

        const deps = await parseDependencies('Python');

        expect(deps.dependencyCount).toBe(2);
      });

      it('should handle missing requirements.txt', async () => {
        const deps = await parseDependencies('Python');

        expect(deps.dependencyCount).toBe(0);
      });
    });

    describe('Rust', () => {
      it('should parse Cargo.toml dependencies', async () => {
        await fs.writeFile(
          'Cargo.toml',
          `[dependencies]
serde = "1.0"
tokio = { version = "1.0", features = ["full"] }

[dev-dependencies]
criterion = "0.3"`
        );

        const deps = await parseDependencies('Rust');

        expect(deps.dependencyCount).toBe(2); // serde + tokio
        expect(deps.devDependencyCount).toBe(1); // criterion
      });

      it('should handle missing Cargo.toml', async () => {
        const deps = await parseDependencies('Rust');

        expect(deps.dependencyCount).toBe(0);
      });
    });
  });

  describe('detectFrameworkVersion', () => {
    it('should detect React version from package.json', async () => {
      await fs.writeJson('package.json', {
        dependencies: {
          react: '^18.2.0',
        },
      });

      const version = await detectFrameworkVersion('React');

      expect(version).toBe('18.2.0'); // Stripped ^ prefix
    });

    it('should detect Next.js version from package.json', async () => {
      await fs.writeJson('package.json', {
        dependencies: {
          next: '~14.0.0',
        },
      });

      const version = await detectFrameworkVersion('Next.js');

      expect(version).toBe('14.0.0'); // Stripped ~ prefix
    });

    it('should return Unknown for missing package.json', async () => {
      const version = await detectFrameworkVersion('Node.js');

      expect(version).toBe('Unknown');
    });

    it('should detect Flutter SDK version from pubspec.yaml', async () => {
      await fs.writeFile('pubspec.yaml', 'environment:\n  sdk: ">=3.0.0 <4.0.0"');

      const version = await detectFrameworkVersion('Flutter');

      expect(version).toBe('3.0.0');
    });

    it('should return Unknown for generic frameworks', async () => {
      const version = await detectFrameworkVersion('Generic');

      expect(version).toBe('Unknown');
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
      await fs.writeFile('pubspec.yaml', '');

      const pm = await detectPackageManager();

      expect(pm).toBe('pub');
    });

    it('should detect pip from requirements.txt', async () => {
      await fs.writeFile('requirements.txt', '');

      const pm = await detectPackageManager();

      expect(pm).toBe('pip');
    });

    it('should detect cargo from Cargo.toml', async () => {
      await fs.writeFile('Cargo.toml', '');

      const pm = await detectPackageManager();

      expect(pm).toBe('cargo');
    });

    it('should return Unknown when no package manager files found', async () => {
      const pm = await detectPackageManager();

      expect(pm).toBe('Unknown');
    });

    it('should prioritize pnpm over yarn and npm', async () => {
      await fs.writeFile('package-lock.json', '{}');
      await fs.writeFile('yarn.lock', '');
      await fs.writeFile('pnpm-lock.yaml', '');

      const pm = await detectPackageManager();

      expect(pm).toBe('pnpm');
    });
  });
});
