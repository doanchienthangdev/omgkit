---
name: finishing-development-branch
description: Complete checklist and best practices for finishing development work and preparing for merge
category: methodology
triggers:
  - finish branch
  - complete feature
  - ready for merge
  - wrap up development
  - finalize PR
  - branch completion
  - pre-merge checklist
---

# Finishing Development Branch

Complete your development branch professionally with a **comprehensive checklist** ensuring all quality gates pass and the code is ready for merge. This skill provides frameworks for wrapping up feature work systematically.

## Purpose

Ship high-quality, merge-ready code:

- Ensure all acceptance criteria are met
- Verify code quality and test coverage
- Clean up technical debt and TODOs
- Prepare clean commit history
- Create comprehensive PR documentation
- Enable smooth code review process
- Reduce merge conflicts and issues

## Features

### 1. The Completion Checklist

```markdown
## Development Branch Completion Checklist

┌─────────────────────────────────────────────────────────────────────────┐
│                      BRANCH COMPLETION CHECKLIST                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PHASE 1: CODE COMPLETE                                                 │
│  ══════════════════════                                                 │
│  □ All acceptance criteria implemented                                  │
│  □ Edge cases handled                                                   │
│  □ Error handling complete                                              │
│  □ No TODO/FIXME comments left unaddressed                             │
│  □ Debug code removed                                                   │
│                                                                         │
│  PHASE 2: QUALITY ASSURANCE                                             │
│  ═══════════════════════════                                            │
│  □ All tests passing                                                    │
│  □ New tests written for new code                                       │
│  □ Test coverage meets threshold                                        │
│  □ Lint/format checks passing                                           │
│  □ Type checking passing                                                │
│  □ Security scan passing                                                │
│                                                                         │
│  PHASE 3: DOCUMENTATION                                                 │
│  ═══════════════════════                                                │
│  □ README updated if needed                                             │
│  □ API documentation updated                                            │
│  □ Inline comments for complex logic                                    │
│  □ CHANGELOG entry if required                                          │
│                                                                         │
│  PHASE 4: GIT HYGIENE                                                   │
│  ═════════════════════                                                  │
│  □ Branch rebased on latest main                                        │
│  □ Commit history is clean and logical                                  │
│  □ Commit messages follow conventions                                   │
│  □ No merge conflicts                                                   │
│  □ Branch pushed to remote                                              │
│                                                                         │
│  PHASE 5: PR READY                                                      │
│  ══════════════════                                                     │
│  □ PR description is complete                                           │
│  □ Screenshots/recordings if UI changes                                 │
│  □ Breaking changes documented                                          │
│  □ Reviewers assigned                                                   │
│  □ Labels applied                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Code Completeness Verification

```typescript
/**
 * Verify all code-related requirements are met
 */

interface CodeCompletenessCheck {
  category: string;
  checks: Check[];
}

const codeCompletenessChecks: CodeCompletenessCheck[] = [
  {
    category: 'Acceptance Criteria',
    checks: [
      { name: 'All user stories implemented', automated: false },
      { name: 'All requirements from ticket addressed', automated: false },
      { name: 'Feature works as specified', automated: false }
    ]
  },
  {
    category: 'Edge Cases',
    checks: [
      { name: 'Empty/null input handled', automated: true },
      { name: 'Boundary conditions covered', automated: true },
      { name: 'Error states handled gracefully', automated: true },
      { name: 'Concurrent access considered', automated: false }
    ]
  },
  {
    category: 'Code Cleanup',
    checks: [
      { name: 'No console.log statements', automated: true },
      { name: 'No debugger statements', automated: true },
      { name: 'No commented-out code', automated: true },
      { name: 'No hardcoded secrets', automated: true }
    ]
  }
];

// Automated checks implementation
async function runCodeCleanupChecks(files: string[]): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check for debug statements
  const debugPatterns = [
    { pattern: /console\.(log|debug|info)\(/g, message: 'Console statement found' },
    { pattern: /debugger;/g, message: 'Debugger statement found' },
    { pattern: /\/\/.*TODO/gi, message: 'TODO comment found' },
    { pattern: /\/\/.*FIXME/gi, message: 'FIXME comment found' },
    { pattern: /\/\*[\s\S]*?\*\/|\/\/.*/g, message: 'Commented code block' }
  ];

  for (const file of files) {
    const content = await readFile(file);

    for (const { pattern, message } of debugPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        results.push({
          file,
          status: 'warning',
          message: `${message}: ${matches.length} occurrences`
        });
      }
    }
  }

  return results;
}

// TODO scanner
async function scanForTODOs(directory: string): Promise<TODO[]> {
  const todos: TODO[] = [];

  const files = await glob('**/*.{ts,tsx,js,jsx}', { cwd: directory });

  for (const file of files) {
    const content = await readFile(path.join(directory, file));
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const todoMatch = line.match(/\/\/\s*(TODO|FIXME|HACK|XXX):?\s*(.*)/i);
      if (todoMatch) {
        todos.push({
          file,
          line: index + 1,
          type: todoMatch[1].toUpperCase(),
          message: todoMatch[2].trim(),
          priority: determinePriority(todoMatch[1])
        });
      }
    });
  }

  return todos;
}
```

### 3. Quality Assurance Verification

```typescript
/**
 * Run all quality assurance checks
 */

interface QACheckResult {
  category: string;
  passed: boolean;
  details: string;
  fixCommand?: string;
}

async function runQualityChecks(): Promise<QACheckResult[]> {
  const results: QACheckResult[] = [];

  // 1. Test execution
  const testResult = await runCommand('npm test');
  results.push({
    category: 'Tests',
    passed: testResult.exitCode === 0,
    details: testResult.passed
      ? 'All tests passing'
      : `${testResult.failures} test(s) failing`,
    fixCommand: 'npm test -- --watch'
  });

  // 2. Test coverage
  const coverageResult = await runCommand('npm run test:coverage');
  const coverage = parseCoverageOutput(coverageResult.stdout);
  results.push({
    category: 'Coverage',
    passed: coverage.total >= 80,
    details: `Coverage: ${coverage.total}% (threshold: 80%)`,
    fixCommand: 'npm run test:coverage -- --verbose'
  });

  // 3. Linting
  const lintResult = await runCommand('npm run lint');
  results.push({
    category: 'Linting',
    passed: lintResult.exitCode === 0,
    details: lintResult.passed
      ? 'No lint errors'
      : `${lintResult.errors} error(s) found`,
    fixCommand: 'npm run lint -- --fix'
  });

  // 4. Type checking
  const typeResult = await runCommand('npm run type-check');
  results.push({
    category: 'Type Check',
    passed: typeResult.exitCode === 0,
    details: typeResult.passed
      ? 'No type errors'
      : `${typeResult.errors} type error(s)`,
    fixCommand: 'npm run type-check'
  });

  // 5. Build
  const buildResult = await runCommand('npm run build');
  results.push({
    category: 'Build',
    passed: buildResult.exitCode === 0,
    details: buildResult.passed
      ? 'Build successful'
      : 'Build failed',
    fixCommand: 'npm run build'
  });

  // 6. Security scan
  const securityResult = await runCommand('npm audit');
  results.push({
    category: 'Security',
    passed: !securityResult.stdout.includes('high') &&
            !securityResult.stdout.includes('critical'),
    details: securityResult.passed
      ? 'No high/critical vulnerabilities'
      : 'Security vulnerabilities found',
    fixCommand: 'npm audit fix'
  });

  return results;
}

// Generate QA report
function generateQAReport(results: QACheckResult[]): string {
  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);

  let report = `## Quality Assurance Report\n\n`;

  if (failed.length === 0) {
    report += `✅ All ${results.length} checks passed!\n\n`;
  } else {
    report += `❌ ${failed.length}/${results.length} checks failed\n\n`;
  }

  report += `### Results\n\n`;
  for (const result of results) {
    const icon = result.passed ? '✅' : '❌';
    report += `${icon} **${result.category}**: ${result.details}\n`;
    if (!result.passed && result.fixCommand) {
      report += `   Fix: \`${result.fixCommand}\`\n`;
    }
  }

  return report;
}
```

### 4. Git Hygiene

```typescript
/**
 * Clean up git history and prepare for merge
 */

interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  conflicts: string[];
  uncommitted: string[];
}

async function prepareGitForMerge(): Promise<GitPrepResult> {
  const results: string[] = [];

  // 1. Fetch latest from remote
  await runCommand('git fetch origin main');
  results.push('Fetched latest from origin/main');

  // 2. Check current branch status
  const status = await getGitStatus();

  // 3. Rebase if behind main
  if (status.behind > 0) {
    await runCommand('git rebase origin/main');
    results.push(`Rebased on origin/main (was ${status.behind} commits behind)`);
  }

  // 4. Check for conflicts
  const conflicts = await checkMergeConflicts();
  if (conflicts.length > 0) {
    return {
      success: false,
      results,
      error: `Merge conflicts in: ${conflicts.join(', ')}`
    };
  }

  // 5. Push to remote
  await runCommand(`git push origin ${status.branch} --force-with-lease`);
  results.push('Pushed to remote');

  return { success: true, results };
}

// Clean commit history
async function cleanCommitHistory(): Promise<void> {
  // Get commits since branching from main
  const commits = await getCommitsSinceMain();

  console.log(`\nCommit History (${commits.length} commits):`);
  commits.forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.hash.slice(0, 7)} - ${c.message}`);
  });

  // Check for commits that should be squashed
  const fixupCandidates = commits.filter(c =>
    c.message.toLowerCase().includes('fix') ||
    c.message.toLowerCase().includes('wip') ||
    c.message.toLowerCase().includes('temp')
  );

  if (fixupCandidates.length > 0) {
    console.log('\n⚠️  Consider squashing these commits:');
    fixupCandidates.forEach(c => {
      console.log(`  - ${c.hash.slice(0, 7)}: ${c.message}`);
    });
    console.log('\nRun: git rebase -i HEAD~' + commits.length);
  }
}

// Conventional commit validation
function validateCommitMessages(commits: Commit[]): ValidationResult[] {
  const conventionalPattern = /^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .{1,72}/;

  return commits.map(commit => ({
    commit: commit.hash,
    message: commit.message,
    valid: conventionalPattern.test(commit.message),
    suggestion: !conventionalPattern.test(commit.message)
      ? 'Use conventional commits: type(scope): message'
      : undefined
  }));
}
```

### 5. PR Preparation

```typescript
/**
 * Prepare comprehensive PR documentation
 */

interface PRContext {
  branch: string;
  baseBranch: string;
  commits: Commit[];
  changedFiles: ChangedFile[];
  ticket?: string;
}

async function generatePRDescription(context: PRContext): Promise<string> {
  const { commits, changedFiles, ticket } = context;

  // Analyze changes
  const changeAnalysis = analyzeChanges(changedFiles);

  // Generate description
  let description = `## Summary\n\n`;

  // Link to ticket if available
  if (ticket) {
    description += `Closes ${ticket}\n\n`;
  }

  // What changed
  description += `## Changes\n\n`;
  for (const commit of commits) {
    description += `- ${commit.message}\n`;
  }

  // Files changed summary
  description += `\n## Files Changed\n\n`;
  description += `- **Added:** ${changeAnalysis.added} files\n`;
  description += `- **Modified:** ${changeAnalysis.modified} files\n`;
  description += `- **Deleted:** ${changeAnalysis.deleted} files\n`;

  // Testing section
  description += `\n## Testing\n\n`;
  description += `- [x] Unit tests added/updated\n`;
  description += `- [x] Integration tests pass\n`;
  description += `- [ ] Manual testing completed\n`;

  // Screenshots placeholder for UI changes
  if (changeAnalysis.hasUIChanges) {
    description += `\n## Screenshots\n\n`;
    description += `<!-- Add screenshots of UI changes -->\n`;
  }

  // Breaking changes
  if (changeAnalysis.hasBreakingChanges) {
    description += `\n## ⚠️ Breaking Changes\n\n`;
    description += `<!-- Document any breaking changes -->\n`;
  }

  // Checklist
  description += `\n## Checklist\n\n`;
  description += `- [x] Code follows style guidelines\n`;
  description += `- [x] Self-review completed\n`;
  description += `- [x] Tests added for new functionality\n`;
  description += `- [x] Documentation updated\n`;
  description += `- [x] No unresolved TODOs\n`;

  return description;
}

// Create PR with gh CLI
async function createPullRequest(context: PRContext): Promise<string> {
  const description = await generatePRDescription(context);
  const title = generatePRTitle(context);

  const result = await runCommand(`
    gh pr create \\
      --title "${title}" \\
      --body "${escapeForShell(description)}" \\
      --base ${context.baseBranch} \\
      --head ${context.branch}
  `);

  return result.stdout.trim(); // Returns PR URL
}
```

### 6. Final Verification Script

```typescript
/**
 * Complete verification before marking PR ready
 */

async function runFinalVerification(): Promise<VerificationReport> {
  console.log('🔍 Running final verification...\n');

  const report: VerificationReport = {
    passed: true,
    checks: []
  };

  // Phase 1: Code completeness
  console.log('📝 Phase 1: Code Completeness');
  const todos = await scanForTODOs('.');
  report.checks.push({
    name: 'No blocking TODOs',
    passed: todos.filter(t => t.priority === 'high').length === 0,
    details: todos.length > 0
      ? `${todos.length} TODOs found`
      : 'No TODOs'
  });

  const debugCode = await runCodeCleanupChecks(await getChangedFiles());
  report.checks.push({
    name: 'No debug code',
    passed: debugCode.filter(r => r.status === 'error').length === 0,
    details: debugCode.length > 0
      ? 'Debug statements found'
      : 'Clean'
  });

  // Phase 2: Quality
  console.log('✅ Phase 2: Quality Assurance');
  const qaResults = await runQualityChecks();
  report.checks.push(...qaResults.map(r => ({
    name: r.category,
    passed: r.passed,
    details: r.details
  })));

  // Phase 3: Git
  console.log('🔀 Phase 3: Git Hygiene');
  const gitResult = await prepareGitForMerge();
  report.checks.push({
    name: 'Git ready for merge',
    passed: gitResult.success,
    details: gitResult.error || 'Ready'
  });

  // Calculate overall status
  report.passed = report.checks.every(c => c.passed);

  // Print report
  console.log('\n' + '='.repeat(50));
  console.log('FINAL VERIFICATION REPORT');
  console.log('='.repeat(50) + '\n');

  for (const check of report.checks) {
    const icon = check.passed ? '✅' : '❌';
    console.log(`${icon} ${check.name}: ${check.details}`);
  }

  console.log('\n' + '='.repeat(50));
  if (report.passed) {
    console.log('✅ ALL CHECKS PASSED - Ready for PR!');
  } else {
    console.log('❌ SOME CHECKS FAILED - Please fix before PR');
  }
  console.log('='.repeat(50));

  return report;
}
```

## Use Cases

### Complete Feature Branch Workflow

```bash
# 1. Run final verification
npm run verify

# 2. Clean up commit history
git log --oneline main..HEAD  # Review commits
git rebase -i main            # Squash/fixup as needed

# 3. Rebase on latest main
git fetch origin main
git rebase origin/main

# 4. Run tests one more time
npm test
npm run build

# 5. Push changes
git push origin feature-branch --force-with-lease

# 6. Create PR
gh pr create --title "feat: add user authentication" --body-file pr-template.md

# 7. Request review
gh pr ready
gh pr edit --add-reviewer teammate1,teammate2
```

## Best Practices

### Do's

- **Run all checks locally** before pushing
- **Rebase on latest main** to avoid conflicts
- **Squash WIP commits** into meaningful units
- **Write clear commit messages** following conventions
- **Include screenshots** for UI changes
- **Link to tickets** in PR description
- **Self-review your diff** before requesting review
- **Test in a clean environment** if possible

### Don'ts

- Don't push broken code
- Don't leave TODOs unaddressed
- Don't skip tests to save time
- Don't force push without `--force-with-lease`
- Don't create PRs without descriptions
- Don't forget to update documentation
- Don't leave debug statements in code
- Don't ignore linting warnings

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Rebase Documentation](https://git-scm.com/docs/git-rebase)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
