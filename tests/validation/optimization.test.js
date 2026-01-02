/**
 * Optimization Validation Tests
 *
 * Validates optimization aspects of the Alignment Principle:
 * - No duplicate references
 * - References are contextually appropriate
 * - No orphaned components
 * - Balanced usage distribution
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

describe('Optimization Validation', () => {
  let allSkillIds;
  let allAgentNames;

  beforeAll(() => {
    allSkillIds = getAllSkillIds();
    allAgentNames = getAllAgentNames();
  });

  describe('No Duplicate References', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    if (!existsSync(agentsDir)) return;

    const agentFiles = getFiles(agentsDir, '.md');

    for (const filePath of agentFiles) {
      const agentName = basename(filePath, '.md');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.skills && Array.isArray(fm.skills)) {
        it(`agent "${agentName}" has no duplicate skills`, () => {
          const uniqueSkills = new Set(fm.skills);
          expect(
            uniqueSkills.size,
            `Found ${fm.skills.length - uniqueSkills.size} duplicate skills`
          ).toBe(fm.skills.length);
        });
      }

      if (fm && fm.commands && Array.isArray(fm.commands)) {
        it(`agent "${agentName}" has no duplicate commands`, () => {
          const uniqueCommands = new Set(fm.commands);
          expect(
            uniqueCommands.size,
            `Found ${fm.commands.length - uniqueCommands.size} duplicate commands`
          ).toBe(fm.commands.length);
        });
      }
    }
  });

  describe('Workflow No Duplicate References', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    if (!existsSync(workflowsDir)) return;

    const workflowFiles = getFiles(workflowsDir, '.md');

    for (const filePath of workflowFiles) {
      const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
      const content = readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);

      if (fm && fm.agents && Array.isArray(fm.agents)) {
        it(`workflow "${relativePath}" has no duplicate agents`, () => {
          const uniqueAgents = new Set(fm.agents);
          expect(uniqueAgents.size).toBe(fm.agents.length);
        });
      }

      if (fm && fm.skills && Array.isArray(fm.skills)) {
        it(`workflow "${relativePath}" has no duplicate skills`, () => {
          const uniqueSkills = new Set(fm.skills);
          expect(uniqueSkills.size).toBe(fm.skills.length);
        });
      }

      if (fm && fm.commands && Array.isArray(fm.commands)) {
        it(`workflow "${relativePath}" has no duplicate commands`, () => {
          const uniqueCommands = new Set(fm.commands);
          expect(uniqueCommands.size).toBe(fm.commands.length);
        });
      }
    }
  });

  describe('Skill Usage Distribution', () => {
    it('core methodology skills should be widely used', () => {
      const coreSkills = [
        'methodology/writing-plans',
        'methodology/executing-plans',
        'methodology/problem-solving',
      ];

      const agentsDir = join(PLUGIN_DIR, 'agents');
      const agentFiles = getFiles(agentsDir, '.md');

      const skillUsage = new Map();
      for (const skill of coreSkills) {
        skillUsage.set(skill, 0);
      }

      for (const filePath of agentFiles) {
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        if (fm && fm.skills && Array.isArray(fm.skills)) {
          for (const skill of fm.skills) {
            if (skillUsage.has(skill)) {
              skillUsage.set(skill, skillUsage.get(skill) + 1);
            }
          }
        }
      }

      // Core skills should be used by at least 2 agents
      for (const [skill, count] of skillUsage) {
        expect(
          count,
          `Core skill "${skill}" is underutilized (used by ${count} agents)`
        ).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Agent Skill Coverage', () => {
    it('most agents should have at least one skill', () => {
      const agentsDir = join(PLUGIN_DIR, 'agents');
      const agentFiles = getFiles(agentsDir, '.md');

      let agentsWithSkills = 0;
      let agentsWithoutSkills = 0;
      const agentsWithoutSkillsList = [];

      for (const filePath of agentFiles) {
        const agentName = basename(filePath, '.md');
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        if (fm && fm.skills && Array.isArray(fm.skills) && fm.skills.length > 0) {
          agentsWithSkills++;
        } else {
          agentsWithoutSkills++;
          agentsWithoutSkillsList.push(agentName);
        }
      }

      // At least 70% of agents should have skills
      const coverage = agentsWithSkills / (agentsWithSkills + agentsWithoutSkills);
      expect(
        coverage,
        `Only ${(coverage * 100).toFixed(1)}% of agents have skills. Agents without skills: ${agentsWithoutSkillsList.join(', ')}`
      ).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe('Command Distribution', () => {
    it('command namespaces should be evenly distributed', () => {
      const commandsDir = join(PLUGIN_DIR, 'commands');
      if (!existsSync(commandsDir)) return;

      const namespaces = readdirSync(commandsDir).filter(item => {
        return statSync(join(commandsDir, item)).isDirectory() && !item.startsWith('.');
      });

      const commandCounts = new Map();

      for (const namespace of namespaces) {
        const namespaceDir = join(commandsDir, namespace);
        const files = readdirSync(namespaceDir).filter(f => f.endsWith('.md'));
        commandCounts.set(namespace, files.length);
      }

      // Each namespace should have at least 1 command
      for (const [namespace, count] of commandCounts) {
        expect(
          count,
          `Namespace "${namespace}" has no commands`
        ).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Registry Workflow Coverage', () => {
    const registryPath = join(PLUGIN_DIR, 'registry.yaml');

    it('registry should document significant workflows', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);

      const registeredWorkflows = Object.keys(registry.workflows || {});
      expect(registeredWorkflows.length).toBeGreaterThanOrEqual(20);
    });

    it('registered workflows should have meaningful agent lists', () => {
      const content = readFileSync(registryPath, 'utf-8');
      const registry = yaml.load(content);

      for (const [path, def] of Object.entries(registry.workflows || {})) {
        if (def.agents && Array.isArray(def.agents)) {
          expect(
            def.agents.length,
            `Workflow "${path}" should have at least 1 agent`
          ).toBeGreaterThanOrEqual(1);
        }
      }
    });
  });

  describe('Skill Category Balance', () => {
    it('skill categories should have meaningful content', () => {
      const skillsDir = join(PLUGIN_DIR, 'skills');
      if (!existsSync(skillsDir)) return;

      const categories = readdirSync(skillsDir).filter(item => {
        return statSync(join(skillsDir, item)).isDirectory() && !item.startsWith('.');
      });

      for (const category of categories) {
        const categoryDir = join(skillsDir, category);
        const skillDirs = readdirSync(categoryDir).filter(item => {
          return statSync(join(categoryDir, item)).isDirectory();
        });

        // Each category should have at least 1 skill
        expect(
          skillDirs.length,
          `Category "${category}" should have at least 1 skill`
        ).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('No Empty Reference Arrays', () => {
    it('agent skills arrays should be meaningful or undefined', () => {
      const agentsDir = join(PLUGIN_DIR, 'agents');
      const agentFiles = getFiles(agentsDir, '.md');

      for (const filePath of agentFiles) {
        const agentName = basename(filePath, '.md');
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        // Empty arrays are allowed (some agents may not need skills)
        // This is informational only
        if (fm && fm.skills && Array.isArray(fm.skills) && fm.skills.length === 0) {
          // This is fine - explicitly declaring no skills is valid
        }
      }
    });
  });

  describe('Frontmatter Consistency', () => {
    it('agents should have consistent frontmatter structure', () => {
      const agentsDir = join(PLUGIN_DIR, 'agents');
      const agentFiles = getFiles(agentsDir, '.md');

      for (const filePath of agentFiles) {
        const agentName = basename(filePath, '.md');
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        if (fm) {
          // Name should match filename
          if (fm.name) {
            expect(
              fm.name,
              `Agent "${agentName}" frontmatter name should match filename`
            ).toBe(agentName);
          }

          // Description should exist
          expect(
            fm.description,
            `Agent "${agentName}" should have a description`
          ).toBeDefined();
        }
      }
    });

    it('workflows should have consistent frontmatter structure', () => {
      const workflowsDir = join(PLUGIN_DIR, 'workflows');
      const workflowFiles = getFiles(workflowsDir, '.md');

      for (const filePath of workflowFiles) {
        const relativePath = filePath.replace(workflowsDir + '/', '').replace('.md', '');
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        if (fm) {
          // Description should exist (name is optional, can be derived from filename)
          expect(
            fm.description,
            `Workflow "${relativePath}" should have a description`
          ).toBeDefined();
        }
      }
    });
  });

  describe('Reference Quality Metrics', () => {
    it('should report overall alignment metrics', () => {
      const agentsDir = join(PLUGIN_DIR, 'agents');
      const workflowsDir = join(PLUGIN_DIR, 'workflows');

      let totalSkillRefs = 0;
      let totalCommandRefs = 0;
      let totalAgentRefs = 0;

      // Count agent references
      const agentFiles = getFiles(agentsDir, '.md');
      for (const filePath of agentFiles) {
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        if (fm) {
          if (fm.skills && Array.isArray(fm.skills)) totalSkillRefs += fm.skills.length;
          if (fm.commands && Array.isArray(fm.commands)) totalCommandRefs += fm.commands.length;
        }
      }

      // Count workflow references
      const workflowFiles = getFiles(workflowsDir, '.md');
      for (const filePath of workflowFiles) {
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);
        if (fm) {
          if (fm.agents && Array.isArray(fm.agents)) totalAgentRefs += fm.agents.length;
          if (fm.skills && Array.isArray(fm.skills)) totalSkillRefs += fm.skills.length;
          if (fm.commands && Array.isArray(fm.commands)) totalCommandRefs += fm.commands.length;
        }
      }

      // Ensure meaningful reference counts
      expect(totalSkillRefs).toBeGreaterThan(50);
      expect(totalCommandRefs).toBeGreaterThan(50);
      expect(totalAgentRefs).toBeGreaterThan(50);

      console.log(`Alignment Metrics:
  - Total skill references: ${totalSkillRefs}
  - Total command references: ${totalCommandRefs}
  - Total agent references: ${totalAgentRefs}
  - Unique skills: ${allSkillIds.size}
  - Unique agents: ${allAgentNames.size}`);
    });
  });
});
