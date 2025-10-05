/**
 * Unit Tests: Dependency Resolver
 * Tests for topological sorting, cycle detection, and dependency validation
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { DependencyResolver } from '../../src/coordination/DependencyResolver';
import {
  InvestigationTask,
  TaskDependencyGraph,
  CycleDetectionError,
} from '@shared/types';

describe('DependencyResolver', () => {
  let resolver: DependencyResolver;

  beforeEach(() => {
    resolver = new DependencyResolver();
  });

  describe('buildDependencyGraph', () => {
    it('should build graph with root tasks', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task1'], 'INO', 'medium'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);

      expect(graph.nodes.size).toBe(3);
      expect(graph.roots).toContain('task1');
      expect(graph.roots.length).toBe(1);
      expect(graph.edges.get('task2')).toEqual(['task1']);
    });

    it('should identify multiple root tasks', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', [], 'ZEN', 'high'),
        createTask('task3', ['task1', 'task2'], 'JUNO', 'critical'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);

      expect(graph.roots).toHaveLength(2);
      expect(graph.roots).toContain('task1');
      expect(graph.roots).toContain('task2');
    });
  });

  describe('detectCycles', () => {
    it('should detect simple cycle', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['task2'], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'high'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const cycles = resolver.detectCycles(graph);

      expect(cycles.length).toBeGreaterThan(0);
      expect(cycles[0]).toContain('task1');
      expect(cycles[0]).toContain('task2');
    });

    it('should detect complex cycle', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['task3'], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task2'], 'INO', 'medium'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const cycles = resolver.detectCycles(graph);

      expect(cycles.length).toBeGreaterThan(0);
      expect(cycles[0].length).toBe(3);
    });

    it('should return empty array for acyclic graph', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task2'], 'INO', 'medium'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const cycles = resolver.detectCycles(graph);

      expect(cycles).toEqual([]);
    });
  });

  describe('topologicalSort', () => {
    it('should sort linear dependency chain', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task2'], 'INO', 'medium'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const order = resolver.topologicalSort(graph);

      expect(order).toEqual(['task1', 'task2', 'task3']);
    });

    it('should sort diamond dependency pattern', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task1'], 'INO', 'medium'),
        createTask('task4', ['task2', 'task3'], 'JUNO', 'high'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const order = resolver.topologicalSort(graph);

      expect(order[0]).toBe('task1');
      expect(order[3]).toBe('task4');
      expect(order.indexOf('task2')).toBeLessThan(order.indexOf('task4'));
      expect(order.indexOf('task3')).toBeLessThan(order.indexOf('task4'));
    });

    it('should throw on cyclic graph', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['task2'], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'high'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);

      expect(() => resolver.topologicalSort(graph)).toThrow(
        CycleDetectionError
      );
    });
  });

  describe('getNextReadyTasks', () => {
    it('should return tasks with satisfied dependencies', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high', 'completed'),
        createTask('task2', ['task1'], 'ZEN', 'medium', 'pending'),
        createTask('task3', ['task1'], 'INO', 'medium', 'pending'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const ready = resolver.getNextReadyTasks(graph);

      expect(ready).toHaveLength(2);
      expect(ready).toContain('task2');
      expect(ready).toContain('task3');
    });

    it('should not return tasks with unsatisfied dependencies', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high', 'in-progress'),
        createTask('task2', ['task1'], 'ZEN', 'medium', 'pending'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const ready = resolver.getNextReadyTasks(graph);

      expect(ready).toHaveLength(0);
    });
  });

  describe('areDependenciesSatisfied', () => {
    it('should return true for tasks with no dependencies', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const satisfied = resolver.areDependenciesSatisfied('task1', graph);

      expect(satisfied).toBe(true);
    });

    it('should return true when all dependencies completed', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high', 'completed'),
        createTask('task2', ['task1'], 'ZEN', 'medium', 'pending'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const satisfied = resolver.areDependenciesSatisfied('task2', graph);

      expect(satisfied).toBe(true);
    });

    it('should return false when dependencies incomplete', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high', 'in-progress'),
        createTask('task2', ['task1'], 'ZEN', 'medium', 'pending'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const satisfied = resolver.areDependenciesSatisfied('task2', graph);

      expect(satisfied).toBe(false);
    });
  });

  describe('resolveDependencies', () => {
    it('should successfully resolve valid graph', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task2'], 'INO', 'medium'),
      ];

      const result = resolver.resolveDependencies(tasks);

      expect(result.success).toBe(true);
      expect(result.executionOrder).toEqual(['task1', 'task2', 'task3']);
      expect(result.cycles).toEqual([]);
      expect(result.errors).toEqual([]);
    });

    it('should fail on cyclic dependencies', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['task2'], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'high'),
      ];

      const result = resolver.resolveDependencies(tasks);

      expect(result.success).toBe(false);
      expect(result.cycles.length).toBeGreaterThan(0);
    });

    it('should fail on missing dependencies', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['missing-task'], 'TAN', 'high'),
      ];

      const result = resolver.resolveDependencies(tasks);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.blockedTasks).toContain('task1');
    });
  });

  describe('identifyParallelGroups', () => {
    it('should identify independent parallel tasks', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', [], 'ZEN', 'high'),
        createTask('task3', [], 'INO', 'high'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const groups = resolver.identifyParallelGroups(graph);

      expect(groups.length).toBe(1);
      expect(groups[0].length).toBe(3);
    });

    it('should group parallel tasks correctly', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task1'], 'INO', 'medium'),
        createTask('task4', ['task2', 'task3'], 'JUNO', 'high'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const groups = resolver.identifyParallelGroups(graph);

      expect(groups.length).toBe(3);
      expect(groups[0]).toEqual(['task1']);
      expect(groups[1]).toHaveLength(2);
      expect(groups[2]).toEqual(['task4']);
    });
  });

  describe('calculateCriticalPath', () => {
    it('should calculate critical path for linear chain', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
        createTask('task3', ['task2'], 'INO', 'medium'),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const criticalPath = resolver.calculateCriticalPath(graph);

      expect(criticalPath).toEqual(['task1', 'task2', 'task3']);
    });

    it('should identify longest path in complex graph', () => {
      const tasks: InvestigationTask[] = [
        createTaskWithDuration('task1', [], 'TAN', 'high', 10000),
        createTaskWithDuration('task2', ['task1'], 'ZEN', 'medium', 5000),
        createTaskWithDuration('task3', ['task1'], 'INO', 'medium', 15000),
        createTaskWithDuration('task4', ['task2', 'task3'], 'JUNO', 'high', 5000),
      ];

      const graph = resolver.buildDependencyGraph(tasks);
      const criticalPath = resolver.calculateCriticalPath(graph);

      // Longest path: task1 (10s) → task3 (15s) → task4 (5s) = 30s
      expect(criticalPath).toContain('task1');
      expect(criticalPath).toContain('task3');
      expect(criticalPath).toContain('task4');
    });
  });

  describe('validateGraph', () => {
    it('should validate correct graph', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'medium'),
      ];

      const validation = resolver.validateGraph(tasks);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect duplicate task IDs', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', [], 'TAN', 'high'),
        createTask('task1', [], 'ZEN', 'medium'),
      ];

      const validation = resolver.validateGraph(tasks);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toContain('Duplicate');
    });

    it('should detect self-dependencies', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['task1'], 'TAN', 'high'),
      ];

      const validation = resolver.validateGraph(tasks);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toContain('depends on itself');
    });

    it('should detect missing dependencies', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['nonexistent'], 'TAN', 'high'),
      ];

      const validation = resolver.validateGraph(tasks);

      expect(validation.valid).toBe(false);
      expect(validation.errors[0]).toContain('missing dependency');
    });

    it('should detect cycles', () => {
      const tasks: InvestigationTask[] = [
        createTask('task1', ['task2'], 'TAN', 'high'),
        createTask('task2', ['task1'], 'ZEN', 'high'),
      ];

      const validation = resolver.validateGraph(tasks);

      expect(validation.valid).toBe(false);
      expect(validation.errors.some((e) => e.includes('cycle'))).toBe(true);
    });
  });
});

// Helper functions
function createTask(
  id: string,
  dependencies: string[],
  agentType: 'TAN' | 'ZEN' | 'INO' | 'JUNO',
  priority: 'critical' | 'high' | 'medium' | 'low',
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'blocked' = 'pending'
): InvestigationTask {
  return {
    id,
    description: `Task ${id}`,
    agentType,
    priority,
    dependencies,
    status,
    retryCount: 0,
    metadata: {
      investigationId: 'test-investigation',
      canRetry: true,
      maxRetries: 3,
    },
  };
}

function createTaskWithDuration(
  id: string,
  dependencies: string[],
  agentType: 'TAN' | 'ZEN' | 'INO' | 'JUNO',
  priority: 'critical' | 'high' | 'medium' | 'low',
  estimatedDuration: number
): InvestigationTask {
  return {
    id,
    description: `Task ${id}`,
    agentType,
    priority,
    dependencies,
    status: 'pending',
    retryCount: 0,
    metadata: {
      investigationId: 'test-investigation',
      estimatedDuration,
      canRetry: true,
      maxRetries: 3,
    },
  };
}
