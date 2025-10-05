#!/usr/bin/env ts-node
/**
 * Benchmark Validation Script
 *
 * Validates that benchmark infrastructure is working correctly
 */

import { TokenBenchmark } from '../src/benchmarks/TokenBenchmark';
import { CacheBenchmark } from '../src/benchmarks/CacheBenchmark';
import { SpeedBenchmark } from '../src/benchmarks/SpeedBenchmark';
import { LearningBenchmark } from '../src/benchmarks/LearningBenchmark';
import { createLogger } from '../src/utils/Logger';

const logger = createLogger('BenchmarkValidation');

async function validateBenchmarks(): Promise<void> {
  logger.info('Starting benchmark validation...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Token Benchmark
  try {
    logger.info('✓ Validating Token Benchmark...');
    const tokenBench = new TokenBenchmark({
      name: 'Token Test',
      description: 'Test token benchmark',
      iterations: 2,
      warmupRuns: 1,
    });
    const tokenResult = await tokenBench.run();
    if (tokenResult.passed) {
      logger.info('  ✅ Token Benchmark PASSED\n');
      passed++;
    } else {
      logger.error('  ❌ Token Benchmark FAILED\n');
      failed++;
    }
  } catch (error) {
    logger.error(`  ❌ Token Benchmark ERROR: ${error}\n`);
    failed++;
  }

  // Test 2: Cache Benchmark
  try {
    logger.info('✓ Validating Cache Benchmark...');
    const cacheBench = new CacheBenchmark({
      name: 'Cache Test',
      description: 'Test cache benchmark',
      iterations: 2,
      warmupRuns: 1,
    });
    const cacheResult = await cacheBench.run();
    if (cacheResult.passed) {
      logger.info('  ✅ Cache Benchmark PASSED\n');
      passed++;
    } else {
      logger.error('  ❌ Cache Benchmark FAILED\n');
      failed++;
    }
  } catch (error) {
    logger.error(`  ❌ Cache Benchmark ERROR: ${error}\n`);
    failed++;
  }

  // Test 3: Speed Benchmark
  try {
    logger.info('✓ Validating Speed Benchmark...');
    const speedBench = new SpeedBenchmark({
      name: 'Speed Test',
      description: 'Test speed benchmark',
      iterations: 2,
      warmupRuns: 1,
    });
    const speedResult = await speedBench.run();
    if (speedResult.passed) {
      logger.info('  ✅ Speed Benchmark PASSED\n');
      passed++;
    } else {
      logger.error('  ❌ Speed Benchmark FAILED\n');
      failed++;
    }
  } catch (error) {
    logger.error(`  ❌ Speed Benchmark ERROR: ${error}\n`);
    failed++;
  }

  // Test 4: Learning Benchmark
  try {
    logger.info('✓ Validating Learning Benchmark...');
    const learningBench = new LearningBenchmark({
      name: 'Learning Test',
      description: 'Test learning benchmark',
      iterations: 2,
      warmupRuns: 1,
    });
    const learningResult = await learningBench.run();
    if (learningResult.passed) {
      logger.info('  ✅ Learning Benchmark PASSED\n');
      passed++;
    } else {
      logger.error('  ❌ Learning Benchmark FAILED\n');
      failed++;
    }
  } catch (error) {
    logger.error(`  ❌ Learning Benchmark ERROR: ${error}\n`);
    failed++;
  }

  // Summary
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('📊 Benchmark Validation Summary');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info(`✅ Passed: ${passed}/4`);
  logger.info(`❌ Failed: ${failed}/4`);
  logger.info(`Success Rate: ${((passed / 4) * 100).toFixed(1)}%`);
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// Run validation
validateBenchmarks().catch((error) => {
  logger.error('Benchmark validation failed:', error);
  process.exit(1);
});
