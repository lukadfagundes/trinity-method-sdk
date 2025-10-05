/**
 * Configuration Manager
 *
 * Multi-environment configuration management with hot-reload and validation.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ConfigValidator } from './ConfigValidator';
import {
  TrinityConfiguration,
  Environment,
  ConfigurationOptions,
  ConfigChangeListener,
} from './types';
import { createLogger } from '../utils/Logger';

const logger = createLogger('ConfigurationManager');

export class ConfigurationManager {
  private config!: TrinityConfiguration;
  private validator: ConfigValidator;
  private environment: Environment;
  private configPath: string;
  private listeners: Set<ConfigChangeListener> = new Set();

  constructor(options: ConfigurationOptions = {}) {
    this.validator = new ConfigValidator();
    this.environment = this.determineEnvironment(options.environment);
    this.configPath = options.configPath || this.getDefaultConfigPath();

    // Load initial configuration
    this.loadConfiguration(options.validateOnLoad !== false);
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<TrinityConfiguration> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Get specific configuration section
   */
  get<K extends keyof TrinityConfiguration>(
    key: K
  ): Readonly<TrinityConfiguration[K]> {
    const value = this.config[key];
    return Object.freeze(typeof value === 'object' && value !== null ? { ...value as object } : value) as Readonly<TrinityConfiguration[K]>;
  }

  /**
   * Reload configuration from disk
   */
  async reload(validate: boolean = true): Promise<void> {
    const start = Date.now();

    try {
      this.loadConfiguration(validate);

      const duration = Date.now() - start;

      // Notify listeners
      await this.notifyListeners();

      logger.info(`Configuration reloaded in ${duration}ms`);
    } catch (error) {
      logger.error('Failed to reload configuration:', error);
      throw error;
    }
  }

  /**
   * Add configuration change listener
   */
  onChange(listener: ConfigChangeListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Update configuration in memory (does not persist to disk)
   */
  updateInMemory(updates: Partial<TrinityConfiguration>): void {
    this.config = {
      ...this.config,
      ...updates,
    };

    this.notifyListeners();
  }

  /**
   * Get current environment
   */
  getEnvironment(): Environment {
    return this.environment;
  }

  /**
   * Load configuration from disk
   */
  private loadConfiguration(validate: boolean): void {
    // Load configuration file
    if (!existsSync(this.configPath)) {
      throw new Error(`Configuration file not found: ${this.configPath}`);
    }

    const configData = readFileSync(this.configPath, 'utf-8');
    const config = JSON.parse(configData);

    // Apply environment variable overrides
    this.applyEnvironmentVariables(config);

    // Validate configuration
    if (validate) {
      this.validator.validateOrThrow(config);
    }

    this.config = config;
  }

  /**
   * Apply environment variable overrides
   */
  private applyEnvironmentVariables(config: any): void {
    // Environment
    if (process.env.TRINITY_ENV) {
      config.environment = process.env.TRINITY_ENV;
    }

    // Learning
    if (process.env.TRINITY_LEARNING_ENABLED !== undefined) {
      config.learning = config.learning || {};
      config.learning.enabled = process.env.TRINITY_LEARNING_ENABLED === 'true';
    }

    if (process.env.TRINITY_LEARNING_THRESHOLD) {
      config.learning = config.learning || {};
      config.learning.confidenceThreshold = parseFloat(
        process.env.TRINITY_LEARNING_THRESHOLD
      );
    }

    // Cache
    if (process.env.TRINITY_CACHE_ENABLED !== undefined) {
      config.cache = config.cache || {};
      config.cache.enabled = process.env.TRINITY_CACHE_ENABLED === 'true';
    }

    if (process.env.TRINITY_CACHE_L1_SIZE) {
      config.cache = config.cache || {};
      config.cache.l1MaxSize = parseInt(process.env.TRINITY_CACHE_L1_SIZE, 10);
    }

    // Coordination
    if (process.env.TRINITY_COORDINATION_ENABLED !== undefined) {
      config.coordination = config.coordination || {};
      config.coordination.enabled = process.env.TRINITY_COORDINATION_ENABLED === 'true';
    }

    if (process.env.TRINITY_MAX_CONCURRENT_TASKS) {
      config.coordination = config.coordination || {};
      config.coordination.maxConcurrentTasks = parseInt(
        process.env.TRINITY_MAX_CONCURRENT_TASKS,
        10
      );
    }

    // Analytics
    if (process.env.TRINITY_ANALYTICS_ENABLED !== undefined) {
      config.analytics = config.analytics || {};
      config.analytics.enabled = process.env.TRINITY_ANALYTICS_ENABLED === 'true';
    }

    // Logging
    if (process.env.TRINITY_LOG_LEVEL) {
      config.logging = config.logging || {};
      config.logging.level = process.env.TRINITY_LOG_LEVEL;
    }
  }

  /**
   * Determine environment
   */
  private determineEnvironment(explicit?: Environment): Environment {
    if (explicit) return explicit;

    const envVar = process.env.TRINITY_ENV || process.env.NODE_ENV;

    switch (envVar) {
      case 'production':
      case 'prod':
        return 'production';
      case 'staging':
      case 'stage':
        return 'staging';
      case 'development':
      case 'dev':
      default:
        return 'development';
    }
  }

  /**
   * Get default configuration path for environment
   */
  private getDefaultConfigPath(): string {
    const basePath = process.cwd();
    return join(basePath, 'trinity', 'config', `${this.environment}.json`);
  }

  /**
   * Notify all listeners of configuration change
   */
  private async notifyListeners(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const listener of this.listeners) {
      try {
        const result = listener(this.getConfig());
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        logger.error('Configuration change listener error:', error);
      }
    }

    await Promise.all(promises);
  }
}
