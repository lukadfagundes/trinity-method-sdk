/**
 * Investigation Template Base Class
 *
 * Defines the structure and behavior of investigation templates.
 * Templates generate tasks, define scope, and configure investigations.
 *
 * @module wizard/templates/InvestigationTemplate
 * @version 1.0.0
 */

import {
  InvestigationTask,
  InvestigationType,
  AgentType,
  TaskPriority,
  SuccessCriterion,
  InvestigationContext,
} from '@shared/types';

/**
 * Template generation context
 */
export interface TemplateContext {
  /** Investigation ID */
  investigationId: string;

  /** Investigation scope */
  scope: string[];

  /** Agents to use */
  agents: AgentType[];

  /** Codebase context */
  context: InvestigationContext;

  /** Custom options */
  customOptions?: Record<string, any>;
}

/**
 * Task template definition
 */
export interface TaskTemplate {
  /** Task ID template */
  id: string;

  /** Task description */
  description: string;

  /** Agent type */
  agentType: AgentType;

  /** Task priority */
  priority: TaskPriority;

  /** Dependencies (task IDs) */
  dependencies: string[];

  /** Estimated duration (ms) */
  estimatedDuration?: number;

  /** Timeout (ms) */
  timeout?: number;

  /** Can retry */
  canRetry?: boolean;

  /** Max retries */
  maxRetries?: number;
}

/**
 * Base class for investigation templates
 */
export abstract class InvestigationTemplate {
  /** Template ID */
  abstract readonly id: string;

  /** Template name */
  abstract readonly name: string;

  /** Template description */
  abstract readonly description: string;

  /** Investigation type */
  abstract readonly type: InvestigationType;

  /** Focus areas */
  abstract readonly focusAreas: string[];

  /** Default exclusions */
  abstract readonly defaultExclusions: string[];

  /** Estimated duration (ms) */
  abstract readonly estimatedDuration: number;

  /** Success criteria */
  abstract readonly successCriteria: SuccessCriterion[];

  /** Task templates */
  protected abstract taskTemplates: TaskTemplate[];

  /**
   * Generate investigation tasks from template
   * @param context - Template context
   * @returns Array of investigation tasks
   */
  generateTasks(context: TemplateContext): InvestigationTask[] {
    const tasks: InvestigationTask[] = [];

    for (const template of this.taskTemplates) {
      // Substitute variables in task ID and description
      const taskId = this.substituteVariables(template.id, context);
      const description = this.substituteVariables(template.description, context);

      // Create investigation task
      const task: InvestigationTask = {
        id: taskId,
        description,
        agentType: template.agentType,
        priority: template.priority,
        dependencies: template.dependencies.map((dep) =>
          this.substituteVariables(dep, context)
        ),
        status: 'pending',
        retryCount: 0,
        metadata: {
          investigationId: context.investigationId,
          estimatedDuration: template.estimatedDuration || 300000, // 5 min default
          timeout: template.timeout || 600000, // 10 min default
          canRetry: template.canRetry ?? true,
          maxRetries: template.maxRetries || 3,
          customData: {
            templateId: this.id,
            scope: context.scope,
          },
        },
      };

      tasks.push(task);
    }

    return tasks;
  }

  /**
   * Substitute variables in string
   * @param template - Template string with {{variables}}
   * @param context - Template context
   * @returns Substituted string
   */
  protected substituteVariables(
    template: string,
    context: TemplateContext
  ): string {
    let result = template;

    // Replace {{investigationId}}
    result = result.replace(/\{\{investigationId\}\}/g, context.investigationId);

    // Replace {{framework}}
    result = result.replace(/\{\{framework\}\}/g, context.context.framework);

    // Replace {{language}}
    result = result.replace(/\{\{language\}\}/g, context.context.language);

    // Replace {{testingFramework}}
    result = result.replace(
      /\{\{testingFramework\}\}/g,
      context.context.testingFramework
    );

    // Replace custom options
    if (context.customOptions) {
      for (const [key, value] of Object.entries(context.customOptions)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, String(value));
      }
    }

    return result;
  }

  /**
   * Validate template context
   * @param context - Template context
   * @returns Validation result
   */
  validateContext(context: TemplateContext): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!context.investigationId) {
      errors.push('Investigation ID is required');
    }

    if (!context.scope || context.scope.length === 0) {
      errors.push('Investigation scope is required');
    }

    if (!context.agents || context.agents.length === 0) {
      errors.push('At least one agent is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get template metadata
   * @returns Template metadata
   */
  getMetadata(): {
    id: string;
    name: string;
    description: string;
    type: InvestigationType;
    estimatedDuration: number;
    taskCount: number;
  } {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      estimatedDuration: this.estimatedDuration,
      taskCount: this.taskTemplates.length,
    };
  }

  /**
   * Customize template for specific framework
   * @param framework - Framework name
   * @returns Modified template
   */
  protected customizeForFramework(framework: string): void {
    // Override in subclasses to add framework-specific tasks
  }

  /**
   * Add custom task
   * @param taskTemplate - Task template
   */
  protected addTask(taskTemplate: TaskTemplate): void {
    this.taskTemplates.push(taskTemplate);
  }

  /**
   * Remove task by ID
   * @param taskId - Task ID
   */
  protected removeTask(taskId: string): void {
    this.taskTemplates = this.taskTemplates.filter((t) => t.id !== taskId);
  }

  /**
   * Get task dependencies graph
   * @returns Dependency map
   */
  getDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();

    for (const task of this.taskTemplates) {
      graph.set(task.id, task.dependencies);
    }

    return graph;
  }

  /**
   * Calculate critical path
   * @returns Array of task IDs on critical path
   */
  getCriticalPath(): string[] {
    const graph = this.getDependencyGraph();
    const durations = new Map<string, number>();

    // Build duration map
    for (const task of this.taskTemplates) {
      durations.set(task.id, task.estimatedDuration || 300000);
    }

    // Calculate earliest start times
    const earliestStart = new Map<string, number>();
    const visited = new Set<string>();

    const calculateEarliest = (taskId: string): number => {
      if (earliestStart.has(taskId)) {
        return earliestStart.get(taskId)!;
      }

      if (visited.has(taskId)) {
        return 0; // Cycle detected
      }

      visited.add(taskId);

      const deps = graph.get(taskId) || [];
      let maxEndTime = 0;

      for (const dep of deps) {
        const depStart = calculateEarliest(dep);
        const depDuration = durations.get(dep) || 0;
        maxEndTime = Math.max(maxEndTime, depStart + depDuration);
      }

      earliestStart.set(taskId, maxEndTime);
      return maxEndTime;
    };

    // Calculate for all tasks
    for (const taskId of graph.keys()) {
      calculateEarliest(taskId);
    }

    // Find task with maximum end time
    let maxEndTime = 0;
    let endTask = '';

    for (const [taskId, startTime] of earliestStart.entries()) {
      const duration = durations.get(taskId) || 0;
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

      const deps = graph.get(current) || [];
      for (const dep of deps) {
        const depStart = earliestStart.get(dep) || 0;
        const depDuration = durations.get(dep) || 0;

        if (depStart + depDuration === currentStart) {
          predecessor = dep;
          break;
        }
      }

      current = predecessor;
    }

    return criticalPath;
  }
}
