/**
 * Dependency Graph Validation Tests
 *
 * Validates the dependency graph system:
 * - Forward references (dependsOn) are valid
 * - Reverse references (usedBy) are properly computed
 * - Graph integrity and statistics
 *
 * Part of the Optimized Alignment Principle (OAP) test suite.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { buildDependencyGraph } from '../../scripts/build-dependency-graph.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Dependency Graph Validation', () => {
  let graph;
  let stats;

  beforeAll(async () => {
    const result = await buildDependencyGraph();
    graph = result.graph;
    stats = result.stats;
  });

  describe('Graph Statistics', () => {
    it('should have agents in the graph', () => {
      expect(stats.agents).toBeGreaterThan(0);
      expect(Object.keys(graph.agents).length).toBe(stats.agents);
    });

    it('should have workflows in the graph', () => {
      expect(stats.workflows).toBeGreaterThan(0);
      expect(Object.keys(graph.workflows).length).toBe(stats.workflows);
    });

    it('should have skills in the graph', () => {
      expect(stats.skills).toBeGreaterThan(0);
      expect(Object.keys(graph.skills).length).toBe(stats.skills);
    });

    it('should have commands in the graph', () => {
      expect(stats.commands).toBeGreaterThan(0);
      expect(Object.keys(graph.commands).length).toBe(stats.commands);
    });

    it('should track skill references', () => {
      expect(stats.totalSkillRefs).toBeGreaterThan(0);
    });

    it('should track command references', () => {
      expect(stats.totalCommandRefs).toBeGreaterThan(0);
    });

    it('should track agent references', () => {
      expect(stats.totalAgentRefs).toBeGreaterThan(0);
    });
  });

  describe('Agent Dependencies', () => {
    it('all agents should have dependsOn structure', () => {
      for (const [name, agent] of Object.entries(graph.agents)) {
        expect(agent.dependsOn).toBeDefined();
        expect(agent.dependsOn.skills).toBeDefined();
        expect(agent.dependsOn.commands).toBeDefined();
        expect(Array.isArray(agent.dependsOn.skills)).toBe(true);
        expect(Array.isArray(agent.dependsOn.commands)).toBe(true);
      }
    });

    it('all agents should have usedBy structure', () => {
      for (const [name, agent] of Object.entries(graph.agents)) {
        expect(agent.usedBy).toBeDefined();
        expect(agent.usedBy.workflows).toBeDefined();
        expect(Array.isArray(agent.usedBy.workflows)).toBe(true);
      }
    });

    it('agent skill references should exist in skills graph', () => {
      for (const [name, agent] of Object.entries(graph.agents)) {
        for (const skillId of agent.dependsOn.skills) {
          expect(
            graph.skills[skillId],
            `Agent "${name}" references non-existent skill "${skillId}"`
          ).toBeDefined();
        }
      }
    });

    it('agent command references should exist in commands graph', () => {
      for (const [name, agent] of Object.entries(graph.agents)) {
        for (const cmdId of agent.dependsOn.commands) {
          expect(
            graph.commands[cmdId],
            `Agent "${name}" references non-existent command "${cmdId}"`
          ).toBeDefined();
        }
      }
    });
  });

  describe('Workflow Dependencies', () => {
    it('all workflows should have dependsOn structure', () => {
      for (const [path, workflow] of Object.entries(graph.workflows)) {
        expect(workflow.dependsOn).toBeDefined();
        expect(workflow.dependsOn.agents).toBeDefined();
        expect(workflow.dependsOn.skills).toBeDefined();
        expect(workflow.dependsOn.commands).toBeDefined();
        expect(Array.isArray(workflow.dependsOn.agents)).toBe(true);
      }
    });

    it('workflow agent references should exist in agents graph', () => {
      for (const [path, workflow] of Object.entries(graph.workflows)) {
        for (const agentName of workflow.dependsOn.agents) {
          expect(
            graph.agents[agentName],
            `Workflow "${path}" references non-existent agent "${agentName}"`
          ).toBeDefined();
        }
      }
    });

    it('workflow skill references should exist in skills graph', () => {
      for (const [path, workflow] of Object.entries(graph.workflows)) {
        for (const skillId of workflow.dependsOn.skills) {
          expect(
            graph.skills[skillId],
            `Workflow "${path}" references non-existent skill "${skillId}"`
          ).toBeDefined();
        }
      }
    });

    it('workflow command references should exist in commands graph', () => {
      for (const [path, workflow] of Object.entries(graph.workflows)) {
        for (const cmdId of workflow.dependsOn.commands) {
          expect(
            graph.commands[cmdId],
            `Workflow "${path}" references non-existent command "${cmdId}"`
          ).toBeDefined();
        }
      }
    });
  });

  describe('Reverse References (usedBy)', () => {
    it('skill usedBy.agents should be consistent with agent dependsOn.skills', () => {
      for (const [skillId, skill] of Object.entries(graph.skills)) {
        for (const agentName of skill.usedBy.agents) {
          const agent = graph.agents[agentName];
          expect(
            agent,
            `Skill "${skillId}" claims to be used by non-existent agent "${agentName}"`
          ).toBeDefined();
          expect(
            agent.dependsOn.skills.includes(skillId),
            `Skill "${skillId}" claims to be used by agent "${agentName}" but agent doesn't reference it`
          ).toBe(true);
        }
      }
    });

    it('command usedBy.agents should be consistent with agent dependsOn.commands', () => {
      for (const [cmdId, command] of Object.entries(graph.commands)) {
        for (const agentName of command.usedBy.agents) {
          const agent = graph.agents[agentName];
          expect(
            agent,
            `Command "${cmdId}" claims to be used by non-existent agent "${agentName}"`
          ).toBeDefined();
          expect(
            agent.dependsOn.commands.includes(cmdId),
            `Command "${cmdId}" claims to be used by agent "${agentName}" but agent doesn't reference it`
          ).toBe(true);
        }
      }
    });

    it('agent usedBy.workflows should be consistent with workflow dependsOn.agents', () => {
      for (const [agentName, agent] of Object.entries(graph.agents)) {
        for (const workflowPath of agent.usedBy.workflows) {
          const workflow = graph.workflows[workflowPath];
          expect(
            workflow,
            `Agent "${agentName}" claims to be used by non-existent workflow "${workflowPath}"`
          ).toBeDefined();
          expect(
            workflow.dependsOn.agents.includes(agentName),
            `Agent "${agentName}" claims to be used by workflow "${workflowPath}" but workflow doesn't reference it`
          ).toBe(true);
        }
      }
    });
  });

  describe('Graph Integrity', () => {
    it('every agent should have file path', () => {
      for (const [name, agent] of Object.entries(graph.agents)) {
        expect(agent.file).toBeDefined();
        expect(agent.file.length).toBeGreaterThan(0);
      }
    });

    it('every workflow should have category', () => {
      for (const [path, workflow] of Object.entries(graph.workflows)) {
        expect(workflow.category).toBeDefined();
        expect(workflow.category.length).toBeGreaterThan(0);
      }
    });

    it('every skill should have category', () => {
      for (const [skillId, skill] of Object.entries(graph.skills)) {
        expect(skill.category).toBeDefined();
        expect(skill.category.length).toBeGreaterThan(0);
      }
    });

    it('every command should have namespace', () => {
      for (const [cmdId, command] of Object.entries(graph.commands)) {
        expect(command.namespace).toBeDefined();
        expect(command.namespace.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Core Component Usage', () => {
    it('most agents should be used by at least one workflow', () => {
      const agentsWithWorkflows = Object.values(graph.agents).filter(
        a => a.usedBy.workflows.length > 0
      );
      const coverage = agentsWithWorkflows.length / Object.keys(graph.agents).length;
      expect(
        coverage,
        `Only ${(coverage * 100).toFixed(1)}% of agents are used by workflows`
      ).toBeGreaterThanOrEqual(0.3); // At least 30% coverage
    });

    it('core methodology skills should be widely used', () => {
      const coreSkills = [
        'methodology/writing-plans',
        'methodology/executing-plans',
        'methodology/problem-solving'
      ];

      for (const skillId of coreSkills) {
        const skill = graph.skills[skillId];
        if (skill) {
          const totalUsage = skill.usedBy.agents.length + skill.usedBy.workflows.length;
          expect(
            totalUsage,
            `Core skill "${skillId}" should be used by at least 1 component`
          ).toBeGreaterThanOrEqual(1);
        }
      }
    });
  });

  describe('No Circular Dependencies', () => {
    // Note: The current hierarchy (MCPs → Commands → Skills → Agents → Workflows)
    // naturally prevents circular dependencies as higher levels only reference lower levels
    it('agents should not reference other agents', () => {
      for (const [name, agent] of Object.entries(graph.agents)) {
        // Agents don't have agents in dependsOn by design
        expect(agent.dependsOn.agents).toBeUndefined();
      }
    });

    it('workflows should be at the top of the hierarchy', () => {
      // Workflows are not referenced by anything else in the dependsOn chain
      for (const [path, workflow] of Object.entries(graph.workflows)) {
        expect(workflow.usedBy).toEqual({});
      }
    });
  });
});
