#!/usr/bin/env node

/**
 * OMGKIT Dependency Graph Builder
 *
 * Builds a complete bi-directional dependency graph from component files.
 * Used for:
 * - Registry sync validation
 * - Alignment health checks
 * - Documentation generation with dependency trees
 *
 * Graph Structure:
 * - dependsOn: What this component uses (forward refs)
 * - usedBy: What uses this component (reverse refs)
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PLUGIN_DIR = join(ROOT, 'plugin');

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of yaml.split('\n')) {
    // Check for array item
    if (line.match(/^\s+-\s+/)) {
      if (currentKey && currentArray !== null) {
        const value = line.replace(/^\s+-\s+/, '').trim();
        currentArray.push(value);
      }
      continue;
    }

    // Check for key: value
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (value === '' || value === '[]') {
        // Start of array or empty array
        currentKey = key;
        currentArray = [];
        result[key] = currentArray;
      } else {
        // Simple value
        result[key] = value;
        currentKey = null;
        currentArray = null;
      }
    }
  }

  return result;
}

/**
 * Get all files in a directory recursively
 */
async function getFiles(dir, extension = '.md') {
  const files = [];
  if (!existsSync(dir)) return files;

  const items = await readdir(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stats = await stat(fullPath);
    if (stats.isDirectory()) {
      files.push(...await getFiles(fullPath, extension));
    } else if (item.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Extract agent dependencies from files
 */
async function extractAgentDependencies() {
  const agentsDir = join(PLUGIN_DIR, 'agents');
  const agents = {};

  const files = await getFiles(agentsDir, '.md');

  for (const file of files) {
    const content = await readFile(file, 'utf-8');
    const fm = parseFrontmatter(content);
    const name = basename(file, '.md');

    agents[name] = {
      file: file.replace(PLUGIN_DIR + '/', ''),
      name: fm.name || name,
      description: fm.description || '',
      dependsOn: {
        skills: Array.isArray(fm.skills) ? fm.skills : [],
        commands: Array.isArray(fm.commands) ? fm.commands : [],
        mcps: Array.isArray(fm.mcps) ? fm.mcps : []
      },
      usedBy: {
        workflows: []
      }
    };
  }

  return agents;
}

/**
 * Extract workflow dependencies from files
 */
async function extractWorkflowDependencies() {
  const workflowsDir = join(PLUGIN_DIR, 'workflows');
  const workflows = {};

  const categories = await readdir(workflowsDir).catch(() => []);

  for (const category of categories) {
    const categoryPath = join(workflowsDir, category);
    const stats = await stat(categoryPath).catch(() => null);
    if (!stats?.isDirectory()) continue;

    const files = await getFiles(categoryPath, '.md');

    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const fm = parseFrontmatter(content);
      const name = basename(file, '.md');
      const fullName = `${category}/${name}`;

      workflows[fullName] = {
        file: file.replace(PLUGIN_DIR + '/', ''),
        name: fm.name || name,
        category,
        description: fm.description || '',
        dependsOn: {
          agents: Array.isArray(fm.agents) ? fm.agents : [],
          skills: Array.isArray(fm.skills) ? fm.skills : [],
          commands: Array.isArray(fm.commands) ? fm.commands : [],
          mcps: Array.isArray(fm.mcps) ? fm.mcps : []
        },
        usedBy: {}
      };
    }
  }

  return workflows;
}

/**
 * Extract skill metadata from files
 */
async function extractSkillDependencies() {
  const skillsDir = join(PLUGIN_DIR, 'skills');
  const skills = {};

  const categories = await readdir(skillsDir).catch(() => []);

  for (const category of categories) {
    const categoryPath = join(skillsDir, category);
    const stats = await stat(categoryPath).catch(() => null);
    if (!stats?.isDirectory()) continue;

    const skillDirs = await readdir(categoryPath).catch(() => []);

    for (const skillDir of skillDirs) {
      const skillPath = join(categoryPath, skillDir);
      const skillStats = await stat(skillPath).catch(() => null);
      if (!skillStats?.isDirectory()) continue;

      const skillFile = join(skillPath, 'SKILL.md');
      if (!existsSync(skillFile)) continue;

      const content = await readFile(skillFile, 'utf-8');
      const fm = parseFrontmatter(content);
      const fullName = `${category}/${skillDir}`;

      skills[fullName] = {
        file: `skills/${category}/${skillDir}/SKILL.md`,
        name: fm.name || skillDir,
        category,
        description: fm.description || '',
        dependsOn: {
          commands: Array.isArray(fm.commands) ? fm.commands : [],
          mcps: Array.isArray(fm.mcps) ? fm.mcps : []
        },
        usedBy: {
          agents: [],
          workflows: []
        }
      };
    }
  }

  return skills;
}

/**
 * Extract command metadata from files
 */
async function extractCommandDependencies() {
  const commandsDir = join(PLUGIN_DIR, 'commands');
  const commands = {};

  const namespaces = await readdir(commandsDir).catch(() => []);

  for (const namespace of namespaces) {
    const namespacePath = join(commandsDir, namespace);
    const stats = await stat(namespacePath).catch(() => null);
    if (!stats?.isDirectory()) continue;

    const files = await readdir(namespacePath).catch(() => []);

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const content = await readFile(join(namespacePath, file), 'utf-8');
      const fm = parseFrontmatter(content);
      const name = basename(file, '.md');
      const fullName = `/${namespace}:${name}`;

      commands[fullName] = {
        file: `commands/${namespace}/${file}`,
        name: fullName,
        namespace,
        description: fm.description || '',
        dependsOn: {
          mcps: Array.isArray(fm.mcps) ? fm.mcps : []
        },
        usedBy: {
          agents: [],
          skills: [],
          workflows: []
        }
      };
    }
  }

  return commands;
}

/**
 * Build reverse references (usedBy)
 */
function buildReverseReferences(graph) {
  const { agents, workflows, skills, commands } = graph;

  // Agents → Skills, Commands
  for (const [agentName, agent] of Object.entries(agents)) {
    for (const skillId of agent.dependsOn.skills) {
      if (skills[skillId]) {
        skills[skillId].usedBy.agents.push(agentName);
      }
    }
    for (const cmdId of agent.dependsOn.commands) {
      if (commands[cmdId]) {
        commands[cmdId].usedBy.agents.push(agentName);
      }
    }
  }

  // Workflows → Agents, Skills, Commands
  for (const [workflowName, workflow] of Object.entries(workflows)) {
    for (const agentName of workflow.dependsOn.agents) {
      if (agents[agentName]) {
        agents[agentName].usedBy.workflows.push(workflowName);
      }
    }
    for (const skillId of workflow.dependsOn.skills) {
      if (skills[skillId]) {
        skills[skillId].usedBy.workflows.push(workflowName);
      }
    }
    for (const cmdId of workflow.dependsOn.commands) {
      if (commands[cmdId]) {
        commands[cmdId].usedBy.workflows.push(workflowName);
      }
    }
  }

  // Skills → Commands
  for (const [skillName, skill] of Object.entries(skills)) {
    for (const cmdId of skill.dependsOn.commands) {
      if (commands[cmdId]) {
        commands[cmdId].usedBy.skills.push(skillName);
      }
    }
  }

  return graph;
}

/**
 * Count mode files
 */
async function countModes() {
  const modesDir = join(PLUGIN_DIR, 'modes');
  if (!existsSync(modesDir)) return 0;
  const files = await readdir(modesDir);
  return files.filter(f => f.endsWith('.md')).length;
}

/**
 * Build complete dependency graph
 */
export async function buildDependencyGraph() {
  const [agents, workflows, skills, commands, modes] = await Promise.all([
    extractAgentDependencies(),
    extractWorkflowDependencies(),
    extractSkillDependencies(),
    extractCommandDependencies(),
    countModes()
  ]);

  const graph = { agents, workflows, skills, commands };

  // Build reverse references
  buildReverseReferences(graph);

  // Compute statistics
  const stats = {
    agents: Object.keys(agents).length,
    workflows: Object.keys(workflows).length,
    skills: Object.keys(skills).length,
    commands: Object.keys(commands).length,
    modes: modes,
    totalSkillRefs: Object.values(agents).reduce((sum, a) => sum + a.dependsOn.skills.length, 0) +
                    Object.values(workflows).reduce((sum, w) => sum + w.dependsOn.skills.length, 0),
    totalCommandRefs: Object.values(agents).reduce((sum, a) => sum + a.dependsOn.commands.length, 0) +
                      Object.values(workflows).reduce((sum, w) => sum + w.dependsOn.commands.length, 0),
    totalAgentRefs: Object.values(workflows).reduce((sum, w) => sum + w.dependsOn.agents.length, 0)
  };

  return { graph, stats };
}

/**
 * Format dependency tree for an agent
 */
export function formatAgentDependencyTree(graph, agentName) {
  const agent = graph.agents[agentName];
  if (!agent) return null;

  const lines = [
    `🔮 Dependency Graph: ${agentName}`,
    '═'.repeat(50),
    '',
    `📋 Agent: ${agentName}`,
    `   └── ${agent.description}`,
    ''
  ];

  // Skills
  if (agent.dependsOn.skills.length > 0) {
    lines.push(`🧠 Skills Used (${agent.dependsOn.skills.length}):`);
    agent.dependsOn.skills.forEach((skill, i) => {
      const isLast = i === agent.dependsOn.skills.length - 1;
      const prefix = isLast ? '└──' : '├──';
      const skillData = graph.skills[skill];
      lines.push(`   ${prefix} ${skill}`);
      if (skillData) {
        lines.push(`   ${isLast ? ' ' : '│'}   └── ${skillData.description.slice(0, 50)}...`);
      }
    });
    lines.push('');
  }

  // Commands
  if (agent.dependsOn.commands.length > 0) {
    lines.push(`⚡ Commands Triggered (${agent.dependsOn.commands.length}):`);
    agent.dependsOn.commands.forEach((cmd, i) => {
      const isLast = i === agent.dependsOn.commands.length - 1;
      const prefix = isLast ? '└──' : '├──';
      lines.push(`   ${prefix} ${cmd}`);
    });
    lines.push('');
  }

  // Used By
  if (agent.usedBy.workflows.length > 0) {
    lines.push(`📊 Used By Workflows (${agent.usedBy.workflows.length}):`);
    agent.usedBy.workflows.forEach((wf, i) => {
      const isLast = i === agent.usedBy.workflows.length - 1;
      const prefix = isLast ? '└──' : '├──';
      lines.push(`   ${prefix} ${wf}`);
    });
  }

  return lines.join('\n');
}

/**
 * Format dependency tree for a workflow
 */
export function formatWorkflowDependencyTree(graph, workflowName) {
  const workflow = graph.workflows[workflowName];
  if (!workflow) return null;

  const lines = [
    `🔮 Dependency Graph: ${workflowName}`,
    '═'.repeat(50),
    '',
    `📋 Workflow: ${workflowName}`,
    `   └── ${workflow.description}`,
    ''
  ];

  // Agents
  if (workflow.dependsOn.agents.length > 0) {
    lines.push(`🤖 Agents Orchestrated (${workflow.dependsOn.agents.length}):`);
    workflow.dependsOn.agents.forEach((agentName, i) => {
      const isLast = i === workflow.dependsOn.agents.length - 1;
      const prefix = isLast ? '└──' : '├──';
      const agent = graph.agents[agentName];
      lines.push(`   ${prefix} ${agentName}`);
      if (agent) {
        const subPrefix = isLast ? ' ' : '│';
        if (agent.dependsOn.skills.length > 0) {
          lines.push(`   ${subPrefix}   ├── Skills: ${agent.dependsOn.skills.slice(0, 2).join(', ')}${agent.dependsOn.skills.length > 2 ? '...' : ''}`);
        }
        if (agent.dependsOn.commands.length > 0) {
          lines.push(`   ${subPrefix}   └── Commands: ${agent.dependsOn.commands.slice(0, 2).join(', ')}${agent.dependsOn.commands.length > 2 ? '...' : ''}`);
        }
      }
    });
    lines.push('');
  }

  // Skills
  if (workflow.dependsOn.skills.length > 0) {
    lines.push(`🧠 Skills Applied (${workflow.dependsOn.skills.length}):`);
    workflow.dependsOn.skills.forEach((skill, i) => {
      const isLast = i === workflow.dependsOn.skills.length - 1;
      const prefix = isLast ? '└──' : '├──';
      lines.push(`   ${prefix} ${skill}`);
    });
    lines.push('');
  }

  // Commands
  if (workflow.dependsOn.commands.length > 0) {
    lines.push(`⚡ Commands Available (${workflow.dependsOn.commands.length}):`);
    workflow.dependsOn.commands.forEach((cmd, i) => {
      const isLast = i === workflow.dependsOn.commands.length - 1;
      const prefix = isLast ? '└──' : '├──';
      lines.push(`   ${prefix} ${cmd}`);
    });
  }

  return lines.join('\n');
}

/**
 * Format dependency tree for a skill (reverse lookup)
 */
export function formatSkillDependencyTree(graph, skillName) {
  const skill = graph.skills[skillName];
  if (!skill) return null;

  const lines = [
    `🔮 Usage Graph: ${skillName}`,
    '═'.repeat(50),
    '',
    `🧠 Skill: ${skillName}`,
    `   └── ${skill.description}`,
    ''
  ];

  // Used By Agents
  if (skill.usedBy.agents.length > 0) {
    lines.push(`🤖 Used By Agents (${skill.usedBy.agents.length}):`);
    skill.usedBy.agents.forEach((agent, i) => {
      const isLast = i === skill.usedBy.agents.length - 1;
      const prefix = isLast ? '└──' : '├──';
      const agentData = graph.agents[agent];
      lines.push(`   ${prefix} ${agent}`);
      if (agentData) {
        lines.push(`   ${isLast ? ' ' : '│'}   └── ${agentData.description.slice(0, 50)}...`);
      }
    });
    lines.push('');
  }

  // Used By Workflows
  if (skill.usedBy.workflows.length > 0) {
    lines.push(`📊 Used By Workflows (${skill.usedBy.workflows.length}):`);
    skill.usedBy.workflows.forEach((wf, i) => {
      const isLast = i === skill.usedBy.workflows.length - 1;
      const prefix = isLast ? '└──' : '├──';
      lines.push(`   ${prefix} ${wf}`);
    });
  }

  return lines.join('\n');
}

/**
 * Format dependency tree for a command (reverse lookup)
 */
export function formatCommandDependencyTree(graph, commandName) {
  const command = graph.commands[commandName];
  if (!command) return null;

  const lines = [
    `🔮 Usage Graph: ${commandName}`,
    '═'.repeat(50),
    '',
    `⚡ Command: ${commandName}`,
    `   └── ${command.description}`,
    ''
  ];

  // Used By Agents
  if (command.usedBy.agents.length > 0) {
    lines.push(`🤖 Triggered By Agents (${command.usedBy.agents.length}):`);
    command.usedBy.agents.forEach((agent, i) => {
      const isLast = i === command.usedBy.agents.length - 1;
      const prefix = isLast ? '└──' : '├──';
      lines.push(`   ${prefix} ${agent}`);
    });
    lines.push('');
  }

  // Used By Workflows
  if (command.usedBy.workflows.length > 0) {
    lines.push(`📊 Available In Workflows (${command.usedBy.workflows.length}):`);
    command.usedBy.workflows.forEach((wf, i) => {
      const isLast = i === command.usedBy.workflows.length - 1;
      const prefix = isLast ? '└──' : '├──';
      lines.push(`   ${prefix} ${wf}`);
    });
  }

  return lines.join('\n');
}

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { graph, stats } = await buildDependencyGraph();
  console.log('OMGKIT Dependency Graph Statistics');
  console.log('===================================');
  console.log(`Agents:     ${stats.agents}`);
  console.log(`Workflows:  ${stats.workflows}`);
  console.log(`Skills:     ${stats.skills}`);
  console.log(`Commands:   ${stats.commands}`);
  console.log(`Skill Refs: ${stats.totalSkillRefs}`);
  console.log(`Cmd Refs:   ${stats.totalCommandRefs}`);
  console.log(`Agent Refs: ${stats.totalAgentRefs}`);
}
