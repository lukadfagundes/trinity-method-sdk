/**
 * Custom error classes for Trinity CLI
 * Provides domain-specific error types with codes and context
 * @module cli/utils/error-classes
 */

/**
 * Base error class for Trinity CLI
 * All custom errors extend this class
 */
export class TrinityCLIError extends Error {
  /**
   * Create a Trinity CLI error
   * @param message - Human-readable error message
   * @param code - Error code for categorization (e.g., 'DEPLOYMENT_ERROR')
   * @param exitCode - Process exit code (default: 1)
   * @param context - Additional context for debugging
   */
  constructor(
    message: string,
    public readonly code: string,
    public readonly exitCode: number = 1,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;

    // Fix prototype chain for instanceof checks in Node.js 22+
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Format error for user display
   * @returns Formatted error message with code
   */
  format(): string {
    return `Error ${this.code}: ${this.message}`;
  }
}

/**
 * User input validation errors
 * Used when user provides invalid input or options
 */
export class ValidationError extends TrinityCLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 1, context);
  }
}

/**
 * Filesystem operation errors
 * Used when file/directory operations fail
 */
export class FilesystemError extends TrinityCLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'FILESYSTEM_ERROR', 1, context);
  }
}

/**
 * Deployment errors
 * Used when Trinity deployment fails
 */
export class DeploymentError extends TrinityCLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'DEPLOYMENT_ERROR', 1, context);
  }
}

/**
 * Update errors
 * Used when Trinity update fails
 */
export class UpdateError extends TrinityCLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'UPDATE_ERROR', 1, context);
  }
}

/**
 * Configuration errors
 * Used when configuration is invalid or missing
 */
export class ConfigurationError extends TrinityCLIError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONFIG_ERROR', 1, context);
  }
}
