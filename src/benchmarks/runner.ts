/**
 * Benchmark Runner
 *
 * CLI entry point for running benchmarks.
 */

import { BenchmarkHarness } from './BenchmarkHarness';
import { BenchmarkReporter } from './BenchmarkReporter';
import { TokenBenchmark } from './TokenBenchmark';
import { CacheBenchmark } from './CacheBenchmark';
import { SpeedBenchmark } from './SpeedBenchmark';
import { LearningBenchmark } from './LearningBenchmark';

export interface RunnerOptions {
  type?: 'token' | 'cache' | 'speed' | 'learning' | 'all';
  iterations?: number;
  warmupRuns?: number;
  visualize?: boolean;
  outputDir?: string;
}

export async function runBenchmarks(options: RunnerOptions = {}): Promise<void> {
  const {
    type = 'all',
    iterations = 10,
    warmupRuns = 2,
    visualize = false,
    outputDir = 'trinity/benchmarks',
  } = options;

  const harness = new BenchmarkHarness();
  const reporter = new BenchmarkReporter(outputDir);

  // Register benchmarks based on type
  if (type === 'all' || type === 'token') {
    harness.register(
      new TokenBenchmark({
        name: 'Token Usage',
        description: 'Measure token savings with caching (baseline vs optimized)',
        iterations,
        warmupRuns,
      })
    );
  }

  if (type === 'all' || type === 'cache') {
    harness.register(
      new CacheBenchmark({
        name: 'Cache Performance',
        description: 'Measure L1/L2/L3 cache hit rates and lookup times',
        iterations,
        warmupRuns,
      })
    );
  }

  if (type === 'all' || type === 'speed') {
    harness.register(
      new SpeedBenchmark({
        name: 'Investigation Speed',
        description: 'Measure investigation speed (sequential vs coordinated)',
        iterations,
        warmupRuns,
      })
    );
  }

  if (type === 'all' || type === 'learning') {
    harness.register(
      new LearningBenchmark({
        name: 'Learning Effectiveness',
        description: 'Measure learning improvements (baseline vs experienced)',
        iterations,
        warmupRuns,
      })
    );
  }

  // Run benchmarks
  const suiteName = type === 'all' ? 'Trinity Method Performance' : `${type.charAt(0).toUpperCase()}${type.slice(1)} Benchmark`;
  const suite = await harness.runAll(suiteName, 'Comprehensive performance validation');

  // Generate reports
  await reporter.generateReports(suite);

  // Generate visualization if requested
  if (visualize) {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const htmlPath = `${outputDir}/${suiteName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.html`;
    reporter.generateVisualization(suite, htmlPath);
    console.log(`📊 Visualization: ${htmlPath}`);
  }

  // Print summary
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📊 Benchmark Summary`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total: ${suite.summary.total}`);
  console.log(`Passed: ${suite.summary.passed} ✅`);
  console.log(`Failed: ${suite.summary.failed} ${suite.summary.failed > 0 ? '❌' : ''}`);
  console.log(`Success Rate: ${((suite.summary.passed / suite.summary.total) * 100).toFixed(1)}%`);
  console.log(`Duration: ${(suite.duration / 1000).toFixed(2)}s`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (suite.summary.failed > 0) {
    console.log(`⚠️  ${suite.summary.failed} benchmark(s) failed validation criteria.`);
    console.log(`Review the reports for detailed analysis.\n`);
    process.exit(1);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: RunnerOptions = {};

  // Parse CLI arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--type' && args[i + 1]) {
      options.type = args[++i] as any;
    } else if (arg === '--iterations' && args[i + 1]) {
      options.iterations = parseInt(args[++i], 10);
    } else if (arg === '--warmup' && args[i + 1]) {
      options.warmupRuns = parseInt(args[++i], 10);
    } else if (arg === '--visualize') {
      options.visualize = true;
    } else if (arg === '--output' && args[i + 1]) {
      options.outputDir = args[++i];
    }
  }

  runBenchmarks(options).catch((error) => {
    console.error('Benchmark execution failed:', error);
    process.exit(1);
  });
}
