/**
 * Workflow Config System Tests
 *
 * Validates the workflow configuration system including:
 * - Skill files (workflow-config, git-hooks)
 * - Workflow files (trunk-based)
 * - Command files (workflow/*, hooks/*)
 * - Template files (workflow.yaml, etc.)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const PLUGIN_DIR = path.join(process.cwd(), 'plugin');
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

// Helper functions
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch {
    return null;
  }
}

function getContentAfterFrontmatter(content) {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '');
}

// ============================================================================
// SKILL FILES TESTS
// ============================================================================

describe('Workflow Config System - Skills', () => {
  describe('devops/workflow-config skill', () => {
    const skillPath = path.join(PLUGIN_DIR, 'skills/devops/workflow-config/SKILL.md');
    let content;
    let frontmatter;

    beforeAll(() => {
      content = readFile(skillPath);
      frontmatter = parseFrontmatter(content);
    });

    it('should exist', () => {
      expect(fileExists(skillPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBeDefined();
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.category).toBe('devops');
    });

    it('should have related skills', () => {
      expect(frontmatter.related_skills).toBeDefined();
      expect(Array.isArray(frontmatter.related_skills)).toBe(true);
      expect(frontmatter.related_skills).toContain('devops/git-hooks');
    });

    it('should have related commands', () => {
      expect(frontmatter.related_commands).toBeDefined();
      expect(Array.isArray(frontmatter.related_commands)).toBe(true);
      expect(frontmatter.related_commands).toContain('/workflow:init');
    });

    it('should have minimum 30 lines', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThanOrEqual(30);
    });

    it('should document config schema', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('version:');
      expect(body).toContain('git:');
      expect(body).toContain('commit:');
      expect(body).toContain('pr:');
      expect(body).toContain('hooks:');
    });

    it('should document workflow types', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('trunk-based');
      expect(body).toContain('gitflow');
      expect(body).toContain('github-flow');
    });

    it('should have code examples', () => {
      expect(content).toMatch(/```yaml/);
    });

    it('should document branch settings', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('main_branch');
      expect(body).toContain('branch_prefix');
      expect(body).toContain('feature/');
    });

    it('should document commit conventions', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('conventional');
      expect(body).toContain('allowed_types');
      expect(body).toContain('feat');
      expect(body).toContain('fix');
    });

    it('should document PR settings', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('require_review');
      expect(body).toContain('squash_merge');
      expect(body).toContain('labels');
    });

    it('should document review settings', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('auto_review');
      expect(body).toContain('security');
      expect(body).toContain('performance');
    });

    it('should document hooks settings', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('pre_commit');
      expect(body).toContain('pre_push');
      expect(body).toContain('commit_msg');
    });

    it('should document feature flags', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('feature_flags');
      expect(body).toContain('vercel-edge');
      expect(body).toContain('launchdarkly');
    });
  });

  describe('devops/git-hooks skill', () => {
    const skillPath = path.join(PLUGIN_DIR, 'skills/devops/git-hooks/SKILL.md');
    let content;
    let frontmatter;

    beforeAll(() => {
      content = readFile(skillPath);
      frontmatter = parseFrontmatter(content);
    });

    it('should exist', () => {
      expect(fileExists(skillPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBeDefined();
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.category).toBe('devops');
    });

    it('should reference workflow-config skill', () => {
      expect(frontmatter.related_skills).toContain('devops/workflow-config');
    });

    it('should have related commands', () => {
      expect(frontmatter.related_commands).toContain('/hooks:setup');
      expect(frontmatter.related_commands).toContain('/hooks:run');
    });

    it('should have minimum 30 lines', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThanOrEqual(30);
    });

    it('should document hook types', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('pre-commit');
      expect(body).toContain('commit-msg');
      expect(body).toContain('pre-push');
      expect(body).toContain('post-merge');
    });

    it('should document hook actions', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('lint');
      expect(body).toContain('format');
      expect(body).toContain('type-check');
      expect(body).toContain('test');
    });

    it('should have hook script templates', () => {
      expect(content).toMatch(/```bash/);
      expect(content).toContain('#!/bin/bash');
    });

    it('should document auto-detection', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('eslint');
      expect(body).toContain('prettier');
      expect(body).toContain('pytest');
    });

    it('should document bypass options', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('SKIP_HOOKS');
      expect(body).toContain('--no-verify');
    });
  });
});

// ============================================================================
// WORKFLOW FILES TESTS
// ============================================================================

describe('Workflow Config System - Workflows', () => {
  describe('git/trunk-based workflow', () => {
    const workflowPath = path.join(PLUGIN_DIR, 'workflows/git/trunk-based.md');
    let content;
    let frontmatter;

    beforeAll(() => {
      content = readFile(workflowPath);
      frontmatter = parseFrontmatter(content);
    });

    it('should exist', () => {
      expect(fileExists(workflowPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBeDefined();
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.category).toBe('git');
    });

    it('should have agents array', () => {
      expect(frontmatter.agents).toBeDefined();
      expect(Array.isArray(frontmatter.agents)).toBe(true);
      expect(frontmatter.agents.length).toBeGreaterThan(0);
    });

    it('should have skills array', () => {
      expect(frontmatter.skills).toBeDefined();
      expect(Array.isArray(frontmatter.skills)).toBe(true);
      expect(frontmatter.skills).toContain('devops/workflow-config');
    });

    it('should have commands array', () => {
      expect(frontmatter.commands).toBeDefined();
      expect(Array.isArray(frontmatter.commands)).toBe(true);
    });

    it('should have minimum 50 lines', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThanOrEqual(50);
    });

    it('should document all workflow steps', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('Step 1');
      expect(body).toContain('Step 2');
      expect(body).toContain('Step 3');
    });

    it('should document feature flags integration', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('Feature Flags');
      expect(body).toContain('feature flag');
    });

    it('should document code review', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('Code Review');
      expect(body).toContain('Claude');
    });

    it('should document merge strategy', () => {
      const body = getContentAfterFrontmatter(content);
      expect(body).toContain('squash');
      expect(body).toContain('merge');
    });

    it('should have config integration examples', () => {
      expect(content).toMatch(/```yaml/);
      expect(content).toContain('workflow.yaml');
    });
  });
});

// ============================================================================
// COMMAND FILES TESTS
// ============================================================================

describe('Workflow Config System - Commands', () => {
  const commands = [
    { path: 'workflow/init.md', name: 'workflow:init' },
    { path: 'workflow/trunk-based.md', name: 'workflow:trunk-based' },
    { path: 'workflow/status.md', name: 'workflow:status' },
    { path: 'hooks/setup.md', name: 'hooks:setup' },
    { path: 'hooks/run.md', name: 'hooks:run' },
  ];

  commands.forEach(({ path: cmdPath, name }) => {
    describe(`${name} command`, () => {
      const fullPath = path.join(PLUGIN_DIR, 'commands', cmdPath);
      let content;
      let frontmatter;

      beforeAll(() => {
        content = readFile(fullPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should exist', () => {
        expect(fileExists(fullPath)).toBe(true);
      });

      it('should have valid frontmatter', () => {
        expect(frontmatter).not.toBeNull();
        expect(frontmatter.name).toBe(name);
        expect(frontmatter.description).toBeDefined();
      });

      it('should have category', () => {
        expect(frontmatter.category).toBeDefined();
      });

      it('should have minimum 15 lines', () => {
        const lines = content.split('\n').length;
        expect(lines).toBeGreaterThanOrEqual(15);
      });

      it('should have usage section', () => {
        const body = getContentAfterFrontmatter(content);
        expect(body.toLowerCase()).toContain('usage');
      });

      it('should have code examples', () => {
        expect(content).toMatch(/```(bash|yaml)?/);
      });
    });
  });

  describe('workflow:init specific tests', () => {
    const cmdPath = path.join(PLUGIN_DIR, 'commands/workflow/init.md');
    let content;

    beforeAll(() => {
      content = readFile(cmdPath);
    });

    it('should document workflow presets', () => {
      expect(content).toContain('trunk-based');
      expect(content).toContain('gitflow');
      expect(content).toContain('github-flow');
    });

    it('should document --defaults flag', () => {
      expect(content).toContain('--defaults');
    });

    it('should document --force flag', () => {
      expect(content).toContain('--force');
    });

    it('should document output files', () => {
      expect(content).toContain('.omgkit/');
      expect(content).toContain('workflow.yaml');
    });
  });

  describe('hooks:setup specific tests', () => {
    const cmdPath = path.join(PLUGIN_DIR, 'commands/hooks/setup.md');
    let content;

    beforeAll(() => {
      content = readFile(cmdPath);
    });

    it('should document --dry-run flag', () => {
      expect(content).toContain('--dry-run');
    });

    it('should document --remove flag', () => {
      expect(content).toContain('--remove');
    });

    it('should document hook installation', () => {
      expect(content).toContain('.git/hooks/');
    });
  });
});

// ============================================================================
// TEMPLATE FILES TESTS
// ============================================================================

describe('Workflow Config System - Templates', () => {
  const templates = [
    { path: 'omgkit/workflow.yaml', name: 'default' },
    { path: 'omgkit/workflow-trunk.yaml', name: 'trunk-based' },
    { path: 'omgkit/workflow-gitflow.yaml', name: 'gitflow' },
    { path: 'omgkit/workflow-github.yaml', name: 'github-flow' },
  ];

  templates.forEach(({ path: tplPath, name }) => {
    describe(`${name} template`, () => {
      const fullPath = path.join(TEMPLATES_DIR, tplPath);
      let content;
      let config;

      beforeAll(() => {
        content = readFile(fullPath);
        try {
          config = yaml.load(content);
        } catch {
          config = null;
        }
      });

      it('should exist', () => {
        expect(fileExists(fullPath)).toBe(true);
      });

      it('should be valid YAML', () => {
        expect(config).not.toBeNull();
      });

      it('should have version field', () => {
        expect(config.version).toBeDefined();
        expect(config.version).toBe('1.0');
      });

      it('should have git section', () => {
        expect(config.git).toBeDefined();
        expect(config.git.workflow).toBeDefined();
        expect(config.git.main_branch).toBeDefined();
      });

      it('should have commit section', () => {
        expect(config.commit).toBeDefined();
        expect(config.commit.conventional).toBeDefined();
      });

      it('should have pr section', () => {
        expect(config.pr).toBeDefined();
        expect(config.pr.require_review).toBeDefined();
      });

      it('should have hooks section', () => {
        expect(config.hooks).toBeDefined();
        expect(config.hooks.pre_commit).toBeDefined();
      });

      it('should have valid workflow type', () => {
        const validTypes = ['trunk-based', 'gitflow', 'github-flow'];
        expect(validTypes).toContain(config.git.workflow);
      });
    });
  });

  describe('trunk-based template specifics', () => {
    const fullPath = path.join(TEMPLATES_DIR, 'omgkit/workflow-trunk.yaml');
    let config;

    beforeAll(() => {
      config = yaml.load(readFile(fullPath));
    });

    it('should have trunk-based workflow', () => {
      expect(config.git.workflow).toBe('trunk-based');
    });

    it('should have short branch age limit', () => {
      expect(config.git.max_branch_age_days).toBeLessThanOrEqual(3);
    });

    it('should enable feature flags', () => {
      expect(config.feature_flags).toBeDefined();
      expect(config.feature_flags.provider).not.toBe('none');
    });

    it('should enable auto-review', () => {
      expect(config.review.auto_review).toBe(true);
    });

    it('should enable squash merge', () => {
      expect(config.pr.squash_merge).toBe(true);
    });
  });

  describe('gitflow template specifics', () => {
    const fullPath = path.join(TEMPLATES_DIR, 'omgkit/workflow-gitflow.yaml');
    let config;

    beforeAll(() => {
      config = yaml.load(readFile(fullPath));
    });

    it('should have gitflow workflow', () => {
      expect(config.git.workflow).toBe('gitflow');
    });

    it('should have develop branch', () => {
      expect(config.git.develop_branch).toBe('develop');
    });

    it('should have release branch prefix', () => {
      expect(config.git.branch_prefix.release).toBeDefined();
    });

    it('should have longer branch age limit', () => {
      expect(config.git.max_branch_age_days).toBeGreaterThanOrEqual(7);
    });
  });
});

// ============================================================================
// CROSS-VALIDATION TESTS
// ============================================================================

describe('Workflow Config System - Cross Validation', () => {
  it('should have all skills referenced in workflows', () => {
    const workflowPath = path.join(PLUGIN_DIR, 'workflows/git/trunk-based.md');
    const content = readFile(workflowPath);
    const frontmatter = parseFrontmatter(content);

    frontmatter.skills.forEach(skill => {
      const skillPath = path.join(PLUGIN_DIR, `skills/${skill}/SKILL.md`);
      expect(fileExists(skillPath), `Skill ${skill} should exist`).toBe(true);
    });
  });

  it('should have all commands referenced in skills', () => {
    const skillPath = path.join(PLUGIN_DIR, 'skills/devops/workflow-config/SKILL.md');
    const content = readFile(skillPath);
    const frontmatter = parseFrontmatter(content);

    frontmatter.related_commands.forEach(cmd => {
      const cmdName = cmd.replace('/', '').replace(':', '/') + '.md';
      const cmdPath = path.join(PLUGIN_DIR, 'commands', cmdName);
      expect(fileExists(cmdPath), `Command ${cmd} should exist`).toBe(true);
    });
  });

  it('should have consistent workflow types across templates', () => {
    const templates = [
      'omgkit/workflow-trunk.yaml',
      'omgkit/workflow-gitflow.yaml',
      'omgkit/workflow-github.yaml',
    ];

    const expectedTypes = ['trunk-based', 'gitflow', 'github-flow'];

    templates.forEach((tpl, index) => {
      const config = yaml.load(readFile(path.join(TEMPLATES_DIR, tpl)));
      expect(config.git.workflow).toBe(expectedTypes[index]);
    });
  });

  it('should have all hook types documented', () => {
    const skillPath = path.join(PLUGIN_DIR, 'skills/devops/git-hooks/SKILL.md');
    const content = readFile(skillPath);

    const hookTypes = ['pre-commit', 'commit-msg', 'pre-push', 'post-merge'];
    hookTypes.forEach(hook => {
      expect(content).toContain(hook);
    });
  });

  it('should reference BigTech practices', () => {
    const skillPath = path.join(PLUGIN_DIR, 'skills/devops/workflow-config/SKILL.md');
    const content = readFile(skillPath);

    // Trunk-based is used by Google, Netflix, etc.
    expect(content.toLowerCase()).toMatch(/continuous|trunk|main/);
  });
});

// ============================================================================
// SCHEMA VALIDATION TESTS
// ============================================================================

describe('Workflow Config System - Schema Validation', () => {
  const defaultTemplate = path.join(TEMPLATES_DIR, 'omgkit/workflow.yaml');
  let config;

  beforeAll(() => {
    config = yaml.load(readFile(defaultTemplate));
  });

  describe('git section schema', () => {
    it('should have valid workflow type', () => {
      const validTypes = ['trunk-based', 'gitflow', 'github-flow'];
      expect(validTypes).toContain(config.git.workflow);
    });

    it('should have string main_branch', () => {
      expect(typeof config.git.main_branch).toBe('string');
    });

    it('should have object branch_prefix', () => {
      expect(typeof config.git.branch_prefix).toBe('object');
      expect(config.git.branch_prefix.feature).toBeDefined();
    });

    it('should have number max_branch_age_days', () => {
      expect(typeof config.git.max_branch_age_days).toBe('number');
      expect(config.git.max_branch_age_days).toBeGreaterThan(0);
    });

    it('should have boolean delete_branch_on_merge', () => {
      expect(typeof config.git.delete_branch_on_merge).toBe('boolean');
    });
  });

  describe('commit section schema', () => {
    it('should have boolean conventional', () => {
      expect(typeof config.commit.conventional).toBe('boolean');
    });

    it('should have array allowed_types', () => {
      expect(Array.isArray(config.commit.allowed_types)).toBe(true);
      expect(config.commit.allowed_types.length).toBeGreaterThan(0);
    });

    it('should include standard commit types', () => {
      expect(config.commit.allowed_types).toContain('feat');
      expect(config.commit.allowed_types).toContain('fix');
    });

    it('should have number max_subject_length', () => {
      expect(typeof config.commit.max_subject_length).toBe('number');
      expect(config.commit.max_subject_length).toBeGreaterThanOrEqual(50);
    });
  });

  describe('pr section schema', () => {
    it('should have template setting', () => {
      expect(config.pr.template).toBeDefined();
    });

    it('should have boolean require_review', () => {
      expect(typeof config.pr.require_review).toBe('boolean');
    });

    it('should have labels config', () => {
      expect(config.pr.labels).toBeDefined();
      expect(typeof config.pr.labels.enabled).toBe('boolean');
    });
  });

  describe('hooks section schema', () => {
    it('should have pre_commit config', () => {
      expect(config.hooks.pre_commit).toBeDefined();
      expect(typeof config.hooks.pre_commit.enabled).toBe('boolean');
    });

    it('should have pre_commit actions', () => {
      expect(Array.isArray(config.hooks.pre_commit.actions)).toBe(true);
    });

    it('should have commit_msg config', () => {
      expect(config.hooks.commit_msg).toBeDefined();
      expect(typeof config.hooks.commit_msg.enabled).toBe('boolean');
    });

    it('should have pre_push config', () => {
      expect(config.hooks.pre_push).toBeDefined();
      expect(typeof config.hooks.pre_push.enabled).toBe('boolean');
    });
  });

  describe('deploy section schema', () => {
    it('should have provider setting', () => {
      expect(config.deploy.provider).toBeDefined();
    });

    it('should have production_branch', () => {
      expect(typeof config.deploy.production_branch).toBe('string');
    });

    it('should have boolean auto_deploy', () => {
      expect(typeof config.deploy.auto_deploy).toBe('boolean');
    });
  });

  describe('feature_flags section schema', () => {
    it('should have provider setting', () => {
      expect(config.feature_flags.provider).toBeDefined();
    });

    it('should have boolean default_state', () => {
      expect(typeof config.feature_flags.default_state).toBe('boolean');
    });
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Workflow Config System - Integration', () => {
  it('should integrate with existing git commands', () => {
    const gitCommands = ['commit', 'pr', 'ship'];

    gitCommands.forEach(cmd => {
      const cmdPath = path.join(PLUGIN_DIR, `commands/git/${cmd}.md`);
      expect(fileExists(cmdPath), `Git command ${cmd} should exist`).toBe(true);
    });
  });

  it('should integrate with existing dev commands', () => {
    const devCommands = ['review', 'test'];

    devCommands.forEach(cmd => {
      const cmdPath = path.join(PLUGIN_DIR, `commands/dev/${cmd}.md`);
      expect(fileExists(cmdPath), `Dev command ${cmd} should exist`).toBe(true);
    });
  });

  it('should align with feature-flags skill', () => {
    const ffSkillPath = path.join(PLUGIN_DIR, 'skills/devops/feature-flags/SKILL.md');
    expect(fileExists(ffSkillPath)).toBe(true);
  });

  it('should align with dora-metrics skill', () => {
    const doraSkillPath = path.join(PLUGIN_DIR, 'skills/devops/dora-metrics/SKILL.md');
    expect(fileExists(doraSkillPath)).toBe(true);
  });
});
