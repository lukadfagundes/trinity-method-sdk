/**
 * Interactive configuration for Trinity deployment
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {
  getRecommendedTools,
  getToolsForFramework,
  getDependenciesForTools,
  getScriptsForTools,
  getPostInstallInstructions,
} from '../../utils/linting-tools.js';
import type { DeployOptions, DeployConfig, Stack, LintingTool, PostInstallInstruction } from './types.js';

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
  // If --yes flag, use defaults
  if (options.yes) {
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

  // Interactive configuration
  let projectName = options.name || path.basename(process.cwd());
  let selectedLintingTools: LintingTool[] = [];
  let lintingDependencies: string[] = [];
  let lintingScripts: Record<string, string> = {};
  let postInstallInstructions: PostInstallInstruction[] = [];
  let enableLinting = false;
  let enableCICD = false;

  // Project name prompt
  const nameAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectName,
    },
  ]);
  projectName = nameAnswer.projectName;

  // Linting setup prompts
  console.log(chalk.cyan('\n📋 Optional: Code Quality Tools\n'));
  console.log(
    chalk.white(`Trinity can setup linting and formatting tools for ${stack.framework} projects.\n`)
  );

  const lintingChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'linting',
      message: 'Setup linting configuration?',
      choices: [
        {
          name: 'Recommended (Best practices for ' + stack.framework + ')',
          value: 'recommended',
        },
        {
          name: 'Custom (Choose specific tools)',
          value: 'custom',
        },
        {
          name: 'Skip - No linting setup',
          value: 'skip',
        },
      ],
      default: 0,
    },
  ]);

  if (lintingChoice.linting === 'recommended') {
    enableLinting = true;
    selectedLintingTools = getRecommendedTools(stack.framework, stack.language);

    // Show configuration
    console.log(chalk.green('\n✔ Setup linting configuration?'), 'Recommended\n');
    console.log(chalk.cyan('📦 Will configure:'));
    selectedLintingTools.forEach((tool) => {
      console.log(chalk.white(`  ✓ ${tool.name} (${tool.file})`));
      if (tool.description) {
        console.log(chalk.gray(`    ${tool.description}`));
      }
    });

    // Show dependencies
    lintingDependencies = getDependenciesForTools(selectedLintingTools);
    if (lintingDependencies.length > 0) {
      console.log(chalk.white('\n  Dependencies to add (run npm install after deployment):'));
      lintingDependencies.forEach((dep) => console.log(chalk.white(`    - ${dep}`)));
    }

    // Show scripts
    lintingScripts = getScriptsForTools(selectedLintingTools);
    if (Object.keys(lintingScripts).length > 0) {
      console.log(chalk.white('\n  Scripts to add to package.json:'));
      Object.entries(lintingScripts).forEach(([name, cmd]) => {
        console.log(chalk.white(`    - npm run ${name}`));
      });
    }
  } else if (lintingChoice.linting === 'custom') {
    // Get all available tools
    const availableTools = getToolsForFramework(stack.framework, stack.language);

    const customSelection = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Select tools to configure:',
        choices: availableTools.map((tool) => ({
          name: `${tool.name} (${tool.file})${tool.description ? ' - ' + tool.description : ''}`,
          value: tool.id,
          checked: tool.recommended,
        })),
      },
    ]);

    // Filter selected tools
    selectedLintingTools = availableTools.filter((t) => customSelection.tools.includes(t.id));

    if (selectedLintingTools.length > 0) {
      enableLinting = true;
      console.log(
        chalk.green('\n✔ Selected:'),
        selectedLintingTools.map((t) => t.name).join(', ')
      );

      // Show configuration summary
      console.log(chalk.cyan('\n📦 Configuration summary:'));
      selectedLintingTools.forEach((tool) => {
        console.log(chalk.white(`  ✓ ${tool.name} (${tool.file})`));
      });

      // Show dependencies
      lintingDependencies = getDependenciesForTools(selectedLintingTools);
      if (lintingDependencies.length > 0) {
        console.log(chalk.white('\n  Dependencies to add:'));
        lintingDependencies.forEach((dep) => console.log(chalk.white(`    - ${dep}`)));
      }

      // Show scripts
      lintingScripts = getScriptsForTools(selectedLintingTools);
    } else {
      console.log(
        chalk.yellow('\n⚠️  No tools selected - continuing without linting configuration')
      );
    }
  } else {
    console.log(chalk.gray('\n✔ Setup linting configuration?'), 'Skip\n');
  }

  // Get post-install instructions
  if (selectedLintingTools.length > 0) {
    postInstallInstructions = getPostInstallInstructions(selectedLintingTools, stack.framework);
  }

  // CI/CD setup prompt
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
    enableCICD = true;

    // Detect Git platform
    let platform = 'unknown';
    try {
      const gitConfigPath = '.git/config';
      if (await fs.pathExists(gitConfigPath)) {
        const gitConfig = await fs.readFile(gitConfigPath, 'utf8');
        if (gitConfig.includes('github.com')) {
          platform = 'GitHub Actions';
        } else if (gitConfig.includes('gitlab.com') || gitConfig.includes('gitlab')) {
          platform = 'GitLab CI';
        }
      }
    } catch (error) {
      // Ignore detection errors
    }

    if (platform !== 'unknown') {
      console.log(chalk.green('\n✔ Deploy CI/CD workflow templates?'), 'Yes');
      console.log(chalk.cyan(`📦 Detected platform: ${platform}\n`));
      console.log(chalk.white('  Will configure:'));
      if (platform === 'GitHub Actions') {
        console.log(chalk.white('  ✓ .github/workflows/trinity-ci.yml'));
      } else if (platform === 'GitLab CI') {
        console.log(chalk.white('  ✓ .gitlab-ci.yml'));
      }
      console.log(chalk.white('  ✓ trinity/templates/ci/generic-ci.yml (reference)'));
    } else {
      console.log(chalk.green('\n✔ Deploy CI/CD workflow templates?'), 'Yes');
      console.log(chalk.cyan('\n📦 Will configure:\n'));
      console.log(chalk.white('  ✓ .github/workflows/trinity-ci.yml (GitHub Actions)'));
      console.log(chalk.white('  ✓ trinity/templates/ci/generic-ci.yml (reference)'));
    }
  } else {
    console.log(chalk.gray('\n✔ Deploy CI/CD workflow templates?'), 'Skip\n');
  }

  // Final confirmation
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
