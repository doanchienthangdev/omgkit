/**
 * Project Upgrade Safety Tests
 *
 * These tests ensure that the project upgrade system is safe and:
 * - Never deletes user data
 * - Never overwrites user customizations
 * - Always creates backups before changes
 * - Can rollback on errors
 * - Properly merges new config sections
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  upgradeProject,
  rollbackProject,
  createProjectBackup,
  listProjectBackups,
  getProjectSettings,
  getProjectVersion,
  calculateUpgradeChanges,
  initProject,
  setPackageRoot,
  getPackageRoot
} from '../../lib/cli.js';

// Test directory setup
const TEST_DIR = join(tmpdir(), `omgkit-upgrade-test-${Date.now()}`);

function createTestProject(options = {}) {
  const projectDir = join(TEST_DIR, `project-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(join(projectDir, '.omgkit', 'sprints'), { recursive: true });
  mkdirSync(join(projectDir, '.omgkit', 'stdrules'), { recursive: true });
  mkdirSync(join(projectDir, '.omgkit', 'artifacts'), { recursive: true });
  mkdirSync(join(projectDir, '.omgkit', 'devlogs'), { recursive: true });

  // Create basic settings.json
  const settings = options.settings || {
    omgkit: {
      version: options.version || '2.20.0',
      initialized_at: '2024-01-01',
      last_upgraded: null
    },
    file_checksums: options.checksums || {},
    permissions: { allow: [], deny: [] }
  };
  writeFileSync(
    join(projectDir, '.omgkit', 'settings.json'),
    JSON.stringify(settings, null, 2)
  );

  // Create workflow.yaml if specified
  if (options.workflow) {
    writeFileSync(
      join(projectDir, '.omgkit', 'workflow.yaml'),
      options.workflow
    );
  }

  // Create config.yaml (user config - should never be touched)
  writeFileSync(
    join(projectDir, '.omgkit', 'config.yaml'),
    options.config || 'project_name: test-project\n'
  );

  // Create sprint files (user data - should never be touched)
  writeFileSync(
    join(projectDir, '.omgkit', 'sprints', 'vision.yaml'),
    options.vision || 'vision: Build something amazing\n'
  );
  writeFileSync(
    join(projectDir, '.omgkit', 'sprints', 'backlog.yaml'),
    options.backlog || 'items:\n  - Task 1\n  - Task 2\n'
  );

  // Create stdrules files
  if (options.stdrules) {
    for (const [name, content] of Object.entries(options.stdrules)) {
      writeFileSync(join(projectDir, '.omgkit', 'stdrules', name), content);
    }
  }

  // Create artifacts (user data)
  if (options.artifacts) {
    writeFileSync(
      join(projectDir, '.omgkit', 'artifacts', 'notes.md'),
      options.artifacts
    );
  }

  // Create devlogs (user data)
  if (options.devlogs) {
    writeFileSync(
      join(projectDir, '.omgkit', 'devlogs', 'log.md'),
      options.devlogs
    );
  }

  return projectDir;
}

function cleanupTestDir() {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

describe('Project Upgrade Safety', () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir();
  });

  describe('Data Protection', () => {
    it('should NEVER delete user config.yaml', async () => {
      const projectDir = createTestProject({
        config: 'project_name: my-important-project\ncustom_setting: true\n'
      });
      const configBefore = readFileSync(join(projectDir, '.omgkit', 'config.yaml'), 'utf8');

      upgradeProject({ cwd: projectDir, silent: true });

      const configAfter = readFileSync(join(projectDir, '.omgkit', 'config.yaml'), 'utf8');
      expect(configAfter).toBe(configBefore);
    });

    it('should NEVER delete sprint vision.yaml', async () => {
      const projectDir = createTestProject({
        vision: 'vision: Build the next big thing\ngoals:\n  - Goal 1\n  - Goal 2\n'
      });
      const visionBefore = readFileSync(join(projectDir, '.omgkit', 'sprints', 'vision.yaml'), 'utf8');

      upgradeProject({ cwd: projectDir, silent: true });

      const visionAfter = readFileSync(join(projectDir, '.omgkit', 'sprints', 'vision.yaml'), 'utf8');
      expect(visionAfter).toBe(visionBefore);
    });

    it('should NEVER delete sprint backlog.yaml', async () => {
      const projectDir = createTestProject({
        backlog: 'items:\n  - Important task 1\n  - Critical task 2\n  - Must do task 3\n'
      });
      const backlogBefore = readFileSync(join(projectDir, '.omgkit', 'sprints', 'backlog.yaml'), 'utf8');

      upgradeProject({ cwd: projectDir, silent: true });

      const backlogAfter = readFileSync(join(projectDir, '.omgkit', 'sprints', 'backlog.yaml'), 'utf8');
      expect(backlogAfter).toBe(backlogBefore);
    });

    it('should NEVER delete artifacts folder contents', async () => {
      const projectDir = createTestProject({
        artifacts: '# Important Notes\n\nThis is user data that must be preserved.'
      });
      const artifactsBefore = readFileSync(join(projectDir, '.omgkit', 'artifacts', 'notes.md'), 'utf8');

      upgradeProject({ cwd: projectDir, silent: true });

      expect(existsSync(join(projectDir, '.omgkit', 'artifacts', 'notes.md'))).toBe(true);
      const artifactsAfter = readFileSync(join(projectDir, '.omgkit', 'artifacts', 'notes.md'), 'utf8');
      expect(artifactsAfter).toBe(artifactsBefore);
    });

    it('should NEVER delete devlogs folder contents', async () => {
      const projectDir = createTestProject({
        devlogs: '# Development Log\n\n2024-01-01: Started project'
      });
      const devlogsBefore = readFileSync(join(projectDir, '.omgkit', 'devlogs', 'log.md'), 'utf8');

      upgradeProject({ cwd: projectDir, silent: true });

      expect(existsSync(join(projectDir, '.omgkit', 'devlogs', 'log.md'))).toBe(true);
      const devlogsAfter = readFileSync(join(projectDir, '.omgkit', 'devlogs', 'log.md'), 'utf8');
      expect(devlogsAfter).toBe(devlogsBefore);
    });
  });

  describe('Workflow.yaml Smart Merge', () => {
    it('should preserve user customizations in workflow.yaml', async () => {
      const projectDir = createTestProject({
        workflow: `version: "1.0"
git:
  workflow: trunk-based
  main_branch: develop
commit:
  conventional: true
  max_subject_length: 100
`
      });

      upgradeProject({ cwd: projectDir, silent: true });

      const workflowAfter = readFileSync(join(projectDir, '.omgkit', 'workflow.yaml'), 'utf8');
      // User's custom main_branch should be preserved
      expect(workflowAfter).toContain('main_branch: develop');
      // User's custom max_subject_length should be preserved
      expect(workflowAfter).toContain('max_subject_length: 100');
    });

    it('should add new sections without removing existing ones', async () => {
      const projectDir = createTestProject({
        workflow: `version: "1.0"
git:
  workflow: trunk-based
  main_branch: main
commit:
  conventional: true
`
      });

      upgradeProject({ cwd: projectDir, silent: true });

      const workflowAfter = readFileSync(join(projectDir, '.omgkit', 'workflow.yaml'), 'utf8');
      // Original sections should still exist
      expect(workflowAfter).toContain('git:');
      expect(workflowAfter).toContain('commit:');
      // If testing section was added by template, it should be present
      // (depends on template content)
    });
  });

  describe('Backup System', () => {
    it('should create backup before any changes', async () => {
      const projectDir = createTestProject();
      const backupsBefore = listProjectBackups(projectDir);
      expect(backupsBefore.length).toBe(0);

      upgradeProject({ cwd: projectDir, silent: true });

      const backupsAfter = listProjectBackups(projectDir);
      expect(backupsAfter.length).toBeGreaterThanOrEqual(1);
    });

    it('should preserve complete .omgkit state in backup', async () => {
      const projectDir = createTestProject({
        config: 'custom_config: true\n',
        vision: 'my_vision: important\n',
        backlog: 'my_tasks:\n  - task1\n'
      });

      const backup = createProjectBackup(projectDir);
      expect(backup.success).toBe(true);

      // Verify backup contains all files
      expect(existsSync(join(backup.path, 'config.yaml'))).toBe(true);
      expect(existsSync(join(backup.path, 'settings.json'))).toBe(true);
      expect(existsSync(join(backup.path, 'sprints', 'vision.yaml'))).toBe(true);
      expect(existsSync(join(backup.path, 'sprints', 'backlog.yaml'))).toBe(true);
    });

    it('should allow listing all backups', async () => {
      const projectDir = createTestProject();

      // Create multiple backups
      createProjectBackup(projectDir);
      await new Promise(r => setTimeout(r, 10)); // Small delay for different timestamps
      createProjectBackup(projectDir);

      const backups = listProjectBackups(projectDir);
      expect(backups.length).toBe(2);
      // Should be sorted by date (newest first)
      expect(backups[0].created >= backups[1].created).toBe(true);
    });
  });

  describe('Rollback System', () => {
    it('should restore previous state on rollback', async () => {
      const projectDir = createTestProject({
        workflow: 'version: "1.0"\ngit:\n  main_branch: develop\n'
      });
      const workflowBefore = readFileSync(join(projectDir, '.omgkit', 'workflow.yaml'), 'utf8');

      // Upgrade (which modifies workflow.yaml)
      upgradeProject({ cwd: projectDir, silent: true });

      // Rollback
      const result = rollbackProject({ cwd: projectDir, silent: true });
      expect(result.success).toBe(true);

      const workflowAfter = readFileSync(join(projectDir, '.omgkit', 'workflow.yaml'), 'utf8');
      expect(workflowAfter).toBe(workflowBefore);
    });

    it('should restore to most recent backup by default', async () => {
      const projectDir = createTestProject();

      // Create first backup
      createProjectBackup(projectDir);
      await new Promise(r => setTimeout(r, 10));

      // Create second backup
      const latestBackup = createProjectBackup(projectDir);

      const result = rollbackProject({ cwd: projectDir, silent: true });
      expect(result.success).toBe(true);
      expect(result.restoredFrom).toBe(latestBackup.path);
    });

    it('should fail gracefully if no backups exist', async () => {
      const projectDir = createTestProject();

      const result = rollbackProject({ cwd: projectDir, silent: true });
      expect(result.success).toBe(false);
      expect(result.error).toBe('NO_BACKUPS');
    });
  });

  describe('Version Tracking', () => {
    it('should update version in settings.json after upgrade', async () => {
      const projectDir = createTestProject({ version: '2.20.0' });
      const versionBefore = getProjectVersion(projectDir);
      expect(versionBefore).toBe('2.20.0');

      upgradeProject({ cwd: projectDir, silent: true });

      const versionAfter = getProjectVersion(projectDir);
      // Version should be updated to current OMGKIT version
      expect(versionAfter).not.toBe('2.20.0');
    });

    it('should track last_upgraded date', async () => {
      const projectDir = createTestProject();

      upgradeProject({ cwd: projectDir, silent: true });

      const settings = getProjectSettings(projectDir);
      expect(settings.omgkit.last_upgraded).toBeTruthy();
      // Should be today's date
      const today = new Date().toISOString().split('T')[0];
      expect(settings.omgkit.last_upgraded).toBe(today);
    });
  });

  describe('Dry Run Mode', () => {
    it('should not make changes in dry run mode', async () => {
      const projectDir = createTestProject({
        workflow: 'version: "1.0"\ngit:\n  main_branch: main\n'
      });
      const workflowBefore = readFileSync(join(projectDir, '.omgkit', 'workflow.yaml'), 'utf8');

      upgradeProject({ cwd: projectDir, dryRun: true, silent: true });

      const workflowAfter = readFileSync(join(projectDir, '.omgkit', 'workflow.yaml'), 'utf8');
      expect(workflowAfter).toBe(workflowBefore);
    });

    it('should not create backup in dry run mode', async () => {
      const projectDir = createTestProject();
      const backupsBefore = listProjectBackups(projectDir);

      upgradeProject({ cwd: projectDir, dryRun: true, silent: true });

      const backupsAfter = listProjectBackups(projectDir);
      expect(backupsAfter.length).toBe(backupsBefore.length);
    });

    it('should return changes information in dry run', async () => {
      const projectDir = createTestProject({ version: '2.20.0' });

      const result = upgradeProject({ cwd: projectDir, dryRun: true, silent: true });

      expect(result.dryRun).toBe(true);
      expect(result.changes).toBeDefined();
    });
  });

  describe('Stdrules File Handling', () => {
    it('should not overwrite user-modified stdrules files', async () => {
      const customContent = '# My Custom Rules\n\nI modified this file!\n';
      const projectDir = createTestProject({
        stdrules: {
          'BEFORE_COMMIT.md': customContent
        },
        checksums: {
          'stdrules/BEFORE_COMMIT.md': 'different-hash'
        }
      });

      upgradeProject({ cwd: projectDir, silent: true });

      const contentAfter = readFileSync(
        join(projectDir, '.omgkit', 'stdrules', 'BEFORE_COMMIT.md'),
        'utf8'
      );
      // Should preserve user's modified content
      expect(contentAfter).toBe(customContent);
    });
  });

  describe('Error Handling', () => {
    it('should fail gracefully for non-initialized projects', async () => {
      const emptyDir = join(TEST_DIR, 'empty-project');
      mkdirSync(emptyDir, { recursive: true });

      const result = upgradeProject({ cwd: emptyDir, silent: true });
      expect(result.success).toBe(false);
      expect(result.error).toBe('NOT_INITIALIZED');
    });

    it('should report up-to-date for current version projects', async () => {
      // Create project with current OMGKIT version
      const projectDir = createTestProject();

      // First upgrade to set version
      upgradeProject({ cwd: projectDir, silent: true });

      // Second upgrade should report up-to-date
      const result = upgradeProject({ cwd: projectDir, silent: true });
      expect(result.upToDate).toBe(true);
    });
  });

  describe('Calculate Upgrade Changes', () => {
    it('should detect missing workflow sections', async () => {
      const projectDir = createTestProject({
        workflow: 'version: "1.0"\ngit:\n  main_branch: main\n'
      });

      const changes = calculateUpgradeChanges(projectDir);

      // Should detect that project workflow is missing sections from template
      expect(changes.targetVersion).toBeDefined();
      expect(changes.changes).toBeDefined();
    });

    it('should list protected files', async () => {
      const projectDir = createTestProject();

      const changes = calculateUpgradeChanges(projectDir);

      expect(changes.changes.protected).toContain('config.yaml');
      expect(changes.changes.protected).toContain('sprints/vision.yaml');
      expect(changes.changes.protected).toContain('sprints/backlog.yaml');
    });
  });
});

describe('Project Upgrade Integration', () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    cleanupTestDir();
  });

  it('should handle complete upgrade cycle', async () => {
    // Create old project
    const projectDir = createTestProject({
      version: '2.20.0',
      workflow: 'version: "1.0"\ngit:\n  main_branch: main\n',
      config: 'name: my-project\n',
      vision: 'goal: success\n',
      backlog: 'items:\n  - task1\n'
    });

    // Verify initial state
    const versionBefore = getProjectVersion(projectDir);
    expect(versionBefore).toBe('2.20.0');

    // Perform dry run first
    const dryRunResult = upgradeProject({ cwd: projectDir, dryRun: true, silent: true });
    expect(dryRunResult.success).toBe(true);
    expect(getProjectVersion(projectDir)).toBe('2.20.0'); // Unchanged

    // Perform actual upgrade
    const upgradeResult = upgradeProject({ cwd: projectDir, silent: true });
    expect(upgradeResult.success).toBe(true);

    // Verify protected files unchanged
    expect(readFileSync(join(projectDir, '.omgkit', 'config.yaml'), 'utf8')).toBe('name: my-project\n');
    expect(readFileSync(join(projectDir, '.omgkit', 'sprints', 'vision.yaml'), 'utf8')).toBe('goal: success\n');

    // Verify backup was created
    const backups = listProjectBackups(projectDir);
    expect(backups.length).toBeGreaterThan(0);

    // Rollback and verify restoration
    const rollbackResult = rollbackProject({ cwd: projectDir, silent: true });
    expect(rollbackResult.success).toBe(true);
    expect(getProjectVersion(projectDir)).toBe('2.20.0'); // Restored
  });
});
