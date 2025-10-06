/**
 * Cache Statistics Dashboard
 * CLI dashboard for visualizing cache performance and metrics
 */

import { AdvancedCacheManager, TieredCacheStats } from '../cache/AdvancedCacheManager';

export interface DashboardOptions {
  showDetailed?: boolean; // Show detailed per-tier stats
  showTrends?: boolean; // Show performance trends
  showHealth?: boolean; // Show cache health analysis
}

export class CacheStatsDashboard {
  private cacheManager: AdvancedCacheManager;

  constructor(cacheManager: AdvancedCacheManager) {
    this.cacheManager = cacheManager;
  }

  /**
   * Display complete cache statistics dashboard
   * @param options - Display options
   * @returns Formatted dashboard string
   */
  display(options: DashboardOptions = {}): string {
    const stats = this.cacheManager.getStats();
    const lines: string[] = [];

    // Header
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('  TRINITY CACHE SYSTEM - PERFORMANCE DASHBOARD');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');

    // Overall Summary
    lines.push(...this.formatOverallStats(stats));
    lines.push('');

    // Tier Breakdown
    if (options.showDetailed !== false) {
      lines.push(...this.formatTierStats(stats));
      lines.push('');
    }

    // Cache Health
    if (options.showHealth !== false) {
      lines.push(...this.formatHealthStatus());
      lines.push('');
    }

    // Performance Metrics
    lines.push(...this.formatPerformanceMetrics(stats));
    lines.push('');

    lines.push('═══════════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  /**
   * Format overall cache statistics
   */
  private formatOverallStats(stats: TieredCacheStats): string[] {
    const lines: string[] = [];

    lines.push('OVERALL PERFORMANCE');
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  Total Hit Rate:      ${this.formatPercentage(stats.overall.hitRate)}`);
    lines.push(`  Total Hits:          ${stats.overall.totalHits.toLocaleString()}`);
    lines.push(`  Total Misses:        ${stats.overall.totalMisses.toLocaleString()}`);
    lines.push(`  Token Savings:       ${stats.overall.tokensSaved.toLocaleString()} tokens`);
    lines.push(`  Similarity Matches:  ${stats.overall.similarityDetections.toLocaleString()}`);

    const totalSizeMB = this.cacheManager.getTotalSizeMB();
    const utilization = this.cacheManager.getUtilization();
    lines.push(`  Total Cache Size:    ${totalSizeMB.toFixed(2)} MB (${utilization.toFixed(1)}% full)`);

    return lines;
  }

  /**
   * Format per-tier statistics
   */
  private formatTierStats(stats: TieredCacheStats): string[] {
    const lines: string[] = [];

    lines.push('CACHE TIER BREAKDOWN');
    lines.push('───────────────────────────────────────────────────────────────');

    // L1 Cache
    lines.push('  L1 Cache (Memory - Fastest)');
    lines.push(`    Hit Rate:        ${this.formatPercentage(stats.l1.hitRate)}`);
    lines.push(`    Hits:            ${stats.l1.hits.toLocaleString()}`);
    lines.push(`    Entries:         ${stats.l1.totalEntries.toLocaleString()}`);
    lines.push(`    Size:            ${(stats.l1.totalSize / 1024 / 1024).toFixed(2)} MB`);
    lines.push(`    Evictions:       ${stats.l1.evictions.toLocaleString()}`);
    lines.push('');

    // L2 Cache
    lines.push('  L2 Cache (Disk - Fast)');
    lines.push(`    Hit Rate:        ${this.formatPercentage(stats.l2.hitRate)}`);
    lines.push(`    Hits:            ${stats.l2.hits.toLocaleString()}`);
    lines.push(`    Size:            ${(stats.l2.totalSize / 1024 / 1024).toFixed(2)} MB`);
    lines.push(`    Evictions:       ${stats.l2.evictions.toLocaleString()}`);
    lines.push('');

    // L3 Cache
    const compressionRatio = this.cacheManager.getCompressionRatio();
    lines.push('  L3 Cache (Compressed - Large)');
    lines.push(`    Hit Rate:        ${this.formatPercentage(stats.l3.hitRate)}`);
    lines.push(`    Hits:            ${stats.l3.hits.toLocaleString()}`);
    lines.push(`    Size:            ${(stats.l3.totalSize / 1024 / 1024).toFixed(2)} MB`);
    lines.push(`    Compression:     ${compressionRatio.toFixed(2)}:1 ratio`);
    lines.push(`    Evictions:       ${stats.l3.evictions.toLocaleString()}`);

    return lines;
  }

  /**
   * Format cache health status
   */
  private formatHealthStatus(): string[] {
    const lines: string[] = [];
    const health = this.cacheManager.getCacheHealth();

    lines.push('CACHE HEALTH');
    lines.push('───────────────────────────────────────────────────────────────');

    // Status badge
    const statusBadge = this.formatHealthBadge(health.status);
    lines.push(`  Status: ${statusBadge}`);
    lines.push('');

    // Issues
    if (health.issues.length > 0) {
      lines.push('  Issues:');
      health.issues.forEach(issue => {
        lines.push(`    ⚠️  ${issue}`);
      });
      lines.push('');
    }

    // Recommendations
    if (health.recommendations.length > 0) {
      lines.push('  Recommendations:');
      health.recommendations.forEach(rec => {
        lines.push(`    💡 ${rec}`);
      });
    }

    return lines;
  }

  /**
   * Format performance metrics
   */
  private formatPerformanceMetrics(stats: TieredCacheStats): string[] {
    const lines: string[] = [];

    lines.push('PERFORMANCE METRICS');
    lines.push('───────────────────────────────────────────────────────────────');

    // Tier distribution
    lines.push('  Hit Distribution:');
    lines.push(`    L1 Hits:         ${this.formatPercentage(stats.overall.l1HitRate)}`);
    lines.push(`    L2 Hits:         ${this.formatPercentage(stats.overall.l2HitRate)}`);
    lines.push(`    L3 Hits:         ${this.formatPercentage(stats.overall.l3HitRate)}`);
    lines.push('');

    // Efficiency metrics
    const tokenSavingsPercent = this.estimateTokenSavingsPercent(stats);
    lines.push('  Efficiency:');
    lines.push(`    Token Reduction: ~${tokenSavingsPercent.toFixed(1)}%`);
    lines.push(`    Avg Lookup:      ${stats.l1.averageLookupTime.toFixed(2)}ms (L1)`);

    // Similarity detection
    if (this.cacheManager.isSimilarityDetectionEnabled()) {
      const threshold = this.cacheManager.getSimilarityThreshold();
      lines.push('');
      lines.push('  Similarity Detection:');
      lines.push(`    Enabled:         Yes (${this.formatPercentage(threshold)} threshold)`);
      lines.push(`    Matches Found:   ${stats.overall.similarityDetections.toLocaleString()}`);
    } else {
      lines.push('');
      lines.push('  Similarity Detection: Disabled');
    }

    return lines;
  }

  /**
   * Display compact summary (one-line format)
   * @returns Compact summary string
   */
  displayCompact(): string {
    const stats = this.cacheManager.getStats();
    const hitRate = (stats.overall.hitRate * 100).toFixed(1);
    const totalHits = stats.overall.totalHits;
    const sizeMB = this.cacheManager.getTotalSizeMB().toFixed(1);

    return `Cache: ${hitRate}% hit rate | ${totalHits} hits | ${sizeMB} MB used`;
  }

  /**
   * Export statistics to JSON
   * @param filepath - Output file path
   */
  async exportStats(filepath: string): Promise<void> {
    const stats = this.cacheManager.getStats();
    const health = this.cacheManager.getCacheHealth();
    const config = this.cacheManager.getConfig();

    const exportData = {
      timestamp: new Date().toISOString(),
      stats,
      health,
      config: {
        similarityThreshold: config.similarityThreshold,
        similarityEnabled: config.enableSimilarityDetection,
        l1MaxEntries: config.l1.maxEntries,
        l2MaxSizeMB: config.l2.maxSizeMB,
        l3MaxSizeMB: config.l3.maxSizeMB,
      },
      metrics: {
        totalSizeMB: this.cacheManager.getTotalSizeMB(),
        utilization: this.cacheManager.getUtilization(),
        compressionRatio: this.cacheManager.getCompressionRatio(),
      },
    };

    const fs = await import('fs/promises');
    await fs.writeFile(filepath, JSON.stringify(exportData, null, 2), 'utf8');
  }

  /**
   * Get statistics as object (for programmatic access)
   * @returns Statistics object
   */
  getStatsObject(): {
    overall: TieredCacheStats['overall'];
    tiers: {
      l1: TieredCacheStats['l1'];
      l2: TieredCacheStats['l2'];
      l3: TieredCacheStats['l3'];
    };
    health: ReturnType<AdvancedCacheManager['getCacheHealth']>;
    metrics: {
      totalSizeMB: number;
      utilization: number;
      compressionRatio: number;
    };
  } {
    const stats = this.cacheManager.getStats();
    const health = this.cacheManager.getCacheHealth();

    return {
      overall: stats.overall,
      tiers: {
        l1: stats.l1,
        l2: stats.l2,
        l3: stats.l3,
      },
      health,
      metrics: {
        totalSizeMB: this.cacheManager.getTotalSizeMB(),
        utilization: this.cacheManager.getUtilization(),
        compressionRatio: this.cacheManager.getCompressionRatio(),
      },
    };
  }

  /**
   * Format percentage for display
   */
  private formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  /**
   * Format health status badge
   */
  private formatHealthBadge(status: string): string {
    const badges: Record<string, string> = {
      'healthy': '✅ Healthy',
      'degraded': '⚠️  Degraded',
      'critical': '🔴 Critical',
    };

    return badges[status] || status;
  }

  /**
   * Estimate token savings percentage based on hit rate
   * Assumes avg 1000 tokens per cache hit
   */
  private estimateTokenSavingsPercent(stats: TieredCacheStats): number {
    const totalRequests = stats.overall.totalHits + stats.overall.totalMisses;
    if (totalRequests === 0) return 0;

    // Estimate: hit rate correlates with token savings
    // Conservative estimate: hitRate * 0.4 (accounts for partial cache usage)
    return stats.overall.hitRate * 40;
  }

  /**
   * Display cache configuration
   */
  displayConfig(): string {
    const config = this.cacheManager.getConfig();
    const lines: string[] = [];

    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('  CACHE CONFIGURATION');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');

    lines.push('L1 Cache (Memory):');
    lines.push(`  Max Entries:     ${config.l1.maxEntries?.toLocaleString() ?? 'default'}`);
    lines.push(`  Max Size:        ${((config.l1.maxSize ?? 0) / 1024 / 1024).toFixed(2)} MB`);
    lines.push(`  TTL:             ${this.formatDuration(config.l1.ttl ?? 0)}`);
    lines.push('');

    lines.push('L2 Cache (Disk):');
    lines.push(`  Cache Dir:       ${config.l2.cacheDir ?? 'default'}`);
    lines.push(`  Max Size:        ${config.l2.maxSizeMB ?? 'default'} MB`);
    lines.push(`  TTL:             ${this.formatDuration(config.l2.ttl ?? 0)}`);
    lines.push('');

    lines.push('L3 Cache (Compressed):');
    lines.push(`  Cache Dir:       ${config.l3.cacheDir ?? 'default'}`);
    lines.push(`  Max Size:        ${config.l3.maxSizeMB ?? 'default'} MB`);
    lines.push(`  Compression:     Level ${config.l3.compressionLevel ?? 'default'}`);
    lines.push(`  TTL:             ${this.formatDuration(config.l3.ttl ?? 0)}`);
    lines.push('');

    lines.push('Similarity Detection:');
    lines.push(`  Enabled:         ${config.enableSimilarityDetection ? 'Yes' : 'No'}`);
    lines.push(`  Threshold:       ${this.formatPercentage(config.similarityThreshold)}`);
    lines.push('');

    lines.push('═══════════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  /**
   * Format duration in human-readable format
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''}`;
    return `${seconds} sec${seconds > 1 ? 's' : ''}`;
  }

  /**
   * Display top cached queries (if available)
   */
  async displayTopQueries(limit: number = 10): Promise<string> {
    const lines: string[] = [];

    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('  TOP CACHED QUERIES');
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('');

    // Get all keys and their access counts
    const allKeys = await this.cacheManager.getAllKeys();
    const entries: Array<{ key: string; accessCount: number; hitRate: number }> = [];

    for (const key of allKeys.slice(0, limit * 2)) {
      // Sample more than limit
      const entry = await this.cacheManager.getEntry(key);
      if (entry) {
        entries.push({
          key: entry.key,
          accessCount: entry.accessCount,
          hitRate: entry.accessCount > 0 ? 1 : 0, // Simplified
        });
      }
    }

    // Sort by access count
    entries.sort((a, b) => b.accessCount - a.accessCount);

    // Display top entries
    const topEntries = entries.slice(0, limit);

    if (topEntries.length === 0) {
      lines.push('  No cached queries yet');
    } else {
      topEntries.forEach((entry, index) => {
        lines.push(`  ${index + 1}. ${this.truncateKey(entry.key)}`);
        lines.push(`     Accesses: ${entry.accessCount.toLocaleString()}`);
        lines.push('');
      });
    }

    lines.push('═══════════════════════════════════════════════════════════════');

    return lines.join('\n');
  }

  /**
   * Truncate cache key for display
   */
  private truncateKey(key: string, maxLength: number = 50): string {
    if (key.length <= maxLength) return key;
    return `${key.substring(0, maxLength - 3)  }...`;
  }

  /**
   * Reset all statistics
   */
  resetStats(): void {
    this.cacheManager.resetStats();
  }
}
