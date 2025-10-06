/**
 * PerformanceTracker - Track strategy effectiveness and investigation metrics
 *
 * Implements high-resolution timing, token tracking, and learning metrics
 * per Quality Measurement Standard specifications.
 *
 * @module learning/PerformanceTracker
 */

import {
  InvestigationResult,
  StrategyPerformance,
  LearningMetrics,
  AgentType,
} from '../shared/types';

import { LearningDataStore } from './LearningDataStore';

/**
 * Strategy being tracked during investigation
 */
interface ActiveStrategy {
  strategyId: string;
  startTime: bigint; // High-resolution timer
  startTokens: number;
}

/**
 * Performance tracking data for an investigation
 */
export interface InvestigationTracking {
  investigationId: string;
  agentId: AgentType;
  startTime: bigint;
  endTime?: bigint;
  startTokens: number;
  endTokens?: number;
  activeStrategy?: ActiveStrategy;
  errors: number;
}

/**
 * PerformanceTracker - Tracks and analyzes investigation performance
 */
export class PerformanceTracker {
  private learningDataStore: LearningDataStore;
  private activeInvestigations: Map<string, InvestigationTracking>;
  private tokenCounter: TokenCounter;

  constructor(learningDataStore: LearningDataStore) {
    this.learningDataStore = learningDataStore;
    this.activeInvestigations = new Map();
    this.tokenCounter = new TokenCounter();
  }

  /**
   * Track start of investigation
   * @param investigationId - Investigation identifier
   * @param agentId - Agent conducting investigation
   */
  trackInvestigationStart(investigationId: string, agentId: AgentType): void {
    const tracking: InvestigationTracking = {
      investigationId,
      agentId,
      startTime: process.hrtime.bigint(), // High-resolution timer
      startTokens: this.tokenCounter.getCurrentCount(),
      errors: 0,
    };

    this.activeInvestigations.set(investigationId, tracking);
  }

  /**
   * Track start of strategy execution
   * @param investigationId - Investigation identifier
   * @param strategyId - Strategy being executed
   */
  trackStrategyStart(investigationId: string, strategyId: string): void {
    const tracking = this.activeInvestigations.get(investigationId);
    if (!tracking) {
      throw new Error(`Investigation ${investigationId} not being tracked`);
    }

    tracking.activeStrategy = {
      strategyId,
      startTime: process.hrtime.bigint(),
      startTokens: this.tokenCounter.getCurrentCount(),
    };
  }

  /**
   * Track completion of investigation
   * @param investigationId - Investigation identifier
   * @param result - Investigation result
   * @returns Promise resolving when tracking complete
   */
  async trackInvestigationComplete(
    investigationId: string,
    result: InvestigationResult
  ): Promise<void> {
    const tracking = this.activeInvestigations.get(investigationId);
    if (!tracking) {
      throw new Error(`Investigation ${investigationId} not being tracked`);
    }

    // Record end time and tokens
    tracking.endTime = process.hrtime.bigint();
    tracking.endTokens = this.tokenCounter.getCurrentCount();

    // Calculate duration in milliseconds
    const durationNs = tracking.endTime - tracking.startTime;
    const duration = Number(durationNs) / 1_000_000; // Convert nanoseconds to milliseconds

    // Calculate tokens used
    const tokensUsed = tracking.endTokens - tracking.startTokens;

    // Track errors
    tracking.errors = result.errors.length;

    // Update strategy performance if strategy was used
    if (tracking.activeStrategy) {
      await this.updateStrategyPerformance(
        tracking.activeStrategy.strategyId,
        tracking.agentId,
        result.status === 'completed',
        duration,
        tokensUsed,
        investigationId
      );
    }

    // Update agent metrics
    await this.updateAgentMetrics(
      tracking.agentId,
      duration,
      tokensUsed,
      result.errors.length,
      result.status === 'completed'
    );

    // Cleanup
    this.activeInvestigations.delete(investigationId);
  }

  /**
   * Track investigation failure
   * @param investigationId - Investigation identifier
   * @param error - Error that occurred
   */
  trackInvestigationFailure(investigationId: string, _error: Error): void {
    const tracking = this.activeInvestigations.get(investigationId);
    if (tracking) {
      tracking.errors++;
    }
  }

  /**
   * Calculate strategy metrics
   * @param strategyId - Strategy identifier
   * @param agentId - Agent using strategy
   * @returns Promise resolving to strategy metrics
   */
  async calculateStrategyMetrics(
    strategyId: string,
    agentId: AgentType
  ): Promise<StrategyPerformance | null> {
    const learningData = await this.learningDataStore.loadLearningData(agentId);
    return learningData.strategies.get(strategyId) || null;
  }

  /**
   * Get performance trends for an agent
   * @param agentId - Agent identifier
   * @param timeRange - Time range (milliseconds back from now)
   * @returns Promise resolving to learning metrics
   */
  async getPerformanceTrends(agentId: AgentType, _timeRange?: number): Promise<LearningMetrics> {
    const learningData = await this.learningDataStore.loadLearningData(agentId);

    // Calculate overall metrics
    const totalInvestigations = learningData.metadata.totalInvestigations ?? 0;
    const strategies = Array.from(learningData.strategies.values());

    // Calculate averages
    let totalDuration = 0;
    let totalTokens = 0;
    const _totalErrors = 0;
    let successfulStrategies = 0;

    for (const strategy of strategies) {
      totalDuration += strategy.averageDuration * strategy.usageCount;
      totalTokens += strategy.tokenEfficiency * strategy.usageCount;
      if (strategy.successRate > 0.5) {
        successfulStrategies++;
      }
    }

    const averageCompletionTime = strategies.length > 0 ? totalDuration / totalInvestigations : 0;
    const averageTokenUsage = strategies.length > 0 ? totalTokens / totalInvestigations : 0;
    const strategySuccessRate = strategies.length > 0 ? successfulStrategies / strategies.length : 0;

    // Calculate pattern accuracy
    const patterns = Array.from(learningData.patterns.values());
    const patternAccuracy = patterns.length > 0
      ? patterns.reduce((sum, p) => sum + p.accuracy, 0) / patterns.length
      : 0;

    // Calculate error rate
    const errors = Array.from(learningData.errors.values());
    const errorRate = errors.length > 0
      ? errors.reduce((sum, e) => sum + (1 - e.successRate), 0) / errors.length
      : 0;

    return {
      agentId,
      totalInvestigations,
      averageCompletionTime,
      averageTokenUsage,
      errorRate,
      strategySuccessRate,
      patternAccuracy,
      improvementTrend: {
        speedImprovement: 0, // TODO: Calculate from baseline
        tokenImprovement: 0,
        accuracyImprovement: 0,
      },
    };
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Update strategy performance metrics
   */
  private async updateStrategyPerformance(
    strategyId: string,
    agentId: AgentType,
    success: boolean,
    duration: number,
    tokens: number,
    investigationId: string
  ): Promise<void> {
    const learningData = await this.learningDataStore.loadLearningData(agentId);

    let strategy = learningData.strategies.get(strategyId);

    if (!strategy) {
      // Create new strategy entry
      strategy = {
        strategyId,
        strategyName: strategyId,
        description: '',
        applicableContexts: [],
        successRate: success ? 1.0 : 0.0,
        averageDuration: duration,
        tokenEfficiency: tokens,
        usageCount: 1,
        successCount: success ? 1 : 0,
        failureCount: success ? 0 : 1,
        lastUsed: new Date(),
        confidence: 0.1, // Low confidence with only 1 usage
        agentId,
        successfulInvestigations: success ? [investigationId] : [],
        failedInvestigations: success ? [] : [investigationId],
      };
    } else {
      // Update existing strategy
      strategy.usageCount++;
      if (success) {
        strategy.successCount++;
        if (Array.isArray(strategy.successfulInvestigations)) {
          strategy.successfulInvestigations.push(investigationId);
        }
      } else {
        strategy.failureCount++;
        if (Array.isArray(strategy.failedInvestigations)) {
          strategy.failedInvestigations.push(investigationId);
        }
      }

      // Update success rate
      strategy.successRate = strategy.successCount / strategy.usageCount;

      // Update average duration (rolling average)
      strategy.averageDuration =
        (strategy.averageDuration * (strategy.usageCount - 1) + duration) / strategy.usageCount;

      // Update token efficiency (rolling average)
      strategy.tokenEfficiency =
        (strategy.tokenEfficiency * (strategy.usageCount - 1) + tokens) / strategy.usageCount;

      // Update confidence score (per specification)
      strategy.confidence = this.calculateConfidence(strategy.successCount, strategy.usageCount);

      strategy.lastUsed = new Date();
    }

    learningData.strategies.set(strategyId, strategy);
    await this.learningDataStore.saveLearningData(agentId, learningData);
  }

  /**
   * Update agent-level metrics
   */
  private async updateAgentMetrics(
    agentId: AgentType,
    _duration: number,
    _tokens: number,
    _errors: number,
    success: boolean
  ): Promise<void> {
    const learningData = await this.learningDataStore.loadLearningData(agentId);

    learningData.metadata.totalInvestigations = (learningData.metadata.totalInvestigations ?? 0) + 1;
    learningData.totalInvestigations = learningData.metadata.totalInvestigations;

    // Track successful and failed investigations
    learningData.successfulInvestigations = (learningData.successfulInvestigations ?? 0) + (success ? 1 : 0);
    learningData.failedInvestigations = (learningData.failedInvestigations ?? 0) + (success ? 0 : 1);

    await this.learningDataStore.saveLearningData(agentId, learningData);
  }

  /**
   * Calculate confidence score for a strategy
   * Formula: confidence = (successCount / totalUsageCount) * sqrt(totalUsageCount) / 10
   * Threshold: 0.7
   */
  private calculateConfidence(successCount: number, totalUsageCount: number): number {
    if (totalUsageCount === 0) return 0;

    const successRate = successCount / totalUsageCount;
    const confidence = successRate * Math.sqrt(totalUsageCount) / 10;

    // Clamp to [0, 1]
    return Math.min(1, Math.max(0, confidence));
  }
}

/**
 * TokenCounter - Tracks Claude API token usage
 * (Stub implementation - integrate with actual Claude Code API)
 */
class TokenCounter {
  private currentCount: number = 0;

  getCurrentCount(): number {
    // TODO: Integrate with Claude Code API for actual token tracking
    // For now, return stub value
    return this.currentCount;
  }

  incrementCount(tokens: number): void {
    this.currentCount += tokens;
  }

  resetCount(): void {
    this.currentCount = 0;
  }
}
