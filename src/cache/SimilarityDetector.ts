/**
 * SimilarityDetector - Semantic similarity detection using Jaccard algorithm for cache retrieval
 *
 * @see docs/best-practices.md#caching-strategies - Similarity-based caching
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Finds semantically similar cached investigations using Jaccard similarity (set intersection/union),
 * enabling agents to leverage past work even when queries don't match exactly.
 *
 * **Why This Exists:**
 * Exact cache hits are rare - queries vary in phrasing while seeking similar information.
 * "authentication bug" and "auth error" describe related issues. Similarity detection finds
 * cached investigations with ≥80% token overlap, letting agents reuse relevant past work.
 * This dramatically increases cache effectiveness beyond exact-match-only approaches.
 *
 * @example
 * ```typescript
 * const detector = new SimilarityDetector();
 *
 * // Find similar cached investigations
 * const similar = await detector.findSimilar('user login issue', cachedEntries, 0.8);
 * // Returns: [{ cacheKey: '...', similarity: 0.85, cachedResult: {...} }]
 *
 * if (similar.length > 0) {
 *   console.log(`Found ${similar.length} similar investigations`);
 * }
 * ```
 */

import { CacheEntry } from '../shared/types';

import { CacheKeyGenerator } from './CacheKeyGenerator';

export interface SimilarQuery<T = any> {
  cacheKey: string;
  similarity: number; // 0-1, Jaccard similarity score
  cachedResult: T;
  metadata: {
    agentId?: string;
    queryType?: string;
    tags?: string[];
  };
}

/**
 * SimilarityDetector finds semantically similar queries using Jaccard algorithm
 */
export class SimilarityDetector {
  private keyGenerator: CacheKeyGenerator;
  private readonly defaultThreshold = 0.8; // 80% similarity required

  constructor() {
    this.keyGenerator = new CacheKeyGenerator();
  }

  /**
   * Calculate Jaccard similarity between two queries
   * J(A,B) = |A ∩ B| / |A ∪ B|
   * @param query1 - First query string
   * @param query2 - Second query string
   * @returns Similarity score 0-1 (1 = identical)
   */
  calculateJaccardSimilarity(query1: string, query2: string): number {
    const tokens1 = this.tokenize(query1);
    const tokens2 = this.tokenize(query2);

    if (tokens1.length === 0 && tokens2.length === 0) {
      return 1; // Both empty = identical
    }

    if (tokens1.length === 0 || tokens2.length === 0) {
      return 0; // One empty = completely different
    }

    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);

    // Intersection: tokens in both sets
    const intersection = new Set([...set1].filter(x => set2.has(x)));

    // Union: all unique tokens
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Tokenize query: lowercase, remove punctuation, split, remove stopwords
   * @param query - Query string
   * @returns Array of normalized tokens
   */
  tokenize(query: string): string[] {
    return this.keyGenerator.extractTokens(query);
  }

  /**
   * Find similar queries from cache candidates
   * @param query - Query to match
   * @param candidates - Candidate cache entries
   * @param threshold - Similarity threshold (default: 0.8)
   * @returns Array of similar queries sorted by similarity (highest first)
   */
  findSimilarQueries<T = any>(
    query: string,
    candidates: CacheEntry<T>[],
    threshold: number = this.defaultThreshold
  ): SimilarQuery<T>[] {
    const results: SimilarQuery<T>[] = [];
    const _queryTokens = this.tokenize(query);

    for (const candidate of candidates) {
      // Extract original query from cache entry if available
      const candidateQuery = this.extractQueryFromKey(candidate.key);
      if (!candidateQuery) continue;

      // Calculate similarity
      const similarity = this.calculateJaccardSimilarity(query, candidateQuery);

      // Check threshold
      if (similarity >= threshold) {
        const parsed = this.keyGenerator.parseKey(candidate.key);

        results.push({
          cacheKey: candidate.key,
          similarity,
          cachedResult: candidate.value,
          metadata: {
            agentId: parsed?.agentId,
            queryType: parsed?.queryType,
            tags: candidate.metadata?.tags,
          },
        });
      }
    }

    // Sort by similarity (highest first)
    results.sort((a, b) => b.similarity - a.similarity);

    return results;
  }

  /**
   * Find best matching query from candidates
   * @param query - Query to match
   * @param candidates - Candidate cache entries
   * @param threshold - Similarity threshold (default: 0.8)
   * @returns Best match or undefined if none above threshold
   */
  findBestMatch<T = any>(
    query: string,
    candidates: CacheEntry<T>[],
    threshold: number = this.defaultThreshold
  ): SimilarQuery<T> | undefined {
    const similar = this.findSimilarQueries(query, candidates, threshold);
    return similar.length > 0 ? similar[0] : undefined;
  }

  /**
   * Check if two queries are similar
   * @param query1 - First query
   * @param query2 - Second query
   * @param threshold - Similarity threshold (default: 0.8)
   * @returns True if similarity >= threshold
   */
  areSimilar(
    query1: string,
    query2: string,
    threshold: number = this.defaultThreshold
  ): boolean {
    const similarity = this.calculateJaccardSimilarity(query1, query2);
    return similarity >= threshold;
  }

  /**
   * Calculate token overlap percentage
   * @param query1 - First query
   * @param query2 - Second query
   * @returns Overlap percentage 0-100
   */
  calculateOverlap(query1: string, query2: string): number {
    const similarity = this.calculateJaccardSimilarity(query1, query2);
    return similarity * 100;
  }

  /**
   * Get similarity score category
   * @param similarity - Similarity score 0-1
   * @returns Category: 'identical', 'very-similar', 'similar', 'somewhat-similar', 'different'
   */
  getSimilarityCategory(similarity: number): string {
    if (similarity >= 0.95) return 'identical';
    if (similarity >= 0.8) return 'very-similar';
    if (similarity >= 0.6) return 'similar';
    if (similarity >= 0.4) return 'somewhat-similar';
    return 'different';
  }

  /**
   * Calculate similarity matrix for multiple queries
   * @param queries - Array of queries
   * @returns 2D array of similarity scores
   */
  calculateSimilarityMatrix(queries: string[]): number[][] {
    const matrix: number[][] = [];

    for (let i = 0; i < queries.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < queries.length; j++) {
        if (i === j) {
          matrix[i][j] = 1; // Same query = 100% similar
        } else {
          matrix[i][j] = this.calculateJaccardSimilarity(queries[i], queries[j]);
        }
      }
    }

    return matrix;
  }

  /**
   * Find query clusters based on similarity
   * @param queries - Array of queries
   * @param threshold - Clustering threshold (default: 0.8)
   * @returns Array of query clusters
   */
  findClusters(
    queries: string[],
    threshold: number = this.defaultThreshold
  ): string[][] {
    const clusters: string[][] = [];
    const visited = new Set<number>();

    for (let i = 0; i < queries.length; i++) {
      if (visited.has(i)) continue;

      const cluster: string[] = [queries[i]];
      visited.add(i);

      // Find similar queries
      for (let j = i + 1; j < queries.length; j++) {
        if (visited.has(j)) continue;

        const similarity = this.calculateJaccardSimilarity(queries[i], queries[j]);
        if (similarity >= threshold) {
          cluster.push(queries[j]);
          visited.add(j);
        }
      }

      clusters.push(cluster);
    }

    return clusters;
  }

  /**
   * Extract original query from cache key (best effort)
   * @param cacheKey - Cache key
   * @returns Reconstructed query or empty string
   */
  private extractQueryFromKey(cacheKey: string): string {
    // Cache keys are hashed, so we can't reconstruct the exact query
    // This is a placeholder - in practice, we'd need to store original queries
    // For now, return the key itself which contains some semantic info
    return cacheKey;
  }

  /**
   * Calculate Cosine similarity (alternative to Jaccard)
   * Uses term frequency for weighted comparison
   * @param query1 - First query
   * @param query2 - Second query
   * @returns Similarity score 0-1
   */
  calculateCosineSimilarity(query1: string, query2: string): number {
    const tokens1 = this.tokenize(query1);
    const tokens2 = this.tokenize(query2);

    if (tokens1.length === 0 || tokens2.length === 0) {
      return 0;
    }

    // Build term frequency vectors
    const freq1 = this.getTermFrequency(tokens1);
    const freq2 = this.getTermFrequency(tokens2);

    // Get all unique terms
    const allTerms = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);

    // Calculate dot product and magnitudes
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (const term of allTerms) {
      const f1 = freq1[term] || 0;
      const f2 = freq2[term] || 0;

      dotProduct += f1 * f2;
      magnitude1 += f1 * f1;
      magnitude2 += f2 * f2;
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Get term frequency for tokens
   * @param tokens - Array of tokens
   * @returns Term frequency map
   */
  private getTermFrequency(tokens: string[]): Record<string, number> {
    const freq: Record<string, number> = {};

    for (const token of tokens) {
      freq[token] = (freq[token] || 0) + 1;
    }

    return freq;
  }

  /**
   * Calculate edit distance (Levenshtein distance)
   * Useful for catching typos and minor variations
   * @param str1 - First string
   * @param str2 - Second string
   * @returns Edit distance
   */
  calculateEditDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;

    // Create 2D array
    const dp: number[][] = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0) as number[]);

    // Initialize first row and column
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    // Fill the dp table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(
            dp[i - 1][j],     // deletion
            dp[i][j - 1],     // insertion
            dp[i - 1][j - 1]  // substitution
          );
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Calculate normalized edit distance (0-1)
   * @param str1 - First string
   * @param str2 - Second string
   * @returns Normalized edit distance
   */
  calculateNormalizedEditDistance(str1: string, str2: string): number {
    const distance = this.calculateEditDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);

    if (maxLength === 0) return 0;

    return 1 - (distance / maxLength);
  }

  /**
   * Hybrid similarity score combining multiple algorithms
   * @param query1 - First query
   * @param query2 - Second query
   * @returns Combined similarity score 0-1
   */
  calculateHybridSimilarity(query1: string, query2: string): number {
    const jaccard = this.calculateJaccardSimilarity(query1, query2);
    const cosine = this.calculateCosineSimilarity(query1, query2);
    const editDist = this.calculateNormalizedEditDistance(query1, query2);

    // Weighted combination: Jaccard (50%), Cosine (30%), Edit Distance (20%)
    return (jaccard * 0.5) + (cosine * 0.3) + (editDist * 0.2);
  }

  /**
   * Get default similarity threshold
   * @returns Default threshold (0.8)
   */
  getDefaultThreshold(): number {
    return this.defaultThreshold;
  }
}
