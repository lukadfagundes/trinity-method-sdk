/**
 * Centralized error handler with cleanup mechanisms
 * Provides graceful error handling and resource cleanup
 * @module cli/utils/error-handler
 */

import chalk from 'chalk';
import { displayError, displayInfo, getErrorMessage } from './errors.js';
import { TrinityCLIError } from './error-classes.js';

/**
 * Cleanup task to execute before process exit
 */
interface CleanupTask {
  /** Human-readable name for the cleanup task */
  name: string;
  /** Cleanup function (sync or async) */
  handler: () => Promise<void> | void;
}

/**
 * Centralized error handler for Trinity CLI
 * Manages cleanup tasks and provides graceful error handling
 */
class ErrorHandler {
  private cleanupTasks: CleanupTask[] = [];

  /**
   * Check if debug mode is enabled
   * Reads from DEBUG environment variable at runtime
   */
  private get debugMode(): boolean {
    return process.env.DEBUG === 'true';
  }

  /**
   * Register a cleanup task to run before process exit
   * Cleanup tasks are executed in registration order
   * @param name - Human-readable name for logging
   * @param handler - Cleanup function (sync or async)
   */
  registerCleanup(name: string, handler: () => Promise<void> | void): void {
    this.cleanupTasks.push({ name, handler });
  }

  /**
   * Run all registered cleanup tasks
   * Failures in cleanup tasks are logged but don't stop other tasks
   * @private
   */
  private async runCleanup(): Promise<void> {
    if (this.cleanupTasks.length === 0) return;

    console.log(chalk.blue('\nCleaning up...'));

    for (const task of this.cleanupTasks) {
      try {
        await task.handler();
        console.log(chalk.gray(`  ✓ ${task.name}`));
      } catch (error) {
        displayInfo(`Failed to cleanup: ${task.name}`);
      }
    }

    this.cleanupTasks = [];
  }

  /**
   * Handle error and exit gracefully
   * Runs cleanup tasks, displays error, and exits with appropriate code
   * @param error - Error to handle (any type)
   * @returns Never returns (process exits)
   */
  async handle(error: unknown): Promise<never> {
    // Run cleanup tasks first
    await this.runCleanup();

    // Handle Trinity CLI errors
    if (error instanceof TrinityCLIError) {
      displayError(error.format());

      if (error.context && this.debugMode) {
        console.error(chalk.gray('Context:'));
        console.error(chalk.gray(JSON.stringify(error.context, null, 2)));
      }

      if (this.debugMode && error.stack) {
        console.error(chalk.gray('\nStack trace:'));
        console.error(chalk.gray(error.stack));
      }

      process.exit(error.exitCode);
    }

    // Handle standard Error instances
    if (error instanceof Error) {
      displayError(getErrorMessage(error));

      if (this.debugMode && error.stack) {
        console.error(chalk.gray('\nStack trace:'));
        console.error(chalk.gray(error.stack));
      }

      process.exit(1);
    }

    // Handle unknown error types
    displayError('Unknown error occurred');
    console.error(chalk.gray(String(error)));
    process.exit(1);
  }

  /**
   * Wrap async function with error handling
   * Catches errors and passes them to the error handler
   * @param fn - Async function to wrap
   * @returns Wrapped function with error handling
   */
  wrap<T extends unknown[], R>(fn: (...args: T) => Promise<R>): (...args: T) => Promise<R> {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        await this.handle(error);
        // TypeScript doesn't know handle() never returns (calls process.exit)
        // This line is unreachable but satisfies the compiler
        throw error;
      }
    };
  }

  /**
   * Clear all registered cleanup tasks
   * Useful for testing or when cleanup is handled externally
   */
  clearCleanup(): void {
    this.cleanupTasks = [];
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

/**
 * Handle error and exit gracefully
 * Convenience function that calls errorHandler.handle()
 * @param error - Error to handle
 * @returns Never returns (process exits)
 */
export async function handleError(error: unknown): Promise<never> {
  return errorHandler.handle(error);
}
