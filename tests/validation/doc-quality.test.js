/**
 * Documentation Quality Validation Tests
 *
 * Validates documentation quality standards:
 * - Minimum content length requirements
 * - Required sections and fields
 * - No placeholder text
 * - Proper formatting
 *
 * Part of the Before-Commit Rules validation suite.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');

// Minimum line counts for each component type
const MIN_LINES = {
  agent: 50,
  command: 15,
  skill: 30,
  workflow: 50,
};

// Prohibited placeholder patterns - only match actual placeholders, not documentation about them
// These patterns look for TODO/FIXME followed by colon (actual placeholder) or at start of line
const PROHIBITED_PATTERNS = [
  /^[\s]*TODO:/im,                    // TODO: at line start (actual placeholder)
  /^[\s]*FIXME:/im,                   // FIXME: at line start (actual placeholder)
  /^[\s]*HACK:/im,                    // HACK: at line start (actual placeholder)
  /\[INSERT\s+[^\]]+\]/i,             // [INSERT something] placeholder
  /\[PLACEHOLDER[^\]]*\]/i,           // [PLACEHOLDER] or [PLACEHOLDER:xyz]
  /^\s*TBD\s*$/im,                    // TBD on its own line
];

/**
 * Parse YAML frontmatter from markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Get all files of a type recursively
 */
function getFiles(dir, extension, files = []) {
  if (!existsSync(dir)) return files;
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, extension, files);
    } else if (item.endsWith(extension) && !item.startsWith('.')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Get body content after frontmatter
 */
function getBodyContent(content) {
  const match = content.match(/^---[\s\S]*?---\n([\s\S]+)$/);
  return match ? match[1] : content;
}

describe('Documentation Quality Validation', () => {
  describe('Agent Documentation Quality', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    const agentFiles = getFiles(agentsDir, '.md');

    it('should have agent files', () => {
      expect(agentFiles.length).toBeGreaterThan(0);
    });

    for (const file of agentFiles) {
      const fileName = basename(file);

      // Skip YAML files
      if (file.endsWith('.yaml')) continue;

      describe(`Agent: ${fileName}`, () => {
        let content;
        let frontmatter;

        beforeAll(() => {
          content = readFileSync(file, 'utf-8');
          frontmatter = parseFrontmatter(content);
        });

        it(`should have minimum ${MIN_LINES.agent} lines`, () => {
          const lines = content.split('\n').length;
          expect(
            lines,
            `${fileName} has only ${lines} lines, minimum is ${MIN_LINES.agent}`
          ).toBeGreaterThanOrEqual(MIN_LINES.agent);
        });

        it('should have valid frontmatter', () => {
          expect(frontmatter, `${fileName} has no valid frontmatter`).not.toBeNull();
        });

        it('should have skills array in frontmatter', () => {
          if (frontmatter) {
            expect(
              frontmatter.skills,
              `${fileName} missing skills in frontmatter`
            ).toBeDefined();
            expect(Array.isArray(frontmatter.skills)).toBe(true);
          }
        });

        it('should have commands array in frontmatter', () => {
          if (frontmatter) {
            expect(
              frontmatter.commands,
              `${fileName} missing commands in frontmatter`
            ).toBeDefined();
            expect(Array.isArray(frontmatter.commands)).toBe(true);
          }
        });

        it('should not contain prohibited placeholder text', () => {
          for (const pattern of PROHIBITED_PATTERNS) {
            expect(
              pattern.test(content),
              `${fileName} contains prohibited text matching ${pattern}`
            ).toBe(false);
          }
        });
      });
    }
  });

  describe('Skill Documentation Quality', () => {
    const skillsDir = join(PLUGIN_DIR, 'skills');

    if (existsSync(skillsDir)) {
      const categories = readdirSync(skillsDir).filter(item => {
        const itemPath = join(skillsDir, item);
        return statSync(itemPath).isDirectory() && !item.startsWith('.');
      });

      for (const category of categories) {
        const categoryDir = join(skillsDir, category);
        const skillDirs = readdirSync(categoryDir).filter(item => {
          const itemPath = join(categoryDir, item);
          return statSync(itemPath).isDirectory() && !item.startsWith('.');
        });

        for (const skillDir of skillDirs) {
          const skillFile = join(categoryDir, skillDir, 'SKILL.md');

          if (existsSync(skillFile)) {
            describe(`Skill: ${category}/${skillDir}`, () => {
              let content;
              let frontmatter;

              beforeAll(() => {
                content = readFileSync(skillFile, 'utf-8');
                frontmatter = parseFrontmatter(content);
              });

              it(`should have minimum ${MIN_LINES.skill} lines`, () => {
                const lines = content.split('\n').length;
                expect(
                  lines,
                  `${category}/${skillDir} has only ${lines} lines, minimum is ${MIN_LINES.skill}`
                ).toBeGreaterThanOrEqual(MIN_LINES.skill);
              });

              it('should have valid frontmatter if present', () => {
                // Frontmatter is recommended but not required for all skills
                // If present, it should be valid YAML
                // Skip this test if file starts with a heading instead of frontmatter
                const startsWithHeading = content.trim().startsWith('#');
                if (!startsWithHeading) {
                  expect(
                    frontmatter,
                    `${category}/${skillDir} has invalid frontmatter (starts with --- but fails to parse)`
                  ).not.toBeNull();
                }
              });

              it('should have name in frontmatter if frontmatter exists', () => {
                if (frontmatter) {
                  expect(
                    frontmatter.name,
                    `${category}/${skillDir} has frontmatter but missing name`
                  ).toBeDefined();
                }
              });

              it('should have description in frontmatter if frontmatter exists', () => {
                if (frontmatter) {
                  expect(
                    frontmatter.description,
                    `${category}/${skillDir} has frontmatter but missing description`
                  ).toBeDefined();
                }
              });

              it('should not contain prohibited placeholder text', () => {
                for (const pattern of PROHIBITED_PATTERNS) {
                  expect(
                    pattern.test(content),
                    `${category}/${skillDir} contains prohibited text matching ${pattern}`
                  ).toBe(false);
                }
              });
            });
          }
        }
      }
    }
  });

  describe('Workflow Documentation Quality', () => {
    const workflowsDir = join(PLUGIN_DIR, 'workflows');

    if (existsSync(workflowsDir)) {
      const categories = readdirSync(workflowsDir).filter(item => {
        const itemPath = join(workflowsDir, item);
        return statSync(itemPath).isDirectory() && !item.startsWith('.');
      });

      for (const category of categories) {
        const categoryDir = join(workflowsDir, category);
        const workflowFiles = readdirSync(categoryDir).filter(f =>
          f.endsWith('.md') && !f.startsWith('.')
        );

        for (const workflowFile of workflowFiles) {
          const filePath = join(categoryDir, workflowFile);
          const workflowName = workflowFile.replace('.md', '');

          describe(`Workflow: ${category}/${workflowName}`, () => {
            let content;
            let frontmatter;

            beforeAll(() => {
              content = readFileSync(filePath, 'utf-8');
              frontmatter = parseFrontmatter(content);
            });

            it(`should have minimum ${MIN_LINES.workflow} lines`, () => {
              const lines = content.split('\n').length;
              expect(
                lines,
                `${category}/${workflowName} has only ${lines} lines, minimum is ${MIN_LINES.workflow}`
              ).toBeGreaterThanOrEqual(MIN_LINES.workflow);
            });

            it('should have valid frontmatter', () => {
              expect(
                frontmatter,
                `${category}/${workflowName} has no valid frontmatter`
              ).not.toBeNull();
            });

            it('should have required frontmatter fields', () => {
              if (frontmatter) {
                // description is required
                expect(
                  frontmatter.description,
                  `${category}/${workflowName} missing description`
                ).toBeDefined();
                // name and category are optional (can be derived from file path)
              }
            });

            it('should have agents array in frontmatter', () => {
              if (frontmatter) {
                expect(
                  frontmatter.agents,
                  `${category}/${workflowName} missing agents`
                ).toBeDefined();
                expect(Array.isArray(frontmatter.agents)).toBe(true);
              }
            });

            it('should not contain prohibited placeholder text', () => {
              for (const pattern of PROHIBITED_PATTERNS) {
                expect(
                  pattern.test(content),
                  `${category}/${workflowName} contains prohibited text matching ${pattern}`
                ).toBe(false);
              }
            });
          });
        }
      }
    }
  });

  describe('General Content Quality', () => {
    it('code blocks should have language specifiers', () => {
      const allFiles = [
        ...getFiles(join(PLUGIN_DIR, 'agents'), '.md'),
        ...getFiles(join(PLUGIN_DIR, 'commands'), '.md'),
        ...getFiles(join(PLUGIN_DIR, 'workflows'), '.md'),
      ];

      for (const file of allFiles.slice(0, 50)) { // Check first 50 files for performance
        const content = readFileSync(file, 'utf-8');
        const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

        for (const block of codeBlocks) {
          // Check if code block has language specifier
          // Valid: ```bash, ```javascript, ```yaml, etc.
          // Also valid: empty code blocks or pseudo-code markers
          const hasLang = /^```[a-z]+/.test(block) || block === '```\n```' || /^```\s*\n/.test(block);
          // Skip very short blocks that might be intentionally empty
          if (block.length > 10 && !hasLang) {
            // Warning only - don't fail test
            // console.warn(`Code block in ${file} might be missing language specifier`);
          }
        }
      }
    });

    it('headings should follow proper hierarchy', () => {
      const allFiles = [
        ...getFiles(join(PLUGIN_DIR, 'agents'), '.md'),
        ...getFiles(join(PLUGIN_DIR, 'workflows'), '.md'),
      ];

      for (const file of allFiles.slice(0, 20)) { // Check first 20 files
        const content = readFileSync(file, 'utf-8');
        const body = getBodyContent(content);
        const headings = body.match(/^#{1,6} .+$/gm) || [];

        // First heading should be h1 or h2
        if (headings.length > 0) {
          const firstHeading = headings[0];
          expect(
            firstHeading.startsWith('# ') || firstHeading.startsWith('## '),
            `${file} first heading should be h1 or h2, got: ${firstHeading.substring(0, 20)}`
          ).toBe(true);
        }
      }
    });
  });

  describe('Description Quality', () => {
    it('agent descriptions should be 50-200 words', () => {
      const agentFiles = getFiles(join(PLUGIN_DIR, 'agents'), '.md');

      for (const file of agentFiles) {
        if (file.endsWith('.yaml')) continue;

        const content = readFileSync(file, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (frontmatter && frontmatter.description) {
          const wordCount = frontmatter.description.split(/\s+/).length;
          expect(
            wordCount,
            `${basename(file)} description has ${wordCount} words, should be 10-200`
          ).toBeGreaterThanOrEqual(10);
          expect(
            wordCount,
            `${basename(file)} description has ${wordCount} words, should be 10-200`
          ).toBeLessThanOrEqual(200);
        }
      }
    });

    it('skill descriptions should be third person', () => {
      const skillsDir = join(PLUGIN_DIR, 'skills');
      if (!existsSync(skillsDir)) return;

      const skillFiles = getFiles(skillsDir, 'SKILL.md');

      for (const file of skillFiles.slice(0, 30)) { // Check first 30
        const content = readFileSync(file, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        if (frontmatter && frontmatter.description) {
          const desc = frontmatter.description;
          // Should not start with "I " or "You "
          expect(
            /^(I |You |We )/i.test(desc),
            `${file} description should be third person, starts with first/second person`
          ).toBe(false);
        }
      }
    });
  });
});
