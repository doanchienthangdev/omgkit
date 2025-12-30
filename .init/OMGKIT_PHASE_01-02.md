# 🔮 OMGKIT Phase 1-2: Project Setup & Plugin Foundation

## Hướng Dẫn Sử Dụng

Copy toàn bộ nội dung trong block ```markdown ... ``` và paste vào Claude Code.

---

## PHASE 1: PROJECT SETUP

```markdown
Tôi đang xây dựng OMGKIT - một npm package cung cấp AI Team System cho Claude Code.

OMGKIT bao gồm:
- 23 AI Agents
- 54 Slash Commands  
- 43 Skills
- 9 Modes
- Sprint Management cho AI tự quản
- Omega Philosophy (10x-1000x improvement)

Hãy thực hiện Phase 1: Tạo cấu trúc npm package.

## Task 1.1: Tạo package.json

```json
{
  "name": "omgkit",
  "version": "1.0.0",
  "description": "Omega-Level Development Kit - AI Team System for Claude Code. 23 agents, 54 commands, 43 skills, sprint management.",
  "keywords": [
    "claude-code", "ai", "agents", "productivity", "omega",
    "development", "automation", "sprint", "team", "claudekit"
  ],
  "homepage": "https://github.com/user/omgkit",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/omgkit.git"
  },
  "license": "MIT",
  "author": "OMGKIT Team",
  "type": "module",
  "main": "lib/index.js",
  "bin": {
    "omgkit": "./bin/omgkit.js"
  },
  "files": ["bin", "lib", "plugin", "templates", "README.md"],
  "scripts": {
    "test": "node --test",
    "lint": "eslint ."
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Task 1.2: Tạo bin/omgkit.js

```javascript
#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, cpSync, readFileSync, rmSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '..');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

const log = {
  info: (msg) => console.log(`${COLORS.cyan}ℹ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  omega: (msg) => console.log(`${COLORS.magenta}🔮${COLORS.reset} ${msg}`)
};

const BANNER = `
${COLORS.magenta}╔════════════════════════════════════════════════════════════╗
║                                                              ║
║   🔮 OMGKIT - Omega-Level Development Kit                   ║
║                                                              ║
║   23 Agents • 54 Commands • 43 Skills • 9 Modes             ║
║   "Think Omega. Build Omega. Be Omega."                     ║
║                                                              ║
╚════════════════════════════════════════════════════════════╝${COLORS.reset}
`;

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

function getPluginDir() {
  const home = process.env.HOME || process.env.USERPROFILE;
  return join(home, '.claude', 'plugins', 'omgkit');
}

function installPlugin() {
  console.log(BANNER);
  log.omega('Installing OMGKIT plugin...');
  
  const pluginSrc = join(PACKAGE_ROOT, 'plugin');
  const pluginDest = getPluginDir();
  
  if (!existsSync(pluginSrc)) {
    log.error('Plugin source not found. Package may be corrupted.');
    process.exit(1);
  }
  
  mkdirSync(pluginDest, { recursive: true });
  cpSync(pluginSrc, pluginDest, { recursive: true });
  
  log.success('Plugin installed successfully!');
  log.info(`Location: ${pluginDest}`);
  
  // Count components
  const countFiles = (dir, ext) => {
    try {
      const { readdirSync, statSync } = require('fs');
      let count = 0;
      const walk = (d) => {
        readdirSync(d).forEach(f => {
          const fp = join(d, f);
          if (statSync(fp).isDirectory()) walk(fp);
          else if (f.endsWith(ext)) count++;
        });
      };
      walk(dir);
      return count;
    } catch { return '?'; }
  };
  
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

function initProject() {
  console.log(BANNER);
  log.omega('Initializing OMGKIT in current project...');
  
  const cwd = process.cwd();
  const templatesDir = join(PACKAGE_ROOT, 'templates');
  
  // Create directories
  const dirs = [
    '.omgkit',
    '.omgkit/sprints',
    '.omgkit/plans',
    '.omgkit/docs',
    '.omgkit/logs'
  ];
  
  dirs.forEach(dir => {
    const fullPath = join(cwd, dir);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
      log.success(`Created ${dir}/`);
    }
  });
  
  // Copy templates
  const templates = [
    { src: 'config.yaml', dest: '.omgkit/config.yaml' },
    { src: 'OMEGA.md', dest: 'OMEGA.md' },
    { src: 'vision.yaml', dest: '.omgkit/sprints/vision.yaml' },
    { src: 'backlog.yaml', dest: '.omgkit/sprints/backlog.yaml' },
    { src: 'settings.json', dest: '.omgkit/settings.json' }
  ];
  
  templates.forEach(({ src, dest }) => {
    const srcPath = join(templatesDir, src);
    const destPath = join(cwd, dest);
    
    if (existsSync(srcPath) && !existsSync(destPath)) {
      cpSync(srcPath, destPath);
      log.success(`Created ${dest}`);
    }
  });
  
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

function doctor() {
  console.log(BANNER);
  log.omega('Checking OMGKIT installation...\n');
  
  const pluginDir = getPluginDir();
  const cwd = process.cwd();
  
  // Check plugin
  console.log(`${COLORS.bright}Plugin Status${COLORS.reset}`);
  if (existsSync(pluginDir)) {
    log.success(`Installed at ${pluginDir}`);
    
    const components = [
      { path: 'commands', name: 'Commands' },
      { path: 'agents', name: 'Agents' },
      { path: 'skills', name: 'Skills' },
      { path: 'modes', name: 'Modes' }
    ];
    
    components.forEach(({ path, name }) => {
      const fullPath = join(pluginDir, path);
      if (existsSync(fullPath)) {
        log.success(`  ${name}: ✓`);
      } else {
        log.warn(`  ${name}: Missing`);
      }
    });
  } else {
    log.error('Not installed');
    log.info('Run: omgkit install');
  }
  
  console.log(`\n${COLORS.bright}Project Status${COLORS.reset}`);
  if (existsSync(join(cwd, '.omgkit'))) {
    log.success(`Initialized at ${cwd}`);
    
    const files = [
      '.omgkit/config.yaml',
      '.omgkit/sprints/vision.yaml',
      'OMEGA.md'
    ];
    
    files.forEach(f => {
      if (existsSync(join(cwd, f))) {
        log.success(`  ${f}: ✓`);
      } else {
        log.warn(`  ${f}: Missing`);
      }
    });
  } else {
    log.warn('Not initialized');
    log.info('Run: omgkit init');
  }
}

function uninstallPlugin() {
  console.log(BANNER);
  log.omega('Uninstalling OMGKIT plugin...');
  
  const pluginDir = getPluginDir();
  
  if (existsSync(pluginDir)) {
    rmSync(pluginDir, { recursive: true, force: true });
    log.success('Plugin uninstalled!');
  } else {
    log.warn('Plugin not found.');
  }
}

function showVersion() {
  const pkg = JSON.parse(readFileSync(join(PACKAGE_ROOT, 'package.json'), 'utf8'));
  console.log(`omgkit v${pkg.version}`);
}

function listComponents(type) {
  console.log(BANNER);
  
  const pluginDir = getPluginDir();
  
  if (!existsSync(pluginDir)) {
    log.error('Plugin not installed. Run: omgkit install');
    return;
  }
  
  const lists = {
    commands: 'Commands (54)',
    agents: 'Agents (23)',
    skills: 'Skills (43)',
    modes: 'Modes (9)'
  };
  
  if (!type || type === 'all') {
    Object.entries(lists).forEach(([key, title]) => {
      console.log(`\n${COLORS.bright}${title}${COLORS.reset}`);
      const dir = join(pluginDir, key);
      if (existsSync(dir)) {
        listDir(dir, '  ');
      }
    });
  } else if (lists[type]) {
    console.log(`\n${COLORS.bright}${lists[type]}${COLORS.reset}`);
    listDir(join(pluginDir, type), '  ');
  }
}

function listDir(dir, prefix = '') {
  const { readdirSync, statSync } = require('fs');
  readdirSync(dir).forEach(f => {
    const fp = join(dir, f);
    if (statSync(fp).isDirectory()) {
      console.log(`${prefix}📁 ${f}/`);
      listDir(fp, prefix + '  ');
    } else if (f.endsWith('.md')) {
      console.log(`${prefix}📄 ${f.replace('.md', '')}`);
    }
  });
}

// Main
const [,, command, ...args] = process.argv;

switch (command) {
  case 'install': installPlugin(); break;
  case 'init': initProject(); break;
  case 'update': installPlugin(); break;
  case 'uninstall': uninstallPlugin(); break;
  case 'doctor': doctor(); break;
  case 'list': listComponents(args[0]); break;
  case 'version': case '-v': case '--version': showVersion(); break;
  case 'help': case '-h': case '--help': case undefined: showHelp(); break;
  default:
    log.error(`Unknown command: ${command}`);
    log.info('Run: omgkit help');
    process.exit(1);
}
```

## Task 1.3: Tạo cấu trúc thư mục

Tạo tất cả các thư mục cần thiết với .gitkeep:

```
omgkit/
├── bin/
│   └── omgkit.js
├── lib/
│   └── .gitkeep
├── plugin/
│   ├── .claude-plugin/
│   ├── commands/
│   │   ├── dev/
│   │   ├── planning/
│   │   ├── git/
│   │   ├── quality/
│   │   ├── context/
│   │   ├── design/
│   │   ├── omega/
│   │   └── sprint/
│   ├── agents/
│   ├── skills/
│   │   ├── languages/
│   │   ├── frameworks/
│   │   ├── databases/
│   │   ├── frontend/
│   │   ├── devops/
│   │   ├── security/
│   │   ├── testing/
│   │   ├── methodology/
│   │   └── omega/
│   ├── modes/
│   └── mcp/
├── templates/
└── docs/
```

Tạo file .gitkeep trong mỗi thư mục rỗng.

## Task 1.4: Tạo README.md

Tạo file README.md với nội dung giới thiệu OMGKIT, bao gồm:
- Features (23 agents, 54 commands, 43 skills, 9 modes)
- Installation instructions
- Quick start guide
- Commands reference
- Omega Philosophy
```

---

## PHASE 2: PLUGIN FOUNDATION

```markdown
Tiếp tục xây dựng OMGKIT. Phase 1 đã hoàn thành.

Hãy thực hiện Phase 2: Tạo Plugin Foundation và Templates.

## Task 2.1: Tạo plugin/.claude-plugin/plugin.json

```json
{
  "name": "omgkit",
  "version": "1.0.0",
  "description": "Omega-Level Development Kit - AI Team System with 23 agents, 54 commands, 43 skills, and sprint management for 10x-1000x productivity",
  "author": "OMGKIT Team",
  "homepage": "https://github.com/user/omgkit",
  "keywords": [
    "omega", "ai-team", "productivity", "claude-code",
    "agents", "sprint", "automation", "claudekit"
  ]
}
```

## Task 2.2: Tạo templates/config.yaml

```yaml
# OMGKIT Project Configuration
version: "1.0.0"

# Project info
project:
  name: ""
  description: ""
  
# AI settings
ai:
  model: inherit
  temperature: 0.7
  
# Agent settings
agents:
  mode: auto  # auto | sequential | parallel
  timeout: 300
  
# Sprint settings
sprint:
  default_duration: 14
  max_tasks: 20
  auto_propose: true
  
# Team settings
team:
  autonomy: semi-auto  # full-auto | semi-auto | manual
  review_gates: true
  auto_commit: false
  
# Output settings
output:
  plans_dir: .omgkit/plans
  docs_dir: .omgkit/docs
  logs_dir: .omgkit/logs
  verbose: false
  
# MCP settings
mcp:
  context7: true
  sequential: true
  playwright: false
  memory: true
  filesystem: true
```

## Task 2.3: Tạo templates/OMEGA.md

```markdown
# 🔮 OMEGA.md - Project Context

> This file provides context for OMGKIT AI Team.
> Customize for your project.

## Project Overview

**Name**: [Your Project Name]
**Description**: [Brief description]
**Tech Stack**: [e.g., Next.js, PostgreSQL, TypeScript]

## Team Structure

OMGKIT provides 23 specialized agents organized into teams:

### Core Development
- **planner** - Task decomposition and planning
- **fullstack-developer** - Full implementation
- **debugger** - Error analysis and fixing
- **tester** - Test generation
- **code-reviewer** - Code review with security focus
- **scout** - Codebase exploration

### Operations
- **git-manager** - Git operations and PRs
- **docs-manager** - Documentation
- **project-manager** - Progress tracking
- **database-admin** - Schema and migrations
- **ui-ux-designer** - UI components

### Omega Team ⭐
- **oracle** - Deep analysis, 7 thinking modes
- **architect** - System design, leverage multiplication
- **sprint-master** - Sprint and team management

## Conventions

### Code Style
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits

### Testing
- Minimum 80% coverage
- TDD for critical paths
- E2E for user flows

### Documentation
- Update docs with code
- API documentation required
- Architecture decisions in ADRs

## Current Sprint

See `.omgkit/sprints/current.yaml`

## Commands Quick Reference

```bash
# Core
/feature [desc]    # Build feature
/fix [issue]       # Fix bug
/plan [task]       # Create plan
/test [scope]      # Generate tests

# Sprint
/vision:set        # Set vision
/sprint:new        # New sprint
/team:run          # Run AI team
/backlog:add       # Add task

# Omega
/10x [topic]       # 10x path
/100x [topic]      # 100x paradigm
/1000x [topic]     # 1000x moonshot
```

---

*Think Omega. Build Omega. Be Omega.* 🔮
```

## Task 2.4: Tạo templates/vision.yaml

```yaml
# Product Vision
# Created by /vision:set command

vision:
  product: ""
  tagline: ""
  
  users:
    primary: ""
    secondary: ""
    
  goals:
    business: []
    technical: []
    user: []
    
  constraints:
    technical: []
    time: ""
    budget: ""
    
  success_metrics:
    - metric: ""
      target: ""
      
  competitors: []
  differentiators: []
  
  created_at: ""
  updated_at: ""
```

## Task 2.5: Tạo templates/backlog.yaml

```yaml
# Product Backlog
# Managed by /backlog:* commands

backlog: []

# Task template:
# - id: "TASK-001"
#   title: ""
#   description: ""
#   type: feature | bugfix | docs | test | refactor | infra
#   priority: 1-5 (1 = highest)
#   status: pending | in_progress | review | done | blocked
#   assigned_to: null | agent_name
#   sprint_id: null | sprint_id
#   estimate: "2h" | "1d" | "3d"
#   tags: []
#   dependencies: []
#   created_at: ""
#   completed_at: null

stats:
  total: 0
  pending: 0
  in_progress: 0
  done: 0
```

## Task 2.6: Tạo templates/settings.json

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git *)",
      "Bash(npx *)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(sudo *)"
    ]
  },
  "hooks": {
    "PreToolUse": [],
    "PostToolUse": []
  },
  "mcp": {
    "servers": []
  }
}
```

## Task 2.7: Tạo plugin/mcp/.mcp.json

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

## Verification

Kiểm tra:
1. ✅ plugin/.claude-plugin/plugin.json
2. ✅ templates/config.yaml
3. ✅ templates/OMEGA.md  
4. ✅ templates/vision.yaml
5. ✅ templates/backlog.yaml
6. ✅ templates/settings.json
7. ✅ plugin/mcp/.mcp.json

Test CLI:
```bash
node bin/omgkit.js help
node bin/omgkit.js version
node bin/omgkit.js doctor
```
```

---

**Copy từng phase block và paste vào Claude Code để thực hiện.**
