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

${COLORS.bright}COMMANDS${COLORS.reset}
  ${COLORS.cyan}install${COLORS.reset}    Install OMGKIT plugin to Claude Code
  ${COLORS.cyan}init${COLORS.reset}       Initialize .omgkit/ in current project
  ${COLORS.cyan}update${COLORS.reset}     Update OMGKIT plugin
  ${COLORS.cyan}uninstall${COLORS.reset}  Remove OMGKIT plugin
  ${COLORS.cyan}doctor${COLORS.reset}     Check installation status
  ${COLORS.cyan}list${COLORS.reset}       List all commands/agents/skills
  ${COLORS.cyan}version${COLORS.reset}    Show version
  ${COLORS.cyan}help${COLORS.reset}       Show this help

${COLORS.bright}EXAMPLES${COLORS.reset}
  omgkit install          # Install plugin globally
  omgkit init             # Initialize project
  omgkit doctor           # Check status
  omgkit list commands    # List all commands

${COLORS.bright}AFTER INSTALLATION${COLORS.reset}
  In Claude Code, type / to see all OMGKIT commands:

  Core: /feature, /fix, /plan, /test, /review
  Omega: /10x, /100x, /1000x, /principles
  Sprint: /vision:set, /sprint:new, /team:run

${COLORS.bright}DOCUMENTATION${COLORS.reset}
  https://github.com/user/omgkit
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
