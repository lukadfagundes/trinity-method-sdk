export default {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
  transform: {},

  // Coverage Configuration (WO-013)
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js', // Entry point, hard to test
    '!**/node_modules/**',
    '!**/test-temp*/**',
    '!**/coverage/**'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  testMatch: [
    '**/tests/**/*.test.js',
  ],
  verbose: true,
};
