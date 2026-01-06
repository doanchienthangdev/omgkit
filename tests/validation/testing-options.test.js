/**
 * Testing Options Validation Tests
 *
 * Tests for the testing options feature in commands:
 * - Command frontmatter with testing options
 * - Argument hints with test flags
 * - Related skills references
 * - Related commands references
 * - CLI configuration documentation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const PLUGIN_ROOT = join(process.cwd(), 'plugin');

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

describe('Testing Options Feature', () => {

  describe('Commands with Testing Enabled by Default', () => {
    // Commands that have configurable testing with enforcement levels
    const commandsWithEnforcementLevels = [
      { path: 'dev/feature.md', name: 'feature' },
      { path: 'dev/fix.md', name: 'fix' },
      { path: 'dev/fix-hard.md', name: 'fix-hard' },
      { path: 'quality/refactor.md', name: 'refactor' },
      { path: 'quality/optimize.md', name: 'optimize' },
      { path: 'sprint/team-run.md', name: 'team-run' }
    ];

    // Test commands don't need enforcement level docs (they document coverage options instead)
    const testCommands = [
      { path: 'dev/tdd.md', name: 'tdd' },
      { path: 'dev/test.md', name: 'test' },
      { path: 'dev/test-write.md', name: 'test-write' },
      { path: 'dev/feature-tested.md', name: 'feature-tested' }
    ];

    commandsWithEnforcementLevels.forEach(({ path, name }) => {
      const namespace = path.startsWith('sprint') ? 'sprint' : (path.startsWith('quality') ? 'quality' : 'dev');
      describe(`/${namespace}:${name}`, () => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        let content, frontmatter, body;

        beforeAll(() => {
          content = readFile(cmdPath);
          frontmatter = parseFrontmatter(content);
          body = getBody(content);
        });

        it('should have testing section in frontmatter', () => {
          expect(frontmatter.testing).toBeDefined();
        });

        it('should have testing.default defined', () => {
          expect(frontmatter.testing.default).toBeDefined();
          expect(typeof frontmatter.testing.default).toBe('boolean');
        });

        it('should have testing.configurable defined', () => {
          expect(frontmatter.testing.configurable).toBeDefined();
          expect(typeof frontmatter.testing.configurable).toBe('boolean');
        });

        it('should document Testing Options section', () => {
          expect(body).toContain('Testing Options');
        });

        it('should document enforcement levels', () => {
          expect(body).toContain('soft');
          expect(body).toContain('standard');
          expect(body).toContain('strict');
        });
      });
    });

    testCommands.forEach(({ path, name }) => {
      describe(`/dev:${name}`, () => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        let content, frontmatter, body;

        beforeAll(() => {
          content = readFile(cmdPath);
          frontmatter = parseFrontmatter(content);
          body = getBody(content);
        });

        it('should have testing section in frontmatter', () => {
          expect(frontmatter.testing).toBeDefined();
        });

        it('should have testing.default defined', () => {
          expect(frontmatter.testing.default).toBeDefined();
          expect(typeof frontmatter.testing.default).toBe('boolean');
        });

        it('should have testing.configurable defined', () => {
          expect(frontmatter.testing.configurable).toBeDefined();
          expect(typeof frontmatter.testing.configurable).toBe('boolean');
        });

        it('should document Testing Options section', () => {
          expect(body).toContain('Testing Options');
        });

        it('should document coverage options', () => {
          expect(body).toContain('coverage');
        });
      });
    });
  });

  describe('Commands with Testing Disabled by Default', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands', 'dev', 'fix-fast.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should have testing.default set to false', () => {
      expect(frontmatter.testing.default).toBe(false);
    });

    it('should have testing.configurable set to true', () => {
      expect(frontmatter.testing.configurable).toBe(true);
    });

    it('should document --with-test option', () => {
      expect(body).toContain('--with-test');
    });

    it('should have argument-hint with --with-test', () => {
      expect(frontmatter['argument-hint']).toContain('--with-test');
    });
  });

  describe('Commands with Testing Not Configurable (Always On)', () => {
    const alwaysOnCommands = [
      { path: 'dev/tdd.md', name: 'tdd' },
      { path: 'dev/feature-tested.md', name: 'feature-tested' }
    ];

    alwaysOnCommands.forEach(({ path, name }) => {
      describe(`/dev:${name}`, () => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        let frontmatter, body;

        beforeAll(() => {
          const content = readFile(cmdPath);
          frontmatter = parseFrontmatter(content);
          body = getBody(content);
        });

        it('should have testing.default set to true', () => {
          expect(frontmatter.testing.default).toBe(true);
        });

        it('should have testing.configurable set to false', () => {
          expect(frontmatter.testing.configurable).toBe(false);
        });

        it('should NOT have --no-test option in argument-hint', () => {
          if (frontmatter['argument-hint']) {
            expect(frontmatter['argument-hint']).not.toContain('--no-test');
          }
        });

        it('should document that testing cannot be disabled', () => {
          expect(body).toMatch(/always enforces testing|testing cannot be disabled|testing enforced/i);
        });
      });
    });
  });

  describe('Argument Hints Validation', () => {
    const commandsWithTestArgs = [
      { path: 'dev/feature.md', args: ['--no-test', '--test-level'] },
      { path: 'dev/fix.md', args: ['--no-test', '--test-level'] },
      { path: 'dev/fix-hard.md', args: ['--no-test', '--test-level'] },
      { path: 'dev/fix-fast.md', args: ['--with-test'] },
      { path: 'dev/tdd.md', args: ['--coverage', '--test-types'] },
      { path: 'dev/test.md', args: ['--coverage', '--test-types'] },
      { path: 'quality/refactor.md', args: ['--no-test', '--test-level'] },
      { path: 'quality/optimize.md', args: ['--no-test', '--test-level'] }
    ];

    commandsWithTestArgs.forEach(({ path, args }) => {
      it(`${path} should have testing arguments in argument-hint`, () => {
        const content = readFile(join(PLUGIN_ROOT, 'commands', path));
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter['argument-hint']).toBeDefined();
        args.forEach(arg => {
          expect(frontmatter['argument-hint']).toContain(arg);
        });
      });
    });

    // Sprint team-run has different argument format (mode first)
    it('sprint/team-run.md should have testing arguments in argument-hint', () => {
      const content = readFile(join(PLUGIN_ROOT, 'commands', 'sprint', 'team-run.md'));
      const frontmatter = parseFrontmatter(content);

      expect(frontmatter['argument-hint']).toBeDefined();
      const hint = frontmatter['argument-hint'];
      expect(hint).toContain('--mode');
      // Should have either --no-test or --test-level
      const hasTestArg = hint.includes('--no-test') || hint.includes('--test-level');
      expect(hasTestArg).toBe(true);
    });
  });

  describe('Related Skills Validation', () => {
    const commandsWithTestEnforcement = [
      'dev/feature.md',
      'dev/fix.md',
      'dev/fix-hard.md',
      'dev/tdd.md',
      'quality/refactor.md',
      'quality/optimize.md'
    ];

    // Commands that reference test-enforcement in related_skills
    commandsWithTestEnforcement.forEach(path => {
      it(`${path} should reference methodology/test-enforcement skill`, () => {
        const content = readFile(join(PLUGIN_ROOT, 'commands', path));
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter.related_skills).toBeDefined();
        expect(frontmatter.related_skills).toContain('methodology/test-enforcement');
      });
    });

    // Sprint team-run command has skills in a different format
    it('sprint/team-run.md should have test-related skills', () => {
      const content = readFile(join(PLUGIN_ROOT, 'commands', 'sprint', 'team-run.md'));
      const frontmatter = parseFrontmatter(content);

      expect(frontmatter.related_skills).toBeDefined();
      // team-run uses related_skills with test-enforcement or test-task-generation
      const hasTestSkill = frontmatter.related_skills.some(skill =>
        skill.includes('test-enforcement') || skill.includes('test-task-generation')
      );
      expect(hasTestSkill).toBe(true);
    });
  });

  describe('CLI Configuration Documentation', () => {
    const commandsWithCliDocs = [
      'dev/feature.md',
      'dev/fix.md',
      'sprint/team-run.md'
    ];

    commandsWithCliDocs.forEach(path => {
      it(`${path} should document CLI config commands`, () => {
        const content = readFile(join(PLUGIN_ROOT, 'commands', path));
        expect(content).toContain('omgkit config');
      });
    });
  });

  describe('Skills with Testing Options', () => {
    describe('test-enforcement skill', () => {
      const skillPath = join(PLUGIN_ROOT, 'skills', 'methodology', 'test-enforcement', 'SKILL.md');
      let content, frontmatter, body;

      beforeAll(() => {
        content = readFile(skillPath);
        frontmatter = parseFrontmatter(content);
        body = getBody(content);
      });

      it('should document Via CLI section', () => {
        expect(body).toContain('Via CLI');
        expect(body).toContain('omgkit config set');
        expect(body).toContain('omgkit config get');
      });

      it('should document Via Command Options section', () => {
        expect(body).toContain('Via Command Options');
        expect(body).toContain('--no-test');
        expect(body).toContain('--with-test');
        expect(body).toContain('--test-level');
        expect(body).toContain('--coverage');
      });

      it('should have related commands for testing', () => {
        expect(frontmatter.related_commands).toContain('/dev:feature');
        expect(frontmatter.related_commands).toContain('/dev:fix');
        expect(frontmatter.related_commands).toContain('/sprint:team-run');
      });
    });

    describe('test-task-generation skill', () => {
      const skillPath = join(PLUGIN_ROOT, 'skills', 'methodology', 'test-task-generation', 'SKILL.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(skillPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have related commands for features', () => {
        expect(frontmatter.related_commands).toContain('/dev:feature-tested');
        expect(frontmatter.related_commands).toContain('/dev:feature');
      });

      it('should document Via CLI section', () => {
        expect(content).toContain('Via CLI');
        expect(content).toContain('omgkit config set');
      });

      it('should document Command Options', () => {
        expect(content).toContain('Command Options');
        expect(content).toContain('--test-types');
        expect(content).toContain('--coverage');
      });
    });

    describe('test-driven-development skill', () => {
      const skillPath = join(PLUGIN_ROOT, 'skills', 'methodology', 'test-driven-development', 'SKILL.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(skillPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have related commands', () => {
        expect(frontmatter.related_commands).toBeDefined();
        expect(frontmatter.related_commands).toContain('/dev:tdd');
      });

      it('should have related skills', () => {
        expect(frontmatter.related_skills).toBeDefined();
        expect(frontmatter.related_skills).toContain('methodology/test-enforcement');
      });

      it('should document Command Integration', () => {
        expect(content).toContain('Command Integration');
        expect(content).toContain('/dev:tdd');
      });
    });
  });

  describe('Agents with Testing Options', () => {
    describe('sprint-master agent', () => {
      const agentPath = join(PLUGIN_ROOT, 'agents', 'sprint-master.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(agentPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have test-enforcement skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-enforcement');
      });

      it('should have test-task-generation skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-task-generation');
      });

      it('should have team-run command', () => {
        expect(frontmatter.commands).toContain('/sprint:team-run');
      });

      it('should document Via CLI configuration', () => {
        expect(content).toContain('Via CLI');
        expect(content).toContain('omgkit config set');
      });

      it('should document Via Command Options', () => {
        expect(content).toContain('Via Command Options');
        expect(content).toContain('--no-test');
        expect(content).toContain('--test-level');
      });
    });

    describe('tester agent', () => {
      const agentPath = join(PLUGIN_ROOT, 'agents', 'tester.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(agentPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have test-enforcement skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-enforcement');
      });

      it('should have test-task-generation skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-task-generation');
      });

      it('should have test commands', () => {
        expect(frontmatter.commands).toContain('/dev:test');
        expect(frontmatter.commands).toContain('/dev:test-write');
        expect(frontmatter.commands).toContain('/dev:feature-tested');
      });

      it('should document Test Enforcement Integration', () => {
        expect(content).toContain('Test Enforcement Integration');
      });

      it('should document Command Options', () => {
        expect(content).toContain('Command Options');
        expect(content).toContain('--coverage');
        expect(content).toContain('--test-types');
      });
    });

    describe('fullstack-developer agent', () => {
      const agentPath = join(PLUGIN_ROOT, 'agents', 'fullstack-developer.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(agentPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have test-enforcement skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-enforcement');
      });

      it('should have feature commands', () => {
        expect(frontmatter.commands).toContain('/dev:feature');
        expect(frontmatter.commands).toContain('/dev:feature-tested');
        expect(frontmatter.commands).toContain('/dev:fix');
      });

      it('should document Test Enforcement section', () => {
        expect(content).toContain('Test Enforcement');
      });

      it('should document Command Options', () => {
        expect(content).toContain('Command Options');
        expect(content).toContain('--no-test');
        expect(content).toContain('--test-level');
      });

      it('should document Behavior by Command table', () => {
        expect(content).toContain('Behavior by Command');
        expect(content).toContain('Testing Behavior');
      });
    });
  });

  describe('Workflows with Testing Options', () => {
    describe('feature workflow', () => {
      const wfPath = join(PLUGIN_ROOT, 'workflows', 'development', 'feature.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(wfPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have testing section in frontmatter', () => {
        expect(frontmatter.testing).toBeDefined();
        expect(frontmatter.testing.default).toBe(true);
        expect(frontmatter.testing.configurable).toBe(true);
      });

      it('should have test-enforcement skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-enforcement');
      });

      it('should have test-task-generation skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-task-generation');
      });

      it('should have feature-tested command', () => {
        expect(frontmatter.commands).toContain('/dev:feature-tested');
      });

      it('should have verify-done command', () => {
        expect(frontmatter.commands).toContain('/quality:verify-done');
      });

      it('should document Testing Options section', () => {
        expect(content).toContain('Testing Options');
      });

      it('should document Command Options', () => {
        expect(content).toContain('Command Options');
        expect(content).toContain('--no-test');
        expect(content).toContain('--test-level');
      });

      it('should document CLI Configuration', () => {
        expect(content).toContain('CLI Configuration');
        expect(content).toContain('omgkit config set');
      });
    });

    describe('bug-fix workflow', () => {
      const wfPath = join(PLUGIN_ROOT, 'workflows', 'development', 'bug-fix.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(wfPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have testing section in frontmatter', () => {
        expect(frontmatter.testing).toBeDefined();
        expect(frontmatter.testing.default).toBe(true);
        expect(frontmatter.testing.configurable).toBe(true);
      });

      it('should have test-enforcement skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-enforcement');
      });

      it('should have all fix commands', () => {
        expect(frontmatter.commands).toContain('/dev:fix');
        expect(frontmatter.commands).toContain('/dev:fix-fast');
        expect(frontmatter.commands).toContain('/dev:fix-hard');
      });

      it('should document Testing Options section', () => {
        expect(content).toContain('Testing Options');
      });

      it('should document Command Options table', () => {
        expect(content).toContain('Command Options');
        expect(content).toContain('/dev:fix');
        expect(content).toContain('/dev:fix-fast');
        expect(content).toContain('/dev:fix-hard');
      });
    });

    describe('test-driven-development workflow', () => {
      const wfPath = join(PLUGIN_ROOT, 'workflows', 'testing', 'test-driven-development.md');
      let content, frontmatter;

      beforeAll(() => {
        content = readFile(wfPath);
        frontmatter = parseFrontmatter(content);
      });

      it('should have testing section in frontmatter', () => {
        expect(frontmatter.testing).toBeDefined();
        expect(frontmatter.testing.default).toBe(true);
        expect(frontmatter.testing.configurable).toBe(false);
      });

      it('should have test-enforcement skill', () => {
        expect(frontmatter.skills).toContain('methodology/test-enforcement');
      });

      it('should have tdd command', () => {
        expect(frontmatter.commands).toContain('/dev:tdd');
      });

      it('should have verify-done command', () => {
        expect(frontmatter.commands).toContain('/quality:verify-done');
      });

      it('should document Testing Options section', () => {
        expect(content).toContain('Testing Options');
      });

      it('should document that testing is always enforced', () => {
        expect(content).toMatch(/always enforces testing|testing cannot be disabled/i);
      });
    });

    describe('automated-testing workflow', () => {
      const wfPath = join(PLUGIN_ROOT, 'workflows', 'testing', 'automated-testing.md');
      let content;

      beforeAll(() => {
        content = readFile(wfPath);
      });

      it('should document Via CLI section', () => {
        expect(content).toContain('Via CLI');
        expect(content).toContain('omgkit config set');
      });

      it('should document Command Options table', () => {
        expect(content).toContain('Command Options');
        expect(content).toContain('--no-test');
        expect(content).toContain('--test-level');
        expect(content).toContain('--coverage');
        expect(content).toContain('--test-types');
      });
    });
  });

  describe('Options Consistency', () => {
    const configurableCommands = [
      'dev/feature.md',
      'dev/fix.md',
      'dev/fix-fast.md',
      'dev/fix-hard.md',
      'quality/refactor.md',
      'quality/optimize.md',
      'sprint/team-run.md'
    ];

    configurableCommands.forEach(path => {
      it(`${path} should have --no-test or --with-test option in argument-hint`, () => {
        const content = readFile(join(PLUGIN_ROOT, 'commands', path));
        const frontmatter = parseFrontmatter(content);
        expect(frontmatter).not.toBeNull();
        const hint = frontmatter['argument-hint'] || '';
        expect(hint).toMatch(/--no-test|--with-test/);
      });
    });

    const commandsWithTestLevel = [
      'dev/feature.md',
      'dev/fix.md',
      'dev/fix-hard.md',
      'quality/refactor.md',
      'quality/optimize.md',
      'sprint/team-run.md'
    ];

    commandsWithTestLevel.forEach(path => {
      it(`${path} should have --test-level option in argument-hint`, () => {
        const content = readFile(join(PLUGIN_ROOT, 'commands', path));
        const frontmatter = parseFrontmatter(content);
        expect(frontmatter).not.toBeNull();
        const hint = frontmatter['argument-hint'] || '';
        expect(hint).toContain('--test-level');
      });
    });

    const testCommands = [
      'dev/test.md',
      'dev/tdd.md',
      'dev/test-write.md'
    ];

    testCommands.forEach(path => {
      it(`${path} should have --coverage option in argument-hint`, () => {
        const content = readFile(join(PLUGIN_ROOT, 'commands', path));
        const frontmatter = parseFrontmatter(content);
        expect(frontmatter).not.toBeNull();
        const hint = frontmatter['argument-hint'] || '';
        expect(hint).toContain('--coverage');
      });
    });
  });

  describe('Documentation Consistency', () => {
    // Commands that should have full configuration documentation
    const commandsWithFullConfig = [
      'dev/feature.md',
      'dev/fix.md',
      'dev/fix-hard.md',
      'dev/tdd.md',
      'dev/test.md',
      'dev/test-write.md',
      'dev/feature-tested.md',
      'quality/refactor.md',
      'quality/optimize.md',
      'sprint/team-run.md'
    ];

    commandsWithFullConfig.forEach(path => {
      it(`${path} should have Configuration section`, () => {
        const content = readFile(join(PLUGIN_ROOT, 'commands', path));
        expect(content).toContain('Configuration');
        // Check for either .omgkit/workflow.yaml or workflow.yaml reference
        const hasWorkflowConfig = content.includes('.omgkit/workflow.yaml') || content.includes('workflow.yaml');
        expect(hasWorkflowConfig).toBe(true);
      });
    });

    // fix-fast has minimal config (default testing disabled)
    it('dev/fix-fast.md should have Configuration section', () => {
      const content = readFile(join(PLUGIN_ROOT, 'commands', 'dev', 'fix-fast.md'));
      expect(content).toContain('Configuration');
    });
  });
});
