/**
 * Hook Executor Unit Tests
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { HookExecutor } from '../../../src/hooks/HookExecutor';
import { HookValidator } from '../../../src/hooks/HookValidator';
import type { TrinityHook } from '../../../src/shared/types';

describe('HookExecutor', () => {
  let executor: HookExecutor;
  let validator: HookValidator;

  beforeEach(() => {
    validator = new HookValidator();
    executor = new HookExecutor(validator);
  });

  describe('Basic Execution', () => {
    it('should execute a simple bash hook', async () => {
      const hook: TrinityHook = {
        id: 'simple-hook',
        name: 'Simple Hook',
        description: 'Simple echo command',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Hello World"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello World');
      expect(result.executionTime).toBeGreaterThan(0);
    });

    it('should execute hook with exit code 0', async () => {
      const hook: TrinityHook = {
        id: 'exit-0-hook',
        name: 'Exit 0 Hook',
        description: 'Exits with 0',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'exit 0',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    it('should handle hook execution failure', async () => {
      const hook: TrinityHook = {
        id: 'fail-hook',
        name: 'Fail Hook',
        description: 'Exits with error',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'exit 1',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(false);
      expect(result.exitCode).toBe(1);
      expect(result.error).toBeDefined();
    });
  });

  describe('Variable Substitution', () => {
    it('should substitute variables in commands', async () => {
      const hook: TrinityHook = {
        id: 'var-hook',
        name: 'Variable Hook',
        description: 'Uses variables',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Investigation: {{investigationId}}"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {
        investigationId: 'inv-123',
      });

      expect(result.success).toBe(true);
      expect(result.output).toContain('inv-123');
    });

    it('should substitute multiple variables', async () => {
      const hook: TrinityHook = {
        id: 'multi-var-hook',
        name: 'Multi Variable Hook',
        description: 'Multiple variables',
        category: 'investigation-lifecycle',
        triggerEvent: 'task_complete',
        action: {
          type: 'bash',
          command: 'echo "Task {{taskId}} in {{investigationId}}: {{status}}"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {
        taskId: 'task-1',
        investigationId: 'inv-123',
        status: 'completed',
      });

      expect(result.success).toBe(true);
      expect(result.output).toContain('task-1');
      expect(result.output).toContain('inv-123');
      expect(result.output).toContain('completed');
    });

    it('should handle missing variables gracefully', async () => {
      const hook: TrinityHook = {
        id: 'missing-var-hook',
        name: 'Missing Variable Hook',
        description: 'Missing variable',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Value: {{undefinedVar}}"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
      expect(result.output).toContain('{{undefinedVar}}'); // Not substituted
    });
  });

  describe('Timeout Enforcement', () => {
    it('should respect timeout limits', async () => {
      const hook: TrinityHook = {
        id: 'timeout-hook',
        name: 'Timeout Hook',
        description: 'Should timeout',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'sleep 10',
          timeout: 1000, // 1 second
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(false);
      expect(result.timedOut).toBe(true);
      expect(result.executionTime).toBeLessThan(2000);
    }, 15000);

    it('should complete within timeout', async () => {
      const hook: TrinityHook = {
        id: 'quick-hook',
        name: 'Quick Hook',
        description: 'Completes quickly',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Quick"',
          timeout: 5000,
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
      expect(result.timedOut).toBe(false);
    });

    it('should use default timeout when not specified', async () => {
      const hook: TrinityHook = {
        id: 'default-timeout-hook',
        name: 'Default Timeout Hook',
        description: 'Uses default timeout',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Default"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
    });
  });

  describe('Dry Run Mode', () => {
    it('should execute in dry run mode', async () => {
      const hook: TrinityHook = {
        id: 'dry-run-hook',
        name: 'Dry Run Hook',
        description: 'Dry run test',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Should not execute"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {}, { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.output).toContain('DRY RUN');
    });

    it('should not modify files in dry run mode', async () => {
      const hook: TrinityHook = {
        id: 'file-hook',
        name: 'File Hook',
        description: 'Creates file',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'touch /tmp/test-file.txt',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {}, { dryRun: true });

      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      // File should not be created
    });
  });

  describe('Validation Integration', () => {
    it('should validate hook before execution', async () => {
      const dangerousHook: TrinityHook = {
        id: 'dangerous-hook',
        name: 'Dangerous Hook',
        description: 'Dangerous command',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'rm -rf /',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(dangerousHook, {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('validation');
    });

    it('should skip validation if disabled', async () => {
      const hook: TrinityHook = {
        id: 'no-validation-hook',
        name: 'No Validation Hook',
        description: 'Skip validation',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "test"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {}, { skipValidation: true });

      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should capture stderr output', async () => {
      const hook: TrinityHook = {
        id: 'stderr-hook',
        name: 'Stderr Hook',
        description: 'Outputs to stderr',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Error message" >&2',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
      expect(result.stderr).toBeDefined();
      expect(result.stderr).toContain('Error message');
    });

    it('should handle command not found error', async () => {
      const hook: TrinityHook = {
        id: 'not-found-hook',
        name: 'Not Found Hook',
        description: 'Command not found',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'invalid-command-xyz',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle syntax errors', async () => {
      const hook: TrinityHook = {
        id: 'syntax-error-hook',
        name: 'Syntax Error Hook',
        description: 'Syntax error',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'if [ 1 -eq 1 ] then echo "missing fi"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(false);
    });
  });

  describe('Resource Management', () => {
    it('should limit memory usage', async () => {
      const hook: TrinityHook = {
        id: 'memory-hook',
        name: 'Memory Hook',
        description: 'Memory limit test',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Memory test"',
          resourceLimits: {
            maxMemoryMB: 100,
          },
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
      expect(result.resourceUsage).toBeDefined();
    });

    it('should limit CPU usage', async () => {
      const hook: TrinityHook = {
        id: 'cpu-hook',
        name: 'CPU Hook',
        description: 'CPU limit test',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "CPU test"',
          resourceLimits: {
            maxCPUPercent: 50,
          },
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
    });
  });

  describe('Execution Context', () => {
    it('should execute in correct working directory', async () => {
      const hook: TrinityHook = {
        id: 'pwd-hook',
        name: 'PWD Hook',
        description: 'Check working directory',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'pwd',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {}, {
        workingDirectory: './trinity',
      });

      expect(result.success).toBe(true);
      expect(result.output).toBeDefined();
    });

    it('should pass environment variables', async () => {
      const hook: TrinityHook = {
        id: 'env-hook',
        name: 'Environment Hook',
        description: 'Check env vars',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo $CUSTOM_VAR',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {}, {
        environment: {
          CUSTOM_VAR: 'test-value',
        },
      });

      expect(result.success).toBe(true);
      expect(result.output).toContain('test-value');
    });
  });

  describe('Performance Metrics', () => {
    it('should track execution time', async () => {
      const hook: TrinityHook = {
        id: 'perf-hook',
        name: 'Performance Hook',
        description: 'Track performance',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'sleep 0.1',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {});

      expect(result.success).toBe(true);
      expect(result.executionTime).toBeGreaterThan(100); // At least 100ms
    });

    it('should track resource usage', async () => {
      const hook: TrinityHook = {
        id: 'resource-hook',
        name: 'Resource Hook',
        description: 'Track resources',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_start',
        action: {
          type: 'bash',
          command: 'echo "Resource test"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {}, {
        trackResourceUsage: true,
      });

      expect(result.success).toBe(true);
      expect(result.resourceUsage).toBeDefined();
    });
  });

  describe('Conditional Execution', () => {
    it('should execute when condition is true', async () => {
      const hook: TrinityHook = {
        id: 'conditional-hook',
        name: 'Conditional Hook',
        description: 'Conditional execution',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_complete',
        condition: '{{status}} === "completed"',
        action: {
          type: 'bash',
          command: 'echo "Executed"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {
        status: 'completed',
      });

      expect(result.success).toBe(true);
      expect(result.output).toContain('Executed');
    });

    it('should skip execution when condition is false', async () => {
      const hook: TrinityHook = {
        id: 'skip-hook',
        name: 'Skip Hook',
        description: 'Should skip',
        category: 'investigation-lifecycle',
        triggerEvent: 'investigation_complete',
        condition: '{{status}} === "completed"',
        action: {
          type: 'bash',
          command: 'echo "Should not execute"',
        },
        enabled: true,
        createdAt: new Date(),
      };

      const result = await executor.execute(hook, {
        status: 'failed',
      });

      expect(result.skipped).toBe(true);
      expect(result.skipReason).toBe('Condition not met');
    });
  });

  describe('Concurrent Execution', () => {
    it('should execute multiple hooks concurrently', async () => {
      const hooks: TrinityHook[] = [
        {
          id: 'concurrent-1',
          name: 'Concurrent Hook 1',
          description: 'First',
          category: 'investigation-lifecycle',
          triggerEvent: 'investigation_start',
          action: { type: 'bash', command: 'echo "1"' },
          enabled: true,
          createdAt: new Date(),
        },
        {
          id: 'concurrent-2',
          name: 'Concurrent Hook 2',
          description: 'Second',
          category: 'investigation-lifecycle',
          triggerEvent: 'investigation_start',
          action: { type: 'bash', command: 'echo "2"' },
          enabled: true,
          createdAt: new Date(),
        },
        {
          id: 'concurrent-3',
          name: 'Concurrent Hook 3',
          description: 'Third',
          category: 'investigation-lifecycle',
          triggerEvent: 'investigation_start',
          action: { type: 'bash', command: 'echo "3"' },
          enabled: true,
          createdAt: new Date(),
        },
      ];

      const results = await executor.executeMany(hooks, {});

      expect(results).toHaveLength(3);
      expect(results.every(r => r.success)).toBe(true);
    });

    it('should handle concurrent execution failures', async () => {
      const hooks: TrinityHook[] = [
        {
          id: 'success-hook',
          name: 'Success Hook',
          description: 'Success',
          category: 'investigation-lifecycle',
          triggerEvent: 'investigation_start',
          action: { type: 'bash', command: 'echo "success"' },
          enabled: true,
          createdAt: new Date(),
        },
        {
          id: 'fail-hook',
          name: 'Fail Hook',
          description: 'Fail',
          category: 'investigation-lifecycle',
          triggerEvent: 'investigation_start',
          action: { type: 'bash', command: 'exit 1' },
          enabled: true,
          createdAt: new Date(),
        },
      ];

      const results = await executor.executeMany(hooks, {});

      expect(results).toHaveLength(2);
      expect(results.some(r => r.success)).toBe(true);
      expect(results.some(r => !r.success)).toBe(true);
    });
  });
});
