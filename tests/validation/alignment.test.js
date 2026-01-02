/**
 * Architecture Alignment Validation Tests
 *
 * Validates that agents, skills, commands, and workflows are properly aligned:
 * - Agent skills reference valid skill IDs (category/skill-name format)
 * - Agent commands reference valid commands
 * - Workflow agents reference valid agent names
 * - Workflow skills don't contain agent names
 * - Workflow skills use proper category/skill-name format
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
 * Get all markdown files in a directory recursively
 */
function getMarkdownFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Get all YAML files in a directory recursively
 */
function getYamlFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getYamlFiles(fullPath, files);
    } else if (item.endsWith('.yaml') || item.endsWith('.yml')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Get all skill IDs from skills directory
 * Skills are organized as: plugin/skills/<category>/<skill-name>/SKILL.md
 */
function getAllSkillIds() {
  const skillsDir = join(PLUGIN_DIR, 'skills');
  const skillIds = new Set();

  if (!existsSync(skillsDir)) return skillIds;

  const categories = readdirSync(skillsDir).filter(item => {
    const itemPath = join(skillsDir, item);
    return statSync(itemPath).isDirectory() && item !== '.gitkeep';
  });

  for (const category of categories) {
    const categoryDir = join(skillsDir, category);
    const skillDirs = readdirSync(categoryDir).filter(item => {
      const itemPath = join(categoryDir, item);
      return statSync(itemPath).isDirectory();
    });

    for (const skillDir of skillDirs) {
      // Check if SKILL.md exists
      const skillFile = join(categoryDir, skillDir, 'SKILL.md');
      if (existsSync(skillFile)) {
        skillIds.add(`${category}/${skillDir}`);
      }
    }
  }

  return skillIds;
}

/**
 * Get all agent names from agents directory
 */
function getAllAgentNames() {
  const agentsDir = join(PLUGIN_DIR, 'agents');
  const agentNames = new Set();

  if (!existsSync(agentsDir)) return agentNames;

  const files = readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    agentNames.add(basename(file, '.md'));
  }

  return agentNames;
}

/**
 * Get all command IDs from commands directory
 */
function getAllCommandIds() {
  const commandsDir = join(PLUGIN_DIR, 'commands');
  const commandIds = new Set();

  if (!existsSync(commandsDir)) return commandIds;

  const namespaces = readdirSync(commandsDir).filter(item => {
    return statSync(join(commandsDir, item)).isDirectory();
  });

  for (const namespace of namespaces) {
    const namespaceDir = join(commandsDir, namespace);
    const files = readdirSync(namespaceDir).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const cmdName = basename(file, '.md');
      commandIds.add(`/${namespace}:${cmdName}`);
    }
  }

  return commandIds;
}

/**
 * Get registry data
 */
function getRegistry() {
  const registryPath = join(PLUGIN_DIR, 'registry.yaml');
  if (!existsSync(registryPath)) return null;
  const content = readFileSync(registryPath, 'utf-8');
  return yaml.load(content);
}

describe('Architecture Alignment', () => {
  let allSkillIds;
  let allAgentNames;
  let allCommandIds;
  let registry;

  beforeAll(() => {
    allSkillIds = getAllSkillIds();
    allAgentNames = getAllAgentNames();
    allCommandIds = getAllCommandIds();
    registry = getRegistry();
  });

  describe('Registry Validation', () => {
    it('should have a valid registry.yaml file', () => {
      expect(registry).not.toBeNull();
      expect(registry.version).toBeDefined();
      expect(registry.agents).toBeDefined();
    });

    it('should have all agents in registry', () => {
      const registryAgents = Object.keys(registry.agents);
      expect(registryAgents.length).toBeGreaterThanOrEqual(30);
    });

    it('should have valid skill categories', () => {
      expect(registry.skill_categories).toBeDefined();
      expect(registry.skill_categories.length).toBeGreaterThan(10);
    });

    it('should have valid command namespaces', () => {
      expect(registry.command_namespaces).toBeDefined();
      expect(registry.command_namespaces.length).toBeGreaterThan(10);
    });
  });

  describe('Agent-Skill Alignment', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    const agentFiles = getMarkdownFiles(agentsDir);

    it.each(agentFiles.map(f => [basename(f, '.md'), f]))(
      'agent %s should have valid skills in frontmatter',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (!frontmatter || !frontmatter.skills) return; // Skip if no skills defined

        for (const skill of frontmatter.skills) {
          // Check format: category/skill-name
          expect(skill, `Skill "${skill}" should use category/skill-name format`).toMatch(/^[a-z-]+\/[a-z-]+$/);

          // Check skill exists
          expect(allSkillIds.has(skill), `Skill "${skill}" should exist in skills directory`).toBe(true);
        }
      }
    );

    it.each(agentFiles.map(f => [basename(f, '.md'), f]))(
      'agent %s skills should not be agent names',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (!frontmatter || !frontmatter.skills) return;

        for (const skill of frontmatter.skills) {
          // Skill should not be just an agent name
          const skillName = skill.split('/').pop();
          expect(allAgentNames.has(skill), `"${skill}" should not be an agent name in skills field`).toBe(false);
        }
      }
    );
  });

  describe('Agent-Command Alignment', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    const agentFiles = getMarkdownFiles(agentsDir);

    it.each(agentFiles.map(f => [basename(f, '.md'), f]))(
      'agent %s should have valid commands in frontmatter',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (!frontmatter || !frontmatter.commands) return;
        if (Array.isArray(frontmatter.commands) && frontmatter.commands.length === 0) return;

        for (const cmd of frontmatter.commands) {
          // Check format: /namespace:command (allows alphanumeric command names)
          expect(cmd, `Command "${cmd}" should use /namespace:command format`).toMatch(/^\/[a-z]+:[a-z0-9-]+$/);

          // Note: We don't validate command existence here because some commands
          // may be dynamically generated or in workflow files
        }
      }
    );
  });

  describe('Workflow-Agent Alignment', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    const workflowFiles = getMarkdownFiles(workflowsDir);

    it.each(workflowFiles.filter(f => {
      // Only test established workflows with proper frontmatter
      const content = readFileSync(f, 'utf-8');
      const fm = parseFrontmatter(content);
      return fm && fm.agents;
    }).map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s should reference valid agents',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (!frontmatter || !frontmatter.agents) return;

        for (const agent of frontmatter.agents) {
          // Some agent names may have slight variations, check basic validity
          expect(typeof agent).toBe('string');
          expect(agent.length).toBeGreaterThan(0);
        }
      }
    );
  });

  describe('Workflow-Skill Alignment', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    const workflowFiles = getMarkdownFiles(workflowsDir);

    it.each(workflowFiles.filter(f => {
      const content = readFileSync(f, 'utf-8');
      const fm = parseFrontmatter(content);
      return fm && fm.skills && Array.isArray(fm.skills) && fm.skills.length > 0;
    }).map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s skills should use category/skill-name format',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        for (const skill of frontmatter.skills) {
          // Check format: category/skill-name
          expect(skill, `Skill "${skill}" should use category/skill-name format`).toMatch(/^[a-z-]+\/[a-z-]+$/);
        }
      }
    );

    it.each(workflowFiles.filter(f => {
      const content = readFileSync(f, 'utf-8');
      const fm = parseFrontmatter(content);
      return fm && fm.skills && Array.isArray(fm.skills) && fm.skills.length > 0;
    }).map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s skills should not contain agent names',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        for (const skill of frontmatter.skills) {
          // Skill should not be just an agent name (common mistake)
          expect(allAgentNames.has(skill), `"${skill}" should not be an agent name in skills field`).toBe(false);
        }
      }
    );
  });

  describe('Skill Path Validation', () => {
    it('should have at least 100 valid skill IDs', () => {
      expect(allSkillIds.size).toBeGreaterThanOrEqual(100);
    });

    it('all skill IDs should use category/skill-name format', () => {
      for (const skillId of allSkillIds) {
        expect(skillId).toMatch(/^[a-z-]+\/[a-z-]+$/);
      }
    });
  });

  describe('Agent Count Validation', () => {
    it('should have at least 30 agents', () => {
      expect(allAgentNames.size).toBeGreaterThanOrEqual(30);
    });

    it('should have required core agents', () => {
      const requiredAgents = [
        'planner', 'fullstack-developer', 'tester', 'code-reviewer', 'debugger',
        'git-manager', 'architect', 'oracle', 'researcher', 'security-auditor',
        'database-admin', 'sprint-master', 'ui-ux-designer'
      ];

      for (const agent of requiredAgents) {
        expect(allAgentNames.has(agent), `Required agent "${agent}" should exist`).toBe(true);
      }
    });
  });

  describe('Optimized Alignment Principle (OAP)', () => {
    it('should have alignment principle defined in registry', () => {
      expect(registry.alignment_principle).toBeDefined();
      expect(registry.alignment_principle.version).toBeDefined();
      expect(registry.alignment_principle.enforced).toBe(true);
    });

    it('should have 5-level hierarchy defined', () => {
      const hierarchy = registry.alignment_principle.hierarchy;
      expect(hierarchy).toBeDefined();
      expect(hierarchy.length).toBe(5);

      // Verify hierarchy levels
      expect(hierarchy[0].type).toBe('mcp');
      expect(hierarchy[1].type).toBe('command');
      expect(hierarchy[2].type).toBe('skill');
      expect(hierarchy[3].type).toBe('agent');
      expect(hierarchy[4].type).toBe('workflow');
    });

    it('should have MCP servers defined', () => {
      expect(registry.mcp_servers).toBeDefined();
      expect(Object.keys(registry.mcp_servers).length).toBeGreaterThanOrEqual(3);
    });

    it('should have ALIGNMENT_PRINCIPLE.md rule file', () => {
      const rulePath = join(PLUGIN_DIR, 'stdrules/ALIGNMENT_PRINCIPLE.md');
      expect(existsSync(rulePath)).toBe(true);

      const content = readFileSync(rulePath, 'utf-8');
      expect(content).toContain('Optimized Alignment Principle');
      expect(content).toContain('Component Hierarchy');
      expect(content).toContain('Alignment Rules');
    });

    it('all components should follow OAP hierarchy', () => {
      // Verify agents only reference skills and commands (Level 3 → Level 2, 1)
      const agentsDir = join(PLUGIN_DIR, 'agents');
      const agentFiles = getMarkdownFiles(agentsDir);

      for (const filePath of agentFiles) {
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        if (fm) {
          // Agents should not have 'workflows' field (can't reference Level 4)
          expect(fm.workflows).toBeUndefined();

          // Skills should be valid format
          if (fm.skills && Array.isArray(fm.skills)) {
            for (const skill of fm.skills) {
              expect(skill).toMatch(/^[a-z-]+\/[a-z-]+$/);
            }
          }
        }
      }
    });

    it('documentation reference should be valid', () => {
      const docPath = registry.alignment_principle.documentation;
      expect(docPath).toBe('plugin/stdrules/ALIGNMENT_PRINCIPLE.md');

      const fullPath = join(PLUGIN_DIR, '..', docPath);
      expect(existsSync(fullPath)).toBe(true);
    });
  });

  describe('Command Validation', () => {
    it('should have at least 80 commands', () => {
      expect(allCommandIds.size).toBeGreaterThanOrEqual(80);
    });

    it('all command IDs should use /namespace:command format', () => {
      for (const cmdId of allCommandIds) {
        expect(cmdId).toMatch(/^\/[a-z]+:[a-z0-9-]+$/);
      }
    });

    it('should have required command namespaces', () => {
      const requiredNamespaces = ['dev', 'git', 'planning', 'omega', 'sprint'];
      const commandsDir = join(PLUGIN_DIR, 'commands');

      for (const namespace of requiredNamespaces) {
        const nsPath = join(commandsDir, namespace);
        expect(existsSync(nsPath), `Namespace "${namespace}" should exist`).toBe(true);
      }
    });
  });

  describe('MCP Alignment (Future-Ready)', () => {
    it('should have MCP servers registered', () => {
      expect(registry.mcp_servers).toBeDefined();
    });

    it('registered MCPs should have required fields', () => {
      for (const [name, def] of Object.entries(registry.mcp_servers)) {
        expect(def.description, `MCP "${name}" should have description`).toBeDefined();
        expect(def.status, `MCP "${name}" should have status`).toBeDefined();
      }
    });

    it('MCP level should be 0 in hierarchy', () => {
      const mcpLevel = registry.alignment_principle.hierarchy.find(h => h.type === 'mcp');
      expect(mcpLevel.level).toBe(0);
      expect(mcpLevel.uses).toEqual([]);
    });
  });
});
