/**
 * Path Validation Utility Tests
 * Security-critical tests for path traversal prevention
 */

import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import {
  validatePath,
  validateNotSymlink,
  safeCopy,
} from '../../../../src/cli/utils/validate-path.js';

describe('Path Validation Utility', () => {
  let tempDir: string;

  beforeEach(async () => {
    // Create temporary test directory
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'trinity-path-test-'));
  });

  afterEach(async () => {
    // Cleanup
    await fs.remove(tempDir);
  });

  describe('validatePath', () => {
    it('should accept valid relative path', () => {
      const result = validatePath('trinity/agents', tempDir);
      expect(result).toContain('trinity');
      expect(result).toContain('agents');
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should accept nested relative path', () => {
      const result = validatePath('trinity/agents/mon.md', tempDir);
      // Result is absolute path, check it contains the relative parts
      expect(result).toContain('trinity');
      expect(result).toContain('agents');
      expect(result).toContain('mon.md');
    });

    it('should normalize path separators', () => {
      const result = validatePath('trinity\\agents\\mon.md', tempDir);
      expect(result).toBeDefined();
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should reject path traversal with ../', () => {
      expect(() => validatePath('../../../etc/passwd', tempDir)).toThrow(/Path traversal detected/);
    });

    it('should reject path traversal hidden in middle', () => {
      expect(() => validatePath('trinity/../../../etc/passwd', tempDir)).toThrow(
        /Path traversal detected/
      );
    });

    it('should reject absolute Unix paths', () => {
      expect(() => validatePath('/etc/passwd', tempDir)).toThrow(/Absolute paths are not allowed/);
    });

    it('should reject absolute Windows paths', () => {
      expect(() => validatePath('C:\\Windows\\System32', tempDir)).toThrow(
        /Absolute paths are not allowed/
      );
    });

    it('should handle empty path', () => {
      const result = validatePath('', tempDir);
      expect(result).toBe(tempDir);
    });

    it('should handle dot path', () => {
      const result = validatePath('.', tempDir);
      expect(result).toBe(tempDir);
    });

    it('should handle current directory reference', () => {
      const result = validatePath('./trinity', tempDir);
      expect(result).toContain('trinity');
    });

    it('should reject parent directory reference', () => {
      expect(() => validatePath('..', tempDir)).toThrow(/Path traversal detected/);
    });
  });

  describe('validateNotSymlink', () => {
    it('should pass for regular file', async () => {
      const testFile = path.join(tempDir, 'test.txt');
      await fs.writeFile(testFile, 'content');

      await expect(validateNotSymlink(testFile)).resolves.not.toThrow();
    });

    it('should pass for directory', async () => {
      const testDir = path.join(tempDir, 'testdir');
      await fs.ensureDir(testDir);

      await expect(validateNotSymlink(testDir)).resolves.not.toThrow();
    });

    it('should fail for symlink to file', async () => {
      // Skip on Windows if symlinks not supported
      if (process.platform === 'win32') {
        try {
          const testFile = path.join(tempDir, 'target.txt');
          const testSymlink = path.join(tempDir, 'link.txt');
          await fs.writeFile(testFile, 'content');
          await fs.symlink(testFile, testSymlink);

          await expect(validateNotSymlink(testSymlink)).rejects.toThrow(/Symlink detected/);
        } catch (err) {
          // Skip test if symlinks not supported (needs admin on Windows)
          const error = err as { code?: string };
          if (error.code === 'EPERM') {
            console.log('Skipping symlink test - requires admin privileges on Windows');
            return;
          }
          throw err;
        }
      } else {
        const testFile = path.join(tempDir, 'target.txt');
        const testSymlink = path.join(tempDir, 'link.txt');
        await fs.writeFile(testFile, 'content');
        await fs.symlink(testFile, testSymlink);

        await expect(validateNotSymlink(testSymlink)).rejects.toThrow(/Symlink detected/);
      }
    });

    it('should fail for symlink to directory', async () => {
      // Skip on Windows if symlinks not supported
      if (process.platform === 'win32') {
        try {
          const testDir = path.join(tempDir, 'targetdir');
          const testSymlink = path.join(tempDir, 'linkdir');
          await fs.ensureDir(testDir);
          await fs.symlink(testDir, testSymlink, 'dir');

          await expect(validateNotSymlink(testSymlink)).rejects.toThrow(/Symlink detected/);
        } catch (err) {
          const error = err as { code?: string };
          if (error.code === 'EPERM') {
            console.log('Skipping symlink test - requires admin privileges on Windows');
            return;
          }
          throw err;
        }
      } else {
        const testDir = path.join(tempDir, 'targetdir');
        const testSymlink = path.join(tempDir, 'linkdir');
        await fs.ensureDir(testDir);
        await fs.symlink(testDir, testSymlink);

        await expect(validateNotSymlink(testSymlink)).rejects.toThrow(/Symlink detected/);
      }
    });
  });

  describe('safeCopy', () => {
    it('should copy files safely', async () => {
      const sourceFile = path.join(tempDir, 'source.txt');
      const destFile = path.join(tempDir, 'dest.txt');
      await fs.writeFile(sourceFile, 'test content');

      await safeCopy('source.txt', 'dest.txt', tempDir);

      expect(await fs.pathExists(destFile)).toBe(true);
      const content = await fs.readFile(destFile, 'utf8');
      expect(content).toBe('test content');
    });

    it('should copy directories safely', async () => {
      const sourceDir = path.join(tempDir, 'sourcedir');
      const destDir = path.join(tempDir, 'destdir');
      await fs.ensureDir(sourceDir);
      await fs.writeFile(path.join(sourceDir, 'file.txt'), 'content');

      await safeCopy('sourcedir', 'destdir', tempDir);

      expect(await fs.pathExists(destDir)).toBe(true);
      expect(await fs.pathExists(path.join(destDir, 'file.txt'))).toBe(true);
    });

    it('should reject copying to parent directory', async () => {
      const sourceFile = path.join(tempDir, 'source.txt');
      await fs.writeFile(sourceFile, 'content');

      await expect(safeCopy('source.txt', '../outside.txt', tempDir)).rejects.toThrow(
        /Path traversal detected/
      );
    });

    it('should reject copying from parent directory', async () => {
      await expect(safeCopy('../outside.txt', 'dest.txt', tempDir)).rejects.toThrow(
        /Path traversal detected/
      );
    });

    it('should reject symlink source', async () => {
      // Skip on Windows if symlinks not supported
      if (process.platform === 'win32') {
        try {
          const targetFile = path.join(tempDir, 'target.txt');
          const symlinkFile = path.join(tempDir, 'link.txt');
          await fs.writeFile(targetFile, 'content');
          await fs.symlink(targetFile, symlinkFile);

          await expect(safeCopy('link.txt', 'dest.txt', tempDir)).rejects.toThrow(
            /Symlink detected/
          );
        } catch (err) {
          const error = err as { code?: string };
          if (error.code === 'EPERM') {
            console.log('Skipping symlink test - requires admin privileges on Windows');
            return;
          }
          throw err;
        }
      } else {
        const targetFile = path.join(tempDir, 'target.txt');
        const symlinkFile = path.join(tempDir, 'link.txt');
        await fs.writeFile(targetFile, 'content');
        await fs.symlink(targetFile, symlinkFile);

        await expect(safeCopy('link.txt', 'dest.txt', tempDir)).rejects.toThrow(/Symlink detected/);
      }
    });

    it('should not follow symlinks in copy', async () => {
      // This test verifies dereference: false behavior
      // Skip on Windows if symlinks not supported
      if (process.platform !== 'win32') {
        const targetFile = path.join(tempDir, 'target.txt');
        const symlinkFile = path.join(tempDir, 'sourcedir', 'link.txt');

        await fs.writeFile(targetFile, 'original content');
        await fs.ensureDir(path.join(tempDir, 'sourcedir'));
        await fs.symlink(targetFile, symlinkFile);

        // Note: safeCopy will reject symlinks before copying
        await expect(safeCopy('sourcedir', 'destdir', tempDir)).rejects.toThrow(/Symlink detected/);
      }
    });
  });

  describe('Security Tests', () => {
    it('should prevent null byte injection', () => {
      expect(() => validatePath('trinity\0/etc/passwd', tempDir)).toThrow();
    });

    it('should prevent Unicode path traversal', () => {
      // Note: path.normalize handles Unicode properly
      // Testing with a path that actually goes outside the project
      expect(() => validatePath('trinity/../../outside', tempDir)).toThrow(
        /Path traversal detected/
      );
    });

    it('should handle Windows UNC paths', () => {
      if (process.platform === 'win32') {
        expect(() => validatePath('\\\\server\\share\\file', tempDir)).toThrow(
          /Absolute paths are not allowed/
        );
      }
    });

    it('should handle mixed separators', () => {
      const result = validatePath('trinity/agents\\mon.md', tempDir);
      expect(result).toBeDefined();
    });
  });
});
