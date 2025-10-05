/**
 * Registry Query API
 *
 * Advanced search and filtering for investigation registry.
 */

import Database from 'better-sqlite3';
import { InvestigationRegistry } from './InvestigationRegistry';
import {
  InvestigationRecord,
  RegistryQuery,
  RegistryQueryResult,
  SimilarityResult,
} from './types';

export class RegistryQueryAPI {
  constructor(private registry: InvestigationRegistry) {}

  /**
   * Search investigations with advanced filtering
   */
  async search(query: RegistryQuery): Promise<RegistryQueryResult> {
    const {
      type,
      codebase,
      dateRange,
      tags,
      minQualityScore,
      maxQualityScore,
      status,
      searchText,
      agents,
      limit = 50,
      offset = 0,
      sortBy = 'startTime',
      sortOrder = 'desc',
    } = query;

    // Build SQL query
    const conditions: string[] = [];
    const params: any[] = [];

    // Type filter
    if (type) {
      if (Array.isArray(type)) {
        conditions.push(`type IN (${type.map(() => '?').join(',')})`);
        params.push(...type);
      } else {
        conditions.push('type = ?');
        params.push(type);
      }
    }

    // Codebase filter
    if (codebase) {
      conditions.push('codebase = ?');
      params.push(codebase);
    }

    // Date range filter
    if (dateRange) {
      conditions.push('start_time >= ?');
      params.push(dateRange.start.getTime());
      conditions.push('start_time <= ?');
      params.push(dateRange.end.getTime());
    }

    // Quality score filter
    if (minQualityScore !== undefined) {
      conditions.push('quality_score >= ?');
      params.push(minQualityScore);
    }

    if (maxQualityScore !== undefined) {
      conditions.push('quality_score <= ?');
      params.push(maxQualityScore);
    }

    // Status filter
    if (status) {
      if (Array.isArray(status)) {
        conditions.push(`status IN (${status.map(() => '?').join(',')})`);
        params.push(...status);
      } else {
        conditions.push('status = ?');
        params.push(status);
      }
    }

    // Tags filter
    if (tags && tags.length > 0) {
      conditions.push(`
        id IN (
          SELECT investigation_id
          FROM investigation_tags
          WHERE tag IN (${tags.map(() => '?').join(',')})
          GROUP BY investigation_id
          HAVING COUNT(DISTINCT tag) = ?
        )
      `);
      params.push(...tags, tags.length);
    }

    // Agents filter
    if (agents && agents.length > 0) {
      conditions.push(`
        id IN (
          SELECT investigation_id
          FROM investigation_agents
          WHERE agent IN (${agents.map(() => '?').join(',')})
        )
      `);
      params.push(...agents);
    }

    // Full-text search
    if (searchText) {
      conditions.push(`
        id IN (
          SELECT id
          FROM investigations_fts
          WHERE investigations_fts MATCH ?
        )
      `);
      params.push(searchText);
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Map sortBy to column name
    const sortColumn = this.mapSortColumn(sortBy);

    // Count total matches
    const countSql = `SELECT COUNT(*) as count FROM investigations ${whereClause}`;
    const countStmt = this.getDb().prepare(countSql);
    const countResult = countStmt.get(...params) as any;
    const total = countResult.count;

    // Get results
    const sql = `
      SELECT * FROM investigations
      ${whereClause}
      ORDER BY ${sortColumn} ${sortOrder.toUpperCase()}
      LIMIT ? OFFSET ?
    `;

    const stmt = this.getDb().prepare(sql);
    const rows = stmt.all(...params, limit, offset) as any[];

    const records = rows.map((row) => this.rowToRecord(row));

    return {
      records,
      total,
      hasMore: offset + records.length < total,
    };
  }

  /**
   * Find similar investigations based on type, codebase, and tags
   */
  async findSimilar(
    investigationId: string,
    limit: number = 5
  ): Promise<SimilarityResult[]> {
    const target = this.registry.getById(investigationId);
    if (!target) {
      throw new Error(`Investigation ${investigationId} not found`);
    }

    const all = this.registry.getAll();
    const similarities: SimilarityResult[] = [];

    for (const record of all) {
      if (record.id === investigationId) continue;

      const { similarity, reasons } = this.calculateSimilarity(target, record);

      if (similarity > 0) {
        similarities.push({
          record,
          similarity,
          reasons,
        });
      }
    }

    // Sort by similarity descending
    similarities.sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, limit);
  }

  /**
   * Find recommendations for a new investigation
   */
  async recommend(
    type: string,
    codebase: string,
    tags: string[] = [],
    limit: number = 5
  ): Promise<SimilarityResult[]> {
    const target: Partial<InvestigationRecord> = {
      type,
      codebase,
      tags,
    };

    const all = this.registry.getAll();
    const similarities: SimilarityResult[] = [];

    for (const record of all) {
      const { similarity, reasons } = this.calculateSimilarity(
        target as InvestigationRecord,
        record
      );

      if (similarity > 0) {
        similarities.push({
          record,
          similarity,
          reasons,
        });
      }
    }

    // Sort by similarity descending
    similarities.sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, limit);
  }

  /**
   * Calculate similarity between two investigations
   */
  private calculateSimilarity(
    target: InvestigationRecord,
    candidate: InvestigationRecord
  ): { similarity: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // Exact type match (40 points)
    if (target.type === candidate.type) {
      score += 40;
      reasons.push(`Same type: ${target.type}`);
    }

    // Exact codebase match (30 points)
    if (target.codebase === candidate.codebase) {
      score += 30;
      reasons.push(`Same codebase: ${target.codebase}`);
    }

    // Tag overlap (30 points max, proportional to overlap)
    const targetTags = new Set(target.tags || []);
    const candidateTags = new Set(candidate.tags || []);
    const commonTags = [...targetTags].filter((tag) => candidateTags.has(tag));

    if (commonTags.length > 0) {
      const tagScore = (commonTags.length / Math.max(targetTags.size, candidateTags.size)) * 30;
      score += tagScore;
      reasons.push(`Common tags: ${commonTags.join(', ')}`);
    }

    return {
      similarity: Math.round(score),
      reasons,
    };
  }

  /**
   * Get database instance
   */
  private getDb(): Database.Database {
    return (this.registry as any).db;
  }

  /**
   * Map sort field to database column
   */
  private mapSortColumn(sortBy: string): string {
    const mapping: Record<string, string> = {
      startTime: 'start_time',
      duration: 'duration',
      qualityScore: 'quality_score',
      tokensUsed: 'tokens_used',
    };

    return mapping[sortBy] || 'start_time';
  }

  /**
   * Convert database row to InvestigationRecord
   */
  private rowToRecord(row: any): InvestigationRecord {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      codebase: row.codebase,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : undefined,
      duration: row.duration || undefined,
      status: row.status,
      agents: JSON.parse(row.agents),
      tokensUsed: row.tokens_used,
      qualityScore: row.quality_score || undefined,
      tags: JSON.parse(row.tags),
      metadata: JSON.parse(row.metadata),
      findings: row.findings || 0,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
