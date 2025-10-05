/**
 * Cache Performance Benchmark
 *
 * Measures cache hit rates and lookup times across L1/L2/L3 tiers.
 */

import { Benchmark, BenchmarkConfig, BenchmarkResult } from './types';

export interface CacheSimulation {
  l1Size: number;
  l2Size: number;
  l3Size: number;
  queryCount: number;
  repeatRate: number;
}

export class CacheBenchmark extends Benchmark {
  private simulation: CacheSimulation;

  constructor(config: BenchmarkConfig, simulation?: CacheSimulation) {
    super(config);
    this.simulation = simulation || {
      l1Size: 100,
      l2Size: 1000,
      l3Size: 10000,
      queryCount: 1000,
      repeatRate: 0.3, // 30% of queries are repeats
    };
  }

  /**
   * Run cache performance benchmark
   */
  async run(): Promise<BenchmarkResult> {
    const startTime = Date.now();
    const iterations = this.config.iterations || 10;

    console.log(`\n💾 Cache Performance Benchmark`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Warmup runs
    console.log(`Warming up (${this.config.warmupRuns} runs)...`);
    for (let i = 0; i < (this.config.warmupRuns || 2); i++) {
      await this.runIteration();
    }

    // Benchmark runs
    console.log(`\nRunning ${iterations} iterations...`);
    const results: {
      l1HitRate: number;
      l2HitRate: number;
      l3HitRate: number;
      avgLookupTime: number;
    }[] = [];

    for (let i = 0; i < iterations; i++) {
      const result = await this.runIteration();
      results.push(result);
      process.stdout.write(
        `  Iteration ${i + 1}: L1=${result.l1HitRate.toFixed(1)}% L2=${result.l2HitRate.toFixed(1)}% L3=${result.l3HitRate.toFixed(1)}%\r`
      );
    }
    console.log(); // New line

    // Calculate statistics
    const l1Rates = results.map((r) => r.l1HitRate);
    const l2Rates = results.map((r) => r.l2HitRate);
    const l3Rates = results.map((r) => r.l3HitRate);
    const lookupTimes = results.map((r) => r.avgLookupTime);

    const l1Stats = this.calculateStatistics(l1Rates);
    const l2Stats = this.calculateStatistics(l2Rates);
    const l3Stats = this.calculateStatistics(l3Rates);
    const timeStats = this.calculateStatistics(lookupTimes);

    const duration = Date.now() - startTime;

    console.log(`\n📈 Results:`);
    console.log(`  L1 Hit Rate: ${l1Stats.avg.toFixed(1)}% (±${l1Stats.stdDev.toFixed(1)}%)`);
    console.log(`  L2 Hit Rate: ${l2Stats.avg.toFixed(1)}% (±${l2Stats.stdDev.toFixed(1)}%)`);
    console.log(`  L3 Hit Rate: ${l3Stats.avg.toFixed(1)}% (±${l3Stats.stdDev.toFixed(1)}%)`);
    console.log(`  Avg Lookup:  ${timeStats.avg.toFixed(2)}ms (±${timeStats.stdDev.toFixed(2)}ms)`);

    // Validation: Check if performance meets expectations
    // L1 should be >80%, L2 >60%, L3 >40%, lookup time <5ms
    const passed =
      l1Stats.avg >= 80 &&
      l2Stats.avg >= 60 &&
      l3Stats.avg >= 40 &&
      timeStats.avg < 5 &&
      l1Stats.stdDev / l1Stats.avg <= 0.05;

    return {
      name: this.config.name,
      description: this.config.description,
      timestamp: new Date().toISOString(),
      duration,
      iterations,
      metrics: {
        l1HitRateAvg: l1Stats.avg,
        l1HitRateStdDev: l1Stats.stdDev,
        l2HitRateAvg: l2Stats.avg,
        l2HitRateStdDev: l2Stats.stdDev,
        l3HitRateAvg: l3Stats.avg,
        l3HitRateStdDev: l3Stats.stdDev,
        avgLookupTime: timeStats.avg,
        lookupTimeStdDev: timeStats.stdDev,
        variancePercent: (l1Stats.stdDev / l1Stats.avg) * 100,
      },
      metadata: {
        simulation: this.simulation,
      },
      passed,
    };
  }

  /**
   * Run a single iteration simulating cache behavior
   */
  private async runIteration(): Promise<{
    l1HitRate: number;
    l2HitRate: number;
    l3HitRate: number;
    avgLookupTime: number;
  }> {
    const { queryCount, repeatRate } = this.simulation;

    // Simulate cache with LRU
    const l1Cache = new Map<string, any>();
    const l2Cache = new Map<string, any>();
    const l3Cache = new Map<string, any>();

    let l1Hits = 0;
    let l2Hits = 0;
    let l3Hits = 0;
    let totalLookupTime = 0;

    // Generate queries
    const queries: string[] = [];
    const uniqueCount = Math.floor(queryCount * (1 - repeatRate));

    // Unique queries
    for (let i = 0; i < uniqueCount; i++) {
      queries.push(`query_${i}`);
    }

    // Repeat queries
    for (let i = 0; i < queryCount - uniqueCount; i++) {
      const randomIndex = Math.floor(Math.random() * uniqueCount);
      queries.push(`query_${randomIndex}`);
    }

    // Shuffle queries
    this.shuffle(queries);

    // Process queries
    for (const query of queries) {
      const lookupStart = performance.now();

      if (l1Cache.has(query)) {
        l1Hits++;
        totalLookupTime += performance.now() - lookupStart;
      } else if (l2Cache.has(query)) {
        l2Hits++;
        // Promote to L1
        l1Cache.set(query, true);
        if (l1Cache.size > this.simulation.l1Size) {
          const firstKey = l1Cache.keys().next().value;
          l1Cache.delete(firstKey);
        }
        totalLookupTime += performance.now() - lookupStart;
      } else if (l3Cache.has(query)) {
        l3Hits++;
        // Promote to L2
        l2Cache.set(query, true);
        if (l2Cache.size > this.simulation.l2Size) {
          const firstKey = l2Cache.keys().next().value;
          l2Cache.delete(firstKey);
        }
        totalLookupTime += performance.now() - lookupStart;
      } else {
        // Cache miss - add to L1
        l1Cache.set(query, true);
        if (l1Cache.size > this.simulation.l1Size) {
          const firstKey = l1Cache.keys().next().value;
          l1Cache.delete(firstKey);
        }
        totalLookupTime += performance.now() - lookupStart + 2; // Simulate DB lookup
      }
    }

    return {
      l1HitRate: (l1Hits / queryCount) * 100,
      l2HitRate: (l2Hits / queryCount) * 100,
      l3HitRate: (l3Hits / queryCount) * 100,
      avgLookupTime: totalLookupTime / queryCount,
    };
  }

  /**
   * Shuffle array in place (Fisher-Yates)
   */
  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
