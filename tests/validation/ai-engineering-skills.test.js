/**
 * AI Engineering Skills Validation Tests
 *
 * Tests for 12 AI Engineering skills based on Chip Huyen's AI Engineering book
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
const AI_ENGINEERING_DIR = join(PLUGIN_DIR, 'skills/ai-engineering');

/**
 * Helper: Validate AI engineering skill file
 */
function validateAIEngineeringSkill(skillName) {
  const skillPath = join(AI_ENGINEERING_DIR, skillName, 'SKILL.md');

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
  }

  // Check minimum content length (500 chars for meaningful skill)
  if (content.length < 500) {
    errors.push('Content too short (minimum 500 characters)');
  }

  // Check for code examples
  if (!content.includes('```')) {
    errors.push('Missing code examples');
  }

  return { valid: errors.length === 0, errors, path: skillPath, content, frontmatter };
}

// =============================================================================
// AI Engineering Root SKILL.md
// =============================================================================

describe('AI Engineering Root Skill', () => {
  const rootPath = join(AI_ENGINEERING_DIR, 'SKILL.md');

  it('should have root SKILL.md file', () => {
    expect(existsSync(rootPath), `Missing: ${rootPath}`).toBe(true);
  });

  it('should have valid frontmatter', () => {
    const result = validatePluginFile(rootPath, ['name', 'description']);
    expect(result.valid, `Errors: ${result.errors.join(', ')}`).toBe(true);
  });

  it('should reference all 12 sub-skills', () => {
    const content = readFileSync(rootPath, 'utf8');
    const requiredSkills = [
      'foundation-models',
      'evaluation-methodology',
      'ai-system-evaluation',
      'prompt-engineering',
      'rag-systems',
      'ai-agents',
      'finetuning',
      'dataset-engineering',
      'inference-optimization',
      'ai-architecture',
      'guardrails-safety',
      'user-feedback'
    ];

    requiredSkills.forEach(skill => {
      expect(content, `Missing reference to: ${skill}`).toContain(skill);
    });
  });
});

// =============================================================================
// Foundation & Evaluation Skills (Skills 1-3)
// =============================================================================

describe('AI Engineering: Foundation & Evaluation Skills', () => {
  describe('foundation-models', () => {
    const result = validateAIEngineeringSkill('foundation-models');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover model architecture and sampling', () => {
      expect(result.content.toLowerCase()).toMatch(/transformer|sampling|temperature/i);
    });

    it('should have code examples', () => {
      expect(result.content).toContain('```');
    });
  });

  describe('evaluation-methodology', () => {
    const result = validateAIEngineeringSkill('evaluation-methodology');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover AI-as-judge and metrics', () => {
      expect(result.content.toLowerCase()).toMatch(/judge|metric|evaluation/i);
    });
  });

  describe('ai-system-evaluation', () => {
    const result = validateAIEngineeringSkill('ai-system-evaluation');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover benchmarks and model selection', () => {
      expect(result.content.toLowerCase()).toMatch(/benchmark|model selection|cost/i);
    });
  });
});

// =============================================================================
// Application Layer Skills (Skills 4-6)
// =============================================================================

describe('AI Engineering: Application Layer Skills', () => {
  describe('prompt-engineering', () => {
    const result = validateAIEngineeringSkill('prompt-engineering');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover few-shot and chain-of-thought', () => {
      expect(result.content.toLowerCase()).toMatch(/few-shot|chain.?of.?thought|system prompt/i);
    });

    it('should cover injection defense', () => {
      expect(result.content.toLowerCase()).toMatch(/injection|defense|security/i);
    });
  });

  describe('rag-systems', () => {
    const result = validateAIEngineeringSkill('rag-systems');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover chunking and embedding', () => {
      expect(result.content.toLowerCase()).toMatch(/chunk|embed|retriev/i);
    });

    it('should cover hybrid retrieval and reranking', () => {
      expect(result.content.toLowerCase()).toMatch(/hybrid|rerank|bm25/i);
    });
  });

  describe('ai-agents', () => {
    const result = validateAIEngineeringSkill('ai-agents');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover tool use and planning', () => {
      expect(result.content.toLowerCase()).toMatch(/tool|planning|react/i);
    });

    it('should cover memory systems', () => {
      expect(result.content.toLowerCase()).toMatch(/memory|short.?term|long.?term/i);
    });
  });
});

// =============================================================================
// Model Layer Skills (Skills 7-8)
// =============================================================================

describe('AI Engineering: Model Layer Skills', () => {
  describe('finetuning', () => {
    const result = validateAIEngineeringSkill('finetuning');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover LoRA and QLoRA', () => {
      expect(result.content).toMatch(/LoRA|QLoRA|PEFT/i);
    });

    it('should cover memory requirements', () => {
      expect(result.content.toLowerCase()).toMatch(/memory|gpu|quantiz/i);
    });
  });

  describe('dataset-engineering', () => {
    const result = validateAIEngineeringSkill('dataset-engineering');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover data quality and deduplication', () => {
      expect(result.content.toLowerCase()).toMatch(/quality|dedup|curation/i);
    });

    it('should cover data synthesis', () => {
      expect(result.content.toLowerCase()).toMatch(/synth|augment|self.?instruct/i);
    });
  });
});

// =============================================================================
// Infrastructure Layer Skills (Skills 9-10)
// =============================================================================

describe('AI Engineering: Infrastructure Layer Skills', () => {
  describe('inference-optimization', () => {
    const result = validateAIEngineeringSkill('inference-optimization');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover quantization', () => {
      expect(result.content.toLowerCase()).toMatch(/quantiz|8.?bit|4.?bit/i);
    });

    it('should cover caching and batching', () => {
      expect(result.content.toLowerCase()).toMatch(/cache|batch|vllm/i);
    });
  });

  describe('ai-architecture', () => {
    const result = validateAIEngineeringSkill('ai-architecture');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover gateway and routing', () => {
      expect(result.content.toLowerCase()).toMatch(/gateway|rout|orchestrat/i);
    });

    it('should cover observability', () => {
      expect(result.content.toLowerCase()).toMatch(/observ|metric|monitor/i);
    });
  });
});

// =============================================================================
// Safety & Feedback Skills (Skills 11-12)
// =============================================================================

describe('AI Engineering: Safety & Feedback Skills', () => {
  describe('guardrails-safety', () => {
    const result = validateAIEngineeringSkill('guardrails-safety');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover input/output guards', () => {
      expect(result.content.toLowerCase()).toMatch(/input.?guard|output.?guard|guard/i);
    });

    it('should cover PII protection', () => {
      expect(result.content.toLowerCase()).toMatch(/pii|redact|protect/i);
    });

    it('should cover injection detection', () => {
      expect(result.content.toLowerCase()).toMatch(/inject|detect|pattern/i);
    });
  });

  describe('user-feedback', () => {
    const result = validateAIEngineeringSkill('user-feedback');

    it('should exist', () => {
      expect(existsSync(result.path), `File missing: ${result.path}`).toBe(true);
    });

    it('should have valid frontmatter', () => {
      expect(result.errors.filter(e => e.includes('frontmatter'))).toHaveLength(0);
    });

    it('should cover explicit and implicit feedback', () => {
      expect(result.content.toLowerCase()).toMatch(/explicit|implicit|feedback/i);
    });

    it('should cover A/B testing', () => {
      expect(result.content.toLowerCase()).toMatch(/a.?b.?test|variant|experiment/i);
    });
  });
});

// =============================================================================
// Summary Statistics
// =============================================================================

describe('AI Engineering Skills Summary', () => {
  const allSkills = [
    'foundation-models',
    'evaluation-methodology',
    'ai-system-evaluation',
    'prompt-engineering',
    'rag-systems',
    'ai-agents',
    'finetuning',
    'dataset-engineering',
    'inference-optimization',
    'ai-architecture',
    'guardrails-safety',
    'user-feedback'
  ];

  it('should have 12 AI engineering sub-skills', () => {
    const implemented = allSkills.filter(skill => {
      const path = join(AI_ENGINEERING_DIR, skill, 'SKILL.md');
      return existsSync(path);
    });
    expect(implemented.length).toBe(12);
  });

  it('should have 13 total SKILL.md files (root + 12 sub-skills)', () => {
    let count = 0;

    // Root skill
    if (existsSync(join(AI_ENGINEERING_DIR, 'SKILL.md'))) count++;

    // Sub-skills
    allSkills.forEach(skill => {
      if (existsSync(join(AI_ENGINEERING_DIR, skill, 'SKILL.md'))) count++;
    });

    expect(count).toBe(13);
  });

  it('all skills should have code examples', () => {
    allSkills.forEach(skill => {
      const skillPath = join(AI_ENGINEERING_DIR, skill, 'SKILL.md');
      if (existsSync(skillPath)) {
        const content = readFileSync(skillPath, 'utf8');
        expect(content, `${skill} missing code examples`).toContain('```');
      }
    });
  });

  it('all skills should have minimum content length', () => {
    allSkills.forEach(skill => {
      const skillPath = join(AI_ENGINEERING_DIR, skill, 'SKILL.md');
      if (existsSync(skillPath)) {
        const content = readFileSync(skillPath, 'utf8');
        expect(content.length, `${skill} content too short`).toBeGreaterThan(500);
      }
    });
  });
});
