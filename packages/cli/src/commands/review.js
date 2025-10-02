import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

export async function review(options) {
  console.log(chalk.blue.bold('\n🔍 Trinity Method Session Review\n'));

  // Check sessions directory
  const sessionsDir = 'trinity/sessions';
  if (!await fs.pathExists(sessionsDir)) {
    console.log(chalk.yellow('No sessions found'));
    console.log(chalk.gray('Sessions will be created when you archive work\n'));
    return;
  }

  const sessions = await fs.readdir(sessionsDir);
  if (sessions.length === 0) {
    console.log(chalk.yellow('No sessions archived yet'));
    console.log(chalk.gray('Sessions will appear here after archival\n'));
    return;
  }

  console.log(chalk.gray(`Found ${sessions.length} archived session(s)\n`));

  // Simple review: list sessions
  for (const session of sessions) {
    const sessionPath = path.join(sessionsDir, session);
    const stats = await fs.stat(sessionPath);
    
    console.log(chalk.cyan(`📁 ${session}`));
    console.log(chalk.gray(`   Date: ${stats.mtime.toLocaleDateString()}`));

    // Count artifacts if they exist
    try {
      if (await fs.pathExists(path.join(sessionPath, 'investigations'))) {
        const investigations = await fs.readdir(path.join(sessionPath, 'investigations'));
        console.log(chalk.gray(`   Investigations: ${investigations.length}`));
      }
      
      if (await fs.pathExists(path.join(sessionPath, 'work-orders'))) {
        const workOrders = await fs.readdir(path.join(sessionPath, 'work-orders'));
        console.log(chalk.gray(`   Work Orders: ${workOrders.length}`));
      }
    } catch (error) {
      // Ignore errors counting artifacts
    }

    console.log();
  }

  console.log(chalk.blue('💡 Tip: Full pattern analysis coming in future version\n'));
}
