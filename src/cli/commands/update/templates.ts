/**
 * Update Templates Module
 * Handles updating work order, documentation, and investigation template files
 * @module cli/commands/update/templates
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import { UpdateStats } from './types.js';
import { getSDKPath } from './utils.js';

/** Template directories to update */
const TEMPLATE_DIRS = ['work-orders', 'documentation', 'investigations'];

/**
 * Recursively copy files from source to target directory
 * @param sourcePath - source directory path
 * @param targetPath - target directory path
 * @param stats - update statistics to track progress
 */
async function copyTemplatesRecursively(
  sourcePath: string,
  targetPath: string,
  stats: UpdateStats
): Promise<void> {
  const entries = await fs.readdir(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    const sourceFile = path.join(sourcePath, entry.name);
    const targetFile = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      await fs.ensureDir(targetFile);
      await copyTemplatesRecursively(sourceFile, targetFile, stats);
    } else if (entry.isFile()) {
      // Copy template files (.md.template files get .template stripped)
      if (entry.name.endsWith('.md.template')) {
        const deployedFileName = entry.name.replace('.template', '');
        const targetFilePath = path.join(targetPath, deployedFileName);
        await fs.copy(sourceFile, targetFilePath, { overwrite: true });
        stats.templatesUpdated++;
      }
      // Copy plain .md files (e.g., Mermaid diagram templates)
      else if (entry.name.endsWith('.md')) {
        await fs.copy(sourceFile, targetFile, { overwrite: true });
        stats.templatesUpdated++;
      }
    }
  }
}

/**
 * Update template files from SDK to trinity/templates/
 * @param spinner - ora spinner instance for status display
 * @param stats - update statistics to track progress
 */
export async function updateTemplates(spinner: Ora, stats: UpdateStats): Promise<void> {
  spinner.start('Updating templates...');

  const sdkPath = await getSDKPath();
  const sdkTemplatesPath = path.join(sdkPath, 'dist/templates');

  for (const templateDir of TEMPLATE_DIRS) {
    const sourcePath = path.join(sdkTemplatesPath, templateDir);
    const targetPath = path.join('trinity/templates', templateDir);

    if (await fs.pathExists(sourcePath)) {
      await fs.ensureDir(targetPath);
      await copyTemplatesRecursively(sourcePath, targetPath, stats);
    }
  }

  spinner.succeed(`Templates updated (${stats.templatesUpdated} files)`);
}
