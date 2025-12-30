#!/usr/bin/env node

/**
 * Generate enhanced MDX documentation from command .md files
 * Usage: node scripts/generate-command-docs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = path.join(__dirname, '../plugin/commands');
const DOCS_DIR = path.join(__dirname, '../docs/commands');

// Category icons
const categoryIcons = {
  context: 'bookmark',
  design: 'palette',
  dev: 'code',
  git: 'code-branch',
  omega: 'star',
  planning: 'map',
  quality: 'check-double',
  sprint: 'person-running',
};

// Command-specific icons
const commandIcons = {
  // Dev
  'feature': 'rocket',
  'fix': 'wrench',
  'fix-fast': 'bolt',
  'fix-hard': 'hammer',
  'fix-test': 'flask',
  'fix-ci': 'circle-check',
  'fix-logs': 'file-lines',
  'review': 'magnifying-glass',
  'test': 'vial',
  'tdd': 'rotate',
  // Planning
  'plan': 'clipboard-list',
  'plan-detailed': 'list-check',
  'plan-parallel': 'diagram-project',
  'brainstorm': 'lightbulb',
  'execute-plan': 'play',
  'research': 'book-open',
  'doc': 'file-lines',
  'ask': 'circle-question',
  // Git
  'commit': 'check',
  'ship': 'ship',
  'pr': 'code-pull-request',
  'deploy': 'cloud-arrow-up',
  'cm': 'message',
  'cp': 'copy',
  // Quality
  'security-scan': 'shield-halved',
  'api-gen': 'gears',
  'refactor': 'wand-magic-sparkles',
  'optimize': 'gauge-high',
  'lint': 'broom',
  // Context
  'mode': 'sliders',
  'index': 'database',
  'load': 'download',
  'checkpoint': 'bookmark',
  'spawn': 'users',
  'spawn-collect': 'users-gear',
  // Design
  'screenshot': 'camera',
  'fast': 'forward-fast',
  'good': 'star',
  'cro': 'chart-line',
  'enhance': 'wand-magic-sparkles',
  // Omega
  '10x': 'arrow-up-right-dots',
  '100x': 'chart-line',
  '1000x': 'rocket',
  'principles': 'scroll',
  'dimensions': 'cube',
  // Sprint
  'init': 'flag',
  'vision-set': 'eye',
  'vision-show': 'eye',
  'sprint-new': 'plus',
  'sprint-start': 'play',
  'sprint-current': 'circle-info',
  'sprint-end': 'flag-checkered',
  'backlog-add': 'plus-circle',
  'backlog-show': 'list',
  'backlog-prioritize': 'arrow-up-wide-short',
  'team-run': 'users',
  'team-status': 'chart-bar',
  'team-ask': 'comments',
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length).trim();

  const frontmatter = {};
  for (const line of frontmatterStr.split('\n')) {
    if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      frontmatter[key.trim()] = valueParts.join(':').trim();
    }
  }

  return { frontmatter, body };
}

function generateCommandMDX(commandPath, category, commandName) {
  const content = fs.readFileSync(commandPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  const icon = commandIcons[commandName] || categoryIcons[category] || 'terminal';
  const title = `/${commandName}`;
  const description = frontmatter.description || `${commandName} command`;

  // Format the body content - escape angle brackets for MDX
  const formattedBody = body
    .replace(/<(?!\/?(Info|Warning|Note|Check|Card|CardGroup|Accordion|AccordionGroup|Tabs|Tab|Steps|Step)[>\s])/g, '\\<')
    .replace(/(?<!\\)<\/(?!(Info|Warning|Note|Check|Card|CardGroup|Accordion|AccordionGroup|Tabs|Tab|Steps|Step)>)/g, '\\</')
    .replace(/\{(?![{%])/g, '\\{')
    .replace(/(?<![%}])\}/g, '\\}');

  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);
  const syntax = frontmatter.syntax || `/${commandName}`;

  const mdx = `---
title: "${title}"
description: "${description}"
icon: "${icon}"
---

<Info>
  **Category:** ${categoryDisplay}

  **Syntax:** \`${syntax}\`
</Info>

## Overview

${description}

## Quick Start

\`\`\`bash
${syntax}
\`\`\`

${formattedBody}

## Tools Used

This command leverages the following capabilities:

<Check>**Task** - Orchestrates complex multi-step operations</Check>
<Check>**Read** - Analyzes files and codebase context</Check>
<Check>**Write** - Creates and modifies files</Check>
<Check>**Bash** - Executes system commands</Check>
<Check>**Grep** - Searches code patterns</Check>
<Check>**Glob** - Finds files by pattern</Check>

## Examples

### Basic Usage

\`\`\`bash
${syntax}
\`\`\`

### With Context

\`\`\`bash
# First, ensure context is loaded
/index

# Then run the command
${syntax}
\`\`\`

### Combined with Other Commands

\`\`\`bash
# Example workflow
/plan "describe your goal"
${syntax}
/commit
\`\`\`

## Best Practices

<Check>Be specific in your descriptions</Check>
<Check>Include relevant file paths when applicable</Check>
<Check>Use in combination with other commands for complex workflows</Check>
<Check>Run \`/index\` first for full codebase context</Check>

## Tips

<Note>
For best results, provide detailed descriptions and include relevant context about your project structure.
</Note>

## Troubleshooting

<AccordionGroup>
  <Accordion title="Command not found">
    Make sure OMGKIT is installed: \`npx omgkit --version\`
  </Accordion>
  <Accordion title="Unexpected results">
    Try running \`/index\` first to refresh codebase context.
  </Accordion>
  <Accordion title="Command taking too long">
    For complex tasks, break them down into smaller steps or use \`/mode token-efficient\`.
  </Accordion>
</AccordionGroup>

## Related Commands

<CardGroup cols={2}>
  <Card title="All Commands" icon="terminal" href="/commands/overview">
    See all 54 commands
  </Card>
  <Card title="${categoryDisplay} Commands" icon="${categoryIcons[category] || 'folder'}" href="/commands/overview#${category}">
    More ${category} commands
  </Card>
</CardGroup>
`;

  return mdx;
}

function getAllCommands() {
  const commands = [];

  const categories = fs.readdirSync(COMMANDS_DIR).filter(f => {
    const stat = fs.statSync(path.join(COMMANDS_DIR, f));
    return stat.isDirectory() && !f.startsWith('.');
  });

  for (const category of categories) {
    const categoryPath = path.join(COMMANDS_DIR, category);
    const commandFiles = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'));

    for (const file of commandFiles) {
      const commandName = file.replace('.md', '');
      commands.push({
        category,
        name: commandName,
        path: path.join(categoryPath, file),
      });
    }
  }

  return commands;
}

function main() {
  console.log('Generating command documentation...\n');

  const commands = getAllCommands();
  console.log(`Found ${commands.length} commands\n`);

  // Check which docs exist
  const existingDocs = new Set(
    fs.readdirSync(DOCS_DIR)
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
  );

  let enhanced = 0;
  let skipped = 0;

  for (const command of commands) {
    const docPath = path.join(DOCS_DIR, `${command.name}.mdx`);
    const mdx = generateCommandMDX(command.path, command.category, command.name);

    if (existingDocs.has(command.name)) {
      // Check if it's a simple doc that needs enhancement
      const existing = fs.readFileSync(docPath, 'utf8');
      if (existing.split('\n').length < 120) {
        fs.writeFileSync(docPath, mdx);
        console.log(`✓ Enhanced: ${command.name}`);
        enhanced++;
      } else {
        console.log(`- Skipped (already detailed): ${command.name}`);
        skipped++;
      }
    } else {
      fs.writeFileSync(docPath, mdx);
      console.log(`✓ Created: ${command.name}`);
      enhanced++;
    }
  }

  console.log(`\nDone! Enhanced: ${enhanced}, Skipped: ${skipped}`);
}

main();
