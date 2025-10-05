/**
 * TokenBenchmark Tests
 */

import { TokenBenchmark } from '../TokenBenchmark';

describe('TokenBenchmark', () => {
  it('should measure token usage with and without cache', async () => {
    const benchmark = new TokenBenchmark({
      name: 'Token Test',
      description: 'Test token benchmark',
      iterations: 3,
      warmupRuns: 1,
    });

    const result = await benchmark.run();

    expect(result.name).toBe('Token Test');
    expect(result.passed).toBeDefined();
    expect(result.metrics.baselineAvg).toBeGreaterThan(0);
    expect(result.metrics.optimizedAvg).toBeGreaterThan(0);
    expect(result.metrics.baselineAvg).toBeGreaterThan(result.metrics.optimizedAvg);
    expect(result.metrics.percentReduction).toBeGreaterThan(0);
    expect(result.iterations).toBe(3);
  });

  it('should validate token reduction meets threshold', async () => {
    const benchmark = new TokenBenchmark({
      name: 'Token Test',
      description: 'Test',
      iterations: 5,
    });

    const result = await benchmark.run();

    // Should achieve >60% reduction with 30-50% repeat rates
    expect(result.metrics.percentReduction).toBeGreaterThanOrEqual(60);
    expect(result.passed).toBe(true);
  });

  it('should handle custom scenarios', async () => {
    const customScenarios = [
      {
        name: 'Custom Scenario',
        queryCount: 10,
        repeatRate: 0.5,
        avgTokensPerQuery: 100,
      },
    ];

    const benchmark = new TokenBenchmark(
      {
        name: 'Custom Token Test',
        description: 'Custom test',
        iterations: 2,
      },
      customScenarios
    );

    const result = await benchmark.run();

    expect(result.metadata?.scenarios).toBe(1);
    expect(result.metrics.baselineAvg).toBeGreaterThan(0);
  });

  it('should have low variance across runs', async () => {
    const benchmark = new TokenBenchmark({
      name: 'Variance Test',
      description: 'Test variance',
      iterations: 10,
    });

    const result = await benchmark.run();

    // Variance should be ≤5%
    expect(result.metrics.variancePercent).toBeLessThanOrEqual(5);
  });
});
