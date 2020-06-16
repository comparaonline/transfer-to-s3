module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  roots: ['src/'],
  testEnvironment: 'node',
  testRegex: 'src(/.*)?/__tests__/[^/]*\\.test\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  setupFilesAfterEnv: [

  ],
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**/*.*',
    '!src/test/**/*.*'
  ],
  coverageReporters: [
    'text-summary',
    'lcov',
    'html'
  ]
}
