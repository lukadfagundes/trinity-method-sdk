/**
 * AJ MAESTRO - Workflow Plan Generator
 *
 * @see types.ts - Workflow type definitions
 * @see WorkflowVisualizer.ts - Visualization implementation
 * @see docs/workflows/deploy-workflow.md - Workflow documentation
 *
 * **Trinity Principle:** "Investigation-First Development"
 * AJ MAESTRO generates comprehensive workflow plans that enforce investigation before
 * implementation. By creating structured plans with phases, tasks, dependencies, and
 * stop points, AJ ensures developers understand the complete investigation scope
 * before executing a single command.
 *
 * **Why This Exists:**
 * Traditional development jumps straight to coding without investigation. Trinity Method
 * enforces investigation-first through scale-based workflow generation. AJ MAESTRO
 * analyzes investigation requirements and generates complete execution plans with:
 * - Scale-based stop points (SMALL: 0, MEDIUM: 2, LARGE: 4)
 * - Agent assignments for each task
 * - Dependency tracking and parallelization
 * - Time estimates with optimization calculations
 * - Quality gates enforced by BAS
 *
 * @module coordination/AJMaestro
 */

import { v4 as uuidv4 } from 'uuid';
import {
  WorkflowPlan,
  PhaseInfo,
  TaskInfo,
  InvestigationScale,
  TaskStatus,
  TaskPriority,
} from './types.js';

/**
 * Investigation requirements for workflow generation
 */
export interface InvestigationRequirements {
  /** Investigation title */
  title: string;

  /** Investigation type (bug, feature, performance, security, technical) */
  type: 'bug' | 'feature' | 'performance' | 'security' | 'technical';

  /** Investigation scale (determines stop points and phases) */
  scale: InvestigationScale;

  /** Estimated complexity (1-10) */
  complexity: number;

  /** Files affected by this investigation */
  files?: string[];

  /** Dependencies on other investigations */
  dependencies?: string[];

  /** Special requirements or constraints */
  constraints?: string[];
}

/**
 * Generate complete workflow plan from investigation requirements
 *
 * Creates scale-based workflow with appropriate phases, stop points, and agent assignments.
 * Calculates time estimates and parallelization opportunities.
 *
 * @param requirements - Investigation requirements
 * @returns Complete workflow plan ready for visualization and execution
 *
 * @example
 * ```typescript
 * const plan = generateWorkflowPlan({
 *   title: 'Implement user authentication',
 *   type: 'feature',
 *   scale: InvestigationScale.MEDIUM,
 *   complexity: 6,
 *   files: ['src/auth/', 'src/middleware/'],
 * });
 *
 * console.log(`Phases: ${plan.phases.length}`);
 * console.log(`Stop Points: ${plan.stopPoints}`);
 * console.log(`Estimated: ${plan.totalEstimatedHours}h`);
 * console.log(`Optimized: ${plan.optimizedHours}h`);
 * ```
 */
export function generateWorkflowPlan(
  requirements: InvestigationRequirements
): WorkflowPlan {
  console.log(`[AJ MAESTRO] Generating workflow plan for: ${requirements.title}`);
  console.log(`[AJ MAESTRO] Scale: ${requirements.scale}, Type: ${requirements.type}`);

  const phases = generatePhases(requirements);
  const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const totalEstimatedHours = phases.reduce(
    (sum, phase) => sum + phase.estimatedHours,
    0
  );

  // Calculate parallelization savings
  const optimizedHours = calculateOptimizedHours(phases);
  const timeSavingsPercent =
    totalEstimatedHours > 0
      ? ((totalEstimatedHours - optimizedHours) / totalEstimatedHours) * 100
      : 0;

  // Count stop points
  const stopPoints = phases.filter((phase) => phase.isStopPoint).length;

  // Collect unique agents
  const agents = Array.from(
    new Set(phases.flatMap((phase) => phase.tasks.map((task) => task.agent)))
  );

  const plan: WorkflowPlan = {
    id: uuidv4(),
    title: requirements.title,
    scale: requirements.scale,
    phases,
    totalEstimatedHours,
    optimizedHours,
    timeSavingsPercent,
    totalTasks,
    stopPoints,
    agents,
    createdAt: new Date(),
    status: TaskStatus.PENDING,
  };

  console.log(`[AJ MAESTRO] Plan generated:`);
  console.log(`  - ${phases.length} phases`);
  console.log(`  - ${totalTasks} tasks`);
  console.log(`  - ${stopPoints} stop points`);
  console.log(`  - ${totalEstimatedHours.toFixed(1)}h estimated`);
  console.log(`  - ${optimizedHours.toFixed(1)}h optimized (${timeSavingsPercent.toFixed(1)}% savings)`);

  return plan;
}

/**
 * Generate phases based on investigation scale and type
 *
 * Creates appropriate phase structure with stop points:
 * - SMALL: 2-3 phases (Investigation → Implementation), 0 stop points
 * - MEDIUM: 3-4 phases (Requirements → Design → Implementation → Review), 2 stop points
 * - LARGE: 5-6 phases (Requirements → Design → Planning → Implementation → Testing → Review), 4 stop points
 *
 * @param requirements - Investigation requirements
 * @returns Array of phases with tasks and stop points
 */
export function generatePhases(
  requirements: InvestigationRequirements
): PhaseInfo[] {
  const { scale, type, complexity, files } = requirements;

  console.log(`[AJ MAESTRO] Generating phases for ${scale} scale investigation`);

  switch (scale) {
    case InvestigationScale.SMALL:
      return generateSmallScalePhases(type, complexity, files);
    case InvestigationScale.MEDIUM:
      return generateMediumScalePhases(type, complexity, files);
    case InvestigationScale.LARGE:
      return generateLargeScalePhases(type, complexity, files);
    default:
      throw new Error(`Unknown investigation scale: ${scale}`);
  }
}

/**
 * Generate SMALL scale phases (0 stop points)
 *
 * Fast iteration for simple investigations:
 * - Phase 1: Investigation
 * - Phase 2: Implementation with BAS quality gate
 */
function generateSmallScalePhases(
  type: string,
  complexity: number,
  files?: string[]
): PhaseInfo[] {
  const phases: PhaseInfo[] = [];

  // Phase 1: Investigation
  phases.push({
    phaseNumber: 1,
    name: 'Investigation',
    description: 'Quick investigation and planning',
    tasks: [
      createTask({
        name: 'Analyze requirements',
        agent: 'MON',
        estimatedHours: 0.5,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        files,
      }),
      createTask({
        name: 'Create implementation plan',
        agent: 'TRA',
        estimatedHours: 0.5,
        priority: TaskPriority.MEDIUM,
        parallelizable: false,
        dependencies: ['task-1'],
        files,
      }),
    ],
    estimatedHours: 1.0,
    isStopPoint: false,
    status: TaskStatus.PENDING,
  });

  // Phase 2: Implementation
  phases.push({
    phaseNumber: 2,
    name: 'Implementation',
    description: 'Direct implementation with quality gates',
    tasks: [
      createTask({
        name: `Implement ${type} changes`,
        agent: 'KIL',
        estimatedHours: complexity * 0.5,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-2'],
        qualityGates: ['BAS Phase 1-6'],
        files,
      }),
    ],
    estimatedHours: complexity * 0.5,
    isStopPoint: false,
    status: TaskStatus.PENDING,
  });

  console.log(`[AJ MAESTRO] Generated ${phases.length} phases for SMALL scale`);
  return phases;
}

/**
 * Generate MEDIUM scale phases (2 stop points)
 *
 * Balanced investigation with stop points:
 * - Phase 1: Requirements Analysis
 * - Phase 2: Design (STOP POINT 1)
 * - Phase 3: Implementation
 * - Phase 4: Review (STOP POINT 2)
 */
function generateMediumScalePhases(
  type: string,
  complexity: number,
  files?: string[]
): PhaseInfo[] {
  const phases: PhaseInfo[] = [];

  // Phase 1: Requirements Analysis
  phases.push({
    phaseNumber: 1,
    name: 'Requirements Analysis',
    description: 'Comprehensive requirements gathering',
    tasks: [
      createTask({
        name: 'Analyze functional requirements',
        agent: 'MON',
        estimatedHours: 1.0,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        files,
      }),
      createTask({
        name: 'Analyze non-functional requirements',
        agent: 'MON',
        estimatedHours: 1.0,
        priority: TaskPriority.MEDIUM,
        parallelizable: true,
        files,
      }),
    ],
    estimatedHours: 1.5, // Parallelization reduces to 1.5h
    isStopPoint: false,
    status: TaskStatus.PENDING,
  });

  // Phase 2: Design (STOP POINT 1)
  phases.push({
    phaseNumber: 2,
    name: 'Technical Design',
    description: 'Create technical design and architecture decisions',
    tasks: [
      createTask({
        name: 'Create technical design',
        agent: 'ROR',
        estimatedHours: 2.0,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-1', 'task-2'],
        files,
      }),
      createTask({
        name: 'Document architecture decisions',
        agent: 'ROR',
        estimatedHours: 1.0,
        priority: TaskPriority.MEDIUM,
        parallelizable: false,
        dependencies: ['task-3'],
        files,
      }),
    ],
    estimatedHours: 3.0,
    isStopPoint: true,
    stopPointCriteria: [
      'Design approved by user',
      'Architecture decisions documented',
      'Technical approach validated',
    ],
    status: TaskStatus.PENDING,
  });

  // Phase 3: Implementation
  phases.push({
    phaseNumber: 3,
    name: 'Implementation',
    description: 'Execute implementation with quality gates',
    tasks: [
      createTask({
        name: 'Decompose into atomic tasks',
        agent: 'EUS',
        estimatedHours: 0.5,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-4'],
        files,
      }),
      createTask({
        name: `Implement ${type} functionality`,
        agent: 'KIL',
        estimatedHours: complexity * 0.8,
        priority: TaskPriority.CRITICAL,
        parallelizable: false,
        dependencies: ['task-5'],
        qualityGates: ['BAS Phase 1-6'],
        files,
      }),
    ],
    estimatedHours: 0.5 + complexity * 0.8,
    isStopPoint: false,
    status: TaskStatus.PENDING,
  });

  // Phase 4: Review (STOP POINT 2)
  phases.push({
    phaseNumber: 4,
    name: 'Code Review',
    description: 'Comprehensive review and approval',
    tasks: [
      createTask({
        name: 'Review implementation against design',
        agent: 'DRA',
        estimatedHours: 1.5,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-6'],
        files,
      }),
      createTask({
        name: 'Document API and comments',
        agent: 'APO',
        estimatedHours: 1.0,
        priority: TaskPriority.MEDIUM,
        parallelizable: true,
        dependencies: ['task-6'],
        files,
      }),
    ],
    estimatedHours: 1.5, // Parallelization reduces review time
    isStopPoint: true,
    stopPointCriteria: [
      'Code review approved',
      'All quality gates passed',
      'Documentation complete',
    ],
    status: TaskStatus.PENDING,
  });

  console.log(`[AJ MAESTRO] Generated ${phases.length} phases for MEDIUM scale`);
  return phases;
}

/**
 * Generate LARGE scale phases (4 stop points)
 *
 * Comprehensive investigation with full oversight:
 * - Phase 1: Requirements Analysis (STOP POINT 1)
 * - Phase 2: Technical Design (STOP POINT 2)
 * - Phase 3: Implementation Planning (STOP POINT 3)
 * - Phase 4: Implementation
 * - Phase 5: Testing
 * - Phase 6: Final Review (STOP POINT 4)
 */
function generateLargeScalePhases(
  type: string,
  complexity: number,
  files?: string[]
): PhaseInfo[] {
  const phases: PhaseInfo[] = [];

  // Phase 1: Requirements Analysis (STOP POINT 1)
  phases.push({
    phaseNumber: 1,
    name: 'Requirements Analysis',
    description: 'Comprehensive requirements gathering and validation',
    tasks: [
      createTask({
        name: 'Analyze functional requirements',
        agent: 'MON',
        estimatedHours: 2.0,
        priority: TaskPriority.CRITICAL,
        parallelizable: false,
        files,
      }),
      createTask({
        name: 'Analyze non-functional requirements',
        agent: 'MON',
        estimatedHours: 2.0,
        priority: TaskPriority.HIGH,
        parallelizable: true,
        files,
      }),
      createTask({
        name: 'Identify constraints and risks',
        agent: 'MON',
        estimatedHours: 1.5,
        priority: TaskPriority.HIGH,
        parallelizable: true,
        files,
      }),
    ],
    estimatedHours: 3.0, // Parallelization: 2h + max(2h, 1.5h) = 3h
    isStopPoint: true,
    stopPointCriteria: [
      'All requirements documented',
      'Constraints identified',
      'User approval obtained',
    ],
    status: TaskStatus.PENDING,
  });

  // Phase 2: Technical Design (STOP POINT 2)
  phases.push({
    phaseNumber: 2,
    name: 'Technical Design',
    description: 'Create comprehensive technical design and ADRs',
    tasks: [
      createTask({
        name: 'Design system architecture',
        agent: 'ROR',
        estimatedHours: 3.0,
        priority: TaskPriority.CRITICAL,
        parallelizable: false,
        dependencies: ['task-1', 'task-2', 'task-3'],
        files,
      }),
      createTask({
        name: 'Document architecture decisions (ADRs)',
        agent: 'ROR',
        estimatedHours: 2.0,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-4'],
        files,
      }),
      createTask({
        name: 'Design database schema',
        agent: 'ROR',
        estimatedHours: 1.5,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-4'],
        files,
      }),
    ],
    estimatedHours: 6.5,
    isStopPoint: true,
    stopPointCriteria: [
      'Architecture design approved',
      'ADRs documented',
      'Technical approach validated',
    ],
    status: TaskStatus.PENDING,
  });

  // Phase 3: Implementation Planning (STOP POINT 3)
  phases.push({
    phaseNumber: 3,
    name: 'Implementation Planning',
    description: 'Break down work and create detailed execution plan',
    tasks: [
      createTask({
        name: 'Create implementation plan',
        agent: 'TRA',
        estimatedHours: 2.0,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-5', 'task-6'],
        files,
      }),
      createTask({
        name: 'Decompose into atomic tasks',
        agent: 'EUS',
        estimatedHours: 1.5,
        priority: TaskPriority.HIGH,
        parallelizable: false,
        dependencies: ['task-7'],
        files,
      }),
    ],
    estimatedHours: 3.5,
    isStopPoint: true,
    stopPointCriteria: [
      'Implementation plan approved',
      'Tasks decomposed and prioritized',
      'Dependencies identified',
    ],
    status: TaskStatus.PENDING,
  });

  // Phase 4: Implementation
  phases.push({
    phaseNumber: 4,
    name: 'Implementation',
    description: 'Execute implementation with BAS quality gates',
    tasks: [
      createTask({
        name: `Implement core ${type} functionality`,
        agent: 'KIL',
        estimatedHours: complexity * 1.2,
        priority: TaskPriority.CRITICAL,
        parallelizable: false,
        dependencies: ['task-8', 'task-9'],
        qualityGates: ['BAS Phase 1-6'],
        files,
      }),
      createTask({
        name: 'Configure environment and dependencies',
        agent: 'CAP',
        estimatedHours: 1.0,
        priority: TaskPriority.MEDIUM,
        parallelizable: true,
        dependencies: ['task-8'],
        files,
      }),
      createTask({
        name: 'Update and audit dependencies',
        agent: 'BON',
        estimatedHours: 1.0,
        priority: TaskPriority.MEDIUM,
        parallelizable: true,
        dependencies: ['task-8'],
        files,
      }),
    ],
    estimatedHours: complexity * 1.2 + 1.0, // Parallelization: KIL + max(CAP, BON)
    isStopPoint: false,
    status: TaskStatus.PENDING,
  });

  // Phase 5: Testing
  phases.push({
    phaseNumber: 5,
    name: 'Comprehensive Testing',
    description: 'Execute full test suite with coverage validation',
    tasks: [
      createTask({
        name: 'Unit and integration testing',
        agent: 'BAS',
        estimatedHours: 2.0,
        priority: TaskPriority.CRITICAL,
        parallelizable: false,
        dependencies: ['task-10'],
        qualityGates: ['BAS Phase 4-5'],
        files,
      }),
      createTask({
        name: 'Performance testing',
        agent: 'BAS',
        estimatedHours: 1.5,
        priority: TaskPriority.HIGH,
        parallelizable: true,
        dependencies: ['task-10'],
        files,
      }),
    ],
    estimatedHours: 2.0, // Parallelization: max(2.0, 1.5) = 2.0h
    isStopPoint: false,
    status: TaskStatus.PENDING,
  });

  // Phase 6: Final Review (STOP POINT 4)
  phases.push({
    phaseNumber: 6,
    name: 'Final Review',
    description: 'Comprehensive review and documentation',
    tasks: [
      createTask({
        name: 'Code review and design compliance',
        agent: 'DRA',
        estimatedHours: 2.5,
        priority: TaskPriority.CRITICAL,
        parallelizable: false,
        dependencies: ['task-13', 'task-14'],
        files,
      }),
      createTask({
        name: 'API documentation and inline comments',
        agent: 'APO',
        estimatedHours: 2.0,
        priority: TaskPriority.HIGH,
        parallelizable: true,
        dependencies: ['task-13'],
        files,
      }),
      createTask({
        name: 'Technical debt assessment',
        agent: 'URO',
        estimatedHours: 1.5,
        priority: TaskPriority.MEDIUM,
        parallelizable: true,
        dependencies: ['task-13'],
        files,
      }),
    ],
    estimatedHours: 2.5, // Parallelization: DRA + max(APO, URO)
    isStopPoint: true,
    stopPointCriteria: [
      'Code review approved by DRA',
      'All quality gates passed',
      'Documentation complete',
      'Technical debt documented',
      'User approval obtained',
    ],
    status: TaskStatus.PENDING,
  });

  console.log(`[AJ MAESTRO] Generated ${phases.length} phases for LARGE scale`);
  return phases;
}

/**
 * Calculate optimized hours with parallelization
 *
 * Identifies tasks that can run in parallel within each phase and calculates
 * actual execution time considering parallelization opportunities.
 *
 * @param phases - Array of phases with tasks
 * @returns Optimized execution time in hours
 */
function calculateOptimizedHours(phases: PhaseInfo[]): number {
  let optimizedTotal = 0;

  for (const phase of phases) {
    // Group tasks by dependency level
    const levels = groupTasksByDependencyLevel(phase.tasks);

    // Calculate time for each level (tasks at same level run in parallel)
    for (const levelTasks of levels) {
      const maxTimeInLevel = Math.max(
        ...levelTasks.map((task) => task.estimatedHours)
      );
      optimizedTotal += maxTimeInLevel;
    }
  }

  return optimizedTotal;
}

/**
 * Group tasks by dependency level for parallelization analysis
 *
 * Tasks with no dependencies are at level 0.
 * Tasks depending only on level 0 tasks are at level 1, etc.
 *
 * @param tasks - Array of tasks to group
 * @returns Array of task groups by dependency level
 */
function groupTasksByDependencyLevel(tasks: TaskInfo[]): TaskInfo[][] {
  const levels: TaskInfo[][] = [];
  const taskMap = new Map<string, TaskInfo>();
  const taskLevels = new Map<string, number>();

  // Build task map
  for (const task of tasks) {
    taskMap.set(task.id, task);
  }

  // Calculate level for each task
  function getTaskLevel(task: TaskInfo, visited: Set<string> = new Set()): number {
    if (taskLevels.has(task.id)) {
      return taskLevels.get(task.id)!;
    }

    // Detect circular dependencies
    if (visited.has(task.id)) {
      console.warn(`[AJ MAESTRO] Circular dependency detected for task: ${task.id}`);
      return 0;
    }

    visited.add(task.id);

    if (task.dependencies.length === 0) {
      taskLevels.set(task.id, 0);
      return 0;
    }

    let maxDepLevel = -1;
    for (const depId of task.dependencies) {
      const depTask = taskMap.get(depId);
      if (depTask) {
        const depLevel = getTaskLevel(depTask, new Set(visited));
        maxDepLevel = Math.max(maxDepLevel, depLevel);
      }
    }

    const level = maxDepLevel + 1;
    taskLevels.set(task.id, level);
    return level;
  }

  // Group tasks by level
  for (const task of tasks) {
    const level = getTaskLevel(task);
    if (!levels[level]) {
      levels[level] = [];
    }
    levels[level].push(task);
  }

  return levels;
}

/**
 * Create task with auto-generated ID and defaults
 */
function createTask(params: {
  name: string;
  agent: string;
  estimatedHours: number;
  priority: TaskPriority;
  parallelizable: boolean;
  dependencies?: string[];
  qualityGates?: string[];
  files?: string[];
}): TaskInfo {
  // Generate sequential task IDs
  const taskId = `task-${taskCounter++}`;

  return {
    id: taskId,
    name: params.name,
    agent: params.agent,
    estimatedHours: params.estimatedHours,
    dependencies: params.dependencies || [],
    priority: params.priority,
    status: TaskStatus.PENDING,
    files: params.files,
    qualityGates: params.qualityGates,
    parallelizable: params.parallelizable,
  };
}

// Task counter for sequential IDs
let taskCounter = 1;

/**
 * Reset task counter (for testing)
 */
export function resetTaskCounter(): void {
  taskCounter = 1;
}