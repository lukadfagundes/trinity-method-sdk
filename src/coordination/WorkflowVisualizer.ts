/**
 * Workflow Visualizer - Display workflow plans as tree structures
 *
 * @see types.ts - Workflow type definitions
 * @see docs/workflows/deploy-workflow.md - Workflow documentation
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Visualization transforms abstract workflow plans into concrete, understandable trees.
 * Before executing a complex multi-phase investigation, developers see the complete
 * task hierarchy, dependencies, time estimates, and parallelization opportunities,
 * enabling informed approval decisions based on clear visual evidence.
 *
 * **Why This Exists:**
 * Traditional orchestration shows progress during execution but not before. Trinity Method
 * visualizer displays the complete workflow plan upfront using tree structures with color
 * coding, showing phases, tasks, agents, time estimates, and dependencies. Users understand
 * what will happen before committing to execution.
 *
 * @module coordination/WorkflowVisualizer
 */

import chalk from 'chalk';
import {
  WorkflowPlan,
  PhaseInfo,
  TaskInfo,
  TaskStatus,
  TaskPriority,
  VisualizationOptions,
  InvestigationScale,
} from './types.js';

/**
 * Visualize workflow plan as tree structure
 *
 * Displays multi-level tree with:
 * - Workflow summary (scale, total hours, tasks, stop points)
 * - Phase breakdown with estimated hours
 * - Task details with agents, dependencies, parallelization
 * - Color coding by status and priority
 *
 * @param plan - Workflow plan to visualize
 * @param options - Visualization options
 */
export function visualizeWorkflow(
  plan: WorkflowPlan,
  options: Partial<VisualizationOptions> = {}
): void {
  const opts: VisualizationOptions = {
    showTaskDetails: true,
    showTimeEstimates: true,
    showDependencies: true,
    showAgents: true,
    showQualityGates: false,
    useColors: true,
    compactMode: false,
    ...options,
  };

  const c = opts.useColors ? chalk : noColorChalk;

  // Header
  console.log('\n' + c.bold('═'.repeat(80)));
  console.log(c.bold.cyan('                    TRINITY METHOD WORKFLOW PLAN'));
  console.log(c.bold('═'.repeat(80)) + '\n');

  // Workflow Summary
  displayWorkflowSummary(plan, opts, c);

  // Phases
  console.log(c.bold('\n📋 WORKFLOW PHASES:\n'));

  plan.phases.forEach((phase, index) => {
    displayPhase(phase, index, plan.phases.length, opts, c);
  });

  // Footer
  console.log(c.bold('═'.repeat(80)));
  console.log(c.gray(`Workflow ID: ${plan.id}`));
  console.log(c.gray(`Generated: ${plan.createdAt.toISOString()}`));
  console.log(c.bold('═'.repeat(80)) + '\n');
}

/**
 * Display workflow summary section
 */
function displayWorkflowSummary(
  plan: WorkflowPlan,
  opts: VisualizationOptions,
  c: typeof chalk
): void {
  console.log(c.bold('📊 WORKFLOW SUMMARY:'));
  console.log(c.gray('─'.repeat(80)));

  // Title
  console.log(c.bold(`Title: `) + c.white(plan.title));

  // Scale
  const scaleColor = getScaleColor(plan.scale, c);
  console.log(c.bold(`Scale: `) + scaleColor(plan.scale));

  // Time estimates
  if (opts.showTimeEstimates) {
    console.log(
      c.bold(`Estimated Time: `) +
        c.yellow(`${plan.totalEstimatedHours.toFixed(1)}h`) +
        c.gray(` (sequential)`)
    );
    console.log(
      c.bold(`Optimized Time: `) +
        c.green(`${plan.optimizedHours.toFixed(1)}h`) +
        c.gray(` (with parallelization)`)
    );
    console.log(
      c.bold(`Time Savings: `) +
        c.cyan(`${plan.timeSavingsPercent.toFixed(1)}%`) +
        c.gray(` from parallelization`)
    );
  }

  // Task counts
  console.log(c.bold(`Total Tasks: `) + c.white(plan.totalTasks.toString()));
  console.log(c.bold(`Phases: `) + c.white(plan.phases.length.toString()));
  console.log(c.bold(`Stop Points: `) + c.yellow(plan.stopPoints.toString()));

  // Agents
  if (opts.showAgents && plan.agents.length > 0) {
    console.log(
      c.bold(`Agents: `) + c.cyan(plan.agents.slice(0, 5).join(', ')) +
      (plan.agents.length > 5 ? c.gray(` +${plan.agents.length - 5} more`) : '')
    );
  }

  console.log();
}

/**
 * Display single phase with tasks
 */
function displayPhase(
  phase: PhaseInfo,
  index: number,
  totalPhases: number,
  opts: VisualizationOptions,
  c: typeof chalk
): void {
  const isLast = index === totalPhases - 1;
  const prefix = isLast ? '└──' : '├──';
  const connector = isLast ? '    ' : '│   ';

  // Phase header
  const phaseIcon = phase.isStopPoint ? '🛑' : '📦';
  const phaseName = c.bold.blue(`Phase ${phase.phaseNumber}: ${phase.name}`);

  console.log(prefix + ' ' + phaseIcon + ' ' + phaseName);

  // Phase description
  if (!opts.compactMode && phase.description) {
    console.log(connector + '   ' + c.gray(phase.description));
  }

  // Phase time estimate
  if (opts.showTimeEstimates) {
    console.log(
      connector +
        '   ' +
        c.gray('⏱️  Estimated: ') +
        c.yellow(`${phase.estimatedHours.toFixed(1)}h`)
    );
  }

  // Stop point marker
  if (phase.isStopPoint) {
    console.log(connector + '   ' + c.red('⚠️  STOP POINT - User review required'));
    if (phase.stopPointCriteria && phase.stopPointCriteria.length > 0) {
      console.log(connector + '   ' + c.gray('Validation criteria:'));
      phase.stopPointCriteria.forEach((criterion) => {
        console.log(connector + '     ' + c.gray(`• ${criterion}`));
      });
    }
  }

  // Tasks
  if (opts.showTaskDetails && phase.tasks.length > 0) {
    console.log(connector);
    phase.tasks.forEach((task, taskIndex) => {
      const isLastTask = taskIndex === phase.tasks.length - 1;
      displayTask(task, connector, isLastTask, opts, c);
    });
  } else if (phase.tasks.length > 0) {
    console.log(
      connector +
        '   ' +
        c.gray(`${phase.tasks.length} task${phase.tasks.length > 1 ? 's' : ''}`)
    );
  }

  console.log(connector);
}

/**
 * Display single task
 */
function displayTask(
  task: TaskInfo,
  parentConnector: string,
  isLast: boolean,
  opts: VisualizationOptions,
  c: typeof chalk
): void {
  const prefix = isLast ? '└──' : '├──';
  const connector = isLast ? '    ' : '│   ';

  // Task status icon
  const statusIcon = getStatusIcon(task.status);

  // Task priority color
  const priorityColor = getPriorityColor(task.priority, c);

  // Task name
  const taskName = priorityColor(task.name);

  // Parallel indicator
  const parallelIndicator = task.parallelizable ? c.cyan(' [parallel]') : '';

  console.log(
    parentConnector +
      prefix +
      ' ' +
      statusIcon +
      ' ' +
      taskName +
      parallelIndicator
  );

  // Task details
  if (opts.showAgents) {
    console.log(
      parentConnector +
        connector +
        '  ' +
        c.gray('👤 Agent: ') +
        c.cyan(task.agent)
    );
  }

  if (opts.showTimeEstimates) {
    console.log(
      parentConnector +
        connector +
        '  ' +
        c.gray('⏱️  Time: ') +
        c.yellow(`${task.estimatedHours.toFixed(1)}h`)
    );
  }

  if (opts.showDependencies && task.dependencies.length > 0) {
    console.log(
      parentConnector +
        connector +
        '  ' +
        c.gray('🔗 Depends on: ') +
        c.gray(task.dependencies.join(', '))
    );
  }

  if (opts.showQualityGates && task.qualityGates && task.qualityGates.length > 0) {
    console.log(
      parentConnector +
        connector +
        '  ' +
        c.gray('✓  Gates: ') +
        c.gray(task.qualityGates.join(', '))
    );
  }

  if (task.files && task.files.length > 0 && !opts.compactMode) {
    const fileList =
      task.files.length > 3
        ? task.files.slice(0, 3).join(', ') + c.gray(` +${task.files.length - 3}`)
        : task.files.join(', ');
    console.log(
      parentConnector + connector + '  ' + c.gray('📄 Files: ') + c.gray(fileList)
    );
  }
}

/**
 * Get status icon for task status
 */
function getStatusIcon(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.COMPLETED:
      return '✅';
    case TaskStatus.IN_PROGRESS:
      return '🔄';
    case TaskStatus.FAILED:
      return '❌';
    case TaskStatus.SKIPPED:
      return '⏭️';
    case TaskStatus.PENDING:
    default:
      return '⏸️';
  }
}

/**
 * Get color for priority level
 */
function getPriorityColor(priority: TaskPriority, c: typeof chalk): typeof chalk {
  switch (priority) {
    case TaskPriority.CRITICAL:
      return c.red.bold;
    case TaskPriority.HIGH:
      return c.yellow;
    case TaskPriority.MEDIUM:
      return c.white;
    case TaskPriority.LOW:
      return c.gray;
    default:
      return c.white;
  }
}

/**
 * Get color for investigation scale
 */
function getScaleColor(scale: InvestigationScale, c: typeof chalk): typeof chalk {
  switch (scale) {
    case InvestigationScale.LARGE:
      return c.red;
    case InvestigationScale.MEDIUM:
      return c.yellow;
    case InvestigationScale.SMALL:
      return c.green;
    default:
      return c.white;
  }
}

/**
 * Display workflow progress
 *
 * Shows current execution state with progress bars
 *
 * @param plan - Workflow plan with execution state
 */
export function displayWorkflowProgress(plan: WorkflowPlan): void {
  const c = chalk;

  console.log('\n' + c.bold('═'.repeat(80)));
  console.log(c.bold.cyan('                    WORKFLOW PROGRESS'));
  console.log(c.bold('═'.repeat(80)) + '\n');

  // Overall progress
  const completedTasks = plan.phases.flatMap((p) => p.tasks).filter(
    (t) => t.status === TaskStatus.COMPLETED
  ).length;
  const totalTasks = plan.totalTasks;
  const progressPercent = (completedTasks / totalTasks) * 100;

  console.log(c.bold('Overall Progress:'));
  console.log(
    displayProgressBar(progressPercent, 50) +
      c.white(` ${progressPercent.toFixed(0)}%`)
  );
  console.log(
    c.gray(`${completedTasks} of ${totalTasks} tasks completed`) + '\n'
  );

  // Phase progress
  plan.phases.forEach((phase) => {
    const phaseCompleted = phase.tasks.filter(
      (t) => t.status === TaskStatus.COMPLETED
    ).length;
    const phaseTotal = phase.tasks.length;
    const phasePercent = phaseTotal > 0 ? (phaseCompleted / phaseTotal) * 100 : 0;

    const phaseStatus = getPhaseStatusColor(phase.status, c);
    console.log(
      phaseStatus(`Phase ${phase.phaseNumber}: ${phase.name}`)
    );
    console.log(
      '  ' +
        displayProgressBar(phasePercent, 40) +
        c.white(` ${phasePercent.toFixed(0)}%`)
    );
    console.log(c.gray(`  ${phaseCompleted} of ${phaseTotal} tasks\n`));
  });

  console.log(c.bold('═'.repeat(80)) + '\n');
}

/**
 * Display progress bar
 */
function displayProgressBar(percent: number, width: number): string {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;

  const filledBar = chalk.green('█'.repeat(filled));
  const emptyBar = chalk.gray('░'.repeat(empty));

  return '[' + filledBar + emptyBar + ']';
}

/**
 * Get color for phase status
 */
function getPhaseStatusColor(status: TaskStatus, c: typeof chalk): typeof chalk {
  switch (status) {
    case TaskStatus.COMPLETED:
      return c.green;
    case TaskStatus.IN_PROGRESS:
      return c.yellow;
    case TaskStatus.FAILED:
      return c.red;
    default:
      return c.white;
  }
}

/**
 * Display workflow summary
 *
 * Compact summary for completed workflows
 *
 * @param plan - Completed workflow plan
 */
export function displayWorkflowSummaryCompact(plan: WorkflowPlan): void {
  const c = chalk;

  console.log('\n' + c.bold.green('✅ WORKFLOW COMPLETE') + '\n');

  console.log(c.bold('Summary:'));
  console.log(`  Title: ${plan.title}`);
  console.log(`  Scale: ${plan.scale}`);
  console.log(`  Tasks: ${plan.totalTasks}`);
  console.log(`  Estimated: ${plan.totalEstimatedHours.toFixed(1)}h`);

  if (plan.actualHours) {
    const variance =
      ((plan.actualHours - plan.optimizedHours) / plan.optimizedHours) * 100;
    const varianceColor = variance > 10 ? c.yellow : variance < -10 ? c.green : c.white;
    console.log(
      `  Actual: ${plan.actualHours.toFixed(1)}h ` +
        varianceColor(`(${variance > 0 ? '+' : ''}${variance.toFixed(0)}%)`)
    );
  }

  console.log();
}

/**
 * No-color chalk alternative (for non-TTY environments)
 */
const noColorChalk: any = new Proxy({} as any, {
  get: (_target, prop) => {
    if (typeof prop === 'string') {
      return new Proxy(
        (text: string) => text,
        {
          get: () => noColorChalk,
        }
      );
    }
    return noColorChalk;
  },
});