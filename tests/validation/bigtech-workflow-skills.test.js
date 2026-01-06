/**
 * BigTech Workflow Skills Validation Tests
 *
 * Tests for 4 new skills addressing BigTech workflow gaps:
 * 1. Feature Flags (devops/feature-flags) - HIGH priority
 * 2. Chaos Engineering (testing/chaos-engineering) - MEDIUM priority
 * 3. DORA Metrics (devops/dora-metrics) - MEDIUM priority
 * 4. Stacked Diffs (methodology/stacked-diffs) - LOW priority
 *
 * These skills align OMGKIT with BigTech practices from:
 * - Google (trunk-based development, DORA metrics)
 * - Meta (stacked diffs, code review optimization)
 * - Netflix (chaos engineering, feature flags)
 * - Amazon (CI/CD as release captain)
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');
const SKILLS_DIR = join(PLUGIN_DIR, 'skills');

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const lines = match[1].split('\n');
  const frontmatter = {};

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Validate a skill file structure and content
 */
function validateSkill(category, skillName) {
  const skillPath = join(SKILLS_DIR, category, skillName, 'SKILL.md');

  const result = {
    path: skillPath,
    exists: false,
    frontmatter: null,
    content: '',
    errors: [],
    warnings: []
  };

  // Check existence
  if (!existsSync(skillPath)) {
    result.errors.push(`Skill file does not exist: ${skillPath}`);
    return result;
  }

  result.exists = true;
  result.content = readFileSync(skillPath, 'utf8');

  // Check file size
  const stats = statSync(skillPath);
  if (stats.size < 2000) {
    result.errors.push(`Skill file too small (${stats.size} bytes, minimum 2000)`);
  }

  // Parse frontmatter
  result.frontmatter = parseFrontmatter(result.content);

  if (!result.frontmatter) {
    result.errors.push('Missing frontmatter');
  } else {
    // Validate required frontmatter fields
    if (!result.frontmatter.name) {
      result.errors.push('Missing name in frontmatter');
    }
    if (!result.frontmatter.description) {
      result.errors.push('Missing description in frontmatter');
    }
    if (!result.frontmatter.category) {
      result.errors.push('Missing category in frontmatter');
    } else if (result.frontmatter.category !== category) {
      result.errors.push(`Category mismatch: expected '${category}', got '${result.frontmatter.category}'`);
    }

    // Check description length
    if (result.frontmatter.description && result.frontmatter.description.length < 50) {
      result.warnings.push('Description is too short (minimum 50 characters recommended)');
    }
  }

  // Check required sections
  const requiredSections = ['Purpose', 'Features', 'Best Practices', 'Use Cases'];
  for (const section of requiredSections) {
    if (!result.content.includes(`## ${section}`)) {
      result.errors.push(`Missing required section: ${section}`);
    }
  }

  // Check for code examples
  const codeBlockCount = (result.content.match(/```/g) || []).length / 2;
  if (codeBlockCount < 3) {
    result.errors.push(`Insufficient code examples (${codeBlockCount} found, minimum 3 required)`);
  }

  // Check for related skills reference
  if (!result.content.includes('Related Skills') && !result.content.includes('related') && !result.content.includes('See also')) {
    result.warnings.push('Consider adding Related Skills section');
  }

  return result;
}

// =============================================================================
// FEATURE FLAGS SKILL TESTS
// =============================================================================

describe('Feature Flags Skill (devops/feature-flags)', () => {
  let validation;

  beforeAll(() => {
    validation = validateSkill('devops', 'feature-flags');
  });

  describe('File Structure', () => {
    it('should exist in devops category', () => {
      expect(validation.exists, `File missing: ${validation.path}`).toBe(true);
    });

    it('should have minimum file size (2000+ bytes)', () => {
      if (!validation.exists) return;
      const errors = validation.errors.filter(e => e.includes('too small'));
      expect(errors).toHaveLength(0);
    });
  });

  describe('Frontmatter', () => {
    it('should have valid frontmatter', () => {
      if (!validation.exists) return;
      expect(validation.frontmatter).not.toBeNull();
    });

    it('should have name field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.name).toBeDefined();
      expect(validation.frontmatter.name.length).toBeGreaterThan(0);
    });

    it('should have description field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.description).toBeDefined();
      expect(validation.frontmatter.description.length).toBeGreaterThan(50);
    });

    it('should have correct category', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.category).toBe('devops');
    });
  });

  describe('Required Sections', () => {
    it('should have Purpose section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Purpose');
    });

    it('should have Features section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Features');
    });

    it('should have Best Practices section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Best Practices');
    });

    it('should have Use Cases section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Use Cases');
    });
  });

  describe('Feature Flag Specific Content', () => {
    it('should mention feature flag providers', () => {
      if (!validation.exists) return;
      const hasProviders = validation.content.includes('LaunchDarkly') ||
                          validation.content.includes('Unleash') ||
                          validation.content.includes('Flagsmith');
      expect(hasProviders).toBe(true);
    });

    it('should have percentage rollout content', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('rollout');
    });

    it('should mention kill switches', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('kill switch');
    });

    it('should have A/B testing content', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('A/B');
    });

    it('should mention trunk-based development', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('trunk');
    });
  });

  describe('Code Examples', () => {
    it('should have at least 3 code examples', () => {
      if (!validation.exists) return;
      const codeBlocks = (validation.content.match(/```/g) || []).length / 2;
      expect(codeBlocks).toBeGreaterThanOrEqual(3);
    });

    it('should have TypeScript/JavaScript examples', () => {
      if (!validation.exists) return;
      const hasTS = validation.content.includes('```typescript') ||
                   validation.content.includes('```ts') ||
                   validation.content.includes('```javascript') ||
                   validation.content.includes('```js');
      expect(hasTS).toBe(true);
    });

    it('should have React integration example', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('React');
    });
  });

  describe('Related Skills', () => {
    it('should reference related skills', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Related Skills');
    });
  });
});

// =============================================================================
// CHAOS ENGINEERING SKILL TESTS
// =============================================================================

describe('Chaos Engineering Skill (testing/chaos-engineering)', () => {
  let validation;

  beforeAll(() => {
    validation = validateSkill('testing', 'chaos-engineering');
  });

  describe('File Structure', () => {
    it('should exist in testing category', () => {
      expect(validation.exists, `File missing: ${validation.path}`).toBe(true);
    });

    it('should have minimum file size (2000+ bytes)', () => {
      if (!validation.exists) return;
      const errors = validation.errors.filter(e => e.includes('too small'));
      expect(errors).toHaveLength(0);
    });
  });

  describe('Frontmatter', () => {
    it('should have valid frontmatter', () => {
      if (!validation.exists) return;
      expect(validation.frontmatter).not.toBeNull();
    });

    it('should have name field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.name).toBeDefined();
    });

    it('should have description field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.description).toBeDefined();
    });

    it('should have correct category', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.category).toBe('testing');
    });
  });

  describe('Required Sections', () => {
    it('should have Purpose section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Purpose');
    });

    it('should have Features section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Features');
    });

    it('should have Best Practices section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Best Practices');
    });

    it('should have Use Cases section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Use Cases');
    });
  });

  describe('Chaos Engineering Specific Content', () => {
    it('should mention Netflix', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Netflix');
    });

    it('should mention Chaos Monkey', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Chaos Monkey');
    });

    it('should have chaos tools content', () => {
      if (!validation.exists) return;
      const hasTools = validation.content.includes('Gremlin') ||
                      validation.content.includes('LitmusChaos') ||
                      validation.content.includes('Chaos Toolkit');
      expect(hasTools).toBe(true);
    });

    it('should mention steady-state hypothesis', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('steady');
    });

    it('should have game day content', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('game day');
    });

    it('should mention blast radius', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('blast radius');
    });
  });

  describe('Experiment Types', () => {
    it('should cover infrastructure chaos', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('infrastructure');
    });

    it('should cover network chaos', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('network');
    });

    it('should cover resource exhaustion', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('resource');
    });
  });

  describe('Code Examples', () => {
    it('should have at least 3 code examples', () => {
      if (!validation.exists) return;
      const codeBlocks = (validation.content.match(/```/g) || []).length / 2;
      expect(codeBlocks).toBeGreaterThanOrEqual(3);
    });

    it('should have YAML configuration examples', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('```yaml');
    });
  });
});

// =============================================================================
// DORA METRICS SKILL TESTS
// =============================================================================

describe('DORA Metrics Skill (devops/dora-metrics)', () => {
  let validation;

  beforeAll(() => {
    validation = validateSkill('devops', 'dora-metrics');
  });

  describe('File Structure', () => {
    it('should exist in devops category', () => {
      expect(validation.exists, `File missing: ${validation.path}`).toBe(true);
    });

    it('should have minimum file size (2000+ bytes)', () => {
      if (!validation.exists) return;
      const errors = validation.errors.filter(e => e.includes('too small'));
      expect(errors).toHaveLength(0);
    });
  });

  describe('Frontmatter', () => {
    it('should have valid frontmatter', () => {
      if (!validation.exists) return;
      expect(validation.frontmatter).not.toBeNull();
    });

    it('should have name field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.name).toBeDefined();
    });

    it('should have description field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.description).toBeDefined();
    });

    it('should have correct category', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.category).toBe('devops');
    });
  });

  describe('Required Sections', () => {
    it('should have Purpose section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Purpose');
    });

    it('should have Features section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Features');
    });

    it('should have Best Practices section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Best Practices');
    });

    it('should have Use Cases section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Use Cases');
    });
  });

  describe('DORA Metrics Specific Content', () => {
    it('should cover Deployment Frequency metric', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Deployment Frequency');
    });

    it('should cover Lead Time for Changes metric', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Lead Time');
    });

    it('should cover Change Failure Rate metric', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Change Failure Rate');
    });

    it('should cover Time to Restore / MTTR metric', () => {
      if (!validation.exists) return;
      const hasMTTR = validation.content.includes('Time to Restore') ||
                     validation.content.includes('MTTR');
      expect(hasMTTR).toBe(true);
    });

    it('should define elite performance benchmarks', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('elite');
    });

    it('should mention Google DORA research', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Google') || expect(validation.content).toContain('DORA');
    });
  });

  describe('Performance Levels', () => {
    it('should define elite level', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('elite');
    });

    it('should define high level', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('high');
    });

    it('should define medium level', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('medium');
    });

    it('should define low level', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('low');
    });
  });

  describe('Implementation Guidance', () => {
    it('should have GitHub Actions integration', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('GitHub Actions');
    });

    it('should have measurement code examples', () => {
      if (!validation.exists) return;
      const codeBlocks = (validation.content.match(/```/g) || []).length / 2;
      expect(codeBlocks).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Code Examples', () => {
    it('should have at least 3 code examples', () => {
      if (!validation.exists) return;
      const codeBlocks = (validation.content.match(/```/g) || []).length / 2;
      expect(codeBlocks).toBeGreaterThanOrEqual(3);
    });

    it('should have TypeScript examples', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('```typescript');
    });
  });
});

// =============================================================================
// STACKED DIFFS SKILL TESTS
// =============================================================================

describe('Stacked Diffs Skill (methodology/stacked-diffs)', () => {
  let validation;

  beforeAll(() => {
    validation = validateSkill('methodology', 'stacked-diffs');
  });

  describe('File Structure', () => {
    it('should exist in methodology category', () => {
      expect(validation.exists, `File missing: ${validation.path}`).toBe(true);
    });

    it('should have minimum file size (2000+ bytes)', () => {
      if (!validation.exists) return;
      const errors = validation.errors.filter(e => e.includes('too small'));
      expect(errors).toHaveLength(0);
    });
  });

  describe('Frontmatter', () => {
    it('should have valid frontmatter', () => {
      if (!validation.exists) return;
      expect(validation.frontmatter).not.toBeNull();
    });

    it('should have name field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.name).toBeDefined();
    });

    it('should have description field', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.description).toBeDefined();
    });

    it('should have correct category', () => {
      if (!validation.frontmatter) return;
      expect(validation.frontmatter.category).toBe('methodology');
    });
  });

  describe('Required Sections', () => {
    it('should have Purpose section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Purpose');
    });

    it('should have Features section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Features');
    });

    it('should have Best Practices section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Best Practices');
    });

    it('should have Use Cases section', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('## Use Cases');
    });
  });

  describe('Stacked Diffs Specific Content', () => {
    it('should mention Meta/Facebook', () => {
      if (!validation.exists) return;
      const hasMeta = validation.content.includes('Meta') ||
                     validation.content.includes('Facebook');
      expect(hasMeta).toBe(true);
    });

    it('should explain stacked PRs concept', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('stack');
    });

    it('should compare with traditional PRs', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Traditional');
    });

    it('should mention code review benefits', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('review');
    });
  });

  describe('Tools Coverage', () => {
    it('should mention Graphite', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Graphite');
    });

    it('should have tool-specific examples', () => {
      if (!validation.exists) return;
      const hasToolExamples = validation.content.includes('ghstack') ||
                             validation.content.includes('git-branchless') ||
                             validation.content.includes('Sapling');
      expect(hasToolExamples).toBe(true);
    });
  });

  describe('Workflow Patterns', () => {
    it('should cover creating stacks', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('creat');
    });

    it('should cover updating middle commits', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('update');
    });

    it('should cover rebasing', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('rebase');
    });

    it('should cover merging stacks', () => {
      if (!validation.exists) return;
      expect(validation.content.toLowerCase()).toContain('merg');
    });
  });

  describe('Code Examples', () => {
    it('should have at least 3 code examples', () => {
      if (!validation.exists) return;
      const codeBlocks = (validation.content.match(/```/g) || []).length / 2;
      expect(codeBlocks).toBeGreaterThanOrEqual(3);
    });

    it('should have bash/shell examples', () => {
      if (!validation.exists) return;
      const hasBash = validation.content.includes('```bash') ||
                     validation.content.includes('```shell');
      expect(hasBash).toBe(true);
    });

    it('should have git command examples', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('git');
    });
  });

  describe('Anti-Patterns', () => {
    it('should document anti-patterns', () => {
      if (!validation.exists) return;
      expect(validation.content).toContain('Anti-Pattern');
    });
  });
});

// =============================================================================
// CROSS-SKILL VALIDATION
// =============================================================================

describe('Cross-Skill Validation', () => {
  const skills = [
    { category: 'devops', name: 'feature-flags' },
    { category: 'testing', name: 'chaos-engineering' },
    { category: 'devops', name: 'dora-metrics' },
    { category: 'methodology', name: 'stacked-diffs' }
  ];

  describe('All Skills Exist', () => {
    for (const skill of skills) {
      it(`${skill.category}/${skill.name} should exist`, () => {
        const skillPath = join(SKILLS_DIR, skill.category, skill.name, 'SKILL.md');
        expect(existsSync(skillPath)).toBe(true);
      });
    }
  });

  describe('Consistent Structure', () => {
    for (const skill of skills) {
      it(`${skill.category}/${skill.name} should have consistent frontmatter`, () => {
        const skillPath = join(SKILLS_DIR, skill.category, skill.name, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf8');
        const frontmatter = parseFrontmatter(content);

        expect(frontmatter).not.toBeNull();
        expect(frontmatter.name).toBeDefined();
        expect(frontmatter.description).toBeDefined();
        expect(frontmatter.category).toBe(skill.category);
      });
    }
  });

  describe('Omega Signature', () => {
    for (const skill of skills) {
      it(`${skill.category}/${skill.name} should have Omega signature`, () => {
        const skillPath = join(SKILLS_DIR, skill.category, skill.name, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf8');
        expect(content).toContain('Think Omega. Build Omega. Be Omega.');
      });
    }
  });

  describe('Related Skills References', () => {
    for (const skill of skills) {
      it(`${skill.category}/${skill.name} should reference related skills`, () => {
        const skillPath = join(SKILLS_DIR, skill.category, skill.name, 'SKILL.md');
        if (!existsSync(skillPath)) return;

        const content = readFileSync(skillPath, 'utf8');
        expect(content).toContain('Related Skills');
      });
    }
  });

  describe('BigTech References', () => {
    it('should collectively reference all major BigTech companies', () => {
      const allContent = skills.map(skill => {
        const skillPath = join(SKILLS_DIR, skill.category, skill.name, 'SKILL.md');
        if (!existsSync(skillPath)) return '';
        return readFileSync(skillPath, 'utf8');
      }).join('\n');

      expect(allContent).toContain('Google');
      expect(allContent).toContain('Netflix');
      expect(allContent).toContain('Meta');
      expect(allContent).toContain('Amazon');
    });
  });
});

// =============================================================================
// INTEGRATION WITH EXISTING SKILLS
// =============================================================================

describe('Integration with Existing OMGKIT Skills', () => {
  const relatedSkills = [
    'devops/github-actions',
    'devops/observability',
    'testing/comprehensive-testing',
    'methodology/finishing-development-branch'
  ];

  describe('Related Skills Exist', () => {
    for (const skillId of relatedSkills) {
      const [category, name] = skillId.split('/');

      it(`${skillId} should exist for cross-referencing`, () => {
        const skillPath = join(SKILLS_DIR, category, name, 'SKILL.md');
        expect(existsSync(skillPath)).toBe(true);
      });
    }
  });

  describe('New Skills Reference Existing Skills Correctly', () => {
    const newSkillPaths = [
      join(SKILLS_DIR, 'devops', 'feature-flags', 'SKILL.md'),
      join(SKILLS_DIR, 'testing', 'chaos-engineering', 'SKILL.md'),
      join(SKILLS_DIR, 'devops', 'dora-metrics', 'SKILL.md'),
      join(SKILLS_DIR, 'methodology', 'stacked-diffs', 'SKILL.md')
    ];

    it('should use correct skill ID format in references', () => {
      for (const skillPath of newSkillPaths) {
        if (!existsSync(skillPath)) continue;

        const content = readFileSync(skillPath, 'utf8');
        // Check for proper category/skill-name format
        const skillRefs = content.match(/`[a-z-]+\/[a-z-]+`/g) || [];

        for (const ref of skillRefs) {
          const [cat, name] = ref.replace(/`/g, '').split('/');
          // Either should exist or be one of the new skills
          const refPath = join(SKILLS_DIR, cat, name, 'SKILL.md');
          const isNewSkill = ['feature-flags', 'chaos-engineering', 'dora-metrics', 'stacked-diffs'].includes(name);
          expect(existsSync(refPath) || isNewSkill).toBe(true);
        }
      }
    });
  });
});
