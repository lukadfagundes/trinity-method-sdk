/**
 * Benchmark System Types
 *
 * Type definitions for the Trinity Method benchmarking system.
 */

export interface BenchmarkConfig {
  name: string;
  description: string;
  iterations?: number;
  warmupRuns?: number;
  timeout?: number;
}

export interface BenchmarkResult {
  name: string;
  description: string;
  timestamp: string;
  duration: number;
  iterations: number;
  metrics: Record<string, number | string>;
  metadata?: Record<string, any>;
  passed: boolean;
  error?: string;
}

export interface BenchmarkSuite {
  name: string;
  description: string;
  benchmarks: BenchmarkResult[];
  summary: BenchmarkSummary;
  timestamp: string;
  duration: number;
}

export interface BenchmarkSummary {
  total: number;
  passed: number;
  failed: number;
  duration: number;
  metrics: Record<string, {
    min: number;
    max: number;
    avg: number;
    stdDev: number;
  }>;
}

export interface BenchmarkComparison {
  baseline: BenchmarkResult;
  current: BenchmarkResult;
  differences: Record<string, {
    baseline: number;
    current: number;
    diff: number;
    percentChange: number;
    regression: boolean;
  }>;
  summary: {
    totalMetrics: number;
    regressions: number;
    improvements: number;
    neutral: number;
  };
}

export abstract class Benchmark {
  protected config: BenchmarkConfig;

  constructor(config: BenchmarkConfig) {
    this.config = {
      iterations: 10,
      warmupRuns: 2,
      timeout: 300000, // 5 minutes
      ...config,
    };
  }

  abstract run(): Promise<BenchmarkResult>;

  protected async measure<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  }

  protected calculateStatistics(values: number[]): {
    min: number;
    max: number;
    avg: number;
    stdDev: number;
  } {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);

    return { min, max, avg, stdDev };
  }
}
