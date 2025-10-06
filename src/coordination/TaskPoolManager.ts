/**
 * Task Pool Manager - Centralized Task Coordination
 *
 * Orchestrates task distribution, dependency resolution, and agent coordination
 * for multi-agent investigations. Manages priority queuing, parallel execution,
 * and load balancing across Trinity agents.
 *
 * @module coordination/TaskPoolManager
 * @version 1.0.0
 */

import {
  InvestigationTask,
  TaskDependencyGraph,
  AgentStatus,
  AgentType,
  InvestigationExecutionStatus,
  DependencyResolutionResult,
  AgentAssignmentResult,
  TaskExecutionError,
} from '@shared/types';

import { AgentMatcher } from './AgentMatcher';
import { DependencyResolver } from './DependencyResolver';
import { TaskStatusTracker } from './TaskStatusTracker';

/**
 * Priority queue for task ordering
 */
class PriorityQueue<T extends { priority: string }> {
  private items: T[] = [];

  private priorityValues: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  enqueue(item: T): void {
    this.items.push(item);
    this.items.sort(
      (a, b) =>
        (this.priorityValues[b.priority] || 0) -
        (this.priorityValues[a.priority] || 0)
    );
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get length(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }
}

/**
 * Centralized task pool manager with coordination
 */
export class TaskPoolManager {
  private taskQueue: PriorityQueue<InvestigationTask>;
  private dependencyResolver: DependencyResolver;
  private agentMatcher: AgentMatcher;
  private statusTracker: TaskStatusTracker;
  private agents: Map<string, AgentStatus> = new Map();
  private investigations: Map<string, TaskDependencyGraph> = new Map();

  constructor(baseDir: string = 'trinity/coordination') {
    this.taskQueue = new PriorityQueue();
    this.dependencyResolver = new DependencyResolver();
    this.agentMatcher = new AgentMatcher();
    this.statusTracker = new TaskStatusTracker(baseDir);
  }

  /**
   * Initialize task pool manager
   */
  async initialize(): Promise<void> {
    await this.statusTracker.initialize();
    await this.statusTracker.loadAllTasks();

    // Load tasks into queue
    const pendingTasks = this.statusTracker.getTasksByStatus('pending');
    for (const task of pendingTasks) {
      this.taskQueue.enqueue(task);
    }
  }

  /**
   * Register an agent
   * @param agent - Agent status
   */
  registerAgent(agent: AgentStatus): void {
    this.agents.set(agent.agentId, agent);
  }

  /**
   * Unregister an agent
   * @param agentId - Agent ID
   */
  unregisterAgent(agentId: string): void {
    this.agents.delete(agentId);
  }

  /**
   * Add task to pool
   * @param task - Investigation task
   * @returns Task ID
   */
  async addTask(task: InvestigationTask): Promise<string> {
    // Add to tracker
    await this.statusTracker.addTask(task);

    // Add to queue if pending
    if (task.status === 'pending') {
      this.taskQueue.enqueue(task);
    }

    return task.id;
  }

  /**
   * Add multiple tasks (investigation)
   * @param tasks - Array of investigation tasks
   * @param investigationId - Investigation ID
   * @returns Dependency resolution result
   */
  async addInvestigation(
    tasks: InvestigationTask[],
    investigationId: string
  ): Promise<DependencyResolutionResult> {
    // Resolve dependencies (includes validation)
    const resolution = this.dependencyResolver.resolveDependencies(tasks);

    if (!resolution.success) {
      return resolution;
    }

    // Update task metadata with correct investigation ID
    for (const task of tasks) {
      if (!task.metadata) {
        task.metadata = {
          investigationId,
          canRetry: true,
          maxRetries: 3,
        };
      } else {
        task.metadata.investigationId = investigationId;
      }
    }

    // Build dependency graph
    const graph = this.dependencyResolver.buildDependencyGraph(tasks);
    this.investigations.set(investigationId, graph);

    // Add all tasks
    for (const task of tasks) {
      await this.addTask(task);
    }

    return resolution;
  }

  /**
   * Distribute next task to available agent
   * @returns Assigned task or null if none available
   */
  async distributeTask(): Promise<InvestigationTask | null> {
    // Get available agents
    const availableAgents = Array.from(this.agents.values()).filter(
      (a) => a.status === 'idle'
    );

    if (availableAgents.length === 0) {
      return null; // No agents available
    }

    // Get ready tasks (dependencies satisfied)
    const readyTasks: InvestigationTask[] = [];

    // Check investigation tasks
    for (const [investigationId, graph] of this.investigations.entries()) {
      const ready = this.dependencyResolver.getNextReadyTasks(graph);

      for (const taskId of ready) {
        const task = this.statusTracker.getTask(taskId);
        if (task && task.status === 'pending') {
          readyTasks.push(task);
        }
      }
    }

    // Also check standalone tasks (not part of an investigation)
    const allPending = this.statusTracker.getTasksByStatus('pending');
    for (const task of allPending) {
      // Only add if not already in ready tasks and has no investigation
      const isInInvestigation = Array.from(this.investigations.values()).some(
        graph => graph.nodes.has(task.id)
      );

      if (!isInInvestigation && !readyTasks.some(t => t.id === task.id)) {
        // For standalone tasks, check if dependencies are satisfied
        if (!task.dependencies || task.dependencies.length === 0) {
          readyTasks.push(task);
        } else {
          // Check if all dependencies are completed
          const depsComplete = task.dependencies.every(depId => {
            const depTask = this.statusTracker.getTask(depId);
            return depTask && depTask.status === 'completed';
          });
          if (depsComplete) {
            readyTasks.push(task);
          }
        }
      }
    }

    if (readyTasks.length === 0) {
      return null; // No ready tasks
    }

    // Select highest priority ready task
    readyTasks.sort((a, b) => {
      const priorityValues: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      return (
        (priorityValues[b.priority] || 0) - (priorityValues[a.priority] || 0)
      );
    });

    const task = readyTasks[0];

    // Assign to best agent
    const agentId = this.agentMatcher.selectBestAgent(
      task,
      availableAgents
    );

    if (!agentId) {
      return null; // No suitable agent
    }

    // Mark task as in-progress
    await this.statusTracker.startTask(task.id, agentId);

    // Get updated task with assignedTo field
    const updatedTask = this.statusTracker.getTask(task.id)!;

    // Update agent status
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = 'busy';
      agent.currentTask = task.id;
    }

    // Update graph (if task is part of an investigation)
    const investigationId = task.metadata?.investigationId;
    if (investigationId) {
      const graph = this.investigations.get(investigationId);
      if (graph) {
        const graphNode = graph.nodes.get(task.id);
        if (graphNode) {
          graphNode.status = 'in-progress';
          graphNode.assignedTo = agentId;
        }
      }
    }

    return updatedTask;
  }

  /**
   * Complete task
   * @param taskId - Task ID
   * @param result - Task result
   */
  async completeTask(taskId: string, result?: any): Promise<void> {
    const task = this.statusTracker.getTask(taskId);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Mark as completed
    await this.statusTracker.completeTask(taskId, result);

    // Update agent status
    if (task.assignedTo) {
      const agent = this.agents.get(task.assignedTo);

      if (agent) {
        agent.status = 'idle';
        agent.currentTask = undefined;
        agent.tasksCompleted++;

        // Update average task duration
        if (task.startTime && task.endTime) {
          const duration =
            task.endTime.getTime() - task.startTime.getTime();
          agent.averageTaskDuration =
            (agent.averageTaskDuration * (agent.tasksCompleted - 1) +
              duration) /
            agent.tasksCompleted;
        }

        // Update workload
        agent.workload = agent.currentTask ? 1 : 0;
      }
    }

    // Update graph (if task is part of an investigation)
    const investigationId = task.metadata?.investigationId;
    if (investigationId) {
      const graph = this.investigations.get(investigationId);
      if (graph) {
        const graphTask = graph.nodes.get(taskId);
        if (graphTask) {
          graphTask.status = 'completed';
          graphTask.result = result;

          // Update ready queue
          const readyTasks = this.dependencyResolver.getNextReadyTasks(graph);
          graph.readyQueue = readyTasks;
        }
      }
    }
  }

  /**
   * Fail task
   * @param taskId - Task ID
   * @param error - Error message
   */
  async failTask(taskId: string, error: string): Promise<void> {
    const task = this.statusTracker.getTask(taskId);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    // Mark as failed
    await this.statusTracker.failTask(taskId, error);

    // Update agent status
    if (task.assignedTo) {
      const agent = this.agents.get(task.assignedTo);

      if (agent) {
        agent.status = 'idle';
        agent.currentTask = undefined;
        agent.workload = 0;

        // Update performance
        if (agent.performance) {
          const totalTasks = agent.tasksCompleted + 1;
          const successCount = agent.tasksCompleted;
          agent.performance.successRate = successCount / totalTasks;
          agent.performance.errorRate = 1 - agent.performance.successRate;
        }
      }
    }

    // Update graph
    const investigationId = task.metadata.investigationId;
    const graph = this.investigations.get(investigationId);

    if (graph) {
      const graphTask = graph.nodes.get(taskId);
      if (graphTask) {
        graphTask.status = 'failed';
        graphTask.error = error;
      }
    }

    // Attempt retry if configured
    if (
      task.metadata.canRetry &&
      task.retryCount < task.metadata.maxRetries
    ) {
      await this.statusTracker.retryTask(taskId);

      // Re-add to queue
      const retriedTask = this.statusTracker.getTask(taskId);
      if (retriedTask) {
        this.taskQueue.enqueue(retriedTask);
      }
    }
  }

  /**
   * Get task dependency graph
   * @param investigationId - Investigation ID
   * @returns Task dependency graph
   */
  getTaskGraph(investigationId: string): TaskDependencyGraph | undefined {
    return this.investigations.get(investigationId);
  }

  /**
   * Get investigation execution status
   * @param investigationId - Investigation ID
   * @returns Investigation execution status
   */
  getInvestigationStatus(
    investigationId: string
  ): InvestigationExecutionStatus | null {
    const graph = this.investigations.get(investigationId);

    if (!graph) {
      return null;
    }

    const tasks = this.statusTracker.getTasksByInvestigation(investigationId);
    const stats = this.statusTracker.getStats();

    // Determine overall status
    const hasInProgress = tasks.some((t) => t.status === 'in-progress');
    const hasPending = tasks.some((t) => t.status === 'pending');
    const allCompleted = tasks.every((t) => t.status === 'completed');
    const hasFailed = tasks.some((t) => t.status === 'failed');

    let overallStatus: 'planned' | 'in-progress' | 'paused' | 'completed' | 'failed' | 'cancelled' =
      'planned';

    if (allCompleted) {
      overallStatus = 'completed';
    } else if (hasFailed) {
      overallStatus = 'failed';
    } else if (hasInProgress) {
      overallStatus = 'in-progress';
    } else if (hasPending) {
      overallStatus = 'paused';
    }

    // Calculate duration
    const startTimes = tasks
      .map((t) => t.startTime?.getTime())
      .filter((t): t is number => t !== undefined);
    const endTimes = tasks
      .map((t) => t.endTime?.getTime())
      .filter((t): t is number => t !== undefined);

    const startedAt =
      startTimes.length > 0
        ? new Date(Math.min(...startTimes)).toISOString()
        : new Date().toISOString();
    const completedAt =
      endTimes.length > 0 && allCompleted
        ? new Date(Math.max(...endTimes)).toISOString()
        : undefined;

    const duration =
      completedAt && startedAt
        ? new Date(completedAt).getTime() - new Date(startedAt).getTime()
        : undefined;

    return {
      investigationId,
      status: overallStatus,
      taskGraph: graph,
      agents: Array.from(this.agents.values()),
      stats,
      startedAt,
      completedAt,
      duration,
    };
  }

  /**
   * Assign task to specific agent
   * @param taskId - Task ID
   * @param agentId - Agent ID
   * @returns Assignment result
   */
  async assignTaskToAgent(
    taskId: string,
    agentId: string
  ): Promise<AgentAssignmentResult> {
    const task = this.statusTracker.getTask(taskId);
    const agent = this.agents.get(agentId);

    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Calculate assignment scores
    const assignment =
      this.agentMatcher.selectBestAgentWithDetails(task, [agent]);

    // Assign task
    await this.statusTracker.startTask(taskId, agentId);

    // Update agent
    agent.status = 'busy';
    agent.currentTask = taskId;
    agent.workload = 1;

    return assignment;
  }

  /**
   * Execute investigation (coordinate all tasks)
   * @param investigationId - Investigation ID
   * @returns Execution status
   */
  async executeInvestigation(
    investigationId: string
  ): Promise<InvestigationExecutionStatus> {
    const graph = this.investigations.get(investigationId);

    if (!graph) {
      throw new Error(`Investigation ${investigationId} not found`);
    }

    // Continue distributing tasks until done
    while (true) {
      const status = this.getInvestigationStatus(investigationId);

      if (!status) {
        throw new Error(`Investigation ${investigationId} not found`);
      }

      // Check if complete
      if (
        status.status === 'completed' ||
        status.status === 'failed' ||
        status.status === 'cancelled'
      ) {
        return status;
      }

      // Try to distribute next task
      const task = await this.distributeTask();

      if (!task) {
        // No tasks ready - wait for current tasks to complete
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      // Task would be executed by agent (simulated here)
      // In real implementation, agent would execute and call completeTask/failTask
    }
  }

  /**
   * Get parallel execution groups
   * @param investigationId - Investigation ID
   * @returns Array of task groups that can execute in parallel
   */
  getParallelGroups(investigationId: string): string[][] {
    const graph = this.investigations.get(investigationId);

    if (!graph) {
      return [];
    }

    return this.dependencyResolver.identifyParallelGroups(graph);
  }

  /**
   * Get critical path for investigation
   * @param investigationId - Investigation ID
   * @returns Array of task IDs on critical path
   */
  getCriticalPath(investigationId: string): string[] {
    const graph = this.investigations.get(investigationId);

    if (!graph) {
      return [];
    }

    return this.dependencyResolver.calculateCriticalPath(graph);
  }

  /**
   * Balance workload across agents
   * @returns Rebalancing recommendations
   */
  balanceWorkload(): Array<{ from: string; to: string; task: string }> {
    const agents = Array.from(this.agents.values());
    return this.agentMatcher.balanceWorkload(agents);
  }

  /**
   * Get overall task pool statistics
   * @returns Task pool stats
   */
  getStats() {
    return this.statusTracker.getStats();
  }

  /**
   * Cleanup old tasks and stale locks
   * @param taskMaxAge - Maximum task age in milliseconds (default: 7 days)
   * @param lockMaxAge - Maximum lock age in milliseconds (default: 5 minutes)
   * @returns Cleanup summary
   */
  async cleanup(
    taskMaxAge: number = 7 * 24 * 60 * 60 * 1000,
    lockMaxAge: number = 300000
  ): Promise<{ tasksCleared: number; locksRemoved: number }> {
    const tasksCleared = await this.statusTracker.clearOldTasks(taskMaxAge);
    const locksRemoved = await this.statusTracker.cleanupStaleLocks(lockMaxAge);

    return { tasksCleared, locksRemoved };
  }

  /**
   * Shutdown task pool manager
   */
  async shutdown(): Promise<void> {
    // Clear all queues
    this.taskQueue.clear();

    // Cleanup
    await this.cleanup();
  }
}
