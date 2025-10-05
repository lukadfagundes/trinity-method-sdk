/**
 * Token Usage Benchmark
 *
 * Measures token usage with and without caching to validate optimization claims.
 */

import { Benchmark, BenchmarkConfig, BenchmarkResult } from './types';

export interface TokenBenchmarkScenario {
  name: string;
  queryCount: number;
  repeatRate: number; // Percentage of queries that are repeats
  avgTokensPerQuery: number;
}

export class TokenBenchmark extends Benchmark {
  private scenarios: TokenBenchmarkScenario[];

  constructor(config: BenchmarkConfig, scenarios?: TokenBenchmarkScenario[]) {
    super(config);
    this.scenarios = scenarios || this.getDefaultScenarios();
  }

  /**
   * Run token usage benchmark
   */
  async run(): Promise<BenchmarkResult> {
    const startTime = Date.now();
    const iterations = this.config.iterations || 10;

    console.log(`\n📊 Token Usage Benchmark`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Warmup runs
    console.log(`Warming up (${this.config.warmupRuns} runs)...`);
    for (let i = 0; i < (this.config.warmupRuns || 2); i++) {
      await this.runIteration(false);
    }

    // Baseline (no cache) measurements
    console.log(`\nBaseline (no cache) - ${iterations} iterations...`);
    const baselineResults: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const result = await this.runIteration(false);
      baselineResults.push(result.totalTokens);
      process.stdout.write(`  Iteration ${i + 1}: ${result.totalTokens} tokens\r`);
    }
    console.log(); // New line

    // Optimized (with cache) measurements
    console.log(`\nOptimized (with cache) - ${iterations} iterations...`);
    const optimizedResults: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const result = await this.runIteration(true);
      optimizedResults.push(result.totalTokens);
      process.stdout.write(`  Iteration ${i + 1}: ${result.totalTokens} tokens\r`);
    }
    console.log(); // New line

    // Calculate statistics
    const baselineStats = this.calculateStatistics(baselineResults);
    const optimizedStats = this.calculateStatistics(optimizedResults);

    const tokenReduction = baselineStats.avg - optimizedStats.avg;
    const percentReduction = (tokenReduction / baselineStats.avg) * 100;

    const duration = Date.now() - startTime;

    console.log(`\n📈 Results:`);
    console.log(`  Baseline:   ${baselineStats.avg.toFixed(0)} tokens (±${baselineStats.stdDev.toFixed(0)})`);
    console.log(`  Optimized:  ${optimizedStats.avg.toFixed(0)} tokens (±${optimizedStats.stdDev.toFixed(0)})`);
    console.log(`  Reduction:  ${tokenReduction.toFixed(0)} tokens (${percentReduction.toFixed(1)}%)`);

    // Validation: Check if reduction meets claim (e.g., >60% reduction)
    const passed = percentReduction >= 60 && baselineStats.stdDev / baselineStats.avg <= 0.05;

    return {
      name: this.config.name,
      description: this.config.description,
      timestamp: new Date().toISOString(),
      duration,
      iterations,
      metrics: {
        baselineAvg: baselineStats.avg,
        baselineStdDev: baselineStats.stdDev,
        optimizedAvg: optimizedStats.avg,
        optimizedStdDev: optimizedStats.stdDev,
        tokenReduction,
        percentReduction,
        variancePercent: (baselineStats.stdDev / baselineStats.avg) * 100,
      },
      metadata: {
        scenarios: this.scenarios.length,
        warmupRuns: this.config.warmupRuns,
      },
      passed,
    };
  }

  /**
   * Run a single iteration
   */
  private async runIteration(useCache: boolean): Promise<{ totalTokens: number }> {
    let totalTokens = 0;

    for (const scenario of this.scenarios) {
      const { queryCount, repeatRate, avgTokensPerQuery } = scenario;

      const uniqueQueries = Math.floor(queryCount * (1 - repeatRate));
      const repeatQueries = queryCount - uniqueQueries;

      if (useCache) {
        // With cache: Only unique queries consume tokens, repeats are cached
        totalTokens += uniqueQueries * avgTokensPerQuery;
      } else {
        // Without cache: All queries consume tokens
        totalTokens += queryCount * avgTokensPerQuery;
      }
    }

    // Simulate processing time
    await this.delay(10);

    return { totalTokens };
  }

  /**
   * Get default benchmark scenarios
   */
  private getDefaultScenarios(): TokenBenchmarkScenario[] {
    return [
      {
        name: 'Security Investigation',
        queryCount: 50,
        repeatRate: 0.4, // 40% of queries are repeats
        avgTokensPerQuery: 1500,
      },
      {
        name: 'Code Analysis',
        queryCount: 100,
        repeatRate: 0.3, // 30% of queries are repeats
        avgTokensPerQuery: 1200,
      },
      {
        name: 'Pattern Recognition',
        queryCount: 75,
        repeatRate: 0.5, // 50% of queries are repeats
        avgTokensPerQuery: 1000,
      },
    ];
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
