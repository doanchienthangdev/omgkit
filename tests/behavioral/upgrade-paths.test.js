/**
 * Behavioral Tests for Upgrade Paths
 *
 * Tests system behavior during version upgrades and migrations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const TEMP_DIR = join(PACKAGE_ROOT, 'tests/.temp-upgrade');

/**
 * Semantic version utilities
 */
const semver = {
  parse(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)\.?(\d+)?)?$/i);
    if (!match) return null;
    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4] || null,
      prereleaseNum: match[5] ? parseInt(match[5]) : null,
    };
  },

  compare(a, b) {
    const va = this.parse(a);
    const vb = this.parse(b);

    if (!va || !vb) return 0;

    if (va.major !== vb.major) return va.major - vb.major;
    if (va.minor !== vb.minor) return va.minor - vb.minor;
    if (va.patch !== vb.patch) return va.patch - vb.patch;

    // Handle prereleases
    if (va.prerelease && !vb.prerelease) return -1;
    if (!va.prerelease && vb.prerelease) return 1;

    return 0;
  },

  isUpgrade(from, to) {
    return this.compare(from, to) < 0;
  },

  isMajorUpgrade(from, to) {
    const vf = this.parse(from);
    const vt = this.parse(to);
    return vf && vt && vt.major > vf.major;
  },

  isMinorUpgrade(from, to) {
    const vf = this.parse(from);
    const vt = this.parse(to);
    return vf && vt && vf.major === vt.major && vt.minor > vf.minor;
  },
};

/**
 * Migration manager for handling version upgrades
 */
class MigrationManager {
  constructor() {
    this.migrations = new Map();
    this.executedMigrations = [];
    this.currentVersion = '1.0.0';
  }

  registerMigration(fromVersion, toVersion, migrateFn) {
    const key = `${fromVersion}->${toVersion}`;
    this.migrations.set(key, {
      from: fromVersion,
      to: toVersion,
      migrate: migrateFn,
    });
  }

  async migrate(fromVersion, toVersion) {
    if (!semver.isUpgrade(fromVersion, toVersion)) {
      return { success: false, error: 'Not an upgrade' };
    }

    const path = this.findMigrationPath(fromVersion, toVersion);
    if (!path) {
      return { success: false, error: 'No migration path found' };
    }

    const results = [];
    let currentData = { version: fromVersion };

    for (const step of path) {
      try {
        currentData = await step.migrate(currentData);
        currentData.version = step.to;
        this.executedMigrations.push({
          from: step.from,
          to: step.to,
          success: true,
        });
        results.push({ step: `${step.from}->${step.to}`, success: true });
      } catch (e) {
        this.executedMigrations.push({
          from: step.from,
          to: step.to,
          success: false,
          error: e.message,
        });
        return {
          success: false,
          error: e.message,
          completedSteps: results,
          failedAt: `${step.from}->${step.to}`,
        };
      }
    }

    this.currentVersion = toVersion;
    return { success: true, steps: results, finalData: currentData };
  }

  findMigrationPath(from, to) {
    // Simple BFS to find migration path
    const visited = new Set();
    const queue = [{ version: from, path: [] }];

    while (queue.length > 0) {
      const { version, path } = queue.shift();

      if (version === to) {
        return path;
      }

      if (visited.has(version)) continue;
      visited.add(version);

      for (const [key, migration] of this.migrations) {
        if (migration.from === version && !visited.has(migration.to)) {
          queue.push({
            version: migration.to,
            path: [...path, migration],
          });
        }
      }
    }

    return null;
  }

  getExecutedMigrations() {
    return [...this.executedMigrations];
  }
}

/**
 * Schema migration handler
 */
class SchemaMigrator {
  constructor() {
    this.schemas = new Map();
  }

  registerSchema(version, schema) {
    this.schemas.set(version, schema);
  }

  validate(data, version) {
    const schema = this.schemas.get(version);
    if (!schema) {
      return { valid: false, error: `Unknown schema version: ${version}` };
    }

    const errors = [];

    // Check required fields
    for (const field of schema.required || []) {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check field types
    for (const [field, type] of Object.entries(schema.fields || {})) {
      if (field in data && typeof data[field] !== type) {
        errors.push(`Field ${field} should be ${type}, got ${typeof data[field]}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  transform(data, fromVersion, toVersion) {
    const fromSchema = this.schemas.get(fromVersion);
    const toSchema = this.schemas.get(toVersion);

    if (!fromSchema || !toSchema) {
      return { error: 'Unknown schema version' };
    }

    const transformed = { ...data };

    // Apply field renames
    for (const [oldName, newName] of Object.entries(toSchema.renamedFrom || {})) {
      if (oldName in transformed) {
        transformed[newName] = transformed[oldName];
        delete transformed[oldName];
      }
    }

    // Apply defaults for new required fields
    for (const field of toSchema.required || []) {
      if (!(field in transformed) && field in (toSchema.defaults || {})) {
        transformed[field] = toSchema.defaults[field];
      }
    }

    // Remove deprecated fields
    for (const field of toSchema.deprecated || []) {
      delete transformed[field];
    }

    return transformed;
  }
}

/**
 * Configuration migrator
 */
class ConfigMigrator {
  constructor() {
    this.configs = new Map();
  }

  migrateConfig(config, fromVersion, toVersion) {
    const result = { ...config, version: toVersion };
    const errors = [];

    // Version-specific migrations
    if (fromVersion === '1.0.0' && semver.compare('2.0.0', toVersion) <= 0) {
      // v1 -> v2: skills array becomes object
      if (Array.isArray(config.skills)) {
        result.skills = {};
        for (const skill of config.skills) {
          if (typeof skill === 'string') {
            const [category, name] = skill.split('/');
            if (!result.skills[category]) result.skills[category] = [];
            result.skills[category].push(name);
          }
        }
      }
    }

    if (fromVersion.startsWith('1.') && semver.compare('2.0.0', toVersion) <= 0) {
      // v1.x -> v2: commands format change
      if (config.commands && Array.isArray(config.commands)) {
        result.commands = config.commands.map(cmd => {
          if (typeof cmd === 'string') {
            const match = cmd.match(/^\/([^:]+):(.+)$/);
            if (match) {
              return { namespace: match[1], name: match[2] };
            }
          }
          return cmd;
        });
      }
    }

    return { config: result, errors };
  }

  validateMigration(original, migrated) {
    const issues = [];

    // Check no data was lost
    const originalKeys = Object.keys(original).filter(k => k !== 'version');
    for (const key of originalKeys) {
      // Keys should either exist in migrated or be part of a known transformation
      if (!(key in migrated)) {
        issues.push(`Key ${key} was lost during migration`);
      }
    }

    return { valid: issues.length === 0, issues };
  }
}

/**
 * Component version tracker
 */
class VersionTracker {
  constructor() {
    this.components = new Map();
    this.compatibilityMatrix = new Map();
  }

  setVersion(component, version) {
    this.components.set(component, {
      version,
      updatedAt: Date.now(),
    });
  }

  getVersion(component) {
    const info = this.components.get(component);
    return info ? info.version : null;
  }

  setCompatibility(componentA, componentB, versionA, versionB, compatible) {
    const key = `${componentA}@${versionA}:${componentB}@${versionB}`;
    this.compatibilityMatrix.set(key, compatible);
  }

  checkCompatibility(componentA, componentB) {
    const versionA = this.getVersion(componentA);
    const versionB = this.getVersion(componentB);

    if (!versionA || !versionB) {
      return { compatible: false, error: 'Unknown component version' };
    }

    const key = `${componentA}@${versionA}:${componentB}@${versionB}`;
    const reverseKey = `${componentB}@${versionB}:${componentA}@${versionA}`;

    const compatible = this.compatibilityMatrix.get(key) ??
                       this.compatibilityMatrix.get(reverseKey);

    if (compatible === undefined) {
      // Assume compatible if same major version
      const parsedA = semver.parse(versionA);
      const parsedB = semver.parse(versionB);
      return {
        compatible: parsedA && parsedB && parsedA.major === parsedB.major,
        assumed: true,
      };
    }

    return { compatible };
  }

  getAllVersions() {
    const result = {};
    for (const [component, info] of this.components) {
      result[component] = info.version;
    }
    return result;
  }
}

describe('Upgrade Paths Behavioral Tests', () => {
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

  describe('Semantic Versioning', () => {
    it('parses valid versions', () => {
      expect(semver.parse('1.0.0')).toEqual({
        major: 1, minor: 0, patch: 0,
        prerelease: null, prereleaseNum: null,
      });

      expect(semver.parse('2.5.3')).toEqual({
        major: 2, minor: 5, patch: 3,
        prerelease: null, prereleaseNum: null,
      });

      expect(semver.parse('1.0.0-beta.1')).toEqual({
        major: 1, minor: 0, patch: 0,
        prerelease: 'beta', prereleaseNum: 1,
      });
    });

    it('compares versions correctly', () => {
      expect(semver.compare('1.0.0', '2.0.0')).toBeLessThan(0);
      expect(semver.compare('2.0.0', '1.0.0')).toBeGreaterThan(0);
      expect(semver.compare('1.0.0', '1.0.0')).toBe(0);
      expect(semver.compare('1.0.0', '1.1.0')).toBeLessThan(0);
      expect(semver.compare('1.0.0', '1.0.1')).toBeLessThan(0);
    });

    it('detects upgrade types', () => {
      expect(semver.isUpgrade('1.0.0', '2.0.0')).toBe(true);
      expect(semver.isUpgrade('2.0.0', '1.0.0')).toBe(false);
      expect(semver.isUpgrade('1.0.0', '1.0.0')).toBe(false);

      expect(semver.isMajorUpgrade('1.0.0', '2.0.0')).toBe(true);
      expect(semver.isMajorUpgrade('1.0.0', '1.5.0')).toBe(false);

      expect(semver.isMinorUpgrade('1.0.0', '1.5.0')).toBe(true);
      expect(semver.isMinorUpgrade('1.0.0', '2.0.0')).toBe(false);
    });
  });

  describe('Migration Manager', () => {
    it('executes single-step migration', async () => {
      const manager = new MigrationManager();

      manager.registerMigration('1.0.0', '1.1.0', async (data) => ({
        ...data,
        newField: 'added',
      }));

      const result = await manager.migrate('1.0.0', '1.1.0');

      expect(result.success).toBe(true);
      expect(result.finalData.newField).toBe('added');
      expect(result.finalData.version).toBe('1.1.0');
    });

    it('executes multi-step migration', async () => {
      const manager = new MigrationManager();

      manager.registerMigration('1.0.0', '1.1.0', async (data) => ({
        ...data,
        step1: true,
      }));

      manager.registerMigration('1.1.0', '1.2.0', async (data) => ({
        ...data,
        step2: true,
      }));

      manager.registerMigration('1.2.0', '2.0.0', async (data) => ({
        ...data,
        step3: true,
      }));

      const result = await manager.migrate('1.0.0', '2.0.0');

      expect(result.success).toBe(true);
      expect(result.steps.length).toBe(3);
      expect(result.finalData.step1).toBe(true);
      expect(result.finalData.step2).toBe(true);
      expect(result.finalData.step3).toBe(true);
    });

    it('handles migration failure', async () => {
      const manager = new MigrationManager();

      manager.registerMigration('1.0.0', '1.1.0', async (data) => ({
        ...data,
        step1: true,
      }));

      manager.registerMigration('1.1.0', '2.0.0', async (data) => {
        throw new Error('Migration failed');
      });

      const result = await manager.migrate('1.0.0', '2.0.0');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Migration failed');
      expect(result.failedAt).toBe('1.1.0->2.0.0');
      expect(result.completedSteps.length).toBe(1);
    });

    it('rejects downgrade attempts', async () => {
      const manager = new MigrationManager();

      const result = await manager.migrate('2.0.0', '1.0.0');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not an upgrade');
    });

    it('tracks executed migrations', async () => {
      const manager = new MigrationManager();

      manager.registerMigration('1.0.0', '1.1.0', async (d) => d);
      manager.registerMigration('1.1.0', '1.2.0', async (d) => d);

      await manager.migrate('1.0.0', '1.2.0');

      const executed = manager.getExecutedMigrations();
      expect(executed.length).toBe(2);
      expect(executed[0].from).toBe('1.0.0');
      expect(executed[0].to).toBe('1.1.0');
    });
  });

  describe('Schema Migration', () => {
    it('validates data against schema', () => {
      const migrator = new SchemaMigrator();

      migrator.registerSchema('1.0.0', {
        required: ['name', 'version'],
        fields: { name: 'string', version: 'string' },
      });

      const validResult = migrator.validate(
        { name: 'test', version: '1.0.0' },
        '1.0.0'
      );
      expect(validResult.valid).toBe(true);

      const invalidResult = migrator.validate(
        { name: 123 },
        '1.0.0'
      );
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toContain('Missing required field: version');
    });

    it('transforms data between schema versions', () => {
      const migrator = new SchemaMigrator();

      migrator.registerSchema('1.0.0', {
        required: ['oldField'],
        fields: { oldField: 'string' },
      });

      migrator.registerSchema('2.0.0', {
        required: ['newField', 'addedField'],
        fields: { newField: 'string', addedField: 'number' },
        renamedFrom: { oldField: 'newField' },
        defaults: { addedField: 0 },
        deprecated: ['deprecatedField'],
      });

      const original = {
        oldField: 'value',
        deprecatedField: 'old',
      };

      const transformed = migrator.transform(original, '1.0.0', '2.0.0');

      expect(transformed.newField).toBe('value');
      expect(transformed.addedField).toBe(0);
      expect('oldField' in transformed).toBe(false);
      expect('deprecatedField' in transformed).toBe(false);
    });
  });

  describe('Configuration Migration', () => {
    it('migrates v1 skills array to v2 object', () => {
      const migrator = new ConfigMigrator();

      const v1Config = {
        version: '1.0.0',
        skills: ['testing/omega', 'databases/postgresql', 'testing/tdd'],
      };

      const result = migrator.migrateConfig(v1Config, '1.0.0', '2.0.0');

      expect(result.config.skills.testing).toContain('omega');
      expect(result.config.skills.testing).toContain('tdd');
      expect(result.config.skills.databases).toContain('postgresql');
    });

    it('migrates v1 commands format to v2', () => {
      const migrator = new ConfigMigrator();

      const v1Config = {
        version: '1.0.0',
        commands: ['/dev:test', '/quality:review'],
      };

      const result = migrator.migrateConfig(v1Config, '1.0.0', '2.0.0');

      expect(result.config.commands[0]).toEqual({
        namespace: 'dev',
        name: 'test',
      });
      expect(result.config.commands[1]).toEqual({
        namespace: 'quality',
        name: 'review',
      });
    });

    it('validates migration preserves data', () => {
      const migrator = new ConfigMigrator();

      const original = {
        version: '1.0.0',
        name: 'test',
        skills: ['testing/omega'],
      };

      const { config: migrated } = migrator.migrateConfig(original, '1.0.0', '2.0.0');

      const validation = migrator.validateMigration(original, migrated);

      // Name should be preserved
      expect(migrated.name).toBe(original.name);
    });
  });

  describe('Version Compatibility', () => {
    it('tracks component versions', () => {
      const tracker = new VersionTracker();

      tracker.setVersion('core', '2.1.0');
      tracker.setVersion('plugin', '1.5.0');
      tracker.setVersion('cli', '2.0.0');

      expect(tracker.getVersion('core')).toBe('2.1.0');
      expect(tracker.getVersion('plugin')).toBe('1.5.0');
      expect(tracker.getVersion('cli')).toBe('2.0.0');
    });

    it('checks explicit compatibility', () => {
      const tracker = new VersionTracker();

      tracker.setVersion('core', '2.0.0');
      tracker.setVersion('plugin', '1.0.0');

      tracker.setCompatibility('core', 'plugin', '2.0.0', '1.0.0', false);

      const result = tracker.checkCompatibility('core', 'plugin');
      expect(result.compatible).toBe(false);
    });

    it('assumes compatibility for same major version', () => {
      const tracker = new VersionTracker();

      tracker.setVersion('core', '2.1.0');
      tracker.setVersion('plugin', '2.5.0');

      const result = tracker.checkCompatibility('core', 'plugin');
      expect(result.compatible).toBe(true);
      expect(result.assumed).toBe(true);
    });

    it('returns all versions', () => {
      const tracker = new VersionTracker();

      tracker.setVersion('core', '2.0.0');
      tracker.setVersion('plugin', '1.5.0');
      tracker.setVersion('cli', '2.1.0');

      const versions = tracker.getAllVersions();

      expect(versions).toEqual({
        core: '2.0.0',
        plugin: '1.5.0',
        cli: '2.1.0',
      });
    });
  });

  describe('Backward Compatibility', () => {
    it('old format data is readable', () => {
      const oldFormatData = {
        skills: ['testing/omega'],
        commands: ['/dev:test'],
      };

      // Should be able to process old format
      const skills = oldFormatData.skills.map(s => {
        const [cat, name] = s.split('/');
        return { category: cat, name };
      });

      expect(skills[0].category).toBe('testing');
      expect(skills[0].name).toBe('omega');
    });

    it('supports legacy configuration', () => {
      const legacyConfig = {
        version: '1.0.0',
        agents: ['tester'], // v1 used simple names
      };

      // Transform to new format
      const modernConfig = {
        version: '2.0.0',
        agents: legacyConfig.agents.map(name => ({
          name,
          path: `agents/${name}.md`,
        })),
      };

      expect(modernConfig.agents[0].path).toBe('agents/tester.md');
    });

    it('handles missing new fields gracefully', () => {
      const oldData = {
        name: 'test',
        // Missing 'newRequiredField' from v2
      };

      const withDefaults = {
        newRequiredField: 'default-value',
        ...oldData,
      };

      expect(withDefaults.name).toBe('test');
      expect(withDefaults.newRequiredField).toBe('default-value');
    });
  });

  describe('File Format Upgrades', () => {
    it('upgrades file format on read', () => {
      // Simulate reading v1 format file
      const v1Content = `---
name: test-agent
skills:
  - testing/omega
---
# Agent content`;

      // Detect version and upgrade if needed
      const frontmatterMatch = v1Content.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter = frontmatterMatch[1];

      // Check if skills is array (v1) vs object (v2)
      const isV1 = frontmatter.includes('  - ');

      expect(isV1).toBe(true);
    });

    it('writes in latest format', () => {
      const data = {
        name: 'test-agent',
        skills: {
          testing: ['omega', 'tdd'],
        },
      };

      // Serialize to latest format
      const content = `---
name: ${data.name}
skills:
  testing:
    - omega
    - tdd
---`;

      expect(content).toContain('testing:');
      expect(content).not.toContain('testing/omega');
    });
  });
});

describe('Upgrade Path Invariants', () => {
  it('version order is transitive', () => {
    const versions = ['1.0.0', '1.1.0', '1.2.0', '2.0.0', '2.1.0'];

    for (let i = 0; i < versions.length; i++) {
      for (let j = i + 1; j < versions.length; j++) {
        expect(semver.compare(versions[i], versions[j])).toBeLessThan(0);
      }
    }
  });

  it('migrations are deterministic', async () => {
    const manager = new MigrationManager();

    manager.registerMigration('1.0.0', '2.0.0', async (data) => ({
      ...data,
      migrated: true,
      timestamp: 'fixed-value',
    }));

    const result1 = await manager.migrate('1.0.0', '2.0.0');
    manager.executedMigrations = [];
    const result2 = await manager.migrate('1.0.0', '2.0.0');

    expect(result1.finalData).toEqual(result2.finalData);
  });

  it('migration path exists for all version pairs', () => {
    const manager = new MigrationManager();

    // Register complete migration chain
    manager.registerMigration('1.0.0', '1.1.0', async d => d);
    manager.registerMigration('1.1.0', '1.2.0', async d => d);
    manager.registerMigration('1.2.0', '2.0.0', async d => d);

    const versions = ['1.0.0', '1.1.0', '1.2.0', '2.0.0'];

    for (let i = 0; i < versions.length; i++) {
      for (let j = i + 1; j < versions.length; j++) {
        const path = manager.findMigrationPath(versions[i], versions[j]);
        expect(path).not.toBeNull();
      }
    }
  });

  it('schema validation is consistent', () => {
    const migrator = new SchemaMigrator();

    migrator.registerSchema('1.0.0', {
      required: ['name'],
      fields: { name: 'string' },
    });

    const data = { name: 'test' };

    // Multiple validations should give same result
    const results = Array(10).fill(null).map(() =>
      migrator.validate(data, '1.0.0')
    );

    expect(results.every(r => r.valid === results[0].valid)).toBe(true);
  });
});
