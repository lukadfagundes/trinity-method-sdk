/**
 * Console Mocking Utilities for Tests
 *
 * Provides utilities to suppress console output during tests,
 * improving test readability and reducing noise in CI/CD logs.
 */

import { beforeAll, afterAll, jest } from '@jest/globals';

/**
 * Mocks console methods (log, error, warn) for all tests in a suite
 *
 * Usage:
 * ```typescript
 * describe('My Test Suite', () => {
 *   mockConsole(); // Automatically mocks console for all tests
 *
 *   it('should work without console noise', () => {
 *     // Test logic - console output is suppressed
 *   });
 * });
 * ```
 */
export function mockConsole(): void {
  // Save original console methods at the time mockConsole is called
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
  };

  beforeAll(() => {
    // Replace console methods with no-ops
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
  });

  afterAll(() => {
    // Restore original console methods
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  });
}

/**
 * Creates spies for console methods to verify output in tests
 *
 * Usage:
 * ```typescript
 * it('should display error message', () => {
 *   const { errorSpy } = spyOnConsole();
 *
 *   // Test logic that calls console.error
 *
 *   expect(errorSpy).toHaveBeenCalledWith(
 *     expect.stringContaining('Expected error')
 *   );
 * });
 * ```
 *
 * @returns Object with spy references
 */
export function spyOnConsole(): {
  logSpy: jest.SpyInstance;
  errorSpy: jest.SpyInstance;
  warnSpy: jest.SpyInstance;
} {
  return {
    logSpy: jest.spyOn(console, 'log').mockImplementation(),
    errorSpy: jest.spyOn(console, 'error').mockImplementation(),
    warnSpy: jest.spyOn(console, 'warn').mockImplementation(),
  };
}

/**
 * Temporarily allows console output for a specific test
 *
 * Usage:
 * ```typescript
 * describe('My Test Suite', () => {
 *   mockConsole();
 *
 *   it('should show console for debugging', () => {
 *     allowConsoleOutput();
 *     // Console output will be visible for this test
 *   });
 * });
 * ```
 */
export function allowConsoleOutput(): void {
  jest.restoreAllMocks();
}
