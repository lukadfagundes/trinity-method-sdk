/**
 * TaskStatusTracker - Cross-process safe task lifecycle management with file-based locking
 *
 * @see docs/workflows/implementation-workflow.md - Task lifecycle and status transitions
 * @see docs/best-practices.md - Concurrency and locking patterns
 *
 * **Trinity Principle:** "Systematic Quality Assurance"
 * Tracks task lifecycle (pending → in-progress → completed/failed) with file-based locks preventing
 * race conditions in parallel execution. Ensures tasks transition safely through states without
 * corruption from concurrent agent access.
 *
 * **Why This Exists:**
 * Parallel agent execution creates race conditions. Two agents could claim same task simultaneously,
 * or update status concurrently causing corruption. File-based locking provides cross-process
 * synchronization - when agent acquires task lock, no other agent can modify it. State transitions
 * follow validation rules (can't mark completed task as pending), and stale locks get cleaned
 * automatically, ensuring robust concurrent coordination.
 *
 * @example
 * ```typescript
 * const tracker = new TaskStatusTracker('./trinity/coordination');
 *
 * // Start task with lock
 * await tracker.startTask('task-1', 'TAN-001');
 *
 * // Complete task
 * await tracker.completeTask('task-1', { success: true });
 *
 * // Get stats
 * const stats = tracker.getStats();
 * console.log(`Completed: ${stats.completed}, Failed: ${stats.failed}`);
 * ```
 *
 * @module coordination/TaskStatusTracker
 * @version 1.0.0
 */

import * as fs from 'fs/promises';
import * as path from 'path';

import {
  InvestigationTask,
  TaskStatus,
  TaskPoolStats,
  LockAcquisitionError,
} from '../shared/types';

/**
 * Task status transition rules
 */
const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  pending: ['in-progress', 'blocked', 'failed'],
  'in-progress': ['completed', 'failed', 'blocked'],
  completed: [], // Terminal state
  failed: ['pending', 'in-progress'], // Can retry
  blocked: ['pending', 'failed'], // Can unblock or fail
};

/**
 * Tracks task status with file-based synchronization
 */
export class TaskStatusTracker {
  private tasks: Map<string, InvestigationTask> = new Map();
  private lockDir: string;
  private taskDir: string;
  private stats: TaskPoolStats;

  constructor(baseDir: string = 'trinity/coordination') {
    this.lockDir = path.join(baseDir, 'locks');
    this.taskDir = path.join(baseDir, 'tasks');

    this.stats = {
      totalTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      failedTasks: 0,
      blockedTasks: 0,
      averageTaskDuration: 0,
      parallelEfficiency: 0,
    };
  }

  /**
   * Initialize tracker (create directories)
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.lockDir, { recursive: true });
    await fs.mkdir(this.taskDir, { recursive: true });
  }

  /**
   * Acquire exclusive lock for task modification
   * @param taskId - Task ID to lock
   * @throws LockAcquisitionError if lock cannot be acquired
   */
  async acquireTaskLock(taskId: string): Promise<void> {
    const lockPath = path.join(this.lockDir, `${taskId}.lock`);
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        // Attempt to create lock file with exclusive flag
        await fs.writeFile(lockPath, process.pid.toString(), { flag: 'wx' });
        return; // Lock acquired
      } catch (error: any) {
        if (error.code === 'EEXIST') {
          // Lock exists, check if stale (>5 minutes old)
          try {
            const stats = await fs.stat(lockPath);
            if (Date.now() - stats.mtimeMs > 300000) {
              // Stale lock - remove it
              await fs.unlink(lockPath).catch(() => {});
              continue;
            }
          } catch {
            // Lock file disappeared - try again
            continue;
          }

          // Wait and retry
          await new Promise((resolve) => setTimeout(resolve, 100));
          retries++;
        } else {
          throw error;
        }
      }
    }

    throw new LockAcquisitionError(
      `Failed to acquire lock for task ${taskId} after ${maxRetries} retries`
    );
  }

  /**
   * Release task lock
   * @param taskId - Task ID to unlock
   */
  async releaseTaskLock(taskId: string): Promise<void> {
    const lockPath = path.join(this.lockDir, `${taskId}.lock`);
    await fs.unlink(lockPath).catch(() => {}); // Ignore errors if lock doesn't exist
  }

  /**
   * Add task to tracker
   * @param task - Investigation task
   */
  async addTask(task: InvestigationTask): Promise<void> {
    await this.acquireTaskLock(task.id);

    try {
      this.tasks.set(task.id, { ...task });

      // Persist to disk
      await this.persistTask(task);

      // Update stats
      this.updateStats();
    } finally {
      await this.releaseTaskLock(task.id);
    }
  }

  /**
   * Get task by ID
   * @param taskId - Task ID
   * @returns Task or undefined
   */
  getTask(taskId: string): InvestigationTask | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Update task status
   * @param taskId - Task ID
   * @param newStatus - New status
   * @throws Error if transition is invalid
   */
  async updateTaskStatus(
    taskId: string,
    newStatus: TaskStatus
  ): Promise<void> {
    await this.acquireTaskLock(taskId);

    try {
      const task = this.tasks.get(taskId);

      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }

      // Validate transition
      const validTransitions = VALID_TRANSITIONS[task.status];
      if (!validTransitions.includes(newStatus)) {
        throw new Error(
          `Invalid status transition: ${task.status} → ${newStatus}`
        );
      }

      // Update status
      const oldStatus = task.status;
      task.status = newStatus;

      // Update timestamps
      if (newStatus === 'in-progress' && !task.startTime) {
        task.startTime = new Date();
      }

      if (
        (newStatus === 'completed' || newStatus === 'failed') &&
        !task.endTime
      ) {
        task.endTime = new Date();
      }

      this.tasks.set(taskId, task);

      // Persist changes
      await this.persistTask(task);

      // Update stats
      this.updateStats();
    } finally {
      await this.releaseTaskLock(taskId);
    }
  }

  /**
   * Mark task as in-progress
   * @param taskId - Task ID
   * @param agentId - Agent ID assigned to task
   */
  async startTask(taskId: string, agentId: string): Promise<void> {
    await this.acquireTaskLock(taskId);

    try {
      const task = this.tasks.get(taskId);

      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }

      task.status = 'in-progress';
      task.assignedTo = agentId;
      task.startTime = new Date();

      this.tasks.set(taskId, task);
      await this.persistTask(task);
      this.updateStats();
    } finally {
      await this.releaseTaskLock(taskId);
    }
  }

  /**
   * Mark task as completed
   * @param taskId - Task ID
   * @param result - Task result
   */
  async completeTask(taskId: string, result?: any): Promise<void> {
    await this.acquireTaskLock(taskId);

    try {
      const task = this.tasks.get(taskId);

      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }

      task.status = 'completed';
      task.endTime = new Date();

      if (result !== undefined) {
        task.result = result;
      }

      this.tasks.set(taskId, task);
      await this.persistTask(task);
      this.updateStats();
    } finally {
      await this.releaseTaskLock(taskId);
    }
  }

  /**
   * Mark task as failed
   * @param taskId - Task ID
   * @param error - Error message
   */
  async failTask(taskId: string, error: string): Promise<void> {
    await this.acquireTaskLock(taskId);

    try {
      const task = this.tasks.get(taskId);

      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }

      task.status = 'failed';
      task.endTime = new Date();
      task.error = error;
      task.retryCount++;

      this.tasks.set(taskId, task);
      await this.persistTask(task);
      this.updateStats();
    } finally {
      await this.releaseTaskLock(taskId);
    }
  }

  /**
   * Retry failed task
   * @param taskId - Task ID
   */
  async retryTask(taskId: string): Promise<void> {
    await this.acquireTaskLock(taskId);

    try {
      const task = this.tasks.get(taskId);

      if (!task) {
        throw new Error(`Task ${taskId} not found`);
      }

      if (task.status !== 'failed') {
        throw new Error(
          `Cannot retry task ${taskId}: status is ${task.status}`
        );
      }

      if (!task.metadata.canRetry) {
        throw new Error(`Task ${taskId} is not configured for retry`);
      }

      if (task.retryCount >= task.metadata.maxRetries) {
        throw new Error(
          `Task ${taskId} has exceeded max retries (${task.metadata.maxRetries})`
        );
      }

      task.status = 'pending';
      task.error = undefined;
      task.result = undefined;
      task.startTime = undefined;
      task.endTime = undefined;

      this.tasks.set(taskId, task);
      await this.persistTask(task);
      this.updateStats();
    } finally {
      await this.releaseTaskLock(taskId);
    }
  }

  /**
   * Get all tasks with specific status
   * @param status - Task status
   * @returns Array of tasks
   */
  getTasksByStatus(status: TaskStatus): InvestigationTask[] {
    return Array.from(this.tasks.values()).filter((t) => t.status === status);
  }

  /**
   * Get all tasks for investigation
   * @param investigationId - Investigation ID
   * @returns Array of tasks
   */
  getTasksByInvestigation(investigationId: string): InvestigationTask[] {
    return Array.from(this.tasks.values()).filter(
      (t) => t.metadata.investigationId === investigationId
    );
  }

  /**
   * Get task pool statistics
   * @returns Task pool stats
   */
  getStats(): TaskPoolStats {
    return { ...this.stats };
  }

  /**
   * Update statistics
   */
  private updateStats(): void {
    const tasks = Array.from(this.tasks.values());

    this.stats.totalTasks = tasks.length;
    this.stats.pendingTasks = tasks.filter(
      (t) => t.status === 'pending'
    ).length;
    this.stats.inProgressTasks = tasks.filter(
      (t) => t.status === 'in-progress'
    ).length;
    this.stats.completedTasks = tasks.filter(
      (t) => t.status === 'completed'
    ).length;
    this.stats.failedTasks = tasks.filter((t) => t.status === 'failed').length;
    this.stats.blockedTasks = tasks.filter(
      (t) => t.status === 'blocked'
    ).length;

    // Calculate average task duration
    const completedTasks = tasks.filter((t) => t.status === 'completed');
    if (completedTasks.length > 0) {
      const totalDuration = completedTasks.reduce((sum, task) => {
        if (task.startTime && task.endTime) {
          return sum + (task.endTime.getTime() - task.startTime.getTime());
        }
        return sum;
      }, 0);

      this.stats.averageTaskDuration = totalDuration / completedTasks.length;
    }

    // Calculate parallel efficiency
    if (this.stats.totalTasks > 0) {
      const sequentialTime =
        tasks.reduce((sum, t) => {
          if (t.startTime && t.endTime) {
            return sum + (t.endTime.getTime() - t.startTime.getTime());
          }
          return sum + (t.metadata.estimatedDuration || 60000);
        }, 0) / 1000; // Convert to seconds

      const parallelTime =
        (Math.max(
          ...tasks.map((t) =>
            t.endTime ? t.endTime.getTime() : Date.now()
          )
        ) -
          Math.min(
            ...tasks.map((t) =>
              t.startTime ? t.startTime.getTime() : Date.now()
            )
          )) /
        1000;

      this.stats.parallelEfficiency =
        parallelTime > 0 ? 1 - parallelTime / sequentialTime : 0;
    }
  }

  /**
   * Persist task to disk
   * @param task - Investigation task
   */
  private async persistTask(task: InvestigationTask): Promise<void> {
    const taskPath = path.join(this.taskDir, `${task.id}.json`);

    // Serialize task (convert Date objects to ISO strings)
    const serialized = {
      ...task,
      startTime: task.startTime?.toISOString(),
      endTime: task.endTime?.toISOString(),
    };

    await fs.writeFile(taskPath, JSON.stringify(serialized, null, 2), 'utf8');
  }

  /**
   * Load task from disk
   * @param taskId - Task ID
   * @returns Task or undefined
   */
  async loadTask(taskId: string): Promise<InvestigationTask | undefined> {
    const taskPath = path.join(this.taskDir, `${taskId}.json`);

    try {
      const data = await fs.readFile(taskPath, 'utf8');
      const parsed = JSON.parse(data);

      // Deserialize dates
      return {
        ...parsed,
        startTime: parsed.startTime ? new Date(parsed.startTime) : undefined,
        endTime: parsed.endTime ? new Date(parsed.endTime) : undefined,
      };
    } catch {
      return undefined;
    }
  }

  /**
   * Load all tasks from disk
   */
  async loadAllTasks(): Promise<void> {
    try {
      const files = await fs.readdir(this.taskDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const taskId = file.replace('.json', '');
          const task = await this.loadTask(taskId);

          if (task) {
            this.tasks.set(taskId, task);
          }
        }
      }

      this.updateStats();
    } catch {
      // Directory doesn't exist or empty - ignore
    }
  }

  /**
   * Clear completed tasks older than specified duration
   * @param maxAge - Maximum age in milliseconds
   * @returns Number of tasks cleared
   */
  async clearOldTasks(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    const now = Date.now();
    let clearedCount = 0;

    for (const [taskId, task] of this.tasks.entries()) {
      if (task.status === 'completed' && task.endTime) {
        const age = now - task.endTime.getTime();

        if (age > maxAge) {
          await this.acquireTaskLock(taskId);

          try {
            this.tasks.delete(taskId);

            // Remove from disk
            const taskPath = path.join(this.taskDir, `${taskId}.json`);
            await fs.unlink(taskPath).catch(() => {});

            clearedCount++;
          } finally {
            await this.releaseTaskLock(taskId);
          }
        }
      }
    }

    this.updateStats();
    return clearedCount;
  }

  /**
   * Clear all tasks
   */
  async clearAllTasks(): Promise<void> {
    this.tasks.clear();

    // Remove all task files
    try {
      const files = await fs.readdir(this.taskDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          await fs.unlink(path.join(this.taskDir, file)).catch(() => {});
        }
      }
    } catch {
      // Ignore errors
    }

    this.updateStats();
  }

  /**
   * Clean up stale locks
   * @param maxAge - Maximum lock age in milliseconds (default: 5 minutes)
   * @returns Number of locks removed
   */
  async cleanupStaleLocks(maxAge: number = 300000): Promise<number> {
    let removedCount = 0;

    try {
      const files = await fs.readdir(this.lockDir);

      for (const file of files) {
        if (file.endsWith('.lock')) {
          const lockPath = path.join(this.lockDir, file);

          try {
            const stats = await fs.stat(lockPath);

            if (Date.now() - stats.mtimeMs > maxAge) {
              await fs.unlink(lockPath);
              removedCount++;
            }
          } catch {
            // Lock file disappeared - ignore
          }
        }
      }
    } catch {
      // Lock directory doesn't exist - ignore
    }

    return removedCount;
  }
}
