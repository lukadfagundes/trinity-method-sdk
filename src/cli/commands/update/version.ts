/**
 * Update Version Detection Module
 * Detects current and latest SDK versions
 * @module cli/commands/update/version
 */

import fs from 'fs-extra';
import { Ora } from 'ora';
import chalk from 'chalk';
import { getPackageJsonPath } from '../../utils/get-sdk-path.js';

export interface VersionInfo {
  currentVersion: string;
  latestVersion: string;
  isUpToDate: boolean;
}

/**
 * Detect installed SDK version and compare with latest
 * @param spinner - ora spinner instance for status display
 * @returns Version information
 */
export async function detectInstalledSDKVersion(spinner: Ora): Promise<VersionInfo> {
  spinner.start('Checking versions...');

  // Read current version from trinity/VERSION
  const versionPath = 'trinity/VERSION';
  let currentVersion = '0.0.0';
  if (await fs.pathExists(versionPath)) {
    currentVersion = (await fs.readFile(versionPath, 'utf8')).trim();
  }

  // Read latest version from SDK package.json
  const sdkPkgPath = await getPackageJsonPath();
  const sdkPkg = JSON.parse(await fs.readFile(sdkPkgPath, 'utf8'));
  const latestVersion = sdkPkg.version;

  spinner.succeed('Version check complete');
  console.log(chalk.gray(`   Current version: ${currentVersion}`));
  console.log(chalk.gray(`   Latest version:  ${latestVersion}`));
  console.log('');

  return {
    currentVersion,
    latestVersion,
    isUpToDate: currentVersion === latestVersion,
  };
}
