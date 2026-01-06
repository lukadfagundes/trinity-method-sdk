/**
 * Update Utilities Module
 * Shared utilities for update command
 * @module cli/commands/update/utils
 */

import { getSDKPath as getCentralSDKPath } from '../../utils/get-sdk-path.js';

/**
 * Get SDK path for reading template files
 * Uses centralized SDK path resolution that supports dev, local, and global installs
 * @returns Path to SDK directory
 */
export async function getSDKPath(): Promise<string> {
  return getCentralSDKPath();
}
