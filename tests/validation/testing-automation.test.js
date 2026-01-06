/**
 * Testing Automation Features Tests
 *
 * Tests for the testing automation features:
 * - Test task generation skill
 * - Test enforcement skill
 * - Testing commands (verify-done, coverage-check, test-plan, feature-tested)
 * - Automated testing workflow
 * - Workflow config testing section
 * - Template testing sections
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const PLUGIN_ROOT = join(process.cwd(), 'plugin');
const TEMPLATES_ROOT = join(process.cwd(), 'templates', 'omgkit');

// Helper to read file content
function readFile(path) {
  return readFileSync(path, 'utf8');
}

// Helper to parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (e) {
    return null;
  }
}

// Helper to get body content (after frontmatter)
function getBody(content) {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
}

describe('Testing Automation Features', () => {

  describe('Test Task Generation Skill', () => {
    const skillPath = join(PLUGIN_ROOT, 'skills', 'methodology', 'test-task-generation', 'SKILL.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(skillPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should exist', () => {
      expect(existsSync(skillPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBe('Test Task Generation');
      expect(frontmatter.category).toBe('methodology');
    });

    it('should have description', () => {
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.description.length).toBeGreaterThan(50);
    });

    it('should have related skills', () => {
      expect(frontmatter.related_skills).toBeDefined();
      expect(frontmatter.related_skills).toContain('methodology/test-enforcement');
    });

    it('should have related commands', () => {
      expect(frontmatter.related_commands).toBeDefined();
      expect(frontmatter.related_commands).toContain('/dev:feature-tested');
    });

    it('should document feature type to test type mapping', () => {
      expect(body).toContain('Feature Type');
      expect(body).toContain('Required Tests');
      expect(body).toContain('API Endpoint');
      expect(body).toContain('UI Component');
      expect(body).toContain('Business Logic');
    });

    it('should document test task template', () => {
      expect(body).toContain('Test Task Template');
      expect(body).toContain('Acceptance Criteria');
      expect(body).toContain('Test Cases');
    });

    it('should document auto-generation algorithm', () => {
      expect(body).toContain('Auto-Generation Algorithm');
      expect(body).toContain('generate_test_tasks');
    });

    it('should document coverage requirements', () => {
      expect(body).toContain('Coverage Requirements');
      expect(body).toContain('Minimum Coverage');
      expect(body).toContain('80%');
    });

    it('should have examples', () => {
      expect(body).toContain('Example 1');
      expect(body).toContain('Example 2');
    });

    it('should be at least 200 lines', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThan(200);
    });
  });

  describe('Test Enforcement Skill', () => {
    const skillPath = join(PLUGIN_ROOT, 'skills', 'methodology', 'test-enforcement', 'SKILL.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(skillPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should exist', () => {
      expect(existsSync(skillPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBe('Test Enforcement');
      expect(frontmatter.category).toBe('methodology');
    });

    it('should have description', () => {
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.description.length).toBeGreaterThan(50);
    });

    it('should have related skills', () => {
      expect(frontmatter.related_skills).toBeDefined();
      expect(frontmatter.related_skills).toContain('methodology/test-task-generation');
    });

    it('should have related commands', () => {
      expect(frontmatter.related_commands).toBeDefined();
      expect(frontmatter.related_commands).toContain('/quality:verify-done');
    });

    it('should document enforcement levels', () => {
      expect(body).toContain('Enforcement Levels');
      expect(body).toContain('Soft Enforcement');
      expect(body).toContain('Standard Enforcement');
      expect(body).toContain('Strict Enforcement');
    });

    it('should document configuration', () => {
      expect(body).toContain('Configuration');
      expect(body).toContain('enforcement');
      expect(body).toContain('coverage_gates');
    });

    it('should document pre-completion checklist', () => {
      expect(body).toContain('Pre-Completion Checklist');
      expect(body).toContain('Mandatory Checks');
    });

    it('should document enforcement workflow', () => {
      expect(body).toContain('Enforcement Workflow');
      expect(body).toContain('Task Completion Attempt');
    });

    it('should document override procedures', () => {
      expect(body).toContain('Override');
      expect(body).toContain('Emergency Override');
    });

    it('should be at least 200 lines', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThan(200);
    });
  });

  describe('Verify Done Command', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands', 'quality', 'verify-done.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should exist', () => {
      expect(existsSync(cmdPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBe('Verify Done');
      expect(frontmatter.category).toBe('quality');
    });

    it('should have description', () => {
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.description.length).toBeGreaterThan(20);
    });

    it('should have related skills', () => {
      expect(frontmatter.related_skills).toBeDefined();
      expect(frontmatter.related_skills).toContain('methodology/test-enforcement');
    });

    it('should have allowed-tools', () => {
      expect(frontmatter['allowed-tools']).toBeDefined();
    });

    it('should document usage', () => {
      expect(body).toContain('Usage');
      expect(body).toContain('/quality:verify-done');
    });

    it('should document what it checks', () => {
      expect(body).toContain('Test Existence');
      expect(body).toContain('Coverage Requirements');
    });

    it('should have output format', () => {
      expect(body).toContain('Output Format');
      expect(body).toContain('VERIFY DONE REPORT');
    });
  });

  describe('Coverage Check Command', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands', 'quality', 'coverage-check.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should exist', () => {
      expect(existsSync(cmdPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBe('Coverage Check');
      expect(frontmatter.category).toBe('quality');
    });

    it('should have description', () => {
      expect(frontmatter.description).toBeDefined();
    });

    it('should document usage', () => {
      expect(body).toContain('Usage');
      expect(body).toContain('/quality:coverage-check');
    });

    it('should document options', () => {
      expect(body).toContain('Options');
      expect(body).toContain('--type');
      expect(body).toContain('--threshold');
    });

    it('should have output format', () => {
      expect(body).toContain('Output Format');
      expect(body).toContain('COVERAGE REPORT');
    });

    it('should document coverage gates configuration', () => {
      expect(body).toContain('Coverage Gates Configuration');
      expect(body).toContain('minimum');
      expect(body).toContain('target');
    });
  });

  describe('Test Plan Command', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands', 'quality', 'test-plan.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should exist', () => {
      expect(existsSync(cmdPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBe('Test Plan');
      expect(frontmatter.category).toBe('quality');
    });

    it('should have description', () => {
      expect(frontmatter.description).toBeDefined();
    });

    it('should have related skills', () => {
      expect(frontmatter.related_skills).toBeDefined();
      expect(frontmatter.related_skills).toContain('methodology/test-task-generation');
    });

    it('should document usage', () => {
      expect(body).toContain('Usage');
      expect(body).toContain('/quality:test-plan');
    });

    it('should have output format', () => {
      expect(body).toContain('Output Format');
      expect(body).toContain('Test Plan');
    });
  });

  describe('Feature Tested Command', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands', 'dev', 'feature-tested.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should exist', () => {
      expect(existsSync(cmdPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBe('Feature Tested');
      expect(frontmatter.category).toBe('dev');
    });

    it('should have description', () => {
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.description).toContain('test');
    });

    it('should have related skills', () => {
      expect(frontmatter.related_skills).toBeDefined();
      expect(frontmatter.related_skills).toContain('methodology/test-task-generation');
    });

    it('should have Task in allowed-tools', () => {
      expect(frontmatter['allowed-tools']).toContain('Task');
    });

    it('should document usage', () => {
      expect(body).toContain('Usage');
      expect(body).toContain('/dev:feature-tested');
    });

    it('should document options', () => {
      expect(body).toContain('Options');
      expect(body).toContain('--coverage');
      expect(body).toContain('--tdd');
    });

    it('should explain how it works', () => {
      expect(body).toContain('How It Works');
      expect(body).toContain('Feature Analysis');
      expect(body).toContain('Task Generation');
    });

    it('should document TDD mode', () => {
      expect(body).toContain('TDD Mode');
    });

    it('should compare with /dev:feature', () => {
      expect(body).toContain('Comparison');
      expect(body).toContain('/dev:feature');
    });
  });

  describe('Automated Testing Workflow', () => {
    const wfPath = join(PLUGIN_ROOT, 'workflows', 'testing', 'automated-testing.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(wfPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should exist', () => {
      expect(existsSync(wfPath)).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).not.toBeNull();
      expect(frontmatter.name).toBe('Automated Testing Workflow');
      expect(frontmatter.category).toBe('testing');
    });

    it('should have complexity', () => {
      expect(frontmatter.complexity).toBeDefined();
    });

    it('should have agents', () => {
      expect(frontmatter.agents).toBeDefined();
      expect(frontmatter.agents).toContain('tester');
      expect(frontmatter.agents).toContain('planner');
    });

    it('should have skills', () => {
      expect(frontmatter.skills).toBeDefined();
      expect(frontmatter.skills).toContain('methodology/test-task-generation');
      expect(frontmatter.skills).toContain('methodology/test-enforcement');
    });

    it('should have commands', () => {
      expect(frontmatter.commands).toBeDefined();
      expect(frontmatter.commands).toContain('/quality:test-plan');
      expect(frontmatter.commands).toContain('/quality:verify-done');
    });

    it('should have prerequisites', () => {
      expect(frontmatter.prerequisites).toBeDefined();
    });

    it('should have workflow diagram', () => {
      expect(body).toContain('Workflow Diagram');
      expect(body).toContain('ANALYZE');
      expect(body).toContain('PLAN');
      expect(body).toContain('EXECUTE');
      expect(body).toContain('VERIFY');
    });

    it('should have steps', () => {
      expect(body).toContain('Step 1');
      expect(body).toContain('Step 2');
      expect(body).toContain('Step 3');
    });

    it('should have quality gates', () => {
      expect(body).toContain('Quality Gates');
      expect(body).toContain('Minimum');
      expect(body).toContain('Target');
    });

    it('should have configuration section', () => {
      expect(body).toContain('Configuration');
      expect(body).toContain('workflow.yaml');
    });

    it('should be at least 150 lines', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThan(150);
    });
  });

  describe('Workflow Config Testing Section', () => {
    const skillPath = join(PLUGIN_ROOT, 'skills', 'devops', 'workflow-config', 'SKILL.md');
    let content;

    beforeAll(() => {
      content = readFile(skillPath);
    });

    it('should have testing section in schema', () => {
      expect(content).toContain('TESTING AUTOMATION SETTINGS');
      expect(content).toContain('testing:');
    });

    it('should define enforcement levels', () => {
      expect(content).toContain('enforcement:');
      expect(content).toContain('level:');
    });

    it('should define coverage gates', () => {
      expect(content).toContain('coverage_gates:');
      expect(content).toContain('minimum:');
      expect(content).toContain('target:');
    });

    it('should define required test types', () => {
      expect(content).toContain('required_test_types:');
      expect(content).toContain('unit');
      expect(content).toContain('integration');
    });

    it('should define blocking behavior', () => {
      expect(content).toContain('blocking:');
      expect(content).toContain('on_test_failure:');
      expect(content).toContain('on_coverage_below_minimum:');
    });

    it('should have related skills for testing', () => {
      expect(content).toContain('methodology/test-task-generation');
      expect(content).toContain('methodology/test-enforcement');
    });

    it('should have related commands for testing', () => {
      expect(content).toContain('/quality:verify-done');
      expect(content).toContain('/quality:coverage-check');
    });
  });

  describe('Workflow Templates Testing Section', () => {
    const templates = [
      'workflow.yaml',
      'workflow-trunk.yaml',
      'workflow-github.yaml',
      'workflow-gitflow.yaml'
    ];

    templates.forEach(template => {
      describe(`${template}`, () => {
        const templatePath = join(TEMPLATES_ROOT, template);
        let content, config;

        beforeAll(() => {
          content = readFile(templatePath);
          config = yaml.load(content);
        });

        it('should exist', () => {
          expect(existsSync(templatePath)).toBe(true);
        });

        it('should have testing section', () => {
          expect(config.testing).toBeDefined();
        });

        it('should have enforcement config', () => {
          expect(config.testing.enforcement).toBeDefined();
          expect(config.testing.enforcement.level).toBeDefined();
        });

        it('should have coverage gates', () => {
          expect(config.testing.coverage_gates).toBeDefined();
          expect(config.testing.coverage_gates.unit).toBeDefined();
          expect(config.testing.coverage_gates.unit.minimum).toBeDefined();
          expect(config.testing.coverage_gates.unit.target).toBeDefined();
        });

        it('should have required test types', () => {
          expect(config.testing.required_test_types).toBeDefined();
          expect(config.testing.required_test_types).toContain('unit');
        });

        it('should have blocking config', () => {
          expect(config.testing.blocking).toBeDefined();
          expect(config.testing.blocking.on_test_failure).toBe(true);
        });

        it('should have auto_generate_tasks', () => {
          expect(config.testing.auto_generate_tasks).toBe(true);
        });

        it('should have coverage in ci required_checks if ci section exists', () => {
          // Default workflow.yaml may not have ci section
          if (config.ci && config.ci.required_checks) {
            expect(config.ci.required_checks).toContain('coverage');
          } else {
            // Skip for templates without ci section (like default workflow.yaml)
            expect(true).toBe(true);
          }
        });
      });
    });
  });

  describe('Cross-References Validation', () => {
    it('test-task-generation should reference test-enforcement', () => {
      const content = readFile(join(PLUGIN_ROOT, 'skills', 'methodology', 'test-task-generation', 'SKILL.md'));
      expect(content).toContain('test-enforcement');
    });

    it('test-enforcement should reference test-task-generation', () => {
      const content = readFile(join(PLUGIN_ROOT, 'skills', 'methodology', 'test-enforcement', 'SKILL.md'));
      expect(content).toContain('test-task-generation');
    });

    it('verify-done should reference test-enforcement skill', () => {
      const content = readFile(join(PLUGIN_ROOT, 'commands', 'quality', 'verify-done.md'));
      expect(content).toContain('test-enforcement');
    });

    it('feature-tested should reference test-task-generation skill', () => {
      const content = readFile(join(PLUGIN_ROOT, 'commands', 'dev', 'feature-tested.md'));
      expect(content).toContain('test-task-generation');
    });

    it('automated-testing workflow should reference both skills', () => {
      const content = readFile(join(PLUGIN_ROOT, 'workflows', 'testing', 'automated-testing.md'));
      expect(content).toContain('test-task-generation');
      expect(content).toContain('test-enforcement');
    });
  });

  describe('Coverage Gates Schema Validation', () => {
    const templates = [
      'workflow.yaml',
      'workflow-trunk.yaml',
      'workflow-github.yaml',
      'workflow-gitflow.yaml'
    ];

    templates.forEach(template => {
      it(`${template} coverage gates should have valid values`, () => {
        const content = readFile(join(TEMPLATES_ROOT, template));
        const config = yaml.load(content);

        // Unit coverage
        expect(config.testing.coverage_gates.unit.minimum).toBeGreaterThanOrEqual(60);
        expect(config.testing.coverage_gates.unit.minimum).toBeLessThanOrEqual(100);
        expect(config.testing.coverage_gates.unit.target).toBeGreaterThan(config.testing.coverage_gates.unit.minimum);

        // Integration coverage
        expect(config.testing.coverage_gates.integration.minimum).toBeGreaterThanOrEqual(40);
        expect(config.testing.coverage_gates.integration.minimum).toBeLessThanOrEqual(100);
        expect(config.testing.coverage_gates.integration.target).toBeGreaterThan(config.testing.coverage_gates.integration.minimum);

        // Overall coverage
        expect(config.testing.coverage_gates.overall.minimum).toBeGreaterThanOrEqual(50);
        expect(config.testing.coverage_gates.overall.minimum).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Enforcement Levels Validation', () => {
    it('gitflow should use strict enforcement', () => {
      const content = readFile(join(TEMPLATES_ROOT, 'workflow-gitflow.yaml'));
      const config = yaml.load(content);
      expect(config.testing.enforcement.level).toBe('strict');
    });

    it('trunk-based should use standard enforcement', () => {
      const content = readFile(join(TEMPLATES_ROOT, 'workflow-trunk.yaml'));
      const config = yaml.load(content);
      expect(config.testing.enforcement.level).toBe('standard');
    });

    it('github-flow should use standard enforcement', () => {
      const content = readFile(join(TEMPLATES_ROOT, 'workflow-github.yaml'));
      const config = yaml.load(content);
      expect(config.testing.enforcement.level).toBe('standard');
    });
  });

  describe('GitFlow Stricter Requirements', () => {
    let config;

    beforeAll(() => {
      const content = readFile(join(TEMPLATES_ROOT, 'workflow-gitflow.yaml'));
      config = yaml.load(content);
    });

    it('should have higher unit coverage minimum than others', () => {
      const trunkConfig = yaml.load(readFile(join(TEMPLATES_ROOT, 'workflow-trunk.yaml')));
      expect(config.testing.coverage_gates.unit.minimum)
        .toBeGreaterThan(trunkConfig.testing.coverage_gates.unit.minimum);
    });

    it('should require e2e tests', () => {
      expect(config.testing.required_test_types).toContain('e2e');
    });

    it('should have optional security tests', () => {
      expect(config.testing.optional_test_types).toContain('security');
    });

    it('should block on missing test types', () => {
      expect(config.testing.blocking.on_missing_test_types).toBe(true);
    });
  });

  describe('Command Format Validation', () => {
    const commands = [
      { path: 'quality/verify-done.md', name: 'Verify Done' },
      { path: 'quality/coverage-check.md', name: 'Coverage Check' },
      { path: 'quality/test-plan.md', name: 'Test Plan' },
      { path: 'dev/feature-tested.md', name: 'Feature Tested' }
    ];

    commands.forEach(({ path, name }) => {
      describe(name, () => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        let content, frontmatter;

        beforeAll(() => {
          content = readFile(cmdPath);
          frontmatter = parseFrontmatter(content);
        });

        it('should have name in frontmatter', () => {
          expect(frontmatter.name).toBe(name);
        });

        it('should have category in frontmatter', () => {
          expect(frontmatter.category).toBeDefined();
        });

        it('should have description in frontmatter', () => {
          expect(frontmatter.description).toBeDefined();
        });

        it('should have h1 title matching command', () => {
          const h1Match = content.match(/^# (.+)$/m);
          expect(h1Match).not.toBeNull();
        });

        it('should have Usage section', () => {
          expect(content).toContain('## Usage');
        });

        it('should be at least 15 lines', () => {
          const lines = content.split('\n').length;
          expect(lines).toBeGreaterThanOrEqual(15);
        });
      });
    });
  });

  describe('Skill Format Validation', () => {
    const skills = [
      { path: 'methodology/test-task-generation/SKILL.md', name: 'Test Task Generation' },
      { path: 'methodology/test-enforcement/SKILL.md', name: 'Test Enforcement' }
    ];

    skills.forEach(({ path, name }) => {
      describe(name, () => {
        const skillPath = join(PLUGIN_ROOT, 'skills', path);
        let content, frontmatter;

        beforeAll(() => {
          content = readFile(skillPath);
          frontmatter = parseFrontmatter(content);
        });

        it('should have name in frontmatter', () => {
          expect(frontmatter.name).toBe(name);
        });

        it('should have category in frontmatter', () => {
          expect(frontmatter.category).toBe('methodology');
        });

        it('should have description in frontmatter', () => {
          expect(frontmatter.description).toBeDefined();
          expect(frontmatter.description.length).toBeGreaterThan(50);
        });

        it('should have related_skills', () => {
          expect(frontmatter.related_skills).toBeDefined();
          expect(Array.isArray(frontmatter.related_skills)).toBe(true);
        });

        it('should have related_commands', () => {
          expect(frontmatter.related_commands).toBeDefined();
          expect(Array.isArray(frontmatter.related_commands)).toBe(true);
        });

        it('should have h1 title', () => {
          const h1Match = content.match(/^# (.+)$/m);
          expect(h1Match).not.toBeNull();
        });

        it('should have Overview section', () => {
          expect(content).toContain('## Overview');
        });

        it('should be at least 30 lines', () => {
          const lines = content.split('\n').length;
          expect(lines).toBeGreaterThanOrEqual(30);
        });
      });
    });
  });

  describe('Workflow Format Validation', () => {
    const wfPath = join(PLUGIN_ROOT, 'workflows', 'testing', 'automated-testing.md');
    let content, frontmatter;

    beforeAll(() => {
      content = readFile(wfPath);
      frontmatter = parseFrontmatter(content);
    });

    it('should have name in frontmatter', () => {
      expect(frontmatter.name).toBeDefined();
    });

    it('should have category in frontmatter', () => {
      expect(frontmatter.category).toBe('testing');
    });

    it('should have complexity in frontmatter', () => {
      expect(frontmatter.complexity).toBeDefined();
      expect(['low', 'medium', 'high']).toContain(frontmatter.complexity);
    });

    it('should have agents in frontmatter', () => {
      expect(frontmatter.agents).toBeDefined();
      expect(Array.isArray(frontmatter.agents)).toBe(true);
      expect(frontmatter.agents.length).toBeGreaterThan(0);
    });

    it('should have skills in frontmatter', () => {
      expect(frontmatter.skills).toBeDefined();
      expect(Array.isArray(frontmatter.skills)).toBe(true);
    });

    it('should have commands in frontmatter', () => {
      expect(frontmatter.commands).toBeDefined();
      expect(Array.isArray(frontmatter.commands)).toBe(true);
    });

    it('should have prerequisites', () => {
      expect(frontmatter.prerequisites).toBeDefined();
    });

    it('should have Steps section', () => {
      expect(content).toContain('## Steps');
    });

    it('should have Quality Gates section', () => {
      expect(content).toContain('## Quality Gates');
    });

    it('should be at least 50 lines', () => {
      const lines = content.split('\n').length;
      expect(lines).toBeGreaterThanOrEqual(50);
    });
  });
});
