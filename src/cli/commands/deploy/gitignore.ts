/**
 * .gitignore update for Trinity exclusions
 */

import fs from 'fs-extra';
import { validatePath } from '../../utils/validate-path.js';
import type { Spinner } from './types.js';

/**
 * Update .gitignore to exclude Trinity files
 *
 * @param spinner - Spinner instance for status updates
 * @returns True if .gitignore was updated, false otherwise
 */
export async function updateGitignore(spinner: Spinner): Promise<boolean> {
  spinner.start('Updating .gitignore...');

  try {
    const gitignorePath = '.gitignore';
    let gitignoreContent = '';

    // Read existing .gitignore if it exists
    if (await fs.pathExists(gitignorePath)) {
      gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
    }

    // Trinity files to ignore
    const trinityIgnores = ['', '# Trinity Method deployment files', 'node_modules/', 'trinity/'];

    // Check if Trinity section already exists
    if (!gitignoreContent.includes('# Trinity Method deployment files')) {
      // Append Trinity ignores
      const newContent = `${gitignoreContent.trim()}\n${trinityIgnores.join('\n')}\n`;

      // Validate destination path for security
      const validatedPath = validatePath(gitignorePath);
      await fs.writeFile(validatedPath, newContent);
      spinner.succeed('.gitignore updated with Trinity exclusions');
      return true;
    } else {
      spinner.info('.gitignore already contains Trinity exclusions');
      return false;
    }
  } catch (error: unknown) {
    spinner.warn('.gitignore update failed');
    const { displayWarning, getErrorMessage } = await import('../../utils/errors.js');
    displayWarning(getErrorMessage(error));
    return false;
  }
}
