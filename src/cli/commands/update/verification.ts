/**
 * Update Verification Module
 * Verifies update deployment is successful
 * @module cli/commands/update/verification
 */

import fs from 'fs-extra';
import { Ora } from 'ora';

/** Verification checks to run after update */
const VERIFICATION_CHECKS = [
  { path: 'trinity/VERSION', desc: 'Version file' },
  { path: '.claude/agents/leadership', desc: 'Leadership agents' },
  { path: '.claude/agents/planning', desc: 'Planning agents' },
  { path: '.claude/agents/aj-team', desc: 'AJ team agents' },
  { path: '.claude/commands', desc: 'Slash commands' },
  { path: 'trinity/templates', desc: 'Work order templates' },
  { path: 'trinity/knowledge-base/Trinity.md', desc: 'Trinity knowledge base' },
];

/**
 * Verify update deployment is successful
 * @param spinner - ora spinner instance for status display
 * @param expectedVersion - Expected version after update
 * @throws {Error} If verification fails
 */
export async function verifyUpdateDeployment(spinner: Ora, expectedVersion: string): Promise<void> {
  spinner.start('Verifying update...');

  // Check all required paths exist
  for (const check of VERIFICATION_CHECKS) {
    if (!(await fs.pathExists(check.path))) {
      spinner.fail(`Verification failed: ${check.desc} missing`);
      throw new Error(`Update verification failed: ${check.path} not found`);
    }
  }

  // Verify version was actually updated
  const versionPath = 'trinity/VERSION';
  const updatedVersion = (await fs.readFile(versionPath, 'utf8')).trim();
  if (updatedVersion !== expectedVersion) {
    spinner.fail('Version file not updated correctly');
    throw new Error(
      `Version verification failed: expected ${expectedVersion}, got ${updatedVersion}`
    );
  }

  spinner.succeed('Verification passed');
}

/**
 * Update VERSION file with latest version
 * @param spinner - ora spinner instance for status display
 * @param version - Version string to write
 */
export async function updateVersionFile(spinner: Ora, version: string): Promise<void> {
  spinner.start('Updating version file...');
  await fs.writeFile('trinity/VERSION', version);
  spinner.succeed('Version file updated');
}
