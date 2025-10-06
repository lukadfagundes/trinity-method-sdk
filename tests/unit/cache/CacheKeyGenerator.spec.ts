/**
 * Unit tests for CacheKeyGenerator
 * Tests key generation, normalization, and hashing
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { CacheKeyGenerator } from '../../../src/cache/CacheKeyGenerator';

describe('CacheKeyGenerator', () => {
  let generator: CacheKeyGenerator;

  beforeEach(() => {
    generator = new CacheKeyGenerator();
  });

  describe('generateKey', () => {
    it('should generate consistent keys for identical queries', () => {
      const query = 'analyze authentication flow in the application';
      const key1 = generator.generateKey(query, 'TAN', 'analysis');
      const key2 = generator.generateKey(query, 'TAN', 'analysis');

      expect(key1).toBe(key2);
      expect(key1).toMatch(/^TAN_analysis_[0-9a-f]{16}$/);
    });

    it('should generate different keys for different queries', () => {
      const query1 = 'analyze authentication flow';
      const query2 = 'review database schema';

      const key1 = generator.generateKey(query1, 'TAN', 'analysis');
      const key2 = generator.generateKey(query2, 'TAN', 'analysis');

      expect(key1).not.toBe(key2);
    });

    it('should generate different keys for different agents', () => {
      const query = 'analyze code structure';

      const key1 = generator.generateKey(query, 'TAN', 'analysis');
      const key2 = generator.generateKey(query, 'ZEN', 'analysis');

      expect(key1).not.toBe(key2);
      expect(key1).toMatch(/^TAN_/);
      expect(key2).toMatch(/^ZEN_/);
    });

    it('should generate different keys for different query types', () => {
      const query = 'check validation rules';

      const key1 = generator.generateKey(query, 'JUNO', 'analysis');
      const key2 = generator.generateKey(query, 'JUNO', 'validation');

      expect(key1).not.toBe(key2);
      expect(key1).toMatch(/_analysis_/);
      expect(key2).toMatch(/_validation_/);
    });

    it('should use default query type if not specified', () => {
      const query = 'find patterns in code';
      const key = generator.generateKey(query, 'INO');

      expect(key).toMatch(/^INO_analysis_[0-9a-f]{16}$/);
    });
  });

  describe('normalizeQuery', () => {
    it('should convert to lowercase', () => {
      const query = 'ANALYZE Authentication FLOW';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).not.toContain('ANALYZE');
      expect(normalized).not.toContain('Authentication');
      expect(normalized).not.toContain('FLOW');
    });

    it('should remove stop words', () => {
      const query = 'analyze the authentication flow in the application';
      const normalized = generator.normalizeQuery(query);

      // Check that stop words are not present as separate tokens
      const tokens = normalized.split(' ');
      expect(tokens).not.toContain('the');
      expect(tokens).not.toContain('in');
      expect(normalized).toContain('analyze');
      expect(normalized).toContain('authentication');
    });

    it('should remove punctuation', () => {
      const query = 'analyze: authentication, flow! security?';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).not.toContain(':');
      expect(normalized).not.toContain(',');
      expect(normalized).not.toContain('!');
      expect(normalized).not.toContain('?');
    });

    it('should normalize code blocks', () => {
      const query = 'analyze this ```function test() { return 42; }``` code';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).toContain('code_block');
      expect(normalized).not.toContain('function');
    });

    it('should normalize inline code', () => {
      const query = 'check the `getUserById` function';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).toContain('code');
      expect(normalized).not.toContain('getUserById');
    });

    it('should normalize URLs', () => {
      const query = 'check https://example.com/api/users endpoint';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).toContain('url');
      expect(normalized).not.toContain('example.com');
    });

    it('should normalize file paths', () => {
      const query = 'analyze /src/components/Auth.tsx file';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).toContain('filepath');
      expect(normalized).not.toContain('components');
    });

    it('should normalize numbers', () => {
      const query = 'find 42 instances of pattern 123';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).toContain('num');
      expect(normalized).not.toContain('42');
      expect(normalized).not.toContain('123');
    });

    it('should sort tokens alphabetically', () => {
      const query1 = 'authentication analyze flow';
      const query2 = 'flow analyze authentication';

      const normalized1 = generator.normalizeQuery(query1);
      const normalized2 = generator.normalizeQuery(query2);

      expect(normalized1).toBe(normalized2);
    });

    it('should produce same result for semantically similar queries', () => {
      const query1 = 'analyze the authentication flow';
      const query2 = 'flow authentication analyze';

      const normalized1 = generator.normalizeQuery(query1);
      const normalized2 = generator.normalizeQuery(query2);

      // Should be identical after normalization (stop words removed, sorted)
      expect(normalized1).toBe(normalized2);
    });

    it('should remove very short tokens', () => {
      const query = 'a b analyze cd authentication';
      const normalized = generator.normalizeQuery(query);

      expect(normalized).not.toContain('a ');
      expect(normalized).not.toContain('b ');
      expect(normalized).not.toContain('cd');
      expect(normalized).toContain('analyze');
    });
  });

  describe('hashQuery', () => {
    it('should generate SHA-256 hash', () => {
      const query = 'test query';
      const hash = generator.hashQuery(query);

      expect(hash).toHaveLength(64); // SHA-256 produces 64 hex chars
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should generate consistent hashes', () => {
      const query = 'consistent test';
      const hash1 = generator.hashQuery(query);
      const hash2 = generator.hashQuery(query);

      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = generator.hashQuery('query one');
      const hash2 = generator.hashQuery('query two');

      expect(hash1).not.toBe(hash2);
    });

    it('should be deterministic', () => {
      const query = 'deterministic test';
      const hashes = Array.from({ length: 100 }, () => generator.hashQuery(query));

      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(1);
    });
  });

  describe('getBucketName', () => {
    it('should generate 3-character hex bucket name', () => {
      const key = 'TAN_analysis_abc123def456';
      const bucket = generator.getBucketName(key);

      expect(bucket).toHaveLength(3);
      expect(bucket).toMatch(/^[0-9A-F]{3}$/);
    });

    it('should generate consistent buckets for same key', () => {
      const key = 'TAN_analysis_abc123def456';
      const bucket1 = generator.getBucketName(key);
      const bucket2 = generator.getBucketName(key);

      expect(bucket1).toBe(bucket2);
    });

    it('should distribute keys across buckets', () => {
      const buckets = new Set<string>();

      for (let i = 0; i < 1000; i++) {
        const key = `TAN_analysis_${i}`;
        const bucket = generator.getBucketName(key);
        buckets.add(bucket);
      }

      // Should create many different buckets (>100 for 1000 keys)
      expect(buckets.size).toBeGreaterThan(100);
    });

    it('should handle all agent types', () => {
      const agents = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];

      for (const agent of agents) {
        const key = `${agent}_analysis_test123`;
        const bucket = generator.getBucketName(key);
        expect(bucket).toMatch(/^[0-9A-F]{3}$/);
      }
    });
  });

  describe('extractTokens', () => {
    it('should extract normalized tokens', () => {
      const query = 'analyze authentication flow';
      const tokens = generator.extractTokens(query);

      expect(tokens).toContain('analyze');
      expect(tokens).toContain('authentication');
      expect(tokens).toContain('flow');
    });

    it('should return sorted tokens', () => {
      const query = 'flow authentication analyze';
      const tokens = generator.extractTokens(query);

      expect(tokens).toEqual(['analyze', 'authentication', 'flow']);
    });

    it('should remove stop words from tokens', () => {
      const query = 'analyze the authentication flow';
      const tokens = generator.extractTokens(query);

      expect(tokens).not.toContain('the');
    });

    it('should handle empty query', () => {
      const tokens = generator.extractTokens('');
      expect(tokens).toEqual([]);
    });

    it('should handle query with only stop words', () => {
      const tokens = generator.extractTokens('the a an is are');
      expect(tokens).toEqual([]);
    });
  });

  describe('isValidKey', () => {
    it('should validate correct key format', () => {
      const key = 'TAN_analysis_abc123def456789a';
      expect(generator.isValidKey(key)).toBe(true);
    });

    it('should validate all agent types', () => {
      const agents = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];

      for (const agent of agents) {
        const key = `${agent}_analysis_abc123def456789a`;
        expect(generator.isValidKey(key)).toBe(true);
      }
    });

    it('should validate all query types', () => {
      const types = ['analysis', 'pattern', 'research', 'validation'];

      for (const type of types) {
        const key = `TAN_${type}_abc123def456789a`;
        expect(generator.isValidKey(key)).toBe(true);
      }
    });

    it('should reject invalid agent ID', () => {
      const key = 'INVALID_analysis_abc123def456789a';
      expect(generator.isValidKey(key)).toBe(false);
    });

    it('should reject invalid query type', () => {
      const key = 'TAN_invalid_abc123def456789a';
      expect(generator.isValidKey(key)).toBe(false);
    });

    it('should reject invalid hash length', () => {
      const key = 'TAN_analysis_abc'; // Too short
      expect(generator.isValidKey(key)).toBe(false);
    });

    it('should reject non-hex characters in hash', () => {
      const key = 'TAN_analysis_ghijklmnopqrstuv';
      expect(generator.isValidKey(key)).toBe(false);
    });

    it('should reject malformed keys', () => {
      expect(generator.isValidKey('TAN-analysis-abc123')).toBe(false);
      expect(generator.isValidKey('TAN_analysis')).toBe(false);
      expect(generator.isValidKey('analysis_abc123def456789a')).toBe(false);
    });
  });

  describe('parseKey', () => {
    it('should parse valid key', () => {
      const key = 'TAN_analysis_abc123def456789a';
      const parsed = generator.parseKey(key);

      expect(parsed).not.toBeNull();
      expect(parsed?.agentId).toBe('TAN');
      expect(parsed?.queryType).toBe('analysis');
      expect(parsed?.hash).toBe('abc123def456789a');
    });

    it('should parse all agent types', () => {
      const agents = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];

      for (const agent of agents) {
        const key = `${agent}_pattern_1234567890abcdef`;
        const parsed = generator.parseKey(key);

        expect(parsed?.agentId).toBe(agent);
      }
    });

    it('should return null for invalid key', () => {
      const parsed = generator.parseKey('invalid_key_format');
      expect(parsed).toBeNull();
    });

    it('should return null for empty key', () => {
      const parsed = generator.parseKey('');
      expect(parsed).toBeNull();
    });
  });

  describe('generateInvestigationKey', () => {
    it('should generate investigation-specific key', () => {
      const investigationId = 'inv-12345';
      const key = generator.generateInvestigationKey(investigationId, 'TAN');

      expect(key).toMatch(/^TAN_investigation_[0-9a-f]{16}$/);
    });

    it('should be deterministic for same investigation', () => {
      const investigationId = 'inv-67890';
      const key1 = generator.generateInvestigationKey(investigationId, 'ZEN');
      const key2 = generator.generateInvestigationKey(investigationId, 'ZEN');

      expect(key1).toBe(key2);
    });

    it('should differ by agent', () => {
      const investigationId = 'inv-99999';
      const key1 = generator.generateInvestigationKey(investigationId, 'INO');
      const key2 = generator.generateInvestigationKey(investigationId, 'JUNO');

      expect(key1).not.toBe(key2);
    });
  });

  describe('generatePatternKey', () => {
    it('should generate pattern-specific key', () => {
      const patternId = 'pattern-auth-flow';
      const key = generator.generatePatternKey(patternId, 'TAN');

      expect(key).toMatch(/^TAN_pattern_[0-9a-f]{16}$/);
    });

    it('should be deterministic for same pattern', () => {
      const patternId = 'pattern-validation';
      const key1 = generator.generatePatternKey(patternId, 'JUNO');
      const key2 = generator.generatePatternKey(patternId, 'JUNO');

      expect(key1).toBe(key2);
    });

    it('should differ by agent', () => {
      const patternId = 'pattern-structure';
      const key1 = generator.generatePatternKey(patternId, 'TAN');
      const key2 = generator.generatePatternKey(patternId, 'AJ');

      expect(key1).not.toBe(key2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long queries', () => {
      const longQuery = 'analyze '.repeat(1000) + 'authentication flow';
      const key = generator.generateKey(longQuery, 'TAN', 'analysis');

      expect(key).toMatch(/^TAN_analysis_[0-9a-f]{16}$/);
    });

    it('should handle queries with special characters', () => {
      const query = 'analyze 😀 authentication 🔐 flow';
      const key = generator.generateKey(query, 'TAN', 'analysis');

      expect(key).toMatch(/^TAN_analysis_[0-9a-f]{16}$/);
    });

    it('should handle empty query', () => {
      const key = generator.generateKey('', 'TAN', 'analysis');

      expect(key).toMatch(/^TAN_analysis_[0-9a-f]{16}$/);
    });

    it('should handle query with only whitespace', () => {
      const key = generator.generateKey('   \t\n   ', 'TAN', 'analysis');

      expect(key).toMatch(/^TAN_analysis_[0-9a-f]{16}$/);
    });

    it('should handle query with mixed case and punctuation', () => {
      const query1 = 'Analyze: Authentication, Flow!';
      const query2 = 'analyze authentication flow';

      const key1 = generator.generateKey(query1, 'TAN', 'analysis');
      const key2 = generator.generateKey(query2, 'TAN', 'analysis');

      // Should be same after normalization
      expect(key1).toBe(key2);
    });
  });

  describe('Performance', () => {
    it('should generate keys quickly', () => {
      const query = 'analyze authentication flow in application';
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        generator.generateKey(query, 'TAN', 'analysis');
      }

      const duration = Date.now() - start;

      // Should complete 1000 generations in <100ms
      expect(duration).toBeLessThan(100);
    });

    it('should normalize queries quickly', () => {
      const query = 'analyze the authentication flow in the application with proper security';
      const start = Date.now();

      for (let i = 0; i < 1000; i++) {
        generator.normalizeQuery(query);
      }

      const duration = Date.now() - start;

      // Should complete 1000 normalizations in <200ms
      expect(duration).toBeLessThan(200);
    });
  });
});
