import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { update } from '../../src/commands/update.js';

describe('update', () => {
  const testDir = path.join(process.cwd(), 'test-temp-update');
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(async () => {
    await fs.ensureDir(testDir);
    process.chdir(testDir);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(async () => {
    const originalDir = path.join(process.cwd(), '..');
    process.chdir(originalDir);
    await fs.remove(testDir);
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  it('should error when Trinity is not deployed', async () => {
    await update({ dryRun: true });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Trinity Method not deployed')
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should show already up to date message when versions match', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await fs.ensureDir('trinity');
    await fs.writeFile('trinity/VERSION', '1.0.1');

    await update({ dryRun: true });

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Already up to date');

    consoleSpy.mockRestore();
  });

  it('should read current version from VERSION file', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await fs.ensureDir('trinity');
    await fs.writeFile('trinity/VERSION', '0.9.0');

    // This will attempt to update, but we're testing version reading
    try {
      await update({ dryRun: true });
    } catch (error) {
      // Ignore errors from missing inquirer prompts
    }

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Current version: 0.9.0');
    expect(output).toContain('Latest version: 1.0.1');

    consoleSpy.mockRestore();
  });

  it('should default to version 0.0.0 when VERSION file missing', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await fs.ensureDir('trinity');

    try {
      await update({ dryRun: true });
    } catch (error) {
      // Ignore errors from missing inquirer prompts
    }

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Current version: 0.0.0');

    consoleSpy.mockRestore();
  });
});
