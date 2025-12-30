/**
 * Integration Tests
 *
 * Tests the complete OMGKIT workflow:
 * - Install → Init → Doctor → Uninstall
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import {
  setPackageRoot,
  installPlugin,
  initProject,
  doctor,
  uninstallPlugin,
  getPluginDir,
  isPluginInstalled,
  isProjectInitialized,
  countFiles
} from '../../lib/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const TEST_HOME = join(__dirname, '../fixtures/integration-home');
const TEST_PROJECT = join(__dirname, '../fixtures/integration-project');

// Set package root for tests
setPackageRoot(PACKAGE_ROOT);

describe('Integration: Complete Workflow', () => {
  beforeAll(() => {
    // Clean up any previous test artifacts
    rmSync(TEST_HOME, { recursive: true, force: true });
    rmSync(TEST_PROJECT, { recursive: true, force: true });
    mkdirSync(TEST_HOME, { recursive: true });
    mkdirSync(TEST_PROJECT, { recursive: true });
  });

  afterAll(() => {
    // Clean up
    rmSync(TEST_HOME, { recursive: true, force: true });
    rmSync(TEST_PROJECT, { recursive: true, force: true });
  });

  describe('Fresh Installation Workflow', () => {
    it('Step 1: Plugin should not be installed initially', () => {
      expect(isPluginInstalled(TEST_HOME)).toBe(false);
    });

    it('Step 2: Doctor should report not installed', () => {
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.plugin.installed).toBe(false);
      expect(result.project.initialized).toBe(false);
    });

    it('Step 3: Install plugin', () => {
      const result = installPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result.success).toBe(true);
      expect(isPluginInstalled(TEST_HOME)).toBe(true);
    });

    it('Step 4: Doctor should report installed', () => {
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.plugin.installed).toBe(true);
      expect(result.plugin.components.agents).toBe(true);
      expect(result.plugin.components.commands).toBe(true);
      expect(result.plugin.components.skills).toBe(true);
      expect(result.plugin.components.modes).toBe(true);
    });

    it('Step 5: Project should not be initialized', () => {
      expect(isProjectInitialized(TEST_PROJECT)).toBe(false);
    });

    it('Step 6: Initialize project', () => {
      const result = initProject({ cwd: TEST_PROJECT, silent: true });
      expect(result.success).toBe(true);
      expect(isProjectInitialized(TEST_PROJECT)).toBe(true);
    });

    it('Step 7: Doctor should report both installed and initialized', () => {
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.plugin.installed).toBe(true);
      expect(result.project.initialized).toBe(true);
    });

    it('Step 8: Verify project files', () => {
      expect(existsSync(join(TEST_PROJECT, '.omgkit'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/config.yaml'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/sprints'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, 'OMEGA.md'))).toBe(true);
    });

    it('Step 9: Config should be valid YAML', () => {
      const content = readFileSync(join(TEST_PROJECT, '.omgkit/config.yaml'), 'utf8');
      expect(content).toContain('project:');
      expect(content).toContain('ai:');
    });

    it('Step 10: Settings should be valid JSON', () => {
      const content = readFileSync(join(TEST_PROJECT, '.omgkit/settings.json'), 'utf8');
      const settings = JSON.parse(content);
      expect(settings).toHaveProperty('permissions');
    });

    it('Step 11: Uninstall plugin', () => {
      const result = uninstallPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result.success).toBe(true);
      expect(result.removed).toBe(true);
      expect(isPluginInstalled(TEST_HOME)).toBe(false);
    });

    it('Step 12: Doctor should report not installed after uninstall', () => {
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.plugin.installed).toBe(false);
      // Project should still be initialized
      expect(result.project.initialized).toBe(true);
    });
  });

  describe('Reinstall Workflow', () => {
    it('should reinstall cleanly', () => {
      const result = installPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result.success).toBe(true);
    });

    it('should have all components after reinstall', () => {
      const pluginDir = getPluginDir(TEST_HOME);
      expect(existsSync(join(pluginDir, 'agents'))).toBe(true);
      expect(existsSync(join(pluginDir, 'commands'))).toBe(true);
      expect(existsSync(join(pluginDir, 'skills'))).toBe(true);
      expect(existsSync(join(pluginDir, 'modes'))).toBe(true);
    });
  });

  describe('Idempotent Operations', () => {
    it('should not fail when installing twice', () => {
      const result1 = installPlugin({ homeDir: TEST_HOME, silent: true });
      const result2 = installPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    it('should not overwrite existing project files on reinit', () => {
      // Modify OMEGA.md
      const omegaPath = join(TEST_PROJECT, 'OMEGA.md');
      const originalContent = readFileSync(omegaPath, 'utf8');

      // Reinit
      initProject({ cwd: TEST_PROJECT, silent: true });

      // Content should be unchanged
      const newContent = readFileSync(omegaPath, 'utf8');
      expect(newContent).toBe(originalContent);
    });

    it('should not fail when uninstalling twice', () => {
      uninstallPlugin({ homeDir: TEST_HOME, silent: true });
      const result = uninstallPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result.success).toBe(true);
      expect(result.removed).toBe(false); // Already removed
    });
  });
});

describe('Integration: CLI Commands via Subprocess', () => {
  const testHome = join(__dirname, '../fixtures/cli-test-home');
  const testProject = join(__dirname, '../fixtures/cli-test-project');

  beforeAll(() => {
    rmSync(testHome, { recursive: true, force: true });
    rmSync(testProject, { recursive: true, force: true });
    mkdirSync(testHome, { recursive: true });
    mkdirSync(testProject, { recursive: true });
  });

  afterAll(() => {
    rmSync(testHome, { recursive: true, force: true });
    rmSync(testProject, { recursive: true, force: true });
  });

  it('should show version', () => {
    const output = execSync('node bin/omgkit.js --version', {
      cwd: PACKAGE_ROOT,
      encoding: 'utf8'
    });
    expect(output).toMatch(/omgkit v\d+\.\d+\.\d+/);
  });

  it('should show help', () => {
    const output = execSync('node bin/omgkit.js --help', {
      cwd: PACKAGE_ROOT,
      encoding: 'utf8'
    });
    expect(output).toContain('OMGKIT');
    expect(output).toContain('COMMANDS');
    expect(output).toContain('install');
  });

  it('should error on unknown command', () => {
    try {
      execSync('node bin/omgkit.js unknowncommand', {
        cwd: PACKAGE_ROOT,
        encoding: 'utf8',
        stdio: 'pipe'
      });
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err.status).toBe(1);
    }
  });
});

describe('Integration: Plugin Content Validation', () => {
  beforeAll(() => {
    rmSync(TEST_HOME, { recursive: true, force: true });
    mkdirSync(TEST_HOME, { recursive: true });
    installPlugin({ homeDir: TEST_HOME, silent: true });
  });

  afterAll(() => {
    rmSync(TEST_HOME, { recursive: true, force: true });
  });

  it('installed agents should match source', () => {
    const sourceAgents = join(PACKAGE_ROOT, 'plugin/agents');
    const installedAgents = join(getPluginDir(TEST_HOME), 'agents');

    // Using our countFiles function (imported at top)
    expect(countFiles(installedAgents)).toBe(countFiles(sourceAgents));
  });

  it('oracle agent should be installed correctly', () => {
    const oraclePath = join(getPluginDir(TEST_HOME), 'agents', 'oracle.md');
    expect(existsSync(oraclePath)).toBe(true);

    const content = readFileSync(oraclePath, 'utf8');
    expect(content).toContain('name: oracle');
    expect(content).toContain('7 Thinking Modes');
  });

  it('feature command should be installed correctly', () => {
    const featurePath = join(getPluginDir(TEST_HOME), 'commands', 'dev', 'feature.md');
    expect(existsSync(featurePath)).toBe(true);

    const content = readFileSync(featurePath, 'utf8');
    expect(content).toContain('description:');
    expect(content).toContain('Feature');
  });

  it('omega mode should be installed correctly', () => {
    const omegaPath = join(getPluginDir(TEST_HOME), 'modes', 'omega.md');
    expect(existsSync(omegaPath)).toBe(true);

    const content = readFileSync(omegaPath, 'utf8');
    expect(content).toContain('name: omega');
    expect(content).toContain('Omega');
  });
});
