/**
 * Crisis Documenter - Generate and archive crisis reports
 *
 * @see docs/crisis-management.md - Crisis management methodology
 * @see types.ts - Crisis report structures
 *
 * **Trinity Principle:** "Knowledge Preservation"
 * Every crisis is a learning opportunity. The documenter captures complete crisis recovery
 * sessions including root cause analysis, resolution steps, and lessons learned, then archives
 * them to trinity/archive/crisis/ for organizational learning. Future crises benefit from
 * past experiences through searchable, structured crisis reports.
 *
 * **Why This Exists:**
 * Traditional crisis management forgets lessons learned. When the same crisis recurs,
 * teams repeat the same debugging steps. Trinity Method documenter preserves institutional
 * knowledge by archiving detailed crisis reports, enabling pattern recognition and
 * continuous improvement of crisis protocols.
 *
 * @example
 * ```typescript
 * // Generate crisis report
 * const report = await generateCrisisReport(session, 'Database connection pool exhaustion');
 *
 * // Archive report
 * await archiveCrisisReport(report);
 *
 * // Search past crises
 * const pastCrises = await searchCrisisArchive('build failure');
 * console.log(`Found ${pastCrises.length} similar past crises`);
 * ```
 *
 * @module cli/commands/crisis/documenter
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import {
  CrisisRecoverySession,
  CrisisReport,
  LearnedPattern,
  CrisisType,
} from './types.js';

/**
 * Generate comprehensive crisis report from recovery session
 *
 * Creates structured report including:
 * - Session details (crisis type, timeline, steps taken)
 * - Root cause analysis
 * - Resolution summary
 * - Time to resolution
 * - Prevention recommendations
 * - Learned patterns for learning system
 *
 * @param session - Completed crisis recovery session
 * @param rootCause - Root cause analysis summary
 * @returns Crisis report ready for archiving
 */
export async function generateCrisisReport(
  session: CrisisRecoverySession,
  rootCause: string
): Promise<CrisisReport> {
  console.log(`[Crisis Documenter] Generating report for ${session.sessionId}...`);

  // Calculate time to resolution
  const timeToResolution = session.endTime
    ? (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60 // minutes
    : 0;

  // Generate resolution summary from completed steps
  const resolution = generateResolutionSummary(session);

  // Extract prevention recommendations from protocol
  const preventionRecommendations = session.protocol.preventionStrategies;

  // Generate learned patterns from crisis
  const learnedPatterns = extractLearnedPatterns(session, rootCause);

  const report: CrisisReport = {
    session,
    rootCause,
    resolution,
    timeToResolution,
    preventionRecommendations,
    learnedPatterns,
    generatedAt: new Date(),
  };

  console.log(
    `[Crisis Documenter] Report generated: ${timeToResolution.toFixed(1)} min recovery time, ${learnedPatterns.length} patterns learned`
  );

  return report;
}

/**
 * Archive crisis report to filesystem
 *
 * Saves report to: trinity/archive/crisis/{YYYY-MM-DD}/crisis-{sessionId}.md
 * Format: Markdown for human readability + JSON for machine processing
 *
 * @param report - Crisis report to archive
 * @returns Promise resolving to archive file path
 */
export async function archiveCrisisReport(report: CrisisReport): Promise<string> {
  console.log(`[Crisis Documenter] Archiving report ${report.session.sessionId}...`);

  // Create archive directory structure: trinity/archive/crisis/YYYY-MM-DD/
  const date = report.generatedAt.toISOString().split('T')[0]; // YYYY-MM-DD
  const archiveDir = path.join(process.cwd(), 'trinity', 'archive', 'crisis', date);

  try {
    await fs.mkdir(archiveDir, { recursive: true });
  } catch (error) {
    console.error(`[Crisis Documenter] Failed to create archive directory:`, error);
    throw error;
  }

  // Generate report filename
  const filename = `crisis-${report.session.sessionId}.md`;
  const filepath = path.join(archiveDir, filename);

  // Generate markdown report
  const markdown = generateMarkdownReport(report);

  // Write report to file
  try {
    await fs.writeFile(filepath, markdown, 'utf-8');
    console.log(`[Crisis Documenter] Report archived: ${filepath}`);
  } catch (error) {
    console.error(`[Crisis Documenter] Failed to write report:`, error);
    throw error;
  }

  // Also save JSON version for machine processing
  const jsonFilepath = filepath.replace('.md', '.json');
  try {
    await fs.writeFile(jsonFilepath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`[Crisis Documenter] JSON report archived: ${jsonFilepath}`);
  } catch (error) {
    console.warn(`[Crisis Documenter] Failed to write JSON report:`, error);
  }

  return filepath;
}

/**
 * Search crisis archive for similar past crises
 *
 * Searches by:
 * - Crisis type
 * - Keywords in root cause or findings
 * - Error patterns
 *
 * @param query - Search query (crisis type or keywords)
 * @returns Promise resolving to array of matching crisis reports
 */
export async function searchCrisisArchive(query: string): Promise<CrisisReport[]> {
  console.log(`[Crisis Documenter] Searching archive for: "${query}"`);

  const archiveRoot = path.join(process.cwd(), 'trinity', 'archive', 'crisis');

  try {
    await fs.access(archiveRoot);
  } catch {
    console.log('[Crisis Documenter] No crisis archive found');
    return [];
  }

  const matches: CrisisReport[] = [];

  // Recursively search all archived reports
  const dateDirs = await fs.readdir(archiveRoot);

  for (const dateDir of dateDirs) {
    const dateDirPath = path.join(archiveRoot, dateDir);
    const stat = await fs.stat(dateDirPath);

    if (!stat.isDirectory()) continue;

    const files = await fs.readdir(dateDirPath);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    for (const jsonFile of jsonFiles) {
      const jsonPath = path.join(dateDirPath, jsonFile);
      try {
        const content = await fs.readFile(jsonPath, 'utf-8');
        const report: CrisisReport = JSON.parse(content);

        // Check if report matches query
        if (matchesQuery(report, query)) {
          matches.push(report);
        }
      } catch (error) {
        console.warn(`[Crisis Documenter] Failed to parse ${jsonFile}:`, error);
      }
    }
  }

  console.log(`[Crisis Documenter] Found ${matches.length} matching crises`);

  return matches;
}

/**
 * Get crisis statistics from archive
 *
 * @returns Statistics object with counts, avg resolution time, etc.
 */
export async function getCrisisStatistics(): Promise<{
  totalCrises: number;
  byType: Record<CrisisType, number>;
  avgResolutionTime: number;
  mostCommonType: CrisisType | null;
}> {
  console.log('[Crisis Documenter] Calculating crisis statistics...');

  const archiveRoot = path.join(process.cwd(), 'trinity', 'archive', 'crisis');

  try {
    await fs.access(archiveRoot);
  } catch {
    return {
      totalCrises: 0,
      byType: {} as Record<CrisisType, number>,
      avgResolutionTime: 0,
      mostCommonType: null,
    };
  }

  const reports: CrisisReport[] = [];

  // Collect all reports
  const dateDirs = await fs.readdir(archiveRoot);

  for (const dateDir of dateDirs) {
    const dateDirPath = path.join(archiveRoot, dateDir);
    const stat = await fs.stat(dateDirPath);

    if (!stat.isDirectory()) continue;

    const files = await fs.readdir(dateDirPath);
    const jsonFiles = files.filter((f) => f.endsWith('.json'));

    for (const jsonFile of jsonFiles) {
      const jsonPath = path.join(dateDirPath, jsonFile);
      try {
        const content = await fs.readFile(jsonPath, 'utf-8');
        const report: CrisisReport = JSON.parse(content);
        reports.push(report);
      } catch (error) {
        console.warn(`[Crisis Documenter] Failed to parse ${jsonFile}:`, error);
      }
    }
  }

  // Calculate statistics
  const totalCrises = reports.length;

  const byType: Record<CrisisType, number> = {
    [CrisisType.BUILD_FAILURE]: 0,
    [CrisisType.TEST_FAILURE]: 0,
    [CrisisType.ERROR_PATTERN]: 0,
    [CrisisType.PERFORMANCE_DEGRADATION]: 0,
    [CrisisType.SECURITY_VULNERABILITY]: 0,
  };

  let totalResolutionTime = 0;

  for (const report of reports) {
    byType[report.session.crisisType]++;
    totalResolutionTime += report.timeToResolution;
  }

  const avgResolutionTime = totalCrises > 0 ? totalResolutionTime / totalCrises : 0;

  // Find most common crisis type
  let mostCommonType: CrisisType | null = null;
  let maxCount = 0;

  for (const [type, count] of Object.entries(byType)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonType = type as CrisisType;
    }
  }

  console.log(`[Crisis Documenter] Statistics: ${totalCrises} total crises, avg ${avgResolutionTime.toFixed(1)} min resolution`);

  return {
    totalCrises,
    byType,
    avgResolutionTime,
    mostCommonType,
  };
}

/**
 * Generate resolution summary from session
 *
 * @param session - Crisis recovery session
 * @returns Resolution summary text
 */
function generateResolutionSummary(session: CrisisRecoverySession): string {
  const parts: string[] = [];

  parts.push(`Crisis Type: ${session.crisisType}`);
  parts.push(`Status: ${session.status}`);
  parts.push(`Steps Completed: ${session.completedSteps.length}`);

  if (session.actionsTaken.length > 0) {
    parts.push('\nActions Taken:');
    session.actionsTaken.forEach((action, i) => {
      parts.push(`${i + 1}. ${action}`);
    });
  }

  if (session.validationResults.length > 0) {
    const passedValidations = session.validationResults.filter((v) => v.passed).length;
    parts.push(
      `\nValidation: ${passedValidations}/${session.validationResults.length} criteria passed`
    );
  }

  return parts.join('\n');
}

/**
 * Extract learned patterns from crisis session
 *
 * Generates patterns that can be added to learning system
 *
 * @param session - Crisis recovery session
 * @param rootCause - Root cause analysis
 * @returns Array of learned patterns
 */
function extractLearnedPatterns(
  session: CrisisRecoverySession,
  rootCause: string
): LearnedPattern[] {
  const patterns: LearnedPattern[] = [];

  // Pattern 1: Root cause pattern
  patterns.push({
    patternId: `crisis-${session.sessionId}-root-cause`,
    description: `${session.crisisType} root cause: ${rootCause}`,
    context: `Crisis recovery session ${session.sessionId}`,
    tags: [session.crisisType, 'root-cause', 'crisis'],
    confidence: 0.9,
    relatedCrisisType: session.crisisType,
  });

  // Pattern 2: Resolution pattern (if successful)
  if (session.status === 'resolved') {
    patterns.push({
      patternId: `crisis-${session.sessionId}-resolution`,
      description: `Successful resolution for ${session.crisisType}: ${session.actionsTaken.join(', ')}`,
      context: `Resolved in ${((session.endTime!.getTime() - session.startTime.getTime()) / 1000 / 60).toFixed(1)} minutes`,
      tags: [session.crisisType, 'resolution', 'successful', 'crisis'],
      confidence: 0.85,
      relatedCrisisType: session.crisisType,
    });
  }

  // Pattern 3: Diagnostic pattern
  if (session.diagnosticResults.length > 0) {
    const successfulDiagnostics = session.diagnosticResults
      .filter((d) => d.exitCode === 0)
      .map((d) => d.command);

    if (successfulDiagnostics.length > 0) {
      patterns.push({
        patternId: `crisis-${session.sessionId}-diagnostics`,
        description: `Useful diagnostics for ${session.crisisType}: ${successfulDiagnostics.join(', ')}`,
        context: `Crisis diagnosis`,
        tags: [session.crisisType, 'diagnostics', 'crisis'],
        confidence: 0.75,
        relatedCrisisType: session.crisisType,
      });
    }
  }

  return patterns;
}

/**
 * Check if crisis report matches search query
 *
 * @param report - Crisis report to check
 * @param query - Search query
 * @returns True if report matches query
 */
function matchesQuery(report: CrisisReport, query: string): boolean {
  const lowerQuery = query.toLowerCase();

  // Check crisis type
  if (report.session.crisisType.includes(lowerQuery)) return true;

  // Check root cause
  if (report.rootCause.toLowerCase().includes(lowerQuery)) return true;

  // Check findings
  for (const finding of report.session.findings) {
    if (finding.toLowerCase().includes(lowerQuery)) return true;
  }

  // Check completed steps
  for (const step of report.session.completedSteps) {
    if (step.toLowerCase().includes(lowerQuery)) return true;
  }

  return false;
}

/**
 * Generate markdown-formatted crisis report
 *
 * @param report - Crisis report
 * @returns Markdown string
 */
function generateMarkdownReport(report: CrisisReport): string {
  const lines: string[] = [];

  lines.push(`# Crisis Report: ${report.session.sessionId}`);
  lines.push('');
  lines.push(`**Generated:** ${report.generatedAt.toISOString()}`);
  lines.push(`**Crisis Type:** ${report.session.crisisType}`);
  lines.push(`**Severity:** ${report.session.protocol.severity}`);
  lines.push(`**Status:** ${report.session.status}`);
  lines.push(
    `**Time to Resolution:** ${report.timeToResolution.toFixed(1)} minutes`
  );
  lines.push('');

  lines.push('---');
  lines.push('');

  lines.push('## Timeline');
  lines.push('');
  lines.push(`- **Start:** ${report.session.startTime.toISOString()}`);
  if (report.session.endTime) {
    lines.push(`- **End:** ${report.session.endTime.toISOString()}`);
  }
  lines.push('');

  lines.push('## Root Cause');
  lines.push('');
  lines.push(report.rootCause);
  lines.push('');

  lines.push('## Investigation Findings');
  lines.push('');
  if (report.session.findings.length > 0) {
    report.session.findings.forEach((finding, i) => {
      lines.push(`${i + 1}. ${finding}`);
    });
  } else {
    lines.push('*No findings recorded*');
  }
  lines.push('');

  lines.push('## Diagnostic Results');
  lines.push('');
  if (report.session.diagnosticResults.length > 0) {
    report.session.diagnosticResults.forEach((result, i) => {
      lines.push(`### Diagnostic ${i + 1}: \`${result.command}\``);
      lines.push('');
      lines.push(`- **Exit Code:** ${result.exitCode}`);
      lines.push(`- **Duration:** ${result.duration.toFixed(0)}ms`);
      if (result.stdout) {
        lines.push('- **Output:**');
        lines.push('```');
        lines.push(result.stdout.substring(0, 500)); // Truncate long output
        lines.push('```');
      }
      lines.push('');
    });
  } else {
    lines.push('*No diagnostics run*');
    lines.push('');
  }

  lines.push('## Actions Taken');
  lines.push('');
  if (report.session.actionsTaken.length > 0) {
    report.session.actionsTaken.forEach((action, i) => {
      lines.push(`${i + 1}. ${action}`);
    });
  } else {
    lines.push('*No actions recorded*');
  }
  lines.push('');

  lines.push('## Validation Results');
  lines.push('');
  if (report.session.validationResults.length > 0) {
    report.session.validationResults.forEach((result) => {
      const status = result.passed ? '✅' : '❌';
      lines.push(`- ${status} ${result.criterion}`);
      if (result.details) {
        lines.push(`  - ${result.details}`);
      }
    });
  } else {
    lines.push('*No validation performed*');
  }
  lines.push('');

  lines.push('## Resolution');
  lines.push('');
  lines.push(report.resolution);
  lines.push('');

  lines.push('## Prevention Recommendations');
  lines.push('');
  report.preventionRecommendations.forEach((rec, i) => {
    lines.push(`${i + 1}. ${rec}`);
  });
  lines.push('');

  lines.push('## Learned Patterns');
  lines.push('');
  if (report.learnedPatterns.length > 0) {
    report.learnedPatterns.forEach((pattern, i) => {
      lines.push(`### Pattern ${i + 1}: ${pattern.patternId}`);
      lines.push('');
      lines.push(`**Description:** ${pattern.description}`);
      lines.push(`**Context:** ${pattern.context}`);
      lines.push(`**Confidence:** ${(pattern.confidence * 100).toFixed(0)}%`);
      lines.push(`**Tags:** ${pattern.tags.join(', ')}`);
      lines.push('');
    });
  } else {
    lines.push('*No patterns learned*');
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('**Report generated by Trinity Method Crisis Management System**');
  lines.push('');

  return lines.join('\n');
}