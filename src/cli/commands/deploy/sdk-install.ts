/**
 * Trinity Method SDK installation
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import type { Spinner } from './types.js';

/**
 * Install Trinity Method SDK to the project
 *
 * @param spinner - Spinner instance for status updates
 * @returns True if SDK was installed, false otherwise
 */
export async function installSDK(spinner: Spinner): Promise<boolean> {
  spinner.start('Installing Trinity Method SDK...');

  try {
    const { execSync } = await import('child_process');
    const packageJsonPath = 'package.json';

    if (await fs.pathExists(packageJsonPath)) {
      // Check if SDK is already installed
      const packageJson = await fs.readJson(packageJsonPath);
      const hasSDK =
        packageJson.dependencies?.['trinity-method-sdk'] ||
        packageJson.devDependencies?.['trinity-method-sdk'];

      if (!hasSDK) {
        // Add SDK to package.json dependencies
        if (!packageJson.dependencies) {
          packageJson.dependencies = {};
        }
        packageJson.dependencies['trinity-method-sdk'] = '^1.0.0';

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

        spinner.text = 'Installing Trinity Method SDK (this may take a moment)...';

        // Install dependencies
        execSync('npm install', {
          stdio: 'pipe',
          cwd: process.cwd(),
        });

        spinner.succeed('Trinity Method SDK installed successfully');
        return true;
      } else {
        spinner.info('Trinity Method SDK already installed');
        return false;
      }
    } else {
      spinner.warn('No package.json found - SDK not installed');
      console.log(chalk.yellow('   Run: npm init -y && npm install trinity-method-sdk'));
      return false;
    }
  } catch (error: unknown) {
    spinner.warn('SDK installation skipped');
    const { getErrorMessage } = await import('../../utils/errors.js');
    console.log(chalk.yellow(`   Install manually: npm install trinity-method-sdk`));
    console.log(chalk.gray(`   Error: ${getErrorMessage(error)}`));
    return false;
  }
}
