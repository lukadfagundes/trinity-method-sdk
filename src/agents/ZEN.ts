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
      const findings = await this.analyzeDocumentation(context, relevantPatterns);

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
        metrics: await this.collectMetrics(investigationId),
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
      this.performanceTracker.trackInvestigationFailure(investigationId, error as Error);

      // Check for learned error resolution
      const resolution = await this.getErrorResolution(error);

      throw error;
    }
  }

  /**
   * Analyze documentation
   */
  private async analyzeDocumentation(
    context: InvestigationContext,
    learnedPatterns: LearnedPattern[]
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    // Use learned patterns
    for (const pattern of learnedPatterns) {
      if (pattern.patternType === 'research-source' || pattern.patternType === 'validation-rule') {
        const patternFindings = await this.detectDocumentationPattern(pattern, context);
        findings.push(...patternFindings);
      }
    }

    // Standard documentation analysis
    findings.push(...await this.analyzeReadme(context));
    findings.push(...await this.analyzeApiDocumentation(context));
    findings.push(...await this.analyzeCodeComments(context));

    return findings;
  }

  /**
   * Detect documentation pattern
   */
  private async detectDocumentationPattern(
    pattern: LearnedPattern,
    context: InvestigationContext
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    if (pattern.confidence >= 0.7) {
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
  private async analyzeReadme(context: InvestigationContext): Promise<Finding[]> {
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
  private async analyzeApiDocumentation(context: InvestigationContext): Promise<Finding[]> {
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
  private async analyzeCodeComments(context: InvestigationContext): Promise<Finding[]> {
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
  private generateRecommendations(findings: Finding[]): any[] {
    return findings
      .filter(f => f.severity === 'high' || f.severity === 'critical')
      .map(f => ({
        id: `rec-${f.id}`,
        type: 'document',
        priority: f.severity,
        title: `Improve: ${f.title}`,
        description: f.recommendation || f.description,
        rationale: 'Enhance documentation quality and completeness',
        effort: 'low',
        impact: 'medium',
        location: f.location,
      }));
  }

  /**
   * Collect metrics
   */
  private async collectMetrics(investigationId: string): Promise<PerformanceMetrics> {
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
