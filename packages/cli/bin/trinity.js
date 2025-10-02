#!/usr/bin/env node

import { program } from 'commander';
import { deploy } from '../src/commands/deploy.js';
import { update } from '../src/commands/update.js';
import { status } from '../src/commands/status.js';
import { review } from '../src/commands/review.js';

program
  .name('trinity')
  .description('Trinity Method SDK - Investigation-first development methodology')
  .version('1.0.0');

program
  .command('deploy')
  .description('Deploy Trinity Method to your project')
  .option('--agent <type>', 'Agent type (claude|cursor|copilot|aider|universal|all)')
  .option('--name <name>', 'Project name')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--force', 'Overwrite existing Trinity deployment')
  .option('--skip-audit', 'Skip initial codebase audit')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(deploy);

program
  .command('update')
  .description('Update Trinity Method to the latest version')
  .option('--force', 'Force update without confirmation')
  .action(update);

program
  .command('status')
  .description('Check Trinity Method deployment status')
  .action(status);

program
  .command('review')
  .description('Analyze past sessions for patterns and improvements')
  .option('--sessions <number>', 'Number of recent sessions to analyze', '10')
  .action(review);

program.parse();
