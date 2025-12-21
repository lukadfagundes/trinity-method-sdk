/**
 * Unit tests for error handler
 * @module tests/unit/cli/utils/error-handler
 */

import { describe, it, expect, beforeEach, afterAll, jest } from '@jest/globals';
import { errorHandler, handleError } from '../../../../src/cli/utils/error-handler.js';
import {
  TrinityCLIError,
  DeploymentError,
  UpdateError,
} from '../../../../src/cli/utils/error-classes.js';

// Mock process.exit to prevent test termination
const mockExit = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
  throw new Error(`process.exit(${code})`);
}) as jest.SpiedFunction<typeof process.exit>;

// Mock console methods to suppress output during tests
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation() as jest.SpiedFunction<
  typeof console.log
>;
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation() as jest.SpiedFunction<
  typeof console.error
>;

describe('Error Handler', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    errorHandler.clearCleanup();
    delete process.env.DEBUG;
  });

  afterAll(() => {
    // Restore all mocks after tests
    mockExit.mockRestore();
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('registerCleanup', () => {
    it('should register cleanup task', () => {
      const cleanup = jest.fn();
      errorHandler.registerCleanup('Test cleanup', cleanup);

      // Cleanup tasks are private, we'll test via handle()
      expect(() => errorHandler.registerCleanup('Test', cleanup)).not.toThrow();
    });

    it('should register multiple cleanup tasks', () => {
      const cleanup1 = jest.fn();
      const cleanup2 = jest.fn();

      errorHandler.registerCleanup('Cleanup 1', cleanup1);
      errorHandler.registerCleanup('Cleanup 2', cleanup2);

      // Both should be registered (tested via handle)
      expect(() => errorHandler.registerCleanup('Test', jest.fn())).not.toThrow();
    });
  });

  describe('clearCleanup', () => {
    it('should clear all registered cleanup tasks', () => {
      const cleanup = jest.fn();
      errorHandler.registerCleanup('Test cleanup', cleanup);

      errorHandler.clearCleanup();

      // After clear, cleanup should not run
      // (We can't directly test this, but we ensure clearCleanup doesn't throw)
      expect(() => errorHandler.clearCleanup()).not.toThrow();
    });
  });

  describe('handle - TrinityCLIError', () => {
    it('should handle TrinityCLIError and exit with correct code', async () => {
      const error = new TrinityCLIError('Test error', 'TEST_ERROR', 42);

      await expect(errorHandler.handle(error)).rejects.toThrow('process.exit(42)');
    });

    it('should display formatted error message', async () => {
      const error = new DeploymentError('Deployment failed');

      await expect(errorHandler.handle(error)).rejects.toThrow();

      // Should call displayError with formatted message
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should show context in debug mode', async () => {
      process.env.DEBUG = 'true';
      const context = { step: 'agents', count: 5 };
      const error = new DeploymentError('Deploy failed', context);

      await expect(errorHandler.handle(error)).rejects.toThrow();

      // Should call console.error multiple times (error + "Context:" + context JSON)
      expect(mockConsoleError.mock.calls.length).toBeGreaterThan(1);
    });

    it('should show stack trace in debug mode', async () => {
      process.env.DEBUG = 'true';
      const error = new UpdateError('Update failed');

      await expect(errorHandler.handle(error)).rejects.toThrow();

      // Stack trace logging would happen in debug mode
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should not show context without debug mode', async () => {
      delete process.env.DEBUG;
      const context = { step: 'agents' };
      const error = new DeploymentError('Deploy failed', context);

      await expect(errorHandler.handle(error)).rejects.toThrow();

      // Context should not be logged without DEBUG
      const calls = mockConsoleError.mock.calls.map((call) => call.join(' '));
      const contextLogged = calls.some((call) => call.includes('Context:'));
      expect(contextLogged).toBe(false);
    });
  });

  describe('handle - Standard Error', () => {
    it('should handle standard Error and exit with code 1', async () => {
      const error = new Error('Standard error');

      await expect(errorHandler.handle(error)).rejects.toThrow('process.exit(1)');
    });

    it('should display error message', async () => {
      const error = new Error('Test error message');

      await expect(errorHandler.handle(error)).rejects.toThrow();

      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should show stack trace in debug mode', async () => {
      process.env.DEBUG = 'true';
      const error = new Error('Test error');

      await expect(errorHandler.handle(error)).rejects.toThrow();

      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('handle - Unknown Error', () => {
    it('should handle unknown error types', async () => {
      const error = 'string error';

      await expect(errorHandler.handle(error)).rejects.toThrow('process.exit(1)');
    });

    it('should handle null error', async () => {
      await expect(errorHandler.handle(null)).rejects.toThrow('process.exit(1)');
    });

    it('should handle undefined error', async () => {
      await expect(errorHandler.handle(undefined)).rejects.toThrow('process.exit(1)');
    });

    it('should handle object error', async () => {
      const error = { code: 'ERR', message: 'Object error' };

      await expect(errorHandler.handle(error)).rejects.toThrow('process.exit(1)');
    });
  });

  describe('handle - Cleanup Execution', () => {
    it('should run cleanup tasks before exit', async () => {
      const cleanup = jest.fn();
      errorHandler.registerCleanup('Test cleanup', cleanup);

      const error = new Error('Test error');
      await expect(errorHandler.handle(error)).rejects.toThrow();

      expect(cleanup).toHaveBeenCalled();
    });

    it('should run multiple cleanup tasks in order', async () => {
      const order: number[] = [];
      const cleanup1 = jest.fn(() => order.push(1));
      const cleanup2 = jest.fn(() => order.push(2));
      const cleanup3 = jest.fn(() => order.push(3));

      errorHandler.registerCleanup('Cleanup 1', cleanup1);
      errorHandler.registerCleanup('Cleanup 2', cleanup2);
      errorHandler.registerCleanup('Cleanup 3', cleanup3);

      const error = new Error('Test');
      await expect(errorHandler.handle(error)).rejects.toThrow();

      expect(order).toEqual([1, 2, 3]);
    });

    it('should handle async cleanup tasks', async () => {
      const cleanup = jest.fn(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      errorHandler.registerCleanup('Async cleanup', cleanup);

      const error = new Error('Test');
      await expect(errorHandler.handle(error)).rejects.toThrow();

      expect(cleanup).toHaveBeenCalled();
    });

    it('should continue cleanup if one task fails', async () => {
      const cleanup1 = jest.fn(() => {
        throw new Error('Cleanup 1 failed');
      });
      const cleanup2 = jest.fn();

      errorHandler.registerCleanup('Failing cleanup', cleanup1);
      errorHandler.registerCleanup('Good cleanup', cleanup2);

      const error = new Error('Test');
      await expect(errorHandler.handle(error)).rejects.toThrow();

      expect(cleanup1).toHaveBeenCalled();
      expect(cleanup2).toHaveBeenCalled();
    });

    it('should clear cleanup tasks after execution', async () => {
      const cleanup = jest.fn();
      errorHandler.registerCleanup('Test cleanup', cleanup);

      const error = new Error('Test');
      await expect(errorHandler.handle(error)).rejects.toThrow();

      // Cleanup should be called once
      expect(cleanup).toHaveBeenCalledTimes(1);

      // Second error should not run cleanup again (tasks cleared)
      jest.clearAllMocks();
      await expect(errorHandler.handle(new Error('Test 2'))).rejects.toThrow();
      expect(cleanup).not.toHaveBeenCalled();
    });
  });

  describe('wrap', () => {
    it('should wrap async function with error handling', async () => {
      const fn = jest.fn(async () => {
        throw new Error('Function error');
      });

      const wrapped = errorHandler.wrap(fn);

      await expect(wrapped()).rejects.toThrow('process.exit(1)');
      expect(fn).toHaveBeenCalled();
    });

    it('should return result on success', async () => {
      const fn = jest.fn(async () => 'success');

      const wrapped = errorHandler.wrap(fn);

      const result = await wrapped();
      expect(result).toBe('success');
    });

    it('should pass arguments to wrapped function', async () => {
      const fn = jest.fn(async (a: number, b: string) => `${a}-${b}`);

      const wrapped = errorHandler.wrap(fn);

      const result = await wrapped(42, 'test');
      expect(result).toBe('42-test');
      expect(fn).toHaveBeenCalledWith(42, 'test');
    });

    it('should handle errors thrown by wrapped function', async () => {
      const fn = jest.fn(async () => {
        throw new DeploymentError('Deploy failed');
      });

      const wrapped = errorHandler.wrap(fn);

      await expect(wrapped()).rejects.toThrow('process.exit(1)');
    });

    it('should run cleanup when wrapped function throws', async () => {
      const cleanup = jest.fn();
      errorHandler.registerCleanup('Test cleanup', cleanup);

      const fn = jest.fn(async () => {
        throw new Error('Function error');
      });

      const wrapped = errorHandler.wrap(fn);

      await expect(wrapped()).rejects.toThrow();
      expect(cleanup).toHaveBeenCalled();
    });
  });

  describe('handleError utility function', () => {
    it('should be a convenience wrapper for errorHandler.handle', async () => {
      const error = new Error('Test');

      await expect(handleError(error)).rejects.toThrow('process.exit(1)');
    });

    it('should run cleanup tasks', async () => {
      const cleanup = jest.fn();
      errorHandler.registerCleanup('Test cleanup', cleanup);

      await expect(handleError(new Error('Test'))).rejects.toThrow();
      expect(cleanup).toHaveBeenCalled();
    });
  });
});
