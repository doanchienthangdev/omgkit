/**
 * Registry Sync Validation Tests
 *
 * Validates that registry.yaml is synchronized with actual component files:
 * - Registry entries match actual component files
 * - Agent dependencies match frontmatter
 * - Workflow dependencies match frontmatter
 * - No orphaned or missing entries
 *
 * Part of the Optimized Alignment Principle (OAP) test suite.
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

describe('Registry Sync Validation', () => {
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

  describe('Registry Structure', () => {
    it('should have version defined', () => {
      expect(registry.version).toBeDefined();
    });

    it('should have alignment_principle section', () => {
      expect(registry.alignment_principle).toBeDefined();
      expect(registry.alignment_principle.version).toBeDefined();
      expect(registry.alignment_principle.enforced).toBe(true);
    });

    it('should have agents section', () => {
      expect(registry.agents).toBeDefined();
      expect(typeof registry.agents).toBe('object');
    });

    it('should have workflows section', () => {
      expect(registry.workflows).toBeDefined();
      expect(typeof registry.workflows).toBe('object');
    });

    it('should have command_namespaces section', () => {
      expect(registry.command_namespaces).toBeDefined();
      expect(Array.isArray(registry.command_namespaces)).toBe(true);
    });

    it('should have skill_categories section', () => {
      expect(registry.skill_categories).toBeDefined();
      expect(Array.isArray(registry.skill_categories)).toBe(true);
    });
  });

  describe('Agent Registry Sync', () => {
    it('all registered agents should exist as files', () => {
      for (const agentName of Object.keys(registry.agents || {})) {
        expect(
          graph.agents[agentName],
          `Agent "${agentName}" is in registry but file not found`
        ).toBeDefined();
      }
    });

    it('registered agent skills should match frontmatter', () => {
      for (const [agentName, agentData] of Object.entries(registry.agents || {})) {
        const actual = graph.agents[agentName];
        if (!actual) continue;

        const registrySkills = agentData.skills || [];
        const actualSkills = actual.dependsOn.skills || [];

        // Check that registry skills are a subset of actual skills
        for (const skill of registrySkills) {
          expect(
            actualSkills.includes(skill),
            `Agent "${agentName}" registry lists skill "${skill}" but it's not in frontmatter`
          ).toBe(true);
        }
      }
    });

    it('registered agent commands should match frontmatter', () => {
      for (const [agentName, agentData] of Object.entries(registry.agents || {})) {
        const actual = graph.agents[agentName];
        if (!actual) continue;

        const registryCommands = agentData.commands || [];
        const actualCommands = actual.dependsOn.commands || [];

        // Check that registry commands are a subset of actual commands
        for (const cmd of registryCommands) {
          expect(
            actualCommands.includes(cmd),
            `Agent "${agentName}" registry lists command "${cmd}" but it's not in frontmatter`
          ).toBe(true);
        }
      }
    });
  });

  describe('Workflow Registry Sync', () => {
    it('all registered workflows should exist as files', () => {
      for (const workflowPath of Object.keys(registry.workflows || {})) {
        expect(
          graph.workflows[workflowPath],
          `Workflow "${workflowPath}" is in registry but file not found`
        ).toBeDefined();
      }
    });

    it('registered workflow agents should match frontmatter', () => {
      for (const [workflowPath, workflowData] of Object.entries(registry.workflows || {})) {
        const actual = graph.workflows[workflowPath];
        if (!actual) continue;

        const registryAgents = workflowData.agents || [];
        const actualAgents = actual.dependsOn.agents || [];

        // Check that registry agents are a subset of actual agents
        for (const agent of registryAgents) {
          expect(
            actualAgents.includes(agent),
            `Workflow "${workflowPath}" registry lists agent "${agent}" but it's not in frontmatter`
          ).toBe(true);
        }
      }
    });
  });

  describe('Command Namespace Sync', () => {
    it('all registered namespaces should exist as directories', () => {
      const commandsDir = join(PLUGIN_DIR, 'commands');

      for (const namespace of registry.command_namespaces || []) {
        const namespacePath = join(commandsDir, namespace);
        expect(
          existsSync(namespacePath),
          `Command namespace "${namespace}" is in registry but directory not found`
        ).toBe(true);
      }
    });

    it('all command directories should be in registry', () => {
      const commandsDir = join(PLUGIN_DIR, 'commands');
      const namespaces = readdirSync(commandsDir).filter(f =>
        statSync(join(commandsDir, f)).isDirectory()
      );

      for (const namespace of namespaces) {
        expect(
          (registry.command_namespaces || []).includes(namespace),
          `Command namespace "${namespace}" exists but not in registry`
        ).toBe(true);
      }
    });
  });

  describe('Skill Category Sync', () => {
    it('all registered categories should exist as directories', () => {
      const skillsDir = join(PLUGIN_DIR, 'skills');

      for (const category of registry.skill_categories || []) {
        const categoryPath = join(skillsDir, category);
        expect(
          existsSync(categoryPath),
          `Skill category "${category}" is in registry but directory not found`
        ).toBe(true);
      }
    });

    it('all skill directories should be in registry', () => {
      const skillsDir = join(PLUGIN_DIR, 'skills');
      const categories = readdirSync(skillsDir).filter(f =>
        statSync(join(skillsDir, f)).isDirectory()
      );

      for (const category of categories) {
        expect(
          (registry.skill_categories || []).includes(category),
          `Skill category "${category}" exists but not in registry`
        ).toBe(true);
      }
    });
  });

  describe('Cross-Reference Integrity', () => {
    it('all agent skill refs should exist in skills', () => {
      for (const [agentName, agent] of Object.entries(graph.agents)) {
        for (const skillId of agent.dependsOn.skills) {
          expect(
            graph.skills[skillId],
            `Agent "${agentName}" references non-existent skill "${skillId}"`
          ).toBeDefined();
        }
      }
    });

    it('all agent command refs should exist in commands', () => {
      for (const [agentName, agent] of Object.entries(graph.agents)) {
        for (const cmdId of agent.dependsOn.commands) {
          expect(
            graph.commands[cmdId],
            `Agent "${agentName}" references non-existent command "${cmdId}"`
          ).toBeDefined();
        }
      }
    });

    it('all workflow agent refs should exist in agents', () => {
      for (const [workflowPath, workflow] of Object.entries(graph.workflows)) {
        for (const agentName of workflow.dependsOn.agents) {
          expect(
            graph.agents[agentName],
            `Workflow "${workflowPath}" references non-existent agent "${agentName}"`
          ).toBeDefined();
        }
      }
    });

    it('all workflow skill refs should exist in skills', () => {
      for (const [workflowPath, workflow] of Object.entries(graph.workflows)) {
        for (const skillId of workflow.dependsOn.skills) {
          expect(
            graph.skills[skillId],
            `Workflow "${workflowPath}" references non-existent skill "${skillId}"`
          ).toBeDefined();
        }
      }
    });

    it('all workflow command refs should exist in commands', () => {
      for (const [workflowPath, workflow] of Object.entries(graph.workflows)) {
        for (const cmdId of workflow.dependsOn.commands) {
          expect(
            graph.commands[cmdId],
            `Workflow "${workflowPath}" references non-existent command "${cmdId}"`
          ).toBeDefined();
        }
      }
    });
  });

  describe('Component Count Validation', () => {
    it('registered agent count should match actual count', () => {
      const registeredCount = Object.keys(registry.agents || {}).length;
      const actualCount = stats.agents;
      expect(
        registeredCount,
        `Registry has ${registeredCount} agents, actual has ${actualCount}`
      ).toBe(actualCount);
    });

    it('should have significant workflow coverage in registry', () => {
      const registeredCount = Object.keys(registry.workflows || {}).length;
      const actualCount = stats.workflows;
      const coverage = registeredCount / actualCount;
      expect(
        coverage,
        `Only ${(coverage * 100).toFixed(1)}% of workflows are in registry (${registeredCount}/${actualCount})`
      ).toBeGreaterThanOrEqual(0.4); // At least 40% coverage
    });
  });

  describe('Alignment Principle Enforcement', () => {
    it('alignment principle should be enforced', () => {
      expect(registry.alignment_principle.enforced).toBe(true);
    });

    it('alignment hierarchy should be defined', () => {
      expect(registry.alignment_principle.hierarchy).toBeDefined();
      expect(Array.isArray(registry.alignment_principle.hierarchy)).toBe(true);
      expect(registry.alignment_principle.hierarchy.length).toBe(5); // 5 levels
    });

    it('hierarchy levels should be correct', () => {
      const hierarchy = registry.alignment_principle.hierarchy;

      // Level 0: MCPs
      expect(hierarchy[0].level).toBe(0);
      expect(hierarchy[0].type).toBe('mcp');

      // Level 1: Commands
      expect(hierarchy[1].level).toBe(1);
      expect(hierarchy[1].type).toBe('command');

      // Level 2: Skills
      expect(hierarchy[2].level).toBe(2);
      expect(hierarchy[2].type).toBe('skill');

      // Level 3: Agents
      expect(hierarchy[3].level).toBe(3);
      expect(hierarchy[3].type).toBe('agent');

      // Level 4: Workflows
      expect(hierarchy[4].level).toBe(4);
      expect(hierarchy[4].type).toBe('workflow');
    });
  });
});
