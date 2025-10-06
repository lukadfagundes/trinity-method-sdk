/**
 * Investigation Registry
 *
 * SQLite-based registry for tracking and querying investigation history.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

import Database from 'better-sqlite3';

import {
  InvestigationRecord,
  InvestigationStatus,
  RegistryStatistics,
} from './types';

export class InvestigationRegistry {
  private db: Database.Database;

  constructor(dbPath: string = 'trinity/registry/investigations.db') {
    this.db = new Database(dbPath);
    this.initializeSchema();
  }

  /**
   * Initialize database schema
   */
  private initializeSchema(): void {
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Execute schema SQL
    this.db.exec(schema);

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
  }

  /**
   * Add a new investigation to the registry
   */
  add(record: Omit<InvestigationRecord, 'createdAt' | 'updatedAt'>): InvestigationRecord {
    const now = new Date();
    const fullRecord: InvestigationRecord = {
      ...record,
      createdAt: now,
      updatedAt: now,
    };

    const stmt = this.db.prepare(`
      INSERT INTO investigations (
        id, name, type, codebase, start_time, end_time, duration,
        status, agents, tokens_used, quality_score, tags, metadata,
        findings, created_at, updated_at
      ) VALUES (
        @id, @name, @type, @codebase, @startTime, @endTime, @duration,
        @status, @agents, @tokensUsed, @qualityScore, @tags, @metadata,
        @findings, @createdAt, @updatedAt
      )
    `);

    stmt.run({
      id: fullRecord.id,
      name: fullRecord.name,
      type: fullRecord.type,
      codebase: fullRecord.codebase,
      startTime: fullRecord.startTime.getTime(),
      endTime: fullRecord.endTime?.getTime() || null,
      duration: fullRecord.duration || null,
      status: fullRecord.status,
      agents: JSON.stringify(fullRecord.agents),
      tokensUsed: fullRecord.tokensUsed,
      qualityScore: fullRecord.qualityScore || null,
      tags: JSON.stringify(fullRecord.tags),
      metadata: JSON.stringify(fullRecord.metadata),
      findings: fullRecord.findings || 0,
      createdAt: fullRecord.createdAt.getTime(),
      updatedAt: fullRecord.updatedAt.getTime(),
    });

    // Insert tags
    this.updateTags(fullRecord.id, fullRecord.tags);

    // Insert agents
    this.updateAgents(fullRecord.id, fullRecord.agents);

    return fullRecord;
  }

  /**
   * Update an existing investigation
   */
  update(id: string, updates: Partial<InvestigationRecord>): InvestigationRecord {
    const existing = this.getById(id);
    if (!existing) {
      throw new Error(`Investigation ${id} not found`);
    }

    const updated: InvestigationRecord = {
      ...existing,
      ...updates,
      id, // Prevent ID change
      updatedAt: new Date(),
    };

    const stmt = this.db.prepare(`
      UPDATE investigations
      SET name = @name,
          type = @type,
          codebase = @codebase,
          start_time = @startTime,
          end_time = @endTime,
          duration = @duration,
          status = @status,
          agents = @agents,
          tokens_used = @tokensUsed,
          quality_score = @qualityScore,
          tags = @tags,
          metadata = @metadata,
          findings = @findings,
          updated_at = @updatedAt
      WHERE id = @id
    `);

    stmt.run({
      id: updated.id,
      name: updated.name,
      type: updated.type,
      codebase: updated.codebase,
      startTime: updated.startTime.getTime(),
      endTime: updated.endTime?.getTime() || null,
      duration: updated.duration || null,
      status: updated.status,
      agents: JSON.stringify(updated.agents),
      tokensUsed: updated.tokensUsed,
      qualityScore: updated.qualityScore || null,
      tags: JSON.stringify(updated.tags),
      metadata: JSON.stringify(updated.metadata),
      findings: updated.findings || 0,
      updatedAt: updated.updatedAt.getTime(),
    });

    // Update tags and agents
    this.updateTags(id, updated.tags);
    this.updateAgents(id, updated.agents);

    return updated;
  }

  /**
   * Get investigation by ID
   */
  getById(id: string): InvestigationRecord | null {
    const stmt = this.db.prepare('SELECT * FROM investigations WHERE id = ?');
    const row = stmt.get(id) as any;

    return row ? this.rowToRecord(row) : null;
  }

  /**
   * Delete an investigation
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM investigations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Get all investigations
   */
  getAll(limit?: number, offset?: number): InvestigationRecord[] {
    let sql = 'SELECT * FROM investigations ORDER BY start_time DESC';

    if (limit) {
      sql += ` LIMIT ${limit}`;
      if (offset) {
        sql += ` OFFSET ${offset}`;
      }
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all() as any[];

    return rows.map((row) => this.rowToRecord(row));
  }

  /**
   * Get investigations by type
   */
  getByType(type: string, limit?: number): InvestigationRecord[] {
    let sql = 'SELECT * FROM investigations WHERE type = ? ORDER BY start_time DESC';

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(type) as any[];

    return rows.map((row) => this.rowToRecord(row));
  }

  /**
   * Get investigations by status
   */
  getByStatus(status: InvestigationStatus, limit?: number): InvestigationRecord[] {
    let sql = 'SELECT * FROM investigations WHERE status = ? ORDER BY start_time DESC';

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(status) as any[];

    return rows.map((row) => this.rowToRecord(row));
  }

  /**
   * Get investigations by tag
   */
  getByTag(tag: string, limit?: number): InvestigationRecord[] {
    let sql = `
      SELECT i.* FROM investigations i
      INNER JOIN investigation_tags it ON i.id = it.investigation_id
      WHERE it.tag = ?
      ORDER BY i.start_time DESC
    `;

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(tag) as any[];

    return rows.map((row) => this.rowToRecord(row));
  }

  /**
   * Get investigations by agent
   */
  getByAgent(agent: string, limit?: number): InvestigationRecord[] {
    let sql = `
      SELECT i.* FROM investigations i
      INNER JOIN investigation_agents ia ON i.id = ia.investigation_id
      WHERE ia.agent = ?
      ORDER BY i.start_time DESC
    `;

    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(agent) as any[];

    return rows.map((row) => this.rowToRecord(row));
  }

  /**
   * Get registry statistics
   */
  getStatistics(): RegistryStatistics {
    const total = this.db.prepare('SELECT COUNT(*) as count FROM investigations').get() as any;

    const byType = this.db.prepare(`
      SELECT type, COUNT(*) as count
      FROM investigations
      GROUP BY type
    `).all() as any[];

    const byStatus = this.db.prepare(`
      SELECT status, COUNT(*) as count
      FROM investigations
      GROUP BY status
    `).all() as any[];

    const avgStats = this.db.prepare(`
      SELECT
        AVG(duration) as avgDuration,
        AVG(tokens_used) as avgTokensUsed,
        AVG(quality_score) as avgQualityScore,
        MIN(start_time) as earliest,
        MAX(start_time) as latest
      FROM investigations
    `).get() as any;

    return {
      totalInvestigations: total.count,
      byType: Object.fromEntries(byType.map((r) => [r.type, r.count])),
      byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.count])),
      avgDuration: avgStats.avgDuration || 0,
      avgTokensUsed: avgStats.avgTokensUsed || 0,
      avgQualityScore: avgStats.avgQualityScore || 0,
      dateRange: {
        earliest: avgStats.earliest ? new Date(avgStats.earliest) : new Date(),
        latest: avgStats.latest ? new Date(avgStats.latest) : new Date(),
      },
    };
  }

  /**
   * Count total investigations
   */
  count(): number {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM investigations').get() as any;
    return result.count;
  }

  /**
   * Clear all investigations (for testing)
   */
  clear(): void {
    this.db.exec('DELETE FROM investigations');
    this.db.exec('DELETE FROM investigation_tags');
    this.db.exec('DELETE FROM investigation_agents');
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }

  /**
   * Update tags for an investigation
   */
  private updateTags(investigationId: string, tags: string[]): void {
    // Delete existing tags
    this.db.prepare('DELETE FROM investigation_tags WHERE investigation_id = ?').run(investigationId);

    // Insert new tags
    const stmt = this.db.prepare('INSERT INTO investigation_tags (investigation_id, tag) VALUES (?, ?)');
    for (const tag of tags) {
      stmt.run(investigationId, tag);
    }
  }

  /**
   * Update agents for an investigation
   */
  private updateAgents(investigationId: string, agents: string[]): void {
    // Delete existing agents
    this.db.prepare('DELETE FROM investigation_agents WHERE investigation_id = ?').run(investigationId);

    // Insert new agents
    const stmt = this.db.prepare('INSERT INTO investigation_agents (investigation_id, agent) VALUES (?, ?)');
    for (const agent of agents) {
      stmt.run(investigationId, agent);
    }
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
