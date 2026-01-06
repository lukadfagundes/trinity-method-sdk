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
      const files = await fs.readdir(sourcePath);

      // Copy each file individually, stripping .template extension
      for (const file of files) {
        if (file.endsWith('.md.template')) {
          const sourceFile = path.join(sourcePath, file);
          const deployedFileName = file.replace('.template', '');
          const targetFile = path.join(targetPath, deployedFileName);

          await fs.copy(sourceFile, targetFile, { overwrite: true });
          stats.templatesUpdated++;
        }
      }
    }
  }

  spinner.succeed(`Templates updated (${stats.templatesUpdated} files)`);
}
