import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectStack } from '../../src/utils/detect-stack.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('detectStack', () => {
  const testDir = path.join(__dirname, '..', '..', 'test-temp');

  beforeEach(async () => {
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  it('should detect Node.js React project', async () => {
    const packageJson = {
      name: 'test-react-app',
      dependencies: {
        react: '^18.0.0',
      },
    };
    await fs.writeJson(path.join(testDir, 'package.json'), packageJson);
    await fs.ensureDir(path.join(testDir, 'src'));

    const result = await detectStack(testDir);

    expect(result.language).toBe('JavaScript/TypeScript');
    expect(result.framework).toBe('React');
    expect(result.sourceDir).toBe('src');
    expect(result.packageManager).toBe('npm');
  });

  it('should detect Vue.js project', async () => {
    const packageJson = {
      name: 'test-vue-app',
      dependencies: {
        vue: '^3.0.0',
      },
    };
    await fs.writeJson(path.join(testDir, 'package.json'), packageJson);

    const result = await detectStack(testDir);

    expect(result.language).toBe('JavaScript/TypeScript');
    expect(result.framework).toBe('Vue');
  });

  it('should detect Angular project', async () => {
    const packageJson = {
      name: 'test-angular-app',
      dependencies: {
        '@angular/core': '^17.0.0',
      },
    };
    await fs.writeJson(path.join(testDir, 'package.json'), packageJson);
    await fs.ensureDir(path.join(testDir, 'src', 'app'));

    const result = await detectStack(testDir);

    expect(result.language).toBe('JavaScript/TypeScript');
    expect(result.framework).toBe('Angular');
    expect(result.sourceDir).toBe('src/app');
  });

  it('should detect Flutter project', async () => {
    const pubspec = `name: test_flutter_app
description: A test Flutter app
version: 1.0.0

dependencies:
  flutter:
    sdk: flutter
`;
    await fs.writeFile(path.join(testDir, 'pubspec.yaml'), pubspec);
    await fs.ensureDir(path.join(testDir, 'lib'));

    const result = await detectStack(testDir);

    expect(result.language).toBe('Dart');
    expect(result.framework).toBe('Flutter');
    expect(result.sourceDir).toBe('lib');
  });

  it('should detect Python Flask project', async () => {
    const requirements = 'flask==2.3.0\nflask-sqlalchemy==3.0.0';
    await fs.writeFile(path.join(testDir, 'requirements.txt'), requirements);

    const result = await detectStack(testDir);

    expect(result.language).toBe('Python');
    expect(result.framework).toBe('Flask');
  });

  it('should detect Rust project', async () => {
    const cargoToml = `[package]
name = "test-rust-app"
version = "0.1.0"

[dependencies]
`;
    await fs.writeFile(path.join(testDir, 'Cargo.toml'), cargoToml);
    await fs.ensureDir(path.join(testDir, 'src'));

    const result = await detectStack(testDir);

    expect(result.language).toBe('Rust');
    expect(result.framework).toBe('Generic');
    expect(result.sourceDir).toBe('src');
  });

  it('should detect Go project', async () => {
    const goMod = `module github.com/test/test-app

go 1.21
`;
    await fs.writeFile(path.join(testDir, 'go.mod'), goMod);

    const result = await detectStack(testDir);

    expect(result.language).toBe('Go');
    expect(result.framework).toBe('Generic');
  });

  it('should handle unknown project type', async () => {
    const result = await detectStack(testDir);

    expect(result.language).toBe('Unknown');
    expect(result.framework).toBe('Generic');
    expect(result.sourceDir).toBe('src');
  });
});
