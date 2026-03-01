/**
 * Update Claude Files Module
 * Handles updating CLAUDE.md context files and EMPLOYEE-DIRECTORY during update
 * @module cli/commands/update/claude-files
 */

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { Ora } from 'ora';
import { UpdateStats } from './types.js';
import { getSDKPath } from './utils.js';
import { detectStack } from '../../utils/detect-stack.js';
import { processTemplate, extractVariables } from '../../utils/template-processor.js';

/** Framework-to-template mapping for source directory CLAUDE.md files */
const FRAMEWORK_TEMPLATE_MAP: Record<string, string> = {
  'Node.js': 'nodejs-CLAUDE.md.template',
  Flutter: 'flutter-CLAUDE.md.template',
  React: 'react-CLAUDE.md.template',
  'Next.js': 'react-CLAUDE.md.template',
  Python: 'python-CLAUDE.md.template',
  Rust: 'rust-CLAUDE.md.template',
  Unknown: 'base-CLAUDE.md.template',
};

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
 * Read and process a template file
 */
async function readAndProcessTemplate(
  templatePath: string,
  variables: Record<string, string>
): Promise<string | null> {
  if (!(await fs.pathExists(templatePath))) {
    return null;
  }
  const content = await fs.readFile(templatePath, 'utf8');
  return processTemplate(content, variables);
}

/**
 * Update CLAUDE.md context files and EMPLOYEE-DIRECTORY
 * @param spinner - ora spinner instance for status display
 * @param stats - update statistics to track progress
 */
export async function updateClaudeFiles(spinner: Ora, stats: UpdateStats): Promise<void> {
  spinner.start('Updating CLAUDE.md context files...');

  const sdkPath = await getSDKPath();
  const templatesPath = path.join(sdkPath, 'dist/templates');

  // Detect project stack for template variables
  const stack = await detectStack();

  // Get project name from package.json if available
  let projectName = 'Unknown Project';
  if (await fs.pathExists('package.json')) {
    try {
      const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      projectName = pkg.name || projectName;
    } catch {
      // Use default
    }
  }

  const variables = extractVariables(stack, projectName);

  // 1. Root CLAUDE.md — SDK-managed, always overwrite
  const rootTemplate = path.join(templatesPath, 'root', 'CLAUDE.md.template');
  const rootContent = await readAndProcessTemplate(rootTemplate, variables);
  if (rootContent) {
    await fs.writeFile('CLAUDE.md', rootContent);
    stats.claudeFilesUpdated++;
  }

  // 2. .claude/trinity/CLAUDE.md — SDK-managed, always overwrite
  const trinityTemplate = path.join(templatesPath, 'trinity', 'CLAUDE.md.template');
  const trinityContent = await readAndProcessTemplate(trinityTemplate, variables);
  if (trinityContent) {
    await fs.ensureDir('.claude/trinity');
    await fs.writeFile('.claude/trinity/CLAUDE.md', trinityContent);
    stats.claudeFilesUpdated++;
  }

  // 3. Source directory CLAUDE.md files — deploy if missing, skip if exists
  const templateName = FRAMEWORK_TEMPLATE_MAP[stack.framework] || 'base-CLAUDE.md.template';
  let sourceTemplatePath = path.join(templatesPath, 'source', templateName);

  if (!(await fs.pathExists(sourceTemplatePath))) {
    sourceTemplatePath = path.join(templatesPath, 'source', 'base-CLAUDE.md.template');
  }

  if (await fs.pathExists(sourceTemplatePath)) {
    const sourceTemplateContent = await fs.readFile(sourceTemplatePath, 'utf8');

    for (const sourceDir of stack.sourceDirs) {
      if (await fs.pathExists(sourceDir)) {
        const targetPath = path.join(sourceDir, 'CLAUDE.md');
        if (await fs.pathExists(targetPath)) {
          console.log(chalk.yellow(`   Skipped ${targetPath} (exists, use --force to overwrite)`));
        } else {
          const processed = processTemplate(sourceTemplateContent, {
            ...variables,
            SOURCE_DIR: sourceDir,
          });
          await fs.writeFile(targetPath, processed);
          stats.claudeFilesUpdated++;
        }
      }
    }
  }

  // 4. tests/CLAUDE.md — deploy if tests/ exists and CLAUDE.md is missing
  if (await fs.pathExists('tests')) {
    const testsClaudePath = 'tests/CLAUDE.md';
    if (await fs.pathExists(testsClaudePath)) {
      console.log(chalk.yellow(`   Skipped ${testsClaudePath} (exists, use --force to overwrite)`));
    } else {
      const testsTemplate = path.join(templatesPath, 'source', 'tests-CLAUDE.md.template');
      if (await fs.pathExists(testsTemplate)) {
        const testsContent = await fs.readFile(testsTemplate, 'utf8');
        const testFramework = await detectTestFramework();
        const processed = processTemplate(testsContent, {
          ...variables,
          TEST_FRAMEWORK: testFramework,
        });
        await fs.writeFile(testsClaudePath, processed);
        stats.claudeFilesUpdated++;
      }
    }
  }

  // 5. .claude/EMPLOYEE-DIRECTORY.md — SDK-managed, always overwrite
  const employeeDirTemplate = path.join(templatesPath, '.claude', 'EMPLOYEE-DIRECTORY.md.template');
  const employeeDirContent = await readAndProcessTemplate(employeeDirTemplate, variables);
  if (employeeDirContent) {
    await fs.ensureDir('.claude');
    await fs.writeFile('.claude/EMPLOYEE-DIRECTORY.md', employeeDirContent);
    stats.claudeFilesUpdated++;
  }

  spinner.succeed(`CLAUDE.md context files updated (${stats.claudeFilesUpdated} files)`);
}
