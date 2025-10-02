import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { detectStack } from '../utils/detect-stack.js';
import { processTemplate, extractVariables, formatMetrics } from '../utils/template-processor.js';
import { collectCodebaseMetrics } from '../utils/codebase-metrics.js';
import {
  getToolsForFramework,
  getRecommendedTools,
  getDependenciesForTools,
  getScriptsForTools,
  getPostInstallInstructions,
} from '../utils/linting-tools.js';
import { deployLintingTool } from '../utils/deploy-linting.js';
import { injectLintingDependencies } from '../utils/inject-dependencies.js';
import { deployCITemplates } from '../utils/deploy-ci.js';
import { injectTrinityMethodSection } from '../utils/inject-readme.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function deploy(options) {
  console.log(chalk.blue.bold('\n🔱 Trinity Method SDK - Deployment\n'));

  let spinner;
  let deploymentStats = {
    agents: 0,
    hooks: 0,
    templates: 0,
    directories: 0,
    files: 0
  };

  try {
    // STEP 1: Pre-flight checks
    spinner = ora('Running pre-flight checks...').start();

    const trinityExists = await fs.pathExists('trinity');
    if (trinityExists && !options.force) {
      spinner.fail();
      console.error(chalk.red('\n❌ Trinity Method already deployed'));
      console.error(chalk.yellow('   Found: trinity/ directory'));
      console.error(chalk.blue('   Use: trinity update or trinity deploy --force\n'));
      throw new Error('Trinity already deployed');
    }

    spinner.succeed('Pre-flight checks passed');

    // STEP 2: Detect technology stack
    spinner = ora('Detecting technology stack...').start();
    const stack = await detectStack(process.cwd());
    spinner.succeed(`Technology detected: ${stack.framework} (${stack.language})`);

    // STEP 3: Prompt for configuration
    let projectName = options.name || path.basename(process.cwd());
    let selectedLintingTools = [];
    let lintingDependencies = [];
    let lintingScripts = {};
    let postInstallInstructions = [];

    if (!options.yes) {
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

      // NEW: Linting setup prompts
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
        // Get recommended tools
        selectedLintingTools = getRecommendedTools(stack.framework, stack.language);

        // Show what will be configured
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


      // NEW: CI/CD setup prompt [WO#015]
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

        // Set flag for deployment phase
        options.ciDeploy = true;
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
        return;
      }

      // Store for deployment phase
      options.lintingTools = selectedLintingTools;
      options.lintingDependencies = lintingDependencies;
      options.lintingScripts = lintingScripts;
      options.postInstallInstructions = postInstallInstructions;
    }

    // STEP 3.5: Collect codebase metrics (unless --skip-audit) [WO#009]
    let metrics = {};
    if (!options.skipAudit) {
      spinner = ora('Analyzing codebase metrics...').start();

      try {
        metrics = await collectCodebaseMetrics(stack.sourceDir, stack.framework);

        spinner.succeed(chalk.green('Codebase analysis complete'));
        console.log(chalk.white(`   ${metrics.totalFiles} files analyzed`));
        console.log(chalk.white(`   ${metrics.todoCount} TODO/FIXME/HACK comments found`));
        console.log(chalk.white(`   ${metrics.filesOver500} files over 500 lines`));
        console.log(chalk.white(`   ${metrics.dependencyCount} dependencies detected`));
      } catch (error) {
        spinner.warn('Codebase analysis partial - some metrics unavailable');
        console.log(chalk.yellow(`   ${error.message}`));
      }
    } else {
      spinner = ora('Skipping codebase audit...').start();
      spinner.info('Using placeholder values - agent deployment recommended');
    }

    // STEP 4: Create complete Trinity directory structure
    spinner = ora('Creating Trinity Method structure...').start();

    // Trinity core directories
    await fs.ensureDir('trinity/knowledge-base');
    await fs.ensureDir('trinity/sessions');
    await fs.ensureDir('trinity/investigations');
    await fs.ensureDir('trinity/patterns');
    await fs.ensureDir('trinity/work-orders');
    await fs.ensureDir('trinity/templates');
    deploymentStats.directories += 6;

     // Claude Code directories
    await fs.ensureDir('.claude/agents/leadership');
    await fs.ensureDir('.claude/agents/deployment');
    await fs.ensureDir('.claude/agents/audit');
    await fs.ensureDir('.claude/hooks');
    await fs.ensureDir('trinity-hooks');
    deploymentStats.directories += 5;

    spinner.succeed('Trinity Method structure created');

    // Prepare template variables
    const templatesPath = path.join(__dirname, '../../../templates');
    const pkg = JSON.parse(readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
    const variables = {
      PROJECT_NAME: projectName,
      TECH_STACK: stack.language,
      FRAMEWORK: stack.framework,
      SOURCE_DIR: stack.sourceDir || 'src',
      TRINITY_VERSION: pkg.version || '1.0.0',
      DEPLOYMENT_TIMESTAMP: new Date().toISOString(),
      LANGUAGE: stack.language,
      TECHNOLOGY_STACK: stack.language,
      PRIMARY_FRAMEWORK: stack.framework,
      CURRENT_DATE: new Date().toISOString().split('T')[0],
      PROJECT_VAR_NAME: projectName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      TRINITY_HOME: process.env.TRINITY_HOME || 'C:/Users/lukaf/Desktop/Dev Work/trinity-method',
      ...formatMetrics(metrics), // Merge collected metrics [WO#009]
    };

    // STEP 5: Deploy knowledge base templates
    spinner = ora('Deploying knowledge base templates...').start();

    const kbTemplates = [
      'ARCHITECTURE.md',
      'Trinity.md',
      'To-do.md',
      'ISSUES.md',
      'Technical-Debt.md'
    ];

    for (const template of kbTemplates) {
      const templatePath = path.join(templatesPath, 'knowledge-base', `${template}.template`);

      if (await fs.pathExists(templatePath)) {
        const content = await fs.readFile(templatePath, 'utf8');
        const processed = processTemplate(content, variables);
        await fs.writeFile(`trinity/knowledge-base/${template}`, processed);
        deploymentStats.files++;
      }
    }

    spinner.succeed('Knowledge base templates deployed');

    // STEP 6: Deploy root files
    spinner = ora('Creating root files...').start();

    // TRINITY.md
    const trinityRootTemplate = path.join(templatesPath, 'root', 'TRINITY.md.template');
    if (await fs.pathExists(trinityRootTemplate)) {
      const content = await fs.readFile(trinityRootTemplate, 'utf8');
      const processed = processTemplate(content, variables);
      await fs.writeFile('TRINITY.md', processed);
      deploymentStats.files++;
    }

    // Root CLAUDE.md
    const claudeRootTemplate = path.join(templatesPath, 'root', 'CLAUDE.md.template');
    if (await fs.pathExists(claudeRootTemplate)) {
      const content = await fs.readFile(claudeRootTemplate, 'utf8');
      const processed = processTemplate(content, variables);
      await fs.writeFile('CLAUDE.md', processed);
      deploymentStats.files++;
    }

    // VERSION file
    await fs.writeFile('trinity/VERSION', pkg.version || '1.0.0');
    deploymentStats.files++;

    spinner.succeed('Root files created');

    // STEP 6.5: Deploy trinity/CLAUDE.md [WO#008]
    spinner = ora('Deploying Trinity CLAUDE.md...').start();

    const trinityCLAUDETemplate = path.join(templatesPath, 'trinity', 'CLAUDE.md.template');
    if (await fs.pathExists(trinityCLAUDETemplate)) {
      const content = await fs.readFile(trinityCLAUDETemplate, 'utf8');
      const processed = processTemplate(content, variables);
      await fs.writeFile('trinity/CLAUDE.md', processed);
      deploymentStats.files++;
      spinner.succeed('Trinity CLAUDE.md deployed');
    } else {
      spinner.warn('Trinity CLAUDE.md template not found');
    }

    // STEP 6.6: Deploy source directory CLAUDE.md [WO#008]
    spinner = ora(`Deploying ${stack.sourceDir}/CLAUDE.md...`).start();

    const frameworkMap = {
      'Node.js': 'nodejs-CLAUDE.md.template',
      'Flutter': 'flutter-CLAUDE.md.template',
      'React': 'react-CLAUDE.md.template',
      'Next.js': 'react-CLAUDE.md.template',
      'Python': 'python-CLAUDE.md.template',
      'Rust': 'rust-CLAUDE.md.template',
      'Unknown': 'base-CLAUDE.md.template'
    };

    const templateName = frameworkMap[stack.framework] || 'base-CLAUDE.md.template';
    let sourceCLAUDETemplate = path.join(templatesPath, 'source', templateName);

    if (!await fs.pathExists(sourceCLAUDETemplate)) {
      console.log(chalk.yellow(`   Note: Using base template for ${stack.framework}`));
      sourceCLAUDETemplate = path.join(templatesPath, 'source', 'base-CLAUDE.md.template');
    }

    if (await fs.pathExists(sourceCLAUDETemplate)) {
      const content = await fs.readFile(sourceCLAUDETemplate, 'utf8');
      const processed = processTemplate(content, variables);
      await fs.ensureDir(stack.sourceDir);
      await fs.writeFile(`${stack.sourceDir}/CLAUDE.md`, processed);
      deploymentStats.files++;
      spinner.succeed(`${stack.sourceDir}/CLAUDE.md deployed`);
    } else {
      spinner.warn(`Source CLAUDE.md template not found for ${stack.framework}`);
    }

    // STEP 7: Deploy agent configurations [WO#007]
    spinner = ora('Deploying Claude Code agents...').start();

    const agentDirs = [
      { dir: 'leadership', agents: ['aly-cto.md', 'aj-cc.md'] },
      { dir: 'deployment', agents: ['tan-structure.md', 'zen-knowledge.md', 'ino-context.md', 'ein-cicd.md'] },
      { dir: 'audit', agents: ['juno-auditor.md'] }
    ];

    for (const { dir, agents } of agentDirs) {
      for (const agent of agents) {
        const templatePath = path.join(templatesPath, 'agents', dir, `${agent}.template`);

        if (await fs.pathExists(templatePath)) {
          const content = await fs.readFile(templatePath, 'utf8');
          const processed = processTemplate(content, variables);
          await fs.writeFile(`.claude/agents/${dir}/${agent}`, processed);
          deploymentStats.agents++;
        }
      }
    }

    spinner.succeed(`Agents deployed (${deploymentStats.agents} agents)`);
    
    // STEP 8: Deploy hooks [WO#007]
    spinner = ora('Deploying hook scripts...').start();

    const hookScripts = [
      'session-end-archive.sh',
      'quality-gates.sh',
      'prevent-git.sh',
      'backup-knowledge.sh'
    ];

    for (const hook of hookScripts) {
      const templatePath = path.join(templatesPath, 'hooks', `${hook}.template`);

      if (await fs.pathExists(templatePath)) {
        const content = await fs.readFile(templatePath, 'utf8');
        const processed = processTemplate(content, variables);

        await fs.writeFile(path.join('.claude', 'hooks', hook), processed);
        await fs.writeFile(path.join('trinity-hooks', hook), processed);

        try {
          await fs.chmod(path.join('.claude', 'hooks', hook), 0o755);
          await fs.chmod(path.join('trinity-hooks', hook), 0o755);
        } catch (err) {
          // Windows may not support chmod
        }

        deploymentStats.hooks++;
      }
    }

    spinner.succeed(`Hook scripts deployed (${deploymentStats.hooks} scripts to 2 locations)`);

    // STEP 9: Deploy settings.json [WO#007]
    spinner = ora('Deploying Claude Code settings...').start();

    const settingsPath = path.join(templatesPath, 'claude', 'settings.json.template');

    if (await fs.pathExists(settingsPath)) {
      const content = await fs.readFile(settingsPath, 'utf8');
      const processed = processTemplate(content, variables);
      await fs.writeFile('.claude/settings.json', processed);
    } else {
      const defaultSettings = {
        hooks: {
          Stop: { "*": "bash trinity-hooks/session-end-archive.sh" },
          PreToolUse: {
            "Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh",
            "Bash(git push:*)": "bash trinity-hooks/prevent-git.sh",
            "Bash(git merge:*)": "bash trinity-hooks/prevent-git.sh"
          }
        }
      };
      await fs.writeJson('.claude/settings.json', defaultSettings, { spaces: 2 });
    }

    deploymentStats.files++;
    spinner.succeed('Claude Code settings configured');

    // STEP 9.5: Deploy Employee Directory [WO#009]
    spinner = ora('Deploying Employee Directory...').start();

    const employeeDirectoryTemplate = path.join(templatesPath, 'claude', 'EMPLOYEE-DIRECTORY.md.template');
    if (await fs.pathExists(employeeDirectoryTemplate)) {
      const content = await fs.readFile(employeeDirectoryTemplate, 'utf8');
      const processed = processTemplate(content, variables);
      await fs.writeFile('.claude/EMPLOYEE-DIRECTORY.md', processed);
      deploymentStats.files++;
      spinner.succeed('Employee Directory deployed');
    } else {
      spinner.warn('Employee Directory template not found');
    }

    // STEP 9.7: Deploy linting configuration (if selected) [WO#011]

    // STEP 9.6: Deploy slash commands [WO#021]
    spinner = ora('Deploying Trinity slash commands...').start();

    const commandsDir = '.claude/commands';
    await fs.ensureDir(commandsDir);

    const sharedCommands = path.join(__dirname, '..', '..', 'templates', 'shared', 'claude-commands');
    const commands = [
      'trinity-init.md',
      'trinity-verify.md',
      'trinity-docs.md',
      'trinity-start.md',
      'trinity-continue.md',
      'trinity-end.md',
      'trinity-workorder.md',
      'trinity-agents.md'
    ];

    for (const command of commands) {
      const src = path.join(sharedCommands, command);
      const dest = path.join(commandsDir, command);

      if (await fs.pathExists(src)) {
        await fs.copy(src, dest);
        deploymentStats.files++;
      }
    }

    spinner.succeed(`Slash commands deployed (${commands.length} commands)`);
    if (options.lintingTools && options.lintingTools.length > 0) {
      spinner = ora('Deploying linting configuration...').start();

      try {
        for (const tool of options.lintingTools) {
          await deployLintingTool(tool, stack, templatesPath, variables);
          deploymentStats.files++;
        }

        spinner.succeed(`Linting configuration deployed (${options.lintingTools.length} tools)`);
      } catch (error) {
        spinner.fail('Linting configuration deployment failed');
        console.error(chalk.yellow(`   Warning: ${error.message}`));
      }
    }

    // STEP 9.8: Inject linting dependencies (if any) [WO#011]
    if (options.lintingDependencies && options.lintingDependencies.length > 0) {
      spinner = ora('Adding linting dependencies to project...').start();

      try {
        await injectLintingDependencies(
          options.lintingDependencies,
          options.lintingScripts,
          stack.framework
        );
        spinner.succeed('Linting dependencies added to project configuration');
      } catch (error) {
        spinner.fail('Dependency injection failed');
        console.error(chalk.yellow(`   Warning: ${error.message}`));
      }
    }

    // STEP 10: Deploy work order templates [WO#007]
    spinner = ora('Deploying work order templates...').start();

    const woTemplates = [
      'INVESTIGATION-TEMPLATE.md',
      'IMPLEMENTATION-TEMPLATE.md',
      'ANALYSIS-TEMPLATE.md',
      'AUDIT-TEMPLATE.md',
      'PATTERN-TEMPLATE.md',
      'VERIFICATION-TEMPLATE.md'
    ];

    for (const template of woTemplates) {
      const templatePath = path.join(templatesPath, 'work-orders', template);

      if (await fs.pathExists(templatePath)) {
        const content = await fs.readFile(templatePath, 'utf8');
        const processed = processTemplate(content, variables);
        await fs.writeFile(`trinity/templates/${template}`, processed);
        deploymentStats.templates++;
      }
    }

    spinner.succeed(`Work order templates deployed (${deploymentStats.templates} templates)`);

    // STEP 11: Deploy CI/CD workflow templates (if --ci-deploy flag set) [WO#015]
    if (options.ciDeploy) {
      spinner = ora('Deploying CI/CD workflow templates...').start();

      try {
        const ciStats = await deployCITemplates(options);

        if (ciStats.deployed.length > 0) {
          spinner.succeed(`CI/CD templates deployed (${ciStats.deployed.length} files)`);
          ciStats.deployed.forEach(file => {
            console.log(chalk.white(`   ✓ ${file}`));
          });
        } else {
          spinner.info('No CI/CD templates deployed');
        }

        if (ciStats.skipped.length > 0) {
          console.log(chalk.yellow('   Skipped:'));
          ciStats.skipped.forEach(file => {
            console.log(chalk.yellow(`   - ${file}`));
          });
        }

        if (ciStats.errors.length > 0) {
          spinner.warn('Some CI/CD templates failed to deploy');
          ciStats.errors.forEach(err => {
            console.log(chalk.red(`   ✗ ${err.file || 'Error'}: ${err.error}`));
          });
        }

        deploymentStats.files += ciStats.deployed.length;
      } catch (error) {
        spinner.fail('CI/CD template deployment failed');
        console.error(chalk.yellow(`   Warning: ${error.message}`));
      }
    }



    // STEP 11.5: Update .gitignore to exclude Trinity files
    spinner = ora('Updating .gitignore...').start();

    try {
      const gitignorePath = '.gitignore';
      let gitignoreContent = '';

      // Read existing .gitignore if it exists
      if (await fs.pathExists(gitignorePath)) {
        gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
      }

      // Trinity files to ignore
      const trinityIgnores = [
        '',
        '# Trinity Method deployment files',
        '.claude/',
        'trinity/',
        'trinity-hooks/',
        'CLAUDE.md',
        'TRINITY.md'
      ];

      // Check if Trinity section already exists
      if (!gitignoreContent.includes('# Trinity Method deployment files')) {
        // Append Trinity ignores
        const newContent = gitignoreContent.trim() + '\n' + trinityIgnores.join('\n') + '\n';
        await fs.writeFile(gitignorePath, newContent);
        spinner.succeed('.gitignore updated with Trinity exclusions');
        deploymentStats.files++;
      } else {
        spinner.info('.gitignore already contains Trinity exclusions');
      }
    } catch (error) {
      spinner.warn('.gitignore update failed');
      console.error(chalk.yellow(`   Warning: ${error.message}`));
    }


    // STEP 12: Inject Trinity Method section into README.md [WO#017]
    spinner = ora('Injecting Trinity Method section into README.md...').start();

    try {
      const readmeResult = await injectTrinityMethodSection(variables);

      if (readmeResult.success) {
        if (readmeResult.injected) {
          spinner.succeed('Trinity Method section added to README.md');
          deploymentStats.files++;
        } else if (readmeResult.skipped) {
          spinner.info('Trinity Method section already exists in README.md');
        } else if (readmeResult.created === false) {
          spinner.info('README.md not found - skipping Trinity Method section');
        }
      } else {
        spinner.warn('README.md injection skipped');
        console.log(chalk.yellow(`   ${readmeResult.message}`));
      }
    } catch (error) {
      spinner.warn('README.md injection failed');
      console.error(chalk.yellow(`   Warning: ${error.message}`));
    }

    // SUCCESS: Display deployment summary
    console.log(chalk.green.bold('\n✅ Trinity Method deployed successfully!\n'));

    console.log(chalk.cyan('📊 Deployment Statistics:\n'));
    console.log(chalk.white(`   Directories Created: ${deploymentStats.directories}`));
    console.log(chalk.white(`   Agents Deployed: ${deploymentStats.agents} (7 agents)`));
    console.log(chalk.white(`   Hooks Deployed: ${deploymentStats.hooks}`));
    console.log(chalk.white(`   Templates Deployed: ${deploymentStats.templates} (6 work orders)`));
    console.log(chalk.white(`   Files Created: ${deploymentStats.files}`));
    console.log(chalk.white(`   CLAUDE.md Files: 3 (root + trinity + ${stack.sourceDir})`));

    const totalComponents = deploymentStats.directories + deploymentStats.agents +
                           (deploymentStats.hooks * 2) + deploymentStats.templates +
                           deploymentStats.files;
    console.log(chalk.white(`   Total Components: ${totalComponents}`));
    console.log('');

    // Display metrics summary if collected [WO#009]
    if (!options.skipAudit && metrics.totalFiles > 0) {
      console.log(chalk.cyan('🔍 Codebase Metrics:'));
      console.log(chalk.white(`   Files Analyzed: ${metrics.totalFiles}`));
      console.log(chalk.white(`   Technical Debt Items: ${metrics.todoCount}`));
      console.log(chalk.white(`   Large Files (>500 lines): ${metrics.filesOver500}`));
      console.log(chalk.white(`   Dependencies: ${metrics.dependencyCount}`));
      console.log(chalk.yellow('\n   Note: Advanced metrics require agent analysis'));
      console.log(chalk.blue('   Complete deployment with knowledge base agent:'));
      console.log(chalk.white('   /trinity-zen'));
      console.log(chalk.white('   (Completes ARCHITECTURE.md and Technical-Debt.md with semantic analysis)\n'));
    } else if (options.skipAudit) {
      console.log(chalk.yellow('⚠️  Audit skipped - documents contain placeholders'));
      console.log(chalk.blue('   Deploy agents to complete documentation\n'));
    }

    console.log(chalk.cyan('📚 Quick Start Commands:\n'));
    console.log(chalk.white('  /trinity-init      ') + chalk.gray('- Complete Trinity integration (run first!)'));
    console.log(chalk.white('  /trinity-verify    ') + chalk.gray('- Verify installation'));
    console.log(chalk.white('  /trinity-docs      ') + chalk.gray('- View documentation'));
    console.log(chalk.white('  /trinity-start     ') + chalk.gray('- Start a workflow'));
    console.log(chalk.white('  /trinity-continue  ') + chalk.gray('- Resume after interruption'));
    console.log(chalk.white('  /trinity-end       ') + chalk.gray('- End session & archive'));
    console.log(chalk.white('  /trinity-workorder ') + chalk.gray('- Create a work order'));
    console.log(chalk.white('  /trinity-agents    ') + chalk.gray('- View agent directory\n'));
    console.log(chalk.yellow('💡 Tip: ') + chalk.white('Run /trinity-init to complete integration, then /trinity-start to begin\n'));

    console.log(chalk.cyan('📚 Next Steps:\n'));

    let step = 1;

    // Linting dependencies installation [WO#011]
    if (options.lintingDependencies && options.lintingDependencies.length > 0) {
      console.log(chalk.white(`   ${step}. Install linting dependencies:`));

      if (stack.framework === 'Python') {
        console.log(chalk.yellow('      pip install -r requirements-dev.txt\n'));
      } else {
        console.log(chalk.yellow('      npm install\n'));
      }
      step++;
    }

    // Pre-commit hooks setup [WO#011]
    if (options.postInstallInstructions && options.postInstallInstructions.length > 0) {
      console.log(chalk.white(`   ${step}. Setup pre-commit hooks (one-time):`));
      options.postInstallInstructions.forEach((instruction) => {
        console.log(chalk.yellow(`      ${instruction.command}`));
      });
      console.log('');
      step++;
    }

    // Standard next steps
    console.log(chalk.white(`   ${step}. Review trinity/knowledge-base/ARCHITECTURE.md`));
    console.log(chalk.white(`   ${step + 1}. Update trinity/knowledge-base/To-do.md`));
    console.log(chalk.white(`   ${step + 2}. Open Claude Code and start your first Trinity session`));
    console.log(chalk.white(`   ${step + 3}. Agents will be automatically invoked as needed\n`));


    // Test linting command (if applicable) [WO#011]
    if (options.lintingScripts && Object.keys(options.lintingScripts).length > 0) {
      console.log(chalk.cyan('🧪 Test Linting:\n'));
      console.log(chalk.white('   After installing dependencies, try:'));
      Object.keys(options.lintingScripts).forEach((scriptName) => {
        console.log(chalk.yellow(`      npm run ${scriptName}`));
      });
      console.log('');
    }

  } catch (error) {
    if (spinner) spinner.fail();
    console.error(chalk.red('\n❌ Deployment failed:'), error.message);
    throw error;
  }
}
