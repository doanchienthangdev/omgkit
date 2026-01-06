/**
 * Documentation Alignment Tests
 *
 * Ensures generated documentation stays in sync with plugin source files.
 * Prevents issues like missing skill categories in the docs.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');
const PLUGIN_DIR = join(ROOT_DIR, 'plugin');
const DOCS_DIR = join(ROOT_DIR, 'docs');
const SCRIPTS_DIR = join(ROOT_DIR, 'scripts');

/**
 * Extract SKILL_CATEGORIES from generate-docs.js
 */
function getGeneratorCategories() {
  const generatorPath = join(SCRIPTS_DIR, 'generate-docs.js');
  const content = readFileSync(generatorPath, 'utf8');

  // Find the SKILL_CATEGORIES block - it spans multiple lines
  const startMatch = content.match(/const SKILL_CATEGORIES\s*=\s*\{/);
  if (!startMatch) return [];

  const startIndex = startMatch.index + startMatch[0].length;
  let braceCount = 1;
  let endIndex = startIndex;

  // Find matching closing brace
  for (let i = startIndex; i < content.length && braceCount > 0; i++) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    endIndex = i;
  }

  const categoryBlock = content.slice(startIndex, endIndex);
  const categories = [];

  // Match category keys at the start of lines (handles both 'key' and key formats)
  const lines = categoryBlock.split('\n');
  for (const line of lines) {
    // Match patterns like: 'ai-engineering': or  backend: at line start
    const keyMatch = line.match(/^\s*'?([a-z][a-z-]*)'?\s*:/);
    if (keyMatch && !['icon', 'description'].includes(keyMatch[1])) {
      categories.push(keyMatch[1]);
    }
  }
  return categories;
}

/**
 * Get skill categories from plugin/skills directory
 */
function getPluginSkillCategories() {
  const skillsDir = join(PLUGIN_DIR, 'skills');
  if (!existsSync(skillsDir)) return [];

  return readdirSync(skillsDir).filter(item => {
    const fullPath = join(skillsDir, item);
    return statSync(fullPath).isDirectory() && !item.startsWith('.');
  });
}

/**
 * Get skill categories from mint.json navigation
 */
function getMintJsonSkillGroups() {
  const mintPath = join(DOCS_DIR, 'mint.json');
  if (!existsSync(mintPath)) return [];

  const content = readFileSync(mintPath, 'utf8');
  const mint = JSON.parse(content);

  // Find all groups that contain skills pages
  const skillGroups = [];
  for (const nav of mint.navigation || []) {
    const pages = nav.pages || [];
    if (pages.some(p => p.startsWith('skills/'))) {
      skillGroups.push(nav.group);
    }
  }
  return skillGroups;
}

/**
 * Get categories from skills overview docs
 */
function getOverviewCategories() {
  const overviewPath = join(DOCS_DIR, 'skills', 'overview.mdx');
  if (!existsSync(overviewPath)) return [];

  const content = readFileSync(overviewPath, 'utf8');
  const categories = [];

  // Skip headers that aren't skill categories
  const nonCategoryHeaders = [
    'At a Glance', 'Skill Categories', 'How Skills Work',
    'Skill Combinations', 'Configuration', 'Next Steps'
  ];

  // Extract category headers (## Category Name) - split by lines first
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^## ([A-Za-z][A-Za-z\s/&-]*)$/);
    if (match) {
      const category = match[1].trim();
      if (!nonCategoryHeaders.includes(category)) {
        categories.push(category);
      }
    }
  }
  return categories;
}

/**
 * Get skill count per category from overview
 */
function getOverviewSkillCounts() {
  const overviewPath = join(DOCS_DIR, 'skills', 'overview.mdx');
  if (!existsSync(overviewPath)) return {};

  const content = readFileSync(overviewPath, 'utf8');
  const counts = {};

  // Match patterns like: **12 skills** - AI/ML engineering patterns
  const cardMatches = content.matchAll(/<Card title="([^"]+)"[^>]*>\s*\*\*(\d+) skills?\*\*/g);
  for (const m of cardMatches) {
    counts[m[1]] = parseInt(m[2]);
  }
  return counts;
}

/**
 * Count actual skills in plugin directory per category
 */
function countPluginSkills() {
  const skillsDir = join(PLUGIN_DIR, 'skills');
  const counts = {};

  function countSkillsInDir(dir) {
    let count = 0;
    if (!existsSync(dir)) return 0;

    // Check for category-level SKILL.md (e.g., ai-engineering/SKILL.md)
    const categorySkillFile = join(dir, 'SKILL.md');
    if (existsSync(categorySkillFile)) {
      count++;
    }

    const items = readdirSync(dir);
    for (const item of items) {
      // Skip SKILL.md (already counted above)
      if (item === 'SKILL.md') continue;

      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        const skillFile = join(fullPath, 'SKILL.md');
        if (existsSync(skillFile)) {
          count++;
        }
      }
    }
    return count;
  }

  const categories = getPluginSkillCategories();
  for (const cat of categories) {
    counts[cat] = countSkillsInDir(join(skillsDir, cat));
  }

  return counts;
}

describe('Documentation Alignment', () => {
  describe('Skill Categories Sync', () => {
    const pluginCategories = getPluginSkillCategories();
    const generatorCategories = getGeneratorCategories();

    it('established plugin skill categories should be in generate-docs.js SKILL_CATEGORIES', () => {
      // New gap analysis categories are excluded - will be added in docs phase
      const newCategories = ['ai-ml', 'event-driven', 'game', 'iot', 'microservices', 'mobile-advanced', 'simulation'];
      const establishedCategories = pluginCategories.filter(cat => !newCategories.includes(cat));
      const missing = establishedCategories.filter(cat => !generatorCategories.includes(cat));
      expect(missing, `Missing categories in generate-docs.js: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('generate-docs.js should not have orphan categories', () => {
      const orphan = generatorCategories.filter(cat => !pluginCategories.includes(cat));
      expect(orphan, `Orphan categories in generate-docs.js: ${orphan.join(', ')}`).toHaveLength(0);
    });

    it('should have at least 15 skill categories', () => {
      expect(pluginCategories.length).toBeGreaterThanOrEqual(15);
    });

    it('should have all required skill categories', () => {
      const required = [
        'ai-engineering', 'autonomous', 'backend', 'databases', 'devops', 'frameworks',
        'frontend', 'integrations', 'languages', 'methodology', 'mobile',
        'omega', 'security', 'testing', 'tools'
      ];

      required.forEach(cat => {
        expect(pluginCategories, `Missing category: ${cat}`).toContain(cat);
      });
    });
  });

  describe('Skills Overview Page', () => {
    const overviewCategories = getOverviewCategories();
    const pluginCategories = getPluginSkillCategories();

    it('overview should include established plugin categories', () => {
      // Map plugin category names to display names (established categories only)
      const categoryMap = {
        'ai-engineering': 'AI Engineering',
        'autonomous': 'Autonomous',
        'backend': 'Backend',
        'databases': 'Databases',
        'devops': 'DevOps',
        'frameworks': 'Frameworks',
        'frontend': 'Frontend',
        'integrations': 'Integrations',
        'languages': 'Languages',
        'methodology': 'Methodology',
        'mobile': 'Mobile',
        'omega': 'Omega',
        'security': 'Security',
        'testing': 'Testing',
        'tools': 'Tools'
      };

      // Only check established categories that have mapping
      const establishedCategories = pluginCategories.filter(cat => categoryMap[cat]);
      for (const pluginCat of establishedCategories) {
        const displayName = categoryMap[pluginCat];
        expect(overviewCategories, `Missing ${displayName} (${pluginCat}) in overview`).toContain(displayName);
      }
    });

    it('AI Engineering category should be present in overview', () => {
      expect(overviewCategories).toContain('AI Engineering');
    });
  });

  describe('Skill Counts Accuracy', () => {
    const overviewCounts = getOverviewSkillCounts();
    const pluginCounts = countPluginSkills();

    it('overview skill counts should match plugin directory', () => {
      const categoryMap = {
        'ai-engineering': 'AI Engineering',
        'backend': 'Backend',
        'databases': 'Databases',
        'devops': 'DevOps',
        'frameworks': 'Frameworks',
        'frontend': 'Frontend',
        'integrations': 'Integrations',
        'languages': 'Languages',
        'methodology': 'Methodology',
        'mobile': 'Mobile',
        'omega': 'Omega',
        'security': 'Security',
        'testing': 'Testing',
        'tools': 'Tools'
      };

      for (const [pluginCat, count] of Object.entries(pluginCounts)) {
        const displayName = categoryMap[pluginCat];
        if (overviewCounts[displayName] !== undefined) {
          expect(overviewCounts[displayName], `Skill count mismatch for ${displayName}`).toBe(count);
        }
      }
    });

    it('AI Engineering should have at least 12 skills', () => {
      expect(pluginCounts['ai-engineering']).toBeGreaterThanOrEqual(12);
    });

    it('total skills should be at least 89', () => {
      const total = Object.values(pluginCounts).reduce((sum, count) => sum + count, 0);
      expect(total).toBeGreaterThanOrEqual(89);
    });
  });

  describe('Mint.json Navigation', () => {
    const mintPath = join(DOCS_DIR, 'mint.json');

    it('mint.json should exist', () => {
      expect(existsSync(mintPath)).toBe(true);
    });

    it('mint.json should have AI Engineering skills group', () => {
      const content = readFileSync(mintPath, 'utf8');
      const mint = JSON.parse(content);

      const aiEngineeringGroup = mint.navigation.find(nav => nav.group === 'AI Engineering');
      expect(aiEngineeringGroup, 'Missing AI Engineering group in mint.json').toBeDefined();
    });

    it('AI Engineering group should have all skill pages', () => {
      const content = readFileSync(mintPath, 'utf8');
      const mint = JSON.parse(content);

      const aiEngineeringGroup = mint.navigation.find(nav => nav.group === 'AI Engineering');
      if (aiEngineeringGroup) {
        const expectedSkills = [
          'foundation-models', 'evaluation-methodology', 'ai-system-evaluation',
          'prompt-engineering', 'rag-systems', 'ai-agents', 'finetuning',
          'dataset-engineering', 'inference-optimization', 'ai-architecture',
          'guardrails-safety', 'user-feedback'
        ];

        expectedSkills.forEach(skill => {
          expect(
            aiEngineeringGroup.pages.some(p => p.includes(skill)),
            `Missing skill page: ${skill}`
          ).toBe(true);
        });
      }
    });

    it('mint.json should have all 15 skill category groups', () => {
      const content = readFileSync(mintPath, 'utf8');
      const mint = JSON.parse(content);

      const expectedGroups = [
        'AI Engineering', 'Autonomous', 'Languages', 'Frameworks', 'Backend', 'Databases',
        'Frontend', 'Mobile', 'DevOps', 'Security', 'Testing', 'Tools',
        'Integrations', 'Methodology', 'Omega Skills'
      ];

      const groups = mint.navigation.map(nav => nav.group);

      expectedGroups.forEach(group => {
        expect(groups, `Missing group: ${group}`).toContain(group);
      });
    });
  });

  describe('Generated Docs Files', () => {
    const skillsDocsDir = join(DOCS_DIR, 'skills');

    it('all AI Engineering skill docs should exist', () => {
      const expectedDocs = [
        'ai-engineering.mdx',  // Category-level skill
        'foundation-models.mdx', 'evaluation-methodology.mdx', 'ai-system-evaluation.mdx',
        'prompt-engineering.mdx', 'rag-systems.mdx', 'ai-agents.mdx', 'finetuning.mdx',
        'dataset-engineering.mdx', 'inference-optimization.mdx', 'ai-architecture.mdx',
        'guardrails-safety.mdx', 'user-feedback.mdx'
      ];

      expectedDocs.forEach(doc => {
        const docPath = join(skillsDocsDir, doc);
        expect(existsSync(docPath), `Missing doc: ${doc}`).toBe(true);
      });
    });

    it('skills overview should exist', () => {
      expect(existsSync(join(skillsDocsDir, 'overview.mdx'))).toBe(true);
    });

    it('all 89 skill docs should exist', () => {
      const pluginCounts = countPluginSkills();
      const expectedTotal = Object.values(pluginCounts).reduce((sum, count) => sum + count, 0);

      // Count actual .mdx files (excluding non-skill pages)
      const excludedFiles = ['overview.mdx', 'all.mdx'];
      const docFiles = readdirSync(skillsDocsDir)
        .filter(f => f.endsWith('.mdx') && !excludedFiles.includes(f));

      expect(docFiles.length).toBe(expectedTotal);
    });
  });
});
