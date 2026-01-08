#!/usr/bin/env node

/**
 * OMGKIT CLI - Omega-Level Development Kit
 *
 * Usage:
 *   omgkit install     - Install plugin to Claude Code
 *   omgkit init        - Initialize project
 *   omgkit doctor      - Check installation status
 *   omgkit list [type] - List components
 *   omgkit uninstall   - Remove plugin
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  setPackageRoot,
  getVersion,
  installPlugin,
  initProject,
  doctor,
  uninstallPlugin,
  listComponents,
  upgradeProject,
  rollbackProject,
  listProjectBackups,
  getProjectVersion,
  getConfig,
  setConfig,
  listConfig,
  resetConfig,
  COLORS,
  BANNER,
  log
} from '../lib/cli.js';

// Set package root for CLI context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
setPackageRoot(join(__dirname, '..'));

function showHelp() {
  console.log(BANNER);
  console.log(`
${COLORS.bright}USAGE${COLORS.reset}
  omgkit <command> [options]

${COLORS.bright}GLOBAL COMMANDS${COLORS.reset}
  ${COLORS.cyan}install${COLORS.reset}           Install OMGKIT plugin to Claude Code
  ${COLORS.cyan}update${COLORS.reset}            Update OMGKIT plugin (same as install)
  ${COLORS.cyan}uninstall${COLORS.reset}         Remove OMGKIT plugin
  ${COLORS.cyan}doctor${COLORS.reset}            Check installation status
  ${COLORS.cyan}list${COLORS.reset}              List all commands/agents/skills
  ${COLORS.cyan}version${COLORS.reset}           Show version
  ${COLORS.cyan}help${COLORS.reset}              Show this help

${COLORS.bright}PROJECT COMMANDS${COLORS.reset}
  ${COLORS.cyan}init${COLORS.reset}              Initialize .omgkit/ in current project
  ${COLORS.cyan}init --with-design${COLORS.reset} Initialize with theme selection UI
  ${COLORS.cyan}init --theme <id>${COLORS.reset} Initialize with specific theme (e.g., neo-tokyo)
  ${COLORS.cyan}project:upgrade${COLORS.reset}   Upgrade project to latest OMGKIT version
  ${COLORS.cyan}project:rollback${COLORS.reset}  Rollback project to previous backup
  ${COLORS.cyan}project:backups${COLORS.reset}   List available project backups
  ${COLORS.cyan}project:version${COLORS.reset}   Show project's OMGKIT version

${COLORS.bright}CONFIG COMMANDS${COLORS.reset}
  ${COLORS.cyan}config get <key>${COLORS.reset}      Get config value (e.g., testing.enforcement.level)
  ${COLORS.cyan}config set <key> <val>${COLORS.reset} Set config value
  ${COLORS.cyan}config list [section]${COLORS.reset} List all config or specific section
  ${COLORS.cyan}config reset <key>${COLORS.reset}    Reset config key to default

${COLORS.bright}UPGRADE OPTIONS${COLORS.reset}
  --dry        Show what would change without applying
  --force      Skip confirmation prompts

${COLORS.bright}EXAMPLES${COLORS.reset}
  omgkit install               # Install plugin globally
  omgkit init                  # Initialize project
  omgkit init --theme neo-tokyo # Init with specific theme
  omgkit init --with-design   # Init with theme selection UI
  omgkit project:upgrade       # Upgrade project config
  omgkit project:upgrade --dry # Preview upgrade changes
  omgkit project:rollback      # Rollback to last backup
  omgkit doctor                # Check status

${COLORS.bright}CONFIG EXAMPLES${COLORS.reset}
  omgkit config set testing.enforcement.level strict
  omgkit config set testing.auto_generate_tasks true
  omgkit config set testing.coverage_gates.unit.minimum 90
  omgkit config get testing
  omgkit config list testing
  omgkit config reset testing.enforcement.level

${COLORS.bright}AFTER INSTALLATION${COLORS.reset}
  In Claude Code, type / to see all OMGKIT commands:

  Core: /dev:feature, /dev:fix, /planning:plan, /quality:test, /dev:review
  Omega: /omega:10x, /omega:100x, /omega:1000x, /omega:principles
  Sprint: /sprint:vision-set, /sprint:sprint-new, /sprint:team-run
  Testing: /quality:verify-done, /quality:coverage-check, /quality:test-plan

${COLORS.bright}DOCUMENTATION${COLORS.reset}
  https://omg.mintlify.app
`);
}

function showVersion() {
  console.log(`omgkit v${getVersion()}`);
}

// Main CLI entry point
const [,, command, ...args] = process.argv;

switch (command) {
  case 'install': {
    const result = installPlugin();
    if (!result.success) process.exit(1);
    break;
  }
  case 'init': {
    // Parse init options
    const withDesign = args.includes('--with-design');
    const themeIdx = args.indexOf('--theme');
    const theme = themeIdx !== -1 ? args[themeIdx + 1] : null;

    const result = initProject({ theme, withDesign });
    if (!result.success) process.exit(1);
    break;
  }
  case 'update': {
    const result = installPlugin();
    if (!result.success) process.exit(1);
    break;
  }
  case 'uninstall': {
    uninstallPlugin();
    break;
  }
  case 'doctor': {
    doctor();
    break;
  }
  case 'list': {
    const result = listComponents(args[0]);
    if (!result.success) process.exit(1);
    break;
  }
  case 'project:upgrade': {
    const dryRun = args.includes('--dry');
    const force = args.includes('--force');
    const result = upgradeProject({ dryRun, force });
    if (!result.success && !result.upToDate) process.exit(1);
    break;
  }
  case 'project:rollback': {
    const result = rollbackProject();
    if (!result.success) process.exit(1);
    break;
  }
  case 'project:backups': {
    console.log(BANNER);
    const backups = listProjectBackups();
    if (backups.length === 0) {
      log.info('No backups found');
    } else {
      console.log(`${COLORS.bright}Available Backups${COLORS.reset}\n`);
      backups.forEach((backup, i) => {
        const age = Math.round((Date.now() - backup.created) / 1000 / 60);
        const ageStr = age < 60 ? `${age} minutes ago` : `${Math.round(age / 60)} hours ago`;
        console.log(`  ${i + 1}. ${backup.name} (${ageStr})`);
      });
      console.log(`\nTo restore: omgkit project:rollback`);
    }
    break;
  }
  case 'project:version': {
    const projectVersion = getProjectVersion();
    const omgkitVersion = getVersion();
    console.log(`Project OMGKIT version: ${projectVersion || 'not tracked (older project)'}`);
    console.log(`Current OMGKIT version: ${omgkitVersion}`);
    if (projectVersion && projectVersion !== omgkitVersion) {
      log.info('Run: omgkit project:upgrade');
    }
    break;
  }
  case 'config': {
    const subCommand = args[0];
    switch (subCommand) {
      case 'get': {
        const key = args[1];
        if (!key) {
          log.error('Usage: omgkit config get <key>');
          log.info('Example: omgkit config get testing.enforcement.level');
          process.exit(1);
        }
        const result = getConfig(key);
        if (!result.success) process.exit(1);
        break;
      }
      case 'set': {
        const key = args[1];
        const value = args[2];
        if (!key || value === undefined) {
          log.error('Usage: omgkit config set <key> <value>');
          log.info('Example: omgkit config set testing.enforcement.level strict');
          process.exit(1);
        }
        const result = setConfig(key, value);
        if (!result.success) process.exit(1);
        break;
      }
      case 'list': {
        const section = args[1];
        const result = listConfig({ section });
        if (!result.success) process.exit(1);
        break;
      }
      case 'reset': {
        const key = args[1];
        if (!key) {
          log.error('Usage: omgkit config reset <key>');
          log.info('Example: omgkit config reset testing.enforcement.level');
          process.exit(1);
        }
        const result = resetConfig(key);
        if (!result.success) process.exit(1);
        break;
      }
      default: {
        log.error(`Unknown config subcommand: ${subCommand || '(none)'}`);
        console.log(`
${COLORS.bright}Config Commands:${COLORS.reset}
  omgkit config get <key>       Get config value
  omgkit config set <key> <val> Set config value
  omgkit config list [section]  List all config
  omgkit config reset <key>     Reset to default

${COLORS.bright}Examples:${COLORS.reset}
  omgkit config get testing.enforcement.level
  omgkit config set testing.enforcement.level strict
  omgkit config set testing.auto_generate_tasks true
  omgkit config list testing
  omgkit config reset testing.enforcement.level
`);
        process.exit(1);
      }
    }
    break;
  }
  case 'version':
  case '-v':
  case '--version': {
    showVersion();
    break;
  }
  case 'help':
  case '-h':
  case '--help':
  case undefined: {
    showHelp();
    break;
  }
  default: {
    log.error(`Unknown command: ${command}`);
    log.info('Run: omgkit help');
    process.exit(1);
  }
}
