/**
 * L1 Cache - In-Memory LRU Cache
 * Fastest tier with LRU eviction policy
 */

import { LRUCache } from 'lru-cache';
import { CacheEntry, CacheStats } from '../shared/types';

export interface L1CacheConfig {
  maxEntries: number; // Maximum number of entries (default: 1000)
  maxSize: number; // Maximum memory size in bytes (default: 50MB)
  ttl: number; // Default time-to-live in milliseconds (default: 24 hours)
}

export class L1Cache {
  private cache: LRUCache<string, CacheEntry>;
  private config: L1CacheConfig;
  private stats: {
    hits: number;
    misses: number;
    evictions: number;
    sets: number;
  };

  constructor(config?: Partial<L1CacheConfig>) {
    this.config = {
      maxEntries: config?.maxEntries ?? 1000,
      maxSize: config?.maxSize ?? 50 * 1024 * 1024, // 50MB
      ttl: config?.ttl ?? 24 * 60 * 60 * 1000, // 24 hours
    };

    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
    };

    // Initialize LRU cache
    this.cache = new LRUCache<string, CacheEntry>({
      max: this.config.maxEntries,
      maxSize: this.config.maxSize,

      // Calculate size of each entry (value + metadata)
      sizeCalculation: (entry: CacheEntry) => {
        return this.calculateEntrySize(entry);
      },

      // TTL per entry (can be overridden per set)
      ttl: this.config.ttl,

      // Called when entry is evicted
      dispose: (value: CacheEntry, key: string, reason: LRUCache.DisposeReason) => {
        if (reason === 'evict' || reason === 'set') {
          this.stats.evictions++;
        }
      },

      // Allow stale entries to be returned if TTL expired
      allowStale: false,

      // Update access time on get
      updateAgeOnGet: true,

      // Update access time on has()
      updateAgeOnHas: true,
    });
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Cached entry or undefined if not found/expired
   */
  get<T = any>(key: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (entry) {
      // Update access tracking
      entry.lastAccessedAt = Date.now();
      entry.accessCount++;
      this.stats.hits++;

      return entry;
    }

    this.stats.misses++;
    return undefined;
  }

  /**
   * Store value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Optional custom TTL (ms), defaults to config TTL
   */
  set<T = any>(key: string, value: T, ttl?: number): void {
    const now = Date.now();
    const effectiveTtl = ttl ?? this.config.ttl;

    const entry: CacheEntry<T> = {
      key,
      value,
      createdAt: now,
      lastAccessedAt: now,
      accessCount: 0,
      ttl: effectiveTtl,
      expiresAt: now + effectiveTtl,
      metadata: {
        size: this.calculateValueSize(value),
      },
    };

    this.cache.set(key, entry as CacheEntry, { ttl: effectiveTtl });
    this.stats.sets++;
  }

  /**
   * Check if key exists in cache (without updating access time if allowStale=false)
   * @param key - Cache key
   * @returns True if key exists and not expired
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete entry from cache
   * @param key - Cache key
   * @returns True if entry was deleted
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.cache.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
    };
  }

  /**
   * Get all keys in cache
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all entries in cache
   * @returns Array of cache entries
   */
  entries(): CacheEntry[] {
    return Array.from(this.cache.values());
  }

  /**
   * Get cache size (number of entries)
   * @returns Number of entries
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get current memory usage (bytes)
   * @returns Current cache size in bytes
   */
  getMemoryUsage(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += this.calculateEntrySize(entry);
    }
    return totalSize;
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;

    return {
      totalEntries: this.cache.size,
      totalSize: this.getMemoryUsage(),
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      averageLookupTime: 0, // L1 is in-memory, <1ms typically
      evictions: this.stats.evictions,
      expiredEntries: 0, // LRU handles expiration automatically
    };
  }

  /**
   * Reset statistics (useful for testing)
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
    };
  }

  /**
   * Calculate size of cache entry (for LRU size tracking)
   * @param entry - Cache entry
   * @returns Size in bytes
   */
  private calculateEntrySize(entry: CacheEntry): number {
    // Key size
    let size = Buffer.byteLength(entry.key, 'utf8');

    // Value size
    size += this.calculateValueSize(entry.value);

    // Metadata overhead (timestamps, counts, etc.)
    size += 100; // Approximate overhead for timestamps and counters

    return size;
  }

  /**
   * Calculate size of value (approximate)
   * @param value - Value to measure
   * @returns Size in bytes
   */
  private calculateValueSize(value: any): number {
    if (value === null || value === undefined) {
      return 0;
    }

    // String
    if (typeof value === 'string') {
      return Buffer.byteLength(value, 'utf8');
    }

    // Number, boolean, etc.
    if (typeof value === 'number' || typeof value === 'boolean') {
      return 8;
    }

    // Object or array (use JSON serialization as approximation)
    try {
      const json = JSON.stringify(value);
      return Buffer.byteLength(json, 'utf8');
    } catch (error) {
      // If serialization fails, estimate conservatively
      return 1000;
    }
  }

  /**
   * Peek at entry without updating access time
   * @param key - Cache key
   * @returns Cached entry or undefined
   */
  peek<T = any>(key: string): CacheEntry<T> | undefined {
    return this.cache.peek(key) as CacheEntry<T> | undefined;
  }

  /**
   * Get remaining TTL for entry
   * @param key - Cache key
   * @returns Remaining TTL in milliseconds, or 0 if not found/expired
   */
  getRemainingTTL(key: string): number {
    const ttl = this.cache.getRemainingTTL(key);
    return ttl > 0 ? ttl : 0;
  }

  /**
   * Purge expired entries (called automatically, but can be triggered manually)
   */
  purgeExpired(): void {
    this.cache.purgeStale();
  }

  /**
   * Find entries matching predicate
   * @param predicate - Function to test entries
   * @returns Array of matching entries
   */
  find<T = any>(predicate: (entry: CacheEntry<T>) => boolean): CacheEntry<T>[] {
    const results: CacheEntry<T>[] = [];

    for (const entry of this.cache.values()) {
      if (predicate(entry as CacheEntry<T>)) {
        results.push(entry as CacheEntry<T>);
      }
    }

    return results;
  }

  /**
   * Get LRU ordered keys (least recently used first)
   * @returns Array of keys in LRU order
   */
  getLRUKeys(): string[] {
    // LRU cache maintains internal order, dump in reverse gives LRU first
    const keys = Array.from(this.cache.keys());
    return keys.reverse();
  }

  /**
   * Get configuration
   * @returns Current cache configuration
   */
  getConfig(): L1CacheConfig {
    return { ...this.config };
  }

  /**
   * Update configuration (creates new cache instance)
   * @param config - New configuration
   */
  updateConfig(config: Partial<L1CacheConfig>): void {
    // Save current entries
    const entries = this.entries();

    // Update config
    this.config = {
      ...this.config,
      ...config,
    };

    // Recreate cache with new config
    this.cache = new LRUCache<string, CacheEntry>({
      max: this.config.maxEntries,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
      sizeCalculation: (entry: CacheEntry) => this.calculateEntrySize(entry),
      dispose: (value: CacheEntry, key: string, reason: LRUCache.DisposeReason) => {
        if (reason === 'evict' || reason === 'set') {
          this.stats.evictions++;
        }
      },
      allowStale: false,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });

    // Restore entries (will respect new size limits)
    for (const entry of entries) {
      this.cache.set(entry.key, entry);
    }
  }
}
