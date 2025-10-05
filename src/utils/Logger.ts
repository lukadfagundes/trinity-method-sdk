/**
 * Logger Utility
 *
 * Centralized logging system for Trinity Method SDK.
 * Supports different log levels, structured logging, and environment-based configuration.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface LogEntry {
  timestamp: string;
  level: string;
  context?: string;
  message: string;
  data?: any;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private context?: string;

  private constructor(context?: string) {
    this.context = context;
    this.logLevel = this.getLogLevelFromEnv();
  }

  /**
   * Get logger instance (singleton pattern)
   */
  public static getInstance(context?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(context);
    }
    if (context && Logger.instance.context !== context) {
      return new Logger(context);
    }
    return Logger.instance;
  }

  /**
   * Create a logger with specific context
   */
  public static create(context: string): Logger {
    return new Logger(context);
  }

  /**
   * Get log level from environment variable
   */
  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'INFO':
        return LogLevel.INFO;
      case 'WARN':
        return LogLevel.WARN;
      case 'ERROR':
        return LogLevel.ERROR;
      case 'NONE':
        return LogLevel.NONE;
      default:
        return process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.INFO;
    }
  }

  /**
   * Set log level programmatically
   */
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Format log entry
   */
  private formatLogEntry(level: string, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      context: this.context,
      message,
      data,
    };
  }

  /**
   * Output log to console
   */
  private output(entry: LogEntry): void {
    const contextStr = entry.context ? `[${entry.context}]` : '';
    const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
    const logMessage = `${entry.timestamp} ${entry.level} ${contextStr} ${entry.message}${dataStr}`;

    switch (entry.level) {
      case 'DEBUG':
      case 'INFO':
        console.log(logMessage);
        break;
      case 'WARN':
        console.warn(logMessage);
        break;
      case 'ERROR':
        console.error(logMessage);
        break;
    }
  }

  /**
   * Debug level logging
   */
  public debug(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      const entry = this.formatLogEntry('DEBUG', message, data);
      this.output(entry);
    }
  }

  /**
   * Info level logging
   */
  public info(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.INFO) {
      const entry = this.formatLogEntry('INFO', message, data);
      this.output(entry);
    }
  }

  /**
   * Warning level logging
   */
  public warn(message: string, data?: any): void {
    if (this.logLevel <= LogLevel.WARN) {
      const entry = this.formatLogEntry('WARN', message, data);
      this.output(entry);
    }
  }

  /**
   * Error level logging
   */
  public error(message: string, error?: Error | any): void {
    if (this.logLevel <= LogLevel.ERROR) {
      const data = error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
      const entry = this.formatLogEntry('ERROR', message, data);
      this.output(entry);
    }
  }

  /**
   * Create a child logger with additional context
   */
  public child(childContext: string): Logger {
    const fullContext = this.context ? `${this.context}:${childContext}` : childContext;
    return new Logger(fullContext);
  }
}

// Export default logger instance
export const logger = Logger.getInstance();

// Export context-specific loggers
export const createLogger = (context: string): Logger => Logger.create(context);
