/**
 * Cache Stats Command - Display cache statistics and performance metrics
 * @see docs/best-practices.md#caching-strategies
 * **Trinity Principle:** "Evidence-Based Decisions" - Monitor cache effectiveness
 * @module cli/commands/cache-stats
 */

import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

interface CacheStatsOptions {
  tier?: 'l1' | 'l2' | 'l3' | 'all';
}

export async function cacheStats(options: CacheStatsOptions = {}): Promise<void> {
  console.log(chalk.blue.bold('\n💾 Trinity Cache Statistics\n'));

  const spinner = ora('Loading cache data...').start();

  try {
    const configPath = path.join(process.cwd(), 'trinity/cache/config.json');

    if (!(await fs.pathExists(configPath))) {
      spinner.fail('Cache not initialized');
      console.log(chalk.yellow('\n   Run `trinity deploy` first to initialize cache'));
      return;
    }

    const config = await fs.readJson(configPath);

    if (!config.enabled) {
      spinner.warn('Cache is disabled');
      console.log(chalk.yellow('\n   Enable cache in trinity/cache/config.json'));
      return;
    }

    spinner.succeed('Cache data loaded');

    // Display cache configuration
    console.log(chalk.green('\n📊 Cache Configuration:'));
    console.log(`   Status: ${config.enabled ? chalk.green('Enabled') : chalk.red('Disabled')}`);
    console.log(`   Persist to Disk: ${config.persistToDisk ? '✓' : '✗'}`);
    console.log(`   Similarity Threshold: ${config.similarityThreshold || 0.8}`);

    console.log(chalk.green('\n🗂️  Cache Tiers:'));

    // L1 Cache
    const l1 = config.tiers?.l1 || {};
    console.log(chalk.cyan('   L1 (Memory):'));
    console.log(`      Max Size: ${l1.maxSize || 50} items`);
    console.log(`      TTL: ${(l1.ttl || 300000) / 1000}s`);

    // L2 Cache
    const l2 = config.tiers?.l2 || {};
    console.log(chalk.cyan('   L2 (Extended):'));
    console.log(`      Max Size: ${l2.maxSize || 200} items`);
    console.log(`      TTL: ${(l2.ttl || 1800000) / 1000}s`);

    // L3 Cache
    const l3 = config.tiers?.l3 || {};
    console.log(chalk.cyan('   L3 (Persistent):'));
    console.log(`      Max Size: ${l3.maxSize || 1000} items`);
    console.log(`      TTL: ${(l3.ttl || 86400000) / 1000}s`);

    console.log(chalk.cyan('\n💡 Use `/trinity-cache-stats` for live statistics\n'));

  } catch (error: any) {
    spinner.fail('Failed to load cache stats');
    console.error(chalk.red(`   Error: ${error.message}`));
  }
}
