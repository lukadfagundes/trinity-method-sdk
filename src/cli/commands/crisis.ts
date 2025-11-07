/**
 * Crisis Command - Main CLI command for Trinity Method crisis management
 *
 * @see docs/crisis-management.md - Complete crisis management methodology
 * @see crisis/types.ts - Crisis type definitions
 * @see crisis/detector.ts - Crisis detection
 * @see crisis/protocols.ts - Crisis protocols
 * @see crisis/recovery.ts - Guided recovery
 * @see crisis/validator.ts - Recovery validation
 * @see crisis/documenter.ts - Crisis documentation
 *
 * **Trinity Principle:** "Systematic Quality Assurance"
 * The crisis command operationalizes Trinity Method's crisis management philosophy: detect
 * crises automatically, guide systematic recovery through proven protocols, validate resolution
 * with objective metrics, and preserve knowledge through comprehensive documentation. Transforms
 * chaos into structured investigation.
 *
 * **Why This Exists:**
 * Production crises cause panic and rushed fixes that create more problems. Trinity Method
 * crisis command provides calm, systematic guidance through five crisis types using battle-tested
 * protocols. Developers follow structured recovery instead of guessing, learn from past crises
 * through searchable archives, and prevent future occurrences through documented patterns.
 *
 * @example
 * ```bash
 * # Auto-detect and recover from current crisis
 * npx trinity crisis
 *
 * # Recover from specific crisis type
 * npx trinity crisis --type=build
 *
 * # Quick health check
 * npx trinity crisis --health
 *
 * # Search past crises
 * npx trinity crisis --search="build failure"
 *
 * # View crisis statistics
 * npx trinity crisis --stats
 * ```
 *
 * @module cli/commands/crisis
 */

import { Command } from 'commander';
import { detectCrisis } from './crisis/detector.js';
import { getCrisisProtocol, getAllCrisisProtocols } from './crisis/protocols.js';
import { executeProtocol, displayCrisisHelp } from './crisis/recovery.js';
import { validateRecovery, quickHealthCheck } from './crisis/validator.js';
import { searchCrisisArchive, getCrisisStatistics } from './crisis/documenter.js';
import { CrisisType } from './crisis/types.js';

/**
 * Register crisis command with CLI
 *
 * @param program - Commander program instance
 * @returns Crisis command instance
 */
export function registerCrisisCommand(program: Command): Command {
  const crisis = program
    .command('crisis')
    .description('Detect and recover from system crises using Trinity Method protocols')
    .option('--type <type>', 'Specify crisis type (skip auto-detection)')
    .option('--health', 'Run quick health check')
    .option('--search <query>', 'Search crisis archive')
    .option('--stats', 'View crisis statistics')
    .option('--list', 'List available crisis types')
    .option('--help-crisis', 'Show detailed crisis management help')
    .action(async (options) => {
      try {
        // Show help
        if (options.helpCrisis) {
          displayCrisisHelp();
          return;
        }

        // List crisis types
        if (options.list) {
          listCrisisTypes();
          return;
        }

        // Quick health check
        if (options.health) {
          const { healthy, issues } = await quickHealthCheck();
          process.exit(healthy ? 0 : 1);
          return;
        }

        // Search archive
        if (options.search) {
          await searchArchive(options.search);
          return;
        }

        // View statistics
        if (options.stats) {
          await viewStatistics();
          return;
        }

        // Crisis recovery flow
        await executeCrisisRecovery(options.type);
      } catch (error) {
        console.error('\n❌ Crisis command failed:', error);
        process.exit(1);
      }
    });

  return crisis;
}

/**
 * Execute crisis recovery workflow
 *
 * Main workflow:
 * 1. Detect crisis (or use specified type)
 * 2. Load protocol
 * 3. Execute guided recovery
 * 4. Validate resolution
 * 5. Document crisis
 *
 * @param specifiedType - Optional crisis type (skips detection)
 */
async function executeCrisisRecovery(specifiedType?: string): Promise<void> {
  console.log('\n' + '═'.repeat(70));
  console.log('       TRINITY METHOD CRISIS MANAGEMENT SYSTEM');
  console.log('═'.repeat(70));
  console.log();

  let crisisType: CrisisType;

  // Step 1: Detect or use specified type
  if (specifiedType) {
    console.log(`🔍 Using specified crisis type: ${specifiedType}\n`);

    // Validate crisis type
    if (!isValidCrisisType(specifiedType)) {
      console.error(`❌ Invalid crisis type: ${specifiedType}`);
      console.log('\nValid types: build, test, error, performance, security');
      console.log('Or run: npx trinity crisis --list\n');
      process.exit(1);
    }

    crisisType = parseCrisisType(specifiedType);
  } else {
    console.log('🔍 Detecting current crisis state...\n');

    const detection = await detectCrisis();

    if (detection.type === null) {
      console.log('✅ No crisis detected - system healthy!\n');
      console.log('All checks passed:');
      console.log('  ✅ Build passing');
      console.log('  ✅ Tests passing');
      console.log('  ✅ Error rate normal');
      console.log('  ✅ Performance healthy');
      console.log('  ✅ No security vulnerabilities');
      console.log();
      return;
    }

    console.log(`🚨 Crisis detected: ${detection.type}`);
    console.log(`📊 Confidence: ${(detection.confidence * 100).toFixed(0)}%`);
    console.log('\n📋 Evidence:');
    detection.evidence.forEach((evidence) => {
      console.log(`   • ${evidence}`);
    });
    console.log();

    crisisType = detection.type;
  }

  // Step 2: Load protocol
  console.log(`📖 Loading ${crisisType} protocol...\n`);
  const protocol = getCrisisProtocol(crisisType);

  // Step 3: Execute guided recovery
  const session = await executeProtocol(protocol);

  // Step 4: Validate resolution
  console.log('\n🔍 Validating crisis resolution...\n');

  const validation = await validateRecovery(crisisType, protocol);

  if (!validation.isResolved) {
    console.error('\n❌ Validation failed - crisis may not be fully resolved');
    console.log('\nRecommendations:');
    console.log('  1. Review validation evidence above');
    console.log('  2. Re-run failed recovery steps');
    console.log('  3. Consult crisis archive for similar past crises');
    console.log('  4. Consider escalating to team lead\n');
    process.exit(1);
  }

  // Step 5: Success summary
  console.log('\n' + '═'.repeat(70));
  console.log('                    🎉 CRISIS RESOLVED 🎉');
  console.log('═'.repeat(70));
  console.log();

  const duration =
    (session.endTime!.getTime() - session.startTime.getTime()) / 1000 / 60;

  console.log(`📊 Recovery Summary:`);
  console.log(`   • Session ID: ${session.sessionId}`);
  console.log(`   • Crisis Type: ${crisisType}`);
  console.log(`   • Resolution Time: ${duration.toFixed(1)} minutes`);
  console.log(`   • Actions Taken: ${session.actionsTaken.length}`);
  console.log(
    `   • Validations Passed: ${validation.evidence.filter((e) => e.includes('passed')).length}`
  );
  console.log();

  console.log('📚 Next Steps:');
  console.log('   1. Review crisis report in trinity/archive/crisis/');
  console.log('   2. Implement prevention strategies from protocol');
  console.log('   3. Share lessons learned with team');
  console.log('   4. Update documentation if needed');
  console.log();
}

/**
 * List available crisis types with descriptions
 */
function listCrisisTypes(): void {
  console.log('\n' + '═'.repeat(70));
  console.log('              AVAILABLE CRISIS TYPES');
  console.log('═'.repeat(70));
  console.log();

  const protocols = getAllCrisisProtocols();

  protocols.forEach((protocol, index) => {
    console.log(`${index + 1}. ${protocol.type.toUpperCase()}`);
    console.log(`   ${protocol.description}`);
    console.log(`   Severity: ${protocol.severity}`);
    console.log(`   Est. Recovery Time: ${protocol.estimatedRecoveryTime} minutes`);
    console.log();
  });

  console.log('Usage:');
  console.log('  npx trinity crisis --type=build');
  console.log('  npx trinity crisis --type=test');
  console.log('  npx trinity crisis --type=error');
  console.log('  npx trinity crisis --type=performance');
  console.log('  npx trinity crisis --type=security');
  console.log();
}

/**
 * Search crisis archive
 *
 * @param query - Search query
 */
async function searchArchive(query: string): Promise<void> {
  console.log(`\n🔍 Searching crisis archive for: "${query}"\n`);

  const results = await searchCrisisArchive(query);

  if (results.length === 0) {
    console.log('No matching crises found in archive.\n');
    return;
  }

  console.log(`Found ${results.length} matching crisis report(s):\n`);

  results.forEach((report, index) => {
    console.log(`${index + 1}. ${report.session.crisisType} - ${report.session.sessionId}`);
    console.log(`   Date: ${report.generatedAt.toISOString().split('T')[0]}`);
    console.log(`   Root Cause: ${report.rootCause.substring(0, 80)}...`);
    console.log(
      `   Resolution Time: ${report.timeToResolution.toFixed(1)} minutes`
    );
    console.log(`   Status: ${report.session.status}`);
    console.log();
  });

  console.log('💡 Tip: Review reports in trinity/archive/crisis/\n');
}

/**
 * View crisis statistics
 */
async function viewStatistics(): Promise<void> {
  console.log('\n' + '═'.repeat(70));
  console.log('              CRISIS STATISTICS');
  console.log('═'.repeat(70));
  console.log();

  const stats = await getCrisisStatistics();

  if (stats.totalCrises === 0) {
    console.log('No crises recorded yet.\n');
    return;
  }

  console.log(`📊 Overall Statistics:`);
  console.log(`   • Total Crises: ${stats.totalCrises}`);
  console.log(`   • Average Resolution Time: ${stats.avgResolutionTime.toFixed(1)} minutes`);
  if (stats.mostCommonType) {
    console.log(`   • Most Common Type: ${stats.mostCommonType}`);
  }
  console.log();

  console.log('📈 Crisis Breakdown:');
  for (const [type, count] of Object.entries(stats.byType)) {
    if (count > 0) {
      const percentage = ((count / stats.totalCrises) * 100).toFixed(1);
      console.log(`   • ${type}: ${count} (${percentage}%)`);
    }
  }
  console.log();

  console.log('💡 Use crisis data to:');
  console.log('   1. Identify recurring issues');
  console.log('   2. Prioritize prevention efforts');
  console.log('   3. Track improvement over time');
  console.log('   4. Share patterns with team');
  console.log();
}

/**
 * Check if crisis type string is valid
 *
 * @param type - Crisis type string to validate
 * @returns True if valid crisis type
 */
function isValidCrisisType(type: string): boolean {
  const validTypes = ['build', 'test', 'error', 'performance', 'security'];
  return validTypes.includes(type.toLowerCase());
}

/**
 * Parse crisis type string to CrisisType enum
 *
 * @param type - Crisis type string
 * @returns CrisisType enum value
 */
function parseCrisisType(type: string): CrisisType {
  const typeMap: Record<string, CrisisType> = {
    build: CrisisType.BUILD_FAILURE,
    test: CrisisType.TEST_FAILURE,
    error: CrisisType.ERROR_PATTERN,
    performance: CrisisType.PERFORMANCE_DEGRADATION,
    security: CrisisType.SECURITY_VULNERABILITY,
  };

  return typeMap[type.toLowerCase()];
}