/**
 * Update Migration Module
 * Handles legacy deployment detection and migration from pre-2.2.0 structure
 * @module cli/commands/update/migration
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import { validatePath } from '../../utils/validate-path.js';

export interface LegacyInfo {
  isLegacy: boolean;
  legacyVersion: string | null;
}

/** Old gitignore patterns from previous deployments */
const OLD_GITIGNORE_PATTERNS = [
  'trinity/',
  'TRINITY.md',
  '.claude/trinity/archive/',
  '.claude/trinity/templates/',
];

/** Current gitignore patterns */
const CURRENT_GITIGNORE_PATTERNS = ['.claude/', '*CLAUDE.md'];

/**
 * Detect if the project has a legacy (pre-2.2.0) Trinity deployment
 * Legacy deployments use `trinity/` at root instead of `.claude/trinity/`
 * @param spinner - ora spinner instance for status display
 * @returns Legacy deployment info
 */
export async function detectLegacyDeployment(spinner: Ora): Promise<LegacyInfo> {
  spinner.start('Checking for legacy deployment...');

  const hasLegacyDir = await fs.pathExists('trinity');
  const hasLegacyVersion = await fs.pathExists('trinity/VERSION');

  if (!hasLegacyDir) {
    spinner.info('No legacy deployment detected');
    return { isLegacy: false, legacyVersion: null };
  }

  let legacyVersion: string | null = null;
  if (hasLegacyVersion) {
    legacyVersion = (await fs.readFile('trinity/VERSION', 'utf8')).trim();
  }

  spinner.warn(`Legacy deployment detected (v${legacyVersion || 'unknown'})`);
  return { isLegacy: true, legacyVersion };
}

/**
 * Migrate legacy Trinity deployment from `trinity/` to `.claude/trinity/`
 * Preserves user-managed knowledge base files during migration
 * @param spinner - ora spinner instance for status display
 */
export async function migrateLegacyDeployment(spinner: Ora): Promise<void> {
  spinner.start('Migrating legacy deployment to .claude/trinity/...');

  // Create new directory structure
  await fs.ensureDir('.claude/trinity');
  await fs.ensureDir('.claude/agents/leadership');
  await fs.ensureDir('.claude/agents/deployment');
  await fs.ensureDir('.claude/agents/audit');
  await fs.ensureDir('.claude/agents/planning');
  await fs.ensureDir('.claude/agents/aj-team');
  await fs.ensureDir('.claude/commands');

  // Move trinity/ contents to .claude/trinity/
  const trinityContents = await fs.readdir('trinity');
  for (const item of trinityContents) {
    const srcPath = path.join('trinity', item);
    const destPath = path.join('.claude/trinity', item);

    // Don't overwrite if destination already exists (prefer new structure)
    if (!(await fs.pathExists(destPath))) {
      await fs.copy(srcPath, destPath);
    }
  }

  // Remove old trinity/ directory
  await fs.remove('trinity');

  spinner.succeed('Legacy deployment migrated to .claude/trinity/');
}

/**
 * Update .gitignore to replace old Trinity patterns with current ones
 * Safe to run on any deployment — idempotent
 * @param spinner - ora spinner instance for status display
 * @returns True if gitignore was updated
 */
export async function updateGitignoreForMigration(spinner: Ora): Promise<boolean> {
  spinner.start('Updating .gitignore patterns...');

  const gitignorePath = '.gitignore';

  if (!(await fs.pathExists(gitignorePath))) {
    spinner.info('No .gitignore found, skipping');
    return false;
  }

  let content = await fs.readFile(gitignorePath, 'utf8');
  const originalContent = content;

  if (content.includes('# Trinity Method SDK')) {
    // Remove the existing Trinity section entirely
    const lines = content.split('\n');
    const filteredLines: string[] = [];
    let inTrinitySection = false;

    for (const line of lines) {
      if (line.trim() === '# Trinity Method SDK') {
        inTrinitySection = true;
        continue;
      }

      // End of Trinity section: next comment or blank line after non-Trinity content
      if (inTrinitySection) {
        const trimmed = line.trim();
        // Still in Trinity section if line is empty, or matches known patterns
        if (
          trimmed === '' ||
          trimmed === 'trinity/' ||
          trimmed === '*CLAUDE.md' ||
          trimmed === 'TRINITY.md' ||
          trimmed === '.claude/' ||
          trimmed === '.claude/trinity/archive/' ||
          trimmed === '.claude/trinity/templates/'
        ) {
          continue;
        }
        // Non-Trinity line — we've left the section
        inTrinitySection = false;
      }

      filteredLines.push(line);
    }

    content = filteredLines.join('\n');
  }

  // Remove any standalone old patterns that might exist outside the section
  for (const pattern of OLD_GITIGNORE_PATTERNS) {
    const regex = new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'gm');
    content = content.replace(regex, '');
  }

  // Clean up multiple blank lines
  content = content.replace(/\n{3,}/g, '\n\n').trim();

  // Append current Trinity section
  const trinitySection = ['', '# Trinity Method SDK', ...CURRENT_GITIGNORE_PATTERNS].join('\n');

  content = `${content}\n${trinitySection}\n`;

  if (content === originalContent) {
    spinner.info('.gitignore already up to date');
    return false;
  }

  const validatedPath = validatePath(gitignorePath);
  await fs.writeFile(validatedPath, content);
  spinner.succeed('.gitignore patterns updated');
  return true;
}
