/**
 * Deployment summary display
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import type { DeployOptions, Stack, CodebaseMetrics, DeploymentProgress, PostInstallInstruction } from './types.js';

/**
 * Display deployment summary with statistics and next steps
 *
 * @param stats - Deployment progress statistics
 * @param options - Deploy command options
 * @param stack - Detected technology stack
 * @param metrics - Collected codebase metrics
 */
export async function displaySummary(
  stats: DeploymentProgress,
  options: DeployOptions,
  stack: Stack,
  metrics: CodebaseMetrics
): Promise<void> {
  console.log(chalk.green.bold('\n✅ Trinity Method deployed successfully!\n'));

  console.log(chalk.cyan('📊 Deployment Statistics (v2.0):\n'));
  console.log(chalk.white(`   Directories Created: ${stats.directories || 17}`));
  console.log(
    chalk.white(
      `   Agents Deployed: ${stats.agentsDeployed} (v2.0: 2 leadership + 4 planning + 7 execution + 4 deployment + 1 audit)`
    )
  );
  console.log(chalk.white(`   Best Practices: 4 documents (CODING, TESTING, AI-DEV, DOCS)`));
  console.log(
    chalk.white(`   Templates Deployed: ${stats.templatesDeployed} (6 work orders)`)
  );
  console.log(chalk.white(`   Files Created: ${stats.rootFilesDeployed}`));

  // Display CLAUDE.md deployment summary
  const hasTests = await fs.pathExists('tests/CLAUDE.md');
  const claudeMdCount = 2 + stack.sourceDirs.length + (hasTests ? 1 : 0);
  const sourceDirsList =
    stack.sourceDirs.length > 3
      ? `${stack.sourceDirs.slice(0, 3).join(', ')}... (${stack.sourceDirs.length} total)`
      : stack.sourceDirs.join(', ');
  const claudeMdSummary = hasTests
    ? `root + trinity + tests + ${sourceDirsList}`
    : `root + trinity + ${sourceDirsList}`;
  console.log(chalk.white(`   CLAUDE.md Files: ${claudeMdCount} (${claudeMdSummary})`));

  const totalComponents =
    (stats.directories || 17) +
    stats.agentsDeployed +
    stats.templatesDeployed +
    stats.rootFilesDeployed;
  console.log(chalk.white(`   Total Components: ${totalComponents}`));
  console.log('');

  // Display metrics summary if collected
  if (!options.skipAudit && metrics.totalFiles > 0) {
    console.log(chalk.cyan('🔍 Codebase Metrics:'));
    console.log(chalk.white(`   Files Analyzed: ${metrics.totalFiles}`));
    console.log(chalk.white(`   Technical Debt Items: ${metrics.todoCount}`));
    console.log(chalk.white(`   Large Files (>500 lines): ${metrics.filesOver500}`));
    console.log(chalk.white(`   Dependencies: ${metrics.dependencyCount}`));
    console.log(chalk.yellow('\n   Note: Advanced metrics require agent analysis'));
    console.log(chalk.blue('   Complete deployment with knowledge base agent:'));
    console.log(chalk.white('   /trinity-zen'));
    console.log(
      chalk.white('   (Completes ARCHITECTURE.md and Technical-Debt.md with semantic analysis)\n')
    );
  } else if (options.skipAudit) {
    console.log(chalk.yellow('⚠️  Audit skipped - documents contain placeholders'));
    console.log(chalk.blue('   Deploy agents to complete documentation\n'));
  }

  console.log(chalk.cyan('📚 Quick Start Commands:\n'));
  console.log(
    chalk.white('  /trinity-init         ') +
      chalk.gray('- Complete Trinity integration (run first!)')
  );
  console.log(chalk.white('  /trinity-verify       ') + chalk.gray('- Verify installation'));
  console.log(chalk.white('  /trinity-start        ') + chalk.gray('- Start a workflow'));
  console.log(chalk.white('\n  🤖 v2.0 AI Orchestration:'));
  console.log(
    chalk.white('  /trinity-orchestrate  ') +
      chalk.gray('- AI-orchestrated implementation (AJ MAESTRO)')
  );
  console.log(
    chalk.white('  /trinity-requirements ') + chalk.gray('- Analyze requirements (MON)')
  );
  console.log(
    chalk.white('  /trinity-design       ') + chalk.gray('- Create technical design (ROR)')
  );
  console.log(
    chalk.white('  /trinity-plan         ') + chalk.gray('- Plan implementation (TRA)')
  );
  console.log(
    chalk.white('  /trinity-decompose    ') +
      chalk.gray('- Decompose into atomic tasks (EUS)')
  );
  console.log(chalk.white('\n  📋 Legacy Commands:'));
  console.log(chalk.white('  /trinity-workorder    ') + chalk.gray('- Create a work order'));
  console.log(chalk.white('  /trinity-agents       ') + chalk.gray('- View agent directory'));
  console.log(
    chalk.white('  /trinity-continue     ') + chalk.gray('- Resume after interruption')
  );
  console.log(chalk.white('  /trinity-end          ') + chalk.gray('- End session & archive\n'));
  console.log(
    chalk.yellow('💡 Tip: ') +
      chalk.white('Run /trinity-init, then use /trinity-orchestrate for AI-powered implementation\n')
  );

  console.log(chalk.cyan('📚 Next Steps:\n'));

  let step = 1;

  // Linting dependencies installation
  if (options.lintingDependencies && options.lintingDependencies.length > 0) {
    console.log(chalk.white(`   ${step}. Install linting dependencies:`));

    if (stack.framework === 'Python') {
      console.log(chalk.yellow('      pip install -r requirements-dev.txt\n'));
    } else {
      console.log(chalk.yellow('      npm install\n'));
    }
    step++;
  }

  // Pre-commit hooks setup
  if (options.postInstallInstructions && options.postInstallInstructions.length > 0) {
    console.log(chalk.white(`   ${step}. Setup pre-commit hooks (one-time):`));
    options.postInstallInstructions.forEach((instruction: PostInstallInstruction) => {
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

  // Test linting command (if applicable)
  if (options.lintingScripts && Object.keys(options.lintingScripts).length > 0) {
    console.log(chalk.cyan('🧪 Test Linting:\n'));
    console.log(chalk.white('   After installing dependencies, try:'));
    Object.keys(options.lintingScripts).forEach((scriptName) => {
      console.log(chalk.yellow(`      npm run ${scriptName}`));
    });
    console.log('');
  }
}
