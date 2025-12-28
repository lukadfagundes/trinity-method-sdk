/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^ora$': '<rootDir>/tests/__mocks__/ora.ts',
    '^chalk$': '<rootDir>/tests/__mocks__/chalk.ts',
    '^inquirer$': '<rootDir>/tests/__mocks__/inquirer.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'nodenext',
          target: 'ES2022',
          lib: ['ES2022'],
          moduleResolution: 'nodenext',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          isolatedModules: true,
        },
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/index.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  testTimeout: 30000, // 30 seconds for integration tests
  verbose: true,
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^ora$': '<rootDir>/tests/__mocks__/ora.ts',
        '^chalk$': '<rootDir>/tests/__mocks__/chalk.ts',
        '^inquirer$': '<rootDir>/tests/__mocks__/inquirer.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'nodenext',
              target: 'ES2022',
              lib: ['ES2022'],
              moduleResolution: 'nodenext',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              isolatedModules: true,
            },
          },
        ],
      },
      testMatch: ['**/tests/unit/**/*.test.ts'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^ora$': '<rootDir>/tests/__mocks__/ora.ts',
        '^chalk$': '<rootDir>/tests/__mocks__/chalk.ts',
        '^inquirer$': '<rootDir>/tests/__mocks__/inquirer.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'nodenext',
              target: 'ES2022',
              lib: ['ES2022'],
              moduleResolution: 'nodenext',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              isolatedModules: true,
            },
          },
        ],
      },
      testMatch: ['**/tests/integration/**/*.test.ts'],
    },
    {
      displayName: 'e2e',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^ora$': '<rootDir>/tests/__mocks__/ora.ts',
        '^chalk$': '<rootDir>/tests/__mocks__/chalk.ts',
        '^inquirer$': '<rootDir>/tests/__mocks__/inquirer.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'nodenext',
              target: 'ES2022',
              lib: ['ES2022'],
              moduleResolution: 'nodenext',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              isolatedModules: true,
            },
          },
        ],
      },
      testMatch: ['**/tests/e2e/**/*.test.ts'],
    },
    {
      displayName: 'performance',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '^ora$': '<rootDir>/tests/__mocks__/ora.ts',
        '^chalk$': '<rootDir>/tests/__mocks__/chalk.ts',
        '^inquirer$': '<rootDir>/tests/__mocks__/inquirer.ts',
      },
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            useESM: true,
            tsconfig: {
              module: 'nodenext',
              target: 'ES2022',
              lib: ['ES2022'],
              moduleResolution: 'nodenext',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true,
              isolatedModules: true,
            },
          },
        ],
      },
      testMatch: ['**/tests/performance/**/*.test.ts'],
    },
  ],
};
