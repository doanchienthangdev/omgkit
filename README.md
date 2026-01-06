# OMGKIT - Omega-Level Development Kit

[![CI](https://github.com/doanchienthangdev/omgkit/actions/workflows/ci.yml/badge.svg)](https://github.com/doanchienthangdev/omgkit/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/omgkit.svg)](https://www.npmjs.com/package/omgkit)
[![npm downloads](https://img.shields.io/npm/dm/omgkit.svg)](https://www.npmjs.com/package/omgkit)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> **AI Team System for Claude Code**
>
> *"Think Omega. Build Omega. Be Omega."*

---

## What is OMGKIT?

**OMGKIT** (Omega-Level Development Kit) transforms Claude Code into an autonomous AI development team. It provides a complete ecosystem of specialized AI agents, slash commands, skills, and workflows that work together to deliver 10x-1000x productivity improvements.

### The Vision

Traditional AI assistants respond to prompts. OMGKIT creates an **AI Team** that:

- **Plans** like a senior architect
- **Researches** like a staff engineer
- **Codes** like a full-stack developer
- **Reviews** like a security expert
- **Tests** like a QA specialist
- **Documents** like a technical writer
- **Ships** like a DevOps engineer

All coordinated through **Omega-level thinking** - a framework for finding breakthrough solutions rather than incremental improvements.

---

## Key Numbers

| Component | Count | Description |
|-----------|-------|-------------|
| **Agents** | 41 | Specialized AI team members with distinct roles |
| **Commands** | 160 | Slash commands for every development task |
| **Workflows** | 69 | Complete development processes from idea to deploy |
| **Skills** | 161 | Domain expertise modules across 24 categories |
| **Modes** | 10 | Behavioral configurations for different contexts |
| **Archetypes** | 14 | Project templates for autonomous development |

---

## Core Concepts

### 1. Optimized Alignment Principle (OAP)

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

Each level builds on lower levels, creating a coherent system where components work together seamlessly.

### 2. Omega Philosophy

Seven principles guide OMGKIT's approach to problem-solving:

| Principle | Focus |
|-----------|-------|
| **Leverage Multiplication** | Build systems, not features |
| **Transcendent Abstraction** | Solve classes of problems, not instances |
| **Agentic Decomposition** | Orchestrate specialists |
| **Feedback Acceleration** | Compress learning loops |
| **Zero-Marginal-Cost Scaling** | Build once, scale infinitely |
| **Emergent Intelligence** | System greater than sum of parts |
| **Aesthetic Perfection** | Excellence in everything |

### 3. Sprint Management

OMGKIT brings agile methodology to AI-assisted development:

- **Vision**: Define what you're building and why
- **Backlog**: Prioritized list of work items
- **Sprints**: Time-boxed development cycles
- **AI Team**: Autonomous execution with human oversight

### 4. Testing Automation (New)

OMGKIT includes a comprehensive testing automation system:

#### Auto-Generate Test Tasks
When you create a feature, OMGKIT automatically generates corresponding test tasks:

```yaml
# workflow.yaml
testing:
  auto_generate_tasks: true
  required_test_types:
    - unit
    - integration
```

Feature tasks automatically spawn test tasks based on feature type (API → Contract tests, UI → Snapshot tests, etc.)

#### Enforce Tests Before Done
No task can be marked "done" without passing tests:

```yaml
testing:
  enforcement:
    level: standard  # soft | standard | strict
  blocking:
    on_test_failure: true
    on_coverage_below_minimum: true
```

#### Coverage Gates
Set minimum and target coverage thresholds:

```yaml
testing:
  coverage_gates:
    unit:
      minimum: 80
      target: 90
    integration:
      minimum: 60
      target: 75
    overall:
      minimum: 75
      target: 85
```

---

## Installation

### Prerequisites

- Node.js 18+
- Claude Code CLI installed and authenticated

### Install OMGKIT

```bash
# Install globally
npm install -g omgkit

# Install Claude Code plugin
omgkit install

# Initialize in your project
cd your-project
omgkit init
```

### Verify Installation

```bash
omgkit doctor
```

---

## Quick Start

After installation, use these commands in Claude Code:

```bash
# 1. Set your product vision
/vision:set

# 2. Create a sprint with AI-proposed tasks
/sprint:new --propose

# 3. Start the AI team
/team:run

# 4. Or use individual commands
/feature "add user authentication"
/fix "login not working"
/10x "improve performance"
```

---

## Agents (41)

Agents are specialized AI team members, each with distinct expertise and responsibilities.

### Core Development

| Agent | Description | Key Skills |
|-------|-------------|------------|
| `planner` | Task decomposition, implementation planning | Writing plans, task breakdown |
| `researcher` | Technology research, best practices | Documentation analysis, comparisons |
| `debugger` | Error analysis, root cause finding | RAPID methodology, log analysis |
| `tester` | Test generation, coverage analysis | Framework-specific testing |
| `code-reviewer` | Code review with security focus | OWASP checks, severity rating |
| `scout` | Codebase exploration, file search | Pattern discovery, architecture mapping |
| `fullstack-developer` | Full implementation | All development skills |

### Operations

| Agent | Description |
|-------|-------------|
| `git-manager` | Conventional commits, PR automation, branch management |
| `docs-manager` | API docs, architecture guides, automated doc generation |
| `project-manager` | Progress tracking, coordination, status reports |
| `database-admin` | Schema design, query optimization, migrations |
| `ui-ux-designer` | UI components, responsive design, accessibility |
| `observability-engineer` | Monitoring, logging, tracing, alerting, SLOs |

### Architecture & Platform

| Agent | Description |
|-------|-------------|
| `architect` | System design, leverage multiplication, ADRs |
| `domain-decomposer` | DDD, bounded contexts, service boundaries |
| `platform-engineer` | Internal developer platforms, golden paths |
| `performance-engineer` | Profiling, load testing, optimization |

### Security

| Agent | Description |
|-------|-------------|
| `security-auditor` | Security reviews, vulnerability assessment |
| `vulnerability-scanner` | Security scanning, dependency audit |
| `devsecops` | Security automation, SAST/DAST integration |

### Data & ML

| Agent | Description |
|-------|-------------|
| `data-engineer` | Data pipelines, ETL, schema design |
| `ml-engineer` | ML pipelines, model training, MLOps |

### ML Systems (New)

| Agent | Description |
|-------|-------------|
| `ml-engineer-agent` | Full-stack ML engineering from data to deployment |
| `data-scientist-agent` | Statistical modeling, experimentation, analysis |
| `research-scientist-agent` | Novel algorithms, paper implementation, experiments |
| `model-optimizer-agent` | Quantization, pruning, distillation |
| `production-engineer-agent` | Model serving, reliability, scaling |
| `mlops-engineer-agent` | ML infrastructure, pipelines, monitoring |
| `ai-architect-agent` | ML system architecture, requirements analysis |
| `experiment-analyst-agent` | Experiment tracking, analysis, reporting |

### Specialized Domains

| Agent | Description |
|-------|-------------|
| `game-systems-designer` | Game mechanics, balancing, multiplayer |
| `embedded-systems` | Firmware, RTOS, IoT connectivity |
| `scientific-computing` | Numerical methods, simulations |

### Omega Exclusive

| Agent | Description |
|-------|-------------|
| `oracle` | Deep analysis with 7 Omega thinking modes |
| `sprint-master` | Sprint management, team orchestration |

---

## Commands (160)

Commands are slash-prefixed actions organized by namespace.

### Development (`/dev:*`)

```bash
/dev:feature <desc>     # Full feature development
/dev:fix <error>        # Debug and fix bugs
/dev:fix-fast <error>   # Quick bug fix
/dev:fix-hard <error>   # Complex bug (deep analysis)
/dev:test <scope>       # Generate tests
/dev:tdd <feature>      # Test-driven development
/dev:review [file]      # Code review
```

### Planning (`/planning:*`)

```bash
/planning:plan <task>        # Create implementation plan
/planning:plan-detailed      # Detailed plan (2-5 min tasks)
/planning:brainstorm <topic> # Interactive brainstorming
/planning:research <topic>   # Research technology
/planning:doc <target>       # Generate documentation
```

### Git (`/git:*`)

```bash
/git:commit [message]   # Smart commit with conventional format
/git:ship [message]     # Commit + PR in one command
/git:pr [title]         # Create pull request
/git:deploy [env]       # Deploy to environment
```

### Quality (`/quality:*`)

```bash
/quality:security-scan   # Scan for vulnerabilities
/quality:refactor <file> # Improve code structure
/quality:optimize <file> # Performance optimization
/quality:lint            # Run linting
/quality:verify-done     # Verify test requirements before completion
/quality:coverage-check  # Check coverage against gates
/quality:test-plan       # Generate comprehensive test plan
```

### Omega (`/omega:*`)

```bash
/omega:10x <topic>      # Find 10x improvement path
/omega:100x <topic>     # Find 100x paradigm shift
/omega:1000x <topic>    # Find 1000x moonshot opportunity
/omega:principles       # Display 7 Omega Principles
/omega:dimensions       # Display 10 Omega Dimensions
```

### Sprint Management (`/sprint:*`)

```bash
/sprint:vision-set      # Set product vision
/sprint:vision-show     # Display current vision
/sprint:sprint-new      # Create new sprint
/sprint:sprint-start    # Start current sprint
/sprint:sprint-current  # Show sprint progress
/sprint:sprint-end      # End sprint + retrospective
/sprint:backlog-add     # Add task to backlog
/sprint:backlog-show    # Display backlog
/sprint:team-run        # Run AI team
/sprint:team-status     # Show team activity
```

### Autonomous Development (`/auto:*`)

```bash
/auto:init <idea>       # Start discovery for new project
/auto:start             # Begin/continue autonomous execution
/auto:status            # Check project progress
/auto:approve           # Approve checkpoint to continue
/auto:reject            # Request changes with feedback
/auto:resume            # Resume from saved state
```

### Alignment (`/alignment:*`)

```bash
/alignment:health       # Check system alignment health
/alignment:deps <type:name>  # Show dependency graph
```

### ML Systems (New - 31 commands)

#### `/omgml:*` - Project Management
```bash
/omgml:init             # Initialize ML project structure
/omgml:status           # Show ML project status
```

#### `/omgdata:*` - Data Engineering
```bash
/omgdata:collect        # Collect data from sources
/omgdata:validate       # Validate data quality
/omgdata:clean          # Clean and preprocess data
/omgdata:split          # Split train/val/test
/omgdata:version        # Version datasets with DVC
```

#### `/omgfeature:*` - Feature Engineering
```bash
/omgfeature:extract     # Extract features from raw data
/omgfeature:select      # Select important features
/omgfeature:store       # Store in feature store
```

#### `/omgtrain:*` - Model Training
```bash
/omgtrain:baseline      # Create baseline models
/omgtrain:train         # Train model with config
/omgtrain:tune          # Hyperparameter tuning
/omgtrain:evaluate      # Evaluate model performance
/omgtrain:compare       # Compare model versions
```

#### `/omgoptim:*` - Model Optimization
```bash
/omgoptim:quantize      # Quantize to INT8/FP16
/omgoptim:prune         # Prune model weights
/omgoptim:distill       # Knowledge distillation
/omgoptim:profile       # Profile latency/memory
```

#### `/omgdeploy:*` - Deployment
```bash
/omgdeploy:package      # Package model for deployment
/omgdeploy:serve        # Deploy model serving
/omgdeploy:edge         # Deploy to edge devices
/omgdeploy:cloud        # Deploy to cloud platforms
/omgdeploy:ab           # Setup A/B testing
```

#### `/omgops:*` - ML Operations
```bash
/omgops:pipeline        # Create ML pipeline
/omgops:monitor         # Setup monitoring
/omgops:drift           # Detect data/model drift
/omgops:retrain         # Trigger retraining
/omgops:registry        # Manage model registry
```

---

## Workflows (69)

Workflows are orchestrated sequences of agents, commands, and skills.

### Development

| Workflow | Description |
|----------|-------------|
| `development/feature` | Complete feature from planning to PR |
| `development/bug-fix` | Systematic debugging and resolution |
| `development/refactor` | Code improvement and restructuring |
| `development/code-review` | Comprehensive code review |

### Testing Automation (New)

| Workflow | Description |
|----------|-------------|
| `testing/automated-testing` | End-to-end testing automation with task generation, enforcement, and coverage gates |

### AI Engineering

| Workflow | Description |
|----------|-------------|
| `ai-engineering/rag-development` | Build complete RAG systems |
| `ai-engineering/model-evaluation` | AI model evaluation pipeline |
| `ai-engineering/prompt-engineering` | Systematic prompt optimization |
| `ai-engineering/agent-development` | Build AI agents |
| `ai-engineering/fine-tuning` | Model fine-tuning workflow |

### AI-ML Operations

| Workflow | Description |
|----------|-------------|
| `ai-ml/data-pipeline` | Build ML data pipelines |
| `ai-ml/experiment-cycle` | ML experiment tracking |
| `ai-ml/model-deployment` | Model serving and deployment |
| `ai-ml/monitoring-setup` | ML model monitoring |

### Microservices

| Workflow | Description |
|----------|-------------|
| `microservices/domain-decomposition` | DDD bounded context analysis |
| `microservices/service-scaffolding` | Service template generation |
| `microservices/contract-first` | API contract development |
| `microservices/distributed-tracing` | Tracing implementation |

### Event-Driven

| Workflow | Description |
|----------|-------------|
| `event-driven/event-storming` | Domain event modeling |
| `event-driven/saga-implementation` | Distributed transaction patterns |
| `event-driven/schema-evolution` | Event schema management |

### Game Development

| Workflow | Description |
|----------|-------------|
| `game/prototype-to-production` | Game development lifecycle |
| `game/content-pipeline` | Asset management |
| `game/playtesting` | Testing and balancing |

### Omega

| Workflow | Description |
|----------|-------------|
| `omega/10x-improvement` | Tactical enhancements |
| `omega/100x-architecture` | System redesign |
| `omega/1000x-innovation` | Industry transformation |

### ML Systems (New - 12 workflows)

| Workflow | Description |
|----------|-------------|
| `ml-systems/full-ml-lifecycle-workflow` | Complete ML lifecycle orchestration |
| `ml-systems/data-pipeline-workflow` | Data collection to feature store |
| `ml-systems/model-development-workflow` | Baseline to optimized models |
| `ml-systems/model-optimization-workflow` | Quantization, pruning, distillation |
| `ml-systems/production-deployment-workflow` | Model packaging to serving |
| `ml-systems/mlops-pipeline-workflow` | CI/CD for ML systems |
| `ml-systems/model-monitoring-workflow` | Drift detection and alerting |
| `ml-systems/experiment-tracking-workflow` | Systematic experimentation |
| `ml-systems/feature-engineering-workflow` | Feature extraction and selection |
| `ml-systems/model-retraining-workflow` | Automated retraining triggers |
| `ml-systems/edge-deployment-workflow` | Edge/mobile model deployment |
| `ml-systems/ab-testing-workflow` | A/B testing for models |

---

## Skills (161)

Skills are domain expertise modules organized in 24 categories.

### AI Engineering (12 skills)

Based on production AI application patterns:

| Skill | Description |
|-------|-------------|
| `ai-engineering/foundation-models` | Model architecture, sampling, structured outputs |
| `ai-engineering/evaluation-methodology` | AI-as-judge, semantic similarity, ELO ranking |
| `ai-engineering/prompt-engineering` | Few-shot, chain-of-thought, injection defense |
| `ai-engineering/rag-systems` | Chunking, embedding, hybrid retrieval, reranking |
| `ai-engineering/ai-agents` | Tool use, ReAct, Plan-and-Execute, memory |
| `ai-engineering/finetuning` | LoRA, QLoRA, PEFT, model merging |
| `ai-engineering/inference-optimization` | Quantization, batching, caching, vLLM |
| `ai-engineering/guardrails-safety` | Input/output guards, PII protection |

### ML Systems (18 skills - New)

Based on Chip Huyen's "Designing ML Systems" and Stanford CS 329S:

| Skill | Description |
|-------|-------------|
| `ml-systems/ml-systems-fundamentals` | Core ML concepts, design principles |
| `ml-systems/deep-learning-primer` | Neural network foundations |
| `ml-systems/dnn-architectures` | CNNs, RNNs, Transformers, hybrid models |
| `ml-systems/data-eng` | ML data pipelines, storage, processing |
| `ml-systems/training-data` | Sampling, labeling, augmentation |
| `ml-systems/feature-engineering` | Feature extraction, selection, stores |
| `ml-systems/ml-workflow` | Experiment design, model selection |
| `ml-systems/model-dev` | Training, evaluation, debugging |
| `ml-systems/ml-frameworks` | PyTorch, TensorFlow, scikit-learn |
| `ml-systems/efficient-ai` | Model compression, efficient architectures |
| `ml-systems/model-optimization` | Quantization, pruning, distillation |
| `ml-systems/ai-accelerators` | GPU/TPU optimization, hardware selection |
| `ml-systems/model-deployment` | Serving, containerization, scaling |
| `ml-systems/ml-serving-optimization` | Batching, caching, latency reduction |
| `ml-systems/edge-deployment` | TFLite, Core ML, TensorRT |
| `ml-systems/mlops` | CI/CD for ML, model registry, pipelines |
| `ml-systems/robust-ai` | Reliability, monitoring, drift detection |
| `ml-systems/deployment-paradigms` | Batch vs real-time vs streaming |

### Methodology (19 skills)

| Skill | Description |
|-------|-------------|
| `methodology/writing-plans` | Implementation plan creation |
| `methodology/executing-plans` | Plan execution best practices |
| `methodology/debugging` | Systematic debugging approach |
| `methodology/code-review` | Review standards and checklists |
| `methodology/tdd` | Test-driven development |
| `methodology/test-task-generation` | Auto-generate test tasks from features |
| `methodology/test-enforcement` | Enforce tests before task completion |

### Frameworks (10 skills)

| Skill | Description |
|-------|-------------|
| `frameworks/react` | React hooks, TypeScript, state management |
| `frameworks/nextjs` | App Router, Server Components, API routes |
| `frameworks/django` | DRF, ORM optimization, Celery tasks |
| `frameworks/fastapi` | Async/await, Pydantic v2, dependency injection |
| `frameworks/nestjs` | TypeScript, dependency injection, microservices |

### BigTech Workflow Alignment (4 skills - New)

Skills aligning OMGKIT with Google, Meta, Netflix, and Amazon engineering practices:

| Skill | Description | BigTech Reference |
|-------|-------------|-------------------|
| `devops/feature-flags` | Progressive delivery, canary releases, A/B testing | Netflix, LaunchDarkly |
| `testing/chaos-engineering` | Fault injection, game days, resilience testing | Netflix Chaos Monkey |
| `devops/dora-metrics` | Deployment frequency, lead time, MTTR tracking | Google DORA Research |
| `methodology/stacked-diffs` | Stacked PRs for parallel code review | Meta Engineering |

### Other Categories

| Category | Skills | Focus |
|----------|--------|-------|
| AI-ML Operations | 6 | MLOps, feature stores, model serving |
| ML Systems | 18 | Production ML from data to deployment |
| Microservices | 6 | Service mesh, API gateway, tracing |
| Event-Driven | 6 | Kafka, event sourcing, CQRS |
| Game Development | 5 | Unity, Godot, networking |
| Databases | 9 | PostgreSQL, MongoDB, Redis |
| Frontend | 7 | Tailwind, shadcn/ui, accessibility |
| DevOps | 9 | Docker, Kubernetes, GitHub Actions, DORA, Feature Flags |
| Testing | 10 | Comprehensive, chaos, mutation, security |
| Security | 4 | OWASP, OAuth, hardening |

---

## Modes (10)

Modes configure Claude's behavior for different contexts.

| Mode | Description |
|------|-------------|
| `default` | Balanced standard behavior |
| `tutor` | Teaching mode with Feynman technique & Socratic questions |
| `brainstorm` | Creative exploration, divergent thinking |
| `token-efficient` | Compressed output (30-70% savings) |
| `deep-research` | Thorough analysis with citations |
| `implementation` | Code-focused, minimal prose |
| `review` | Critical analysis mode |
| `orchestration` | Multi-task coordination |
| `omega` | 10x-1000x thinking mode |
| `autonomous` | AI team self-management |

Switch modes:
```bash
/context:mode <name>
```

---

## Autonomous Development (14 Archetypes)

Build complete applications from idea to deployment.

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
| **Microservices** | Distributed services with K8s |
| **Event-Driven** | Async systems with Kafka, CQRS |

### How It Works

1. **Discovery**: AI asks questions to understand your vision
2. **Planning**: Generates architecture, tasks, and timeline
3. **Execution**: Autonomous development with checkpoints
4. **Review**: Human approval at critical milestones
5. **Iteration**: Feedback loop for refinements

### Artifacts System

Provide project context with reference documents:

```
.omgkit/artifacts/
├── README.md   # How to use artifacts
├── data/       # Sample data, schemas, data dictionaries
├── docs/       # Requirements, user stories, PRDs
├── knowledge/  # Glossary, business rules, domain knowledge
├── research/   # Competitor analysis, market research
├── assets/     # Reference images, templates, mockups
└── examples/   # Code samples, reference implementations
```

**Note:** Artifacts are **reference materials only**, NOT execution instructions. They help AI understand your project context.

---

## Project Structure

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
│   ├── devlogs/         # Development logs (git-ignored)
│   │   └── README.md
│   ├── stdrules/        # Project standards
│   │   ├── README.md
│   │   ├── BEFORE_COMMIT.md
│   │   ├── SKILL_STANDARDS.md
│   │   └── TESTING_STANDARDS.md
│   └── artifacts/       # Project context (reference only)
│       └── README.md
├── OMEGA.md             # Project context file
└── CLAUDE.md            # Claude Code instructions
```

---

## MCP Integrations

OMGKIT supports these MCP servers:

| Server | Purpose |
|--------|---------|
| `context7` | Up-to-date library documentation |
| `sequential-thinking` | Multi-step reasoning |
| `memory` | Persistent knowledge graph |
| `filesystem` | Secure file operations |
| `playwright` | Browser automation |

---

## Standards & Rules

OMGKIT provides two types of standards:

### For OMGKIT Contributors

Located in `plugin/stdrules/`:

| File | Purpose |
|------|---------|
| `ALIGNMENT_PRINCIPLE.md` | Component hierarchy rules |
| `OMGKIT_BEFORE_COMMIT_RULES.md` | Validation requirements |
| `SKILL_STANDARDS.md` | Skill documentation standards |

### For Project Developers

Generated in `.omgkit/stdrules/` when you run `omgkit init`:

| File | Purpose |
|------|---------|
| `BEFORE_COMMIT.md` | Pre-commit checklist |
| `SKILL_STANDARDS.md` | Custom skill guidelines |

---

## CLI Commands

### Global Commands

```bash
omgkit install      # Install plugin to Claude Code
omgkit init         # Initialize .omgkit/ in project
omgkit doctor       # Check installation status
omgkit list         # List all components
omgkit update       # Update plugin
omgkit uninstall    # Remove plugin
omgkit help         # Show help
```

### Project Upgrade Commands (New)

Keep your project up-to-date with the latest OMGKIT features:

```bash
omgkit project:upgrade     # Upgrade project to latest OMGKIT version
omgkit project:upgrade --dry  # Preview changes without applying
omgkit project:rollback    # Rollback to previous backup
omgkit project:backups     # List available backups
omgkit project:version     # Show project's OMGKIT version
```

#### Safe Upgrade System

OMGKIT's upgrade system is designed with safety first:

| Feature | Description |
|---------|-------------|
| **Version Tracking** | Each project tracks its OMGKIT version in settings.json |
| **Smart Merge** | workflow.yaml uses add-only merge (never overwrites your values) |
| **Protected Files** | config.yaml, sprints/*, artifacts/*, devlogs/* are NEVER modified |
| **Auto-Backup** | Creates timestamped backup before any changes |
| **Dry Run** | Preview all changes with `--dry` flag before applying |
| **Rollback** | One command to restore previous state if needed |

#### What Gets Upgraded

| File Type | Upgrade Behavior |
|-----------|-----------------|
| **stdrules/** | New standards are added, modified ones offer 3-way merge |
| **workflow.yaml** | Smart merge adds new sections, preserves your customizations |
| **CLAUDE.md** | Updated with new instructions |
| **settings.json** | Version updated, structure preserved |
| **Your files** | NEVER touched (config.yaml, sprints, artifacts, devlogs) |

---

## Documentation Sync Automation

OMGKIT uses a **self-healing documentation system** that ensures docs are always synchronized with code:

### How It Works

1. **Code is Single Source of Truth**: All component metadata lives in plugin files
2. **Auto-Discovery**: Categories and counts are discovered dynamically, not hardcoded
3. **Auto-Generation**: mint.json navigation is generated from docs structure
4. **Validation Tests**: 23 tests verify docs-plugin sync before every release

### Documentation Commands

```bash
npm run docs:generate   # Generate docs from plugin source
npm run docs:mint       # Generate mint.json navigation
npm run docs:validate   # Run docs sync validation tests
npm run docs:sync       # Generate + validate (recommended)
```

### Pre-Release Protection

The `preversion` hook automatically runs `docs:sync` before version bumps:

```bash
npm version patch       # Runs docs:sync automatically
```

If any sync issue is detected (missing pages, wrong counts, broken links), the version bump fails.

---

## Validation & Testing

OMGKIT has 7300+ automated tests ensuring system integrity.

### Run Tests

```bash
npm test                           # All tests
npm test -- tests/validation/      # Validation tests only
npm test -- tests/unit/            # Unit tests only
npm run test:docs                  # Documentation sync tests
```

### Test Categories

| Category | Tests | Purpose |
|----------|-------|---------|
| Registry Sync | ~200 | Verify registry matches files |
| Alignment | ~400 | Component hierarchy validation |
| Documentation | ~500 | Quality and format checks |
| Docs Sync | 23 | Plugin-to-docs mapping validation |
| Format | ~300 | Naming convention compliance |
| Dependency Graph | ~600 | Reference integrity |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Start

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Make changes following `plugin/stdrules/`
5. Submit PR with conventional commit messages

---

## Documentation

Full documentation available at: [omgkit.mintlify.app](https://omgkit.mintlify.app)

---

## License

MIT - See [LICENSE](LICENSE) for details.

---

*Think Omega. Build Omega. Be Omega.*
