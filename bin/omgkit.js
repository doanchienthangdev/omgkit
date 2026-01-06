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
  ${COLORS.cyan}project:upgrade${COLORS.reset}   Upgrade project to latest OMGKIT version
  ${COLORS.cyan}project:rollback${COLORS.reset}  Rollback project to previous backup
  ${COLORS.cyan}project:backups${COLORS.reset}   List available project backups
  ${COLORS.cyan}project:version${COLORS.reset}   Show project's OMGKIT version

${COLORS.bright}UPGRADE OPTIONS${COLORS.reset}
  --dry        Show what would change without applying
  --force      Skip confirmation prompts

${COLORS.bright}EXAMPLES${COLORS.reset}
  omgkit install               # Install plugin globally
  omgkit init                  # Initialize project
  omgkit project:upgrade       # Upgrade project config
  omgkit project:upgrade --dry # Preview upgrade changes
  omgkit project:rollback      # Rollback to last backup
  omgkit doctor                # Check status

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
    const result = initProject();
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
