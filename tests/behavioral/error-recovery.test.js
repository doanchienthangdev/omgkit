/**
 * Behavioral Tests for Error Recovery
 *
 * Tests system behavior during error conditions and recovery
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const TEMP_DIR = join(PACKAGE_ROOT, 'tests/.temp-recovery');

// Helper for delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock component with recoverable state
 */
class RecoverableComponent {
  constructor() {
    this.state = 'initialized';
    this.data = null;
    this.errorCount = 0;
    this.recoveryAttempts = 0;
    this.lastError = null;
  }

  async initialize(data) {
    try {
      this.state = 'initializing';
      await delay(10);

      if (data === 'fail') {
        throw new Error('Initialization failed');
      }

      this.data = data;
      this.state = 'ready';
      return { success: true };
    } catch (e) {
      this.state = 'error';
      this.lastError = e;
      this.errorCount++;
      return { success: false, error: e.message };
    }
  }

  async recover() {
    this.recoveryAttempts++;
    this.state = 'recovering';
    await delay(5);

    if (this.errorCount > 3) {
      this.state = 'unrecoverable';
      return { success: false, error: 'Too many errors' };
    }

    this.state = 'recovered';
    this.lastError = null;
    return { success: true };
  }

  async reset() {
    this.state = 'initialized';
    this.data = null;
    this.errorCount = 0;
    this.recoveryAttempts = 0;
    this.lastError = null;
    return { success: true };
  }

  getStatus() {
    return {
      state: this.state,
      errorCount: this.errorCount,
      recoveryAttempts: this.recoveryAttempts,
      hasError: this.lastError !== null,
    };
  }
}

/**
 * Mock registry with corruption handling
 */
class ResilientRegistry {
  constructor() {
    this.data = new Map();
    this.backup = new Map();
    this.corrupted = false;
    this.lastSave = null;
  }

  save(key, value) {
    // Create backup before writing
    if (this.data.has(key)) {
      this.backup.set(key, this.data.get(key));
    }

    try {
      this.data.set(key, value);
      this.lastSave = Date.now();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  load(key) {
    if (this.corrupted) {
      // Try to restore from backup
      if (this.backup.has(key)) {
        this.data.set(key, this.backup.get(key));
        return { value: this.backup.get(key), restored: true };
      }
      return { error: 'Data corrupted and no backup available' };
    }

    if (!this.data.has(key)) {
      return { error: 'Key not found' };
    }

    return { value: this.data.get(key) };
  }

  corrupt() {
    this.corrupted = true;
  }

  repair() {
    this.corrupted = false;
    // Restore all from backup
    for (const [key, value] of this.backup) {
      this.data.set(key, value);
    }
    return { success: true, restored: this.backup.size };
  }

  createBackup() {
    this.backup = new Map(this.data);
    return { success: true, items: this.backup.size };
  }
}

/**
 * Mock file processor with retry logic
 */
class RetryableFileProcessor {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 100;
    this.failingPaths = new Set();
    this.processLog = [];
  }

  setFailingPath(path) {
    this.failingPaths.add(path);
  }

  clearFailingPath(path) {
    this.failingPaths.delete(path);
  }

  async processWithRetry(path, content) {
    let attempts = 0;
    let lastError = null;

    while (attempts < this.maxRetries) {
      attempts++;
      this.processLog.push({ path, attempt: attempts, time: Date.now() });

      try {
        if (this.failingPaths.has(path)) {
          throw new Error(`Cannot process ${path}`);
        }

        await delay(10);
        return {
          success: true,
          path,
          attempts,
        };
      } catch (e) {
        lastError = e;
        if (attempts < this.maxRetries) {
          await delay(this.retryDelay);
        }
      }
    }

    return {
      success: false,
      path,
      attempts,
      error: lastError.message,
    };
  }

  getProcessLog() {
    return [...this.processLog];
  }

  clearLog() {
    this.processLog = [];
  }
}

/**
 * Mock transaction manager
 */
class TransactionManager {
  constructor() {
    this.transactions = new Map();
    this.committed = [];
    this.rolledBack = [];
  }

  begin(id) {
    this.transactions.set(id, {
      id,
      operations: [],
      state: 'pending',
      startTime: Date.now(),
    });
    return { transactionId: id };
  }

  addOperation(transactionId, operation) {
    const tx = this.transactions.get(transactionId);
    if (!tx) {
      return { error: 'Transaction not found' };
    }
    if (tx.state !== 'pending') {
      return { error: 'Transaction not in pending state' };
    }
    tx.operations.push(operation);
    return { success: true };
  }

  async commit(transactionId) {
    const tx = this.transactions.get(transactionId);
    if (!tx) {
      return { error: 'Transaction not found' };
    }

    try {
      tx.state = 'committing';

      for (const op of tx.operations) {
        if (op.shouldFail) {
          throw new Error(`Operation failed: ${op.name}`);
        }
        await delay(5);
      }

      tx.state = 'committed';
      this.committed.push(transactionId);
      return { success: true };
    } catch (e) {
      tx.state = 'failed';
      return {
        success: false,
        error: e.message,
        needsRollback: true,
      };
    }
  }

  async rollback(transactionId) {
    const tx = this.transactions.get(transactionId);
    if (!tx) {
      return { error: 'Transaction not found' };
    }

    tx.state = 'rolling_back';
    await delay(10);

    tx.state = 'rolled_back';
    this.rolledBack.push(transactionId);
    return { success: true, operationsRolledBack: tx.operations.length };
  }

  getTransaction(id) {
    return this.transactions.get(id);
  }
}

/**
 * Mock circuit breaker
 */
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 1000;
    this.failures = 0;
    this.state = 'closed';
    this.lastFailure = null;
    this.callLog = [];
  }

  async execute(fn) {
    if (this.state === 'open') {
      const timeSinceFailure = Date.now() - this.lastFailure;
      if (timeSinceFailure < this.resetTimeout) {
        this.callLog.push({ state: 'open', blocked: true });
        return { error: 'Circuit breaker is open' };
      }
      this.state = 'half-open';
    }

    try {
      const result = await fn();
      this.callLog.push({ state: this.state, success: true });

      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }

      return { success: true, result };
    } catch (e) {
      this.failures++;
      this.lastFailure = Date.now();
      this.callLog.push({ state: this.state, success: false, error: e.message });

      if (this.failures >= this.failureThreshold) {
        this.state = 'open';
      }

      return { success: false, error: e.message };
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailure: this.lastFailure,
    };
  }

  reset() {
    this.state = 'closed';
    this.failures = 0;
    this.lastFailure = null;
    this.callLog = [];
  }
}

describe('Error Recovery Behavioral Tests', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = TEMP_DIR;
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('Component Recovery', () => {
    it('recovers from initialization failure', async () => {
      const component = new RecoverableComponent();

      // Fail first
      const failResult = await component.initialize('fail');
      expect(failResult.success).toBe(false);
      expect(component.getStatus().state).toBe('error');

      // Recover
      const recoverResult = await component.recover();
      expect(recoverResult.success).toBe(true);
      expect(component.getStatus().state).toBe('recovered');

      // Successfully initialize after recovery
      const successResult = await component.initialize('valid-data');
      expect(successResult.success).toBe(true);
      expect(component.getStatus().state).toBe('ready');
    });

    it('tracks error count', async () => {
      const component = new RecoverableComponent();

      await component.initialize('fail');
      await component.initialize('fail');
      await component.initialize('fail');

      expect(component.getStatus().errorCount).toBe(3);
    });

    it('becomes unrecoverable after too many errors', async () => {
      const component = new RecoverableComponent();

      for (let i = 0; i < 5; i++) {
        await component.initialize('fail');
      }

      const recoverResult = await component.recover();
      expect(recoverResult.success).toBe(false);
      expect(recoverResult.error).toBe('Too many errors');
      expect(component.getStatus().state).toBe('unrecoverable');
    });

    it('reset clears all error state', async () => {
      const component = new RecoverableComponent();

      await component.initialize('fail');
      await component.initialize('fail');

      const status1 = component.getStatus();
      expect(status1.errorCount).toBe(2);

      await component.reset();

      const status2 = component.getStatus();
      expect(status2.errorCount).toBe(0);
      expect(status2.state).toBe('initialized');
      expect(status2.hasError).toBe(false);
    });
  });

  describe('Registry Corruption Recovery', () => {
    it('creates and restores from backup', () => {
      const registry = new ResilientRegistry();

      registry.save('key1', 'value1');
      registry.save('key2', 'value2');

      registry.createBackup();

      registry.save('key1', 'modified');
      registry.corrupt();

      const result = registry.load('key1');
      expect(result.value).toBe('value1');
      expect(result.restored).toBe(true);
    });

    it('repairs corrupted registry', () => {
      const registry = new ResilientRegistry();

      registry.save('key1', 'value1');
      registry.save('key2', 'value2');
      registry.createBackup();

      registry.corrupt();

      const repairResult = registry.repair();
      expect(repairResult.success).toBe(true);
      expect(repairResult.restored).toBe(2);

      const loadResult = registry.load('key1');
      expect(loadResult.value).toBe('value1');
    });

    it('handles missing backup gracefully', () => {
      const registry = new ResilientRegistry();

      registry.save('key1', 'value1');
      registry.corrupt();

      const result = registry.load('key1');
      expect(result.error).toContain('no backup');
    });
  });

  describe('Retry Logic', () => {
    it('succeeds on first try when no errors', async () => {
      const processor = new RetryableFileProcessor({ maxRetries: 3 });

      const result = await processor.processWithRetry('/test.md', 'content');

      expect(result.success).toBe(true);
      expect(result.attempts).toBe(1);
    });

    it('retries on failure', async () => {
      const processor = new RetryableFileProcessor({
        maxRetries: 3,
        retryDelay: 10,
      });

      processor.setFailingPath('/test.md');

      // Start processing (will fail)
      const resultPromise = processor.processWithRetry('/test.md', 'content');

      // Clear failure after small delay
      setTimeout(() => processor.clearFailingPath('/test.md'), 25);

      const result = await resultPromise;

      // Should have retried and eventually succeeded
      expect(result.attempts).toBeGreaterThan(1);
    });

    it('fails after max retries', async () => {
      const processor = new RetryableFileProcessor({
        maxRetries: 3,
        retryDelay: 10,
      });

      processor.setFailingPath('/test.md');

      const result = await processor.processWithRetry('/test.md', 'content');

      expect(result.success).toBe(false);
      expect(result.attempts).toBe(3);
      expect(result.error).toContain('Cannot process');
    });

    it('logs all retry attempts', async () => {
      const processor = new RetryableFileProcessor({
        maxRetries: 3,
        retryDelay: 10,
      });

      processor.setFailingPath('/test.md');
      await processor.processWithRetry('/test.md', 'content');

      const log = processor.getProcessLog();
      expect(log.length).toBe(3);
      expect(log[0].attempt).toBe(1);
      expect(log[1].attempt).toBe(2);
      expect(log[2].attempt).toBe(3);
    });
  });

  describe('Transaction Rollback', () => {
    it('commits successful transaction', async () => {
      const tm = new TransactionManager();

      tm.begin('tx1');
      tm.addOperation('tx1', { name: 'op1' });
      tm.addOperation('tx1', { name: 'op2' });

      const result = await tm.commit('tx1');

      expect(result.success).toBe(true);
      expect(tm.getTransaction('tx1').state).toBe('committed');
    });

    it('rolls back failed transaction', async () => {
      const tm = new TransactionManager();

      tm.begin('tx1');
      tm.addOperation('tx1', { name: 'op1' });
      tm.addOperation('tx1', { name: 'op2', shouldFail: true });
      tm.addOperation('tx1', { name: 'op3' });

      const commitResult = await tm.commit('tx1');
      expect(commitResult.success).toBe(false);
      expect(commitResult.needsRollback).toBe(true);

      const rollbackResult = await tm.rollback('tx1');
      expect(rollbackResult.success).toBe(true);
      expect(rollbackResult.operationsRolledBack).toBe(3);
    });

    it('tracks committed and rolled back transactions', async () => {
      const tm = new TransactionManager();

      // Successful transaction
      tm.begin('tx1');
      tm.addOperation('tx1', { name: 'op1' });
      await tm.commit('tx1');

      // Failed transaction
      tm.begin('tx2');
      tm.addOperation('tx2', { name: 'op1', shouldFail: true });
      await tm.commit('tx2');
      await tm.rollback('tx2');

      expect(tm.committed).toContain('tx1');
      expect(tm.rolledBack).toContain('tx2');
    });

    it('prevents operations on completed transaction', async () => {
      const tm = new TransactionManager();

      tm.begin('tx1');
      await tm.commit('tx1');

      const result = tm.addOperation('tx1', { name: 'op1' });
      expect(result.error).toBe('Transaction not in pending state');
    });
  });

  describe('Circuit Breaker', () => {
    it('starts in closed state', () => {
      const cb = new CircuitBreaker();
      expect(cb.getState().state).toBe('closed');
    });

    it('opens after threshold failures', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });

      for (let i = 0; i < 3; i++) {
        await cb.execute(() => Promise.reject(new Error('fail')));
      }

      expect(cb.getState().state).toBe('open');
    });

    it('blocks calls when open', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 1000 });

      await cb.execute(() => Promise.reject(new Error('fail')));
      await cb.execute(() => Promise.reject(new Error('fail')));

      const result = await cb.execute(() => Promise.resolve('success'));
      expect(result.error).toBe('Circuit breaker is open');
    });

    it('enters half-open state after timeout', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 50 });

      await cb.execute(() => Promise.reject(new Error('fail')));
      await cb.execute(() => Promise.reject(new Error('fail')));

      expect(cb.getState().state).toBe('open');

      await delay(60);

      // Next call should be allowed (half-open)
      const result = await cb.execute(() => Promise.resolve('success'));
      expect(result.success).toBe(true);
      expect(cb.getState().state).toBe('closed');
    });

    it('reopens on failure in half-open state', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 50 });

      await cb.execute(() => Promise.reject(new Error('fail')));
      await cb.execute(() => Promise.reject(new Error('fail')));

      await delay(60);

      await cb.execute(() => Promise.reject(new Error('fail again')));
      expect(cb.getState().state).toBe('open');
    });

    it('logs all call attempts', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });

      await cb.execute(() => Promise.resolve('ok'));
      await cb.execute(() => Promise.reject(new Error('fail')));
      await cb.execute(() => Promise.resolve('ok'));

      expect(cb.callLog.length).toBe(3);
      expect(cb.callLog[0].success).toBe(true);
      expect(cb.callLog[1].success).toBe(false);
      expect(cb.callLog[2].success).toBe(true);
    });
  });

  describe('Graceful Degradation', () => {
    it('provides fallback when primary fails', async () => {
      const primaryFails = true;

      const result = await (async () => {
        try {
          if (primaryFails) {
            throw new Error('Primary failed');
          }
          return { source: 'primary', data: 'primary-data' };
        } catch (e) {
          // Fallback
          return { source: 'fallback', data: 'cached-data' };
        }
      })();

      expect(result.source).toBe('fallback');
      expect(result.data).toBe('cached-data');
    });

    it('returns partial results when some operations fail', async () => {
      const operations = [
        { id: 1, shouldFail: false },
        { id: 2, shouldFail: true },
        { id: 3, shouldFail: false },
        { id: 4, shouldFail: true },
        { id: 5, shouldFail: false },
      ];

      const results = await Promise.allSettled(
        operations.map(async (op) => {
          if (op.shouldFail) {
            throw new Error(`Op ${op.id} failed`);
          }
          return { id: op.id, data: `data-${op.id}` };
        })
      );

      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      expect(successful.length).toBe(3);
      expect(failed.length).toBe(2);
    });

    it('continues processing after individual failures', async () => {
      const items = [1, 2, 3, 4, 5];
      const results = [];
      const errors = [];

      for (const item of items) {
        try {
          if (item === 3) {
            throw new Error('Item 3 failed');
          }
          results.push(item * 2);
        } catch (e) {
          errors.push({ item, error: e.message });
        }
      }

      expect(results).toEqual([2, 4, 8, 10]);
      expect(errors.length).toBe(1);
      expect(errors[0].item).toBe(3);
    });
  });

  describe('File System Error Recovery', () => {
    it('recovers from corrupted file', async () => {
      const filePath = join(tempDir, 'test.json');
      const backupPath = join(tempDir, 'test.json.backup');

      // Write original file
      writeFileSync(filePath, JSON.stringify({ key: 'value' }));

      // Create backup
      writeFileSync(backupPath, readFileSync(filePath));

      // Corrupt the file
      writeFileSync(filePath, 'corrupted{{{{');

      // Attempt to read and recover
      let data;
      try {
        data = JSON.parse(readFileSync(filePath, 'utf8'));
      } catch (e) {
        // Read from backup
        data = JSON.parse(readFileSync(backupPath, 'utf8'));
      }

      expect(data.key).toBe('value');
    });

    it('handles missing file gracefully', () => {
      const filePath = join(tempDir, 'nonexistent.json');

      let data;
      let error = null;

      try {
        data = JSON.parse(readFileSync(filePath, 'utf8'));
      } catch (e) {
        error = e;
        data = { default: 'value' };
      }

      expect(error).not.toBeNull();
      expect(data.default).toBe('value');
    });

    it('creates directory if missing', () => {
      const deepPath = join(tempDir, 'a', 'b', 'c');
      const filePath = join(deepPath, 'test.txt');

      if (!existsSync(deepPath)) {
        mkdirSync(deepPath, { recursive: true });
      }

      writeFileSync(filePath, 'content');

      expect(existsSync(filePath)).toBe(true);
    });
  });
});

describe('Error Recovery Invariants', () => {
  it('error state is always recoverable until threshold', async () => {
    const component = new RecoverableComponent();

    for (let i = 0; i < 3; i++) {
      await component.initialize('fail');
      const recoverResult = await component.recover();
      expect(recoverResult.success).toBe(true);
    }
  });

  it('circuit breaker state transitions are valid', async () => {
    const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 50 });

    // closed -> closed (success)
    await cb.execute(() => Promise.resolve('ok'));
    expect(cb.getState().state).toBe('closed');

    // closed -> open (failures)
    await cb.execute(() => Promise.reject(new Error('fail')));
    await cb.execute(() => Promise.reject(new Error('fail')));
    expect(cb.getState().state).toBe('open');

    // open -> half-open (timeout)
    await delay(60);
    await cb.execute(() => Promise.resolve('ok'));
    expect(cb.getState().state).toBe('closed');
  });

  it('transactions never leave data in inconsistent state', async () => {
    const tm = new TransactionManager();

    tm.begin('tx1');
    tm.addOperation('tx1', { name: 'op1' });
    tm.addOperation('tx1', { name: 'op2', shouldFail: true });

    const commitResult = await tm.commit('tx1');

    if (!commitResult.success) {
      await tm.rollback('tx1');
    }

    const tx = tm.getTransaction('tx1');
    expect(['committed', 'rolled_back']).toContain(tx.state);
  });

  it('retry attempts are bounded', async () => {
    const processor = new RetryableFileProcessor({
      maxRetries: 5,
      retryDelay: 1,
    });

    processor.setFailingPath('/test.md');

    const result = await processor.processWithRetry('/test.md', 'content');

    expect(result.attempts).toBeLessThanOrEqual(5);
  });
});
