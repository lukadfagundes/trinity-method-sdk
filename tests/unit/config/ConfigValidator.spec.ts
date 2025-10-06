/**
 * Configuration Validator Unit Tests
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { ConfigValidator } from '../../../src/config/ConfigValidator';
import { TrinityConfiguration, Environment } from '../../../src/config/types';

describe('ConfigValidator', () => {
  let validator: ConfigValidator;

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

  beforeEach(() => {
    validator = new ConfigValidator();
  });

  describe('Valid Configuration', () => {
    it('should validate valid configuration', () => {
      const result = validator.validate(validConfig);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate minimal valid configuration', () => {
      const minimalConfig = {
        environment: 'development',
        learning: {
          enabled: true,
          confidenceThreshold: 0.5,
          dataPath: './data',
        },
        cache: {
          enabled: false,
        },
        coordination: {
          enabled: false,
        },
        analytics: {
          enabled: false,
        },
        hooks: {
          enabled: false,
        },
        registry: {
          enabled: false,
        },
        benchmarking: {
          enabled: false,
        },
        logging: {
          level: 'info',
        },
      };

      const result = validator.validate(minimalConfig);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate all environment types', () => {
      const environments: Environment[] = ['development', 'staging', 'production'];

      for (const env of environments) {
        const config = { ...validConfig, environment: env };
        const result = validator.validate(config);

        expect(result.valid).toBe(true);
      }
    });

    it('should validate all logging levels', () => {
      const levels = ['debug', 'info', 'warn', 'error'];

      for (const level of levels) {
        const config = {
          ...validConfig,
          logging: { ...validConfig.logging, level },
        };
        const result = validator.validate(config);

        expect(result.valid).toBe(true);
      }
    });

    it('should validate configuration with optional fields', () => {
      const config = {
        ...validConfig,
        logging: {
          level: 'info',
          // outputPath is optional
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
    });
  });

  describe('Invalid Configuration', () => {
    it('should reject missing environment field', () => {
      const config = { ...validConfig };
      delete (config as any).environment;

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid environment value', () => {
      const config = {
        ...validConfig,
        environment: 'invalid-env',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('environment'))).toBe(true);
    });

    it('should reject invalid logging level', () => {
      const config = {
        ...validConfig,
        logging: {
          level: 'invalid-level',
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('logging'))).toBe(true);
    });

    it('should reject missing required learning fields', () => {
      const config = {
        ...validConfig,
        learning: {
          enabled: true,
          // Missing confidenceThreshold and dataPath
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid confidenceThreshold range', () => {
      const invalidThresholds = [-0.1, 1.5, 2.0];

      for (const threshold of invalidThresholds) {
        const config = {
          ...validConfig,
          learning: {
            ...validConfig.learning,
            confidenceThreshold: threshold,
          },
        };

        const result = validator.validate(config);

        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.field.includes('confidenceThreshold'))).toBe(true);
      }
    });

    it('should reject negative cache sizes', () => {
      const config = {
        ...validConfig,
        cache: {
          ...validConfig.cache,
          l1MaxSize: -100,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should reject negative maxConcurrentTasks', () => {
      const config = {
        ...validConfig,
        coordination: {
          ...validConfig.coordination,
          maxConcurrentTasks: 0,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.field.includes('maxConcurrentTasks'))).toBe(true);
    });

    it('should reject negative retry attempts', () => {
      const config = {
        ...validConfig,
        coordination: {
          ...validConfig.coordination,
          retryAttempts: -1,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should reject invalid boolean values', () => {
      const config = {
        ...validConfig,
        learning: {
          ...validConfig.learning,
          enabled: 'yes' as any,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should reject invalid array types', () => {
      const config = {
        ...validConfig,
        hooks: {
          ...validConfig.hooks,
          enabledHooks: 'not-an-array' as any,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should reject non-string array items', () => {
      const config = {
        ...validConfig,
        hooks: {
          ...validConfig.hooks,
          enabledHooks: [123, 456] as any,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });
  });

  describe('Type Validation', () => {
    it('should validate string types', () => {
      const config = {
        ...validConfig,
        learning: {
          ...validConfig.learning,
          dataPath: 123 as any, // Should be string
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should validate number types', () => {
      const config = {
        ...validConfig,
        cache: {
          ...validConfig.cache,
          l1MaxSize: '100' as any, // Should be number
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should validate boolean types', () => {
      const config = {
        ...validConfig,
        analytics: {
          ...validConfig.analytics,
          enabled: 1 as any, // Should be boolean
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should validate object types', () => {
      const config = {
        ...validConfig,
        learning: 'not-an-object' as any,
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should validate nested object types', () => {
      const config = {
        ...validConfig,
        cache: {
          enabled: true,
          l1MaxSize: 'not-a-number' as any,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });
  });

  describe('Error Reporting', () => {
    it('should provide detailed error messages', () => {
      const config = {
        ...validConfig,
        environment: 'invalid',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].field).toBeDefined();
      expect(result.errors[0].message).toBeDefined();
    });

    it('should report multiple errors', () => {
      const config = {
        environment: 'invalid',
        learning: {
          enabled: 'yes' as any,
          confidenceThreshold: 5,
          dataPath: 123 as any,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });

    it('should include field path in errors', () => {
      const config = {
        ...validConfig,
        learning: {
          ...validConfig.learning,
          confidenceThreshold: 5,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors[0].field).toContain('confidenceThreshold');
    });

    it('should include error information', () => {
      const config = {
        ...validConfig,
        environment: 'invalid-env',
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBeDefined();
      expect(result.errors[0].field).toBeDefined();
      expect(result.errors[0].message).toBeDefined();
    });
  });

  describe('validateOrThrow', () => {
    it('should not throw for valid configuration', () => {
      expect(() => {
        validator.validateOrThrow(validConfig);
      }).not.toThrow();
    });

    it('should throw for invalid configuration', () => {
      const config = {
        ...validConfig,
        environment: 'invalid',
      };

      expect(() => {
        validator.validateOrThrow(config);
      }).toThrow('Configuration validation failed');
    });

    it('should include all errors in throw message', () => {
      const config = {
        environment: 'invalid',
        learning: {
          enabled: 'yes' as any,
        },
      };

      try {
        validator.validateOrThrow(config);
        fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).toContain('Configuration validation failed');
        expect(error.message.split('\n').length).toBeGreaterThan(1);
      }
    });

    it('should format errors with field and message', () => {
      const config = {
        ...validConfig,
        environment: 'invalid',
      };

      try {
        validator.validateOrThrow(config);
        fail('Should have thrown');
      } catch (error: any) {
        expect(error.message).toMatch(/environment.*:/);
      }
    });

    it('should assert type on successful validation', () => {
      const config: any = validConfig;

      validator.validateOrThrow(config);

      // After validation, config should be typed as TrinityConfiguration
      const typedConfig: TrinityConfiguration = config;
      expect(typedConfig.environment).toBe('development');
    });
  });

  describe('Boundary Values', () => {
    it('should accept confidenceThreshold at minimum (0)', () => {
      const config = {
        ...validConfig,
        learning: {
          ...validConfig.learning,
          confidenceThreshold: 0,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
    });

    it('should accept confidenceThreshold at maximum (1)', () => {
      const config = {
        ...validConfig,
        learning: {
          ...validConfig.learning,
          confidenceThreshold: 1,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
    });

    it('should accept maxConcurrentTasks at minimum (1)', () => {
      const config = {
        ...validConfig,
        coordination: {
          ...validConfig.coordination,
          maxConcurrentTasks: 1,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
    });

    it('should accept zero for optional numeric fields', () => {
      const config = {
        ...validConfig,
        cache: {
          ...validConfig.cache,
          ttl: 0,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
    });

    it('should accept empty array for enabledHooks', () => {
      const config = {
        ...validConfig,
        hooks: {
          ...validConfig.hooks,
          enabledHooks: [] as string[],
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
    });
  });

  describe('Schema Loading', () => {
    it('should load schema on instantiation', () => {
      expect(() => {
        new ConfigValidator();
      }).not.toThrow();
    });

    it('should compile schema successfully', () => {
      const validator = new ConfigValidator();
      const result = validator.validate(validConfig);

      expect(result).toBeDefined();
      expect(result.valid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null values', () => {
      const config = {
        ...validConfig,
        learning: null as any,
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });

    it('should allow optional sections to be missing', () => {
      const config = {
        environment: 'development',
        // Most sections are optional in the schema
      };

      const result = validator.validate(config);

      // Schema only requires environment field
      expect(result.valid).toBe(true);
    });

    it('should handle empty object', () => {
      const result = validator.validate({});

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle non-object input', () => {
      const result = validator.validate('not an object' as any);

      expect(result.valid).toBe(false);
    });

    it('should handle array input', () => {
      const result = validator.validate([] as any);

      expect(result.valid).toBe(false);
    });

    it('should handle deeply nested invalid values', () => {
      const config = {
        ...validConfig,
        cache: {
          ...validConfig.cache,
          l1MaxSize: {
            nested: 'invalid',
          } as any,
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(false);
    });
  });

  describe('Additional Properties', () => {
    it('should allow additional properties in config', () => {
      const config = {
        ...validConfig,
        customField: 'custom value',
      };

      const result = validator.validate(config);

      // JSON Schema allows additional properties by default
      // This test documents current behavior
      expect(result.valid).toBe(true);
    });

    it('should allow additional properties in nested objects', () => {
      const config = {
        ...validConfig,
        learning: {
          ...validConfig.learning,
          customLearningField: 'value',
        },
      };

      const result = validator.validate(config);

      expect(result.valid).toBe(true);
    });
  });
});
