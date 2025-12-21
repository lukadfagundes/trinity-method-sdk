/**
 * Error handling utilities for type-safe error management
 * @module cli/utils/errors
 */

import chalk from 'chalk';

/**
 * Error severity levels for display formatting
 */
export enum ErrorSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

/**
 * Options for error display customization
 */
export interface ErrorDisplayOptions {
  severity?: ErrorSeverity;
  prefix?: string;
  showStack?: boolean;
}

/**
 * Type guard to check if an unknown value is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safely extract error message from unknown error value
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return String(error);
}

/**
 * Safely extract error stack from unknown error value
 */
export function getErrorStack(error: unknown): string | undefined {
  if (isError(error)) {
    return error.stack;
  }
  return undefined;
}

/**
 * Display error with consistent formatting and colors
 *
 * @param error - Error to display (Error instance, string, or unknown)
 * @param options - Display customization options
 */
export function displayError(error: unknown, options: ErrorDisplayOptions = {}): void {
  const { severity = ErrorSeverity.ERROR, prefix, showStack = false } = options;

  const message = getErrorMessage(error);

  // Select emoji and color based on severity
  let emoji: string;
  let color: (text: string) => string;

  switch (severity) {
    case ErrorSeverity.ERROR:
      emoji = '❌';
      color = chalk.red;
      break;
    case ErrorSeverity.WARNING:
      emoji = '⚠️';
      color = chalk.yellow;
      break;
    case ErrorSeverity.INFO:
      emoji = 'ℹ️';
      color = chalk.blue;
      break;
  }

  // Build output message
  const parts: string[] = [emoji];
  if (prefix) {
    parts.push(prefix);
  }
  parts.push(message);

  console.error(color(parts.join(' ')));

  // Optionally display stack trace
  if (showStack) {
    const stack = getErrorStack(error);
    if (stack) {
      console.error(chalk.gray(stack));
    }
  }
}

/**
 * Display warning message with yellow color and emoji
 *
 * @param message - Warning message to display
 */
export function displayWarning(message: string): void {
  displayError(message, { severity: ErrorSeverity.WARNING });
}

/**
 * Display informational message with blue color and emoji
 *
 * @param message - Info message to display
 */
export function displayInfo(message: string): void {
  displayError(message, { severity: ErrorSeverity.INFO });
}
