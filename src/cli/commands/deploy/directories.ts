/**
 * Trinity directory structure creation
 */

import fs from 'fs-extra';
import type { Spinner } from './types.js';

/**
 * Create complete Trinity directory structure
 *
 * @param spinner - Spinner instance for status updates
 * @returns Number of directories created
 */
export async function createDirectories(spinner: Spinner): Promise<number> {
  spinner.start('Creating Trinity Method structure...');

  let directoriesCreated = 0;

  // Trinity core directories (inside .claude/)
  await fs.ensureDir('.claude/trinity/knowledge-base');
  await fs.ensureDir('.claude/trinity/sessions');
  await fs.ensureDir('.claude/trinity/investigations');
  await fs.ensureDir('.claude/trinity/patterns');
  await fs.ensureDir('.claude/trinity/work-orders');
  await fs.ensureDir('.claude/trinity/templates');
  await fs.ensureDir('.claude/trinity/reports');
  await fs.ensureDir('.claude/trinity/investigations/plans');
  await fs.ensureDir('.claude/trinity/archive/work-orders');
  await fs.ensureDir('.claude/trinity/archive/investigations');
  await fs.ensureDir('.claude/trinity/archive/reports');
  await fs.ensureDir('.claude/trinity/archive/sessions');
  directoriesCreated += 12;

  // Claude Code directories
  await fs.ensureDir('.claude/agents/leadership');
  await fs.ensureDir('.claude/agents/deployment');
  await fs.ensureDir('.claude/agents/audit');
  await fs.ensureDir('.claude/agents/planning');
  await fs.ensureDir('.claude/agents/aj-team');
  directoriesCreated += 5;

  spinner.succeed('Trinity Method structure created');

  return directoriesCreated;
}
