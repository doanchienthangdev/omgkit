# 🔮 OMGKIT - Omega-Level Development Kit

> **AI Team System for Claude Code**
> 23 Agents • 54 Commands • 43 Skills • 9 Modes
> *"Think Omega. Build Omega. Be Omega."*

OMGKIT transforms Claude Code into an autonomous AI development team with sprint management, specialized agents, and Omega-level thinking for 10x-1000x productivity improvements.

## ✨ Features

| Component | Count | Description |
|-----------|-------|-------------|
| **Agents** | 23 | Specialized AI team members |
| **Commands** | 54 | Slash commands for every task |
| **Skills** | 43 | Domain expertise modules |
| **Modes** | 9 | Behavioral configurations |
| **Sprint Management** | ✅ | Vision, backlog, team autonomy |
| **Omega Thinking** | ✅ | 7 modes for 10x-1000x solutions |

## 🚀 Installation

```bash
# Install globally
npm install -g omgkit

# Install Claude Code plugin
omgkit install

# Initialize in your project
cd your-project
omgkit init
```

## 📋 Quick Start

After installation, use these commands in Claude Code:

```bash
# Set your vision
/vision:set

# Create a sprint (AI proposes tasks)
/sprint:new --propose

# Start the AI team
/team:run

# Or use individual commands
/feature "add user authentication"
/fix "login not working"
/10x "improve performance"
```

## 🤖 Agents (23)

### Core Development
| Agent | Description |
|-------|-------------|
| `planner` | Task decomposition, implementation planning |
| `researcher` | Technology research, best practices |
| `debugger` | Error analysis, root cause finding |
| `tester` | Test generation, coverage analysis |
| `code-reviewer` | Code review with security focus |
| `scout` | Codebase exploration, file search |

### Operations
| Agent | Description |
|-------|-------------|
| `git-manager` | Git operations, PRs, commits |
| `docs-manager` | Documentation generation |
| `project-manager` | Progress tracking, coordination |
| `database-admin` | Schema design, query optimization |
| `ui-ux-designer` | UI components, responsive design |

### Extended
| Agent | Description |
|-------|-------------|
| `fullstack-developer` | Full implementation |
| `cicd-manager` | CI/CD pipeline management |
| `security-auditor` | Security reviews, audits |
| `api-designer` | API design, OpenAPI specs |
| `vulnerability-scanner` | Security scanning |
| `pipeline-architect` | Pipeline optimization |

### Creative
| Agent | Description |
|-------|-------------|
| `copywriter` | Marketing copy, content |
| `brainstormer` | Creative exploration |
| `journal-writer` | Failure documentation |

### Omega Exclusive ⭐
| Agent | Description |
|-------|-------------|
| `oracle` | Deep analysis with 7 thinking modes |
| `architect` | System design, leverage multiplication |
| `sprint-master` | Sprint management, team orchestration |

## ⚡ Commands (54)

### Development
```bash
/feature <desc>     # Full feature development
/fix <error>        # Debug and fix bugs
/fix:fast <error>   # Quick bug fix
/fix:hard <error>   # Complex bug (deep analysis)
/test <scope>       # Generate tests
/tdd <feature>      # Test-driven development
/review [file]      # Code review
```

### Planning
```bash
/plan <task>        # Create implementation plan
/plan:detailed      # Detailed plan (2-5 min tasks)
/brainstorm <topic> # Interactive brainstorming
/research <topic>   # Research technology
/doc <target>       # Generate documentation
```

### Git & Deploy
```bash
/commit [message]   # Smart commit
/ship [message]     # Commit + PR
/pr [title]         # Create pull request
/deploy [env]       # Deploy to environment
```

### Quality
```bash
/security-scan      # Scan for vulnerabilities
/refactor <file>    # Improve code structure
/optimize <file>    # Performance optimization
/lint               # Run linting
```

### Omega ⭐
```bash
/10x <topic>        # Find 10x improvement path
/100x <topic>       # Find 100x paradigm shift
/1000x <topic>      # Find 1000x moonshot
/principles         # Display 7 Omega Principles
/dimensions         # Display 10 Omega Dimensions
```

### Sprint Management ⭐
```bash
/vision:set         # Set product vision
/vision:show        # Display current vision
/sprint:new [name]  # Create new sprint
/sprint:start       # Start current sprint
/sprint:current     # Show sprint progress
/sprint:end         # End sprint + retrospective
/backlog:add <task> # Add task to backlog
/backlog:show       # Display backlog
/team:run [--mode]  # Run AI team (full-auto|semi-auto|manual)
/team:status        # Show team activity
```

## 🎭 Modes (9)

| Mode | Description |
|------|-------------|
| `default` | Balanced standard behavior |
| `brainstorm` | Creative exploration |
| `token-efficient` | Compressed output (30-70% savings) |
| `deep-research` | Thorough analysis with citations |
| `implementation` | Code-focused, minimal prose |
| `review` | Critical analysis mode |
| `orchestration` | Multi-task coordination |
| `omega` ⭐ | 10x-1000x thinking mode |
| `autonomous` ⭐ | AI team self-management |

Switch modes with: `/mode <name>`

## 🔮 Omega Philosophy

### 7 Omega Principles

1. **Ω1 Leverage Multiplication** - Build systems, not features
2. **Ω2 Transcendent Abstraction** - Solve classes, not instances
3. **Ω3 Agentic Decomposition** - Orchestrate specialists
4. **Ω4 Feedback Acceleration** - Compress loops
5. **Ω5 Zero-Marginal-Cost Scaling** - Build once, scale infinitely
6. **Ω6 Emergent Intelligence** - System > sum of parts
7. **Ω7 Aesthetic Perfection** - Excellence always

### 7 Thinking Modes

| Mode | Focus |
|------|-------|
| 🔭 Telescopic | Zoom out to see big picture |
| 🔬 Microscopic | First principles analysis |
| ↔️ Lateral | Different angles and industries |
| 🔄 Inversion | Learn through failure |
| ⏳ Temporal | Time dimension analysis |
| 🕸️ Systemic | Interconnections and emergence |
| ⚛️ Quantum | Multiple possibilities |

## 🛠️ CLI Commands

```bash
omgkit install      # Install plugin to Claude Code
omgkit init         # Initialize .omgkit/ in project
omgkit doctor       # Check installation status
omgkit list         # List all components
omgkit update       # Update plugin
omgkit uninstall    # Remove plugin
omgkit help         # Show help
```

## 📁 Project Structure

After `omgkit init`:

```
your-project/
├── .omgkit/
│   ├── config.yaml      # Project settings
│   ├── settings.json    # Permissions
│   ├── sprints/
│   │   ├── vision.yaml  # Product vision
│   │   └── backlog.yaml # Task backlog
│   ├── plans/           # Generated plans
│   ├── docs/            # Generated docs
│   └── logs/            # Activity logs
└── OMEGA.md             # Project context
```

## 🔌 MCP Integrations

OMGKIT supports these MCP servers for enhanced capabilities:

| Server | Purpose |
|--------|---------|
| Context7 | Up-to-date library documentation |
| Sequential Thinking | Multi-step reasoning |
| Memory | Persistent knowledge graph |
| Filesystem | Secure file operations |
| Playwright | Browser automation |

## 📄 License

MIT

---

*Think Omega. Build Omega. Be Omega.* 🔮
