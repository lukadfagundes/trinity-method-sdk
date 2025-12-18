/**
 * Utility to get SDK path - works in both ESM runtime and CommonJS tests
 * Automatically detects whether running from SDK root (dev/test) or installed package
 */

import path from 'path';
import fs from 'fs-extra';

/**
 * Get the SDK root directory path
 * Auto-detects: SDK root (tests/dev) or node_modules/@trinity-method/sdk (production)
 */
export async function getSDKPath(): Promise<string> {
  // Check if dist/templates exists in current directory (running from SDK root)
  if (await fs.pathExists(path.join(process.cwd(), 'dist/templates'))) {
    return process.cwd();
  }
  // Otherwise assume installed as npm package
  return path.join(process.cwd(), 'node_modules', '@trinity-method', 'sdk');
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
