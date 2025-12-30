#!/usr/bin/env node

/**
 * OMGKIT Documentation Generator v2.0
 * Generates comprehensive Mintlify documentation from plugin files
 * Enhanced with detailed structures, cross-references, and professional formatting
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
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
    triggersCommands: ['/plan', '/plan:detailed', '/plan:parallel'],
    bestFor: 'Feature planning, task decomposition, implementation roadmaps'
  },
  'researcher': {
    icon: 'magnifying-glass',
    category: 'Core Development',
    worksWellWith: ['planner', 'architect', 'oracle'],
    triggersCommands: ['/research'],
    bestFor: 'Technology research, best practices discovery, documentation lookup'
  },
  'debugger': {
    icon: 'bug',
    category: 'Core Development',
    worksWellWith: ['tester', 'scout', 'code-reviewer'],
    triggersCommands: ['/fix', '/fix-fast', '/fix-hard'],
    bestFor: 'Bug investigation, root cause analysis, error resolution'
  },
  'tester': {
    icon: 'flask-vial',
    category: 'Core Development',
    worksWellWith: ['debugger', 'code-reviewer', 'fullstack-developer'],
    triggersCommands: ['/test', '/tdd', '/fix-test'],
    bestFor: 'Test creation, coverage improvement, quality assurance'
  },
  'code-reviewer': {
    icon: 'magnifying-glass-chart',
    category: 'Core Development',
    worksWellWith: ['security-auditor', 'tester', 'architect'],
    triggersCommands: ['/review'],
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
    triggersCommands: ['/commit', '/pr', '/ship', '/cm', '/cp'],
    bestFor: 'Version control, commit management, PR automation'
  },
  'docs-manager': {
    icon: 'book',
    category: 'Operations',
    worksWellWith: ['api-designer', 'architect', 'copywriter'],
    triggersCommands: ['/doc'],
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
    triggersCommands: ['/screenshot', '/cro'],
    bestFor: 'UI components, responsive design, accessibility'
  },
  'fullstack-developer': {
    icon: 'code',
    category: 'Extended',
    worksWellWith: ['planner', 'tester', 'code-reviewer'],
    triggersCommands: ['/feature', '/fix', '/refactor'],
    bestFor: 'Full implementation, code writing, feature development'
  },
  'cicd-manager': {
    icon: 'circle-nodes',
    category: 'Extended',
    worksWellWith: ['pipeline-architect', 'tester'],
    triggersCommands: ['/deploy', '/fix-ci'],
    bestFor: 'CI/CD pipelines, GitHub Actions, deployment automation'
  },
  'security-auditor': {
    icon: 'shield-halved',
    category: 'Extended',
    worksWellWith: ['code-reviewer', 'vulnerability-scanner'],
    triggersCommands: ['/security-scan'],
    bestFor: 'Security reviews, vulnerability assessment, compliance'
  },
  'api-designer': {
    icon: 'plug',
    category: 'Extended',
    worksWellWith: ['docs-manager', 'fullstack-developer'],
    triggersCommands: ['/api-gen'],
    bestFor: 'API design, OpenAPI specs, REST best practices'
  },
  'vulnerability-scanner': {
    icon: 'shield-virus',
    category: 'Extended',
    worksWellWith: ['security-auditor', 'cicd-manager'],
    triggersCommands: ['/security-scan'],
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
    triggersCommands: ['/brainstorm'],
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
    triggersCommands: ['/10x', '/100x', '/1000x', '/principles'],
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
  sprint: { icon: 'calendar-days', description: 'Sprint and team management commands' }
};

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

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
    54 commands that utilize agents
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
        const slug = basename(file, '.md');
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
        const commandDoc = `---
title: "/${slug}"
description: "${frontmatter.description || ''}"
icon: "${catMeta.icon}"
---

<Info>
  **Category:** ${category.charAt(0).toUpperCase() + category.slice(1)}

  **Syntax:** \`/${slug}${frontmatter['argument-hint'] ? ' ' + frontmatter['argument-hint'] : ''}\`
</Info>

## Overview

${frontmatter.description || 'No description available.'}

## Quick Start

\`\`\`bash
/${slug}${frontmatter['argument-hint'] ? ' ' + frontmatter['argument-hint'].split(' ')[0].replace('<', '"').replace('>', '"') : ''}
\`\`\`

${processedBody}

${tools.length > 0 ? `
## Tools Used

This command uses the following tools:

${tools.map(t => `- **${t}** - Enables ${t.toLowerCase()} capabilities`).join('\n')}
` : ''}

## Examples

### Basic Usage

\`\`\`bash
/${slug}${frontmatter['argument-hint'] ? ' "your input here"' : ''}
\`\`\`

### With Context

\`\`\`bash
# First, ensure context is loaded
/index

# Then run the command
/${slug}${frontmatter['argument-hint'] ? ' "detailed description"' : ''}
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
    See all 54 commands
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
description: "54 slash commands for every development task"
icon: "terminal"
---

OMGKIT provides **54 slash commands** covering the entire development lifecycle. Commands are grouped by purpose and automatically route to the appropriate agent.

## At a Glance

<CardGroup cols={4}>
  <Card title="54" icon="terminal">
    Total Commands
  </Card>
  <Card title="8" icon="folder">
    Categories
  </Card>
  <Card title="23" icon="robot">
    Backing Agents
  </Card>
  <Card title="9" icon="sliders">
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
| Plan a feature | \`/plan\` | \`/plan "user authentication"\` |
| Implement feature | \`/feature\` | \`/feature "add login form"\` |
| Fix a bug | \`/fix\` | \`/fix "button not clickable"\` |
| Write tests | \`/test\` | \`/test "AuthService"\` |
| Code review | \`/review\` | \`/review src/components/\` |
| Commit changes | \`/commit\` | \`/commit\` |
| Create PR | \`/pr\` | \`/pr\` |
| Research tech | \`/research\` | \`/research "GraphQL best practices"\` |

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
${cmds.map(c => `| [\`/${c.slug}\`](/commands/${c.slug}) | ${c.description.slice(0, 40)}${c.description.length > 40 ? '...' : ''} | \`/${c.slug}${c.argumentHint ? ' ' + c.argumentHint : ''}\` |`).join('\n')}
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
/plan "user profile page"

# 2. Execute the plan
/execute-plan

# 3. Write tests
/test "ProfilePage"

# 4. Review code
/review src/pages/Profile.tsx

# 5. Commit and PR
/commit && /pr
\`\`\`
  </Tab>
  <Tab title="Bug Fixing">
\`\`\`bash
# 1. Quick fix
/fix "login fails on mobile"

# 2. Or detailed investigation
/fix-hard "login fails on mobile"

# 3. Run tests
/test

# 4. Commit
/commit
\`\`\`
  </Tab>
  <Tab title="Strategic Thinking">
\`\`\`bash
# 1. Activate Omega mode
/mode omega

# 2. Find 10x opportunities
/10x "our checkout flow"

# 3. Or 100x moonshots
/100x "our entire product"

# 4. Get principles
/principles
\`\`\`
  </Tab>
</Tabs>

### Command Chaining

Commands can be chained for complex workflows:

\`\`\`bash
# Plan, implement, test, commit in sequence
/plan "feature" && /execute-plan && /test && /commit

# Research before planning
/research "best practices" && /plan "implement findings"
\`\`\`

## Command Modes

Commands behave differently based on the active mode:

| Mode | Effect on Commands |
|------|-------------------|
| **Default** | Standard behavior |
| **Omega** | Enhanced strategic thinking |
| **Token Efficient** | Minimal context, faster responses |
| **Autonomous** | Less confirmation prompts |

Switch modes with \`/mode <mode-name>\`.

## Next Steps

<CardGroup cols={2}>
  <Card title="Agents" icon="robot" href="/agents/overview">
    23 agents that power these commands
  </Card>
  <Card title="Modes" icon="sliders" href="/modes/overview">
    9 behavioral modes
  </Card>
  <Card title="Skills" icon="brain" href="/skills/overview">
    43 domain expertise modules
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
 * Skill category metadata
 */
const SKILL_CATEGORIES = {
  languages: { icon: 'code', description: 'Programming language expertise' },
  frameworks: { icon: 'layer-group', description: 'Framework-specific patterns and best practices' },
  databases: { icon: 'database', description: 'Database design and optimization' },
  frontend: { icon: 'palette', description: 'Frontend tooling, styling, and UI patterns' },
  devops: { icon: 'server', description: 'Infrastructure, containers, and CI/CD' },
  security: { icon: 'shield-halved', description: 'Security best practices and authentication' },
  testing: { icon: 'flask-vial', description: 'Testing frameworks and strategies' },
  methodology: { icon: 'diagram-project', description: 'Development methodologies and workflows' },
  omega: { icon: 'wand-magic-sparkles', description: 'Omega-level development practices' }
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

  const categoryOrder = ['languages', 'frameworks', 'databases', 'frontend', 'devops', 'security', 'testing', 'methodology', 'omega'];

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
  return `  <Card title="${cat.charAt(0).toUpperCase() + cat.slice(1)}" icon="${catMeta.icon}" href="#${cat}">
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
## ${cat.charAt(0).toUpperCase() + cat.slice(1)}

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
    23 agents that use skills
  </Card>
  <Card title="Configuration" icon="gear" href="/getting-started/configuration">
    Configure skill preferences
  </Card>
  <Card title="Commands" icon="terminal" href="/commands/overview">
    54 commands available
  </Card>
  <Card title="Modes" icon="sliders" href="/modes/overview">
    9 behavioral modes
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${allSkills.length} skill docs with enhanced structure`);
}

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
    See all 9 modes
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
description: "9 behavioral modes for different development contexts"
icon: "sliders"
---

Modes change how OMGKIT behaves. Switch modes to **optimize for different tasks** - from creative brainstorming to efficient execution.

## At a Glance

<CardGroup cols={4}>
  <Card title="9" icon="sliders">
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
    **${(modesByCategory['Standard'] || []).length} modes** - Everyday development (Default, Implementation, Review)
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
 * Main
 */
async function main() {
  console.log('OMGKIT Documentation Generator');
  console.log('==============================\n');

  try {
    await generateAgentDocs();
    await generateCommandDocs();
    await generateSkillDocs();
    await generateModeDocs();

    console.log('\n✓ Documentation generated successfully!');
    console.log(`  Output: ${DOCS_DIR}`);
  } catch (error) {
    console.error('Error generating docs:', error);
    process.exit(1);
  }
}

main();
