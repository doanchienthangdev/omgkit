# 🔮 OMGKIT MASTER PLAN v3.0 - COMPLETE

> **Omega-Level Development Kit**
> ClaudeKit Full Features + Omega Enhancements + Sprint Management
> "Think Omega. Build Omega. Be Omega."

---

## 📋 MỤC LỤC

1. [Tổng Quan](#1-tổng-quan)
2. [Kiến Trúc NPM Package](#2-kiến-trúc-npm-package)
3. [AGENTS - Danh Sách Đầy Đủ (23 Agents)](#3-agents---danh-sách-đầy-đủ-23-agents)
4. [COMMANDS - Danh Sách Đầy Đủ (50+ Commands)](#4-commands---danh-sách-đầy-đủ-50-commands)
5. [SKILLS - Danh Sách Đầy Đủ (40+ Skills)](#5-skills---danh-sách-đầy-đủ-40-skills)
6. [MODES - Danh Sách Đầy Đủ (9 Modes)](#6-modes---danh-sách-đầy-đủ-9-modes)
7. [MCP Integrations](#7-mcp-integrations)
8. [Implementation Phases](#8-implementation-phases)
9. [File Structure Hoàn Chỉnh](#9-file-structure-hoàn-chỉnh)

---

## 1. TỔNG QUAN

### 1.1 Mục Tiêu

OMGKIT = **ClaudeKit Complete** + **Omega Enhancements** + **Sprint/Team Management**

| Component | ClaudeKit | OMGKIT |
|-----------|-----------|--------|
| Agents | 20 | **23** (+3 Omega) |
| Commands | 27+ | **50+** (+Sprint, +Omega) |
| Skills | 34+ | **40+** (+Omega skills) |
| Modes | 7 | **9** (+2 Omega) |
| Sprint Management | ❌ | ✅ |
| AI Team Autonomy | ❌ | ✅ |
| Omega Thinking | ❌ | ✅ |

### 1.2 User Flow

```bash
# 1. Install globally
npm install -g omgkit

# 2. Install Claude Code plugin
omgkit install

# 3. Initialize project
cd my-project
omgkit init

# 4. In Claude Code - all commands available
/help                    # See all 50+ commands
/vision:set              # Set product vision
/sprint:new --propose    # AI proposes tasks
/team:run                # AI team executes
/cook "add feature"      # Build features
```

### 1.3 Core Philosophy

```
OMGKIT = (ClaudeKit_Features × Omega_Philosophy) ^ AI_Team_Autonomy

7 Omega Principles:
Ω1. Leverage Multiplication - Build systems, not features
Ω2. Transcendent Abstraction - Solve classes, not instances
Ω3. Agentic Decomposition - Orchestrate specialists
Ω4. Feedback Acceleration - Compress loops
Ω5. Zero-Marginal-Cost Scaling - Build once, scale infinitely
Ω6. Emergent Intelligence - System > sum of parts
Ω7. Aesthetic Perfection - Excellence always
```

---

## 2. KIẾN TRÚC NPM PACKAGE

```
omgkit/
├── package.json
├── README.md
├── LICENSE
├── bin/
│   └── omgkit.js                    # CLI: install, init, doctor, update
├── lib/
│   ├── cli.js
│   ├── installer.js
│   └── initializer.js
├── plugin/                          # Claude Code Plugin
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/                    # 50+ commands
│   ├── agents/                      # 23 agents
│   ├── skills/                      # 40+ skills
│   ├── modes/                       # 9 modes
│   └── mcp/                         # MCP configurations
├── templates/
│   ├── config.yaml
│   ├── OMEGA.md
│   ├── vision.yaml
│   ├── backlog.yaml
│   └── settings.json
└── docs/
```

---

## 3. AGENTS - DANH SÁCH ĐẦY ĐỦ (23 Agents)

### 3.1 Core Development (6)

| Agent | Description | Tools |
|-------|-------------|-------|
| **planner** | Task decomposition, implementation planning | Read, Grep, Glob, Write, WebSearch |
| **researcher** | Technology research, best practices | Read, WebSearch, WebFetch |
| **debugger** | Error analysis, root cause finding | Read, Grep, Glob, Bash |
| **tester** | Test generation, coverage analysis | Read, Write, Bash, Glob |
| **code-reviewer** | Code review, security focus | Read, Grep, Glob |
| **scout** | Codebase exploration, file search | Read, Grep, Glob |

### 3.2 Operations (5)

| Agent | Description | Tools |
|-------|-------------|-------|
| **git-manager** | Git operations, PRs, commits | Bash, Read |
| **docs-manager** | Documentation generation | Read, Write, Glob |
| **project-manager** | Progress tracking, coordination | Read, Write |
| **database-admin** | Schema design, query optimization | Read, Write, Bash |
| **ui-ux-designer** | UI components, responsive design | Read, Write, Bash |

### 3.3 Extended (6)

| Agent | Description | Tools |
|-------|-------------|-------|
| **cicd-manager** | CI/CD pipeline management | Read, Write, Bash |
| **security-auditor** | Security reviews, audits | Read, Grep, Bash |
| **api-designer** | API design, OpenAPI specs | Read, Write |
| **vulnerability-scanner** | Security scanning | Read, Grep, Bash |
| **pipeline-architect** | Pipeline optimization | Read, Write, Bash |
| **fullstack-developer** | Full implementation | Read, Write, Edit, Bash, Glob |

### 3.4 Creative & Content (3)

| Agent | Description | Tools |
|-------|-------------|-------|
| **copywriter** | Marketing copy, content | Read, Write, WebSearch |
| **brainstormer** | Creative exploration | Read, WebSearch |
| **journal-writer** | Failure documentation | Read, Write |

### 3.5 Omega Exclusive (3) ⭐

| Agent | Description | Tools |
|-------|-------------|-------|
| **oracle** | Omega thinking, 7 modes, deep analysis | Read, Grep, Glob, WebSearch, WebFetch |
| **architect** | System design, leverage multiplication | Read, Write, Grep, Glob |
| **sprint-master** | Sprint management, team orchestration | Read, Write, Task |

---

## 4. COMMANDS - DANH SÁCH ĐẦY ĐỦ (50+ Commands)

### 4.1 Development Workflow (10)

| Command | Description | Workflow |
|---------|-------------|----------|
| `/feature <desc>` | Full feature development | planner → implement → reviewer → tester → git |
| `/fix <error>` | Debug and fix bugs | debugger → scout → implement → tester |
| `/fix:fast <error>` | Quick bug fix | debugger → implement |
| `/fix:hard <error>` | Complex bug (deep analysis) | oracle → debugger → implement → tester |
| `/fix:test` | Fix failing tests | tester → implement |
| `/fix:ci <url>` | Fix CI/CD pipeline | cicd-manager → implement |
| `/fix:logs` | Auto-fetch logs and fix | debugger → implement |
| `/review [file]` | Code review | code-reviewer |
| `/test <scope>` | Generate tests | tester |
| `/tdd <feature>` | Test-driven development | tester → implement → tester |

### 4.2 Planning & Research (8)

| Command | Description |
|---------|-------------|
| `/plan <task>` | Create implementation plan |
| `/plan:detailed <task>` | Detailed plan (2-5 min tasks) |
| `/plan:parallel <task>` | Parallel approach planning |
| `/brainstorm <topic>` | Interactive design session |
| `/execute-plan <file>` | Subagent-driven execution |
| `/research <topic>` | Research technology |
| `/doc <target>` | Generate documentation |
| `/ask <question>` | Quick question with context |

### 4.3 Git & Deployment (6)

| Command | Description |
|---------|-------------|
| `/commit [message]` | Smart commit |
| `/ship [message]` | Commit + PR |
| `/pr [title]` | Create pull request |
| `/deploy [env]` | Deploy to environment |
| `/git:cm` | Conventional commit |
| `/git:cp` | Commit and push |

### 4.4 Security & Quality (5)

| Command | Description |
|---------|-------------|
| `/security-scan` | Scan for vulnerabilities |
| `/api-gen <resource>` | Generate API code |
| `/refactor <file>` | Improve code structure |
| `/optimize <file>` | Performance optimization |
| `/lint` | Run linting |

### 4.5 Context & Session (6)

| Command | Description |
|---------|-------------|
| `/mode <name>` | Switch behavioral mode |
| `/index` | Generate project index |
| `/load <component>` | Load project context |
| `/checkpoint <action>` | Save/restore session |
| `/spawn <task>` | Launch parallel task |
| `/spawn:collect` | Aggregate parallel results |

### 4.6 Design & Content (5)

| Command | Description |
|---------|-------------|
| `/design:screenshot` | Implement from screenshot |
| `/design:fast <desc>` | Quick UI implementation |
| `/design:good <desc>` | High-quality UI |
| `/content:cro` | CRO-focused content |
| `/content:enhance` | Enhance content quality |

### 4.7 Omega Commands (5) ⭐ UNIQUE

| Command | Description |
|---------|-------------|
| `/10x <topic>` | Find 10x improvement path |
| `/100x <topic>` | Find 100x paradigm shift |
| `/1000x <topic>` | Find 1000x moonshot |
| `/principles` | Display 7 Omega Principles |
| `/dimensions` | Display 10 Omega Dimensions |

### 4.8 Sprint Commands (13) ⭐ UNIQUE

| Command | Description |
|---------|-------------|
| `/init` | Initialize .omgkit/ in project |
| `/vision:set` | Set product vision (interactive) |
| `/vision:show` | Display current vision |
| `/sprint:new [name]` | Create new sprint |
| `/sprint:new --propose` | AI proposes tasks |
| `/sprint:start` | Start current sprint |
| `/sprint:current` | Show sprint progress |
| `/sprint:end` | End sprint + retrospective |
| `/backlog:add <task>` | Add task to backlog |
| `/backlog:show` | Display backlog |
| `/backlog:prioritize` | AI prioritization |
| `/team:run [--mode]` | Run AI team |
| `/team:status` | Show team activity |
| `/team:ask <question>` | Ask team a question |

---

## 5. SKILLS - DANH SÁCH ĐẦY ĐỦ (40+ Skills)

### 5.1 Languages (3)

| Skill | Description |
|-------|-------------|
| **python** | Python best practices, type hints |
| **typescript** | TypeScript patterns, strict types |
| **javascript** | JavaScript ES6+, async patterns |

### 5.2 Frameworks (10)

| Skill | Description |
|-------|-------------|
| **fastapi** | FastAPI development |
| **django** | Django patterns |
| **nextjs** | Next.js App Router |
| **react** | React best practices |
| **vue** | Vue.js patterns |
| **express** | Express.js |
| **nestjs** | NestJS architecture |
| **rails** | Ruby on Rails |
| **spring** | Spring Boot |
| **laravel** | Laravel PHP |

### 5.3 Databases (4)

| Skill | Description |
|-------|-------------|
| **postgresql** | PostgreSQL optimization |
| **mongodb** | MongoDB patterns |
| **redis** | Redis caching |
| **prisma** | Prisma ORM |

### 5.4 Frontend (6)

| Skill | Description |
|-------|-------------|
| **tailwindcss** | Tailwind CSS |
| **shadcn-ui** | shadcn/ui components |
| **frontend-design** | Frontend patterns |
| **responsive** | Responsive design |
| **accessibility** | A11y best practices |
| **threejs** | Three.js 3D |

### 5.5 DevOps (4)

| Skill | Description |
|-------|-------------|
| **docker** | Docker containerization |
| **kubernetes** | K8s orchestration |
| **github-actions** | GitHub Actions CI/CD |
| **aws** | AWS services |

### 5.6 Security (3)

| Skill | Description |
|-------|-------------|
| **owasp** | OWASP best practices |
| **better-auth** | Better Auth integration |
| **oauth** | OAuth implementation |

### 5.7 Testing (3)

| Skill | Description |
|-------|-------------|
| **pytest** | Python testing |
| **vitest** | Vitest for JS/TS |
| **playwright** | E2E testing |

### 5.8 Methodology (14) - ClaudeKit Superpowers

| Skill | Description |
|-------|-------------|
| **brainstorming** | Creative exploration |
| **writing-plans** | Implementation planning |
| **executing-plans** | Plan execution |
| **test-driven-development** | TDD strict |
| **verification-before-completion** | Evidence-based |
| **testing-anti-patterns** | What to avoid |
| **systematic-debugging** | Debugging process |
| **root-cause-tracing** | Find root cause |
| **defense-in-depth** | Security layers |
| **dispatching-parallel-agents** | Parallel work |
| **requesting-code-review** | Review process |
| **receiving-code-review** | Handle feedback |
| **finishing-development-branch** | Complete work |
| **token-optimization** | Cost savings |

### 5.9 Omega Skills (5) ⭐ UNIQUE

| Skill | Description |
|-------|-------------|
| **omega-coding** | AI-first development patterns |
| **omega-thinking** | 7 thinking modes |
| **omega-testing** | Comprehensive testing |
| **omega-architecture** | System design patterns |
| **omega-sprint** | Sprint management |

---

## 6. MODES - DANH SÁCH ĐẦY ĐỦ (9 Modes)

### 6.1 ClaudeKit Modes (7)

| Mode | Description | Best For |
|------|-------------|----------|
| **default** | Balanced standard behavior | General tasks |
| **brainstorm** | Creative exploration, questions | Design, ideation |
| **token-efficient** | Compressed, concise output | Cost savings |
| **deep-research** | Thorough analysis, citations | Investigation |
| **implementation** | Code-focused, minimal prose | Executing plans |
| **review** | Critical analysis, finding issues | Code review |
| **orchestration** | Multi-task coordination | Parallel work |

### 6.2 Omega Modes (2) ⭐ UNIQUE

| Mode | Description | Best For |
|------|-------------|----------|
| **omega** | 10x-1000x thinking, 7 modes | Breakthrough solutions |
| **autonomous** | AI team self-management | Sprint execution |

---

## 7. MCP INTEGRATIONS

### 7.1 Supported MCP Servers

| Server | Package | Purpose |
|--------|---------|---------|
| **Context7** | `@upstash/context7-mcp` | Up-to-date library documentation |
| **Sequential** | `@modelcontextprotocol/server-sequential-thinking` | Multi-step reasoning |
| **Playwright** | `@playwright/mcp` | Browser automation |
| **Memory** | `@modelcontextprotocol/server-memory` | Persistent knowledge graph |
| **Filesystem** | `@modelcontextprotocol/server-filesystem` | Secure file operations |

### 7.2 MCP + Command Enhancement

| Command | MCP Servers | Enhancement |
|---------|-------------|-------------|
| `/feature` | Context7, Sequential, Filesystem | Accurate docs, structured planning |
| `/fix` | Sequential, Memory, Playwright | Step-by-step debugging |
| `/test` | Playwright, Filesystem | E2E browser tests |
| `/plan` | Sequential, Memory | Structured breakdown |
| `/research` | Context7, Sequential | Real-time docs |

---

## 8. IMPLEMENTATION PHASES

### Phase Overview

| Phase | Name | Content | Est. Time |
|-------|------|---------|-----------|
| **1** | Project Setup | package.json, CLI, structure | 1 session |
| **2** | Plugin Foundation | plugin.json, templates | 1 session |
| **3** | Agents Part 1 | 12 agents (Core + Operations) | 2 sessions |
| **4** | Agents Part 2 | 11 agents (Extended + Omega) | 2 sessions |
| **5** | Commands Part 1 | 18 commands (Dev + Planning) | 2 sessions |
| **6** | Commands Part 2 | 18 commands (Git + Quality + Context) | 2 sessions |
| **7** | Commands Part 3 | 18 commands (Omega + Sprint) | 2 sessions |
| **8** | Skills Part 1 | 17 skills (Languages + Frameworks) | 2 sessions |
| **9** | Skills Part 2 | 14 skills (Methodology) | 2 sessions |
| **10** | Skills Part 3 | 12 skills (DevOps + Omega) | 2 sessions |
| **11** | Modes | 9 modes | 1 session |
| **12** | MCP & Templates | MCP configs, templates | 1 session |
| **13** | CLI & Testing | CLI logic, testing | 2 sessions |
| **14** | Polish & Docs | Documentation, final polish | 2 sessions |

**Total: ~22 sessions**

---

## 9. FILE STRUCTURE HOÀN CHỈNH

```
omgkit/
├── package.json
├── README.md
├── LICENSE
├── CHANGELOG.md
├── bin/
│   └── omgkit.js
├── lib/
│   ├── cli.js
│   ├── installer.js
│   ├── initializer.js
│   └── utils.js
├── plugin/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/
│   │   ├── dev/
│   │   │   ├── feature.md
│   │   │   ├── fix.md
│   │   │   ├── fix-fast.md
│   │   │   ├── fix-hard.md
│   │   │   ├── fix-test.md
│   │   │   ├── fix-ci.md
│   │   │   ├── fix-logs.md
│   │   │   ├── review.md
│   │   │   ├── test.md
│   │   │   └── tdd.md
│   │   ├── planning/
│   │   │   ├── plan.md
│   │   │   ├── plan-detailed.md
│   │   │   ├── plan-parallel.md
│   │   │   ├── brainstorm.md
│   │   │   ├── execute-plan.md
│   │   │   ├── research.md
│   │   │   ├── doc.md
│   │   │   └── ask.md
│   │   ├── git/
│   │   │   ├── commit.md
│   │   │   ├── ship.md
│   │   │   ├── pr.md
│   │   │   ├── deploy.md
│   │   │   ├── cm.md
│   │   │   └── cp.md
│   │   ├── quality/
│   │   │   ├── security-scan.md
│   │   │   ├── api-gen.md
│   │   │   ├── refactor.md
│   │   │   ├── optimize.md
│   │   │   └── lint.md
│   │   ├── context/
│   │   │   ├── mode.md
│   │   │   ├── index.md
│   │   │   ├── load.md
│   │   │   ├── checkpoint.md
│   │   │   ├── spawn.md
│   │   │   └── spawn-collect.md
│   │   ├── design/
│   │   │   ├── screenshot.md
│   │   │   ├── fast.md
│   │   │   ├── good.md
│   │   │   ├── cro.md
│   │   │   └── enhance.md
│   │   ├── omega/
│   │   │   ├── 10x.md
│   │   │   ├── 100x.md
│   │   │   ├── 1000x.md
│   │   │   ├── principles.md
│   │   │   └── dimensions.md
│   │   └── sprint/
│   │       ├── init.md
│   │       ├── vision-set.md
│   │       ├── vision-show.md
│   │       ├── sprint-new.md
│   │       ├── sprint-start.md
│   │       ├── sprint-current.md
│   │       ├── sprint-end.md
│   │       ├── backlog-add.md
│   │       ├── backlog-show.md
│   │       ├── backlog-prioritize.md
│   │       ├── team-run.md
│   │       ├── team-status.md
│   │       └── team-ask.md
│   ├── agents/
│   │   ├── planner.md
│   │   ├── researcher.md
│   │   ├── debugger.md
│   │   ├── tester.md
│   │   ├── code-reviewer.md
│   │   ├── scout.md
│   │   ├── git-manager.md
│   │   ├── docs-manager.md
│   │   ├── project-manager.md
│   │   ├── database-admin.md
│   │   ├── ui-ux-designer.md
│   │   ├── cicd-manager.md
│   │   ├── security-auditor.md
│   │   ├── api-designer.md
│   │   ├── vulnerability-scanner.md
│   │   ├── pipeline-architect.md
│   │   ├── fullstack-developer.md
│   │   ├── copywriter.md
│   │   ├── brainstormer.md
│   │   ├── journal-writer.md
│   │   ├── oracle.md              # Omega
│   │   ├── architect.md           # Omega
│   │   └── sprint-master.md       # Omega
│   ├── skills/
│   │   ├── languages/
│   │   │   ├── python/SKILL.md
│   │   │   ├── typescript/SKILL.md
│   │   │   └── javascript/SKILL.md
│   │   ├── frameworks/
│   │   │   ├── fastapi/SKILL.md
│   │   │   ├── django/SKILL.md
│   │   │   ├── nextjs/SKILL.md
│   │   │   ├── react/SKILL.md
│   │   │   ├── vue/SKILL.md
│   │   │   ├── express/SKILL.md
│   │   │   ├── nestjs/SKILL.md
│   │   │   ├── rails/SKILL.md
│   │   │   ├── spring/SKILL.md
│   │   │   └── laravel/SKILL.md
│   │   ├── databases/
│   │   │   ├── postgresql/SKILL.md
│   │   │   ├── mongodb/SKILL.md
│   │   │   ├── redis/SKILL.md
│   │   │   └── prisma/SKILL.md
│   │   ├── frontend/
│   │   │   ├── tailwindcss/SKILL.md
│   │   │   ├── shadcn-ui/SKILL.md
│   │   │   ├── frontend-design/SKILL.md
│   │   │   ├── responsive/SKILL.md
│   │   │   ├── accessibility/SKILL.md
│   │   │   └── threejs/SKILL.md
│   │   ├── devops/
│   │   │   ├── docker/SKILL.md
│   │   │   ├── kubernetes/SKILL.md
│   │   │   ├── github-actions/SKILL.md
│   │   │   └── aws/SKILL.md
│   │   ├── security/
│   │   │   ├── owasp/SKILL.md
│   │   │   ├── better-auth/SKILL.md
│   │   │   └── oauth/SKILL.md
│   │   ├── testing/
│   │   │   ├── pytest/SKILL.md
│   │   │   ├── vitest/SKILL.md
│   │   │   └── playwright/SKILL.md
│   │   ├── methodology/
│   │   │   ├── brainstorming/SKILL.md
│   │   │   ├── writing-plans/SKILL.md
│   │   │   ├── executing-plans/SKILL.md
│   │   │   ├── test-driven-development/SKILL.md
│   │   │   ├── verification-before-completion/SKILL.md
│   │   │   ├── testing-anti-patterns/SKILL.md
│   │   │   ├── systematic-debugging/SKILL.md
│   │   │   ├── root-cause-tracing/SKILL.md
│   │   │   ├── defense-in-depth/SKILL.md
│   │   │   ├── dispatching-parallel-agents/SKILL.md
│   │   │   ├── requesting-code-review/SKILL.md
│   │   │   ├── receiving-code-review/SKILL.md
│   │   │   ├── finishing-development-branch/SKILL.md
│   │   │   └── token-optimization/SKILL.md
│   │   └── omega/
│   │       ├── omega-coding/SKILL.md
│   │       ├── omega-thinking/SKILL.md
│   │       ├── omega-testing/SKILL.md
│   │       ├── omega-architecture/SKILL.md
│   │       └── omega-sprint/SKILL.md
│   ├── modes/
│   │   ├── default.md
│   │   ├── brainstorm.md
│   │   ├── token-efficient.md
│   │   ├── deep-research.md
│   │   ├── implementation.md
│   │   ├── review.md
│   │   ├── orchestration.md
│   │   ├── omega.md
│   │   └── autonomous.md
│   └── mcp/
│       ├── README.md
│       └── .mcp.json
├── templates/
│   ├── config.yaml
│   ├── OMEGA.md
│   ├── vision.yaml
│   ├── backlog.yaml
│   └── settings.json
└── docs/
    ├── README.md
    ├── commands.md
    ├── agents.md
    ├── skills.md
    └── sprint.md
```

---

## 📊 SUMMARY

### Component Count

| Category | Count |
|----------|-------|
| **Agents** | 23 |
| **Commands** | 54 |
| **Skills** | 43 |
| **Modes** | 9 |
| **MCP Servers** | 5 |
| **Templates** | 5 |

### Unique OMGKIT Features (vs ClaudeKit)

| Feature | Description |
|---------|-------------|
| **Sprint Management** | /vision, /sprint, /backlog, /team |
| **AI Team Autonomy** | /team:run with full-auto, semi-auto, manual modes |
| **Omega Thinking** | /10x, /100x, /1000x, 7 thinking modes |
| **Oracle Agent** | Deep analysis with Omega philosophy |
| **Architect Agent** | System design with leverage multiplication |
| **Sprint Master** | Team orchestration and coordination |
| **Omega Mode** | 10x-1000x thinking mode |
| **Autonomous Mode** | AI team self-management |
| **5 Omega Skills** | omega-coding, omega-thinking, etc. |

---

*Think Omega. Build Omega. Be Omega.* 🔮
