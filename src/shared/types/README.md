# Trinity Method Type System

Comprehensive TypeScript type definitions for the Trinity Method SDK (2,270 lines).

## Overview

This file serves as the **single source of truth** for all Trinity Method type definitions. It provides type safety, documentation, and consistency across the entire SDK.

**File**: `index.ts` (2,270 lines)
**Created**: 2025-10-05
**Creators**: AJ (Project Manager) + JUNO (Quality Auditor)
**Purpose**: Prevent interface duplication and undefined types across work orders

## Table of Contents

1. [Investigation Core Types](#1-investigation-core-types) (Lines 15-838)
2. [CLAUDE.md Context Types](#2-claudemd-context-types) (Lines 840-1018)
3. [Cache Types](#3-cache-types) (Lines 1020-1117)
4. [Learning Types](#4-learning-types) (Lines 1119-1371)
5. [Configuration Types](#5-configuration-types) (Lines 1373-1530)
6. [Performance & Metrics Types](#6-performance--metrics-types) (Lines 1532-1617)
7. [Validation Types](#7-validation-types) (Lines 1619-1669)
8. [Task Coordination Types](#8-task-coordination-types) (Lines 1843-2180)
9. [Type Guards](#9-type-guards) (Lines 1671-1733)
10. [Utility Types](#10-utility-types) (Lines 1735-1768)
11. [Constants](#11-constants) (Lines 1770-1840)

---

## 1. Investigation Core Types

Used in: WO-001, WO-004, WO-005, WO-006, WO-007

### InvestigationResult

Complete investigation result containing findings, metrics, and artifacts.

```typescript
interface InvestigationResult {
  investigationId?: string;        // Unique identifier
  id?: string;                     // Alias for investigationId
  name?: string;                   // Human-readable name
  goal?: string;                   // Investigation objective
  type: InvestigationType;         // Investigation category
  startedAt?: string;              // Start timestamp (ISO 8601)
  completedAt?: string;            // End timestamp (ISO 8601)
  status: InvestigationStatus;     // Execution status
  errors?: (string | ErrorResolution)[]; // Errors encountered
  scope?: InvestigationScope;      // Investigation scope
  phases?: InvestigationPhase[];   // Execution phases
  findings?: Finding[];            // Key findings
  patterns?: Pattern[] | LearnedPattern[]; // Detected patterns
  issues?: Issue[];                // Discovered issues
  metrics?: InvestigationMetrics | AgentPerformanceMetrics; // Performance
  resources?: InvestigationResources; // Resources used
  successCriteria?: SuccessCriterion[]; // Success validation
  risks?: Risk[];                  // Identified risks
  timeline?: Timeline;             // Investigation timeline
  artifacts?: Artifact[];          // Produced artifacts
  agentCollaboration?: AgentCollaboration; // Agent collaboration
  context?: ClaudeMdContext;       // CLAUDE.md context
  agent?: string;                  // Agent identifier
  startTime?: Date;                // Start time
  endTime?: Date;                  // End time
  duration?: number;               // Duration (ms)
  recommendations?: string[];      // Recommendations
  metadata?: InvestigationMetadata; // Metadata
}
```

### InvestigationType

```typescript
type InvestigationType =
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
```

### InvestigationStatus

```typescript
type InvestigationStatus =
  | 'planned'
  | 'in-progress'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';
```

### InvestigationScope

```typescript
interface InvestigationScope {
  include: string[];           // Included directories/files
  exclude: string[];           // Excluded directories/files
  technologies: string[];      // Technologies in scope
  focusAreas: string[];        // Specific focus areas
  outOfScope: string[];        // Explicitly excluded items
  estimatedSize: ScopeSize;    // Scope estimation
}

interface ScopeSize {
  fileCount: number;           // Number of files
  linesOfCode: number;         // Total LOC
  estimatedHours: number;      // Estimated time (hours)
}
```

### InvestigationPhase

```typescript
interface InvestigationPhase {
  id: string;                  // Phase identifier
  name: string;                // Phase name
  description: string;         // Phase description
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt?: string;          // Start timestamp
  completedAt?: string;        // End timestamp
  duration?: number;           // Duration (ms)
  tasks: Task[];               // Phase tasks
  results?: PhaseResult[];     // Phase results
  agent?: string;              // Responsible agent
  agents?: string[];           // Involved agents
  estimatedHours?: number;     // Estimated hours
  deliverables?: string[];     // Phase deliverables
  dependencies?: string[];     // Phase dependencies
  findings?: Finding[];        // Phase findings
  metrics?: Record<string, any>; // Phase metrics
}
```

### Task

```typescript
interface Task {
  id: string;                  // Task identifier
  name: string;                // Task name
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  startedAt?: string;          // Start timestamp
  completedAt?: string;        // End timestamp
  output?: any;                // Task output
  error?: string;              // Error message
}
```

### Finding

```typescript
interface Finding {
  id: string;                  // Finding identifier
  title: string;               // Finding title
  description: string;         // Finding description
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category?: string;           // Finding category
  type?: string;               // Finding type
  location?: Location;         // Code location
  evidence?: (Evidence | string)[]; // Supporting evidence
  recommendation?: string;     // Fix recommendation
  estimatedEffort?: number;    // Fix effort (hours)
  confidence?: number;         // Confidence (0-1)
}
```

### Location

```typescript
interface Location {
  filePath?: string;           // File path
  file?: string;               // File path (alias)
  startLine?: number;          // Start line number
  endLine?: number;            // End line number
  column?: number;             // Column number
  context?: string;            // Function/class name
}
```

### Evidence

```typescript
interface Evidence {
  type: 'code-snippet' | 'metric' | 'log' | 'screenshot' | 'reference' | 'test-result';
  description: string;         // Evidence description
  data: any;                   // Evidence data
  timestamp: string;           // Evidence timestamp
}
```

### Pattern

```typescript
interface Pattern {
  id: string;                  // Pattern identifier
  name: string;                // Pattern name
  description: string;         // Pattern description
  category: PatternCategory;   // Pattern category
  type: 'anti-pattern' | 'best-practice' | 'code-smell' | 'design-pattern' | 'architectural-pattern';
  occurrences: number;         // Detection count
  locations: Location[];       // Detection locations
  confidence: number;          // Confidence (0-1)
  frameworks: string[];        // Applicable frameworks
  evidence: Evidence[];        // Supporting evidence
  successRate?: number;        // Success rate (0-1)
  recommendation?: string;     // Related recommendation
}

type PatternCategory =
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
```

### Issue

```typescript
interface Issue {
  id: string;                  // Issue identifier
  title: string;               // Issue title
  description: string;         // Issue description
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'bug' | 'vulnerability' | 'performance' | 'accessibility' | 'code-quality' | 'technical-debt';
  location?: Location;         // Issue location
  status: 'open' | 'in-progress' | 'resolved' | 'wont-fix';
  evidence: Evidence[];        // Supporting evidence
  recommendedFix?: string;     // Fix recommendation
  estimatedEffort?: number;    // Fix effort (hours)
}
```

### InvestigationMetrics

```typescript
interface InvestigationMetrics {
  totalDuration: number;       // Total duration (ms)
  phaseDurations: Record<string, number>; // Phase durations
  tokenUsage: TokenUsage;      // Token statistics
  cachePerformance: CachePerformance; // Cache statistics
  filesAnalyzed: number;       // Files analyzed
  linesAnalyzed: number;       // Lines analyzed
  patternsDetected: number;    // Patterns detected
  issuesFound: number;         // Issues found
  findingsGenerated: number;   // Findings generated
  learningPerformance?: LearningPerformance; // Learning performance
}
```

### TokenUsage

```typescript
interface TokenUsage {
  investigationId: string;     // Investigation ID
  timestamp: Date;             // Timestamp
  phase: 'baseline' | 'optimized'; // Optimization phase
  operations: TokenOperation[]; // Token operations
  total: {
    inputTokens: number;       // Input tokens
    outputTokens: number;      // Output tokens
    totalTokens: number;       // Total tokens
    estimatedCost: number;     // Cost (USD)
  };
}

interface TokenOperation {
  operationType: 'llm-query' | 'cache-hit' | 'cache-miss';
  inputTokens: number;         // Input tokens
  outputTokens: number;        // Output tokens
  cached: boolean;             // Cache status
  cacheKey?: string;           // Cache key
}
```

### CachePerformance

```typescript
interface CachePerformance {
  totalLookups: number;        // Total lookups
  hits: number;                // Cache hits
  misses: number;              // Cache misses
  hitRate: number;             // Hit rate (0-1)
  averageLookupTime: number;   // Avg lookup time (ms)
  tokenSavings: number;        // Tokens saved
  timeSavings: number;         // Time saved (ms)
}
```

### Timeline

```typescript
interface Timeline {
  events: TimelineEvent[];     // Timeline events
  milestones: Milestone[];     // Milestones
  totalDuration: number;       // Total duration (ms)
  estimatedRemaining?: number; // Remaining time (ms)
}

interface TimelineEvent {
  id: string;                  // Event ID
  timestamp: string;           // Event timestamp
  type: 'phase-start' | 'phase-end' | 'agent-action' | 'finding-discovered' | 'pattern-detected' | 'issue-found' | 'milestone-reached' | 'error' | 'other';
  description: string;         // Event description
  data?: any;                  // Event data
  agent?: string;              // Responsible agent
}

interface Milestone {
  id: string;                  // Milestone ID
  name: string;                // Milestone name
  description: string;         // Description
  targetDate?: string;         // Target date
  completedDate?: string;      // Completion date
  met: boolean;                // Met status
}
```

### Artifact

```typescript
interface Artifact {
  id: string;                  // Artifact ID
  name: string;                // Artifact name
  type: 'report' | 'diagram' | 'screenshot' | 'code-snippet' | 'configuration' | 'test-result' | 'benchmark' | 'other';
  filePath: string;            // File path
  description: string;         // Description
  createdAt: string;           // Creation timestamp
  format: string;              // File format
  size?: number;               // Size (bytes)
}
```

### AgentCollaboration

```typescript
interface AgentCollaboration {
  agents: AgentParticipation[]; // Agent participation
  communications: AgentCommunication[]; // Inter-agent comms
  efficiency: CollaborationEfficiency; // Efficiency metrics
}

interface AgentParticipation {
  agent: string;               // Agent identifier
  role: string;                // Agent role
  phases: string[];            // Participated phases
  timeSpent: number;           // Time spent (ms)
  contributions: Contribution[]; // Contributions
}

interface Contribution {
  type: 'finding' | 'pattern' | 'recommendation' | 'analysis' | 'review' | 'other';
  id: string;                  // Contribution ID
  timestamp: string;           // Timestamp
}

interface AgentCommunication {
  id: string;                  // Communication ID
  from: string;                // From agent
  to: string[];                // To agents
  type: 'handoff' | 'request' | 'response' | 'notification' | 'escalation';
  message: string;             // Message content
  timestamp: string;           // Timestamp
  context?: any;               // Context data
}

interface CollaborationEfficiency {
  handoffCount: number;        // Handoff count
  averageHandoffTime: number;  // Avg handoff time (ms)
  parallelWorkPercentage: number; // Parallel work %
  communicationOverhead: number; // Communication overhead
  effectiveness: number;       // Effectiveness (0-1)
}
```

---

## 2. CLAUDE.md Context Types

Used in: WO-003, WO-006, WO-007

### ClaudeMdContext

```typescript
interface ClaudeMdContext {
  projectOverview: ProjectOverview; // Project info
  knownPatterns: string[];     // Known patterns
  knownIssues: string[];       // Known issues
  currentTasks: string[];      // Current tasks
  architecture?: string;       // Architecture overview
  trinityConfiguration?: TrinityConfiguration; // Trinity config
  trinityHooks?: HookConfiguration; // Hooks config
  investigationPreferences?: InvestigationPreferences; // Preferences
  agentRequirements?: AgentRequirements; // Agent requirements
}

interface ProjectOverview {
  framework?: string;          // Framework (React, Next.js, etc.)
  language?: string;           // Primary language
  techStack?: string[];        // Tech stack components
  testingFramework?: string;   // Testing framework
  description?: string;        // Project description
}
```

### TrinityConfiguration

```typescript
interface TrinityConfiguration {
  environment?: 'development' | 'staging' | 'production';
  learning?: {
    enabled: boolean;
    confidenceThreshold?: number;
    mode?: 'active' | 'manual' | 'disabled';
    patternSensitivity?: 'high' | 'medium' | 'low';
  };
  cache?: {
    enabled: boolean;
    ttl?: number;
  };
  overrides?: Record<string, any>;
  constraints?: Record<string, string>;
}
```

### HookConfiguration

```typescript
interface HookConfiguration {
  enabled: string[];           // Enabled hooks
  disabled: string[];          // Disabled hooks
  config?: Record<string, HookConfig>; // Hook configs
}

interface HookConfig {
  hookId: string;              // Hook identifier
  enabled: boolean;            // Enabled status
  conditions?: HookCondition[]; // Execution conditions
  actions?: HookAction[];      // Hook actions
  config?: Record<string, any>; // Hook config data
}

interface HookCondition {
  type: 'file-pattern' | 'agent' | 'phase' | 'metric-threshold' | 'custom';
  config: any;                 // Condition config
  operator?: 'AND' | 'OR';     // Logical operator
}

interface HookAction {
  type: 'notify' | 'validate' | 'backup' | 'generate-report' | 'custom';
  config: any;                 // Action config
}
```

### InvestigationPreferences

```typescript
interface InvestigationPreferences {
  patternSensitivity?: 'high' | 'medium' | 'low';
  errorTolerance?: 'strict' | 'moderate' | 'permissive';
  learningMode?: 'active' | 'manual' | 'disabled';
  confidenceThreshold?: number; // 0-1
  investigationDepth?: 'shallow' | 'moderate' | 'deep';
  reportingFormat?: 'concise' | 'detailed' | 'comprehensive';
}
```

---

## 3. Cache Types

Used in: WO-002, WO-011

### CacheEntry

```typescript
interface CacheEntry<T = any> {
  key: string;                 // Cache key
  value: T;                    // Cached value
  createdAt: number;           // Creation timestamp (ms)
  lastAccessedAt: number;      // Last access timestamp (ms)
  accessCount: number;         // Access count
  ttl: number;                 // Time-to-live (ms)
  expiresAt: number;           // Expiration timestamp (ms)
  metadata?: CacheMetadata;    // Entry metadata
}

interface CacheMetadata {
  size?: number;               // Entry size (bytes)
  tags?: string[];             // Entry tags
  source?: string;             // Entry source
  custom?: Record<string, any>; // Custom metadata
}
```

### CacheStats

```typescript
interface CacheStats {
  totalEntries: number;        // Total entries
  totalSize: number;           // Total size (bytes)
  hits: number;                // Cache hits
  misses: number;              // Cache misses
  hitRate: number;             // Hit rate (0-1)
  averageLookupTime: number;   // Avg lookup time (ms)
  evictions: number;           // Eviction count
  expiredEntries: number;      // Expired entries
}
```

### CacheOperationResult

```typescript
interface CacheOperationResult<T = any> {
  success: boolean;            // Operation success
  value?: T;                   // Result value
  hit?: boolean;               // Cache hit status
  duration: number;            // Operation duration (ms)
  error?: string;              // Error message
}
```

---

## 4. Learning Types

Used in: WO-004, WO-005

### LearningData

```typescript
interface LearningData {
  agent: string;               // Agent identifier
  patterns: Map<string, LearnedPattern> | LearnedPattern[]; // Learned patterns
  strategies: Map<string, StrategyPerformance> | StrategyPerformance[]; // Strategies
  investigations: InvestigationSummary[]; // Investigation history
  metadata: LearningMetadata;  // Learning metadata
  totalInvestigations?: number;
  successfulInvestigations?: number;
  failedInvestigations?: number;
}
```

### LearnedPattern

```typescript
interface LearnedPattern extends Partial<Pattern> {
  id?: string;                 // Pattern ID
  name?: string;               // Pattern name
  category?: PatternCategory;  // Pattern category
  detectionCount?: number;     // Detection count
  correctCount?: number;       // Correct count
  accuracy?: number;           // Accuracy (0-1)
  lastDetected?: string;       // Last detected timestamp
  firstDetected?: string;      // First detected timestamp
  frameworks?: string[];       // Applicable frameworks
  averageTimeSavings?: number; // Avg time savings (ms)

  // Legacy aliases
  patternId?: string;
  patternType?: 'anti-pattern' | 'best-practice' | 'code-smell' | 'design-pattern' | 'architectural-pattern' | 'validation-rule' | 'code-structure' | 'research-source';
  usageCount?: number;
  successCount?: number;
  filePaths?: string[];
  detectionCriteria?: string;
  tags?: string[];
  errorTypes?: string[];
  investigationIds?: string[];
  lastSeen?: Date;
  agentId?: string;
}
```

### StrategyPerformance

```typescript
interface StrategyPerformance {
  strategyId: string;          // Strategy ID
  strategyName: string;        // Strategy name
  usageCount: number;          // Usage count
  successCount: number;        // Success count
  successRate: number;         // Success rate (0-1)
  confidence?: number;         // Confidence (0-1)
  averageExecutionTime?: number; // Avg exec time (ms)
  optimalContext?: Record<string, any>; // Optimal context
  agentId?: string;
  description?: string;
  averageDuration?: number;
  tokenEfficiency?: number;
  successfulInvestigations?: number | string[];
  failedInvestigations?: number | string[];
  failureCount?: number;
  lastUsed?: Date | string;
  applicableContexts?: string[];
}
```

### InvestigationSummary

```typescript
interface InvestigationSummary {
  id: string;                  // Investigation ID
  type: InvestigationType;     // Investigation type
  completedAt: string;         // Completion timestamp
  duration: number;            // Duration (ms)
  success: boolean;            // Success status
  metrics: Record<string, number>; // Key metrics
  patternsDetected: string[];  // Detected patterns
}
```

---

## 5. Configuration Types

Used in: WO-003, WO-007, WO-011

### Configuration

```typescript
interface Configuration {
  environment: 'development' | 'staging' | 'production';
  cache: CacheConfig;
  learning: LearningConfig;
  investigation: InvestigationConfig;
  agents: AgentConfig;
  hooks: HookConfiguration;
  logging: LoggingConfig;
  performance: PerformanceConfig;
}
```

### CacheConfig

```typescript
interface CacheConfig {
  enabled: boolean;
  ttl: number;                 // Default TTL (ms)
  maxSize: number;             // Max cache size (bytes)
  evictionPolicy: 'lru' | 'lfu' | 'fifo';
  directory: string;           // Cache directory
  bucketing: {
    enabled: boolean;
    bucketCount: number;       // Hex buckets (0x000-0xFFF)
  };
}
```

### LearningConfig

```typescript
interface LearningConfig {
  enabled: boolean;
  mode: 'active' | 'manual' | 'disabled';
  confidenceThreshold: number; // 0-1
  patternSensitivity: 'high' | 'medium' | 'low';
  maxPatternsPerAgent: number;
  directory: string;           // Learning data directory
}
```

### InvestigationConfig

```typescript
interface InvestigationConfig {
  timeout: number;             // Investigation timeout (ms)
  maxConcurrent: number;       // Max concurrent investigations
  directory: string;           // Investigation data directory
  autoSaveInterval: number;    // Auto-save interval (ms)
  defaults: InvestigationPreferences; // Default preferences
}
```

### AgentConfig

```typescript
interface AgentConfig {
  available: string[];         // Available agents
  agentConfig: Record<string, any>; // Agent-specific config
  communicationTimeout: number; // Communication timeout (ms)
  maxParallelAgents: number;   // Max parallel agents
}
```

### LoggingConfig

```typescript
interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  console: boolean;            // Log to console
  file: boolean;               // Log to file
  filePath?: string;           // Log file path
  format: 'json' | 'text';     // Log format
  timestamps: boolean;         // Include timestamps
}
```

### PerformanceConfig

```typescript
interface PerformanceConfig {
  enabled: boolean;
  benchmarkInterval: number;   // Benchmark interval (ms)
  regressionThreshold: number; // Regression threshold (%)
  benchmarkDirectory: string;  // Benchmark results directory
}
```

---

## 6. Performance & Metrics Types

Used in: WO-008, WO-011

### PerformanceStats

```typescript
interface PerformanceStats {
  median: number;
  mean: number;
  min: number;
  max: number;
  stdDev: number;
  sampleSize: number;
  outliers: number;
  confidenceInterval?: [number, number]; // 95% CI
}
```

### BenchmarkScenario

```typescript
interface BenchmarkScenario {
  id: string;                  // Scenario ID
  name: string;                // Scenario name
  description: string;         // Description
  setup: () => Promise<void>;  // Setup function
  run: () => Promise<BenchmarkResult>; // Run function
  teardown: () => Promise<void>; // Teardown function
  iterations: number;          // Iteration count
}
```

### BenchmarkResult

```typescript
interface BenchmarkResult {
  scenarioId: string;          // Scenario ID
  iterations: number;          // Iteration count
  measurements: {
    time_ms: number[];         // Time measurements
    tokens_used: number[];     // Token measurements
    memory_mb: number[];       // Memory measurements
  };
  statistics: {
    time: PerformanceStats;
    tokens: PerformanceStats;
    memory: PerformanceStats;
  };
  timestamp: string;           // Result timestamp
}
```

---

## 7. Validation Types

Used in: WO-009, WO-010

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;              // Validation success
  errors: ValidationError[];   // Validation errors
  warnings: ValidationWarning[]; // Validation warnings
  timestamp: string;           // Validation timestamp
}
```

### ValidationError

```typescript
interface ValidationError {
  code: string;                // Error code
  message: string;             // Error message
  location?: Location;         // Error location
  severity: 'critical' | 'high' | 'medium' | 'low';
}
```

### ValidationWarning

```typescript
interface ValidationWarning {
  code: string;                // Warning code
  message: string;             // Warning message
  location?: Location;         // Warning location
}
```

---

## 8. Task Coordination Types

Used in: WO-003 (Task Pool Coordination)

### InvestigationTask

```typescript
interface InvestigationTask {
  id: string;                  // Task ID
  description: string;         // Task description
  agentType: AgentType;        // Best suited agent
  priority: TaskPriority;      // Task priority
  dependencies: string[];      // Dependency task IDs
  status: TaskStatus;          // Current status
  assignedTo?: string;         // Assigned agent ID
  result?: any;                // Task result
  error?: string;              // Error message
  startTime?: Date;            // Start timestamp
  endTime?: Date;              // End timestamp
  retryCount: number;          // Retry attempts
  metadata: TaskMetadata;      // Task metadata
}
```

### TaskStatus

```typescript
type TaskStatus =
  | 'pending'      // Waiting to be assigned
  | 'in-progress'  // Currently executing
  | 'completed'    // Successfully completed
  | 'failed'       // Execution failed
  | 'blocked';     // Blocked by dependencies
```

### AgentType

```typescript
type AgentType =
  | 'TAN'   // Trinity Architecture Navigator
  | 'ZEN'   // Zentient (knowledge base)
  | 'INO'   // Investigator (context)
  | 'JUNO'  // Quality Auditor
  | 'AJ';   // Project Manager
```

### TaskPriority

```typescript
type TaskPriority =
  | 'critical'  // Execute immediately
  | 'high'      // Execute soon
  | 'medium'    // Normal priority
  | 'low';      // Execute when available
```

### TaskDependencyGraph

```typescript
interface TaskDependencyGraph {
  nodes: Map<string, InvestigationTask>; // Task nodes
  edges: Map<string, string[]>; // Dependency edges
  roots: string[];             // Root tasks (no dependencies)
  readyQueue: string[];        // Ready to execute
}
```

### AgentStatus

```typescript
interface AgentStatus {
  agentId: string;             // Agent instance ID
  agentType: AgentType;        // Agent type
  status: 'idle' | 'busy' | 'error';
  currentTask?: string;        // Current task ID
  tasksCompleted: number;      // Completed task count
  averageTaskDuration: number; // Avg task duration (ms)
  workload: number;            // Workload (0-1)
  capabilities?: string[];     // Agent capabilities
  performance?: AgentPerformanceMetrics; // Performance metrics
}
```

### AgentPerformanceMetrics

```typescript
interface AgentPerformanceMetrics {
  successRate?: number;        // Success rate (0-1)
  averageExecutionTime?: number; // Avg exec time (ms)
  duration?: number;           // Total duration (ms)
  errorRate?: number;          // Error rate (0-1)
  lastActive?: string;         // Last active timestamp
  tokensUsed?: number;         // Tokens used
  patternsLearned?: number;    // Patterns learned
  issuesFound?: number;        // Issues found
  apiCalls?: number;           // API calls made
  errors?: number;             // Errors encountered
  warnings?: number;           // Warnings issued
  filesAnalyzed?: number;      // Files analyzed
  linesAnalyzed?: number;      // Lines analyzed
  timestamp?: Date | string;   // Metrics timestamp
}
```

---

## 9. Type Guards

Runtime type checking functions.

### isInvestigationResult

```typescript
function isInvestigationResult(value: any): value is InvestigationResult {
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
```

### isPattern

```typescript
function isPattern(value: any): value is Pattern {
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
```

### isCacheEntry

```typescript
function isCacheEntry(value: any): value is CacheEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.key === 'string' &&
    typeof value.createdAt === 'number' &&
    typeof value.ttl === 'number' &&
    'value' in value
  );
}
```

### isClaudeMdContext

```typescript
function isClaudeMdContext(value: any): value is ClaudeMdContext {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.projectOverview === 'object' &&
    Array.isArray(value.knownPatterns) &&
    Array.isArray(value.knownIssues) &&
    Array.isArray(value.currentTasks)
  );
}
```

---

## 10. Utility Types

Generic TypeScript helper types.

### DeepPartial<T>

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Usage
type PartialConfig = DeepPartial<Configuration>;
```

### DeepRequired<T>

```typescript
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Usage
type RequiredConfig = DeepRequired<Configuration>;
```

### KeysOfType<T, U>

```typescript
type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

// Usage
type StringKeys = KeysOfType<Pattern, string>; // 'id' | 'name' | 'description'
```

### StrictOmit<T, K>

```typescript
type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Usage
type PatternWithoutId = StrictOmit<Pattern, 'id'>;
```

### StrictPick<T, K>

```typescript
type StrictPick<T, K extends keyof T> = Pick<T, K>;

// Usage
type PatternBasics = StrictPick<Pattern, 'id' | 'name' | 'description'>;
```

---

## 11. Constants

### DEFAULT_CONFIG

```typescript
const DEFAULT_CONFIG: DeepPartial<Configuration> = {
  cache: {
    enabled: true,
    ttl: 86400000,           // 24 hours
    maxSize: 1073741824,     // 1GB
    evictionPolicy: 'lru',
    bucketing: {
      enabled: true,
      bucketCount: 4096      // 0x000 - 0xFFF
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
    timeout: 7200000,        // 2 hours
    maxConcurrent: 3,
    autoSaveInterval: 60000  // 1 minute
  },
  performance: {
    enabled: true,
    benchmarkInterval: 3600000, // 1 hour
    regressionThreshold: 10  // 10%
  }
};
```

### INVESTIGATION_TYPES

```typescript
const INVESTIGATION_TYPES: InvestigationType[] = [
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
```

### PATTERN_CATEGORIES

```typescript
const PATTERN_CATEGORIES: PatternCategory[] = [
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
```

---

## Usage Examples

### Creating an Investigation

```typescript
import {
  InvestigationResult,
  InvestigationType,
  InvestigationStatus
} from '@trinity/shared/types';

const investigation: InvestigationResult = {
  investigationId: 'inv-001',
  name: 'Security Audit',
  goal: 'Identify security vulnerabilities',
  type: 'security-audit',
  status: 'in-progress',
  startedAt: new Date().toISOString(),
  findings: [],
  phases: [
    {
      id: 'phase-1',
      name: 'Reconnaissance',
      description: 'Gather project information',
      status: 'in-progress',
      tasks: [],
      agents: ['INO']
    }
  ]
};
```

### Pattern Detection

```typescript
import { Pattern, PatternCategory } from '@trinity/shared/types';

const pattern: Pattern = {
  id: 'pattern-sql-injection',
  name: 'SQL Injection Vulnerability',
  description: 'Unparameterized SQL queries detected',
  category: 'security',
  type: 'anti-pattern',
  occurrences: 3,
  confidence: 0.95,
  frameworks: ['Node.js', 'Express'],
  locations: [
    {
      filePath: 'src/api/users.ts',
      startLine: 45,
      endLine: 47,
      context: 'getUserById'
    }
  ],
  evidence: [
    {
      type: 'code-snippet',
      description: 'Direct string interpolation in SQL query',
      data: 'const query = `SELECT * FROM users WHERE id = ${userId}`;',
      timestamp: new Date().toISOString()
    }
  ],
  recommendation: 'Use parameterized queries or ORM'
};
```

### Type Guards

```typescript
import { isInvestigationResult, isPattern } from '@trinity/shared/types';

const data: unknown = fetchData();

if (isInvestigationResult(data)) {
  console.log(`Investigation: ${data.investigationId}`);
  console.log(`Status: ${data.status}`);
  console.log(`Findings: ${data.findings.length}`);
}

if (isPattern(data)) {
  console.log(`Pattern: ${data.name}`);
  console.log(`Confidence: ${data.confidence * 100}%`);
}
```

### Task Coordination

```typescript
import {
  InvestigationTask,
  AgentType,
  TaskPriority,
  TaskStatus
} from '@trinity/shared/types';

const task: InvestigationTask = {
  id: 'task-001',
  description: 'Analyze authentication flow',
  agentType: 'INO',
  priority: 'high',
  dependencies: [],
  status: 'pending',
  retryCount: 0,
  metadata: {
    investigationId: 'inv-001',
    canRetry: true,
    maxRetries: 3,
    timeout: 300000 // 5 minutes
  }
};
```

---

## Type Aliases

For backward compatibility:

```typescript
// Performance metrics alias
export type PerformanceMetrics = AgentPerformanceMetrics;

// Investigation metadata alias
export type InvestigationMetadata = LearningMetadata;

// Learning metrics alias
export type LearningMetrics = LearningMetadata;
```

---

## Error Classes

Custom error classes for better error handling:

```typescript
// Lock acquisition error
class LockAcquisitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LockAcquisitionError';
  }
}

// Cycle detection error
class CycleDetectionError extends Error {
  cycles: string[][];
  constructor(message: string, cycles: string[][]) {
    super(message);
    this.name = 'CycleDetectionError';
    this.cycles = cycles;
  }
}

// Task execution error
class TaskExecutionError extends Error {
  taskId: string;
  originalError?: Error;
  constructor(message: string, taskId: string, originalError?: Error) {
    super(message);
    this.name = 'TaskExecutionError';
    this.taskId = taskId;
    this.originalError = originalError;
  }
}
```

---

## Best Practices

### 1. Always Use Shared Types

```typescript
// ✅ Good
import { Pattern } from '@trinity/shared/types';

// ❌ Bad - creates duplication
interface Pattern { ... }
```

### 2. Use Type Guards

```typescript
// ✅ Good - type-safe
if (isInvestigationResult(data)) {
  processInvestigation(data);
}

// ❌ Bad - no type safety
processInvestigation(data as InvestigationResult);
```

### 3. Leverage Utility Types

```typescript
// ✅ Good - reuse utility types
type PartialConfig = DeepPartial<Configuration>;

// ❌ Bad - manual implementation
type PartialConfig = {
  cache?: {
    enabled?: boolean;
    // ... (error-prone)
  };
};
```

### 4. Use Constants

```typescript
// ✅ Good - use provided constants
import { INVESTIGATION_TYPES } from '@trinity/shared/types';

// ❌ Bad - hardcode values
const types = ['security-audit', 'performance-review', ...];
```

---

## Related Documentation

- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\shared\README.md](../README.md) - Shared module overview
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\commands\README.md](../../cli/commands/README.md) - CLI commands using these types
- [C:\Users\lukaf\Desktop\Dev Work\Trinity Method SDK\src\cli\utils\README.md](../../cli/utils/README.md) - Utilities using these types
