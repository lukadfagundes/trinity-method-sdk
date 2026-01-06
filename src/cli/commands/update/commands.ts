/**
 * Update Commands Module
 * Handles updating slash command files in .claude/commands/
 * @module cli/commands/update/commands
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import { UpdateStats } from './types.js';
import { getSDKPath } from './utils.js';

/** Command categories */
const COMMAND_CATEGORIES = [
  'session',
  'planning',
  'execution',
  'investigation',
  'infrastructure',
  'utility',
];

/**
 * Determine command category based on filename
 * @param filename - Command file name
 * @returns Category name
 */
function determineCommandCategory(filename: string): string {
  if (filename.includes('start') || filename.includes('continue') || filename.includes('end')) {
    return 'session';
  } else if (
    filename.includes('requirements') ||
    filename.includes('design') ||
    filename.includes('plan') ||
    filename.includes('decompose')
  ) {
    return 'planning';
  } else if (filename.includes('orchestrate')) {
    return 'execution';
  } else if (filename.includes('investigation')) {
    return 'investigation';
  } else if (filename.includes('init')) {
    return 'infrastructure';
  }
  return 'utility';
}

/**
 * Update slash command files from SDK to .claude/commands/
 * @param spinner - ora spinner instance for status display
 * @param stats - update statistics to track progress
 */
export async function updateCommands(spinner: Ora, stats: UpdateStats): Promise<void> {
  spinner.start('Updating slash commands...');

  const sdkPath = await getSDKPath();
  const commandsTemplatePath = path.join(sdkPath, 'dist/templates/shared/claude-commands');

  if (!(await fs.pathExists(commandsTemplatePath))) {
    spinner.warn('Commands template path not found, skipping');
    return;
  }

  // Create command category directories
  for (const category of COMMAND_CATEGORIES) {
    const targetCategoryPath = path.join('.claude/commands', category);
    await fs.ensureDir(targetCategoryPath);
  }

  // Copy all command files
  const commandFiles = await fs.readdir(commandsTemplatePath);
  for (const file of commandFiles) {
    if (file.endsWith('.md.template')) {
      const sourcePath = path.join(commandsTemplatePath, file);
      const category = determineCommandCategory(file);
      // Remove .template extension for deployed file
      const deployedFileName = file.replace('.template', '');
      const targetPath = path.join('.claude/commands', category, deployedFileName);

      await fs.copy(sourcePath, targetPath, { overwrite: true });
      stats.commandsUpdated++;
    }
  }

  spinner.succeed(`Slash commands updated (${stats.commandsUpdated} files)`);
}
