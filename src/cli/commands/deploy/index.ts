/**
 * Deploy Command - Complete Trinity Method SDK deployment to user projects
 *
 * @see docs/workflows/deploy-workflow.md - Complete deployment process
 * @see docs/deployment/best-practices.md - Deployment best practices
 *
 * **Trinity Principle:** "Systematic Quality Assurance"
 * Deploys complete Trinity Method infrastructure with interactive wizard: creates folder structure,
 * deploys 18 agent templates, installs slash commands, configures quality tools (ESLint, Prettier),
 * and sets up CI/CD templates. Ensures every Trinity project starts with proven, consistent foundation.
 *
 * **Why This Exists:**
 * Manual setup is error-prone and inconsistent. Developers forget folders, skip quality tools, or
 * misconfigure agents. This command orchestrates TAN (structure), ZEN (documentation), INO (context),
 * and EIN (CI/CD) to deploy battle-tested Trinity infrastructure in minutes. Every project gets same
 * high-quality foundation: 19 agents, 20 commands, quality gates, and documentation architecture.
 *
 * @example
 * ```bash
 * # Interactive deployment
 * npx trinity deploy
 *
 * # Non-interactive with defaults
 * npx trinity deploy --yes
 *
 * # Force redeployment
 * npx trinity deploy --force
 * ```
 *
 * @module cli/commands/deploy
 */

import ora from 'ora';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';
import { detectStack } from '../../utils/detect-stack.js';
import { checkPreFlight } from './pre-flight.js';
import { promptConfiguration } from './configuration.js';
import { collectMetrics } from './metrics.js';
import { createDirectories } from './directories.js';
import { deployKnowledgeBase } from './knowledge-base.js';
import { deployRootFiles } from './root-files.js';
import { deployAgents } from './agents.js';
import { deployClaudeSetup } from './claude-setup.js';
import { deployLinting } from './linting.js';
import { deployTemplates } from './templates.js';
import { deployCICD } from './ci-cd.js';
import { updateGitignore } from './gitignore.js';
import { installSDK } from './sdk-install.js';
import { displaySummary } from './summary.js';
import type { DeployOptions, DeploymentProgress, CodebaseMetrics } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Deploy Trinity Method SDK to project
 * @param options - Deployment options
 */
export async function deploy(options: DeployOptions): Promise<void> {
  console.log(chalk.blue.bold('\n🔱 Trinity Method SDK - Deployment\n'));

  const spinner = ora();
  const progress: DeploymentProgress = {
    agentsDeployed: 0,
    commandsDeployed: 0,
    knowledgeBaseFiles: 0,
    templatesDeployed: 0,
    rootFilesDeployed: 0,
  };

  try {
    // STEP 1: Pre-flight checks
    await checkPreFlight(options, spinner);

    // STEP 2: Detect technology stack
    spinner.start('Detecting project technology stack...');
    const stack = await detectStack();
    spinner.succeed(
      `Detected: ${stack.framework} (${stack.language}) - Source: ${stack.sourceDir}`
    );

    // STEP 3: Interactive configuration (or use defaults with --yes)
    const config = await promptConfiguration(options, stack);

    // STEP 3.5: Collect codebase metrics
    let metrics: CodebaseMetrics;
    if (!options.skipAudit) {
      metrics = await collectMetrics(stack, spinner);
    } else {
      const { createEmptyMetrics } = await import('../../utils/metrics/index.js');
      metrics = createEmptyMetrics();
    }

    // Prepare template variables
    // Note: In dist/, this file is at dist/cli/commands/deploy/index.js
    // Templates are copied to dist/templates, so we go up 3 levels from deploy/
    const templatesPath = path.join(__dirname, '../../../templates');
    const pkgPath = path.join(__dirname, '../../../../package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

    const variables = {
      PROJECT_NAME: config.projectName || 'My Project',
      FRAMEWORK: stack.framework,
      LANGUAGE: stack.language,
      SOURCE_DIR: stack.sourceDir,
      PACKAGE_MANAGER: stack.packageManager || 'npm',
      BACKEND_FRAMEWORK: stack.framework,
      CURRENT_DATE: new Date().toISOString(),
      TRINITY_VERSION: pkg.version || '2.0.1',
    };

    // STEP 4: Create directory structure
    const directoriesCreated = await createDirectories(spinner);
    progress.directories = directoriesCreated;

    // STEP 5: Deploy knowledge base templates
    const kbFiles = await deployKnowledgeBase(templatesPath, variables, stack, metrics, spinner);
    progress.knowledgeBaseFiles = kbFiles;
    progress.rootFilesDeployed += kbFiles;

    // STEP 6: Deploy root files and CLAUDE.md hierarchy
    const rootFiles = await deployRootFiles(templatesPath, variables, stack, pkg.version, spinner);
    progress.rootFilesDeployed += rootFiles;

    // STEP 7: Deploy agent configurations
    const agentsDeployed = await deployAgents(templatesPath, variables, spinner);
    progress.agentsDeployed = agentsDeployed;

    // STEP 9: Deploy Claude Code setup (settings, employee directory, commands)
    const claudeSetup = await deployClaudeSetup(templatesPath, variables, spinner);
    progress.commandsDeployed = claudeSetup.commandsDeployed;
    progress.rootFilesDeployed += claudeSetup.filesDeployed;

    // STEP 9.7-9.8: Deploy linting configuration (if selected)
    if (config.lintingTools && config.lintingTools.length > 0) {
      const lintingFiles = await deployLinting(
        config.lintingTools,
        config.lintingDependencies || [],
        config.lintingScripts || {},
        stack,
        templatesPath,
        variables,
        spinner
      );
      progress.rootFilesDeployed += lintingFiles;
    }

    // STEP 10: Deploy templates (work orders, investigations, documentation)
    const templatesDeployed = await deployTemplates(templatesPath, variables, spinner);
    progress.templatesDeployed = templatesDeployed;

    // STEP 11: Deploy CI/CD workflow templates (if enabled)
    const cicdFiles = await deployCICD(options, spinner);
    progress.rootFilesDeployed += cicdFiles;

    // STEP 11.5: Update .gitignore
    const gitignoreUpdated = await updateGitignore(spinner);
    if (gitignoreUpdated) {
      progress.rootFilesDeployed++;
    }

    // STEP 12: Install Trinity Method SDK
    const sdkInstalled = await installSDK(spinner);
    if (sdkInstalled) {
      progress.rootFilesDeployed++;
    }

    // SUCCESS: Display deployment summary
    await displaySummary(progress, options, stack, metrics);
  } catch (error: unknown) {
    if (spinner) spinner.fail();
    const { displayError, getErrorMessage } = await import('../../utils/errors.js');
    const message = getErrorMessage(error);
    displayError(`Deployment failed: ${message}`);
    if (message === 'Deployment cancelled by user') {
      return;
    }
    throw error;
  }
}
