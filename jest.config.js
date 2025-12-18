/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^ora$': '<rootDir>/tests/__mocks__/ora.ts',
    '^chalk$': '<rootDir>/tests/__mocks__/chalk.ts',
    '^inquirer$': '<rootDir>/tests/__mocks__/inquirer.ts'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'commonjs',
          target: 'ES2022',
          lib: ['ES2022'],
          moduleResolution: 'node',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true
        }
      },
    ],
  },
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 30000, // 30 seconds for integration tests
  verbose: true
};
