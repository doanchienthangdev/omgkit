#!/usr/bin/env node

/**
 * OMGKIT Documentation Generator v2.0
 * Generates comprehensive Mintlify documentation from plugin files
 * Enhanced with detailed structures, cross-references, and professional formatting
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildDependencyGraph } from './build-dependency-graph.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Global dependency graph (built once, used by all generators)
let dependencyGraph = null;
let graphStats = null;
const ROOT = join(__dirname, '..');

/**
 * Initialize dependency graph (called once at start)
 */
async function initDependencyGraph() {
  if (!dependencyGraph) {
    const result = await buildDependencyGraph();
    dependencyGraph = result.graph;
    graphStats = result.stats;
  }
  return { graph: dependencyGraph, stats: graphStats };
}

/**
 * Generate dependency graph section for an agent
 */
function generateAgentDependencySection(agentName) {
  if (!dependencyGraph || !dependencyGraph.agents[agentName]) return '';

  const agent = dependencyGraph.agents[agentName];
  const sections = [];

  sections.push('## Dependency Graph');
  sections.push('');

  // Skills Used
  if (agent.dependsOn.skills.length > 0) {
    sections.push('### Skills Used');
    sections.push('');
    sections.push('| Skill | Description |');
    sections.push('|-------|-------------|');
    for (const skillId of agent.dependsOn.skills) {
      const skill = dependencyGraph.skills[skillId];
      const desc = skill ? skill.description.slice(0, 60) + (skill.description.length > 60 ? '...' : '') : '';
      const skillSlug = skillId.split('/')[1] || skillId;
      sections.push(`| [${skillId}](/skills/${skillSlug}) | ${desc} |`);
    }
    sections.push('');
  }

  // Commands Triggered
  if (agent.dependsOn.commands.length > 0) {
    sections.push('### Commands Triggered');
    sections.push('');
    sections.push('| Command | Description |');
    sections.push('|---------|-------------|');
    for (const cmdId of agent.dependsOn.commands) {
      const cmd = dependencyGraph.commands[cmdId];
      const desc = cmd ? cmd.description.slice(0, 60) + (cmd.description.length > 60 ? '...' : '') : '';
      const cmdSlug = cmdId.replace('/', '').replace(':', '-');
      sections.push(`| [\`${cmdId}\`](/commands/${cmdSlug}) | ${desc} |`);
    }
    sections.push('');
  }

  // Used By Workflows
  if (agent.usedBy.workflows.length > 0) {
    sections.push('### Used By Workflows');
    sections.push('');
    sections.push('| Workflow | Description |');
    sections.push('|----------|-------------|');
    for (const wfId of agent.usedBy.workflows) {
      const wf = dependencyGraph.workflows[wfId];
      const desc = wf ? wf.description.slice(0, 60) + (wf.description.length > 60 ? '...' : '') : '';
      const wfSlug = wfId.split('/')[1] || wfId;
      sections.push(`| [${wfId}](/workflows/${wfSlug}) | ${desc} |`);
    }
    sections.push('');
  }

  return sections.length > 2 ? sections.join('\n') : '';
}

/**
 * Generate usage graph section for a skill
 */
function generateSkillUsageSection(skillId) {
  if (!dependencyGraph || !dependencyGraph.skills[skillId]) return '';

  const skill = dependencyGraph.skills[skillId];
  const sections = [];

  sections.push('## Usage Graph');
  sections.push('');

  // Used By Agents
  if (skill.usedBy.agents.length > 0) {
    sections.push('### Used By Agents');
    sections.push('');
    sections.push('| Agent | Description |');
    sections.push('|-------|-------------|');
    for (const agentName of skill.usedBy.agents) {
      const agent = dependencyGraph.agents[agentName];
      const desc = agent ? agent.description.slice(0, 60) + (agent.description.length > 60 ? '...' : '') : '';
      sections.push(`| [${agentName}](/agents/${agentName}) | ${desc} |`);
    }
    sections.push('');
  }

  // Used By Workflows
  if (skill.usedBy.workflows.length > 0) {
    sections.push('### Used By Workflows');
    sections.push('');
    sections.push('| Workflow | Description |');
    sections.push('|----------|-------------|');
    for (const wfId of skill.usedBy.workflows) {
      const wf = dependencyGraph.workflows[wfId];
      const desc = wf ? wf.description.slice(0, 60) + (wf.description.length > 60 ? '...' : '') : '';
      const wfSlug = wfId.split('/')[1] || wfId;
      sections.push(`| [${wfId}](/workflows/${wfSlug}) | ${desc} |`);
    }
    sections.push('');
  }

  return sections.length > 2 ? sections.join('\n') : '';
}

/**
 * Generate usage graph section for a command
 */
function generateCommandUsageSection(commandId) {
  if (!dependencyGraph || !dependencyGraph.commands[commandId]) return '';

  const command = dependencyGraph.commands[commandId];
  const sections = [];

  sections.push('## Usage Graph');
  sections.push('');

  // Triggered By Agents
  if (command.usedBy.agents.length > 0) {
    sections.push('### Triggered By Agents');
    sections.push('');
    sections.push('| Agent | Description |');
    sections.push('|-------|-------------|');
    for (const agentName of command.usedBy.agents) {
      const agent = dependencyGraph.agents[agentName];
      const desc = agent ? agent.description.slice(0, 60) + (agent.description.length > 60 ? '...' : '') : '';
      sections.push(`| [${agentName}](/agents/${agentName}) | ${desc} |`);
    }
    sections.push('');
  }

  // Available In Workflows
  if (command.usedBy.workflows.length > 0) {
    sections.push('### Available In Workflows');
    sections.push('');
    sections.push('| Workflow | Description |');
    sections.push('|----------|-------------|');
    for (const wfId of command.usedBy.workflows) {
      const wf = dependencyGraph.workflows[wfId];
      const desc = wf ? wf.description.slice(0, 60) + (wf.description.length > 60 ? '...' : '') : '';
      const wfSlug = wfId.split('/')[1] || wfId;
      sections.push(`| [${wfId}](/workflows/${wfSlug}) | ${desc} |`);
    }
    sections.push('');
  }

  return sections.length > 2 ? sections.join('\n') : '';
}

/**
 * Generate orchestration graph section for a workflow
 */
function generateWorkflowOrchestrationSection(workflowId) {
  if (!dependencyGraph || !dependencyGraph.workflows[workflowId]) return '';

  const workflow = dependencyGraph.workflows[workflowId];
  const sections = [];

  sections.push('## Orchestration Graph');
  sections.push('');

  // Agents Orchestrated
  if (workflow.dependsOn.agents.length > 0) {
    sections.push('### Agents Orchestrated');
    sections.push('');
    sections.push('| Agent | Skills | Commands |');
    sections.push('|-------|--------|----------|');
    for (const agentName of workflow.dependsOn.agents) {
      const agent = dependencyGraph.agents[agentName];
      const skills = agent ? agent.dependsOn.skills.slice(0, 2).join(', ') + (agent.dependsOn.skills.length > 2 ? '...' : '') : '';
      const commands = agent ? agent.dependsOn.commands.slice(0, 2).join(', ') + (agent.dependsOn.commands.length > 2 ? '...' : '') : '';
      sections.push(`| [${agentName}](/agents/${agentName}) | ${skills} | ${commands} |`);
    }
    sections.push('');
  }

  // Skills Applied
  if (workflow.dependsOn.skills.length > 0) {
    sections.push('### Skills Applied');
    sections.push('');
    sections.push('| Skill | Description |');
    sections.push('|-------|-------------|');
    for (const skillId of workflow.dependsOn.skills) {
      const skill = dependencyGraph.skills[skillId];
      const desc = skill ? skill.description.slice(0, 60) + (skill.description.length > 60 ? '...' : '') : '';
      const skillSlug = skillId.split('/')[1] || skillId;
      sections.push(`| [${skillId}](/skills/${skillSlug}) | ${desc} |`);
    }
    sections.push('');
  }

  // Commands Available
  if (workflow.dependsOn.commands.length > 0) {
    sections.push('### Commands Available');
    sections.push('');
    sections.push('| Command | Description |');
    sections.push('|---------|-------------|');
    for (const cmdId of workflow.dependsOn.commands) {
      const cmd = dependencyGraph.commands[cmdId];
      const desc = cmd ? cmd.description.slice(0, 60) + (cmd.description.length > 60 ? '...' : '') : '';
      const cmdSlug = cmdId.replace('/', '').replace(':', '-');
      sections.push(`| [\`${cmdId}\`](/commands/${cmdSlug}) | ${desc} |`);
    }
    sections.push('');
  }

  return sections.length > 2 ? sections.join('\n') : '';
}
const PLUGIN_DIR = join(ROOT, 'plugin');
const DOCS_DIR = join(ROOT, 'docs');

/**
 * Agent metadata for enhanced documentation
 */
const AGENT_METADATA = {
  'planner': {
    icon: 'map',
    category: 'Core Development',
    worksWellWith: ['scout', 'researcher', 'architect'],
    triggersCommands: ['/planning:plan', '/planning:plan-detailed', '/planning:plan-parallel'],
    bestFor: 'Feature planning, task decomposition, implementation roadmaps'
  },
  'researcher': {
    icon: 'magnifying-glass',
    category: 'Core Development',
    worksWellWith: ['planner', 'architect', 'oracle'],
    triggersCommands: ['/planning:research'],
    bestFor: 'Technology research, best practices discovery, documentation lookup'
  },
  'debugger': {
    icon: 'bug',
    category: 'Core Development',
    worksWellWith: ['tester', 'scout', 'code-reviewer'],
    triggersCommands: ['/dev:fix', '/dev:fix-fast', '/dev:fix-hard'],
    bestFor: 'Bug investigation, root cause analysis, error resolution'
  },
  'tester': {
    icon: 'flask-vial',
    category: 'Core Development',
    worksWellWith: ['debugger', 'code-reviewer', 'fullstack-developer'],
    triggersCommands: ['/dev:test', '/dev:tdd', '/dev:fix-test'],
    bestFor: 'Test creation, coverage improvement, quality assurance'
  },
  'code-reviewer': {
    icon: 'magnifying-glass-chart',
    category: 'Core Development',
    worksWellWith: ['security-auditor', 'tester', 'architect'],
    triggersCommands: ['/dev:review'],
    bestFor: 'Code quality review, security analysis, best practices enforcement'
  },
  'scout': {
    icon: 'binoculars',
    category: 'Core Development',
    worksWellWith: ['planner', 'debugger', 'researcher'],
    triggersCommands: [],
    bestFor: 'Codebase exploration, pattern discovery, dependency mapping'
  },
  'git-manager': {
    icon: 'code-branch',
    category: 'Operations',
    worksWellWith: ['fullstack-developer', 'code-reviewer'],
    triggersCommands: ['/git:commit', '/git:pr', '/git:ship', '/git:cm', '/git:cp'],
    bestFor: 'Version control, commit management, PR automation'
  },
  'docs-manager': {
    icon: 'book',
    category: 'Operations',
    worksWellWith: ['api-designer', 'architect', 'copywriter'],
    triggersCommands: ['/planning:doc'],
    bestFor: 'Documentation generation, API docs, architecture guides'
  },
  'project-manager': {
    icon: 'clipboard-list',
    category: 'Operations',
    worksWellWith: ['sprint-master', 'planner'],
    triggersCommands: [],
    bestFor: 'Progress tracking, coordination, status reports'
  },
  'database-admin': {
    icon: 'database',
    category: 'Operations',
    worksWellWith: ['fullstack-developer', 'security-auditor'],
    triggersCommands: [],
    bestFor: 'Schema design, query optimization, migrations'
  },
  'ui-ux-designer': {
    icon: 'palette',
    category: 'Operations',
    worksWellWith: ['fullstack-developer', 'copywriter'],
    triggersCommands: ['/design:screenshot', '/design:cro'],
    bestFor: 'UI components, responsive design, accessibility'
  },
  'fullstack-developer': {
    icon: 'code',
    category: 'Extended',
    worksWellWith: ['planner', 'tester', 'code-reviewer'],
    triggersCommands: ['/dev:feature', '/dev:fix', '/quality:refactor'],
    bestFor: 'Full implementation, code writing, feature development'
  },
  'cicd-manager': {
    icon: 'circle-nodes',
    category: 'Extended',
    worksWellWith: ['pipeline-architect', 'tester'],
    triggersCommands: ['/git:deploy', '/dev:fix-ci'],
    bestFor: 'CI/CD pipelines, GitHub Actions, deployment automation'
  },
  'security-auditor': {
    icon: 'shield-halved',
    category: 'Extended',
    worksWellWith: ['code-reviewer', 'vulnerability-scanner'],
    triggersCommands: ['/quality:security-scan'],
    bestFor: 'Security reviews, vulnerability assessment, compliance'
  },
  'api-designer': {
    icon: 'plug',
    category: 'Extended',
    worksWellWith: ['docs-manager', 'fullstack-developer'],
    triggersCommands: ['/quality:api-gen'],
    bestFor: 'API design, OpenAPI specs, REST best practices'
  },
  'vulnerability-scanner': {
    icon: 'shield-virus',
    category: 'Extended',
    worksWellWith: ['security-auditor', 'cicd-manager'],
    triggersCommands: ['/quality:security-scan'],
    bestFor: 'Security scanning, dependency audit, code analysis'
  },
  'pipeline-architect': {
    icon: 'diagram-project',
    category: 'Extended',
    worksWellWith: ['cicd-manager', 'architect'],
    triggersCommands: [],
    bestFor: 'Pipeline optimization, workflow design, automation'
  },
  'copywriter': {
    icon: 'pen-fancy',
    category: 'Creative',
    worksWellWith: ['ui-ux-designer', 'docs-manager'],
    triggersCommands: [],
    bestFor: 'Marketing copy, content writing, UX writing'
  },
  'brainstormer': {
    icon: 'lightbulb',
    category: 'Creative',
    worksWellWith: ['oracle', 'planner', 'researcher'],
    triggersCommands: ['/planning:brainstorm'],
    bestFor: 'Creative exploration, ideation, option generation'
  },
  'journal-writer': {
    icon: 'book-open',
    category: 'Creative',
    worksWellWith: ['project-manager', 'sprint-master'],
    triggersCommands: [],
    bestFor: 'Failure documentation, lessons learned, retrospectives'
  },
  'oracle': {
    icon: 'wand-magic-sparkles',
    category: 'Omega Exclusive',
    worksWellWith: ['architect', 'planner', 'brainstormer'],
    triggersCommands: ['/omega:10x', '/omega:100x', '/omega:1000x', '/omega:principles'],
    bestFor: 'Strategic thinking, 10x/100x/1000x opportunities, Omega modes'
  },
  'architect': {
    icon: 'building',
    category: 'Omega Exclusive',
    worksWellWith: ['oracle', 'planner', 'fullstack-developer'],
    triggersCommands: [],
    bestFor: 'System architecture, design patterns, scalability'
  },
  'sprint-master': {
    icon: 'users-gear',
    category: 'Omega Exclusive',
    worksWellWith: ['project-manager', 'planner', 'oracle'],
    triggersCommands: ['/team:run', '/team:status', '/sprint:new', '/sprint:start'],
    bestFor: 'AI Team orchestration, sprint management, velocity tracking'
  },
  'domain-decomposer': {
    icon: 'puzzle-piece',
    category: 'Architecture',
    worksWellWith: ['architect', 'planner', 'fullstack-developer'],
    triggersCommands: [],
    bestFor: 'Domain-Driven Design, bounded contexts, service boundaries'
  },
  'data-engineer': {
    icon: 'database',
    category: 'Data & ML',
    worksWellWith: ['ml-engineer', 'database-admin', 'architect'],
    triggersCommands: [],
    bestFor: 'Data pipelines, ETL, data quality, schema design'
  },
  'ml-engineer': {
    icon: 'brain',
    category: 'Data & ML',
    worksWellWith: ['data-engineer', 'researcher', 'fullstack-developer'],
    triggersCommands: [],
    bestFor: 'ML pipelines, model training, MLOps, feature engineering'
  },
  'devsecops': {
    icon: 'shield-check',
    category: 'Security',
    worksWellWith: ['security-auditor', 'cicd-manager', 'pipeline-architect'],
    triggersCommands: [],
    bestFor: 'Security automation, SAST/DAST, container security, compliance'
  },
  'performance-engineer': {
    icon: 'gauge-high',
    category: 'Performance',
    worksWellWith: ['fullstack-developer', 'database-admin', 'architect'],
    triggersCommands: [],
    bestFor: 'Performance optimization, profiling, load testing, benchmarking'
  },
  'platform-engineer': {
    icon: 'server',
    category: 'Platform',
    worksWellWith: ['cicd-manager', 'architect', 'devsecops'],
    triggersCommands: [],
    bestFor: 'Internal developer platforms, golden paths, self-service infrastructure'
  },
  'observability-engineer': {
    icon: 'chart-line',
    category: 'Operations',
    worksWellWith: ['performance-engineer', 'cicd-manager', 'devsecops'],
    triggersCommands: [],
    bestFor: 'Monitoring, logging, tracing, alerting, SLO management'
  },
  'game-systems-designer': {
    icon: 'gamepad',
    category: 'Game Development',
    worksWellWith: ['fullstack-developer', 'performance-engineer', 'ui-ux-designer'],
    triggersCommands: [],
    bestFor: 'Game mechanics, balancing, progression systems, multiplayer'
  },
  'embedded-systems': {
    icon: 'microchip',
    category: 'Embedded & IoT',
    worksWellWith: ['architect', 'tester', 'devsecops'],
    triggersCommands: [],
    bestFor: 'Firmware, RTOS, hardware interfaces, IoT connectivity'
  },
  'scientific-computing': {
    icon: 'atom',
    category: 'Scientific',
    worksWellWith: ['data-engineer', 'ml-engineer', 'performance-engineer'],
    triggersCommands: [],
    bestFor: 'Numerical methods, simulations, parallel computing, visualization'
  }
};

/**
 * Command metadata for enhanced documentation
 */
const COMMAND_CATEGORIES = {
  dev: { icon: 'code', description: 'Development commands for building features and fixing bugs' },
  planning: { icon: 'map', description: 'Planning and research commands for strategic work' },
  git: { icon: 'code-branch', description: 'Git and deployment commands for version control' },
  quality: { icon: 'shield-check', description: 'Quality and security commands for code health' },
  context: { icon: 'layer-group', description: 'Context and session management commands' },
  design: { icon: 'palette', description: 'Design and UI/UX commands for visual work' },
  omega: { icon: 'wand-magic-sparkles', description: 'Omega-level strategic thinking commands' },
  sprint: { icon: 'calendar-days', description: 'Sprint and team management commands' },
  sre: { icon: 'chart-line', description: 'Site reliability and observability commands' },
  game: { icon: 'gamepad', description: 'Game development and optimization commands' },
  iot: { icon: 'microchip', description: 'IoT device management and provisioning commands' },
  microservices: { icon: 'cubes', description: 'Microservices architecture commands' },
  event: { icon: 'bolt', description: 'Event-driven architecture commands' },
  ml: { icon: 'brain', description: 'Machine learning workflow commands' }
};

/**
 * Parse YAML frontmatter from markdown file
 * If no YAML frontmatter, extract title/description from markdown content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    // No YAML frontmatter - try to extract from markdown
    const frontmatter = {};

    // Extract title from H1 header
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      frontmatter.name = h1Match[1].trim();
    }

    // Extract description from first paragraph after H1
    const descMatch = content.match(/^#\s+.+\n\n([^#\n][^\n]+)/m);
    if (descMatch) {
      frontmatter.description = descMatch[1].trim();
    }

    return { frontmatter, body: content };
  }

  const frontmatterLines = match[1].split('\n');
  const frontmatter = {};

  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body: match[2] };
}

/**
 * Generate agent documentation with enhanced structure
 */
async function generateAgentDocs() {
  const agentsDir = join(PLUGIN_DIR, 'agents');
  const outputDir = join(DOCS_DIR, 'agents');
  await mkdir(outputDir, { recursive: true });

  const files = await readdir(agentsDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  // Generate overview page
  const agentsList = [];

  for (const file of mdFiles) {
    const content = await readFile(join(agentsDir, file), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const slug = basename(file, '.md');
    const metadata = AGENT_METADATA[slug] || {
      icon: 'robot',
      category: 'General',
      worksWellWith: [],
      triggersCommands: [],
      bestFor: frontmatter.description || ''
    };

    agentsList.push({
      name: frontmatter.name || slug,
      description: frontmatter.description || '',
      slug,
      tools: frontmatter.tools || '',
      model: frontmatter.model || 'inherit',
      ...metadata
    });

    // Parse tools into array for better display
    const toolsList = (frontmatter.tools || '').split(',').map(t => t.trim()).filter(Boolean);

    // Generate works well with section
    const worksWithSection = metadata.worksWellWith.length > 0 ? `
## Integration Points

### Works Well With

${metadata.worksWellWith.map(agent => {
  const agentMeta = AGENT_METADATA[agent];
  return `- **[${agent}](/agents/${agent})** - ${agentMeta ? agentMeta.bestFor : 'Collaborative tasks'}`;
}).join('\n')}
` : '';

    // Generate triggers commands section
    const commandsSection = metadata.triggersCommands.length > 0 ? `
### Triggers Commands

${metadata.triggersCommands.map(cmd => `- [\`${cmd}\`](/commands/${cmd.replace('/', '').replace(':', '-')}) - Activates this agent`).join('\n')}
` : '';

    // Generate individual agent page with enhanced structure
    const agentDoc = `---
title: "${frontmatter.name || slug}"
description: "${frontmatter.description || ''}"
icon: "${metadata.icon}"
---

<Info>
  **Category:** ${metadata.category}

  **Tools:** ${toolsList.join(', ') || 'Standard tools'}

  **Model:** ${frontmatter.model || 'inherit'}

  **Best For:** ${metadata.bestFor}
</Info>

## Quick Start

\`\`\`bash
# Invoke directly
@${slug} "your task description here"
\`\`\`

${body}
${worksWithSection}${commandsSection}
${generateAgentDependencySection(slug)}

## Common Patterns

### Pattern 1: Direct Task Assignment

\`\`\`bash
@${slug} "describe what you need done"
\`\`\`

### Pattern 2: Chained with Other Agents

\`\`\`bash
# Research first, then plan
@researcher "investigate best practices for X"
@${slug} "create implementation plan based on research"
\`\`\`

### Pattern 3: Within Team Mode

\`\`\`bash
/team:run
# Sprint Master will automatically assign ${slug} to appropriate tasks
\`\`\`

## Troubleshooting

<AccordionGroup>
  <Accordion title="Agent not responding as expected">
    Try being more specific in your task description. Include:
    - Clear success criteria
    - Relevant file paths
    - Expected output format
  </Accordion>
  <Accordion title="Missing context from codebase">
    Run \`/index\` first to ensure the agent has full codebase awareness.
  </Accordion>
  <Accordion title="Agent taking too long">
    For complex tasks, break them down into smaller pieces or use \`/mode token-efficient\`.
  </Accordion>
</AccordionGroup>

## Related

<CardGroup cols={2}>
  <Card title="All Agents" icon="robot" href="/agents/overview">
    See all 23 specialized agents
  </Card>
  <Card title="AI Team" icon="users" href="/concepts/ai-team">
    Learn how agents collaborate
  </Card>
  <Card title="${metadata.category}" icon="${metadata.icon}" href="/agents/overview#${metadata.category.toLowerCase().replace(' ', '-')}">
    More ${metadata.category} agents
  </Card>
  <Card title="Commands" icon="terminal" href="/commands/overview">
    Commands that use this agent
  </Card>
</CardGroup>
`;

    await writeFile(join(outputDir, `${slug}.mdx`), agentDoc);
  }

  // Group agents by category
  const agentsByCategory = {};
  for (const agent of agentsList) {
    const cat = agent.category || 'General';
    if (!agentsByCategory[cat]) {
      agentsByCategory[cat] = [];
    }
    agentsByCategory[cat].push(agent);
  }

  const categoryOrder = ['Core Development', 'Operations', 'Extended', 'Creative', 'Omega Exclusive'];
  const categoryIcons = {
    'Core Development': 'code',
    'Operations': 'gears',
    'Extended': 'puzzle-piece',
    'Creative': 'palette',
    'Omega Exclusive': 'wand-magic-sparkles'
  };

  // Generate overview page with comprehensive structure
  const overviewDoc = `---
title: "Agents Overview"
description: "23 specialized AI agents for every development task"
icon: "robot"
---

OMGKIT includes **23 specialized agents**, each an expert in their domain. Agents work independently or collaborate as a team under the Sprint Master's orchestration.

## At a Glance

<CardGroup cols={4}>
  <Card title="23" icon="robot">
    Specialized Agents
  </Card>
  <Card title="5" icon="folder">
    Categories
  </Card>
  <Card title="∞" icon="arrows-spin">
    Collaboration Patterns
  </Card>
  <Card title="1" icon="users-gear">
    Sprint Master
  </Card>
</CardGroup>

## Agent Categories

<CardGroup cols={2}>
  <Card title="Core Development" icon="code" href="#core-development">
    **6 agents** - Planning, research, debugging, testing, review, exploration
  </Card>
  <Card title="Operations" icon="gears" href="#operations">
    **5 agents** - Git, docs, project management, database, UI/UX
  </Card>
  <Card title="Extended" icon="puzzle-piece" href="#extended">
    **6 agents** - Fullstack, CI/CD, security, API design, pipelines
  </Card>
  <Card title="Creative" icon="palette" href="#creative">
    **3 agents** - Copy, brainstorming, journaling
  </Card>
  <Card title="Omega Exclusive" icon="wand-magic-sparkles" href="#omega-exclusive">
    **3 agents** - Oracle, architect, sprint master
  </Card>
</CardGroup>

## Choosing the Right Agent

<AccordionGroup>
  <Accordion title="I need to plan a feature">
    Use **[@planner](/agents/planner)** for detailed implementation plans with task breakdowns, dependencies, and rollback procedures.
  </Accordion>
  <Accordion title="I need to fix a bug">
    Use **[@debugger](/agents/debugger)** for systematic bug investigation with root cause analysis and verification steps.
  </Accordion>
  <Accordion title="I need to write tests">
    Use **[@tester](/agents/tester)** for comprehensive test generation with edge cases and coverage optimization.
  </Accordion>
  <Accordion title="I need to implement a feature">
    Use **[@fullstack-developer](/agents/fullstack-developer)** for complete code implementation following project patterns.
  </Accordion>
  <Accordion title="I need a code review">
    Use **[@code-reviewer](/agents/code-reviewer)** for security-focused review with OWASP checks and best practices.
  </Accordion>
  <Accordion title="I need strategic thinking">
    Use **[@oracle](/agents/oracle)** for 10x/100x/1000x opportunities using Omega thinking modes.
  </Accordion>
</AccordionGroup>

---

${categoryOrder.map(cat => {
  const agents = agentsByCategory[cat] || [];
  if (agents.length === 0) return '';
  return `
## ${cat}

| Agent | Description | Tools | Best For |
|-------|-------------|-------|----------|
${agents.map(a => `| [**${a.name}**](/agents/${a.slug}) | ${a.description.slice(0, 50)}${a.description.length > 50 ? '...' : ''} | ${a.tools.split(',').slice(0, 3).join(', ')} | ${a.bestFor.slice(0, 40)}${a.bestFor.length > 40 ? '...' : ''} |`).join('\n')}
`;
}).join('\n')}

---

## Using Agents

### Direct Invocation

The most straightforward way to use an agent:

\`\`\`bash
# Syntax
@agent-name "your task description"

# Examples
@planner "plan the user authentication feature"
@tester "write tests for the PaymentService class"
@code-reviewer "review src/components/ for security issues"
@debugger "investigate why login fails on mobile"
\`\`\`

### Via Commands

Many commands automatically route to the appropriate agent:

| Command | Agent | Use Case |
|---------|-------|----------|
| \`/plan\` | planner | Feature planning |
| \`/test\` | tester | Test generation |
| \`/review\` | code-reviewer | Code review |
| \`/commit\` | git-manager | Git commits |
| \`/fix\` | debugger | Bug fixing |
| \`/research\` | researcher | Technology research |
| \`/brainstorm\` | brainstormer | Ideation |

### In Team Mode

When running \`/team:run\`, the Sprint Master automatically:

1. Analyzes the sprint backlog
2. Decomposes tasks into agent assignments
3. Orchestrates parallel execution
4. Handles agent handoffs
5. Reports progress and blockers

\`\`\`bash
# Start team mode
/team:run

# Check team status
/team:status

# Ask the team a question
/team:ask "what's blocking the auth feature?"
\`\`\`

### Agent Chaining

Agents can be chained for complex workflows:

\`\`\`bash
# Research → Plan → Implement → Test → Review
@researcher "investigate GraphQL best practices"
@planner "plan GraphQL API implementation"
@fullstack-developer "implement the planned GraphQL API"
@tester "write tests for the new GraphQL API"
@code-reviewer "review the GraphQL implementation"
\`\`\`

## Agent Communication

Agents communicate through:

1. **Shared Context** - All agents see the same codebase and conversation
2. **Handoff Protocols** - Structured handoffs between agents
3. **Sprint Master** - Central orchestration in team mode

## Next Steps

<CardGroup cols={2}>
  <Card title="AI Team Concepts" icon="users" href="/concepts/ai-team">
    Deep dive into how agents collaborate
  </Card>
  <Card title="Commands Reference" icon="terminal" href="/commands/overview">
    ${graphStats.commands} commands that utilize agents
  </Card>
  <Card title="Sprint Management" icon="calendar-days" href="/concepts/sprint-management">
    Manage agents across sprints
  </Card>
  <Card title="Omega Philosophy" icon="atom" href="/concepts/omega-philosophy">
    The philosophy behind agent design
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${mdFiles.length} agent docs with enhanced structure`);
}

/**
 * Generate command documentation with enhanced structure
 */
async function generateCommandDocs() {
  const commandsDir = join(PLUGIN_DIR, 'commands');
  const outputDir = join(DOCS_DIR, 'commands');
  await mkdir(outputDir, { recursive: true });

  const categories = await readdir(commandsDir);
  const allCommands = [];

  for (const category of categories) {
    const categoryPath = join(commandsDir, category);
    const stat = await readFile(categoryPath).catch(() => null);
    if (stat) continue; // Skip files, only process directories

    try {
      const files = await readdir(categoryPath);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      for (const file of mdFiles) {
        const content = await readFile(join(categoryPath, file), 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);
        let slug = basename(file, '.md');
        // Avoid Mintlify reserved name conflict: index.mdx is treated as folder landing page
        if (slug === 'index') {
          slug = 'context-index';
        }
        const catMeta = COMMAND_CATEGORIES[category] || { icon: 'terminal', description: '' };

        allCommands.push({
          slug,
          category,
          description: frontmatter.description || '',
          argumentHint: frontmatter['argument-hint'] || '',
          allowedTools: frontmatter['allowed-tools'] || '',
          icon: catMeta.icon
        });

        // Parse tools for better display
        const tools = (frontmatter['allowed-tools'] || '').split(',').map(t => t.trim()).filter(Boolean);

        // Replace $ARGUMENTS placeholder with argument-hint or generic text
        // Escape angle brackets for MDX compatibility (they get interpreted as HTML tags)
        const rawHint = frontmatter['argument-hint'] || '<your input>';
        const argumentHint = rawHint.replace(/</g, '\\<').replace(/>/g, '\\>');
        const processedBody = body
          .replace(/\$ARGUMENTS/g, argumentHint)
          .replace(/\$\{ARGUMENTS\}/g, argumentHint);

        // Generate individual command page with enhanced structure
        // Use colon separator for command naming: category:command
        const fullCommandName = `${category}:${slug}`;
        const commandDoc = `---
title: "/${fullCommandName}"
description: "${frontmatter.description || ''}"
icon: "${catMeta.icon}"
---

<Info>
  **Category:** ${category.charAt(0).toUpperCase() + category.slice(1)}

  **Syntax:** \`/${fullCommandName}${frontmatter['argument-hint'] ? ' ' + frontmatter['argument-hint'] : ''}\`
</Info>

## Overview

${frontmatter.description || 'No description available.'}

## Quick Start

\`\`\`bash
/${fullCommandName}${frontmatter['argument-hint'] ? ' ' + frontmatter['argument-hint'].split(' ')[0].replace('<', '"').replace('>', '"') : ''}
\`\`\`

${processedBody}

${tools.length > 0 ? `
## Tools Used

This command uses the following tools:

${tools.map(t => `- **${t}** - Enables ${t.toLowerCase()} capabilities`).join('\n')}
` : ''}

${generateCommandUsageSection(`/${fullCommandName}`)}

## Examples

### Basic Usage

\`\`\`bash
/${fullCommandName}${frontmatter['argument-hint'] ? ' "your input here"' : ''}
\`\`\`

### With Context

\`\`\`bash
# First, ensure context is loaded
/context:index

# Then run the command
/${fullCommandName}${frontmatter['argument-hint'] ? ' "detailed description"' : ''}
\`\`\`

## Tips

<Note>
For best results, be specific in your descriptions and include relevant file paths or context.
</Note>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Command not found">
    Make sure OMGKIT is installed: \`npx omgkit --version\`
  </Accordion>
  <Accordion title="Unexpected results">
    Try running \`/index\` first to refresh codebase context.
  </Accordion>
</AccordionGroup>

## Related Commands

<CardGroup cols={2}>
  <Card title="All Commands" icon="terminal" href="/commands/overview">
    See all 58 commands
  </Card>
  <Card title="${category.charAt(0).toUpperCase() + category.slice(1)} Commands" icon="${catMeta.icon}" href="/commands/overview#${category}">
    More ${category} commands
  </Card>
</CardGroup>
`;

        await writeFile(join(outputDir, `${slug}.mdx`), commandDoc);
      }
    } catch (e) {
      // Not a directory
    }
  }

  // Generate overview page
  const commandsByCategory = {};
  for (const cmd of allCommands) {
    if (!commandsByCategory[cmd.category]) {
      commandsByCategory[cmd.category] = [];
    }
    commandsByCategory[cmd.category].push(cmd);
  }

  const categoryOrder = ['dev', 'planning', 'git', 'quality', 'context', 'design', 'omega', 'sprint'];
  const categoryDescriptions = {
    dev: 'Build features and fix bugs',
    planning: 'Plan and research before coding',
    git: 'Version control and deployment',
    quality: 'Ensure code health and security',
    context: 'Manage session and codebase context',
    design: 'UI/UX and visual design',
    omega: 'Strategic 10x/100x/1000x thinking',
    sprint: 'Team and sprint management'
  };

  const overviewDoc = `---
title: "Commands Overview"
description: "58 slash commands for every development task"
icon: "terminal"
---

OMGKIT provides **58 slash commands** covering the entire development lifecycle. Commands are grouped by purpose and automatically route to the appropriate agent.

## At a Glance

<CardGroup cols={4}>
  <Card title="58" icon="terminal">
    Total Commands
  </Card>
  <Card title="8" icon="folder">
    Categories
  </Card>
  <Card title="23" icon="robot">
    Backing Agents
  </Card>
  <Card title="10" icon="sliders">
    Mode-Aware
  </Card>
</CardGroup>

## Command Categories

<CardGroup cols={2}>
${categoryOrder.map(cat => {
  const cmds = commandsByCategory[cat] || [];
  const catMeta = COMMAND_CATEGORIES[cat] || { icon: 'terminal', description: '' };
  return `  <Card title="${cat.charAt(0).toUpperCase() + cat.slice(1)}" icon="${catMeta.icon}" href="#${cat}">
    **${cmds.length} commands** - ${categoryDescriptions[cat] || catMeta.description}
  </Card>`;
}).join('\n')}
</CardGroup>

## Essential Commands Cheat Sheet

| Task | Command | Example |
|------|---------|---------|
| Plan a feature | \`/planning:plan\` | \`/planning:plan "user authentication"\` |
| Implement feature | \`/dev:feature\` | \`/dev:feature "add login form"\` |
| Fix a bug | \`/dev:fix\` | \`/dev:fix "button not clickable"\` |
| Write tests | \`/dev:test\` | \`/dev:test "AuthService"\` |
| Code review | \`/dev:review\` | \`/dev:review src/components/\` |
| Commit changes | \`/git:commit\` | \`/git:commit\` |
| Create PR | \`/git:pr\` | \`/git:pr\` |
| Research tech | \`/planning:research\` | \`/planning:research "GraphQL best practices"\` |

---

${categoryOrder.map(cat => {
  const cmds = commandsByCategory[cat] || [];
  if (cmds.length === 0) return '';
  const catMeta = COMMAND_CATEGORIES[cat] || { icon: 'terminal', description: '' };
  return `
## ${cat.charAt(0).toUpperCase() + cat.slice(1)}

${catMeta.description}

| Command | Description | Usage |
|---------|-------------|-------|
${cmds.map(c => `| [\`/${cat}:${c.slug}\`](/commands/${c.slug}) | ${c.description.slice(0, 40)}${c.description.length > 40 ? '...' : ''} | \`/${cat}:${c.slug}${c.argumentHint ? ' ' + c.argumentHint : ''}\` |`).join('\n')}
`;
}).join('\n')}

---

## Usage Patterns

### Basic Syntax

\`\`\`bash
# Simple command
/command

# With argument
/command "your input"

# With specific file
/command src/file.ts

# With flags (some commands)
/command --verbose
\`\`\`

### Workflow Examples

<Tabs>
  <Tab title="Feature Development">
\`\`\`bash
# 1. Plan the feature
/planning:plan "user profile page"

# 2. Execute the plan
/planning:execute-plan

# 3. Write tests
/dev:test "ProfilePage"

# 4. Review code
/dev:review src/pages/Profile.tsx

# 5. Commit and PR
/git:commit && /git:pr
\`\`\`
  </Tab>
  <Tab title="Bug Fixing">
\`\`\`bash
# 1. Quick fix
/dev:fix "login fails on mobile"

# 2. Or detailed investigation
/dev:fix-hard "login fails on mobile"

# 3. Run tests
/dev:test

# 4. Commit
/git:commit
\`\`\`
  </Tab>
  <Tab title="Strategic Thinking">
\`\`\`bash
# 1. Activate Omega mode
/mode:omega

# 2. Find 10x opportunities
/omega:10x "our checkout flow"

# 3. Or 100x moonshots
/omega:100x "our entire product"

# 4. Get principles
/omega:principles
\`\`\`
  </Tab>
</Tabs>

### Command Chaining

Commands can be chained for complex workflows:

\`\`\`bash
# Plan, implement, test, commit in sequence
/planning:plan "feature" && /planning:execute-plan && /dev:test && /git:commit

# Research before planning
/planning:research "best practices" && /planning:plan "implement findings"
\`\`\`

## Command Modes

Commands behave differently based on the active mode:

| Mode | Effect on Commands |
|------|-------------------|
| **Default** | Standard behavior |
| **Omega** | Enhanced strategic thinking |
| **Token Efficient** | Minimal context, faster responses |
| **Autonomous** | Less confirmation prompts |

Switch modes with \`/context:mode <mode-name>\` or use the shorthand \`/mode:<mode-name>\`.

## Next Steps

<CardGroup cols={2}>
  <Card title="Agents" icon="robot" href="/agents/overview">
    ${graphStats.agents} agents that power these commands
  </Card>
  <Card title="Modes" icon="sliders" href="/modes/overview">
    10 behavioral modes
  </Card>
  <Card title="Skills" icon="brain" href="/skills/overview">
    ${graphStats.skills} domain expertise modules
  </Card>
  <Card title="Quick Start" icon="rocket" href="/getting-started/quickstart">
    Get started in 5 minutes
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${allCommands.length} command docs with enhanced structure`);
}

/**
 * Format category name for display (e.g., 'ai-engineering' -> 'AI Engineering')
 */
function formatCategoryName(cat) {
  const specialCases = {
    'ai-engineering': 'AI Engineering',
    'devops': 'DevOps',
    'ui-ux': 'UI/UX'
  };
  if (specialCases[cat]) return specialCases[cat];
  return cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Skill category metadata
 */
const SKILL_CATEGORIES = {
  'ai-engineering': { icon: 'microchip', description: 'AI/ML engineering patterns and best practices' },
  'ai-ml': { icon: 'brain-circuit', description: 'MLOps, experiment tracking, and model serving' },
  'ml-systems': { icon: 'brain', description: 'Production ML systems from data engineering to deployment' },
  autonomous: { icon: 'robot', description: 'Autonomous project development orchestration' },
  backend: { icon: 'server', description: 'Backend architecture and API patterns' },
  databases: { icon: 'database', description: 'Database design and optimization' },
  devops: { icon: 'cloud', description: 'Infrastructure, containers, and CI/CD' },
  'event-driven': { icon: 'bolt', description: 'Event sourcing, CQRS, and streaming patterns' },
  frameworks: { icon: 'layer-group', description: 'Framework-specific patterns and best practices' },
  frontend: { icon: 'palette', description: 'Frontend tooling, styling, and UI patterns' },
  game: { icon: 'gamepad', description: 'Game development with Unity, Godot, and networking' },
  integrations: { icon: 'plug', description: 'Third-party service integrations' },
  iot: { icon: 'microchip-ai', description: 'IoT protocols, edge computing, and device management' },
  languages: { icon: 'code', description: 'Programming language expertise' },
  methodology: { icon: 'diagram-project', description: 'Development methodologies and workflows' },
  microservices: { icon: 'cubes', description: 'Service mesh, API gateway, and distributed patterns' },
  mobile: { icon: 'mobile', description: 'Mobile app development patterns' },
  'mobile-advanced': { icon: 'mobile-screen', description: 'Advanced mobile patterns and CI/CD' },
  omega: { icon: 'wand-magic-sparkles', description: 'Omega-level development practices' },
  security: { icon: 'shield-halved', description: 'Security best practices and authentication' },
  simulation: { icon: 'atom', description: 'Scientific computing, physics, and parallel processing' },
  testing: { icon: 'flask-vial', description: 'Testing frameworks and strategies' },
  tools: { icon: 'toolbox', description: 'Development tools and utilities' }
};

/**
 * Generate skill documentation with enhanced structure
 */
async function generateSkillDocs() {
  const skillsDir = join(PLUGIN_DIR, 'skills');
  const outputDir = join(DOCS_DIR, 'skills');
  await mkdir(outputDir, { recursive: true });

  const categories = await readdir(skillsDir);
  const allSkills = [];

  for (const category of categories) {
    const categoryPath = join(skillsDir, category);

    try {
      const items = await readdir(categoryPath);

      for (const item of items) {
        const skillFile = join(categoryPath, item, 'SKILL.md');
        try {
          const content = await readFile(skillFile, 'utf-8');
          const { frontmatter, body } = parseFrontmatter(content);
          const catMeta = SKILL_CATEGORIES[category] || { icon: 'brain', description: '' };

          allSkills.push({
            name: frontmatter.name || item,
            description: frontmatter.description || '',
            category,
            slug: item,
            icon: catMeta.icon
          });

          // Generate individual skill page with enhanced structure
          const skillDoc = `---
title: "${frontmatter.name || item}"
description: "${frontmatter.description || ''}"
icon: "${catMeta.icon}"
---

<Info>
  **Category:** ${category.charAt(0).toUpperCase() + category.slice(1)}

  **Auto-Detection:** OMGKIT automatically detects when this skill is needed based on your project files.
</Info>

## Overview

${frontmatter.description || 'This skill provides domain expertise for working with ' + item + '.'}

## What You Get

When this skill is active, agents automatically apply:

<Check>Industry best practices</Check>
<Check>Idiomatic patterns</Check>
<Check>Security considerations</Check>
<Check>Performance optimizations</Check>

${body}

${generateSkillUsageSection(`${category}/${item}`)}

## Configuration

You can customize skill behavior in your project config:

\`\`\`yaml
# .omgkit/config.yaml
skills:
  ${item}:
    enabled: true
    # Add skill-specific settings here
\`\`\`

## When This Skill Activates

OMGKIT detects and activates this skill when it finds:

- Relevant file extensions in your project
- Configuration files specific to this technology
- Package dependencies in package.json, requirements.txt, etc.

## Related Skills

<CardGroup cols={2}>
  <Card title="All Skills" icon="brain" href="/skills/overview">
    See all 43 skills
  </Card>
  <Card title="${category.charAt(0).toUpperCase() + category.slice(1)}" icon="${catMeta.icon}" href="/skills/overview#${category}">
    More ${category} skills
  </Card>
</CardGroup>
`;

          await writeFile(join(outputDir, `${item}.mdx`), skillDoc);
        } catch (e) {
          // SKILL.md not found
        }
      }
    } catch (e) {
      // Not a directory
    }
  }

  // Generate overview page
  const skillsByCategory = {};
  for (const skill of allSkills) {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  }

  const categoryOrder = ['ai-engineering', 'ai-ml', 'ml-systems', 'autonomous', 'languages', 'frameworks', 'backend', 'databases', 'frontend', 'mobile', 'mobile-advanced', 'devops', 'security', 'testing', 'tools', 'integrations', 'methodology', 'omega', 'microservices', 'event-driven', 'game', 'iot', 'simulation'];

  const overviewDoc = `---
title: "Skills Overview"
description: "${allSkills.length} domain expertise modules for languages, frameworks, and tools"
icon: "brain"
---

Skills provide **deep domain expertise** that agents use when working with specific technologies. Skills are automatically detected and loaded based on your project files.

## At a Glance

<CardGroup cols={4}>
  <Card title="${allSkills.length}" icon="brain">
    Total Skills
  </Card>
  <Card title="${Object.keys(skillsByCategory).length}" icon="folder">
    Categories
  </Card>
  <Card title="Auto" icon="wand-magic-sparkles">
    Detection
  </Card>
  <Card title="100%" icon="check">
    Best Practices
  </Card>
</CardGroup>

## Skill Categories

<CardGroup cols={2}>
${categoryOrder.map(cat => {
  const skills = skillsByCategory[cat] || [];
  const catMeta = SKILL_CATEGORIES[cat] || { icon: 'brain', description: '' };
  return `  <Card title="${formatCategoryName(cat)}" icon="${catMeta.icon}" href="#${cat}">
    **${skills.length} skills** - ${catMeta.description}
  </Card>`;
}).join('\n')}
</CardGroup>

## How Skills Work

<Steps>
  <Step title="Auto-Detection">
    OMGKIT scans your project for configuration files, dependencies, and file extensions to identify technologies.
  </Step>
  <Step title="Skill Loading">
    Relevant skills are automatically loaded, providing agents with domain expertise.
  </Step>
  <Step title="Best Practices Applied">
    Agents apply idiomatic patterns, security best practices, and performance optimizations.
  </Step>
</Steps>

### Example: Next.js Project

When working on a Next.js project, OMGKIT automatically loads:

| Skill | Provides |
|-------|----------|
| **Next.js** | App Router patterns, Server Components, API routes |
| **React** | Component patterns, hooks, state management |
| **TypeScript** | Type safety, interfaces, generics |
| **Tailwind CSS** | Utility classes, responsive design |

---

${categoryOrder.map(cat => {
  const skills = skillsByCategory[cat] || [];
  if (skills.length === 0) return '';
  const catMeta = SKILL_CATEGORIES[cat] || { icon: 'brain', description: '' };
  return `
## ${formatCategoryName(cat)}

${catMeta.description}

| Skill | Description |
|-------|-------------|
${skills.map(s => `| [**${s.name}**](/skills/${s.slug}) | ${s.description.slice(0, 50)}${s.description.length > 50 ? '...' : ''} |`).join('\n')}
`;
}).join('\n')}

---

## Skill Combinations

Common skill combinations for popular stacks:

<AccordionGroup>
  <Accordion title="Next.js Full-Stack">
    - **Next.js** + **React** + **TypeScript** + **Tailwind CSS**
    - **Prisma** or **MongoDB** for database
    - **shadcn/ui** for components
  </Accordion>
  <Accordion title="Python Backend">
    - **Python** + **FastAPI** or **Django**
    - **PostgreSQL** + **Redis**
  </Accordion>
  <Accordion title="Node.js API">
    - **TypeScript** + **Express** or **NestJS**
    - **PostgreSQL** + **Prisma**
  </Accordion>
</AccordionGroup>

## Configuration

Customize skill behavior in your project:

\`\`\`yaml
# .omgkit/config.yaml
skills:
  typescript:
    strict: true
  react:
    preferFunctionalComponents: true
  postgresql:
    useParameterizedQueries: true
\`\`\`

## Next Steps

<CardGroup cols={2}>
  <Card title="Agents" icon="robot" href="/agents/overview">
    ${graphStats.agents} agents that use skills
  </Card>
  <Card title="Configuration" icon="gear" href="/getting-started/configuration">
    Configure skill preferences
  </Card>
  <Card title="Commands" icon="terminal" href="/commands/overview">
    ${graphStats.commands} commands available
  </Card>
  <Card title="Modes" icon="sliders" href="/modes/overview">
    10 behavioral modes
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${allSkills.length} skill docs with enhanced structure`);
}

/**
 * Workflow category metadata
 */
const WORKFLOW_CATEGORIES = {
  development: { icon: 'code', description: 'Core development workflows for features, bugs, and reviews' },
  'ai-engineering': { icon: 'microchip', description: 'AI/ML system development workflows' },
  'ai-ml': { icon: 'brain-circuit', description: 'MLOps and model lifecycle workflows' },
  omega: { icon: 'wand-magic-sparkles', description: 'Strategic thinking and improvement workflows' },
  sprint: { icon: 'calendar-days', description: 'Sprint management and team coordination' },
  security: { icon: 'shield-halved', description: 'Security auditing and penetration testing' },
  database: { icon: 'database', description: 'Database design, migration, and optimization' },
  api: { icon: 'plug', description: 'API design and testing workflows' },
  fullstack: { icon: 'layer-group', description: 'Full-stack feature development' },
  content: { icon: 'file-lines', description: 'Documentation and content creation' },
  research: { icon: 'magnifying-glass', description: 'Technology research and best practices' },
  quality: { icon: 'gauge-high', description: 'Performance and quality optimization' },
  microservices: { icon: 'cubes', description: 'Microservices architecture and distributed systems' },
  'event-driven': { icon: 'bolt', description: 'Event-driven architecture and streaming' },
  'game-dev': { icon: 'gamepad', description: 'Game development lifecycle and optimization' }
};

/**
 * Mode metadata
 */
const MODE_METADATA = {
  'default': { icon: 'sliders', category: 'Standard', bestFor: 'General development tasks' },
  'omega': { icon: 'wand-magic-sparkles', category: 'Omega', bestFor: 'Strategic thinking, 10x opportunities' },
  'autonomous': { icon: 'robot', category: 'Omega', bestFor: 'Minimal supervision, fast execution' },
  'brainstorm': { icon: 'lightbulb', category: 'Creative', bestFor: 'Ideation, exploring options' },
  'deep-research': { icon: 'magnifying-glass', category: 'Creative', bestFor: 'In-depth analysis, learning' },
  'implementation': { icon: 'code', category: 'Standard', bestFor: 'Writing code, building features' },
  'review': { icon: 'magnifying-glass-chart', category: 'Standard', bestFor: 'Code review, quality checks' },
  'orchestration': { icon: 'users-gear', category: 'Efficiency', bestFor: 'Multi-agent coordination' },
  'token-efficient': { icon: 'gauge-high', category: 'Efficiency', bestFor: 'Reducing API costs' }
};

/**
 * Generate mode documentation with enhanced structure
 */
async function generateModeDocs() {
  const modesDir = join(PLUGIN_DIR, 'modes');
  const outputDir = join(DOCS_DIR, 'modes');
  await mkdir(outputDir, { recursive: true });

  const files = await readdir(modesDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  const allModes = [];

  for (const file of mdFiles) {
    const content = await readFile(join(modesDir, file), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);
    const slug = basename(file, '.md');
    const metadata = MODE_METADATA[slug] || { icon: 'sliders', category: 'Standard', bestFor: '' };

    allModes.push({
      name: frontmatter.name || slug,
      description: frontmatter.description || '',
      slug,
      ...metadata
    });

    // Generate individual mode page with enhanced structure
    const modeDoc = `---
title: "${frontmatter.name || slug} Mode"
description: "${frontmatter.description || ''}"
icon: "${metadata.icon}"
---

<Info>
  **Category:** ${metadata.category}

  **Best For:** ${metadata.bestFor}
</Info>

## Overview

${frontmatter.description || 'This mode optimizes OMGKIT behavior for specific development contexts.'}

## When to Use

<Check>Use when ${metadata.bestFor.toLowerCase() || 'you need this specific behavior'}</Check>

${body}

## Activation

\`\`\`bash
# Switch to this mode
/mode ${slug}

# Check current mode
/mode
\`\`\`

## Mode Behavior

When active, this mode affects:

- **Agent Behavior** - How agents approach tasks
- **Output Style** - Level of detail in responses
- **Decision Making** - Autonomy level

## Tips

<Note>
You can temporarily switch modes for specific commands, then switch back to your preferred mode.
</Note>

## Related Modes

<CardGroup cols={2}>
  <Card title="All Modes" icon="sliders" href="/modes/overview">
    See all 10 modes
  </Card>
  <Card title="Configuration" icon="gear" href="/getting-started/configuration">
    Configure default mode
  </Card>
</CardGroup>
`;

    await writeFile(join(outputDir, `${slug}.mdx`), modeDoc);
  }

  // Group modes by category
  const modesByCategory = {};
  for (const mode of allModes) {
    const cat = mode.category || 'Standard';
    if (!modesByCategory[cat]) {
      modesByCategory[cat] = [];
    }
    modesByCategory[cat].push(mode);
  }

  const categoryOrder = ['Standard', 'Creative', 'Efficiency', 'Omega'];

  // Generate overview page with enhanced structure
  const overviewDoc = `---
title: "Modes Overview"
description: "10 behavioral modes for different development contexts"
icon: "sliders"
---

Modes change how OMGKIT behaves. Switch modes to **optimize for different tasks** - from creative brainstorming to efficient execution.

## At a Glance

<CardGroup cols={4}>
  <Card title="10" icon="sliders">
    Total Modes
  </Card>
  <Card title="4" icon="folder">
    Categories
  </Card>
  <Card title="Instant" icon="bolt">
    Switching
  </Card>
  <Card title="Session" icon="clock">
    Persistence
  </Card>
</CardGroup>

## Mode Categories

<CardGroup cols={2}>
  <Card title="Standard Modes" icon="sliders" href="#standard">
    **${(modesByCategory['Standard'] || []).length} modes** - Everyday development (Default, Implementation, Review, Tutor)
  </Card>
  <Card title="Creative Modes" icon="lightbulb" href="#creative">
    **${(modesByCategory['Creative'] || []).length} modes** - Exploration and analysis (Brainstorm, Deep Research)
  </Card>
  <Card title="Efficiency Modes" icon="gauge-high" href="#efficiency">
    **${(modesByCategory['Efficiency'] || []).length} modes** - Optimized workflows (Token Efficient, Orchestration)
  </Card>
  <Card title="Omega Modes" icon="wand-magic-sparkles" href="#omega">
    **${(modesByCategory['Omega'] || []).length} modes** - Advanced AI (Omega, Autonomous)
  </Card>
</CardGroup>

## Choosing the Right Mode

<AccordionGroup>
  <Accordion title="I want general development help">
    Use **Default Mode** - Balanced behavior for everyday tasks.
  </Accordion>
  <Accordion title="I want to brainstorm ideas">
    Use **Brainstorm Mode** - Creative exploration, multiple options.
  </Accordion>
  <Accordion title="I want strategic thinking">
    Use **Omega Mode** - 10x/100x/1000x opportunities, big-picture thinking.
  </Accordion>
  <Accordion title="I want to minimize API costs">
    Use **Token Efficient Mode** - Minimal context, concise responses.
  </Accordion>
  <Accordion title="I want less confirmation prompts">
    Use **Autonomous Mode** - Faster execution, less interruption.
  </Accordion>
  <Accordion title="I want to learn while working">
    Use **Tutor Mode** - Deep explanations with Feynman technique and Socratic reasoning.
  </Accordion>
</AccordionGroup>

---

${categoryOrder.map(cat => {
  const modes = modesByCategory[cat] || [];
  if (modes.length === 0) return '';
  return `
## ${cat}

| Mode | Description | Best For |
|------|-------------|----------|
${modes.map(m => `| [**${m.name}**](/modes/${m.slug}) | ${m.description.slice(0, 40)}${m.description.length > 40 ? '...' : ''} | ${m.bestFor} |`).join('\n')}
`;
}).join('\n')}

---

## Switching Modes

### Basic Commands

\`\`\`bash
# Switch to a mode
/mode omega

# Check current mode
/mode

# Switch back to default
/mode default
\`\`\`

### Temporary Mode Switching

\`\`\`bash
# Switch mode for a specific workflow
/mode brainstorm
/brainstorm "new feature ideas"
/mode default

# Or chain with &&
/mode omega && /10x "our checkout flow" && /mode default
\`\`\`

## Mode Comparison

| Aspect | Default | Omega | Token Efficient | Autonomous |
|--------|---------|-------|-----------------|------------|
| **Context Usage** | Normal | High | Minimal | Normal |
| **Confirmations** | Normal | Normal | Normal | Fewer |
| **Strategic Thinking** | Standard | Enhanced | Reduced | Standard |
| **Response Length** | Normal | Detailed | Concise | Normal |

## Mode Persistence

<Note>
Modes persist for the session. Configure your preferred default mode in \`.omgkit/config.yaml\`.
</Note>

\`\`\`yaml
# .omgkit/config.yaml
mode: omega  # Your preferred default mode
\`\`\`

## Next Steps

<CardGroup cols={2}>
  <Card title="Omega Philosophy" icon="atom" href="/concepts/omega-philosophy">
    Deep dive into Omega thinking
  </Card>
  <Card title="Configuration" icon="gear" href="/getting-started/configuration">
    Set your default mode
  </Card>
  <Card title="Commands" icon="terminal" href="/commands/overview">
    Commands affected by modes
  </Card>
  <Card title="Agents" icon="robot" href="/agents/overview">
    Agents that adapt to modes
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${mdFiles.length} mode docs with enhanced structure`);
}

/**
 * Parse YAML array from frontmatter
 */
function parseYamlArray(content, key) {
  const lines = content.split('\n');
  const result = [];
  let inArray = false;

  for (const line of lines) {
    if (line.trim().startsWith(`${key}:`)) {
      inArray = true;
      continue;
    }
    if (inArray) {
      if (line.trim().startsWith('- ')) {
        result.push(line.trim().slice(2).trim());
      } else if (!line.trim().startsWith('-') && line.trim() !== '') {
        break;
      }
    }
  }
  return result;
}

/**
 * Generate workflow category tables for overview
 */
function generateWorkflowCategoryTables(categoryOrder, workflowsByCategory) {
  return categoryOrder.map(cat => {
    const wfs = workflowsByCategory[cat] || [];
    if (wfs.length === 0) return '';
    const catMeta = WORKFLOW_CATEGORIES[cat] || { icon: 'diagram-project', description: '' };
    const rows = wfs.map(w => {
      const desc = w.description.length > 40 ? w.description.slice(0, 40) + '...' : w.description;
      return `| [**${w.name}**](/workflows/${w.slug}) | ${desc} | ${w.complexity} | ${w.estimatedTime || '-'} |`;
    }).join('\n');
    return `
## ${formatCategoryName(cat)}

${catMeta.description}

| Workflow | Description | Complexity | Time |
|----------|-------------|------------|------|
${rows}
`;
  }).join('\n');
}

/**
 * Generate workflow documentation with enhanced structure
 */
async function generateWorkflowDocs() {
  const workflowsDir = join(PLUGIN_DIR, 'workflows');
  const outputDir = join(DOCS_DIR, 'workflows');
  await mkdir(outputDir, { recursive: true });

  const categories = await readdir(workflowsDir);
  const allWorkflows = [];

  for (const category of categories) {
    const categoryPath = join(workflowsDir, category);

    try {
      const files = await readdir(categoryPath);
      const mdFiles = files.filter(f => f.endsWith('.md'));

      for (const file of mdFiles) {
        const content = await readFile(join(categoryPath, file), 'utf-8');
        const { frontmatter, body } = parseFrontmatter(content);
        const slug = basename(file, '.md');
        const catMeta = WORKFLOW_CATEGORIES[category] || { icon: 'diagram-project', description: '' };

        // Parse array fields from content
        const agents = parseYamlArray(content, 'agents');
        const skills = parseYamlArray(content, 'skills');
        const commands = parseYamlArray(content, 'commands');
        const prerequisites = parseYamlArray(content, 'prerequisites');

        allWorkflows.push({
          name: frontmatter.name || slug,
          description: frontmatter.description || '',
          category,
          slug,
          complexity: frontmatter.complexity || 'medium',
          estimatedTime: frontmatter['estimated-time'] || '',
          agents,
          skills,
          commands,
          prerequisites,
          icon: catMeta.icon
        });

        // Generate complexity badge
        const complexityBadge = {
          low: '🟢 Low',
          medium: '🟡 Medium',
          high: '🟠 High',
          'very-high': '🔴 Very High'
        }[frontmatter.complexity] || '🟡 Medium';

        // Generate individual workflow page with enhanced structure
        const workflowDoc = `---
title: "${frontmatter.name || slug}"
description: "${frontmatter.description || ''}"
icon: "${catMeta.icon}"
---

<Info>
  **Category:** ${formatCategoryName(category)}

  **Complexity:** ${complexityBadge}

  **Estimated Time:** ${frontmatter['estimated-time'] || 'Varies'}
</Info>

## Quick Start

\`\`\`bash
/workflow:${slug} "your description here"
\`\`\`

${body}

${agents.length > 0 ? `
## Agents Used

This workflow orchestrates the following agents:

${agents.map(a => `- **[@${a}](/agents/${a})** - Specialized agent for ${a.replace(/-/g, ' ')} tasks`).join('\n')}
` : ''}

${skills.length > 0 ? `
## Skills Applied

${skills.map(s => `- **[${s}](/skills/${s})** - Domain expertise`).join('\n')}
` : ''}

${commands.length > 0 ? `
## Commands Triggered

${commands.map(c => `- \`${c}\``).join('\n')}
` : ''}

${prerequisites.length > 0 ? `
## Prerequisites

${prerequisites.map(p => `- ${p}`).join('\n')}
` : ''}

${generateWorkflowOrchestrationSection(`${category}/${slug}`)}

## Tips for Best Results

<Note>
Provide detailed context in your workflow description. Include specific requirements, constraints, and expected outcomes for optimal agent performance.
</Note>

## Related Workflows

<CardGroup cols={2}>
  <Card title="All Workflows" icon="diagram-project" href="/workflows/overview">
    See all 29 workflows
  </Card>
  <Card title="${formatCategoryName(category)}" icon="${catMeta.icon}" href="/workflows/overview#${category}">
    More ${category} workflows
  </Card>
</CardGroup>
`;

        await writeFile(join(outputDir, `${slug}.mdx`), workflowDoc);
      }
    } catch (e) {
      // Not a directory or error
    }
  }

  // Group workflows by category
  const workflowsByCategory = {};
  for (const wf of allWorkflows) {
    if (!workflowsByCategory[wf.category]) {
      workflowsByCategory[wf.category] = [];
    }
    workflowsByCategory[wf.category].push(wf);
  }

  const categoryOrder = ['development', 'ai-engineering', 'ai-ml', 'omega', 'sprint', 'security', 'database', 'api', 'fullstack', 'content', 'research', 'quality', 'microservices', 'event-driven', 'game-dev'];

  // Generate overview page with comprehensive structure
  const overviewDoc = `---
title: "Workflows Overview"
description: "29 orchestrated workflows for complete development processes"
icon: "diagram-project"
---

Workflows are **orchestrated sequences** of agents, commands, and skills that guide you through complete development processes. Each workflow ensures consistent, high-quality outcomes.

## At a Glance

<CardGroup cols={4}>
  <Card title="29" icon="diagram-project">
    Total Workflows
  </Card>
  <Card title="11" icon="folder">
    Categories
  </Card>
  <Card title="23" icon="robot">
    Agents Used
  </Card>
  <Card title="100%" icon="check">
    Quality Gates
  </Card>
</CardGroup>

## Workflow Categories

<CardGroup cols={2}>
${categoryOrder.map(cat => {
  const wfs = workflowsByCategory[cat] || [];
  const catMeta = WORKFLOW_CATEGORIES[cat] || { icon: 'diagram-project', description: '' };
  return `  <Card title="${formatCategoryName(cat)}" icon="${catMeta.icon}" href="#${cat}">
    **${wfs.length} workflows** - ${catMeta.description}
  </Card>`;
}).join('\n')}
</CardGroup>

## Choosing the Right Workflow

<AccordionGroup>
  <Accordion title="I need to build a new feature">
    Use **[Feature Development](/workflows/feature)** for complete feature implementation from planning to PR.
  </Accordion>
  <Accordion title="I need to fix a bug">
    Use **[Bug Fix](/workflows/bug-fix)** for systematic debugging and resolution.
  </Accordion>
  <Accordion title="I need to build a RAG system">
    Use **[RAG Development](/workflows/rag-development)** for complete RAG implementation with evaluation.
  </Accordion>
  <Accordion title="I need strategic improvements">
    Use **[10x Improvement](/workflows/10x-improvement)** for tactical enhancements or **[100x Architecture](/workflows/100x-architecture)** for system redesign.
  </Accordion>
  <Accordion title="I need to run a sprint">
    Use **[Sprint Setup](/workflows/sprint-setup)** → **[Sprint Execution](/workflows/sprint-execution)** → **[Sprint Retrospective](/workflows/sprint-retrospective)**.
  </Accordion>
  <Accordion title="I need a security audit">
    Use **[Security Audit](/workflows/security-audit)** for comprehensive security review.
  </Accordion>
</AccordionGroup>

---

${generateWorkflowCategoryTables(categoryOrder, workflowsByCategory)}

---

## How Workflows Work

<Steps>
  <Step title="Invoke Workflow">
    Run a workflow with \`/workflow:<name> "description"\`
  </Step>
  <Step title="Agent Orchestration">
    The workflow coordinates multiple specialized agents
  </Step>
  <Step title="Quality Gates">
    Each step has quality checkpoints to ensure standards
  </Step>
  <Step title="Completion">
    Workflow completes with documented outcomes
  </Step>
</Steps>

### Example: Feature Development

\`\`\`bash
# Start the feature workflow
/workflow:feature "user authentication with OAuth2"

# The workflow will:
# 1. Planning (planner agent)
# 2. Implementation (fullstack-developer agent)
# 3. Testing (tester agent)
# 4. Code Review (code-reviewer agent)
# 5. Commit & PR (git-manager agent)
\`\`\`

## Workflow Patterns

### Sequential Workflows

Run workflows one after another for comprehensive processes:

\`\`\`bash
# Research → Plan → Build
/workflow:best-practices "authentication patterns"
/workflow:feature "implement auth based on research"
\`\`\`

### Category-Specific Patterns

<Tabs>
  <Tab title="Development">
\`\`\`bash
# Feature lifecycle
/workflow:feature "new dashboard"
/workflow:refactor "optimize dashboard queries"
/workflow:code-review "dashboard components"
\`\`\`
  </Tab>
  <Tab title="AI Engineering">
\`\`\`bash
# RAG development lifecycle
/workflow:rag-development "knowledge base Q&A"
/workflow:model-evaluation "evaluate RAG performance"
/workflow:prompt-engineering "optimize retrieval prompts"
\`\`\`
  </Tab>
  <Tab title="Sprint">
\`\`\`bash
# Sprint lifecycle
/workflow:sprint-setup "Q1 Sprint 1"
/workflow:sprint-execution
/workflow:sprint-retrospective
\`\`\`
  </Tab>
</Tabs>

## Quality Gates

Every workflow includes quality gates that ensure:

<Check>Code meets project standards</Check>
<Check>Tests pass with adequate coverage</Check>
<Check>Security vulnerabilities addressed</Check>
<Check>Documentation updated</Check>
<Check>Review completed</Check>

## Next Steps

<CardGroup cols={2}>
  <Card title="Agents" icon="robot" href="/agents/overview">
    ${graphStats.agents} agents that power workflows
  </Card>
  <Card title="Commands" icon="terminal" href="/commands/overview">
    ${graphStats.commands} commands used in workflows
  </Card>
  <Card title="Skills" icon="brain" href="/skills/overview">
    ${graphStats.skills} skills applied in workflows
  </Card>
  <Card title="Sprint Management" icon="calendar-days" href="/concepts/sprint-management">
    Manage workflows across sprints
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${allWorkflows.length} workflow docs with enhanced structure`);
}

/**
 * Generate mint.json from docs structure
 */
async function generateMintJson() {
  try {
    const { generateMintJson: generate } = await import('./generate-mint-json.js');
    console.log('\nGenerating mint.json...');
    await generate();
  } catch (error) {
    console.error('Warning: Could not generate mint.json:', error.message);
  }
}

/**
 * Main
 */
/**
 * Update introduction.mdx with dynamic counts
 * This ensures the homepage always shows correct statistics
 */
async function updateIntroductionCounts() {
  const introPath = join(DOCS_DIR, 'introduction.mdx');

  try {
    let content = await readFile(introPath, 'utf-8');

    // Update agent count
    content = content.replace(
      /title="(\d+) Specialized Agents"/,
      `title="${graphStats.agents} Specialized Agents"`
    );

    // Update command count
    content = content.replace(
      /title="(\d+) Slash Commands"/,
      `title="${graphStats.commands} Slash Commands"`
    );

    // Update workflow count
    content = content.replace(
      /title="(\d+) Workflows"/,
      `title="${graphStats.workflows} Workflows"`
    );

    // Update skill count
    content = content.replace(
      /title="(\d+) Domain Skills"/,
      `title="${graphStats.skills} Domain Skills"`
    );

    await writeFile(introPath, content);
    console.log('Updated introduction.mdx with dynamic counts');
  } catch (error) {
    console.warn('Warning: Could not update introduction.mdx:', error.message);
  }
}

async function main() {
  console.log('OMGKIT Documentation Generator');
  console.log('==============================\n');

  try {
    // Initialize dependency graph first
    console.log('Building dependency graph...');
    await initDependencyGraph();
    console.log(`  Loaded ${graphStats.agents} agents, ${graphStats.skills} skills, ${graphStats.commands} commands, ${graphStats.workflows} workflows`);

    await generateAgentDocs();
    await generateCommandDocs();
    await generateSkillDocs();
    await generateModeDocs();
    await generateWorkflowDocs();

    // Update introduction.mdx with correct counts
    await updateIntroductionCounts();

    // Generate mint.json from docs structure
    await generateMintJson();

    console.log('\n✓ Documentation generated successfully!');
    console.log(`  Output: ${DOCS_DIR}`);
  } catch (error) {
    console.error('Error generating docs:', error);
    process.exit(1);
  }
}

main();
