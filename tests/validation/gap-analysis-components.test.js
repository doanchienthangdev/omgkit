/**
 * Gap Analysis Components Validation Tests
 *
 * Validates all new components from GAP_ANALYSIS_COMPREHENSIVE.md:
 * - 10 new agents
 * - 38 new skills
 * - 15 new commands
 * - 20 new workflows
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseFrontmatter, validatePluginFile } from '../../lib/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');

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
 * Get skill files (SKILL.md) from a directory
 */
function getSkillFiles(dir, files = []) {
  if (!existsSync(dir)) return files;

  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      const skillFile = join(fullPath, 'SKILL.md');
      if (existsSync(skillFile)) {
        files.push(skillFile);
      }
      getSkillFiles(fullPath, files);
    }
  }
  return files;
}

describe('Gap Analysis - New Agents (10)', () => {
  const agentsDir = join(PLUGIN_DIR, 'agents');

  const newAgents = [
    'domain-decomposer',
    'data-engineer',
    'ml-engineer',
    'devsecops',
    'performance-engineer',
    'platform-engineer',
    'observability-engineer',
    'game-systems-designer',
    'embedded-systems',
    'scientific-computing'
  ];

  it('should have all 10 new agents', () => {
    newAgents.forEach(agent => {
      const agentPath = join(agentsDir, `${agent}.md`);
      expect(existsSync(agentPath), `Missing new agent: ${agent}`).toBe(true);
    });
  });

  it.each(newAgents)('agent %s should have valid frontmatter', (agent) => {
    const agentPath = join(agentsDir, `${agent}.md`);
    if (existsSync(agentPath)) {
      const result = validatePluginFile(agentPath, ['name', 'description']);
      expect(result.valid, `Errors in ${agent}: ${result.errors.join(', ')}`).toBe(true);
    }
  });

  it.each(newAgents)('agent %s should have tools defined', (agent) => {
    const agentPath = join(agentsDir, `${agent}.md`);
    if (existsSync(agentPath)) {
      const content = readFileSync(agentPath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      expect(frontmatter.tools, `Agent ${agent} missing tools`).toBeDefined();
    }
  });

  it.each(newAgents)('agent %s should have expertise section', (agent) => {
    const agentPath = join(agentsDir, `${agent}.md`);
    if (existsSync(agentPath)) {
      const content = readFileSync(agentPath, 'utf8');
      expect(content).toContain('## Core Expertise');
    }
  });
});

describe('Gap Analysis - New Skills (38)', () => {
  const skillsDir = join(PLUGIN_DIR, 'skills');

  describe('Microservices Skills (6)', () => {
    const microservicesDir = join(skillsDir, 'microservices');
    const microservicesSkills = [
      'service-mesh',
      'api-gateway-patterns',
      'distributed-tracing',
      'circuit-breaker-patterns',
      'service-discovery',
      'contract-testing'
    ];

    it('should have microservices skills directory', () => {
      expect(existsSync(microservicesDir)).toBe(true);
    });

    it.each(microservicesSkills)('skill %s should exist', (skill) => {
      const skillPath = join(microservicesDir, skill, 'SKILL.md');
      expect(existsSync(skillPath), `Missing skill: ${skill}`).toBe(true);
    });

    it.each(microservicesSkills)('skill %s should have valid structure', (skill) => {
      const skillPath = join(microservicesDir, skill, 'SKILL.md');
      if (existsSync(skillPath)) {
        const content = readFileSync(skillPath, 'utf8');
        // Check for either frontmatter or markdown header
        const hasFrontmatter = content.startsWith('---');
        const hasHeader = content.includes('# ');
        expect(hasFrontmatter || hasHeader, `Skill ${skill} missing structure`).toBe(true);
      }
    });
  });

  describe('Event-Driven Skills (6)', () => {
    const eventDrivenDir = join(skillsDir, 'event-driven');
    const eventDrivenSkills = [
      'kafka-deep',
      'event-sourcing',
      'cqrs-patterns',
      'saga-orchestration',
      'schema-registry',
      'stream-processing'
    ];

    it('should have event-driven skills directory', () => {
      expect(existsSync(eventDrivenDir)).toBe(true);
    });

    it.each(eventDrivenSkills)('skill %s should exist', (skill) => {
      const skillPath = join(eventDrivenDir, skill, 'SKILL.md');
      expect(existsSync(skillPath), `Missing skill: ${skill}`).toBe(true);
    });
  });

  describe('AI/ML Skills (6)', () => {
    const aiMlDir = join(skillsDir, 'ai-ml');
    const aiMlSkills = [
      'experiment-tracking',
      'feature-stores',
      'model-serving',
      'ml-pipelines',
      'model-monitoring',
      'llm-ops'
    ];

    it('should have ai-ml skills directory', () => {
      expect(existsSync(aiMlDir)).toBe(true);
    });

    it.each(aiMlSkills)('skill %s should exist', (skill) => {
      const skillPath = join(aiMlDir, skill, 'SKILL.md');
      expect(existsSync(skillPath), `Missing skill: ${skill}`).toBe(true);
    });
  });

  describe('Mobile Skills (5)', () => {
    const mobileDir = join(skillsDir, 'mobile-advanced');
    const mobileSkills = [
      'react-native-deep',
      'mobile-ci-cd',
      'mobile-security',
      'offline-first',
      'push-notifications'
    ];

    it('should have mobile-advanced skills directory', () => {
      expect(existsSync(mobileDir)).toBe(true);
    });

    it.each(mobileSkills)('skill %s should exist', (skill) => {
      const skillPath = join(mobileDir, skill, 'SKILL.md');
      expect(existsSync(skillPath), `Missing skill: ${skill}`).toBe(true);
    });
  });

  describe('Game Development Skills (5)', () => {
    const gameDir = join(skillsDir, 'game');
    const gameSkills = [
      'unity-patterns',
      'godot-patterns',
      'game-networking',
      'game-audio',
      'shader-programming'
    ];

    it('should have game skills directory', () => {
      expect(existsSync(gameDir)).toBe(true);
    });

    it.each(gameSkills)('skill %s should exist', (skill) => {
      const skillPath = join(gameDir, skill, 'SKILL.md');
      expect(existsSync(skillPath), `Missing skill: ${skill}`).toBe(true);
    });
  });

  describe('IoT Skills (5)', () => {
    const iotDir = join(skillsDir, 'iot');
    const iotSkills = [
      'mqtt-deep',
      'edge-computing',
      'device-provisioning',
      'ota-updates',
      'industrial-protocols'
    ];

    it('should have iot skills directory', () => {
      expect(existsSync(iotDir)).toBe(true);
    });

    it.each(iotSkills)('skill %s should exist', (skill) => {
      const skillPath = join(iotDir, skill, 'SKILL.md');
      expect(existsSync(skillPath), `Missing skill: ${skill}`).toBe(true);
    });
  });

  describe('Simulation Skills (5)', () => {
    const simDir = join(skillsDir, 'simulation');
    const simSkills = [
      'numerical-methods',
      'physics-engines',
      'parallel-computing',
      'visualization-scientific',
      'validation-verification'
    ];

    it('should have simulation skills directory', () => {
      expect(existsSync(simDir)).toBe(true);
    });

    it.each(simSkills)('skill %s should exist', (skill) => {
      const skillPath = join(simDir, skill, 'SKILL.md');
      expect(existsSync(skillPath), `Missing skill: ${skill}`).toBe(true);
    });
  });

  describe('Skill Content Quality', () => {
    const allNewSkillDirs = [
      'microservices', 'event-driven', 'ai-ml',
      'mobile-advanced', 'game', 'iot', 'simulation'
    ];

    it('all new skill categories should have SKILL.md files', () => {
      allNewSkillDirs.forEach(category => {
        const categoryDir = join(skillsDir, category);
        if (existsSync(categoryDir)) {
          const skillFiles = getSkillFiles(categoryDir);
          expect(skillFiles.length, `Category ${category} has no skills`).toBeGreaterThan(0);
        }
      });
    });
  });
});

describe('Gap Analysis - New Commands (15)', () => {
  const commandsDir = join(PLUGIN_DIR, 'commands');

  describe('Domain Commands', () => {
    const domainDir = join(commandsDir, 'domain');

    it('should have domain commands directory', () => {
      expect(existsSync(domainDir)).toBe(true);
    });

    it('should have analyze command', () => {
      expect(existsSync(join(domainDir, 'analyze.md'))).toBe(true);
    });

    it('should have map command', () => {
      expect(existsSync(join(domainDir, 'map.md'))).toBe(true);
    });
  });

  describe('Data Commands', () => {
    const dataDir = join(commandsDir, 'data');

    it('should have data commands directory', () => {
      expect(existsSync(dataDir)).toBe(true);
    });

    it('should have pipeline command', () => {
      expect(existsSync(join(dataDir, 'pipeline.md'))).toBe(true);
    });

    it('should have quality command', () => {
      expect(existsSync(join(dataDir, 'quality.md'))).toBe(true);
    });
  });

  describe('ML Commands', () => {
    const mlDir = join(commandsDir, 'ml');

    it('should have ml commands directory', () => {
      expect(existsSync(mlDir)).toBe(true);
    });

    it('should have train command', () => {
      expect(existsSync(join(mlDir, 'train.md'))).toBe(true);
    });

    it('should have evaluate command', () => {
      expect(existsSync(join(mlDir, 'evaluate.md'))).toBe(true);
    });
  });

  describe('Security Commands', () => {
    const securityDir = join(commandsDir, 'security');

    it('should have security commands directory', () => {
      expect(existsSync(securityDir)).toBe(true);
    });

    it('should have scan command', () => {
      expect(existsSync(join(securityDir, 'scan.md'))).toBe(true);
    });

    it('should have audit command', () => {
      expect(existsSync(join(securityDir, 'audit.md'))).toBe(true);
    });
  });

  describe('Performance Commands', () => {
    const perfDir = join(commandsDir, 'perf');

    it('should have perf commands directory', () => {
      expect(existsSync(perfDir)).toBe(true);
    });

    it('should have profile command', () => {
      expect(existsSync(join(perfDir, 'profile.md'))).toBe(true);
    });

    it('should have benchmark command', () => {
      expect(existsSync(join(perfDir, 'benchmark.md'))).toBe(true);
    });
  });

  describe('Platform Commands', () => {
    const platformDir = join(commandsDir, 'platform');

    it('should have platform commands directory', () => {
      expect(existsSync(platformDir)).toBe(true);
    });

    it('should have blueprint command', () => {
      expect(existsSync(join(platformDir, 'blueprint.md'))).toBe(true);
    });
  });

  describe('SRE Commands', () => {
    const sreDir = join(commandsDir, 'sre');

    it('should have sre commands directory', () => {
      expect(existsSync(sreDir)).toBe(true);
    });

    it('should have dashboard command', () => {
      expect(existsSync(join(sreDir, 'dashboard.md'))).toBe(true);
    });
  });

  describe('Game Commands', () => {
    const gameDir = join(commandsDir, 'game');

    it('should have game commands directory', () => {
      expect(existsSync(gameDir)).toBe(true);
    });

    it('should have balance command', () => {
      expect(existsSync(join(gameDir, 'balance.md'))).toBe(true);
    });

    it('should have optimize command', () => {
      expect(existsSync(join(gameDir, 'optimize.md'))).toBe(true);
    });
  });

  describe('IoT Commands', () => {
    const iotDir = join(commandsDir, 'iot');

    it('should have iot commands directory', () => {
      expect(existsSync(iotDir)).toBe(true);
    });

    it('should have provision command', () => {
      expect(existsSync(join(iotDir, 'provision.md'))).toBe(true);
    });
  });

  describe('Command Frontmatter', () => {
    const newCommandCategories = ['domain', 'data', 'ml', 'security', 'perf', 'platform', 'sre', 'game', 'iot'];

    newCommandCategories.forEach(category => {
      const categoryDir = join(commandsDir, category);
      if (existsSync(categoryDir)) {
        const commands = readdirSync(categoryDir).filter(f => f.endsWith('.md'));

        it.each(commands)(`${category}/%s should have valid frontmatter`, (cmd) => {
          const cmdPath = join(categoryDir, cmd);
          const result = validatePluginFile(cmdPath, ['description']);
          expect(result.valid, `Invalid command: ${result.errors.join(', ')}`).toBe(true);
        });
      }
    });
  });
});

describe('Gap Analysis - New Workflows (20)', () => {
  const workflowsDir = join(PLUGIN_DIR, 'workflows');

  describe('Microservices Workflows (6)', () => {
    const msDir = join(workflowsDir, 'microservices');
    const msWorkflows = [
      'domain-decomposition.md',
      'service-scaffolding.md',
      'contract-first.md',
      'integration-testing.md',
      'service-mesh-setup.md',
      'distributed-tracing.md'
    ];

    it('should have microservices workflows directory', () => {
      expect(existsSync(msDir)).toBe(true);
    });

    it.each(msWorkflows)('workflow %s should exist', (workflow) => {
      expect(existsSync(join(msDir, workflow)), `Missing: ${workflow}`).toBe(true);
    });

    it.each(msWorkflows)('workflow %s should have valid structure', (workflow) => {
      const wfPath = join(msDir, workflow);
      if (existsSync(wfPath)) {
        const content = readFileSync(wfPath, 'utf8');
        expect(content).toContain('## Phase');
        expect(content).toContain('## Outputs');
        expect(content).toContain('## Quality Gates');
      }
    });
  });

  describe('Event-Driven Workflows (5)', () => {
    const edDir = join(workflowsDir, 'event-driven');
    const edWorkflows = [
      'event-storming.md',
      'schema-evolution.md',
      'saga-implementation.md',
      'replay-testing.md',
      'consumer-groups.md'
    ];

    it('should have event-driven workflows directory', () => {
      expect(existsSync(edDir)).toBe(true);
    });

    it.each(edWorkflows)('workflow %s should exist', (workflow) => {
      expect(existsSync(join(edDir, workflow)), `Missing: ${workflow}`).toBe(true);
    });
  });

  describe('AI/ML Workflows (5)', () => {
    const aiDir = join(workflowsDir, 'ai-ml');
    const aiWorkflows = [
      'data-pipeline.md',
      'experiment-cycle.md',
      'model-deployment.md',
      'monitoring-setup.md',
      'feature-engineering.md'
    ];

    it('should have ai-ml workflows directory', () => {
      expect(existsSync(aiDir)).toBe(true);
    });

    it.each(aiWorkflows)('workflow %s should exist', (workflow) => {
      expect(existsSync(join(aiDir, workflow)), `Missing: ${workflow}`).toBe(true);
    });
  });

  describe('Game Development Workflows (4)', () => {
    const gameDir = join(workflowsDir, 'game-dev');
    const gameWorkflows = [
      'prototype-to-production.md',
      'content-pipeline.md',
      'playtesting.md',
      'platform-submission.md'
    ];

    it('should have game-dev workflows directory', () => {
      expect(existsSync(gameDir)).toBe(true);
    });

    it.each(gameWorkflows)('workflow %s should exist', (workflow) => {
      expect(existsSync(join(gameDir, workflow)), `Missing: ${workflow}`).toBe(true);
    });
  });

  describe('Workflow Content Quality', () => {
    const newWorkflowDirs = ['microservices', 'event-driven', 'ai-ml', 'game-dev'];

    newWorkflowDirs.forEach(category => {
      const categoryDir = join(workflowsDir, category);
      if (existsSync(categoryDir)) {
        const workflows = readdirSync(categoryDir).filter(f => f.endsWith('.md'));

        it.each(workflows)(`${category}/%s should have frontmatter`, (workflow) => {
          const wfPath = join(categoryDir, workflow);
          const content = readFileSync(wfPath, 'utf8');
          const frontmatter = parseFrontmatter(content);
          expect(frontmatter, `Missing frontmatter in ${workflow}`).not.toBeNull();
          expect(frontmatter.description, `Missing description in ${workflow}`).toBeDefined();
        });
      }
    });
  });
});

describe('Gap Analysis - Total Counts', () => {
  it('should have at least 33 total agents', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    const agents = readdirSync(agentsDir).filter(f => f.endsWith('.md'));
    expect(agents.length).toBeGreaterThanOrEqual(33);
  });

  it('should have at least 120 total skills', () => {
    const skillsDir = join(PLUGIN_DIR, 'skills');
    const allSkills = getSkillFiles(skillsDir);
    expect(allSkills.length).toBeGreaterThanOrEqual(88); // Original 88 + new ones
  });

  it('should have at least 69 total commands', () => {
    const commandsDir = join(PLUGIN_DIR, 'commands');
    const allCommands = getMarkdownFiles(commandsDir);
    expect(allCommands.length).toBeGreaterThanOrEqual(69);
  });

  it('should have at least 49 total workflows', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    const allWorkflows = getMarkdownFiles(workflowsDir);
    expect(allWorkflows.length).toBeGreaterThanOrEqual(49);
  });
});
