/**
 * Linting configuration deployment
 */

import { deployLintingTool } from '../../utils/deploy-linting.js';
import { injectLintingDependencies } from '../../utils/inject-dependencies.js';
import type { LintingTool, Stack, Spinner } from './types.js';

/**
 * Deploy linting tools and inject dependencies
 *
 * @param lintingTools - Selected linting tools to deploy
 * @param lintingDependencies - Dependencies to inject
 * @param lintingScripts - Scripts to add to package.json
 * @param stack - Detected technology stack
 * @param templatesPath - Path to templates directory
 * @param variables - Template variables for substitution
 * @param spinner - Spinner instance for status updates
 * @returns Number of files deployed
 */
export async function deployLinting(
  lintingTools: LintingTool[],
  lintingDependencies: string[],
  lintingScripts: Record<string, string>,
  stack: Stack,
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<number> {
  let filesDeployed = 0;

  // Deploy linting configuration files
  if (lintingTools.length > 0) {
    spinner.start('Deploying linting configuration...');

    try {
      for (const tool of lintingTools) {
        await deployLintingTool(tool, stack, templatesPath, variables);
        filesDeployed++;
      }

      spinner.succeed(`Linting configuration deployed (${lintingTools.length} tools)`);
    } catch (error: unknown) {
      spinner.fail('Linting configuration deployment failed');
      const { displayWarning, getErrorMessage } = await import('../../utils/errors.js');
      displayWarning(getErrorMessage(error));
    }
  }

  // Inject linting dependencies
  if (lintingDependencies.length > 0) {
    spinner.start('Adding linting dependencies to project...');

    try {
      await injectLintingDependencies(lintingDependencies, lintingScripts, stack.framework);
      spinner.succeed('Linting dependencies added to project configuration');
    } catch (error: unknown) {
      spinner.fail('Dependency injection failed');
      const { displayWarning, getErrorMessage } = await import('../../utils/errors.js');
      displayWarning(getErrorMessage(error));
    }
  }

  return filesDeployed;
}
