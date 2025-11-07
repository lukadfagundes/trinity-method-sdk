/**
 * Crisis Recovery - Interactive guided recovery system
 *
 * @see docs/crisis-management.md - Crisis management methodology
 * @see types.ts - Crisis types and session tracking
 * @see protocols.ts - Crisis protocols
 * @see detector.ts - Crisis detection
 * @see documenter.ts - Crisis documentation
 *
 * **Trinity Principle:** "Investigation-First Development"
 * Guided recovery transforms crisis management from panic to systematic investigation.
 * Rather than rushing to fix, the recovery system walks developers through structured
 * protocols: investigation → diagnostics → recovery → validation. Each step is tracked,
 * building evidence for root cause analysis and future prevention.
 *
 * **Why This Exists:**
 * Traditional crisis response is chaotic: developers rush to fix without understanding
 * root cause, creating more problems. Trinity Method recovery provides interactive
 * guidance through proven protocols, ensuring methodical resolution while capturing
 * lessons learned. Crises become structured investigations instead of emergencies.
 *
 * @example
 * ```typescript
 * // Start interactive recovery for detected crisis
 * const detection = await detectCrisis();
 * if (detection.type) {
 *   const protocol = getCrisisProtocol(detection.type);
 *   await executeProtocol(protocol);
 * }
 * ```
 *
 * @module cli/commands/crisis/recovery
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as readline from 'readline';
import {
  CrisisProtocol,
  CrisisRecoverySession,
  DiagnosticResult,
  ValidationResult,
  CrisisType,
} from './types.js';
import { generateCrisisReport, archiveCrisisReport } from './documenter.js';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

/**
 * Execute crisis recovery protocol interactively
 *
 * Guides user through:
 * 1. Investigation phase (gather evidence)
 * 2. Diagnostic phase (run commands, analyze output)
 * 3. Recovery phase (execute recovery steps)
 * 4. Validation phase (verify crisis resolved)
 * 5. Documentation phase (generate and archive report)
 *
 * @param protocol - Crisis protocol to execute
 * @returns Promise resolving to completed recovery session
 */
export async function executeProtocol(protocol: CrisisProtocol): Promise<CrisisRecoverySession> {
  console.log('\n' + '='.repeat(70));
  console.log(`🚨 CRISIS RECOVERY: ${protocol.type.toUpperCase()}`);
  console.log('='.repeat(70));
  console.log(`\nSeverity: ${protocol.severity}`);
  console.log(`Estimated Recovery Time: ${protocol.estimatedRecoveryTime} minutes`);
  console.log(`\n${protocol.description}\n`);

  // Initialize recovery session
  const session: CrisisRecoverySession = {
    sessionId: uuidv4(),
    crisisType: protocol.type,
    protocol,
    startTime: new Date(),
    endTime: null,
    currentStep: 0,
    completedSteps: [],
    findings: [],
    diagnosticResults: [],
    actionsTaken: [],
    validationResults: [],
    status: 'in_progress',
  };

  console.log(`Session ID: ${session.sessionId}`);
  console.log(`Started: ${session.startTime.toISOString()}\n`);

  try {
    // Phase 1: Investigation
    console.log('━'.repeat(70));
    console.log('📋 PHASE 1: INVESTIGATION');
    console.log('━'.repeat(70));
    console.log('\nGather evidence to understand the crisis...\n');

    await investigationPhase(session);

    // Phase 2: Diagnostics
    console.log('\n' + '━'.repeat(70));
    console.log('🔍 PHASE 2: DIAGNOSTICS');
    console.log('━'.repeat(70));
    console.log('\nRun diagnostic commands to identify root cause...\n');

    await diagnosticPhase(session);

    // Phase 3: Recovery
    console.log('\n' + '━'.repeat(70));
    console.log('🔧 PHASE 3: RECOVERY');
    console.log('━'.repeat(70));
    console.log('\nExecute recovery steps to resolve the crisis...\n');

    await recoveryPhase(session);

    // Phase 4: Validation
    console.log('\n' + '━'.repeat(70));
    console.log('✅ PHASE 4: VALIDATION');
    console.log('━'.repeat(70));
    console.log('\nValidate that the crisis is resolved...\n');

    await validationPhase(session);

    // Mark session as resolved
    session.endTime = new Date();
    session.status = 'resolved';

    const duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60;

    console.log('\n' + '━'.repeat(70));
    console.log('🎉 CRISIS RESOLVED');
    console.log('━'.repeat(70));
    console.log(`\nResolution Time: ${duration.toFixed(1)} minutes`);
    console.log(`Actions Taken: ${session.actionsTaken.length}`);
    console.log(`Validations Passed: ${session.validationResults.filter((v) => v.passed).length}/${session.validationResults.length}\n`);

    // Phase 5: Documentation
    console.log('📝 Generating crisis report...\n');

    const rootCause = await promptInput('Enter root cause analysis: ');
    const report = await generateCrisisReport(session, rootCause);
    const archivePath = await archiveCrisisReport(report);

    console.log(`\n✅ Crisis report archived: ${archivePath}\n`);

    // Display lessons learned
    if (session.lessonsLearned && session.lessonsLearned.length > 0) {
      console.log('💡 Lessons Learned:');
      session.lessonsLearned.forEach((lesson, i) => {
        console.log(`   ${i + 1}. ${lesson}`);
      });
      console.log();
    }

    // Display prevention strategies
    console.log('🛡️  Prevention Strategies:');
    protocol.preventionStrategies.forEach((strategy, i) => {
      console.log(`   ${i + 1}. ${strategy}`);
    });
    console.log();

    console.log('Crisis recovery complete! 🎊\n');

    return session;
  } catch (error) {
    console.error('\n❌ Crisis recovery failed:', error);

    session.endTime = new Date();
    session.status = 'failed';

    // Ask if user wants to rollback
    if (protocol.rollbackPlan && protocol.rollbackPlan.length > 0) {
      console.log('\n⚠️  Rollback plan available.');
      const shouldRollback = await promptConfirm('Execute rollback plan?');

      if (shouldRollback) {
        await rollbackPhase(session);
        session.status = 'rolled_back';
      }
    }

    throw error;
  }
}

/**
 * Investigation phase - Gather evidence
 *
 * Prompts user with investigation questions from protocol
 * Records findings in session
 *
 * @param session - Recovery session to update
 */
async function investigationPhase(session: CrisisRecoverySession): Promise<void> {
  console.log('Answer these questions to understand the crisis:\n');

  for (let i = 0; i < session.protocol.investigationPrompts.length; i++) {
    const prompt = session.protocol.investigationPrompts[i];
    console.log(`${i + 1}. ${prompt}`);

    const finding = await promptInput('   Your answer: ');
    session.findings.push(`${prompt}\n   → ${finding}`);
    session.completedSteps.push(`Investigation: ${prompt}`);
  }

  console.log(`\n✅ Investigation complete: ${session.findings.length} findings recorded`);
}

/**
 * Diagnostic phase - Run diagnostic commands
 *
 * Executes diagnostic commands from protocol with user approval
 * Records results in session
 *
 * @param session - Recovery session to update
 */
async function diagnosticPhase(session: CrisisRecoverySession): Promise<void> {
  console.log('The following diagnostic commands are recommended:\n');

  for (let i = 0; i < session.protocol.diagnosticCommands.length; i++) {
    const command = session.protocol.diagnosticCommands[i];
    console.log(`\n${i + 1}. ${command}`);

    const shouldRun = await promptConfirm('   Run this command?');

    if (shouldRun) {
      console.log(`   Executing: ${command}`);
      const startTime = performance.now();

      try {
        const { stdout, stderr } = await execAsync(command, {
          cwd: process.cwd(),
          timeout: 120000, // 2 minute timeout
        });

        const duration = performance.now() - startTime;

        const result: DiagnosticResult = {
          command,
          exitCode: 0,
          stdout,
          stderr,
          duration,
          executedAt: new Date(),
        };

        session.diagnosticResults.push(result);
        session.completedSteps.push(`Diagnostic: ${command}`);

        console.log(`   ✅ Command completed (${duration.toFixed(0)}ms)`);

        // Show output summary
        if (stdout) {
          const lines = stdout.split('\n').slice(0, 10); // First 10 lines
          console.log('   Output:');
          lines.forEach((line) => console.log(`     ${line}`));
          if (stdout.split('\n').length > 10) {
            console.log('     ... (truncated)');
          }
        }
      } catch (error: any) {
        const duration = performance.now() - startTime;

        const result: DiagnosticResult = {
          command,
          exitCode: error.code || 1,
          stdout: error.stdout || '',
          stderr: error.stderr || '',
          duration,
          executedAt: new Date(),
        };

        session.diagnosticResults.push(result);

        console.log(`   ❌ Command failed (exit code: ${result.exitCode})`);

        if (error.stderr) {
          const lines = error.stderr.split('\n').slice(0, 5);
          console.log('   Error:');
          lines.forEach((line: string) => console.log(`     ${line}`));
        }
      }
    } else {
      console.log('   ⏭️  Skipped');
    }
  }

  console.log(`\n✅ Diagnostics complete: ${session.diagnosticResults.length} commands executed`);
}

/**
 * Recovery phase - Execute recovery steps
 *
 * Guides user through recovery steps from protocol
 * Records actions in session
 *
 * @param session - Recovery session to update
 */
async function recoveryPhase(session: CrisisRecoverySession): Promise<void> {
  console.log('Follow these recovery steps:\n');

  for (let i = 0; i < session.protocol.recoverySteps.length; i++) {
    const step = session.protocol.recoverySteps[i];
    console.log(`\n${i + 1}. ${step}`);

    // Check if step is a command (starts with common command prefixes)
    const isCommand = /^(npm|npx|git|rm|mkdir|cp|mv|node|tsc)/.test(step);

    if (isCommand) {
      const shouldExecute = await promptConfirm('   Execute this command automatically?');

      if (shouldExecute) {
        console.log(`   Executing: ${step}`);
        try {
          const { stdout, stderr } = await execAsync(step, {
            cwd: process.cwd(),
            timeout: 300000, // 5 minute timeout
          });

          console.log('   ✅ Command completed');
          session.actionsTaken.push(`Executed: ${step}`);
          session.completedSteps.push(`Recovery: ${step}`);
        } catch (error: any) {
          console.log(`   ❌ Command failed: ${error.message}`);

          const shouldContinue = await promptConfirm('   Continue with manual execution?');
          if (!shouldContinue) {
            throw new Error(`Recovery step failed: ${step}`);
          }

          const completed = await promptConfirm('   Did you complete this step manually?');
          if (completed) {
            session.actionsTaken.push(`Manual: ${step}`);
            session.completedSteps.push(`Recovery (manual): ${step}`);
          }
        }
      } else {
        const completed = await promptConfirm('   Did you complete this step?');
        if (completed) {
          session.actionsTaken.push(`Manual: ${step}`);
          session.completedSteps.push(`Recovery (manual): ${step}`);
        } else {
          console.log('   ⏭️  Skipped');
        }
      }
    } else {
      // Manual step
      console.log('   (Manual action required)');
      const completed = await promptConfirm('   Step completed?');

      if (completed) {
        const details = await promptInput('   Describe what you did (optional): ');
        session.actionsTaken.push(details || step);
        session.completedSteps.push(`Recovery: ${step}`);
        console.log('   ✅ Step marked as complete');
      } else {
        console.log('   ⚠️  Step not completed');
        const shouldContinue = await promptConfirm('   Continue anyway?');
        if (!shouldContinue) {
          throw new Error('Recovery interrupted by user');
        }
      }
    }
  }

  console.log(`\n✅ Recovery complete: ${session.actionsTaken.length} actions taken`);
}

/**
 * Validation phase - Verify crisis resolved
 *
 * Validates resolution against criteria from protocol
 * Records validation results in session
 *
 * @param session - Recovery session to update
 */
async function validationPhase(session: CrisisRecoverySession): Promise<void> {
  console.log('Validate that the crisis is resolved:\n');

  for (let i = 0; i < session.protocol.validationCriteria.length; i++) {
    const criterion = session.protocol.validationCriteria[i];
    console.log(`\n${i + 1}. ${criterion}`);

    const passed = await promptConfirm('   Criterion met?');
    const details = passed ? '' : await promptInput('   Why not? ');

    const result: ValidationResult = {
      criterion,
      passed,
      details: details || (passed ? 'Verified' : 'Not met'),
      validatedAt: new Date(),
    };

    session.validationResults.push(result);
    session.completedSteps.push(`Validation: ${criterion}`);

    console.log(passed ? '   ✅ Passed' : '   ❌ Failed');
  }

  const passedCount = session.validationResults.filter((v) => v.passed).length;
  const totalCount = session.validationResults.length;

  console.log(`\n✅ Validation complete: ${passedCount}/${totalCount} criteria met`);

  if (passedCount < totalCount) {
    console.log('\n⚠️  Warning: Not all validation criteria passed');
    const shouldContinue = await promptConfirm('Mark crisis as resolved anyway?');
    if (!shouldContinue) {
      throw new Error('Validation failed - crisis not resolved');
    }
  }

  // Prompt for lessons learned
  console.log('\n💡 Capture lessons learned:');
  const lessons: string[] = [];

  while (true) {
    const lesson = await promptInput('Enter a lesson learned (or press Enter to finish): ');
    if (!lesson.trim()) break;
    lessons.push(lesson);
  }

  if (lessons.length > 0) {
    session.lessonsLearned = lessons;
    console.log(`✅ ${lessons.length} lesson(s) captured`);
  }
}

/**
 * Rollback phase - Execute rollback plan
 *
 * Executes rollback steps from protocol
 * Used when recovery fails
 *
 * @param session - Recovery session to update
 */
async function rollbackPhase(session: CrisisRecoverySession): Promise<void> {
  console.log('\n' + '━'.repeat(70));
  console.log('⏮️  ROLLBACK');
  console.log('━'.repeat(70));
  console.log('\nExecuting rollback plan...\n');

  if (!session.protocol.rollbackPlan) {
    console.log('No rollback plan available');
    return;
  }

  for (let i = 0; i < session.protocol.rollbackPlan.length; i++) {
    const step = session.protocol.rollbackPlan[i];
    console.log(`\n${i + 1}. ${step}`);

    const shouldExecute = await promptConfirm('   Execute this step?');

    if (shouldExecute) {
      // Check if step is a command
      const isCommand = /^(npm|npx|git|rm|mkdir|cp|mv|node|tsc)/.test(step);

      if (isCommand) {
        console.log(`   Executing: ${step}`);
        try {
          const { stdout, stderr } = await execAsync(step, {
            cwd: process.cwd(),
            timeout: 300000,
          });
          console.log('   ✅ Rollback step completed');
        } catch (error: any) {
          console.log(`   ❌ Rollback step failed: ${error.message}`);
        }
      } else {
        const completed = await promptConfirm('   Step completed?');
        console.log(completed ? '   ✅ Complete' : '   ⏭️  Skipped');
      }
    }
  }

  console.log('\n✅ Rollback complete');
}

/**
 * Prompt user for text input
 *
 * @param question - Question to ask user
 * @returns Promise resolving to user input
 */
function promptInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/**
 * Prompt user for yes/no confirmation
 *
 * @param question - Question to ask user
 * @returns Promise resolving to true (yes) or false (no)
 */
function promptConfirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().startsWith('y'));
    });
  });
}

/**
 * Display crisis recovery help
 *
 * Shows available crisis types and general guidance
 */
export function displayCrisisHelp(): void {
  console.log('\n' + '='.repeat(70));
  console.log('TRINITY METHOD CRISIS RECOVERY');
  console.log('='.repeat(70));
  console.log('\nSystematic recovery protocols for production crises\n');

  console.log('Available Crisis Types:');
  console.log('  1. BUILD_FAILURE           - Compilation errors, dependency issues');
  console.log('  2. TEST_FAILURE            - Test suite failures, regressions');
  console.log('  3. ERROR_PATTERN           - High error rate, repeated exceptions');
  console.log('  4. PERFORMANCE_DEGRADATION - Slow responses, resource issues');
  console.log('  5. SECURITY_VULNERABILITY  - CVEs, exposed secrets');
  console.log();

  console.log('Recovery Phases:');
  console.log('  1. Investigation - Gather evidence');
  console.log('  2. Diagnostics   - Run diagnostic commands');
  console.log('  3. Recovery      - Execute recovery steps');
  console.log('  4. Validation    - Verify crisis resolved');
  console.log('  5. Documentation - Generate crisis report');
  console.log();

  console.log('Usage:');
  console.log('  npx trinity crisis              # Detect and recover from crisis');
  console.log('  npx trinity crisis --type=build # Recover from specific crisis type');
  console.log('  npx trinity crisis --help       # Show this help');
  console.log();
}