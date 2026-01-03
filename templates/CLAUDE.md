# CLAUDE.md - Project Instructions for Claude Code

## OMGKIT-Powered Project

This project uses **OMGKIT** - an AI Team System for Claude Code with 23 Agents, 58 Commands, 88 Skills, and 10 Modes.

## Project Structure

```
.omgkit/
├── config.yaml       # Project settings and AI model routing
├── sprints/          # Sprint management files
│   ├── vision.yaml   # Product vision and goals
│   └── backlog.yaml  # Product backlog items
├── stdrules/         # Standards and rules (MUST READ)
│   ├── TESTING_STANDARDS.md   # Testing methodology
│   └── BEFORE_COMMIT.md       # Pre-commit checklist
├── devlogs/          # Development logs (git-ignored)
└── settings.json     # Local settings
```

## MANDATORY: Read Before Tasks

| Task Type | Read First |
|-----------|------------|
| Writing Tests | `.omgkit/stdrules/TESTING_STANDARDS.md` |
| Before Commit | `.omgkit/stdrules/BEFORE_COMMIT.md` |
| New Feature | `.omgkit/config.yaml` for project settings |

## Development Workflow Rules

### `.omgkit/devlogs/` Folder
**IMPORTANT**: All development plans, ideas, upgrade plans, and internal notes MUST go in `.omgkit/devlogs/` folder:
- Implementation plans and upgrade plans
- Ideas and brainstorming notes
- Internal development logs
- Task breakdowns and analysis

This folder is git-ignored and should NEVER be committed to the repository.

### Documentation (`docs/`)
The `docs/` folder is for public documentation only:
- User-facing documentation
- API references
- Guides and tutorials

### Commit Standards
Use conventional commits with scope:
- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `docs(scope): description` - Documentation changes
- `refactor(scope): description` - Code refactoring
- `test(scope): description` - Test additions/changes
- `chore(scope): description` - Maintenance tasks

## OMGKIT Quick Reference

### Essential Commands
```bash
/sprint:vision-set     # Set product vision
/sprint:sprint-new     # Create a new sprint
/sprint:team-run       # Start the AI team
/dev:feature           # Implement a feature
/dev:fix               # Debug and fix issues
/git:commit            # Commit changes
/git:pr                # Create pull request
```

### Available Agents
- **planner** - Task decomposition and implementation planning
- **researcher** - Technology research and best practices
- **debugger** - Bug investigation and root cause analysis
- **tester** - Test creation and quality assurance
- **code-reviewer** - Code quality and security review
- **fullstack-developer** - Full implementation
- **git-manager** - Version control and PR automation

### Modes
Switch modes with `/context:mode <mode>`:
- `default` - Balanced assistance
- `omega` - Maximum AI capabilities
- `autonomous` - Minimal intervention
- `implementation` - Focused coding

## Quality Gates

Before completing any task:
- [ ] All tests pass
- [ ] No lint errors
- [ ] No security vulnerabilities
- [ ] Documentation updated if needed

---

*Think Omega. Build Omega. Be Omega.*
