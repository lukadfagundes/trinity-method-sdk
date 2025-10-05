/**
 * Configuration Watcher
 *
 * Watches configuration files for changes and triggers hot-reload.
 */

import { watch, FSWatcher } from 'chokidar';
import { ConfigurationManager } from './ConfigurationManager';
import { createLogger } from '../utils/Logger';

const logger = createLogger('ConfigWatcher');

export class ConfigWatcher {
  private watcher?: FSWatcher;
  private configManager: ConfigurationManager;
  private configPath: string;
  private reloadDebounceMs: number;
  private reloadTimeout?: NodeJS.Timeout;

  constructor(
    configManager: ConfigurationManager,
    configPath: string,
    options: {
      reloadDebounceMs?: number;
    } = {}
  ) {
    this.configManager = configManager;
    this.configPath = configPath;
    this.reloadDebounceMs = options.reloadDebounceMs || 100;
  }

  /**
   * Start watching configuration file
   */
  start(): void {
    if (this.watcher) {
      logger.warn('ConfigWatcher already started');
      return;
    }

    logger.info(`Watching configuration file: ${this.configPath}`);

    this.watcher = watch(this.configPath, {
      persistent: true,
      ignoreInitial: true,
    });

    this.watcher.on('change', (path) => {
      logger.info(`Configuration file changed: ${path}`);
      this.scheduleReload();
    });

    this.watcher.on('error', (error) => {
      logger.error('ConfigWatcher error:', error);
    });
  }

  /**
   * Stop watching configuration file
   */
  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = undefined;
      logger.info('ConfigWatcher stopped');
    }

    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
      this.reloadTimeout = undefined;
    }
  }

  /**
   * Schedule configuration reload with debouncing
   */
  private scheduleReload(): void {
    // Clear existing timeout
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
    }

    // Schedule new reload
    this.reloadTimeout = setTimeout(async () => {
      try {
        await this.configManager.reload();
        logger.info('✅ Configuration hot-reloaded successfully');
      } catch (error) {
        logger.error('❌ Configuration reload failed:', error);
      }
    }, this.reloadDebounceMs);
  }
}
