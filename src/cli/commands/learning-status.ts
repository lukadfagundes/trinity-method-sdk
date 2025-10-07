import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface LearningStatusOptions {
  verbose?: boolean;
}

export async function learningStatus(options: LearningStatusOptions = {}): Promise<void> {
  console.log(chalk.blue.bold('\n🧠 Trinity Learning System Status\n'));

  const spinner = ora('Loading learning data...').start();

  try {
    const configPath = path.join(process.cwd(), 'trinity/learning/config.json');
    const registryPath = path.join(process.cwd(), 'trinity/learning/patterns/registry.json');

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

    spinner.succeed('Learning data loaded');

    // Display learning system status
    console.log(chalk.green('\n📊 Learning System:'));
    console.log(`   Status: ${config.enabled ? chalk.green('Active') : chalk.red('Disabled')}`);
    console.log(`   Learning Rate: ${config.learningRate || 0.1}`);

    console.log(chalk.green('\n⚙️  Features:'));
    console.log(`   Pattern Detection: ${config.patternDetection ? '✓' : '✗'}`);
    console.log(`   Self Improvement: ${config.selfImprovement ? '✓' : '✗'}`);
    console.log(`   Knowledge Sharing: ${config.knowledgeSharing ? '✓' : '✗'}`);

    // Load patterns registry
    if (await fs.pathExists(registryPath)) {
      const registry = await fs.readJson(registryPath);
      const patternCount = registry.patterns?.length || 0;

      console.log(chalk.green('\n📚 Learned Patterns:'));
      console.log(`   Total Patterns: ${patternCount}`);

      if (patternCount > 0 && options.verbose) {
        console.log(chalk.cyan('\n   Recent Patterns:'));
        registry.patterns.slice(0, 5).forEach((pattern: any, index: number) => {
          console.log(`   ${index + 1}. ${pattern.name || 'Unnamed'}`);
        });
      }
    }

    console.log(chalk.cyan('\n💡 Use `/trinity-learning-status` for detailed insights\n'));

  } catch (error: any) {
    spinner.fail('Failed to load learning status');
    console.error(chalk.red(`   Error: ${error.message}`));
  }
}
