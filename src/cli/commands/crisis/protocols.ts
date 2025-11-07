/**
 * Crisis Protocols - Protocol definitions for each crisis type
 *
 * @see docs/crisis-management.md - Complete crisis management methodology
 * @see types.ts - Crisis type definitions
 *
 * **Trinity Principle:** "Investigation-First Development"
 * Each protocol is derived from documented crisis management procedures in
 * docs/crisis-management.md. Protocols provide structured, step-by-step recovery
 * guidance ensuring systematic investigation and resolution.
 *
 * **Why This Exists:**
 * Ad-hoc crisis response leads to mistakes and repeated incidents. Trinity Method
 * protocols codify best practices for each crisis type, ensuring consistent,
 * methodical recovery while capturing lessons learned for continuous improvement.
 *
 * @example
 * ```typescript
 * // Get protocol for crisis type
 * const protocol = getCrisisProtocol(CrisisType.BUILD_FAILURE);
 *
 * // Display recovery steps
 * console.log(`Recovery Steps (${protocol.estimatedRecoveryTime} min):`);
 * protocol.recoverySteps.forEach((step, i) => {
 *   console.log(`  ${i + 1}. ${step}`);
 * });
 * ```
 *
 * @module cli/commands/crisis/protocols
 */

import {
  CrisisType,
  CrisisProtocol,
  CRISIS_SEVERITY_MAP,
  ESTIMATED_RECOVERY_TIME,
} from './types.js';

/**
 * Get crisis protocol for given crisis type
 *
 * @param type - Crisis type to get protocol for
 * @returns Crisis protocol with recovery guidance
 * @throws {Error} If crisis type is unknown
 */
export function getCrisisProtocol(type: CrisisType): CrisisProtocol {
  const protocol = CRISIS_PROTOCOLS[type];

  if (!protocol) {
    throw new Error(`Unknown crisis type: ${type}`);
  }

  return protocol;
}

/**
 * Get all crisis protocols
 *
 * @returns Array of all crisis protocols
 */
export function getAllCrisisProtocols(): CrisisProtocol[] {
  return Object.values(CRISIS_PROTOCOLS);
}

/**
 * Crisis protocol definitions
 *
 * Each protocol derived from docs/crisis-management.md
 */
const CRISIS_PROTOCOLS: Record<CrisisType, CrisisProtocol> = {
  /**
   * BUILD FAILURE Protocol
   *
   * Triggered when: Compilation fails, TypeScript errors, missing dependencies
   */
  [CrisisType.BUILD_FAILURE]: {
    type: CrisisType.BUILD_FAILURE,
    severity: CRISIS_SEVERITY_MAP[CrisisType.BUILD_FAILURE],
    description: 'Build process failing - compilation errors or missing dependencies',
    estimatedRecoveryTime: ESTIMATED_RECOVERY_TIME[CrisisType.BUILD_FAILURE],

    detectionSteps: [
      'Run build command (npm run build)',
      'Check for TypeScript compilation errors',
      'Verify all dependencies are installed',
      'Check for syntax errors in recent changes',
    ],

    investigationPrompts: [
      'What was the last change made before build started failing?',
      'Did any dependencies get updated recently?',
      'Are there any new TypeScript files added?',
      'Is the build failing locally or only in CI/CD?',
    ],

    diagnosticCommands: [
      'npm run build',
      'npx tsc --noEmit',
      'npm list',
      'git log --oneline -5',
      'git diff HEAD~1',
    ],

    recoverySteps: [
      'Clean build artifacts: npm run clean',
      'Delete node_modules: rm -rf node_modules',
      'Reinstall dependencies: npm install',
      'Run TypeScript compiler: npx tsc --noEmit',
      'Fix TypeScript errors one by one',
      'Verify build passes: npm run build',
    ],

    validationCriteria: [
      'Build command exits with code 0',
      'No TypeScript compilation errors',
      'All dependencies installed correctly',
      'Production bundle generated successfully',
    ],

    rollbackPlan: [
      'Identify last working commit: git log --oneline',
      'Revert to last working state: git revert HEAD',
      'Rebuild: npm run build',
      'Verify: npm test',
    ],

    commonCauses: [
      'TypeScript type errors from new code',
      'Missing or incorrect dependency versions',
      'Syntax errors in recently added files',
      'Circular dependencies introduced',
      'Breaking changes in dependency updates',
    ],

    preventionStrategies: [
      'Run npm run build locally before commit',
      'Use pre-commit hooks to catch build errors',
      'Lock dependency versions in package-lock.json',
      'Review TypeScript strict mode errors',
      'Run CI/CD pipeline on feature branches',
    ],
  },

  /**
   * TEST FAILURE Protocol
   *
   * Triggered when: Test suite failures, regressions introduced
   */
  [CrisisType.TEST_FAILURE]: {
    type: CrisisType.TEST_FAILURE,
    severity: CRISIS_SEVERITY_MAP[CrisisType.TEST_FAILURE],
    description: 'Test suite failing - regressions or broken tests detected',
    estimatedRecoveryTime: ESTIMATED_RECOVERY_TIME[CrisisType.TEST_FAILURE],

    detectionSteps: [
      'Run test suite: npm test',
      'Count failing tests',
      'Identify failing test files',
      'Check if failures are consistent or flaky',
    ],

    investigationPrompts: [
      'Which tests are failing?',
      'What functionality do the failing tests cover?',
      'Did recent code changes affect these areas?',
      'Are tests failing consistently or intermittently?',
    ],

    diagnosticCommands: [
      'npm test',
      'npm test -- --verbose',
      'npm test -- --coverage',
      'git log --oneline -10',
      'git diff HEAD~5',
    ],

    recoverySteps: [
      'Run tests to identify failures: npm test',
      'Read test failure messages carefully',
      'Isolate failing test: npm test -- path/to/test.spec.ts',
      'Debug test with console.log or debugger',
      'Fix implementation or update test expectations',
      'Verify fix: npm test',
      'Run full suite: npm test',
    ],

    validationCriteria: [
      'All tests pass (100% pass rate)',
      'Test coverage maintains ≥80%',
      'No new test failures introduced',
      'CI/CD pipeline passes',
    ],

    rollbackPlan: [
      'Identify commit that broke tests',
      'Revert breaking commit: git revert <commit>',
      'Verify tests pass: npm test',
      'Deploy fixed version',
    ],

    commonCauses: [
      'Implementation changes broke existing functionality',
      'Test expectations out of sync with implementation',
      'Missing test data or fixtures',
      'Race conditions in async tests',
      'Environmental dependencies not mocked',
    ],

    preventionStrategies: [
      'Follow TDD (RED-GREEN-REFACTOR)',
      'Run tests before every commit',
      'Use pre-commit hooks to enforce test passing',
      'Write deterministic tests (no race conditions)',
      'Mock external dependencies properly',
    ],
  },

  /**
   * ERROR PATTERN Protocol
   *
   * Triggered when: High error rate in logs, repeated exceptions
   */
  [CrisisType.ERROR_PATTERN]: {
    type: CrisisType.ERROR_PATTERN,
    severity: CRISIS_SEVERITY_MAP[CrisisType.ERROR_PATTERN],
    description: 'High error rate detected in logs - repeated exceptions or failures',
    estimatedRecoveryTime: ESTIMATED_RECOVERY_TIME[CrisisType.ERROR_PATTERN],

    detectionSteps: [
      'Analyze error logs for patterns',
      'Count error frequency (errors/minute)',
      'Identify most common error types',
      'Check if errors correlate with user actions',
    ],

    investigationPrompts: [
      'What error messages are appearing most frequently?',
      'When did the error rate start increasing?',
      'Are errors happening for all users or specific users?',
      'Is there a pattern to when errors occur (time of day, specific actions)?',
    ],

    diagnosticCommands: [
      'grep "ERROR" logs/*.log | wc -l',
      'grep "ERROR" logs/*.log | sort | uniq -c | sort -rn | head -10',
      'tail -f logs/app.log',
      'npm run test',
      'npm run lint',
    ],

    recoverySteps: [
      'Identify most frequent error from logs',
      'Locate error source in codebase: grep -r "error message"',
      'Add error handling with try-catch',
      'Add input validation to prevent error condition',
      'Add logging for better diagnostics',
      'Deploy fix',
      'Monitor error rate reduction',
    ],

    validationCriteria: [
      'Error rate drops below 10 errors/minute',
      'Specific error pattern no longer appears',
      'User functionality restored',
      'No new errors introduced',
    ],

    rollbackPlan: [
      'Deploy previous stable version',
      'Monitor error rate',
      'Investigate issue offline',
      'Apply proper fix and redeploy',
    ],

    commonCauses: [
      'Unhandled edge cases in new code',
      'Missing input validation',
      'Null pointer exceptions',
      'API integration failures',
      'Database connection issues',
    ],

    preventionStrategies: [
      'Add comprehensive error handling',
      'Validate all inputs',
      'Test edge cases thoroughly',
      'Monitor error rates in production',
      'Set up alerts for error rate spikes',
    ],
  },

  /**
   * PERFORMANCE DEGRADATION Protocol
   *
   * Triggered when: Slow responses, memory leaks, high CPU usage
   */
  [CrisisType.PERFORMANCE_DEGRADATION]: {
    type: CrisisType.PERFORMANCE_DEGRADATION,
    severity: CRISIS_SEVERITY_MAP[CrisisType.PERFORMANCE_DEGRADATION],
    description: 'Performance degradation detected - slow responses or high resource usage',
    estimatedRecoveryTime: ESTIMATED_RECOVERY_TIME[CrisisType.PERFORMANCE_DEGRADATION],

    detectionSteps: [
      'Measure API response times',
      'Check memory usage trends',
      'Monitor CPU usage',
      'Compare current metrics to baseline',
    ],

    investigationPrompts: [
      'When did performance start degrading?',
      'Which endpoints or operations are slowest?',
      'Has data volume increased recently?',
      'Were there any code changes affecting performance-critical paths?',
    ],

    diagnosticCommands: [
      'npm run benchmark',
      'node --inspect app.js',
      'ps aux | grep node',
      'top -p $(pgrep node)',
      'npm run test:performance',
    ],

    recoverySteps: [
      'Profile application with Node.js profiler',
      'Identify bottlenecks (slow database queries, N+1 problems)',
      'Add caching for expensive operations',
      'Optimize database queries (add indexes, use SELECT only needed fields)',
      'Implement pagination for large datasets',
      'Deploy optimizations',
      'Verify performance improvement',
    ],

    validationCriteria: [
      'API response times < 500ms (p95)',
      'Memory usage stable (no leaks)',
      'CPU usage < 80%',
      'User-reported slowness resolved',
    ],

    rollbackPlan: [
      'Deploy previous version',
      'Verify performance restored',
      'Optimize code offline',
      'Redeploy with optimizations',
    ],

    commonCauses: [
      'N+1 database query problems',
      'Missing database indexes',
      'Memory leaks from unclosed connections',
      'Inefficient algorithms (O(n²) instead of O(n))',
      'Large payload sizes',
    ],

    preventionStrategies: [
      'Run performance benchmarks in CI/CD',
      'Monitor response times in production',
      'Use database query profiling',
      'Implement caching strategies',
      'Set performance budgets',
    ],
  },

  /**
   * SECURITY VULNERABILITY Protocol
   *
   * Triggered when: Dependency vulnerabilities, exposed secrets, security scan failures
   */
  [CrisisType.SECURITY_VULNERABILITY]: {
    type: CrisisType.SECURITY_VULNERABILITY,
    severity: CRISIS_SEVERITY_MAP[CrisisType.SECURITY_VULNERABILITY],
    description: 'Security vulnerability detected - dependency issues or exposed secrets',
    estimatedRecoveryTime: ESTIMATED_RECOVERY_TIME[CrisisType.SECURITY_VULNERABILITY],

    detectionSteps: [
      'Run security audit: npm audit',
      'Check for exposed secrets in git history',
      'Scan dependencies for known vulnerabilities',
      'Review recent code changes for security issues',
    ],

    investigationPrompts: [
      'What is the CVSS score of the vulnerability?',
      'Is the vulnerable package directly used or transitive?',
      'Is there a patch available?',
      'Are secrets exposed in git history?',
    ],

    diagnosticCommands: [
      'npm audit',
      'npm audit --json',
      'npm outdated',
      'git log -S "password" --all',
      'git log -S "api_key" --all',
    ],

    recoverySteps: [
      'Review npm audit output',
      'Update vulnerable packages: npm update',
      'If no update available, find alternative package',
      'Check for secrets in git: git log -S "api_key"',
      'If secrets found, rotate credentials immediately',
      'Add secrets to .gitignore',
      'Run npm audit fix',
      'Verify vulnerabilities resolved: npm audit',
    ],

    validationCriteria: [
      'npm audit shows 0 vulnerabilities',
      'No secrets in git history',
      'All dependencies up to date',
      'Security scan passes',
    ],

    rollbackPlan: [
      'If security patch breaks functionality, isolate vulnerable code path',
      'Implement temporary mitigation (disable feature, add input validation)',
      'Plan permanent fix offline',
      'Deploy fix',
    ],

    commonCauses: [
      'Outdated dependencies with known vulnerabilities',
      'Secrets committed to git',
      'Insufficient input validation',
      'Vulnerable transitive dependencies',
      'Missing security headers',
    ],

    preventionStrategies: [
      'Run npm audit in CI/CD pipeline',
      'Set up Dependabot for automatic updates',
      'Use .env files for secrets (never commit)',
      'Add pre-commit hooks to check for secrets',
      'Regular security audits',
    ],
  },
};

/**
 * Export protocols for testing and documentation
 */
export { CRISIS_PROTOCOLS };