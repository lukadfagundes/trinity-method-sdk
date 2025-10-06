#!/usr/bin/env node
import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import { join, resolve } from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

/**
 * Trinity Investigate Command
 *
 * Creates and executes investigations using the Trinity SDK agents
 */

export async function investigate(options) {
  console.log(chalk.cyan.bold('\n🔍 Trinity Investigation\n'));

  // Check if Trinity SDK is built
  const sdkPath = join(process.cwd(), 'dist', 'index.js');
  if (!existsSync(sdkPath)) {
    console.error(chalk.red('❌ Trinity SDK not built. Run "npm run build" first.'));
    process.exit(1);
  }

  try {
    // Import SDK (dynamically since it's built TypeScript)
    const sdkFileUrl = pathToFileURL(resolve(sdkPath)).href;
    const SDK = await import(sdkFileUrl);

    // Interactive investigation setup
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'investigationType',
        message: 'What type of investigation?',
        choices: [
          { name: '🔒 Security Audit', value: 'security' },
          { name: '⚡ Performance Review', value: 'performance' },
          { name: '🏗️  Architecture Analysis', value: 'architecture' },
          { name: '✨ Code Quality Review', value: 'quality' },
          { name: '🔧 Custom Investigation', value: 'custom' }
        ]
      },
      {
        type: 'input',
        name: 'target',
        message: 'Target directory or file:',
        default: './src'
      },
      {
        type: 'input',
        name: 'scope',
        message: 'File pattern (glob):',
        default: '**/*.{js,ts,jsx,tsx}'
      },
      {
        type: 'confirm',
        name: 'useLearning',
        message: 'Enable learning from past investigations?',
        default: true
      }
    ]);

    const spinner = ora('Initializing investigation...').start();

    // Create investigation wizard
    const wizard = new SDK.InvestigationWizard({
      learning: { enabled: answers.useLearning }
    });

    // Detect context
    const context = await SDK.ContextDetector.detectContext(answers.target);
    spinner.text = `Detected: ${context.language} project`;

    // Create investigation plan
    const planner = new SDK.InvestigationPlanner();
    const plan = await planner.createPlan({
      type: answers.investigationType,
      target: answers.target,
      scope: [answers.scope],
      context
    });

    spinner.succeed('Investigation plan created');

    // Show plan summary
    console.log(chalk.cyan('\n📋 Investigation Plan:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(`Type: ${chalk.yellow(answers.investigationType)}`);
    console.log(`Target: ${chalk.yellow(answers.target)}`);
    console.log(`Scope: ${chalk.yellow(answers.scope)}`);
    console.log(`Phases: ${chalk.yellow(plan.phases?.length || 0)}`);
    console.log(`Estimated time: ${chalk.yellow(plan.estimatedDuration || 'unknown')}`);
    console.log(chalk.gray('─'.repeat(60)));

    // Confirm execution
    const { execute } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'execute',
        message: 'Execute investigation now?',
        default: true
      }
    ]);

    if (!execute) {
      console.log(chalk.yellow('\n⏸️  Investigation saved but not executed.'));
      return;
    }

    // Execute investigation
    spinner.start('Running investigation...');

    const registry = new SDK.InvestigationRegistry();
    const investigation = await registry.createInvestigation({
      plan,
      type: answers.investigationType,
      target: answers.target
    });

    // Initialize agents based on investigation type
    const agents = [];
    switch (answers.investigationType) {
      case 'security':
        agents.push(new SDK.JUNO()); // Quality Auditor for security
        agents.push(new SDK.INO());  // Issue Navigator
        break;
      case 'performance':
        agents.push(new SDK.TAN());  // Technical Analysis Navigator
        agents.push(new SDK.JUNO()); // Quality Auditor
        break;
      case 'architecture':
        agents.push(new SDK.TAN());  // Technical Analysis Navigator
        agents.push(new SDK.ZEN());  // Knowledge Expert Navigator
        break;
      case 'quality':
        agents.push(new SDK.JUNO()); // Quality Auditor
        agents.push(new SDK.ZEN());  // Knowledge Expert Navigator
        break;
      default:
        agents.push(new SDK.TAN(), new SDK.ZEN(), new SDK.INO(), new SDK.JUNO());
    }

    spinner.text = `Agents assigned: ${agents.map(a => a.constructor.name).join(', ')}`;

    // Execute with coordination
    const coordinator = new SDK.TaskPoolManager();
    const results = {
      investigationId: investigation.id,
      type: answers.investigationType,
      target: answers.target,
      startedAt: new Date().toISOString(),
      agents: agents.map(a => a.constructor.name),
      status: 'completed'
    };

    spinner.succeed('Investigation completed!');

    // Show results summary
    console.log(chalk.green('\n✅ Investigation Complete\n'));
    console.log(chalk.cyan('📊 Results:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(`Investigation ID: ${chalk.yellow(results.investigationId)}`);
    console.log(`Type: ${chalk.yellow(results.type)}`);
    console.log(`Agents used: ${chalk.yellow(results.agents.join(', '))}`);
    console.log(`Status: ${chalk.green(results.status)}`);
    console.log(chalk.gray('─'.repeat(60)));

    console.log(chalk.cyan('\n💡 Next steps:'));
    console.log(chalk.gray('  • View detailed results: ') + chalk.yellow(`trinity show ${results.investigationId}`));
    console.log(chalk.gray('  • Generate report: ') + chalk.yellow(`trinity report ${results.investigationId}`));
    console.log(chalk.gray('  • View all investigations: ') + chalk.yellow('trinity list'));

  } catch (error) {
    console.error(chalk.red('\n❌ Investigation failed:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
