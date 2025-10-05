/**
 * Validation Benchmarks: Cache Performance
 * Validates WO-002 success criteria: 30-50% token reduction, ≥75% hit rate
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { AdvancedCacheManager } from '../../src/cache/AdvancedCacheManager';
import { CacheKeyGenerator } from '../../src/cache/CacheKeyGenerator';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Cache Performance Benchmarks', () => {
  let cacheManager: AdvancedCacheManager;
  let keyGenerator: CacheKeyGenerator;
  const benchmarkCacheDir = path.join(__dirname, '../../temp/benchmark-cache');

  // Benchmark test queries simulating real investigations
  const BENCHMARK_QUERIES = [
    // Authentication & Security (20%)
    'How is user authentication implemented in this codebase?',
    'Find all authentication-related middleware and handlers',
    'Analyze JWT token generation and validation logic',
    'Research session management strategy',
    'Identify OAuth2 integration patterns',

    // API & Routing (20%)
    'Find all API endpoint definitions',
    'How is request validation handled?',
    'Locate rate limiting implementation',
    'Analyze API versioning strategy',
    'Find CORS configuration',

    // Database & Data Access (20%)
    'How are database connections managed?',
    'Find all database migration files',
    'Analyze ORM/query builder usage',
    'Research database connection pooling',
    'Identify data validation patterns',

    // Error Handling & Logging (15%)
    'How is error handling structured in the application?',
    'Find all custom error classes',
    'Locate logging configuration and usage',
    'Analyze error recovery patterns',

    // Configuration & Environment (10%)
    'How are environment variables managed?',
    'Find all configuration files',
    'Analyze configuration validation approach',

    // Testing & Quality (10%)
    'Find all unit test files',
    'How is test coverage measured?',
    'Locate integration test setup',

    // Performance & Optimization (5%)
    'Find caching implementations',
    'Analyze performance monitoring setup',
  ];

  // Variations to test similarity detection
  const QUERY_VARIATIONS = {
    'How is user authentication implemented in this codebase?': [
      'Explain the authentication implementation approach',
      'Describe how user authentication works',
      'What is the authentication mechanism used?',
    ],
    'Find all API endpoint definitions': [
      'Locate all API routes',
      'Where are the API endpoints defined?',
      'Show me all REST API endpoints',
    ],
    'How are database connections managed?': [
      'Explain database connection handling',
      'Describe the database connection strategy',
      'How does the app connect to the database?',
    ],
  };

  beforeAll(async () => {
    await fs.mkdir(benchmarkCacheDir, { recursive: true });

    keyGenerator = new CacheKeyGenerator();
    cacheManager = new AdvancedCacheManager({
      l1: {
        maxEntries: 1000,
        maxSize: 100 * 1024 * 1024, // 100MB
        ttl: 24 * 60 * 60 * 1000, // 24 hours
      },
      l2: {
        cacheDir: path.join(benchmarkCacheDir, 'l2'),
        maxSizeMB: 500,
        ttl: 24 * 60 * 60 * 1000,
      },
      l3: {
        cacheDir: path.join(benchmarkCacheDir, 'l3'),
        maxSizeMB: 1000,
        ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
        compressionLevel: 6,
      },
      similarityThreshold: 0.8,
      enableSimilarityDetection: true,
    });

    await cacheManager.initialize();
  });

  afterAll(async () => {
    try {
      await fs.rm(benchmarkCacheDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('Baseline Performance (Without Cache)', () => {
    it('should measure baseline investigation token usage', async () => {
      const baselineStats = {
        totalQueries: 0,
        totalTokens: 0,
        avgTokensPerQuery: 0,
        totalTimeMs: 0,
      };

      const startTime = Date.now();

      // Simulate 50 investigations without cache
      for (let i = 0; i < 50; i++) {
        const query = BENCHMARK_QUERIES[i % BENCHMARK_QUERIES.length];

        // Simulate investigation (would normally call LLM)
        const mockResult = simulateInvestigation(query);

        baselineStats.totalQueries++;
        baselineStats.totalTokens += mockResult.tokensUsed;
      }

      baselineStats.totalTimeMs = Date.now() - startTime;
      baselineStats.avgTokensPerQuery =
        baselineStats.totalTokens / baselineStats.totalQueries;

      // Report baseline
      console.log('\n=== BASELINE (NO CACHE) ===');
      console.log(`Total Queries: ${baselineStats.totalQueries}`);
      console.log(`Total Tokens: ${baselineStats.totalTokens.toLocaleString()}`);
      console.log(
        `Avg Tokens/Query: ${baselineStats.avgTokensPerQuery.toFixed(0)}`
      );
      console.log(`Total Time: ${baselineStats.totalTimeMs}ms`);

      // Store for comparison
      (global as any).__baselineStats = baselineStats;

      expect(baselineStats.totalTokens).toBeGreaterThan(0);
    });
  });

  describe('Cache-Enabled Performance', () => {
    it('should demonstrate ≥30% token reduction with cache', async () => {
      const cacheStats = {
        totalQueries: 0,
        totalTokens: 0,
        cacheHits: 0,
        cacheMisses: 0,
        similarityMatches: 0,
        avgTokensPerQuery: 0,
        totalTimeMs: 0,
      };

      const startTime = Date.now();

      // Round 1: Populate cache (all misses)
      for (let i = 0; i < 50; i++) {
        const query = BENCHMARK_QUERIES[i % BENCHMARK_QUERIES.length];
        const key = keyGenerator.generateKey(query, 'benchmark-agent', 'analysis');

        const cached = await cacheManager.get(key);

        if (cached) {
          cacheStats.cacheHits++;
          // No tokens used (cache hit)
        } else {
          cacheStats.cacheMisses++;

          // Simulate investigation
          const result = simulateInvestigation(query);
          cacheStats.totalTokens += result.tokensUsed;

          // Cache the result
          await cacheManager.set(key, result);
        }

        cacheStats.totalQueries++;
      }

      // Round 2: Same queries (should hit cache)
      for (let i = 0; i < 50; i++) {
        const query = BENCHMARK_QUERIES[i % BENCHMARK_QUERIES.length];
        const key = keyGenerator.generateKey(query, 'benchmark-agent', 'analysis');

        const cached = await cacheManager.get(key);

        if (cached) {
          cacheStats.cacheHits++;
          // No tokens used
        } else {
          cacheStats.cacheMisses++;
          const result = simulateInvestigation(query);
          cacheStats.totalTokens += result.tokensUsed;
          await cacheManager.set(key, result);
        }

        cacheStats.totalQueries++;
      }

      // Round 3: Query variations (similarity detection)
      for (const [original, variations] of Object.entries(QUERY_VARIATIONS)) {
        for (const variation of variations) {
          // Check for similar cached query
          const similar = await cacheManager.findSimilar(variation, 0.8);

          if (similar.length > 0) {
            cacheStats.cacheHits++;
            cacheStats.similarityMatches++;
            // Use cached result (no tokens)
          } else {
            cacheStats.cacheMisses++;
            const result = simulateInvestigation(variation);
            cacheStats.totalTokens += result.tokensUsed;

            const key = keyGenerator.generateKey(
              variation,
              'benchmark-agent',
              'analysis'
            );
            await cacheManager.set(key, result);
          }

          cacheStats.totalQueries++;
        }
      }

      cacheStats.totalTimeMs = Date.now() - startTime;
      cacheStats.avgTokensPerQuery =
        cacheStats.totalTokens / cacheStats.totalQueries;

      // Get cache statistics
      const managerStats = cacheManager.getStats();

      // Report cache performance
      console.log('\n=== WITH CACHE ===');
      console.log(`Total Queries: ${cacheStats.totalQueries}`);
      console.log(`Cache Hits: ${cacheStats.cacheHits}`);
      console.log(`Cache Misses: ${cacheStats.cacheMisses}`);
      console.log(`Similarity Matches: ${cacheStats.similarityMatches}`);
      console.log(`Total Tokens: ${cacheStats.totalTokens.toLocaleString()}`);
      console.log(
        `Avg Tokens/Query: ${cacheStats.avgTokensPerQuery.toFixed(0)}`
      );
      console.log(`Total Time: ${cacheStats.totalTimeMs}ms`);
      console.log(`Hit Rate: ${(managerStats.overall.hitRate * 100).toFixed(1)}%`);

      // Calculate token reduction
      const baseline = (global as any).__baselineStats;
      if (baseline) {
        const tokenReduction =
          ((baseline.totalTokens - cacheStats.totalTokens) /
            baseline.totalTokens) *
          100;

        console.log('\n=== COMPARISON ===');
        console.log(`Token Reduction: ${tokenReduction.toFixed(1)}%`);
        console.log(
          `Tokens Saved: ${(baseline.totalTokens - cacheStats.totalTokens).toLocaleString()}`
        );

        // WO-002 Success Criteria: ≥30% token reduction
        expect(tokenReduction).toBeGreaterThanOrEqual(30);
      }

      // WO-002 Success Criteria: ≥75% hit rate
      expect(managerStats.overall.hitRate).toBeGreaterThanOrEqual(0.75);
    }, 60000); // 60s timeout for comprehensive benchmark
  });

  describe('Lookup Performance', () => {
    it('should meet L1 cache lookup performance (<10ms)', async () => {
      // Pre-populate L1 cache
      const testKey = keyGenerator.generateKey(
        'performance test query',
        'perf-agent',
        'analysis'
      );
      await cacheManager.set(testKey, { data: 'performance test data' });

      const iterations = 1000;
      const lookupTimes: number[] = [];

      // Measure 1000 L1 lookups
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await cacheManager.get(testKey);
        const end = performance.now();
        lookupTimes.push(end - start);
      }

      const avgLookupTime =
        lookupTimes.reduce((a, b) => a + b, 0) / lookupTimes.length;
      const p95LookupTime = lookupTimes.sort((a, b) => a - b)[
        Math.floor(iterations * 0.95)
      ];

      console.log('\n=== L1 CACHE LOOKUP PERFORMANCE ===');
      console.log(`Iterations: ${iterations}`);
      console.log(`Avg Lookup: ${avgLookupTime.toFixed(2)}ms`);
      console.log(`P95 Lookup: ${p95LookupTime.toFixed(2)}ms`);

      // WO-002 Target: <10ms L1 lookup
      expect(avgLookupTime).toBeLessThan(10);
      expect(p95LookupTime).toBeLessThan(15); // Allow some variance
    });

    it('should meet L2 cache lookup performance (<50ms)', async () => {
      const testKey = keyGenerator.generateKey(
        'L2 performance test',
        'perf-agent',
        'analysis'
      );
      await cacheManager.set(testKey, { data: 'L2 test data' });

      // Clear L1 to force L2 lookup
      cacheManager.clearL1();

      const iterations = 100;
      const lookupTimes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        cacheManager.clearL1(); // Force L2 lookup each time

        const start = performance.now();
        await cacheManager.get(testKey);
        const end = performance.now();
        lookupTimes.push(end - start);
      }

      const avgLookupTime =
        lookupTimes.reduce((a, b) => a + b, 0) / lookupTimes.length;

      console.log('\n=== L2 CACHE LOOKUP PERFORMANCE ===');
      console.log(`Avg Lookup: ${avgLookupTime.toFixed(2)}ms`);

      // WO-002 Target: <50ms L2 lookup
      expect(avgLookupTime).toBeLessThan(50);
    });

    it('should meet L3 cache lookup performance (<200ms)', async () => {
      const testKey = keyGenerator.generateKey(
        'L3 performance test',
        'perf-agent',
        'research'
      );

      // Large data to benefit from compression
      const largeData = {
        data: 'x'.repeat(50000),
        metadata: { large: true },
      };

      await cacheManager.set(testKey, largeData);

      // Clear L1 and L2 to force L3 lookup
      cacheManager.clearL1();
      await cacheManager.clearL2();

      const iterations = 50;
      const lookupTimes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        cacheManager.clearL1();
        await cacheManager.clearL2();

        const start = performance.now();
        await cacheManager.get(testKey);
        const end = performance.now();
        lookupTimes.push(end - start);
      }

      const avgLookupTime =
        lookupTimes.reduce((a, b) => a + b, 0) / lookupTimes.length;

      console.log('\n=== L3 CACHE LOOKUP PERFORMANCE ===');
      console.log(`Avg Lookup: ${avgLookupTime.toFixed(2)}ms`);

      // WO-002 Target: <200ms L3 lookup (with decompression)
      expect(avgLookupTime).toBeLessThan(200);
    });
  });

  describe('Compression Efficiency', () => {
    it('should achieve ≥3:1 compression ratio in L3', async () => {
      // Create compressible data (repeated patterns)
      const compressibleData = {
        logs: Array.from({ length: 100 }, (_, i) => ({
          timestamp: `2025-01-15T12:00:${i.toString().padStart(2, '0')}Z`,
          level: 'INFO',
          message: 'This is a log message with repeated content',
          metadata: { requestId: 'req-123', userId: 'user-456' },
        })),
      };

      const key = keyGenerator.generateKey(
        'compression test',
        'compress-agent',
        'research'
      );

      await cacheManager.set(key, compressibleData);

      // Get compression ratio from cache manager
      const compressionRatio = cacheManager.getCompressionRatio();

      console.log('\n=== L3 COMPRESSION ===');
      console.log(`Compression Ratio: ${compressionRatio.toFixed(2)}:1`);

      // WO-002 Target: ≥3:1 compression ratio
      expect(compressionRatio).toBeGreaterThanOrEqual(3.0);
    });
  });

  describe('Similarity Detection Effectiveness', () => {
    it('should find similar queries with ≥80% accuracy', async () => {
      // Test cases: original query + similar variations
      const testCases = [
        {
          original: 'How is authentication implemented?',
          similar: [
            'Explain the authentication implementation',
            'Describe authentication approach',
          ],
          dissimilar: [
            'Find database connection code',
            'How is logging configured?',
          ],
        },
        {
          original: 'Find all API endpoints',
          similar: [
            'Locate all API routes',
            'Show me the API endpoint definitions',
          ],
          dissimilar: [
            'How is error handling done?',
            'Find configuration files',
          ],
        },
      ];

      let correctMatches = 0;
      let totalTests = 0;

      for (const testCase of testCases) {
        // Cache original
        const originalKey = keyGenerator.generateKey(
          testCase.original,
          'similarity-agent',
          'analysis'
        );
        await cacheManager.set(originalKey, { result: 'cached result' });

        // Test similar queries (should match)
        for (const similarQuery of testCase.similar) {
          const matches = await cacheManager.findSimilar(similarQuery, 0.8);
          if (matches.length > 0) correctMatches++;
          totalTests++;
        }

        // Test dissimilar queries (should NOT match)
        for (const dissimilarQuery of testCase.dissimilar) {
          const matches = await cacheManager.findSimilar(dissimilarQuery, 0.8);
          if (matches.length === 0) correctMatches++;
          totalTests++;
        }
      }

      const accuracy = (correctMatches / totalTests) * 100;

      console.log('\n=== SIMILARITY DETECTION ===');
      console.log(`Correct Matches: ${correctMatches}/${totalTests}`);
      console.log(`Accuracy: ${accuracy.toFixed(1)}%`);

      // WO-002 Target: ≥80% accuracy
      expect(accuracy).toBeGreaterThanOrEqual(80);
    });
  });

  describe('Stress Testing', () => {
    it('should handle 500 queries without degradation', async () => {
      const queryCount = 500;
      const startTime = Date.now();

      let hitCount = 0;
      let missCount = 0;

      for (let i = 0; i < queryCount; i++) {
        const query = BENCHMARK_QUERIES[i % BENCHMARK_QUERIES.length];
        const key = keyGenerator.generateKey(
          `stress-${query}-${i}`,
          'stress-agent',
          'analysis'
        );

        const cached = await cacheManager.get(key);

        if (cached) {
          hitCount++;
        } else {
          missCount++;
          const result = simulateInvestigation(query);
          await cacheManager.set(key, result);
        }
      }

      const totalTime = Date.now() - startTime;
      const avgTimePerQuery = totalTime / queryCount;

      console.log('\n=== STRESS TEST (500 QUERIES) ===');
      console.log(`Total Queries: ${queryCount}`);
      console.log(`Hits: ${hitCount}`);
      console.log(`Misses: ${missCount}`);
      console.log(`Total Time: ${totalTime}ms`);
      console.log(`Avg Time/Query: ${avgTimePerQuery.toFixed(2)}ms`);

      // Should complete in reasonable time
      expect(avgTimePerQuery).toBeLessThan(50); // <50ms per query

      // Cache should remain healthy
      const health = cacheManager.getCacheHealth();
      expect(health.status).not.toBe('critical');
    }, 60000);
  });

  describe('Cache Health Monitoring', () => {
    it('should maintain healthy status under normal load', async () => {
      // Simulate normal usage pattern
      for (let i = 0; i < 100; i++) {
        const query = BENCHMARK_QUERIES[i % BENCHMARK_QUERIES.length];
        const key = keyGenerator.generateKey(query, 'health-agent', 'analysis');

        const cached = await cacheManager.get(key);
        if (!cached) {
          await cacheManager.set(key, simulateInvestigation(query));
        }
      }

      // Check cache every query (like in production)
      for (let i = 0; i < 50; i++) {
        const query = BENCHMARK_QUERIES[i % BENCHMARK_QUERIES.length];
        const key = keyGenerator.generateKey(query, 'health-agent', 'analysis');
        await cacheManager.get(key);
      }

      const health = cacheManager.getCacheHealth();
      const stats = cacheManager.getStats();

      console.log('\n=== CACHE HEALTH ===');
      console.log(`Status: ${health.status}`);
      console.log(`Hit Rate: ${(stats.overall.hitRate * 100).toFixed(1)}%`);
      console.log(`Issues: ${health.issues.length}`);
      console.log(`Recommendations: ${health.recommendations.length}`);

      expect(health.status).toBe('healthy');
      expect(stats.overall.hitRate).toBeGreaterThan(0.5);
    });
  });
});

/**
 * Simulate investigation response
 * In production, this would be actual LLM query
 */
function simulateInvestigation(query: string): {
  query: string;
  result: string;
  tokensUsed: number;
  timestamp: number;
} {
  // Simulate token usage based on query complexity
  const baseTokens = 800;
  const queryTokens = Math.floor(query.split(' ').length * 1.5);
  const responseTokens = Math.floor(Math.random() * 500) + 200;
  const tokensUsed = baseTokens + queryTokens + responseTokens;

  return {
    query,
    result: `Investigation result for: ${query}`,
    tokensUsed,
    timestamp: Date.now(),
  };
}
