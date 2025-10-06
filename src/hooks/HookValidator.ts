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
  /** Is safe (alias: valid) */
  safe: boolean;
  /** Alias for safe */
  valid?: boolean;

  /** Safety issues (alias: errors) */
  issues: string[];
  /** Alias for issues */
  errors?: string[];

  /** Warnings */
  warnings: string[];

  /** Recommendations */
  recommendations?: string[];

  /** Validation report */
  report?: string;
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
   * @param options - Validation options
   * @returns Validation result
   */
  validate(hook: TrinityHook, options?: { checkVariables?: boolean; availableVariables?: string[]; generateReport?: boolean }): ValidationResult {
    const result = this.validateHook(hook);

    // Add aliases for backward compatibility
    result.valid = result.safe;
    result.errors = result.issues;

    // Check variables if requested
    if (options?.checkVariables && options?.availableVariables) {
      const varWarnings = this.checkVariables(hook, options.availableVariables);
      result.warnings.push(...varWarnings);
    }

    // Generate report if requested
    if (options?.generateReport) {
      result.report = this.generateReport(hook, result);
    }

    return result;
  }

  /**
   * Check for undefined variables in hook
   */
  private checkVariables(hook: TrinityHook, availableVariables: string[]): string[] {
    const warnings: string[] = [];
    const command = hook.action.parameters?.command || '';
    const varPattern = /\{\{(\w+)\}\}/g;
    let match;

    while ((match = varPattern.exec(command)) !== null) {
      const varName = match[1];
      if (!availableVariables.includes(varName)) {
        warnings.push(`Variable {{${varName}}} is undefined in available variables`);
      }
    }

    return warnings;
  }

  /**
   * Generate validation report
   */
  private generateReport(hook: TrinityHook, result: ValidationResult): string {
    let report = `Validation Report for Hook: ${hook.id}\n`;
    report += `${'='.repeat(50)}\n\n`;
    report += `Name: ${hook.name}\n`;
    report += `Category: ${hook.category}\n`;
    report += `Safety Level: ${hook.safetyLevel}\n`;
    report += `Status: ${result.safe ? 'SAFE' : 'UNSAFE'}\n\n`;

    if (result.issues.length > 0) {
      report += `Issues:\n`;
      result.issues.forEach((issue, i) => {
        report += `  ${i + 1}. ${issue}\n`;
      });
      report += '\n';
    }

    if (result.warnings.length > 0) {
      report += `Warnings:\n`;
      result.warnings.forEach((warning, i) => {
        report += `  ${i + 1}. ${warning}\n`;
      });
      report += '\n';
    }

    if (result.recommendations && result.recommendations.length > 0) {
      report += `Recommendations:\n`;
      result.recommendations.forEach((rec, i) => {
        report += `  ${i + 1}. ${rec}\n`;
      });
    }

    return report;
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

    // Apply custom rules
    const customIssues = this.applyCustomRules(hook);
    issues.push(...customIssues);

    // Check safety level
    if (hook.safetyLevel === 'caution') {
      warnings.push('Hook has "caution" safety level - review carefully before enabling');
    }

    // Validate timeout
    const timeout = hook.action.timeout || 10000;
    if (timeout > this.rules.maxTimeout) {
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
    for (const pattern of this.rules.forbiddenFilePaths) {
      if (pattern.test(filePath)) {
        issues.push(`File path matches forbidden pattern: ${filePath}`);
        return;
      }
    }

    // Check allowed paths
    let allowed = false;
    for (const pattern of this.rules.allowedFilePaths) {
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
    for (const forbidden of this.rules.forbiddenCommands) {
      if (command.toLowerCase().includes(forbidden.toLowerCase())) {
        issues.push(`Command contains forbidden pattern: ${forbidden}`);
        return;
      }
    }

    // Check allowed commands
    const baseCommand = command.split(' ')[0];
    if (!this.rules.allowedCommands.includes(baseCommand)) {
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

  /**
   * Validate file path
   * @param filePath - File path to validate
   * @returns Validation result
   */
  validateFilePath(filePath: string): ValidationResult {
    const issues: string[] = [];
    const warnings: string[] = [];

    // Check forbidden paths
    for (const pattern of this.rules.forbiddenFilePaths) {
      if (pattern.test(filePath)) {
        issues.push(`File path matches forbidden pattern: ${filePath}`);
        return { safe: false, issues, warnings };
      }
    }

    // Check if it's an absolute path outside project
    if (filePath.startsWith('/') || /^[A-Z]:\\/.test(filePath)) {
      // Absolute paths are not allowed unless in project
      if (!filePath.includes('trinity') && !filePath.includes('project')) {
        issues.push(`Absolute paths outside project are not allowed: ${filePath}`);
        return { safe: false, issues, warnings };
      }
    }

    // Check allowed paths
    let allowed = false;
    for (const pattern of this.rules.allowedFilePaths) {
      if (pattern.test(filePath)) {
        allowed = true;
        break;
      }
    }

    if (!allowed && !filePath.startsWith('./trinity') && !filePath.startsWith('trinity')) {
      issues.push(`File path not in allowed list: ${filePath}`);
    }

    return {
      safe: issues.length === 0,
      issues,
      warnings,
    };
  }

  /**
   * Custom validation rules
   */
  private customRules: Map<string, (hook: TrinityHook) => { valid: boolean; error?: string }> = new Map();

  /**
   * Add custom validation rule
   * @param name - Rule name
   * @param rule - Rule function
   */
  addCustomRule(name: string, rule: (hook: TrinityHook) => { valid: boolean; error?: string }): void {
    this.customRules.set(name, rule);
  }

  /**
   * Apply custom validation rules
   * @param hook - Hook to validate
   * @returns Issues from custom rules
   */
  private applyCustomRules(hook: TrinityHook): string[] {
    const issues: string[] = [];

    for (const [name, rule] of this.customRules.entries()) {
      const result = rule(hook);
      if (!result.valid && result.error) {
        issues.push(result.error);
      }
    }

    return issues;
  }

  /**
   * Calculate safety score for hook (0-1, higher is safer)
   * @param hook - Hook to score
   * @returns Safety score
   */
  calculateSafetyScore(hook: TrinityHook): number {
    let score = 1.0;

    // Check validation result
    const validation = this.validateHook(hook);

    // Deduct for each issue
    score -= validation.issues.length * 0.3;

    // Deduct for warnings
    score -= validation.warnings.length * 0.1;

    // Deduct for safety level
    if (hook.safetyLevel === 'moderate') {
      score -= 0.2;
    } else if (hook.safetyLevel === 'caution') {
      score -= 0.4;
    }

    // Deduct for dangerous patterns in command
    if (hook.action.type === 'command-run' && hook.action.parameters.command) {
      const command = hook.action.parameters.command.toLowerCase();
      if (command.includes('curl') || command.includes('wget')) {
        score -= 0.2;
      }
      if (command.includes('bash') || command.includes('sh')) {
        score -= 0.3;
      }
      if (command.includes('eval')) {
        score -= 0.5;
      }
    }

    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }
}
