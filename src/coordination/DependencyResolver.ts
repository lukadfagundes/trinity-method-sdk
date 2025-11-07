/**
 * DependencyResolver - Topological sorting and cycle detection for task dependency graphs
 *
 * @see docs/workflows/implementation-workflow.md - Task sequencing and dependencies
 * @see docs/best-practices.md - Dependency management patterns
 *
 * **Trinity Principle:** "Systematic Quality Assurance"
 * Resolves task dependencies using Tarjan's algorithm (cycle detection) and Kahn's algorithm
 * (topological sort), ensuring tasks execute in correct order without deadlocks. Prevents
 * circular dependencies that would block progress.
 *
 * **Why This Exists:**
 * Complex investigations have interdependent tasks. Task B needs Task A's output, Task C needs
 * B, but accidental circular dependencies (A→B→C→A) cause deadlocks. This resolver builds
 * dependency graphs, detects cycles before execution, and determines valid execution order
 * through topological sorting. Tasks execute in optimal sequence: all prerequisites complete
 * before dependent tasks start.
 *
 * @example
 * ```typescript
 * const resolver = new DependencyResolver();
 *
 * // Detect circular dependencies
 * const hasCycles = resolver.detectCycles(tasks);
 * if (hasCycles) {
 *   console.error('Circular dependency detected!');
 * }
 *
 * // Get valid execution order
 * const order = resolver.topologicalSort(tasks);
 * // Returns: [Task A, Task B, Task C] (dependencies first)
 * ```
 *
 * @module coordination/DependencyResolver
 * @version 1.0.0
 */

import {
  InvestigationTask,
  TaskDependencyGraph,
  DependencyResolutionResult,
  CycleDetectionError,
} from '../shared/types';

/**
 * Resolves task dependencies and determines execution order using graph algorithms
 */
export class DependencyResolver {
  /**
   * Build dependency graph from tasks
   * @param tasks - Array of investigation tasks
   * @returns Task dependency graph (DAG)
   */
  buildDependencyGraph(tasks: InvestigationTask[]): TaskDependencyGraph {
    const nodes = new Map<string, InvestigationTask>();
    const edges = new Map<string, string[]>();
    const roots: string[] = [];
    const readyQueue: string[] = [];

    // Build nodes map
    for (const task of tasks) {
      nodes.set(task.id, task);
      edges.set(task.id, task.dependencies || []);
    }

    // Identify root tasks (no dependencies)
    for (const task of tasks) {
      if (!task.dependencies || task.dependencies.length === 0) {
        roots.push(task.id);

        // Root tasks are immediately ready if pending
        if (task.status === 'pending') {
          readyQueue.push(task.id);
        }
      }
    }

    return {
      nodes,
      edges,
      roots,
      readyQueue,
    };
  }

  /**
   * Detect cycles in task dependency graph using Tarjan's SCC algorithm
   * @param graph - Task dependency graph
   * @returns Array of cycles (each cycle is array of task IDs), or empty if acyclic
   */
  detectCycles(graph: TaskDependencyGraph): string[][] {
    const index = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const cycles: string[][] = [];
    let currentIndex = 0;

    const strongConnect = (taskId: string) => {
      index.set(taskId, currentIndex);
      lowlink.set(taskId, currentIndex);
      currentIndex++;
      stack.push(taskId);
      onStack.add(taskId);

      // Visit tasks that depend on this task (successors)
      // For cycle detection, we need to follow the dependency direction
      const dependencies = graph.edges.get(taskId) || [];
      for (const dep of dependencies) {
        if (!index.has(dep)) {
          strongConnect(dep);
          lowlink.set(
            taskId,
            Math.min(lowlink.get(taskId)!, lowlink.get(dep)!)
          );
        } else if (onStack.has(dep)) {
          lowlink.set(taskId, Math.min(lowlink.get(taskId)!, index.get(dep)!));
        }
      }

      // Found SCC (potential cycle)
      if (lowlink.get(taskId) === index.get(taskId)) {
        const component: string[] = [];
        let node: string;
        do {
          node = stack.pop()!;
          onStack.delete(node);
          component.push(node);
        } while (node !== taskId);

        // If component has >1 node, it's a cycle
        if (component.length > 1) {
          cycles.push(component.reverse()); // Reverse to show cycle order
        }
      }
    };

    // Run algorithm on all nodes
    for (const taskId of graph.nodes.keys()) {
      if (!index.has(taskId)) {
        strongConnect(taskId);
      }
    }

    return cycles;
  }

  /**
   * Topological sort using Kahn's algorithm
   * @param graph - Task dependency graph
   * @returns Execution order (topologically sorted task IDs)
   * @throws CycleDetectionError if graph contains cycles
   */
  topologicalSort(graph: TaskDependencyGraph): string[] {
    // First check for cycles
    const cycles = this.detectCycles(graph);
    if (cycles.length > 0) {
      throw new CycleDetectionError(
        `Dependency graph contains ${cycles.length} cycle(s)`,
        cycles
      );
    }

    const inDegree = new Map<string, number>();
    const executionOrder: string[] = [];
    const queue: string[] = [];

    // Calculate in-degree for each node
    // In-degree = number of tasks that must complete before this task can run
    for (const taskId of graph.nodes.keys()) {
      const dependencies = graph.edges.get(taskId) || [];
      inDegree.set(taskId, dependencies.length);
    }

    // Add nodes with in-degree 0 to queue (no dependencies)
    for (const [taskId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(taskId);
      }
    }

    // Process queue
    while (queue.length > 0) {
      const taskId = queue.shift();
      executionOrder.push(taskId);

      // Find tasks that depend on this task and reduce their in-degree
      for (const [candidateId, dependencies] of graph.edges.entries()) {
        if (dependencies.includes(taskId)) {
          const current = inDegree.get(candidateId);
          inDegree.set(candidateId, current - 1);

          if (current - 1 === 0) {
            queue.push(candidateId);
          }
        }
      }
    }

    // If not all nodes processed, graph has cycle (shouldn't happen after cycle check)
    if (executionOrder.length !== graph.nodes.size) {
      throw new CycleDetectionError(
        'Topological sort failed: graph contains cycles',
        []
      );
    }

    return executionOrder;
  }

  /**
   * Get next ready tasks (dependencies satisfied, status pending)
   * @param graph - Task dependency graph
   * @returns Array of task IDs ready to execute
   */
  getNextReadyTasks(graph: TaskDependencyGraph): string[] {
    const readyTasks: string[] = [];

    for (const [taskId, task] of graph.nodes.entries()) {
      // Skip if not pending
      if (task.status !== 'pending') {
        continue;
      }

      // Check if dependencies are satisfied
      if (this.areDependenciesSatisfied(taskId, graph)) {
        readyTasks.push(taskId);
      }
    }

    return readyTasks;
  }

  /**
   * Check if all dependencies for a task are satisfied
   * @param taskId - Task ID to check
   * @param graph - Task dependency graph
   * @returns True if dependencies satisfied, false otherwise
   */
  areDependenciesSatisfied(
    taskId: string,
    graph: TaskDependencyGraph
  ): boolean {
    const task = graph.nodes.get(taskId);
    if (!task) {
      return false;
    }

    // No dependencies = satisfied
    if (!task.dependencies || task.dependencies.length === 0) {
      return true;
    }

    // Check each dependency
    for (const depId of task.dependencies) {
      const depTask = graph.nodes.get(depId);

      // Dependency doesn't exist = not satisfied
      if (!depTask) {
        return false;
      }

      // Dependency not completed = not satisfied
      if (depTask.status !== 'completed') {
        return false;
      }
    }

    return true;
  }

  /**
   * Resolve dependencies and determine execution order
   * @param tasks - Array of investigation tasks
   * @returns Dependency resolution result
   */
  resolveDependencies(tasks: InvestigationTask[]): DependencyResolutionResult {
    const graph = this.buildDependencyGraph(tasks);
    const errors: string[] = [];
    const blockedTasks: string[] = [];

    // Detect cycles
    const cycles = this.detectCycles(graph);

    // Check for missing dependencies
    for (const [taskId, dependencies] of graph.edges.entries()) {
      for (const depId of dependencies) {
        if (!graph.nodes.has(depId)) {
          errors.push(
            `Task ${taskId} has missing dependency: ${depId}`
          );
          blockedTasks.push(taskId);
        }
      }
    }

    // If cycles exist, fail resolution
    if (cycles.length > 0) {
      return {
        success: false,
        executionOrder: [],
        cycles,
        blockedTasks,
        errors: [
          `Dependency graph contains ${cycles.length} cycle(s)`,
          ...errors,
        ],
      };
    }

    // If missing dependencies, fail resolution
    if (errors.length > 0) {
      return {
        success: false,
        executionOrder: [],
        cycles: [],
        blockedTasks,
        errors,
      };
    }

    // Perform topological sort
    try {
      const executionOrder = this.topologicalSort(graph);

      return {
        success: true,
        executionOrder,
        cycles: [],
        blockedTasks: [],
        errors: [],
      };
    } catch (error) {
      if (error instanceof CycleDetectionError) {
        return {
          success: false,
          executionOrder: [],
          cycles: error.cycles,
          blockedTasks: [],
          errors: [error.message],
        };
      }

      return {
        success: false,
        executionOrder: [],
        cycles: [],
        blockedTasks: [],
        errors: [(error as Error).message],
      };
    }
  }

  /**
   * Identify parallel execution opportunities
   * @param graph - Task dependency graph
   * @returns Array of task groups that can execute in parallel
   */
  identifyParallelGroups(graph: TaskDependencyGraph): string[][] {
    const parallelGroups: string[][] = [];
    const processed = new Set<string>();
    const executionOrder = this.topologicalSort(graph);

    for (const taskId of executionOrder) {
      if (processed.has(taskId)) {
        continue;
      }

      // Find all tasks at same level (no dependencies between them)
      const currentLevel: string[] = [taskId];
      processed.add(taskId);

      for (const otherId of executionOrder) {
        if (processed.has(otherId)) {
          continue;
        }

        // Check if tasks have no dependency relationship
        if (
          !this.hasDependencyPath(taskId, otherId, graph) &&
          !this.hasDependencyPath(otherId, taskId, graph)
        ) {
          currentLevel.push(otherId);
          processed.add(otherId);
        }
      }

      parallelGroups.push(currentLevel);
    }

    return parallelGroups;
  }

  /**
   * Check if there's a dependency path from task A to task B
   * @param fromId - Source task ID
   * @param toId - Target task ID
   * @param graph - Task dependency graph
   * @returns True if path exists, false otherwise
   */
  private hasDependencyPath(
    fromId: string,
    toId: string,
    graph: TaskDependencyGraph
  ): boolean {
    const visited = new Set<string>();
    const queue = [fromId];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === toId) {
        return true;
      }

      if (visited.has(current)) {
        continue;
      }

      visited.add(current);

      const dependencies = graph.edges.get(current) || [];
      for (const dep of dependencies) {
        if (!visited.has(dep)) {
          queue.push(dep);
        }
      }
    }

    return false;
  }

  /**
   * Calculate critical path (longest path through dependency graph)
   * @param graph - Task dependency graph
   * @returns Array of task IDs on critical path
   */
  calculateCriticalPath(graph: TaskDependencyGraph): string[] {
    const taskDurations = new Map<string, number>();

    // Get task durations (use estimated or default)
    for (const [taskId, task] of graph.nodes.entries()) {
      taskDurations.set(
        taskId,
        task.metadata.estimatedDuration || 60000 // Default: 1 minute
      );
    }

    // Calculate earliest start times
    const earliestStart = new Map<string, number>();
    const executionOrder = this.topologicalSort(graph);

    for (const taskId of executionOrder) {
      let maxEndTime = 0;

      const dependencies = graph.edges.get(taskId) || [];
      for (const depId of dependencies) {
        const depStart = earliestStart.get(depId) || 0;
        const depDuration = taskDurations.get(depId) || 0;
        maxEndTime = Math.max(maxEndTime, depStart + depDuration);
      }

      earliestStart.set(taskId, maxEndTime);
    }

    // Find task with maximum end time (end of critical path)
    let maxEndTime = 0;
    let endTask = '';

    for (const [taskId, startTime] of earliestStart.entries()) {
      const duration = taskDurations.get(taskId) || 0;
      const endTime = startTime + duration;

      if (endTime > maxEndTime) {
        maxEndTime = endTime;
        endTask = taskId;
      }
    }

    // Backtrack to find critical path
    const criticalPath: string[] = [];
    let current = endTask;

    while (current) {
      criticalPath.unshift(current);

      const currentStart = earliestStart.get(current) || 0;
      let predecessor = '';

      const dependencies = graph.edges.get(current) || [];
      for (const depId of dependencies) {
        const depStart = earliestStart.get(depId) || 0;
        const depDuration = taskDurations.get(depId) || 0;

        if (depStart + depDuration === currentStart) {
          predecessor = depId;
          break;
        }
      }

      current = predecessor;
    }

    return criticalPath;
  }

  /**
   * Validate task dependency graph
   * @param tasks - Array of investigation tasks
   * @returns Validation result with errors
   */
  validateGraph(
    tasks: InvestigationTask[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const taskIds = new Set(tasks.map((t) => t.id));

    // Check for duplicate task IDs
    const duplicates = new Set<string>();
    const seen = new Set<string>();

    for (const task of tasks) {
      if (seen.has(task.id)) {
        duplicates.add(task.id);
      }
      seen.add(task.id);
    }

    if (duplicates.size > 0) {
      errors.push(
        `Duplicate task IDs found: ${Array.from(duplicates).join(', ')}`
      );
    }

    // Check for missing dependencies
    for (const task of tasks) {
      for (const depId of task.dependencies || []) {
        if (!taskIds.has(depId)) {
          errors.push(
            `Task ${task.id} has missing dependency: ${depId}`
          );
        }
      }
    }

    // Check for self-dependencies
    for (const task of tasks) {
      if (task.dependencies?.includes(task.id)) {
        errors.push(`Task ${task.id} depends on itself`);
      }
    }

    // Check for cycles
    const graph = this.buildDependencyGraph(tasks);
    const cycles = this.detectCycles(graph);

    if (cycles.length > 0) {
      errors.push(
        `Dependency cycles detected: ${cycles.map((c) => c.join(' → ')).join(', ')}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
