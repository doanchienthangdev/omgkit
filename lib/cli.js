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
║   41 Agents • 156 Commands • 159 Skills • 10 Modes          ║
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
    '.omgkit/stdrules',
    '.omgkit/artifacts'
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
    { src: 'settings.json', dest: '.omgkit/settings.json', process: true },
    { src: 'devlogs/README.md', dest: '.omgkit/devlogs/README.md' },
    { src: 'stdrules/README.md', dest: '.omgkit/stdrules/README.md' },
    { src: 'stdrules/SKILL_STANDARDS.md', dest: '.omgkit/stdrules/SKILL_STANDARDS.md' },
    { src: 'stdrules/BEFORE_COMMIT.md', dest: '.omgkit/stdrules/BEFORE_COMMIT.md' },
    { src: 'stdrules/TESTING_STANDARDS.md', dest: '.omgkit/stdrules/TESTING_STANDARDS.md' },
    { src: 'artifacts/README.md', dest: '.omgkit/artifacts/README.md' },
    { src: 'omgkit/workflow.yaml', dest: '.omgkit/workflow.yaml' }
  ];

  const version = getVersion();
  const initDate = new Date().toISOString().split('T')[0];

  templates.forEach(({ src, dest, process: shouldProcess }) => {
    const srcPath = join(templatesDir, src);
    const destPath = join(cwd, dest);

    if (existsSync(srcPath) && !existsSync(destPath)) {
      if (shouldProcess) {
        // Process template placeholders
        let content = readFileSync(srcPath, 'utf8');
        content = content.replace(/\{\{OMGKIT_VERSION\}\}/g, version);
        content = content.replace(/\{\{INIT_DATE\}\}/g, initDate);
        writeFileSync(destPath, content);
      } else {
        cpSync(srcPath, destPath);
      }
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
    const commandPrefixes = [
      // All command namespaces
      'alignment:', 'auto:', 'context:', 'data:', 'design:', 'dev:', 'domain:',
      'game:', 'git:', 'hooks:', 'iot:', 'ml:', 'omega:', 'omgdata:', 'omgdeploy:',
      'omgfeature:', 'omgml:', 'omgops:', 'omgoptim:', 'omgtrain:', 'perf:',
      'planning:', 'platform:', 'quality:', 'security:', 'sprint:', 'sre:', 'workflow:',
      // Modes
      'mode:'
    ];
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
    const skillPrefixes = [
      // All skill categories
      'ai-engineering-', 'ai-ml-', 'autonomous-', 'backend-', 'databases-',
      'devops-', 'event-driven-', 'frameworks-', 'frontend-', 'game-',
      'integrations-', 'iot-', 'languages-', 'methodology-', 'microservices-',
      'ml-systems-', 'mobile-', 'mobile-advanced-', 'omega-', 'security-',
      'simulation-', 'testing-', 'tools-'
    ];
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
      // All 41 agents
      'ai-architect-agent.md', 'api-designer.md', 'architect.md', 'brainstormer.md',
      'cicd-manager.md', 'code-reviewer.md', 'copywriter.md', 'data-engineer.md',
      'data-scientist-agent.md', 'database-admin.md', 'debugger.md', 'devsecops.md',
      'docs-manager.md', 'domain-decomposer.md', 'embedded-systems.md',
      'experiment-analyst-agent.md', 'fullstack-developer.md', 'game-systems-designer.md',
      'git-manager.md', 'journal-writer.md', 'ml-engineer-agent.md', 'ml-engineer.md',
      'mlops-engineer-agent.md', 'model-optimizer-agent.md', 'observability-engineer.md',
      'oracle.md', 'performance-engineer.md', 'pipeline-architect.md', 'planner.md',
      'platform-engineer.md', 'production-engineer-agent.md', 'project-manager.md',
      'research-scientist-agent.md', 'researcher.md', 'scientific-computing.md',
      'scout.md', 'security-auditor.md', 'sprint-master.md', 'tester.md',
      'ui-ux-designer.md', 'vulnerability-scanner.md'
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

  // Command prefixes from our categories
  const commandPrefixes = [
    // All command namespaces
    'alignment:', 'auto:', 'context:', 'data:', 'design:', 'dev:', 'domain:',
    'game:', 'git:', 'hooks:', 'iot:', 'ml:', 'omega:', 'omgdata:', 'omgdeploy:',
    'omgfeature:', 'omgml:', 'omgops:', 'omgoptim:', 'omgtrain:', 'perf:',
    'planning:', 'platform:', 'quality:', 'security:', 'sprint:', 'sre:', 'workflow:',
    // Modes
    'mode:'
  ];

  // Skill prefixes from our categories
  const skillPrefixes = [
    'ai-engineering-', 'ai-ml-', 'autonomous-', 'backend-', 'databases-',
    'devops-', 'event-driven-', 'frameworks-', 'frontend-', 'game-',
    'integrations-', 'iot-', 'languages-', 'methodology-', 'microservices-',
    'ml-systems-', 'mobile-', 'mobile-advanced-', 'omega-', 'security-',
    'simulation-', 'testing-', 'tools-'
  ];

  // Agent files we installed (all 41 agents)
  const agentFiles = [
    'ai-architect-agent.md', 'api-designer.md', 'architect.md', 'brainstormer.md',
    'cicd-manager.md', 'code-reviewer.md', 'copywriter.md', 'data-engineer.md',
    'data-scientist-agent.md', 'database-admin.md', 'debugger.md', 'devsecops.md',
    'docs-manager.md', 'domain-decomposer.md', 'embedded-systems.md',
    'experiment-analyst-agent.md', 'fullstack-developer.md', 'game-systems-designer.md',
    'git-manager.md', 'journal-writer.md', 'ml-engineer-agent.md', 'ml-engineer.md',
    'mlops-engineer-agent.md', 'model-optimizer-agent.md', 'observability-engineer.md',
    'oracle.md', 'performance-engineer.md', 'pipeline-architect.md', 'planner.md',
    'platform-engineer.md', 'production-engineer-agent.md', 'project-manager.md',
    'research-scientist-agent.md', 'researcher.md', 'scientific-computing.md',
    'scout.md', 'security-auditor.md', 'sprint-master.md', 'tester.md',
    'ui-ux-designer.md', 'vulnerability-scanner.md'
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
    commands: { title: 'Commands' },
    agents: { title: 'Agents' },
    skills: { title: 'Skills' },
    modes: { title: 'Modes' }
  };

  const result = { success: true, components: {} };

  const typesToList = (!type || type === 'all') ? Object.keys(componentTypes) : [type];

  typesToList.forEach(key => {
    if (!componentTypes[key]) return;

    const { title } = componentTypes[key];
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

// ============================================================================
// PROJECT UPGRADE SYSTEM
// ============================================================================

/**
 * Create a hash of file content for change detection
 * @param {string} content - File content
 * @returns {string} Hash string
 */
function hashContent(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/**
 * Deep merge two objects (for YAML config merging)
 * Only adds new keys, never overwrites existing values
 * @param {Object} target - Target object (user's config)
 * @param {Object} source - Source object (new template)
 * @returns {Object} Merged object
 */
function deepMergeAddOnly(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (!(key in result)) {
      // Key doesn't exist in target, add it
      result[key] = source[key];
    } else if (
      typeof result[key] === 'object' &&
      result[key] !== null &&
      !Array.isArray(result[key]) &&
      typeof source[key] === 'object' &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      // Both are objects, recurse
      result[key] = deepMergeAddOnly(result[key], source[key]);
    }
    // If key exists and is not an object, keep user's value
  }

  return result;
}

/**
 * Simple YAML parser for config files
 * @param {string} content - YAML content
 * @returns {Object} Parsed object
 */
function parseSimpleYaml(content) {
  const result = {};
  const lines = content.split('\n');
  const stack = [{ obj: result, indent: -1 }];

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || line.trim() === '') continue;

    const indent = line.search(/\S/);
    if (indent === -1) continue;

    const trimmed = line.trim();

    // Pop stack to find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].obj;

    if (trimmed.startsWith('- ')) {
      // Array item
      const value = trimmed.substring(2).trim();
      if (!Array.isArray(parent)) {
        // Find the key that should be an array
        const keys = Object.keys(parent);
        const lastKey = keys[keys.length - 1];
        if (lastKey && parent[lastKey] === null) {
          parent[lastKey] = [value];
        }
      } else {
        parent.push(value);
      }
    } else if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      if (value === '' || value === null) {
        // Object or array follows
        parent[key] = {};
        stack.push({ obj: parent[key], indent });
      } else if (value === 'true') {
        parent[key] = true;
      } else if (value === 'false') {
        parent[key] = false;
      } else if (!isNaN(Number(value)) && value !== '') {
        parent[key] = Number(value);
      } else {
        parent[key] = value;
      }
    }
  }

  return result;
}

/**
 * Serialize object to simple YAML
 * @param {Object} obj - Object to serialize
 * @param {number} indent - Current indentation level
 * @returns {string} YAML string
 */
function toSimpleYaml(obj, indent = 0) {
  const spaces = '  '.repeat(indent);
  let result = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      result += `${spaces}${key}:\n`;
    } else if (Array.isArray(value)) {
      result += `${spaces}${key}:\n`;
      for (const item of value) {
        if (typeof item === 'object') {
          result += `${spaces}  -\n${toSimpleYaml(item, indent + 2)}`;
        } else {
          result += `${spaces}  - ${item}\n`;
        }
      }
    } else if (typeof value === 'object') {
      result += `${spaces}${key}:\n${toSimpleYaml(value, indent + 1)}`;
    } else if (typeof value === 'string' && (value.includes(':') || value.includes('#'))) {
      result += `${spaces}${key}: "${value}"\n`;
    } else {
      result += `${spaces}${key}: ${value}\n`;
    }
  }

  return result;
}

/**
 * Get project settings including version info
 * @param {string} cwd - Project directory
 * @returns {Object|null} Settings object or null
 */
export function getProjectSettings(cwd = process.cwd()) {
  const settingsPath = join(cwd, '.omgkit', 'settings.json');
  if (!existsSync(settingsPath)) return null;

  try {
    return JSON.parse(readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

/**
 * Get project version
 * @param {string} cwd - Project directory
 * @returns {string|null} Version string or null
 */
export function getProjectVersion(cwd = process.cwd()) {
  const settings = getProjectSettings(cwd);
  return settings?.omgkit?.version || null;
}

/**
 * Compare semantic versions
 * @param {string} v1 - First version
 * @param {string} v2 - Second version
 * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 < p2) return -1;
    if (p1 > p2) return 1;
  }
  return 0;
}

/**
 * Create backup of .omgkit directory
 * @param {string} cwd - Project directory
 * @returns {Object} Backup result with path
 */
export function createProjectBackup(cwd = process.cwd()) {
  const omgkitDir = join(cwd, '.omgkit');
  if (!existsSync(omgkitDir)) {
    return { success: false, error: 'NOT_INITIALIZED' };
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').split('T').join('-').substring(0, 19);
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  const backupDir = join(cwd, `.omgkit-backup-${timestamp}-${ms}`);

  try {
    cpSync(omgkitDir, backupDir, { recursive: true });
    return { success: true, path: backupDir, timestamp };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

/**
 * List available backups
 * @param {string} cwd - Project directory
 * @returns {Object[]} Array of backup info
 */
export function listProjectBackups(cwd = process.cwd()) {
  const backups = [];

  try {
    const items = readdirSync(cwd);
    for (const item of items) {
      if (item.startsWith('.omgkit-backup-')) {
        const fullPath = join(cwd, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          backups.push({
            name: item,
            path: fullPath,
            created: stat.mtime
          });
        }
      }
    }
  } catch (e) {
    // Directory read error
  }

  return backups.sort((a, b) => b.created - a.created);
}

/**
 * Rollback project to a backup
 * @param {Object} options - Options
 * @param {string} [options.cwd] - Project directory
 * @param {string} [options.backupPath] - Specific backup to restore
 * @param {boolean} [options.silent] - Suppress output
 * @returns {Object} Result
 */
export function rollbackProject(options = {}) {
  const { cwd = process.cwd(), backupPath, silent = false } = options;

  if (!silent) {
    console.log(BANNER);
    log.omega('Rolling back project...');
  }

  const omgkitDir = join(cwd, '.omgkit');
  let targetBackup = backupPath;

  if (!targetBackup) {
    // Find most recent backup
    const backups = listProjectBackups(cwd);
    if (backups.length === 0) {
      if (!silent) log.error('No backups found');
      return { success: false, error: 'NO_BACKUPS' };
    }
    targetBackup = backups[0].path;
  }

  if (!existsSync(targetBackup)) {
    if (!silent) log.error(`Backup not found: ${targetBackup}`);
    return { success: false, error: 'BACKUP_NOT_FOUND' };
  }

  try {
    // Remove current .omgkit
    if (existsSync(omgkitDir)) {
      rmSync(omgkitDir, { recursive: true, force: true });
    }

    // Restore from backup
    cpSync(targetBackup, omgkitDir, { recursive: true });

    if (!silent) {
      log.success(`Rolled back to: ${targetBackup}`);
    }

    return { success: true, restoredFrom: targetBackup };
  } catch (e) {
    if (!silent) log.error(`Rollback failed: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Calculate upgrade changes (dry run)
 * @param {string} cwd - Project directory
 * @returns {Object} Changes to be applied
 */
export function calculateUpgradeChanges(cwd = process.cwd()) {
  const changes = {
    settings: [],
    workflow: [],
    stdrules: [],
    newFiles: [],
    protected: [
      'config.yaml',
      'sprints/vision.yaml',
      'sprints/backlog.yaml',
      'artifacts/*',
      'devlogs/*'
    ]
  };

  const templatesDir = join(getPackageRoot(), 'templates');
  const omgkitDir = join(cwd, '.omgkit');
  const currentVersion = getProjectVersion(cwd);
  const targetVersion = getVersion();

  // Check workflow.yaml changes
  const workflowTemplatePath = join(templatesDir, 'omgkit', 'workflow.yaml');
  const workflowProjectPath = join(omgkitDir, 'workflow.yaml');

  if (existsSync(workflowTemplatePath)) {
    const templateContent = readFileSync(workflowTemplatePath, 'utf8');
    const templateConfig = parseSimpleYaml(templateContent);

    if (existsSync(workflowProjectPath)) {
      const projectContent = readFileSync(workflowProjectPath, 'utf8');
      const projectConfig = parseSimpleYaml(projectContent);

      // Find new top-level sections
      for (const key of Object.keys(templateConfig)) {
        if (!(key in projectConfig)) {
          changes.workflow.push({
            type: 'add_section',
            key,
            value: templateConfig[key]
          });
        }
      }
    } else {
      changes.newFiles.push('workflow.yaml');
    }
  }

  // Check stdrules updates
  const stdrulesTemplate = join(templatesDir, 'stdrules');
  const stdrulesProject = join(omgkitDir, 'stdrules');

  if (existsSync(stdrulesTemplate)) {
    const templateFiles = readdirSync(stdrulesTemplate).filter(f => f.endsWith('.md'));
    const settings = getProjectSettings(cwd) || {};
    const checksums = settings.file_checksums || {};

    for (const file of templateFiles) {
      const templatePath = join(stdrulesTemplate, file);
      const projectPath = join(stdrulesProject, file);
      const templateContent = readFileSync(templatePath, 'utf8');
      const templateHash = hashContent(templateContent);

      if (!existsSync(projectPath)) {
        changes.stdrules.push({
          type: 'new',
          file,
          reason: 'File does not exist'
        });
      } else {
        const projectContent = readFileSync(projectPath, 'utf8');
        const projectHash = hashContent(projectContent);
        const originalHash = checksums[`stdrules/${file}`];

        // Update only if user hasn't modified the file
        if (originalHash && projectHash === originalHash && templateHash !== projectHash) {
          changes.stdrules.push({
            type: 'update',
            file,
            reason: 'Template updated, user has not modified'
          });
        } else if (!originalHash && templateHash !== projectHash) {
          changes.stdrules.push({
            type: 'skip',
            file,
            reason: 'User may have modified (no checksum recorded)'
          });
        }
      }
    }
  }

  // Settings.json updates
  const settingsPath = join(omgkitDir, 'settings.json');
  if (existsSync(settingsPath)) {
    const settings = getProjectSettings(cwd);
    if (!settings?.omgkit) {
      changes.settings.push({
        type: 'add',
        key: 'omgkit',
        value: { version: targetVersion, initialized_at: null, last_upgraded: null }
      });
    }
    if (!settings?.file_checksums) {
      changes.settings.push({
        type: 'add',
        key: 'file_checksums',
        value: {}
      });
    }
  }

  return {
    currentVersion,
    targetVersion,
    needsUpgrade: compareVersions(targetVersion, currentVersion || '0.0.0') > 0,
    changes
  };
}

/**
 * Upgrade project to latest OMGKIT version
 * @param {Object} options - Options
 * @param {string} [options.cwd] - Project directory
 * @param {boolean} [options.dryRun] - Only show what would change
 * @param {boolean} [options.force] - Skip confirmation
 * @param {boolean} [options.silent] - Suppress output
 * @returns {Object} Upgrade result
 */
export function upgradeProject(options = {}) {
  const { cwd = process.cwd(), dryRun = false, force = false, silent = false } = options;

  if (!silent) {
    console.log(BANNER);
    log.omega('Checking for project upgrades...');
  }

  const omgkitDir = join(cwd, '.omgkit');

  // Check if project is initialized
  if (!existsSync(omgkitDir)) {
    if (!silent) {
      log.error('Project not initialized. Run: omgkit init');
    }
    return { success: false, error: 'NOT_INITIALIZED' };
  }

  // Calculate changes
  const upgradeInfo = calculateUpgradeChanges(cwd);

  if (!upgradeInfo.needsUpgrade &&
      upgradeInfo.changes.workflow.length === 0 &&
      upgradeInfo.changes.stdrules.filter(s => s.type !== 'skip').length === 0 &&
      upgradeInfo.changes.newFiles.length === 0) {
    if (!silent) {
      log.success('Project is up to date!');
      console.log(`  Current version: ${upgradeInfo.currentVersion || 'unknown'}`);
      console.log(`  OMGKIT version: ${upgradeInfo.targetVersion}`);
    }
    return { success: true, upToDate: true };
  }

  // Display changes
  if (!silent) {
    console.log(`
${COLORS.bright}OMGKIT Project Upgrade${COLORS.reset}
${'='.repeat(50)}
Current version: ${upgradeInfo.currentVersion || 'unknown'}
Target version:  ${upgradeInfo.targetVersion}

${COLORS.bright}Changes to be applied:${COLORS.reset}
`);

    if (upgradeInfo.changes.workflow.length > 0) {
      console.log(`${COLORS.cyan}📁 workflow.yaml${COLORS.reset}`);
      for (const change of upgradeInfo.changes.workflow) {
        if (change.type === 'add_section') {
          console.log(`   ${COLORS.green}+ ${change.key}: {...}${COLORS.reset}`);
        }
      }
    }

    if (upgradeInfo.changes.stdrules.length > 0) {
      console.log(`\n${COLORS.cyan}📁 stdrules/${COLORS.reset}`);
      for (const change of upgradeInfo.changes.stdrules) {
        if (change.type === 'new') {
          console.log(`   ${COLORS.green}+ ${change.file} (new)${COLORS.reset}`);
        } else if (change.type === 'update') {
          console.log(`   ${COLORS.yellow}~ ${change.file} (updated)${COLORS.reset}`);
        } else if (change.type === 'skip') {
          console.log(`   ${COLORS.blue}○ ${change.file} (skipped - may be modified)${COLORS.reset}`);
        }
      }
    }

    if (upgradeInfo.changes.newFiles.length > 0) {
      console.log(`\n${COLORS.cyan}📁 New files${COLORS.reset}`);
      for (const file of upgradeInfo.changes.newFiles) {
        console.log(`   ${COLORS.green}+ ${file}${COLORS.reset}`);
      }
    }

    console.log(`
${COLORS.bright}🔒 Protected (no changes):${COLORS.reset}`);
    for (const protected_ of upgradeInfo.changes.protected) {
      console.log(`   - ${protected_}`);
    }
  }

  if (dryRun) {
    if (!silent) {
      console.log(`\n${COLORS.yellow}Dry run - no changes made.${COLORS.reset}`);
      console.log('Run without --dry to apply changes.');
    }
    return { success: true, dryRun: true, changes: upgradeInfo.changes };
  }

  // Create backup before upgrade
  if (!silent) log.info('\nCreating backup...');
  const backup = createProjectBackup(cwd);
  if (!backup.success) {
    if (!silent) log.error(`Backup failed: ${backup.error}`);
    return { success: false, error: 'BACKUP_FAILED' };
  }
  if (!silent) log.success(`Backup created: ${backup.path}`);

  const templatesDir = join(getPackageRoot(), 'templates');
  const applied = { workflow: [], stdrules: [], newFiles: [], settings: [] };

  try {
    // Apply workflow.yaml changes
    if (upgradeInfo.changes.workflow.length > 0) {
      const workflowPath = join(omgkitDir, 'workflow.yaml');
      const workflowTemplatePath = join(templatesDir, 'omgkit', 'workflow.yaml');

      if (existsSync(workflowPath) && existsSync(workflowTemplatePath)) {
        const projectContent = readFileSync(workflowPath, 'utf8');
        const templateContent = readFileSync(workflowTemplatePath, 'utf8');

        const projectConfig = parseSimpleYaml(projectContent);
        const templateConfig = parseSimpleYaml(templateContent);

        const merged = deepMergeAddOnly(projectConfig, templateConfig);

        // Preserve comments from original file by appending new sections
        let newContent = projectContent;

        for (const change of upgradeInfo.changes.workflow) {
          if (change.type === 'add_section') {
            // Find section in template and append
            const sectionRegex = new RegExp(`^${change.key}:`, 'm');
            const templateLines = templateContent.split('\n');
            let inSection = false;
            let sectionContent = '';

            for (const line of templateLines) {
              if (line.match(sectionRegex)) {
                inSection = true;
              } else if (inSection && line.match(/^\w+:/) && !line.startsWith(' ')) {
                break;
              }

              if (inSection) {
                sectionContent += line + '\n';
              }
            }

            if (sectionContent) {
              newContent = newContent.trimEnd() + '\n\n' + sectionContent;
              applied.workflow.push(change.key);
            }
          }
        }

        writeFileSync(workflowPath, newContent);
      }
    }

    // Apply stdrules updates
    for (const change of upgradeInfo.changes.stdrules) {
      if (change.type === 'new' || change.type === 'update') {
        const templatePath = join(templatesDir, 'stdrules', change.file);
        const projectPath = join(omgkitDir, 'stdrules', change.file);

        if (existsSync(templatePath)) {
          cpSync(templatePath, projectPath);
          applied.stdrules.push(change.file);
        }
      }
    }

    // Apply new files
    for (const file of upgradeInfo.changes.newFiles) {
      if (file === 'workflow.yaml') {
        const templatePath = join(templatesDir, 'omgkit', 'workflow.yaml');
        const projectPath = join(omgkitDir, 'workflow.yaml');
        if (existsSync(templatePath)) {
          cpSync(templatePath, projectPath);
          applied.newFiles.push(file);
        }
      }
    }

    // Update settings.json
    const settingsPath = join(omgkitDir, 'settings.json');
    let settings = getProjectSettings(cwd) || {};

    // Add omgkit version tracking
    if (!settings.omgkit) {
      settings.omgkit = {};
    }
    settings.omgkit.version = upgradeInfo.targetVersion;
    settings.omgkit.last_upgraded = new Date().toISOString().split('T')[0];

    // Initialize checksums if not present
    if (!settings.file_checksums) {
      settings.file_checksums = {};
    }

    // Update checksums for stdrules files
    const stdrulesDir = join(omgkitDir, 'stdrules');
    if (existsSync(stdrulesDir)) {
      const files = readdirSync(stdrulesDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const content = readFileSync(join(stdrulesDir, file), 'utf8');
        settings.file_checksums[`stdrules/${file}`] = hashContent(content);
      }
    }

    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    applied.settings.push('version', 'checksums');

  } catch (e) {
    // Rollback on error
    if (!silent) {
      log.error(`Upgrade failed: ${e.message}`);
      log.info('Rolling back...');
    }
    rollbackProject({ cwd, backupPath: backup.path, silent: true });
    if (!silent) log.success('Rolled back to previous state');
    return { success: false, error: e.message, rolledBack: true };
  }

  if (!silent) {
    console.log(`
${COLORS.green}✓ Project upgraded successfully!${COLORS.reset}

${COLORS.bright}Applied changes:${COLORS.reset}`);

    if (applied.workflow.length > 0) {
      console.log(`  workflow.yaml: Added ${applied.workflow.join(', ')}`);
    }
    if (applied.stdrules.length > 0) {
      console.log(`  stdrules/: Updated ${applied.stdrules.join(', ')}`);
    }
    if (applied.newFiles.length > 0) {
      console.log(`  New files: ${applied.newFiles.join(', ')}`);
    }

    console.log(`
${COLORS.bright}Backup location:${COLORS.reset} ${backup.path}

To rollback: omgkit project:rollback

${COLORS.magenta}🔮 Think Omega. Build Omega. Be Omega.${COLORS.reset}
`);
  }

  return {
    success: true,
    previousVersion: upgradeInfo.currentVersion,
    newVersion: upgradeInfo.targetVersion,
    applied,
    backupPath: backup.path
  };
}

// =============================================================================
// WORKFLOW CONFIG MANAGEMENT
// =============================================================================

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot-separated path (e.g., 'testing.enforcement.level')
 * @returns {*} Value at path or undefined
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set nested value in object using dot notation
 * @param {Object} obj - Object to set value in
 * @param {string} path - Dot-separated path
 * @param {*} value - Value to set
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Delete nested key from object using dot notation
 * @param {Object} obj - Object to delete from
 * @param {string} path - Dot-separated path
 */
function deleteNestedValue(obj, path) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => current?.[key], obj);
  if (target && lastKey in target) {
    delete target[lastKey];
  }
}

/**
 * Parse value string to appropriate type
 * @param {string} value - Value string
 * @returns {*} Parsed value
 */
function parseConfigValue(value) {
  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Number
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);

  // String (arrays should be edited directly in workflow.yaml)
  return value;
}

/**
 * Read workflow.yaml config
 * @param {string} cwd - Project directory
 * @returns {Object|null} Config object or null
 */
export function readWorkflowConfig(cwd = process.cwd()) {
  const workflowPath = join(cwd, '.omgkit', 'workflow.yaml');
  if (!existsSync(workflowPath)) return null;

  try {
    const content = readFileSync(workflowPath, 'utf8');
    return parseSimpleYaml(content);
  } catch (e) {
    return null;
  }
}

/**
 * Write workflow.yaml config
 * @param {Object} config - Config object
 * @param {string} cwd - Project directory
 */
function writeWorkflowConfig(config, cwd = process.cwd()) {
  const workflowPath = join(cwd, '.omgkit', 'workflow.yaml');
  const yaml = toSimpleYaml(config);
  writeFileSync(workflowPath, yaml);
}

/**
 * Get a config value from workflow.yaml
 * @param {string} key - Dot-separated key (e.g., 'testing.enforcement.level')
 * @param {Object} options - Options
 * @returns {Object} Result with success and value
 */
export function getConfig(key, options = {}) {
  const { cwd = process.cwd(), silent = false } = options;

  const omgkitDir = join(cwd, '.omgkit');
  if (!existsSync(omgkitDir)) {
    if (!silent) log.error('Not an OMGKIT project. Run: omgkit init');
    return { success: false, error: 'NOT_INITIALIZED' };
  }

  const config = readWorkflowConfig(cwd);
  if (!config) {
    if (!silent) log.error('workflow.yaml not found');
    return { success: false, error: 'NO_WORKFLOW' };
  }

  const value = getNestedValue(config, key);

  if (value === undefined) {
    if (!silent) log.warn(`Key '${key}' not found`);
    return { success: false, error: 'KEY_NOT_FOUND' };
  }

  if (!silent) {
    if (typeof value === 'object') {
      console.log(`${COLORS.cyan}${key}:${COLORS.reset}`);
      console.log(toSimpleYaml(value).split('\n').map(l => '  ' + l).join('\n'));
    } else {
      console.log(`${COLORS.cyan}${key}${COLORS.reset} = ${COLORS.green}${value}${COLORS.reset}`);
    }
  }

  return { success: true, value };
}

/**
 * Set a config value in workflow.yaml
 * @param {string} key - Dot-separated key
 * @param {string} value - Value to set
 * @param {Object} options - Options
 * @returns {Object} Result
 */
export function setConfig(key, value, options = {}) {
  const { cwd = process.cwd(), silent = false } = options;

  const omgkitDir = join(cwd, '.omgkit');
  if (!existsSync(omgkitDir)) {
    if (!silent) log.error('Not an OMGKIT project. Run: omgkit init');
    return { success: false, error: 'NOT_INITIALIZED' };
  }

  let config = readWorkflowConfig(cwd);
  if (!config) {
    if (!silent) log.error('workflow.yaml not found. Run: omgkit project:upgrade');
    return { success: false, error: 'NO_WORKFLOW' };
  }

  const parsedValue = parseConfigValue(value);
  const oldValue = getNestedValue(config, key);

  setNestedValue(config, key, parsedValue);
  writeWorkflowConfig(config, cwd);

  if (!silent) {
    if (oldValue !== undefined) {
      log.success(`Updated: ${key}`);
      console.log(`  ${COLORS.red}${oldValue}${COLORS.reset} → ${COLORS.green}${parsedValue}${COLORS.reset}`);
    } else {
      log.success(`Set: ${key} = ${parsedValue}`);
    }
  }

  return { success: true, key, value: parsedValue, oldValue };
}

/**
 * List all config from workflow.yaml
 * @param {Object} options - Options
 * @returns {Object} Result with config
 */
export function listConfig(options = {}) {
  const { cwd = process.cwd(), silent = false, section = null } = options;

  const omgkitDir = join(cwd, '.omgkit');
  if (!existsSync(omgkitDir)) {
    if (!silent) log.error('Not an OMGKIT project. Run: omgkit init');
    return { success: false, error: 'NOT_INITIALIZED' };
  }

  const config = readWorkflowConfig(cwd);
  if (!config) {
    if (!silent) log.error('workflow.yaml not found');
    return { success: false, error: 'NO_WORKFLOW' };
  }

  const displayConfig = section ? { [section]: getNestedValue(config, section) } : config;

  if (!silent) {
    console.log(BANNER);
    console.log(`${COLORS.bright}Workflow Configuration${COLORS.reset}\n`);
    console.log(toSimpleYaml(displayConfig));
  }

  return { success: true, config: displayConfig };
}

/**
 * Reset a config key to default value
 * @param {string} key - Dot-separated key to reset
 * @param {Object} options - Options
 * @returns {Object} Result
 */
export function resetConfig(key, options = {}) {
  const { cwd = process.cwd(), silent = false } = options;

  const omgkitDir = join(cwd, '.omgkit');
  if (!existsSync(omgkitDir)) {
    if (!silent) log.error('Not an OMGKIT project. Run: omgkit init');
    return { success: false, error: 'NOT_INITIALIZED' };
  }

  // Load default template
  const templatePath = join(getPackageRoot(), 'templates', 'omgkit', 'workflow.yaml');
  if (!existsSync(templatePath)) {
    if (!silent) log.error('Default template not found');
    return { success: false, error: 'NO_TEMPLATE' };
  }

  const templateContent = readFileSync(templatePath, 'utf8');
  const templateConfig = parseSimpleYaml(templateContent);
  const defaultValue = getNestedValue(templateConfig, key);

  if (defaultValue === undefined) {
    if (!silent) log.error(`Key '${key}' not found in default config`);
    return { success: false, error: 'KEY_NOT_IN_DEFAULT' };
  }

  let config = readWorkflowConfig(cwd);
  if (!config) {
    if (!silent) log.error('workflow.yaml not found');
    return { success: false, error: 'NO_WORKFLOW' };
  }

  const oldValue = getNestedValue(config, key);
  setNestedValue(config, key, defaultValue);
  writeWorkflowConfig(config, cwd);

  if (!silent) {
    log.success(`Reset: ${key}`);
    console.log(`  ${COLORS.red}${JSON.stringify(oldValue)}${COLORS.reset} → ${COLORS.green}${JSON.stringify(defaultValue)}${COLORS.reset}`);
  }

  return { success: true, key, value: defaultValue, oldValue };
}
