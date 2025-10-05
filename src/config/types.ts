/**
 * Configuration Types
 *
 * Type definitions for Trinity Method configuration system.
 */

export type Environment = 'development' | 'staging' | 'production';

export interface TrinityConfiguration {
  environment: Environment;

  learning: {
    enabled: boolean;
    confidenceThreshold: number;
    dataPath: string;
    maxCacheSize: number;
  };

  cache: {
    enabled: boolean;
    l1MaxSize: number;
    l2MaxSizeMB: number;
    l3MaxSizeMB: number;
    ttl: number;
  };

  coordination: {
    enabled: boolean;
    maxConcurrentTasks: number;
    taskTimeout: number;
    retryAttempts: number;
  };

  analytics: {
    enabled: boolean;
    metricsPath: string;
    trackTokenUsage: boolean;
    trackPerformance: boolean;
  };

  hooks: {
    enabled: boolean;
    enabledHooks: string[];
    hooksPath: string;
  };

  registry: {
    enabled: boolean;
    dbPath: string;
    autoRegister: boolean;
  };

  benchmarking: {
    enabled: boolean;
    outputPath: string;
  };

  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    outputPath?: string;
  };
}

export interface ConfigurationOptions {
  environment?: Environment;
  configPath?: string;
  watchForChanges?: boolean;
  validateOnLoad?: boolean;
}

export type ConfigChangeListener = (config: TrinityConfiguration) => void | Promise<void>;

export interface ConfigValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ConfigValidationResult {
  valid: boolean;
  errors: ConfigValidationError[];
}
