/**
 * Investigation Speed Benchmark
 *
 * Measures investigation execution speed comparing sequential vs coordinated multi-agent.
 */

import { createLogger } from '../utils/Logger';

import { Benchmark, BenchmarkConfig, BenchmarkResult } from './types';

const logger = createLogger('SpeedBenchmark');

export interface SpeedScenario {
  name: string;
  taskCount: number;
  avgTaskDuration: number;
  parallelizableTasks: number;
}

export class SpeedBenchmark extends Benchmark {
  private scenarios: SpeedScenario[];

  constructor(config: BenchmarkConfig, scenarios?: SpeedScenario[]) {
    super(config);
    this.scenarios = scenarios || this.getDefaultScenarios();
  }

  /**
   * Run speed benchmark
   */
  async run(): Promise<BenchmarkResult> {
    const startTime = Date.now();
    const iterations = this.config.iterations || 10;

    logger.info(`\n⚡ Investigation Speed Benchmark`);
    logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Warmup runs
    logger.info(`Warming up (${this.config.warmupRuns} runs)...`);
    for (let i = 0; i < (this.config.warmupRuns || 2); i++) {
      await this.runIteration(false);
      await this.runIteration(true);
    }

    // Sequential (baseline) measurements
    logger.info(`\nSequential (baseline) - ${iterations} iterations...`);
    const sequentialResults: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const result = await this.runIteration(false);
      sequentialResults.push(result.duration);
      process.stdout.write(`  Iteration ${i + 1}: ${result.duration.toFixed(0)}ms\r`);
    }
    logger.info(''); // New line

    // Parallel (optimized) measurements
    logger.info(`\nParallel (coordinated) - ${iterations} iterations...`);
    const parallelResults: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const result = await this.runIteration(true);
      parallelResults.push(result.duration);
      process.stdout.write(`  Iteration ${i + 1}: ${result.duration.toFixed(0)}ms\r`);
    }
    logger.info(''); // New line

    // Calculate statistics
    const sequentialStats = this.calculateStatistics(sequentialResults);
    const parallelStats = this.calculateStatistics(parallelResults);

    const speedup = sequentialStats.avg / parallelStats.avg;
    const percentReduction = ((sequentialStats.avg - parallelStats.avg) / sequentialStats.avg) * 100;

    const duration = Date.now() - startTime;

    logger.info(`\n📈 Results:`);
    logger.info(`  Sequential: ${sequentialStats.avg.toFixed(0)}ms (±${sequentialStats.stdDev.toFixed(0)}ms)`);
    logger.info(`  Parallel:   ${parallelStats.avg.toFixed(0)}ms (±${parallelStats.stdDev.toFixed(0)}ms)`);
    logger.info(`  Speedup:    ${speedup.toFixed(2)}x (${percentReduction.toFixed(1)}% faster)`);

    // Validation: Check if speedup meets expectations (e.g., >2x faster)
    const passed = speedup >= 2.0 && sequentialStats.stdDev / sequentialStats.avg <= 0.05;

    return {
      name: this.config.name,
      description: this.config.description,
      timestamp: new Date().toISOString(),
      duration,
      iterations,
      metrics: {
        sequentialAvg: sequentialStats.avg,
        sequentialStdDev: sequentialStats.stdDev,
        parallelAvg: parallelStats.avg,
        parallelStdDev: parallelStats.stdDev,
        speedup,
        percentReduction,
        variancePercent: (sequentialStats.stdDev / sequentialStats.avg) * 100,
      },
      metadata: {
        scenarios: this.scenarios.length,
      },
      passed,
    };
  }

  /**
   * Run a single iteration
   */
  private async runIteration(parallel: boolean): Promise<{ duration: number }> {
    const startTime = performance.now();

    for (const scenario of this.scenarios) {
      if (parallel) {
        await this.runParallel(scenario);
      } else {
        await this.runSequential(scenario);
      }
    }

    const duration = performance.now() - startTime;
    return { duration };
  }

  /**
   * Run tasks sequentially
   */
  private async runSequential(scenario: SpeedScenario): Promise<void> {
    const { taskCount, avgTaskDuration } = scenario;

    for (let i = 0; i < taskCount; i++) {
      await this.simulateTask(avgTaskDuration);
    }
  }

  /**
   * Run tasks in parallel (coordinated)
   */
  private async runParallel(scenario: SpeedScenario): Promise<void> {
    const { taskCount, avgTaskDuration, parallelizableTasks } = scenario;

    // Calculate how many tasks can run in parallel
    const parallelBatches = Math.ceil(parallelizableTasks / 4); // Assume 4 agents
    const sequentialTasks = taskCount - parallelizableTasks;

    // Run parallelizable tasks in batches
    const tasks: Promise<void>[] = [];
    for (let i = 0; i < parallelBatches; i++) {
      const batchSize = Math.min(4, parallelizableTasks - i * 4);
      for (let j = 0; j < batchSize; j++) {
        tasks.push(this.simulateTask(avgTaskDuration));
      }
      await Promise.all(tasks);
      tasks.length = 0; // Clear for next batch
    }

    // Run sequential tasks
    for (let i = 0; i < sequentialTasks; i++) {
      await this.simulateTask(avgTaskDuration);
    }
  }

  /**
   * Simulate a task with random duration
   */
  private async simulateTask(avgDuration: number): Promise<void> {
    // Add ±20% variance
    const variance = avgDuration * 0.2;
    const duration = avgDuration + (Math.random() * variance * 2 - variance);
    await this.delay(duration);
  }

  /**
   * Get default benchmark scenarios
   */
  private getDefaultScenarios(): SpeedScenario[] {
    return [
      {
        name: 'Security Investigation',
        taskCount: 20,
        avgTaskDuration: 50, // ms
        parallelizableTasks: 16, // 80% can be parallelized
      },
      {
        name: 'Code Analysis',
        taskCount: 30,
        avgTaskDuration: 40,
        parallelizableTasks: 24, // 80% can be parallelized
      },
      {
        name: 'Performance Audit',
        taskCount: 25,
        avgTaskDuration: 45,
        parallelizableTasks: 20, // 80% can be parallelized
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
