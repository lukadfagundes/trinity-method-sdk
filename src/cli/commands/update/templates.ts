/**
 * Update Templates Module
 * Handles updating work order template files
 * @module cli/commands/update/templates
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import { UpdateStats } from './types.js';
import { getSDKPath } from './utils.js';

/**
 * Update work order templates from SDK to trinity/templates/
 * @param spinner - ora spinner instance for status display
 * @param stats - update statistics to track progress
 */
export async function updateTemplates(spinner: Ora, stats: UpdateStats): Promise<void> {
  spinner.start('Updating work order templates...');

  const sdkPath = await getSDKPath();
  const woTemplatePath = path.join(sdkPath, 'dist/templates/work-orders');

  if (await fs.pathExists(woTemplatePath)) {
    await fs.copy(woTemplatePath, 'trinity/templates', { overwrite: true });
    const files = await fs.readdir(woTemplatePath);
    stats.templatesUpdated = files.length;
  }

  spinner.succeed(`Work order templates updated (${stats.templatesUpdated} files)`);
}
