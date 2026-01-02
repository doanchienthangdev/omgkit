# 🔮 OMGKIT - Omega-Level Development Kit

[![CI](https://github.com/doanchienthangdev/omgkit/actions/workflows/ci.yml/badge.svg)](https://github.com/doanchienthangdev/omgkit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/omgkit.svg)](https://www.npmjs.com/package/omgkit)
[![npm downloads](https://img.shields.io/npm/dm/omgkit.svg)](https://www.npmjs.com/package/omgkit)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> **AI Team System for Claude Code**
> 33 Agents • 113 Commands • 49 Workflows • 127 Skills • 10 Modes • 14 Archetypes
> *"Think Omega. Build Omega. Be Omega."*

OMGKIT transforms Claude Code into an autonomous AI development team with sprint management, specialized agents, and Omega-level thinking for 10x-1000x productivity improvements.

## ✨ Features

| Component | Count | Description |
|-----------|-------|-------------|
| **Agents** | 33 | Specialized AI team members |
| **Commands** | 113 | Slash commands for every task |
| **Workflows** | 49 | Complete development processes |
| **Skills** | 127 | Domain expertise modules |
| **Modes** | 10 | Behavioral configurations |
| **Archetypes** | 14 | Project templates for autonomous dev |
| **Sprint Management** | ✅ | Vision, backlog, team autonomy |
| **Omega Thinking** | ✅ | 7 modes for 10x-1000x solutions |
| **Autonomous Dev** | ✅ | Build complete apps from idea to deploy |

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

## 🤖 Agents (33)

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
| `observability-engineer` | Monitoring, logging, tracing, alerting |

### Extended
| Agent | Description |
|-------|-------------|
| `fullstack-developer` | Full implementation |
| `cicd-manager` | CI/CD pipeline management |
| `security-auditor` | Security reviews, audits |
| `api-designer` | API design, OpenAPI specs |
| `vulnerability-scanner` | Security scanning |
| `pipeline-architect` | Pipeline optimization |
| `devsecops` | Security automation, SAST/DAST |

### Creative
| Agent | Description |
|-------|-------------|
| `copywriter` | Marketing copy, content |
| `brainstormer` | Creative exploration |
| `journal-writer` | Failure documentation |

### Architecture & Platform
| Agent | Description |
|-------|-------------|
| `domain-decomposer` | DDD, bounded contexts, service boundaries |
| `platform-engineer` | Internal developer platforms, golden paths |
| `performance-engineer` | Profiling, load testing, optimization |

### Data & ML
| Agent | Description |
|-------|-------------|
| `data-engineer` | Data pipelines, ETL, schema design |
| `ml-engineer` | ML pipelines, model training, MLOps |

### Specialized
| Agent | Description |
|-------|-------------|
| `game-systems-designer` | Game mechanics, balancing, multiplayer |
| `embedded-systems` | Firmware, RTOS, IoT connectivity |
| `scientific-computing` | Numerical methods, simulations |

### Omega Exclusive ⭐
| Agent | Description |
|-------|-------------|
| `oracle` | Deep analysis with 7 thinking modes |
| `architect` | System design, leverage multiplication |
| `sprint-master` | Sprint management, team orchestration |

## ⚡ Commands (113)

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

### Autonomous Development
```bash
/auto:init <idea>   # Start discovery for new project
/auto:start         # Begin/continue autonomous execution
/auto:status        # Check project progress
/auto:approve       # Approve checkpoint to continue
/auto:reject        # Request changes with feedback
/auto:resume        # Resume from saved state
```

### Alignment & Dependencies ⭐
```bash
/alignment:health   # Check system alignment health status
/alignment:deps <type:name>  # Show dependency graph tree
```

The alignment commands help you understand and validate OMGKIT's component hierarchy:
- `agent:fullstack-developer` - Shows agent's skills, commands, and workflows
- `workflow:development/feature` - Shows workflow's agents, skills, commands
- `skill:methodology/writing-plans` - Shows which agents/workflows use this skill
- `command:/dev:feature` - Shows which agents trigger this command

## 🤖 Autonomous Development (14 Archetypes)

Build complete applications autonomously from idea to deployment.

| Archetype | Description |
|-----------|-------------|
| **SaaS MVP** | Multi-tenant SaaS with auth, payments |
| **API Service** | Backend APIs for web/mobile apps |
| **CLI Tool** | Command-line utilities |
| **Library/SDK** | Reusable npm packages |
| **Full-Stack App** | Complete web applications |
| **Mobile App** | iOS/Android with React Native |
| **AI-Powered App** | LLM apps with RAG, function calling |
| **AI Model Building** | ML model training pipelines |
| **Desktop App** | Electron cross-platform apps |
| **IoT App** | Device management, real-time data |
| **Game** | Unity/Godot game development |
| **Simulation** | Scientific/engineering simulations |
| **Microservices** | Distributed services with K8s, API gateway |
| **Event-Driven** | Async systems with Kafka, CQRS, sagas |

### Artifacts System

Provide project context through artifacts:

```
.omgkit/artifacts/
├── data/       # Sample data, schemas
├── docs/       # Requirements, user stories
├── knowledge/  # Glossary, business rules
├── research/   # Competitor analysis
├── assets/     # Images, templates
└── examples/   # Code samples
```

## 📋 Workflows (49)

Workflows are orchestrated sequences of agents, commands, and skills that guide complete development processes.

### Development
| Workflow | Description |
|----------|-------------|
| `feature` | Complete feature development from planning to PR |
| `bug-fix` | Systematic debugging and resolution |
| `refactor` | Code improvement and restructuring |
| `code-review` | Comprehensive code review |

### AI Engineering
| Workflow | Description |
|----------|-------------|
| `rag-development` | Build complete RAG systems |
| `model-evaluation` | AI model evaluation pipeline |
| `prompt-engineering` | Systematic prompt optimization |
| `agent-development` | Build AI agents |
| `fine-tuning` | Model fine-tuning workflow |

### AI-ML Operations
| Workflow | Description |
|----------|-------------|
| `data-pipeline` | Build ML data pipelines |
| `experiment-cycle` | ML experiment tracking |
| `model-deployment` | Model serving and deployment |
| `monitoring-setup` | ML model monitoring |
| `feature-engineering` | Feature store development |

### Omega ⭐
| Workflow | Description |
|----------|-------------|
| `10x-improvement` | Tactical enhancements |
| `100x-architecture` | System redesign |
| `1000x-innovation` | Industry transformation |

### Sprint Management
| Workflow | Description |
|----------|-------------|
| `sprint-setup` | Initialize and plan sprints |
| `sprint-execution` | Execute sprint tasks |
| `sprint-retrospective` | Review and improve |

### Microservices
| Workflow | Description |
|----------|-------------|
| `domain-decomposition` | DDD bounded context analysis |
| `service-scaffolding` | Service template generation |
| `contract-first` | API contract development |
| `integration-testing` | Service integration tests |
| `service-mesh-setup` | Istio/Linkerd configuration |
| `distributed-tracing` | Tracing implementation |

### Event-Driven
| Workflow | Description |
|----------|-------------|
| `event-storming` | Domain event modeling |
| `schema-evolution` | Event schema management |
| `saga-implementation` | Distributed transaction patterns |
| `replay-testing` | Event replay testing |
| `consumer-groups` | Consumer group setup |

### Game Development
| Workflow | Description |
|----------|-------------|
| `prototype-to-production` | Game development lifecycle |
| `content-pipeline` | Asset management |
| `playtesting` | Testing and balancing |
| `platform-submission` | Store submission |

### Other Categories
- **Security**: `security-audit`, `penetration-testing`
- **Database**: `schema-design`, `migration`, `optimization`
- **API**: `api-design`, `api-testing`
- **Full Stack**: `full-feature`, `authentication`
- **Content**: `technical-docs`, `marketing`
- **Research**: `technology-research`, `best-practices`
- **Quality**: `performance-optimization`

Use workflows with: `/workflow:<name> "description"`

## 🎭 Modes (10)

| Mode | Description |
|------|-------------|
| `default` | Balanced standard behavior |
| `tutor` ⭐ | Teaching mode with Feynman technique & Socratic questions |
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

## 🧠 Skills (127)

OMGKIT includes 127 skills across 22 categories:

### AI Engineering (12 skills)
Based on Chip Huyen's "AI Engineering" book for building production AI applications:

| Skill | Description |
|-------|-------------|
| `foundation-models` | Model architecture, sampling, structured outputs |
| `evaluation-methodology` | AI-as-judge, semantic similarity, ELO ranking |
| `ai-system-evaluation` | Benchmarks, model selection, cost analysis |
| `prompt-engineering` | Few-shot, chain-of-thought, injection defense |
| `rag-systems` | Chunking, embedding, hybrid retrieval, reranking |
| `ai-agents` | Tool use, ReAct, Plan-and-Execute, memory |
| `finetuning` | LoRA, QLoRA, PEFT, model merging |
| `dataset-engineering` | Curation, deduplication, synthesis |
| `inference-optimization` | Quantization, batching, caching, vLLM |
| `ai-architecture` | Gateway, routing, observability |
| `guardrails-safety` | Input/output guards, PII protection |
| `user-feedback` | Explicit/implicit signals, A/B testing |

### Other Skill Categories

| Category | Count | Description |
|----------|-------|-------------|
| AI-ML Operations | 6 | MLOps, feature stores, model serving |
| Microservices | 6 | Service mesh, API gateway, distributed tracing |
| Event-Driven | 6 | Kafka, event sourcing, CQRS, sagas |
| Game Development | 5 | Unity, Godot, networking, shaders |
| IoT | 5 | MQTT, edge computing, device management |
| Mobile Advanced | 5 | React Native deep, CI/CD, offline-first |
| Simulation | 5 | Numerical methods, physics, parallel computing |
| Languages | 3 | Python, TypeScript, JavaScript |
| Frameworks | 10 | React, Next.js, Django, FastAPI, etc. |
| Backend | 4 | API architecture, caching, real-time |
| Databases | 9 | PostgreSQL, MongoDB, Redis, migrations |
| Frontend | 7 | Tailwind, shadcn/ui, Three.js, accessibility |
| DevOps | 7 | Docker, Kubernetes, GitHub Actions, AWS |
| Security | 4 | OWASP, OAuth, security hardening |
| Testing | 3 | Pytest, Vitest, Playwright |
| Methodology | 17 | TDD, code review, debugging practices |
| Omega | 5 | Omega-level development practices |

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

## ✅ Before-Commit Validation

OMGKIT provides two types of before-commit rules:

| Rule Type | Location | Purpose |
|-----------|----------|---------|
| **OMGKIT Internal** | `plugin/stdrules/` | For OMGKIT contributors |
| **Project Rules** | `.omgkit/stdrules/BEFORE_COMMIT.md` | For your projects |

### For OMGKIT Contributors

```bash
npm test    # Run all 4800+ validation tests
```

| Category | Requirement |
|----------|-------------|
| **Agents** | 50+ lines, valid frontmatter, skills/commands arrays |
| **Commands** | 15+ lines, description, registered as slash command |
| **Skills** | 30+ lines, name/description if frontmatter present |
| **Workflows** | 50+ lines, description, agents array |

### For Project Developers

When you run `omgkit init`, a comprehensive `BEFORE_COMMIT.md` is created with:
- Code quality checks
- Git commit standards
- Security guidelines
- Documentation requirements

See [full documentation](https://omgkit.mintlify.app/resources/before-commit).

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
│   ├── logs/            # Activity logs
│   ├── devlogs/         # Development logs, planning, tracking (git-ignored)
│   └── stdrules/        # Standards & rules for the project
│       ├── BEFORE_COMMIT.md   # Before-commit checklist
│       └── SKILL_STANDARDS.md
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

## 🏗️ Optimized Alignment Principle (OAP)

OMGKIT uses a **5-level component hierarchy** ensuring consistency and maintainability:

```
Level 0: MCPs (Foundation)
    ↓
Level 1: Commands → use MCPs
    ↓
Level 2: Skills → use Commands, MCPs
    ↓
Level 3: Agents → use Skills, Commands, MCPs
    ↓
Level 4: Workflows → use Agents, Skills, Commands, MCPs
```

### Five Alignment Rules

1. **Format Compliance** - Components use correct naming patterns
2. **Existence Validation** - All references must exist
3. **No Cross-Type Confusion** - Components not confused with other types
4. **Hierarchical Respect** - Only reference same/lower level components
5. **Optimization** - Minimal, appropriate, unique references

### Component Formats

| Component | Format | Example |
|-----------|--------|---------|
| MCPs | `kebab-case` | `context7` |
| Commands | `/namespace:name` | `/dev:feature` |
| Skills | `category/name` | `methodology/writing-plans` |
| Agents | `kebab-case` | `fullstack-developer` |
| Workflows | `category/name` | `development/feature` |

All alignment rules are enforced by 400+ automated tests. See [full documentation](https://omgkit.mintlify.app/concepts/alignment-principle).

## 📄 License

MIT

---

*Think Omega. Build Omega. Be Omega.* 🔮
