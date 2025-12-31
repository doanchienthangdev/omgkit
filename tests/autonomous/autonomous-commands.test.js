/**
 * Autonomous Commands Test Suite
 *
 * Tests for /auto:* commands that drive autonomous project development.
 * Validates command existence, structure, and content completeness.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const PLUGIN_DIR = path.join(__dirname, '..', '..', 'plugin');
const COMMANDS_DIR = path.join(PLUGIN_DIR, 'commands', 'auto');

describe('Autonomous Commands', () => {
  // List of all expected autonomous commands
  const expectedCommands = [
    'init',
    'start',
    'status',
    'resume',
    'next',
    'approve',
    'reject',
    'verify',
    'checkpoint',
  ];

  describe('Command Files Exist', () => {
    expectedCommands.forEach((command) => {
      it(`should have /auto:${command} command file`, () => {
        const commandPath = path.join(COMMANDS_DIR, `${command}.md`);
        expect(fs.existsSync(commandPath)).toBe(true);
      });
    });
  });

  describe('Command Structure', () => {
    expectedCommands.forEach((command) => {
      describe(`/auto:${command}`, () => {
        let content;
        let frontmatter;

        beforeAll(() => {
          const commandPath = path.join(COMMANDS_DIR, `${command}.md`);
          content = fs.readFileSync(commandPath, 'utf8');

          // Parse YAML frontmatter
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (frontmatterMatch) {
            frontmatter = yaml.load(frontmatterMatch[1]);
          }
        });

        it('should have valid YAML frontmatter', () => {
          expect(frontmatter).toBeDefined();
        });

        it('should have description field', () => {
          expect(frontmatter.description).toBeDefined();
          expect(typeof frontmatter.description).toBe('string');
          expect(frontmatter.description.length).toBeGreaterThan(10);
        });

        it('should have allowed-tools field', () => {
          expect(frontmatter['allowed-tools']).toBeDefined();
          expect(typeof frontmatter['allowed-tools']).toBe('string');
        });

        it('should have meaningful content after frontmatter', () => {
          const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
          expect(bodyContent.trim().length).toBeGreaterThan(100);
        });

        it('should have markdown headers', () => {
          expect(content).toMatch(/^#+ .+/m);
        });
      });
    });
  });

  describe('Command Content Quality', () => {
    it('/auto:init should reference discovery questions', () => {
      const initPath = path.join(COMMANDS_DIR, 'init.md');
      const content = fs.readFileSync(initPath, 'utf8');
      expect(content).toMatch(/discovery/i);
      expect(content).toMatch(/questions/i);
    });

    it('/auto:start should reference state management', () => {
      const startPath = path.join(COMMANDS_DIR, 'start.md');
      const content = fs.readFileSync(startPath, 'utf8');
      expect(content).toMatch(/state/i);
      expect(content).toMatch(/archetype/i);
    });

    it('/auto:status should define status codes', () => {
      const statusPath = path.join(COMMANDS_DIR, 'status.md');
      const content = fs.readFileSync(statusPath, 'utf8');
      expect(content).toMatch(/ready|in_progress|checkpoint|blocked|completed/);
    });

    it('/auto:approve should handle checkpoints', () => {
      const approvePath = path.join(COMMANDS_DIR, 'approve.md');
      const content = fs.readFileSync(approvePath, 'utf8');
      expect(content).toMatch(/checkpoint/i);
      expect(content).toMatch(/decision/i);
    });

    it('/auto:reject should capture feedback', () => {
      const rejectPath = path.join(COMMANDS_DIR, 'reject.md');
      const content = fs.readFileSync(rejectPath, 'utf8');
      expect(content).toMatch(/feedback/i);
      expect(content).toMatch(/reason/i);
    });

    it('/auto:verify should run quality checks', () => {
      const verifyPath = path.join(COMMANDS_DIR, 'verify.md');
      const content = fs.readFileSync(verifyPath, 'utf8');
      expect(content).toMatch(/quality/i);
      expect(content).toMatch(/check/i);
    });

    it('/auto:checkpoint should pause execution', () => {
      const checkpointPath = path.join(COMMANDS_DIR, 'checkpoint.md');
      const content = fs.readFileSync(checkpointPath, 'utf8');
      expect(content).toMatch(/pause|stop/i);
      expect(content).toMatch(/review/i);
    });

    it('/auto:resume should handle recovery', () => {
      const resumePath = path.join(COMMANDS_DIR, 'resume.md');
      const content = fs.readFileSync(resumePath, 'utf8');
      expect(content).toMatch(/resume/i);
      expect(content).toMatch(/state/i);
    });

    it('/auto:next should preview actions', () => {
      const nextPath = path.join(COMMANDS_DIR, 'next.md');
      const content = fs.readFileSync(nextPath, 'utf8');
      expect(content).toMatch(/preview/i);
      expect(content).toMatch(/next/i);
    });
  });
});
