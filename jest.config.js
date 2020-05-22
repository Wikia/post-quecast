module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/addons'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    'addons/**/*.ts',
    '!src/**/*.stub.ts',
    '!src/index.ts',
    '!src/models/host.ts', // there is only interface there, jest is incorrectly interpreting it
  ],
};
