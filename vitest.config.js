import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['bin/**/*.js', 'lib/**/*.js'],
      exclude: ['node_modules', 'tests']
    },
    testTimeout: 30000
  }
});
