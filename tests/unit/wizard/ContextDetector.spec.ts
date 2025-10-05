/**
 * Context Detector Unit Tests
 *
 * Tests automatic codebase detection functionality
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { ContextDetector } from '../../../src/wizard/ContextDetector';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('ContextDetector', () => {
  const testDir = './test-context-detector';
  let detector: ContextDetector;

  beforeAll(async () => {
    detector = new ContextDetector(testDir);
    await fs.mkdir(testDir, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('Framework Detection', () => {
    it('should detect Next.js from package.json', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ dependencies: { next: '^14.0.0' } })
      );

      const framework = await detector.detectFramework();
      expect(framework).toBe('Next.js');
    });

    it('should detect React from package.json', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ dependencies: { react: '^18.0.0' } })
      );

      const framework = await detector.detectFramework();
      expect(framework).toBe('React');
    });

    it('should return Unknown for unrecognized frameworks', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ dependencies: {} })
      );

      const framework = await detector.detectFramework();
      expect(framework).toBe('Unknown');
    });
  });

  describe('Language Detection', () => {
    it('should detect TypeScript from tsconfig.json', async () => {
      await fs.writeFile(
        path.join(testDir, 'tsconfig.json'),
        JSON.stringify({ compilerOptions: {} })
      );

      const language = await detector.detectLanguage();
      expect(language).toBe('TypeScript');
    });

    it('should detect JavaScript from .js files', async () => {
      await fs.writeFile(path.join(testDir, 'index.js'), '');

      const language = await detector.detectLanguage();
      expect(language).toBe('JavaScript');
    });
  });

  describe('Testing Framework Detection', () => {
    it('should detect Jest from package.json', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({ devDependencies: { jest: '^29.0.0' } })
      );

      const testingFramework = await detector.detectTestingFramework();
      expect(testingFramework).toBe('Jest');
    });
  });

  describe('Context Detection', () => {
    it('should detect complete context', async () => {
      await fs.writeFile(
        path.join(testDir, 'package.json'),
        JSON.stringify({
          dependencies: { next: '^14.0.0', react: '^18.0.0' },
          devDependencies: { jest: '^29.0.0', typescript: '^5.0.0' },
        })
      );
      await fs.writeFile(path.join(testDir, 'tsconfig.json'), JSON.stringify({}));

      const context = await detector.detectContext();

      expect(context.framework).toBe('Next.js');
      expect(context.language).toBe('TypeScript');
      expect(context.testingFramework).toBe('Jest');
      expect(context.dependencies.length).toBeGreaterThan(0);
    });
  });
});
