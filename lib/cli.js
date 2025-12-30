/**
 * OMGKIT CLI Core Library
 * Exports all CLI functions for testing and reuse
 */

import { existsSync, mkdirSync, cpSync, readFileSync, rmSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Package root detection
let PACKAGE_ROOT;

export function setPackageRoot(root) {
  PACKAGE_ROOT = root;
}

export function getPackageRoot() {
  if (PACKAGE_ROOT) return PACKAGE_ROOT;

  // Default: find from current file location
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  PACKAGE_ROOT = join(__dirname, '..');
  return PACKAGE_ROOT;
}

// Colors for terminal output
export const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// Logger utilities
export const log = {
  info: (msg) => console.log(`${COLORS.cyan}ℹ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  omega: (msg) => console.log(`${COLORS.magenta}🔮${COLORS.reset} ${msg}`)
};

// Banner
export const BANNER = `
${COLORS.magenta}╔════════════════════════════════════════════════════════════╗
║                                                              ║
║   🔮 OMGKIT - Omega-Level Development Kit                   ║
║                                                              ║
║   23 Agents • 54 Commands • 43 Skills • 9 Modes             ║
║   "Think Omega. Build Omega. Be Omega."                     ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝${COLORS.reset}
`;

/**
 * Get the plugin installation directory
 * @param {string} [homeDir] - Optional home directory override for testing
 * @returns {string} Plugin directory path
 */
export function getPluginDir(homeDir) {
  const home = homeDir || process.env.HOME || process.env.USERPROFILE;
  return join(home, '.claude', 'plugins', 'omgkit');
}

/**
 * Get package version from package.json
 * @returns {string} Version string
 */
export function getVersion() {
  const pkgPath = join(getPackageRoot(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  return pkg.version;
}

/**
 * Check if plugin is installed
 * @param {string} [homeDir] - Optional home directory override
 * @returns {boolean}
 */
export function isPluginInstalled(homeDir) {
  return existsSync(getPluginDir(homeDir));
}

/**
 * Check if project is initialized
 * @param {string} [cwd] - Working directory to check
 * @returns {boolean}
 */
export function isProjectInitialized(cwd = process.cwd()) {
  return existsSync(join(cwd, '.omgkit'));
}

/**
 * Install the OMGKIT plugin
 * @param {Object} options - Installation options
 * @param {string} [options.homeDir] - Home directory override
 * @param {boolean} [options.silent] - Suppress output
 * @returns {Object} Result with success status and details
 */
export function installPlugin(options = {}) {
  const { homeDir, silent = false } = options;

  if (!silent) {
    console.log(BANNER);
    log.omega('Installing OMGKIT plugin...');
  }

  const pluginSrc = join(getPackageRoot(), 'plugin');
  const pluginDest = getPluginDir(homeDir);

  if (!existsSync(pluginSrc)) {
    if (!silent) log.error('Plugin source not found. Package may be corrupted.');
    return { success: false, error: 'SOURCE_NOT_FOUND' };
  }

  try {
    mkdirSync(pluginDest, { recursive: true });
    cpSync(pluginSrc, pluginDest, { recursive: true });
  } catch (err) {
    if (!silent) log.error(`Installation failed: ${err.message}`);
    return { success: false, error: err.message };
  }

  if (!silent) {
    log.success('Plugin installed successfully!');
    log.info(`Location: ${pluginDest}`);
    console.log(`
${COLORS.bright}Installed:${COLORS.reset}
  📦 23 Agents
  ⚡ 54 Commands
  🧠 43 Skills
  🎭 9 Modes

${COLORS.bright}Next steps:${COLORS.reset}
  1. cd your-project
  2. omgkit init
  3. Open Claude Code and type /help

${COLORS.magenta}🔮 Think Omega. Build Omega. Be Omega.${COLORS.reset}
`);
  }

  return { success: true, path: pluginDest };
}

/**
 * Initialize OMGKIT in a project directory
 * @param {Object} options - Initialization options
 * @param {string} [options.cwd] - Working directory
 * @param {boolean} [options.silent] - Suppress output
 * @returns {Object} Result with success status and created files
 */
export function initProject(options = {}) {
  const { cwd = process.cwd(), silent = false } = options;

  if (!silent) {
    console.log(BANNER);
    log.omega('Initializing OMGKIT in current project...');
  }

  const templatesDir = join(getPackageRoot(), 'templates');
  const createdFiles = [];
  const createdDirs = [];

  // Create directories
  const dirs = [
    '.omgkit',
    '.omgkit/sprints',
    '.omgkit/plans',
    '.omgkit/docs',
    '.omgkit/logs',
    '.omgkit/devlogs',
    '.omgkit/stdrules'
  ];

  dirs.forEach(dir => {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      createdDirs.push(dir);
      if (!silent) log.success(`Created ${dir}/`);
    }
  });

  // Copy templates
  const templates = [
    { src: 'config.yaml', dest: '.omgkit/config.yaml' },
    { src: 'OMEGA.md', dest: 'OMEGA.md' },
    { src: 'vision.yaml', dest: '.omgkit/sprints/vision.yaml' },
    { src: 'backlog.yaml', dest: '.omgkit/sprints/backlog.yaml' },
    { src: 'settings.json', dest: '.omgkit/settings.json' },
    { src: 'devlogs/README.md', dest: '.omgkit/devlogs/README.md' },
    { src: 'stdrules/README.md', dest: '.omgkit/stdrules/README.md' },
    { src: 'stdrules/SKILL_STANDARDS.md', dest: '.omgkit/stdrules/SKILL_STANDARDS.md' }
  ];

  templates.forEach(({ src, dest }) => {
    const srcPath = join(templatesDir, src);
    const destPath = join(cwd, dest);

    if (existsSync(srcPath) && !existsSync(destPath)) {
      cpSync(srcPath, destPath);
      createdFiles.push(dest);
      if (!silent) log.success(`Created ${dest}`);
    }
  });

  if (!silent) {
    console.log(`
${COLORS.bright}Project initialized!${COLORS.reset}

${COLORS.bright}Next steps in Claude Code:${COLORS.reset}
  /vision:set         Set your product vision
  /sprint:new         Create a sprint (add --propose for AI suggestions)
  /team:run           Start the AI team

${COLORS.bright}Quick commands:${COLORS.reset}
  /feature [desc]     Build a feature
  /fix [issue]        Fix a bug
  /10x [topic]        Find 10x improvement

${COLORS.magenta}🔮 Your Omega journey begins!${COLORS.reset}
`);
  }

  return { success: true, createdDirs, createdFiles };
}

/**
 * Run doctor diagnostics
 * @param {Object} options - Options
 * @param {string} [options.homeDir] - Home directory override
 * @param {string} [options.cwd] - Working directory
 * @param {boolean} [options.silent] - Suppress output
 * @returns {Object} Diagnostic results
 */
export function doctor(options = {}) {
  const { homeDir, cwd = process.cwd(), silent = false } = options;

  if (!silent) {
    console.log(BANNER);
    log.omega('Checking OMGKIT installation...\n');
  }

  const pluginDir = getPluginDir(homeDir);
  const result = {
    plugin: { installed: false, components: {} },
    project: { initialized: false, files: {} }
  };

  // Check plugin
  if (!silent) console.log(`${COLORS.bright}Plugin Status${COLORS.reset}`);

  if (existsSync(pluginDir)) {
    result.plugin.installed = true;
    result.plugin.path = pluginDir;
    if (!silent) log.success(`Installed at ${pluginDir}`);

    const components = [
      { path: 'commands', name: 'Commands' },
      { path: 'agents', name: 'Agents' },
      { path: 'skills', name: 'Skills' },
      { path: 'modes', name: 'Modes' }
    ];

    components.forEach(({ path, name }) => {
      const fullPath = join(pluginDir, path);
      const exists = existsSync(fullPath);
      result.plugin.components[path] = exists;
      if (!silent) {
        if (exists) {
          log.success(`  ${name}: ✓`);
        } else {
          log.warn(`  ${name}: Missing`);
        }
      }
    });
  } else {
    if (!silent) {
      log.error('Not installed');
      log.info('Run: omgkit install');
    }
  }

  // Check project
  if (!silent) console.log(`\n${COLORS.bright}Project Status${COLORS.reset}`);

  if (existsSync(join(cwd, '.omgkit'))) {
    result.project.initialized = true;
    result.project.path = cwd;
    if (!silent) log.success(`Initialized at ${cwd}`);

    const files = [
      '.omgkit/config.yaml',
      '.omgkit/sprints/vision.yaml',
      'OMEGA.md'
    ];

    files.forEach(f => {
      const exists = existsSync(join(cwd, f));
      result.project.files[f] = exists;
      if (!silent) {
        if (exists) {
          log.success(`  ${f}: ✓`);
        } else {
          log.warn(`  ${f}: Missing`);
        }
      }
    });
  } else {
    if (!silent) {
      log.warn('Not initialized');
      log.info('Run: omgkit init');
    }
  }

  return result;
}

/**
 * Uninstall the plugin
 * @param {Object} options - Options
 * @param {string} [options.homeDir] - Home directory override
 * @param {boolean} [options.silent] - Suppress output
 * @returns {Object} Result
 */
export function uninstallPlugin(options = {}) {
  const { homeDir, silent = false } = options;

  if (!silent) {
    console.log(BANNER);
    log.omega('Uninstalling OMGKIT plugin...');
  }

  const pluginDir = getPluginDir(homeDir);

  if (existsSync(pluginDir)) {
    rmSync(pluginDir, { recursive: true, force: true });
    if (!silent) log.success('Plugin uninstalled!');
    return { success: true, removed: true };
  } else {
    if (!silent) log.warn('Plugin not found.');
    return { success: true, removed: false };
  }
}

/**
 * Count files in a directory recursively
 * @param {string} dir - Directory path
 * @param {string} extension - File extension to count
 * @returns {number} File count
 */
export function countFiles(dir, extension = '.md') {
  let count = 0;
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        count += countFiles(fullPath, extension);
      } else if (item.endsWith(extension)) {
        count++;
      }
    }
  } catch (e) {
    // Directory doesn't exist
  }
  return count;
}

/**
 * List directory contents recursively (for display)
 * @param {string} dir - Directory to list
 * @param {string} prefix - Prefix for output
 * @returns {string[]} List of entries
 */
export function listDir(dir, prefix = '') {
  const entries = [];
  try {
    readdirSync(dir).forEach(f => {
      const fp = join(dir, f);
      if (statSync(fp).isDirectory()) {
        entries.push({ type: 'dir', name: f, prefix });
        entries.push(...listDir(fp, prefix + '  '));
      } else if (f.endsWith('.md')) {
        entries.push({ type: 'file', name: f.replace('.md', ''), prefix });
      }
    });
  } catch (e) {
    // Directory doesn't exist
  }
  return entries;
}

/**
 * List components (commands, agents, skills, modes)
 * @param {string} type - Component type or 'all'
 * @param {Object} options - Options
 * @returns {Object} Component listings
 */
export function listComponents(type, options = {}) {
  const { homeDir, silent = false } = options;

  if (!silent) console.log(BANNER);

  const pluginDir = getPluginDir(homeDir);

  if (!existsSync(pluginDir)) {
    if (!silent) log.error('Plugin not installed. Run: omgkit install');
    return { success: false, error: 'NOT_INSTALLED' };
  }

  const componentTypes = {
    commands: { title: 'Commands', count: 54 },
    agents: { title: 'Agents', count: 23 },
    skills: { title: 'Skills', count: 43 },
    modes: { title: 'Modes', count: 9 }
  };

  const result = { success: true, components: {} };

  const typesToList = (!type || type === 'all') ? Object.keys(componentTypes) : [type];

  typesToList.forEach(key => {
    if (!componentTypes[key]) return;

    const { title, count } = componentTypes[key];
    const dir = join(pluginDir, key);

    if (existsSync(dir)) {
      const entries = listDir(dir, '  ');
      const actualCount = countFiles(dir);
      result.components[key] = { entries, count: actualCount };

      if (!silent) {
        console.log(`\n${COLORS.bright}${title} (${actualCount})${COLORS.reset}`);
        entries.forEach(e => {
          if (e.type === 'dir') {
            console.log(`${e.prefix}📁 ${e.name}/`);
          } else {
            console.log(`${e.prefix}📄 ${e.name}`);
          }
        });
      }
    }
  });

  return result;
}

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - Markdown content
 * @returns {Object|null} Parsed frontmatter or null
 */
export function parseFrontmatter(content) {
  // Match frontmatter with optional content between ---
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    // Also try to match empty frontmatter (just ---)
    if (content.startsWith('---\n---')) {
      return {};
    }
    return null;
  }

  const yaml = match[1];
  const result = {};

  // Simple YAML parser for frontmatter
  yaml.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      result[key] = value;
    }
  });

  return result;
}

/**
 * Validate a plugin file's frontmatter
 * @param {string} filePath - Path to file
 * @param {string[]} requiredFields - Required frontmatter fields
 * @returns {Object} Validation result
 */
export function validatePluginFile(filePath, requiredFields = []) {
  const result = { valid: true, errors: [] };

  if (!existsSync(filePath)) {
    return { valid: false, errors: ['File does not exist'] };
  }

  const content = readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    return { valid: false, errors: ['No frontmatter found'] };
  }

  requiredFields.forEach(field => {
    if (!frontmatter[field]) {
      result.valid = false;
      result.errors.push(`Missing required field: ${field}`);
    }
  });

  result.frontmatter = frontmatter;
  return result;
}
