/**
 * Learning Status Command - Display learning system status and performance metrics
 *
 * @see docs/knowledge-preservation.md - Knowledge preservation philosophy
 * @see docs/best-practices.md - Learning system integration
 * @see ../../learning/LearningMetricsDashboard.ts - Metrics dashboard implementation
 *
 * **Trinity Principle:** "Knowledge Preservation" - Monitor institutional learning
 *
 * @module cli/commands/learning-status
 */

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

import { LearningDataStore, LearningData } from '../../learning/LearningDataStore.js';
import { LearningMetricsDashboard } from '../../learning/LearningMetricsDashboard.js';
import { AgentType } from '../../shared/types/index.js';

interface LearningStatusOptions {
  verbose?: boolean;
  dashboard?: boolean;
}

export async function learningStatus(options: LearningStatusOptions = {}): Promise<void> {
  const spinner = ora('Loading learning data...').start();

  try {
    const configPath = path.join(process.cwd(), 'trinity/learning/config.json');
    const learningDir = path.join(process.cwd(), '.trinity/learning');

    if (!(await fs.pathExists(configPath))) {
      spinner.fail('Learning system not initialized');
      console.log(chalk.yellow('\n   Run `trinity deploy` first to initialize learning'));
      return;
    }

    const config = await fs.readJson(configPath);

    if (!config.enabled) {
      spinner.warn('Learning system is disabled');
      console.log(chalk.yellow('\n   Enable learning in trinity/learning/config.json'));
      return;
    }

    // Load learning data for all agents
    const store = new LearningDataStore(learningDir);
    // Using v1.0 agent names for learning system compatibility
    const agents: string[] = [
      'MON',
      'ROR',
      'TRA',
      'EUS',
      'KIL',
      'BAS',
      'DRA',
      'APO',
      'BON',
      'CAP',
      'URO',
      'ALY',
    ];

    const learningData = new Map<AgentType, LearningData>();
    for (const agent of agents) {
      try {
        const data = await store.loadLearningData(agent as AgentType);
        learningData.set(agent as AgentType, data);
      } catch (error) {
        // Agent may not have learning data yet
      }
    }

    spinner.succeed('Learning data loaded');

    // Display full dashboard if --dashboard flag is set
    if (options.dashboard) {
      const dashboard = new LearningMetricsDashboard(learningData);
      await dashboard.displayFullDashboard();
      return;
    }

    // Display simple status (legacy behavior)
    console.log(chalk.blue.bold('\n🧠 Trinity Learning System Status\n'));

    console.log(chalk.green('📊 Learning System:'));
    console.log(`   Status: ${config.enabled ? chalk.green('Active') : chalk.red('Disabled')}`);
    console.log(`   Learning Rate: ${config.learningRate || 0.1}`);

    console.log(chalk.green('\n⚙️  Features:'));
    console.log(`   Pattern Detection: ${config.patternDetection ? '✓' : '✗'}`);
    console.log(`   Self Improvement: ${config.selfImprovement ? '✓' : '✗'}`);
    console.log(`   Knowledge Sharing: ${config.knowledgeSharing ? '✓' : '✗'}`);

    // Count patterns across all agents
    let totalPatterns = 0;
    for (const data of learningData.values()) {
      totalPatterns += data.patterns.size;
    }

    console.log(chalk.green('\n📚 Learned Patterns:'));
    console.log(`   Total Patterns: ${totalPatterns}`);
    console.log(`   Agents with Data: ${learningData.size}`);

    if (options.verbose && totalPatterns > 0) {
      console.log(chalk.cyan('\n   Patterns by Agent:'));
      for (const [agent, data] of learningData.entries()) {
        if (data.patterns.size > 0) {
          console.log(`   ${agent}: ${data.patterns.size} patterns`);
        }
      }
    }

    console.log(
      chalk.cyan('\n💡 Use `trinity learning-status --dashboard` for detailed metrics dashboard\n')
    );
  } catch (error: any) {
    spinner.fail('Failed to load learning status');
    console.error(chalk.red(`   Error: ${error.message}`));
  }
}
