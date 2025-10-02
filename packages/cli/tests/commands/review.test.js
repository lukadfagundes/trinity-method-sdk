import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { review } from '../../src/commands/review.js';

describe('review', () => {
  const testDir = path.join(process.cwd(), 'test-temp-review');
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

  it('should show message when sessions directory does not exist', async () => {
    await review({});

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('No sessions found');
    expect(output).toContain('Sessions will be created');
  });

  it('should show message when sessions directory is empty', async () => {
    await fs.ensureDir('trinity/sessions');

    await review({});

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('No sessions archived yet');
  });

  it('should list archived sessions', async () => {
    await fs.ensureDir('trinity/sessions/2024-01-15-session');

    await review({});

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Found 1 archived session');
    expect(output).toContain('2024-01-15-session');
  });

  it('should count investigations in sessions', async () => {
    const sessionDir = 'trinity/sessions/2024-01-15-session';
    await fs.ensureDir(path.join(sessionDir, 'investigations'));
    await fs.writeFile(path.join(sessionDir, 'investigations/inv1.md'), '# Investigation');
    await fs.writeFile(path.join(sessionDir, 'investigations/inv2.md'), '# Investigation');

    await review({});

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Investigations: 2');
  });

  it('should count work orders in sessions', async () => {
    const sessionDir = 'trinity/sessions/2024-01-15-session';
    await fs.ensureDir(path.join(sessionDir, 'work-orders'));
    await fs.writeFile(path.join(sessionDir, 'work-orders/wo1.md'), '# WO');

    await review({});

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Work Orders: 1');
  });

  it('should handle multiple sessions', async () => {
    await fs.ensureDir('trinity/sessions/session-1');
    await fs.ensureDir('trinity/sessions/session-2');
    await fs.ensureDir('trinity/sessions/session-3');

    await review({});

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Found 3 archived session');
    expect(output).toContain('session-1');
    expect(output).toContain('session-2');
    expect(output).toContain('session-3');
  });

  it('should show tip message', async () => {
    await fs.ensureDir('trinity/sessions/session-1');

    await review({});

    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('Tip:');
    expect(output).toContain('pattern analysis');
  });

  it('should gracefully handle errors when counting artifacts', async () => {
    const sessionDir = 'trinity/sessions/session-1';
    await fs.ensureDir(sessionDir);
    // Create a file instead of directory to cause error
    await fs.writeFile(path.join(sessionDir, 'investigations'), 'invalid');

    await review({});

    // Should not throw error
    const calls = consoleSpy.mock.calls.map(call => call.join(' '));
    const output = calls.join('\n');

    expect(output).toContain('session-1');
  });
});
