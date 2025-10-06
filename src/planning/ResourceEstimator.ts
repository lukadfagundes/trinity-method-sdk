/**
 * Resource Estimator - Investigation Resource Calculation
 *
 * Calculates detailed resource estimates for investigations including:
 * - Time estimation (hours by agent, phase, task)
 * - Token usage estimation
 * - Cost calculation
 * - Agent capacity planning
 * - Confidence scoring
 *
 * Uses historical data and ML-based estimation when available.
 *
 * @module planning/ResourceEstimator
 * @version 1.0.0
 */

import { InvestigationPhase, InvestigationScope, AgentType } from '../shared/types';

import { ResourceEstimate } from './InvestigationPlanner';

/**
 * Historical investigation data for estimation
 */
export interface HistoricalData {
  /** Investigation type */
  type: string;

  /** Actual hours spent */
  actualHours: number;

  /** Estimated hours */
  estimatedHours: number;

  /** Actual tokens used */
  actualTokens: number;

  /** Scope size (LOC) */
  scopeSize: number;

  /** Number of focus areas */
  focusAreasCount: number;

  /** Completion timestamp */
  completedAt: string;
}

/**
 * Agent capacity information
 */
export interface AgentCapacity {
  /** Agent type */
  agentType: AgentType;

  /** Available hours */
  availableHours: number;

  /** Current utilization (0-1) */
  currentUtilization: number;

  /** Skills/specializations */
  skills: string[];
}

/**
 * Detailed resource breakdown
 */
export interface DetailedResourceEstimate extends ResourceEstimate {
  /** Breakdown by phase */
  phaseBreakdown: Map<string, PhaseResourceEstimate>;

  /** Agent capacity analysis */
  agentCapacity: Map<string, AgentCapacityStatus>;

  /** Estimation method used */
  estimationMethod: 'historical' | 'rule-based' | 'ml-based';

  /** Similar past investigations */
  similarInvestigations?: string[];
}

/**
 * Phase-specific resource estimate
 */
export interface PhaseResourceEstimate {
  /** Phase ID */
  phaseId: string;

  /** Estimated hours */
  hours: number;

  /** Estimated tokens */
  tokens: number;

  /** Estimated cost */
  cost: number;

  /** Required agents */
  agents: AgentType[];
}

/**
 * Agent capacity status
 */
export interface AgentCapacityStatus {
  /** Agent type */
  agentType: AgentType;

  /** Required hours */
  requiredHours: number;

  /** Available hours */
  availableHours: number;

  /** Over/under capacity */
  capacityDelta: number;

  /** Utilization percentage */
  utilization: number;

  /** Status */
  status: 'available' | 'at-capacity' | 'overallocated';
}

/**
 * Resource estimator with historical data integration
 */
export class ResourceEstimator {
  private historicalData: HistoricalData[] = [];
  private agentCapacities: Map<AgentType, AgentCapacity> = new Map();

  constructor() {
    this.initializeDefaultCapacities();
  }

  /**
   * Estimate resources for investigation
   * @param phases - Investigation phases
   * @param scope - Investigation scope
   * @param useHistorical - Whether to use historical data
   * @returns Detailed resource estimate
   */
  estimateResources(
    phases: InvestigationPhase[],
    scope: InvestigationScope,
    useHistorical: boolean = true
  ): DetailedResourceEstimate {
    const method = this.selectEstimationMethod(useHistorical);

    // Calculate base estimates
    const { totalHours, agentBreakdown } = this.calculateTimeEstimate(phases, scope, method);
    const estimatedTokens = this.calculateTokenEstimate(totalHours, scope);
    const estimatedCost = this.calculateCostEstimate(estimatedTokens);
    const confidence = this.calculateConfidence(scope, phases, method);

    // Calculate detailed breakdowns
    const phaseBreakdown = this.calculatePhaseBreakdown(phases, scope);
    const agentCapacity = this.analyzeAgentCapacity(agentBreakdown);

    // Find similar investigations
    const similarInvestigations = useHistorical ? this.findSimilarInvestigations(scope) : undefined;

    return {
      totalHours,
      agentBreakdown,
      estimatedTokens,
      estimatedCost,
      confidence,
      phaseBreakdown,
      agentCapacity,
      estimationMethod: method,
      similarInvestigations,
    };
  }

  /**
   * Add historical investigation data
   * @param data - Historical investigation data
   */
  addHistoricalData(data: HistoricalData): void {
    this.historicalData.push(data);
  }

  /**
   * Update agent capacity
   * @param agentType - Agent type
   * @param capacity - Capacity information
   */
  updateAgentCapacity(agentType: AgentType, capacity: Partial<AgentCapacity>): void {
    const current = this.agentCapacities.get(agentType) || this.getDefaultCapacity(agentType);
    this.agentCapacities.set(agentType, { ...current, ...capacity });
  }

  /**
   * Calculate time estimate
   */
  private calculateTimeEstimate(
    phases: InvestigationPhase[],
    scope: InvestigationScope,
    method: 'historical' | 'rule-based' | 'ml-based'
  ): { totalHours: number; agentBreakdown: Map<string, number> } {
    if (method === 'historical' && this.historicalData.length > 0) {
      return this.historicalBasedEstimate(phases, scope);
    }

    return this.ruleBasedEstimate(phases, scope);
  }

  /**
   * Historical data-based estimation
   */
  private historicalBasedEstimate(
    phases: InvestigationPhase[],
    scope: InvestigationScope
  ): { totalHours: number; agentBreakdown: Map<string, number> } {
    // Find similar investigations
    const similar = this.historicalData.filter(
      (h) => Math.abs(h.focusAreasCount - scope.focusAreas.length) <= 2
    );

    if (similar.length === 0) {
      return this.ruleBasedEstimate(phases, scope);
    }

    // Calculate average historical accuracy
    const avgAccuracy =
      similar.reduce((sum, h) => sum + h.actualHours / h.estimatedHours, 0) / similar.length;

    // Adjust base estimate by historical accuracy
    const baseEstimate = this.ruleBasedEstimate(phases, scope);
    const adjustedTotal = baseEstimate.totalHours * avgAccuracy;

    // Adjust agent breakdown proportionally
    const agentBreakdown = new Map<string, number>();
    for (const [agent, hours] of baseEstimate.agentBreakdown) {
      agentBreakdown.set(agent, hours * avgAccuracy);
    }

    return {
      totalHours: adjustedTotal,
      agentBreakdown,
    };
  }

  /**
   * Rule-based estimation
   */
  private ruleBasedEstimate(
    phases: InvestigationPhase[],
    scope: InvestigationScope
  ): { totalHours: number; agentBreakdown: Map<string, number> } {
    let totalHours = 0;
    const agentBreakdown = new Map<string, number>();

    for (const phase of phases) {
      const phaseHours = phase.estimatedHours || 0;
      totalHours += phaseHours;

      // Distribute phase hours among agents
      const agentsCount = phase.agents?.length || 1;
      const hoursPerAgent = phaseHours / agentsCount;

      for (const agent of phase.agents || []) {
        const current = agentBreakdown.get(agent) || 0;
        agentBreakdown.set(agent, current + hoursPerAgent);
      }
    }

    // Apply scope complexity multiplier
    const complexityMultiplier = this.calculateComplexityMultiplier(scope);
    totalHours *= complexityMultiplier;

    for (const [agent, hours] of agentBreakdown) {
      agentBreakdown.set(agent, hours * complexityMultiplier);
    }

    return { totalHours, agentBreakdown };
  }

  /**
   * Calculate complexity multiplier based on scope
   */
  private calculateComplexityMultiplier(scope: InvestigationScope): number {
    let multiplier = 1.0;

    // More focus areas = more complex
    if (scope.focusAreas.length > 8) multiplier += 0.2;
    if (scope.focusAreas.length > 12) multiplier += 0.2;

    // Large codebase = more complex
    if (scope.estimatedSize.linesOfCode > 50000) multiplier += 0.15;
    if (scope.estimatedSize.linesOfCode > 100000) multiplier += 0.15;

    // Multiple technologies = more complex
    if (scope.technologies.length > 3) multiplier += 0.1;

    return multiplier;
  }

  /**
   * Calculate token estimate
   */
  private calculateTokenEstimate(hours: number, scope: InvestigationScope): number {
    // Base token rate: 1000 tokens per hour of investigation
    let tokensPerHour = 1000;

    // Adjust based on scope size
    if (scope.estimatedSize.linesOfCode > 50000) tokensPerHour *= 1.3;
    if (scope.estimatedSize.linesOfCode > 100000) tokensPerHour *= 1.5;

    // Adjust based on focus areas (more areas = more prompts)
    tokensPerHour *= 1 + scope.focusAreas.length * 0.05;

    return Math.round(hours * tokensPerHour);
  }

  /**
   * Calculate cost estimate
   */
  private calculateCostEstimate(tokens: number): number {
    // Claude Sonnet 4.5 pricing (as of 2025)
    // Input: $3 per 1M tokens
    // Output: $15 per 1M tokens
    // Assume 70% input, 30% output

    const inputTokens = tokens * 0.7;
    const outputTokens = tokens * 0.3;

    const inputCost = (inputTokens * 3) / 1_000_000;
    const outputCost = (outputTokens * 15) / 1_000_000;

    return Math.round((inputCost + outputCost) * 100) / 100; // Round to 2 decimals
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(
    scope: InvestigationScope,
    phases: InvestigationPhase[],
    method: 'historical' | 'rule-based' | 'ml-based'
  ): number {
    let confidence = 0.7; // Base confidence for rule-based

    // Higher confidence for historical method
    if (method === 'historical') {
      confidence = 0.85;
    }

    // Reduce for unclear scope
    if (scope.focusAreas.length < 3) confidence -= 0.1;
    if (scope.focusAreas.length > 12) confidence -= 0.1;

    // Reduce for unknown technologies
    if (scope.technologies.some((t) => t.toLowerCase().includes('unknown'))) {
      confidence -= 0.15;
    }

    // Reduce for incomplete phase definitions
    const incompletePhases = phases.filter((p) => !p.estimatedHours || p.estimatedHours === 0);
    if (incompletePhases.length > 0) {
      confidence -= 0.1;
    }

    return Math.max(0.3, Math.min(1.0, confidence));
  }

  /**
   * Calculate phase-by-phase breakdown
   */
  private calculatePhaseBreakdown(
    phases: InvestigationPhase[],
    scope: InvestigationScope
  ): Map<string, PhaseResourceEstimate> {
    const breakdown = new Map<string, PhaseResourceEstimate>();

    for (const phase of phases) {
      const hours = phase.estimatedHours || 0;
      const tokens = this.calculateTokenEstimate(hours, scope);
      const cost = this.calculateCostEstimate(tokens);

      breakdown.set(phase.id, {
        phaseId: phase.id,
        hours,
        tokens,
        cost,
        agents: (phase.agents as AgentType[]) || [],
      });
    }

    return breakdown;
  }

  /**
   * Analyze agent capacity
   */
  private analyzeAgentCapacity(agentBreakdown: Map<string, number>): Map<string, AgentCapacityStatus> {
    const analysis = new Map<string, AgentCapacityStatus>();

    for (const [agentType, requiredHours] of agentBreakdown) {
      const capacity = this.agentCapacities.get(agentType as AgentType);

      if (!capacity) continue;

      const availableHours = capacity.availableHours;
      const capacityDelta = availableHours - requiredHours;
      const utilization = Math.min(1.0, requiredHours / availableHours);

      let status: 'available' | 'at-capacity' | 'overallocated';
      if (capacityDelta > 0) status = 'available';
      else if (capacityDelta === 0) status = 'at-capacity';
      else status = 'overallocated';

      analysis.set(agentType, {
        agentType: agentType as AgentType,
        requiredHours,
        availableHours,
        capacityDelta,
        utilization,
        status,
      });
    }

    return analysis;
  }

  /**
   * Find similar past investigations
   */
  private findSimilarInvestigations(scope: InvestigationScope): string[] {
    // Find investigations with similar scope size and focus area count
    const similar = this.historicalData
      .filter((h) => {
        const focusAreaDiff = Math.abs(h.focusAreasCount - scope.focusAreas.length);
        const sizeDiff = Math.abs(h.scopeSize - scope.estimatedSize.linesOfCode);
        return focusAreaDiff <= 2 && sizeDiff < 20000;
      })
      .slice(0, 5)
      .map((h) => `${h.type} (${h.actualHours}h, ${h.focusAreasCount} areas)`);

    return similar;
  }

  /**
   * Select estimation method
   */
  private selectEstimationMethod(useHistorical: boolean): 'historical' | 'rule-based' | 'ml-based' {
    if (useHistorical && this.historicalData.length >= 5) {
      return 'historical';
    }
    return 'rule-based';
  }

  /**
   * Initialize default agent capacities
   */
  private initializeDefaultCapacities(): void {
    const defaultHours = 40; // 40 hours per week

    this.agentCapacities.set('TAN', {
      agentType: 'TAN',
      availableHours: defaultHours,
      currentUtilization: 0,
      skills: ['structure-analysis', 'dependency-mapping', 'baseline-creation'],
    });

    this.agentCapacities.set('ZEN', {
      agentType: 'ZEN',
      availableHours: defaultHours,
      currentUtilization: 0,
      skills: ['documentation', 'knowledge-capture', 'pattern-documentation'],
    });

    this.agentCapacities.set('INO', {
      agentType: 'INO',
      availableHours: defaultHours,
      currentUtilization: 0,
      skills: ['context-management', 'issue-tracking', 'research'],
    });

    this.agentCapacities.set('JUNO', {
      agentType: 'JUNO',
      availableHours: defaultHours,
      currentUtilization: 0,
      skills: ['quality-audit', 'code-review', 'validation'],
    });
  }

  /**
   * Get default capacity for agent
   */
  private getDefaultCapacity(agentType: AgentType): AgentCapacity {
    return {
      agentType,
      availableHours: 40,
      currentUtilization: 0,
      skills: [],
    };
  }
}
