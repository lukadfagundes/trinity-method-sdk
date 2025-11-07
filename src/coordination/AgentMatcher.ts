/**
 * AgentMatcher - Skill-based agent selection with intelligent workload balancing
 *
 * @see docs/agents/agent-selection-guide.md - Agent capabilities and specializations
 * @see docs/workflows/implementation-workflow.md - Task assignment workflow
 *
 * **Trinity Principle:** "Investigation-First Development"
 * Matches tasks to agents based on skill alignment and current workload, ensuring optimal
 * agent utilization. Uses least-loaded algorithm with skill scoring to prevent bottlenecks
 * while maintaining quality through specialization-based assignment.
 *
 * **Why This Exists:**
 * Traditional development assigns work arbitrarily or based solely on availability. This creates
 * bottlenecks when specialists are overloaded while generalists sit idle. AgentMatcher analyzes
 * task requirements, scores agents by skill match (0-1), then selects least-loaded qualified agent.
 * TAN handles structure tasks, ZEN handles documentation, each agent works in their strength zone,
 * maximizing both speed and quality.
 *
 * @example
 * ```typescript
 * const matcher = new AgentMatcher();
 *
 * // Match task to best available agent
 * const task = {
 *   id: 't-123',
 *   type: 'documentation',
 *   skillsRequired: ['knowledge-capture', 'architecture-documentation']
 * };
 * const assignment = await matcher.matchAgentToTask(task, agentStatuses);
 * console.log(`Assigned to ${assignment.agentId} (skill match: ${assignment.confidence})`);
 * ```
 *
 * @module coordination/AgentMatcher
 * @version 1.0.0
 */

import {
  InvestigationTask,
  AgentStatus,
  AgentType,
  AgentAssignmentResult,
} from '../shared/types';

/**
 * Agent skill definitions (what each agent specializes in)
 */
const AGENT_SKILLS: Record<AgentType, string[]> = {
  TAN: [
    'file-structure',
    'folder-organization',
    'architecture-setup',
    'directory-creation',
    'structure-validation',
    'baseline-creation',
    'technical-debt-assessment',
  ],
  ZEN: [
    'documentation',
    'knowledge-capture',
    'pattern-documentation',
    'architecture-documentation',
    'methodology-documentation',
    'knowledge-base-creation',
  ],
  INO: [
    'context-analysis',
    'behavioral-hierarchy',
    'claude-md-setup',
    'issues-database',
    'context-establishment',
    'investigation-context',
  ],
  JUNO: [
    'quality-audit',
    'deployment-validation',
    'code-review',
    'testing-validation',
    'quality-assurance',
    'compliance-check',
  ],
  AJ: [
    'project-management',
    'task-coordination',
    'workflow-management',
    'agent-coordination',
    'status-tracking',
  ],
};

/**
 * Task type to agent type mapping
 */
const TASK_TO_AGENT_MAPPING: Record<string, AgentType[]> = {
  'file-structure': ['TAN'],
  'folder-creation': ['TAN'],
  'architecture': ['TAN', 'ZEN'],
  'documentation': ['ZEN'],
  'knowledge-base': ['ZEN'],
  'context': ['INO'],
  'claude-md': ['INO'],
  'issues': ['INO'],
  'quality': ['JUNO'],
  'audit': ['JUNO'],
  'validation': ['JUNO'],
  'review': ['JUNO'],
};

/**
 * Matches tasks to appropriate agents based on skills and workload
 */
export class AgentMatcher {
  /**
   * Select best agent for a task
   * @param task - Task to assign
   * @param agents - Available agents
   * @returns Best agent ID or null if none suitable
   */
  selectBestAgent(
    task: InvestigationTask,
    agents: AgentStatus[]
  ): string | null {
    if (agents.length === 0) {
      return null;
    }

    // Filter agents by skill match
    const skillMatchedAgents = agents.filter((agent) => {
      const skillScore = this.calculateSkillMatch(task, agent);
      return skillScore >= 0.5; // 50% minimum skill match
    });

    if (skillMatchedAgents.length === 0) {
      // No skill match - return least loaded agent as fallback
      return this.selectLeastLoadedAgent(agents);
    }

    // Select best agent based on skill match and workload
    let bestAgent: AgentStatus | null = null;
    let bestScore = -Infinity;

    for (const agent of skillMatchedAgents) {
      const score = this.calculateAgentFitness(task, agent);

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    return bestAgent?.agentId || null;
  }

  /**
   * Select best agent with detailed assignment result
   * @param task - Task to assign
   * @param agents - Available agents
   * @returns Agent assignment result with scores and reasoning
   */
  selectBestAgentWithDetails(
    task: InvestigationTask,
    agents: AgentStatus[]
  ): AgentAssignmentResult {
    if (agents.length === 0) {
      return {
        taskId: task.id,
        agentId: null,
        skillMatchScore: 0,
        workloadScore: 0,
        confidence: 0,
        reason: 'No agents available',
      };
    }

    // Find best agent
    const skillMatchedAgents = agents.filter((agent) => {
      const skillScore = this.calculateSkillMatch(task, agent);
      return skillScore >= 0.5;
    });

    if (skillMatchedAgents.length === 0) {
      const fallbackAgent = this.selectLeastLoadedAgent(agents);
      const fallbackAgentStatus = agents.find(
        (a) => a.agentId === fallbackAgent
      );

      return {
        taskId: task.id,
        agentId: fallbackAgent,
        skillMatchScore: 0,
        workloadScore: fallbackAgentStatus
          ? 1 - fallbackAgentStatus.workload
          : 0,
        confidence: 0.3,
        reason:
          'No skill match found - assigned to least loaded agent as fallback',
      };
    }

    // Calculate scores for best match
    let bestAgent: AgentStatus | null = null;
    let bestScore = -Infinity;

    for (const agent of skillMatchedAgents) {
      const score = this.calculateAgentFitness(task, agent);

      if (score > bestScore) {
        bestScore = score;
        bestAgent = agent;
      }
    }

    const skillMatchScore = bestAgent
      ? this.calculateSkillMatch(task, bestAgent)
      : 0;
    const workloadScore = bestAgent ? 1 - bestAgent.workload : 0;

    return {
      taskId: task.id,
      agentId: bestAgent?.agentId || null,
      skillMatchScore,
      workloadScore,
      confidence: (skillMatchScore + workloadScore) / 2,
      reason: this.getAssignmentReason(task, bestAgent),
    };
  }

  /**
   * Calculate skill match score between task and agent
   * @param task - Task to match
   * @param agent - Agent to match
   * @returns Skill match score (0-1, higher is better)
   */
  calculateSkillMatch(task: InvestigationTask, agent: AgentStatus): number {
    // Primary match: agent type
    if (task.agentType === agent.agentType) {
      return 1.0; // Perfect match
    }

    // Secondary match: task description contains agent skills
    const agentSkills = AGENT_SKILLS[agent.agentType] || [];
    const taskDesc = task.description.toLowerCase();

    let matchCount = 0;
    for (const skill of agentSkills) {
      if (taskDesc.includes(skill)) {
        matchCount++;
      }
    }

    // Score based on skill overlap
    const skillMatchScore =
      agentSkills.length > 0 ? matchCount / agentSkills.length : 0;

    return skillMatchScore;
  }

  /**
   * Calculate overall agent fitness for task
   * @param task - Task to assign
   * @param agent - Agent candidate
   * @returns Fitness score (higher is better)
   */
  calculateAgentFitness(task: InvestigationTask, agent: AgentStatus): number {
    const skillScore = this.calculateSkillMatch(task, agent);
    const workloadScore = 1 - agent.workload; // Lower workload = higher score

    // Prefer idle agents
    const statusBonus = agent.status === 'idle' ? 0.2 : 0;

    // Performance bonus
    const performanceScore = agent.performance
      ? agent.performance.successRate * 0.1
      : 0;

    // Priority weight
    const priorityWeight = this.getPriorityWeight(task.priority);

    // Weighted fitness calculation
    const fitness =
      skillScore * 0.5 +           // 50% skill match
      workloadScore * 0.3 +         // 30% workload
      statusBonus +                 // 20% status bonus
      performanceScore;             // 10% performance

    return fitness * priorityWeight;
  }

  /**
   * Get priority weight multiplier
   * @param priority - Task priority
   * @returns Weight multiplier
   */
  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'critical':
        return 1.5;
      case 'high':
        return 1.2;
      case 'medium':
        return 1.0;
      case 'low':
        return 0.8;
      default:
        return 1.0;
    }
  }

  /**
   * Select least loaded agent (fallback when no skill match)
   * @param agents - Available agents
   * @returns Agent ID of least loaded agent
   */
  private selectLeastLoadedAgent(agents: AgentStatus[]): string | null {
    if (agents.length === 0) {
      return null;
    }

    let leastLoaded: AgentStatus | null = null;
    let lowestWorkload = Infinity;

    for (const agent of agents) {
      // Prefer idle agents
      if (agent.status === 'idle' && agent.workload === 0) {
        return agent.agentId;
      }

      if (agent.workload < lowestWorkload) {
        lowestWorkload = agent.workload;
        leastLoaded = agent;
      }
    }

    return leastLoaded?.agentId || null;
  }

  /**
   * Generate assignment reason
   * @param task - Task being assigned
   * @param agent - Agent assigned
   * @returns Human-readable assignment reason
   */
  private getAssignmentReason(
    task: InvestigationTask,
    agent: AgentStatus | null
  ): string {
    if (!agent) {
      return 'No suitable agent available';
    }

    if (task.agentType === agent.agentType) {
      return `Perfect skill match: Task requires ${task.agentType} agent`;
    }

    const skillScore = this.calculateSkillMatch(task, agent);

    if (skillScore >= 0.8) {
      return `High skill match: Agent has ${Math.round(skillScore * 100)}% skill overlap`;
    }

    if (skillScore >= 0.5) {
      return `Moderate skill match: Agent has ${Math.round(skillScore * 100)}% skill overlap`;
    }

    return `Assigned to least loaded agent (workload: ${Math.round(agent.workload * 100)}%)`;
  }

  /**
   * Balance workload across agents
   * @param agents - Array of agent statuses
   * @returns Rebalancing recommendations
   */
  balanceWorkload(
    agents: AgentStatus[]
  ): Array<{ from: string; to: string; task: string }> {
    const recommendations: Array<{
      from: string;
      to: string;
      task: string;
    }> = [];

    // Calculate average workload
    const totalWorkload = agents.reduce((sum, a) => sum + a.workload, 0);
    const avgWorkload = totalWorkload / agents.length;

    // Identify overloaded and underloaded agents
    const overloaded = agents.filter((a) => a.workload > avgWorkload * 1.5);
    const underloaded = agents.filter((a) => a.workload < avgWorkload * 0.5);

    // Generate rebalancing recommendations
    for (const overAgent of overloaded) {
      for (const underAgent of underloaded) {
        if (overAgent.currentTask) {
          recommendations.push({
            from: overAgent.agentId,
            to: underAgent.agentId,
            task: overAgent.currentTask,
          });
        }
      }
    }

    return recommendations;
  }

  /**
   * Get agent capabilities
   * @param agentType - Agent type
   * @returns Array of agent capabilities/skills
   */
  getAgentCapabilities(agentType: AgentType): string[] {
    return AGENT_SKILLS[agentType] || [];
  }

  /**
   * Get suitable agents for task type
   * @param taskDescription - Task description
   * @returns Array of suitable agent types
   */
  getSuitableAgents(taskDescription: string): AgentType[] {
    const suitableAgents: AgentType[] = [];
    const taskDesc = taskDescription.toLowerCase();

    // Check task-to-agent mapping
    for (const [keyword, agentTypes] of Object.entries(
      TASK_TO_AGENT_MAPPING
    )) {
      if (taskDesc.includes(keyword)) {
        suitableAgents.push(...agentTypes);
      }
    }

    // Check agent skills
    for (const [agentType, skills] of Object.entries(AGENT_SKILLS)) {
      for (const skill of skills) {
        if (taskDesc.includes(skill)) {
          suitableAgents.push(agentType as AgentType);
          break;
        }
      }
    }

    // Remove duplicates
    return Array.from(new Set(suitableAgents));
  }

  /**
   * Calculate assignment accuracy
   * @param assignments - Array of assignments with expected agent
   * @returns Accuracy percentage (0-100)
   */
  calculateAssignmentAccuracy(
    assignments: Array<{
      task: InvestigationTask;
      assignedAgent: string;
      expectedAgent: AgentType;
    }>
  ): number {
    if (assignments.length === 0) {
      return 0;
    }

    let correctCount = 0;

    for (const assignment of assignments) {
      // Extract agent type from assigned agent ID (format: TAN-001, ZEN-001, etc.)
      const assignedType = assignment.assignedAgent.split('-')[0] as AgentType;

      if (assignedType === assignment.expectedAgent) {
        correctCount++;
      }
    }

    return (correctCount / assignments.length) * 100;
  }

  /**
   * Recommend agent for task without assignment
   * @param task - Task to analyze
   * @returns Recommended agent type
   */
  recommendAgent(task: InvestigationTask): AgentType {
    // If task has explicit agent type, use it
    if (task.agentType) {
      return task.agentType;
    }

    // Analyze task description
    const suitableAgents = this.getSuitableAgents(task.description);

    if (suitableAgents.length > 0) {
      return suitableAgents[0];
    }

    // Default fallback based on priority
    switch (task.priority) {
      case 'critical':
        return 'JUNO'; // Quality auditor for critical tasks
      case 'high':
        return 'INO'; // Context specialist for high priority
      default:
        return 'TAN'; // Structure specialist for medium/low
    }
  }
}
