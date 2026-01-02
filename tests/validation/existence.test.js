/**
 * Existence Validation Tests
 *
 * Validates that all referenced components actually exist:
 * - Skills referenced by agents/workflows exist in /plugin/skills/
 * - Commands referenced exist in /plugin/commands/
 * - Agents referenced by workflows exist in /plugin/agents/
 * - MCPs referenced exist in /plugin/mcp/ (future)
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
 * Get all valid skill IDs
 */
function getAllSkillIds() {
  const skillsDir = join(PLUGIN_DIR, 'skills');
  const skillIds = new Set();
  if (!existsSync(skillsDir)) return skillIds;

  const categories = readdirSync(skillsDir).filter(item => {
    const itemPath = join(skillsDir, item);
    return statSync(itemPath).isDirectory() && !item.startsWith('.');
  });

  for (const category of categories) {
    const categoryDir = join(skillsDir, category);
    const skillDirs = readdirSync(categoryDir).filter(item => {
      return statSync(join(categoryDir, item)).isDirectory();
    });

    for (const skillDir of skillDirs) {
      const skillFile = join(categoryDir, skillDir, 'SKILL.md');
      if (existsSync(skillFile)) {
        skillIds.add(`${category}/${skillDir}`);
      }
    }
  }
  return skillIds;
}

/**
 * Get all valid command IDs
 */
function getAllCommandIds() {
  const commandsDir = join(PLUGIN_DIR, 'commands');
  const commandIds = new Set();
  if (!existsSync(commandsDir)) return commandIds;

  const namespaces = readdirSync(commandsDir).filter(item => {
    return statSync(join(commandsDir, item)).isDirectory() && !item.startsWith('.');
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
 * Get all valid agent names
 */
function getAllAgentNames() {
  const agentsDir = join(PLUGIN_DIR, 'agents');
  const agentNames = new Set();
  if (!existsSync(agentsDir)) return agentNames;

  const files = readdirSync(agentsDir).filter(f => f.endsWith('.md') || f.endsWith('.yaml'));
  for (const file of files) {
    const ext = file.endsWith('.yaml') ? '.yaml' : '.md';
    agentNames.add(basename(file, ext));
  }
  return agentNames;
}

/**
 * Get all valid MCP names
 */
function getAllMcpNames() {
  const registryPath = join(PLUGIN_DIR, 'registry.yaml');
  const mcpNames = new Set();
  if (!existsSync(registryPath)) return mcpNames;

  const content = readFileSync(registryPath, 'utf-8');
  const registry = yaml.load(content);
  if (registry && registry.mcp_servers) {
    Object.keys(registry.mcp_servers).forEach(name => mcpNames.add(name));
  }
  return mcpNames;
}

describe('Existence Validation', () => {
  let allSkillIds;
  let allCommandIds;
  let allAgentNames;
  let allMcpNames;

  beforeAll(() => {
    allSkillIds = getAllSkillIds();
    allCommandIds = getAllCommandIds();
    allAgentNames = getAllAgentNames();
    allMcpNames = getAllMcpNames();
  });

  describe('Component Counts', () => {
    it('should have at least 100 skills', () => {
      expect(allSkillIds.size).toBeGreaterThanOrEqual(100);
    });

    it('should have at least 80 commands', () => {
      expect(allCommandIds.size).toBeGreaterThanOrEqual(80);
    });

    it('should have at least 30 agents', () => {
      expect(allAgentNames.size).toBeGreaterThanOrEqual(30);
    });

    it('should have at least 3 MCPs registered', () => {
      expect(allMcpNames.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Agent Skill References', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    if (!existsSync(agentsDir)) return;

    const agentFiles = getFiles(agentsDir, '.md');

    for (const filePath of agentFiles) {
      const agentName = basename(filePath, '.md');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.skills && Array.isArray(fm.skills)) {
        for (const skill of fm.skills) {
          it(`agent "${agentName}" references existing skill "${skill}"`, () => {
            expect(
              allSkillIds.has(skill),
              `Skill "${skill}" referenced by agent "${agentName}" does not exist. Available skills in this category: ${[...allSkillIds].filter(s => s.startsWith(skill.split('/')[0])).join(', ')}`
            ).toBe(true);
          });
        }
      }
    }
  });

  describe('Workflow Skill References', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    if (!existsSync(workflowsDir)) return;

    const workflowFiles = getFiles(workflowsDir, '.md');

    for (const filePath of workflowFiles) {
      const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.skills && Array.isArray(fm.skills)) {
        for (const skill of fm.skills) {
          it(`workflow "${relativePath}" references existing skill "${skill}"`, () => {
            expect(
              allSkillIds.has(skill),
              `Skill "${skill}" referenced by workflow "${relativePath}" does not exist`
            ).toBe(true);
          });
        }
      }
    }
  });

  describe('Workflow Agent References', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    if (!existsSync(workflowsDir)) return;

    const workflowFiles = getFiles(workflowsDir, '.md');

    for (const filePath of workflowFiles) {
      const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.agents && Array.isArray(fm.agents)) {
        for (const agent of fm.agents) {
          it(`workflow "${relativePath}" references existing agent "${agent}"`, () => {
            expect(
              allAgentNames.has(agent),
              `Agent "${agent}" referenced by workflow "${relativePath}" does not exist. Available agents: ${[...allAgentNames].slice(0, 10).join(', ')}...`
            ).toBe(true);
          });
        }
      }
    }
  });

  describe('Registry Agent References', () => {
    const registryPath = join(PLUGIN_DIR, 'registry.yaml');
    if (!existsSync(registryPath)) return;

    const content = readFileSync(registryPath, 'utf-8');
    const registry = yaml.load(content);

    if (registry && registry.agents) {
      for (const [agentName, agentDef] of Object.entries(registry.agents)) {
        it(`registry agent "${agentName}" has existing file`, () => {
          const agentPath = join(PLUGIN_DIR, agentDef.file);
          expect(existsSync(agentPath), `Agent file "${agentDef.file}" does not exist`).toBe(true);
        });

        if (agentDef.skills && Array.isArray(agentDef.skills)) {
          for (const skill of agentDef.skills) {
            it(`registry agent "${agentName}" references existing skill "${skill}"`, () => {
              expect(allSkillIds.has(skill), `Skill "${skill}" does not exist`).toBe(true);
            });
          }
        }
      }
    }
  });

  describe('Registry Workflow References', () => {
    const registryPath = join(PLUGIN_DIR, 'registry.yaml');
    if (!existsSync(registryPath)) return;

    const content = readFileSync(registryPath, 'utf-8');
    const registry = yaml.load(content);

    if (registry && registry.workflows) {
      for (const [workflowPath, workflowDef] of Object.entries(registry.workflows)) {
        const [category, name] = workflowPath.split('/');
        const filePath = join(PLUGIN_DIR, 'workflows', category, `${name}.md`);

        it(`registry workflow "${workflowPath}" has existing file`, () => {
          expect(existsSync(filePath), `Workflow file does not exist at ${filePath}`).toBe(true);
        });

        if (workflowDef.agents && Array.isArray(workflowDef.agents)) {
          for (const agent of workflowDef.agents) {
            it(`registry workflow "${workflowPath}" references existing agent "${agent}"`, () => {
              expect(allAgentNames.has(agent), `Agent "${agent}" does not exist`).toBe(true);
            });
          }
        }

        if (workflowDef.skills && Array.isArray(workflowDef.skills)) {
          for (const skill of workflowDef.skills) {
            it(`registry workflow "${workflowPath}" references existing skill "${skill}"`, () => {
              expect(allSkillIds.has(skill), `Skill "${skill}" does not exist`).toBe(true);
            });
          }
        }
      }
    }
  });

  describe('All Skills Have SKILL.md', () => {
    const skillsDir = join(PLUGIN_DIR, 'skills');
    if (!existsSync(skillsDir)) return;

    const categories = readdirSync(skillsDir).filter(item => {
      const itemPath = join(skillsDir, item);
      return statSync(itemPath).isDirectory() && !item.startsWith('.');
    });

    for (const category of categories) {
      const categoryDir = join(skillsDir, category);
      const skillDirs = readdirSync(categoryDir).filter(item => {
        return statSync(join(categoryDir, item)).isDirectory();
      });

      for (const skillDir of skillDirs) {
        it(`skill "${category}/${skillDir}" has SKILL.md file`, () => {
          const skillFile = join(categoryDir, skillDir, 'SKILL.md');
          expect(existsSync(skillFile)).toBe(true);
        });
      }
    }
  });

  describe('All Agents Have Valid Files', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    if (!existsSync(agentsDir)) return;

    const agentFiles = readdirSync(agentsDir).filter(f =>
      (f.endsWith('.md') || f.endsWith('.yaml')) && !f.startsWith('.')
    );

    for (const file of agentFiles) {
      const agentName = file.replace(/\.(md|yaml)$/, '');
      it(`agent file "${file}" is not empty`, () => {
        const filePath = join(agentsDir, file);
        const content = readFileSync(filePath, 'utf-8');
        expect(content.trim().length).toBeGreaterThan(0);
      });
    }
  });
});
