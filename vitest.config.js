import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      include: ['bin/**/*.js', 'lib/**/*.js'],
      exclude: ['node_modules', 'tests'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    reporters: ['default', 'json'],
    outputFile: {
      json: './test-results.json',
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
      },
    },
    // Benchmark configuration
    benchmark: {
      include: ['tests/performance/**/*.bench.js'],
      reporters: ['default'],
    },
    // Setup files
    setupFiles: ['./tests/helpers/setup.js'],
  },
});
