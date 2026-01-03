/**
 * Performance Testing Utilities
 *
 * Utilities for measuring and validating performance
 */

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @param {Array} args - Arguments to pass to function
 * @returns {Promise<{result: any, time: number}>}
 */
export async function measureTime(fn, ...args) {
  const start = performance.now();
  const result = await fn(...args);
  const time = performance.now() - start;
  return { result, time };
}

/**
 * Measure execution time synchronously
 * @param {Function} fn - Function to measure
 * @param {Array} args - Arguments to pass to function
 * @returns {{result: any, time: number}}
 */
export function measureTimeSync(fn, ...args) {
  const start = performance.now();
  const result = fn(...args);
  const time = performance.now() - start;
  return { result, time };
}

/**
 * Run function multiple times and collect timing stats
 * @param {Function} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 * @param {Array} args - Arguments to pass to function
 * @returns {Promise<{times: number[], stats: {min: number, max: number, mean: number, median: number, p95: number, p99: number}}>}
 */
export async function benchmark(fn, iterations = 10, ...args) {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const { time } = await measureTime(fn, ...args);
    times.push(time);
  }

  return {
    times,
    stats: calculateStats(times),
  };
}

/**
 * Run function multiple times synchronously
 * @param {Function} fn - Function to benchmark
 * @param {number} iterations - Number of iterations
 * @param {Array} args - Arguments to pass to function
 * @returns {{times: number[], stats: object}}
 */
export function benchmarkSync(fn, iterations = 10, ...args) {
  const times = [];

  for (let i = 0; i < iterations; i++) {
    const { time } = measureTimeSync(fn, ...args);
    times.push(time);
  }

  return {
    times,
    stats: calculateStats(times),
  };
}

/**
 * Calculate percentile from sorted array
 * @param {number[]} sortedArr - Sorted array of numbers
 * @param {number} p - Percentile (0-100)
 * @returns {number}
 */
export function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Calculate statistical measures
 * @param {number[]} times - Array of timing measurements
 * @returns {{min: number, max: number, mean: number, median: number, p95: number, p99: number, stdDev: number}}
 */
export function calculateStats(times) {
  if (times.length === 0) {
    return { min: 0, max: 0, mean: 0, median: 0, p95: 0, p99: 0, stdDev: 0 };
  }

  const sorted = [...times].sort((a, b) => a - b);
  const sum = times.reduce((a, b) => a + b, 0);
  const mean = sum / times.length;
  const median = sorted[Math.floor(sorted.length / 2)];

  // Standard deviation
  const squaredDiffs = times.map(t => Math.pow(t - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / times.length;
  const stdDev = Math.sqrt(avgSquaredDiff);

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median,
    p95: percentile(times, 95),
    p99: percentile(times, 99),
    stdDev,
  };
}

/**
 * Assert function completes under SLA
 * @param {Function} fn - Function to test
 * @param {number} maxMs - Maximum allowed time in milliseconds
 * @param {Array} args - Arguments to pass to function
 * @returns {Promise<{passed: boolean, time: number}>}
 */
export async function assertUnderSLA(fn, maxMs, ...args) {
  const { result, time } = await measureTime(fn, ...args);
  return {
    passed: time <= maxMs,
    time,
    result,
    message: time <= maxMs
      ? `Completed in ${time.toFixed(2)}ms (under ${maxMs}ms SLA)`
      : `Exceeded SLA: ${time.toFixed(2)}ms > ${maxMs}ms`,
  };
}

/**
 * Assert function completes under SLA with retries
 * @param {Function} fn - Function to test
 * @param {number} maxMs - Maximum allowed time in milliseconds
 * @param {number} retries - Number of retries
 * @param {Array} args - Arguments to pass to function
 * @returns {Promise<{passed: boolean, times: number[], bestTime: number}>}
 */
export async function assertUnderSLAWithRetries(fn, maxMs, retries = 3, ...args) {
  const times = [];

  for (let i = 0; i < retries; i++) {
    const { time } = await measureTime(fn, ...args);
    times.push(time);
    if (time <= maxMs) {
      return {
        passed: true,
        times,
        bestTime: Math.min(...times),
        message: `Passed on attempt ${i + 1} with ${time.toFixed(2)}ms`,
      };
    }
  }

  return {
    passed: false,
    times,
    bestTime: Math.min(...times),
    message: `Failed all ${retries} attempts. Best: ${Math.min(...times).toFixed(2)}ms, SLA: ${maxMs}ms`,
  };
}

/**
 * Memory usage measurement
 * @returns {{heapUsed: number, heapTotal: number, external: number, rss: number}}
 */
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: usage.heapUsed / 1024 / 1024, // MB
    heapTotal: usage.heapTotal / 1024 / 1024, // MB
    external: usage.external / 1024 / 1024, // MB
    rss: usage.rss / 1024 / 1024, // MB
  };
}

/**
 * Measure memory impact of function
 * @param {Function} fn - Function to measure
 * @param {Array} args - Arguments to pass to function
 * @returns {Promise<{result: any, memoryBefore: object, memoryAfter: object, memoryDelta: number}>}
 */
export async function measureMemory(fn, ...args) {
  // Force GC if available
  if (global.gc) global.gc();

  const memoryBefore = getMemoryUsage();
  const result = await fn(...args);
  const memoryAfter = getMemoryUsage();

  return {
    result,
    memoryBefore,
    memoryAfter,
    memoryDelta: memoryAfter.heapUsed - memoryBefore.heapUsed,
  };
}

/**
 * Create a timeout wrapper for async functions
 * @param {Function} fn - Async function to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Function}
 */
export function withTimeout(fn, timeoutMs) {
  return async (...args) => {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
  };
}

/**
 * Performance SLA definitions for OMGKIT
 */
export const OMGKIT_SLAS = {
  install: {
    fresh: 5000, // 5 seconds
    reinstall: 2000, // 2 seconds
  },
  graphBuild: 500, // 500ms
  search: 100, // 100ms
  validation: {
    single: 50, // 50ms per component
    full: 60000, // 60 seconds for full suite
  },
  parse: {
    frontmatter: 10, // 10ms
    yaml: 20, // 20ms
  },
};

/**
 * Format timing stats for display
 * @param {object} stats - Stats object from calculateStats
 * @returns {string}
 */
export function formatStats(stats) {
  return [
    `min: ${stats.min.toFixed(2)}ms`,
    `max: ${stats.max.toFixed(2)}ms`,
    `mean: ${stats.mean.toFixed(2)}ms`,
    `median: ${stats.median.toFixed(2)}ms`,
    `p95: ${stats.p95.toFixed(2)}ms`,
    `p99: ${stats.p99.toFixed(2)}ms`,
    `stdDev: ${stats.stdDev.toFixed(2)}ms`,
  ].join(', ');
}

export default {
  measureTime,
  measureTimeSync,
  benchmark,
  benchmarkSync,
  percentile,
  calculateStats,
  assertUnderSLA,
  assertUnderSLAWithRetries,
  getMemoryUsage,
  measureMemory,
  withTimeout,
  OMGKIT_SLAS,
  formatStats,
};
