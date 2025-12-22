/**
 * Knowledge base template deployment
 */

import fs from 'fs-extra';
import path from 'path';
import { processTemplate } from '../../utils/template-processor.js';
import { validatePath } from '../../utils/validate-path.js';
import type { Stack, CodebaseMetrics, Spinner } from './types.js';

/**
 * Deploy and enrich knowledge base templates
 *
 * @param templatesPath - Path to templates directory
 * @param variables - Template variables for substitution
 * @param stack - Detected technology stack
 * @param metrics - Collected codebase metrics
 * @param spinner - Spinner instance for status updates
 * @returns Number of files deployed
 */
export async function deployKnowledgeBase(
  templatesPath: string,
  variables: Record<string, string>,
  stack: Stack,
  metrics: CodebaseMetrics,
  spinner: Spinner
): Promise<number> {
  spinner.start('Deploying knowledge base templates...');

  let filesDeployed = 0;

  const kbTemplates = [
    'ARCHITECTURE.md',
    'Trinity.md',
    'To-do.md',
    'ISSUES.md',
    'Technical-Debt.md',
    'CODING-PRINCIPLES.md',
    'TESTING-PRINCIPLES.md',
    'AI-DEVELOPMENT-GUIDE.md',
    'DOCUMENTATION-CRITERIA.md',
  ];

  for (const template of kbTemplates) {
    const templatePath = path.join(templatesPath, 'knowledge-base', `${template}.template`);

    if (await fs.pathExists(templatePath)) {
      const content = await fs.readFile(templatePath, 'utf8');
      const processed = processTemplate(content, variables);

      // Validate destination path for security
      const destPath = validatePath(`trinity/knowledge-base/${template}`);
      await fs.writeFile(destPath, processed);
      filesDeployed++;
    }
  }

  spinner.succeed('Knowledge base templates deployed');

  // Enrich knowledge base with project metrics
  try {
    spinner.start('Enriching knowledge base with project metrics...');

    const archPath = 'trinity/knowledge-base/ARCHITECTURE.md';
    if (await fs.pathExists(archPath)) {
      let archContent = await fs.readFile(archPath, 'utf8');

      // Replace common placeholders with actual data
      archContent = archContent
        .replace(/\{\{PROJECT_NAME\}\}/g, variables.PROJECT_NAME)
        .replace(/\{\{FRAMEWORK\}\}/g, stack.framework)
        .replace(/\{\{LANGUAGE\}\}/g, stack.language)
        .replace(/\{\{SOURCE_DIR\}\}/g, stack.sourceDir)
        .replace(/\{\{PACKAGE_MANAGER\}\}/g, stack.packageManager || 'npm')
        .replace(/\{\{BACKEND_FRAMEWORK\}\}/g, stack.framework)
        .replace(/\{\{TODO_COUNT\}\}/g, String(metrics?.todoCount || 0))
        .replace(/\{\{FILE_COUNT\}\}/g, String(metrics?.totalFiles || 0))
        .replace(/\{\{DEPENDENCY_COUNT\}\}/g, String(metrics?.dependencyCount || 0));

      // Validate path for security
      const validatedArchPath = validatePath(archPath);
      await fs.writeFile(validatedArchPath, archContent);

      spinner.succeed('Knowledge base enriched with project data');
    } else {
      spinner.info('ARCHITECTURE.md not found - skipping enrichment');
    }
  } catch {
    spinner.warn('Knowledge base enrichment skipped');
  }

  return filesDeployed;
}
