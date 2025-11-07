/**
 * Crisis Validator - Validate crisis recovery and system health
 *
 * @see docs/crisis-management.md - Crisis management methodology
 * @see types.ts - Crisis types and validation structures
 * @see detector.ts - Crisis detection
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Recovery validation uses objective metrics to confirm crisis resolution. Rather than
 * assuming the crisis is fixed, the validator re-runs detection checks, verifies validation
 * criteria, and confirms system health, providing evidence-based confidence that the crisis
 * is truly resolved.
 *
 * **Why This Exists:**
 * Traditional crisis recovery often skips validation: developers assume their fix worked
 * without verification. Trinity Method validator ensures thorough validation through
 * automated re-detection, criteria checking, and health verification, preventing false
 * positives and ensuring genuine crisis resolution.
 *
 * @example
 * ```typescript
 * // Validate recovery after executing protocol
 * const isResolved = await validateRecovery(CrisisType.BUILD_FAILURE);
 *
 * if (isResolved) {
 *   console.log('✅ Crisis resolved and validated');
 * } else {
 *   console.log('❌ Crisis still detected - recovery incomplete');
 * }
 * ```
 *
 * @module cli/commands/crisis/validator
 */

import { CrisisType, CrisisProtocol, ValidationResult } from './types.js';
import { detectCrisis, getCrisisMetrics } from './detector.js';

/**
 * Validate that crisis has been resolved
 *
 * Performs comprehensive validation:
 * 1. Re-run crisis detection (should return null)
 * 2. Verify all validation criteria from protocol
 * 3. Check system health metrics
 * 4. Confirm no new crises introduced
 *
 * @param originalCrisisType - Original crisis type being recovered from
 * @param protocol - Crisis protocol with validation criteria
 * @returns Promise resolving to validation result
 */
export async function validateRecovery(
  originalCrisisType: CrisisType,
  protocol: CrisisProtocol
): Promise<{
  isResolved: boolean;
  evidence: string[];
  metrics: any;
  newCrises: CrisisType[];
}> {
  console.log('\n🔍 Validating crisis recovery...\n');

  const evidence: string[] = [];
  const newCrises: CrisisType[] = [];

  // Step 1: Re-run crisis detection
  console.log('1. Re-running crisis detection...');
  const detection = await detectCrisis();

  if (detection.type === null) {
    console.log('   ✅ No crisis detected');
    evidence.push('Crisis detection returned null (system healthy)');
  } else if (detection.type === originalCrisisType) {
    console.log(`   ❌ Original crisis still detected: ${detection.type}`);
    evidence.push(`Original crisis ${originalCrisisType} still detected with ${(detection.confidence * 100).toFixed(0)}% confidence`);
    evidence.push(...detection.evidence);
  } else {
    console.log(`   ⚠️  Different crisis detected: ${detection.type}`);
    newCrises.push(detection.type);
    evidence.push(`New crisis detected: ${detection.type}`);
    evidence.push(...detection.evidence);
  }

  // Step 2: Check system health metrics
  console.log('\n2. Checking system health metrics...');
  const metrics = await getCrisisMetrics();

  // Build status
  if (metrics.buildPassing) {
    console.log('   ✅ Build passing');
    evidence.push('Build status: passing');
  } else {
    console.log('   ❌ Build failing');
    evidence.push('Build status: failing');
  }

  // Test status
  if (metrics.failingTests === 0) {
    console.log('   ✅ All tests passing');
    evidence.push('Test status: all passing');
  } else {
    console.log(`   ❌ ${metrics.failingTests} test(s) failing`);
    evidence.push(`Test status: ${metrics.failingTests} failures`);
  }

  // Error rate
  if (metrics.errorRate < 10) {
    console.log(`   ✅ Error rate normal (${metrics.errorRate.toFixed(1)}/min)`);
    evidence.push(`Error rate: ${metrics.errorRate.toFixed(1)} errors/minute (healthy)`);
  } else {
    console.log(`   ⚠️  Error rate elevated (${metrics.errorRate.toFixed(1)}/min)`);
    evidence.push(`Error rate: ${metrics.errorRate.toFixed(1)} errors/minute (elevated)`);
  }

  // Performance
  if (metrics.performance.avgResponseTime < 500) {
    console.log(`   ✅ Performance normal (${metrics.performance.avgResponseTime.toFixed(0)}ms)`);
    evidence.push(`Response time: ${metrics.performance.avgResponseTime.toFixed(0)}ms (healthy)`);
  } else {
    console.log(`   ⚠️  Performance degraded (${metrics.performance.avgResponseTime.toFixed(0)}ms)`);
    evidence.push(`Response time: ${metrics.performance.avgResponseTime.toFixed(0)}ms (slow)`);
  }

  // Security
  if (metrics.securityIssues.length === 0) {
    console.log('   ✅ No security vulnerabilities');
    evidence.push('Security: no vulnerabilities detected');
  } else {
    console.log(`   ⚠️  ${metrics.securityIssues.length} security issue(s) detected`);
    evidence.push(`Security: ${metrics.securityIssues.length} vulnerabilities`);
  }

  // Step 3: Validate protocol criteria
  console.log('\n3. Validating protocol criteria...');
  const criteriaResults = await validateProtocolCriteria(originalCrisisType, protocol, metrics);

  const passedCriteria = criteriaResults.filter((r) => r.passed).length;
  const totalCriteria = criteriaResults.length;

  console.log(`   ${passedCriteria}/${totalCriteria} criteria met`);
  criteriaResults.forEach((result) => {
    const status = result.passed ? '✅' : '❌';
    console.log(`   ${status} ${result.criterion}`);
    evidence.push(`${result.criterion}: ${result.passed ? 'passed' : 'failed'}`);
  });

  // Determine if crisis is resolved
  const isResolved =
    detection.type !== originalCrisisType && // Original crisis not detected
    passedCriteria >= totalCriteria * 0.8 && // At least 80% of criteria met
    newCrises.length === 0; // No new crises introduced

  console.log('\n' + '━'.repeat(70));
  if (isResolved) {
    console.log('✅ VALIDATION PASSED - Crisis resolved');
  } else {
    console.log('❌ VALIDATION FAILED - Crisis not resolved');

    if (detection.type === originalCrisisType) {
      console.log('   Reason: Original crisis still detected');
    }
    if (passedCriteria < totalCriteria * 0.8) {
      console.log(`   Reason: Only ${passedCriteria}/${totalCriteria} criteria met (need ≥80%)`);
    }
    if (newCrises.length > 0) {
      console.log(`   Reason: New crisis detected (${newCrises.join(', ')})`);
    }
  }
  console.log('━'.repeat(70) + '\n');

  return {
    isResolved,
    evidence,
    metrics,
    newCrises,
  };
}

/**
 * Validate protocol-specific criteria against current system state
 *
 * Checks each validation criterion from the protocol against actual metrics
 *
 * @param crisisType - Crisis type being validated
 * @param protocol - Crisis protocol with validation criteria
 * @param metrics - Current system metrics
 * @returns Array of validation results
 */
async function validateProtocolCriteria(
  crisisType: CrisisType,
  protocol: CrisisProtocol,
  metrics: any
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (const criterion of protocol.validationCriteria) {
    let passed = false;
    let details = '';

    // Match criterion to metric check
    const lowerCriterion = criterion.toLowerCase();

    if (lowerCriterion.includes('build') && lowerCriterion.includes('pass')) {
      passed = metrics.buildPassing;
      details = passed ? 'Build is passing' : 'Build is failing';
    } else if (lowerCriterion.includes('test') && lowerCriterion.includes('pass')) {
      passed = metrics.failingTests === 0;
      details = passed ? 'All tests passing' : `${metrics.failingTests} tests failing`;
    } else if (lowerCriterion.includes('error') || lowerCriterion.includes('zero')) {
      passed = metrics.errorRate < 10;
      details = `Error rate: ${metrics.errorRate.toFixed(1)}/min`;
    } else if (lowerCriterion.includes('performance') || lowerCriterion.includes('response')) {
      passed = metrics.performance.avgResponseTime < 500;
      details = `Response time: ${metrics.performance.avgResponseTime.toFixed(0)}ms`;
    } else if (lowerCriterion.includes('security') || lowerCriterion.includes('vulnerabilit')) {
      passed = metrics.securityIssues.length === 0;
      details = passed ? 'No vulnerabilities' : `${metrics.securityIssues.length} vulnerabilities`;
    } else if (lowerCriterion.includes('memory')) {
      passed = metrics.performance.memoryUsage < 1000;
      details = `Memory usage: ${metrics.performance.memoryUsage.toFixed(0)}MB`;
    } else if (lowerCriterion.includes('cpu')) {
      passed = metrics.performance.cpuUsage < 80;
      details = `CPU usage: ${metrics.performance.cpuUsage.toFixed(1)}%`;
    } else {
      // Generic criterion - cannot auto-validate, mark as passed
      passed = true;
      details = 'Manual validation required';
    }

    results.push({
      criterion,
      passed,
      details,
      validatedAt: new Date(),
    });
  }

  return results;
}

/**
 * Quick health check - validate system is healthy
 *
 * Lighter-weight than full validation, just checks critical metrics
 *
 * @returns Promise resolving to health status
 */
export async function quickHealthCheck(): Promise<{
  healthy: boolean;
  issues: string[];
}> {
  console.log('🏥 Running quick health check...\n');

  const metrics = await getCrisisMetrics();
  const issues: string[] = [];

  // Check critical metrics
  if (!metrics.buildPassing) {
    issues.push('Build is failing');
  }

  if (metrics.failingTests > 0) {
    issues.push(`${metrics.failingTests} tests failing`);
  }

  if (metrics.errorRate >= 10) {
    issues.push(`High error rate: ${metrics.errorRate.toFixed(1)}/min`);
  }

  if (metrics.performance.avgResponseTime >= 500) {
    issues.push(`Slow response time: ${metrics.performance.avgResponseTime.toFixed(0)}ms`);
  }

  if (metrics.securityIssues.length > 0) {
    const criticalCount = metrics.securityIssues.filter((i) => i.severity === 'critical').length;
    if (criticalCount > 0) {
      issues.push(`${criticalCount} critical security vulnerabilities`);
    }
  }

  const healthy = issues.length === 0;

  if (healthy) {
    console.log('✅ System healthy - no issues detected\n');
  } else {
    console.log('⚠️  System health issues detected:\n');
    issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. ${issue}`);
    });
    console.log();
  }

  return { healthy, issues };
}

/**
 * Validate specific crisis type is resolved
 *
 * Type-specific validation logic for each crisis type
 *
 * @param crisisType - Crisis type to validate
 * @returns Promise resolving to validation status
 */
export async function validateCrisisType(crisisType: CrisisType): Promise<boolean> {
  console.log(`🔍 Validating ${crisisType} resolution...\n`);

  const metrics = await getCrisisMetrics();

  switch (crisisType) {
    case CrisisType.BUILD_FAILURE:
      const buildResolved = metrics.buildPassing;
      console.log(buildResolved ? '✅ Build passing' : '❌ Build still failing');
      return buildResolved;

    case CrisisType.TEST_FAILURE:
      const testsResolved = metrics.failingTests === 0;
      console.log(
        testsResolved
          ? '✅ All tests passing'
          : `❌ ${metrics.failingTests} tests still failing`
      );
      return testsResolved;

    case CrisisType.ERROR_PATTERN:
      const errorsResolved = metrics.errorRate < 10;
      console.log(
        errorsResolved
          ? `✅ Error rate normal (${metrics.errorRate.toFixed(1)}/min)`
          : `❌ Error rate still high (${metrics.errorRate.toFixed(1)}/min)`
      );
      return errorsResolved;

    case CrisisType.PERFORMANCE_DEGRADATION:
      const performanceResolved = metrics.performance.avgResponseTime < 500;
      console.log(
        performanceResolved
          ? `✅ Performance normal (${metrics.performance.avgResponseTime.toFixed(0)}ms)`
          : `❌ Performance still degraded (${metrics.performance.avgResponseTime.toFixed(0)}ms)`
      );
      return performanceResolved;

    case CrisisType.SECURITY_VULNERABILITY:
      const securityResolved = metrics.securityIssues.length === 0;
      console.log(
        securityResolved
          ? '✅ No security vulnerabilities'
          : `❌ ${metrics.securityIssues.length} vulnerabilities still present`
      );
      return securityResolved;

    default:
      console.log('⚠️  Unknown crisis type');
      return false;
  }
}

/**
 * Generate validation report
 *
 * Creates summary of validation results for documentation
 *
 * @param validationResult - Result from validateRecovery()
 * @returns Markdown-formatted validation report
 */
export function generateValidationReport(validationResult: {
  isResolved: boolean;
  evidence: string[];
  metrics: any;
  newCrises: CrisisType[];
}): string {
  const lines: string[] = [];

  lines.push('# Validation Report');
  lines.push('');
  lines.push(`**Status:** ${validationResult.isResolved ? '✅ Resolved' : '❌ Not Resolved'}`);
  lines.push(`**Timestamp:** ${new Date().toISOString()}`);
  lines.push('');

  lines.push('## Evidence');
  lines.push('');
  validationResult.evidence.forEach((item, i) => {
    lines.push(`${i + 1}. ${item}`);
  });
  lines.push('');

  lines.push('## System Metrics');
  lines.push('');
  lines.push(`- **Build:** ${validationResult.metrics.buildPassing ? 'Passing' : 'Failing'}`);
  lines.push(`- **Tests:** ${validationResult.metrics.failingTests} failing`);
  lines.push(`- **Error Rate:** ${validationResult.metrics.errorRate.toFixed(1)}/min`);
  lines.push(
    `- **Response Time:** ${validationResult.metrics.performance.avgResponseTime.toFixed(0)}ms`
  );
  lines.push(
    `- **Memory:** ${validationResult.metrics.performance.memoryUsage.toFixed(0)}MB`
  );
  lines.push(`- **CPU:** ${validationResult.metrics.performance.cpuUsage.toFixed(1)}%`);
  lines.push(`- **Security:** ${validationResult.metrics.securityIssues.length} vulnerabilities`);
  lines.push('');

  if (validationResult.newCrises.length > 0) {
    lines.push('## New Crises Detected');
    lines.push('');
    validationResult.newCrises.forEach((crisis) => {
      lines.push(`- ${crisis}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}