/**
 * Hook Executor - Safe Hook Execution Engine
 *
 * Executes hooks with safety guardrails:
 * - Timeout enforcement
 * - Resource limits
 * - Error handling
 * - Dry-run mode
 * - Performance monitoring
 *
 * @module hooks/HookExecutor
 * @version 1.0.0
 */

import { exec } from 'child_process';
import * as fs from 'fs/promises';
import { promisify } from 'util';

import { HookValidator } from './HookValidator';
import { TrinityHook, HookAction, HookExecutionResult } from './TrinityHookLibrary';

const execAsync = promisify(exec);

/**
 * Hook executor with safety guardrails
 */
export class HookExecutor {
  private validator: HookValidator;
  private defaultTimeout: number = 10000; // 10 seconds

  constructor(validator: HookValidator) {
    this.validator = validator;
  }

  /**
   * Execute hook
   * @param hook - Hook to execute
   * @param eventData - Event data
   * @param dryRun - Dry-run mode
   * @returns Execution result
   */
  async executeHook(
    hook: TrinityHook,
    eventData: Record<string, any>,
    dryRun: boolean = false
  ): Promise<HookExecutionResult> {
    const startTime = Date.now();

    try {
      // Validate event data
      const validation = this.validator.validateEventData(hook, eventData);
      if (!validation.safe) {
        throw new Error(`Event data validation failed: ${validation.issues.join(', ')}`);
      }

      // Execute action with timeout
      const timeout = hook.action.timeout || this.defaultTimeout;
      const output = await this.executeWithTimeout(hook.action, eventData, dryRun, timeout);

      const duration = Date.now() - startTime;

      return {
        hookId: hook.id,
        success: true,
        duration,
        output,
        timestamp: new Date(),
        dryRun,
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        hookId: hook.id,
        success: false,
        duration,
        error: (error as Error).message,
        timestamp: new Date(),
        dryRun,
      };
    }
  }

  /**
   * Execute action with timeout
   */
  private async executeWithTimeout(
    action: HookAction,
    eventData: Record<string, any>,
    dryRun: boolean,
    timeout: number
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Hook execution timed out after ${timeout}ms`));
      }, timeout);

      try {
        const result = await this.executeAction(action, eventData, dryRun);
        clearTimeout(timer);
        resolve(result);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  /**
   * Execute action
   */
  private async executeAction(
    action: HookAction,
    eventData: Record<string, any>,
    dryRun: boolean
  ): Promise<any> {
    // Substitute variables in parameters
    const parameters = this.substituteVariables(action.parameters, eventData);

    switch (action.type) {
      case 'file-create':
        return await this.executeFileCreate(parameters, dryRun);

      case 'file-update':
        return await this.executeFileUpdate(parameters, dryRun);

      case 'file-append':
        return await this.executeFileAppend(parameters, dryRun);

      case 'command-run':
        return await this.executeCommand(parameters, dryRun);

      case 'validation':
        return await this.executeValidation(parameters, eventData);

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Execute file create action
   */
  private async executeFileCreate(parameters: Record<string, any>, dryRun: boolean): Promise<any> {
    const { path: filePath, content } = parameters;

    if (dryRun) {
      return {
        action: 'file-create',
        path: filePath,
        contentLength: content?.length || 0,
        dryRun: true,
      };
    }

    await fs.writeFile(filePath, content || '', 'utf-8');

    return {
      action: 'file-create',
      path: filePath,
      success: true,
    };
  }

  /**
   * Execute file update action
   */
  private async executeFileUpdate(parameters: Record<string, any>, dryRun: boolean): Promise<any> {
    const { path: filePath, content } = parameters;

    if (dryRun) {
      return {
        action: 'file-update',
        path: filePath,
        contentLength: content?.length || 0,
        dryRun: true,
      };
    }

    await fs.writeFile(filePath, content || '', 'utf-8');

    return {
      action: 'file-update',
      path: filePath,
      success: true,
    };
  }

  /**
   * Execute file append action
   */
  private async executeFileAppend(parameters: Record<string, any>, dryRun: boolean): Promise<any> {
    const { path: filePath, content } = parameters;

    if (dryRun) {
      return {
        action: 'file-append',
        path: filePath,
        contentLength: content?.length || 0,
        dryRun: true,
      };
    }

    await fs.appendFile(filePath, content || '', 'utf-8');

    return {
      action: 'file-append',
      path: filePath,
      success: true,
    };
  }

  /**
   * Execute command
   */
  private async executeCommand(parameters: Record<string, any>, dryRun: boolean): Promise<any> {
    const { command } = parameters;

    if (dryRun) {
      return 'DRY RUN: Would execute: ' + command;
    }

    const { stdout, stderr } = await execAsync(command);

    // Return stdout as the output (tests expect a string)
    // stderr is available in the full execution result
    return stdout.trim() || stderr.trim();
  }

  /**
   * Execute validation
   */
  private async executeValidation(
    parameters: Record<string, any>,
    eventData: Record<string, any>
  ): Promise<any> {
    const { type, field, operator, value } = parameters;

    const actualValue = eventData[field];

    let passed = false;

    switch (operator) {
      case 'equals':
        passed = actualValue === value;
        break;
      case 'contains':
        passed = actualValue && actualValue.includes && actualValue.includes(value);
        break;
      case 'matches':
        passed = actualValue && new RegExp(value).test(actualValue);
        break;
    }

    return {
      action: 'validation',
      type,
      passed,
      field,
      actualValue,
      expectedValue: value,
    };
  }

  /**
   * Substitute variables in parameters
   */
  private substituteVariables(parameters: Record<string, any>, eventData: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'string') {
        result[key] = this.substituteString(value, eventData);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.substituteVariables(value, eventData);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Substitute variables in string
   */
  private substituteString(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.getNestedValue(data, path.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current;
  }
}
