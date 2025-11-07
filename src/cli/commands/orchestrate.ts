/**
 * Orchestrate Command - Visualize and execute Trinity Method workflows
 *
 * @see ../../coordination/AJMaestro.ts - Workflow plan generation
 * @see ../../coordination/WorkflowVisualizer.ts - Visualization
 * @see ../../coordination/types.ts - Workflow type definitions
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Orchestrate command transforms abstract investigation plans into concrete, visual workflows.
 * Developers see the complete execution plan with phases, tasks, agents, dependencies, and
 * stop points BEFORE execution. This enables informed approval decisions based on clear
 * visual evidence.
 *
 * **Why This Exists:**
 * Traditional AI coding assistants execute immediately without showing the plan. Trinity Method
 * orchestrate command displays the complete workflow upfront: investigation scale, phases with
 * stop points, task dependencies, parallelization opportunities, and time estimates. Users
 * approve workflows before execution, not after.
 *
 * @module cli/commands/orchestrate
 */

import { Command } from 'commander';
import * as readline from 'readline';
import {
  generateWorkflowPlan,
  type InvestigationRequirements,
} from '../../coordination/AJMaestro.js';
import {
  visualizeWorkflow,
  displayWorkflowProgress,
} from '../../coordination/WorkflowVisualizer.js';
import { InvestigationScale } from '../../coordination/types.js';

/**
 * Orchestrate command - Generate and visualize workflow plans
 *
 * Interactive workflow:
 * 1. Gather investigation requirements (title, type, scale, complexity)
 * 2. Generate workflow plan with AJ MAESTRO
 * 3. Visualize plan with tree structure
 * 4. Prompt for user approval
 * 5. Execute workflow (implementation in future)
 *
 * @param options - Command options
 */
export async function orchestrate(options: {
  title?: string;
  type?: string;
  scale?: string;
  complexity?: number;
  files?: string;
  execute?: boolean;
  progress?: boolean;
}): Promise<void> {
  console.log('\n🎼 Trinity Method Workflow Orchestration\n');

  try {
    // Gather requirements interactively or from options
    const requirements = await gatherRequirements(options);

    console.log('\n[Orchestrate] Generating workflow plan...\n');

    // Generate workflow plan
    const plan = generateWorkflowPlan(requirements);

    // Visualize workflow plan
    if (options.progress && plan.status !== 'pending') {
      displayWorkflowProgress(plan);
    } else {
      visualizeWorkflow(plan, {
        showTaskDetails: true,
        showTimeEstimates: true,
        showDependencies: true,
        showAgents: true,
        showQualityGates: false,
        useColors: true,
        compactMode: false,
      });
    }

    // Prompt for approval
    if (options.execute) {
      const approved = await promptApproval();

      if (approved) {
        console.log('\n✅ Workflow approved. Execution not yet implemented.');
        console.log(
          '📝 Note: Workflow execution will be implemented in a future phase.\n'
        );
        // TODO: Execute workflow with phase-by-phase execution
        // TODO: Stop point handling with user approval
        // TODO: Progress tracking and updates
      } else {
        console.log('\n❌ Workflow execution cancelled by user.\n');
      }
    }

    console.log('\n✨ Orchestration complete.\n');
  } catch (error) {
    console.error('\n❌ Orchestration failed:', (error as Error).message);
    throw error;
  }
}

/**
 * Gather investigation requirements interactively or from options
 */
async function gatherRequirements(options: {
  title?: string;
  type?: string;
  scale?: string;
  complexity?: number;
  files?: string;
}): Promise<InvestigationRequirements> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    // Title
    const title =
      options.title ||
      (await question('Investigation title: ')) ||
      'Unnamed Investigation';

    // Type
    let type = options.type;
    if (!type) {
      const typeInput = await question(
        'Investigation type (bug/feature/performance/security/technical) [feature]: '
      );
      type = typeInput || 'feature';
    }

    if (!isValidType(type)) {
      throw new Error(
        `Invalid investigation type: ${type}. Must be one of: bug, feature, performance, security, technical`
      );
    }

    // Scale
    let scale = options.scale;
    if (!scale) {
      const scaleInput = await question(
        'Investigation scale (SMALL/MEDIUM/LARGE) [MEDIUM]: '
      );
      scale = (scaleInput || 'MEDIUM').toUpperCase();
    }

    if (!isValidScale(scale)) {
      throw new Error(
        `Invalid investigation scale: ${scale}. Must be one of: SMALL, MEDIUM, LARGE`
      );
    }

    // Complexity
    let complexity = options.complexity;
    if (!complexity) {
      const complexityInput = await question(
        'Complexity (1-10, where 10 is most complex) [5]: '
      );
      complexity = parseInt(complexityInput || '5', 10);
    }

    if (complexity < 1 || complexity > 10) {
      throw new Error('Complexity must be between 1 and 10');
    }

    // Files (optional)
    const filesInput = options.files || (await question('Files affected (optional): '));
    const files = filesInput ? filesInput.split(',').map((f) => f.trim()) : undefined;

    rl.close();

    return {
      title,
      type: type as 'bug' | 'feature' | 'performance' | 'security' | 'technical',
      scale: scale as InvestigationScale,
      complexity,
      files,
    };
  } catch (error) {
    rl.close();
    throw error;
  }
}

/**
 * Prompt user for workflow approval
 */
async function promptApproval(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n⚠️  Execute this workflow? (yes/no): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Validate investigation type
 */
function isValidType(type: string): boolean {
  return ['bug', 'feature', 'performance', 'security', 'technical'].includes(type);
}

/**
 * Validate investigation scale
 */
function isValidScale(scale: string): boolean {
  return ['SMALL', 'MEDIUM', 'LARGE'].includes(scale.toUpperCase());
}

/**
 * Register orchestrate command with CLI
 */
export function registerOrchestrateCommand(program: Command): Command {
  const cmd = program
    .command('orchestrate')
    .description('🎼 Generate and visualize Trinity Method workflow plans')
    .option('--title <title>', 'Investigation title')
    .option(
      '--type <type>',
      'Investigation type (bug, feature, performance, security, technical)'
    )
    .option('--scale <scale>', 'Investigation scale (SMALL, MEDIUM, LARGE)')
    .option('--complexity <n>', 'Complexity (1-10)', parseInt)
    .option('--files <files>', 'Comma-separated list of affected files')
    .option('--execute', 'Execute workflow after approval')
    .option('--progress', 'Show progress instead of full plan (for in-progress workflows)')
    .action(orchestrate);

  return cmd;
}