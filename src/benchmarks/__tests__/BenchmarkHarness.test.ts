/**
 * BenchmarkHarness Tests
 */

import { BenchmarkHarness } from '../BenchmarkHarness';
import { Benchmark, BenchmarkConfig, BenchmarkResult } from '../types';

class MockBenchmark extends Benchmark {
  constructor(config: BenchmarkConfig, private mockResult: Partial<BenchmarkResult> = {}) {
    super(config);
  }

  async run(): Promise<BenchmarkResult> {
    await new Promise((resolve) => setTimeout(resolve, 10));

    return {
      name: this.config.name,
      description: this.config.description,
      timestamp: new Date().toISOString(),
      duration: 100,
      iterations: 10,
      metrics: {
        testMetric: 42,
        ...this.mockResult.metrics,
      },
      passed: this.mockResult.passed ?? true,
      ...this.mockResult,
    };
  }
}

describe('BenchmarkHarness', () => {
  let harness: BenchmarkHarness;

  beforeEach(() => {
    harness = new BenchmarkHarness();
  });

  describe('register', () => {
    it('should register a benchmark', () => {
      const benchmark = new MockBenchmark({
        name: 'Test Benchmark',
        description: 'Test description',
      });

      harness.register(benchmark);
      expect(harness['benchmarks']).toHaveLength(1);
    });

    it('should register multiple benchmarks', () => {
      harness.register(
        new MockBenchmark({ name: 'Test 1', description: 'Desc 1' })
      );
      harness.register(
        new MockBenchmark({ name: 'Test 2', description: 'Desc 2' })
      );

      expect(harness['benchmarks']).toHaveLength(2);
    });
  });

  describe('runAll', () => {
    it('should run all registered benchmarks', async () => {
      harness.register(
        new MockBenchmark({ name: 'Benchmark 1', description: 'Test 1' })
      );
      harness.register(
        new MockBenchmark({ name: 'Benchmark 2', description: 'Test 2' })
      );

      const suite = await harness.runAll('Test Suite', 'Test description');

      expect(suite.benchmarks).toHaveLength(2);
      expect(suite.summary.total).toBe(2);
      expect(suite.summary.passed).toBe(2);
      expect(suite.summary.failed).toBe(0);
    });

    it('should handle benchmark failures', async () => {
      harness.register(
        new MockBenchmark(
          { name: 'Passing Benchmark', description: 'Pass' },
          { passed: true }
        )
      );
      harness.register(
        new MockBenchmark(
          { name: 'Failing Benchmark', description: 'Fail' },
          { passed: false }
        )
      );

      const suite = await harness.runAll();

      expect(suite.summary.total).toBe(2);
      expect(suite.summary.passed).toBe(1);
      expect(suite.summary.failed).toBe(1);
    });

    it('should generate summary statistics', async () => {
      harness.register(
        new MockBenchmark(
          { name: 'Benchmark 1', description: 'Test' },
          { metrics: { speed: 100 } }
        )
      );
      harness.register(
        new MockBenchmark(
          { name: 'Benchmark 2', description: 'Test' },
          { metrics: { speed: 200 } }
        )
      );

      const suite = await harness.runAll();

      expect(suite.summary.metrics.speed).toBeDefined();
      expect(suite.summary.metrics.speed.avg).toBe(150);
      expect(suite.summary.metrics.speed.min).toBe(100);
      expect(suite.summary.metrics.speed.max).toBe(200);
    });
  });

  describe('compare', () => {
    it('should compare two benchmark results', () => {
      const baseline: BenchmarkResult = {
        name: 'Test',
        description: 'Test',
        timestamp: new Date().toISOString(),
        duration: 100,
        iterations: 10,
        metrics: {
          speed: 1000,
          tokens: 5000,
          hitRate: 80,
        },
        passed: true,
      };

      const current: BenchmarkResult = {
        ...baseline,
        metrics: {
          speed: 800, // Improved (lower is better)
          tokens: 3000, // Improved (lower is better)
          hitRate: 85, // Improved (higher is better)
        },
      };

      const comparison = harness.compare(baseline, current);

      expect(comparison.differences.speed.percentChange).toBeLessThan(0);
      expect(comparison.differences.tokens.percentChange).toBeLessThan(0);
      expect(comparison.differences.hitRate.percentChange).toBeGreaterThan(0);
      expect(comparison.summary.improvements).toBe(3);
      expect(comparison.summary.regressions).toBe(0);
    });

    it('should detect regressions', () => {
      const baseline: BenchmarkResult = {
        name: 'Test',
        description: 'Test',
        timestamp: new Date().toISOString(),
        duration: 100,
        iterations: 10,
        metrics: {
          speed: 1000,
          hitRate: 80,
        },
        passed: true,
      };

      const current: BenchmarkResult = {
        ...baseline,
        metrics: {
          speed: 1200, // Regression (20% slower)
          hitRate: 70, // Regression (12.5% lower)
        },
      };

      const comparison = harness.compare(baseline, current);

      expect(comparison.summary.regressions).toBeGreaterThan(0);
      expect(comparison.differences.speed.regression).toBe(true);
      expect(comparison.differences.hitRate.regression).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all benchmarks and results', async () => {
      harness.register(
        new MockBenchmark({ name: 'Test', description: 'Test' })
      );
      await harness.runAll();

      expect(harness['benchmarks']).toHaveLength(1);
      expect(harness.getResults()).toHaveLength(1);

      harness.clear();

      expect(harness['benchmarks']).toHaveLength(0);
      expect(harness.getResults()).toHaveLength(0);
    });
  });
});
