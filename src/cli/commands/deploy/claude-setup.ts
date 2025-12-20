/**
 * Claude Code setup (settings, employee directory, commands)
 */

import fs from 'fs-extra';
import path from 'path';
import { processTemplate } from '../../utils/template-processor.js';
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
    'claude',
    'EMPLOYEE-DIRECTORY.md.template'
  );
  if (await fs.pathExists(employeeDirectoryTemplate)) {
    const content = await fs.readFile(employeeDirectoryTemplate, 'utf8');
    const processed = processTemplate(content, variables);
    await fs.writeFile('.claude/EMPLOYEE-DIRECTORY.md', processed);
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

  // Command categorization map
  const commandCategories: Record<string, string> = {
    'trinity-start.md.template': 'session',
    'trinity-continue.md.template': 'session',
    'trinity-end.md.template': 'session',
    'trinity-requirements.md.template': 'planning',
    'trinity-design.md.template': 'planning',
    'trinity-decompose.md.template': 'planning',
    'trinity-plan.md.template': 'planning',
    'trinity-orchestrate.md.template': 'execution',
    'trinity-audit.md.template': 'execution',
    'trinity-docs.md.template': 'execution',
    'trinity-create-investigation.md.template': 'investigation',
    'trinity-plan-investigation.md.template': 'investigation',
    'trinity-investigate-templates.md.template': 'investigation',
    'trinity-init.md.template': 'infrastructure',
    'trinity-agents.md.template': 'utility',
    'trinity-verify.md.template': 'utility',
    'trinity-workorder.md.template': 'utility',
  };

  const commandsTemplatePath = path.join(templatesPath, 'shared/claude-commands');
  const commandFiles = await fs.readdir(commandsTemplatePath);

  for (const file of commandFiles) {
    if (file.endsWith('.md.template') && commandCategories[file]) {
      const sourcePath = path.join(commandsTemplatePath, file);
      const category = commandCategories[file];
      // Remove .template extension for deployed files
      const deployedName = file.replace('.template', '');
      const destPath = path.join(commandsDir, category, deployedName);
      await fs.copy(sourcePath, destPath);
      commandsDeployed++;
      filesDeployed++;
    }
  }

  spinner.succeed(`Deployed ${commandsDeployed} Trinity slash commands (6 categories)`);

  return { filesDeployed, commandsDeployed };
}
