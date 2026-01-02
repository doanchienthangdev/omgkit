/**
 * Format Validation Tests
 *
 * Validates that all component references use correct formats:
 * - Skills: category/skill-name
 * - Commands: /namespace:command-name
 * - Agents: kebab-case
 * - Workflows: category/workflow-name
 * - MCPs: kebab-case
 *
 * Part of the Optimized Alignment Principle (OAP) test suite.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');

// Format patterns
// Note: Allow names to start with digits (e.g., 10x, 100x, 1000x for omega commands)
const FORMATS = {
  skill: /^[a-z][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/,
  command: /^\/[a-z][a-z0-9-]*:[a-z0-9][a-z0-9-]*$/,
  agent: /^[a-z][a-z0-9-]*$/,
  workflow: /^[a-z][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/,
  mcp: /^[a-z][a-z0-9-]*$/,
};

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Get all files of a type recursively
 */
function getFiles(dir, extension, files = []) {
  if (!existsSync(dir)) return files;
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, extension, files);
    } else if (item.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Format Validation', () => {
  describe('Skill ID Format', () => {
    const skillsDir = join(PLUGIN_DIR, 'skills');

    it('should validate skill ID format pattern', () => {
      expect(FORMATS.skill.test('methodology/writing-plans')).toBe(true);
      expect(FORMATS.skill.test('ai-engineering/rag-systems')).toBe(true);
      expect(FORMATS.skill.test('databases/postgresql')).toBe(true);
    });

    it('should reject invalid skill ID formats', () => {
      expect(FORMATS.skill.test('writing-plans')).toBe(false); // missing category
      expect(FORMATS.skill.test('/methodology/writing-plans')).toBe(false); // leading slash
      expect(FORMATS.skill.test('Methodology/Writing-Plans')).toBe(false); // uppercase
      expect(FORMATS.skill.test('methodology/writing_plans')).toBe(false); // underscore
    });

    if (existsSync(skillsDir)) {
      const categories = readdirSync(skillsDir).filter(item => {
        const itemPath = join(skillsDir, item);
        return statSync(itemPath).isDirectory() && !item.startsWith('.');
      });

      for (const category of categories) {
        it(`category "${category}" should be lowercase kebab-case`, () => {
          expect(category).toMatch(/^[a-z][a-z0-9-]*$/);
        });

        const categoryDir = join(skillsDir, category);
        const skillDirs = readdirSync(categoryDir).filter(item => {
          return statSync(join(categoryDir, item)).isDirectory();
        });

        for (const skillDir of skillDirs) {
          it(`skill "${category}/${skillDir}" should be lowercase kebab-case`, () => {
            expect(skillDir).toMatch(/^[a-z][a-z0-9-]*$/);
            expect(`${category}/${skillDir}`).toMatch(FORMATS.skill);
          });
        }
      }
    }
  });

  describe('Command Format', () => {
    const commandsDir = join(PLUGIN_DIR, 'commands');

    it('should validate command format pattern', () => {
      expect(FORMATS.command.test('/dev:feature')).toBe(true);
      expect(FORMATS.command.test('/omega:10x')).toBe(true);
      expect(FORMATS.command.test('/omega:100x')).toBe(true);
      expect(FORMATS.command.test('/omega:1000x')).toBe(true);
      expect(FORMATS.command.test('/git:commit')).toBe(true);
      expect(FORMATS.command.test('/sprint:team-run')).toBe(true);
      expect(FORMATS.command.test('/workflow:10x-improvement')).toBe(true);
    });

    it('should reject invalid command formats', () => {
      expect(FORMATS.command.test('dev:feature')).toBe(false); // missing leading slash
      expect(FORMATS.command.test('/dev/feature')).toBe(false); // wrong separator
      expect(FORMATS.command.test('/Dev:Feature')).toBe(false); // uppercase
      expect(FORMATS.command.test('feature')).toBe(false); // no namespace
    });

    if (existsSync(commandsDir)) {
      const namespaces = readdirSync(commandsDir).filter(item => {
        const itemPath = join(commandsDir, item);
        return statSync(itemPath).isDirectory() && !item.startsWith('.');
      });

      for (const namespace of namespaces) {
        it(`namespace "${namespace}" should be lowercase kebab-case`, () => {
          expect(namespace).toMatch(/^[a-z][a-z0-9-]*$/);
        });

        const namespaceDir = join(commandsDir, namespace);
        const cmdFiles = readdirSync(namespaceDir).filter(f => f.endsWith('.md'));

        for (const cmdFile of cmdFiles) {
          const cmdName = basename(cmdFile, '.md');
          it(`command "/${namespace}:${cmdName}" should have valid format`, () => {
            // Allow names to start with digits (e.g., 10x, 100x, 1000x)
            expect(cmdName).toMatch(/^[a-z0-9][a-z0-9-]*$/);
            expect(`/${namespace}:${cmdName}`).toMatch(FORMATS.command);
          });
        }
      }
    }
  });

  describe('Agent Name Format', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');

    it('should validate agent name format pattern', () => {
      expect(FORMATS.agent.test('fullstack-developer')).toBe(true);
      expect(FORMATS.agent.test('planner')).toBe(true);
      expect(FORMATS.agent.test('ui-ux-designer')).toBe(true);
    });

    it('should reject invalid agent name formats', () => {
      expect(FORMATS.agent.test('Fullstack-Developer')).toBe(false); // uppercase
      expect(FORMATS.agent.test('fullstack_developer')).toBe(false); // underscore
      expect(FORMATS.agent.test('category/agent')).toBe(false); // has category
    });

    if (existsSync(agentsDir)) {
      const agentFiles = readdirSync(agentsDir).filter(f => f.endsWith('.md'));

      for (const agentFile of agentFiles) {
        const agentName = basename(agentFile, '.md');
        it(`agent "${agentName}" should be lowercase kebab-case`, () => {
          expect(agentName).toMatch(FORMATS.agent);
        });
      }
    }
  });

  describe('Workflow Path Format', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');

    it('should validate workflow path format pattern', () => {
      expect(FORMATS.workflow.test('development/feature')).toBe(true);
      expect(FORMATS.workflow.test('ai-engineering/rag-development')).toBe(true);
      expect(FORMATS.workflow.test('omega/10x-improvement')).toBe(true);
      expect(FORMATS.workflow.test('omega/100x-architecture')).toBe(true);
      expect(FORMATS.workflow.test('omega/1000x-innovation')).toBe(true);
    });

    it('should reject invalid workflow path formats', () => {
      expect(FORMATS.workflow.test('feature')).toBe(false); // missing category
      expect(FORMATS.workflow.test('/development/feature')).toBe(false); // leading slash
      expect(FORMATS.workflow.test('Development/Feature')).toBe(false); // uppercase
    });

    if (existsSync(workflowsDir)) {
      const categories = readdirSync(workflowsDir).filter(item => {
        const itemPath = join(workflowsDir, item);
        return statSync(itemPath).isDirectory() && !item.startsWith('.');
      });

      for (const category of categories) {
        it(`workflow category "${category}" should be lowercase kebab-case`, () => {
          expect(category).toMatch(/^[a-z][a-z0-9-]*$/);
        });

        const categoryDir = join(workflowsDir, category);
        const workflowFiles = readdirSync(categoryDir).filter(f => f.endsWith('.md'));

        for (const workflowFile of workflowFiles) {
          const workflowName = basename(workflowFile, '.md');
          it(`workflow "${category}/${workflowName}" should have valid format`, () => {
            // Allow names to start with digits (e.g., 10x-improvement)
            expect(workflowName).toMatch(/^[a-z0-9][a-z0-9-]*$/);
            expect(`${category}/${workflowName}`).toMatch(FORMATS.workflow);
          });
        }
      }
    }
  });

  describe('Component References in Frontmatter', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    const workflowsDir = join(PLUGIN_DIR, 'workflows');

    if (existsSync(agentsDir)) {
      const agentFiles = getFiles(agentsDir, '.md');

      for (const filePath of agentFiles) {
        const agentName = basename(filePath, '.md');
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        if (fm && fm.skills && Array.isArray(fm.skills)) {
          for (const skill of fm.skills) {
            it(`agent "${agentName}" skill ref "${skill}" should use category/skill format`, () => {
              expect(skill).toMatch(FORMATS.skill);
            });
          }
        }

        if (fm && fm.commands && Array.isArray(fm.commands)) {
          for (const cmd of fm.commands) {
            it(`agent "${agentName}" command ref "${cmd}" should use /namespace:cmd format`, () => {
              expect(cmd).toMatch(FORMATS.command);
            });
          }
        }
      }
    }

    if (existsSync(workflowsDir)) {
      const workflowFiles = getFiles(workflowsDir, '.md');

      for (const filePath of workflowFiles) {
        const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        if (fm && fm.skills && Array.isArray(fm.skills)) {
          for (const skill of fm.skills) {
            it(`workflow "${relativePath}" skill ref "${skill}" should use category/skill format`, () => {
              expect(skill).toMatch(FORMATS.skill);
            });
          }
        }

        if (fm && fm.commands && Array.isArray(fm.commands)) {
          for (const cmd of fm.commands) {
            it(`workflow "${relativePath}" command ref "${cmd}" should use /namespace:cmd format`, () => {
              expect(cmd).toMatch(FORMATS.command);
            });
          }
        }

        if (fm && fm.agents && Array.isArray(fm.agents)) {
          for (const agent of fm.agents) {
            it(`workflow "${relativePath}" agent ref "${agent}" should use kebab-case format`, () => {
              expect(agent).toMatch(FORMATS.agent);
            });
          }
        }
      }
    }
  });
});
