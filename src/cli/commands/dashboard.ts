#!/usr/bin/env node
import chalk from 'chalk';
import { DashboardOptions } from '../types.js';
import { UnifiedDashboard } from '../UnifiedDashboard.js';

/**
 * Trinity Dashboard Command
 *
 * Launches unified web dashboard for monitoring all Trinity systems
 */

export async function dashboard(options: DashboardOptions): Promise<void> {
  console.log(chalk.cyan.bold('\n📊 Trinity Dashboard\n'));

  try {
    const port = options.port || 3000;
    const host = options.host || 'localhost';

    const dashboardServer = new UnifiedDashboard({ port, host });

    // Handle Ctrl+C gracefully
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down dashboard...');
      await dashboardServer.stop();
      process.exit(0);
    });

    await dashboardServer.start();

    // Keep the process alive
    await new Promise(() => {}); // Never resolves - keeps server running

  } catch (error: any) {
    console.error(chalk.red('\n❌ Dashboard failed:'), error.message);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}
