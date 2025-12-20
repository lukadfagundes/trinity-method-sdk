/**
 * Root files and CLAUDE.md hierarchy deployment
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { processTemplate } from '../../utils/template-processor.js';
import type { Stack, Spinner } from './types.js';

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

  // TRINITY.md
  const trinityRootTemplate = path.join(templatesPath, 'root', 'TRINITY.md.template');
  if (await fs.pathExists(trinityRootTemplate)) {
    const content = await fs.readFile(trinityRootTemplate, 'utf8');
    const processed = processTemplate(content, variables);
    await fs.writeFile('TRINITY.md', processed);
    filesDeployed++;
  }

  // Root CLAUDE.md
  const claudeRootTemplate = path.join(templatesPath, 'root', 'CLAUDE.md.template');
  if (await fs.pathExists(claudeRootTemplate)) {
    const content = await fs.readFile(claudeRootTemplate, 'utf8');
    const processed = processTemplate(content, variables);
    await fs.writeFile('CLAUDE.md', processed);
    filesDeployed++;
  }

  // VERSION file
  await fs.writeFile('trinity/VERSION', pkgVersion || '1.0.0');
  filesDeployed++;

  spinner.succeed('Root files created');

  // Deploy trinity/CLAUDE.md
  spinner.start('Deploying Trinity CLAUDE.md...');

  const trinityCLAUDETemplate = path.join(templatesPath, 'trinity', 'CLAUDE.md.template');
  if (await fs.pathExists(trinityCLAUDETemplate)) {
    const content = await fs.readFile(trinityCLAUDETemplate, 'utf8');
    const processed = processTemplate(content, variables);
    await fs.writeFile('trinity/CLAUDE.md', processed);
    filesDeployed++;
    spinner.succeed('Trinity CLAUDE.md deployed');
  } else {
    spinner.warn('Trinity CLAUDE.md template not found');
  }

  // Deploy source directory CLAUDE.md to ALL detected directories
  const frameworkMap: Record<string, string> = {
    'Node.js': 'nodejs-CLAUDE.md.template',
    'Flutter': 'flutter-CLAUDE.md.template',
    'React': 'react-CLAUDE.md.template',
    'Next.js': 'react-CLAUDE.md.template',
    'Python': 'python-CLAUDE.md.template',
    'Rust': 'rust-CLAUDE.md.template',
    'Unknown': 'base-CLAUDE.md.template',
  };

  const templateName = frameworkMap[stack.framework] || 'base-CLAUDE.md.template';
  let sourceCLAUDETemplate = path.join(templatesPath, 'source', templateName);

  if (!(await fs.pathExists(sourceCLAUDETemplate))) {
    console.log(chalk.yellow(`   Note: Using base template for ${stack.framework}`));
    sourceCLAUDETemplate = path.join(templatesPath, 'source', 'base-CLAUDE.md.template');
  }

  if (await fs.pathExists(sourceCLAUDETemplate)) {
    const content = await fs.readFile(sourceCLAUDETemplate, 'utf8');

    // Deploy to all detected source directories
    let deployedCount = 0;
    for (const sourceDir of stack.sourceDirs) {
      spinner.start(`Deploying ${sourceDir}/CLAUDE.md...`);

      // Only deploy if directory exists (never create directories)
      if (await fs.pathExists(sourceDir)) {
        // Process template with this specific source directory
        const processed = processTemplate(content, { ...variables, SOURCE_DIR: sourceDir });
        await fs.writeFile(`${sourceDir}/CLAUDE.md`, processed);
        filesDeployed++;
        deployedCount++;
        spinner.succeed(`${sourceDir}/CLAUDE.md deployed`);
      } else {
        spinner.warn(`Directory ${sourceDir} not found, skipping`);
      }
    }

    if (deployedCount === 0) {
      spinner.warn('No source directories found for CLAUDE.md deployment');
    }
  } else {
    spinner.warn(`Source CLAUDE.md template not found for ${stack.framework}`);
  }

  // Deploy tests/CLAUDE.md
  const testsCLAUDETemplate = path.join(templatesPath, 'source', 'tests-CLAUDE.md.template');
  if ((await fs.pathExists(testsCLAUDETemplate)) && (await fs.pathExists('tests'))) {
    spinner.start('Deploying tests/CLAUDE.md...');
    const testsContent = await fs.readFile(testsCLAUDETemplate, 'utf8');

    // Determine test framework from package.json or config files
    let testFramework = 'Generic';
    if (await fs.pathExists('package.json')) {
      const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      if (pkg.devDependencies?.jest || pkg.dependencies?.jest) testFramework = 'Jest';
      else if (pkg.devDependencies?.vitest || pkg.dependencies?.vitest) testFramework = 'Vitest';
      else if (pkg.devDependencies?.mocha || pkg.dependencies?.mocha) testFramework = 'Mocha';
      else if (pkg.devDependencies?.pytest) testFramework = 'Pytest';
    }

    const testsProcessed = processTemplate(testsContent, {
      ...variables,
      TEST_FRAMEWORK: testFramework,
    });
    await fs.writeFile('tests/CLAUDE.md', testsProcessed);
    filesDeployed++;
    spinner.succeed('tests/CLAUDE.md deployed');
  } else if (await fs.pathExists('tests')) {
    spinner.warn('tests/CLAUDE.md template not found');
  }

  return filesDeployed;
}
