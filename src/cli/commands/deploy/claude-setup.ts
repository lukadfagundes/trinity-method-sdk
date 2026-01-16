/**
 * Claude Code setup (settings, employee directory, commands)
 */

import fs from 'fs-extra';
import path from 'path';
import { processTemplate } from '../../utils/template-processor.js';
import { validatePath } from '../../utils/validate-path.js';
import type { Spinner } from './types.js';

/**
 * Deploy Claude Code configuration files
 *
 * @param templatesPath - Path to templates directory
 * @param variables - Template variables for substitution
 * @param spinner - Spinner instance for status updates
 * @returns Object with filesDeployed and commandsDeployed counts
 */
export async function deployClaudeSetup(
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<{ filesDeployed: number; commandsDeployed: number }> {
  let filesDeployed = 0;
  let commandsDeployed = 0;

  // Deploy settings.json (empty - users can configure manually)
  spinner.start('Creating Claude Code settings...');

  const settingsPath = '.claude/settings.json';
  if (!(await fs.pathExists(settingsPath))) {
    await fs.writeJson(settingsPath, {}, { spaces: 2 });
    filesDeployed++;
  }

  spinner.succeed('Claude Code settings created (empty - customize as needed)');

  // Deploy Employee Directory
  spinner.start('Deploying Employee Directory...');

  const employeeDirectoryTemplate = path.join(
    templatesPath,
    '.claude',
    'EMPLOYEE-DIRECTORY.md.template'
  );
  if (await fs.pathExists(employeeDirectoryTemplate)) {
    const content = await fs.readFile(employeeDirectoryTemplate, 'utf8');
    const processed = processTemplate(content, variables);

    // Validate destination path for security
    const destPath = validatePath('.claude/EMPLOYEE-DIRECTORY.md');
    await fs.writeFile(destPath, processed);
    filesDeployed++;
    spinner.succeed('Employee Directory deployed');
  } else {
    spinner.warn('Employee Directory template not found');
  }

  // Deploy slash commands (categorized)
  spinner.start('Deploying Trinity slash commands...');

  const commandsDir = '.claude/commands';

  // Create categorized subdirectories
  await fs.ensureDir(`${commandsDir}/session`);
  await fs.ensureDir(`${commandsDir}/planning`);
  await fs.ensureDir(`${commandsDir}/execution`);
  await fs.ensureDir(`${commandsDir}/investigation`);
  await fs.ensureDir(`${commandsDir}/infrastructure`);
  await fs.ensureDir(`${commandsDir}/utility`);

  // Commands are now organized by category in source templates
  const commandsTemplatePath = path.join(templatesPath, '.claude/commands');
  const categories = [
    'session',
    'planning',
    'execution',
    'investigation',
    'infrastructure',
    'utility',
  ];

  for (const category of categories) {
    const categoryPath = path.join(commandsTemplatePath, category);

    if (await fs.pathExists(categoryPath)) {
      const commandFiles = await fs.readdir(categoryPath);

      for (const file of commandFiles) {
        if (file.endsWith('.md.template')) {
          const sourcePath = path.join(categoryPath, file);
          // Remove .template extension for deployed files
          const deployedName = file.replace('.template', '');
          const destPath = path.join(commandsDir, category, deployedName);
          await fs.copy(sourcePath, destPath);
          commandsDeployed++;
          filesDeployed++;
        }
      }
    }
  }

  spinner.succeed(`Deployed ${commandsDeployed} Trinity slash commands (6 categories)`);

  return { filesDeployed, commandsDeployed };
}
