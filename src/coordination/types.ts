/**
 * Workflow Types - Interfaces for workflow planning and visualization
 *
 * @see docs/workflows/deploy-workflow.md - Workflow documentation
 * @see WorkflowVisualizer.ts - Visualization implementation
 *
 * **Trinity Principle:** "Investigation-First Development"
 * Workflow visualization makes investigation orchestration transparent. Before executing
 * a multi-phase plan, developers see the complete workflow tree with phases, tasks,
 * dependencies, and time estimates. This enables informed decisions and prevents
 * blind execution of complex workflows.
 *
 * **Why This Exists:**
 * Traditional orchestration is opaque: developers don't know what will execute until
 * it's running. Trinity Method workflow plans provide complete transparency before
 * execution, showing the full task hierarchy, parallelization opportunities, and
 * time estimates. Users approve workflows before execution, not after.
 *
 * @module coordination/types
 */

/**
 * Investigation scale determines workflow complexity
 *
 * - SMALL: 0 stop points, <4 hours, 1-3 agents
 * - MEDIUM: 2 stop points, 4-8 hours, 3-6 agents
 * - LARGE: 4 stop points, >8 hours, 6+ agents
 */
export enum InvestigationScale {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

/**
 * Task status in workflow execution
 */
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

/**
 * Task priority level
 */
export enum TaskPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Individual task within a workflow phase
 */
export interface TaskInfo {
  /** Unique task identifier */
  id: string;

  /** Task name/description */
  name: string;

  /** Task description (optional) */
  description?: string;

  /** Agent responsible for this task */
  agent: string;

  /** Estimated duration in hours */
  estimatedHours: number;

  /** Task dependencies (IDs of tasks that must complete first) */
  dependencies: string[];

  /** Task priority */
  priority: TaskPriority;

  /** Task status */
  status: TaskStatus;

  /** Files affected by this task */
  files?: string[];

  /** BAS quality gates required */
  qualityGates?: string[];

  /** Whether this task can run in parallel with others */
  parallelizable: boolean;

  /** Actual duration (set after completion) */
  actualHours?: number;

  /** Start time (set when task begins) */
  startTime?: Date;

  /** End time (set when task completes) */
  endTime?: Date;

  /** Error message (if task failed) */
  error?: string;
}

/**
 * Phase within a workflow containing related tasks
 */
export interface PhaseInfo {
  /** Phase number (1, 2, 3, etc.) */
  phaseNumber: number;

  /** Phase name */
  name: string;

  /** Phase description */
  description: string;

  /** Tasks in this phase */
  tasks: TaskInfo[];

  /** Estimated phase duration in hours */
  estimatedHours: number;

  /** Actual phase duration (set after completion) */
  actualHours?: number;

  /** Whether this is a stop point for user review */
  isStopPoint: boolean;

  /** Stop point validation criteria (if isStopPoint = true) */
  stopPointCriteria?: string[];

  /** Phase start time */
  startTime?: Date;

  /** Phase end time */
  endTime?: Date;

  /** Phase status (derived from task statuses) */
  status: TaskStatus;
}

/**
 * Complete workflow plan for an investigation
 */
export interface WorkflowPlan {
  /** Workflow plan ID */
  id: string;

  /** Investigation title */
  title: string;

  /** Investigation scale (SMALL/MEDIUM/LARGE) */
  scale: InvestigationScale;

  /** Workflow phases */
  phases: PhaseInfo[];

  /** Total estimated hours */
  totalEstimatedHours: number;

  /** Optimized hours (with parallelization) */
  optimizedHours: number;

  /** Time savings from parallelization */
  timeSavingsPercent: number;

  /** Total number of tasks */
  totalTasks: number;

  /** Number of stop points */
  stopPoints: number;

  /** Agents involved in workflow */
  agents: string[];

  /** Created timestamp */
  createdAt: Date;

  /** Workflow status */
  status: TaskStatus;

  /** Actual total hours (set after completion) */
  actualHours?: number;

  /** Start time */
  startTime?: Date;

  /** End time */
  endTime?: Date;
}

/**
 * Workflow execution context
 */
export interface WorkflowContext {
  /** Workflow plan being executed */
  plan: WorkflowPlan;

  /** Current phase index */
  currentPhase: number;

  /** Current task index within phase */
  currentTask: number;

  /** Execution logs */
  logs: WorkflowLog[];

  /** Pause requested (for stop points) */
  pauseRequested: boolean;

  /** User approval status at stop points */
  stopPointApprovals: Map<number, boolean>;

  /** Metrics collected during execution */
  metrics: WorkflowMetrics;
}

/**
 * Workflow execution log entry
 */
export interface WorkflowLog {
  /** Timestamp */
  timestamp: Date;

  /** Log level */
  level: 'info' | 'warn' | 'error' | 'debug';

  /** Message */
  message: string;

  /** Phase number (if applicable) */
  phaseNumber?: number;

  /** Task ID (if applicable) */
  taskId?: string;

  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Workflow execution metrics
 */
export interface WorkflowMetrics {
  /** Tasks completed */
  tasksCompleted: number;

  /** Tasks failed */
  tasksFailed: number;

  /** Tasks skipped */
  tasksSkipped: number;

  /** Average task duration (hours) */
  averageTaskDuration: number;

  /** Parallelization efficiency (0-1) */
  parallelizationEfficiency: number;

  /** Quality gate pass rate (0-1) */
  qualityGatePassRate: number;

  /** Stop point approval rate (0-1) */
  stopPointApprovalRate: number;
}

/**
 * Workflow visualization options
 */
export interface VisualizationOptions {
  /** Show task details (default: true) */
  showTaskDetails: boolean;

  /** Show time estimates (default: true) */
  showTimeEstimates: boolean;

  /** Show dependencies (default: true) */
  showDependencies: boolean;

  /** Show agents (default: true) */
  showAgents: boolean;

  /** Show quality gates (default: false) */
  showQualityGates: boolean;

  /** Color output (default: true) */
  useColors: boolean;

  /** Compact mode (less verbose, default: false) */
  compactMode: boolean;
}

/**
 * Task dependency graph node
 */
export interface DependencyNode {
  /** Task ID */
  taskId: string;

  /** Task name */
  taskName: string;

  /** Dependencies (task IDs) */
  dependencies: string[];

  /** Dependents (task IDs that depend on this) */
  dependents: string[];

  /** Topological level (for visualization) */
  level: number;
}

/**
 * Parallelization block - tasks that can run in parallel
 */
export interface ParallelizationBlock {
  /** Block ID */
  id: string;

  /** Tasks in this block */
  tasks: TaskInfo[];

  /** Estimated duration (longest task) */
  estimatedHours: number;

  /** Time saved vs sequential execution */
  timeSaved: number;
}