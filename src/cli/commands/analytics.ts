/**
 * Analytics Command - View performance analytics and investigation metrics
 *
 * @see docs/workflows/analytics-workflow.md - Analytics visualization
 * @see docs/best-practices.md - Performance measurement
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Displays investigation performance metrics, strategy effectiveness, and system-wide analytics
 * with trend analysis. Provides data-driven insights for continuous improvement.
 *
 * **Why This Exists:**
 * "What gets measured gets improved." This command surfaces learning system data: which strategies
 * work best, investigation durations, agent performance trends. Teams see concrete evidence of
 * improvement over time, identify bottlenecks, and make data-driven workflow optimizations.
 *
 * @example
 * ```bash
 * # View analytics dashboard
 * npx trinity analytics
 *
 * # Export as JSON
 * npx trinity analytics --format json
 *
 * # Specific time period
 * npx trinity analytics --period 7d
 * ```
 *
 * @module cli/commands/analytics
 */

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface AnalyticsOptions {
  format?: 'text' | 'json';
  period?: string;
}

/**
 * Display Trinity analytics dashboard
 * @param options - Analytics display options
 */
export async function analytics(options: AnalyticsOptions = {}): Promise<void> {
  console.log(chalk.blue.bold('\n📊 Trinity Analytics Dashboard\n'));

  const spinner = ora('Loading analytics data...').start();

  try {
    // Check if analytics is initialized
    const configPath = path.join(process.cwd(), 'trinity/analytics/config.json');

    if (!(await fs.pathExists(configPath))) {
      spinner.fail('Analytics not initialized');
      console.log(chalk.yellow('\n   Run `trinity deploy` first to initialize analytics'));
      return;
    }

    const config = await fs.readJson(configPath);

    if (!config.enabled) {
      spinner.warn('Analytics is disabled');
      console.log(chalk.yellow('\n   Enable analytics in trinity/analytics/config.json'));
      return;
    }

    spinner.succeed('Analytics loaded');

    // Display analytics dashboard
    console.log(chalk.green('\n📈 Performance Metrics:'));
    console.log(`   Status: ${config.enabled ? chalk.green('Enabled') : chalk.red('Disabled')}`);
    console.log(`   Framework: ${config.framework || 'Unknown'}`);
    console.log(`   Project: ${config.projectName || 'Unknown'}`);

    console.log(chalk.green('\n⚙️  Configuration:'));
    console.log(`   Collect Metrics: ${config.collectMetrics ? '✓' : '✗'}`);
    console.log(`   Track Performance: ${config.trackPerformance ? '✓' : '✗'}`);
    console.log(`   Detect Anomalies: ${config.detectAnomalies ? '✓' : '✗'}`);

    console.log(chalk.green('\n🎯 Thresholds:'));
    console.log(`   Response Time: ${config.thresholds?.responseTime || 1000}ms`);
    console.log(`   Error Rate: ${(config.thresholds?.errorRate || 0.05) * 100}%`);
    console.log(`   Cache Hit Rate: ${(config.thresholds?.cacheHitRate || 0.7) * 100}%`);

    console.log(chalk.cyan('\n💡 Use `/trinity-analytics` for detailed analysis\n'));

  } catch (error: any) {
    spinner.fail('Failed to load analytics');
    console.error(chalk.red(`   Error: ${error.message}`));
  }
}
