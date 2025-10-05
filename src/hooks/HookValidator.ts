/**
 * Hook Validator - Safety Validation System
 *
 * Validates hook safety before execution to prevent:
 * - Data loss
 * - Unauthorized file system access
 * - Dangerous command execution
 * - Resource exhaustion
 * - Security vulnerabilities
 *
 * Target: 0 catastrophic failures (vs. rule2hook's 14%)
 *
 * @module hooks/HookValidator
 * @version 1.0.0
 */

import { TrinityHook, HookAction } from './TrinityHookLibrary';

/**
 * Validation result
 */
export interface ValidationResult {
  /** Is safe */
  safe: boolean;

  /** Safety issues */
  issues: string[];

  /** Warnings */
  warnings: string[];

  /** Recommendations */
  recommendations?: string[];
}

/**
 * Validation rules
 */
export interface ValidationRules {
  /** Allowed file patterns */
  allowedFilePaths?: RegExp[];

  /** Forbidden file patterns */
  forbiddenFilePaths?: RegExp[];

  /** Allowed commands */
  allowedCommands?: string[];

  /** Forbidden commands */
  forbiddenCommands?: string[];

  /** Maximum timeout (ms) */
  maxTimeout?: number;

  /** Require confirmation for actions */
  requireConfirmation?: boolean;
}

/**
 * Hook safety validator
 */
export class HookValidator {
  private rules: ValidationRules;

  constructor(rules: Partial<ValidationRules> = {}) {
    this.rules = {
      allowedFilePaths: rules.allowedFilePaths || [
        /^trinity\//,
        /^\.claude\//,
        /^docs\//,
        /^CLAUDE\.md$/,
      ],
      forbiddenFilePaths: rules.forbiddenFilePaths || [
        /node_modules\//,
        /\.git\//,
        /\.env$/,
        /credentials/i,
        /secrets/i,
        /password/i,
      ],
      allowedCommands: rules.allowedCommands || [
        'git',
        'npm',
        'node',
        'tsc',
        'eslint',
        'prettier',
        'jest',
      ],
      forbiddenCommands: rules.forbiddenCommands || [
        'rm -rf',
        'del /f',
        'format',
        'mkfs',
        'dd',
        ':(){:|:&};:', // Fork bomb
      ],
      maxTimeout: rules.maxTimeout || 30000, // 30 seconds
      requireConfirmation: rules.requireConfirmation !== undefined ? rules.requireConfirmation : false,
    };
  }

  /**
   * Validate hook safety
   * @param hook - Hook to validate
   * @returns Validation result
   */
  validateHook(hook: TrinityHook): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Validate action
    const actionValidation = this.validateAction(hook.action);
    issues.push(...actionValidation.issues);
    warnings.push(...actionValidation.warnings);

    // Check safety level
    if (hook.safetyLevel === 'caution') {
      warnings.push('Hook has "caution" safety level - review carefully before enabling');
    }

    // Validate timeout
    const timeout = hook.action.timeout || 10000;
    if (timeout > this.rules.maxTimeout!) {
      issues.push(`Timeout ${timeout}ms exceeds maximum ${this.rules.maxTimeout}ms`);
    }

    // Add recommendations
    if (hook.safetyLevel !== 'safe') {
      recommendations.push('Consider enabling dry-run mode first');
    }

    if (!hook.action.timeout) {
      recommendations.push('Consider adding explicit timeout to action');
    }

    return {
      safe: issues.length === 0,
      issues,
      warnings,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  /**
   * Validate action safety
   * @param action - Hook action
   * @returns Validation result
   */
  validateAction(action: HookAction): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];

    switch (action.type) {
      case 'file-create':
      case 'file-update':
      case 'file-append':
        this.validateFileAction(action, issues, warnings);
        break;

      case 'command-run':
        this.validateCommandAction(action, issues, warnings);
        break;

      case 'validation':
        // Validation actions are always safe
        break;

      default:
        issues.push(`Unknown action type: ${action.type}`);
    }

    return {
      safe: issues.length === 0,
      issues,
      warnings,
    };
  }

  /**
   * Validate file action
   */
  private validateFileAction(action: HookAction, issues: string[], warnings: string[]): void {
    const filePath = action.parameters.path || action.parameters.file;

    if (!filePath) {
      issues.push('File action missing file path parameter');
      return;
    }

    // Check forbidden paths
    for (const pattern of this.rules.forbiddenFilePaths!) {
      if (pattern.test(filePath)) {
        issues.push(`File path matches forbidden pattern: ${filePath}`);
        return;
      }
    }

    // Check allowed paths
    let allowed = false;
    for (const pattern of this.rules.allowedFilePaths!) {
      if (pattern.test(filePath)) {
        allowed = true;
        break;
      }
    }

    if (!allowed) {
      issues.push(`File path not in allowed list: ${filePath}`);
    }

    // Warn about overwriting
    if (action.type === 'file-update') {
      warnings.push('File update will overwrite existing content');
    }
  }

  /**
   * Validate command action
   */
  private validateCommandAction(action: HookAction, issues: string[], warnings: string[]): void {
    const command = action.parameters.command;

    if (!command) {
      issues.push('Command action missing command parameter');
      return;
    }

    // Check forbidden commands
    for (const forbidden of this.rules.forbiddenCommands!) {
      if (command.toLowerCase().includes(forbidden.toLowerCase())) {
        issues.push(`Command contains forbidden pattern: ${forbidden}`);
        return;
      }
    }

    // Check allowed commands
    const baseCommand = command.split(' ')[0];
    if (!this.rules.allowedCommands!.includes(baseCommand)) {
      issues.push(`Command not in allowed list: ${baseCommand}`);
    }

    // Warn about potentially destructive operations
    if (command.includes('delete') || command.includes('remove') || command.includes('drop')) {
      warnings.push('Command may perform destructive operations');
    }
  }

  /**
   * Validate event data for hook execution
   * @param hook - Hook
   * @param eventData - Event data
   * @returns Validation result
   */
  validateEventData(hook: TrinityHook, eventData: Record<string, any>): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (hook.action.parameters) {
      for (const [param, value] of Object.entries(hook.action.parameters)) {
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
          const field = value.slice(2, -2);
          if (!(field in eventData)) {
            issues.push(`Missing required event data field: ${field}`);
          }
        }
      }
    }

    return {
      safe: issues.length === 0,
      issues,
      warnings,
    };
  }
}
