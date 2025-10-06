/**
 * Trinity Method SDK - Shared Type Definitions
 *
 * This file contains ALL shared TypeScript interfaces used across multiple
 * work orders and Trinity components. It serves as the single source of truth
 * for type definitions to prevent interface duplication and undefined types.
 *
 * @module shared/types
 * @version 1.0.0
 * @created 2025-10-05
 * @creators AJ (Project Manager) + JUNO (Quality Auditor)
 */

// ============================================================================
// INVESTIGATION CORE TYPES (Used in: WO-001, WO-004, WO-005, WO-006, WO-007)
// ============================================================================

/**
 * Result of a Trinity investigation, containing all findings, metrics,
 * and artifacts produced during the investigation process.
 *
 * @interface InvestigationResult
 */
export interface InvestigationResult {
  /** Unique identifier for this investigation */
  investigationId?: string;

  /** Unique identifier (alias for investigationId) */
  id?: string;

  /** Human-readable investigation name */
  name?: string;

  /** Investigation goal/objective */
  goal?: string;

  /** Investigation type/category */
  type: InvestigationType;

  /** Start timestamp (ISO 8601) */
  startedAt?: string;

  /** End timestamp (ISO 8601) */
  completedAt?: string;

  /** Investigation status */
  status: InvestigationStatus;

  /** Errors encountered during investigation */
  errors?: (string | ErrorResolution)[];

  /** Investigation scope definition */
  scope?: InvestigationScope;

  /** Execution phases and their results */
  phases?: InvestigationPhase[];

  /** Key findings and insights */
  findings?: Finding[];

  /** Patterns detected during investigation */
  patterns?: Pattern[] | LearnedPattern[];

  /** Issues discovered during investigation */
  issues?: Issue[];

  /** Performance metrics */
  metrics?: InvestigationMetrics | AgentPerformanceMetrics;

  /** Resources used (files analyzed, agents involved) */
  resources?: InvestigationResources;

  /** Success criteria and validation */
  successCriteria?: SuccessCriterion[];

  /** Risks identified and mitigations */
  risks?: Risk[];

  /** Investigation timeline */
  timeline?: Timeline;

  /** Artifacts produced (reports, diagrams, etc.) */
  artifacts?: Artifact[];

  /** Agent collaboration details */
  agentCollaboration?: AgentCollaboration;

  /** Context from CLAUDE.md */
  context?: ClaudeMdContext;

  /** Agent identifier */
  agent?: string;

  /** Investigation start time */
  startTime?: Date;

  /** Investigation end time */
  endTime?: Date;

  /** Total duration in milliseconds */
  duration?: number;

  /** Recommendations */
  recommendations?: string[];

  /** Investigation metadata */
  metadata?: InvestigationMetadata  ;
}

/**
 * Investigation type/category
 */
export type InvestigationType =
  | 'security-audit'
  | 'performance-review'
  | 'architecture-review'
  | 'architecture-analysis'
  | 'code-quality'
  | 'dependency-audit'
  | 'test-coverage'
  | 'accessibility-audit'
  | 'seo-audit'
  | 'bug-investigation'
  | 'feature-planning'
  | 'refactoring-plan'
  | 'custom';

/**
 * Investigation execution status
 */
export type InvestigationStatus =
  | 'planned'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Investigation scope definition
 */
export interface InvestigationScope {
  /** Directories/files included in investigation */
  include: string[];

  /** Directories/files excluded from investigation */
  exclude: string[];

  /** Technologies/frameworks in scope */
  technologies: string[];

  /** Specific areas of focus */
  focusAreas: string[];

  /** Out of scope items (explicitly excluded) */
  outOfScope: string[];

  /** Estimated scope size (number of files, LOC, etc.) */
  estimatedSize: ScopeSize;
}

/**
 * Scope size estimation
 */
export interface ScopeSize {
  /** Number of files in scope */
  fileCount: number;

  /** Total lines of code */
  linesOfCode: number;

  /** Estimated investigation time (hours) */
  estimatedHours: number;
}

/**
 * Investigation phase (planning, execution, review, etc.)
 */
export interface InvestigationPhase {
  /** Phase identifier */
  id: string;

  /** Phase name */
  name: string;

  /** Phase description */
  description: string;

  /** Phase status */
  status: 'pending' | 'in-progress' | 'completed' | 'failed';

  /** Start timestamp */
  startedAt?: string;

  /** End timestamp */
  completedAt?: string;

  /** Duration in milliseconds */
  duration?: number;

  /** Tasks executed in this phase */
  tasks: Task[];

  /** Results from this phase */
  results?: PhaseResult[];

  /** Agent responsible for this phase */
  agent?: string;

  /** Agents involved in this phase (plural) */
  agents?: string[];

  /** Estimated hours for this phase */
  estimatedHours?: number;

  /** Deliverables for this phase */
  deliverables?: string[];

  /** Dependencies for this phase */
  dependencies?: string[];

  /** Findings from this phase */
  findings?: Finding[];

  /** Metrics for this phase */
  metrics?: Record<string, any>;
}

/**
 * Task within an investigation phase
 */
export interface Task {
  /** Task identifier */
  id: string;

  /** Task name */
  name: string;

  /** Task status */
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';

  /** Start timestamp */
  startedAt?: string;

  /** End timestamp */
  completedAt?: string;

  /** Task output/result */
  output?: any;

  /** Error if task failed */
  error?: string;
}

/**
 * Result from an investigation phase
 */
export interface PhaseResult {
  /** Result type */
  type: string;

  /** Result data */
  data: any;

  /** Result timestamp */
  timestamp: string;
}

/**
 * Investigation finding (insight, recommendation, discovery)
 */
export interface Finding {
  /** Finding identifier */
  id: string;

  /** Finding title */
  title: string;

  /** Finding description */
  description: string;

  /** Finding severity */
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';

  /** Finding category */
  category?: string;

  /** Finding type */
  type?: string;

  /** Location (file path, line number, etc.) */
  location?: Location;

  /** Evidence supporting this finding */
  evidence?: (Evidence | string)[];

  /** Recommendation to address this finding */
  recommendation?: string;

  /** Estimated effort to fix (hours) */
  estimatedEffort?: number;

  /** Finding confidence (0-1) */
  confidence?: number;
}

/**
 * Code/file location
 */
export interface Location {
  /** File path */
  filePath?: string;

  /** File path (alias for filePath) */
  file?: string;

  /** Start line number */
  startLine?: number;

  /** End line number */
  endLine?: number;

  /** Column number */
  column?: number;

  /** Function/class name */
  context?: string;
}

/**
 * Evidence supporting a finding, pattern, or claim
 */
export interface Evidence {
  /** Evidence type */
  type: 'code-snippet' | 'metric' | 'log' | 'screenshot' | 'reference' | 'test-result';

  /** Evidence description */
  description: string;

  /** Evidence data (code, metrics, file path, URL, etc.) */
  data: any;

  /** Evidence timestamp */
  timestamp: string;
}

/**
 * Pattern detected during investigation
 */
export interface Pattern {
  /** Pattern identifier */
  id: string;

  /** Pattern name */
  name: string;

  /** Pattern description */
  description: string;

  /** Pattern category */
  category: PatternCategory;

  /** Pattern type (anti-pattern, best practice, etc.) */
  type: 'anti-pattern' | 'best-practice' | 'code-smell' | 'design-pattern' | 'architectural-pattern';

  /** Number of occurrences detected */
  occurrences: number;

  /** Locations where pattern was detected */
  locations: Location[];

  /** Pattern confidence (0-1) */
  confidence: number;

  /** Frameworks/technologies this pattern applies to */
  frameworks: string[];

  /** Evidence supporting pattern detection */
  evidence: Evidence[];

  /** Success rate when pattern is applied */
  successRate?: number;

  /** Recommendation related to this pattern */
  recommendation?: string;
}

/**
 * Pattern category
 */
export type PatternCategory =
  | 'security'
  | 'performance'
  | 'architecture'
  | 'code-quality'
  | 'testing'
  | 'accessibility'
  | 'error-handling'
  | 'state-management'
  | 'data-flow'
  | 'ui-ux'
  | 'other';

/**
 * Issue discovered during investigation
 */
export interface Issue {
  /** Issue identifier */
  id: string;

  /** Issue title */
  title: string;

  /** Issue description */
  description: string;

  /** Issue severity */
  severity: 'critical' | 'high' | 'medium' | 'low';

  /** Issue type */
  type: 'bug' | 'vulnerability' | 'performance' | 'accessibility' | 'code-quality' | 'technical-debt';

  /** Issue location */
  location?: Location;

  /** Issue status */
  status: 'open' | 'in-progress' | 'resolved' | 'wont-fix';

  /** Evidence supporting this issue */
  evidence: Evidence[];

  /** Recommended fix */
  recommendedFix?: string;

  /** Estimated effort to fix (hours) */
  estimatedEffort?: number;
}

/**
 * Investigation performance metrics
 */
export interface InvestigationMetrics {
  /** Total duration (milliseconds) */
  totalDuration: number;

  /** Phase durations */
  phaseDurations: Record<string, number>;

  /** Token usage statistics */
  tokenUsage: TokenUsage;

  /** Cache performance */
  cachePerformance: CachePerformance;

  /** Files analyzed */
  filesAnalyzed: number;

  /** Lines of code analyzed */
  linesAnalyzed: number;

  /** Patterns detected */
  patternsDetected: number;

  /** Issues found */
  issuesFound: number;

  /** Findings generated */
  findingsGenerated: number;

  /** Learning system performance */
  learningPerformance?: LearningPerformance;
}

/**
 * Token usage tracking
 */
export interface TokenUsage {
  /** Investigation ID */
  investigationId: string;

  /** Timestamp */
  timestamp: Date;

  /** Phase (baseline or optimized) */
  phase: 'baseline' | 'optimized';

  /** Token operations */
  operations: TokenOperation[];

  /** Total token usage */
  total: {
    /** Input tokens */
    inputTokens: number;

    /** Output tokens */
    outputTokens: number;

    /** Total tokens */
    totalTokens: number;

    /** Estimated cost (USD) */
    estimatedCost: number;
  };
}

/**
 * Single token operation (LLM query, cache hit, etc.)
 */
export interface TokenOperation {
  /** Operation type */
  operationType: 'llm-query' | 'cache-hit' | 'cache-miss';

  /** Input tokens */
  inputTokens: number;

  /** Output tokens */
  outputTokens: number;

  /** Whether result was cached */
  cached: boolean;

  /** Cache key (if cached) */
  cacheKey?: string;
}

/**
 * Cache performance metrics
 */
export interface CachePerformance {
  /** Total cache lookups */
  totalLookups: number;

  /** Cache hits */
  hits: number;

  /** Cache misses */
  misses: number;

  /** Cache hit rate (0-1) */
  hitRate: number;

  /** Average lookup time (ms) */
  averageLookupTime: number;

  /** Token savings from cache */
  tokenSavings: number;

  /** Time savings from cache (ms) */
  timeSavings: number;
}

/**
 * Learning system performance metrics
 */
export interface LearningPerformance {
  /** Patterns learned */
  patternsLearned: number;

  /** Learning accuracy (precision, recall, F1) */
  accuracy: {
    precision: number;
    recall: number;
    f1Score: number;
  };

  /** Speed improvement from learning */
  speedImprovement: number;

  /** Error rate reduction */
  errorRateReduction: number;

  /** Strategy success rate */
  strategySuccessRate: number;
}

/**
 * Investigation resources (files, agents, etc.)
 */
export interface InvestigationResources {
  /** Files analyzed */
  files: string[];

  /** Agents involved */
  agents: string[];

  /** Tools used */
  tools: string[];

  /** External dependencies */
  externalDependencies: string[];
}

/**
 * Success criterion for investigation
 */
export interface SuccessCriterion {
  /** Criterion identifier */
  id: string;

  /** Criterion description (SMART format) */
  description: string;

  /** Criterion type */
  type: 'functional' | 'performance' | 'quality' | 'user-satisfaction' | 'technical';

  /** Expected value */
  expected: any;

  /** Actual value */
  actual?: any;

  /** Whether criterion was met */
  met?: boolean;

  /** Evidence of criterion being met */
  evidence?: Evidence[];

  /** Measurement method */
  measurementMethod: string;
}

/**
 * Risk identified during investigation
 */
export interface Risk {
  /** Risk identifier */
  id: string;

  /** Risk title */
  title?: string;

  /** Risk description */
  description: string;

  /** Risk severity */
  severity: 'critical' | 'high' | 'medium' | 'low';

  /** Risk probability (0-1) */
  probability: number;

  /** Risk impact (severity level or description) */
  impact: 'critical' | 'high' | 'medium' | 'low' | string;

  /** Risk category */
  category?: string;

  /** Mitigation strategy */
  mitigation?: string;

  /** Risk status */
  status: 'identified' | 'mitigated' | 'accepted' | 'transferred' | 'avoided';
}

/**
 * Investigation timeline
 */
export interface Timeline {
  /** Timeline events */
  events: TimelineEvent[];

  /** Milestones */
  milestones: Milestone[];

  /** Total duration (ms) */
  totalDuration: number;

  /** Estimated remaining time (ms) */
  estimatedRemaining?: number;
}

/**
 * Timeline event (agent action, phase transition, etc.)
 */
export interface TimelineEvent {
  /** Event identifier */
  id: string;

  /** Event timestamp */
  timestamp: string;

  /** Event type */
  type: 'phase-start' | 'phase-end' | 'agent-action' | 'finding-discovered' | 'pattern-detected' | 'issue-found' | 'milestone-reached' | 'error' | 'other';

  /** Event description */
  description: string;

  /** Event data */
  data?: any;

  /** Agent responsible for this event */
  agent?: string;
}

/**
 * Investigation milestone
 */
export interface Milestone {
  /** Milestone identifier */
  id: string;

  /** Milestone name */
  name: string;

  /** Milestone description */
  description: string;

  /** Target date */
  targetDate?: string;

  /** Actual completion date */
  completedDate?: string;

  /** Whether milestone was met */
  met: boolean;
}

/**
 * Investigation artifact (report, diagram, etc.)
 */
export interface Artifact {
  /** Artifact identifier */
  id: string;

  /** Artifact name */
  name: string;

  /** Artifact type */
  type: 'report' | 'diagram' | 'screenshot' | 'code-snippet' | 'configuration' | 'test-result' | 'benchmark' | 'other';

  /** Artifact file path */
  filePath: string;

  /** Artifact description */
  description: string;

  /** Artifact creation timestamp */
  createdAt: string;

  /** Artifact format */
  format: string;

  /** Artifact size (bytes) */
  size?: number;
}

/**
 * Agent collaboration details
 */
export interface AgentCollaboration {
  /** Agents involved */
  agents: AgentParticipation[];

  /** Inter-agent communications */
  communications: AgentCommunication[];

  /** Collaboration efficiency metrics */
  efficiency: CollaborationEfficiency;
}

/**
 * Agent participation in investigation
 */
export interface AgentParticipation {
  /** Agent name/identifier */
  agent: string;

  /** Agent role in this investigation */
  role: string;

  /** Phases agent participated in */
  phases: string[];

  /** Time spent (ms) */
  timeSpent: number;

  /** Contributions made */
  contributions: Contribution[];
}

/**
 * Agent contribution
 */
export interface Contribution {
  /** Contribution type */
  type: 'finding' | 'pattern' | 'recommendation' | 'analysis' | 'review' | 'other';

  /** Contribution identifier (finding ID, pattern ID, etc.) */
  id: string;

  /** Timestamp */
  timestamp: string;
}

/**
 * Communication between agents
 */
export interface AgentCommunication {
  /** Communication identifier */
  id: string;

  /** From agent */
  from: string;

  /** To agent(s) */
  to: string[];

  /** Communication type */
  type: 'handoff' | 'request' | 'response' | 'notification' | 'escalation';

  /** Message content */
  message: string;

  /** Timestamp */
  timestamp: string;

  /** Context data */
  context?: any;
}

/**
 * Collaboration efficiency metrics
 */
export interface CollaborationEfficiency {
  /** Number of handoffs between agents */
  handoffCount: number;

  /** Average handoff time (ms) */
  averageHandoffTime: number;

  /** Parallel work percentage */
  parallelWorkPercentage: number;

  /** Communication overhead (time spent in communications) */
  communicationOverhead: number;

  /** Collaboration effectiveness score (0-1) */
  effectiveness: number;
}

// ============================================================================
// CLAUDE.MD CONTEXT TYPES (Used in: WO-003, WO-006, WO-007)
// ============================================================================

/**
 * Parsed context from CLAUDE.md
 */
export interface ClaudeMdContext {
  /** Project overview information */
  projectOverview: ProjectOverview;

  /** Known patterns from CLAUDE.md */
  knownPatterns: string[];

  /** Known issues from CLAUDE.md */
  knownIssues: string[];

  /** Current tasks from CLAUDE.md */
  currentTasks: string[];

  /** Architecture overview */
  architecture?: string;

  /** Trinity configuration */
  trinityConfiguration?: TrinityConfiguration;

  /** Trinity hooks configuration */
  trinityHooks?: HookConfiguration;

  /** Investigation preferences */
  investigationPreferences?: InvestigationPreferences;

  /** Agent requirements */
  agentRequirements?: AgentRequirements;
}

/**
 * Project overview from CLAUDE.md
 */
export interface ProjectOverview {
  /** Framework (React, Next.js, Express, etc.) */
  framework?: string;

  /** Primary language */
  language?: string;

  /** Tech stack components */
  techStack?: string[];

  /** Testing framework */
  testingFramework?: string;

  /** Project description */
  description?: string;
}

/**
 * Trinity configuration from CLAUDE.md
 */
export interface TrinityConfiguration {
  /** Environment (development, staging, production) */
  environment?: 'development' | 'staging' | 'production';

  /** Learning system configuration */
  learning?: {
    enabled: boolean;
    confidenceThreshold?: number;
    mode?: 'active' | 'manual' | 'disabled';
    patternSensitivity?: 'high' | 'medium' | 'low';
  };

  /** Cache configuration */
  cache?: {
    enabled: boolean;
    ttl?: number;
  };

  /** Configuration overrides */
  overrides?: Record<string, any>;

  /** Configuration constraints */
  constraints?: Record<string, string>;
}

/**
 * Hook configuration from CLAUDE.md
 */
export interface HookConfiguration {
  /** Enabled hooks */
  enabled: string[];

  /** Disabled hooks */
  disabled: string[];

  /** Hook-specific configuration */
  config?: Record<string, HookConfig>;
}

/**
 * Configuration for a specific hook
 */
export interface HookConfig {
  /** Hook identifier */
  hookId: string;

  /** Hook enabled status */
  enabled: boolean;

  /** Hook conditions */
  conditions?: HookCondition[];

  /** Hook actions */
  actions?: HookAction[];

  /** Hook configuration data */
  config?: Record<string, any>;
}

/**
 * Condition for hook execution
 */
export interface HookCondition {
  /** Condition type */
  type: 'file-pattern' | 'agent' | 'phase' | 'metric-threshold' | 'custom';

  /** Condition configuration */
  config: any;

  /** Whether condition must be true (AND) or any can be true (OR) */
  operator?: 'AND' | 'OR';
}

/**
 * Action to execute when hook fires
 */
export interface HookAction {
  /** Action type */
  type: 'notify' | 'validate' | 'backup' | 'generate-report' | 'custom';

  /** Action configuration */
  config: any;
}

/**
 * Investigation preferences from CLAUDE.md
 */
export interface InvestigationPreferences {
  /** Pattern detection sensitivity */
  patternSensitivity?: 'high' | 'medium' | 'low';

  /** Error tolerance level */
  errorTolerance?: 'strict' | 'moderate' | 'permissive';

  /** Learning mode */
  learningMode?: 'active' | 'manual' | 'disabled';

  /** Confidence threshold for recommendations */
  confidenceThreshold?: number;

  /** Preferred investigation depth */
  investigationDepth?: 'shallow' | 'moderate' | 'deep';

  /** Preferred reporting format */
  reportingFormat?: 'concise' | 'detailed' | 'comprehensive';
}

/**
 * Agent requirements from CLAUDE.md
 */
export interface AgentRequirements {
  /** Required agents (always include) */
  required: string[];

  /** Preferred agents (include if available) */
  preferred: string[];

  /** Excluded agents (never include) */
  excluded: string[];
}

// ============================================================================
// CACHE TYPES (Used in: WO-002, WO-011)
// ============================================================================

/**
 * Cache entry structure
 */
export interface CacheEntry<T = any> {
  /** Cache key */
  key: string;

  /** Cached value */
  value: T;

  /** Creation timestamp (ms) */
  createdAt: number;

  /** Last accessed timestamp (ms) */
  lastAccessedAt: number;

  /** Access count */
  accessCount: number;

  /** Time-to-live (ms) */
  ttl: number;

  /** Expiration timestamp (ms) */
  expiresAt: number;

  /** Cache entry metadata */
  metadata?: CacheMetadata;
}

/**
 * Cache entry metadata
 */
export interface CacheMetadata {
  /** Entry size (bytes) */
  size?: number;

  /** Entry tags for categorization */
  tags?: string[];

  /** Entry source (investigation ID, agent, etc.) */
  source?: string;

  /** Custom metadata */
  custom?: Record<string, any>;
}

/**
 * Cache statistics
 */
export interface CacheStats {
  /** Total entries in cache */
  totalEntries: number;

  /** Total cache size (bytes) */
  totalSize: number;

  /** Cache hits */
  hits: number;

  /** Cache misses */
  misses: number;

  /** Hit rate (0-1) */
  hitRate: number;

  /** Average lookup time (ms) */
  averageLookupTime: number;

  /** Eviction count */
  evictions: number;

  /** Expired entries count */
  expiredEntries: number;
}

/**
 * Cache operation result
 */
export interface CacheOperationResult<T = any> {
  /** Operation success */
  success: boolean;

  /** Result value (for get operations) */
  value?: T;

  /** Whether this was a cache hit */
  hit?: boolean;

  /** Operation duration (ms) */
  duration: number;

  /** Error message (if failed) */
  error?: string;
}

// ============================================================================
// LEARNING TYPES (Used in: WO-004, WO-005)
// ============================================================================

/**
 * Learning data for a specific agent
 */
export interface LearningData {
  /** Agent identifier */
  agent: string;

  /** Learned patterns - stored as Map for fast lookup */
  patterns: Map<string, LearnedPattern> | LearnedPattern[];

  /** Strategy performance data - stored as Map for fast lookup */
  strategies: Map<string, StrategyPerformance> | StrategyPerformance[];

  /** Investigation history */
  investigations: InvestigationSummary[];

  /** Learning metadata */
  metadata: LearningMetadata;

  /** Total investigations count */
  totalInvestigations?: number;

  /** Successful investigations count */
  successfulInvestigations?: number;

  /** Failed investigations count */
  failedInvestigations?: number;
}

/**
 * Learned pattern with performance data
 */
export interface LearnedPattern extends Partial<Pattern> {
  /** Pattern identifier */
  id?: string;

  /** Pattern name */
  name?: string;

  /** Pattern category */
  category?: PatternCategory;

  /** Times this pattern was detected */
  detectionCount?: number;

  /** Times this pattern was correct */
  correctCount?: number;

  /** Accuracy rate (0-1) */
  accuracy?: number;

  /** Last detected timestamp */
  lastDetected?: string;

  /** First detected timestamp */
  firstDetected?: string;

  /** Frameworks where pattern was seen */
  frameworks?: string[];

  /** Average time saved by recognizing this pattern (ms) */
  averageTimeSavings?: number;

  // Legacy aliases for backward compatibility
  /** Pattern identifier (alias for id) */
  patternId?: string;

  /** Pattern type (alias for type) */
  patternType?: 'anti-pattern' | 'best-practice' | 'code-smell' | 'design-pattern' | 'architectural-pattern' | 'validation-rule' | 'code-structure' | 'research-source';

  /** Usage count (total times pattern was used) */
  usageCount?: number;

  /** Success count (times pattern application succeeded) */
  successCount?: number;

  /** File paths where pattern appears */
  filePaths?: string[];

  /** Detection criteria description */
  detectionCriteria?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Error types associated with this pattern */
  errorTypes?: string[];

  /** Investigation IDs where pattern was found */
  investigationIds?: string[];

  /** Last seen timestamp */
  lastSeen?: Date;

  /** Agent ID that learned this pattern */
  agentId?: string;
}

/**
 * Strategy performance tracking
 */
export interface StrategyPerformance {
  /** Strategy identifier */
  strategyId: string;

  /** Strategy name */
  strategyName: string;

  /** Times this strategy was used */
  usageCount: number;

  /** Times this strategy succeeded */
  successCount: number;

  /** Success rate (0-1) */
  successRate: number;

  /** Confidence in this strategy (0-1) */
  confidence?: number;

  /** Average execution time (ms) */
  averageExecutionTime?: number;

  /** Context where strategy performs best */
  optimalContext?: Record<string, any>;

  /** Agent ID that uses this strategy */
  agentId?: string;

  /** Strategy description */
  description?: string;

  /** Average duration (ms) */
  averageDuration?: number;

  /** Token efficiency (results per token) */
  tokenEfficiency?: number;

  /** Successful investigations count or IDs */
  successfulInvestigations?: number | string[];

  /** Failed investigations count or IDs */
  failedInvestigations?: number | string[];

  /** Failure count */
  failureCount?: number;

  /** Last used timestamp */
  lastUsed?: Date | string;

  /** Applicable contexts for this strategy */
  applicableContexts?: string[];
}

/**
 * Investigation summary for learning history
 */
export interface InvestigationSummary {
  /** Investigation ID */
  id: string;

  /** Investigation type */
  type: InvestigationType;

  /** Completion timestamp */
  completedAt: string;

  /** Duration (ms) */
  duration: number;

  /** Success/failure */
  success: boolean;

  /** Key metrics */
  metrics: Record<string, number>;

  /** Patterns detected */
  patternsDetected: string[];
}

/**
 * Learning metadata
 */
export interface LearningMetadata {
  /** Investigation ID (for single investigation metadata) */
  investigationId?: string;

  /** Creation timestamp */
  createdAt?: string | Date;

  /** Updated timestamp (alias for lastUpdated) */
  updatedAt?: string | Date;

  /** Learning data version */
  version?: string;

  /** Last updated timestamp */
  lastUpdated?: string;

  /** Total investigations analyzed */
  totalInvestigations?: number;

  /** Learning accuracy */
  accuracy?: {
    precision: number;
    recall: number;
    f1Score: number;
  };

  /** Learning performance */
  performance?: {
    speedImprovement: number;
    errorReduction: number;
  };

  /** Agent ID */
  agentId?: string;

  /** Average completion time */
  averageCompletionTime?: number;

  /** Average token usage */
  averageTokenUsage?: number;

  /** Error rate (0-1) */
  errorRate?: number;

  /** Strategy success rate */
  strategySuccessRate?: number;

  /** Created by (agent name) */
  createdBy?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Priority level */
  priority?: 'low' | 'medium' | 'high' | 'critical';

  /** Pattern accuracy */
  patternAccuracy?: number;

  /** Improvement trend */
  improvementTrend?: number | {
    speedImprovement: number;
    tokenImprovement: number;
    accuracyImprovement: number;
  };
}

// ============================================================================
// CONFIGURATION TYPES (Used in: WO-003, WO-007, WO-011)
// ============================================================================

/**
 * Complete Trinity configuration
 */
export interface Configuration {
  /** Environment */
  environment: 'development' | 'staging' | 'production';

  /** Cache configuration */
  cache: CacheConfig;

  /** Learning configuration */
  learning: LearningConfig;

  /** Investigation configuration */
  investigation: InvestigationConfig;

  /** Agent configuration */
  agents: AgentConfig;

  /** Hook configuration */
  hooks: HookConfiguration;

  /** Logging configuration */
  logging: LoggingConfig;

  /** Performance configuration */
  performance: PerformanceConfig;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  /** Cache enabled */
  enabled: boolean;

  /** Default TTL (ms) */
  ttl: number;

  /** Maximum cache size (bytes) */
  maxSize: number;

  /** Eviction policy */
  evictionPolicy: 'lru' | 'lfu' | 'fifo';

  /** Cache directory */
  directory: string;

  /** Cache bucketing (hex buckets for file organization) */
  bucketing: {
    enabled: boolean;
    bucketCount: number;
  };
}

/**
 * Learning configuration
 */
export interface LearningConfig {
  /** Learning enabled */
  enabled: boolean;

  /** Learning mode */
  mode: 'active' | 'manual' | 'disabled';

  /** Confidence threshold for learning */
  confidenceThreshold: number;

  /** Pattern sensitivity */
  patternSensitivity: 'high' | 'medium' | 'low';

  /** Maximum patterns to store per agent */
  maxPatternsPerAgent: number;

  /** Learning data directory */
  directory: string;
}

/**
 * Investigation configuration
 */
export interface InvestigationConfig {
  /** Default investigation timeout (ms) */
  timeout: number;

  /** Maximum concurrent investigations */
  maxConcurrent: number;

  /** Investigation data directory */
  directory: string;

  /** Auto-save interval (ms) */
  autoSaveInterval: number;

  /** Default investigation preferences */
  defaults: InvestigationPreferences;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  /** Available agents */
  available: string[];

  /** Agent-specific configuration */
  agentConfig: Record<string, any>;

  /** Agent communication timeout (ms) */
  communicationTimeout: number;

  /** Maximum parallel agents */
  maxParallelAgents: number;
}

/**
 * Logging configuration
 */
export interface LoggingConfig {
  /** Log level */
  level: 'debug' | 'info' | 'warn' | 'error';

  /** Log to console */
  console: boolean;

  /** Log to file */
  file: boolean;

  /** Log file path */
  filePath?: string;

  /** Log format */
  format: 'json' | 'text';

  /** Include timestamps */
  timestamps: boolean;
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /** Performance monitoring enabled */
  enabled: boolean;

  /** Benchmark interval (ms) */
  benchmarkInterval: number;

  /** Performance regression threshold (%) */
  regressionThreshold: number;

  /** Benchmark results directory */
  benchmarkDirectory: string;
}

// ============================================================================
// PERFORMANCE & METRICS TYPES (Used in: WO-008, WO-011)
// ============================================================================

/**
 * Performance statistics
 */
export interface PerformanceStats {
  /** Median value */
  median: number;

  /** Mean value */
  mean: number;

  /** Minimum value */
  min: number;

  /** Maximum value */
  max: number;

  /** Standard deviation */
  stdDev: number;

  /** Sample size */
  sampleSize: number;

  /** Number of outliers removed */
  outliers: number;

  /** 95% confidence interval */
  confidenceInterval?: [number, number];
}

/**
 * Benchmark scenario
 */
export interface BenchmarkScenario {
  /** Scenario identifier */
  id: string;

  /** Scenario name */
  name: string;

  /** Scenario description */
  description: string;

  /** Setup function */
  setup: () => Promise<void>;

  /** Run function */
  run: () => Promise<BenchmarkResult>;

  /** Teardown function */
  teardown: () => Promise<void>;

  /** Number of iterations */
  iterations: number;
}

/**
 * Benchmark result
 */
export interface BenchmarkResult {
  /** Scenario ID */
  scenarioId: string;

  /** Number of iterations */
  iterations: number;

  /** Measurements */
  measurements: {
    time_ms: number[];
    tokens_used: number[];
    memory_mb: number[];
  };

  /** Statistics */
  statistics: {
    time: PerformanceStats;
    tokens: PerformanceStats;
    memory: PerformanceStats;
  };

  /** Timestamp */
  timestamp: string;
}

// ============================================================================
// VALIDATION TYPES (Used in: WO-009, WO-010)
// ============================================================================

/**
 * Validation result
 */
export interface ValidationResult {
  /** Validation success */
  valid: boolean;

  /** Validation errors */
  errors: ValidationError[];

  /** Validation warnings */
  warnings: ValidationWarning[];

  /** Validation timestamp */
  timestamp: string;
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Error code */
  code: string;

  /** Error message */
  message: string;

  /** Error location (file, line, etc.) */
  location?: Location;

  /** Error severity */
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  /** Warning code */
  code: string;

  /** Warning message */
  message: string;

  /** Warning location */
  location?: Location;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard: Check if value is an InvestigationResult
 */
export function isInvestigationResult(value: any): value is InvestigationResult {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.investigationId === 'string' &&
    typeof value.name === 'string' &&
    typeof value.goal === 'string' &&
    typeof value.type === 'string' &&
    Array.isArray(value.phases) &&
    Array.isArray(value.findings)
  );
}

/**
 * Type guard: Check if value is a Pattern
 */
export function isPattern(value: any): value is Pattern {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.confidence === 'number' &&
    value.confidence >= 0 &&
    value.confidence <= 1
  );
}

/**
 * Type guard: Check if value is a CacheEntry
 */
export function isCacheEntry(value: any): value is CacheEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.key === 'string' &&
    typeof value.createdAt === 'number' &&
    typeof value.ttl === 'number' &&
    'value' in value
  );
}

/**
 * Type guard: Check if value is ClaudeMdContext
 */
export function isClaudeMdContext(value: any): value is ClaudeMdContext {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.projectOverview === 'object' &&
    Array.isArray(value.knownPatterns) &&
    Array.isArray(value.knownIssues) &&
    Array.isArray(value.currentTasks)
  );
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Extract keys of T where value is of type U
 */
export type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

/**
 * Omit properties from T that are in K
 */
export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Pick properties from T that are in K
 */
export type StrictPick<T, K extends keyof T> = Pick<T, K>;

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: DeepPartial<Configuration> = {
  cache: {
    enabled: true,
    ttl: 86400000, // 24 hours
    maxSize: 1073741824, // 1GB
    evictionPolicy: 'lru',
    bucketing: {
      enabled: true,
      bucketCount: 4096 // 0x000 - 0xFFF
    }
  },
  learning: {
    enabled: true,
    mode: 'active',
    confidenceThreshold: 0.8,
    patternSensitivity: 'medium',
    maxPatternsPerAgent: 1000
  },
  investigation: {
    timeout: 7200000, // 2 hours
    maxConcurrent: 3,
    autoSaveInterval: 60000 // 1 minute
  },
  performance: {
    enabled: true,
    benchmarkInterval: 3600000, // 1 hour
    regressionThreshold: 10 // 10%
  }
};

/**
 * Supported investigation types
 */
export const INVESTIGATION_TYPES: InvestigationType[] = [
  'security-audit',
  'performance-review',
  'architecture-review',
  'code-quality',
  'dependency-audit',
  'test-coverage',
  'accessibility-audit',
  'seo-audit',
  'bug-investigation',
  'feature-planning',
  'refactoring-plan',
  'custom'
];

/**
 * Supported pattern categories
 */
export const PATTERN_CATEGORIES: PatternCategory[] = [
  'security',
  'performance',
  'architecture',
  'code-quality',
  'testing',
  'accessibility',
  'error-handling',
  'state-management',
  'data-flow',
  'ui-ux',
  'other'
];

// ============================================================================
// TASK COORDINATION TYPES (Used in: WO-003 - Task Pool Coordination)
// ============================================================================

/**
 * Task status enumeration
 */
export type TaskStatus =
  | 'pending'      // Task waiting to be assigned
  | 'in-progress'  // Task currently being executed
  | 'completed'    // Task successfully completed
  | 'failed'       // Task execution failed
  | 'blocked';     // Task blocked by dependencies

/**
 * Agent type enumeration
 */
export type AgentType =
  | 'TAN'   // Trinity Architecture Navigator (structure specialist)
  | 'ZEN'   // Zentient (knowledge base specialist)
  | 'INO'   // Investigator (context specialist)
  | 'JUNO'  // Quality Auditor
  | 'AJ';   // Project Manager

/**
 * Task priority enumeration
 */
export type TaskPriority =
  | 'critical'  // Must execute immediately
  | 'high'      // Execute soon
  | 'medium'    // Normal priority
  | 'low';      // Execute when resources available

/**
 * Investigation task for coordination system
 */
export interface InvestigationTask {
  /** Unique task identifier */
  id: string;

  /** Task description */
  description: string;

  /** Agent type best suited for this task */
  agentType: AgentType;

  /** Task priority */
  priority: TaskPriority;

  /** Task IDs that must complete before this task */
  dependencies: string[];

  /** Current task status */
  status: TaskStatus;

  /** Agent instance ID assigned to this task */
  assignedTo?: string;

  /** Task execution result */
  result?: any;

  /** Error message if task failed */
  error?: string;

  /** Task start timestamp */
  startTime?: Date;

  /** Task end timestamp */
  endTime?: Date;

  /** Number of retry attempts */
  retryCount: number;

  /** Task metadata */
  metadata: TaskMetadata;
}

/**
 * Task metadata and configuration
 */
export interface TaskMetadata {
  /** Investigation ID this task belongs to */
  investigationId: string;

  /** Estimated task duration (milliseconds) */
  estimatedDuration?: number;

  /** Task timeout (milliseconds) */
  timeout?: number;

  /** Whether task can be retried on failure */
  canRetry: boolean;

  /** Maximum retry attempts */
  maxRetries: number;

  /** Custom task data */
  customData?: Record<string, any>;
}

/**
 * Task dependency graph (DAG)
 */
export interface TaskDependencyGraph {
  /** Task nodes (task ID -> task object) */
  nodes: Map<string, InvestigationTask>;

  /** Dependency edges (task ID -> dependent task IDs) */
  edges: Map<string, string[]>;

  /** Root tasks (no dependencies) */
  roots: string[];

  /** Tasks ready to execute (dependencies satisfied) */
  readyQueue: string[];
}

/**
 * Agent status and workload information
 */
export interface AgentStatus {
  /** Agent instance identifier */
  agentId: string;

  /** Agent type */
  agentType: AgentType;

  /** Current agent status */
  status: 'idle' | 'busy' | 'error';

  /** Current task ID (if busy) */
  currentTask?: string;

  /** Number of tasks completed */
  tasksCompleted: number;

  /** Average task duration (milliseconds) */
  averageTaskDuration: number;

  /** Current workload (0-1, where 1 is fully loaded) */
  workload: number;

  /** Agent capabilities/skills */
  capabilities?: string[];

  /** Agent performance metrics */
  performance?: AgentPerformanceMetrics;
}

/**
 * Agent performance metrics
 */
export interface AgentPerformanceMetrics {
  /** Success rate (0-1) */
  successRate?: number;

  /** Average execution time (ms) */
  averageExecutionTime?: number;

  /** Total duration (ms) */
  duration?: number;

  /** Error rate (0-1) */
  errorRate?: number;

  /** Last active timestamp */
  lastActive?: string;

  /** Tokens used */
  tokensUsed?: number;

  /** Patterns learned count */
  patternsLearned?: number;

  /** Issues found count */
  issuesFound?: number;

  /** API calls made */
  apiCalls?: number;

  /** Errors encountered */
  errors?: number;

  /** Warnings issued */
  warnings?: number;

  /** Files analyzed */
  filesAnalyzed?: number;

  /** Lines of code analyzed */
  linesAnalyzed?: number;

  /** Timestamp of metrics */
  timestamp?: Date | string;
}

/**
 * Task pool statistics
 */
export interface TaskPoolStats {
  /** Total tasks in pool */
  totalTasks: number;

  /** Pending tasks */
  pendingTasks: number;

  /** In-progress tasks */
  inProgressTasks: number;

  /** Completed tasks */
  completedTasks: number;

  /** Failed tasks */
  failedTasks: number;

  /** Blocked tasks */
  blockedTasks: number;

  /** Average task duration (ms) */
  averageTaskDuration: number;

  /** Parallel efficiency (0-1) */
  parallelEfficiency: number;
}

/**
 * Investigation execution status
 */
export interface InvestigationExecutionStatus {
  /** Investigation ID */
  investigationId: string;

  /** Overall status */
  status: InvestigationStatus;

  /** Task graph */
  taskGraph: TaskDependencyGraph;

  /** Agent statuses */
  agents: AgentStatus[];

  /** Statistics */
  stats: TaskPoolStats;

  /** Start timestamp */
  startedAt: string;

  /** Completion timestamp */
  completedAt?: string;

  /** Total duration (ms) */
  duration?: number;
}

/**
 * Dependency resolution result
 */
export interface DependencyResolutionResult {
  /** Whether resolution was successful */
  success: boolean;

  /** Execution order (topologically sorted task IDs) */
  executionOrder: string[];

  /** Cycles detected (array of task ID cycles) */
  cycles: string[][];

  /** Blocked tasks (missing dependencies) */
  blockedTasks: string[];

  /** Resolution errors */
  errors: string[];
}

/**
 * Agent assignment result
 */
export interface AgentAssignmentResult {
  /** Task ID */
  taskId: string;

  /** Assigned agent ID */
  agentId: string | null;

  /** Skill match score (0-1) */
  skillMatchScore: number;

  /** Workload score (0-1, lower is better) */
  workloadScore: number;

  /** Assignment confidence (0-1) */
  confidence: number;

  /** Assignment reason */
  reason: string;
}

/**
 * Lock acquisition error
 */
export class LockAcquisitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LockAcquisitionError';
  }
}

/**
 * Cycle detection error
 */
export class CycleDetectionError extends Error {
  /** Cycles found in graph */
  cycles: string[][];

  constructor(message: string, cycles: string[][]) {
    super(message);
    this.name = 'CycleDetectionError';
    this.cycles = cycles;
  }
}

/**
 * Task execution error
 */
export class TaskExecutionError extends Error {
  /** Task ID */
  taskId: string;

  /** Original error */
  originalError?: Error;

  constructor(message: string, taskId: string, originalError?: Error) {
    super(message);
    this.name = 'TaskExecutionError';
    this.taskId = taskId;
    this.originalError = originalError;
  }
}

// ============================================================================
// TYPE ALIASES FOR BACKWARD COMPATIBILITY
// ============================================================================

/**
 * Performance metrics type alias
 */
export type PerformanceMetrics = AgentPerformanceMetrics;

/**
 * Investigation metadata type alias
 */
export type InvestigationMetadata = LearningMetadata;

/**
 * Learning metrics type alias
 */
export type LearningMetrics = LearningMetadata;

/**
 * Error resolution tracking
 */
export interface ErrorResolution {
  /** Error identifier */
  errorId: string;

  /** Error message */
  errorMessage: string;

  /** Resolution description */
  resolution: string;

  /** Timestamp when error was resolved */
  resolvedAt?: string;

  /** Whether error is resolved */
  resolved?: boolean;

  /** Agent that resolved the error */
  resolvedBy?: string;

  /** Strategy used to resolve */
  strategy?: string;

  /** Occurrence count */
  occurrenceCount?: number;

  /** Success rate */
  successRate?: number;

  /** Confidence */
  confidence?: number;

  /** Last seen timestamp */
  lastSeen?: Date | string;

  /** Error type classification */
  errorType?: string;

  /** Count of resolved instances */
  resolvedCount?: number;

  /** First seen timestamp */
  firstSeen?: Date | string;

  /** Agent ID that encountered this error */
  agentId?: string;

  /** Investigation IDs where this error appeared */
  investigationIds?: string[];
}

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
  testingFramework?: string;
  dependencies?: string[];
}

// ============================================================================
// END OF SHARED TYPE DEFINITIONS
// ============================================================================

/**
 * @file index.ts
 * @summary Shared TypeScript interface definitions for Trinity Method SDK
 * @created 2025-10-05
 * @creators AJ (Project Manager) + JUNO (Quality Auditor)
 * @issues-solved Undefined interface issues in WO-001, WO-002, WO-004, WO-005, WO-007
 */
