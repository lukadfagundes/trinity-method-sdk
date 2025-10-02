import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import {
  collectCodebaseMetrics,
  countPattern,
  analyzeFileComplexity,
  parseDependencies,
  detectFrameworkVersion,
  detectPackageManager
} from '../../src/utils/codebase-metrics.js';

describe('codebase-metrics', () => {
  const testDir = path.join(process.cwd(), 'test-temp-metrics');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    const originalDir = path.join(process.cwd(), '../..');
    process.chdir(originalDir);
    await fs.remove(testDir);
  });

  describe('countPattern', () => {
    it('should count TODO comments in JavaScript files', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      const jsFile = `
// TODO: Fix this bug
function test() {
  // TODO: Refactor
  console.log('test');
}
`;
      await fs.writeFile(path.join(testSrc, 'test.js'), jsFile);

      const result = await countPattern(testSrc, /\/\/\s*TODO/gi);
      expect(result).toBe(2);
    });

    it('should count FIXME comments', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      const jsFile = `
// FIXME: This is broken
function test() {
  // FIXME: Urgent fix needed
}
`;
      await fs.writeFile(path.join(testSrc, 'test.js'), jsFile);

      const result = await countPattern(testSrc, /\/\/\s*FIXME/gi);
      expect(result).toBe(2);
    });

    it('should count HACK comments', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      const jsFile = `
// HACK: Temporary workaround
function test() {
  // HACK: Remove this later
}
`;
      await fs.writeFile(path.join(testSrc, 'test.js'), jsFile);

      const result = await countPattern(testSrc, /\/\/\s*HACK/gi);
      expect(result).toBe(2);
    });

    it('should count console.log statements', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      const jsFile = `
console.log('test 1');
function test() {
  console.log('test 2');
  console.warn('warning');
  console.error('error');
}
`;
      await fs.writeFile(path.join(testSrc, 'test.js'), jsFile);

      const result = await countPattern(testSrc, /console\.(log|warn|error)/gi);
      expect(result).toBe(4);
    });

    it('should ignore node_modules directory', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);
      await fs.ensureDir(path.join(testSrc, 'node_modules'));

      await fs.writeFile(path.join(testSrc, 'node_modules', 'test.js'), '// TODO: Should be ignored');
      await fs.writeFile(path.join(testSrc, 'app.js'), '// TODO: Should be counted');

      const result = await countPattern(testSrc, /\/\/\s*TODO/gi);
      expect(result).toBe(1);
    });

    it('should handle non-existent directory', async () => {
      const result = await countPattern('/non/existent/path', /TODO/gi);
      expect(result).toBe(0);
    });

    it('should handle Python comments', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      const pyFile = `
# TODO: Implement feature
def test():
    # TODO: Add validation
    pass
`;
      await fs.writeFile(path.join(testSrc, 'test.py'), pyFile);

      const result = await countPattern(testSrc, /#\s*TODO/gi);
      expect(result).toBe(2);
    });
  });

  describe('analyzeFileComplexity', () => {
    it('should categorize files by line count', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      // Create files of different sizes
      await fs.writeFile(path.join(testSrc, 'small.js'), 'const x = 1;\n'.repeat(100));
      await fs.writeFile(path.join(testSrc, 'medium.js'), 'const x = 1;\n'.repeat(600));
      await fs.writeFile(path.join(testSrc, 'large.js'), 'const x = 1;\n'.repeat(1200));
      await fs.writeFile(path.join(testSrc, 'huge.js'), 'const x = 1;\n'.repeat(3500));

      const result = await analyzeFileComplexity(testSrc);

      expect(result.filesOver500).toBe(3); // medium, large, huge
      expect(result.filesOver1000).toBe(2); // large, huge
      expect(result.filesOver3000).toBe(1); // huge
      expect(result.totalFiles).toBe(4);
    });

    it('should calculate average file length', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      await fs.writeFile(path.join(testSrc, 'file1.js'), 'const x = 1;\n'.repeat(100));
      await fs.writeFile(path.join(testSrc, 'file2.js'), 'const x = 1;\n'.repeat(200));

      const result = await analyzeFileComplexity(testSrc);

      // Average should be around 150 (files have 101 and 201 lines including final newline)
      expect(result.avgFileLength).toBeGreaterThanOrEqual(150);
      expect(result.avgFileLength).toBeLessThanOrEqual(152);
    });

    it('should handle empty directory', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      const result = await analyzeFileComplexity(testSrc);

      expect(result.totalFiles).toBe(0);
      expect(result.filesOver500).toBe(0);
      expect(result.filesOver1000).toBe(0);
      expect(result.filesOver3000).toBe(0);
      expect(result.avgFileLength).toBe(0);
    });

    it('should identify largest files', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      await fs.writeFile(path.join(testSrc, 'small.js'), 'const x = 1;\n'.repeat(50));
      await fs.writeFile(path.join(testSrc, 'big.js'), 'const x = 1;\n'.repeat(500));

      const result = await analyzeFileComplexity(testSrc);

      expect(result.largestFiles.length).toBeGreaterThan(0);
      expect(result.largestFiles[0].file).toBe('big.js');
      expect(result.largestFiles[0].lines).toBeGreaterThan(result.largestFiles[1].lines);
    });

    it('should handle non-existent directory', async () => {
      const result = await analyzeFileComplexity('/non/existent/path');

      expect(result.totalFiles).toBe(0);
      expect(result.filesOver500).toBe(0);
    });
  });

  describe('parseDependencies', () => {
    it('should parse Node.js dependencies from package.json', async () => {
      await fs.writeJson('package.json', {
        dependencies: {
          express: '^4.18.0',
          lodash: '^4.17.21'
        },
        devDependencies: {
          jest: '^29.0.0',
          eslint: '^8.0.0'
        }
      });

      const result = await parseDependencies('Node.js');

      expect(result.dependencyCount).toBe(2);
      expect(result.devDependencyCount).toBe(2);
      expect(result.dependencies.express).toBe('^4.18.0');
      expect(result.devDependencies.jest).toBe('^29.0.0');
    });

    it('should handle missing package.json', async () => {
      const result = await parseDependencies('Node.js');

      expect(result.dependencyCount).toBe(0);
      expect(result.devDependencyCount).toBe(0);
    });

    it('should parse Python dependencies from requirements.txt', async () => {
      await fs.writeFile('requirements.txt', `flask==2.3.0
requests>=2.28.0
# Comment line
django<5.0.0`);

      const result = await parseDependencies('Python');

      expect(result.dependencyCount).toBe(3);
      expect(result.dependencies.flask).toBe('latest');
      expect(result.dependencies.requests).toBe('latest');
      expect(result.dependencies.django).toBe('latest');
    });

    it('should parse Flutter dependencies from pubspec.yaml', async () => {
      await fs.writeFile('pubspec.yaml', `dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.2
  http: ^0.13.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0`);

      const result = await parseDependencies('Flutter');

      expect(result.dependencyCount).toBeGreaterThan(0);
      expect(result.devDependencyCount).toBeGreaterThan(0);
    });

    it('should parse Rust dependencies from Cargo.toml', async () => {
      await fs.writeFile('Cargo.toml', `[dependencies]
serde = "1.0"
tokio = "1.0"

[dev-dependencies]
criterion = "0.5"
`);

      const result = await parseDependencies('Rust');

      expect(result.dependencyCount).toBeGreaterThan(0);
      expect(result.devDependencyCount).toBeGreaterThan(0);
    });
  });

  describe('detectPackageManager', () => {
    it('should detect npm', async () => {
      await fs.writeFile('package-lock.json', '{}');

      const result = await detectPackageManager();

      expect(result).toBe('npm');
    });

    it('should detect yarn', async () => {
      await fs.writeFile('yarn.lock', '');

      const result = await detectPackageManager();

      expect(result).toBe('yarn');
    });

    it('should detect pnpm', async () => {
      await fs.writeFile('pnpm-lock.yaml', '');

      const result = await detectPackageManager();

      expect(result).toBe('pnpm');
    });

    it('should detect pub for Flutter', async () => {
      await fs.writeFile('pubspec.yaml', 'name: test');

      const result = await detectPackageManager();

      expect(result).toBe('pub');
    });

    it('should detect pip for Python', async () => {
      await fs.writeFile('requirements.txt', 'flask==2.3.0');

      const result = await detectPackageManager();

      expect(result).toBe('pip');
    });

    it('should detect cargo for Rust', async () => {
      await fs.writeFile('Cargo.toml', '[package]');

      const result = await detectPackageManager();

      expect(result).toBe('cargo');
    });

    it('should return Unknown for unrecognized project', async () => {
      const result = await detectPackageManager();

      expect(result).toBe('Unknown');
    });
  });

  describe('collectCodebaseMetrics (integration)', () => {
    it('should collect all metrics for a Node.js project', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      // Create a mini project structure
      await fs.writeFile(path.join(testSrc, 'app.js'), `
// TODO: Implement feature
console.log('app running');
${'const x = 1;\n'.repeat(600)}
`);

      await fs.writeJson('package.json', {
        dependencies: { express: '^4.18.0' },
        devDependencies: { jest: '^29.0.0' }
      });

      const result = await collectCodebaseMetrics(testSrc, 'Node.js');

      expect(result.todoComments).toBeGreaterThan(0);
      expect(result.consoleStatements).toBeGreaterThan(0);
      expect(result.totalFiles).toBeGreaterThan(0);
      expect(result.dependencyCount).toBe(1);
      expect(result.devDependencyCount).toBe(1);
    });

    it('should handle empty project gracefully', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      const result = await collectCodebaseMetrics(testSrc, 'Node.js');

      expect(result.todoCount).toBe(0);
      expect(result.consoleStatements).toBe(0);
      expect(result.totalFiles).toBe(0);
    });

    it('should calculate todoCount as sum of TODO, FIXME, HACK', async () => {
      const testSrc = path.join(testDir, 'src');
      await fs.ensureDir(testSrc);

      await fs.writeFile(path.join(testSrc, 'app.js'), `
// TODO: Task 1
// FIXME: Bug 1
// HACK: Workaround 1
`);

      const result = await collectCodebaseMetrics(testSrc, 'Node.js');

      expect(result.todoComments).toBe(1);
      expect(result.fixmeComments).toBe(1);
      expect(result.hackComments).toBe(1);
      expect(result.todoCount).toBe(3);
    });
  });
});
