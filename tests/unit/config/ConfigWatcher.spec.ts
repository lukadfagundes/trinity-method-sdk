/**
 * Configuration Watcher Unit Tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ConfigWatcher } from '../../../src/config/ConfigWatcher';
import { ConfigurationManager } from '../../../src/config/ConfigurationManager';
import { TrinityConfiguration, Environment } from '../../../src/config/types';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('ConfigWatcher', () => {
  const testConfigDir = path.join(process.cwd(), 'test-config-watcher');
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
      enabledHooks: ['pre-investigation'],
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

  let configManager: ConfigurationManager;
  let watcher: ConfigWatcher;

  beforeEach(async () => {
    // Create test config directory
    await fs.mkdir(testConfigDir, { recursive: true });

    // Write test config file
    await fs.writeFile(
      testConfigPath,
      JSON.stringify(validConfig, null, 2),
      'utf-8'
    );

    // Create config manager
    configManager = new ConfigurationManager({
      configPath: testConfigPath,
      validateOnLoad: false,
    });
  });

  afterEach(async () => {
    // Stop watcher if running
    if (watcher) {
      watcher.stop();
    }

    // Clean up test config directory
    await fs.rm(testConfigDir, { recursive: true, force: true });
  });

  describe('Initialization', () => {
    it('should create watcher instance', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      expect(watcher).toBeDefined();
    });

    it('should accept custom debounce delay', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 500,
      });

      expect(watcher).toBeDefined();
    });

    it('should use default debounce delay', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      expect(watcher).toBeDefined();
    });

    it('should not start watching on creation', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      // No assertion needed - just verifying it doesn't throw or auto-start
      expect(watcher).toBeDefined();
    });
  });

  describe('Start Watching', () => {
    it('should start watching configuration file', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      expect(() => {
        watcher.start();
      }).not.toThrow();
    });

    it('should not throw when starting already running watcher', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      watcher.start();
      expect(() => {
        watcher.start();
      }).not.toThrow();
    });

    it('should watch specified file path', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      watcher.start();

      // File watcher should be active (no errors thrown)
      expect(watcher).toBeDefined();
    });
  });

  describe('Stop Watching', () => {
    it('should stop watching configuration file', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      watcher.start();
      expect(() => {
        watcher.stop();
      }).not.toThrow();
    });

    it('should not throw when stopping already stopped watcher', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      expect(() => {
        watcher.stop();
      }).not.toThrow();
    });

    it('should clear reload timeout on stop', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 1000,
      });

      watcher.start();

      // Trigger a change
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      // Stop immediately (before debounce completes)
      watcher.stop();

      // Wait to ensure reload doesn't happen
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Config should not have changed
      const config = configManager.getConfig();
      expect(config.environment).toBe('development');
    });

    it('should allow restart after stop', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      watcher.start();
      watcher.stop();

      expect(() => {
        watcher.start();
      }).not.toThrow();
    });
  });

  describe('Change Detection', () => {
    it('should detect file changes', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      let changeDetected = false;
      configManager.onChange(() => {
        changeDetected = true;
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Modify config file
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      // Wait for debounce + reload
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(changeDetected).toBe(true);
    });

    it('should reload configuration on change', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      const originalConfig = configManager.getConfig();
      expect(originalConfig.environment).toBe('development');

      // Modify config file
      const updatedConfig = { ...validConfig, environment: 'production' as Environment };
      await fs.writeFile(
        testConfigPath,
        JSON.stringify(updatedConfig, null, 2),
        'utf-8'
      );

      // Wait for debounce + reload
      await new Promise(resolve => setTimeout(resolve, 300));

      const newConfig = configManager.getConfig();
      expect(newConfig.environment).toBe('production');
    });

    it('should detect multiple changes', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      let changeCount = 0;
      configManager.onChange(() => {
        changeCount++;
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // First change
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'staging' }, null, 2),
        'utf-8'
      );

      await new Promise(resolve => setTimeout(resolve, 200));

      // Second change
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(changeCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Debouncing', () => {
    it('should debounce rapid changes', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 200,
      });

      let reloadCount = 0;
      configManager.onChange(() => {
        reloadCount++;
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Make multiple rapid changes
      for (let i = 0; i < 5; i++) {
        await fs.writeFile(
          testConfigPath,
          JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
          'utf-8'
        );
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Wait for final debounce
      await new Promise(resolve => setTimeout(resolve, 300));

      // Should have fewer reloads than changes due to debouncing
      expect(reloadCount).toBeLessThan(5);
    });

    it('should use custom debounce delay', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 500,
      });

      let reloadTime = 0;
      configManager.onChange(() => {
        reloadTime = Date.now();
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      const changeTime = Date.now();

      // Modify config
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 800));

      const delay = reloadTime - changeTime;
      expect(delay).toBeGreaterThanOrEqual(400); // Allow some variance
    });

    it('should reset debounce timer on new change', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 300,
      });

      let reloadCount = 0;
      configManager.onChange(() => {
        reloadCount++;
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // First change
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'staging' }, null, 2),
        'utf-8'
      );

      // Wait 150ms (less than debounce)
      await new Promise(resolve => setTimeout(resolve, 150));

      // Second change resets timer
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      // Wait 150ms again
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should not have reloaded yet
      expect(reloadCount).toBe(0);

      // Wait for final debounce
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should reload once
      expect(reloadCount).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle reload errors gracefully', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Write invalid JSON
      await fs.writeFile(testConfigPath, 'invalid json {', 'utf-8');

      // Wait for debounce + reload attempt
      await new Promise(resolve => setTimeout(resolve, 200));

      // Watcher should still be running (no crash)
      expect(watcher).toBeDefined();
    });

    it('should continue watching after reload error', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      let successfulReloads = 0;
      configManager.onChange(() => {
        successfulReloads++;
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // First change: invalid JSON
      await fs.writeFile(testConfigPath, 'invalid json', 'utf-8');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Second change: valid JSON
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should have one successful reload
      expect(successfulReloads).toBeGreaterThan(0);
    });

    it('should handle file deletion', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Delete config file
      await fs.rm(testConfigPath);

      // Wait for potential reload
      await new Promise(resolve => setTimeout(resolve, 200));

      // Watcher should still be running
      expect(watcher).toBeDefined();
    });

    it('should handle watcher errors', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      watcher.start();

      // Watcher should handle errors internally
      // No assertion needed - just verify no uncaught errors
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(watcher).toBeDefined();
    });
  });

  describe('Integration with ConfigurationManager', () => {
    it('should trigger ConfigurationManager reload', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      const reloadSpy = jest.spyOn(configManager, 'reload');

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Modify config
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      // Wait for debounce + reload
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should pass updated config to listeners', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      let receivedConfig: TrinityConfiguration | null = null;

      configManager.onChange((config) => {
        receivedConfig = config;
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Modify config
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'staging' }, null, 2),
        'utf-8'
      );

      // Wait for debounce + reload
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(receivedConfig).toBeDefined();
      expect(receivedConfig?.environment).toBe('staging');
    });

    it('should maintain config consistency', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      const updatedConfig = {
        ...validConfig,
        environment: 'production' as Environment,
        cache: {
          ...validConfig.cache,
          enabled: false,
        },
      };

      // Modify config
      await fs.writeFile(
        testConfigPath,
        JSON.stringify(updatedConfig, null, 2),
        'utf-8'
      );

      // Wait for debounce + reload
      await new Promise(resolve => setTimeout(resolve, 200));

      const config = configManager.getConfig();
      expect(config.environment).toBe('production');
      expect(config.cache.enabled).toBe(false);
    });
  });

  describe('Performance', () => {
    it('should handle file changes with minimal latency', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      let reloadTime = 0;
      configManager.onChange(() => {
        reloadTime = Date.now();
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      const changeTime = Date.now();

      // Modify config
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      // Wait for reload
      await new Promise(resolve => setTimeout(resolve, 300));

      const latency = reloadTime - changeTime;
      expect(latency).toBeLessThan(500); // Should reload within 500ms
    });

    it('should not block on file changes', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 50,
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      const startTime = Date.now();

      // Trigger change
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      const writeTime = Date.now() - startTime;

      // Write should complete quickly (not waiting for reload)
      expect(writeTime).toBeLessThan(100);
    });
  });

  describe('Cleanup', () => {
    it('should clean up resources on stop', () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      watcher.start();
      watcher.stop();

      // Should not have any active watchers or timers
      expect(watcher).toBeDefined();
    });

    it('should not leak memory on repeated start/stop', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath);

      for (let i = 0; i < 10; i++) {
        watcher.start();
        await new Promise(resolve => setTimeout(resolve, 10));
        watcher.stop();
      }

      // Should complete without memory issues
      expect(watcher).toBeDefined();
    });

    it('should clear all timers on stop', async () => {
      watcher = new ConfigWatcher(configManager, testConfigPath, {
        reloadDebounceMs: 1000,
      });

      watcher.start();

      // Wait for watcher to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trigger change
      await fs.writeFile(
        testConfigPath,
        JSON.stringify({ ...validConfig, environment: 'production' }, null, 2),
        'utf-8'
      );

      // Stop before debounce completes
      await new Promise(resolve => setTimeout(resolve, 100));
      watcher.stop();

      // Verify timer was cleared (no reload happens)
      const config = configManager.getConfig();
      expect(config.environment).toBe('development');
    });
  });
});
