module.exports = {
  projects: [
    {
      displayName: 'src',
      roots: ['<rootDir>/src'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
      },
    },
    {
      displayName: 'addons',
      roots: ['<rootDir>/addons'],
      transform: {
        '^.+\\.tsx?$': 'ts-jest',
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
    'addons/**/*.ts',
    '!src/index.ts',
    '!src/**/*.stub.ts',
    '!src/models/host.ts', // there is only interface there, jest is incorrectly interpreting it
  ],
};
