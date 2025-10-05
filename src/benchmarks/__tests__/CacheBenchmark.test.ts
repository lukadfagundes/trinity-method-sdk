/**
 * CacheBenchmark Tests
 */

import { CacheBenchmark } from '../CacheBenchmark';

describe('CacheBenchmark', () => {
  it('should measure cache performance across tiers', async () => {
    const benchmark = new CacheBenchmark({
      name: 'Cache Test',
      description: 'Test cache benchmark',
      iterations: 3,
      warmupRuns: 1,
    });

    const result = await benchmark.run();

    expect(result.name).toBe('Cache Test');
    expect(result.metrics.l1HitRateAvg).toBeGreaterThan(0);
    expect(result.metrics.l2HitRateAvg).toBeGreaterThan(0);
    expect(result.metrics.l3HitRateAvg).toBeGreaterThan(0);
    expect(result.metrics.avgLookupTime).toBeGreaterThan(0);
    expect(result.iterations).toBe(3);
  });

  it('should achieve expected hit rates', async () => {
    const benchmark = new CacheBenchmark({
      name: 'Hit Rate Test',
      description: 'Test',
      iterations: 10,
    });

    const result = await benchmark.run();

    // With 30% repeat rate, should achieve good hit rates
    expect(result.metrics.l1HitRateAvg).toBeGreaterThanOrEqual(80);
    expect(result.metrics.l2HitRateAvg).toBeGreaterThanOrEqual(60);
    expect(result.metrics.l3HitRateAvg).toBeGreaterThanOrEqual(40);
  });

  it('should have fast lookup times', async () => {
    const benchmark = new CacheBenchmark({
      name: 'Lookup Time Test',
      description: 'Test',
      iterations: 5,
    });

    const result = await benchmark.run();

    // Average lookup should be <5ms
    expect(result.metrics.avgLookupTime).toBeLessThan(5);
  });

  it('should handle custom cache configuration', async () => {
    const customSimulation = {
      l1Size: 50,
      l2Size: 500,
      l3Size: 5000,
      queryCount: 500,
      repeatRate: 0.4,
    };

    const benchmark = new CacheBenchmark(
      {
        name: 'Custom Cache Test',
        description: 'Custom test',
        iterations: 2,
      },
      customSimulation
    );

    const result = await benchmark.run();

    expect(result.metadata?.simulation).toEqual(customSimulation);
    expect(result.metrics.l1HitRateAvg).toBeGreaterThan(0);
  });
});
