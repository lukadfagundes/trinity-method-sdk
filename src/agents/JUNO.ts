/**
 * JUNO (Quality Auditor) - Enhanced with Learning Capabilities
 *
 * Specializes in:
 * - Quality auditing and validation
 * - Test coverage analysis
 * - Code quality metrics
 * - Best practices enforcement
 *
 * Now includes self-improving capabilities for better quality assessments.
 *
 * @module agents/JUNO
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
 * JUNO Agent - Quality Auditor
 * Enhanced with self-improving capabilities
 */
export class JUNOAgent extends SelfImprovingAgent {
  /**
   * Execute quality audit investigation
   * @param context - Investigation context
   * @returns Promise resolving to investigation result
   */
  async executeInvestigation(context: InvestigationContext): Promise<InvestigationResult> {
    const investigationId = this.generateInvestigationId();
    const startTime = new Date();

    // Track investigation start
    this.performanceTracker.trackInvestigationStart(investigationId, 'JUNO');

    // Select best strategy
    const strategy = await this.selectBestStrategy(context);

    // Track strategy usage
    this.performanceTracker.trackStrategyStart(investigationId, strategy.strategyId);

    try {
      // Get relevant learned patterns
      const relevantPatterns = await this.getRelevantPatterns(context);

      // Execute quality audit
      const findings = await this.performQualityAudit(context, relevantPatterns);

      // Extract patterns
      const patterns = this.extractQualityPatterns(findings);

      // Create result
      const result: InvestigationResult = {
        id: investigationId,
        type: context.type,
        status: 'completed',
        agent: 'JUNO',
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
   * Perform quality audit
   */
  private async performQualityAudit(
    context: InvestigationContext,
    learnedPatterns: LearnedPattern[]
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    // Use learned patterns (JUNO accepts validation rules and anti-patterns)
    for (const pattern of learnedPatterns) {
      if (pattern.patternType === 'validation-rule' || pattern.patternType === 'anti-pattern') {
        const patternFindings = await this.detectQualityPattern(pattern, context);
        findings.push(...patternFindings);
      }
    }

    // Standard quality audits
    findings.push(...await this.auditCodeQuality(context));
    findings.push(...await this.auditTestCoverage(context));
    findings.push(...await this.auditBestPractices(context));

    return findings;
  }

  /**
   * Detect quality pattern
   */
  private async detectQualityPattern(
    pattern: LearnedPattern,
    context: InvestigationContext
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    if (pattern.confidence >= 0.7) {
      const severity = pattern.patternType === 'anti-pattern' ? 'high' : 'medium';

      findings.push({
        id: `juno-pattern-${pattern.patternId}`,
        type: pattern.patternType === 'anti-pattern' ? 'issue' : 'observation',
        severity,
        title: `Quality Pattern: ${pattern.description}`,
        description: `Learned from ${pattern.usageCount} audits with ${(pattern.confidence * 100).toFixed(1)}% confidence`,
        location: { file: pattern.filePaths[0] || '/' },
        evidence: pattern.filePaths,
        recommendation: pattern.detectionCriteria,
      });
    }

    return findings;
  }

  /**
   * Audit code quality
   */
  private async auditCodeQuality(context: InvestigationContext): Promise<Finding[]> {
    return [
      {
        id: 'quality-1',
        type: 'observation',
        severity: 'info',
        title: 'Code Quality Assessment',
        description: 'Analyzing code quality metrics and maintainability',
        location: { file: 'src/' },
        evidence: [],
      },
    ];
  }

  /**
   * Audit test coverage
   */
  private async auditTestCoverage(context: InvestigationContext): Promise<Finding[]> {
    return [
      {
        id: 'coverage-1',
        type: 'observation',
        severity: 'info',
        title: 'Test Coverage Analysis',
        description: 'Analyzing test coverage and quality',
        location: { file: 'tests/' },
        evidence: [],
      },
    ];
  }

  /**
   * Audit best practices
   */
  private async auditBestPractices(context: InvestigationContext): Promise<Finding[]> {
    return [
      {
        id: 'best-practices-1',
        type: 'observation',
        severity: 'info',
        title: 'Best Practices Review',
        description: 'Reviewing adherence to best practices',
        location: { file: '/' },
        evidence: [],
      },
    ];
  }

  /**
   * Extract quality patterns
   */
  private extractQualityPatterns(findings: Finding[]): LearnedPattern[] {
    return findings
      .filter(f => f.type === 'issue' && f.severity === 'high')
      .map(f => ({
        patternId: `juno-pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        patternType: 'anti-pattern' as const,
        description: f.title,
        detectionCriteria: f.description,
        accuracy: 0.85,
        confidence: 0.6,
        usageCount: 1,
        successCount: 1,
        lastSeen: new Date(),
        agentId: 'JUNO' as const,
        investigationIds: [],
        tags: ['quality', 'audit'],
        filePaths: [f.location.file],
        errorTypes: [],
      }));
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(findings: Finding[]): any[] {
    return findings
      .filter(f => f.severity === 'high' || f.severity === 'critical')
      .map(f => ({
        id: `rec-${f.id}`,
        type: 'fix',
        priority: f.severity,
        title: `Fix: ${f.title}`,
        description: f.recommendation || f.description,
        rationale: 'Improve code quality and maintainability',
        effort: 'medium',
        impact: 'high',
        location: f.location,
      }));
  }

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

  private createMetadata(investigationId: string, context: InvestigationContext): InvestigationMetadata {
    return {
      investigationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'JUNO',
      tags: ['quality', 'audit', ...context.scope],
      priority: 'high',
    };
  }

  private generateInvestigationId(): string {
    return `juno-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
