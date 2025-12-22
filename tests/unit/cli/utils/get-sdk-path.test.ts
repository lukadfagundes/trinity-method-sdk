/**
 * Unit Tests - get-sdk-path.ts
 *
 * Tests SDK path resolution for both development and production environments
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import {
  getSDKPath,
  getTemplatesPath,
  getPackageJsonPath,
} from '../../../../src/cli/utils/get-sdk-path.js';

describe('get-sdk-path', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    testDir = path.join(process.cwd(), `.tmp-test-sdk-path-${Date.now()}`);
    await fs.ensureDir(testDir);
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(testDir);
  });

  describe('getSDKPath', () => {
    it('should return current directory when dist/templates exists (SDK root)', async () => {
      // Create dist/templates structure (simulates SDK root)
      await fs.ensureDir('dist/templates');

      const sdkPath = await getSDKPath();

      expect(sdkPath).toBe(process.cwd());
    });

    it('should return node_modules path when dist/templates does not exist (production)', async () => {
      // No dist/templates → assumes installed package

      const sdkPath = await getSDKPath();

      expect(sdkPath).toBe(path.join(process.cwd(), 'node_modules', '@trinity-method', 'sdk'));
    });

    it('should handle absolute paths correctly', async () => {
      await fs.ensureDir('dist/templates');

      const sdkPath = await getSDKPath();

      expect(path.isAbsolute(sdkPath)).toBe(true);
    });
  });

  describe('getTemplatesPath', () => {
    it('should return templates path in SDK root', async () => {
      await fs.ensureDir('dist/templates');

      const templatesPath = await getTemplatesPath();

      expect(templatesPath).toBe(path.join(process.cwd(), 'dist/templates'));
    });

    it('should return templates path in node_modules when not in SDK root', async () => {
      const templatesPath = await getTemplatesPath();

      expect(templatesPath).toBe(
        path.join(process.cwd(), 'node_modules', '@trinity-method', 'sdk', 'dist/templates')
      );
    });

    it('should handle path separators correctly', async () => {
      await fs.ensureDir('dist/templates');

      const templatesPath = await getTemplatesPath();

      // Use path.join to handle Windows vs Unix separators
      expect(templatesPath.endsWith(path.join('dist', 'templates'))).toBe(true);
    });
  });

  describe('getPackageJsonPath', () => {
    it('should return package.json path in SDK root', async () => {
      await fs.ensureDir('dist/templates');

      const packageJsonPath = await getPackageJsonPath();

      expect(packageJsonPath).toBe(path.join(process.cwd(), 'package.json'));
    });

    it('should return package.json path in node_modules when not in SDK root', async () => {
      const packageJsonPath = await getPackageJsonPath();

      expect(packageJsonPath).toBe(
        path.join(process.cwd(), 'node_modules', '@trinity-method', 'sdk', 'package.json')
      );
    });

    it('should have .json extension', async () => {
      await fs.ensureDir('dist/templates');

      const packageJsonPath = await getPackageJsonPath();

      expect(path.extname(packageJsonPath)).toBe('.json');
    });
  });

  describe('Cross-Environment Compatibility', () => {
    it('should work in development environment (with dist/templates)', async () => {
      await fs.ensureDir('dist/templates');
      await fs.writeFile('package.json', '{"name": "test"}');

      const sdkPath = await getSDKPath();
      const templatesPath = await getTemplatesPath();
      const packageJsonPath = await getPackageJsonPath();

      expect(sdkPath).toBe(process.cwd());
      expect(templatesPath).toBe(path.join(process.cwd(), 'dist/templates'));
      expect(packageJsonPath).toBe(path.join(process.cwd(), 'package.json'));
    });

    it('should work in production environment (node_modules)', async () => {
      // Simulate production: no dist/templates in cwd
      const sdkPath = await getSDKPath();
      const templatesPath = await getTemplatesPath();
      const packageJsonPath = await getPackageJsonPath();

      const expectedPath = path.join(process.cwd(), 'node_modules', '@trinity-method', 'sdk');
      expect(sdkPath).toBe(expectedPath);
      expect(templatesPath).toBe(path.join(expectedPath, 'dist/templates'));
      expect(packageJsonPath).toBe(path.join(expectedPath, 'package.json'));
    });

    it('should return consistent paths across multiple calls', async () => {
      await fs.ensureDir('dist/templates');

      const path1 = await getSDKPath();
      const path2 = await getSDKPath();
      const path3 = await getSDKPath();

      expect(path1).toBe(path2);
      expect(path2).toBe(path3);
    });
  });

  describe('Path Resolution', () => {
    it('should use process.cwd() as base for SDK root detection', async () => {
      const originalCwd = process.cwd();
      await fs.ensureDir('dist/templates');

      const sdkPath = await getSDKPath();

      expect(sdkPath).toContain(originalCwd);
    });

    it('should construct node_modules path correctly', async () => {
      const sdkPath = await getSDKPath();

      expect(sdkPath.includes('node_modules')).toBe(true);
      expect(sdkPath.includes('@trinity-method')).toBe(true);
      expect(sdkPath.includes('sdk')).toBe(true);
    });

    it('should handle nested directory structures', async () => {
      await fs.ensureDir('dist/templates/nested/deep');

      await getSDKPath();
      const templatesPath = await getTemplatesPath();

      expect(await fs.pathExists(path.join(templatesPath, 'nested/deep'))).toBe(true);
    });
  });
});
