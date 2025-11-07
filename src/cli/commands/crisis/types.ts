/**
 * Crisis Types and Protocols - Trinity Method Crisis Management System
 *
 * @see docs/crisis-management.md - Complete crisis management methodology
 * @see docs/quality-standards.md - Quality standards enforced during recovery
 * @see docs/best-practices.md - Crisis prevention patterns
 *
 * **Trinity Principle:** "Systematic Quality Assurance"
 * Trinity Method treats crises as investigations requiring systematic detection, diagnosis,
 * and guided recovery. Rather than panicking, developers follow proven protocols that ensure
 * methodical recovery while capturing lessons learned for future prevention.
 *
 * **Why This Exists:**
 * Traditional crisis management is ad-hoc: developers panic, make rushed fixes, and create
 * more technical debt. Trinity Method provides structured protocols for five crisis types
 * with step-by-step guidance, validation criteria, and automatic archiving of crisis reports
 * for organizational learning. Crises become learning opportunities rather than chaos.
 *
 * @example
 * ```typescript
 * // Check crisis severity
 * const protocol = getCrisisProtocol(CrisisType.BUILD_FAILURE);
 * console.log(`Severity: ${protocol.severity}`);
 *
 * // Execute recovery protocol
 * await executeProtocol(protocol);
 * ```
 *
 * @module cli/commands/crisis/types
 */

/**
 * Crisis types detected by Trinity Method crisis management system
 *
 * Five crisis types representing the most common production failures:
 * - BUILD_FAILURE: Compilation fails, TypeScript errors, missing dependencies
 * - TEST_FAILURE: Test suite failures, regressions introduced
 * - ERROR_PATTERN: High error rate in logs, repeated exceptions
 * - PERFORMANCE_DEGRADATION: Slow responses, memory leaks, high CPU
 * - SECURITY_VULNERABILITY: Dependency vulnerabilities, exposed secrets
 */
export enum CrisisType {
  BUILD_FAILURE = 'build_failure',
  TEST_FAILURE = 'test_failure',
  ERROR_PATTERN = 'error_pattern',
  PERFORMANCE_DEGRADATION = 'performance_degradation',
  SECURITY_VULNERABILITY = 'security_vulnerability'
}

/**
 * Crisis severity levels for triage and escalation
 *
 * - CRITICAL: Production down, immediate action required
 * - HIGH: Production degraded, users impacted
 * - MEDIUM: Non-critical issues, scheduled fix
 */
export type CrisisSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

/**
 * Crisis protocol - Structured recovery plan for a crisis type
 *
 * Each protocol provides:
 * - Detection steps: How to identify this crisis type
 * - Investigation prompts: Questions to understand root cause
 * - Diagnostic commands: Commands to run for diagnosis
 * - Recovery steps: Actions to resolve the crisis
 * - Validation criteria: How to verify crisis is resolved
 * - Rollback plan: Steps to undo changes if recovery fails
 */
export interface CrisisProtocol {
  /** Crisis type this protocol addresses */
  type: CrisisType;

  /** Severity level for triage (CRITICAL, HIGH, MEDIUM) */
  severity: CrisisSeverity;

  /** Description of this crisis type */
  description: string;

  /** Steps to detect this crisis type automatically */
  detectionSteps: string[];

  /** Questions to guide root cause investigation */
  investigationPrompts: string[];

  /** Diagnostic commands to run (with user approval) */
  diagnosticCommands: string[];

  /** Recovery actions to resolve the crisis */
  recoverySteps: string[];

  /** Criteria to validate crisis is resolved */
  validationCriteria: string[];

  /** Optional rollback plan if recovery fails */
  rollbackPlan?: string[];

  /** Time estimate for recovery (minutes) */
  estimatedRecoveryTime: number;

  /** Common causes of this crisis type */
  commonCauses: string[];

  /** Prevention strategies to avoid future occurrences */
  preventionStrategies: string[];
}

/**
 * Crisis detection result with confidence score
 */
export interface CrisisDetectionResult {
  /** Crisis type detected (null if no crisis) */
  type: CrisisType | null;

  /** Confidence score 0-1 (1 = definitely a crisis) */
  confidence: number;

  /** Evidence supporting this detection */
  evidence: string[];

  /** Timestamp of detection */
  detectedAt: Date;

  /** Metrics at time of detection */
  metrics: CrisisMetrics;
}

/**
 * Crisis metrics collected during detection
 */
export interface CrisisMetrics {
  /** Build status (true = passing) */
  buildPassing: boolean;

  /** Number of failing tests */
  failingTests: number;

  /** Error rate (errors per minute) */
  errorRate: number;

  /** Performance metrics */
  performance: {
    /** Average response time (ms) */
    avgResponseTime: number;
    /** Memory usage (MB) */
    memoryUsage: number;
    /** CPU usage (%) */
    cpuUsage: number;
  };

  /** Security issues detected */
  securityIssues: SecurityIssue[];
}

/**
 * Security issue detected during crisis scan
 */
export interface SecurityIssue {
  /** Package name with vulnerability */
  packageName: string;

  /** Current installed version */
  currentVersion: string;

  /** Severity (critical, high, moderate, low) */
  severity: string;

  /** Vulnerability description */
  description: string;

  /** Recommended fix */
  recommendation: string;
}

/**
 * Crisis recovery session tracking
 */
export interface CrisisRecoverySession {
  /** Unique session ID */
  sessionId: string;

  /** Crisis type being addressed */
  crisisType: CrisisType;

  /** Protocol being followed */
  protocol: CrisisProtocol;

  /** Session start time */
  startTime: Date;

  /** Session end time (null if ongoing) */
  endTime: Date | null;

  /** Current step index */
  currentStep: number;

  /** Completed steps */
  completedSteps: string[];

  /** Investigation findings */
  findings: string[];

  /** Diagnostic results */
  diagnosticResults: DiagnosticResult[];

  /** Recovery actions taken */
  actionsTaken: string[];

  /** Validation results */
  validationResults: ValidationResult[];

  /** Session status */
  status: 'in_progress' | 'resolved' | 'failed' | 'rolled_back';

  /** Lessons learned */
  lessonsLearned?: string[];
}

/**
 * Diagnostic command result
 */
export interface DiagnosticResult {
  /** Command executed */
  command: string;

  /** Exit code */
  exitCode: number;

  /** Standard output */
  stdout: string;

  /** Standard error */
  stderr: string;

  /** Execution duration (ms) */
  duration: number;

  /** Timestamp */
  executedAt: Date;
}

/**
 * Validation result for recovery step
 */
export interface ValidationResult {
  /** Validation criterion */
  criterion: string;

  /** Passed validation? */
  passed: boolean;

  /** Details/evidence */
  details: string;

  /** Timestamp */
  validatedAt: Date;
}

/**
 * Crisis report for archiving and learning
 */
export interface CrisisReport {
  /** Crisis session */
  session: CrisisRecoverySession;

  /** Root cause analysis */
  rootCause: string;

  /** Resolution summary */
  resolution: string;

  /** Time to resolution (minutes) */
  timeToResolution: number;

  /** Prevention recommendations */
  preventionRecommendations: string[];

  /** Learned patterns to add to learning system */
  learnedPatterns: LearnedPattern[];

  /** Report generated at */
  generatedAt: Date;
}

/**
 * Learned pattern from crisis recovery
 */
export interface LearnedPattern {
  /** Pattern ID */
  patternId: string;

  /** Pattern description */
  description: string;

  /** Context where pattern applies */
  context: string;

  /** Tags for categorization */
  tags: string[];

  /** Confidence score */
  confidence: number;

  /** Crisis type this pattern relates to */
  relatedCrisisType: CrisisType;
}

/**
 * Crisis thresholds for detection
 */
export const CRISIS_THRESHOLDS = {
  /** Error rate threshold (errors/minute) */
  ERROR_RATE: 10,

  /** Performance degradation threshold (ms increase) */
  PERFORMANCE_DEGRADATION: 200,

  /** Memory usage threshold (MB) */
  MEMORY_USAGE: 1000,

  /** CPU usage threshold (%) */
  CPU_USAGE: 80,

  /** Minimum confidence for crisis detection */
  MIN_CONFIDENCE: 0.7,
} as const;

/**
 * Crisis severity mapping
 */
export const CRISIS_SEVERITY_MAP: Record<CrisisType, CrisisSeverity> = {
  [CrisisType.BUILD_FAILURE]: 'CRITICAL',
  [CrisisType.TEST_FAILURE]: 'HIGH',
  [CrisisType.ERROR_PATTERN]: 'HIGH',
  [CrisisType.PERFORMANCE_DEGRADATION]: 'MEDIUM',
  [CrisisType.SECURITY_VULNERABILITY]: 'CRITICAL',
};

/**
 * Estimated recovery time by crisis type (minutes)
 */
export const ESTIMATED_RECOVERY_TIME: Record<CrisisType, number> = {
  [CrisisType.BUILD_FAILURE]: 15,
  [CrisisType.TEST_FAILURE]: 30,
  [CrisisType.ERROR_PATTERN]: 45,
  [CrisisType.PERFORMANCE_DEGRADATION]: 60,
  [CrisisType.SECURITY_VULNERABILITY]: 20,
};