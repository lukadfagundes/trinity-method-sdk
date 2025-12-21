/**
 * Update Agents Module
 * Handles updating agent files in .claude/agents/
 * @module cli/commands/update/agents
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import { UpdateStats } from './types.js';
import { getSDKPath } from './utils.js';

/** Agent subdirectories to update */
const AGENT_DIRS = ['leadership', 'planning', 'aj-team', 'deployment', 'audit'];

/**
 * Update agent files from SDK to .claude/agents/
 * @param spinner - ora spinner instance for status display
 * @param stats - update statistics to track progress
 */
export async function updateAgents(spinner: Ora, stats: UpdateStats): Promise<void> {
  spinner.start('Updating agents...');

  const sdkPath = await getSDKPath();
  const agentsTemplatePath = path.join(sdkPath, 'dist/templates/agents');

  for (const agentDir of AGENT_DIRS) {
    const sourcePath = path.join(agentsTemplatePath, agentDir);
    const targetPath = path.join('.claude/agents', agentDir);

    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, targetPath, { overwrite: true });
      const files = await fs.readdir(sourcePath);
      stats.agentsUpdated += files.length;
    }
  }

  spinner.succeed(`Agents updated (${stats.agentsUpdated} files)`);
}
