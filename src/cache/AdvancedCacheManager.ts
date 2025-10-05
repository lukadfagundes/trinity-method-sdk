/**
 * Advanced Cache Manager
 * Orchestrates 3-tier caching system (L1, L2, L3) with similarity detection
 */

import { L1Cache, L1CacheConfig } from './L1Cache';
import { L2Cache, L2CacheConfig } from './L2Cache';
import { L3Cache, L3CacheConfig } from './L3Cache';
import { SimilarityDetector, SimilarQuery } from './SimilarityDetector';
import { CacheKeyGenerator } from './CacheKeyGenerator';
import { CacheEntry, CacheStats } from '../shared/types';

export interface AdvancedCacheConfig {
  l1: Partial<L1CacheConfig>;
  l2: Partial<L2CacheConfig>;
  l3: Partial<L3CacheConfig>;
  similarityThreshold: number; // Default: 0.8
  enableSimilarityDetection: boolean; // Default: true
}

export interface TieredCacheStats {
  l1: CacheStats;
  l2: CacheStats;
  l3: CacheStats;
  overall: {
    totalHits: number;
    totalMisses: number;
    hitRate: number;
    similarityDetections: number;
    tokensSaved: number;
    l1HitRate: number;
    l2HitRate: number;
    l3HitRate: number;
  };
}

export class AdvancedCacheManager {
  private l1Cache: L1Cache;
  private l2Cache: L2Cache;
  private l3Cache: L3Cache;
  private similarityDetector: SimilarityDetector;
  private keyGenerator: CacheKeyGenerator;
  private config: Required<AdvancedCacheConfig>;
  private stats: {
    similarityDetections: number;
    tokensSaved: number;
  };

  constructor(config?: Partial<AdvancedCacheConfig>) {
    this.config = {
      l1: config?.l1 ?? {},
      l2: config?.l2 ?? {},
      l3: config?.l3 ?? {},
      similarityThreshold: config?.similarityThreshold ?? 0.8,
      enableSimilarityDetection: config?.enableSimilarityDetection ?? true,
    };

    // Initialize cache tiers
    this.l1Cache = new L1Cache(this.config.l1);
    this.l2Cache = new L2Cache(this.config.l2);
    this.l3Cache = new L3Cache(this.config.l3);

    // Initialize utilities
    this.similarityDetector = new SimilarityDetector();
    this.keyGenerator = new CacheKeyGenerator();

    // Initialize stats
    this.stats = {
      similarityDetections: 0,
      tokensSaved: 0,
    };
  }

  /**
   * Get cached value by key, checking all tiers (L1 → L2 → L3)
   * @param key - Cache key
   * @returns Cached value or null if not found
   */
  async get<T = any>(key: string): Promise<T | null> {
    // Try L1 (fastest)
    const l1Entry = this.l1Cache.get<T>(key);
    if (l1Entry) {
      return l1Entry.value;
    }

    // Try L2
    const l2Entry = await this.l2Cache.get<T>(key);
    if (l2Entry) {
      // Promote to L1 for faster future access
      await this.promoteToL1(key, l2Entry.value, l2Entry.ttl);
      return l2Entry.value;
    }

    // Try L3
    const l3Entry = await this.l3Cache.get<T>(key);
    if (l3Entry) {
      // Promote to L2 and L1
      await this.promoteToL2(key, l3Entry.value, l3Entry.ttl);
      await this.promoteToL1(key, l3Entry.value, l3Entry.ttl);
      return l3Entry.value;
    }

    return null;
  }

  /**
   * Get cached value with cache entry metadata
   * @param key - Cache key
   * @returns Cache entry or null if not found
   */
  async getEntry<T = any>(key: string): Promise<CacheEntry<T> | null> {
    // Try L1
    const l1Entry = this.l1Cache.get<T>(key);
    if (l1Entry) {
      return l1Entry;
    }

    // Try L2
    const l2Entry = await this.l2Cache.get<T>(key);
    if (l2Entry) {
      await this.promoteToL1(key, l2Entry.value, l2Entry.ttl);
      return l2Entry;
    }

    // Try L3
    const l3Entry = await this.l3Cache.get<T>(key);
    if (l3Entry) {
      await this.promoteToL2(key, l3Entry.value, l3Entry.ttl);
      await this.promoteToL1(key, l3Entry.value, l3Entry.ttl);
      return l3Entry;
    }

    return null;
  }

  /**
   * Store value in all cache tiers
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (optional)
   */
  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    // Store in all tiers
    this.l1Cache.set(key, value, ttl);
    await this.l2Cache.set(key, value, ttl);
    await this.l3Cache.set(key, value, ttl);
  }

  /**
   * Find cached entries similar to query using Jaccard similarity
   * @param query - Query string to match
   * @param threshold - Similarity threshold 0-1 (default: config threshold)
   * @returns Array of similar cached queries
   */
  async findSimilar<T = any>(
    query: string,
    threshold?: number
  ): Promise<SimilarQuery<T>[]> {
    if (!this.config.enableSimilarityDetection) {
      return [];
    }

    const effectiveThreshold = threshold ?? this.config.similarityThreshold;

    // Get all cached entries from L1 (fastest for similarity scanning)
    const l1Entries = this.l1Cache.entries();

    // Find similar queries
    const similar = this.similarityDetector.findSimilarQueries(
      query,
      l1Entries,
      effectiveThreshold
    );

    // Track similarity detections
    if (similar.length > 0) {
      this.stats.similarityDetections++;
    }

    return similar as SimilarQuery<T>[];
  }

  /**
   * Get best match for query from cache
   * @param query - Query string
   * @param threshold - Similarity threshold (optional)
   * @returns Best matching cache entry or null
   */
  async getBestMatch<T = any>(
    query: string,
    threshold?: number
  ): Promise<T | null> {
    const similar = await this.findSimilar<T>(query, threshold);

    if (similar.length > 0) {
      return similar[0].cachedResult;
    }

    return null;
  }

  /**
   * Check if key exists in any cache tier
   * @param key - Cache key
   * @returns True if key exists in any tier
   */
  async has(key: string): Promise<boolean> {
    if (this.l1Cache.has(key)) return true;
    if (await this.l2Cache.has(key)) return true;
    if (await this.l3Cache.has(key)) return true;
    return false;
  }

  /**
   * Delete entry from all cache tiers
   * @param key - Cache key
   * @returns True if entry was found and deleted
   */
  async delete(key: string): Promise<boolean> {
    const l1Deleted = this.l1Cache.delete(key);
    const l2Deleted = await this.l2Cache.delete(key);
    const l3Deleted = await this.l3Cache.delete(key);

    return l1Deleted || l2Deleted || l3Deleted;
  }

  /**
   * Clear cache tier(s)
   * @param tier - Which tier to clear (default: 'all')
   */
  async clear(tier: 'l1' | 'l2' | 'l3' | 'all' = 'all'): Promise<void> {
    if (tier === 'all' || tier === 'l1') {
      this.l1Cache.clear();
    }

    if (tier === 'all' || tier === 'l2') {
      await this.l2Cache.clear();
    }

    if (tier === 'all' || tier === 'l3') {
      await this.l3Cache.clear();
    }

    if (tier === 'all') {
      this.stats.similarityDetections = 0;
      this.stats.tokensSaved = 0;
    }
  }

  /**
   * Get comprehensive cache statistics
   * @returns Statistics for all tiers plus overall metrics
   */
  getStats(): TieredCacheStats {
    const l1Stats = this.l1Cache.getStats();
    const l2Stats = this.l2Cache.getStats();
    const l3Stats = this.l3Cache.getStats();

    const totalHits = l1Stats.hits + l2Stats.hits + l3Stats.hits;
    const totalMisses = l1Stats.misses + l2Stats.misses + l3Stats.misses;
    const totalRequests = totalHits + totalMisses;

    const overallHitRate = totalRequests > 0 ? totalHits / totalRequests : 0;

    // Calculate tier-specific hit rates
    const l1HitRate = l1Stats.hits / totalRequests;
    const l2HitRate = l2Stats.hits / totalRequests;
    const l3HitRate = l3Stats.hits / totalRequests;

    return {
      l1: l1Stats,
      l2: l2Stats,
      l3: l3Stats,
      overall: {
        totalHits,
        totalMisses,
        hitRate: overallHitRate,
        similarityDetections: this.stats.similarityDetections,
        tokensSaved: this.stats.tokensSaved,
        l1HitRate,
        l2HitRate,
        l3HitRate,
      },
    };
  }

  /**
   * Pre-warm cache with common queries
   * @param queries - Array of common query strings with their results
   */
  async warmCache<T = any>(queries: Array<{ query: string; result: T; ttl?: number }>): Promise<void> {
    for (const { query, result, ttl } of queries) {
      const key = this.keyGenerator.generateKey(query, 'AJ', 'analysis');
      await this.set(key, result, ttl);
    }
  }

  /**
   * Promote frequently accessed entry from L2/L3 to L1
   * @param key - Cache key
   * @param value - Cached value
   * @param ttl - TTL for promoted entry
   */
  private async promoteToL1<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    this.l1Cache.set(key, value, ttl);
  }

  /**
   * Promote frequently accessed entry from L3 to L2
   * @param key - Cache key
   * @param value - Cached value
   * @param ttl - TTL for promoted entry
   */
  private async promoteToL2<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    await this.l2Cache.set(key, value, ttl);
  }

  /**
   * Purge expired entries from all tiers
   * @returns Total number of entries purged
   */
  async purgeExpired(): Promise<number> {
    this.l1Cache.purgeExpired();
    const l2Purged = await this.l2Cache.purgeExpired();
    const l3Purged = await this.l3Cache.purgeExpired();

    return l2Purged + l3Purged;
  }

  /**
   * Get all keys across all tiers
   * @returns Array of all cache keys
   */
  async getAllKeys(): Promise<string[]> {
    const l1Keys = this.l1Cache.keys();
    const l2Keys = await this.l2Cache.keys();
    const l3Keys = await this.l3Cache.keys();

    // Deduplicate keys
    const allKeys = new Set([...l1Keys, ...l2Keys, ...l3Keys]);
    return Array.from(allKeys);
  }

  /**
   * Get cache entry from specific tier
   * @param key - Cache key
   * @param tier - Tier to query
   * @returns Cache entry or null
   */
  async getFromTier<T = any>(
    key: string,
    tier: 'l1' | 'l2' | 'l3'
  ): Promise<CacheEntry<T> | null> {
    switch (tier) {
      case 'l1':
        return this.l1Cache.get<T>(key) || null;
      case 'l2':
        return (await this.l2Cache.get<T>(key)) || null;
      case 'l3':
        return (await this.l3Cache.get<T>(key)) || null;
    }
  }

  /**
   * Generate cache key for query
   * @param query - Query string
   * @param agentId - Agent ID
   * @param queryType - Type of query
   * @returns Generated cache key
   */
  generateKey(
    query: string,
    agentId: string,
    queryType: 'analysis' | 'pattern' | 'research' | 'validation' = 'analysis'
  ): string {
    return this.keyGenerator.generateKey(query, agentId, queryType);
  }

  /**
   * Track token savings from cache hit
   * @param tokensSaved - Number of tokens saved
   */
  trackTokensSaved(tokensSaved: number): void {
    this.stats.tokensSaved += tokensSaved;
  }

  /**
   * Reset all statistics
   */
  resetStats(): void {
    this.l1Cache.resetStats();
    this.l2Cache.resetStats();
    this.l3Cache.resetStats();
    this.stats.similarityDetections = 0;
    this.stats.tokensSaved = 0;
  }

  /**
   * Get L3 compression ratio
   * @returns Compression ratio (e.g., 5.2 means 5.2:1)
   */
  getCompressionRatio(): number {
    return this.l3Cache.getCompressionRatio();
  }

  /**
   * Get total cache size across all tiers
   * @returns Total size in bytes
   */
  getTotalSize(): number {
    const l1Size = this.l1Cache.getMemoryUsage();
    const l2SizeMB = this.l2Cache.getCacheSizeMB();
    const l3SizeMB = this.l3Cache.getCacheSizeMB();

    return l1Size + (l2SizeMB * 1024 * 1024) + (l3SizeMB * 1024 * 1024);
  }

  /**
   * Get total cache size in MB
   * @returns Total size in MB
   */
  getTotalSizeMB(): number {
    return this.getTotalSize() / (1024 * 1024);
  }

  /**
   * Get cache utilization percentage
   * @returns Utilization percentage (0-100)
   */
  getUtilization(): number {
    const l1Config = this.l1Cache.getConfig();
    const l2Config = this.l2Cache.getConfig();
    const l3Config = this.l3Cache.getConfig();

    const maxSize =
      l1Config.maxSize +
      (l2Config.maxSizeMB * 1024 * 1024) +
      (l3Config.maxSizeMB * 1024 * 1024);

    const currentSize = this.getTotalSize();

    return (currentSize / maxSize) * 100;
  }

  /**
   * Export cache configuration
   * @returns Current cache configuration
   */
  getConfig(): Required<AdvancedCacheConfig> {
    return {
      ...this.config,
      l1: this.l1Cache.getConfig(),
      l2: this.l2Cache.getConfig(),
      l3: this.l3Cache.getConfig(),
    };
  }

  /**
   * Check if similarity detection is enabled
   * @returns True if enabled
   */
  isSimilarityDetectionEnabled(): boolean {
    return this.config.enableSimilarityDetection;
  }

  /**
   * Enable or disable similarity detection
   * @param enabled - Enable flag
   */
  setSimilarityDetection(enabled: boolean): void {
    this.config.enableSimilarityDetection = enabled;
  }

  /**
   * Get similarity threshold
   * @returns Current threshold (0-1)
   */
  getSimilarityThreshold(): number {
    return this.config.similarityThreshold;
  }

  /**
   * Set similarity threshold
   * @param threshold - New threshold (0-1)
   */
  setSimilarityThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Similarity threshold must be between 0 and 1');
    }
    this.config.similarityThreshold = threshold;
  }

  /**
   * Find entries by predicate across all tiers
   * @param predicate - Function to test entries
   * @returns Array of matching entries
   */
  async findEntries<T = any>(
    predicate: (entry: CacheEntry<T>) => boolean
  ): Promise<CacheEntry<T>[]> {
    const l1Results = this.l1Cache.find<T>(predicate);
    const l2Results = await this.l2Cache.find<T>(predicate);
    const l3Results = await this.l3Cache.find<T>(predicate);

    // Deduplicate by key
    const resultsMap = new Map<string, CacheEntry<T>>();

    for (const entry of [...l1Results, ...l2Results, ...l3Results]) {
      resultsMap.set(entry.key, entry);
    }

    return Array.from(resultsMap.values());
  }

  /**
   * Get cache health metrics
   * @returns Health status and recommendations
   */
  getCacheHealth(): {
    status: 'healthy' | 'degraded' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const stats = this.getStats();
    const utilization = this.getUtilization();
    const issues: string[] = [];
    const recommendations: string[] = [];

    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    // Check hit rate
    if (stats.overall.hitRate < 0.5) {
      issues.push('Low overall hit rate (<50%)');
      recommendations.push('Consider pre-warming cache with common queries');
      status = 'degraded';
    }

    // Check utilization
    if (utilization > 90) {
      issues.push('Cache utilization >90%');
      recommendations.push('Consider increasing cache size limits');
      status = 'critical';
    }

    // Check L1 effectiveness
    if (stats.overall.l1HitRate < 0.2 && stats.overall.totalHits > 100) {
      issues.push('Low L1 hit rate - most hits from slower tiers');
      recommendations.push('Increase L1 cache size for better performance');
      status = status === 'critical' ? 'critical' : 'degraded';
    }

    // Check compression ratio (L3)
    const compressionRatio = this.getCompressionRatio();
    if (compressionRatio < 2) {
      issues.push('Low compression ratio in L3 cache');
      recommendations.push('Data may not be compressing well - review cached content');
    }

    if (issues.length === 0) {
      recommendations.push('Cache is operating optimally');
    }

    return {
      status,
      issues,
      recommendations,
    };
  }
}
