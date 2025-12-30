#!/usr/bin/env node

/**
 * OMGKIT Documentation Generator
 * Generates Mintlify documentation from plugin files
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PLUGIN_DIR = join(ROOT, 'plugin');
const DOCS_DIR = join(ROOT, 'docs');

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
 * Generate agent documentation
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

    agentsList.push({
      name: frontmatter.name || slug,
      description: frontmatter.description || '',
      slug,
      tools: frontmatter.tools || '',
      model: frontmatter.model || 'inherit'
    });

    // Generate individual agent page
    const agentDoc = `---
title: "${frontmatter.name || slug}"
description: "${frontmatter.description || ''}"
---

<Info>
  **Tools:** ${frontmatter.tools || 'Standard tools'}

  **Model:** ${frontmatter.model || 'inherit'}
</Info>

${body}

## Usage

\`\`\`bash
# Direct invocation
@${slug} "your task here"

# Or use related commands
\`\`\`

## Related

<CardGroup cols={2}>
  <Card title="All Agents" icon="robot" href="/agents/overview">
    See all 23 agents
  </Card>
  <Card title="AI Team" icon="users" href="/concepts/ai-team">
    How agents collaborate
  </Card>
</CardGroup>
`;

    await writeFile(join(outputDir, `${slug}.mdx`), agentDoc);
  }

  // Generate overview page
  const overviewDoc = `---
title: "Agents Overview"
description: "23 specialized AI agents for every development task"
---

OMGKIT includes 23 specialized agents, each expert in their domain.

## Agent Categories

<CardGroup cols={2}>
  <Card title="Core Development" icon="code">
    Planning, research, debugging, testing, review, exploration
  </Card>
  <Card title="Operations" icon="gears">
    Git, docs, project management, database, UI/UX
  </Card>
  <Card title="Extended" icon="puzzle-piece">
    Fullstack, CI/CD, security, API design, pipelines
  </Card>
  <Card title="Creative" icon="palette">
    Copy, brainstorming, journaling
  </Card>
</CardGroup>

## All Agents

| Agent | Description | Tools |
|-------|-------------|-------|
${agentsList.map(a => `| [${a.name}](/agents/${a.slug}) | ${a.description.slice(0, 60)}... | ${a.tools.split(',').slice(0, 3).join(', ')} |`).join('\n')}

## Using Agents

### Direct Invocation

\`\`\`bash
@planner "plan the checkout feature"
@tester "write tests for AuthService"
@code-reviewer "review src/components/"
\`\`\`

### Via Commands

Most commands automatically route to the appropriate agent:

\`\`\`bash
/plan → planner
/test → tester
/review → code-reviewer
/commit → git-manager
\`\`\`

### In Team Mode

When running \`/team:run\`, the Sprint Master assigns agents to tasks automatically.

## Next Steps

<CardGroup cols={2}>
  <Card title="AI Team" icon="users" href="/concepts/ai-team">
    How agents collaborate
  </Card>
  <Card title="Commands" icon="terminal" href="/commands/overview">
    Commands that use agents
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${mdFiles.length} agent docs`);
}

/**
 * Generate command documentation
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

        allCommands.push({
          slug,
          category,
          description: frontmatter.description || '',
          argumentHint: frontmatter['argument-hint'] || '',
          allowedTools: frontmatter['allowed-tools'] || ''
        });

        // Generate individual command page
        const commandDoc = `---
title: "/${slug}"
description: "${frontmatter.description || ''}"
---

${frontmatter['argument-hint'] ? `<Info>**Usage:** \`/${slug} ${frontmatter['argument-hint']}\`</Info>` : ''}

${body}

${frontmatter['allowed-tools'] ? `## Tools Used\n\n${frontmatter['allowed-tools']}` : ''}

## Related Commands

<CardGroup cols={2}>
  <Card title="All Commands" icon="terminal" href="/commands/overview">
    See all 54 commands
  </Card>
  <Card title="${category} Commands" icon="folder" href="/commands/overview#${category}">
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

  const categoryIcons = {
    dev: 'code',
    planning: 'map',
    git: 'code-branch',
    quality: 'shield-check',
    context: 'layer-group',
    design: 'palette',
    omega: 'wand-magic-sparkles',
    sprint: 'calendar'
  };

  const overviewDoc = `---
title: "Commands Overview"
description: "54 slash commands for every development task"
---

OMGKIT provides 54 slash commands covering the entire development lifecycle.

## Quick Reference

${Object.entries(commandsByCategory).map(([cat, cmds]) => `
### ${cat.charAt(0).toUpperCase() + cat.slice(1)} {#${cat}}

| Command | Description |
|---------|-------------|
${cmds.map(c => `| [\`/${c.slug}\`](/commands/${c.slug}) | ${c.description.slice(0, 50)}${c.description.length > 50 ? '...' : ''} |`).join('\n')}
`).join('\n')}

## Command Categories

<CardGroup cols={2}>
${Object.entries(commandsByCategory).map(([cat, cmds]) => `  <Card title="${cat.charAt(0).toUpperCase() + cat.slice(1)}" icon="${categoryIcons[cat] || 'terminal'}">
    ${cmds.length} commands for ${cat} tasks
  </Card>`).join('\n')}
</CardGroup>

## Usage Patterns

### Basic Usage

\`\`\`bash
/command argument
/command "argument with spaces"
/command --flag value
\`\`\`

### Common Workflows

\`\`\`bash
# Feature development
/feature "add user authentication"

# Quick bug fix
/fix "login not working"

# Full planning
/plan "checkout flow" && /execute-plan

# Git workflow
/commit && /pr
\`\`\`

## Next Steps

<CardGroup cols={2}>
  <Card title="Agents" icon="robot" href="/agents/overview">
    Agents that power commands
  </Card>
  <Card title="Modes" icon="sliders" href="/modes/overview">
    Behavioral modes
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${allCommands.length} command docs`);
}

/**
 * Generate skill documentation
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

          allSkills.push({
            name: frontmatter.name || item,
            description: frontmatter.description || '',
            category,
            slug: item
          });

          // Generate individual skill page
          const skillDoc = `---
title: "${frontmatter.name || item}"
description: "${frontmatter.description || ''}"
---

${body}

## Related Skills

<CardGroup cols={2}>
  <Card title="All Skills" icon="brain" href="/skills/overview">
    See all 43 skills
  </Card>
  <Card title="${category}" icon="folder" href="/skills/overview#${category}">
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

  const overviewDoc = `---
title: "Skills Overview"
description: "43 domain expertise modules for languages, frameworks, and tools"
---

Skills provide deep domain expertise that agents use when working with specific technologies.

## Skill Categories

<CardGroup cols={2}>
  <Card title="Languages" icon="code">
    Python, TypeScript, JavaScript, and more
  </Card>
  <Card title="Frameworks" icon="layer-group">
    Next.js, React, Vue, Express, Django, and more
  </Card>
  <Card title="Databases" icon="database">
    PostgreSQL, MongoDB, Redis, Prisma
  </Card>
  <Card title="Frontend" icon="palette">
    Tailwind CSS, shadcn/ui, and more
  </Card>
</CardGroup>

## All Skills

${Object.entries(skillsByCategory).map(([cat, skills]) => `
### ${cat.charAt(0).toUpperCase() + cat.slice(1)} {#${cat}}

| Skill | Description |
|-------|-------------|
${skills.map(s => `| [${s.name}](/skills/${s.slug}) | ${s.description.slice(0, 60)}${s.description.length > 60 ? '...' : ''} |`).join('\n')}
`).join('\n')}

## How Skills Work

When agents work on your code, they automatically:

1. **Detect** technologies in your project
2. **Load** relevant skills
3. **Apply** best practices and patterns

For example, when working on a Next.js project:
- The **Next.js skill** provides App Router patterns
- The **React skill** provides component patterns
- The **TypeScript skill** ensures type safety

## Next Steps

<CardGroup cols={2}>
  <Card title="Agents" icon="robot" href="/agents/overview">
    Agents that use skills
  </Card>
  <Card title="Configuration" icon="gear" href="/getting-started/configuration">
    Configure skill preferences
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${allSkills.length} skill docs`);
}

/**
 * Generate mode documentation
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

    allModes.push({
      name: frontmatter.name || slug,
      description: frontmatter.description || '',
      slug
    });

    // Generate individual mode page
    const modeDoc = `---
title: "${frontmatter.name || slug} Mode"
description: "${frontmatter.description || ''}"
---

${body}

## Activation

\`\`\`bash
/mode ${slug}
\`\`\`

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

  // Generate overview page
  const overviewDoc = `---
title: "Modes Overview"
description: "9 behavioral modes for different development contexts"
---

Modes change how OMGKIT behaves. Switch modes to optimize for different tasks.

## Available Modes

| Mode | Description | Best For |
|------|-------------|----------|
${allModes.map(m => `| [${m.name}](/modes/${m.slug}) | ${m.description.slice(0, 40)}... | Various |`).join('\n')}

## Mode Categories

<CardGroup cols={2}>
  <Card title="Standard Modes" icon="sliders">
    **Default**, **Implementation**, **Review** - Everyday development
  </Card>
  <Card title="Creative Modes" icon="lightbulb">
    **Brainstorm**, **Deep Research** - Exploration and analysis
  </Card>
  <Card title="Efficiency Modes" icon="gauge-high">
    **Token Efficient**, **Orchestration** - Optimized workflows
  </Card>
  <Card title="Omega Modes" icon="wand-magic-sparkles">
    **Omega**, **Autonomous** - Advanced AI capabilities
  </Card>
</CardGroup>

## Switching Modes

\`\`\`bash
# Switch to a mode
/mode omega

# Check current mode
/mode

# Temporary mode for one command
/mode brainstorm && /brainstorm "new feature ideas"
\`\`\`

## Mode Persistence

- Modes persist for the session
- Configure default mode in \`.omgkit/config.yaml\`
- Some commands auto-switch modes temporarily

## Next Steps

<CardGroup cols={2}>
  <Card title="Omega Philosophy" icon="atom" href="/concepts/omega-philosophy">
    Understanding Omega mode
  </Card>
  <Card title="Configuration" icon="gear" href="/getting-started/configuration">
    Set default mode
  </Card>
</CardGroup>
`;

  await writeFile(join(outputDir, 'overview.mdx'), overviewDoc);
  console.log(`Generated ${mdFiles.length} mode docs`);
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
