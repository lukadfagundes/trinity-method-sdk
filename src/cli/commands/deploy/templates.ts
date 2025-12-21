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
    const templatePath = path.join(templatesPath, 'work-orders', template);

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
    const templatePath = path.join(templatesPath, 'investigations', template);

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

  // Deploy documentation templates
  spinner.start('Deploying documentation templates...');

  const documentationTemplates = ['ROOT-README.md.template', 'SUBDIRECTORY-README.md.template'];

  await fs.ensureDir('trinity/templates/documentation');

  for (const template of documentationTemplates) {
    const templatePath = path.join(templatesPath, 'documentation', template);

    if (await fs.pathExists(templatePath)) {
      const content = await fs.readFile(templatePath, 'utf8');
      const processed = processTemplate(content, variables);
      const deployedName = template.replace('.template', '');

      // Validate destination path for security
      const destPath = validatePath(`trinity/templates/documentation/${deployedName}`);
      await fs.writeFile(destPath, processed);
      templatesDeployed++;
    }
  }

  spinner.succeed(`Documentation templates deployed (${documentationTemplates.length} templates)`);

  return templatesDeployed;
}
