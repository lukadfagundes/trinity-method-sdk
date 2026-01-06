/**
 * Utility to get SDK path - works in both ESM runtime and CommonJS tests
 * Automatically detects whether running from SDK root (dev/test) or installed package
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

/**
 * Get the SDK root directory path
 * Auto-detects: SDK root (tests/dev), local install, or global install
 */
export async function getSDKPath(): Promise<string> {
  // Check if dist/templates exists in current directory (running from SDK root during dev/test)
  if (await fs.pathExists(path.join(process.cwd(), 'dist/templates'))) {
    return process.cwd();
  }

  // Check local node_modules (for local installs)
  const localPath = path.join(process.cwd(), 'node_modules', 'trinity-method-sdk');
  if (await fs.pathExists(localPath)) {
    return localPath;
  }

  // For global install, use import.meta.url to find the SDK root
  // import.meta.url points to dist/cli/utils/get-sdk-path.js, so go up 3 levels to reach SDK root
  const currentFilePath = fileURLToPath(import.meta.url);
  const globalPath = path.resolve(path.dirname(currentFilePath), '..', '..', '..');

  // Return global path (works for global installs)
  return globalPath;
}

/**
 * Get the templates directory path
 */
export async function getTemplatesPath(): Promise<string> {
  return path.join(await getSDKPath(), 'dist/templates');
}

/**
 * Get the package.json path
 */
export async function getPackageJsonPath(): Promise<string> {
  return path.join(await getSDKPath(), 'package.json');
}
