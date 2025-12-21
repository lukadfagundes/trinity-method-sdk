/**
 * Unit tests for error classes
 * @module tests/unit/cli/utils/error-classes
 */

import {
  TrinityCLIError,
  ValidationError,
  FilesystemError,
  DeploymentError,
  UpdateError,
  ConfigurationError,
} from '../../../../src/cli/utils/error-classes.js';

describe('Error Classes', () => {
  describe('TrinityCLIError', () => {
    it('should create error with message and code', () => {
      const error = new TrinityCLIError('Test error', 'TEST_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('TrinityCLIError');
    });

    it('should create error with custom exit code', () => {
      const error = new TrinityCLIError('Test error', 'TEST_ERROR', 2);

      expect(error.exitCode).toBe(2);
    });

    it('should create error with context', () => {
      const context = { foo: 'bar', count: 42 };
      const error = new TrinityCLIError('Test error', 'TEST_ERROR', 1, context);

      expect(error.context).toEqual(context);
    });

    it('should format error message', () => {
      const error = new TrinityCLIError('Test failed', 'TEST_ERROR');

      expect(error.format()).toBe('Error TEST_ERROR: Test failed');
    });

    it('should be instance of Error', () => {
      const error = new TrinityCLIError('Test error', 'TEST_ERROR');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(TrinityCLIError);
    });

    it('should capture stack trace', () => {
      const error = new TrinityCLIError('Test error', 'TEST_ERROR');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('TrinityCLIError');
    });
  });

  describe('ValidationError', () => {
    it('should create validation error', () => {
      const error = new ValidationError('Invalid input');

      expect(error.message).toBe('Invalid input');
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('ValidationError');
    });

    it('should create validation error with context', () => {
      const context = { field: 'email', value: 'invalid' };
      const error = new ValidationError('Invalid email', context);

      expect(error.context).toEqual(context);
    });

    it('should be instance of TrinityCLIError', () => {
      const error = new ValidationError('Invalid input');

      expect(error).toBeInstanceOf(TrinityCLIError);
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should format error with VALIDATION_ERROR code', () => {
      const error = new ValidationError('Invalid input');

      expect(error.format()).toBe('Error VALIDATION_ERROR: Invalid input');
    });
  });

  describe('FilesystemError', () => {
    it('should create filesystem error', () => {
      const error = new FilesystemError('File not found');

      expect(error.message).toBe('File not found');
      expect(error.code).toBe('FILESYSTEM_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('FilesystemError');
    });

    it('should create filesystem error with context', () => {
      const context = { path: '/foo/bar', operation: 'read' };
      const error = new FilesystemError('Cannot read file', context);

      expect(error.context).toEqual(context);
    });

    it('should be instance of TrinityCLIError', () => {
      const error = new FilesystemError('File not found');

      expect(error).toBeInstanceOf(TrinityCLIError);
      expect(error).toBeInstanceOf(FilesystemError);
    });
  });

  describe('DeploymentError', () => {
    it('should create deployment error', () => {
      const error = new DeploymentError('Deployment failed');

      expect(error.message).toBe('Deployment failed');
      expect(error.code).toBe('DEPLOYMENT_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('DeploymentError');
    });

    it('should create deployment error with context', () => {
      const context = { step: 'agents', filesDeployed: 5 };
      const error = new DeploymentError('Failed to deploy agents', context);

      expect(error.context).toEqual(context);
    });

    it('should be instance of TrinityCLIError', () => {
      const error = new DeploymentError('Deployment failed');

      expect(error).toBeInstanceOf(TrinityCLIError);
      expect(error).toBeInstanceOf(DeploymentError);
    });
  });

  describe('UpdateError', () => {
    it('should create update error', () => {
      const error = new UpdateError('Update failed');

      expect(error.message).toBe('Update failed');
      expect(error.code).toBe('UPDATE_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('UpdateError');
    });

    it('should create update error with context', () => {
      const context = { version: '1.0.0', reason: 'network' };
      const error = new UpdateError('Cannot download update', context);

      expect(error.context).toEqual(context);
    });

    it('should be instance of TrinityCLIError', () => {
      const error = new UpdateError('Update failed');

      expect(error).toBeInstanceOf(TrinityCLIError);
      expect(error).toBeInstanceOf(UpdateError);
    });
  });

  describe('ConfigurationError', () => {
    it('should create configuration error', () => {
      const error = new ConfigurationError('Invalid config');

      expect(error.message).toBe('Invalid config');
      expect(error.code).toBe('CONFIG_ERROR');
      expect(error.exitCode).toBe(1);
      expect(error.name).toBe('ConfigurationError');
    });

    it('should create configuration error with context', () => {
      const context = { file: '.trinityrc', key: 'version' };
      const error = new ConfigurationError('Missing required key', context);

      expect(error.context).toEqual(context);
    });

    it('should be instance of TrinityCLIError', () => {
      const error = new ConfigurationError('Invalid config');

      expect(error).toBeInstanceOf(TrinityCLIError);
      expect(error).toBeInstanceOf(ConfigurationError);
    });
  });

  describe('Error inheritance chain', () => {
    it('should maintain instanceof checks through hierarchy', () => {
      const validationError = new ValidationError('Test');
      const filesystemError = new FilesystemError('Test');
      const deploymentError = new DeploymentError('Test');
      const updateError = new UpdateError('Test');
      const configError = new ConfigurationError('Test');

      // All should be instances of TrinityCLIError
      expect(validationError).toBeInstanceOf(TrinityCLIError);
      expect(filesystemError).toBeInstanceOf(TrinityCLIError);
      expect(deploymentError).toBeInstanceOf(TrinityCLIError);
      expect(updateError).toBeInstanceOf(TrinityCLIError);
      expect(configError).toBeInstanceOf(TrinityCLIError);

      // All should be instances of Error
      expect(validationError).toBeInstanceOf(Error);
      expect(filesystemError).toBeInstanceOf(Error);
      expect(deploymentError).toBeInstanceOf(Error);
      expect(updateError).toBeInstanceOf(Error);
      expect(configError).toBeInstanceOf(Error);

      // But not instances of each other
      expect(validationError).not.toBeInstanceOf(FilesystemError);
      expect(filesystemError).not.toBeInstanceOf(ValidationError);
    });

    it('should catch errors by base class', () => {
      try {
        throw new DeploymentError('Test');
      } catch (error) {
        expect(error).toBeInstanceOf(TrinityCLIError);
        expect(error).toBeInstanceOf(DeploymentError);
      }
    });
  });
});
