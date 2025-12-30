/**
 * New Skills Validation Tests
 *
 * TDD tests for 20 new skills across 3 phases
 * Tests run BEFORE implementation to ensure quality
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseFrontmatter, validatePluginFile } from '../../lib/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');
const SKILLS_DIR = join(PLUGIN_DIR, 'skills');

/**
 * Helper: Check if skill file exists and has valid structure
 */
function validateSkill(category, skillName) {
  const skillPath = join(SKILLS_DIR, category, skillName, 'SKILL.md');

  if (!existsSync(skillPath)) {
    return { valid: false, errors: ['Skill file does not exist'], path: skillPath };
  }

  const content = readFileSync(skillPath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  const errors = [];

  // Check frontmatter
  if (!frontmatter) {
    errors.push('Missing frontmatter');
  } else {
    if (!frontmatter.name) errors.push('Missing name in frontmatter');
    if (!frontmatter.description) errors.push('Missing description in frontmatter');
    if (!frontmatter.category) errors.push('Missing category in frontmatter');
  }

  // Check content sections
  const requiredSections = ['Purpose', 'Features', 'Use Cases', 'Best Practices'];
  for (const section of requiredSections) {
    if (!content.includes(`## ${section}`) && !content.includes(`# ${section}`)) {
      errors.push(`Missing section: ${section}`);
    }
  }

  // Check minimum content length (500 chars for meaningful skill)
  if (content.length < 500) {
    errors.push('Content too short (minimum 500 characters)');
  }

  return { valid: errors.length === 0, errors, path: skillPath, content };
}

/**
 * Helper: Check skill has code examples
 */
function hasCodeExamples(content) {
  return content.includes('```');
}

/**
 * Helper: Check skill references related skills
 */
function hasRelatedSkills(content) {
  return content.toLowerCase().includes('related') &&
         (content.includes('skill') || content.includes('See also'));
}

// =============================================================================
// PHASE 1: Core Advanced Skills (7 skills)
// =============================================================================

describe('Phase 1: Core Advanced Skills', () => {

  describe('sequential-thinking', () => {
    const result = validateSkill('methodology', 'sequential-thinking');

    it('should exist in methodology category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should have all required sections', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('section'))).toHaveLength(0);
    });

    it('should have code examples', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(hasCodeExamples(result.content)).toBe(true);
    });

    it('should reference related skills', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(hasRelatedSkills(result.content)).toBe(true);
    });
  });

  describe('problem-solving', () => {
    const result = validateSkill('methodology', 'problem-solving');

    it('should exist in methodology category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should have all required sections', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('section'))).toHaveLength(0);
    });

    it('should include 5-phase framework', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toContain('phase');
    });
  });

  describe('advanced-ui-design', () => {
    const result = validateSkill('frontend', 'advanced-ui-design');

    it('should exist in frontend category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should include aesthetic framework', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/beautiful|aesthetic|design/i);
    });
  });

  describe('document-processing', () => {
    const result = validateSkill('tools', 'document-processing');

    it('should exist in tools category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover PDF, DOCX, XLSX formats', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content).toMatch(/PDF|DOCX|XLSX/i);
    });
  });

  describe('mcp-development', () => {
    const result = validateSkill('tools', 'mcp-development');

    it('should exist in tools category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover MCP server creation', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toContain('mcp');
    });
  });

  describe('performance-profiling', () => {
    const result = validateSkill('devops', 'performance-profiling');

    it('should exist in devops category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover performance metrics', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/performance|profil|metric/i);
    });
  });

  describe('research-validation', () => {
    const result = validateSkill('methodology', 'research-validation');

    it('should exist in methodology category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover multi-source validation', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/source|valid|research/i);
    });
  });
});

// =============================================================================
// PHASE 2: Integration Skills (7 skills)
// =============================================================================

describe('Phase 2: Integration Skills', () => {

  describe('payment-integration', () => {
    const result = validateSkill('integrations', 'payment-integration');

    it('should exist in integrations category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover Stripe integration', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content).toMatch(/Stripe|PayPal|payment/i);
    });
  });

  describe('mobile-development', () => {
    const result = validateSkill('mobile', 'mobile-development');

    it('should exist in mobile category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover React Native', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content).toMatch(/React Native|Expo/i);
    });
  });

  describe('media-processing', () => {
    const result = validateSkill('tools', 'media-processing');

    it('should exist in tools category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover ffmpeg', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/ffmpeg|video|audio/i);
    });
  });

  describe('image-processing', () => {
    const result = validateSkill('tools', 'image-processing');

    it('should exist in tools category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover image optimization', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/image|resize|optim/i);
    });
  });

  describe('ai-integration', () => {
    const result = validateSkill('integrations', 'ai-integration');

    it('should exist in integrations category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover AI/ML integration', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/ai|ml|model|vision/i);
    });
  });

  describe('api-architecture', () => {
    const result = validateSkill('backend', 'api-architecture');

    it('should exist in backend category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover REST/GraphQL', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content).toMatch(/REST|GraphQL|API/i);
    });
  });

  describe('caching-strategies', () => {
    const result = validateSkill('backend', 'caching-strategies');

    it('should exist in backend category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover caching patterns', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/cache|redis|cdn/i);
    });
  });
});

// =============================================================================
// PHASE 3: Advanced Specialized Skills (6 skills)
// =============================================================================

describe('Phase 3: Advanced Specialized Skills', () => {

  describe('monorepo-management', () => {
    const result = validateSkill('devops', 'monorepo-management');

    it('should exist in devops category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover Turborepo/Nx', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content).toMatch(/Turborepo|Nx|monorepo/i);
    });
  });

  describe('real-time-systems', () => {
    const result = validateSkill('backend', 'real-time-systems');

    it('should exist in backend category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover WebSocket', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content).toMatch(/WebSocket|SSE|real-time/i);
    });
  });

  describe('observability', () => {
    const result = validateSkill('devops', 'observability');

    it('should exist in devops category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover logging and monitoring', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/log|monitor|trac/i);
    });
  });

  describe('security-hardening', () => {
    const result = validateSkill('security', 'security-hardening');

    it('should exist in security category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover security patterns', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/security|harden|zero.?trust/i);
    });
  });

  describe('database-optimization', () => {
    const result = validateSkill('databases', 'database-optimization');

    it('should exist in databases category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover query optimization', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/query|index|optim/i);
    });
  });

  describe('event-driven-architecture', () => {
    const result = validateSkill('backend', 'event-driven-architecture');

    it('should exist in backend category', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      if (!result.valid && result.errors.includes('Skill file does not exist')) {
        expect.fail('Skill not implemented yet');
      }
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover event sourcing', () => {
      if (!result.content) expect.fail('Skill not implemented yet');
      expect(result.content.toLowerCase()).toMatch(/event|cqrs|messag/i);
    });
  });
});

// =============================================================================
// Summary Statistics
// =============================================================================

describe('New Skills Summary', () => {
  const phase1Skills = [
    ['methodology', 'sequential-thinking'],
    ['methodology', 'problem-solving'],
    ['frontend', 'advanced-ui-design'],
    ['tools', 'document-processing'],
    ['tools', 'mcp-development'],
    ['devops', 'performance-profiling'],
    ['methodology', 'research-validation'],
  ];

  const phase2Skills = [
    ['integrations', 'payment-integration'],
    ['mobile', 'mobile-development'],
    ['tools', 'media-processing'],
    ['tools', 'image-processing'],
    ['integrations', 'ai-integration'],
    ['backend', 'api-architecture'],
    ['backend', 'caching-strategies'],
  ];

  const phase3Skills = [
    ['devops', 'monorepo-management'],
    ['backend', 'real-time-systems'],
    ['devops', 'observability'],
    ['security', 'security-hardening'],
    ['databases', 'database-optimization'],
    ['backend', 'event-driven-architecture'],
  ];

  it('should have 7 Phase 1 skills implemented', () => {
    const implemented = phase1Skills.filter(([cat, name]) => {
      const path = join(SKILLS_DIR, cat, name, 'SKILL.md');
      return existsSync(path);
    });
    expect(implemented.length).toBe(7);
  });

  it('should have 7 Phase 2 skills implemented', () => {
    const implemented = phase2Skills.filter(([cat, name]) => {
      const path = join(SKILLS_DIR, cat, name, 'SKILL.md');
      return existsSync(path);
    });
    expect(implemented.length).toBe(7);
  });

  it('should have 6 Phase 3 skills implemented', () => {
    const implemented = phase3Skills.filter(([cat, name]) => {
      const path = join(SKILLS_DIR, cat, name, 'SKILL.md');
      return existsSync(path);
    });
    expect(implemented.length).toBe(6);
  });

  it('should have 20 total new skills implemented', () => {
    const allSkills = [...phase1Skills, ...phase2Skills, ...phase3Skills];
    const implemented = allSkills.filter(([cat, name]) => {
      const path = join(SKILLS_DIR, cat, name, 'SKILL.md');
      return existsSync(path);
    });
    expect(implemented.length).toBe(20);
  });
});
