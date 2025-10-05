/**
 * LearningDataStore - Persist and retrieve learning data
 *
 * Stores patterns, strategies, errors, and optimizations for Trinity agents.
 * Uses JSON file persistence in agent-specific directories.
 *
 * @module learning/LearningDataStore
 */

import { promises as fs } from 'fs';
import path from 'path';
import {
  LearnedPattern,
  StrategyPerformance,
  ErrorResolution,
  AgentType,
} from '@shared/types';

/**
 * Learning data structure for an agent
 */
export interface LearningData {
  patterns: Map<string, LearnedPattern>;
  strategies: Map<string, StrategyPerformance>;
  errors: Map<string, ErrorResolution>;
  metadata: LearningMetadata;
  totalInvestigations?: number;
  successfulInvestigations?: number;
  failedInvestigations?: number;
  agent?: string;
  investigations?: any[];
}

export interface LearningMetadata {
  version: string; // Learning data schema version
  totalInvestigations: number;
  totalPatterns: number;
  totalStrategies: number;
  lastUpdated: Date;
  agentId: AgentType;
}

/**
 * LearningDataStore - Manages persistence of learning data
 */
export class LearningDataStore {
  private baseDir: string;

  constructor(baseDir: string = 'trinity/learning') {
    this.baseDir = baseDir;
  }

  /**
   * Load learning data for an agent
   * @param agentId - Agent identifier (TAN, ZEN, INO, JUNO, AJ)
   * @returns Promise resolving to learning data
   */
  async loadLearningData(agentId: AgentType): Promise<LearningData> {
    const agentDir = path.join(this.baseDir, agentId);

    try {
      // Ensure directory exists
      await fs.mkdir(agentDir, { recursive: true });

      // Load each data type
      const patterns = await this.loadPatterns(agentId);
      const strategies = await this.loadStrategies(agentId);
      const errors = await this.loadErrors(agentId);
      const metadata = await this.loadMetadata(agentId);

      return {
        patterns,
        strategies,
        errors,
        metadata,
      };
    } catch (error) {
      // If no existing data, return empty structure
      return this.createEmptyLearningData(agentId);
    }
  }

  /**
   * Save learning data for an agent
   * @param agentId - Agent identifier
   * @param data - Learning data to save
   * @returns Promise resolving when save complete
   */
  async saveLearningData(agentId: AgentType, data: LearningData): Promise<void> {
    const agentDir = path.join(this.baseDir, agentId);

    // Ensure directory exists
    await fs.mkdir(agentDir, { recursive: true });

    // Update metadata
    data.metadata.lastUpdated = new Date();
    data.metadata.totalPatterns = data.patterns.size;
    data.metadata.totalStrategies = data.strategies.size;

    // Save each data type atomically
    await Promise.all([
      this.savePatterns(agentId, data.patterns),
      this.saveStrategies(agentId, data.strategies),
      this.saveErrors(agentId, data.errors),
      this.saveMetadata(agentId, data.metadata),
    ]);
  }

  /**
   * Export learning data to a file
   * @param exportPath - Path to export file
   * @param agentId - Optional agent ID (exports all if not specified)
   * @returns Promise resolving when export complete
   */
  async exportLearningData(exportPath: string, agentId?: AgentType): Promise<void> {
    let exportData: Record<string, LearningData>;

    if (agentId) {
      const data = await this.loadLearningData(agentId);
      exportData = { [agentId]: data };
    } else {
      // Export all agents
      const agents: AgentType[] = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];
      exportData = {};

      for (const agent of agents) {
        try {
          exportData[agent] = await this.loadLearningData(agent);
        } catch (error) {
          // Skip agents with no data
          continue;
        }
      }
    }

    // Convert Maps to objects for JSON serialization
    const serializable = this.serializeForExport(exportData);

    // Write to file
    await fs.writeFile(exportPath, JSON.stringify(serializable, null, 2), 'utf8');
  }

  /**
   * Import learning data from a file
   * @param importPath - Path to import file
   * @returns Promise resolving when import complete
   */
  async importLearningData(importPath: string): Promise<void> {
    const content = await fs.readFile(importPath, 'utf8');
    const imported = JSON.parse(content);

    // Deserialize and save for each agent
    for (const [agentId, data] of Object.entries(imported)) {
      const learningData = this.deserializeFromImport(data as any);
      await this.saveLearningData(agentId as AgentType, learningData);
    }
  }

  /**
   * Clear learning data for an agent
   * @param agentId - Agent identifier
   * @param confirmationToken - Safety confirmation (must be 'CONFIRM_CLEAR')
   * @returns Promise resolving when clear complete
   */
  async clearLearningData(agentId: AgentType, confirmationToken: string): Promise<void> {
    if (confirmationToken !== 'CONFIRM_CLEAR') {
      throw new Error('Invalid confirmation token. Learning data NOT cleared.');
    }

    const agentDir = path.join(this.baseDir, agentId);

    // Delete all data files
    const files = ['patterns.json', 'strategies.json', 'errors.json', 'metadata.json'];

    await Promise.all(
      files.map((file) =>
        fs.unlink(path.join(agentDir, file)).catch(() => {
          /* Ignore errors if file doesn't exist */
        })
      )
    );
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async loadPatterns(agentId: AgentType): Promise<Map<string, LearnedPattern>> {
    const filePath = path.join(this.baseDir, agentId, 'patterns.json');
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    return new Map(Object.entries(data));
  }

  private async loadStrategies(agentId: AgentType): Promise<Map<string, StrategyPerformance>> {
    const filePath = path.join(this.baseDir, agentId, 'strategies.json');
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    return new Map(Object.entries(data));
  }

  private async loadErrors(agentId: AgentType): Promise<Map<string, ErrorResolution>> {
    const filePath = path.join(this.baseDir, agentId, 'errors.json');
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);

    return new Map(Object.entries(data));
  }

  private async loadMetadata(agentId: AgentType): Promise<LearningMetadata> {
    const filePath = path.join(this.baseDir, agentId, 'metadata.json');
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  private async savePatterns(agentId: AgentType, patterns: Map<string, LearnedPattern>): Promise<void> {
    const filePath = path.join(this.baseDir, agentId, 'patterns.json');
    const data = Object.fromEntries(patterns);
    await this.atomicWrite(filePath, data);
  }

  private async saveStrategies(agentId: AgentType, strategies: Map<string, StrategyPerformance>): Promise<void> {
    const filePath = path.join(this.baseDir, agentId, 'strategies.json');
    const data = Object.fromEntries(strategies);
    await this.atomicWrite(filePath, data);
  }

  private async saveErrors(agentId: AgentType, errors: Map<string, ErrorResolution>): Promise<void> {
    const filePath = path.join(this.baseDir, agentId, 'errors.json');
    const data = Object.fromEntries(errors);
    await this.atomicWrite(filePath, data);
  }

  private async saveMetadata(agentId: AgentType, metadata: LearningMetadata): Promise<void> {
    const filePath = path.join(this.baseDir, agentId, 'metadata.json');
    await this.atomicWrite(filePath, metadata);
  }

  /**
   * Atomic write operation - prevents partial writes
   * Writes to temp file, then renames (OS-level atomic operation)
   */
  private async atomicWrite(filePath: string, data: any): Promise<void> {
    const tempPath = `${filePath}.tmp`;

    try {
      // Write to temp file
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');

      // Atomic rename
      await fs.rename(tempPath, filePath);
    } catch (error) {
      // Cleanup temp file on failure
      await fs.unlink(tempPath).catch(() => {});
      throw new Error(`Atomic write failed for ${filePath}: ${(error as Error).message}`);
    }
  }

  private createEmptyLearningData(agentId: AgentType): LearningData {
    return {
      patterns: new Map(),
      strategies: new Map(),
      errors: new Map(),
      metadata: {
        version: '1.0.0',
        totalInvestigations: 0,
        totalPatterns: 0,
        totalStrategies: 0,
        lastUpdated: new Date(),
        agentId,
      },
    };
  }

  private serializeForExport(data: Record<string, LearningData>): any {
    const result: any = {};

    for (const [agentId, learningData] of Object.entries(data)) {
      result[agentId] = {
        patterns: Object.fromEntries(learningData.patterns),
        strategies: Object.fromEntries(learningData.strategies),
        errors: Object.fromEntries(learningData.errors),
        metadata: learningData.metadata,
      };
    }

    return result;
  }

  private deserializeFromImport(data: any): LearningData {
    return {
      patterns: new Map(Object.entries(data.patterns || {})),
      strategies: new Map(Object.entries(data.strategies || {})),
      errors: new Map(Object.entries(data.errors || {})),
      metadata: data.metadata,
    };
  }
}
