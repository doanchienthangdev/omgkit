/**
 * Documentation Generator Tests
 *
 * Tests for scripts/generate-docs.js functionality
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync, readFileSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');
const DOCS_DIR = join(PROJECT_ROOT, 'docs');

describe('Documentation Generator', () => {
  describe('Generated Documentation Structure', () => {
    it('should have generated docs directory', () => {
      expect(existsSync(DOCS_DIR)).toBe(true);
    });

    it('should have agents documentation', () => {
      expect(existsSync(join(DOCS_DIR, 'agents'))).toBe(true);
      expect(existsSync(join(DOCS_DIR, 'agents/overview.mdx'))).toBe(true);
      expect(existsSync(join(DOCS_DIR, 'agents/planner.mdx'))).toBe(true);
    });

    it('should have commands documentation', () => {
      expect(existsSync(join(DOCS_DIR, 'commands'))).toBe(true);
      expect(existsSync(join(DOCS_DIR, 'commands/overview.mdx'))).toBe(true);
      expect(existsSync(join(DOCS_DIR, 'commands/feature.mdx'))).toBe(true);
    });

    it('should have skills documentation', () => {
      expect(existsSync(join(DOCS_DIR, 'skills'))).toBe(true);
      expect(existsSync(join(DOCS_DIR, 'skills/overview.mdx'))).toBe(true);
    });

    it('should have modes documentation', () => {
      expect(existsSync(join(DOCS_DIR, 'modes'))).toBe(true);
      expect(existsSync(join(DOCS_DIR, 'modes/overview.mdx'))).toBe(true);
    });
  });

  describe('$ARGUMENTS Replacement', () => {
    it('should replace $ARGUMENTS with argument-hint in command docs', () => {
      const fastDoc = join(DOCS_DIR, 'commands/fast.mdx');
      expect(existsSync(fastDoc)).toBe(true);

      const content = readFileSync(fastDoc, 'utf8');
      // Should NOT contain literal $ARGUMENTS
      expect(content).not.toContain('$ARGUMENTS');
      // Should contain the argument-hint value
      expect(content).toContain('<UI description>');
    });

    it('should replace $ARGUMENTS in feature command', () => {
      const featureDoc = join(DOCS_DIR, 'commands/feature.mdx');
      expect(existsSync(featureDoc)).toBe(true);

      const content = readFileSync(featureDoc, 'utf8');
      expect(content).not.toContain('$ARGUMENTS');
    });

    it('should replace $ARGUMENTS in fix command', () => {
      const fixDoc = join(DOCS_DIR, 'commands/fix.mdx');
      expect(existsSync(fixDoc)).toBe(true);

      const content = readFileSync(fixDoc, 'utf8');
      expect(content).not.toContain('$ARGUMENTS');
    });

    it('should replace $ARGUMENTS in plan command', () => {
      const planDoc = join(DOCS_DIR, 'commands/plan.mdx');
      expect(existsSync(planDoc)).toBe(true);

      const content = readFileSync(planDoc, 'utf8');
      expect(content).not.toContain('$ARGUMENTS');
    });
  });

  describe('MDX Validity', () => {
    it('should not contain invalid JSX expressions in headings', () => {
      const skillsOverview = join(DOCS_DIR, 'skills/overview.mdx');
      const content = readFileSync(skillsOverview, 'utf8');

      // Should not contain {#id} anchor syntax that breaks MDX parsing
      expect(content).not.toMatch(/\{#\w+\}/);
    });

    it('agent docs should not contain invalid JSX expressions', () => {
      const agentOverview = join(DOCS_DIR, 'agents/overview.mdx');
      const content = readFileSync(agentOverview, 'utf8');

      expect(content).not.toMatch(/\{#\w+\}/);
    });

    it('mode docs should not contain invalid JSX expressions', () => {
      const modeOverview = join(DOCS_DIR, 'modes/overview.mdx');
      const content = readFileSync(modeOverview, 'utf8');

      expect(content).not.toMatch(/\{#\w+\}/);
    });

    it('command docs should not contain invalid JSX expressions', () => {
      const commandOverview = join(DOCS_DIR, 'commands/overview.mdx');
      const content = readFileSync(commandOverview, 'utf8');

      expect(content).not.toMatch(/\{#\w+\}/);
    });
  });

  describe('Documentation Content Quality', () => {
    it('agent docs should have valid frontmatter', () => {
      const plannerDoc = join(DOCS_DIR, 'agents/planner.mdx');
      const content = readFileSync(plannerDoc, 'utf8');

      expect(content).toContain('---');
      expect(content).toContain('title:');
      expect(content).toContain('description:');
      expect(content).toContain('icon:');
    });

    it('command docs should have valid frontmatter', () => {
      const featureDoc = join(DOCS_DIR, 'commands/feature.mdx');
      const content = readFileSync(featureDoc, 'utf8');

      expect(content).toContain('---');
      expect(content).toContain('title:');
      expect(content).toContain('description:');
    });

    it('skill docs should have valid frontmatter', () => {
      const typescriptDoc = join(DOCS_DIR, 'skills/typescript.mdx');
      const content = readFileSync(typescriptDoc, 'utf8');

      expect(content).toContain('---');
      expect(content).toContain('title:');
      expect(content).toContain('description:');
    });

    it('mode docs should have valid frontmatter', () => {
      const omegaDoc = join(DOCS_DIR, 'modes/omega.mdx');
      const content = readFileSync(omegaDoc, 'utf8');

      expect(content).toContain('---');
      expect(content).toContain('title:');
      expect(content).toContain('description:');
    });
  });

  describe('Documentation Counts', () => {
    it('should generate 23 agent docs', () => {
      const agentFiles = readFileSync(join(DOCS_DIR, 'agents/overview.mdx'), 'utf8');
      expect(agentFiles).toContain('23');
    });

    it('should generate docs for all command categories', () => {
      const commandOverview = readFileSync(join(DOCS_DIR, 'commands/overview.mdx'), 'utf8');
      expect(commandOverview).toContain('dev');
      expect(commandOverview).toContain('planning');
      expect(commandOverview).toContain('git');
      expect(commandOverview).toContain('quality');
      expect(commandOverview).toContain('context');
      expect(commandOverview).toContain('design');
      expect(commandOverview).toContain('omega');
      expect(commandOverview).toContain('sprint');
    });

    it('should generate docs for all skill categories', () => {
      const skillsOverview = readFileSync(join(DOCS_DIR, 'skills/overview.mdx'), 'utf8');
      expect(skillsOverview).toContain('Languages');
      expect(skillsOverview).toContain('Frameworks');
      expect(skillsOverview).toContain('Databases');
      expect(skillsOverview).toContain('Frontend');
      expect(skillsOverview).toContain('Devops');
      expect(skillsOverview).toContain('Security');
      expect(skillsOverview).toContain('Testing');
      expect(skillsOverview).toContain('Methodology');
      expect(skillsOverview).toContain('Omega');
    });

    it('should generate 9 mode docs', () => {
      const modeOverview = readFileSync(join(DOCS_DIR, 'modes/overview.mdx'), 'utf8');
      expect(modeOverview).toContain('9');
    });
  });

  describe('Mintlify Components', () => {
    it('overview pages should use CardGroup components', () => {
      const agentOverview = readFileSync(join(DOCS_DIR, 'agents/overview.mdx'), 'utf8');
      expect(agentOverview).toContain('<CardGroup');
      expect(agentOverview).toContain('<Card');
    });

    it('individual pages should use Info components', () => {
      const plannerDoc = readFileSync(join(DOCS_DIR, 'agents/planner.mdx'), 'utf8');
      expect(plannerDoc).toContain('<Info>');
    });

    it('command pages should use AccordionGroup for troubleshooting', () => {
      const featureDoc = readFileSync(join(DOCS_DIR, 'commands/feature.mdx'), 'utf8');
      expect(featureDoc).toContain('<AccordionGroup>');
      expect(featureDoc).toContain('<Accordion');
    });

    it('skill overview should use Steps component', () => {
      const skillsOverview = readFileSync(join(DOCS_DIR, 'skills/overview.mdx'), 'utf8');
      expect(skillsOverview).toContain('<Steps>');
      expect(skillsOverview).toContain('<Step');
    });
  });
});

describe('Generator Script Execution', () => {
  it('should run without errors', () => {
    expect(() => {
      execSync('node scripts/generate-docs.js', {
        cwd: PROJECT_ROOT,
        stdio: 'pipe'
      });
    }).not.toThrow();
  });

  it('should output success message', () => {
    const output = execSync('node scripts/generate-docs.js', {
      cwd: PROJECT_ROOT,
      encoding: 'utf8'
    });

    expect(output).toContain('Documentation generated successfully');
  });
});
