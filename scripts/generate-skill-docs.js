#!/usr/bin/env node

/**
 * Generate MDX documentation from SKILL.md files
 * Usage: node scripts/generate-skill-docs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_DIR = path.join(__dirname, '../plugin/skills');
const DOCS_DIR = path.join(__dirname, '../docs/skills');

// Icon mapping for categories
const categoryIcons = {
  backend: 'server',
  databases: 'database',
  devops: 'cloud',
  frameworks: 'layer-group',
  frontend: 'palette',
  integrations: 'plug',
  languages: 'code',
  methodology: 'brain',
  mobile: 'mobile',
  omega: 'star',
  security: 'shield',
  testing: 'flask',
  tools: 'wrench',
};

// Skill-specific icons
const skillIcons = {
  'api-architecture': 'sitemap',
  'caching-strategies': 'bolt',
  'event-driven-architecture': 'diagram-project',
  'real-time-systems': 'signal',
  'database-optimization': 'gauge-high',
  'monorepo-management': 'folder-tree',
  'observability': 'chart-line',
  'performance-profiling': 'stopwatch',
  'advanced-ui-design': 'wand-magic-sparkles',
  'ai-integration': 'robot',
  'payment-integration': 'credit-card',
  'problem-solving': 'lightbulb',
  'research-validation': 'magnifying-glass-chart',
  'sequential-thinking': 'list-ol',
  'mobile-development': 'mobile-screen',
  'security-hardening': 'lock',
  'document-processing': 'file-lines',
  'image-processing': 'image',
  'mcp-development': 'microchip',
  'media-processing': 'video',
};

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length).trim();

  const frontmatter = {};
  let currentKey = null;
  let currentArray = null;

  for (const line of frontmatterStr.split('\n')) {
    if (line.startsWith('  - ')) {
      if (currentArray) {
        currentArray.push(line.slice(4));
      }
    } else if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      currentKey = key.trim();
      if (value) {
        frontmatter[currentKey] = value;
        currentArray = null;
      } else {
        frontmatter[currentKey] = [];
        currentArray = frontmatter[currentKey];
      }
    }
  }

  return { frontmatter, body };
}

function extractSections(body) {
  const sections = {};
  const lines = body.split('\n');
  let currentSection = null;
  let currentContent = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }
      currentSection = line.slice(3).trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

function generateMDX(skillPath, category, skillName) {
  const content = fs.readFileSync(skillPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);
  const sections = extractSections(body);

  const icon = skillIcons[skillName] || categoryIcons[category] || 'code';
  const title = frontmatter.name || skillName;
  const description = frontmatter.description || `${skillName} skill documentation`;

  // Format the body content - escape angle brackets for MDX
  const formattedBody = body
    .replace(/<(?!\/?(Info|Warning|Note|Check|Card|CardGroup|Accordion|AccordionGroup|Tabs|Tab)[>\s])/g, '\\<')
    .replace(/(?<!\\)<\/(?!(Info|Warning|Note|Check|Card|CardGroup|Accordion|AccordionGroup|Tabs|Tab)>)/g, '\\</')
    .replace(/\{(?![{%])/g, '\\{')
    .replace(/(?<![%}])\}/g, '\\}');

  const triggers = Array.isArray(frontmatter.triggers)
    ? frontmatter.triggers.join(', ')
    : '';

  const categoryDisplay = category.charAt(0).toUpperCase() + category.slice(1);

  const mdx = `---
title: "${title}"
description: "${description}"
icon: "${icon}"
---

<Info>
  **Category:** ${categoryDisplay}

  **Auto-Detection:** OMGKIT automatically detects when this skill is needed based on your project files and context.

  ${triggers ? `**Triggers:** ${triggers}` : ''}
</Info>

## Overview

${description}

## What You Get

When this skill is active, agents automatically apply:

<Check>Industry best practices and patterns</Check>
<Check>Production-ready code examples</Check>
<Check>Security considerations</Check>
<Check>Performance optimizations</Check>
<Check>Comprehensive error handling</Check>

${formattedBody}

## Configuration

You can customize skill behavior in your project config:

\`\`\`yaml
# .omgkit/config.yaml
skills:
  ${skillName}:
    enabled: true
    # Add skill-specific settings here
\`\`\`

## When This Skill Activates

OMGKIT detects and activates this skill when:

- You mention relevant keywords in your prompts
- Project files match the skill's domain
- Configuration files indicate this technology
- Package dependencies suggest this skill is needed

## Troubleshooting

<AccordionGroup>
  <Accordion title="Skill not activating">
    Ensure your project has relevant files or explicitly mention the technology in your prompt.
  </Accordion>
  <Accordion title="Unexpected patterns suggested">
    Check your project's configuration to ensure it matches your actual stack.
  </Accordion>
  <Accordion title="Missing best practices">
    Run \`/index\` to refresh codebase context and ensure full analysis.
  </Accordion>
</AccordionGroup>

## Related Skills

<CardGroup cols={2}>
  <Card title="All Skills" icon="brain" href="/skills/overview">
    See all 72 skills
  </Card>
  <Card title="${categoryDisplay}" icon="${categoryIcons[category] || 'folder'}" href="/skills/overview#${category}">
    More ${category} skills
  </Card>
</CardGroup>
`;

  return mdx;
}

function getAllSkills() {
  const skills = [];

  const categories = fs.readdirSync(SKILLS_DIR).filter(f => {
    const stat = fs.statSync(path.join(SKILLS_DIR, f));
    return stat.isDirectory() && !f.startsWith('.');
  });

  for (const category of categories) {
    const categoryPath = path.join(SKILLS_DIR, category);
    const skillFolders = fs.readdirSync(categoryPath).filter(f => {
      const stat = fs.statSync(path.join(categoryPath, f));
      return stat.isDirectory();
    });

    for (const skill of skillFolders) {
      const skillPath = path.join(categoryPath, skill, 'SKILL.md');
      if (fs.existsSync(skillPath)) {
        skills.push({
          category,
          name: skill,
          path: skillPath,
        });
      }
    }
  }

  return skills;
}

function main() {
  console.log('Generating skill documentation...\n');

  const skills = getAllSkills();
  console.log(`Found ${skills.length} skills\n`);

  // Check which docs exist
  const existingDocs = new Set(
    fs.readdirSync(DOCS_DIR)
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
  );

  let created = 0;
  let updated = 0;

  for (const skill of skills) {
    const docPath = path.join(DOCS_DIR, `${skill.name}.mdx`);
    const mdx = generateMDX(skill.path, skill.category, skill.name);

    if (existingDocs.has(skill.name)) {
      // Check if it's a simple doc that needs enhancement (under 250 lines)
      const existing = fs.readFileSync(docPath, 'utf8');
      if (existing.split('\n').length < 250) {
        fs.writeFileSync(docPath, mdx);
        console.log(`✓ Enhanced: ${skill.name}`);
        updated++;
      } else {
        console.log(`- Skipped (already detailed): ${skill.name}`);
      }
    } else {
      fs.writeFileSync(docPath, mdx);
      console.log(`✓ Created: ${skill.name}`);
      created++;
    }
  }

  console.log(`\nDone! Created: ${created}, Updated: ${updated}`);
}

main();
