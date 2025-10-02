#!/usr/bin/env node
import { program } from 'commander';
import { deploy } from './commands/deploy.js';
import { update } from './commands/update.js';
import { status } from './commands/status.js';
import { review } from './commands/review.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('trinity')
  .description('Trinity Method SDK - Deploy investigation-first development methodology')
  .version(`${pkg.version} (Trinity Method SDK)`, '-v, --version', 'Output the current version');

program
  .command('deploy')
  .description('Deploy Trinity Method to current project')
  .option('--name <name>', 'Project name (auto-detected if not specified)')
  .option('--yes', 'Skip confirmation prompts')
  .option('--dry-run', 'Preview changes without writing files')
  .option('--force', 'Overwrite existing Trinity deployment')
  .option('--skip-audit', 'Skip codebase metrics collection (faster, uses placeholders)')
  .option('--ci-deploy', 'Deploy CI/CD workflow templates for automated testing')
  .action(deploy);

program
  .command('update')
  .description('Update Trinity Method to latest version')
  .option('--all', 'Update all registered Trinity projects')
  .option('--dry-run', 'Preview changes without writing files')
  .action(update);

program
  .command('status')
  .description('Show Trinity Method deployment status')
  .action(status);

program
  .command('review')
  .description('Review archived sessions for patterns')
  .option('--since <date>', 'Review sessions since date')
  .option('--project <name>', 'Review specific project')
  .action(review);

program.parse();
