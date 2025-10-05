/**
 * TAN (Structure Specialist) - Enhanced with Learning Capabilities
 *
 * Specializes in:
 * - File and directory structure analysis
 * - Architecture patterns
 * - Code organization
 * - Dependency management
 *
 * Now includes self-improving capabilities for better structure recommendations.
 *
 * @module agents/TAN
 */

import {
  InvestigationResult,
  InvestigationStatus,
  Finding,
  LearnedPattern,
  PerformanceMetrics,
  InvestigationMetadata,
} from '@shared/types';
import { SelfImprovingAgent } from './SelfImprovingAgent';
import { InvestigationContext } from '../learning/StrategySelectionEngine';

/**
 * TAN Agent - Trinity Architecture Navigator
 * Enhanced with self-improving capabilities
 */
export class TANAgent extends SelfImprovingAgent {
  /**
   * Execute structure analysis investigation
   * @param context - Investigation context
   * @returns Promise resolving to investigation result
   */
  async executeInvestigation(context: InvestigationContext): Promise<InvestigationResult> {
    const investigationId = this.generateInvestigationId();
    const startTime = new Date();

    // Track investigation start
    this.performanceTracker.trackInvestigationStart(investigationId, 'TAN');

    // Select best strategy based on learned experience
    const strategy = await this.selectBestStrategy(context);

    // Track strategy usage
    this.performanceTracker.trackStrategyStart(investigationId, strategy.strategyId);

    try {
      // Get relevant learned patterns for this context
      const relevantPatterns = await this.getRelevantPatterns(context);

      // Execute investigation using selected strategy
      const findings = await this.analyzeStructure(context, relevantPatterns);

      // Extract new patterns from findings
      const patterns = this.extractStructurePatterns(findings);

      // Create investigation result
      const result: InvestigationResult = {
        id: investigationId,
        type: context.type,
        status: 'completed',
        agent: 'TAN',
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

      // Track completion and learn from results
      await this.performanceTracker.trackInvestigationComplete(investigationId, result);
      await this.learnFromInvestigation(result);

      return result;
    } catch (error) {
      // Track failure
      this.performanceTracker.trackInvestigationFailure(investigationId, error as Error);

      // Check if we have a learned resolution for this error
      const resolution = await this.getErrorResolution(error);

      throw error;
    }
  }

  /**
   * Analyze codebase structure
   * @param context - Investigation context
   * @param learnedPatterns - Patterns learned from previous investigations
   * @returns Promise resolving to findings
   */
  private async analyzeStructure(
    context: InvestigationContext,
    learnedPatterns: LearnedPattern[]
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    // Use learned patterns to guide analysis
    for (const pattern of learnedPatterns) {
      if (pattern.patternType === 'code-structure') {
        // Apply learned pattern detection
        const patternFindings = await this.detectStructurePattern(pattern, context);
        findings.push(...patternFindings);
      }
    }

    // Perform standard structure analysis
    findings.push(...await this.analyzeDirectoryStructure(context));
    findings.push(...await this.analyzeDependencies(context));
    findings.push(...await this.analyzeModuleOrganization(context));

    return findings;
  }

  /**
   * Detect structure pattern from learned knowledge
   */
  private async detectStructurePattern(
    pattern: LearnedPattern,
    context: InvestigationContext
  ): Promise<Finding[]> {
    const findings: Finding[] = [];

    // Apply pattern detection criteria
    // This is a simplified implementation - real version would analyze actual files

    if (pattern.confidence >= 0.8) {
      findings.push({
        id: `pattern-${pattern.patternId}`,
        type: 'observation',
        severity: 'info',
        title: `Learned Pattern: ${pattern.description}`,
        description: `Based on ${pattern.usageCount} previous investigations with ${(pattern.confidence * 100).toFixed(1)}% confidence`,
        location: { file: 'project-root' },
        evidence: pattern.filePaths,
        recommendation: pattern.detectionCriteria,
      });
    }

    return findings;
  }

  /**
   * Analyze directory structure
   */
  private async analyzeDirectoryStructure(context: InvestigationContext): Promise<Finding[]> {
    // Simplified implementation
    return [
      {
        id: 'dir-structure-1',
        type: 'observation',
        severity: 'info',
        title: 'Directory Structure Analysis',
        description: 'Analyzing codebase organization patterns',
        location: { file: '/' },
        evidence: [],
      },
    ];
  }

  /**
   * Analyze dependencies
   */
  private async analyzeDependencies(context: InvestigationContext): Promise<Finding[]> {
    // Simplified implementation
    return [
      {
        id: 'dep-analysis-1',
        type: 'observation',
        severity: 'info',
        title: 'Dependency Analysis',
        description: 'Analyzing module dependencies and coupling',
        location: { file: 'package.json' },
        evidence: [],
      },
    ];
  }

  /**
   * Analyze module organization
   */
  private async analyzeModuleOrganization(context: InvestigationContext): Promise<Finding[]> {
    // Simplified implementation
    return [
      {
        id: 'module-org-1',
        type: 'observation',
        severity: 'info',
        title: 'Module Organization',
        description: 'Analyzing module boundaries and cohesion',
        location: { file: 'src/' },
        evidence: [],
      },
    ];
  }

  /**
   * Extract structure patterns from findings
   */
  private extractStructurePatterns(findings: Finding[]): LearnedPattern[] {
    const patterns: LearnedPattern[] = [];

    // Extract patterns from findings
    // This is simplified - real version would do sophisticated pattern extraction

    for (const finding of findings) {
      if (finding.type === 'issue' && finding.severity === 'high') {
        patterns.push({
          patternId: `tan-pattern-${Date.now()}`,
          patternType: 'code-structure',
          description: finding.title,
          detectionCriteria: finding.description,
          accuracy: 0.8,
          confidence: 0.5,
          usageCount: 1,
          successCount: 1,
          lastSeen: new Date(),
          agentId: 'TAN',
          investigationIds: [],
          tags: ['structure', 'architecture'],
          filePaths: [finding.location.file],
          errorTypes: [],
        });
      }
    }

    return patterns;
  }

  /**
   * Generate recommendations based on findings
   */
  private generateRecommendations(findings: Finding[]): any[] {
    return findings
      .filter(f => f.severity === 'high' || f.severity === 'critical')
      .map(f => ({
        id: `rec-${f.id}`,
        type: 'refactor',
        priority: f.severity,
        title: `Address: ${f.title}`,
        description: f.recommendation || f.description,
        rationale: 'Improve code structure and maintainability',
        effort: 'medium',
        impact: 'high',
        location: f.location,
      }));
  }

  /**
   * Collect performance metrics
   */
  private async collectMetrics(investigationId: string): Promise<PerformanceMetrics> {
    return {
      duration: 0, // Will be set by tracker
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
   * Create investigation metadata
   */
  private createMetadata(
    investigationId: string,
    context: InvestigationContext
  ): InvestigationMetadata {
    return {
      investigationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'TAN',
      tags: ['structure', 'architecture', ...context.scope],
      priority: context.estimatedComplexity === 'high' ? 'high' : 'medium',
    };
  }

  /**
   * Generate unique investigation ID
   */
  private generateInvestigationId(): string {
    return `tan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
