/**
 * User Preferences Manager Unit Tests
 *
 * Tests preference management functionality including:
 * - Loading and saving preferences
 * - Profile creation and management
 * - Active profile management
 * - Last used settings tracking
 * - Framework-specific preferences
 * - Behavior settings
 * - Import/export functionality
 *
 * @module tests/unit/wizard/UserPreferencesManager.spec
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { UserPreferencesManager } from '../../../src/wizard/UserPreferencesManager';
import * as fs from 'fs/promises';

describe('UserPreferencesManager', () => {
  let manager: UserPreferencesManager;
  const testTrinityRoot = './test-trinity-prefs';

  beforeEach(async () => {
    manager = new UserPreferencesManager(testTrinityRoot);
    await fs.mkdir(testTrinityRoot, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testTrinityRoot, { recursive: true, force: true });
  });

  describe('Initialization', () => {
    it('should load default preferences when file does not exist', async () => {
      const prefs = await manager.load();

      expect(prefs).toBeDefined();
      expect(prefs.defaultExclusions).toBeDefined();
      expect(prefs.quickCreateByDefault).toBe(false);
      expect(prefs.profiles).toEqual([]);
    });

    it('should create preferences file on save', async () => {
      await manager.load();
      await manager.save();

      const exists = await fs
        .access(`${testTrinityRoot}/config/wizard-preferences.json`)
        .then(() => true)
        .catch(() => false);

      expect(exists).toBe(true);
    });

    it('should persist preferences across instances', async () => {
      await manager.updatePreferences({
        defaultInvestigationType: 'security-audit',
      });

      const manager2 = new UserPreferencesManager(testTrinityRoot);
      const prefs = await manager2.getPreferences();

      expect(prefs.defaultInvestigationType).toBe('security-audit');
    });
  });

  describe('Preference Updates', () => {
    it('should update preferences', async () => {
      await manager.updatePreferences({
        defaultInvestigationType: 'performance-review',
        defaultScope: ['src/**/*.ts'],
        quickCreateByDefault: true,
      });

      const prefs = await manager.getPreferences();

      expect(prefs.defaultInvestigationType).toBe('performance-review');
      expect(prefs.defaultScope).toEqual(['src/**/*.ts']);
      expect(prefs.quickCreateByDefault).toBe(true);
    });

    it('should merge updates with existing preferences', async () => {
      await manager.updatePreferences({
        defaultInvestigationType: 'security-audit',
      });

      await manager.updatePreferences({
        defaultScope: ['lib/**/*.js'],
      });

      const prefs = await manager.getPreferences();

      expect(prefs.defaultInvestigationType).toBe('security-audit');
      expect(prefs.defaultScope).toEqual(['lib/**/*.js']);
    });
  });

  describe('Profile Management', () => {
    it('should create a profile', async () => {
      await manager.createProfile({
        name: 'security-profile',
        description: 'My security audit profile',
        investigationType: 'security-audit',
        scope: ['src/**/*.ts', 'api/**/*.js'],
        exclusions: ['**/test/**'],
      });

      const profile = await manager.getProfile('security-profile');

      expect(profile).toBeDefined();
      expect(profile?.name).toBe('security-profile');
      expect(profile?.description).toBe('My security audit profile');
      expect(profile?.investigationType).toBe('security-audit');
      expect(profile?.scope).toEqual(['src/**/*.ts', 'api/**/*.js']);
      expect(profile?.createdAt).toBeDefined();
      expect(profile?.modifiedAt).toBeDefined();
    });

    it('should list all profiles', async () => {
      await manager.createProfile({
        name: 'profile1',
        investigationType: 'security-audit',
      });

      await manager.createProfile({
        name: 'profile2',
        investigationType: 'performance-review',
      });

      const profiles = await manager.listProfiles();

      expect(profiles).toHaveLength(2);
      expect(profiles.map((p) => p.name)).toContain('profile1');
      expect(profiles.map((p) => p.name)).toContain('profile2');
    });

    it('should update existing profile with same name', async () => {
      await manager.createProfile({
        name: 'test-profile',
        investigationType: 'security-audit',
        scope: ['src/**'],
      });

      await manager.createProfile({
        name: 'test-profile',
        investigationType: 'performance-review',
        scope: ['lib/**'],
      });

      const profiles = await manager.listProfiles();
      expect(profiles).toHaveLength(1);

      const profile = await manager.getProfile('test-profile');
      expect(profile?.investigationType).toBe('performance-review');
      expect(profile?.scope).toEqual(['lib/**']);
    });

    it('should delete a profile', async () => {
      await manager.createProfile({
        name: 'to-delete',
        investigationType: 'code-quality',
      });

      const deleted = await manager.deleteProfile('to-delete');
      expect(deleted).toBe(true);

      const profile = await manager.getProfile('to-delete');
      expect(profile).toBeUndefined();
    });

    it('should return false when deleting non-existent profile', async () => {
      const deleted = await manager.deleteProfile('non-existent');
      expect(deleted).toBe(false);
    });

    it('should store custom settings in profile', async () => {
      await manager.createProfile({
        name: 'custom-profile',
        investigationType: 'security-audit',
        customSettings: {
          maxDepth: 5,
          skipCache: true,
          customFlag: 'value',
        },
      });

      const profile = await manager.getProfile('custom-profile');
      expect(profile?.customSettings).toEqual({
        maxDepth: 5,
        skipCache: true,
        customFlag: 'value',
      });
    });
  });

  describe('Active Profile', () => {
    it('should set active profile', async () => {
      await manager.createProfile({
        name: 'active-profile',
        investigationType: 'architecture-review',
      });

      const success = await manager.setActiveProfile('active-profile');
      expect(success).toBe(true);

      const prefs = await manager.getPreferences();
      expect(prefs.activeProfile).toBe('active-profile');
    });

    it('should get active profile', async () => {
      await manager.createProfile({
        name: 'my-profile',
        investigationType: 'security-audit',
      });

      await manager.setActiveProfile('my-profile');

      const activeProfile = await manager.getActiveProfile();
      expect(activeProfile).toBeDefined();
      expect(activeProfile?.name).toBe('my-profile');
    });

    it('should return false when setting non-existent profile as active', async () => {
      const success = await manager.setActiveProfile('non-existent');
      expect(success).toBe(false);
    });

    it('should return undefined when no active profile set', async () => {
      const activeProfile = await manager.getActiveProfile();
      expect(activeProfile).toBeUndefined();
    });

    it('should clear active profile', async () => {
      await manager.createProfile({
        name: 'profile',
        investigationType: 'code-quality',
      });

      await manager.setActiveProfile('profile');
      await manager.clearActiveProfile();

      const activeProfile = await manager.getActiveProfile();
      expect(activeProfile).toBeUndefined();
    });

    it('should clear active profile when deleting it', async () => {
      await manager.createProfile({
        name: 'temp-profile',
        investigationType: 'security-audit',
      });

      await manager.setActiveProfile('temp-profile');
      await manager.deleteProfile('temp-profile');

      const prefs = await manager.getPreferences();
      expect(prefs.activeProfile).toBeUndefined();
    });
  });

  describe('Last Used Settings', () => {
    it('should update last used settings', async () => {
      await manager.updateLastUsed({
        investigationType: 'performance-review',
        scope: ['src/**/*.ts'],
        exclusions: ['**/test/**'],
      });

      const lastUsed = await manager.getLastUsed();

      expect(lastUsed).toBeDefined();
      expect(lastUsed?.investigationType).toBe('performance-review');
      expect(lastUsed?.scope).toEqual(['src/**/*.ts']);
      expect(lastUsed?.exclusions).toEqual(['**/test/**']);
      expect(lastUsed?.timestamp).toBeDefined();
    });

    it('should track timestamp for last used', async () => {
      const before = new Date();

      await manager.updateLastUsed({
        investigationType: 'security-audit',
      });

      const after = new Date();
      const lastUsed = await manager.getLastUsed();

      const timestamp = new Date(lastUsed!.timestamp);
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should return undefined when no last used settings', async () => {
      const lastUsed = await manager.getLastUsed();
      expect(lastUsed).toBeUndefined();
    });
  });

  describe('Framework Preferences', () => {
    it('should set framework-specific preferences', async () => {
      await manager.setFrameworkPreferences('Next.js', {
        preferredInvestigationType: 'performance-review',
        scopePatterns: ['app/**/*.tsx', 'pages/**/*.tsx'],
        exclusions: ['**/.next/**'],
      });

      const frameworkPrefs = await manager.getFrameworkPreferences('Next.js');

      expect(frameworkPrefs).toBeDefined();
      expect(frameworkPrefs?.preferredInvestigationType).toBe('performance-review');
      expect(frameworkPrefs?.scopePatterns).toEqual(['app/**/*.tsx', 'pages/**/*.tsx']);
      expect(frameworkPrefs?.exclusions).toEqual(['**/.next/**']);
    });

    it('should return undefined for framework with no preferences', async () => {
      const frameworkPrefs = await manager.getFrameworkPreferences('Vue.js');
      expect(frameworkPrefs).toBeUndefined();
    });

    it('should handle multiple framework preferences', async () => {
      await manager.setFrameworkPreferences('React', {
        preferredInvestigationType: 'code-quality',
      });

      await manager.setFrameworkPreferences('Express', {
        preferredInvestigationType: 'security-audit',
      });

      const reactPrefs = await manager.getFrameworkPreferences('React');
      const expressPrefs = await manager.getFrameworkPreferences('Express');

      expect(reactPrefs?.preferredInvestigationType).toBe('code-quality');
      expect(expressPrefs?.preferredInvestigationType).toBe('security-audit');
    });
  });

  describe('Behavior Settings', () => {
    it('should update behavior settings', async () => {
      await manager.updateBehavior({
        showTips: false,
        confirmBeforeCreate: false,
        verbose: true,
      });

      const behavior = await manager.getBehavior();

      expect(behavior.showTips).toBe(false);
      expect(behavior.confirmBeforeCreate).toBe(false);
      expect(behavior.verbose).toBe(true);
    });

    it('should return default behavior when not set', async () => {
      const behavior = await manager.getBehavior();

      expect(behavior.showTips).toBe(true);
      expect(behavior.confirmBeforeCreate).toBe(true);
      expect(behavior.autoDetectFramework).toBe(true);
      expect(behavior.useSmartDefaults).toBe(true);
      expect(behavior.verbose).toBe(false);
    });

    it('should merge behavior updates', async () => {
      await manager.updateBehavior({
        showTips: false,
      });

      await manager.updateBehavior({
        verbose: true,
      });

      const behavior = await manager.getBehavior();

      expect(behavior.showTips).toBe(false);
      expect(behavior.verbose).toBe(true);
      expect(behavior.confirmBeforeCreate).toBe(true); // Default preserved
    });
  });

  describe('Import/Export', () => {
    it('should export preferences as JSON', async () => {
      await manager.updatePreferences({
        defaultInvestigationType: 'security-audit',
        defaultScope: ['src/**'],
      });

      await manager.createProfile({
        name: 'test-profile',
        investigationType: 'performance-review',
      });

      const exported = await manager.export();
      const parsed = JSON.parse(exported);

      expect(parsed.defaultInvestigationType).toBe('security-audit');
      expect(parsed.defaultScope).toEqual(['src/**']);
      expect(parsed.profiles).toHaveLength(1);
      expect(parsed.profiles[0].name).toBe('test-profile');
    });

    it('should import preferences from JSON', async () => {
      const importData = JSON.stringify({
        defaultInvestigationType: 'code-quality',
        defaultScope: ['lib/**'],
        profiles: [
          {
            name: 'imported-profile',
            investigationType: 'architecture-review',
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
          },
        ],
      });

      await manager.import(importData);

      const prefs = await manager.getPreferences();
      expect(prefs.defaultInvestigationType).toBe('code-quality');
      expect(prefs.defaultScope).toEqual(['lib/**']);

      const profiles = await manager.listProfiles();
      expect(profiles).toHaveLength(1);
      expect(profiles[0].name).toBe('imported-profile');
    });

    it('should reject invalid JSON on import', async () => {
      await expect(manager.import('invalid json')).rejects.toThrow('Invalid preferences JSON format');
    });
  });

  describe('Reset', () => {
    it('should reset preferences to defaults', async () => {
      await manager.updatePreferences({
        defaultInvestigationType: 'security-audit',
        defaultScope: ['custom/**'],
        quickCreateByDefault: true,
      });

      await manager.createProfile({
        name: 'profile',
        investigationType: 'performance-review',
      });

      await manager.reset();

      const prefs = await manager.getPreferences();

      expect(prefs.defaultInvestigationType).toBeUndefined();
      expect(prefs.defaultScope).toBeUndefined();
      expect(prefs.quickCreateByDefault).toBe(false);
      expect(prefs.profiles).toEqual([]);
    });
  });

  describe('Persistence', () => {
    it('should persist preferences to disk', async () => {
      await manager.updatePreferences({
        defaultInvestigationType: 'security-audit',
      });

      const manager2 = new UserPreferencesManager(testTrinityRoot);
      const prefs = await manager2.load();

      expect(prefs.defaultInvestigationType).toBe('security-audit');
    });

    it('should create config directory if it does not exist', async () => {
      await manager.updatePreferences({
        defaultInvestigationType: 'code-quality',
      });

      const configDir = `${testTrinityRoot}/config`;
      const exists = await fs
        .access(configDir)
        .then(() => true)
        .catch(() => false);

      expect(exists).toBe(true);
    });
  });
});
