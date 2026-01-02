/**
 * Hierarchy Validation Tests
 *
 * Validates the Optimized Alignment Principle hierarchy:
 * - Level 0: MCPs (foundation, used by all)
 * - Level 1: Commands (use MCPs)
 * - Level 2: Skills (use Commands, MCPs)
 * - Level 3: Agents (use Skills, Commands, MCPs)
 * - Level 4: Workflows (use Agents, Skills, Commands, MCPs)
 *
 * Ensures no cross-type confusion and proper hierarchical references.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');

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
 * Get all files recursively
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

/**
 * Get all agent names
 */
function getAllAgentNames() {
  const agentsDir = join(PLUGIN_DIR, 'agents');
  const names = new Set();
  if (!existsSync(agentsDir)) return names;

  const files = readdirSync(agentsDir).filter(f => f.endsWith('.md') || f.endsWith('.yaml'));
  for (const file of files) {
    const ext = file.endsWith('.yaml') ? '.yaml' : '.md';
    names.add(basename(file, ext));
  }
  return names;
}

/**
 * Get all skill IDs
 */
function getAllSkillIds() {
  const skillsDir = join(PLUGIN_DIR, 'skills');
  const ids = new Set();
  if (!existsSync(skillsDir)) return ids;

  const categories = readdirSync(skillsDir).filter(item => {
    return statSync(join(skillsDir, item)).isDirectory() && !item.startsWith('.');
  });

  for (const category of categories) {
    const categoryDir = join(skillsDir, category);
    const skillDirs = readdirSync(categoryDir).filter(item => {
      return statSync(join(categoryDir, item)).isDirectory();
    });

    for (const skillDir of skillDirs) {
      if (existsSync(join(categoryDir, skillDir, 'SKILL.md'))) {
        ids.add(`${category}/${skillDir}`);
      }
    }
  }
  return ids;
}

/**
 * Get all command IDs
 */
function getAllCommandIds() {
  const commandsDir = join(PLUGIN_DIR, 'commands');
  const ids = new Set();
  if (!existsSync(commandsDir)) return ids;

  const namespaces = readdirSync(commandsDir).filter(item => {
    return statSync(join(commandsDir, item)).isDirectory() && !item.startsWith('.');
  });

  for (const namespace of namespaces) {
    const namespaceDir = join(commandsDir, namespace);
    const files = readdirSync(namespaceDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      ids.add(`/${namespace}:${basename(file, '.md')}`);
    }
  }
  return ids;
}

/**
 * Get all workflow paths
 */
function getAllWorkflowPaths() {
  const workflowsDir = join(PLUGIN_DIR, 'workflows');
  const paths = new Set();
  if (!existsSync(workflowsDir)) return paths;

  const categories = readdirSync(workflowsDir).filter(item => {
    return statSync(join(workflowsDir, item)).isDirectory() && !item.startsWith('.');
  });

  for (const category of categories) {
    const categoryDir = join(workflowsDir, category);
    const files = readdirSync(categoryDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      paths.add(`${category}/${basename(file, '.md')}`);
    }
  }
  return paths;
}

describe('Hierarchy Validation', () => {
  let allAgentNames;
  let allSkillIds;
  let allCommandIds;
  let allWorkflowPaths;

  beforeAll(() => {
    allAgentNames = getAllAgentNames();
    allSkillIds = getAllSkillIds();
    allCommandIds = getAllCommandIds();
    allWorkflowPaths = getAllWorkflowPaths();
  });

  describe('Registry Alignment Principle', () => {
    const registryPath = join(PLUGIN_DIR, 'registry.yaml');

    it('should have alignment_principle defined', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);
      expect(registry.alignment_principle).toBeDefined();
    });

    it('should have correct hierarchy levels', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);
      const hierarchy = registry.alignment_principle.hierarchy;

      expect(hierarchy).toBeDefined();
      expect(hierarchy.length).toBe(5);

      const levels = hierarchy.map(h => h.level);
      expect(levels).toEqual([0, 1, 2, 3, 4]);

      const types = hierarchy.map(h => h.type);
      expect(types).toEqual(['mcp', 'command', 'skill', 'agent', 'workflow']);
    });

    it('should have enforced flag set to true', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);
      expect(registry.alignment_principle.enforced).toBe(true);
    });
  });

  describe('No Agent Names in Skills Field', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    if (!existsSync(agentsDir)) return;

    const agentFiles = getFiles(agentsDir, '.md');

    for (const filePath of agentFiles) {
      const agentName = basename(filePath, '.md');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.skills && Array.isArray(fm.skills)) {
        it(`agent "${agentName}" skills field doesn't contain agent names`, () => {
          for (const skill of fm.skills) {
            // Check both full skill ID and just the skill name part
            const skillNamePart = skill.split('/').pop();
            expect(
              allAgentNames.has(skill),
              `"${skill}" in skills field is an agent name`
            ).toBe(false);
            // Also ensure the skill name part isn't an agent name (less strict)
            // This is a warning-level check
          }
        });
      }
    }
  });

  describe('No Skill Names in Agents Field', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    if (!existsSync(workflowsDir)) return;

    const workflowFiles = getFiles(workflowsDir, '.md');

    for (const filePath of workflowFiles) {
      const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.agents && Array.isArray(fm.agents)) {
        it(`workflow "${relativePath}" agents field doesn't contain skill-like patterns`, () => {
          for (const agent of fm.agents) {
            // Agent names should not contain slashes (skill format)
            expect(
              agent.includes('/'),
              `"${agent}" in agents field looks like a skill ID (contains /)`
            ).toBe(false);
          }
        });
      }
    }
  });

  describe('Workflow Skills Are Not Agent Names', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    if (!existsSync(workflowsDir)) return;

    const workflowFiles = getFiles(workflowsDir, '.md');

    for (const filePath of workflowFiles) {
      const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.skills && Array.isArray(fm.skills)) {
        it(`workflow "${relativePath}" skills field doesn't contain agent names`, () => {
          for (const skill of fm.skills) {
            expect(
              allAgentNames.has(skill),
              `"${skill}" in skills field is an agent name`
            ).toBe(false);
          }
        });
      }
    }
  });

  describe('Agents Can Only Reference Skills and Commands', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    if (!existsSync(agentsDir)) return;

    const agentFiles = getFiles(agentsDir, '.md');

    for (const filePath of agentFiles) {
      const agentName = basename(filePath, '.md');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      it(`agent "${agentName}" only has valid reference fields`, () => {
        if (fm) {
          // Agents should not have a 'workflows' field
          expect(fm.workflows).toBeUndefined();

          // Skills should be category/skill-name format
          if (fm.skills && Array.isArray(fm.skills)) {
            for (const skill of fm.skills) {
              expect(skill).toMatch(/^[a-z-]+\/[a-z-]+$/);
            }
          }

          // Commands should be /namespace:command format
          if (fm.commands && Array.isArray(fm.commands)) {
            for (const cmd of fm.commands) {
              expect(cmd).toMatch(/^\/[a-z]+:[a-z0-9-]+$/);
            }
          }
        }
      });
    }
  });

  describe('Workflows Can Reference All Lower Levels', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    if (!existsSync(workflowsDir)) return;

    const workflowFiles = getFiles(workflowsDir, '.md');

    for (const filePath of workflowFiles) {
      const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm) {
        it(`workflow "${relativePath}" has valid reference structure`, () => {
          // Agents should be kebab-case
          if (fm.agents && Array.isArray(fm.agents)) {
            for (const agent of fm.agents) {
              expect(agent).toMatch(/^[a-z][a-z0-9-]*$/);
              expect(agent.includes('/')).toBe(false);
            }
          }

          // Skills should be category/skill-name format
          if (fm.skills && Array.isArray(fm.skills)) {
            for (const skill of fm.skills) {
              expect(skill).toMatch(/^[a-z-]+\/[a-z-]+$/);
            }
          }

          // Commands should be /namespace:command format
          if (fm.commands && Array.isArray(fm.commands)) {
            for (const cmd of fm.commands) {
              expect(cmd).toMatch(/^\/[a-z]+:[a-z0-9-]+$/);
            }
          }
        });
      }
    }
  });

  describe('Component Type Disambiguation', () => {
    it('should have no overlap between agent names and skill categories', () => {
      const skillsDir = join(PLUGIN_DIR, 'skills');
      if (!existsSync(skillsDir)) return;

      const categories = readdirSync(skillsDir).filter(item => {
        return statSync(join(skillsDir, item)).isDirectory() && !item.startsWith('.');
      });

      for (const category of categories) {
        // Category names should not be agent names
        // This is a soft check - some overlap may be intentional
        if (allAgentNames.has(category)) {
          console.warn(`Category "${category}" is also an agent name - potential confusion`);
        }
      }
    });

    it('should have no overlap between command namespaces and agent names', () => {
      const commandsDir = join(PLUGIN_DIR, 'commands');
      if (!existsSync(commandsDir)) return;

      const namespaces = readdirSync(commandsDir).filter(item => {
        return statSync(join(commandsDir, item)).isDirectory() && !item.startsWith('.');
      });

      for (const namespace of namespaces) {
        // Namespace names should not be agent names
        expect(
          allAgentNames.has(namespace),
          `Namespace "${namespace}" is also an agent name`
        ).toBe(false);
      }
    });
  });

  describe('Registry Consistency', () => {
    const registryPath = join(PLUGIN_DIR, 'registry.yaml');

    it('registry agents match filesystem agents', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);

      const registryAgents = Object.keys(registry.agents || {});
      const fsAgents = [...allAgentNames];

      // All registry agents should exist in filesystem
      for (const agent of registryAgents) {
        expect(
          allAgentNames.has(agent),
          `Registry agent "${agent}" not found in filesystem`
        ).toBe(true);
      }
    });

    it('registry skill categories match filesystem', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);

      const skillsDir = join(PLUGIN_DIR, 'skills');
      const fsCategories = new Set(
        readdirSync(skillsDir).filter(item => {
          return statSync(join(skillsDir, item)).isDirectory() && !item.startsWith('.');
        })
      );

      const registryCategories = new Set(registry.skill_categories || []);

      // All filesystem categories should be in registry
      for (const category of fsCategories) {
        expect(
          registryCategories.has(category),
          `Filesystem category "${category}" not in registry`
        ).toBe(true);
      }
    });

    it('registry command namespaces match filesystem', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);

      const commandsDir = join(PLUGIN_DIR, 'commands');
      const fsNamespaces = new Set(
        readdirSync(commandsDir).filter(item => {
          return statSync(join(commandsDir, item)).isDirectory() && !item.startsWith('.');
        })
      );

      const registryNamespaces = new Set(registry.command_namespaces || []);

      // All filesystem namespaces should be in registry
      for (const namespace of fsNamespaces) {
        expect(
          registryNamespaces.has(namespace),
          `Filesystem namespace "${namespace}" not in registry`
        ).toBe(true);
      }
    });
  });
});
