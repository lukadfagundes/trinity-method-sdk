/**
 * Template deployment (work orders, investigations, documentation)
 */

import fs from 'fs-extra';
import path from 'path';
import { processTemplate } from '../../utils/template-processor.js';
import { validatePath } from '../../utils/validate-path.js';
import type { Spinner } from './types.js';

/**
 * Deploy work order, investigation, and documentation templates
 *
 * @param templatesPath - Path to templates directory
 * @param variables - Template variables for substitution
 * @param spinner - Spinner instance for status updates
 * @returns Number of templates deployed
 */
export async function deployTemplates(
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<number> {
  let templatesDeployed = 0;

  // Deploy work order templates
  spinner.start('Deploying work order templates...');

  const woTemplates = [
    'INVESTIGATION-TEMPLATE.md.template',
    'IMPLEMENTATION-TEMPLATE.md.template',
    'ANALYSIS-TEMPLATE.md.template',
    'AUDIT-TEMPLATE.md.template',
    'PATTERN-TEMPLATE.md.template',
    'VERIFICATION-TEMPLATE.md.template',
  ];

  await fs.ensureDir('trinity/templates/work-orders');

  for (const template of woTemplates) {
    const templatePath = path.join(templatesPath, 'trinity/templates/work-orders', template);

    if (await fs.pathExists(templatePath)) {
      const content = await fs.readFile(templatePath, 'utf8');
      const processed = processTemplate(content, variables);
      const deployedName = template.replace('.template', '');

      // Validate destination path for security
      const destPath = validatePath(`trinity/templates/work-orders/${deployedName}`);
      await fs.writeFile(destPath, processed);
      templatesDeployed++;
    }
  }

  spinner.succeed(`Work order templates deployed (${woTemplates.length} templates)`);

  // Deploy investigation templates
  spinner.start('Deploying investigation templates...');

  const investigationTemplates = [
    'bug.md.template',
    'feature.md.template',
    'performance.md.template',
    'security.md.template',
    'technical.md.template',
  ];

  await fs.ensureDir('trinity/templates/investigations');

  for (const template of investigationTemplates) {
    const templatePath = path.join(templatesPath, 'trinity/templates/investigations', template);

    if (await fs.pathExists(templatePath)) {
      const content = await fs.readFile(templatePath, 'utf8');
      const processed = processTemplate(content, variables);
      const deployedName = template.replace('.template', '');

      // Validate destination path for security
      const destPath = validatePath(`trinity/templates/investigations/${deployedName}`);
      await fs.writeFile(destPath, processed);
      templatesDeployed++;
    }
  }

  spinner.succeed(`Investigation templates deployed (${investigationTemplates.length} templates)`);

  // Deploy documentation templates (all 28 templates including subdirectories)
  spinner.start('Deploying documentation templates...');

  const docSourcePath = path.join(templatesPath, 'trinity/templates/documentation');
  const docDestPath = 'trinity/templates/documentation';

  await fs.ensureDir(docDestPath);

  // Recursively copy all documentation templates, removing .template extension
  async function copyDocTemplates(sourcePath: string, destPath: string): Promise<void> {
    const items = await fs.readdir(sourcePath);

    for (const item of items) {
      const sourceItemPath = path.join(sourcePath, item);
      const stat = await fs.stat(sourceItemPath);

      if (stat.isDirectory()) {
        // Create subdirectory and recurse
        const destSubDir = path.join(destPath, item);
        await fs.ensureDir(destSubDir);
        await copyDocTemplates(sourceItemPath, destSubDir);
      } else if (item.endsWith('.md.template')) {
        // Process template file and remove .template extension
        const content = await fs.readFile(sourceItemPath, 'utf8');
        const processed = processTemplate(content, variables);
        const deployedName = item.replace('.template', '');
        const destFilePath = validatePath(path.join(destPath, deployedName));
        await fs.writeFile(destFilePath, processed);
        templatesDeployed++;
      }
    }
  }

  await copyDocTemplates(docSourcePath, docDestPath);

  spinner.succeed(`Documentation templates deployed (${templatesDeployed - 11} templates)`);

  return templatesDeployed;
}
