/**
 * StrategySelectionEngine - AI-powered strategy selection based on historical performance data
 *
 * @see docs/best-practices.md - Strategy selection patterns
 * @see docs/methodology/investigation-first-complete.md - Evidence-based investigation
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Selects optimal investigation strategies by analyzing historical performance data with
 * confidence-weighted scoring. Ensures agents choose proven approaches rather than guessing,
 * making investigations faster and more successful through data-driven strategy selection.
 *
 * **Why This Exists:**
 * Traditional development guesses at approaches. Should we use top-down or bottom-up analysis?
 * Broad search or focused deep-dive? This engine analyzes past investigations: which strategies
 * worked for similar contexts? It scores strategies using formula (successRate × 0.6 + confidence × 0.4),
 * requiring ≥0.7 confidence threshold, ensuring agents always choose statistically-validated
 * approaches over hunches.
 *
 * @example
 * ```typescript
 * const engine = new StrategySelectionEngine(learningData, tracker);
 *
 * // Select strategy for investigation
 * const context = {
 *   type: 'performance',
 *   scope: ['api', 'database'],
 *   estimatedComplexity: 'high'
 * };
 * const strategy = await engine.selectStrategy('MON', context);
 * console.log(`Selected: ${strategy.name} (score: ${strategy.score})`);
 * ```
 *
 * @module learning/StrategySelectionEngine
 */

import {
  StrategyPerformance,
  AgentType,
  InvestigationType,
} from '../shared/types';

import { LearningDataStore } from './LearningDataStore';
import { PerformanceTracker } from './PerformanceTracker';

/**
 * Investigation context for strategy selection
 */
export interface InvestigationContext {
  type: InvestigationType;
  scope: string[];
  framework?: string;
  language?: string;
  codebaseSize?: number;
  estimatedComplexity?: 'low' | 'medium' | 'high';
}

/**
 * Strategy with calculated score
 */
export interface ScoredStrategy {
  strategy: StrategyPerformance;
  score: number;
  confidence: number;
  reason: string;
}

/**
 * Default strategy (used when no learned strategies available)
 */
export interface DefaultStrategy {
  id: string;
  name: string;
  description: string;
  applicableTypes: InvestigationType[];
}

/**
 * StrategySelectionEngine - Intelligent strategy selection
 */
export class StrategySelectionEngine {
  private learningDataStore: LearningDataStore;
  private performanceTracker: PerformanceTracker;
  private defaultStrategies: Map<InvestigationType, DefaultStrategy>;
  private confidenceThreshold: number = 0.7;

  constructor(
    learningDataStore: LearningDataStore,
    performanceTracker: PerformanceTracker
  ) {
    this.learningDataStore = learningDataStore;
    this.performanceTracker = performanceTracker;
    this.defaultStrategies = this.initializeDefaultStrategies();
  }

  /**
   * Select best strategy for investigation context
   * @param agentId - Agent conducting investigation
   * @param context - Investigation context
   * @returns Promise resolving to selected strategy
   * @throws {StrategySelectionError} If no applicable strategies found
   */
  async selectStrategy(
    agentId: AgentType,
    context: InvestigationContext
  ): Promise<StrategyPerformance> {
    // Load agent's learned strategies
    const learningData = await this.learningDataStore.loadLearningData(agentId);
    const strategies = Array.from(learningData.strategies.values());

    if (strategies.length === 0) {
      // No learned strategies - use default
      return this.getDefaultStrategy(agentId, context);
    }

    // Filter strategies by context match
    const applicableStrategies = strategies.filter(strategy =>
      this.isApplicableToContext(strategy, context)
    );

    if (applicableStrategies.length === 0) {
      // No applicable learned strategies - use default
      return this.getDefaultStrategy(agentId, context);
    }

    // Rank strategies
    const rankedStrategies = this.rankStrategies(applicableStrategies);

    // Check if top strategy meets confidence threshold
    const topStrategy = rankedStrategies[0];

    if (topStrategy.confidence < this.confidenceThreshold) {
      // Low confidence - use default strategy
      return this.getDefaultStrategy(agentId, context);
    }

    return topStrategy.strategy;
  }

  /**
   * Rank strategies by confidence-weighted score
   * @param strategies - Strategies to rank
   * @returns Ranked strategies with scores
   */
  rankStrategies(strategies: StrategyPerformance[]): ScoredStrategy[] {
    const scored = strategies.map(strategy => {
      const confidence = this.calculateConfidenceScore(strategy);
      const score = this.calculateWeightedScore(strategy, confidence);

      return {
        strategy,
        score,
        confidence,
        reason: this.generateSelectionReason(strategy, score, confidence),
      };
    });

    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate confidence score for a strategy
   * Formula: confidence = (successCount / totalUsageCount) * sqrt(totalUsageCount) / 10
   * @param strategy - Strategy to score
   * @returns Confidence score (0-1)
   */
  calculateConfidenceScore(strategy: StrategyPerformance): number {
    if (strategy.usageCount === 0) return 0;

    const successRate = strategy.successCount / strategy.usageCount;
    const confidence = successRate * Math.sqrt(strategy.usageCount) / 10;

    // Clamp to [0, 1]
    return Math.min(1, Math.max(0, confidence));
  }

  /**
   * Calculate weighted score
   * Formula: score = (successRate * 0.6) + (confidence * 0.4)
   * @param strategy - Strategy to score
   * @param confidence - Confidence score
   * @returns Weighted score (0-1)
   */
  private calculateWeightedScore(
    strategy: StrategyPerformance,
    confidence: number
  ): number {
    const successRate = strategy.successRate;
    const score = (successRate * 0.6) + (confidence * 0.4);

    return Math.min(1, Math.max(0, score));
  }

  /**
   * Check if strategy is applicable to investigation context
   * @param strategy - Strategy to check
   * @param context - Investigation context
   * @returns True if strategy applies to context
   */
  private isApplicableToContext(
    strategy: StrategyPerformance,
    context: InvestigationContext
  ): boolean {
    // Check if strategy has applicable contexts defined
    if (strategy.applicableContexts.length === 0) {
      return true; // No restrictions, applies to all contexts
    }

    // Check if any applicable context matches investigation type
    // Support both exact matches and word-based partial matches
    const investigationTypeMatch = strategy.applicableContexts.some(ctx => {
      const ctxLower = ctx.toLowerCase();
      const typeLower = context.type.toLowerCase();

      // Exact match
      if (ctxLower === typeLower) return true;

      // Substring match (either direction)
      if (ctxLower.includes(typeLower) || typeLower.includes(ctxLower)) return true;

      // Word-based match (e.g., 'bug-fix' matches 'bug-investigation')
      const ctxWords = ctxLower.split(/[-_\s]+/);
      const typeWords = typeLower.split(/[-_\s]+/);

      // Check if they share significant words (not common words like 'the', 'a')
      const sharedWords = ctxWords.filter(word =>
        word.length > 2 && typeWords.includes(word)
      );

      if (sharedWords.length > 0) return true;

      return false;
    });

    if (investigationTypeMatch) {
      return true;
    }

    // Check for framework/language match
    if (context.framework) {
      const frameworkMatch = strategy.applicableContexts.some(
        ctx => ctx.toLowerCase().includes(context.framework.toLowerCase())
      );
      if (frameworkMatch) return true;
    }

    if (context.language) {
      const languageMatch = strategy.applicableContexts.some(
        ctx => ctx.toLowerCase().includes(context.language.toLowerCase())
      );
      if (languageMatch) return true;
    }

    return false;
  }

  /**
   * Get default strategy for context (fallback when no learned strategies)
   * @param agentId - Agent identifier
   * @param context - Investigation context
   * @returns Default strategy converted to StrategyPerformance
   */
  private getDefaultStrategy(
    agentId: AgentType,
    context: InvestigationContext
  ): StrategyPerformance {
    const defaultStrategy = this.defaultStrategies.get(context.type);

    if (!defaultStrategy) {
      throw new Error(`No default strategy for investigation type: ${context.type}`);
    }

    // Convert to StrategyPerformance format
    return {
      strategyId: defaultStrategy.id,
      strategyName: defaultStrategy.name,
      description: defaultStrategy.description,
      applicableContexts: defaultStrategy.applicableTypes,
      successRate: 0.6, // Baseline success rate for default strategies
      averageDuration: 0,
      tokenEfficiency: 0,
      usageCount: 0,
      successCount: 0,
      failureCount: 0,
      lastUsed: new Date(),
      confidence: 0.5, // Medium confidence for defaults
      agentId,
      successfulInvestigations: [],
      failedInvestigations: [],
    };
  }

  /**
   * Generate human-readable reason for strategy selection
   */
  private generateSelectionReason(
    strategy: StrategyPerformance,
    score: number,
    confidence: number
  ): string {
    const successRate = (strategy.successRate * 100).toFixed(1);
    const usageCount = strategy.usageCount;
    const confidencePercent = (confidence * 100).toFixed(1);

    return `Selected: ${successRate}% success rate over ${usageCount} uses, ${confidencePercent}% confidence`;
  }

  /**
   * Initialize default strategies for each investigation type
   */
  private initializeDefaultStrategies(): Map<InvestigationType, DefaultStrategy> {
    const strategies = new Map<InvestigationType, DefaultStrategy>();

    strategies.set('security-audit', {
      id: 'default-security-audit',
      name: 'Comprehensive Security Audit',
      description: 'Systematic security analysis covering authentication, authorization, data validation, and common vulnerabilities',
      applicableTypes: ['security-audit'],
    });

    strategies.set('performance-review', {
      id: 'default-performance-review',
      name: 'Performance Profiling & Optimization',
      description: 'Analyze performance bottlenecks, resource usage, and optimization opportunities',
      applicableTypes: ['performance-review'],
    });

    strategies.set('architecture-analysis', {
      id: 'default-architecture-analysis',
      name: 'Architecture Review & Documentation',
      description: 'Review system architecture, component interactions, and design patterns',
      applicableTypes: ['architecture-analysis'],
    });

    strategies.set('code-quality', {
      id: 'default-code-quality',
      name: 'Code Quality Assessment',
      description: 'Evaluate code quality, maintainability, test coverage, and technical debt',
      applicableTypes: ['code-quality'],
    });

    strategies.set('bug-investigation', {
      id: 'default-bug-investigation',
      name: 'Bug Investigation & Root Cause Analysis',
      description: 'Systematic investigation of bugs, error reproduction, and root cause identification',
      applicableTypes: ['bug-investigation'],
    });

    strategies.set('feature-planning', {
      id: 'default-feature-planning',
      name: 'Feature Planning & Design',
      description: 'Analyze requirements, design architecture, and plan implementation for new features',
      applicableTypes: ['feature-planning'],
    });

    strategies.set('refactoring-plan', {
      id: 'default-refactoring-plan',
      name: 'Refactoring Strategy',
      description: 'Identify technical debt, plan refactoring approach, and minimize risk',
      applicableTypes: ['refactoring-plan'],
    });

    strategies.set('custom', {
      id: 'default-custom',
      name: 'Custom Investigation Strategy',
      description: 'Flexible investigation approach adapted to specific requirements',
      applicableTypes: ['custom'],
    });

    return strategies;
  }

  /**
   * Set custom confidence threshold
   * @param threshold - New threshold (0-1)
   */
  setConfidenceThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Confidence threshold must be between 0 and 1');
    }
    this.confidenceThreshold = threshold;
  }

  /**
   * Get current confidence threshold
   * @returns Current threshold
   */
  getConfidenceThreshold(): number {
    return this.confidenceThreshold;
  }
}

/**
 * StrategySelectionError - Thrown when strategy selection fails
 */
export class StrategySelectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StrategySelectionError';
  }
}
