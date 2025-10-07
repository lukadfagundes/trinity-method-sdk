/**
 * Configuration Manager Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ConfigurationManager } from '../../../src/config/ConfigurationManager';
import { TrinityConfiguration, Environment } from '../../../src/config/types';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

describe('ConfigurationManager', () => {
  const testConfigDir = path.join(process.cwd(), 'test-config');
  const testConfigPath = path.join(testConfigDir, 'test-config.json');

  const validConfig: TrinityConfiguration = {
    environment: 'development' as Environment,
    learning: {
      enabled: true,
      confidenceThreshold: 0.8,
      dataPath: './data/learning',
      maxCacheSize: 1000,
    },
    cache: {
      enabled: true,
      l1MaxSize: 100,
      l2MaxSizeMB: 500,
      l3MaxSizeMB: 2000,
      ttl: 3600,
    },
    coordination: {
      enabled: true,
      maxConcurrentTasks: 5,
      taskTimeout: 30000,
      retryAttempts: 3,
    },
    analytics: {
      enabled: true,
      metricsPath: './data/metrics',
      trackTokenUsage: true,
      trackPerformance: true,
    },
    hooks: {
      enabled: true,
      enabledHooks: ['pre-investigation', 'post-investigation'],
      hooksPath: './trinity/hooks',
    },
    registry: {
      enabled: true,
      dbPath: './data/registry.db',
      autoRegister: true,
    },
    benchmarking: {
      enabled: false,
      outputPath: './data/benchmarks',
    },
    logging: {
      level: 'info',
      outputPath: './logs/trinity.log',
    },
  };

  beforeEach(async () => {
    // Create test config directory
    await fs.mkdir(testConfigDir, { recursive: true });

    // Write test config file
    await fs.writeFile(
      testConfigPath,
      JSON.stringify(validConfig, null, 2),
      'utf-8'
    );
  });

  afterEach(async () => {
    // Clean up test config directory
    await fs.rm(testConfigDir, { recursive: true, force: true });

    // Clean environment variables
    delete process.env.TRINITY_ENV;
    delete process.env.TRINITY_LEARNING_ENABLED;
    delete process.env.TRINITY_LEARNING_THRESHOLD;
    delete process.env.TRINITY_CACHE_ENABLED;
    delete process.env.TRINITY_CACHE_L1_SIZE;
    delete process.env.TRINITY_COORDINATION_ENABLED;
    delete process.env.TRINITY_MAX_CONCURRENT_TASKS;
    delete process.env.TRINITY_ANALYTICS_ENABLED;
    delete process.env.TRINITY_LOG_LEVEL;
  });

  describe('Initialization', () => {
    it('should load configuration from file', () => {
      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.environment).toBe('development');
      expect(config.learning.enabled).toBe(true);
    });

    it('should validate configuration on load by default', () => {
      const manager = new ConfigurationManager({
        configPath: testConfigPath,
      });

      const config = manager.getConfig();
      expect(config).toBeDefined();
    });

    it('should skip validation when validateOnLoad is false', () => {
      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config).toBeDefined();
    });

    it('should throw error when config file not found', () => {
      expect(() => {
        new ConfigurationManager({
          configPath: path.join(testConfigDir, 'nonexistent.json'),
        });
      }).toThrow('Configuration file not found');
    });

    it('should throw error for invalid JSON', async () => {
      await fs.writeFile(testConfigPath, 'invalid json {', 'utf-8');

      expect(() => {
        new ConfigurationManager({
          configPath: testConfigPath,
          validateOnLoad: false,
        });
      }).toThrow();
    });

    it('should determine environment from options', () => {
      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        environment: 'production',
      });

      expect(manager.getEnvironment()).toBe('production');
    });

    it('should determine environment from TRINITY_ENV', () => {
      process.env.TRINITY_ENV = 'staging';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
      });

      expect(manager.getEnvironment()).toBe('staging');
    });

    it('should determine environment from NODE_ENV', () => {
      process.env.NODE_ENV = 'production';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
      });

      expect(manager.getEnvironment()).toBe('production');
    });

    it('should default to development environment', () => {
      // Ensure no env vars are set
      delete process.env.TRINITY_ENV;
      delete process.env.NODE_ENV;

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
      });

      expect(manager.getEnvironment()).toBe('development');
    });

    it('should normalize environment aliases', async () => {
      const testCases = [
        { env: 'prod', expected: 'production' },
        { env: 'stage', expected: 'staging' },
        { env: 'dev', expected: 'development' },
      ];

      for (const { env, expected } of testCases) {
        // Clean env vars before each test case
        delete process.env.TRINITY_ENV;
        delete process.env.NODE_ENV;

        process.env.TRINITY_ENV = env;

        const manager = new ConfigurationManager({
          configPath: testConfigPath,
          validateOnLoad: false, // Skip validation since env override happens after file load
        });

        expect(manager.getEnvironment()).toBe(expected);
        delete process.env.TRINITY_ENV;
      }
    });
  });

  describe('Configuration Access', () => {
    let manager: ConfigurationManager;

    beforeEach(() => {
      manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });
    });

    it('should get entire configuration', () => {
      const config = manager.getConfig();

      expect(config).toBeDefined();
      expect(config.environment).toBe('development');
      expect(config.learning).toBeDefined();
      expect(config.cache).toBeDefined();
    });

    it('should return frozen configuration object', () => {
      const config = manager.getConfig();

      expect(Object.isFrozen(config)).toBe(true);
    });

    it('should get specific configuration section', () => {
      const learning = manager.get('learning');

      expect(learning).toBeDefined();
      expect(learning.enabled).toBe(true);
      expect(learning.confidenceThreshold).toBe(0.8);
    });

    it('should return frozen configuration section', () => {
      const learning = manager.get('learning');

      expect(Object.isFrozen(learning)).toBe(true);
    });

    it('should get all configuration sections', () => {
      const sections = [
        'environment',
        'learning',
        'cache',
        'coordination',
        'analytics',
        'hooks',
        'registry',
        'benchmarking',
        'logging',
      ];

      for (const section of sections) {
        const value = manager.get(section as any);
        expect(value).toBeDefined();
      }
    });
  });

  describe('Environment Variable Overrides', () => {
    it('should override environment from env var', async () => {
      process.env.TRINITY_ENV = 'production';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.environment).toBe('production');
    });

    it('should override learning.enabled from env var', async () => {
      process.env.TRINITY_LEARNING_ENABLED = 'false';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.learning.enabled).toBe(false);
    });

    it('should override learning.confidenceThreshold from env var', async () => {
      process.env.TRINITY_LEARNING_THRESHOLD = '0.95';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.learning.confidenceThreshold).toBe(0.95);
    });

    it('should override cache.enabled from env var', async () => {
      process.env.TRINITY_CACHE_ENABLED = 'false';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.cache.enabled).toBe(false);
    });

    it('should override cache.l1MaxSize from env var', async () => {
      process.env.TRINITY_CACHE_L1_SIZE = '500';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.cache.l1MaxSize).toBe(500);
    });

    it('should override coordination.enabled from env var', async () => {
      process.env.TRINITY_COORDINATION_ENABLED = 'false';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.coordination.enabled).toBe(false);
    });

    it('should override coordination.maxConcurrentTasks from env var', async () => {
      process.env.TRINITY_MAX_CONCURRENT_TASKS = '10';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.coordination.maxConcurrentTasks).toBe(10);
    });

    it('should override analytics.enabled from env var', async () => {
      process.env.TRINITY_ANALYTICS_ENABLED = 'false';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.analytics.enabled).toBe(false);
    });

    it('should override logging.level from env var', async () => {
      process.env.TRINITY_LOG_LEVEL = 'debug';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.logging.level).toBe('debug');
    });

    it('should create missing config sections when overriding', async () => {
      // Write minimal config
      const minimalConfig = {
        environment: 'development',
      };
      await fs.writeFile(
        testConfigPath,
        JSON.stringify(minimalConfig, null, 2),
        'utf-8'
      );

      process.env.TRINITY_LEARNING_ENABLED = 'true';
      process.env.TRINITY_CACHE_ENABLED = 'true';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.learning).toBeDefined();
      expect(config.learning.enabled).toBe(true);
      expect(config.cache).toBeDefined();
      expect(config.cache.enabled).toBe(true);
    });

    it('should handle multiple env var overrides', async () => {
      process.env.TRINITY_ENV = 'production';
      process.env.TRINITY_LEARNING_ENABLED = 'false';
      process.env.TRINITY_CACHE_ENABLED = 'false';
      process.env.TRINITY_LOG_LEVEL = 'error';

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config = manager.getConfig();
      expect(config.environment).toBe('production');
      expect(config.learning.enabled).toBe(false);
      expect(config.cache.enabled).toBe(false);
      expect(config.logging.level).toBe('error');
    });
  });

  describe('Configuration Reload', () => {
    let manager: ConfigurationManager;

    beforeEach(() => {
      manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });
    });

    it('should reload configuration from disk', async () => {
      const originalConfig = manager.getConfig();
      expect(originalConfig.learning.enabled).toBe(true);

      // Modify config file
      const updatedConfig = { ...validConfig };
      updatedConfig.learning.enabled = false;
      await fs.writeFile(
        testConfigPath,
        JSON.stringify(updatedConfig, null, 2),
        'utf-8'
      );

      await manager.reload(false);

      const newConfig = manager.getConfig();
      expect(newConfig.learning.enabled).toBe(false);
    });

    it('should validate on reload by default', async () => {
      // Write invalid config
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ invalid: 'config' }, null, 2),
        'utf-8'
      );

      await expect(manager.reload()).rejects.toThrow();
    });

    it('should skip validation when specified', async () => {
      // Write invalid config
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ invalid: 'config' }, null, 2),
        'utf-8'
      );

      await manager.reload(false);
      const config = manager.getConfig();
      expect(config).toHaveProperty('invalid');
    });

    it('should notify listeners on reload', async () => {
      let notified = false;
      let notifiedConfig: TrinityConfiguration | null = null;

      manager.onChange((config) => {
        notified = true;
        notifiedConfig = config;
      });

      await manager.reload(false);

      expect(notified).toBe(true);
      expect(notifiedConfig).toBeDefined();
    });

    it('should throw error on reload failure', async () => {
      // Delete config file
      await fs.rm(testConfigPath);

      await expect(manager.reload()).rejects.toThrow();
    });

    it('should measure reload performance', async () => {
      const start = Date.now();
      await manager.reload(false);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000); // Should reload in <1s
    });
  });

  describe('Change Listeners', () => {
    let manager: ConfigurationManager;

    beforeEach(() => {
      manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });
    });

    it('should add change listener', () => {
      const listener = jest.fn();
      const unsubscribe = manager.onChange(listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should notify listener on reload', async () => {
      const listener = jest.fn();
      manager.onChange(listener);

      await manager.reload(false);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        environment: 'development',
      }));
    });

    it('should notify listener on in-memory update', () => {
      const listener = jest.fn();
      manager.onChange(listener);

      manager.updateInMemory({ environment: 'production' });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should support multiple listeners', async () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      manager.onChange(listener1);
      manager.onChange(listener2);

      await manager.reload(false);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe listener', async () => {
      const listener = jest.fn();
      const unsubscribe = manager.onChange(listener);

      unsubscribe();

      await manager.reload(false);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should support async listeners', async () => {
      const listener = jest.fn(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      manager.onChange(listener);

      await manager.reload(false);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle listener errors gracefully', async () => {
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const goodListener = jest.fn();

      manager.onChange(errorListener);
      manager.onChange(goodListener);

      await manager.reload(false);

      // Should still call good listener even if error listener throws
      expect(errorListener).toHaveBeenCalled();
      expect(goodListener).toHaveBeenCalled();
    });

    it('should wait for all async listeners to complete', async () => {
      const order: number[] = [];

      const listener1 = async () => {
        await new Promise(resolve => setTimeout(resolve, 20));
        order.push(1);
      };

      const listener2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        order.push(2);
      };

      manager.onChange(listener1);
      manager.onChange(listener2);

      await manager.reload(false);

      expect(order).toContain(1);
      expect(order).toContain(2);
    });
  });

  describe('In-Memory Updates', () => {
    let manager: ConfigurationManager;

    beforeEach(() => {
      manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });
    });

    it('should update configuration in memory', () => {
      manager.updateInMemory({ environment: 'production' });

      const config = manager.getConfig();
      expect(config.environment).toBe('production');
    });

    it('should merge partial updates', () => {
      const originalLearning = manager.get('learning');

      manager.updateInMemory({
        learning: {
          ...originalLearning,
          enabled: false,
        },
      });

      const config = manager.getConfig();
      expect(config.learning.enabled).toBe(false);
      expect(config.learning.confidenceThreshold).toBe(0.8); // Unchanged
    });

    it('should not persist to disk', async () => {
      manager.updateInMemory({ environment: 'production' });

      // Read file directly
      const fileContent = await fs.readFile(testConfigPath, 'utf-8');
      const fileConfig = JSON.parse(fileContent);

      expect(fileConfig.environment).toBe('development'); // Unchanged in file
    });

    it('should notify listeners on update', () => {
      const listener = jest.fn();
      manager.onChange(listener);

      manager.updateInMemory({ environment: 'production' });

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Default Config Path', () => {
    it('should use environment-specific default path', async () => {
      const devPath = path.join(process.cwd(), 'trinity', 'config', 'development.json');
      const trinityDir = path.join(process.cwd(), 'trinity');

      // Create directory and file
      await fs.mkdir(path.dirname(devPath), { recursive: true });
      await fs.writeFile(devPath, JSON.stringify(validConfig, null, 2), 'utf-8');

      try {
        const manager = new ConfigurationManager({
          environment: 'development',
          validateOnLoad: false,
        });

        expect(manager.getConfig()).toBeDefined();
      } finally {
        // Clean up - remove file first, then directories
        try {
          if (fsSync.existsSync(devPath)) {
            await fs.unlink(devPath);
          }
          // Remove config dir
          const configDir = path.join(trinityDir, 'config');
          if (fsSync.existsSync(configDir)) {
            await fs.rmdir(configDir);
          }
          // Remove trinity dir only if empty
          if (fsSync.existsSync(trinityDir)) {
            const entries = await fs.readdir(trinityDir);
            if (entries.length === 0) {
              await fs.rmdir(trinityDir);
            }
          }
        } catch (cleanupError) {
          // Ignore cleanup errors in tests
          console.warn('Cleanup warning:', cleanupError);
        }
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty config file', async () => {
      await fs.writeFile(testConfigPath, '{}', 'utf-8');

      expect(() => {
        new ConfigurationManager({
          configPath: testConfigPath,
          validateOnLoad: false,
        });
      }).not.toThrow();
    });

    it('should handle config with extra fields', async () => {
      const configWithExtra = {
        ...validConfig,
        extraField: 'extra value',
      };

      await fs.writeFile(
        testConfigPath,
        JSON.stringify(configWithExtra, null, 2),
        'utf-8'
      );

      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      expect(manager.getConfig()).toHaveProperty('extraField');
    });

    it('should freeze nested objects', () => {
      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const learning = manager.get('learning');
      expect(Object.isFrozen(learning)).toBe(true);
    });

    it('should return new frozen object on each get call', () => {
      const manager = new ConfigurationManager({
        configPath: testConfigPath,
        validateOnLoad: false,
      });

      const config1 = manager.getConfig();
      const config2 = manager.getConfig();

      expect(config1).not.toBe(config2); // Different objects
      expect(config1).toEqual(config2); // But equal values
    });
  });
});
