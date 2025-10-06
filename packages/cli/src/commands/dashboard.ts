#!/usr/bin/env node
import { existsSync, writeFileSync } from 'fs';
import { pathToFileURL } from 'url';
import { join, resolve } from 'path';
import chalk from 'chalk';
import { DashboardOptions } from '../types';

/**
 * Trinity Dashboard Command
 *
 * Launches interactive dashboards for monitoring cache, learning, and investigations
 */

export async function dashboard(options: DashboardOptions): Promise<void> {
  console.log(chalk.cyan.bold('\n📊 Trinity Dashboard\n'));

  // Check if Trinity SDK is built
  const sdkPath = join(process.cwd(), 'dist', 'index.js');
  if (!existsSync(sdkPath)) {
    console.error(chalk.red('❌ Trinity SDK not built. Run "npm run build" first.'));
    process.exit(1);
  }

  try {
    // Import SDK
    const sdkFileUrl = pathToFileURL(resolve(sdkPath)).href;
    const SDK = await import(sdkFileUrl);

    const dashboardType = options.type || 'cache';

    console.log(chalk.cyan(`Launching ${dashboardType} dashboard...\n`));

    switch (dashboardType) {
      case 'cache': {
        console.log(chalk.yellow('📦 Cache Statistics Dashboard\n'));
        const cacheDashboard = new SDK.CacheStatsDashboard();
        await cacheDashboard.start();
        break;
      }

      case 'learning': {
        console.log(chalk.yellow('🧠 Learning Metrics Dashboard\n'));
        const learningDashboard = new SDK.LearningMetricsDashboard();
        await learningDashboard.start();
        break;
      }

      case 'registry': {
        console.log(chalk.yellow('📋 Investigation Registry Dashboard\n'));
        const registry = new SDK.InvestigationRegistry();
        const registryDashboard = new SDK.RegistryDashboard(registry);
        const html = await registryDashboard.generateDashboard();

        // Save to file
        const outputPath = options.output || './trinity-dashboard.html';
        writeFileSync(outputPath, html);

        console.log(chalk.green(`✅ Dashboard saved to: ${outputPath}`));
        console.log(chalk.gray(`   Open in browser to view all investigations`));
        break;
      }

      case 'benchmark': {
        console.log(chalk.yellow('⚡ Benchmark Dashboard\n'));
        const benchmarkDashboard = new SDK.BenchmarkDashboard();
        const html = await benchmarkDashboard.generateDashboard();

        const outputPath = options.output || './benchmark-dashboard.html';
        writeFileSync(outputPath, html);

        console.log(chalk.green(`✅ Benchmark dashboard saved to: ${outputPath}`));
        break;
      }

      default:
        console.error(chalk.red(`❌ Unknown dashboard type: ${dashboardType}`));
        console.log(chalk.yellow('\nAvailable dashboards:'));
        console.log(chalk.gray('  • cache      - Cache statistics (interactive)'));
        console.log(chalk.gray('  • learning   - Learning metrics (interactive)'));
        console.log(chalk.gray('  • registry   - Investigation registry (HTML)'));
        console.log(chalk.gray('  • benchmark  - Benchmark results (HTML)'));
        console.log(chalk.yellow('\nUsage:'));
        console.log(chalk.gray('  trinity dashboard --type cache'));
        process.exit(1);
    }

  } catch (error: any) {
    console.error(chalk.red('\n❌ Dashboard failed:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
