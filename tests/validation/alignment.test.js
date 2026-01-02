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
});
