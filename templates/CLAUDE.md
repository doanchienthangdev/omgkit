# CLAUDE.md - Project Instructions for Claude Code

## OMGKIT-Powered Project

This project uses **OMGKIT** - an AI Team System for Claude Code with 41 Agents, 151 Commands, 151 Skills, and 10 Modes.

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
├── artifacts/        # Project context documents (reference only)
│   └── README.md     # How to use artifacts
├── devlogs/          # Development logs (git-ignored)
└── settings.json     # Local settings
```

## MANDATORY: Read Before Tasks

| Task Type | Read First | Also Consider |
|-----------|------------|---------------|
| Writing Tests | `.omgkit/stdrules/TESTING_STANDARDS.md` | Spawn `tester` agent for complex tests |
| Before Commit | `.omgkit/stdrules/BEFORE_COMMIT.md` | Run `/quality:test-omega` |
| New Feature | `.omgkit/config.yaml` | Use `/dev:tdd` for TDD approach |
| Security Testing | `.omgkit/stdrules/TESTING_STANDARDS.md` | Run `/quality:test-security` |

## Development Workflow Rules

### `.omgkit/devlogs/` Folder
**IMPORTANT**: All development plans, ideas, upgrade plans, and internal notes MUST go in `.omgkit/devlogs/` folder:
- Implementation plans and upgrade plans
- Ideas and brainstorming notes
- Internal development logs
- Task breakdowns and analysis

This folder is git-ignored and should NEVER be committed to the repository.

### `.omgkit/artifacts/` Folder
**REFERENCE CONTEXT**: This folder contains project initialization documents that provide context for development:
- Brainstorming notes and initial plans
- Project specs and requirements
- Research documents and analysis
- Sample data and schemas

These are **reference materials only**, NOT execution instructions. Read them to understand project context.

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

## AUTOMATIC RULES: Testing (Always Apply)

### Quick Reference - Testing Commands
When user asks about testing, suggest these commands:
- `/dev:test-write <function>` - Write comprehensive tests (RECOMMENDED)
- `/dev:tdd <feature>` - Test-driven development
- `/quality:test-omega` - Run full 4D testing suite
- `/quality:test-property` - Property-based testing
- `/quality:test-security` - Security testing
- `/quality:test-mutate` - Mutation testing

### Agent & Workflow
For complex testing tasks, spawn the `tester` agent or run workflow:
- Agent: `tester` - Comprehensive testing specialist
- Workflow: `testing/comprehensive-testing`

When writing ANY test, Claude MUST automatically apply these rules:

### 1. Minimum Test Coverage (MANDATORY)
Every function/component MUST have tests for:
- ✅ Happy path (normal input)
- ✅ Empty/null/undefined inputs
- ✅ Boundary values (0, -1, MAX_INT, empty string, etc.)
- ✅ Error cases (invalid input → throw/return error)
- ✅ Security inputs (if user-facing): `"'; DROP TABLE; --"`, `"<script>alert('xss')</script>"`

### 2. Test Template (ALWAYS USE)
```javascript
describe('functionName', () => {
  // 1. Happy path
  it('should handle normal input', () => {});

  // 2. Edge cases (NEVER SKIP)
  it('should handle empty input', () => {});
  it('should handle null/undefined', () => {});
  it('should handle boundary values', () => {});

  // 3. Error handling
  it('should throw/return error for invalid input', () => {});

  // 4. Security (if user input)
  it('should sanitize malicious input', () => {});
});
```

### 3. Boundary Values Reference
```javascript
// Always test these values
const BOUNDARIES = {
  numbers: [0, -0, 1, -1, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, NaN, Infinity],
  strings: ['', ' ', 'a'.repeat(10000), '\n\t\r', '🔮💀', '\x00'],
  arrays: [[], [null], [undefined], new Array(10000).fill(0)]
};
```

### 4. Security Test Inputs
```javascript
// ALWAYS test with these if function handles user input
const MALICIOUS = [
  "'; DROP TABLE users; --",
  "<script>alert('xss')</script>",
  "../../../etc/passwd",
  "{{constructor.constructor('return this')()}}"
];
```

### 5. F.I.R.S.T Principles
- **Fast**: Unit < 1ms, Integration < 100ms
- **Independent**: No shared state between tests
- **Repeatable**: No random, no time-dependent
- **Self-Validating**: Explicit assertions
- **Timely**: Write with code

> **Full documentation**: `.omgkit/stdrules/TESTING_STANDARDS.md`

---

*Think Omega. Build Omega. Be Omega.*
