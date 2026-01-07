/**
 * Reference-Aware Planning Tests
 *
 * Tests for the --ref parameter feature in sprint commands:
 * - Command frontmatter with reference options
 * - Argument hints with --ref flag
 * - Template configuration for references
 * - Artifacts folder structure
 * - Reference documentation
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';

const PLUGIN_ROOT = join(process.cwd(), 'plugin');
const TEMPLATES_ROOT = join(process.cwd(), 'templates');
const DOCS_ROOT = join(process.cwd(), 'docs');

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

// Helper to check if file exists
function fileExists(path) {
  return existsSync(path);
}

describe('Reference-Aware Planning Feature', () => {

  describe('Command Frontmatter - Reference Support', () => {
    // Commands that should have reference support
    const commandsWithReferenceSupport = [
      { path: 'sprint/sprint-new.md', name: 'sprint-new' },
      { path: 'sprint/team-run.md', name: 'team-run' },
      { path: 'sprint/backlog-add.md', name: 'backlog-add' }
    ];

    commandsWithReferenceSupport.forEach(({ path, name }) => {
      describe(`/sprint:${name}`, () => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        let content, frontmatter, body;

        beforeAll(() => {
          content = readFile(cmdPath);
          frontmatter = parseFrontmatter(content);
          body = getBody(content);
        });

        it('should have references section in frontmatter', () => {
          expect(frontmatter.references).toBeDefined();
        });

        it('should have references.supported set to true', () => {
          expect(frontmatter.references.supported).toBe(true);
        });

        it('should have references.types array', () => {
          expect(frontmatter.references.types).toBeDefined();
          expect(Array.isArray(frontmatter.references.types)).toBe(true);
        });

        it('should support file, folder, and glob types', () => {
          const types = frontmatter.references.types;
          expect(types).toContain('file');
          expect(types).toContain('folder');
          expect(types).toContain('glob');
        });

        it('should have --ref in argument-hint', () => {
          expect(frontmatter['argument-hint']).toContain('--ref');
        });
      });
    });
  });

  describe('Command Documentation - Reference Options', () => {
    const commandsWithRefDocs = [
      { path: 'sprint/sprint-new.md', name: 'sprint-new' },
      { path: 'sprint/team-run.md', name: 'team-run' },
      { path: 'sprint/backlog-add.md', name: 'backlog-add' }
    ];

    commandsWithRefDocs.forEach(({ path, name }) => {
      describe(`/sprint:${name} documentation`, () => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        let body;

        beforeAll(() => {
          const content = readFile(cmdPath);
          body = getBody(content);
        });

        it('should document Reference Options section', () => {
          expect(body).toContain('Reference');
        });

        it('should document --ref parameter', () => {
          expect(body).toContain('--ref');
        });

        it('should include reference usage examples', () => {
          expect(body).toContain('--ref=');
        });
      });
    });
  });

  describe('sprint-new.md Specific Features', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands/sprint/sprint-new.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should have default_paths for references', () => {
      expect(frontmatter.references.default_paths).toBeDefined();
      expect(Array.isArray(frontmatter.references.default_paths)).toBe(true);
    });

    it('should include artifacts folder in default paths', () => {
      const paths = frontmatter.references.default_paths;
      const hasArtifacts = paths.some(p => p.includes('artifacts'));
      expect(hasArtifacts).toBe(true);
    });

    it('should document single file reference', () => {
      expect(body).toContain('Single File Reference');
    });

    it('should document multiple files reference', () => {
      expect(body).toContain('Multiple Files Reference');
    });

    it('should document folder reference', () => {
      expect(body).toContain('Folder Reference');
    });

    it('should document glob pattern reference', () => {
      expect(body).toContain('Glob Pattern');
    });

    it('should document reference types table', () => {
      expect(body).toContain('PRD');
      expect(body).toContain('Spec');
      expect(body).toContain('OpenAPI');
    });

    it('should document how references work', () => {
      expect(body).toContain('How References Work');
    });

    it('should document context propagation', () => {
      expect(body).toContain('Context Propagation');
    });

    it('should have related skills', () => {
      expect(frontmatter.related_skills).toBeDefined();
      expect(Array.isArray(frontmatter.related_skills)).toBe(true);
    });

    it('should have related commands', () => {
      expect(frontmatter.related_commands).toBeDefined();
      expect(Array.isArray(frontmatter.related_commands)).toBe(true);
    });
  });

  describe('team-run.md Reference Inheritance', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands/sprint/team-run.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should support inheriting references from sprint', () => {
      expect(frontmatter.references.inherit_from_sprint).toBe(true);
    });

    it('should document reference inheritance', () => {
      expect(body).toContain('inherit');
    });

    it('should document overriding references', () => {
      expect(body.toLowerCase()).toContain('override');
    });
  });

  describe('backlog-add.md Reference Linking', () => {
    const cmdPath = join(PLUGIN_ROOT, 'commands/sprint/backlog-add.md');
    let content, frontmatter, body;

    beforeAll(() => {
      content = readFile(cmdPath);
      frontmatter = parseFrontmatter(content);
      body = getBody(content);
    });

    it('should support inheriting references from sprint', () => {
      expect(frontmatter.references.inherit_from_sprint).toBe(true);
    });

    it('should document requirement linking (--req)', () => {
      expect(body).toContain('--req');
    });

    it('should document requirement_ref in output', () => {
      expect(body).toContain('requirement');
    });
  });

  describe('Template Configuration - config.yaml', () => {
    const configPath = join(TEMPLATES_ROOT, 'config.yaml');
    let config;

    beforeAll(() => {
      const content = readFile(configPath);
      config = yaml.load(content);
    });

    it('should have references section', () => {
      expect(config.references).toBeDefined();
    });

    it('should have references.enabled setting', () => {
      expect(config.references.enabled).toBe(true);
    });

    it('should have references.auto_suggest setting', () => {
      expect(config.references.auto_suggest).toBeDefined();
    });

    it('should have references.default_paths array', () => {
      expect(config.references.default_paths).toBeDefined();
      expect(Array.isArray(config.references.default_paths)).toBe(true);
    });

    it('should include artifacts in default paths', () => {
      const hasArtifacts = config.references.default_paths.some(p =>
        p.includes('artifacts')
      );
      expect(hasArtifacts).toBe(true);
    });

    it('should have references.max_tokens setting', () => {
      expect(config.references.max_tokens).toBeDefined();
      expect(typeof config.references.max_tokens).toBe('number');
    });

    it('should have type_mappings for PRD', () => {
      expect(config.references.type_mappings.prd).toBeDefined();
      expect(config.references.type_mappings.prd.patterns).toBeDefined();
    });

    it('should have type_mappings for spec', () => {
      expect(config.references.type_mappings.spec).toBeDefined();
    });

    it('should have type_mappings for openapi', () => {
      expect(config.references.type_mappings.openapi).toBeDefined();
    });

    it('should have type_mappings for design', () => {
      expect(config.references.type_mappings.design).toBeDefined();
    });
  });

  describe('Template Configuration - workflow.yaml', () => {
    const workflowPath = join(TEMPLATES_ROOT, 'omgkit/workflow.yaml');
    let workflow;

    beforeAll(() => {
      const content = readFile(workflowPath);
      workflow = yaml.load(content);
    });

    it('should have references section', () => {
      expect(workflow.references).toBeDefined();
    });

    it('should have references.enabled setting', () => {
      expect(workflow.references.enabled).toBe(true);
    });

    it('should have references.auto_suggest setting', () => {
      expect(workflow.references.auto_suggest).toBeDefined();
    });

    it('should have references.max_tokens setting', () => {
      expect(workflow.references.max_tokens).toBeDefined();
    });

    it('should have extract_sections array', () => {
      expect(workflow.references.extract_sections).toBeDefined();
      expect(Array.isArray(workflow.references.extract_sections)).toBe(true);
    });

    it('should extract requirements section', () => {
      expect(workflow.references.extract_sections).toContain('requirements');
    });

    it('should extract user_stories section', () => {
      expect(workflow.references.extract_sections).toContain('user_stories');
    });

    it('should extract acceptance_criteria section', () => {
      expect(workflow.references.extract_sections).toContain('acceptance_criteria');
    });

    it('should have propagation settings', () => {
      expect(workflow.references.propagation).toBeDefined();
    });

    it('should propagate to team_run', () => {
      expect(workflow.references.propagation.to_team_run).toBe(true);
    });

    it('should propagate to tasks', () => {
      expect(workflow.references.propagation.to_tasks).toBe(true);
    });

    it('should propagate to dev commands', () => {
      expect(workflow.references.propagation.to_dev_commands).toBe(true);
    });

    it('should have validation settings', () => {
      expect(workflow.references.validation).toBeDefined();
    });

    it('should check if references exist', () => {
      expect(workflow.references.validation.check_exists).toBe(true);
    });

    it('should check reference freshness', () => {
      expect(workflow.references.validation.check_freshness).toBe(true);
    });
  });

  describe('Artifacts Folder Structure', () => {
    const artifactsReadmePath = join(TEMPLATES_ROOT, 'artifacts/README.md');

    it('should have artifacts README template', () => {
      expect(fileExists(artifactsReadmePath)).toBe(true);
    });

    it('should document artifacts purpose', () => {
      const content = readFile(artifactsReadmePath);
      expect(content).toContain('reference');
    });

    it('should document data subfolder', () => {
      const content = readFile(artifactsReadmePath);
      expect(content).toContain('data');
    });

    it('should document docs subfolder', () => {
      const content = readFile(artifactsReadmePath);
      expect(content).toContain('docs');
    });

    it('should document knowledge subfolder', () => {
      const content = readFile(artifactsReadmePath);
      expect(content).toContain('knowledge');
    });

    it('should explain how AI uses artifacts', () => {
      const content = readFile(artifactsReadmePath);
      expect(content).toContain('How AI Uses');
    });

    it('should explain difference from other folders', () => {
      const content = readFile(artifactsReadmePath);
      expect(content).toContain('devlogs');
      expect(content).toContain('plans');
    });
  });

  describe('Related Skills References', () => {
    const sprintNewPath = join(PLUGIN_ROOT, 'commands/sprint/sprint-new.md');
    let frontmatter;

    beforeAll(() => {
      const content = readFile(sprintNewPath);
      frontmatter = parseFrontmatter(content);
    });

    it('should reference project-orchestration skill', () => {
      expect(frontmatter.related_skills).toContain('autonomous/project-orchestration');
    });

    it('should reference agile-sprint or related skill', () => {
      const hasAgileSkill = frontmatter.related_skills.some(s =>
        s.includes('agile') || s.includes('sprint')
      );
      expect(hasAgileSkill).toBe(true);
    });
  });

  describe('Command Line Examples', () => {
    const sprintNewPath = join(PLUGIN_ROOT, 'commands/sprint/sprint-new.md');
    let body;

    beforeAll(() => {
      const content = readFile(sprintNewPath);
      body = getBody(content);
    });

    it('should have basic sprint example', () => {
      expect(body).toContain('/sprint:sprint-new "Sprint 1"');
    });

    it('should have example with --propose', () => {
      expect(body).toContain('--propose');
    });

    it('should have example with --ref file', () => {
      expect(body).toContain('--ref=');
    });

    it('should have example with multiple refs', () => {
      // Looking for comma-separated refs
      const hasMultipleRefs = body.includes('--ref=') &&
        (body.includes(',specs/') || body.includes(',artifacts/'));
      expect(hasMultipleRefs).toBe(true);
    });

    it('should have example with folder ref', () => {
      // Looking for folder reference ending with /
      expect(body).toMatch(/--ref=[\w./]*\/\s/);
    });
  });

  describe('Output Format Documentation', () => {
    const sprintNewPath = join(PLUGIN_ROOT, 'commands/sprint/sprint-new.md');
    let body;

    beforeAll(() => {
      const content = readFile(sprintNewPath);
      body = getBody(content);
    });

    it('should document sprint.yaml output format', () => {
      expect(body).toContain('current.yaml');
    });

    it('should show references array in output', () => {
      expect(body).toContain('references:');
    });

    it('should show source field in reference', () => {
      expect(body).toContain('source:');
    });

    it('should show type field in reference', () => {
      expect(body).toContain('type: prd');
    });
  });

  describe('Best Practices Documentation', () => {
    const sprintNewPath = join(PLUGIN_ROOT, 'commands/sprint/sprint-new.md');
    let body;

    beforeAll(() => {
      const content = readFile(sprintNewPath);
      body = getBody(content);
    });

    it('should document best practices', () => {
      expect(body).toContain('Best Practices');
    });

    it('should recommend specific references', () => {
      expect(body.toLowerCase()).toContain('specific');
    });

    it('should recommend combining with --propose', () => {
      expect(body).toContain('--propose');
    });
  });

  describe('Integration Test - All Sprint Commands Have Consistent Reference Support', () => {
    const sprintCommands = [
      'sprint/sprint-new.md',
      'sprint/team-run.md',
      'sprint/backlog-add.md'
    ];

    it('all sprint commands should have references.supported = true', () => {
      sprintCommands.forEach(path => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        const content = readFile(cmdPath);
        const frontmatter = parseFrontmatter(content);
        expect(frontmatter.references?.supported, `${path} should have references.supported`).toBe(true);
      });
    });

    it('all sprint commands should have --ref in argument-hint', () => {
      sprintCommands.forEach(path => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        const content = readFile(cmdPath);
        const frontmatter = parseFrontmatter(content);
        expect(frontmatter['argument-hint'], `${path} should have --ref in argument-hint`).toContain('--ref');
      });
    });

    it('all sprint commands should document --ref parameter', () => {
      sprintCommands.forEach(path => {
        const cmdPath = join(PLUGIN_ROOT, 'commands', path);
        const content = readFile(cmdPath);
        const body = getBody(content);
        expect(body, `${path} should document --ref`).toContain('--ref');
      });
    });
  });

  describe('Template Files Consistency', () => {
    it('config.yaml and workflow.yaml should both have references sections', () => {
      const configPath = join(TEMPLATES_ROOT, 'config.yaml');
      const workflowPath = join(TEMPLATES_ROOT, 'omgkit/workflow.yaml');

      const configContent = readFile(configPath);
      const workflowContent = readFile(workflowPath);

      const config = yaml.load(configContent);
      const workflow = yaml.load(workflowContent);

      expect(config.references).toBeDefined();
      expect(workflow.references).toBeDefined();
    });

    it('both templates should have enabled: true by default', () => {
      const configPath = join(TEMPLATES_ROOT, 'config.yaml');
      const workflowPath = join(TEMPLATES_ROOT, 'omgkit/workflow.yaml');

      const config = yaml.load(readFile(configPath));
      const workflow = yaml.load(readFile(workflowPath));

      expect(config.references.enabled).toBe(true);
      expect(workflow.references.enabled).toBe(true);
    });

    it('both templates should have auto_suggest setting', () => {
      const configPath = join(TEMPLATES_ROOT, 'config.yaml');
      const workflowPath = join(TEMPLATES_ROOT, 'omgkit/workflow.yaml');

      const config = yaml.load(readFile(configPath));
      const workflow = yaml.load(readFile(workflowPath));

      expect(config.references.auto_suggest).toBeDefined();
      expect(workflow.references.auto_suggest).toBeDefined();
    });
  });
});
