/**
 * Before-Commit Validation Tests
 *
 * Comprehensive validation of all before-commit rules:
 * - Registry integrity
 * - Command registration
 * - Documentation quality
 * - Dependency graph validity
 * - Cross-reference validation
 *
 * This is the master test file for pre-commit validation.
 * Run with: npm test -- tests/validation/before-commit.test.js
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { buildDependencyGraph } from '../../scripts/build-dependency-graph.js';

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
    } else if (item.endsWith(extension) && !item.startsWith('.')) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Before-Commit Validation Suite', () => {
  let registry;
  let graph;
  let stats;

  beforeAll(async () => {
    // Load registry
    const registryContent = readFileSync(join(PLUGIN_DIR, 'registry.yaml'), 'utf-8');
    registry = yaml.load(registryContent);

    // Build dependency graph
    const result = await buildDependencyGraph();
    graph = result.graph;
    stats = result.stats;
  });

  describe('1. Registry Integrity', () => {
    it('registry.yaml should have version', () => {
      expect(registry.version).toBeDefined();
    });

    it('registry.yaml should have alignment_principle', () => {
      expect(registry.alignment_principle).toBeDefined();
      expect(registry.alignment_principle.enforced).toBe(true);
    });

    it('registry.yaml should have all required sections', () => {
      expect(registry.agents).toBeDefined();
      expect(registry.workflows).toBeDefined();
      expect(registry.command_namespaces).toBeDefined();
      expect(registry.skill_categories).toBeDefined();
    });

    it('registered agents should match actual files', () => {
      const registeredCount = Object.keys(registry.agents || {}).length;
      const actualCount = stats.agents;
      expect(
        registeredCount,
        `Registry has ${registeredCount} agents, actual has ${actualCount}`
      ).toBe(actualCount);
    });
  });

  describe('2. Command Registration', () => {
    const commandsDir = join(PLUGIN_DIR, 'commands');

    it('all command namespaces should be registered', () => {
      const namespaces = readdirSync(commandsDir).filter(item => {
        const itemPath = join(commandsDir, item);
        return statSync(itemPath).isDirectory() && !item.startsWith('.');
      });

      for (const namespace of namespaces) {
        expect(
          (registry.command_namespaces || []).includes(namespace),
          `Namespace "${namespace}" not registered in registry.yaml`
        ).toBe(true);
      }
    });

    it('all registered namespaces should exist', () => {
      for (const namespace of registry.command_namespaces || []) {
        const namespacePath = join(commandsDir, namespace);
        expect(
          existsSync(namespacePath),
          `Registered namespace "${namespace}" has no directory`
        ).toBe(true);
      }
    });

    it('should have at least 100 commands', () => {
      const commandFiles = getFiles(commandsDir, '.md');
      expect(commandFiles.length).toBeGreaterThanOrEqual(100);
    });

    it('all commands should have valid frontmatter', () => {
      const commandFiles = getFiles(commandsDir, '.md');

      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const frontmatter = parseFrontmatter(content);
        expect(
          frontmatter,
          `Command ${file} has no valid frontmatter`
        ).not.toBeNull();
      }
    });

    it('all commands should have description', () => {
      const commandFiles = getFiles(commandsDir, '.md');

      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const frontmatter = parseFrontmatter(content);
        if (frontmatter) {
          expect(
            frontmatter.description,
            `Command ${file} missing description`
          ).toBeDefined();
        }
      }
    });
  });

  describe('3. Dependency Graph Validity', () => {
    it('should have agents in graph', () => {
      expect(stats.agents).toBeGreaterThan(0);
    });

    it('should have workflows in graph', () => {
      expect(stats.workflows).toBeGreaterThan(0);
    });

    it('should have skills in graph', () => {
      expect(stats.skills).toBeGreaterThan(0);
    });

    it('should have commands in graph', () => {
      expect(stats.commands).toBeGreaterThan(0);
    });

    it('all agent skill refs should exist', () => {
      for (const [agentName, agent] of Object.entries(graph.agents)) {
        for (const skillId of agent.dependsOn.skills) {
          expect(
            graph.skills[skillId],
            `Agent "${agentName}" references non-existent skill "${skillId}"`
          ).toBeDefined();
        }
      }
    });

    it('all agent command refs should exist', () => {
      for (const [agentName, agent] of Object.entries(graph.agents)) {
        for (const cmdId of agent.dependsOn.commands) {
          expect(
            graph.commands[cmdId],
            `Agent "${agentName}" references non-existent command "${cmdId}"`
          ).toBeDefined();
        }
      }
    });

    it('all workflow agent refs should exist', () => {
      for (const [workflowPath, workflow] of Object.entries(graph.workflows)) {
        for (const agentName of workflow.dependsOn.agents) {
          expect(
            graph.agents[agentName],
            `Workflow "${workflowPath}" references non-existent agent "${agentName}"`
          ).toBeDefined();
        }
      }
    });
  });

  describe('4. Documentation Minimum Standards', () => {
    it('agent files should have 50+ lines', () => {
      const agentFiles = getFiles(join(PLUGIN_DIR, 'agents'), '.md');

      for (const file of agentFiles) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n').length;
        expect(
          lines,
          `Agent ${basename(file)} has ${lines} lines, minimum is 50`
        ).toBeGreaterThanOrEqual(50);
      }
    });

    it('command files should have 15+ lines', () => {
      const commandFiles = getFiles(join(PLUGIN_DIR, 'commands'), '.md');

      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n').length;
        expect(
          lines,
          `Command ${basename(file)} has ${lines} lines, minimum is 15`
        ).toBeGreaterThanOrEqual(15);
      }
    });

    it('workflow files should have 50+ lines', () => {
      const workflowFiles = getFiles(join(PLUGIN_DIR, 'workflows'), '.md');

      for (const file of workflowFiles) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n').length;
        expect(
          lines,
          `Workflow ${basename(file)} has ${lines} lines, minimum is 50`
        ).toBeGreaterThanOrEqual(50);
      }
    });
  });

  describe('5. Cross-Reference Validation', () => {
    it('agent skills should exist in skills directory', () => {
      const skillsDir = join(PLUGIN_DIR, 'skills');

      for (const [agentName, agent] of Object.entries(graph.agents)) {
        for (const skillId of agent.dependsOn.skills) {
          const [category, name] = skillId.split('/');
          const skillPath = join(skillsDir, category, name, 'SKILL.md');

          // Some skills might be in the category directory directly
          const altSkillPath = join(skillsDir, category, 'SKILL.md');

          const exists = existsSync(skillPath) ||
            (existsSync(altSkillPath) && name === category);

          expect(
            graph.skills[skillId],
            `Agent "${agentName}" skill "${skillId}" not found in graph`
          ).toBeDefined();
        }
      }
    });

    it('workflow skills should exist', () => {
      for (const [workflowPath, workflow] of Object.entries(graph.workflows)) {
        for (const skillId of workflow.dependsOn.skills) {
          expect(
            graph.skills[skillId],
            `Workflow "${workflowPath}" skill "${skillId}" not found`
          ).toBeDefined();
        }
      }
    });

    it('workflow commands should exist', () => {
      for (const [workflowPath, workflow] of Object.entries(graph.workflows)) {
        for (const cmdId of workflow.dependsOn.commands) {
          expect(
            graph.commands[cmdId],
            `Workflow "${workflowPath}" command "${cmdId}" not found`
          ).toBeDefined();
        }
      }
    });
  });

  describe('6. Registry Sync Validation', () => {
    it('registered workflow agents should match frontmatter', () => {
      for (const [workflowPath, workflowData] of Object.entries(registry.workflows || {})) {
        const actual = graph.workflows[workflowPath];
        if (!actual) continue;

        const registryAgents = workflowData.agents || [];
        const actualAgents = actual.dependsOn.agents || [];

        for (const agent of registryAgents) {
          expect(
            actualAgents.includes(agent),
            `Workflow "${workflowPath}" registry has "${agent}" but frontmatter doesn't`
          ).toBe(true);
        }
      }
    });

    it('registered agent skills should match frontmatter', () => {
      for (const [agentName, agentData] of Object.entries(registry.agents || {})) {
        const actual = graph.agents[agentName];
        if (!actual) continue;

        const registrySkills = agentData.skills || [];
        const actualSkills = actual.dependsOn.skills || [];

        for (const skill of registrySkills) {
          expect(
            actualSkills.includes(skill),
            `Agent "${agentName}" registry has skill "${skill}" but frontmatter doesn't`
          ).toBe(true);
        }
      }
    });
  });

  describe('7. No Prohibited Content', () => {
    // Only match actual placeholders, not documentation about them
    const prohibitedPatterns = [
      /^[\s]*TODO:/im,                    // TODO: at line start (actual placeholder)
      /^[\s]*FIXME:/im,                   // FIXME: at line start (actual placeholder)
      /^[\s]*HACK:/im,                    // HACK: at line start (actual placeholder)
      /\[INSERT\s+[^\]]+\]/i,             // [INSERT something] placeholder
      /\[PLACEHOLDER[^\]]*\]/i,           // [PLACEHOLDER] or [PLACEHOLDER:xyz]
      /^\s*TBD\s*$/im,                    // TBD on its own line
    ];

    it('agent files should not contain prohibited text', () => {
      const agentFiles = getFiles(join(PLUGIN_DIR, 'agents'), '.md');

      for (const file of agentFiles) {
        const content = readFileSync(file, 'utf-8');

        for (const pattern of prohibitedPatterns) {
          expect(
            pattern.test(content),
            `Agent ${basename(file)} contains prohibited text: ${pattern}`
          ).toBe(false);
        }
      }
    });

    it('workflow files should not contain prohibited text', () => {
      const workflowFiles = getFiles(join(PLUGIN_DIR, 'workflows'), '.md');

      for (const file of workflowFiles) {
        const content = readFileSync(file, 'utf-8');

        for (const pattern of prohibitedPatterns) {
          expect(
            pattern.test(content),
            `Workflow ${basename(file)} contains prohibited text: ${pattern}`
          ).toBe(false);
        }
      }
    });
  });

  describe('8. Component Counts', () => {
    it('should have at least 30 agents', () => {
      expect(stats.agents).toBeGreaterThanOrEqual(30);
    });

    it('should have at least 100 commands', () => {
      expect(stats.commands).toBeGreaterThanOrEqual(100);
    });

    it('should have at least 100 skills', () => {
      expect(stats.skills).toBeGreaterThanOrEqual(100);
    });

    it('should have at least 40 workflows', () => {
      expect(stats.workflows).toBeGreaterThanOrEqual(40);
    });
  });
});
