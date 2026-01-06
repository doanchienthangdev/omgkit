---
name: Coverage Check
description: Check test coverage against configured gates and report uncovered code. Integrates with workflow config coverage requirements.
category: quality
related_skills:
  - methodology/test-enforcement
  - testing/comprehensive-testing
  - devops/workflow-config
related_commands:
  - /quality:verify-done
  - /dev:test
  - /quality:test-plan
allowed-tools: Read, Bash, Grep, Glob
---

# /quality:coverage-check

Check test coverage against configured gates and identify uncovered code.

## Usage

```bash
/quality:coverage-check
/quality:coverage-check --type unit
/quality:coverage-check --file src/handlers/user.ts
/quality:coverage-check --threshold 90
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--type` | Test type (unit, integration, e2e) | all |
| `--file` | Check specific file | all files |
| `--threshold` | Override minimum threshold | from config |
| `--report` | Output format (text, json, html) | text |
| `--fail-under` | Exit with error if below | minimum |

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    COVERAGE REPORT                            ║
╚══════════════════════════════════════════════════════════════╝

Overall Coverage: 85% ████████░░

┌─────────────────────────────────────────────────────────────┐
│ Coverage by Type                                             │
├─────────────────────────────────────────────────────────────┤
│ Lines:     85% ████████░░ (target: 90%) ⚠️                   │
│ Branches:  78% ████████░░ (target: 80%) ⚠️                   │
│ Functions: 92% █████████░ (target: 90%) ✅                   │
│ Statements: 84% ████████░░ (target: 85%) ⚠️                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Coverage by File                                             │
├─────────────────────────────────────────────────────────────┤
│ File                          Lines   Branches  Functions   │
│ ─────────────────────────────────────────────────────────── │
│ src/handlers/user.ts          92%     85%       100%   ✅   │
│ src/handlers/auth.ts          88%     80%       95%    ✅   │
│ src/services/email.ts         65%     55%       70%    ❌   │
│ src/utils/validation.ts       78%     70%       85%    ⚠️   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Uncovered Lines                                              │
├─────────────────────────────────────────────────────────────┤
│ src/services/email.ts                                        │
│   Lines 45-52: sendVerificationEmail error handling         │
│   Lines 78-85: retryWithBackoff logic                       │
│                                                              │
│ src/utils/validation.ts                                      │
│   Lines 23-25: edge case for special characters             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Coverage Gates                                               │
├─────────────────────────────────────────────────────────────┤
│ Gate              Current   Minimum   Target   Status       │
│ ─────────────────────────────────────────────────────────── │
│ Unit Coverage     85%       80%       90%      ✅ Pass      │
│ Integration       72%       60%       75%      ✅ Pass      │
│ Branch Coverage   78%       70%       80%      ✅ Pass      │
│ Overall           82%       75%       85%      ✅ Pass      │
└─────────────────────────────────────────────────────────────┘

Summary: ✅ All coverage gates passed
         ⚠️  3 files below target coverage

Recommendation: Add tests for email.ts error handling
```

## Coverage Gates Configuration

From `.omgkit/workflow.yaml`:

```yaml
testing:
  coverage_gates:
    unit:
      minimum: 80      # Block if below
      target: 90       # Goal to achieve
      excellent: 95    # Exceptional
    integration:
      minimum: 60
      target: 75
    branch:
      minimum: 70
      target: 80
    overall:
      minimum: 75
      target: 85
```

## Framework Detection

Automatically detects and runs appropriate coverage tool:

| Framework | Coverage Tool | Config File |
|-----------|--------------|-------------|
| Vitest | c8/v8 | vitest.config.ts |
| Jest | jest --coverage | jest.config.js |
| Pytest | pytest-cov | pytest.ini |
| Go | go test -cover | go.mod |

## Integration

### Pre-push Hook
```bash
# .git/hooks/pre-push
/quality:coverage-check --fail-under 80
```

### CI Pipeline
```yaml
- name: Check Coverage
  run: |
    npm run test:coverage
    /quality:coverage-check --report json > coverage-report.json
```

## Examples

### Check overall coverage
```bash
/quality:coverage-check
```

### Check specific file
```bash
/quality:coverage-check --file src/handlers/user.ts
```

### Enforce strict threshold
```bash
/quality:coverage-check --threshold 90 --fail-under 90
```

### Generate JSON report
```bash
/quality:coverage-check --report json > coverage.json
```
