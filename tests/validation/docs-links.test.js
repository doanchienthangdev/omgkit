/**
 * Documentation Link Validation Tests
 *
 * Validates that all documentation links are valid and pages are properly configured.
 * This helps catch broken links before deployment to Mintlify.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');
const DOCS_DIR = join(ROOT_DIR, 'docs');

/**
 * Parse mint.json and extract all page references
 */
function getMintJsonPages() {
  const mintPath = join(DOCS_DIR, 'mint.json');
  const content = readFileSync(mintPath, 'utf8');
  const mint = JSON.parse(content);

  const pages = [];
  for (const nav of mint.navigation || []) {
    if (nav.pages) {
      for (const page of nav.pages) {
        pages.push({
          path: page,
          group: nav.group
        });
      }
    }
  }
  return pages;
}

/**
 * Parse frontmatter from an MDX file
 */
function parseFrontmatter(filePath) {
  if (!existsSync(filePath)) return null;

  const content = readFileSync(filePath, 'utf8');
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const keyMatch = line.match(/^(\w+):\s*"?([^"]*)"?$/);
    if (keyMatch) {
      frontmatter[keyMatch[1]] = keyMatch[2];
    }
  }
  return frontmatter;
}

/**
 * Extract internal links from MDX content
 */
function extractInternalLinks(filePath) {
  if (!existsSync(filePath)) return [];

  const content = readFileSync(filePath, 'utf8');
  const links = [];

  // Match markdown links like [text](/path/to/page)
  const markdownMatches = content.matchAll(/\[([^\]]+)\]\(\/([^)]+)\)/g);
  for (const match of markdownMatches) {
    links.push({
      text: match[1],
      path: match[2],
      source: filePath
    });
  }

  // Match href attributes like href="/path/to/page"
  const hrefMatches = content.matchAll(/href="\/([^"]+)"/g);
  for (const match of hrefMatches) {
    links.push({
      text: '',
      path: match[1],
      source: filePath
    });
  }

  return links;
}

describe('Documentation Link Validation', () => {
  describe('Mint.json Page References', () => {
    const pages = getMintJsonPages();

    it('all pages in mint.json should have corresponding .mdx files', () => {
      const missingFiles = [];
      for (const page of pages) {
        const filePath = join(DOCS_DIR, page.path + '.mdx');
        if (!existsSync(filePath)) {
          missingFiles.push(`${page.path} (in group: ${page.group})`);
        }
      }
      expect(missingFiles, `Missing .mdx files:\n${missingFiles.join('\n')}`).toHaveLength(0);
    });

    it('should have no duplicate page references', () => {
      const pathCounts = {};
      for (const page of pages) {
        pathCounts[page.path] = (pathCounts[page.path] || 0) + 1;
      }

      const duplicates = Object.entries(pathCounts)
        .filter(([_, count]) => count > 1)
        .map(([path, count]) => `${path} (${count} times)`);

      expect(duplicates, `Duplicate pages:\n${duplicates.join('\n')}`).toHaveLength(0);
    });
  });

  describe('Page Frontmatter Validation', () => {
    const pages = getMintJsonPages();

    it('all pages should have valid frontmatter with title', () => {
      const pagesWithoutTitle = [];
      for (const page of pages) {
        const filePath = join(DOCS_DIR, page.path + '.mdx');
        const frontmatter = parseFrontmatter(filePath);

        if (!frontmatter || !frontmatter.title) {
          pagesWithoutTitle.push(page.path);
        }
      }
      expect(pagesWithoutTitle, `Pages missing title:\n${pagesWithoutTitle.join('\n')}`).toHaveLength(0);
    });

    it('all pages should have valid frontmatter with description', () => {
      const pagesWithoutDesc = [];
      for (const page of pages) {
        const filePath = join(DOCS_DIR, page.path + '.mdx');
        const frontmatter = parseFrontmatter(filePath);

        if (!frontmatter || !frontmatter.description) {
          pagesWithoutDesc.push(page.path);
        }
      }
      expect(pagesWithoutDesc, `Pages missing description:\n${pagesWithoutDesc.join('\n')}`).toHaveLength(0);
    });

    it('page titles should be properly formatted (not just filename)', () => {
      const badTitles = [];
      for (const page of pages) {
        const filePath = join(DOCS_DIR, page.path + '.mdx');
        const frontmatter = parseFrontmatter(filePath);

        if (frontmatter && frontmatter.title) {
          const filename = page.path.split('/').pop();
          // Title should not just be the kebab-case filename
          // It's okay if title matches filename for simple names
          // But longer titles should be properly capitalized
          if (frontmatter.title.includes('-') && frontmatter.title === filename) {
            badTitles.push(`${page.path}: "${frontmatter.title}"`);
          }
        }
      }
      // This is a warning, not a hard failure
      if (badTitles.length > 0) {
        console.warn('Titles that could be improved:', badTitles.join('\n'));
      }
    });
  });

  describe('Internal Link Validation', () => {
    it('skills/overview.mdx internal links should point to existing files', () => {
      const overviewPath = join(DOCS_DIR, 'skills', 'overview.mdx');
      const links = extractInternalLinks(overviewPath);

      const brokenLinks = [];
      for (const link of links) {
        // Skip anchor links and external links
        if (link.path.startsWith('#') || link.path.startsWith('http')) continue;

        // Check if the target file exists
        const targetPath = join(DOCS_DIR, link.path + '.mdx');
        const targetPathNoExt = join(DOCS_DIR, link.path);

        // Also check without .mdx extension (for directory indexes)
        if (!existsSync(targetPath) && !existsSync(targetPathNoExt + '/index.mdx')) {
          brokenLinks.push(`${link.path} (text: "${link.text}")`);
        }
      }
      expect(brokenLinks, `Broken links in skills/overview.mdx:\n${brokenLinks.join('\n')}`).toHaveLength(0);
    });

    it('workflows/overview.mdx internal links should point to existing files', () => {
      const overviewPath = join(DOCS_DIR, 'workflows', 'overview.mdx');
      const links = extractInternalLinks(overviewPath);

      const brokenLinks = [];
      for (const link of links) {
        // Skip anchor links
        if (link.path.startsWith('#')) continue;

        const targetPath = join(DOCS_DIR, link.path + '.mdx');
        if (!existsSync(targetPath)) {
          brokenLinks.push(`${link.path} (text: "${link.text}")`);
        }
      }
      expect(brokenLinks, `Broken links in workflows/overview.mdx:\n${brokenLinks.join('\n')}`).toHaveLength(0);
    });
  });

  describe('Skills Documentation', () => {
    const skillsDir = join(DOCS_DIR, 'skills');

    it('all skill docs should have .mdx extension', () => {
      const files = readdirSync(skillsDir);
      const nonMdx = files.filter(f => !f.endsWith('.mdx') && !f.endsWith('.md'));
      expect(nonMdx, `Non-MDX files in skills/: ${nonMdx.join(', ')}`).toHaveLength(0);
    });

    it('AI Engineering skills should all exist', () => {
      const aiEngineeringSkills = [
        'ai-agents', 'ai-architecture', 'ai-system-evaluation',
        'dataset-engineering', 'evaluation-methodology', 'finetuning',
        'foundation-models', 'guardrails-safety', 'inference-optimization',
        'prompt-engineering', 'rag-systems', 'user-feedback'
      ];

      const missing = [];
      for (const skill of aiEngineeringSkills) {
        const filePath = join(skillsDir, skill + '.mdx');
        if (!existsSync(filePath)) {
          missing.push(skill);
        }
      }
      expect(missing, `Missing AI Engineering skills: ${missing.join(', ')}`).toHaveLength(0);
    });
  });

  describe('Workflows Documentation', () => {
    const workflowsDir = join(DOCS_DIR, 'workflows');

    it('all 29 workflow docs should exist', () => {
      const expectedWorkflows = [
        'feature', 'bug-fix', 'refactor', 'code-review',
        'rag-development', 'model-evaluation', 'prompt-engineering', 'agent-development', 'fine-tuning',
        '10x-improvement', '100x-architecture', '1000x-innovation',
        'sprint-setup', 'sprint-execution', 'sprint-retrospective',
        'security-audit', 'penetration-testing',
        'schema-design', 'migration', 'optimization',
        'api-design', 'api-testing',
        'full-feature', 'authentication',
        'technical-docs', 'marketing',
        'technology-research', 'best-practices',
        'performance-optimization'
      ];

      const missing = [];
      for (const workflow of expectedWorkflows) {
        const filePath = join(workflowsDir, workflow + '.mdx');
        if (!existsSync(filePath)) {
          missing.push(workflow);
        }
      }
      expect(missing, `Missing workflow docs: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('workflow overview should exist', () => {
      expect(existsSync(join(workflowsDir, 'overview.mdx'))).toBe(true);
    });

    it('AI Engineering workflows should all exist', () => {
      const aiWorkflows = [
        'rag-development', 'model-evaluation', 'prompt-engineering',
        'agent-development', 'fine-tuning'
      ];

      const missing = [];
      for (const workflow of aiWorkflows) {
        const filePath = join(workflowsDir, workflow + '.mdx');
        if (!existsSync(filePath)) {
          missing.push(workflow);
        }
      }
      expect(missing, `Missing AI Engineering workflows: ${missing.join(', ')}`).toHaveLength(0);
    });
  });

  describe('Commands Documentation', () => {
    const commandsDir = join(DOCS_DIR, 'commands');

    it('workflow commands should all exist', () => {
      const workflowCommands = [
        'feature', 'bug-fix', 'refactor', 'code-review',
        'rag-development', 'model-evaluation', 'prompt-engineering',
        'agent-development', 'fine-tuning',
        '10x-improvement', '100x-architecture', '1000x-innovation',
        'sprint-setup', 'sprint-execution', 'sprint-retrospective',
        'security-audit', 'penetration-testing',
        'schema-design', 'migration', 'optimization',
        'api-design', 'api-testing',
        'full-feature', 'authentication',
        'technical-docs', 'marketing',
        'technology-research', 'best-practices',
        'performance-optimization'
      ];

      const missing = [];
      for (const cmd of workflowCommands) {
        const filePath = join(commandsDir, cmd + '.mdx');
        if (!existsSync(filePath)) {
          missing.push(cmd);
        }
      }
      expect(missing, `Missing workflow command docs: ${missing.join(', ')}`).toHaveLength(0);
    });
  });
});
