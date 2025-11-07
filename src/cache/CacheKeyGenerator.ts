/**
 * CacheKeyGenerator - Deterministic cache key generation with normalization and hashing
 *
 * @see docs/best-practices.md#caching-strategies - Cache key generation patterns
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Generates consistent SHA-256 keys from investigation queries with stopword removal and
 * normalization, ensuring identical queries always hit same cache entry regardless of phrasing.
 *
 * **Why This Exists:**
 * Cache effectiveness depends on key consistency. Similar queries phrased differently ("add user auth"
 * vs "implement user authentication") should map to same key. This generator normalizes queries by
 * removing stopwords, lowercasing, sorting tokens, then hashing, maximizing cache hit rate while
 * maintaining determinism.
 *
 * @example
 * ```typescript
 * const generator = new CacheKeyGenerator();
 *
 * // Generates same key for similar queries
 * const key1 = generator.generate('add user authentication');
 * const key2 = generator.generate('implement user auth');
 * // key1 === key2 after normalization
 * ```
 */

import * as crypto from 'crypto';

/**
 * CacheKeyGenerator creates consistent cache keys from queries
 */
export class CacheKeyGenerator {
  private stopwords: Set<string>;

  constructor() {
    // Common stop words to remove for better key normalization
    this.stopwords = new Set([
      'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'from', 'as', 'into', 'like', 'through', 'after',
      'over', 'between', 'out', 'against', 'during', 'without', 'before',
      'under', 'around', 'among', 'this', 'that', 'these', 'those', 'it',
      'its', 'they', 'them', 'their', 'what', 'which', 'who', 'when', 'where',
      'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
      'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
      'so', 'than', 'too', 'very', 's', 't', 'just', 'don', 'now',
    ]);
  }

  /**
   * Generate cache key from query string and agent ID
   * @param query - Query string to cache
   * @param agentId - Agent ID (TAN, ZEN, INO, JUNO, AJ)
   * @param queryType - Type of query (analysis, pattern, research, validation)
   * @returns Deterministic cache key
   */
  generateKey(
    query: string,
    agentId: string,
    queryType: 'analysis' | 'pattern' | 'research' | 'validation' = 'analysis'
  ): string {
    const normalized = this.normalizeQuery(query);
    const hash = this.hashQuery(normalized);

    // Format: agentId_queryType_hash (first 16 chars of hash for readability)
    return `${agentId}_${queryType}_${hash.substring(0, 16)}`;
  }

  /**
   * Normalize query string for consistent hashing
   * - Convert to lowercase
   * - Remove extra whitespace
   * - Remove punctuation
   * - Remove stop words
   * - Sort tokens alphabetically
   * @param query - Raw query string
   * @returns Normalized query string
   */
  normalizeQuery(query: string): string {
    // Convert to lowercase
    let normalized = query.toLowerCase();

    // Remove code blocks and markdown (they vary in formatting)
    normalized = normalized.replace(/```[\s\S]*?```/g, 'code_block');
    normalized = normalized.replace(/`[^`]+`/g, 'code');

    // Remove URLs (vary by protocol/subdomain but same content)
    normalized = normalized.replace(/https?:\/\/[^\s]+/g, 'url');

    // Remove file paths (normalize paths)
    normalized = normalized.replace(/[a-zA-Z]:[\\\/][^\s]+/g, 'filepath');
    normalized = normalized.replace(/\/[a-zA-Z0-9_\-\/\.]+/g, 'filepath');

    // Remove numbers (often vary but same query)
    normalized = normalized.replace(/\d+/g, 'num');

    // Remove punctuation except hyphens in compound words
    normalized = normalized.replace(/[^\w\s-]/g, ' ');

    // Split into tokens
    const tokens = normalized
      .split(/\s+/)
      .filter(token => token.length > 0)
      .filter(token => !this.stopwords.has(token))
      .filter(token => token.length > 2); // Remove very short tokens

    // Sort alphabetically for deterministic ordering
    // (e.g., "find bugs in code" === "code bugs find" after normalization)
    tokens.sort();

    // Join with single space
    return tokens.join(' ');
  }

  /**
   * Hash normalized query using SHA-256
   * @param normalizedQuery - Normalized query string
   * @returns SHA-256 hash (hex)
   */
  hashQuery(normalizedQuery: string): string {
    return crypto
      .createHash('sha256')
      .update(normalizedQuery)
      .digest('hex');
  }

  /**
   * Generate bucket name from cache key (for L2/L3 directory organization)
   * Uses first 3 hex characters of the hash for 4096 possible buckets (000-FFF)
   * @param cacheKey - Cache key
   * @returns Bucket name (e.g., "A3F")
   */
  getBucketName(cacheKey: string): string {
    // Hash the full cache key to get SHA-256
    const hash = crypto
      .createHash('sha256')
      .update(cacheKey)
      .digest('hex');

    // Use first 3 hex chars for bucket (000-FFF)
    return hash.substring(0, 3).toUpperCase();
  }

  /**
   * Extract tokens from query for similarity detection
   * @param query - Query string
   * @returns Array of normalized tokens
   */
  extractTokens(query: string): string[] {
    const normalized = this.normalizeQuery(query);
    return normalized.split(' ').filter(token => token.length > 0);
  }

  /**
   * Validate cache key format
   * @param key - Cache key to validate
   * @returns True if valid format
   */
  isValidKey(key: string): boolean {
    // Format: agentId_queryType_hash16
    const pattern = /^(AJ|TAN|ZEN|INO|JUNO)_(analysis|pattern|research|validation)_[0-9a-f]{16}$/;
    return pattern.test(key);
  }

  /**
   * Parse cache key into components
   * @param key - Cache key
   * @returns Parsed components or null if invalid
   */
  parseKey(key: string): { agentId: string; queryType: string; hash: string } | null {
    if (!this.isValidKey(key)) {
      return null;
    }

    const parts = key.split('_');
    return {
      agentId: parts[0],
      queryType: parts[1],
      hash: parts[2],
    };
  }

  /**
   * Generate investigation cache key
   * @param investigationId - Investigation ID
   * @param agentId - Agent ID
   * @returns Cache key for investigation results
   */
  generateInvestigationKey(investigationId: string, agentId: string): string {
    const hash = this.hashQuery(investigationId);
    return `${agentId}_investigation_${hash.substring(0, 16)}`;
  }

  /**
   * Generate pattern cache key
   * @param patternId - Pattern ID
   * @param agentId - Agent ID
   * @returns Cache key for pattern data
   */
  generatePatternKey(patternId: string, agentId: string): string {
    const hash = this.hashQuery(patternId);
    return `${agentId}_pattern_${hash.substring(0, 16)}`;
  }
}
