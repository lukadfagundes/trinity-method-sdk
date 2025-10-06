/**
 * Unit tests for L1Cache
 * Tests in-memory LRU cache with eviction, TTL, and statistics
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { L1Cache } from '../../../src/cache/L1Cache';

describe('L1Cache', () => {
  let cache: L1Cache;

  beforeEach(() => {
    cache = new L1Cache({
      maxEntries: 100,
      maxSize: 1024 * 1024, // 1MB
      ttl: 1000, // 1 second for testing
    });
  });

  describe('Basic Operations', () => {
    it('should store and retrieve values', () => {
      cache.set('test-key', 'test-value');
      const entry = cache.get('test-key');

      expect(entry).toBeDefined();
      expect(entry?.value).toBe('test-value');
      expect(entry?.key).toBe('test-key');
    });

    it('should return undefined for non-existent keys', () => {
      const entry = cache.get('non-existent');
      expect(entry).toBeUndefined();
    });

    it('should update access count on get', () => {
      cache.set('access-test', 'value');

      const entry1 = cache.get('access-test');
      const entry2 = cache.get('access-test');
      const entry3 = cache.get('access-test');

      expect(entry3?.accessCount).toBe(3);
    });

    it('should update lastAccessedAt on get', async () => {
      cache.set('time-test', 'value');

      const entry1 = cache.get('time-test');
      await new Promise(resolve => setTimeout(resolve, 50)); // Increased delay for reliable timing
      const entry2 = cache.get('time-test');

      expect(entry2?.lastAccessedAt).toBeGreaterThanOrEqual(entry1!.lastAccessedAt);
    });

    it('should check key existence with has()', () => {
      cache.set('exists', 'value');

      expect(cache.has('exists')).toBe(true);
      expect(cache.has('not-exists')).toBe(false);
    });

    it('should delete entries', () => {
      cache.set('delete-test', 'value');
      expect(cache.has('delete-test')).toBe(true);

      const deleted = cache.delete('delete-test');
      expect(deleted).toBe(true);
      expect(cache.has('delete-test')).toBe(false);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = cache.delete('non-existent');
      expect(deleted).toBe(false);
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      expect(cache.size()).toBe(3);

      cache.clear();

      expect(cache.size()).toBe(0);
      expect(cache.has('key1')).toBe(false);
    });
  });

  describe('TTL and Expiration', () => {
    it('should expire entries after TTL', async () => {
      cache.set('expire-test', 'value', 50); // 50ms TTL

      expect(cache.has('expire-test')).toBe(true);

      await new Promise(resolve => setTimeout(resolve, 100));

      expect(cache.has('expire-test')).toBe(false);
    });

    it('should use default TTL if not specified', () => {
      cache.set('default-ttl', 'value');
      const entry = cache.get('default-ttl');

      expect(entry?.ttl).toBe(1000); // Config default
    });

    it('should use custom TTL when provided', () => {
      cache.set('custom-ttl', 'value', 5000);
      const entry = cache.get('custom-ttl');

      expect(entry?.ttl).toBe(5000);
    });

    it('should return remaining TTL', () => {
      cache.set('ttl-test', 'value', 10000);
      const remaining = cache.getRemainingTTL('ttl-test');

      expect(remaining).toBeGreaterThan(9000);
      expect(remaining).toBeLessThanOrEqual(10000);
    });

    it('should return 0 for expired entries', async () => {
      cache.set('expired', 'value', 50);
      await new Promise(resolve => setTimeout(resolve, 100));

      const remaining = cache.getRemainingTTL('expired');
      expect(remaining).toBe(0);
    });

    it('should return 0 for non-existent entries', () => {
      const remaining = cache.getRemainingTTL('non-existent');
      expect(remaining).toBe(0);
    });
  });

  describe('LRU Eviction', () => {
    it('should evict least recently used entry when full', () => {
      const smallCache = new L1Cache({ maxEntries: 3, maxSize: 1024 * 1024, ttl: 60000 });

      smallCache.set('key1', 'value1');
      smallCache.set('key2', 'value2');
      smallCache.set('key3', 'value3');

      expect(smallCache.size()).toBe(3);

      // Access key1 and key2 to make key3 least recently used
      smallCache.get('key1');
      smallCache.get('key2');

      // Add new entry, should evict key3
      smallCache.set('key4', 'value4');

      expect(smallCache.size()).toBe(3);
      expect(smallCache.has('key1')).toBe(true);
      expect(smallCache.has('key2')).toBe(true);
      expect(smallCache.has('key3')).toBe(false);
      expect(smallCache.has('key4')).toBe(true);
    });

    it('should track evictions in statistics', () => {
      const smallCache = new L1Cache({ maxEntries: 2, maxSize: 1024 * 1024, ttl: 60000 });

      smallCache.set('key1', 'value1');
      smallCache.set('key2', 'value2');
      smallCache.set('key3', 'value3'); // Evicts key1

      const stats = smallCache.getStats();
      expect(stats.evictions).toBeGreaterThan(0);
    });

    it('should maintain LRU order', () => {
      const smallCache = new L1Cache({ maxEntries: 3, maxSize: 1024 * 1024, ttl: 60000 });

      smallCache.set('a', '1');
      smallCache.set('b', '2');
      smallCache.set('c', '3');

      // Access in specific order
      smallCache.get('a');
      smallCache.get('c');
      smallCache.get('b');

      const lruKeys = smallCache.getLRUKeys();
      expect(lruKeys[0]).toBe('a'); // Least recently used
    });
  });

  describe('Size Management', () => {
    it('should enforce max size limit', () => {
      const sizeCache = new L1Cache({
        maxEntries: 1000,
        maxSize: 1000, // 1000 bytes
        ttl: 60000,
      });

      // Add entries until size limit reached
      const largeValue = 'x'.repeat(200); // ~200 bytes

      sizeCache.set('key1', largeValue);
      sizeCache.set('key2', largeValue);
      sizeCache.set('key3', largeValue);
      sizeCache.set('key4', largeValue);
      sizeCache.set('key5', largeValue);

      // Should evict entries to stay under size limit
      const memUsage = sizeCache.getMemoryUsage();
      expect(memUsage).toBeLessThanOrEqual(1000);
    });

    it('should calculate entry size correctly for strings', () => {
      cache.set('string-test', 'hello world');
      const entry = cache.get('string-test');

      expect(entry?.metadata?.size).toBeGreaterThan(10);
    });

    it('should calculate entry size correctly for objects', () => {
      const obj = { name: 'test', value: 123, nested: { data: 'value' } };
      cache.set('object-test', obj);
      const entry = cache.get('object-test');

      expect(entry?.metadata?.size).toBeGreaterThan(50);
    });

    it('should track total memory usage', () => {
      cache.set('mem1', 'value1');
      cache.set('mem2', 'value2');
      cache.set('mem3', { large: 'object' });

      const memUsage = cache.getMemoryUsage();
      expect(memUsage).toBeGreaterThan(0);
    });

    it('should update size when entries are added/removed', () => {
      cache.set('size1', 'value');
      const size1 = cache.size();

      cache.set('size2', 'value');
      const size2 = cache.size();

      cache.delete('size1');
      const size3 = cache.size();

      expect(size2).toBe(size1 + 1);
      expect(size3).toBe(size2 - 1);
    });
  });

  describe('Statistics', () => {
    it('should track cache hits', () => {
      cache.set('hit-test', 'value');

      cache.get('hit-test');
      cache.get('hit-test');
      cache.get('hit-test');

      const stats = cache.getStats();
      expect(stats.hits).toBe(3);
    });

    it('should track cache misses', () => {
      cache.get('miss1');
      cache.get('miss2');
      cache.get('miss3');

      const stats = cache.getStats();
      expect(stats.misses).toBe(3);
    });

    it('should calculate hit rate correctly', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      cache.get('key1'); // Hit
      cache.get('key2'); // Hit
      cache.get('key3'); // Miss
      cache.get('key4'); // Miss

      const stats = cache.getStats();

      // 2 hits, 2 misses = 50% hit rate
      expect(stats.hitRate).toBeCloseTo(0.5, 2);
    });

    it('should reset statistics', () => {
      cache.set('key', 'value');
      cache.get('key');
      cache.get('non-existent');

      cache.resetStats();

      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
    });

    it('should track total entries', () => {
      cache.set('a', '1');
      cache.set('b', '2');
      cache.set('c', '3');

      const stats = cache.getStats();
      expect(stats.totalEntries).toBe(3);
    });

    it('should report total size', () => {
      cache.set('data1', 'value');
      cache.set('data2', 'larger value');

      const stats = cache.getStats();
      expect(stats.totalSize).toBeGreaterThan(0);
    });
  });

  describe('Advanced Operations', () => {
    it('should peek without updating access time', async () => {
      cache.set('peek-test', 'value');

      const entry1 = cache.peek('peek-test');
      await new Promise(resolve => setTimeout(resolve, 10));
      const entry2 = cache.peek('peek-test');

      expect(entry1?.lastAccessedAt).toBe(entry2?.lastAccessedAt);
    });

    it('should peek without incrementing access count', () => {
      cache.set('peek-count', 'value');

      cache.peek('peek-count');
      cache.peek('peek-count');
      cache.peek('peek-count');

      const entry = cache.peek('peek-count');
      expect(entry?.accessCount).toBe(0);
    });

    it('should get all keys', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      const keys = cache.keys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain('key1');
      expect(keys).toContain('key2');
      expect(keys).toContain('key3');
    });

    it('should get all entries', () => {
      cache.set('e1', 'value1');
      cache.set('e2', 'value2');

      const entries = cache.entries();

      expect(entries).toHaveLength(2);
      expect(entries[0].value).toBeDefined();
      expect(entries[1].value).toBeDefined();
    });

    it('should find entries matching predicate', () => {
      cache.set('find1', { type: 'analysis', value: 10 });
      cache.set('find2', { type: 'pattern', value: 20 });
      cache.set('find3', { type: 'analysis', value: 30 });

      const analysisEntries = cache.find((entry) => entry.value.type === 'analysis');

      expect(analysisEntries).toHaveLength(2);
      expect(analysisEntries[0].value.type).toBe('analysis');
      expect(analysisEntries[1].value.type).toBe('analysis');
    });

    it('should purge expired entries', async () => {
      cache.set('purge1', 'value', 50);
      cache.set('purge2', 'value', 50);
      cache.set('purge3', 'value', 60000); // Won't expire

      await new Promise(resolve => setTimeout(resolve, 100));

      cache.purgeExpired();

      expect(cache.has('purge1')).toBe(false);
      expect(cache.has('purge2')).toBe(false);
      expect(cache.has('purge3')).toBe(true);
    });
  });

  describe('Configuration', () => {
    it('should get current configuration', () => {
      const config = cache.getConfig();

      expect(config.maxEntries).toBe(100);
      expect(config.maxSize).toBe(1024 * 1024);
      expect(config.ttl).toBe(1000);
    });

    it('should update configuration', () => {
      cache.updateConfig({ maxEntries: 200, ttl: 5000 });

      const config = cache.getConfig();
      expect(config.maxEntries).toBe(200);
      expect(config.ttl).toBe(5000);
    });

    it('should preserve entries when updating config', () => {
      cache.set('preserve1', 'value1');
      cache.set('preserve2', 'value2');

      cache.updateConfig({ ttl: 10000 });

      expect(cache.has('preserve1')).toBe(true);
      expect(cache.has('preserve2')).toBe(true);
    });

    it('should respect new size limits after config update', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      // Update to smaller max entries
      cache.updateConfig({ maxEntries: 2 });

      expect(cache.size()).toBeLessThanOrEqual(2);
    });
  });

  describe('Data Types', () => {
    it('should cache strings', () => {
      cache.set('string', 'test string value');
      const entry = cache.get<string>('string');

      expect(entry?.value).toBe('test string value');
    });

    it('should cache numbers', () => {
      cache.set('number', 42);
      const entry = cache.get<number>('number');

      expect(entry?.value).toBe(42);
    });

    it('should cache booleans', () => {
      cache.set('boolean', true);
      const entry = cache.get<boolean>('boolean');

      expect(entry?.value).toBe(true);
    });

    it('should cache objects', () => {
      const obj = { name: 'test', value: 123 };
      cache.set('object', obj);
      const entry = cache.get<typeof obj>('object');

      expect(entry?.value).toEqual(obj);
    });

    it('should cache arrays', () => {
      const arr = [1, 2, 3, 4, 5];
      cache.set('array', arr);
      const entry = cache.get<number[]>('array');

      expect(entry?.value).toEqual(arr);
    });

    it('should cache null', () => {
      cache.set('null', null);
      const entry = cache.get('null');

      expect(entry?.value).toBeNull();
    });

    it('should cache undefined', () => {
      cache.set('undefined', undefined);
      const entry = cache.get('undefined');

      expect(entry?.value).toBeUndefined();
    });

    it('should cache complex nested objects', () => {
      const complex = {
        user: { id: 1, name: 'Test' },
        data: [{ a: 1 }, { b: 2 }],
        meta: { created: new Date(), tags: ['tag1', 'tag2'] },
      };

      cache.set('complex', complex);
      const entry = cache.get<typeof complex>('complex');

      expect(entry?.value).toEqual(complex);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string key', () => {
      cache.set('', 'value');
      const entry = cache.get('');

      expect(entry?.value).toBe('value');
    });

    it('should handle very long keys', () => {
      const longKey = 'k'.repeat(1000);
      cache.set(longKey, 'value');
      const entry = cache.get(longKey);

      expect(entry?.value).toBe('value');
    });

    it('should handle very large values', () => {
      const largeValue = 'x'.repeat(10000);
      cache.set('large', largeValue);
      const entry = cache.get('large');

      expect(entry?.value).toHaveLength(10000);
    });

    it('should handle special characters in keys', () => {
      const specialKey = '!@#$%^&*()_+{}[]|\\:";\'<>?,./';
      cache.set(specialKey, 'value');
      const entry = cache.get(specialKey);

      expect(entry?.value).toBe('value');
    });

    it('should handle unicode keys', () => {
      cache.set('🔑', 'value');
      cache.set('キー', 'value');
      cache.set('مفتاح', 'value');

      expect(cache.has('🔑')).toBe(true);
      expect(cache.has('キー')).toBe(true);
      expect(cache.has('مفتاح')).toBe(true);
    });

    it('should handle 0 TTL', () => {
      cache.set('zero-ttl', 'value', 0);
      // LRU-cache v11+ treats 0 TTL as no expiration (infinite TTL)
      expect(cache.has('zero-ttl')).toBe(true);
    });

    it('should handle negative TTL', () => {
      cache.set('negative-ttl', 'value', -1000);
      // Should expire immediately
      expect(cache.has('negative-ttl')).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should handle 1000 set operations quickly', () => {
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        cache.set(`key-${i}`, `value-${i}`);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in <100ms
    });

    it('should handle 1000 get operations quickly', () => {
      // Pre-populate
      for (let i = 0; i < 100; i++) {
        cache.set(`key-${i}`, `value-${i}`);
      }

      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        cache.get(`key-${i % 100}`);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(50); // Should complete in <50ms
    });

    it('should maintain performance with many entries', () => {
      const largeCache = new L1Cache({
        maxEntries: 10000,
        maxSize: 10 * 1024 * 1024,
        ttl: 60000,
      });

      // Add 10000 entries
      for (let i = 0; i < 10000; i++) {
        largeCache.set(`key-${i}`, `value-${i}`);
      }

      const start = Date.now();

      // Random access 1000 times
      for (let i = 0; i < 1000; i++) {
        const randomKey = `key-${Math.floor(Math.random() * 10000)}`;
        largeCache.get(randomKey);
      }

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should maintain performance
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent gets', async () => {
      cache.set('concurrent', 'value');

      const promises = Array.from({ length: 100 }, () =>
        Promise.resolve(cache.get('concurrent'))
      );

      const results = await Promise.all(promises);

      expect(results.every(r => r?.value === 'value')).toBe(true);
    });

    it('should handle concurrent sets', async () => {
      const promises = Array.from({ length: 100 }, (_, i) =>
        Promise.resolve(cache.set(`concurrent-${i}`, `value-${i}`))
      );

      await Promise.all(promises);

      expect(cache.size()).toBe(100);
    });

    it('should handle mixed concurrent operations', async () => {
      // Pre-populate
      for (let i = 0; i < 50; i++) {
        cache.set(`mixed-${i}`, `value-${i}`);
      }

      const promises = [];

      // 50 gets, 50 sets, 50 deletes
      for (let i = 0; i < 50; i++) {
        promises.push(Promise.resolve(cache.get(`mixed-${i}`)));
        promises.push(Promise.resolve(cache.set(`new-${i}`, `new-value-${i}`)));
        promises.push(Promise.resolve(cache.delete(`mixed-${i}`)));
      }

      await Promise.all(promises);

      // Should complete without errors
      expect(cache.size()).toBeGreaterThan(0);
    });
  });
});
