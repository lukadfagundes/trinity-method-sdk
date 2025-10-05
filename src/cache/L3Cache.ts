/**
 * L3 Cache - Compressed Disk Cache
 * Gzip-compressed JSON file cache for large-scale historical data
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { CacheEntry, CacheStats } from '../shared/types';
import { CacheKeyGenerator } from './CacheKeyGenerator';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export interface L3CacheConfig {
  cacheDir: string; // L3 cache directory (default: trinity/.cache/l3)
  maxSizeMB: number; // Maximum disk space in MB (default: 1000MB)
  ttl: number; // Default TTL in milliseconds (default: 7 days)
  compressionLevel: number; // Gzip compression level 1-9 (default: 6)
}

export class L3Cache {
  private config: L3CacheConfig;
  private keyGenerator: CacheKeyGenerator;
  private stats: {
    hits: number;
    misses: number;
    evictions: number;
    sets: number;
    totalCompressedBytes: number;
    totalUncompressedBytes: number;
  };
  private currentSizeBytes: number;

  constructor(config?: Partial<L3CacheConfig>) {
    this.config = {
      cacheDir: config?.cacheDir ?? path.join(process.cwd(), 'trinity', '.cache', 'l3'),
      maxSizeMB: config?.maxSizeMB ?? 1000,
      ttl: config?.ttl ?? 7 * 24 * 60 * 60 * 1000, // 7 days
      compressionLevel: config?.compressionLevel ?? 6,
    };

    this.keyGenerator = new CacheKeyGenerator();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      totalCompressedBytes: 0,
      totalUncompressedBytes: 0,
    };
    this.currentSizeBytes = 0;

    // Initialize cache directory
    this.initializeCache().catch(err => {
      console.error('Failed to initialize L3 cache:', err);
    });
  }

  /**
   * Initialize cache directory
   */
  private async initializeCache(): Promise<void> {
    try {
      await fs.mkdir(this.config.cacheDir, { recursive: true });
      await this.calculateCacheSize();
    } catch (error) {
      throw new Error(`Failed to initialize L3 cache: ${(error as Error).message}`);
    }
  }

  /**
   * Get cached entry by key
   * @param key - Cache key
   * @returns Cached entry or undefined if not found/expired
   */
  async get<T = any>(key: string): Promise<CacheEntry<T> | undefined> {
    try {
      const filePath = this.getFilePath(key);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        this.stats.misses++;
        return undefined;
      }

      // Read compressed file
      const compressed = await fs.readFile(filePath);

      // Decompress
      const decompressed = await gunzip(compressed);
      const content = decompressed.toString('utf8');

      // Parse JSON
      const entry: CacheEntry<T> = JSON.parse(content, this.dateReviver);

      // Check if expired
      if (Date.now() > entry.expiresAt) {
        await this.delete(key);
        this.stats.misses++;
        return undefined;
      }

      // Update access tracking
      entry.lastAccessedAt = Date.now();
      entry.accessCount++;

      // Write updated entry back (async, don't await)
      this.set(key, entry.value, entry.ttl).catch(() => {
        // Ignore write errors on access tracking
      });

      this.stats.hits++;
      return entry;
    } catch (error) {
      this.stats.misses++;
      return undefined;
    }
  }

  /**
   * Store entry in cache with compression
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Optional custom TTL (ms)
   */
  async set<T = any>(key: string, value: T, ttl?: number): Promise<void> {
    try {
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
        metadata: {},
      };

      // Convert to JSON
      const json = JSON.stringify(entry, null, 2);
      const uncompressedSize = Buffer.byteLength(json, 'utf8');

      // Compress with Gzip
      const compressed = await gzip(json, {
        level: this.config.compressionLevel,
      });
      const compressedSize = compressed.length;

      // Track compression ratio
      this.stats.totalUncompressedBytes += uncompressedSize;
      this.stats.totalCompressedBytes += compressedSize;

      const filePath = this.getFilePath(key);
      const bucket = this.getBucket(filePath);

      // Ensure bucket directory exists
      await fs.mkdir(bucket, { recursive: true });

      // Check cache size before writing
      await this.ensureCacheSpace(compressedSize);

      // Write compressed data atomically
      await this.atomicWrite(filePath, compressed);

      this.currentSizeBytes += compressedSize;
      this.stats.sets++;
    } catch (error) {
      throw new Error(`Failed to set cache entry: ${(error as Error).message}`);
    }
  }

  /**
   * Check if key exists in cache
   * @param key - Cache key
   * @returns True if key exists and not expired
   */
  async has(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);

      // Check file exists
      await fs.access(filePath);

      // Read and decompress to check expiration
      const compressed = await fs.readFile(filePath);
      const decompressed = await gunzip(compressed);
      const content = decompressed.toString('utf8');
      const entry: CacheEntry = JSON.parse(content, this.dateReviver);

      if (Date.now() > entry.expiresAt) {
        await this.delete(key);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete entry from cache
   * @param key - Cache key
   * @returns True if entry was deleted
   */
  async delete(key: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(key);

      // Get file size before deleting
      const stats = await fs.stat(filePath);
      await fs.unlink(filePath);

      this.currentSizeBytes -= stats.size;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      await fs.rm(this.config.cacheDir, { recursive: true, force: true });
      await fs.mkdir(this.config.cacheDir, { recursive: true });

      this.stats = {
        hits: 0,
        misses: 0,
        evictions: 0,
        sets: 0,
        totalCompressedBytes: 0,
        totalUncompressedBytes: 0,
      };
      this.currentSizeBytes = 0;
    } catch (error) {
      throw new Error(`Failed to clear cache: ${(error as Error).message}`);
    }
  }

  /**
   * Get all keys in cache
   * @returns Array of cache keys
   */
  async keys(): Promise<string[]> {
    const allKeys: string[] = [];

    try {
      const entries = await fs.readdir(this.config.cacheDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const bucketPath = path.join(this.config.cacheDir, entry.name);
          const files = await fs.readdir(bucketPath);

          for (const file of files) {
            if (file.endsWith('.gz')) {
              const key = file.replace('.gz', '');
              allKeys.push(key);
            }
          }
        }
      }
    } catch {
      // Return empty array if cache dir doesn't exist
    }

    return allKeys;
  }

  /**
   * Get all entries in cache
   * @returns Array of cache entries
   */
  async entries(): Promise<CacheEntry[]> {
    const allEntries: CacheEntry[] = [];
    const keys = await this.keys();

    for (const key of keys) {
      const entry = await this.get(key);
      if (entry) {
        allEntries.push(entry);
      }
    }

    return allEntries;
  }

  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    const compressionRatio = this.stats.totalCompressedBytes > 0
      ? this.stats.totalUncompressedBytes / this.stats.totalCompressedBytes
      : 1;

    return {
      totalEntries: 0,
      totalSize: this.currentSizeBytes,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      averageLookupTime: 0,
      evictions: this.stats.evictions,
      expiredEntries: 0,
    };
  }

  /**
   * Get compression ratio
   * @returns Compression ratio (e.g., 5.2 means 5.2:1)
   */
  getCompressionRatio(): number {
    if (this.stats.totalCompressedBytes === 0) {
      return 1;
    }

    return this.stats.totalUncompressedBytes / this.stats.totalCompressedBytes;
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      sets: 0,
      totalCompressedBytes: 0,
      totalUncompressedBytes: 0,
    };
  }

  /**
   * Purge expired entries
   */
  async purgeExpired(): Promise<number> {
    let purgedCount = 0;
    const keys = await this.keys();

    for (const key of keys) {
      const filePath = this.getFilePath(key);

      try {
        const compressed = await fs.readFile(filePath);
        const decompressed = await gunzip(compressed);
        const content = decompressed.toString('utf8');
        const entry: CacheEntry = JSON.parse(content, this.dateReviver);

        if (Date.now() > entry.expiresAt) {
          await this.delete(key);
          purgedCount++;
        }
      } catch {
        // Skip files that can't be read
      }
    }

    return purgedCount;
  }

  /**
   * Get file path for cache key (with bucketing)
   * @param key - Cache key
   * @returns Full file path
   */
  private getFilePath(key: string): string {
    const bucket = this.keyGenerator.getBucketName(key);
    return path.join(this.config.cacheDir, bucket, `${key}.gz`);
  }

  /**
   * Get bucket directory from file path
   * @param filePath - Full file path
   * @returns Bucket directory path
   */
  private getBucket(filePath: string): string {
    return path.dirname(filePath);
  }

  /**
   * Atomic write operation for binary data
   * @param filePath - Target file path
   * @param data - Binary data to write
   */
  private async atomicWrite(filePath: string, data: Buffer): Promise<void> {
    const tempPath = `${filePath}.tmp`;

    try {
      await fs.writeFile(tempPath, data);
      await fs.rename(tempPath, filePath);
    } catch (error) {
      await fs.unlink(tempPath).catch(() => {});
      throw new Error(`Atomic write failed: ${(error as Error).message}`);
    }
  }

  /**
   * Ensure cache has enough space for new entry
   * @param requiredBytes - Bytes needed for new entry
   */
  private async ensureCacheSpace(requiredBytes: number): Promise<void> {
    const maxBytes = this.config.maxSizeMB * 1024 * 1024;

    if (this.currentSizeBytes + requiredBytes <= maxBytes) {
      return;
    }

    // Get all entries sorted by last accessed time (oldest first)
    const entries = await this.entries();
    entries.sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);

    // Evict oldest entries until we have enough space
    for (const entry of entries) {
      if (this.currentSizeBytes + requiredBytes <= maxBytes) {
        break;
      }

      await this.delete(entry.key);
      this.stats.evictions++;
    }
  }

  /**
   * Calculate total cache size on disk
   */
  private async calculateCacheSize(): Promise<void> {
    let totalSize = 0;

    try {
      const entries = await fs.readdir(this.config.cacheDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const bucketPath = path.join(this.config.cacheDir, entry.name);
          const files = await fs.readdir(bucketPath);

          for (const file of files) {
            const filePath = path.join(bucketPath, file);
            const stats = await fs.stat(filePath);
            totalSize += stats.size;
          }
        }
      }
    } catch {
      // Cache dir doesn't exist yet
    }

    this.currentSizeBytes = totalSize;
  }

  /**
   * JSON reviver to parse Date objects
   */
  private dateReviver(key: string, value: any): any {
    if (typeof value === 'string') {
      const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (datePattern.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }

  /**
   * Get configuration
   * @returns Current configuration
   */
  getConfig(): L3CacheConfig {
    return { ...this.config };
  }

  /**
   * Get current cache size in MB
   * @returns Cache size in MB
   */
  getCacheSizeMB(): number {
    return this.currentSizeBytes / (1024 * 1024);
  }

  /**
   * Get cache utilization percentage
   * @returns Utilization percentage (0-100)
   */
  getUtilization(): number {
    const maxBytes = this.config.maxSizeMB * 1024 * 1024;
    return (this.currentSizeBytes / maxBytes) * 100;
  }

  /**
   * Find entries matching predicate
   * @param predicate - Function to test entries
   * @returns Array of matching entries
   */
  async find<T = any>(predicate: (entry: CacheEntry<T>) => boolean): Promise<CacheEntry<T>[]> {
    const results: CacheEntry<T>[] = [];
    const entries = await this.entries();

    for (const entry of entries) {
      if (predicate(entry as CacheEntry<T>)) {
        results.push(entry as CacheEntry<T>);
      }
    }

    return results;
  }

  /**
   * Get storage savings from compression
   * @returns Bytes saved by compression
   */
  getStorageSavings(): number {
    return this.stats.totalUncompressedBytes - this.stats.totalCompressedBytes;
  }

  /**
   * Get storage savings percentage
   * @returns Percentage saved (0-100)
   */
  getStorageSavingsPercent(): number {
    if (this.stats.totalUncompressedBytes === 0) {
      return 0;
    }

    const savings = this.getStorageSavings();
    return (savings / this.stats.totalUncompressedBytes) * 100;
  }
}
