/**
 * Mock File System Utilities
 *
 * Utilities for creating isolated test environments with mock file systems
 */

import { mkdirSync, rmSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { randomBytes } from 'crypto';
import { createValidAgent, createValidSkill, createValidCommand, createValidWorkflow } from './test-factories.js';

/**
 * Generate unique test directory path
 */
export function getTestDir(prefix = 'omgkit-test') {
  const id = randomBytes(4).toString('hex');
  return join('/tmp', `${prefix}-${id}`);
}

/**
 * Create a mock plugin directory structure
 * @param {string} baseDir - Base directory for the mock
 * @returns {string} - Path to the created mock plugin directory
 */
export function createMockPluginDir(baseDir) {
  const pluginDir = join(baseDir, '.claude', 'plugins', 'omgkit');

  // Create directory structure
  const dirs = [
    'agents',
    'skills/testing/omega-testing',
    'skills/methodology/tdd',
    'commands/quality',
    'commands/dev',
    'workflows/testing',
    'modes',
    'templates',
    'mcp',
    'stdrules',
  ];

  for (const dir of dirs) {
    mkdirSync(join(pluginDir, dir), { recursive: true });
  }

  // Create sample files
  const files = {
    'agents/tester.md': createValidAgent({ name: 'tester' }).content,
    'agents/code-reviewer.md': createValidAgent({ name: 'code-reviewer' }).content,
    'skills/testing/omega-testing/SKILL.md': createValidSkill({ name: 'omega-testing', category: 'testing' }).content,
    'skills/methodology/tdd/SKILL.md': createValidSkill({ name: 'tdd', category: 'methodology' }).content,
    'commands/quality/test-omega.md': createValidCommand({ name: 'test-omega', namespace: 'quality' }).content,
    'commands/dev/test.md': createValidCommand({ name: 'test', namespace: 'dev' }).content,
    'workflows/testing/omega-testing.md': createValidWorkflow({ name: 'omega-testing', category: 'testing' }).content,
    'modes/default.md': '---\nname: default\ndescription: Default mode\n---\n# Default Mode\n',
    'registry.yaml': createMockRegistry(),
  };

  for (const [path, content] of Object.entries(files)) {
    writeFileSync(join(pluginDir, path), content);
  }

  return pluginDir;
}

/**
 * Create a mock project directory with .omgkit
 * @param {string} baseDir - Base directory for the mock
 * @returns {string} - Path to the created mock project
 */
export function createMockProject(baseDir) {
  const projectDir = join(baseDir, 'test-project');
  const omgkitDir = join(projectDir, '.omgkit');

  mkdirSync(join(omgkitDir, 'memory', 'context'), { recursive: true });
  mkdirSync(join(omgkitDir, 'memory', 'decisions'), { recursive: true });
  mkdirSync(join(omgkitDir, 'generated'), { recursive: true });
  mkdirSync(join(omgkitDir, 'cache'), { recursive: true });

  // Create config files
  writeFileSync(join(omgkitDir, 'config.yaml'), `# OMGKIT Project Config
version: 1.0.0
project:
  name: test-project
  type: web-app
`);

  writeFileSync(join(omgkitDir, 'state.yaml'), `# Project State
phase: development
currentTask: null
`);

  // Create some source files
  mkdirSync(join(projectDir, 'src'), { recursive: true });
  writeFileSync(join(projectDir, 'src', 'index.js'), '// Main entry point\n');
  writeFileSync(join(projectDir, 'package.json'), JSON.stringify({
    name: 'test-project',
    version: '1.0.0',
  }, null, 2));

  return projectDir;
}

/**
 * Create a mock registry.yaml
 */
function createMockRegistry() {
  return `# OMGKIT Registry
version: 2.21.7

alignment_principle:
  name: "Optimized Alignment Principle (OAP)"
  version: "2.0"
  hierarchy:
    - level: 0
      name: MCPs
      description: Foundation tools
    - level: 1
      name: Commands
      description: Atomic operations
    - level: 2
      name: Skills
      description: Domain expertise
    - level: 3
      name: Agents
      description: Specialized roles
    - level: 4
      name: Workflows
      description: Multi-step processes

agents:
  tester:
    description: "Testing specialist"
  code-reviewer:
    description: "Code review specialist"

command_namespaces:
  quality:
    description: "Quality assurance commands"
  dev:
    description: "Development commands"

skill_categories:
  testing:
    description: "Testing skills"
  methodology:
    description: "Methodology skills"

workflows:
  testing/omega-testing:
    description: "Comprehensive testing workflow"
`;
}

/**
 * Cleanup test directory
 * @param {string} dir - Directory to clean up
 */
export function cleanupTestDir(dir) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Create a large test project with many files
 * @param {number} fileCount - Number of files to create
 * @param {string} baseDir - Optional base directory
 * @returns {string} - Path to created project
 */
export function createLargeTestProject(fileCount, baseDir = getTestDir('large-project')) {
  mkdirSync(baseDir, { recursive: true });

  for (let i = 0; i < fileCount; i++) {
    const subdir = `dir${Math.floor(i / 100)}`;
    const filePath = join(baseDir, subdir, `file${i}.md`);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, `# File ${i}\n\nContent for file ${i}\n`);
  }

  return baseDir;
}

/**
 * Create deeply nested directory structure
 * @param {number} depth - Nesting depth
 * @param {string} baseDir - Optional base directory
 * @returns {string} - Path to deepest directory
 */
export function createDeepNesting(depth, baseDir = getTestDir('deep-nest')) {
  let currentPath = baseDir;

  for (let i = 0; i < depth; i++) {
    currentPath = join(currentPath, `level${i}`);
  }

  mkdirSync(currentPath, { recursive: true });
  writeFileSync(join(currentPath, 'SKILL.md'), '---\nname: deep-skill\ndescription: A deeply nested skill\n---\n# Deep Skill\n');

  return currentPath;
}

/**
 * Create partial/corrupted installation
 * @param {string} baseDir - Base directory
 * @returns {string} - Path to partial installation
 */
export function createPartialInstall(baseDir) {
  const pluginDir = join(baseDir, '.claude', 'plugins', 'omgkit');

  // Only create some directories
  mkdirSync(join(pluginDir, 'agents'), { recursive: true });
  mkdirSync(join(pluginDir, 'commands'), { recursive: true });
  // Missing: skills, workflows, registry.yaml, etc.

  return pluginDir;
}

/**
 * Create corrupted registry file
 * @param {string} pluginDir - Plugin directory
 */
export function corruptRegistry(pluginDir) {
  const registryPath = join(pluginDir, 'registry.yaml');
  writeFileSync(registryPath, 'invalid: [yaml: syntax: broken');
}

/**
 * Count files in directory recursively
 * @param {string} dir - Directory to count
 * @returns {number}
 */
export function countFilesRecursive(dir) {
  if (!existsSync(dir)) return 0;

  let count = 0;
  const items = readdirSync(dir);

  for (const item of items) {
    const itemPath = join(dir, item);
    const stat = statSync(itemPath);
    if (stat.isDirectory()) {
      count += countFilesRecursive(itemPath);
    } else {
      count++;
    }
  }

  return count;
}

/**
 * Create test home directory structure
 * @returns {{homeDir: string, pluginDir: string, cleanup: Function}}
 */
export function createTestHome() {
  const homeDir = getTestDir('home');
  mkdirSync(homeDir, { recursive: true });
  const pluginDir = createMockPluginDir(homeDir);

  return {
    homeDir,
    pluginDir,
    cleanup: () => cleanupTestDir(homeDir),
  };
}

/**
 * Create files with specific content for testing
 * @param {string} baseDir - Base directory
 * @param {Object} files - Object mapping paths to content
 */
export function createFiles(baseDir, files) {
  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(baseDir, path);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content);
  }
}

export default {
  getTestDir,
  createMockPluginDir,
  createMockProject,
  cleanupTestDir,
  createLargeTestProject,
  createDeepNesting,
  createPartialInstall,
  corruptRegistry,
  countFilesRecursive,
  createTestHome,
  createFiles,
};
