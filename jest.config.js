module.exports = {
  projects: [
    {
      displayName: 'src',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
    },
    {
      displayName: 'addons',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/addons'],
      transform: {
        '^.+\\.[t,j]sx?$': 'ts-jest',
      },
      globals: {
        'ts-jest': {
          tsConfig: 'addons/tsconfig.json',
        },
      },
      moduleNameMapper: {
        '@wikia/post-quecast': '<rootDir>/src/index.ts',
      },
    },
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    'addons/**/*.[t,j]s',
    '!src/index.ts',
    '!src/**/*.stub.ts',
    '!src/models/host.ts', // there is only interface there, jest is incorrectly interpreting it
  ],
};
