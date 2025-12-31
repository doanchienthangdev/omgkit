/**
 * Workflow Validation Tests
 *
 * Validates all workflow files have:
 * - Valid YAML frontmatter
 * - Required fields (name, description, category, complexity, agents)
 * - Proper structure
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseFrontmatter } from '../../lib/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');
const WORKFLOWS_DIR = join(PLUGIN_DIR, 'workflows');

/**
 * Get all markdown files in workflows directory recursively
 */
function getWorkflowFiles(dir, files = []) {
  if (!existsSync(dir)) return files;

  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getWorkflowFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Get workflow categories from directory structure
 */
function getWorkflowCategories() {
  if (!existsSync(WORKFLOWS_DIR)) return [];

  // Exclude special directories:
  // - 'autonomous': YAML template workflows
  // - Gap analysis categories: Different format, validated in gap-analysis-components.test.js
  const excludedDirs = ['autonomous', 'microservices', 'event-driven', 'ai-ml', 'game-dev'];
  return readdirSync(WORKFLOWS_DIR).filter(item => {
    const fullPath = join(WORKFLOWS_DIR, item);
    return statSync(fullPath).isDirectory() && !excludedDirs.includes(item);
  });
}

/**
 * Get established workflow files (excludes new gap analysis workflows)
 */
function getEstablishedWorkflowFiles(dir, files = []) {
  if (!existsSync(dir)) return files;

  const excludedDirs = ['autonomous', 'microservices', 'event-driven', 'ai-ml', 'game-dev'];
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && !excludedDirs.includes(item)) {
      getEstablishedWorkflowFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      // Only include if parent dir is not excluded
      const parentDir = dir.split('/').pop();
      if (!excludedDirs.includes(parentDir)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

describe('Workflow Validation', () => {
  const workflowFiles = getWorkflowFiles(WORKFLOWS_DIR);
  const establishedWorkflowFiles = getEstablishedWorkflowFiles(WORKFLOWS_DIR);
  const categories = getWorkflowCategories();

  describe('Workflow Structure', () => {
    it('should have workflows directory', () => {
      expect(existsSync(WORKFLOWS_DIR)).toBe(true);
    });

    it('should have at least 25 workflow files', () => {
      expect(workflowFiles.length).toBeGreaterThanOrEqual(25);
    });

    it('should have all expected categories', () => {
      const expectedCategories = [
        'development',
        'ai-engineering',
        'omega',
        'sprint',
        'security',
        'database',
        'api',
        'fullstack',
        'content',
        'research',
        'quality'
      ];

      expectedCategories.forEach(cat => {
        expect(categories, `Missing category: ${cat}`).toContain(cat);
      });
    });
  });

  describe('Workflow Frontmatter', () => {
    // Use establishedWorkflowFiles for strict frontmatter validation
    // New gap analysis workflows have different format and are validated separately
    it.each(establishedWorkflowFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s should have valid frontmatter',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter, `Missing frontmatter in ${name}`).not.toBeNull();
      }
    );

    it.each(establishedWorkflowFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s should have required fields',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter.name, `Missing name in ${name}`).toBeDefined();
        expect(frontmatter.description, `Missing description in ${name}`).toBeDefined();
        expect(frontmatter.category, `Missing category in ${name}`).toBeDefined();
        expect(frontmatter.complexity, `Missing complexity in ${name}`).toBeDefined();
      }
    );

    it.each(establishedWorkflowFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s should have valid complexity level',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        const validComplexity = ['low', 'medium', 'high', 'very-high'];
        expect(
          validComplexity,
          `Invalid complexity '${frontmatter.complexity}' in ${name}`
        ).toContain(frontmatter.complexity);
      }
    );
  });

  describe('Workflow Content', () => {
    // Use establishedWorkflowFiles for strict content validation
    it.each(establishedWorkflowFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s should have Overview section',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf8');
        expect(content, `Missing Overview in ${name}`).toContain('## Overview');
      }
    );

    it.each(establishedWorkflowFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s should have Steps section',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf8');
        expect(content, `Missing Steps in ${name}`).toContain('## Steps');
      }
    );

    it.each(establishedWorkflowFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'workflow %s should have Quality Gates',
      (name, filePath) => {
        const content = readFileSync(filePath, 'utf8');
        expect(content, `Missing Quality Gates in ${name}`).toContain('## Quality Gates');
      }
    );
  });

  describe('Category-Specific Workflows', () => {
    it('development category should have required workflows', () => {
      const devDir = join(WORKFLOWS_DIR, 'development');
      const workflows = readdirSync(devDir).filter(f => f.endsWith('.md'));

      const required = ['feature.md', 'bug-fix.md', 'refactor.md', 'code-review.md'];
      required.forEach(w => {
        expect(workflows, `Missing development workflow: ${w}`).toContain(w);
      });
    });

    it('ai-engineering category should have required workflows', () => {
      const aiDir = join(WORKFLOWS_DIR, 'ai-engineering');
      const workflows = readdirSync(aiDir).filter(f => f.endsWith('.md'));

      const required = ['rag-development.md', 'model-evaluation.md', 'prompt-engineering.md',
                        'agent-development.md', 'fine-tuning.md'];
      required.forEach(w => {
        expect(workflows, `Missing ai-engineering workflow: ${w}`).toContain(w);
      });
    });

    it('omega category should have required workflows', () => {
      const omegaDir = join(WORKFLOWS_DIR, 'omega');
      const workflows = readdirSync(omegaDir).filter(f => f.endsWith('.md'));

      const required = ['10x-improvement.md', '100x-architecture.md', '1000x-innovation.md'];
      required.forEach(w => {
        expect(workflows, `Missing omega workflow: ${w}`).toContain(w);
      });
    });

    it('sprint category should have required workflows', () => {
      const sprintDir = join(WORKFLOWS_DIR, 'sprint');
      const workflows = readdirSync(sprintDir).filter(f => f.endsWith('.md'));

      const required = ['sprint-setup.md', 'sprint-execution.md', 'sprint-retrospective.md'];
      required.forEach(w => {
        expect(workflows, `Missing sprint workflow: ${w}`).toContain(w);
      });
    });

    it('security category should have required workflows', () => {
      const securityDir = join(WORKFLOWS_DIR, 'security');
      const workflows = readdirSync(securityDir).filter(f => f.endsWith('.md'));

      const required = ['security-audit.md', 'penetration-testing.md'];
      required.forEach(w => {
        expect(workflows, `Missing security workflow: ${w}`).toContain(w);
      });
    });

    it('database category should have required workflows', () => {
      const dbDir = join(WORKFLOWS_DIR, 'database');
      const workflows = readdirSync(dbDir).filter(f => f.endsWith('.md'));

      const required = ['schema-design.md', 'migration.md', 'optimization.md'];
      required.forEach(w => {
        expect(workflows, `Missing database workflow: ${w}`).toContain(w);
      });
    });
  });

  describe('Workflow Metadata Consistency', () => {
    it('established workflows should have agents defined', () => {
      establishedWorkflowFiles.forEach(filePath => {
        const content = readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(content);
        const name = filePath.replace(PLUGIN_DIR, '');

        expect(frontmatter.agents, `Missing agents in ${name}`).toBeDefined();
      });
    });

    it('workflow categories should match directory structure', () => {
      establishedWorkflowFiles.forEach(filePath => {
        const content = readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(content);
        const name = filePath.replace(PLUGIN_DIR, '');

        // Extract category from path
        const pathParts = filePath.split('/');
        const dirCategory = pathParts[pathParts.length - 2];

        expect(
          frontmatter.category,
          `Category mismatch in ${name}: frontmatter says '${frontmatter.category}' but file is in '${dirCategory}'`
        ).toBe(dirCategory);
      });
    });
  });

  describe('Workflow Count', () => {
    it('should have at least 49 workflows', () => {
      expect(workflowFiles.length).toBeGreaterThanOrEqual(49);
    });

    it('each category should have at least 1 workflow', () => {
      categories.forEach(cat => {
        const catDir = join(WORKFLOWS_DIR, cat);
        const workflows = readdirSync(catDir).filter(f => f.endsWith('.md'));
        expect(workflows.length, `Category ${cat} has no workflows`).toBeGreaterThan(0);
      });
    });
  });
});
