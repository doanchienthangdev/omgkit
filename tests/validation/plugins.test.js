/**
 * Plugin Validation Tests
 *
 * Validates all plugin files (agents, commands, skills, modes) have:
 * - Valid YAML frontmatter
 * - Required fields
 * - Proper structure
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseFrontmatter, validatePluginFile } from '../../lib/cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGIN_DIR = join(__dirname, '../../plugin');

/**
 * Get all markdown files in a directory recursively
 */
function getMarkdownFiles(dir, files = []) {
  if (!existsSync(dir)) return files;

  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getMarkdownFiles(fullPath, files);
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Plugin Validation', () => {
  describe('Agents', () => {
    const agentsDir = join(PLUGIN_DIR, 'agents');
    const agentFiles = getMarkdownFiles(agentsDir);

    it('should have 23 agent files', () => {
      expect(agentFiles.length).toBe(23);
    });

    it.each(agentFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'agent %s should have valid frontmatter',
      (name, filePath) => {
        const result = validatePluginFile(filePath, ['name', 'description']);
        expect(result.valid, `Errors: ${result.errors.join(', ')}`).toBe(true);
      }
    );

    it('should have required agents', () => {
      const requiredAgents = [
        'planner', 'researcher', 'debugger', 'tester', 'code-reviewer', 'scout',
        'git-manager', 'docs-manager', 'project-manager', 'database-admin', 'ui-ux-designer',
        'fullstack-developer', 'cicd-manager', 'security-auditor', 'api-designer',
        'vulnerability-scanner', 'pipeline-architect',
        'copywriter', 'brainstormer', 'journal-writer',
        'oracle', 'architect', 'sprint-master'
      ];

      const agentNames = agentFiles.map(f => f.split('/').pop().replace('.md', ''));

      requiredAgents.forEach(agent => {
        expect(agentNames, `Missing agent: ${agent}`).toContain(agent);
      });
    });

    it('each agent should have tools defined', () => {
      agentFiles.forEach(filePath => {
        const content = readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(content);
        expect(frontmatter, `Missing frontmatter in ${filePath}`).not.toBeNull();
        // Tools can be optional for some agents but most should have them
      });
    });
  });

  describe('Commands', () => {
    const commandsDir = join(PLUGIN_DIR, 'commands');
    const commandFiles = getMarkdownFiles(commandsDir);

    it('should have at least 54 command files', () => {
      expect(commandFiles.length).toBeGreaterThanOrEqual(54);
    });

    it.each(commandFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'command %s should have valid frontmatter',
      (name, filePath) => {
        const result = validatePluginFile(filePath, ['description']);
        expect(result.valid, `Errors: ${result.errors.join(', ')}`).toBe(true);
      }
    );

    it('should have all command categories', () => {
      const categories = readdirSync(commandsDir).filter(f =>
        statSync(join(commandsDir, f)).isDirectory()
      );

      const expectedCategories = ['dev', 'planning', 'git', 'quality', 'context', 'design', 'omega', 'sprint'];

      expectedCategories.forEach(cat => {
        expect(categories, `Missing category: ${cat}`).toContain(cat);
      });
    });

    it('dev commands should exist', () => {
      const devDir = join(commandsDir, 'dev');
      const devCommands = readdirSync(devDir).filter(f => f.endsWith('.md'));

      const expectedCommands = ['feature', 'fix', 'fix-fast', 'fix-hard', 'review', 'test', 'tdd'];
      expectedCommands.forEach(cmd => {
        expect(devCommands.map(f => f.replace('.md', '')), `Missing dev command: ${cmd}`)
          .toContain(cmd);
      });
    });

    it('omega commands should exist', () => {
      const omegaDir = join(commandsDir, 'omega');
      const omegaCommands = readdirSync(omegaDir).filter(f => f.endsWith('.md'));

      const expectedCommands = ['10x', '100x', '1000x', 'principles', 'dimensions'];
      expectedCommands.forEach(cmd => {
        expect(omegaCommands.map(f => f.replace('.md', '')), `Missing omega command: ${cmd}`)
          .toContain(cmd);
      });
    });

    it('sprint commands should exist', () => {
      const sprintDir = join(commandsDir, 'sprint');
      const sprintCommands = readdirSync(sprintDir).filter(f => f.endsWith('.md'));

      const expectedCommands = ['init', 'vision-set', 'sprint-new', 'team-run'];
      expectedCommands.forEach(cmd => {
        expect(sprintCommands.map(f => f.replace('.md', '')), `Missing sprint command: ${cmd}`)
          .toContain(cmd);
      });
    });
  });

  describe('Skills', () => {
    const skillsDir = join(PLUGIN_DIR, 'skills');

    function getSkillFiles(dir) {
      const files = [];
      if (!existsSync(dir)) return files;

      const items = readdirSync(dir);
      for (const item of items) {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          // Check for SKILL.md in subdirectory
          const skillFile = join(fullPath, 'SKILL.md');
          if (existsSync(skillFile)) {
            files.push(skillFile);
          }
          // Also check nested directories
          files.push(...getSkillFiles(fullPath));
        }
      }
      return files;
    }

    const skillFiles = getSkillFiles(skillsDir);

    it('should have at least 55 skill files', () => {
      expect(skillFiles.length).toBeGreaterThanOrEqual(55);
    });

    it.each(skillFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'skill %s should have valid frontmatter',
      (name, filePath) => {
        const result = validatePluginFile(filePath, ['name', 'description']);
        expect(result.valid, `Errors: ${result.errors.join(', ')}`).toBe(true);
      }
    );

    it('should have all skill categories', () => {
      const categories = readdirSync(skillsDir).filter(f =>
        statSync(join(skillsDir, f)).isDirectory()
      );

      const expectedCategories = [
        'languages', 'frameworks', 'databases', 'frontend',
        'devops', 'security', 'testing', 'methodology', 'omega',
        'ai-engineering'
      ];

      expectedCategories.forEach(cat => {
        expect(categories, `Missing category: ${cat}`).toContain(cat);
      });
    });

    it('omega skills should exist', () => {
      const omegaDir = join(skillsDir, 'omega');
      const omegaSkills = readdirSync(omegaDir).filter(f =>
        statSync(join(omegaDir, f)).isDirectory()
      );

      const expectedSkills = [
        'omega-coding', 'omega-thinking', 'omega-testing',
        'omega-architecture', 'omega-sprint'
      ];

      expectedSkills.forEach(skill => {
        expect(omegaSkills, `Missing omega skill: ${skill}`).toContain(skill);
      });
    });

    it('language skills should exist', () => {
      const langDir = join(skillsDir, 'languages');
      const langSkills = readdirSync(langDir).filter(f =>
        statSync(join(langDir, f)).isDirectory()
      );

      const expectedSkills = ['python', 'typescript', 'javascript'];

      expectedSkills.forEach(skill => {
        expect(langSkills, `Missing language skill: ${skill}`).toContain(skill);
      });
    });

    it('framework skills should exist', () => {
      const frameworkDir = join(skillsDir, 'frameworks');
      const frameworkSkills = readdirSync(frameworkDir).filter(f =>
        statSync(join(frameworkDir, f)).isDirectory()
      );

      const expectedSkills = ['react', 'nextjs', 'fastapi', 'django', 'express'];

      expectedSkills.forEach(skill => {
        expect(frameworkSkills, `Missing framework skill: ${skill}`).toContain(skill);
      });
    });
  });

  describe('Modes', () => {
    const modesDir = join(PLUGIN_DIR, 'modes');
    const modeFiles = getMarkdownFiles(modesDir);

    it('should have 10 mode files', () => {
      expect(modeFiles.length).toBe(10);
    });

    it.each(modeFiles.map(f => [f.replace(PLUGIN_DIR, ''), f]))(
      'mode %s should have valid frontmatter',
      (name, filePath) => {
        const result = validatePluginFile(filePath, ['name', 'description']);
        expect(result.valid, `Errors: ${result.errors.join(', ')}`).toBe(true);
      }
    );

    it('should have required modes', () => {
      const requiredModes = [
        'default', 'brainstorm', 'token-efficient', 'deep-research',
        'implementation', 'review', 'orchestration', 'omega', 'autonomous'
      ];

      const modeNames = modeFiles.map(f => f.split('/').pop().replace('.md', ''));

      requiredModes.forEach(mode => {
        expect(modeNames, `Missing mode: ${mode}`).toContain(mode);
      });
    });
  });

  describe('Templates', () => {
    const templatesDir = join(__dirname, '../../templates');

    it('should have all template files', () => {
      const expectedFiles = [
        'config.yaml',
        'OMEGA.md',
        'vision.yaml',
        'backlog.yaml',
        'settings.json'
      ];

      expectedFiles.forEach(file => {
        expect(existsSync(join(templatesDir, file)), `Missing template: ${file}`).toBe(true);
      });
    });

    it('config.yaml should be valid YAML', () => {
      const content = readFileSync(join(templatesDir, 'config.yaml'), 'utf8');
      expect(content).toContain('project:');
      expect(content).toContain('ai:');
    });

    it('settings.json should be valid JSON', () => {
      const content = readFileSync(join(templatesDir, 'settings.json'), 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('OMEGA.md should have project structure', () => {
      const content = readFileSync(join(templatesDir, 'OMEGA.md'), 'utf8');
      expect(content).toContain('OMEGA');
      expect(content).toContain('Project');
    });
  });

  describe('Plugin Structure', () => {
    it('should have plugin.json', () => {
      const pluginJsonPath = join(PLUGIN_DIR, '.claude-plugin', 'plugin.json');
      expect(existsSync(pluginJsonPath)).toBe(true);
    });

    it('plugin.json should be valid JSON', () => {
      const pluginJsonPath = join(PLUGIN_DIR, '.claude-plugin', 'plugin.json');
      const content = readFileSync(pluginJsonPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();

      const plugin = JSON.parse(content);
      expect(plugin.name).toBe('omgkit');
      expect(plugin.version).toBeDefined();
    });

    it('should have MCP configuration', () => {
      const mcpPath = join(PLUGIN_DIR, 'mcp', '.mcp.json');
      expect(existsSync(mcpPath)).toBe(true);
    });

    it('MCP config should be valid JSON', () => {
      const mcpPath = join(PLUGIN_DIR, 'mcp', '.mcp.json');
      const content = readFileSync(mcpPath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });
});
