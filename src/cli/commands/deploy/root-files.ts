/**
 * Root files and CLAUDE.md hierarchy deployment
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { processTemplate } from '../../utils/template-processor.js';
import { validatePath } from '../../utils/validate-path.js';
import type { Stack, Spinner } from './types.js';

/**
 * Deploy TRINITY.md root file
 */
async function deployTrinityMarkdown(
  templatesPath: string,
  variables: Record<string, string>
): Promise<number> {
  const trinityRootTemplate = path.join(templatesPath, 'root', 'TRINITY.md.template');
  if (await fs.pathExists(trinityRootTemplate)) {
    const content = await fs.readFile(trinityRootTemplate, 'utf8');
    const processed = processTemplate(content, variables);
    const destPath = validatePath('TRINITY.md');
    await fs.writeFile(destPath, processed);
    return 1;
  }
  return 0;
}

/**
 * Deploy root CLAUDE.md file
 */
async function deployRootClaudeMarkdown(
  templatesPath: string,
  variables: Record<string, string>
): Promise<number> {
  const claudeRootTemplate = path.join(templatesPath, 'root', 'CLAUDE.md.template');
  if (await fs.pathExists(claudeRootTemplate)) {
    const content = await fs.readFile(claudeRootTemplate, 'utf8');
    const processed = processTemplate(content, variables);
    const destPath = validatePath('CLAUDE.md');
    await fs.writeFile(destPath, processed);
    return 1;
  }
  return 0;
}

/**
 * Deploy VERSION file
 */
async function deployVersionFile(pkgVersion: string): Promise<number> {
  const versionPath = validatePath('trinity/VERSION');
  await fs.writeFile(versionPath, pkgVersion || '2.0.9');
  return 1;
}

/**
 * Deploy trinity/CLAUDE.md file
 */
async function deployTrinityClaudeMarkdown(
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<number> {
  spinner.start('Deploying Trinity CLAUDE.md...');

  const trinityCLAUDETemplate = path.join(templatesPath, 'trinity', 'CLAUDE.md.template');
  if (await fs.pathExists(trinityCLAUDETemplate)) {
    const content = await fs.readFile(trinityCLAUDETemplate, 'utf8');
    const processed = processTemplate(content, variables);
    const destPath = validatePath('trinity/CLAUDE.md');
    await fs.writeFile(destPath, processed);
    spinner.succeed('Trinity CLAUDE.md deployed');
    return 1;
  } else {
    spinner.warn('Trinity CLAUDE.md template not found');
    return 0;
  }
}

/**
 * Deploy source directory CLAUDE.md files
 */
async function deploySourceClaudeMarkdown(
  templatesPath: string,
  variables: Record<string, string>,
  stack: Stack,
  spinner: Spinner
): Promise<number> {
  const frameworkMap: Record<string, string> = {
    'Node.js': 'nodejs-CLAUDE.md.template',
    Flutter: 'flutter-CLAUDE.md.template',
    React: 'react-CLAUDE.md.template',
    'Next.js': 'react-CLAUDE.md.template',
    Python: 'python-CLAUDE.md.template',
    Rust: 'rust-CLAUDE.md.template',
    Unknown: 'base-CLAUDE.md.template',
  };

  const templateName = frameworkMap[stack.framework] || 'base-CLAUDE.md.template';
  let sourceCLAUDETemplate = path.join(templatesPath, 'source', templateName);

  if (!(await fs.pathExists(sourceCLAUDETemplate))) {
    console.log(chalk.yellow(`   Note: Using base template for ${stack.framework}`));
    sourceCLAUDETemplate = path.join(templatesPath, 'source', 'base-CLAUDE.md.template');
  }

  if (!(await fs.pathExists(sourceCLAUDETemplate))) {
    spinner.warn(`Source CLAUDE.md template not found for ${stack.framework}`);
    return 0;
  }

  const content = await fs.readFile(sourceCLAUDETemplate, 'utf8');
  let deployedCount = 0;

  for (const sourceDir of stack.sourceDirs) {
    spinner.start(`Deploying ${sourceDir}/CLAUDE.md...`);

    if (await fs.pathExists(sourceDir)) {
      const processed = processTemplate(content, { ...variables, SOURCE_DIR: sourceDir });
      const destPath = validatePath(`${sourceDir}/CLAUDE.md`);
      await fs.writeFile(destPath, processed);
      deployedCount++;
      spinner.succeed(`${sourceDir}/CLAUDE.md deployed`);
    } else {
      spinner.warn(`Directory ${sourceDir} not found, skipping`);
    }
  }

  if (deployedCount === 0) {
    spinner.warn('No source directories found for CLAUDE.md deployment');
  }

  return deployedCount;
}

/**
 * Detect test framework from package.json
 */
async function detectTestFramework(): Promise<string> {
  if (!(await fs.pathExists('package.json'))) {
    return 'Generic';
  }

  const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  if (allDeps.jest) return 'Jest';
  if (allDeps.vitest) return 'Vitest';
  if (allDeps.mocha) return 'Mocha';
  if (allDeps.pytest) return 'Pytest';

  return 'Generic';
}

/**
 * Deploy tests/CLAUDE.md file
 */
async function deployTestsClaudeMarkdown(
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<number> {
  const testsCLAUDETemplate = path.join(templatesPath, 'source', 'tests-CLAUDE.md.template');

  if (!(await fs.pathExists(testsCLAUDETemplate))) {
    if (await fs.pathExists('tests')) {
      spinner.warn('tests/CLAUDE.md template not found');
    }
    return 0;
  }

  if (!(await fs.pathExists('tests'))) {
    return 0;
  }

  spinner.start('Deploying tests/CLAUDE.md...');
  const testsContent = await fs.readFile(testsCLAUDETemplate, 'utf8');
  const testFramework = await detectTestFramework();
  const testsProcessed = processTemplate(testsContent, {
    ...variables,
    TEST_FRAMEWORK: testFramework,
  });

  const destPath = validatePath('tests/CLAUDE.md');
  await fs.writeFile(destPath, testsProcessed);
  spinner.succeed('tests/CLAUDE.md deployed');
  return 1;
}

/**
 * Deploy root files and CLAUDE.md hierarchy
 *
 * @param templatesPath - Path to templates directory
 * @param variables - Template variables for substitution
 * @param stack - Detected technology stack
 * @param pkgVersion - Package version for VERSION file
 * @param spinner - Spinner instance for status updates
 * @returns Number of files deployed
 */
export async function deployRootFiles(
  templatesPath: string,
  variables: Record<string, string>,
  stack: Stack,
  pkgVersion: string,
  spinner: Spinner
): Promise<number> {
  let filesDeployed = 0;

  // Deploy root files
  spinner.start('Creating root files...');

  filesDeployed += await deployTrinityMarkdown(templatesPath, variables);
  filesDeployed += await deployRootClaudeMarkdown(templatesPath, variables);
  filesDeployed += await deployVersionFile(pkgVersion);

  spinner.succeed('Root files created');

  // Deploy trinity/CLAUDE.md
  filesDeployed += await deployTrinityClaudeMarkdown(templatesPath, variables, spinner);

  // Deploy source directory CLAUDE.md files
  filesDeployed += await deploySourceClaudeMarkdown(templatesPath, variables, stack, spinner);

  // Deploy tests/CLAUDE.md
  filesDeployed += await deployTestsClaudeMarkdown(templatesPath, variables, spinner);

  return filesDeployed;
}
