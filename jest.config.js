module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.stub.ts',
    '!src/models/host.ts', // there is only interface there, jest is incorrectly interpreting it
  ],
};
