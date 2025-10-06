/**
 * Configuration Validator
 *
 * Validates Trinity Method configuration against JSON schema.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

import Ajv, { ValidateFunction } from 'ajv';

import {
  TrinityConfiguration,
  ConfigValidationError,
  ConfigValidationResult,
} from './types';

export class ConfigValidator {
  private ajv: InstanceType<typeof Ajv>;
  private validator: ValidateFunction;

  constructor() {
    this.ajv = new Ajv({ allErrors: true });

    // Load schema
    const schemaPath = join(__dirname, 'schema.json');
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

    this.validator = this.ajv.compile(schema);
  }

  /**
   * Validate configuration
   */
  validate(config: any): ConfigValidationResult {
    const valid = this.validator(config);

    if (valid) {
      return {
        valid: true,
        errors: [],
      };
    }

    const errors: ConfigValidationError[] = [];

    if (this.validator.errors) {
      for (const error of this.validator.errors) {
        errors.push({
          field: (error as any).instancePath || error.schemaPath,
          message: error.message || 'Validation error',
          value: (error as any).data,
        });
      }
    }

    return {
      valid: false,
      errors,
    };
  }

  /**
   * Validate and throw on error
   */
  validateOrThrow(config: any): asserts config is TrinityConfiguration {
    const result = this.validate(config);

    if (!result.valid) {
      const errorMessages = result.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');

      throw new Error(`Configuration validation failed:\n${errorMessages}`);
    }
  }
}
