/**
 * User Preferences Manager
 *
 * Manages user preferences for the Investigation Wizard, enabling faster
 * investigation creation through saved settings and preference profiles.
 *
 * Features:
 * - Save wizard choices for future use
 * - Create preference profiles (e.g., "security-focused", "performance-focused")
 * - Set default templates
 * - Remember customization settings
 * - Achieve faster investigation creation on subsequent runs
 *
 * @module wizard/UserPreferencesManager
 * @version 1.0.0
 */

import * as fs from 'fs/promises';
import * as path from 'path';

import { InvestigationType } from '../shared/types';

/**
 * User preferences configuration
 */
export interface UserPreferences {
  /** Default investigation type to use */
  defaultInvestigationType?: InvestigationType;

  /** Default scope patterns */
  defaultScope?: string[];

  /** Default exclusion patterns */
  defaultExclusions?: string[];

  /** Saved preference profiles */
  profiles?: PreferenceProfile[];

  /** Active profile name */
  activeProfile?: string;

  /** Whether to skip prompts and use defaults */
  quickCreateByDefault?: boolean;

  /** Framework-specific preferences */
  frameworkPreferences?: Record<string, FrameworkPreferences>;

  /** Last used settings */
  lastUsed?: LastUsedSettings;

  /** Wizard behavior settings */
  behavior?: WizardBehavior;
}

/**
 * Named preference profile
 */
export interface PreferenceProfile {
  /** Profile name */
  name: string;

  /** Profile description */
  description?: string;

  /** Investigation type for this profile */
  investigationType: InvestigationType;

  /** Scope patterns */
  scope?: string[];

  /** Exclusion patterns */
  exclusions?: string[];

  /** Custom settings */
  customSettings?: Record<string, any>;

  /** Created timestamp */
  createdAt: string;

  /** Last modified timestamp */
  modifiedAt: string;
}

/**
 * Framework-specific preferences
 */
export interface FrameworkPreferences {
  /** Preferred investigation type for this framework */
  preferredInvestigationType?: InvestigationType;

  /** Framework-specific scope patterns */
  scopePatterns?: string[];

  /** Framework-specific exclusions */
  exclusions?: string[];
}

/**
 * Last used wizard settings
 */
export interface LastUsedSettings {
  /** Last investigation type */
  investigationType?: InvestigationType;

  /** Last scope patterns */
  scope?: string[];

  /** Last exclusions */
  exclusions?: string[];

  /** Last used timestamp */
  timestamp: string;
}

/**
 * Wizard behavior settings
 */
export interface WizardBehavior {
  /** Show tips and hints */
  showTips?: boolean;

  /** Confirm before creating investigation */
  confirmBeforeCreate?: boolean;

  /** Auto-detect framework */
  autoDetectFramework?: boolean;

  /** Use smart defaults */
  useSmartDefaults?: boolean;

  /** Verbose output */
  verbose?: boolean;
}

/**
 * Manages user preferences for the Investigation Wizard
 */
export class UserPreferencesManager {
  private preferencesPath: string;
  private preferences: UserPreferences = {};
  private loaded = false;

  constructor(trinityRoot: string = './trinity') {
    this.preferencesPath = path.join(trinityRoot, 'config', 'wizard-preferences.json');
  }

  /**
   * Load preferences from disk
   */
  async load(): Promise<UserPreferences> {
    if (this.loaded) {
      return this.preferences;
    }

    try {
      const data = await fs.readFile(this.preferencesPath, 'utf-8');
      this.preferences = JSON.parse(data) as UserPreferences;
      this.loaded = true;
      return this.preferences;
    } catch (error) {
      // File doesn't exist or is invalid - use defaults
      this.preferences = this.getDefaultPreferences();
      this.loaded = true;
      return this.preferences;
    }
  }

  /**
   * Save preferences to disk
   */
  async save(): Promise<void> {
    const dir = path.dirname(this.preferencesPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      this.preferencesPath,
      JSON.stringify(this.preferences, null, 2),
      'utf-8'
    );
  }

  /**
   * Get current preferences
   */
  async getPreferences(): Promise<UserPreferences> {
    if (!this.loaded) {
      await this.load();
    }
    return { ...this.preferences };
  }

  /**
   * Update preferences
   */
  async updatePreferences(updates: Partial<UserPreferences>): Promise<void> {
    if (!this.loaded) {
      await this.load();
    }

    this.preferences = {
      ...this.preferences,
      ...updates,
    };

    await this.save();
  }

  /**
   * Create a new preference profile
   */
  async createProfile(profile: Omit<PreferenceProfile, 'createdAt' | 'modifiedAt'>): Promise<void> {
    if (!this.loaded) {
      await this.load();
    }

    const now = new Date().toISOString();
    const newProfile: PreferenceProfile = {
      ...profile,
      createdAt: now,
      modifiedAt: now,
    };

    if (!this.preferences.profiles) {
      this.preferences.profiles = [];
    }

    // Remove existing profile with same name
    this.preferences.profiles = this.preferences.profiles.filter((p) => p.name !== profile.name);

    this.preferences.profiles.push(newProfile);
    await this.save();
  }

  /**
   * Get a preference profile by name
   */
  async getProfile(name: string): Promise<PreferenceProfile | undefined> {
    if (!this.loaded) {
      await this.load();
    }

    return this.preferences.profiles?.find((p) => p.name === name);
  }

  /**
   * List all preference profiles
   */
  async listProfiles(): Promise<PreferenceProfile[]> {
    if (!this.loaded) {
      await this.load();
    }

    return this.preferences.profiles || [];
  }

  /**
   * Delete a preference profile
   */
  async deleteProfile(name: string): Promise<boolean> {
    if (!this.loaded) {
      await this.load();
    }

    if (!this.preferences.profiles) {
      return false;
    }

    const initialLength = this.preferences.profiles.length;
    this.preferences.profiles = this.preferences.profiles.filter((p) => p.name !== name);

    if (this.preferences.profiles.length < initialLength) {
      // Clear active profile if it was deleted
      if (this.preferences.activeProfile === name) {
        this.preferences.activeProfile = undefined;
      }

      await this.save();
      return true;
    }

    return false;
  }

  /**
   * Set active preference profile
   */
  async setActiveProfile(name: string): Promise<boolean> {
    if (!this.loaded) {
      await this.load();
    }

    const profile = await this.getProfile(name);
    if (!profile) {
      return false;
    }

    this.preferences.activeProfile = name;
    await this.save();
    return true;
  }

  /**
   * Get active preference profile
   */
  async getActiveProfile(): Promise<PreferenceProfile | undefined> {
    if (!this.loaded) {
      await this.load();
    }

    if (!this.preferences.activeProfile) {
      return undefined;
    }

    return this.getProfile(this.preferences.activeProfile);
  }

  /**
   * Clear active profile
   */
  async clearActiveProfile(): Promise<void> {
    if (!this.loaded) {
      await this.load();
    }

    this.preferences.activeProfile = undefined;
    await this.save();
  }

  /**
   * Update last used settings
   */
  async updateLastUsed(settings: Omit<LastUsedSettings, 'timestamp'>): Promise<void> {
    if (!this.loaded) {
      await this.load();
    }

    this.preferences.lastUsed = {
      ...settings,
      timestamp: new Date().toISOString(),
    };

    await this.save();
  }

  /**
   * Get last used settings
   */
  async getLastUsed(): Promise<LastUsedSettings | undefined> {
    if (!this.loaded) {
      await this.load();
    }

    return this.preferences.lastUsed;
  }

  /**
   * Set framework-specific preferences
   */
  async setFrameworkPreferences(framework: string, preferences: FrameworkPreferences): Promise<void> {
    if (!this.loaded) {
      await this.load();
    }

    if (!this.preferences.frameworkPreferences) {
      this.preferences.frameworkPreferences = {};
    }

    this.preferences.frameworkPreferences[framework] = preferences;
    await this.save();
  }

  /**
   * Get framework-specific preferences
   */
  async getFrameworkPreferences(framework: string): Promise<FrameworkPreferences | undefined> {
    if (!this.loaded) {
      await this.load();
    }

    return this.preferences.frameworkPreferences?.[framework];
  }

  /**
   * Update wizard behavior settings
   */
  async updateBehavior(behavior: Partial<WizardBehavior>): Promise<void> {
    if (!this.loaded) {
      await this.load();
    }

    this.preferences.behavior = {
      ...this.preferences.behavior,
      ...behavior,
    };

    await this.save();
  }

  /**
   * Get wizard behavior settings
   */
  async getBehavior(): Promise<WizardBehavior> {
    if (!this.loaded) {
      await this.load();
    }

    return this.preferences.behavior || this.getDefaultBehavior();
  }

  /**
   * Reset preferences to defaults
   */
  async reset(): Promise<void> {
    this.preferences = this.getDefaultPreferences();
    this.loaded = true;
    await this.save();
  }

  /**
   * Export preferences as JSON
   */
  async export(): Promise<string> {
    if (!this.loaded) {
      await this.load();
    }

    return JSON.stringify(this.preferences, null, 2);
  }

  /**
   * Import preferences from JSON
   */
  async import(json: string): Promise<void> {
    try {
      const imported = JSON.parse(json) as UserPreferences;
      this.preferences = imported;
      this.loaded = true;
      await this.save();
    } catch (error) {
      throw new Error('Invalid preferences JSON format');
    }
  }

  /**
   * Get default preferences
   */
  private getDefaultPreferences(): UserPreferences {
    return {
      defaultExclusions: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/coverage/**',
      ],
      quickCreateByDefault: false,
      profiles: [],
      behavior: this.getDefaultBehavior(),
    };
  }

  /**
   * Get default wizard behavior
   */
  private getDefaultBehavior(): WizardBehavior {
    return {
      showTips: true,
      confirmBeforeCreate: true,
      autoDetectFramework: true,
      useSmartDefaults: true,
      verbose: false,
    };
  }
}
