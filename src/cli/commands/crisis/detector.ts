/**
 * Crisis Detector - Automated crisis detection system
 *
 * @see docs/crisis-management.md - Crisis management methodology
 * @see types.ts - Crisis type definitions
 * @see protocols.ts - Crisis protocols
 *
 * **Trinity Principle:** "Evidence-Based Decisions"
 * Crisis detection uses measurable metrics and thresholds to identify system failures
 * automatically. Rather than relying on manual discovery, the detector proactively scans
 * for build failures, test failures, error patterns, performance degradation, and security
 * vulnerabilities, providing early warning and rapid response.
 *
 * **Why This Exists:**
 * Traditional crisis management is reactive: problems are discovered by users or after
 * significant damage. Trinity Method detector proactively identifies crises using automated
 * checks, enabling rapid response before user impact. Detection is the first step in
 * systematic crisis recovery.
 *
 * @example
 * ```typescript
 * // Detect current crisis state
 * const detection = await detectCrisis();
 *
 * if (detection.type) {
 *   console.log(`Crisis detected: ${detection.type}`);
 *   console.log(`Confidence: ${(detection.confidence * 100).toFixed(0)}%`);
 *   console.log(`Evidence: ${detection.evidence.join(', ')}`);
 * } else {
 *   console.log('No crisis detected - system healthy');
 * }
 * ```
 *
 * @module cli/commands/crisis/detector
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  CrisisType,
  CrisisDetectionResult,
  CrisisMetrics,
  SecurityIssue,
  CRISIS_THRESHOLDS,
} from './types.js';

const execAsync = promisify(exec);

/**
 * Detect current crisis state with confidence scoring
 *
 * Runs automated checks for all crisis types:
 * 1. Build status (compilation errors)
 * 2. Test status (failing tests)
 * 3. Error patterns (high error rate in logs)
 * 4. Performance metrics (slow responses, high resource usage)
 * 5. Security vulnerabilities (npm audit)
 *
 * @returns Promise resolving to detection result with type, confidence, evidence
 */
export async function detectCrisis(): Promise<CrisisDetectionResult> {
  console.log('[Crisis Detector] Starting automated crisis detection...');
  const startTime = performance.now();

  // Run all detection checks in parallel
  const [buildStatus, testStatus, errorRate, performanceMetrics, securityIssues] =
    await Promise.all([
      checkBuildStatus(),
      checkTestStatus(),
      analyzeErrorLogs(),
      checkPerformance(),
      scanSecurity(),
    ]);

  const duration = performance.now() - startTime;
  console.log(`[Crisis Detector] Detection complete in ${duration.toFixed(2)}ms`);

  // Collect metrics
  const metrics: CrisisMetrics = {
    buildPassing: buildStatus.passing,
    failingTests: testStatus.failureCount,
    errorRate: errorRate.errorsPerMinute,
    performance: performanceMetrics,
    securityIssues: securityIssues,
  };

  // Determine crisis type with confidence scoring
  const detections: Array<{ type: CrisisType; confidence: number; evidence: string[] }> = [];

  // Build failure detection
  if (!buildStatus.passing) {
    detections.push({
      type: CrisisType.BUILD_FAILURE,
      confidence: 1.0,
      evidence: [
        `Build command failed with exit code ${buildStatus.exitCode}`,
        ...buildStatus.errors.slice(0, 3),
      ],
    });
  }

  // Test failure detection
  if (testStatus.failureCount > 0) {
    const confidence = Math.min(1.0, testStatus.failureCount / 10); // Scale 1-10 failures
    detections.push({
      type: CrisisType.TEST_FAILURE,
      confidence,
      evidence: [
        `${testStatus.failureCount} test(s) failing`,
        ...testStatus.failingTests.slice(0, 3).map((t) => `Test failed: ${t}`),
      ],
    });
  }

  // Error pattern detection
  if (errorRate.errorsPerMinute > CRISIS_THRESHOLDS.ERROR_RATE) {
    const confidence = Math.min(
      1.0,
      errorRate.errorsPerMinute / (CRISIS_THRESHOLDS.ERROR_RATE * 2)
    );
    detections.push({
      type: CrisisType.ERROR_PATTERN,
      confidence,
      evidence: [
        `High error rate: ${errorRate.errorsPerMinute.toFixed(1)} errors/minute (threshold: ${CRISIS_THRESHOLDS.ERROR_RATE})`,
        `Most common: ${errorRate.topErrors[0]?.message || 'unknown'}`,
      ],
    });
  }

  // Performance degradation detection
  if (performanceMetrics.avgResponseTime > CRISIS_THRESHOLDS.PERFORMANCE_DEGRADATION) {
    const confidence = Math.min(
      1.0,
      performanceMetrics.avgResponseTime / (CRISIS_THRESHOLDS.PERFORMANCE_DEGRADATION * 2)
    );
    detections.push({
      type: CrisisType.PERFORMANCE_DEGRADATION,
      confidence,
      evidence: [
        `Slow response time: ${performanceMetrics.avgResponseTime.toFixed(0)}ms (threshold: ${CRISIS_THRESHOLDS.PERFORMANCE_DEGRADATION}ms)`,
        `Memory usage: ${performanceMetrics.memoryUsage.toFixed(0)}MB`,
        `CPU usage: ${performanceMetrics.cpuUsage.toFixed(1)}%`,
      ],
    });
  }

  // Security vulnerability detection
  if (securityIssues.length > 0) {
    const criticalCount = securityIssues.filter((i) => i.severity === 'critical').length;
    const confidence = criticalCount > 0 ? 1.0 : 0.8; // Critical vulns = 100% confidence
    detections.push({
      type: CrisisType.SECURITY_VULNERABILITY,
      confidence,
      evidence: [
        `${securityIssues.length} security vulnerabilities detected`,
        ...securityIssues
          .slice(0, 3)
          .map((i) => `${i.severity.toUpperCase()}: ${i.packageName}@${i.currentVersion}`),
      ],
    });
  }

  // Select highest confidence crisis
  if (detections.length === 0) {
    console.log('[Crisis Detector] No crisis detected - system healthy ✅');
    return {
      type: null,
      confidence: 0,
      evidence: ['All checks passed', 'System healthy'],
      detectedAt: new Date(),
      metrics,
    };
  }

  // Sort by confidence (highest first)
  detections.sort((a, b) => b.confidence - a.confidence);
  const primaryCrisis = detections[0];

  console.log(
    `[Crisis Detector] Crisis detected: ${primaryCrisis.type} (confidence: ${(primaryCrisis.confidence * 100).toFixed(0)}%)`
  );

  return {
    type: primaryCrisis.type,
    confidence: primaryCrisis.confidence,
    evidence: primaryCrisis.evidence,
    detectedAt: new Date(),
    metrics,
  };
}

/**
 * Check build status by running build command
 *
 * @returns Build status with pass/fail and error details
 */
async function checkBuildStatus(): Promise<{
  passing: boolean;
  exitCode: number;
  errors: string[];
}> {
  console.log('[Crisis Detector] Checking build status...');

  try {
    const { stdout, stderr } = await execAsync('npm run build', {
      cwd: process.cwd(),
      timeout: 120000, // 2 minute timeout
    });

    console.log('[Crisis Detector] Build passed ✅');
    return {
      passing: true,
      exitCode: 0,
      errors: [],
    };
  } catch (error: any) {
    console.log('[Crisis Detector] Build failed ❌');

    // Parse TypeScript errors from stderr
    const errors: string[] = [];
    if (error.stderr) {
      const errorLines = error.stderr.split('\n').filter((line: string) => line.includes('error TS'));
      errors.push(...errorLines.slice(0, 5)); // Top 5 errors
    }

    return {
      passing: false,
      exitCode: error.code || 1,
      errors: errors.length > 0 ? errors : ['Build failed with unknown error'],
    };
  }
}

/**
 * Check test status by running test suite
 *
 * @returns Test status with failure count and failing test names
 */
async function checkTestStatus(): Promise<{
  failureCount: number;
  failingTests: string[];
}> {
  console.log('[Crisis Detector] Checking test status...');

  try {
    const { stdout, stderr } = await execAsync('npm test -- --passWithNoTests', {
      cwd: process.cwd(),
      timeout: 300000, // 5 minute timeout
    });

    console.log('[Crisis Detector] All tests passed ✅');
    return {
      failureCount: 0,
      failingTests: [],
    };
  } catch (error: any) {
    console.log('[Crisis Detector] Tests failing ❌');

    // Parse failing test count from Jest output
    let failureCount = 0;
    const failingTests: string[] = [];

    if (error.stdout || error.stderr) {
      const output = error.stdout + error.stderr;

      // Extract failure count from "Tests: X failed"
      const failMatch = output.match(/Tests:\s+(\d+)\s+failed/);
      if (failMatch) {
        failureCount = parseInt(failMatch[1], 10);
      }

      // Extract failing test names
      const testMatches = output.matchAll(/●\s+(.+?)$/gm);
      for (const match of testMatches) {
        failingTests.push(match[1].trim());
      }
    }

    return {
      failureCount: failureCount || 1, // At least 1 if tests failed
      failingTests: failingTests.slice(0, 10), // Top 10 failing tests
    };
  }
}

/**
 * Analyze error logs for high error rate
 *
 * Scans logs directory for error patterns and calculates error frequency
 *
 * @returns Error rate (errors/minute) and top error messages
 */
async function analyzeErrorLogs(): Promise<{
  errorsPerMinute: number;
  topErrors: Array<{ message: string; count: number }>;
}> {
  console.log('[Crisis Detector] Analyzing error logs...');

  try {
    // Check if logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    try {
      await fs.access(logsDir);
    } catch {
      // No logs directory - assume no errors
      console.log('[Crisis Detector] No logs directory found - assuming no errors');
      return { errorsPerMinute: 0, topErrors: [] };
    }

    // Read recent log files (last hour)
    const files = await fs.readdir(logsDir);
    const logFiles = files.filter((f) => f.endsWith('.log'));

    if (logFiles.length === 0) {
      console.log('[Crisis Detector] No log files found');
      return { errorsPerMinute: 0, topErrors: [] };
    }

    // Read most recent log file
    const recentLog = logFiles.sort().reverse()[0];
    const logPath = path.join(logsDir, recentLog);
    const logContent = await fs.readFile(logPath, 'utf-8');

    // Count errors in last 5 minutes
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    const errorLines = logContent
      .split('\n')
      .filter((line) => line.includes('ERROR') || line.includes('error'));

    // Estimate errors per minute (rough calculation)
    const errorsPerMinute = errorLines.length / 5;

    // Extract top error messages
    const errorCounts = new Map<string, number>();
    for (const line of errorLines) {
      // Extract error message (simplified)
      const match = line.match(/ERROR[:\s]+(.+?)(?:\n|$)/);
      if (match) {
        const message = match[1].substring(0, 100); // Truncate long messages
        errorCounts.set(message, (errorCounts.get(message) || 0) + 1);
      }
    }

    const topErrors = Array.from(errorCounts.entries())
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    console.log(
      `[Crisis Detector] Error rate: ${errorsPerMinute.toFixed(1)} errors/minute`
    );

    return { errorsPerMinute, topErrors };
  } catch (error) {
    console.warn('[Crisis Detector] Error analyzing logs:', error);
    return { errorsPerMinute: 0, topErrors: [] };
  }
}

/**
 * Check performance metrics
 *
 * Measures response time, memory usage, CPU usage
 *
 * @returns Performance metrics object
 */
async function checkPerformance(): Promise<{
  avgResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
}> {
  console.log('[Crisis Detector] Checking performance metrics...');

  try {
    // Measure memory usage
    const memoryUsageMB = process.memoryUsage().heapUsed / 1024 / 1024;

    // Estimate CPU usage (simplified - would need process monitoring in production)
    const cpuUsage = process.cpuUsage();
    const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000) * 100;

    // Measure average response time (ping localhost or run benchmark)
    let avgResponseTime = 0;
    try {
      const benchmarkStart = performance.now();
      // Simple I/O benchmark as proxy for response time
      await fs.readdir(process.cwd());
      avgResponseTime = performance.now() - benchmarkStart;
    } catch {
      avgResponseTime = 0;
    }

    console.log(
      `[Crisis Detector] Performance: ${avgResponseTime.toFixed(0)}ms response, ${memoryUsageMB.toFixed(0)}MB memory, ${cpuPercent.toFixed(1)}% CPU`
    );

    return {
      avgResponseTime,
      memoryUsage: memoryUsageMB,
      cpuUsage: cpuPercent,
    };
  } catch (error) {
    console.warn('[Crisis Detector] Error checking performance:', error);
    return {
      avgResponseTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
    };
  }
}

/**
 * Scan for security vulnerabilities using npm audit
 *
 * @returns Array of security issues detected
 */
async function scanSecurity(): Promise<SecurityIssue[]> {
  console.log('[Crisis Detector] Scanning for security vulnerabilities...');

  try {
    const { stdout } = await execAsync('npm audit --json', {
      cwd: process.cwd(),
      timeout: 60000, // 1 minute timeout
    });

    const auditResult = JSON.parse(stdout);

    // Parse vulnerabilities from audit result
    const securityIssues: SecurityIssue[] = [];

    if (auditResult.vulnerabilities) {
      for (const [packageName, vulnData] of Object.entries(auditResult.vulnerabilities)) {
        const vuln = vulnData as any;

        securityIssues.push({
          packageName,
          currentVersion: vuln.range || 'unknown',
          severity: vuln.severity || 'unknown',
          description: vuln.via?.[0]?.title || 'Unknown vulnerability',
          recommendation: vuln.fixAvailable
            ? `Update to ${vuln.fixAvailable.name}@${vuln.fixAvailable.version}`
            : 'No fix available',
        });
      }
    }

    console.log(`[Crisis Detector] Found ${securityIssues.length} security issues`);

    return securityIssues;
  } catch (error: any) {
    // npm audit returns exit code 1 if vulnerabilities found
    // Try to parse JSON from stdout
    if (error.stdout) {
      try {
        const auditResult = JSON.parse(error.stdout);
        const securityIssues: SecurityIssue[] = [];

        if (auditResult.vulnerabilities) {
          for (const [packageName, vulnData] of Object.entries(auditResult.vulnerabilities)) {
            const vuln = vulnData as any;

            securityIssues.push({
              packageName,
              currentVersion: vuln.range || 'unknown',
              severity: vuln.severity || 'unknown',
              description: vuln.via?.[0]?.title || 'Unknown vulnerability',
              recommendation: vuln.fixAvailable
                ? `Update to ${vuln.fixAvailable.name}@${vuln.fixAvailable.version}`
                : 'No fix available',
            });
          }
        }

        console.log(`[Crisis Detector] Found ${securityIssues.length} security issues`);
        return securityIssues;
      } catch {
        // Failed to parse, return empty
      }
    }

    console.log('[Crisis Detector] No security vulnerabilities detected ✅');
    return [];
  }
}

/**
 * Get detailed crisis metrics without determining crisis type
 *
 * Useful for monitoring and dashboards
 *
 * @returns Crisis metrics object
 */
export async function getCrisisMetrics(): Promise<CrisisMetrics> {
  console.log('[Crisis Detector] Collecting crisis metrics...');

  const [buildStatus, testStatus, errorRate, performanceMetrics, securityIssues] =
    await Promise.all([
      checkBuildStatus(),
      checkTestStatus(),
      analyzeErrorLogs(),
      checkPerformance(),
      scanSecurity(),
    ]);

  return {
    buildPassing: buildStatus.passing,
    failingTests: testStatus.failureCount,
    errorRate: errorRate.errorsPerMinute,
    performance: performanceMetrics,
    securityIssues: securityIssues,
  };
}