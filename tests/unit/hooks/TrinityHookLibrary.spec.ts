/**
 * Trinity Hook Library Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TrinityHookLibrary } from '../../../src/hooks/TrinityHookLibrary';
import type { TrinityHook } from '../../../src/shared/types';
import * as fs from 'fs/promises';

describe('TrinityHookLibrary', () => {
  let library: TrinityHookLibrary;
  const testConfigPath = './test-hooks-config';

  beforeEach(async () => {
    library = new TrinityHookLibrary(testConfigPath);
    await fs.mkdir(testConfigPath, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testConfigPath, { recursive: true, force: true });
  });

  describe('Hook Registration', () => {
    it('should register a hook', () => {
      const hook: TrinityHook = {
        id: 'test-hook',
        name: 'Test Hook',
        description: 'Test hook for unit tests',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Test"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      library.registerHook(hook);

      const retrieved = library.getHook('test-hook');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Hook');
    });

    it('should register multiple hooks', () => {
      library.registerHook({
        id: 'hook-1',
        name: 'Hook 1',
        description: 'First hook',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "1"' },
        enabled: true,
        createdAt: new Date(),
      });

      library.registerHook({
        id: 'hook-2',
        name: 'Hook 2',
        description: 'Second hook',
        category: 'work-order-automation',
        triggerEvent: 'work_order_create',
        action: { type: 'bash', command: 'echo "2"' },
        enabled: true,
        createdAt: new Date(),
      });

      const hooks = library.listHooks();
      expect(hooks).toHaveLength(2);
    });

    it('should prevent duplicate hook IDs', () => {
      const hook: TrinityHook = {
        id: 'duplicate',
        name: 'First',
        description: 'First hook',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "1"' },
        enabled: true,
        createdAt: new Date(),
      };

      library.registerHook(hook);

      expect(() => library.registerHook({ ...hook, name: 'Second' })).toThrow(/already registered/i);
    });
  });

  describe('Hook Execution', () => {
    it('should execute hook for matching event', async () => {
      library.registerHook({
        id: 'on-start',
        name: 'On Start Hook',
        description: 'Executes on investigation start',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Started: {{investigationId}}"',
        },
        enabled: true,
        createdAt: new Date(),
      });

      const results = await library.executeHooksForEvent('investigation_start', {
        investigationId: 'inv-1',
      });

      expect(results).toHaveLength(1);
      expect(results[0].success).toBe(true);
      expect(results[0].hookId).toBe('on-start');
    });

    it('should execute multiple hooks for same event', async () => {
      library.registerHook({
        id: 'hook-1',
        name: 'Hook 1',
        description: 'First hook',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_complete',
        action: { type: 'bash', command: 'echo "1"' },
        enabled: true,
        createdAt: new Date(),
      });

      library.registerHook({
        id: 'hook-2',
        name: 'Hook 2',
        description: 'Second hook',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_complete',
        action: { type: 'bash', command: 'echo "2"' },
        enabled: true,
        createdAt: new Date(),
      });

      const results = await library.executeHooksForEvent('investigation_complete', {});

      expect(results).toHaveLength(2);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should not execute disabled hooks', async () => {
      library.registerHook({
        id: 'disabled-hook',
        name: 'Disabled Hook',
        description: 'This hook is disabled',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "Should not run"' },
        enabled: false,
        createdAt: new Date(),
      });

      const results = await library.executeHooksForEvent('investigation_start', {});

      expect(results).toHaveLength(0);
    });

    it('should substitute variables in hook commands', async () => {
      library.registerHook({
        id: 'var-hook',
        name: 'Variable Hook',
        description: 'Uses variables',
        category: 'investigation-lifecycle',
        triggerEvent: 'task_complete',
        action: {
          type: 'bash',
          command: 'echo "Task {{taskId}} in {{investigationId}}"',
        },
        enabled: true,
        createdAt: new Date(),
      });

      const results = await library.executeHooksForEvent('task_complete', {
        taskId: 'task-1',
        investigationId: 'inv-1',
      });

      expect(results[0].output).toContain('task-1');
      expect(results[0].output).toContain('inv-1');
    });
  });

  describe('Hook Management', () => {
    it('should enable a hook', async () => {
      library.registerHook({
        id: 'test-hook',
        name: 'Test Hook',
        description: 'Test',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "test"' },
        enabled: false,
        createdAt: new Date(),
      });

      await library.enableHook('test-hook');

      const hook = library.getHook('test-hook');
      expect(hook?.enabled).toBe(true);
    });

    it('should disable a hook', async () => {
      library.registerHook({
        id: 'test-hook',
        name: 'Test Hook',
        description: 'Test',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "test"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.disableHook('test-hook');

      const hook = library.getHook('test-hook');
      expect(hook?.enabled).toBe(false);
    });

    it('should remove a hook', async () => {
      library.registerHook({
        id: 'to-remove',
        name: 'Remove Me',
        description: 'Will be removed',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "test"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.removeHook('to-remove');

      const hook = library.getHook('to-remove');
      expect(hook).toBeUndefined();
    });

    it('should update hook configuration', async () => {
      library.registerHook({
        id: 'update-me',
        name: 'Original Name',
        description: 'Original description',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "original"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.updateHook('update-me', {
        name: 'Updated Name',
        description: 'Updated description',
      });

      const hook = library.getHook('update-me');
      expect(hook?.name).toBe('Updated Name');
      expect(hook?.description).toBe('Updated description');
    });
  });

  describe('Hook Filtering', () => {
    it('should filter hooks by category', () => {
      library.registerHook({
        id: 'lifecycle-1',
        name: 'Lifecycle Hook',
        description: 'Lifecycle',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "1"' },
        enabled: true,
        createdAt: new Date(),
      });

      library.registerHook({
        id: 'git-1',
        name: 'Git Hook',
        description: 'Git',
        category: 'git-workflow',
        triggerEvent: 'git_commit',
        action: { type: 'bash', command: 'echo "2"' },
        enabled: true,
        createdAt: new Date(),
      });

      const lifecycleHooks = library.listHooks({ category: 'investigation-lifecycle' });
      expect(lifecycleHooks).toHaveLength(1);
      expect(lifecycleHooks[0].id).toBe('lifecycle-1');
    });

    it('should filter hooks by event', () => {
      library.registerHook({
        id: 'start-hook',
        name: 'Start Hook',
        description: 'Start',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "start"' },
        enabled: true,
        createdAt: new Date(),
      });

      library.registerHook({
        id: 'end-hook',
        name: 'End Hook',
        description: 'End',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_complete',
        action: { type: 'bash', command: 'echo "end"' },
        enabled: true,
        createdAt: new Date(),
      });

      const startHooks = library.listHooks({ event: 'investigation_start' });
      expect(startHooks).toHaveLength(1);
      expect(startHooks[0].id).toBe('start-hook');
    });

    it('should filter hooks by enabled status', () => {
      library.registerHook({
        id: 'enabled-hook',
        name: 'Enabled',
        description: 'Enabled',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "enabled"' },
        enabled: true,
        createdAt: new Date(),
      });

      library.registerHook({
        id: 'disabled-hook',
        name: 'Disabled',
        description: 'Disabled',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "disabled"' },
        enabled: false,
        createdAt: new Date(),
      });

      const enabledHooks = library.listHooks({ enabled: true });
      expect(enabledHooks).toHaveLength(1);
      expect(enabledHooks[0].id).toBe('enabled-hook');
    });
  });

  describe('Dry Run Mode', () => {
    it('should execute hooks in dry run mode', async () => {
      library.registerHook({
        id: 'test-hook',
        name: 'Test Hook',
        description: 'Test',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Should not execute"',
        },
        enabled: true,
        createdAt: new Date(),
      });

      await library.setDryRunMode(true);

      const results = await library.executeHooksForEvent('investigation_start', {});

      expect(results[0].dryRun).toBe(true);
      expect(results[0].success).toBe(true);
    });

    it('should disable dry run mode', async () => {
      await library.setDryRunMode(true);
      await library.setDryRunMode(false);

      const isDryRun = library.isDryRunMode();
      expect(isDryRun).toBe(false);
    });
  });

  describe('Execution History', () => {
    it('should track hook execution history', async () => {
      library.registerHook({
        id: 'tracked-hook',
        name: 'Tracked Hook',
        description: 'Track executions',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "tracked"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.executeHooksForEvent('investigation_start', {});
      await library.executeHooksForEvent('investigation_start', {});

      const history = library.getExecutionHistory('tracked-hook');

      expect(history).toHaveLength(2);
      expect(history[0].hookId).toBe('tracked-hook');
      expect(history[0].timestamp).toBeDefined();
    });

    it('should track execution success and failure', async () => {
      library.registerHook({
        id: 'failing-hook',
        name: 'Failing Hook',
        description: 'Will fail',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'exit 1' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.executeHooksForEvent('investigation_start', {});

      const history = library.getExecutionHistory('failing-hook');
      expect(history[0].success).toBe(false);
    });

    it('should clear execution history', async () => {
      library.registerHook({
        id: 'test-hook',
        name: 'Test Hook',
        description: 'Test',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "test"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.executeHooksForEvent('investigation_start', {});

      await library.clearExecutionHistory('test-hook');

      const history = library.getExecutionHistory('test-hook');
      expect(history).toHaveLength(0);
    });
  });

  describe('Configuration Persistence', () => {
    it('should save configuration to disk', async () => {
      library.registerHook({
        id: 'persist-hook',
        name: 'Persist Hook',
        description: 'Should persist',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "persist"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.saveConfiguration();

      const library2 = new TrinityHookLibrary(testConfigPath);
      await library2.loadConfiguration();

      const hook = library2.getHook('persist-hook');
      expect(hook).toBeDefined();
      expect(hook?.name).toBe('Persist Hook');
    });

    it('should load configuration from disk', async () => {
      library.registerHook({
        id: 'load-hook',
        name: 'Load Hook',
        description: 'Load from disk',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "load"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.saveConfiguration();

      const library2 = new TrinityHookLibrary(testConfigPath);
      await library2.loadConfiguration();

      const hooks = library2.listHooks();
      expect(hooks).toHaveLength(1);
    });
  });

  describe('Hook Statistics', () => {
    it('should provide hook statistics', async () => {
      library.registerHook({
        id: 'stat-hook',
        name: 'Stats Hook',
        description: 'Track stats',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "stats"' },
        enabled: true,
        createdAt: new Date(),
      });

      await library.executeHooksForEvent('investigation_start', {});
      await library.executeHooksForEvent('investigation_start', {});

      const stats = library.getHookStatistics('stat-hook');

      expect(stats.totalExecutions).toBe(2);
      expect(stats.successRate).toBeGreaterThan(0);
    });

    it('should calculate success rate', async () => {
      library.registerHook({
        id: 'success-hook',
        name: 'Success Hook',
        description: 'Success',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "success"' },
        enabled: true,
        createdAt: new Date(),
      });

      // 3 successful executions
      await library.executeHooksForEvent('investigation_start', {});
      await library.executeHooksForEvent('investigation_start', {});
      await library.executeHooksForEvent('investigation_start', {});

      const stats = library.getHookStatistics('success-hook');
      expect(stats.successRate).toBe(1.0); // 100%
    });

    it('should provide library-wide statistics', () => {
      library.registerHook({
        id: 'hook-1',
        name: 'Hook 1',
        description: 'First',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "1"' },
        enabled: true,
        createdAt: new Date(),
      });

      library.registerHook({
        id: 'hook-2',
        name: 'Hook 2',
        description: 'Second',
        category: 'git-workflow',
        triggerEvent: 'git_commit',
        action: { type: 'bash', command: 'echo "2"' },
        enabled: false,
        createdAt: new Date(),
      });

      const stats = library.getLibraryStatistics();

      expect(stats.totalHooks).toBe(2);
      expect(stats.enabledHooks).toBe(1);
      expect(stats.disabledHooks).toBe(1);
      expect(stats.hooksByCategory['investigation-lifecycle']).toBe(1);
      expect(stats.hooksByCategory['git-workflow']).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle hook execution errors gracefully', async () => {
      library.registerHook({
        id: 'error-hook',
        name: 'Error Hook',
        description: 'Throws error',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'invalid-command-xyz' },
        enabled: true,
        createdAt: new Date(),
      });

      const results = await library.executeHooksForEvent('investigation_start', {});

      expect(results[0].success).toBe(false);
      expect(results[0].error).toBeDefined();
    });

    it('should continue executing hooks after one fails', async () => {
      library.registerHook({
        id: 'fail-hook',
        name: 'Fail Hook',
        description: 'Fails',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'exit 1' },
        enabled: true,
        createdAt: new Date(),
      });

      library.registerHook({
        id: 'success-hook',
        name: 'Success Hook',
        description: 'Succeeds',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: { type: 'bash', command: 'echo "success"' },
        enabled: true,
        createdAt: new Date(),
      });

      const results = await library.executeHooksForEvent('investigation_start', {});

      expect(results).toHaveLength(2);
      expect(results.some(r => r.success === false)).toBe(true);
      expect(results.some(r => r.success === true)).toBe(true);
    });
  });
});
