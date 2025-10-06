#!/usr/bin/env node
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import { AnalyzeOptions } from '../types';

/**
 * Trinity Analyze Command
 *
 * Quick code analysis using context detection and agents
 */

export async function analyze(target: string | undefined, options: AnalyzeOptions): Promise<void> {
  console.log(chalk.cyan.bold('\n🔍 Trinity Quick Analysis\n'));

  // Check if Trinity SDK is built
  const sdkPath = join(process.cwd(), 'dist', 'index.js');
  if (!existsSync(sdkPath)) {
    console.error(chalk.red('❌ Trinity SDK not built. Run "npm run build" first.'));
    process.exit(1);
  }

  const targetPath = target || './src';

  try {
    // Import SDK (convert to file:// URL for Windows compatibility)
    const sdkFileUrl = pathToFileURL(resolve(sdkPath)).href;
    const SDK = await import(sdkFileUrl);

    const spinner = ora('Analyzing project structure...').start();

    // Detect context
    const detector = new SDK.ContextDetector();
    const context = await detector.detectContext(targetPath);

    spinner.succeed('Context detected');

    // Display context information
    console.log(chalk.cyan('\n📦 Project Information:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(`Language: ${chalk.yellow(context.language || 'Unknown')}`);
    console.log(`Framework: ${chalk.yellow(context.framework || 'None detected')}`);
    console.log(`Build Tool: ${chalk.yellow(context.buildTool || 'None detected')}`);
    console.log(`Test Framework: ${chalk.yellow(context.testFramework || 'None detected')}`);
    console.log(chalk.gray('─'.repeat(60)));

    if (context.fileStats) {
      console.log(chalk.cyan('\n📊 File Statistics:'));
      console.log(chalk.gray('─'.repeat(60)));
      Object.entries(context.fileStats).forEach(([ext, count]) => {
        console.log(`${ext}: ${chalk.yellow(count)}`);
      });
      console.log(chalk.gray('─'.repeat(60)));
    }

    // Suggest investigation types
    console.log(chalk.cyan('\n💡 Recommended Investigations:'));
    console.log(chalk.gray('─'.repeat(60)));

    const recommendations: string[] = [];

    if (context.language === 'TypeScript' || context.language === 'JavaScript') {
      recommendations.push('🔒 Security Audit - Check for common vulnerabilities');
      recommendations.push('⚡ Performance Review - Analyze bundle size and runtime performance');
    }

    if (context.testFramework) {
      recommendations.push('✨ Code Quality Review - Analyze test coverage and code complexity');
    }

    if (context.framework) {
      recommendations.push('🏗️  Architecture Analysis - Review component structure and patterns');
    }

    if (recommendations.length === 0) {
      recommendations.push('🔧 Custom Investigation - General code analysis');
    }

    recommendations.forEach(rec => console.log(chalk.gray('  • ') + rec));
    console.log(chalk.gray('─'.repeat(60)));

    // Show quick metrics if available
    if (options.metrics) {
      spinner.start('Collecting code metrics...');

      const resourceTracker = new SDK.ResourceUsageTracker();
      const metrics = await resourceTracker.collectMetrics();

      spinner.succeed('Metrics collected');

      console.log(chalk.cyan('\n⚙️  System Metrics:'));
      console.log(chalk.gray('─'.repeat(60)));
      if (metrics.cpu) console.log(`CPU Usage: ${chalk.yellow(metrics.cpu.toFixed(2) + '%')}`);
      if (metrics.memory) console.log(`Memory: ${chalk.yellow((metrics.memory / 1024 / 1024).toFixed(2) + ' MB')}`);
      console.log(chalk.gray('─'.repeat(60)));
    }

    // Next steps
    console.log(chalk.cyan('\n🚀 Next Steps:'));
    console.log(chalk.gray('  • Run full investigation: ') + chalk.yellow('trinity investigate'));
    console.log(chalk.gray('  • View dashboard: ') + chalk.yellow('trinity dashboard'));
    console.log(chalk.gray('  • Check status: ') + chalk.yellow('trinity status'));

  } catch (error: any) {
    console.error(chalk.red('\n❌ Analysis failed:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
