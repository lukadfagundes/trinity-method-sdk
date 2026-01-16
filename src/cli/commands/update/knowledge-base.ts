/**
 * Update Knowledge Base Module
 * Handles updating SDK-managed knowledge base files
 * @module cli/commands/update/knowledge-base
 */

import fs from 'fs-extra';
import path from 'path';
import { Ora } from 'ora';
import { UpdateStats } from './types.js';
import { getSDKPath } from './utils.js';

/** SDK-managed knowledge base files (not user content) */
const SDK_MANAGED_KB_FILES = [
  'Trinity.md.template',
  'CODING-PRINCIPLES.md.template',
  'TESTING-PRINCIPLES.md.template',
  'AI-DEVELOPMENT-GUIDE.md.template',
  'DOCUMENTATION-CRITERIA.md.template',
];

/**
 * Update SDK-managed knowledge base files (preserves user content)
 * @param spinner - ora spinner instance for status display
 * @param stats - update statistics to track progress
 */
export async function updateKnowledgeBase(spinner: Ora, stats: UpdateStats): Promise<void> {
  spinner.start('Updating knowledge base...');

  const sdkPath = await getSDKPath();
  const kbTemplatePath = path.join(sdkPath, 'dist/templates/trinity/knowledge-base');

  for (const templateFile of SDK_MANAGED_KB_FILES) {
    const sourcePath = path.join(kbTemplatePath, templateFile);
    if (await fs.pathExists(sourcePath)) {
      // Remove .template extension for target
      const targetFile = templateFile.replace('.template', '');
      const targetPath = path.join('trinity/knowledge-base', targetFile);
      await fs.copy(sourcePath, targetPath, { overwrite: true });
      stats.knowledgeBaseUpdated++;
    }
  }

  spinner.succeed(`Knowledge base updated (${stats.knowledgeBaseUpdated} files)`);
}
