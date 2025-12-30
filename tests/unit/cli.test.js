/**
 * CLI Unit Tests
 *
 * Tests for the OMGKIT CLI core library functions
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  setPackageRoot,
  getPackageRoot,
  getPluginDir,
  getVersion,
  isPluginInstalled,
  isProjectInitialized,
  installPlugin,
  initProject,
  doctor,
  uninstallPlugin,
  countFiles,
  parseFrontmatter,
  validatePluginFile,
  COLORS,
  BANNER
} from '../../lib/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const TEST_HOME = join(__dirname, '../fixtures/home');
const TEST_PROJECT = join(__dirname, '../fixtures/project');

// Set package root for tests
setPackageRoot(PACKAGE_ROOT);

describe('CLI Core Functions', () => {
  beforeEach(() => {
    // Create test directories
    mkdirSync(TEST_HOME, { recursive: true });
    mkdirSync(TEST_PROJECT, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directories
    rmSync(TEST_HOME, { recursive: true, force: true });
    rmSync(TEST_PROJECT, { recursive: true, force: true });
  });

  describe('getPackageRoot', () => {
    it('should return the package root directory', () => {
      const root = getPackageRoot();
      expect(root).toBe(PACKAGE_ROOT);
    });

    it('should contain package.json', () => {
      const root = getPackageRoot();
      expect(existsSync(join(root, 'package.json'))).toBe(true);
    });
  });

  describe('getPluginDir', () => {
    it('should return correct plugin directory path', () => {
      const pluginDir = getPluginDir(TEST_HOME);
      expect(pluginDir).toBe(join(TEST_HOME, '.claude', 'plugins', 'omgkit'));
    });

    it('should use HOME env if no override provided', () => {
      const originalHome = process.env.HOME;
      process.env.HOME = '/test/home';
      const pluginDir = getPluginDir();
      expect(pluginDir).toBe('/test/home/.claude/plugins/omgkit');
      process.env.HOME = originalHome;
    });
  });

  describe('getVersion', () => {
    it('should return version string', () => {
      const version = getVersion();
      expect(version).toMatch(/^\d+\.\d+\.\d+/);
    });

    it('should match package.json version', () => {
      const version = getVersion();
      const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'));
      expect(version).toBe(pkg.version);
    });
  });

  describe('isPluginInstalled', () => {
    it('should return false when plugin not installed', () => {
      expect(isPluginInstalled(TEST_HOME)).toBe(false);
    });

    it('should return true when plugin is installed', () => {
      const pluginDir = getPluginDir(TEST_HOME);
      mkdirSync(pluginDir, { recursive: true });
      expect(isPluginInstalled(TEST_HOME)).toBe(true);
    });
  });

  describe('isProjectInitialized', () => {
    it('should return false when project not initialized', () => {
      expect(isProjectInitialized(TEST_PROJECT)).toBe(false);
    });

    it('should return true when .omgkit exists', () => {
      mkdirSync(join(TEST_PROJECT, '.omgkit'), { recursive: true });
      expect(isProjectInitialized(TEST_PROJECT)).toBe(true);
    });
  });

  describe('installPlugin', () => {
    it('should install plugin successfully', () => {
      const result = installPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result.success).toBe(true);
      expect(result.path).toBe(getPluginDir(TEST_HOME));
    });

    it('should create plugin directory structure', () => {
      installPlugin({ homeDir: TEST_HOME, silent: true });
      const pluginDir = getPluginDir(TEST_HOME);

      expect(existsSync(join(pluginDir, 'agents'))).toBe(true);
      expect(existsSync(join(pluginDir, 'commands'))).toBe(true);
      expect(existsSync(join(pluginDir, 'skills'))).toBe(true);
      expect(existsSync(join(pluginDir, 'modes'))).toBe(true);
    });

    it('should copy all agent files', () => {
      installPlugin({ homeDir: TEST_HOME, silent: true });
      const agentsDir = join(getPluginDir(TEST_HOME), 'agents');
      const count = countFiles(agentsDir);
      expect(count).toBe(23);
    });

    it('should copy all mode files', () => {
      installPlugin({ homeDir: TEST_HOME, silent: true });
      const modesDir = join(getPluginDir(TEST_HOME), 'modes');
      const count = countFiles(modesDir);
      expect(count).toBe(10);
    });
  });

  describe('initProject', () => {
    it('should initialize project successfully', () => {
      const result = initProject({ cwd: TEST_PROJECT, silent: true });
      expect(result.success).toBe(true);
    });

    it('should create .omgkit directory structure', () => {
      initProject({ cwd: TEST_PROJECT, silent: true });

      expect(existsSync(join(TEST_PROJECT, '.omgkit'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/sprints'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/plans'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/docs'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/logs'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/devlogs'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/stdrules'))).toBe(true);
    });

    it('should create config files', () => {
      initProject({ cwd: TEST_PROJECT, silent: true });

      expect(existsSync(join(TEST_PROJECT, '.omgkit/config.yaml'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, 'OMEGA.md'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/sprints/vision.yaml'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/sprints/backlog.yaml'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/settings.json'))).toBe(true);
    });

    it('should create devlogs and stdrules files', () => {
      initProject({ cwd: TEST_PROJECT, silent: true });

      expect(existsSync(join(TEST_PROJECT, '.omgkit/devlogs/README.md'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/stdrules/README.md'))).toBe(true);
      expect(existsSync(join(TEST_PROJECT, '.omgkit/stdrules/SKILL_STANDARDS.md'))).toBe(true);
    });

    it('should not overwrite existing files', () => {
      // Create existing OMEGA.md
      writeFileSync(join(TEST_PROJECT, 'OMEGA.md'), 'existing content');

      initProject({ cwd: TEST_PROJECT, silent: true });

      const content = readFileSync(join(TEST_PROJECT, 'OMEGA.md'), 'utf8');
      expect(content).toBe('existing content');
    });
  });

  describe('doctor', () => {
    it('should report plugin not installed', () => {
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.plugin.installed).toBe(false);
    });

    it('should report plugin installed', () => {
      installPlugin({ homeDir: TEST_HOME, silent: true });
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.plugin.installed).toBe(true);
    });

    it('should report project not initialized', () => {
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.project.initialized).toBe(false);
    });

    it('should report project initialized', () => {
      initProject({ cwd: TEST_PROJECT, silent: true });
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });
      expect(result.project.initialized).toBe(true);
    });

    it('should check all plugin components', () => {
      installPlugin({ homeDir: TEST_HOME, silent: true });
      const result = doctor({ homeDir: TEST_HOME, cwd: TEST_PROJECT, silent: true });

      expect(result.plugin.components.commands).toBe(true);
      expect(result.plugin.components.agents).toBe(true);
      expect(result.plugin.components.skills).toBe(true);
      expect(result.plugin.components.modes).toBe(true);
    });
  });

  describe('uninstallPlugin', () => {
    it('should uninstall plugin successfully', () => {
      installPlugin({ homeDir: TEST_HOME, silent: true });
      expect(isPluginInstalled(TEST_HOME)).toBe(true);

      const result = uninstallPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result.success).toBe(true);
      expect(result.removed).toBe(true);
      expect(isPluginInstalled(TEST_HOME)).toBe(false);
    });

    it('should handle non-existent plugin gracefully', () => {
      const result = uninstallPlugin({ homeDir: TEST_HOME, silent: true });
      expect(result.success).toBe(true);
      expect(result.removed).toBe(false);
    });
  });

  describe('countFiles', () => {
    it('should count files with extension', () => {
      const testDir = join(TEST_PROJECT, 'testfiles');
      mkdirSync(testDir, { recursive: true });
      writeFileSync(join(testDir, 'a.md'), 'content');
      writeFileSync(join(testDir, 'b.md'), 'content');
      writeFileSync(join(testDir, 'c.txt'), 'content');

      expect(countFiles(testDir, '.md')).toBe(2);
      expect(countFiles(testDir, '.txt')).toBe(1);
    });

    it('should count recursively', () => {
      const testDir = join(TEST_PROJECT, 'testfiles');
      mkdirSync(join(testDir, 'sub'), { recursive: true });
      writeFileSync(join(testDir, 'a.md'), 'content');
      writeFileSync(join(testDir, 'sub', 'b.md'), 'content');

      expect(countFiles(testDir, '.md')).toBe(2);
    });

    it('should return 0 for non-existent directory', () => {
      expect(countFiles('/non/existent/path')).toBe(0);
    });
  });

  describe('parseFrontmatter', () => {
    it('should parse valid frontmatter', () => {
      const content = `---
name: test
description: Test description
---

# Content`;

      const result = parseFrontmatter(content);
      expect(result).toEqual({
        name: 'test',
        description: 'Test description'
      });
    });

    it('should return null for missing frontmatter', () => {
      const content = '# Just content';
      expect(parseFrontmatter(content)).toBeNull();
    });

    it('should handle empty frontmatter', () => {
      const content = `---
---

# Content`;
      const result = parseFrontmatter(content);
      expect(result).toEqual({});
    });
  });

  describe('validatePluginFile', () => {
    it('should validate file with required fields', () => {
      const testFile = join(TEST_PROJECT, 'test.md');
      writeFileSync(testFile, `---
name: test
description: Test
---

# Content`);

      const result = validatePluginFile(testFile, ['name', 'description']);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for missing required fields', () => {
      const testFile = join(TEST_PROJECT, 'test.md');
      writeFileSync(testFile, `---
name: test
---

# Content`);

      const result = validatePluginFile(testFile, ['name', 'description']);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required field: description');
    });

    it('should fail for non-existent file', () => {
      const result = validatePluginFile('/non/existent/file.md', []);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('File does not exist');
    });

    it('should fail for file without frontmatter', () => {
      const testFile = join(TEST_PROJECT, 'test.md');
      writeFileSync(testFile, '# Just content');

      const result = validatePluginFile(testFile, []);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('No frontmatter found');
    });
  });

  describe('Constants', () => {
    it('should have all color codes', () => {
      expect(COLORS.reset).toBeDefined();
      expect(COLORS.green).toBeDefined();
      expect(COLORS.red).toBeDefined();
      expect(COLORS.cyan).toBeDefined();
      expect(COLORS.magenta).toBeDefined();
    });

    it('should have banner with OMGKIT branding', () => {
      expect(BANNER).toContain('OMGKIT');
      expect(BANNER).toContain('Omega-Level Development Kit');
    });
  });
});
