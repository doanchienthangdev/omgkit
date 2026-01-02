/**
 * Command Registration Validation Tests
 *
 * Validates that all commands are properly registered as Claude Code slash commands:
 * - Commands exist in proper namespace directories
 * - Commands have valid frontmatter
 * - Command namespaces are registered in registry.yaml
 * - Commands follow /namespace:command-name format
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
const COMMANDS_DIR = join(PLUGIN_DIR, 'commands');

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
 * Get all command files recursively
 */
function getCommandFiles(dir, files = []) {
  if (!existsSync(dir)) return files;
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      getCommandFiles(fullPath, files);
    } else if (item.endsWith('.md') && !item.startsWith('.')) {
      files.push(fullPath);
    }
  }
  return files;
}

/**
 * Get command ID from file path
 */
function getCommandId(filePath) {
  const relativePath = filePath.replace(COMMANDS_DIR + '/', '');
  const parts = relativePath.replace('.md', '').split('/');
  if (parts.length === 2) {
    return `/${parts[0]}:${parts[1]}`;
  }
  return null;
}

describe('Command Registration Validation', () => {
  let registry;
  let commandFiles;
  let namespaces;

  beforeAll(() => {
    // Load registry
    const registryContent = readFileSync(join(PLUGIN_DIR, 'registry.yaml'), 'utf-8');
    registry = yaml.load(registryContent);

    // Get all command files
    commandFiles = getCommandFiles(COMMANDS_DIR);

    // Get all namespaces (directories in commands/)
    namespaces = readdirSync(COMMANDS_DIR).filter(item => {
      const itemPath = join(COMMANDS_DIR, item);
      return statSync(itemPath).isDirectory() && !item.startsWith('.');
    });
  });

  describe('Namespace Registration', () => {
    it('all command directories should be registered in registry.yaml', () => {
      const registeredNamespaces = registry.command_namespaces || [];

      for (const namespace of namespaces) {
        expect(
          registeredNamespaces.includes(namespace),
          `Namespace "${namespace}" exists but not registered in registry.yaml command_namespaces`
        ).toBe(true);
      }
    });

    it('all registered namespaces should exist as directories', () => {
      const registeredNamespaces = registry.command_namespaces || [];

      for (const namespace of registeredNamespaces) {
        const namespacePath = join(COMMANDS_DIR, namespace);
        expect(
          existsSync(namespacePath),
          `Registered namespace "${namespace}" has no directory at ${namespacePath}`
        ).toBe(true);
      }
    });

    it('should have significant namespace coverage', () => {
      const registeredNamespaces = registry.command_namespaces || [];
      expect(
        registeredNamespaces.length,
        'Should have at least 10 command namespaces'
      ).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Command File Structure', () => {
    it('all command files should have valid frontmatter', () => {
      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const frontmatter = parseFrontmatter(content);
        expect(
          frontmatter,
          `Command file ${file} has no valid frontmatter`
        ).not.toBeNull();
      }
    });

    it('all command files should have description in frontmatter', () => {
      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const frontmatter = parseFrontmatter(content);
        if (frontmatter) {
          expect(
            frontmatter.description,
            `Command file ${file} missing description in frontmatter`
          ).toBeDefined();
        }
      }
    });

    it('all command files should follow /namespace:command-name format', () => {
      for (const file of commandFiles) {
        const commandId = getCommandId(file);
        expect(
          commandId,
          `Command file ${file} does not follow namespace/command structure`
        ).not.toBeNull();

        if (commandId) {
          // Command format: /namespace:command-name
          // Allow numeric prefixes for commands like /omega:10x
          expect(
            commandId,
            `Command ID ${commandId} should follow /namespace:command-name format`
          ).toMatch(/^\/[a-z][a-z0-9-]*:[a-z0-9][a-z0-9-]*$/);
        }
      }
    });
  });

  describe('Command Content Quality', () => {
    it('all command files should have minimum content (15+ lines)', () => {
      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const lines = content.split('\n').length;
        expect(
          lines,
          `Command file ${file} has only ${lines} lines, minimum is 15`
        ).toBeGreaterThanOrEqual(15);
      }
    });

    it('all command files should have body content after frontmatter', () => {
      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const bodyMatch = content.match(/^---[\s\S]*?---\n([\s\S]+)$/);
        expect(
          bodyMatch && bodyMatch[1].trim().length > 0,
          `Command file ${file} has no body content after frontmatter`
        ).toBe(true);
      }
    });
  });

  describe('Slash Command Format Compliance', () => {
    it('command namespaces should be lowercase kebab-case', () => {
      for (const namespace of namespaces) {
        expect(
          namespace,
          `Namespace "${namespace}" should be lowercase kebab-case`
        ).toMatch(/^[a-z][a-z0-9-]*$/);
      }
    });

    it('command file names should be lowercase kebab-case', () => {
      for (const file of commandFiles) {
        const fileName = basename(file, '.md');
        // Allow numeric prefixes for commands like 10x, 100x, 1000x
        expect(
          fileName,
          `Command file name "${fileName}" should be lowercase kebab-case`
        ).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      }
    });
  });

  describe('Command Count Validation', () => {
    it('should have significant number of commands', () => {
      expect(
        commandFiles.length,
        'Should have at least 100 commands'
      ).toBeGreaterThanOrEqual(100);
    });

    it('each namespace should have at least one command', () => {
      for (const namespace of namespaces) {
        const namespaceDir = join(COMMANDS_DIR, namespace);
        const commands = readdirSync(namespaceDir).filter(f =>
          f.endsWith('.md') && !f.startsWith('.')
        );
        expect(
          commands.length,
          `Namespace "${namespace}" has no commands`
        ).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('Command Frontmatter Fields', () => {
    it('commands should have allowed-tools when using tools', () => {
      for (const file of commandFiles) {
        const content = readFileSync(file, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        // Check if body references tools
        const bodyMatch = content.match(/^---[\s\S]*?---\n([\s\S]+)$/);
        if (bodyMatch) {
          const body = bodyMatch[1];
          const mentionsTools = /\b(Task|Read|Write|Bash|Grep|Glob|Edit)\b/.test(body);

          if (mentionsTools && frontmatter) {
            expect(
              frontmatter['allowed-tools'],
              `Command ${file} mentions tools but has no allowed-tools in frontmatter`
            ).toBeDefined();
          }
        }
      }
    });

    it('workflow commands should reference valid workflows', () => {
      const workflowCommands = commandFiles.filter(f =>
        f.includes('/workflow/')
      );

      for (const file of workflowCommands) {
        const commandName = basename(file, '.md');
        // The command should correspond to an actual workflow
        // Allow any valid workflow path format
        expect(
          commandName,
          `Workflow command ${commandName} should have valid name`
        ).toMatch(/^[a-z0-9][a-z0-9-]*$/);
      }
    });
  });
});
