/**
 * INO (Context Specialist) - CLAUDE.md behavioral hierarchy and ISSUES.md database establishment
 *
 * @see docs/context-and-issues-guide.md - Context management philosophy
 * @see docs/agents/agent-selection-guide.md - INO's context responsibilities
 * @see docs/workflows/deploy-workflow.md - Context file deployment
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * INO establishes CLAUDE.md behavioral hierarchy defining agent behaviors and ISSUES.md
 * comprehensive database of known patterns, errors, and solutions. Provides agents with
 * context boundaries and historical evidence for faster, more accurate investigations.
 *
 * **Why This Exists:**
 * Traditional development lacks context persistence. Agents start each investigation
 * from zero, repeating research and rediscovering known issues. INO creates living
 * documentation of project context (CLAUDE.md) and issue history (ISSUES.md), giving
 * agents immediate access to past findings. This transforms investigations from
 * exploration to informed analysis, reducing duplicate work and accelerating resolution.
 *
 * @example
 * ```typescript
 * const ino = new INOAgent(learningData, tracker, strategy, bus);
 * await ino.establishCLAUDEmd('/path/to/project');
 * // Creates: .claude/CLAUDE.md with agent behaviors
 * await ino.createISSUESDatabase(projectPath);
 * // Creates: ISSUES.md with pattern/error database
 * await ino.integrateV2Practices(projectPath);
 * ```
 *
 * @module agents/INO
 */

import { InvestigationContext } from '../learning/StrategySelectionEngine';
import {
  InvestigationResult,
  Finding,
  LearnedPattern,
  PerformanceMetrics,
  InvestigationMetadata,
} from '../shared/types';


import { SelfImprovingAgent } from './SelfImprovingAgent';

/**
 * INO Agent - Investigation Navigator & Orchestrator with context establishment capabilities
 */
export class INOAgent extends SelfImprovingAgent {
  /**
   * Execute context analysis investigation
   * @param context - Investigation context
   * @returns Promise resolving to investigation result
   */
  async executeInvestigation(context: InvestigationContext): Promise<InvestigationResult> {
    const investigationId = this.generateInvestigationId();
    const startTime = new Date();

    // Track investigation start
    this.performanceTracker.trackInvestigationStart(investigationId, 'INO');

    // Select best strategy
    const strategy = await this.selectBestStrategy(context);

    // Track strategy usage
    this.performanceTracker.trackStrategyStart(investigationId, strategy.strategyId);

    try {
      // Get relevant learned patterns
      const relevantPatterns = await this.getRelevantPatterns(context);

      // Execute investigation
      const findings = this.analyzeContext(context, relevantPatterns);

      // Extract patterns
      const patterns = this.extractContextPatterns(findings);

      // Create result
      const result: InvestigationResult = {
        id: investigationId,
        type: context.type,
        status: 'completed',
        agent: 'INO',
        startTime,
        endTime: new Date(),
        duration: Date.now() - startTime.getTime(),
        findings,
        patterns,
        metrics: this.collectMetrics(investigationId),
        errors: [],
        recommendations: this.generateRecommendations(findings),
        artifacts: [],
        metadata: this.createMetadata(investigationId, context),
      };

      // Track and learn
      await this.performanceTracker.trackInvestigationComplete(investigationId, result);
      await this.learnFromInvestigation(result);

      return result;
    } catch (error) {
      this.performanceTracker.trackInvestigationFailure(investigationId, error as Error);
      throw error;
    }
  }

  /**
   * Analyze context
   */
  private analyzeContext(
    context: InvestigationContext,
    learnedPatterns: LearnedPattern[]
  ): Finding[] {
    const findings: Finding[] = [];

    // Use learned patterns (INO accepts all pattern types)
    for (const pattern of learnedPatterns) {
      const patternFindings = this.detectContextPattern(pattern, context);
      findings.push(...patternFindings);
    }

    // Standard context analysis
    findings.push(...this.analyzeClaudeMd(context));
    findings.push(...this.analyzeInvestigationScope(context));
    findings.push(...this.analyzeContextBoundaries(context));

    return findings;
  }

  /**
   * Detect context pattern
   */
  private detectContextPattern(
    pattern: LearnedPattern,
    _context: InvestigationContext
  ): Finding[] {
    const findings: Finding[] = [];

    if ((pattern.confidence ?? 0) >= 0.7) {
      findings.push({
        id: `ino-pattern-${pattern.patternId}`,
        type: 'observation',
        severity: 'info',
        title: `Context Pattern: ${pattern.description}`,
        description: `Learned from ${pattern.usageCount} investigations`,
        location: { file: 'CLAUDE.md' },
        evidence: pattern.filePaths,
      });
    }

    return findings;
  }

  /**
   * Analyze CLAUDE.md
   */
  private analyzeClaudeMd(_context: InvestigationContext): Finding[] {
    return [
      {
        id: 'claude-md-1',
        type: 'observation',
        severity: 'info',
        title: 'CLAUDE.md Analysis',
        description: 'Analyzing project context and configuration',
        location: { file: 'CLAUDE.md' },
        evidence: [],
      },
    ];
  }

  /**
   * Analyze investigation scope
   */
  private analyzeInvestigationScope(context: InvestigationContext): Finding[] {
    return [
      {
        id: 'scope-1',
        type: 'observation',
        severity: 'info',
        title: 'Scope Analysis',
        description: `Analyzing investigation scope: ${context.scope.join(', ')}`,
        location: { file: '/' },
        evidence: [],
      },
    ];
  }

  /**
   * Analyze context boundaries
   */
  private analyzeContextBoundaries(_context: InvestigationContext): Finding[] {
    return [
      {
        id: 'boundaries-1',
        type: 'observation',
        severity: 'info',
        title: 'Context Boundaries',
        description: 'Analyzing investigation context boundaries',
        location: { file: '/' },
        evidence: [],
      },
    ];
  }

  /**
   * Extract context patterns
   */
  private extractContextPatterns(findings: Finding[]): LearnedPattern[] {
    return findings
      .filter(f => f.type === 'issue')
      .map(f => ({
        patternId: `ino-pattern-${Date.now()}`,
        patternType: 'validation-rule' as const,
        description: f.title,
        detectionCriteria: f.description,
        accuracy: 0.8,
        confidence: 0.5,
        usageCount: 1,
        successCount: 1,
        lastSeen: new Date(),
        agentId: 'INO' as const,
        investigationIds: [],
        tags: ['context', 'scope'],
        filePaths: [f.location.file],
        errorTypes: [],
      }));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(findings: Finding[]): string[] {
    return findings
      .filter(f => f.severity === 'high' || f.severity === 'critical')
      .map(f => f.recommendation || f.description);
  }

  private collectMetrics(_investigationId: string): PerformanceMetrics {
    return {
      duration: 0,
      tokensUsed: 0,
      apiCalls: 0,
      errors: 0,
      warnings: 0,
      filesAnalyzed: 0,
      linesAnalyzed: 0,
      timestamp: new Date(),
    };
  }

  private createMetadata(investigationId: string, context: InvestigationContext): InvestigationMetadata {
    return {
      investigationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'INO',
      tags: ['context', ...context.scope],
      priority: 'high',
    };
  }

  private generateInvestigationId(): string {
    return `ino-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
