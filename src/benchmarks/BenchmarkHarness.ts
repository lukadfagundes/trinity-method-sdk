/**
 * Benchmark Harness
 *
 * Orchestrates benchmark execution, collects results, and generates reports.
 */

import { Benchmark, BenchmarkResult, BenchmarkSuite, BenchmarkComparison } from './types';
import { createLogger } from '../utils/Logger';

const logger = createLogger('BenchmarkHarness');

export class BenchmarkHarness {
  private benchmarks: Benchmark[] = [];
  private results: BenchmarkResult[] = [];

  /**
   * Register a benchmark to run
   */
  register(benchmark: Benchmark): void {
    this.benchmarks.push(benchmark);
  }

  /**
   * Run all registered benchmarks
   */
  async runAll(name: string = 'Benchmark Suite', description: string = ''): Promise<BenchmarkSuite> {
    logger.info(`\n🏁 Starting Benchmark Suite: ${name}`);
    logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    this.results = [];
    const suiteStart = Date.now();

    for (const benchmark of this.benchmarks) {
      try {
        const result = await benchmark.run();
        this.results.push(result);

        const status = result.passed ? '✅' : '❌';
        logger.info(`${status} ${result.name} - ${result.duration}ms`);
      } catch (error) {
        const errorResult: BenchmarkResult = {
          name: 'Unknown',
          description: 'Benchmark error',
          timestamp: new Date().toISOString(),
          duration: 0,
          iterations: 0,
          metrics: {},
          passed: false,
          error: error instanceof Error ? error.message : String(error),
        };
        this.results.push(errorResult);
        logger.error(`Benchmark failed: ${errorResult.error}`);
      }
    }

    const suiteDuration = Date.now() - suiteStart;

    logger.info(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    logger.info(`✅ Suite completed in ${suiteDuration}ms\n`);

    const suite: BenchmarkSuite = {
      name,
      description,
      benchmarks: this.results,
      summary: this.generateSummary(),
      timestamp: new Date().toISOString(),
      duration: suiteDuration,
    };

    return suite;
  }

  /**
   * Run a single benchmark by name
   */
  async runSingle(benchmarkName: string): Promise<BenchmarkResult> {
    const benchmark = this.benchmarks.find(
      (b) => (b as any).config?.name === benchmarkName
    );

    if (!benchmark) {
      throw new Error(`Benchmark "${benchmarkName}" not found`);
    }

    logger.info(`\n🏁 Running Benchmark: ${benchmarkName}`);
    logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    const result = await benchmark.run();
    this.results.push(result);

    const status = result.passed ? '✅' : '❌';
    logger.info(`${status} ${result.name} - ${result.duration}ms\n`);

    return result;
  }

  /**
   * Compare two benchmark results
   */
  compare(baseline: BenchmarkResult, current: BenchmarkResult): BenchmarkComparison {
    const differences: Record<string, any> = {};
    let regressions = 0;
    let improvements = 0;
    let neutral = 0;

    // Compare numeric metrics
    for (const key of Object.keys(baseline.metrics)) {
      const baselineValue = baseline.metrics[key];
      const currentValue = current.metrics[key];

      if (typeof baselineValue === 'number' && typeof currentValue === 'number') {
        const diff = currentValue - baselineValue;
        const percentChange = (diff / baselineValue) * 100;

        // Determine if regression (higher is worse for time/tokens, lower is worse for hit rates)
        const isRegression = this.isRegression(key, baselineValue, currentValue);

        if (isRegression) regressions++;
        else if (diff < 0 || (key.includes('rate') && diff > 0)) improvements++;
        else neutral++;

        differences[key] = {
          baseline: baselineValue,
          current: currentValue,
          diff,
          percentChange,
          regression: isRegression,
        };
      }
    }

    return {
      baseline,
      current,
      differences,
      summary: {
        totalMetrics: Object.keys(differences).length,
        regressions,
        improvements,
        neutral,
      },
    };
  }

  /**
   * Determine if a metric change is a regression
   */
  private isRegression(metricName: string, baseline: number, current: number): boolean {
    const lowerIsBetter = ['time', 'duration', 'tokens', 'latency', 'ms'];
    const higherIsBetter = ['rate', 'score', 'accuracy', 'throughput'];

    const isLowerBetter = lowerIsBetter.some((term) =>
      metricName.toLowerCase().includes(term)
    );
    const isHigherBetter = higherIsBetter.some((term) =>
      metricName.toLowerCase().includes(term)
    );

    if (isLowerBetter) {
      // For time/tokens, higher current value is regression
      return current > baseline * 1.05; // 5% threshold
    }

    if (isHigherBetter) {
      // For rates/scores, lower current value is regression
      return current < baseline * 0.95; // 5% threshold
    }

    // Unknown metric type, no regression
    return false;
  }

  /**
   * Generate summary statistics
   */
  private generateSummary() {
    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;
    const duration = this.results.reduce((sum, r) => sum + r.duration, 0);

    // Aggregate metrics
    const metricValues: Record<string, number[]> = {};

    for (const result of this.results) {
      for (const [key, value] of Object.entries(result.metrics)) {
        if (typeof value === 'number') {
          if (!metricValues[key]) metricValues[key] = [];
          metricValues[key].push(value);
        }
      }
    }

    const metrics: Record<string, any> = {};
    for (const [key, values] of Object.entries(metricValues)) {
      metrics[key] = this.calculateStatistics(values);
    }

    return {
      total: this.results.length,
      passed,
      failed,
      duration,
      metrics,
    };
  }

  /**
   * Calculate statistics for a set of values
   */
  private calculateStatistics(values: number[]) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);

    return { min, max, avg, stdDev };
  }

  /**
   * Get all results
   */
  getResults(): BenchmarkResult[] {
    return this.results;
  }

  /**
   * Clear all benchmarks and results
   */
  clear(): void {
    this.benchmarks = [];
    this.results = [];
  }
}
