/**
 * Interactive configuration for Trinity deployment
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  getRecommendedTools,
  getDependenciesForTools,
  getScriptsForTools,
  getPostInstallInstructions,
} from '../../utils/linting-tools.js';
import type { DeployOptions, DeployConfig, Stack, LintingTool } from './types.js';

/**
 * Get default configuration for --yes flag
 */
function getDefaultConfig(options: DeployOptions): Partial<DeployConfig> {
  return {
    projectName: options.name || path.basename(process.cwd()),
    enableLinting: false,
    enableCICD: false,
    lintingTools: [],
    lintingDependencies: [],
    lintingScripts: {},
    postInstallInstructions: [],
  };
}

/**
 * Prompt for project name
 */
async function promptProjectName(defaultName: string): Promise<string> {
  const nameAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: defaultName,
    },
  ]);
  return nameAnswer.projectName;
}

/**
 * Display linting configuration summary
 */
function displayLintingConfig(
  tools: LintingTool[],
  dependencies: string[],
  scripts: Record<string, string>
): void {
  console.log(chalk.cyan('\n📦 Will configure:'));
  tools.forEach((tool) => {
    console.log(chalk.white(`  ✓ ${tool.name} (${tool.file})`));
    if (tool.description) {
      console.log(chalk.gray(`    ${tool.description}`));
    }
  });

  if (dependencies.length > 0) {
    console.log(chalk.white('\n  Dependencies to add (run npm install after deployment):'));
    dependencies.forEach((dep) => console.log(chalk.white(`    - ${dep}`)));
  }

  if (Object.keys(scripts).length > 0) {
    console.log(chalk.white('\n  Scripts to add to package.json:'));
    Object.entries(scripts).forEach(([name, _cmd]) => {
      console.log(chalk.white(`    - npm run ${name}`));
    });
  }
}

/**
 * Prompt for linting setup choice
 */
async function promptLintingChoice(stack: Stack): Promise<string> {
  console.log(chalk.cyan('\n📋 Optional: Code Quality Tools\n'));
  console.log(
    chalk.white(`Trinity can setup linting and formatting tools for ${stack.framework} projects.\n`)
  );

  const lintingChoice = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'setupLinting',
      message: 'Setup linting configuration? (y/n)',
      default: true,
    },
  ]);

  if (lintingChoice.setupLinting) {
    return 'recommended';
  } else {
    return 'skip';
  }
}

/**
 * Configure recommended linting tools
 */
async function configureRecommendedLinting(stack: Stack): Promise<{
  tools: LintingTool[];
  dependencies: string[];
  scripts: Record<string, string>;
}> {
  const tools = getRecommendedTools(stack.framework, stack.language);
  console.log(chalk.green('\n✔ Setup linting configuration?'), 'Recommended\n');

  const dependencies = getDependenciesForTools(tools);
  const scripts = getScriptsForTools(tools);

  displayLintingConfig(tools, dependencies, scripts);

  return { tools, dependencies, scripts };
}

/**
 * Detect Git platform from .git/config
 */
async function detectGitPlatform(): Promise<string> {
  try {
    const gitConfigPath = '.git/config';
    if (await fs.pathExists(gitConfigPath)) {
      const gitConfig = await fs.readFile(gitConfigPath, 'utf8');
      if (gitConfig.includes('github.com')) return 'GitHub Actions';
      if (gitConfig.includes('gitlab.com') || gitConfig.includes('gitlab')) return 'GitLab CI';
    }
  } catch {
    // Ignore detection errors
  }
  return 'unknown';
}

/**
 * Display CI/CD configuration summary
 */
function displayCICDConfig(platform: string): void {
  console.log(chalk.green('\n✔ Deploy CI/CD workflow templates?'), 'Yes');

  if (platform !== 'unknown') {
    console.log(chalk.cyan(`📦 Detected platform: ${platform}\n`));
    console.log(chalk.white('  Will configure:'));
    if (platform === 'GitHub Actions') {
      console.log(chalk.white('  ✓ .github/workflows/ci.yml'));
    } else if (platform === 'GitLab CI') {
      console.log(chalk.white('  ✓ .gitlab-ci.yml'));
    }
    console.log(chalk.white('  ✓ trinity/templates/ci/generic-ci.yml (reference)'));
  } else {
    console.log(chalk.cyan('\n📦 Will configure:\n'));
    console.log(chalk.white('  ✓ .github/workflows/ci.yml (GitHub Actions)'));
    console.log(chalk.white('  ✓ trinity/templates/ci/generic-ci.yml (reference)'));
  }
}

/**
 * Prompt for CI/CD setup
 */
async function promptCICDSetup(): Promise<boolean> {
  console.log(chalk.cyan('\n⚙️  Optional: CI/CD Automation\n'));
  console.log(
    chalk.white('Trinity can setup automated testing workflows for your CI/CD platform.\n')
  );

  const ciChoice = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'setupCI',
      message: 'Deploy CI/CD workflow templates?',
      default: true,
    },
  ]);

  if (ciChoice.setupCI) {
    const platform = await detectGitPlatform();
    displayCICDConfig(platform);
    return true;
  } else {
    console.log(chalk.gray('\n✔ Deploy CI/CD workflow templates?'), 'Skip\n');
    return false;
  }
}

/**
 * Confirm deployment
 */
async function confirmDeployment(): Promise<void> {
  const confirmAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmDeploy',
      message: 'Proceed with deployment?',
      default: true,
    },
  ]);

  if (!confirmAnswer.confirmDeploy) {
    console.log(chalk.yellow('\n🔸 Deployment cancelled\n'));
    throw new Error('Deployment cancelled by user');
  }
}

/**
 * Prompt user for deployment configuration
 *
 * @param options - Deploy command options
 * @param stack - Detected technology stack
 * @returns Deployment configuration
 */
export async function promptConfiguration(
  options: DeployOptions,
  stack: Stack
): Promise<Partial<DeployConfig>> {
  if (options.yes) {
    return getDefaultConfig(options);
  }

  const projectName = await promptProjectName(options.name || path.basename(process.cwd()));
  const lintingChoice = await promptLintingChoice(stack);

  let selectedLintingTools: LintingTool[] = [];
  let lintingDependencies: string[] = [];
  let lintingScripts: Record<string, string> = {};
  let enableLinting = false;

  if (lintingChoice === 'recommended') {
    enableLinting = true;
    const config = await configureRecommendedLinting(stack);
    selectedLintingTools = config.tools;
    lintingDependencies = config.dependencies;
    lintingScripts = config.scripts;
  } else {
    console.log(chalk.gray('\n✔ Setup linting configuration?'), 'Skip\n');
  }

  const postInstallInstructions =
    selectedLintingTools.length > 0
      ? getPostInstallInstructions(selectedLintingTools, stack.framework)
      : [];

  const enableCICD = await promptCICDSetup();

  await confirmDeployment();

  return {
    projectName,
    enableLinting,
    enableCICD,
    lintingTools: selectedLintingTools,
    lintingDependencies,
    lintingScripts,
    postInstallInstructions,
  };
}
