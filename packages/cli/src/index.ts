#!/usr/bin/env node
import { program } from 'commander';
import { deploy } from './commands/deploy';
import { update } from './commands/update';
import { status } from './commands/status';
import { review } from './commands/review';
import { investigate } from './commands/investigate';
import { dashboard } from './commands/dashboard';
import { analyze } from './commands/analyze';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

program
  .name('trinity')
  .description('Trinity Method SDK - Investigation-first development with AI agents')
  .version(`${pkg.version} (Trinity Method SDK)`, '-v, --version', 'Output the current version');

// ========================================
// Setup Commands (Original CLI)
// ========================================

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

// ========================================
// SDK Commands (New - Powered by Agents)
// ========================================

program
  .command('investigate')
  .description('🔍 Create and run AI-powered investigations')
  .option('--type <type>', 'Investigation type (security, performance, architecture, quality)')
  .option('--target <path>', 'Target directory or file', './src')
  .option('--scope <pattern>', 'File pattern glob', '**/*.{js,ts,jsx,tsx}')
  .option('--no-learning', 'Disable learning from past investigations')
  .option('--verbose', 'Show detailed output')
  .action(investigate);

program
  .command('dashboard')
  .description('📊 Launch interactive dashboards')
  .option('--type <type>', 'Dashboard type (cache, learning, registry, benchmark)', 'cache')
  .option('--output <file>', 'Output file for HTML dashboards')
  .option('--verbose', 'Show detailed output')
  .action(dashboard);

program
  .command('analyze [target]')
  .description('🔍 Quick project analysis and recommendations')
  .option('--metrics', 'Include system metrics')
  .option('--verbose', 'Show detailed output')
  .action(analyze);

program.parse();
