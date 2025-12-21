/**
 * Update Summary Module
 * Displays update completion summary
 * @module cli/commands/update/summary
 */

import chalk from 'chalk';
import { UpdateStats } from './types.js';

/**
 * Display update summary with statistics
 * @param stats - Update statistics
 * @param oldVersion - Version before update
 * @param newVersion - Version after update
 */
export function displayUpdateSummary(
  stats: UpdateStats,
  oldVersion: string,
  newVersion: string
): void {
  console.log('');
  console.log(chalk.green.bold('✅ Trinity Method updated successfully!\n'));

  console.log(chalk.cyan('📊 Update Statistics:\n'));
  console.log(chalk.white(`   Agents Updated: ${stats.agentsUpdated}`));
  console.log(chalk.white(`   Commands Updated: ${stats.commandsUpdated}`));
  console.log(chalk.white(`   Templates Updated: ${stats.templatesUpdated}`));
  console.log(chalk.white(`   Knowledge Base Updated: ${stats.knowledgeBaseUpdated}`));
  console.log(
    chalk.white(
      `   Total Files Updated: ${stats.agentsUpdated + stats.commandsUpdated + stats.templatesUpdated + stats.knowledgeBaseUpdated}`
    )
  );
  console.log('');
  console.log(chalk.gray(`   Version: ${oldVersion} → ${newVersion}\n`));
}

/**
 * Display dry-run preview of update changes
 * @param oldVersion - Current version
 * @param newVersion - Target version
 */
export function displayDryRunPreview(oldVersion: string, newVersion: string): void {
  console.log(chalk.yellow('🔍 DRY RUN - Preview of changes:\n'));
  console.log(chalk.white('   Would update:'));
  console.log(chalk.gray(`   • 18 agent files in .claude/agents/`));
  console.log(chalk.gray(`   • 16 slash commands in .claude/commands/`));
  console.log(chalk.gray(`   • 6 work order templates in trinity/templates/`));
  console.log(chalk.gray(`   • Knowledge base files (Trinity.md, CODING-PRINCIPLES.md, etc.)`));
  console.log(chalk.gray(`   • Version file: ${oldVersion} → ${newVersion}`));
  console.log('');
  console.log(chalk.white('   Would preserve:'));
  console.log(chalk.gray(`   • trinity/knowledge-base/ARCHITECTURE.md`));
  console.log(chalk.gray(`   • trinity/knowledge-base/To-do.md`));
  console.log(chalk.gray(`   • trinity/knowledge-base/ISSUES.md`));
  console.log(chalk.gray(`   • trinity/knowledge-base/Technical-Debt.md`));
  console.log('');
  console.log(chalk.blue('💡 Run without --dry-run to perform update\n'));
}
