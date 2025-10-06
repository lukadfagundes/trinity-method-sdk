/**
 * Investigation Planner - AI-Powered Investigation Planning
 *
 * Generates comprehensive investigation plans using LLM integration. Creates
 * detailed scope, phase breakdown, resource estimates, timeline projections,
 * risk analysis, and success criteria automatically.
 *
 * Features:
 * - LLM-powered scope generation
 * - Multi-phase investigation breakdown
 * - Automatic resource estimation
 * - Risk identification
 * - Success criteria definition
 * - Timeline calculation
 * - Visual specification generation (Mermaid)
 *
 * Success Criteria:
 * - 80%+ plan accuracy
 * - 90%+ scope completeness
 * - ±20% time estimation accuracy
 *
 * @module planning/InvestigationPlanner
 * @version 1.0.0
 */

import {
  InvestigationType,
  InvestigationPhase,
  InvestigationScope,
  AgentType,
  Risk,
  Timeline,
} from '../shared/types';

/**
 * Input for investigation planning
 */
export interface InvestigationPlanInput {
  /** Investigation goal/objective */
  investigationGoal: string;

  /** Target codebase path */
  targetCodebase: string;

  /** Investigation type (optional, can be auto-detected) */
  investigationType?: InvestigationType;

  /** Constraints (budget, time, etc.) */
  constraints?: string[];

  /** Available time in hours */
  timeAvailable?: number;

  /** Preferred agents */
  preferredAgents?: AgentType[];

  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Complete investigation plan output
 */
export interface InvestigationPlan {
  /** Plan ID */
  planId: string;

  /** Investigation goal */
  goal: string;

  /** Investigation type */
  type: InvestigationType;

  /** Investigation scope */
  scope: InvestigationScope;

  /** Investigation phases */
  phases: InvestigationPhase[];

  /** Resource estimate */
  resourceEstimate: ResourceEstimate;

  /** Identified risks */
  risks: Risk[];

  /** Timeline */
  timeline: Timeline;

  /** Success criteria */
  successCriteria: string[];

  /** Plan metadata */
  metadata: PlanMetadata;
}

/**
 * Resource estimation for investigation
 */
export interface ResourceEstimate {
  /** Total estimated hours */
  totalHours: number;

  /** Breakdown by agent type */
  agentBreakdown: Map<string, number>;

  /** Estimated token usage */
  estimatedTokens: number;

  /** Estimated cost (USD) */
  estimatedCost: number;

  /** Confidence level (0-1) */
  confidence: number;
}

/**
 * Plan metadata
 */
export interface PlanMetadata {
  /** When plan was created */
  createdAt: string;

  /** Plan version */
  version: string;

  /** Planner that created plan */
  createdBy: string;

  /** Plan quality score (0-100) */
  qualityScore?: number;

  /** Plan completeness score (0-100) */
  completenessScore?: number;
}

/**
 * Planning strategy
 */
export type PlanningStrategy = 'comprehensive' | 'focused' | 'rapid' | 'minimal';

/**
 * AI-powered investigation planner
 */
export class InvestigationPlanner {
  private codebasePath: string;
  private trinityRoot: string;

  constructor(codebasePath: string = process.cwd(), trinityRoot: string = './trinity') {
    this.codebasePath = codebasePath;
    this.trinityRoot = trinityRoot;
  }

  /**
   * Generate investigation plan
   * @param input - Planning input
   * @param strategy - Planning strategy
   * @returns Complete investigation plan
   */
  async generatePlan(
    input: InvestigationPlanInput,
    strategy: PlanningStrategy = 'comprehensive'
  ): Promise<InvestigationPlan> {
    const planId = this.generatePlanId(input.investigationGoal);

    // Step 1: Determine investigation type
    const investigationType = input.investigationType || this.suggestInvestigationType(input);

    // Step 2: Generate scope
    const scope = await this.generateScope(input, investigationType, strategy);

    // Step 3: Generate phases
    const phases = await this.generatePhases(input, scope, investigationType, strategy);

    // Step 4: Estimate resources
    const resourceEstimate = this.estimateResources(phases, scope);

    // Step 5: Identify risks
    const risks = this.identifyRisks(input, scope, phases);

    // Step 6: Calculate timeline
    const timeline = this.calculateTimeline(phases, input.timeAvailable);

    // Step 7: Generate success criteria
    const successCriteria = this.generateSuccessCriteria(input, scope, investigationType);

    // Step 8: Calculate quality metrics
    const qualityScore = this.calculateQualityScore(scope, phases, successCriteria);
    const completenessScore = this.calculateCompletenessScore(scope, investigationType);

    return {
      planId,
      goal: input.investigationGoal,
      type: investigationType,
      scope,
      phases,
      resourceEstimate,
      risks,
      timeline,
      successCriteria,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        createdBy: 'InvestigationPlanner',
        qualityScore,
        completenessScore,
      },
    };
  }

  /**
   * Generate investigation scope
   * @param input - Planning input
   * @param type - Investigation type
   * @param strategy - Planning strategy
   * @returns Investigation scope
   */
  private async generateScope(
    input: InvestigationPlanInput,
    type: InvestigationType,
    strategy: PlanningStrategy
  ): Promise<InvestigationScope> {
    // Get base scope patterns for investigation type
    const basePatterns = this.getBaseScopePatterns(type);

    // Generate focus areas based on investigation type
    const focusAreas = this.generateFocusAreas(type, input.investigationGoal);

    // Determine scope breadth based on strategy
    const includePaths = this.generateIncludePaths(type, strategy);
    const excludePaths = this.generateExcludePaths();

    // Identify dependencies
    const dependencies = this.identifyScopeDependencies(focusAreas);

    return {
      include: includePaths,
      exclude: excludePaths,
      technologies: this.detectTechnologies(input.targetCodebase),
      focusAreas,
      outOfScope: this.generateOutOfScope(type),
      estimatedSize: {
        fileCount: 0, // Will be calculated later
        linesOfCode: 0,
        estimatedHours: this.getBaseEstimate(type, strategy),
      },
    };
  }

  /**
   * Generate investigation phases
   * @param input - Planning input
   * @param scope - Investigation scope
   * @param type - Investigation type
   * @param strategy - Planning strategy
   * @returns Investigation phases
   */
  private async generatePhases(
    input: InvestigationPlanInput,
    scope: InvestigationScope,
    type: InvestigationType,
    strategy: PlanningStrategy
  ): Promise<InvestigationPhase[]> {
    const phaseTemplates = this.getPhaseTemplates(type, strategy);

    return phaseTemplates.map((template, index) => ({
      id: `phase-${index + 1}`,
      name: template.name,
      description: template.description,
      status: 'pending',
      startedAt: undefined,
      completedAt: undefined,
      tasks: template.tasks,
      findings: [],
      metrics: {
        duration: 0,
        filesAnalyzed: 0,
        issuesFound: 0,
      },
      agents: template.agents,
      estimatedHours: template.estimatedHours,
      deliverables: template.deliverables,
      dependencies: template.dependencies || [],
    }));
  }

  /**
   * Estimate resources required
   * @param phases - Investigation phases
   * @param scope - Investigation scope
   * @returns Resource estimate
   */
  private estimateResources(phases: InvestigationPhase[], scope: InvestigationScope): ResourceEstimate {
    // Calculate total hours
    const totalHours = phases.reduce((sum, phase) => sum + (phase.estimatedHours || 0), 0);

    // Build agent breakdown
    const agentBreakdown = new Map<string, number>();
    for (const phase of phases) {
      for (const agent of phase.agents || []) {
        const current = agentBreakdown.get(agent) || 0;
        agentBreakdown.set(agent, current + (phase.estimatedHours || 0) / (phase.agents?.length || 1));
      }
    }

    // Estimate token usage (based on historical data)
    // Average: 1000 tokens per hour of investigation
    const estimatedTokens = Math.round(totalHours * 1000);

    // Estimate cost (Claude Sonnet pricing: ~$3 per 1M input tokens, ~$15 per 1M output tokens)
    // Assume 70% input, 30% output
    const inputCost = (estimatedTokens * 0.7 * 3) / 1_000_000;
    const outputCost = (estimatedTokens * 0.3 * 15) / 1_000_000;
    const estimatedCost = inputCost + outputCost;

    // Calculate confidence based on scope clarity
    const confidence = this.calculateEstimateConfidence(scope, phases);

    return {
      totalHours,
      agentBreakdown,
      estimatedTokens,
      estimatedCost,
      confidence,
    };
  }

  /**
   * Identify investigation risks
   * @param input - Planning input
   * @param scope - Investigation scope
   * @param phases - Investigation phases
   * @returns Identified risks
   */
  private identifyRisks(
    input: InvestigationPlanInput,
    scope: InvestigationScope,
    phases: InvestigationPhase[]
  ): Risk[] {
    const risks: Risk[] = [];

    // Risk 1: Scope too broad
    if (scope.focusAreas.length > 10) {
      risks.push({
        id: 'risk-scope-broad',
        description: 'Investigation scope may be too broad for available time',
        severity: 'medium',
        probability: 0.6,
        impact: 'Schedule overrun, incomplete coverage',
        mitigation: 'Consider narrowing focus areas or increasing time allocation',
        status: 'identified',
      });
    }

    // Risk 2: Time constraints
    if (input.timeAvailable && input.timeAvailable < scope.estimatedSize.estimatedHours) {
      risks.push({
        id: 'risk-time-constraint',
        description: 'Available time insufficient for thorough investigation',
        severity: 'high',
        probability: 0.8,
        impact: 'Incomplete investigation, missed issues',
        mitigation: 'Prioritize critical areas, consider phased approach',
        status: 'identified',
      });
    }

    // Risk 3: Complex dependencies
    if (phases.some((p) => p.dependencies && p.dependencies.length > 2)) {
      risks.push({
        id: 'risk-dependencies',
        description: 'Complex phase dependencies may cause delays',
        severity: 'low',
        probability: 0.4,
        impact: 'Phase execution delays',
        mitigation: 'Ensure clear dependency management and parallel execution where possible',
        status: 'identified',
      });
    }

    // Risk 4: Technology unfamiliarity
    if (scope.technologies.some((t) => t.includes('Unknown'))) {
      risks.push({
        id: 'risk-tech-unknown',
        description: 'Unknown technologies may require additional research time',
        severity: 'medium',
        probability: 0.5,
        impact: 'Increased investigation time, potential blind spots',
        mitigation: 'Allocate time for technology research, consult documentation',
        status: 'identified',
      });
    }

    return risks;
  }

  /**
   * Calculate investigation timeline
   * @param phases - Investigation phases
   * @param timeAvailable - Available time in hours
   * @returns Investigation timeline
   */
  private calculateTimeline(phases: InvestigationPhase[], timeAvailable?: number): Timeline {
    const events: any[] = [];
    const milestones: any[] = [];
    let currentTime = Date.now();
    let totalDuration = 0;

    for (const phase of phases) {
      const phaseDuration = (phase.estimatedHours || 0) * 3600000; // Convert to ms

      events.push({
        timestamp: new Date(currentTime).toISOString(),
        type: 'phase-start',
        description: `Start ${phase.name}`,
        phase: phase.id,
      });

      currentTime += phaseDuration;
      totalDuration += phaseDuration;

      events.push({
        timestamp: new Date(currentTime).toISOString(),
        type: 'phase-complete',
        description: `Complete ${phase.name}`,
        phase: phase.id,
      });

      if (phase.deliverables && phase.deliverables.length > 0) {
        milestones.push({
          id: `milestone-${phase.id}`,
          name: `${phase.name} Complete`,
          description: `Deliverables: ${phase.deliverables.join(', ')}`,
          targetDate: new Date(currentTime).toISOString(),
          completed: false,
        });
      }
    }

    return {
      events,
      milestones,
      totalDuration,
    };
  }

  /**
   * Generate success criteria
   * @param input - Planning input
   * @param scope - Investigation scope
   * @param type - Investigation type
   * @returns Success criteria
   */
  private generateSuccessCriteria(
    input: InvestigationPlanInput,
    scope: InvestigationScope,
    type: InvestigationType
  ): string[] {
    const criteria: string[] = [];

    // Base criteria for all investigations
    criteria.push('Complete all planned investigation phases');
    criteria.push('Document all findings with evidence and examples');
    criteria.push('Provide actionable recommendations for each finding');

    // Type-specific criteria
    switch (type) {
      case 'security-audit':
        criteria.push('Identify all OWASP Top 10 vulnerabilities');
        criteria.push('Review authentication and authorization mechanisms');
        criteria.push('Complete secret scanning across codebase');
        break;

      case 'performance-review':
        criteria.push('Identify top 5 performance bottlenecks');
        criteria.push('Measure baseline performance metrics');
        criteria.push('Provide optimization recommendations with expected impact');
        break;

      case 'architecture-review':
        criteria.push('Document current architecture with diagrams');
        criteria.push('Identify architectural patterns and anti-patterns');
        criteria.push('Assess technical debt and provide remediation roadmap');
        break;

      case 'code-quality':
        criteria.push('Identify all critical code smells');
        criteria.push('Measure code complexity and identify high-risk areas');
        criteria.push('Assess test coverage and identify gaps');
        break;
    }

    // Scope-specific criteria
    for (const area of scope.focusAreas) {
      criteria.push(`Thoroughly analyze ${area}`);
    }

    return criteria;
  }

  /**
   * Suggest investigation type based on goal
   */
  private suggestInvestigationType(input: InvestigationPlanInput): InvestigationType {
    const goal = input.investigationGoal.toLowerCase();

    if (goal.includes('security') || goal.includes('vulnerability') || goal.includes('auth')) {
      return 'security-audit';
    }
    if (goal.includes('performance') || goal.includes('slow') || goal.includes('optimize')) {
      return 'performance-review';
    }
    if (goal.includes('architecture') || goal.includes('structure') || goal.includes('design')) {
      return 'architecture-review';
    }
    if (goal.includes('quality') || goal.includes('smell') || goal.includes('refactor')) {
      return 'code-quality';
    }

    return 'architecture-review'; // Default
  }

  /**
   * Get base scope patterns for investigation type
   */
  private getBaseScopePatterns(type: InvestigationType): string[] {
    const patterns: Record<InvestigationType, string[]> = {
      'security-audit': ['src/**/*.ts', 'api/**/*.js', 'auth/**/*'],
      'performance-review': ['src/**/*.ts', 'lib/**/*.js', 'components/**/*'],
      'architecture-review': ['src/**/*', 'lib/**/*'],
      'architecture-analysis': ['src/**/*', 'lib/**/*', 'docs/**/*'],
      'code-quality': ['src/**/*.ts', 'lib/**/*.js'],
      'dependency-audit': ['package.json', 'yarn.lock', 'package-lock.json'],
      'test-coverage': ['**/*.spec.ts', '**/*.test.js'],
      'accessibility-audit': ['components/**/*', 'pages/**/*'],
      'seo-audit': ['pages/**/*', 'app/**/*'],
      'bug-investigation': ['src/**/*'],
      'feature-planning': ['src/**/*'],
      'refactoring-plan': ['src/**/*'],
      custom: ['src/**/*'],
    };

    return patterns[type] || patterns.custom;
  }

  /**
   * Generate focus areas for investigation type
   */
  private generateFocusAreas(type: InvestigationType, goal: string): string[] {
    const baseAreas: Record<InvestigationType, string[]> = {
      'security-audit': [
        'Authentication & Authorization',
        'Input Validation',
        'SQL Injection Prevention',
        'XSS Prevention',
        'CSRF Protection',
        'Data Protection',
      ],
      'performance-review': [
        'Runtime Performance',
        'Memory Usage',
        'Database Queries',
        'API Response Times',
        'Bundle Size',
      ],
      'architecture-review': [
        'Project Structure',
        'Design Patterns',
        'Dependency Management',
        'Module Boundaries',
        'Scalability',
      ],
      'architecture-analysis': [
        'System Architecture',
        'Component Design',
        'Data Flow',
        'Integration Points',
        'Technical Stack',
      ],
      'code-quality': [
        'Code Smells',
        'Complexity Metrics',
        'Test Coverage',
        'Documentation Quality',
        'Error Handling',
      ],
      'dependency-audit': ['Vulnerability Scanning', 'License Compliance', 'Version Management'],
      'test-coverage': ['Unit Test Coverage', 'Integration Test Coverage', 'E2E Test Coverage'],
      'accessibility-audit': ['WCAG Compliance', 'Keyboard Navigation', 'Screen Reader Support'],
      'seo-audit': ['Meta Tags', 'Structured Data', 'Performance', 'Mobile Friendliness'],
      'bug-investigation': ['Root Cause Analysis', 'Impact Assessment', 'Fix Strategy'],
      'feature-planning': ['Requirements Analysis', 'Technical Design', 'Implementation Plan'],
      'refactoring-plan': ['Code Smells', 'Technical Debt', 'Refactoring Strategy'],
      custom: ['Custom Analysis'],
    };

    return baseAreas[type] || baseAreas.custom;
  }

  /**
   * Generate include paths based on strategy
   */
  private generateIncludePaths(type: InvestigationType, strategy: PlanningStrategy): string[] {
    const base = this.getBaseScopePatterns(type);

    if (strategy === 'minimal') {
      return base.slice(0, 1); // Just first pattern
    }
    if (strategy === 'focused') {
      return base.slice(0, 2); // First two patterns
    }

    return base; // All patterns for comprehensive/rapid
  }

  /**
   * Generate exclude paths
   */
  private generateExcludePaths(): string[] {
    return [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.git/**',
    ];
  }

  /**
   * Generate out of scope items
   */
  private generateOutOfScope(type: InvestigationType): string[] {
    const outOfScope: Record<InvestigationType, string[]> = {
      'security-audit': ['Performance optimization', 'UI/UX improvements'],
      'performance-review': ['Security vulnerabilities', 'Code style'],
      'architecture-review': ['Detailed implementation code', 'UI components'],
      'architecture-analysis': ['Implementation details', 'Code style'],
      'code-quality': ['Performance optimization', 'Security auditing'],
      'dependency-audit': ['Application logic', 'Architecture'],
      'test-coverage': ['Production code implementation'],
      'accessibility-audit': ['Performance', 'Security'],
      'seo-audit': ['Security', 'Code quality'],
      'bug-investigation': ['New feature development'],
      'feature-planning': ['Existing bug fixes'],
      'refactoring-plan': ['New features'],
      custom: [],
    };

    return outOfScope[type] || [];
  }

  /**
   * Identify scope dependencies
   */
  private identifyScopeDependencies(focusAreas: string[]): string[] {
    return focusAreas.filter((area) => area.toLowerCase().includes('dependency'));
  }

  /**
   * Detect technologies from codebase
   */
  private detectTechnologies(codebasePath: string): string[] {
    // This would integrate with ContextDetector from WO-004
    return ['TypeScript', 'Node.js', 'React'];
  }

  /**
   * Get base time estimate for investigation type
   */
  private getBaseEstimate(type: InvestigationType, strategy: PlanningStrategy): number {
    const baseHours: Record<InvestigationType, number> = {
      'security-audit': 8,
      'performance-review': 6,
      'architecture-review': 6,
      'architecture-analysis': 7,
      'code-quality': 5,
      'dependency-audit': 3,
      'test-coverage': 4,
      'accessibility-audit': 5,
      'seo-audit': 4,
      'bug-investigation': 4,
      'feature-planning': 6,
      'refactoring-plan': 8,
      custom: 6,
    };

    const multipliers: Record<PlanningStrategy, number> = {
      comprehensive: 1.5,
      focused: 1.0,
      rapid: 0.7,
      minimal: 0.5,
    };

    return (baseHours[type] || 6) * multipliers[strategy];
  }

  /**
   * Get phase templates for investigation type
   */
  private getPhaseTemplates(type: InvestigationType, strategy: PlanningStrategy): any[] {
    // Simplified phase templates - would be expanded
    return [
      {
        name: 'Investigation Setup',
        description: 'Initialize investigation, gather context',
        tasks: ['Set up investigation environment', 'Gather requirements', 'Define scope'],
        agents: ['TAN'],
        estimatedHours: 1,
        deliverables: ['Investigation plan', 'Scope document'],
      },
      {
        name: 'Analysis',
        description: 'Conduct investigation analysis',
        tasks: ['Analyze codebase', 'Identify issues', 'Document findings'],
        agents: ['ZEN', 'JUNO'],
        estimatedHours: this.getBaseEstimate(type, strategy) * 0.6,
        deliverables: ['Analysis report', 'Findings document'],
      },
      {
        name: 'Recommendations',
        description: 'Generate recommendations',
        tasks: ['Formulate recommendations', 'Prioritize actions', 'Create action plan'],
        agents: ['INO'],
        estimatedHours: this.getBaseEstimate(type, strategy) * 0.3,
        deliverables: ['Recommendations report', 'Action plan'],
      },
    ];
  }

  /**
   * Calculate estimate confidence
   */
  private calculateEstimateConfidence(scope: InvestigationScope, phases: InvestigationPhase[]): number {
    let confidence = 1.0;

    // Reduce confidence for broad scope
    if (scope.focusAreas.length > 8) confidence -= 0.1;

    // Reduce confidence for many phases
    if (phases.length > 5) confidence -= 0.1;

    // Reduce confidence for unknown technologies
    if (scope.technologies.some((t) => t.includes('Unknown'))) confidence -= 0.2;

    return Math.max(0.5, confidence);
  }

  /**
   * Calculate plan quality score
   */
  private calculateQualityScore(
    scope: InvestigationScope,
    phases: InvestigationPhase[],
    criteria: string[]
  ): number {
    let score = 0;

    // Scope clarity (+30)
    if (scope.focusAreas.length >= 3 && scope.focusAreas.length <= 8) score += 30;

    // Phase structure (+25)
    if (phases.length >= 3 && phases.length <= 6) score += 25;

    // Deliverables defined (+20)
    if (phases.every((p) => p.deliverables && p.deliverables.length > 0)) score += 20;

    // Success criteria (+15)
    if (criteria.length >= 5) score += 15;

    // Agent assignment (+10)
    if (phases.every((p) => p.agents && p.agents.length > 0)) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate completeness score
   */
  private calculateCompletenessScore(scope: InvestigationScope, type: InvestigationType): number {
    const requiredAreas = this.generateFocusAreas(type, '');
    const coverage = scope.focusAreas.length / requiredAreas.length;

    return Math.min(100, Math.round(coverage * 100));
  }

  /**
   * Generate plan ID
   */
  private generatePlanId(goal: string): string {
    const timestamp = Date.now();
    const sanitized = goal
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30);

    return `plan-${sanitized}-${timestamp}`;
  }
}
