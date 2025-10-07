import chalk from 'chalk';
import fs from 'fs-extra';

export async function status(): Promise<void> {
  console.log(chalk.blue.bold('\n📊 Trinity Method Status\n'));

  // Check deployment
  const trinityExists = await fs.pathExists('trinity');
  console.log(`Deployed: ${trinityExists ? chalk.green('✅ Yes') : chalk.red('❌ No')}`);

  if (!trinityExists) {
    console.log();
    console.log(chalk.yellow('Trinity Method not deployed in this project'));
    console.log(chalk.blue('Run: trinity deploy\n'));
    return;
  }

  // Read version
  let version = 'Unknown';
  if (await fs.pathExists('trinity/VERSION')) {
    version = (await fs.readFile('trinity/VERSION', 'utf8')).trim();
  }
  console.log(`Version: ${chalk.cyan(version)}`);

  // Detect agent
  let agent = 'Unknown';
  if (await fs.pathExists('.claude/agents')) {
    agent = 'Claude Code';
  } else if (await fs.pathExists('.cursorrules')) {
    agent = 'Cursor';
  } else {
    agent = 'Universal';
  }
  console.log(`Agent: ${chalk.cyan(agent)}`);

  // Structure validation
  const requiredDirs = [
    'trinity/knowledge-base',
    'trinity/investigations',
    'trinity/work-orders',
    'trinity/patterns',
    'trinity/sessions',
    'trinity/templates'
  ];

  let structureValid = true;
  for (const dir of requiredDirs) {
    if (!await fs.pathExists(dir)) {
      structureValid = false;
      break;
    }
  }

  console.log(`Structure: ${structureValid ? chalk.green('✅ Valid') : chalk.red('❌ Invalid')}`);

  // File counts
  try {
    const kbFiles = await fs.readdir('trinity/knowledge-base');
    const templates = await fs.readdir('trinity/templates');
    const investigations = await fs.readdir('trinity/investigations');
    const patterns = await fs.readdir('trinity/patterns');

    console.log(`Files: ${kbFiles.length} docs, ${templates.length} templates, ${investigations.length} investigations`);
  } catch (error) {
    console.log(chalk.yellow('Files: Unable to count'));
  }

  // Health check
  const health = trinityExists && structureValid ? chalk.green('✅ All checks passed') : chalk.yellow('⚠️  Issues detected');
  console.log(`Health: ${health}`);
  console.log();
}
