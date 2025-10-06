/**
 * ZEN (Knowledge Base Specialist) - Enhanced with Learning Capabilities
 *
 * Specializes in:
 * - Documentation analysis and generation
 * - Knowledge extraction
 * - Research and reference management
 * - Pattern documentation
 *
 * Now includes self-improving capabilities for better documentation recommendations.
 *
 * @module agents/ZEN
 */

import {
  InvestigationResult,
  Finding,
  LearnedPattern,
  PerformanceMetrics,
  InvestigationMetadata,
} from '@shared/types';

import { InvestigationContext } from '../learning/StrategySelectionEngine';

import { SelfImprovingAgent } from './SelfImprovingAgent';

/**
 * ZEN Agent - Knowledge Extraction Navigator
 * Enhanced with self-improving capabilities
 */
export class ZENAgent extends SelfImprovingAgent {
  /**
   * Execute documentation investigation
   * @param context - Investigation context
   * @returns Promise resolving to investigation result
   */
  async executeInvestigation(context: InvestigationContext): Promise<InvestigationResult> {
    const investigationId = this.generateInvestigationId();
    const startTime = new Date();

    // Track investigation start
    this.performanceTracker.trackInvestigationStart(investigationId, 'ZEN');

    // Select best strategy based on learned experience
    const strategy = await this.selectBestStrategy(context);

    // Track strategy usage
    this.performanceTracker.trackStrategyStart(investigationId, strategy.strategyId);

    try {
      // Get relevant learned patterns
      const relevantPatterns = await this.getRelevantPatterns(context);

      // Execute investigation
      const findings = this.analyzeDocumentation(context, relevantPatterns);

      // Extract new patterns
      const patterns = this.extractDocumentationPatterns(findings);

      // Create result
      const result: InvestigationResult = {
        id: investigationId,
        type: context.type,
        status: 'completed',
        agent: 'ZEN',
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

      // Track completion and learn
      await this.performanceTracker.trackInvestigationComplete(investigationId, result);
      await this.learnFromInvestigation(result);

      return result;
    } catch (error) {
      // Convert unknown error to Error type with type guard
      const errorObj: Error = error instanceof Error
        ? error
        : new Error(String(error));

      this.performanceTracker.trackInvestigationFailure(investigationId, errorObj);

      // Check for learned error resolution
      const _resolution = await this.getErrorResolution(errorObj as Error & { type?: string });

      throw error;
    }
  }

  /**
   * Analyze documentation
   */
  private analyzeDocumentation(
    context: InvestigationContext,
    learnedPatterns: LearnedPattern[]
  ): Finding[] {
    const findings: Finding[] = [];

    // Use learned patterns
    for (const pattern of learnedPatterns) {
      if (pattern.patternType === 'research-source' || pattern.patternType === 'validation-rule') {
        const patternFindings = this.detectDocumentationPattern(pattern, context);
        findings.push(...patternFindings);
      }
    }

    // Standard documentation analysis
    findings.push(...this.analyzeReadme(context));
    findings.push(...this.analyzeApiDocumentation(context));
    findings.push(...this.analyzeCodeComments(context));

    return findings;
  }

  /**
   * Detect documentation pattern
   */
  private detectDocumentationPattern(
    pattern: LearnedPattern,
    _context: InvestigationContext
  ): Finding[] {
    const findings: Finding[] = [];

    if ((pattern.confidence ?? 0) >= 0.7) {
      findings.push({
        id: `zen-pattern-${pattern.patternId}`,
        type: 'observation',
        severity: 'info',
        title: `Documentation Pattern: ${pattern.description}`,
        description: `Learned from ${pattern.usageCount} investigations with ${(pattern.confidence * 100).toFixed(1)}% confidence`,
        location: { file: 'docs/' },
        evidence: pattern.filePaths,
        recommendation: pattern.detectionCriteria,
      });
    }

    return findings;
  }

  /**
   * Analyze README
   */
  private analyzeReadme(_context: InvestigationContext): Finding[] {
    return [
      {
        id: 'readme-1',
        type: 'observation',
        severity: 'info',
        title: 'README Analysis',
        description: 'Analyzing README completeness and clarity',
        location: { file: 'README.md' },
        evidence: [],
      },
    ];
  }

  /**
   * Analyze API documentation
   */
  private analyzeApiDocumentation(_context: InvestigationContext): Finding[] {
    return [
      {
        id: 'api-docs-1',
        type: 'observation',
        severity: 'info',
        title: 'API Documentation Analysis',
        description: 'Analyzing API documentation coverage',
        location: { file: 'docs/api/' },
        evidence: [],
      },
    ];
  }

  /**
   * Analyze code comments
   */
  private analyzeCodeComments(_context: InvestigationContext): Finding[] {
    return [
      {
        id: 'comments-1',
        type: 'observation',
        severity: 'info',
        title: 'Code Comments Analysis',
        description: 'Analyzing code comment quality and coverage',
        location: { file: 'src/' },
        evidence: [],
      },
    ];
  }

  /**
   * Extract documentation patterns
   */
  private extractDocumentationPatterns(findings: Finding[]): LearnedPattern[] {
    const patterns: LearnedPattern[] = [];

    for (const finding of findings) {
      if (finding.type === 'issue') {
        patterns.push({
          patternId: `zen-pattern-${Date.now()}`,
          patternType: 'research-source',
          description: finding.title,
          detectionCriteria: finding.description,
          accuracy: 0.8,
          confidence: 0.5,
          usageCount: 1,
          successCount: 1,
          lastSeen: new Date(),
          agentId: 'ZEN',
          investigationIds: [],
          tags: ['documentation', 'knowledge'],
          filePaths: [finding.location.file],
          errorTypes: [],
        });
      }
    }

    return patterns;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(findings: Finding[]): string[] {
    return findings
      .filter(f => f.severity === 'high' || f.severity === 'critical')
      .map(f => `Improve: ${f.title} - ${f.recommendation || f.description}`);
  }

  /**
   * Collect metrics
   */
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

  /**
   * Create metadata
   */
  private createMetadata(
    investigationId: string,
    context: InvestigationContext
  ): InvestigationMetadata {
    return {
      investigationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'ZEN',
      tags: ['documentation', 'knowledge', ...context.scope],
      priority: 'medium',
    };
  }

  /**
   * Generate investigation ID
   */
  private generateInvestigationId(): string {
    return `zen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
