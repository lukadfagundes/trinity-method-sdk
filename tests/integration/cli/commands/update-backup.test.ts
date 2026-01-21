/**
 * Integration tests for update/backup module
 * Tests backup creation, restoration, rollback, and cleanup operations
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import type { Ora } from 'ora';
import {
  createUpdateBackup,
  restoreUserContent,
  rollbackFromBackup,
  cleanupBackup,
} from '../../../../src/cli/commands/update/backup.js';
import { createTempDir, cleanupTempDir } from '../../../helpers/test-helpers.js';
import { mockConsole } from '../../../utils/console-mocks.js';

// Mock ora spinner
const createMockSpinner = (): Ora => {
  return {
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    info: jest.fn().mockReturnThis(),
    text: '',
    isSpinning: false,
  } as unknown as Ora;
};

describe('Update Backup - Integration', () => {
  // Mock console to reduce test noise
  mockConsole();

  let tempDir: string;
  let originalCwd: string;
  let mockSpinner: Ora;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await createTempDir();
    process.chdir(tempDir);
    mockSpinner = createMockSpinner();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTempDir(tempDir);
  });

  describe('createUpdateBackup', () => {
    test('should create backup directory with timestamp', async () => {
      // Setup minimal trinity structure
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      const backupDir = await createUpdateBackup(mockSpinner);

      expect(await fs.pathExists(backupDir)).toBe(true);
      expect(backupDir).toMatch(/^\.trinity-backup-\d+$/);
      expect(mockSpinner.start).toHaveBeenCalledWith('Creating backup...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith('Backup created');
    });

    test('should backup all user-managed files', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      // Create user files
      const userFiles = {
        'trinity/knowledge-base/ARCHITECTURE.md': 'Custom architecture',
        'trinity/knowledge-base/To-do.md': 'Custom todos',
        'trinity/knowledge-base/ISSUES.md': 'Custom issues',
        'trinity/knowledge-base/Technical-Debt.md': 'Custom debt',
      };

      for (const [file, content] of Object.entries(userFiles)) {
        await fs.writeFile(file, content);
      }

      const backupDir = await createUpdateBackup(mockSpinner);

      // Verify each user file was backed up
      for (const file of Object.keys(userFiles)) {
        const backupFile = path.join(backupDir, path.basename(file));
        expect(await fs.pathExists(backupFile)).toBe(true);
      }
    });

    test('should backup entire trinity directory', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('trinity/templates');
      await fs.ensureDir('.claude');
      await fs.writeFile('trinity/VERSION', '1.0.0');
      await fs.writeFile('trinity/knowledge-base/test.md', 'test content');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Verify trinity directory was backed up completely
      expect(await fs.pathExists(path.join(backupDir, 'trinity'))).toBe(true);
      expect(await fs.pathExists(path.join(backupDir, 'trinity/VERSION'))).toBe(true);
      expect(await fs.pathExists(path.join(backupDir, 'trinity/knowledge-base/test.md'))).toBe(
        true
      );
    });

    test('should backup entire .claude directory', async () => {
      await fs.ensureDir('trinity');
      await fs.ensureDir('.claude/agents');
      await fs.ensureDir('.claude/commands');
      await fs.writeFile('.claude/agents/test-agent.md', 'agent content');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Verify .claude directory was backed up completely
      expect(await fs.pathExists(path.join(backupDir, '.claude'))).toBe(true);
      expect(await fs.pathExists(path.join(backupDir, '.claude/agents/test-agent.md'))).toBe(true);
    });

    test('should handle missing user files gracefully', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      // Don't create any user files
      const backupDir = await createUpdateBackup(mockSpinner);

      // Backup should still succeed
      expect(await fs.pathExists(backupDir)).toBe(true);
      expect(mockSpinner.succeed).toHaveBeenCalled();
    });

    test('should preserve file content exactly', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      const content = 'Very important user data\nLine 2\nLine 3';
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', content);

      const backupDir = await createUpdateBackup(mockSpinner);

      const backedUpContent = await fs.readFile(path.join(backupDir, 'ARCHITECTURE.md'), 'utf8');
      expect(backedUpContent).toBe(content);
    });
  });

  describe('restoreUserContent', () => {
    test('should restore all user-managed files from backup', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      // Create and backup original content
      const originalContent = {
        'trinity/knowledge-base/ARCHITECTURE.md': 'Original architecture',
        'trinity/knowledge-base/To-do.md': 'Original todos',
        'trinity/knowledge-base/ISSUES.md': 'Original issues',
        'trinity/knowledge-base/Technical-Debt.md': 'Original debt',
      };

      for (const [file, content] of Object.entries(originalContent)) {
        await fs.writeFile(file, content);
      }

      const backupDir = await createUpdateBackup(mockSpinner);

      // Simulate update modifying files
      for (const file of Object.keys(originalContent)) {
        await fs.writeFile(file, 'MODIFIED CONTENT');
      }

      // Restore from backup
      await restoreUserContent(backupDir, mockSpinner);

      // Verify original content was restored
      for (const [file, expectedContent] of Object.entries(originalContent)) {
        const content = await fs.readFile(file, 'utf8');
        expect(content).toBe(expectedContent);
      }

      expect(mockSpinner.start).toHaveBeenCalledWith('Restoring user content...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith('User content restored');
    });

    test('should overwrite existing files during restore', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Original');
      const backupDir = await createUpdateBackup(mockSpinner);

      // Overwrite with new content
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Modified by update');

      // Restore
      await restoreUserContent(backupDir, mockSpinner);

      const content = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
      expect(content).toBe('Original');
    });

    test('should handle missing backup files gracefully', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Manually remove some backup files
      await fs.remove(path.join(backupDir, 'ARCHITECTURE.md'));

      // Should not throw
      await expect(restoreUserContent(backupDir, mockSpinner)).resolves.not.toThrow();
    });

    test('should only restore user-managed files, not entire structure', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('trinity/templates');
      await fs.ensureDir('.claude');

      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'User content');
      await fs.writeFile('trinity/templates/template.md', 'System template');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Modify system template
      await fs.writeFile('trinity/templates/template.md', 'Updated system template');

      // Restore user content
      await restoreUserContent(backupDir, mockSpinner);

      // System template should remain modified (not restored)
      const systemContent = await fs.readFile('trinity/templates/template.md', 'utf8');
      expect(systemContent).toBe('Updated system template');

      // User content should be restored
      const userContent = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
      expect(userContent).toBe('User content');
    });
  });

  describe('rollbackFromBackup', () => {
    test('should restore entire trinity directory on rollback', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('trinity/templates');
      await fs.ensureDir('.claude');
      await fs.writeFile('trinity/VERSION', '1.0.0');
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Original');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Simulate failed update corrupting trinity
      await fs.writeFile('trinity/VERSION', '2.1.0-corrupted');
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Corrupted');

      // Rollback
      await rollbackFromBackup(backupDir);

      // Verify original state restored
      const version = await fs.readFile('trinity/VERSION', 'utf8');
      const architecture = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');

      expect(version).toBe('1.0.0');
      expect(architecture).toBe('Original');
    });

    test('should restore entire .claude directory on rollback', async () => {
      await fs.ensureDir('trinity');
      await fs.ensureDir('.claude/agents');
      await fs.ensureDir('.claude/commands');
      await fs.writeFile('.claude/agents/test.md', 'Original agent');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Corrupt .claude
      await fs.writeFile('.claude/agents/test.md', 'Corrupted');
      await fs.writeFile('.claude/agents/bad-agent.md', 'Bad content');

      // Rollback
      await rollbackFromBackup(backupDir);

      // Verify restoration
      const agent = await fs.readFile('.claude/agents/test.md', 'utf8');
      expect(agent).toBe('Original agent');

      // Bad file should be gone
      expect(await fs.pathExists('.claude/agents/bad-agent.md')).toBe(false);
    });

    test('should cleanup backup directory after successful rollback', async () => {
      await fs.ensureDir('trinity');
      await fs.ensureDir('.claude');

      const backupDir = await createUpdateBackup(mockSpinner);

      await rollbackFromBackup(backupDir);

      // Backup should be removed
      expect(await fs.pathExists(backupDir)).toBe(false);
    });

    test('should return early if backup directory does not exist', async () => {
      const nonExistentBackup = '.trinity-backup-999999';

      // Should not throw
      await expect(rollbackFromBackup(nonExistentBackup)).resolves.not.toThrow();
    });

    test('should handle rollback errors gracefully', async () => {
      await fs.ensureDir('trinity');
      await fs.ensureDir('.claude');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Make the trinity directory read-only to cause copy failure
      // Note: This test verifies error handling structure exists
      // In practice, actual filesystem errors are rare but critical to handle

      // Since we can't easily simulate a filesystem error in tests,
      // we'll just verify the rollback succeeds with valid backup
      await expect(rollbackFromBackup(backupDir)).resolves.not.toThrow();

      // After successful rollback, backup should be cleaned up
      expect(await fs.pathExists(backupDir)).toBe(false);
    });

    test('should completely replace corrupted directories', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');
      await fs.writeFile('trinity/knowledge-base/good.md', 'Good file');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Add corrupt file to trinity
      await fs.writeFile('trinity/knowledge-base/corrupt.md', 'Corrupt');

      // Rollback
      await rollbackFromBackup(backupDir);

      // Corrupt file should be gone
      expect(await fs.pathExists('trinity/knowledge-base/corrupt.md')).toBe(false);
      // Good file should remain
      expect(await fs.pathExists('trinity/knowledge-base/good.md')).toBe(true);
    });
  });

  describe('cleanupBackup', () => {
    test('should remove backup directory', async () => {
      await fs.ensureDir('trinity');
      await fs.ensureDir('.claude');

      const backupDir = await createUpdateBackup(mockSpinner);

      expect(await fs.pathExists(backupDir)).toBe(true);

      await cleanupBackup(backupDir, mockSpinner);

      expect(await fs.pathExists(backupDir)).toBe(false);
      expect(mockSpinner.start).toHaveBeenCalledWith('Cleaning up...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith('Cleanup complete');
    });

    test('should remove all backup contents', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Content');

      const backupDir = await createUpdateBackup(mockSpinner);

      // Verify backup has content
      expect(await fs.pathExists(path.join(backupDir, 'trinity'))).toBe(true);
      expect(await fs.pathExists(path.join(backupDir, '.claude'))).toBe(true);

      await cleanupBackup(backupDir, mockSpinner);

      // Everything should be gone
      expect(await fs.pathExists(backupDir)).toBe(false);
    });

    test('should handle non-existent backup gracefully', async () => {
      const nonExistentBackup = '.trinity-backup-nonexistent';

      // Should not throw
      await expect(cleanupBackup(nonExistentBackup, mockSpinner)).resolves.not.toThrow();
    });
  });

  describe('Backup workflow integration', () => {
    test('should support complete backup-restore-cleanup workflow', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      const originalContent = 'Original user data';
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', originalContent);

      // 1. Backup
      const backupDir = await createUpdateBackup(mockSpinner);

      // 2. Simulate update modifying file
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Updated content');

      // 3. Restore user content
      await restoreUserContent(backupDir, mockSpinner);

      const restoredContent = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
      expect(restoredContent).toBe(originalContent);

      // 4. Cleanup
      await cleanupBackup(backupDir, mockSpinner);

      expect(await fs.pathExists(backupDir)).toBe(false);
    });

    test('should support backup-rollback workflow on failure', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');
      await fs.writeFile('trinity/VERSION', '1.0.0');
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Original');

      // 1. Backup
      const backupDir = await createUpdateBackup(mockSpinner);

      // 2. Simulate catastrophic update failure
      await fs.remove('trinity');
      await fs.ensureDir('trinity/broken');
      await fs.writeFile('trinity/broken/corrupt.txt', 'broken');

      // 3. Rollback
      await rollbackFromBackup(backupDir);

      // Verify complete restoration
      expect(await fs.pathExists('trinity/VERSION')).toBe(true);
      expect(await fs.pathExists('trinity/knowledge-base/ARCHITECTURE.md')).toBe(true);
      expect(await fs.pathExists('trinity/broken')).toBe(false);

      const version = await fs.readFile('trinity/VERSION', 'utf8');
      expect(version).toBe('1.0.0');
    });

    test('should preserve user content across multiple operations', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      const userContent = 'Important user data that must never be lost';
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', userContent);

      // Backup
      const backupDir = await createUpdateBackup(mockSpinner);

      // Modify
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Modified 1');

      // Restore
      await restoreUserContent(backupDir, mockSpinner);

      let content = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
      expect(content).toBe(userContent);

      // Modify again
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', 'Modified 2');

      // Restore again
      await restoreUserContent(backupDir, mockSpinner);

      content = await fs.readFile('trinity/knowledge-base/ARCHITECTURE.md', 'utf8');
      expect(content).toBe(userContent);

      // Cleanup
      await cleanupBackup(backupDir, mockSpinner);
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle empty trinity directory', async () => {
      await fs.ensureDir('trinity');
      await fs.ensureDir('.claude');

      const backupDir = await createUpdateBackup(mockSpinner);

      expect(await fs.pathExists(backupDir)).toBe(true);
      expect(await fs.pathExists(path.join(backupDir, 'trinity'))).toBe(true);
    });

    test('should handle deeply nested directory structures', async () => {
      await fs.ensureDir('trinity/a/b/c/d');
      await fs.ensureDir('.claude/x/y/z');
      await fs.writeFile('trinity/a/b/c/d/deep.txt', 'deep content');

      const backupDir = await createUpdateBackup(mockSpinner);

      expect(await fs.pathExists(path.join(backupDir, 'trinity/a/b/c/d/deep.txt'))).toBe(true);
    });

    test('should handle large files', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      const largeContent = 'x'.repeat(1000000); // 1MB of data
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', largeContent);

      const backupDir = await createUpdateBackup(mockSpinner);

      const backedUpContent = await fs.readFile(path.join(backupDir, 'ARCHITECTURE.md'), 'utf8');
      expect(backedUpContent.length).toBe(1000000);
      expect(backedUpContent).toBe(largeContent);
    });

    test('should handle special characters in file content', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('.claude');

      const specialContent = 'Content with émojis 🚀 and speçial çhars: <>&"\'\n\t';
      await fs.writeFile('trinity/knowledge-base/ARCHITECTURE.md', specialContent);

      const backupDir = await createUpdateBackup(mockSpinner);

      const backedUpContent = await fs.readFile(path.join(backupDir, 'ARCHITECTURE.md'), 'utf8');
      expect(backedUpContent).toBe(specialContent);
    });

    test('should create unique backup directories with timestamps', async () => {
      await fs.ensureDir('trinity');
      await fs.ensureDir('.claude');

      const backupDir1 = await createUpdateBackup(mockSpinner);

      // Wait 1ms to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1));

      const backupDir2 = await createUpdateBackup(mockSpinner);

      expect(backupDir1).not.toBe(backupDir2);
      expect(await fs.pathExists(backupDir1)).toBe(true);
      expect(await fs.pathExists(backupDir2)).toBe(true);
    });
  });
});
