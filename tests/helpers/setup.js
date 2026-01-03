/**
 * Vitest Setup File
 *
 * Global setup for all tests
 */

import { registerCustomMatchers } from './assertions.js';

// Register custom matchers
registerCustomMatchers();

// Global test configuration
beforeAll(() => {
  // Set consistent timezone for tests
  process.env.TZ = 'UTC';
});

// Clean up after all tests
afterAll(() => {
  // Any global cleanup
});
