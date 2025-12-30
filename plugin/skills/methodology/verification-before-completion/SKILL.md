---
name: verification-before-completion
description: Evidence-based verification with comprehensive checklists, quality gates, and proof-of-work validation
category: methodology
triggers:
  - verification
  - before completion
  - quality check
  - validation
  - done criteria
  - acceptance testing
  - sign off
---

# Verification Before Completion

Master **evidence-based verification** to ensure work meets quality standards before marking complete. This skill provides comprehensive checklists, automated validation, and proof-of-work documentation.

## Purpose

Ensure quality through systematic verification:

- Validate all acceptance criteria are met
- Prove functionality through evidence
- Catch issues before they reach production
- Document verification for audit trails
- Build confidence in releases
- Reduce rework and bug reports
- Enable faster code reviews

## Features

### 1. Verification Checklist Framework

```markdown
## Universal Verification Checklist

### Functional Verification
- [ ] **Acceptance criteria** - All criteria from ticket met
- [ ] **Happy path** - Primary use case works correctly
- [ ] **Edge cases** - Boundary conditions handled
- [ ] **Error handling** - Errors caught and displayed properly
- [ ] **Validation** - Input validation works as expected

### Technical Verification
- [ ] **Tests pass** - All unit, integration, and E2E tests green
- [ ] **Coverage** - Code coverage meets threshold (80%+)
- [ ] **Type safety** - No TypeScript/type errors
- [ ] **Lint clean** - No linting errors or warnings
- [ ] **Build succeeds** - Production build completes

### Security Verification
- [ ] **No secrets exposed** - No hardcoded credentials
- [ ] **Input sanitized** - User input properly escaped
- [ ] **Auth/authz** - Permissions checked correctly
- [ ] **HTTPS only** - No insecure connections
- [ ] **Dependency audit** - No critical vulnerabilities

### Performance Verification
- [ ] **Response time** - Within acceptable limits
- [ ] **No N+1 queries** - Database queries optimized
- [ ] **Memory usage** - No memory leaks detected
- [ ] **Bundle size** - No significant increase

### Documentation Verification
- [ ] **Code comments** - Complex logic explained
- [ ] **API docs** - Endpoints documented
- [ ] **README updated** - Setup instructions current
- [ ] **Changelog** - Changes documented

### Accessibility Verification
- [ ] **Keyboard navigation** - All actions keyboard accessible
- [ ] **Screen reader** - Labels and ARIA attributes correct
- [ ] **Color contrast** - Meets WCAG requirements
- [ ] **Focus indicators** - Visible focus states
```

### 2. Evidence Collection

```markdown
## Evidence Documentation Template

### Change Summary
**Ticket:** [TICKET-ID]
**Title:** [Brief description]
**Author:** [Name]
**Date:** [Date]

---

### Test Evidence

#### Unit Tests
```bash
$ npm test

 PASS  src/services/UserService.test.ts
 PASS  src/components/UserProfile.test.tsx

Test Suites: 15 passed, 15 total
Tests:       87 passed, 87 total
Snapshots:   5 passed, 5 total
Time:        12.45s

Coverage: 85.2% (target: 80%)
```

#### Integration Tests
```bash
$ npm run test:integration

 PASS  tests/api/users.test.ts
   ✓ GET /users returns user list (125ms)
   ✓ POST /users creates new user (89ms)
   ✓ PUT /users/:id updates user (76ms)
   ✓ DELETE /users/:id removes user (45ms)

All integration tests passed.
```

#### E2E Tests
```bash
$ npm run test:e2e

Running:  cypress/e2e/user-management.cy.ts

  User Management
    ✓ can create new user (3.2s)
    ✓ can update user profile (2.8s)
    ✓ can delete user (1.5s)

  3 passing (7.5s)
```

---

### Manual Verification

#### Happy Path
| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Navigate to /users | User list displayed | List shows 10 users | ✅ |
| 2 | Click "Add User" | Form appears | Modal opens | ✅ |
| 3 | Fill form and submit | User created | Success message shown | ✅ |
| 4 | Verify in list | New user appears | User at top of list | ✅ |

#### Edge Cases
| Case | Input | Expected | Actual | Status |
|------|-------|----------|--------|--------|
| Empty name | "" | Error: Name required | Error displayed | ✅ |
| Long name | 256 chars | Truncate or error | Error at 100 chars | ✅ |
| Duplicate email | existing@test.com | Error: Email taken | Error displayed | ✅ |
| Special chars | O'Brien | Accepted | Works correctly | ✅ |

#### Error Cases
| Case | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| Network failure | Disconnect network | Error message | "Connection lost" shown | ✅ |
| 500 error | Force server error | Graceful handling | Error boundary caught | ✅ |
| Timeout | Slow response | Loading indicator | Spinner + timeout msg | ✅ |

---

### Screenshots/Recordings

#### Feature Demo
![User Creation Flow](./evidence/user-creation.gif)

#### Mobile View
![Mobile Responsive](./evidence/mobile-view.png)

#### Error States
![Error Handling](./evidence/error-states.png)

---

### Build Verification

```bash
$ npm run build

> myapp@1.0.0 build
> next build

   Creating an optimized production build...
   Compiled successfully.

   Route (app)              Size     First Load JS
   ─ ○ /                    5.2 kB   89.5 kB
   ─ ○ /users               3.1 kB   87.4 kB
   ─ ○ /users/[id]          2.8 kB   87.1 kB

   ○  (Static)  prerendered as static content

Build completed successfully.
```

---

### Performance Metrics

| Metric | Baseline | Current | Change | Status |
|--------|----------|---------|--------|--------|
| Bundle size | 245 KB | 248 KB | +3 KB | ✅ |
| First paint | 1.2s | 1.1s | -100ms | ✅ |
| API response | 150ms | 145ms | -5ms | ✅ |
| Lighthouse | 92 | 94 | +2 | ✅ |

---

### Verification Sign-off
- [x] All tests pass
- [x] Manual testing complete
- [x] No regressions found
- [x] Ready for review

**Verified by:** [Name]
**Date:** [Date]
```

### 3. Automated Verification Pipeline

```typescript
// scripts/verify.ts
import { execSync } from 'child_process';
import chalk from 'chalk';

interface VerificationStep {
  name: string;
  command: string;
  required: boolean;
}

const verificationSteps: VerificationStep[] = [
  { name: 'TypeScript Check', command: 'npm run typecheck', required: true },
  { name: 'Lint Check', command: 'npm run lint', required: true },
  { name: 'Unit Tests', command: 'npm test', required: true },
  { name: 'Integration Tests', command: 'npm run test:integration', required: true },
  { name: 'Build', command: 'npm run build', required: true },
  { name: 'Bundle Analysis', command: 'npm run analyze', required: false },
  { name: 'Security Audit', command: 'npm audit --audit-level=high', required: true },
  { name: 'E2E Tests', command: 'npm run test:e2e', required: false },
];

async function runVerification(): Promise<void> {
  console.log(chalk.blue('\n🔍 Starting Verification Pipeline\n'));

  const results: { step: string; success: boolean; time: number }[] = [];
  let allPassed = true;

  for (const step of verificationSteps) {
    const startTime = Date.now();
    process.stdout.write(`  ${step.name}... `);

    try {
      execSync(step.command, { stdio: 'pipe' });
      const time = Date.now() - startTime;
      console.log(chalk.green(`✓ (${time}ms)`));
      results.push({ step: step.name, success: true, time });
    } catch (error) {
      const time = Date.now() - startTime;
      console.log(chalk.red(`✗ (${time}ms)`));
      results.push({ step: step.name, success: false, time });

      if (step.required) {
        allPassed = false;
        console.log(chalk.red(`\n  ❌ ${step.name} failed (required)`));
        console.log(chalk.gray(`  Run "${step.command}" for details\n`));
      } else {
        console.log(chalk.yellow(`  ⚠ ${step.name} failed (optional)`));
      }
    }
  }

  // Summary
  console.log(chalk.blue('\n📊 Verification Summary\n'));
  console.log('  Step                    Status    Time');
  console.log('  ' + '─'.repeat(45));

  for (const result of results) {
    const status = result.success ? chalk.green('PASS') : chalk.red('FAIL');
    const time = `${result.time}ms`.padStart(8);
    console.log(`  ${result.step.padEnd(24)} ${status}    ${time}`);
  }

  console.log('  ' + '─'.repeat(45));
  const totalTime = results.reduce((sum, r) => sum + r.time, 0);
  console.log(`  Total time: ${(totalTime / 1000).toFixed(2)}s\n`);

  if (allPassed) {
    console.log(chalk.green('✅ All required verifications passed!\n'));
    process.exit(0);
  } else {
    console.log(chalk.red('❌ Some required verifications failed.\n'));
    process.exit(1);
  }
}

runVerification();
```

### 4. Type-Specific Verification

```markdown
## Feature Verification Checklist

### UI Component
- [ ] Renders correctly in all supported browsers
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Empty states implemented
- [ ] Keyboard accessible
- [ ] Screen reader compatible
- [ ] Matches design specs
- [ ] Animations smooth (60fps)
- [ ] No console errors

### API Endpoint
- [ ] Returns correct status codes
- [ ] Response format matches schema
- [ ] Handles malformed requests
- [ ] Rate limiting works
- [ ] Authentication required
- [ ] Authorization enforced
- [ ] Input validated
- [ ] SQL injection protected
- [ ] Response time acceptable
- [ ] Documented in OpenAPI

### Database Migration
- [ ] Migration runs successfully
- [ ] Rollback works correctly
- [ ] No data loss
- [ ] Indexes added for queries
- [ ] Foreign keys correct
- [ ] Default values set
- [ ] Tested on production-like data
- [ ] Performance impact assessed

### Bug Fix
- [ ] Root cause identified
- [ ] Fix addresses root cause (not symptom)
- [ ] Regression test added
- [ ] Related code checked for similar issues
- [ ] No new bugs introduced
- [ ] Original reporter can verify
- [ ] Documentation updated if needed

### Performance Optimization
- [ ] Baseline metrics documented
- [ ] Improvement measured
- [ ] No regressions in other areas
- [ ] Works under load
- [ ] Memory usage stable
- [ ] CPU usage reasonable
- [ ] Tested with realistic data volume
```

### 5. Verification Workflows

```yaml
# .github/workflows/verify.yml
name: Verification Pipeline

on:
  pull_request:
    branches: [main, develop]

jobs:
  verify:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript Check
        run: npm run typecheck

      - name: Lint Check
        run: npm run lint

      - name: Unit Tests
        run: npm test -- --coverage

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          fail_ci_if_error: true
          minimum_coverage: 80

      - name: Build
        run: npm run build

      - name: Bundle Size Check
        uses: preactjs/compressed-size-action@v2
        with:
          pattern: '.next/**/*.js'
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Security Audit
        run: npm audit --audit-level=high

      - name: Integration Tests
        run: npm run test:integration

      - name: E2E Tests
        run: npm run test:e2e

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true

  verification-summary:
    needs: verify
    runs-on: ubuntu-latest
    if: always()

    steps:
      - name: Create Summary
        run: |
          echo "## Verification Results" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          if [ "${{ needs.verify.result }}" == "success" ]; then
            echo "✅ All verifications passed" >> $GITHUB_STEP_SUMMARY
          else
            echo "❌ Some verifications failed" >> $GITHUB_STEP_SUMMARY
          fi
```

### 6. Pre-Commit Verification

```typescript
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit verification..."

# Stage-only verification
npx lint-staged

# Quick verification
npm run typecheck
npm run test -- --bail --findRelatedTests $(git diff --cached --name-only)

echo "✅ Pre-commit verification passed"
```

```json
// lint-staged.config.js
module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit',
  ],
  '*.{css,scss}': [
    'stylelint --fix',
    'prettier --write',
  ],
  '*.{json,md}': [
    'prettier --write',
  ],
};
```

## Use Cases

### Pull Request Verification

```markdown
## PR Verification Report

### PR: #1234 - Add user profile editing

#### Automated Checks
| Check | Status | Details |
|-------|--------|---------|
| TypeScript | ✅ | No errors |
| ESLint | ✅ | No warnings |
| Unit Tests | ✅ | 45/45 passed |
| Coverage | ✅ | 87.3% (≥80%) |
| Build | ✅ | 45s |
| Bundle Size | ✅ | +2.1 KB |
| Security | ✅ | No vulnerabilities |
| E2E | ✅ | 12/12 passed |

#### Manual Verification
- [x] Tested profile edit flow
- [x] Tested validation errors
- [x] Tested mobile view
- [x] Tested with slow network
- [x] Tested accessibility

#### Screenshots
[Profile Edit Flow](./screenshots/profile-edit.png)
[Mobile View](./screenshots/mobile.png)

#### Verification Notes
- Tested in Chrome, Firefox, Safari
- Tested on iOS and Android
- No issues found

**Ready for review: YES**
```

## Best Practices

### Do's

- Run all tests before marking complete
- Document evidence of verification
- Test both happy and unhappy paths
- Verify on multiple browsers/devices
- Check performance impact
- Review your own code first
- Use automated verification where possible
- Include screenshots for UI changes
- Test with production-like data
- Verify accessibility requirements

### Don'ts

- Don't skip verification steps
- Don't mark complete without evidence
- Don't assume tests are enough
- Don't ignore edge cases
- Don't skip security checks
- Don't merge without green CI
- Don't forget mobile testing
- Don't ignore performance regressions
- Don't skip documentation updates
- Don't rush verification

## References

- [Definition of Done](https://www.agilealliance.org/glossary/definition-of-done/)
- [Testing Best Practices](https://testing-library.com/docs/)
- [CI/CD Best Practices](https://www.atlassian.com/continuous-delivery/principles)
- [Code Review Guidelines](https://google.github.io/eng-practices/review/)
