import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { status } from '../../src/commands/status.js';

describe('status', () => {
  const testDir = path.join(process.cwd(), 'test-temp-status');
  let consoleSpy;

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(async () => {
    const originalDir = path.join(process.cwd(), '..');
    process.chdir(originalDir);
    await fs.remove(testDir);
    consoleSpy.mockRestore();
  });

  describe('When Trinity is not deployed', () => {
    it('should show not deployed message', async () => {
      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Deployed:');
      expect(output).toContain('❌ No');
      expect(output).toContain('Trinity Method not deployed');
      expect(output).toContain('trinity deploy');
    });

    it('should return early when not deployed', async () => {
      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).not.toContain('Version:');
      expect(output).not.toContain('Agent:');
    });
  });

  describe('When Trinity is deployed', () => {
    beforeEach(async () => {
      // Create trinity directory structure
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('trinity/investigations');
      await fs.ensureDir('trinity/work-orders');
      await fs.ensureDir('trinity/patterns');
      await fs.ensureDir('trinity/sessions');
      await fs.ensureDir('trinity/templates');
    });

    it('should show deployed status', async () => {
      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Deployed:');
      expect(output).toContain('✅ Yes');
    });

    it('should read and display version from VERSION file', async () => {
      await fs.writeFile('trinity/VERSION', '1.0.0\n');

      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Version:');
      expect(output).toContain('1.0.0');
    });

    it('should show Unknown version when VERSION file is missing', async () => {
      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Version:');
      expect(output).toContain('Unknown');
    });

    it('should detect Claude Code agent', async () => {
      await fs.ensureDir('.claude/agents');

      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Agent:');
      expect(output).toContain('Claude Code');
    });

    it('should detect Cursor agent', async () => {
      await fs.writeFile('.cursorrules', 'cursor rules');

      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Agent:');
      expect(output).toContain('Cursor');
    });

    it('should show Universal agent when no specific agent detected', async () => {
      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Agent:');
      expect(output).toContain('Universal');
    });

    it('should validate structure and show valid when all dirs exist', async () => {
      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Structure:');
      expect(output).toContain('✅ Valid');
    });

    it('should show invalid structure when dirs are missing', async () => {
      await fs.remove('trinity/patterns');

      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Structure:');
      expect(output).toContain('❌ Invalid');
    });

    it('should count files in directories', async () => {
      await fs.writeFile('trinity/knowledge-base/doc1.md', '# Doc 1');
      await fs.writeFile('trinity/knowledge-base/doc2.md', '# Doc 2');
      await fs.writeFile('trinity/templates/template1.md', '# Template');
      await fs.writeFile('trinity/investigations/inv1.md', '# Investigation');

      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Files:');
      expect(output).toContain('2 docs');
      expect(output).toContain('1 templates');
      expect(output).toContain('1 investigations');
    });

    it('should show health check passing when structure is valid', async () => {
      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Health:');
      expect(output).toContain('✅ All checks passed');
    });

    it('should show health check warning when structure is invalid', async () => {
      await fs.remove('trinity/work-orders');

      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Health:');
      expect(output).toContain('⚠️');
    });
  });

  describe('Error handling', () => {
    it('should handle file counting errors gracefully', async () => {
      await fs.ensureDir('trinity/knowledge-base');
      await fs.ensureDir('trinity/investigations');
      await fs.ensureDir('trinity/work-orders');
      await fs.ensureDir('trinity/patterns');
      await fs.ensureDir('trinity/sessions');
      // Missing templates directory to trigger error

      await status({});

      const calls = consoleSpy.mock.calls.map(call => call.join(' '));
      const output = calls.join('\n');

      expect(output).toContain('Files:');
      expect(output).toContain('Unable to count');
    });
  });
});
