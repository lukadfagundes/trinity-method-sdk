/**
 * Integration Tests: Multi-Agent Task Coordination
 * End-to-end testing of task pool coordination system
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TaskPoolManager } from '../../src/coordination/TaskPoolManager';
import {
  InvestigationTask,
  AgentStatus,
  AgentType,
} from '@shared/types';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Multi-Agent Task Coordination', () => {
  let taskPool: TaskPoolManager;
  const testBaseDir = path.join(__dirname, '../../temp/test-coordination');

  beforeEach(async () => {
    await fs.mkdir(testBaseDir, { recursive: true });
    taskPool = new TaskPoolManager(testBaseDir);
    await taskPool.initialize();
  });

  afterEach(async () => {
    await taskPool.shutdown();
    await fs.rm(testBaseDir, { recursive: true, force: true });
  });

  describe('Simple Investigation Flow', () => {
    it('should coordinate 3-task linear investigation', async () => {
      // Register agents
      const agents: AgentStatus[] = [
        createAgent('TAN-001', 'TAN'),
        createAgent('ZEN-001', 'ZEN'),
        createAgent('INO-001', 'INO'),
      ];

      agents.forEach((agent) => taskPool.registerAgent(agent));

      // Create investigation tasks
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task2'], 'INO', 'medium'),
      ];

      // Add investigation
      const resolution = await taskPool.addInvestigation(
        tasks,
        'simple-investigation'
      );

      expect(resolution.success).toBe(true);
      expect(resolution.executionOrder).toEqual(['task1', 'task2', 'task3']);

      // Simulate execution
      // Step 1: Distribute task1
      const task1 = await taskPool.distributeTask();
      expect(task1).not.toBeNull();
      expect(task1!.id).toBe('task1');
      expect(task1!.assignedTo).toBe('TAN-001');

      // Complete task1
      await taskPool.completeTask('task1', { result: 'task1 done' });

      // Step 2: Distribute task2
      const task2 = await taskPool.distributeTask();
      expect(task2).not.toBeNull();
      expect(task2!.id).toBe('task2');

      // Complete task2
      await taskPool.completeTask('task2', { result: 'task2 done' });

      // Step 3: Distribute task3
      const task3 = await taskPool.distributeTask();
      expect(task3).not.toBeNull();
      expect(task3!.id).toBe('task3');

      // Complete task3
      await taskPool.completeTask('task3', { result: 'task3 done' });

      // Verify investigation status
      const status = taskPool.getInvestigationStatus('simple-investigation');
      expect(status).not.toBeNull();
      expect(status!.status).toBe('completed');
      expect(status!.stats.completedTasks).toBe(3);
    });

    it('should handle task failure and retry', async () => {
      const agent = createAgent('TAN-001', 'TAN');
      taskPool.registerAgent(agent);

      const task: InvestigationTask = createTask('task1', [], 'TAN', 'high');
      await taskPool.addTask(task);

      // Distribute and fail
      const distributed = await taskPool.distributeTask();
      expect(distributed).not.toBeNull();

      await taskPool.failTask('task1', 'Simulated failure');

      // Task should be retried
      const retried = await taskPool.distributeTask();
      expect(retried).not.toBeNull();
      expect(retried!.id).toBe('task1');
      expect(retried!.retryCount).toBe(1);
    });
  });

  describe('Parallel Execution', () => {
    it('should execute independent tasks in parallel', async () => {
      // Register multiple agents
      const agents: AgentStatus[] = [
        createAgent('TAN-001', 'TAN'),
        createAgent('ZEN-001', 'ZEN'),
        createAgent('INO-001', 'INO'),
      ];

      agents.forEach((agent) => taskPool.registerAgent(agent));

      // Create parallel tasks (all independent)
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', [], 'ZEN', 'high'),
        createTask('task3', [], 'INO', 'high'),
      ];

      await taskPool.addInvestigation(tasks, 'parallel-investigation');

      // Identify parallel groups
      const parallelGroups = taskPool.getParallelGroups('parallel-investigation');

      expect(parallelGroups.length).toBe(1);
      expect(parallelGroups[0]).toHaveLength(3);

      // Distribute all tasks simultaneously
      const task1 = await taskPool.distributeTask();
      const task2 = await taskPool.distributeTask();
      const task3 = await taskPool.distributeTask();

      expect(task1).not.toBeNull();
      expect(task2).not.toBeNull();
      expect(task3).not.toBeNull();

      // All tasks should be assigned to different agents
      const assignedAgents = [
        task1!.assignedTo,
        task2!.assignedTo,
        task3!.assignedTo,
      ];

      expect(new Set(assignedAgents).size).toBe(3); // All different
    });

    it('should respect dependencies in parallel execution', async () => {
      const agents: AgentStatus[] = [
        createAgent('TAN-001', 'TAN'),
        createAgent('ZEN-001', 'ZEN'),
        createAgent('INO-001', 'INO'),
        createAgent('JUNO-001', 'JUNO'),
      ];

      agents.forEach((agent) => taskPool.registerAgent(agent));

      // Diamond dependency pattern
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task1'], 'INO', 'medium'),
        createTask('task4', ['task2', 'task3'], 'JUNO', 'high'),
      ];

      await taskPool.addInvestigation(tasks, 'diamond-investigation');

      // Check parallel groups
      const groups = taskPool.getParallelGroups('diamond-investigation');

      expect(groups.length).toBe(3);
      expect(groups[0]).toEqual(['task1']);
      expect(groups[1]).toHaveLength(2); // task2 and task3
      expect(groups[2]).toEqual(['task4']);

      // Execute
      const task1 = await taskPool.distributeTask();
      expect(task1!.id).toBe('task1');

      await taskPool.completeTask('task1');

      // Now task2 and task3 can run in parallel
      const task2 = await taskPool.distributeTask();
      const task3 = await taskPool.distributeTask();

      expect([task2!.id, task3!.id]).toContain('task2');
      expect([task2!.id, task3!.id]).toContain('task3');

      await taskPool.completeTask('task2');
      await taskPool.completeTask('task3');

      // Now task4 can run
      const task4 = await taskPool.distributeTask();
      expect(task4!.id).toBe('task4');
    });
  });

  describe('Agent Assignment', () => {
    it('should assign tasks to correctly skilled agents', async () => {
      const agents: AgentStatus[] = [
        createAgent('TAN-001', 'TAN'),
        createAgent('ZEN-001', 'ZEN'),
      ];

      agents.forEach((agent) => taskPool.registerAgent(agent));

      const tasks: InvestigationTask[] = [
        createTask('file-structure', [], 'TAN', 'high'),
        createTask('documentation', [], 'ZEN', 'high'),
      ];

      await taskPool.addInvestigation(tasks, 'skill-test');

      const task1 = await taskPool.distributeTask();
      const task2 = await taskPool.distributeTask();

      // Verify correct assignment
      if (task1!.id === 'file-structure') {
        expect(task1!.assignedTo).toBe('TAN-001');
      } else {
        expect(task1!.assignedTo).toBe('ZEN-001');
      }
    });

    it('should balance workload across agents', async () => {
      const agents: AgentStatus[] = [
        createAgent('TAN-001', 'TAN'),
        createAgent('TAN-002', 'TAN'),
      ];

      agents.forEach((agent) => taskPool.registerAgent(agent));

      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', [], 'TAN', 'high'),
      ];

      await taskPool.addInvestigation(tasks, 'balance-test');

      const task1 = await taskPool.distributeTask();
      const task2 = await taskPool.distributeTask();

      // Both tasks should be assigned to different agents (load balancing)
      expect(task1!.assignedTo).not.toBe(task2!.assignedTo);
    });
  });

  describe('Complex Investigation (10+ Tasks)', () => {
    it('should handle complex 15-task investigation', async () => {
      const agents: AgentStatus[] = [
        createAgent('TAN-001', 'TAN'),
        createAgent('ZEN-001', 'ZEN'),
        createAgent('INO-001', 'INO'),
        createAgent('JUNO-001', 'JUNO'),
      ];

      agents.forEach((agent) => taskPool.registerAgent(agent));

      // Complex investigation with multiple dependency levels
      const tasks: InvestigationTask[] = [
        // Level 0: Initial setup
        createTask('setup', [], 'TAN', 'critical'),

        // Level 1: Parallel initial tasks
        createTask('analyze-structure', ['setup'], 'TAN', 'high'),
        createTask('gather-context', ['setup'], 'INO', 'high'),
        createTask('review-docs', ['setup'], 'ZEN', 'high'),

        // Level 2: Processing tasks
        createTask('create-folders', ['analyze-structure'], 'TAN', 'medium'),
        createTask('define-issues', ['gather-context'], 'INO', 'medium'),
        createTask('write-architecture', ['review-docs'], 'ZEN', 'medium'),

        // Level 3: Integration tasks
        createTask('integrate-structure', ['create-folders', 'define-issues'], 'TAN', 'medium'),
        createTask('integrate-docs', ['write-architecture', 'define-issues'], 'ZEN', 'medium'),

        // Level 4: Validation tasks
        createTask('validate-structure', ['integrate-structure'], 'JUNO', 'high'),
        createTask('validate-docs', ['integrate-docs'], 'JUNO', 'high'),

        // Level 5: Refinement
        createTask('refine-structure', ['validate-structure'], 'TAN', 'low'),
        createTask('refine-docs', ['validate-docs'], 'ZEN', 'low'),

        // Level 6: Final tasks
        createTask('generate-report', ['refine-structure', 'refine-docs'], 'ZEN', 'high'),
        createTask('final-audit', ['generate-report'], 'JUNO', 'critical'),
      ];

      const resolution = await taskPool.addInvestigation(
        tasks,
        'complex-investigation'
      );

      expect(resolution.success).toBe(true);
      expect(tasks.length).toBe(15);

      // Check parallel groups
      const groups = taskPool.getParallelGroups('complex-investigation');

      expect(groups.length).toBeGreaterThan(5); // Multiple levels

      // Check critical path
      const criticalPath = taskPool.getCriticalPath('complex-investigation');

      expect(criticalPath.length).toBeGreaterThan(0);
      expect(criticalPath[0]).toBe('setup');
      expect(criticalPath[criticalPath.length - 1]).toBe('final-audit');

      // Simulate execution (simplified)
      let tasksCompleted = 0;
      let iterations = 0;
      const maxIterations = 50; // Safety limit

      while (tasksCompleted < 15 && iterations < maxIterations) {
        const task = await taskPool.distributeTask();

        if (task) {
          await taskPool.completeTask(task.id, { result: `${task.id} done` });
          tasksCompleted++;
        } else {
          // No tasks ready - some might be blocked
          break;
        }

        iterations++;
      }

      expect(tasksCompleted).toBe(15);

      const status = taskPool.getInvestigationStatus('complex-investigation');
      expect(status!.status).toBe('completed');
    });
  });

  describe('Error Handling', () => {
    it('should handle missing dependencies gracefully', async () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['nonexistent'], 'TAN', 'high'),
      ];

      const resolution = await taskPool.addInvestigation(
        tasks,
        'error-investigation'
      );

      expect(resolution.success).toBe(false);
      expect(resolution.errors).toHaveLength(1);
      expect(resolution.blockedTasks).toContain('task1');
    });

    it('should detect and reject circular dependencies', async () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['task2'], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'high'),
      ];

      const resolution = await taskPool.addInvestigation(
        tasks,
        'cycle-investigation'
      );

      expect(resolution.success).toBe(false);
      expect(resolution.cycles.length).toBeGreaterThan(0);
    });

    it('should handle agent unavailability', async () => {
      // No agents registered
      const task: InvestigationTask = createTask('task1', [], 'TAN', 'high');
      await taskPool.addTask(task);

      const distributed = await taskPool.distributeTask();

      expect(distributed).toBeNull(); // Can't distribute without agents
    });
  });

  describe('Performance Metrics', () => {
    it('should track task pool statistics', async () => {
      const agent = createAgent('TAN-001', 'TAN');
      taskPool.registerAgent(agent);

      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', [], 'TAN', 'medium'),
        createTask('task3', [], 'TAN', 'low'),
      ];

      for (const task of tasks) {
        await taskPool.addTask(task);
      }

      const stats = taskPool.getStats();

      expect(stats.totalTasks).toBe(3);
      expect(stats.pendingTasks).toBe(3);
      expect(stats.inProgressTasks).toBe(0);
      expect(stats.completedTasks).toBe(0);

      // Execute tasks
      for (let i = 0; i < 3; i++) {
        const task = await taskPool.distributeTask();
        if (task) {
          await taskPool.completeTask(task.id);
        }
      }

      const finalStats = taskPool.getStats();

      expect(finalStats.completedTasks).toBe(3);
      expect(finalStats.pendingTasks).toBe(0);
    });

    it('should calculate parallel efficiency', async () => {
      const agents: AgentStatus[] = [
        createAgent('TAN-001', 'TAN'),
        createAgent('ZEN-001', 'ZEN'),
      ];

      agents.forEach((agent) => taskPool.registerAgent(agent));

      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', [], 'ZEN', 'high'),
      ];

      await taskPool.addInvestigation(tasks, 'efficiency-test');

      const task1 = await taskPool.distributeTask();
      const task2 = await taskPool.distributeTask();

      // Complete in parallel (same time)
      await taskPool.completeTask(task1!.id);
      await taskPool.completeTask(task2!.id);

      const stats = taskPool.getStats();

      // Parallel efficiency should be high (close to 0.5 for 2 parallel tasks)
      expect(stats.parallelEfficiency).toBeGreaterThan(0);
    });
  });

  describe('Cleanup and Maintenance', () => {
    it('should cleanup old completed tasks', async () => {
      const agent = createAgent('TAN-001', 'TAN');
      taskPool.registerAgent(agent);

      const task: InvestigationTask = createTask('old-task', [], 'TAN', 'high');
      await taskPool.addTask(task);

      const distributed = await taskPool.distributeTask();
      await taskPool.completeTask(distributed!.id);

      // Cleanup with very short max age (0ms = cleanup all)
      const result = await taskPool.cleanup(0, 300000);

      expect(result.tasksCleared).toBe(1);
    });

    it('should cleanup stale locks', async () => {
      // This test would require simulating stale locks
      // For now, verify cleanup runs without error
      const result = await taskPool.cleanup();

      expect(result).toHaveProperty('tasksCleared');
      expect(result).toHaveProperty('locksRemoved');
    });
  });
});

// Helper functions
function createAgent(
  agentId: string,
  agentType: AgentType
): AgentStatus {
  return {
    agentId,
    agentType,
    status: 'idle',
    tasksCompleted: 0,
    averageTaskDuration: 0,
    workload: 0,
    capabilities: [],
    performance: {
      successRate: 1.0,
      averageExecutionTime: 5000,
      errorRate: 0,
      lastActive: new Date().toISOString(),
    },
  };
}

function createTask(
  id: string,
  dependencies: string[],
  agentType: AgentType,
  priority: 'critical' | 'high' | 'medium' | 'low',
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'blocked' = 'pending'
): InvestigationTask {
  return {
    id,
    description: `Task: ${id}`,
    agentType,
    priority,
    dependencies,
    status,
    retryCount: 0,
    metadata: {
      investigationId: 'test-investigation',
      estimatedDuration: 5000,
      timeout: 60000,
      canRetry: true,
      maxRetries: 3,
    },
  };
}
