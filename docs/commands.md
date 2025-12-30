# OMGKIT Commands Reference

## Development Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/feature <desc>` | Full feature development | `/feature "add user auth"` |
| `/fix <error>` | Debug and fix bugs | `/fix "login not working"` |
| `/fix:fast <bug>` | Quick bug fix | `/fix:fast "typo in header"` |
| `/fix:hard <bug>` | Complex bug (deep analysis) | `/fix:hard "random crashes"` |
| `/fix:test` | Fix failing tests | `/fix:test` |
| `/fix:ci <url>` | Fix CI/CD pipeline | `/fix:ci "github.com/..."` |
| `/fix:logs` | Fix from error logs | `/fix:logs` |
| `/review [file]` | Code review | `/review src/auth.ts` |
| `/test <scope>` | Generate tests | `/test "user module"` |
| `/tdd <feature>` | Test-driven development | `/tdd "calculator"` |

## Planning Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/plan <task>` | Create implementation plan | `/plan "add search"` |
| `/plan:detailed <task>` | Detailed 2-5 min tasks | `/plan:detailed "auth"` |
| `/plan:parallel <task>` | Parallel execution plan | `/plan:parallel "refactor"` |
| `/brainstorm <topic>` | Creative exploration | `/brainstorm "UX improvements"` |
| `/execute-plan <file>` | Execute existing plan | `/execute-plan plans/auth.md` |
| `/research <topic>` | Research technology | `/research "best auth library"` |
| `/doc <target>` | Generate documentation | `/doc "API endpoints"` |
| `/ask <question>` | Quick question | `/ask "where is auth?"` |

## Git Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/commit [msg]` | Smart commit | `/commit` |
| `/ship [msg]` | Commit + PR | `/ship "add feature"` |
| `/pr [title]` | Create PR | `/pr "Add auth"` |
| `/deploy [env]` | Deploy | `/deploy staging` |
| `/cm` | Quick commit | `/cm` |
| `/cp` | Commit and push | `/cp` |

## Quality Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/security-scan` | Security audit | `/security-scan` |
| `/api-gen <resource>` | Generate API | `/api-gen users` |
| `/refactor <file>` | Improve code | `/refactor src/utils.ts` |
| `/optimize <file>` | Performance | `/optimize src/heavy.ts` |
| `/lint` | Run linting | `/lint` |

## Context Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/mode <name>` | Switch mode | `/mode omega` |
| `/index` | Index project | `/index` |
| `/load <component>` | Load context | `/load api` |
| `/checkpoint <action>` | Session state | `/checkpoint save` |
| `/spawn <task>` | Parallel task | `/spawn "research X"` |
| `/spawn:collect` | Collect results | `/spawn:collect` |

## Design Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/design:screenshot` | From screenshot | `/design:screenshot` |
| `/design:fast <desc>` | Quick UI | `/design:fast "login form"` |
| `/design:good <desc>` | Polished UI | `/design:good "dashboard"` |
| `/content:cro` | CRO optimization | `/content:cro landing` |
| `/content:enhance` | Enhance content | `/content:enhance about` |

## Omega Commands ⭐

| Command | Description | Usage |
|---------|-------------|-------|
| `/10x <topic>` | 10x improvement | `/10x "build speed"` |
| `/100x <topic>` | 100x paradigm shift | `/100x "deployment"` |
| `/1000x <topic>` | 1000x moonshot | `/1000x "testing"` |
| `/principles` | 7 Omega Principles | `/principles` |
| `/dimensions` | 10 Omega Dimensions | `/dimensions` |

## Sprint Commands ⭐

| Command | Description | Usage |
|---------|-------------|-------|
| `/init` | Initialize OMGKIT | `/init` |
| `/vision:set` | Set product vision | `/vision:set` |
| `/vision:show` | Show vision | `/vision:show` |
| `/sprint:new [name]` | Create sprint | `/sprint:new --propose` |
| `/sprint:start` | Start sprint | `/sprint:start` |
| `/sprint:current` | Sprint progress | `/sprint:current` |
| `/sprint:end` | End sprint | `/sprint:end` |
| `/backlog:add <task>` | Add to backlog | `/backlog:add "feature X"` |
| `/backlog:show` | Show backlog | `/backlog:show` |
| `/backlog:prioritize` | AI prioritization | `/backlog:prioritize` |
| `/team:run [--mode]` | Run AI team | `/team:run --mode semi-auto` |
| `/team:status` | Team status | `/team:status` |
| `/team:ask <question>` | Ask team | `/team:ask "how to..."` |
