/**
 * SelfImprovingAgent - Base class for learning-enabled Trinity agents
 *
 * Provides learning capabilities to TAN, ZEN, INO, JUNO agents.
 * Implements pattern extraction, strategy selection, and knowledge sharing.
 *
 * @module agents/SelfImprovingAgent
 */

import {
  InvestigationResult,
  LearnedPattern,
  StrategyPerformance,
  LearningMetrics,
  AgentType,
  InvestigationType,
} from '@shared/types';
import { LearningDataStore } from '../learning/LearningDataStore';
import { PerformanceTracker } from '../learning/PerformanceTracker';
import { StrategySelectionEngine, InvestigationContext } from '../learning/StrategySelectionEngine';
import { KnowledgeSharingBus, PatternBroadcast } from '../learning/KnowledgeSharingBus';

/**
 * Abstract base class for self-improving agents
 */
export abstract class SelfImprovingAgent {
  protected agentId: AgentType;
  protected learningData: LearningDataStore;
  protected performanceTracker: PerformanceTracker;
  protected strategyEngine: StrategySelectionEngine;
  protected knowledgeBus: KnowledgeSharingBus;

  constructor(
    agentId: AgentType,
    learningData: LearningDataStore,
    performanceTracker: PerformanceTracker,
    strategyEngine: StrategySelectionEngine,
    knowledgeBus: KnowledgeSharingBus
  ) {
    this.agentId = agentId;
    this.learningData = learningData;
    this.performanceTracker = performanceTracker;
    this.strategyEngine = strategyEngine;
    this.knowledgeBus = knowledgeBus;

    // Subscribe to knowledge sharing
    this.subscribeToKnowledgeSharing();
  }

  // ============================================================================
  // Core Learning Methods
  // ============================================================================

  /**
   * Learn from investigation outcome
   * @param result - Investigation result with patterns and metrics
   * @returns Promise resolving to learned pattern confidence scores
   * @throws {LearningError} If pattern validation fails
   */
  async learnFromInvestigation(result: InvestigationResult): Promise<Map<string, number>> {
    const confidenceScores = new Map<string, number>();

    try {
      // Extract patterns from investigation
      const patterns = await this.extractPatterns(result);

      // Update pattern knowledge
      for (const pattern of patterns) {
        await this.updatePatternKnowledge(pattern);
        confidenceScores.set(pattern.patternId, pattern.confidence);

        // Broadcast high-confidence patterns
        if (pattern.confidence >= this.knowledgeBus.getSharingThreshold()) {
          await this.knowledgeBus.broadcastPattern(pattern, this.agentId);
        }
      }

      // Learn error resolutions
      for (const error of result.errors) {
        if (typeof error !== 'string' && error.resolved && error.resolution) {
          await this.learnErrorResolution(error, error.resolution);
        }
      }

      return confidenceScores;
    } catch (error) {
      throw new LearningError(
        `Failed to learn from investigation ${result.id}: ${(error as Error).message}`
      );
    }
  }

  /**
   * Select best strategy for investigation context
   * @param context - Investigation context with type, scope, requirements
   * @returns Promise resolving to selected strategy
   * @throws {StrategySelectionError} If no applicable strategies found
   */
  async selectBestStrategy(context: InvestigationContext): Promise<StrategyPerformance> {
    return await this.strategyEngine.selectStrategy(this.agentId, context);
  }

  /**
   * Share high-confidence knowledge with target agent
   * @param targetAgent - Agent ID to share with (e.g., 'TAN', 'ZEN')
   * @returns Promise resolving when knowledge shared
   */
  async shareKnowledge(targetAgent: AgentType): Promise<void> {
    const learningInfo = await this.learningData.loadLearningData(this.agentId);

    // Share high-confidence strategies
    const highConfidenceStrategies = Array.from(learningInfo.strategies.values()).filter(
      strategy => strategy.confidence >= this.knowledgeBus.getSharingThreshold()
    );

    for (const strategy of highConfidenceStrategies) {
      await this.knowledgeBus.shareStrategy(strategy, this.agentId, [targetAgent]);
    }

    // Patterns are broadcast automatically in learnFromInvestigation
  }

  /**
   * Get current performance metrics for this agent
   * @returns LearningMetrics with success rates, improvements, trends
   */
  async getPerformanceMetrics(): Promise<LearningMetrics> {
    return await this.performanceTracker.getPerformanceTrends(this.agentId);
  }

  // ============================================================================
  // Pattern Management
  // ============================================================================

  /**
   * Extract patterns from investigation result
   * @param result - Investigation result
   * @returns Promise resolving to extracted patterns
   */
  protected async extractPatterns(result: InvestigationResult): Promise<LearnedPattern[]> {
    const patterns: LearnedPattern[] = [];

    // Use existing patterns from investigation result
    for (const pattern of result.patterns) {
      // Calculate Jaccard similarity with existing patterns
      const similarPatterns = await this.findSimilarPatterns(pattern);

      if (similarPatterns.length > 0) {
        // Merge with most similar pattern
        const mostSimilar = similarPatterns[0];
        const mergedPattern = this.mergePatterns(pattern, mostSimilar);
        patterns.push(mergedPattern);
      } else {
        // New pattern
        patterns.push({
          ...pattern,
          agentId: this.agentId,
          investigationIds: [result.id],
        });
      }
    }

    return patterns;
  }

  /**
   * Find similar patterns using Jaccard similarity
   * @param pattern - Pattern to compare
   * @returns Promise resolving to similar patterns (sorted by similarity)
   */
  private async findSimilarPatterns(pattern: LearnedPattern): Promise<LearnedPattern[]> {
    const learningInfo = await this.learningData.loadLearningData(this.agentId);
    const existingPatterns = Array.from(learningInfo.patterns.values());

    const similarities = existingPatterns.map(existing => ({
      pattern: existing,
      similarity: this.calculateJaccardSimilarity(pattern, existing),
    }));

    // Filter by 0.7 threshold and sort by similarity
    return similarities
      .filter(s => s.similarity >= 0.7)
      .sort((a, b) => b.similarity - a.similarity)
      .map(s => s.pattern);
  }

  /**
   * Calculate Jaccard similarity between two patterns
   * J(A,B) = |A ∩ B| / |A ∪ B|
   * Compares: tags, file paths, error types
   */
  private calculateJaccardSimilarity(
    patternA: LearnedPattern,
    patternB: LearnedPattern
  ): number {
    // Combine all comparable elements
    const elementsA = new Set([
      ...patternA.tags,
      ...patternA.filePaths,
      ...patternA.errorTypes,
    ]);

    const elementsB = new Set([
      ...patternB.tags,
      ...patternB.filePaths,
      ...patternB.errorTypes,
    ]);

    // Calculate intersection
    const intersection = new Set([...elementsA].filter(x => elementsB.has(x)));

    // Calculate union
    const union = new Set([...elementsA, ...elementsB]);

    if (union.size === 0) return 0;

    return intersection.size / union.size;
  }

  /**
   * Merge two similar patterns
   */
  private mergePatterns(newPattern: LearnedPattern, existingPattern: LearnedPattern): LearnedPattern {
    return {
      ...existingPattern,
      usageCount: existingPattern.usageCount + 1,
      successCount: existingPattern.successCount + (newPattern.usageCount > 0 ? 1 : 0),
      lastSeen: new Date(),
      investigationIds: [...existingPattern.investigationIds, ...newPattern.investigationIds],
      tags: Array.from(new Set([...existingPattern.tags, ...newPattern.tags])),
      filePaths: Array.from(new Set([...existingPattern.filePaths, ...newPattern.filePaths])),
      errorTypes: Array.from(new Set([...existingPattern.errorTypes, ...newPattern.errorTypes])),
      // Recalculate confidence
      confidence: this.calculatePatternConfidence(
        existingPattern.successCount + 1,
        existingPattern.usageCount + 1
      ),
    };
  }

  /**
   * Calculate pattern confidence
   * Formula: confidence = (successCount / totalUsageCount) * sqrt(totalUsageCount) / 10
   */
  private calculatePatternConfidence(successCount: number, totalUsageCount: number): number {
    if (totalUsageCount === 0) return 0;

    const successRate = successCount / totalUsageCount;
    const confidence = successRate * Math.sqrt(totalUsageCount) / 10;

    return Math.min(1, Math.max(0, confidence));
  }

  /**
   * Update pattern knowledge
   * @param pattern - Pattern to update
   * @returns Promise resolving when update complete
   */
  protected async updatePatternKnowledge(pattern: LearnedPattern): Promise<void> {
    const learningInfo = await this.learningData.loadLearningData(this.agentId);

    learningInfo.patterns.set(pattern.patternId, pattern);

    await this.learningData.saveLearningData(this.agentId, learningInfo);
  }

  /**
   * Get relevant patterns for investigation context
   * @param context - Investigation context
   * @returns Promise resolving to relevant patterns
   */
  protected async getRelevantPatterns(context: InvestigationContext): Promise<LearnedPattern[]> {
    const learningInfo = await this.learningData.loadLearningData(this.agentId);
    const patterns = Array.from(learningInfo.patterns.values());

    // Filter by investigation type and confidence
    return patterns.filter(
      pattern =>
        pattern.confidence >= 0.7 &&
        pattern.tags.some(tag => tag.toLowerCase().includes(context.type.toLowerCase()))
    );
  }

  // ============================================================================
  // Error Learning
  // ============================================================================

  /**
   * Learn error resolution
   * @param error - Error that occurred
   * @param resolution - How it was resolved
   * @returns Promise resolving when learned
   */
  protected async learnErrorResolution(error: any, resolution: string): Promise<void> {
    const learningInfo = await this.learningData.loadLearningData(this.agentId);

    const errorId = `${error.type}-${error.message}`;
    let errorResolution = learningInfo.errors.get(errorId);

    if (!errorResolution) {
      errorResolution = {
        errorId,
        errorType: error.type,
        errorMessage: error.message,
        resolution,
        successRate: 1.0,
        confidence: 0.1,
        occurrenceCount: 1,
        resolvedCount: 1,
        firstSeen: new Date(),
        lastSeen: new Date(),
        agentId: this.agentId,
        investigationIds: [error.context?.investigationId || 'unknown'],
      };
    } else {
      errorResolution.occurrenceCount++;
      errorResolution.resolvedCount++;
      errorResolution.successRate = errorResolution.resolvedCount / errorResolution.occurrenceCount;
      errorResolution.confidence = this.calculatePatternConfidence(
        errorResolution.resolvedCount,
        errorResolution.occurrenceCount
      );
      errorResolution.lastSeen = new Date();
    }

    learningInfo.errors.set(errorId, errorResolution);
    await this.learningData.saveLearningData(this.agentId, learningInfo);
  }

  /**
   * Get error resolution if known
   * @param error - Error to resolve
   * @returns Promise resolving to error resolution or null
   */
  protected async getErrorResolution(error: any): Promise<string | null> {
    const learningInfo = await this.learningData.loadLearningData(this.agentId);

    const errorId = `${error.type}-${error.message}`;
    const errorResolution = learningInfo.errors.get(errorId);

    if (errorResolution && errorResolution.confidence >= 0.7) {
      return errorResolution.resolution;
    }

    return null;
  }

  // ============================================================================
  // Knowledge Sharing
  // ============================================================================

  /**
   * Subscribe to knowledge sharing from other agents
   */
  private subscribeToKnowledgeSharing(): void {
    this.knowledgeBus.subscribeToPatterns(
      this.agentId,
      async (broadcast: PatternBroadcast) => {
        // Validate pattern for this agent
        if (this.knowledgeBus.validatePattern(broadcast.pattern, this.agentId)) {
          await this.knowledgeBus.acceptSharedPattern(broadcast.pattern, this.agentId);
        }
      }
    );
  }

  // ============================================================================
  // Abstract Methods (to be implemented by specific agents)
  // ============================================================================

  /**
   * Execute investigation (agent-specific implementation)
   * @param context - Investigation context
   * @returns Promise resolving to investigation result
   */
  abstract executeInvestigation(context: InvestigationContext): Promise<InvestigationResult>;
}

/**
 * LearningError - Thrown when learning operations fail
 */
export class LearningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LearningError';
  }
}
