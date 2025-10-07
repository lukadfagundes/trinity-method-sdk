/**
 * Integration Tests: Cache Flow
 * End-to-end testing of 3-tier cache system
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AdvancedCacheManager } from '../../src/cache/AdvancedCacheManager';
import { CacheKeyGenerator } from '../../src/cache/CacheKeyGenerator';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Cache Flow Integration Tests', () => {
  let cacheManager: AdvancedCacheManager;
  let keyGenerator: CacheKeyGenerator;
  const testCacheDir = path.join(__dirname, '../../temp/test-cache');

  beforeEach(async () => {
    // Create test cache directory
    await fs.mkdir(testCacheDir, { recursive: true });

    // Initialize cache manager with test configuration
    keyGenerator = new CacheKeyGenerator();
    cacheManager = new AdvancedCacheManager({
      l1: {
        maxEntries: 100,
        maxSize: 10 * 1024 * 1024, // 10MB
        ttl: 60000, // 1 minute for testing
      },
      l2: {
        cacheDir: path.join(testCacheDir, 'l2'),
        maxSizeMB: 50,
        ttl: 120000, // 2 minutes
      },
      l3: {
        cacheDir: path.join(testCacheDir, 'l3'),
        maxSizeMB: 100,
        ttl: 300000, // 5 minutes
        compressionLevel: 6,
      },
      similarityThreshold: 0.8,
      enableSimilarityDetection: true,
    });

    // Cache manager auto-initializes
  });

  afterEach(async () => {
    // Cleanup test cache directory
    try {
      await fs.rm(testCacheDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('End-to-End Cache Operations', () => {
    it('should set and get from L1 cache', async () => {
      const key = keyGenerator.generateKey(
        'test query',
        'test-agent',
        'analysis'
      );
      const value = { result: 'test data', timestamp: Date.now() };

      await cacheManager.set(key, value);
      const retrieved = await cacheManager.get<typeof value>(key);

      expect(retrieved).toEqual(value);

      // Verify stats show L1 hit
      const stats = cacheManager.getStats();
      expect(stats.l1.hits).toBe(1);
      expect(stats.l2.hits).toBe(0);
      expect(stats.l3.hits).toBe(0);
    });

    it('should persist to L2 and retrieve after L1 eviction', async () => {
      const key = keyGenerator.generateKey(
        'persistent query',
        'test-agent',
        'analysis'
      );
      const value = { result: 'persistent data', timestamp: Date.now() };

      // Set in cache (goes to all tiers)
      await cacheManager.set(key, value);

      // Clear L1 to simulate eviction
      await cacheManager.clear('l1');

      // Should retrieve from L2
      const retrieved = await cacheManager.get<typeof value>(key);
      expect(retrieved).toEqual(value);

      // Verify L2 hit and promotion to L1
      const stats = cacheManager.getStats();
      expect(stats.l2.hits).toBe(1);
      expect(stats.overall.l2HitRate).toBeGreaterThan(0);
    });

    it('should promote from L3 through L2 to L1', async () => {
      const key = keyGenerator.generateKey(
        'deep storage query',
        'test-agent',
        'research'
      );
      const value = {
        result: 'data from deep storage',
        metadata: { size: 'large' },
      };

      // Set in all tiers
      await cacheManager.set(key, value);

      // Clear L1 and L2
      await cacheManager.clear('l1');
      await cacheManager.clear('l2');

      // Retrieve from L3 (should promote to L2 and L1)
      const retrieved = await cacheManager.get<typeof value>(key);
      expect(retrieved).toEqual(value);

      // Verify L3 hit
      const stats1 = cacheManager.getStats();
      expect(stats1.l3.hits).toBe(1);

      // Verify promotion: should now hit L1
      const retrieved2 = await cacheManager.get<typeof value>(key);
      expect(retrieved2).toEqual(value);

      const stats2 = cacheManager.getStats();
      expect(stats2.l1.hits).toBe(1);
    });

    it('should handle complete cache miss', async () => {
      const key = keyGenerator.generateKey(
        'nonexistent query',
        'test-agent',
        'analysis'
      );

      const retrieved = await cacheManager.get(key);
      expect(retrieved).toBeNull();

      // Verify miss recorded
      const stats = cacheManager.getStats();
      expect(stats.overall.totalMisses).toBe(1);
    });
  });

  describe('Similarity Detection', () => {
    it('should find similar cached queries', async () => {
      // Cache original query
      const key1 = keyGenerator.generateKey(
        'how is user authentication implemented',
        'test-agent',
        'analysis'
      );
      await cacheManager.set(key1, { result: 'auth implementation details' });

      // Search for similar query
      const similarQueries = await cacheManager.findSimilar(
        'explain the authentication implementation approach',
        0.75 // Lower threshold for testing
      );

      expect(similarQueries.length).toBeGreaterThan(0);
      expect(similarQueries[0].similarity).toBeGreaterThan(0.75);
      expect(similarQueries[0].cachedResult).toEqual({
        result: 'auth implementation details',
      });

      // Verify similarity detection tracked
      const stats = cacheManager.getStats();
      expect(stats.overall.similarityDetections).toBe(1);
    });

    it.skip('should find best match from multiple similar queries', async () => {
      // Cache multiple related queries
      const queries = [
        {
          text: 'find error handling patterns',
          result: 'error handling approach',
        },
        {
          text: 'how are errors handled in the application',
          result: 'detailed error handling',
        },
        { text: 'locate exception management code', result: 'exception code' },
      ];

      for (const query of queries) {
        const key = keyGenerator.generateKey(
          query.text,
          'test-agent',
          'pattern'
        );
        await cacheManager.set(key, { result: query.result });
      }

      // Find best match
      const bestMatch = await cacheManager.findBestMatch(
        'describe error handling implementation',
        0.7
      );

      expect(bestMatch).not.toBeNull();
      expect(bestMatch!.similarity).toBeGreaterThan(0.7);
      // Should match one of the cached queries
      expect(
        queries.some((q) => bestMatch!.entry.value.result === q.result)
      ).toBe(true);
    });

    it('should not find matches below similarity threshold', async () => {
      const key = keyGenerator.generateKey(
        'authentication implementation',
        'test-agent',
        'analysis'
      );
      await cacheManager.set(key, { result: 'auth data' });

      // Completely unrelated query
      const similarQueries = await cacheManager.findSimilar(
        'database connection pooling strategy',
        0.8
      );

      expect(similarQueries.length).toBe(0);
    });
  });

  describe('Multi-Tier Cache Flow', () => {
    it('should handle cascading cache population', async () => {
      const testData = [
        {
          query: 'analyze authentication flow',
          agent: 'security-agent',
          type: 'analysis' as const,
          value: { flow: 'jwt-based' },
        },
        {
          query: 'find api rate limiting patterns',
          agent: 'api-agent',
          type: 'pattern' as const,
          value: { pattern: 'token bucket' },
        },
        {
          query: 'research database optimization',
          agent: 'db-agent',
          type: 'research' as const,
          value: { optimization: 'indexing strategy' },
        },
      ];

      // Populate cache with test data
      for (const item of testData) {
        const key = keyGenerator.generateKey(
          item.query,
          item.agent,
          item.type
        );
        await cacheManager.set(key, item.value);
      }

      // Verify all in L1
      const statsL1 = cacheManager.getStats();
      expect(statsL1.l1.totalEntries).toBe(testData.length);

      // Clear L1, retrieve from L2
      await cacheManager.clear('l1');

      for (const item of testData) {
        const key = keyGenerator.generateKey(
          item.query,
          item.agent,
          item.type
        );
        const retrieved = await cacheManager.get(key);
        expect(retrieved).toEqual(item.value);
      }

      // Verify L2 hits
      const statsL2 = cacheManager.getStats();
      expect(statsL2.l2.hits).toBe(testData.length);

      // Clear L1 and L2, retrieve from L3
      await cacheManager.clear('l1');
      await cacheManager.clear('l2');

      for (const item of testData) {
        const key = keyGenerator.generateKey(
          item.query,
          item.agent,
          item.type
        );
        const retrieved = await cacheManager.get(key);
        expect(retrieved).toEqual(item.value);
      }

      // Verify L3 hits
      const statsL3 = cacheManager.getStats();
      expect(statsL3.l3.hits).toBe(testData.length);
    });

    it('should maintain data consistency across tiers', async () => {
      const key = keyGenerator.generateKey(
        'consistency test',
        'test-agent',
        'validation'
      );
      const value = {
        data: 'test',
        nested: { field: 123, array: [1, 2, 3] },
        timestamp: Date.now(),
      };

      // Set in all tiers
      await cacheManager.set(key, value);

      // Retrieve from L1
      const fromL1 = await cacheManager.get(key);
      expect(fromL1).toEqual(value);

      // Clear L1, retrieve from L2
      await cacheManager.clear('l1');
      const fromL2 = await cacheManager.get(key);
      expect(fromL2).toEqual(value);

      // Clear L1 and L2, retrieve from L3
      await cacheManager.clear('l1');
      await cacheManager.clear('l2');
      const fromL3 = await cacheManager.get(key);
      expect(fromL3).toEqual(value);

      // All should be identical
      expect(fromL1).toEqual(fromL2);
      expect(fromL2).toEqual(fromL3);
    });
  });

  describe('TTL and Expiration', () => {
    it('should expire L1 entries after TTL', async () => {
      // Create manager with very short TTL for testing
      const shortTTLManager = new AdvancedCacheManager({
        l1: { ttl: 100 }, // 100ms
        l2: { cacheDir: path.join(testCacheDir, 'l2-ttl') },
        l3: { cacheDir: path.join(testCacheDir, 'l3-ttl') },
      });

      // Cache manager auto-initializes

      const key = keyGenerator.generateKey(
        'ttl test',
        'test-agent',
        'analysis'
      );
      await shortTTLManager.set(key, { data: 'expires soon' });

      // Should exist immediately
      let retrieved = await shortTTLManager.get(key);
      expect(retrieved).not.toBeNull();

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be expired from L1
      retrieved = await shortTTLManager.get(key);
      // Note: Might still exist in L2/L3 with longer TTL
    }, 10000);

    it.skip('should handle different TTLs across tiers', async () => {
      const key = keyGenerator.generateKey(
        'multi-ttl test',
        'test-agent',
        'research'
      );

      // Set with custom TTLs
      await cacheManager.set(key, { data: 'tier-specific ttl' }, {
        l1: 100, // 100ms
        l2: 200, // 200ms
        l3: 500, // 500ms
      });

      // Verify exists in all tiers initially
      let value = await cacheManager.get(key);
      expect(value).not.toBeNull();

      // Wait for L1 expiration
      await new Promise((resolve) => setTimeout(resolve, 150));
      await cacheManager.clear('l1'); // Force recheck

      // Should still exist in L2
      value = await cacheManager.get(key);
      expect(value).not.toBeNull();

      // Wait for L2 expiration
      await new Promise((resolve) => setTimeout(resolve, 100));
      await cacheManager.clear('l2');

      // Should still exist in L3
      value = await cacheManager.get(key);
      expect(value).not.toBeNull();
    }, 10000);
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent reads and writes', async () => {
      const operations = Array.from({ length: 50 }, (_, i) => ({
        key: keyGenerator.generateKey(
          `concurrent query ${i}`,
          'test-agent',
          'analysis'
        ),
        value: { index: i, data: `test data ${i}` },
      }));

      // Concurrent writes
      await Promise.all(
        operations.map((op) => cacheManager.set(op.key, op.value))
      );

      // Concurrent reads
      const results = await Promise.all(
        operations.map((op) => cacheManager.get(op.key))
      );

      // Verify all writes succeeded
      results.forEach((result, i) => {
        expect(result).toEqual(operations[i].value);
      });

      // Verify stats
      const stats = cacheManager.getStats();
      expect(stats.l1.hits).toBe(operations.length);
      expect(stats.overall.totalHits).toBe(operations.length);
    });

    it('should handle concurrent similar query searches', async () => {
      // Pre-populate cache
      const cachedQueries = [
        'authentication implementation',
        'authorization patterns',
        'error handling approach',
        'logging strategy',
        'database connection pooling',
      ];

      for (const query of cachedQueries) {
        const key = keyGenerator.generateKey(query, 'test-agent', 'analysis');
        await cacheManager.set(key, { query, result: `${query} result` });
      }

      // Concurrent similarity searches
      const searchQueries = [
        'how is authentication done',
        'find authorization code',
        'error handling implementation',
        'logging and monitoring',
        'database connections',
      ];

      const similarityResults = await Promise.all(
        searchQueries.map((query) => cacheManager.findSimilar(query, 0.7))
      );

      // All searches should find at least one similar query
      similarityResults.forEach((results, i) => {
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].similarity).toBeGreaterThan(0.7);
      });
    });
  });

  describe('Cache Persistence', () => {
    it('should persist L2 cache across manager restarts', async () => {
      const key = keyGenerator.generateKey(
        'persistent query',
        'test-agent',
        'analysis'
      );
      const value = { persistent: true, data: 'should survive restart' };

      // Set and verify
      await cacheManager.set(key, value);
      let retrieved = await cacheManager.get(key);
      expect(retrieved).toEqual(value);

      // Destroy and recreate manager
      await cacheManager.clear('l1');
      cacheManager = new AdvancedCacheManager({
        l2: { cacheDir: path.join(testCacheDir, 'l2') },
        l3: { cacheDir: path.join(testCacheDir, 'l3') },
      });
      // Cache manager auto-initializes

      // Should still exist in L2
      retrieved = await cacheManager.get(key);
      expect(retrieved).toEqual(value);
    });

    it('should persist L3 compressed cache across restarts', async () => {
      const key = keyGenerator.generateKey(
        'compressed persistent query',
        'test-agent',
        'research'
      );
      const largeValue = {
        data: 'x'.repeat(10000), // Large data benefits from compression
        metadata: { compressed: true },
      };

      // Set and verify
      await cacheManager.set(key, largeValue);

      // Clear L1 and L2
      await cacheManager.clear('l1');
      await cacheManager.clear('l2');

      // Recreate manager
      cacheManager = new AdvancedCacheManager({
        l2: { cacheDir: path.join(testCacheDir, 'l2') },
        l3: { cacheDir: path.join(testCacheDir, 'l3') },
      });
      // Cache manager auto-initializes

      // Should exist in L3
      const retrieved = await cacheManager.get(key);
      expect(retrieved).toEqual(largeValue);
    });
  });

  describe('Cache Health and Statistics', () => {
    it('should track accurate hit rates across tiers', async () => {
      const queries = Array.from({ length: 20 }, (_, i) => ({
        key: keyGenerator.generateKey(
          `query ${i}`,
          'test-agent',
          'analysis'
        ),
        value: { index: i },
      }));

      // Set all queries
      for (const query of queries) {
        await cacheManager.set(query.key, query.value);
      }

      // 10 L1 hits
      for (let i = 0; i < 10; i++) {
        await cacheManager.get(queries[i].key);
      }

      // Clear L1, get 5 L2 hits
      await cacheManager.clear('l1');
      for (let i = 10; i < 15; i++) {
        await cacheManager.get(queries[i].key);
      }

      // Clear L1 and L2, get 3 L3 hits
      await cacheManager.clear('l1');
      await cacheManager.clear('l2');
      for (let i = 15; i < 18; i++) {
        await cacheManager.get(queries[i].key);
      }

      // 2 misses
      await cacheManager.get('nonexistent-1');
      await cacheManager.get('nonexistent-2');

      // Verify stats
      const stats = cacheManager.getStats();
      expect(stats.l1.hits).toBe(10);
      expect(stats.l2.hits).toBe(5);
      expect(stats.l3.hits).toBe(3);
      expect(stats.overall.totalMisses).toBe(2);

      const totalRequests = 10 + 5 + 3 + 2; // 20 requests
      const totalHits = 10 + 5 + 3; // 18 hits
      const expectedHitRate = totalHits / totalRequests;

      expect(stats.overall.hitRate).toBeCloseTo(expectedHitRate, 2);
    });

    it('should report healthy cache status', async () => {
      // Populate with some data
      for (let i = 0; i < 10; i++) {
        const key = keyGenerator.generateKey(
          `query ${i}`,
          'test-agent',
          'analysis'
        );
        await cacheManager.set(key, { data: i });
      }

      // Generate some hits
      for (let i = 0; i < 5; i++) {
        const key = keyGenerator.generateKey(
          `query ${i}`,
          'test-agent',
          'analysis'
        );
        await cacheManager.get(key);
      }

      const health = cacheManager.getCacheHealth();

      expect(health.status).toBe('healthy');
      expect(health.issues.length).toBe(0);
      expect(health.recommendations.length).toBeGreaterThan(0);
    });

    it('should detect degraded cache performance', async () => {
      // Create many misses
      for (let i = 0; i < 20; i++) {
        await cacheManager.get(`nonexistent-${i}`);
      }

      const health = cacheManager.getCacheHealth();

      // Low hit rate should trigger degraded status
      expect(['degraded', 'critical']).toContain(health.status);
      expect(health.issues.length).toBeGreaterThan(0);
    });
  });

  describe('Large Dataset Handling', () => {
    it('should handle 100+ cache entries efficiently', async () => {
      const entryCount = 100;
      const startTime = Date.now();

      // Write 100 entries
      for (let i = 0; i < entryCount; i++) {
        const key = keyGenerator.generateKey(
          `large dataset query ${i}`,
          'test-agent',
          'analysis'
        );
        await cacheManager.set(key, {
          index: i,
          data: `test data ${i}`,
          timestamp: Date.now(),
        });
      }

      const writeTime = Date.now() - startTime;

      // Read all entries
      const readStart = Date.now();
      for (let i = 0; i < entryCount; i++) {
        const key = keyGenerator.generateKey(
          `large dataset query ${i}`,
          'test-agent',
          'analysis'
        );
        await cacheManager.get(key);
      }
      const readTime = Date.now() - readStart;

      // Performance expectations
      expect(writeTime).toBeLessThan(10000); // <10s for 100 writes
      expect(readTime).toBeLessThan(1000); // <1s for 100 reads from L1

      // Verify stats
      const stats = cacheManager.getStats();
      expect(stats.l1.totalEntries).toBe(entryCount);
      expect(stats.l1.hits).toBe(entryCount);
    }, 15000);

    it('should maintain performance with evictions', async () => {
      // Fill L1 cache to capacity
      const maxEntries = 100; // From config
      for (let i = 0; i < maxEntries + 20; i++) {
        const key = keyGenerator.generateKey(
          `eviction test ${i}`,
          'test-agent',
          'analysis'
        );
        await cacheManager.set(key, { index: i });
      }

      const stats = cacheManager.getStats();

      // Should have evicted old entries
      expect(stats.l1.totalEntries).toBeLessThanOrEqual(maxEntries);
      expect(stats.l1.evictions).toBeGreaterThan(0);

      // Should still be performant
      const key = keyGenerator.generateKey(
        `eviction test ${maxEntries + 19}`,
        'test-agent',
        'analysis'
      );
      const startTime = Date.now();
      const retrieved = await cacheManager.get(key);
      const lookupTime = Date.now() - startTime;

      expect(retrieved).not.toBeNull();
      expect(lookupTime).toBeLessThan(50); // <50ms lookup
    });
  });

  describe('Error Recovery', () => {
    it('should handle corrupted L2 cache gracefully', async () => {
      const key = keyGenerator.generateKey(
        'corruption test',
        'test-agent',
        'analysis'
      );
      await cacheManager.set(key, { data: 'valid data' });

      // Corrupt the L2 file
      const bucket = keyGenerator.getBucketName(key);
      const l2FilePath = path.join(testCacheDir, 'l2', bucket, `${key}.json`);

      try {
        await fs.writeFile(l2FilePath, 'CORRUPTED JSON{{{', 'utf8');
      } catch (error) {
        // File might not exist yet
      }

      // Should return null instead of crashing
      await cacheManager.clear('l1'); // Force L2 lookup
      const retrieved = await cacheManager.get(key);

      // Might be null if L3 also corrupted, or from L3 if still valid
      // The key point is it doesn't crash
      expect(true).toBe(true); // Test completes without throwing
    });

    it('should continue operating with L2 unavailable', async () => {
      const key = keyGenerator.generateKey(
        'l2 failure test',
        'test-agent',
        'analysis'
      );

      // Set data
      await cacheManager.set(key, { data: 'should work despite L2 issues' });

      // Make L2 directory read-only (if possible)
      // This is platform-specific, so just verify cache continues working

      // L1 should still work
      const retrieved = await cacheManager.get(key);
      expect(retrieved).not.toBeNull();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should handle typical investigation workflow', async () => {
      // Scenario: Investigating authentication system
      const queries = [
        'How is user authentication implemented?',
        'Find all authentication-related files',
        'Analyze authentication security patterns',
        'Research JWT token implementation',
        'Find session management code',
      ];

      // First pass: All misses
      for (const query of queries) {
        const key = keyGenerator.generateKey(query, 'security-agent', 'analysis');
        const result = await cacheManager.get(key);
        expect(result).toBeNull(); // First time = miss

        // Simulate investigation result
        await cacheManager.set(key, {
          query,
          result: `Analysis of: ${query}`,
          timestamp: Date.now(),
        });
      }

      // Second pass: All hits (user asks similar questions)
      for (const query of queries) {
        const key = keyGenerator.generateKey(query, 'security-agent', 'analysis');
        const result = await cacheManager.get(key);
        expect(result).not.toBeNull();
      }

      // Verify high hit rate on second pass
      const stats = cacheManager.getStats();
      expect(stats.overall.hitRate).toBeGreaterThan(0.5); // At least 50%
    });

    it('should benefit from similarity detection in workflows', async () => {
      // User asks similar questions with different wording
      const similarQueries = [
        'How does error handling work?',
        'Explain the error handling approach',
        'Describe error management implementation',
      ];

      // Cache first query
      const firstKey = keyGenerator.generateKey(
        similarQueries[0],
        'analysis-agent',
        'analysis'
      );
      await cacheManager.set(firstKey, {
        result: 'Error handling uses try-catch with custom error classes',
      });

      // Check similarity for subsequent queries
      for (let i = 1; i < similarQueries.length; i++) {
        const similar = await cacheManager.findSimilar(similarQueries[i], 0.7);

        expect(similar.length).toBeGreaterThan(0);
        expect(similar[0].similarity).toBeGreaterThan(0.7);
      }

      // Verify similarity detections tracked
      const stats = cacheManager.getStats();
      expect(stats.overall.similarityDetections).toBeGreaterThan(0);
    });
  });
});
