/**
 * Update Utilities Module
 * Shared utilities for update command
 * @module cli/commands/update/utils
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Get SDK path for reading template files
 * @returns Path to SDK directory
 */
export async function getSDKPath(): Promise<string> {
  // In tests it's process.cwd(), in production it's node_modules/@trinity-method/sdk
  const sdkPath = (await fs.pathExists(path.join(process.cwd(), 'dist/templates')))
    ? process.cwd() // Running from SDK root (tests or dev)
    : path.join(process.cwd(), 'node_modules', '@trinity-method', 'sdk'); // Installed package

  return sdkPath;
}
