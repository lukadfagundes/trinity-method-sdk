/**
 * KnowledgeSharingBus - Enable cross-agent knowledge sharing
 *
 * Broadcasts high-confidence patterns between agents.
 * Only patterns with confidence ≥ 0.8 are shared.
 * Receiving agents validate before accepting.
 *
 * @module learning/KnowledgeSharingBus
 */

import {
  LearnedPattern,
  StrategyPerformance,
  AgentType,
} from '@shared/types';

import { LearningDataStore } from './LearningDataStore';

/**
 * Shared knowledge package
 */
export interface SharedKnowledge {
  patterns: LearnedPattern[];
  strategies: StrategyPerformance[];
  sourceAgent: AgentType;
  sharedAt: Date;
  minConfidence: number;
}

/**
 * Pattern broadcast event
 */
export interface PatternBroadcast {
  pattern: LearnedPattern;
  sourceAgent: AgentType;
  broadcastTime: Date;
}

/**
 * Pattern subscription callback
 */
export type PatternCallback = (broadcast: PatternBroadcast) => void | Promise<void>;

/**
 * KnowledgeSharingBus - Cross-agent knowledge sharing system
 */
export class KnowledgeSharingBus {
  private learningDataStore: LearningDataStore;
  private subscribers: Map<AgentType, Set<PatternCallback>>;
  private sharingThreshold: number = 0.8; // Minimum confidence to share

  constructor(learningDataStore: LearningDataStore) {
    this.learningDataStore = learningDataStore;
    this.subscribers = new Map();
  }

  /**
   * Broadcast a pattern to other agents
   * @param pattern - Pattern to broadcast
   * @param sourceAgent - Agent sharing the pattern
   * @returns Promise resolving when broadcast complete
   */
  async broadcastPattern(
    pattern: LearnedPattern,
    sourceAgent: AgentType
  ): Promise<void> {
    // Validate confidence threshold
    if (pattern.confidence < this.sharingThreshold) {
      throw new Error(
        `Pattern confidence ${pattern.confidence} below sharing threshold ${this.sharingThreshold}`
      );
    }

    const broadcast: PatternBroadcast = {
      pattern,
      sourceAgent,
      broadcastTime: new Date(),
    };

    // Notify all subscribers (except source agent)
    const allAgents: AgentType[] = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];

    for (const agentId of allAgents) {
      if (agentId === sourceAgent) continue; // Don't broadcast to self

      const callbacks = this.subscribers.get(agentId);
      if (callbacks) {
        // Execute all callbacks for this agent
        for (const callback of callbacks) {
          try {
            await callback(broadcast);
          } catch (error) {
            console.error(
              `Error in pattern callback for ${agentId}: ${(error as Error).message}`
            );
          }
        }
      }
    }
  }

  /**
   * Subscribe to pattern broadcasts
   * @param agentId - Agent subscribing
   * @param callback - Callback function to receive broadcasts
   * @returns Promise resolving when subscription active
   */
  async subscribeToPatterns(
    agentId: AgentType,
    callback: PatternCallback
  ): Promise<void> {
    if (!this.subscribers.has(agentId)) {
      this.subscribers.set(agentId, new Set());
    }

    this.subscribers.get(agentId).add(callback);
  }

  /**
   * Unsubscribe from pattern broadcasts
   * @param agentId - Agent unsubscribing
   * @param callback - Callback to remove (optional, removes all if not specified)
   */
  unsubscribeFromPatterns(agentId: AgentType, callback?: PatternCallback): void {
    if (!this.subscribers.has(agentId)) return;

    if (callback) {
      this.subscribers.get(agentId).delete(callback);
    } else {
      this.subscribers.delete(agentId);
    }
  }

  /**
   * Share strategy with specific agents
   * @param strategy - Strategy to share
   * @param sourceAgent - Agent sharing strategy
   * @param targetAgents - Agents to share with
   * @returns Promise resolving when sharing complete
   */
  async shareStrategy(
    strategy: StrategyPerformance,
    sourceAgent: AgentType,
    targetAgents: AgentType[]
  ): Promise<void> {
    // Validate confidence threshold
    if (strategy.confidence < this.sharingThreshold) {
      throw new Error(
        `Strategy confidence ${strategy.confidence} below sharing threshold ${this.sharingThreshold}`
      );
    }

    // Share with each target agent
    for (const targetAgent of targetAgents) {
      if (targetAgent === sourceAgent) continue; // Skip self

      // Load target agent's learning data
      const learningData = await this.learningDataStore.loadLearningData(targetAgent);

      // Check if agent already has this strategy
      if (learningData.strategies.has(strategy.strategyId)) {
        // Strategy exists - merge data if shared version is better
        const existingStrategy = learningData.strategies.get(strategy.strategyId);

        if (strategy.confidence > existingStrategy.confidence) {
          // Shared strategy is better - update
          learningData.strategies.set(strategy.strategyId, {
            ...strategy,
            agentId: targetAgent, // Update agent ownership
          });

          await this.learningDataStore.saveLearningData(targetAgent, learningData);
        }
      } else {
        // New strategy - add it
        learningData.strategies.set(strategy.strategyId, {
          ...strategy,
          agentId: targetAgent,
          usageCount: 0, // Reset usage for new agent
          successCount: 0,
          failureCount: 0,
          successfulInvestigations: [],
          failedInvestigations: [],
        });

        await this.learningDataStore.saveLearningData(targetAgent, learningData);
      }
    }
  }

  /**
   * Get shared knowledge from other agents
   * @param agentId - Agent requesting knowledge
   * @param minConfidence - Minimum confidence threshold (default: 0.8)
   * @returns Promise resolving to shared knowledge
   */
  async getSharedKnowledge(
    agentId: AgentType,
    minConfidence: number = 0.8
  ): Promise<SharedKnowledge[]> {
    const allAgents: AgentType[] = ['AJ', 'TAN', 'ZEN', 'INO', 'JUNO'];
    const sharedKnowledge: SharedKnowledge[] = [];

    for (const sourceAgent of allAgents) {
      if (sourceAgent === agentId) continue; // Skip self

      try {
        const learningData = await this.learningDataStore.loadLearningData(sourceAgent);

        // Filter high-confidence patterns
        const patterns = Array.from(learningData.patterns.values()).filter(
          pattern => pattern.confidence >= minConfidence
        );

        // Filter high-confidence strategies
        const strategies = Array.from(learningData.strategies.values()).filter(
          strategy => strategy.confidence >= minConfidence
        );

        if (patterns.length > 0 || strategies.length > 0) {
          sharedKnowledge.push({
            patterns,
            strategies,
            sourceAgent,
            sharedAt: new Date(),
            minConfidence,
          });
        }
      } catch (error) {
        // Skip agents with no learning data
        continue;
      }
    }

    return sharedKnowledge;
  }

  /**
   * Validate pattern before accepting (agent-specific validation)
   * @param pattern - Pattern to validate
   * @param agentId - Agent validating
   * @returns True if pattern is valid for this agent
   */
  validatePattern(pattern: LearnedPattern, agentId: AgentType): boolean {
    // Agent-specific validation rules
    switch (agentId) {
      case 'TAN':
        // TAN only accepts file structure and architecture patterns
        return pattern.patternType === 'code-structure';

      case 'ZEN':
        // ZEN accepts documentation and research patterns
        return pattern.patternType === 'research-source' || pattern.patternType === 'validation-rule';

      case 'INO':
        // INO accepts all pattern types (context specialist)
        return true;

      case 'JUNO':
        // JUNO accepts validation rules and anti-patterns
        return pattern.patternType === 'validation-rule' || pattern.patternType === 'anti-pattern';

      case 'AJ':
        // AJ accepts code structure and anti-patterns
        return pattern.patternType === 'code-structure' || pattern.patternType === 'anti-pattern';

      default:
        return false;
    }
  }

  /**
   * Accept shared pattern (after validation)
   * @param pattern - Pattern to accept
   * @param targetAgent - Agent accepting pattern
   * @returns Promise resolving when pattern accepted
   */
  async acceptSharedPattern(
    pattern: LearnedPattern,
    targetAgent: AgentType
  ): Promise<void> {
    // Validate pattern for this agent
    if (!this.validatePattern(pattern, targetAgent)) {
      throw new Error(
        `Pattern type ${pattern.patternType} not valid for agent ${targetAgent}`
      );
    }

    // Load agent's learning data
    const learningData = await this.learningDataStore.loadLearningData(targetAgent);

    // Add pattern with updated agent ownership
    const acceptedPattern: LearnedPattern = {
      ...pattern,
      agentId: targetAgent,
      usageCount: 0, // Reset usage for new agent
      successCount: 0,
      investigationIds: [],
    };

    learningData.patterns.set(pattern.patternId, acceptedPattern);

    await this.learningDataStore.saveLearningData(targetAgent, learningData);
  }

  /**
   * Set sharing confidence threshold
   * @param threshold - New threshold (0-1)
   */
  setSharingThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Sharing threshold must be between 0 and 1');
    }
    this.sharingThreshold = threshold;
  }

  /**
   * Get current sharing threshold
   * @returns Current threshold
   */
  getSharingThreshold(): number {
    return this.sharingThreshold;
  }
}
