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
║   23 Agents • 58 Commands • 88 Skills • 10 Modes            ║
║   "Think Omega. Build Omega. Be Omega."                     ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝${COLORS.reset}
`;

/**
 * Get the plugin backup directory (for reference/updates)
 * @param {string} [homeDir] - Optional home directory override for testing
 * @returns {string} Plugin directory path
 */
export function getPluginDir(homeDir) {
  const home = homeDir || process.env.HOME || process.env.USERPROFILE;
  return join(home, '.claude', 'plugins', 'omgkit');
}

/**
 * Get the Claude Code commands directory
 * @param {string} [homeDir] - Optional home directory override for testing
 * @returns {string} Commands directory path
 */
export function getCommandsDir(homeDir) {
  const home = homeDir || process.env.HOME || process.env.USERPROFILE;
  return join(home, '.claude', 'commands');
}

/**
 * Get the Claude Code skills directory
 * @param {string} [homeDir] - Optional home directory override for testing
 * @returns {string} Skills directory path
 */
export function getSkillsDir(homeDir) {
  const home = homeDir || process.env.HOME || process.env.USERPROFILE;
  return join(home, '.claude', 'skills');
}

/**
 * Get the Claude Code agents directory
 * @param {string} [homeDir] - Optional home directory override for testing
 * @returns {string} Agents directory path
 */
export function getAgentsDir(homeDir) {
  const home = homeDir || process.env.HOME || process.env.USERPROFILE;
  return join(home, '.claude', 'agents');
}

/**
 * Copy commands from plugin to Claude Code commands directory
 * Commands are flattened with category prefix (e.g., dev/fix.md -> dev-fix.md)
 * @param {string} pluginSrc - Source plugin directory
 * @param {string} commandsDest - Destination commands directory
 * @returns {number} Number of commands copied
 */
function copyCommands(pluginSrc, commandsDest) {
  const commandsSrc = join(pluginSrc, 'commands');
  if (!existsSync(commandsSrc)) return 0;

  mkdirSync(commandsDest, { recursive: true });
  let count = 0;

  // Get all category directories
  const categories = readdirSync(commandsSrc).filter(f =>
    statSync(join(commandsSrc, f)).isDirectory()
  );

  for (const category of categories) {
    const categoryPath = join(commandsSrc, category);
    const files = readdirSync(categoryPath).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const srcPath = join(categoryPath, file);
      // Use category prefix with colon for clarity (e.g., dev:fix.md)
      const destName = `${category}:${file}`;
      const destPath = join(commandsDest, destName);
      cpSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

/**
 * Copy skills from plugin to Claude Code skills directory
 * Preserves the skill directory structure (category/skill-name/SKILL.md)
 * @param {string} pluginSrc - Source plugin directory
 * @param {string} skillsDest - Destination skills directory
 * @returns {number} Number of skills copied
 */
function copySkills(pluginSrc, skillsDest) {
  const skillsSrc = join(pluginSrc, 'skills');
  if (!existsSync(skillsSrc)) return 0;

  mkdirSync(skillsDest, { recursive: true });
  let count = 0;

  // Get all category directories
  const categories = readdirSync(skillsSrc).filter(f =>
    statSync(join(skillsSrc, f)).isDirectory()
  );

  for (const category of categories) {
    const categoryPath = join(skillsSrc, category);
    const skills = readdirSync(categoryPath).filter(f =>
      statSync(join(categoryPath, f)).isDirectory()
    );

    for (const skill of skills) {
      const skillSrcPath = join(categoryPath, skill);
      // Use flat structure with unique name: category-skill-name
      const skillDestPath = join(skillsDest, `${category}-${skill}`);
      cpSync(skillSrcPath, skillDestPath, { recursive: true });
      count++;
    }
  }

  return count;
}

/**
 * Copy agents from plugin to Claude Code agents directory
 * @param {string} pluginSrc - Source plugin directory
 * @param {string} agentsDest - Destination agents directory
 * @returns {number} Number of agents copied
 */
function copyAgents(pluginSrc, agentsDest) {
  const agentsSrc = join(pluginSrc, 'agents');
  if (!existsSync(agentsSrc)) return 0;

  mkdirSync(agentsDest, { recursive: true });
  let count = 0;

  const files = readdirSync(agentsSrc).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const srcPath = join(agentsSrc, file);
    const destPath = join(agentsDest, file);
    cpSync(srcPath, destPath);
    count++;
  }

  return count;
}

/**
 * Copy modes as special commands
 * @param {string} pluginSrc - Source plugin directory
 * @param {string} commandsDest - Destination commands directory
 * @returns {number} Number of modes copied
 */
function copyModes(pluginSrc, commandsDest) {
  const modesSrc = join(pluginSrc, 'modes');
  if (!existsSync(modesSrc)) return 0;

  mkdirSync(commandsDest, { recursive: true });
  let count = 0;

  const files = readdirSync(modesSrc).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const srcPath = join(modesSrc, file);
    // Prefix modes with 'mode:' for clarity
    const destPath = join(commandsDest, `mode:${file}`);
    cpSync(srcPath, destPath);
    count++;
  }

  return count;
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
  const commandsDest = getCommandsDir(homeDir);
  const skillsDest = getSkillsDir(homeDir);
  const agentsDest = getAgentsDir(homeDir);

  if (!existsSync(pluginSrc)) {
    if (!silent) log.error('Plugin source not found. Package may be corrupted.');
    return { success: false, error: 'SOURCE_NOT_FOUND' };
  }

  const stats = {
    commands: 0,
    skills: 0,
    agents: 0,
    modes: 0
  };

  try {
    // Step 1: Copy full plugin to backup location for reference
    if (!silent) log.info('Copying plugin to backup location...');
    mkdirSync(pluginDest, { recursive: true });
    cpSync(pluginSrc, pluginDest, { recursive: true });

    // Step 2: Install commands to ~/.claude/commands/
    if (!silent) log.info('Installing commands...');
    stats.commands = copyCommands(pluginSrc, commandsDest);

    // Step 3: Install skills to ~/.claude/skills/
    if (!silent) log.info('Installing skills...');
    stats.skills = copySkills(pluginSrc, skillsDest);

    // Step 4: Install agents to ~/.claude/agents/
    if (!silent) log.info('Installing agents...');
    stats.agents = copyAgents(pluginSrc, agentsDest);

    // Step 5: Install modes as commands
    if (!silent) log.info('Installing modes...');
    stats.modes = copyModes(pluginSrc, commandsDest);

  } catch (err) {
    if (!silent) log.error(`Installation failed: ${err.message}`);
    return { success: false, error: err.message };
  }

  if (!silent) {
    log.success('Plugin installed successfully!');
    console.log(`
${COLORS.bright}Installed to Claude Code:${COLORS.reset}
  ${COLORS.cyan}Commands:${COLORS.reset} ${commandsDest} (${stats.commands} commands + ${stats.modes} modes)
  ${COLORS.cyan}Skills:${COLORS.reset}   ${skillsDest} (${stats.skills} skills)
  ${COLORS.cyan}Agents:${COLORS.reset}   ${agentsDest} (${stats.agents} agents)
  ${COLORS.cyan}Backup:${COLORS.reset}   ${pluginDest}

${COLORS.bright}Summary:${COLORS.reset}
  📦 ${stats.agents} Agents
  ⚡ ${stats.commands} Commands
  🧠 ${stats.skills} Skills
  🎭 ${stats.modes} Modes

${COLORS.bright}Next steps:${COLORS.reset}
  1. Restart Claude Code to load new commands
  2. Type /help to see available commands
  3. Try /dev:fix, /git:commit, /planning:plan, etc.

${COLORS.magenta}🔮 Think Omega. Build Omega. Be Omega.${COLORS.reset}
`);
  }

  return {
    success: true,
    path: pluginDest,
    stats,
    locations: {
      commands: commandsDest,
      skills: skillsDest,
      agents: agentsDest,
      backup: pluginDest
    }
  };
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
    { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
    { src: 'vision.yaml', dest: '.omgkit/sprints/vision.yaml' },
    { src: 'backlog.yaml', dest: '.omgkit/sprints/backlog.yaml' },
    { src: 'settings.json', dest: '.omgkit/settings.json' },
    { src: 'devlogs/README.md', dest: '.omgkit/devlogs/README.md' },
    { src: 'stdrules/README.md', dest: '.omgkit/stdrules/README.md' },
    { src: 'stdrules/SKILL_STANDARDS.md', dest: '.omgkit/stdrules/SKILL_STANDARDS.md' },
    { src: 'stdrules/BEFORE_COMMIT.md', dest: '.omgkit/stdrules/BEFORE_COMMIT.md' }
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
  /sprint:vision-set    Set your product vision
  /sprint:sprint-new    Create a sprint (add --propose for AI suggestions)
  /sprint:team-run      Start the AI team

${COLORS.bright}Quick commands:${COLORS.reset}
  /dev:feature [desc]   Build a feature
  /dev:fix [issue]      Fix a bug
  /omega:10x [topic]    Find 10x improvement

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
  const commandsDir = getCommandsDir(homeDir);
  const skillsDir = getSkillsDir(homeDir);
  const agentsDir = getAgentsDir(homeDir);

  const result = {
    plugin: { installed: false, components: {} },
    claudeCode: { commands: 0, skills: 0, agents: 0 },
    project: { initialized: false, files: {} }
  };

  // Check backup plugin location
  if (!silent) console.log(`${COLORS.bright}Backup Plugin Location${COLORS.reset}`);

  if (existsSync(pluginDir)) {
    result.plugin.installed = true;
    result.plugin.path = pluginDir;
    if (!silent) log.success(`Backup at ${pluginDir}`);

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
      log.warn('Backup not found (optional)');
    }
  }

  // Check Claude Code directories (the important ones)
  if (!silent) console.log(`\n${COLORS.bright}Claude Code Integration${COLORS.reset}`);

  // Count commands
  if (existsSync(commandsDir)) {
    const commandPrefixes = ['dev:', 'git:', 'planning:', 'quality:', 'context:', 'design:', 'omega:', 'sprint:', 'mode:'];
    const files = readdirSync(commandsDir).filter(f =>
      f.endsWith('.md') && commandPrefixes.some(p => f.startsWith(p))
    );
    result.claudeCode.commands = files.length;
    if (!silent) {
      if (files.length > 0) {
        log.success(`Commands: ${files.length} installed at ${commandsDir}`);
      } else {
        log.warn(`Commands: None found at ${commandsDir}`);
      }
    }
  } else {
    if (!silent) log.warn(`Commands: Directory not found (${commandsDir})`);
  }

  // Count skills
  if (existsSync(skillsDir)) {
    const skillPrefixes = ['databases-', 'devops-', 'tools-', 'languages-', 'frameworks-', 'frontend-', 'backend-', 'mobile-', 'integrations-', 'security-', 'testing-', 'methodology-', 'ai-engineering-', 'omega-'];
    const dirs = readdirSync(skillsDir).filter(f => {
      const fullPath = join(skillsDir, f);
      return statSync(fullPath).isDirectory() && skillPrefixes.some(p => f.startsWith(p));
    });
    result.claudeCode.skills = dirs.length;
    if (!silent) {
      if (dirs.length > 0) {
        log.success(`Skills: ${dirs.length} installed at ${skillsDir}`);
      } else {
        log.warn(`Skills: None found at ${skillsDir}`);
      }
    }
  } else {
    if (!silent) log.warn(`Skills: Directory not found (${skillsDir})`);
  }

  // Count agents
  if (existsSync(agentsDir)) {
    const agentFiles = [
      'code-reviewer.md', 'architect.md', 'debugger.md', 'api-designer.md',
      'database-admin.md', 'cicd-manager.md', 'oracle.md', 'researcher.md',
      'project-manager.md', 'copywriter.md', 'vulnerability-scanner.md',
      'security-auditor.md', 'journal-writer.md', 'sprint-master.md',
      'tester.md', 'fullstack-developer.md', 'planner.md', 'docs-manager.md',
      'git-manager.md', 'ui-ux-designer.md', 'scout.md', 'brainstormer.md',
      'pipeline-architect.md'
    ];
    const installed = agentFiles.filter(f => existsSync(join(agentsDir, f)));
    result.claudeCode.agents = installed.length;
    if (!silent) {
      if (installed.length > 0) {
        log.success(`Agents: ${installed.length} installed at ${agentsDir}`);
      } else {
        log.warn(`Agents: None found at ${agentsDir}`);
      }
    }
  } else {
    if (!silent) log.warn(`Agents: Directory not found (${agentsDir})`);
  }

  // Overall status
  const isInstalled = result.claudeCode.commands > 0 ||
                      result.claudeCode.skills > 0 ||
                      result.claudeCode.agents > 0;

  if (!silent) {
    if (isInstalled) {
      console.log(`\n${COLORS.green}✓ OMGKIT is properly installed in Claude Code${COLORS.reset}`);
    } else {
      console.log(`\n${COLORS.red}✗ OMGKIT is not installed in Claude Code${COLORS.reset}`);
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
      'OMEGA.md',
      'CLAUDE.md'
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
 * Remove OMGKIT files from a directory based on naming patterns
 * @param {string} dir - Directory to clean
 * @param {string[]} prefixes - File prefixes to remove (e.g., ['dev-', 'git-'])
 * @returns {number} Number of files removed
 */
function cleanOmgkitFiles(dir, prefixes) {
  if (!existsSync(dir)) return 0;

  let count = 0;
  const items = readdirSync(dir);

  for (const item of items) {
    const itemPath = join(dir, item);
    const stat = statSync(itemPath);

    // Check if item matches any prefix
    const matchesPrefix = prefixes.some(p => item.startsWith(p));

    if (matchesPrefix) {
      rmSync(itemPath, { recursive: true, force: true });
      count++;
    }
  }

  return count;
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
  const commandsDir = getCommandsDir(homeDir);
  const skillsDir = getSkillsDir(homeDir);
  const agentsDir = getAgentsDir(homeDir);

  const removed = {
    backup: false,
    commands: 0,
    skills: 0,
    agents: 0
  };

  // Command prefixes from our categories (both old hyphen and new colon separator)
  const commandPrefixes = [
    'dev:', 'git:', 'planning:', 'quality:', 'context:',
    'design:', 'omega:', 'sprint:', 'mode:',
    // Also clean up old hyphen-separated format
    'dev-', 'git-', 'planning-', 'quality-', 'context-',
    'design-', 'omega-', 'sprint-', 'mode-'
  ];

  // Skill prefixes from our categories
  const skillPrefixes = [
    'databases-', 'devops-', 'tools-', 'languages-', 'frameworks-',
    'frontend-', 'backend-', 'mobile-', 'integrations-', 'security-',
    'testing-', 'methodology-', 'ai-engineering-', 'omega-'
  ];

  // Agent files we installed
  const agentFiles = [
    'code-reviewer.md', 'architect.md', 'debugger.md', 'api-designer.md',
    'database-admin.md', 'cicd-manager.md', 'oracle.md', 'researcher.md',
    'project-manager.md', 'copywriter.md', 'vulnerability-scanner.md',
    'security-auditor.md', 'journal-writer.md', 'sprint-master.md',
    'tester.md', 'fullstack-developer.md', 'planner.md', 'docs-manager.md',
    'git-manager.md', 'ui-ux-designer.md', 'scout.md', 'brainstormer.md',
    'pipeline-architect.md'
  ];

  // Remove backup location
  if (existsSync(pluginDir)) {
    rmSync(pluginDir, { recursive: true, force: true });
    removed.backup = true;
    if (!silent) log.success('Removed backup plugin directory');
  }

  // Remove commands
  removed.commands = cleanOmgkitFiles(commandsDir, commandPrefixes);
  if (!silent && removed.commands > 0) {
    log.success(`Removed ${removed.commands} commands`);
  }

  // Remove skills
  removed.skills = cleanOmgkitFiles(skillsDir, skillPrefixes);
  if (!silent && removed.skills > 0) {
    log.success(`Removed ${removed.skills} skills`);
  }

  // Remove agents
  if (existsSync(agentsDir)) {
    for (const agentFile of agentFiles) {
      const agentPath = join(agentsDir, agentFile);
      if (existsSync(agentPath)) {
        rmSync(agentPath, { force: true });
        removed.agents++;
      }
    }
    if (!silent && removed.agents > 0) {
      log.success(`Removed ${removed.agents} agents`);
    }
  }

  const anyRemoved = removed.backup || removed.commands > 0 ||
                     removed.skills > 0 || removed.agents > 0;

  if (!silent) {
    if (anyRemoved) {
      log.success('OMGKIT uninstalled successfully!');
    } else {
      log.warn('OMGKIT was not installed.');
    }
  }

  return { success: true, removed };
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
