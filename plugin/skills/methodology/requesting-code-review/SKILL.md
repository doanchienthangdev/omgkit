---
name: requesting-code-review
description: Best practices for requesting effective code reviews that get timely, thorough feedback
category: methodology
triggers:
  - request review
  - PR review
  - code review request
  - asking for review
  - review request
  - get feedback
  - submit for review
---

# Requesting Code Review

Master the art of **requesting effective code reviews** that get timely, thorough feedback and enable smooth collaboration. This skill provides frameworks for preparing code, writing great PR descriptions, and facilitating efficient reviews.

## Purpose

Get high-quality reviews efficiently:

- Prepare code that's easy to review
- Write PR descriptions that guide reviewers
- Choose appropriate reviewers for the changes
- Make review requests at optimal times
- Reduce review turnaround time
- Enable focused, valuable feedback
- Build positive reviewer relationships

## Features

### 1. The Review Request Framework

```markdown
## Effective Review Request Model

┌─────────────────────────────────────────────────────────────────────────┐
│                      CODE REVIEW REQUEST FRAMEWORK                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BEFORE REQUESTING                                                      │
│  ═══════════════════                                                    │
│  □ Self-review completed                                                │
│  □ Tests pass and coverage adequate                                     │
│  □ No debug code or TODOs                                              │
│  □ Documentation updated                                                │
│  □ Commits are clean and logical                                        │
│                                                                         │
│  PR DESCRIPTION                                                         │
│  ═══════════════                                                        │
│  □ Clear summary of what changed                                        │
│  □ Why the change was made                                              │
│  □ How to test the changes                                              │
│  □ Screenshots for UI changes                                           │
│  □ Areas needing special attention                                      │
│                                                                         │
│  REVIEWER SELECTION                                                     │
│  ════════════════════                                                   │
│  □ Domain expert for complex logic                                      │
│  □ Code owner for affected areas                                        │
│  □ Not overloading any single reviewer                                  │
│  □ At least one senior for critical changes                            │
│                                                                         │
│  TIMING                                                                 │
│  ══════                                                                 │
│  □ Not end of day/week                                                  │
│  □ Reviewers have availability                                          │
│  □ Size appropriate for single session                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Self-Review Checklist

```typescript
/**
 * Self-review before requesting external review
 */

interface SelfReviewChecklist {
  category: string;
  items: ChecklistItem[];
}

const selfReviewChecklist: SelfReviewChecklist[] = [
  {
    category: 'Code Quality',
    items: [
      { check: 'No commented-out code', importance: 'high' },
      { check: 'No console.log/debug statements', importance: 'high' },
      { check: 'No hardcoded values that should be config', importance: 'medium' },
      { check: 'Error handling is appropriate', importance: 'high' },
      { check: 'No obvious performance issues', importance: 'medium' }
    ]
  },
  {
    category: 'Testing',
    items: [
      { check: 'All tests pass', importance: 'high' },
      { check: 'New code has tests', importance: 'high' },
      { check: 'Edge cases covered', importance: 'medium' },
      { check: 'Manually tested happy path', importance: 'high' }
    ]
  },
  {
    category: 'Documentation',
    items: [
      { check: 'Complex logic has comments', importance: 'medium' },
      { check: 'Public APIs documented', importance: 'high' },
      { check: 'README updated if needed', importance: 'low' }
    ]
  },
  {
    category: 'Git Hygiene',
    items: [
      { check: 'Commits are logical units', importance: 'medium' },
      { check: 'Commit messages are clear', importance: 'medium' },
      { check: 'No merge conflicts', importance: 'high' },
      { check: 'Rebased on latest main', importance: 'medium' }
    ]
  }
];

// Self-review diff
async function selfReviewDiff(): Promise<SelfReviewReport> {
  const diff = await getDiffFromMain();
  const issues: SelfReviewIssue[] = [];

  // Check for debug code
  if (/console\.(log|debug)/g.test(diff)) {
    issues.push({
      type: 'debug-code',
      message: 'Found console.log statements',
      severity: 'warning'
    });
  }

  // Check for TODOs
  if (/TODO|FIXME|HACK/g.test(diff)) {
    issues.push({
      type: 'todo',
      message: 'Found TODO/FIXME comments',
      severity: 'info'
    });
  }

  // Check for large files
  const changedFiles = parseChangedFiles(diff);
  const largeChanges = changedFiles.filter(f => f.additions > 300);
  if (largeChanges.length > 0) {
    issues.push({
      type: 'large-change',
      message: `${largeChanges.length} file(s) have 300+ lines changed`,
      severity: 'warning',
      suggestion: 'Consider splitting into smaller PRs'
    });
  }

  return { issues, changedFiles };
}
```

### 3. PR Description Template

```typescript
/**
 * Generate comprehensive PR description
 */

interface PRDescriptionContext {
  title: string;
  type: 'feature' | 'bugfix' | 'refactor' | 'docs' | 'test';
  summary: string;
  ticket?: string;
  changes: string[];
  testing: TestingInfo;
  screenshots?: string[];
  breakingChanges?: string[];
  attentionAreas?: string[];
  relatedPRs?: string[];
}

function generatePRDescription(context: PRDescriptionContext): string {
  let description = '';

  // Summary section
  description += `## Summary\n\n`;
  description += `${context.summary}\n\n`;

  // Link ticket
  if (context.ticket) {
    description += `Resolves ${context.ticket}\n\n`;
  }

  // Type badge
  const typeBadges = {
    feature: '✨ Feature',
    bugfix: '🐛 Bug Fix',
    refactor: '♻️ Refactor',
    docs: '📚 Documentation',
    test: '🧪 Testing'
  };
  description += `**Type:** ${typeBadges[context.type]}\n\n`;

  // What changed
  description += `## Changes\n\n`;
  context.changes.forEach(change => {
    description += `- ${change}\n`;
  });
  description += '\n';

  // Testing section
  description += `## Testing\n\n`;
  description += `### Automated Tests\n`;
  description += `- [${context.testing.unitTests ? 'x' : ' '}] Unit tests added/updated\n`;
  description += `- [${context.testing.integrationTests ? 'x' : ' '}] Integration tests pass\n`;
  description += `- [${context.testing.e2eTests ? 'x' : ' '}] E2E tests pass\n\n`;

  description += `### Manual Testing\n`;
  description += `${context.testing.manualTestSteps || 'N/A'}\n\n`;

  // Screenshots
  if (context.screenshots && context.screenshots.length > 0) {
    description += `## Screenshots\n\n`;
    context.screenshots.forEach((screenshot, i) => {
      description += `![Screenshot ${i + 1}](${screenshot})\n`;
    });
    description += '\n';
  }

  // Breaking changes
  if (context.breakingChanges && context.breakingChanges.length > 0) {
    description += `## ⚠️ Breaking Changes\n\n`;
    context.breakingChanges.forEach(change => {
      description += `- ${change}\n`;
    });
    description += '\n';
  }

  // Areas needing attention
  if (context.attentionAreas && context.attentionAreas.length > 0) {
    description += `## 👀 Areas Needing Review\n\n`;
    context.attentionAreas.forEach(area => {
      description += `- ${area}\n`;
    });
    description += '\n';
  }

  // Related PRs
  if (context.relatedPRs && context.relatedPRs.length > 0) {
    description += `## Related PRs\n\n`;
    context.relatedPRs.forEach(pr => {
      description += `- ${pr}\n`;
    });
    description += '\n';
  }

  // Checklist
  description += `## Checklist\n\n`;
  description += `- [x] Self-review completed\n`;
  description += `- [x] Tests pass locally\n`;
  description += `- [x] Documentation updated\n`;
  description += `- [x] No unresolved TODOs\n`;

  return description;
}

// Real example
const examplePRDescription = `
## Summary

Adds user authentication using JWT tokens with refresh token rotation.

Resolves #123

**Type:** ✨ Feature

## Changes

- Add JWT token generation and validation
- Implement refresh token rotation for security
- Add login/logout API endpoints
- Create authentication middleware
- Add user session management

## Testing

### Automated Tests
- [x] Unit tests added/updated
- [x] Integration tests pass
- [ ] E2E tests pass

### Manual Testing
1. Login with valid credentials → Receive access & refresh tokens
2. Access protected route with token → Success
3. Wait for token expiry → Auto-refresh works
4. Logout → Tokens invalidated

## 👀 Areas Needing Review

- Security: Token generation in \`src/auth/tokens.ts\`
- Performance: Session lookup efficiency
- Error handling: Token validation edge cases

## Checklist

- [x] Self-review completed
- [x] Tests pass locally
- [x] Documentation updated
- [x] No unresolved TODOs
`;
```

### 4. Reviewer Selection Strategy

```typescript
/**
 * Choose the right reviewers for your PR
 */

interface ReviewerProfile {
  username: string;
  expertise: string[];
  codeOwnership: string[];
  currentLoad: number; // Number of pending reviews
  availability: 'high' | 'medium' | 'low';
}

interface PRReviewNeeds {
  changedAreas: string[];
  complexity: 'low' | 'medium' | 'high';
  securityRelevant: boolean;
  architectureChange: boolean;
}

function selectReviewers(
  needs: PRReviewNeeds,
  availableReviewers: ReviewerProfile[]
): SelectedReviewers {
  const selected: ReviewerProfile[] = [];
  const reasons: string[] = [];

  // 1. Must have: Code owner for changed areas
  const codeOwner = availableReviewers.find(r =>
    r.codeOwnership.some(area =>
      needs.changedAreas.some(changed => changed.includes(area))
    )
  );

  if (codeOwner) {
    selected.push(codeOwner);
    reasons.push(`${codeOwner.username}: Code owner for affected areas`);
  }

  // 2. For high complexity: Add domain expert
  if (needs.complexity === 'high') {
    const expert = availableReviewers.find(r =>
      r.expertise.some(e => needs.changedAreas.some(a => a.includes(e))) &&
      !selected.includes(r) &&
      r.currentLoad < 3
    );

    if (expert) {
      selected.push(expert);
      reasons.push(`${expert.username}: Domain expert`);
    }
  }

  // 3. For security changes: Add security reviewer
  if (needs.securityRelevant) {
    const securityReviewer = availableReviewers.find(r =>
      r.expertise.includes('security') &&
      !selected.includes(r)
    );

    if (securityReviewer) {
      selected.push(securityReviewer);
      reasons.push(`${securityReviewer.username}: Security expertise`);
    }
  }

  // 4. For architecture changes: Add senior/architect
  if (needs.architectureChange) {
    const architect = availableReviewers.find(r =>
      r.expertise.includes('architecture') &&
      !selected.includes(r)
    );

    if (architect) {
      selected.push(architect);
      reasons.push(`${architect.username}: Architecture review`);
    }
  }

  // Balance load - don't overload anyone
  const balanced = selected.filter(r => r.currentLoad < 5);

  return {
    reviewers: balanced.map(r => r.username),
    reasons,
    warnings: balanced.length < selected.length
      ? ['Some reviewers have high load - consider alternative reviewers']
      : []
  };
}

// Reviewer selection best practices
const reviewerGuidelines = {
  minimumReviewers: 1,
  recommendedReviewers: 2,
  maxReviewers: 4, // Too many cooks

  considerations: [
    'Code ownership - who maintains this area?',
    'Domain expertise - who knows this technology best?',
    'Availability - who has bandwidth this week?',
    'Learning opportunity - can a junior learn from reviewing?',
    'Previous context - who reviewed related changes?'
  ],

  antipatterns: [
    'Always requesting the same person',
    'Requesting too many reviewers',
    'Not considering reviewer workload',
    'Skipping security review for auth changes'
  ]
};
```

### 5. PR Size and Timing

```typescript
/**
 * Optimize PR size and request timing
 */

interface PRMetrics {
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  totalChanges: number;
}

function assessPRSize(metrics: PRMetrics): PRSizeAssessment {
  const { totalChanges, filesChanged } = metrics;

  // Size categories
  if (totalChanges <= 100 && filesChanged <= 5) {
    return {
      size: 'small',
      reviewTime: '15-30 minutes',
      recommendation: 'Good size for thorough review'
    };
  }

  if (totalChanges <= 400 && filesChanged <= 15) {
    return {
      size: 'medium',
      reviewTime: '30-60 minutes',
      recommendation: 'Acceptable, but consider if splittable'
    };
  }

  if (totalChanges <= 800) {
    return {
      size: 'large',
      reviewTime: '1-2 hours',
      recommendation: 'Consider splitting into smaller PRs',
      splitSuggestions: generateSplitSuggestions(metrics)
    };
  }

  return {
    size: 'too-large',
    reviewTime: '2+ hours',
    recommendation: 'Strongly recommend splitting',
    splitSuggestions: generateSplitSuggestions(metrics),
    warning: 'Large PRs have lower review quality'
  };
}

// Optimal request timing
const requestTimingGuidelines = {
  best: [
    'Morning (9-11 AM) - Reviewers are fresh',
    'Early week (Mon-Wed) - Time for iterations',
    'After standup - Team is engaged'
  ],

  avoid: [
    'Friday afternoon - May not get reviewed until Monday',
    'End of day - Tired reviewers miss issues',
    'Right before meetings - Rushed reviews',
    'During crunch time - Team is focused elsewhere'
  ],

  tips: [
    'Check reviewer calendars before requesting',
    'For urgent PRs, message the reviewer directly',
    'Batch small PRs to reduce context switching',
    'Allow 24-48 hours for non-urgent reviews'
  ]
};

// Generate split suggestions for large PRs
function generateSplitSuggestions(metrics: PRMetrics): string[] {
  const suggestions: string[] = [];

  // Suggest splitting by concern
  suggestions.push('Split by feature area (e.g., UI changes vs backend)');
  suggestions.push('Split refactoring from new features');
  suggestions.push('Split tests into separate PR');

  // For very large PRs
  if (metrics.totalChanges > 500) {
    suggestions.push('Create a base PR with core changes');
    suggestions.push('Follow up with incremental PRs');
  }

  return suggestions;
}
```

### 6. Facilitating Effective Reviews

```typescript
/**
 * Help reviewers give better feedback
 */

// Inline comments for reviewers
function addReviewerGuidance(prDescription: string): string {
  return prDescription + `

## For Reviewers

### Key Areas to Review
1. **Security**: Auth token handling in \`src/auth/\`
2. **Performance**: Database query efficiency
3. **Edge Cases**: Error handling for network failures

### What You Can Skip
- Test file formatting (will be auto-fixed)
- Import ordering (handled by linter)

### Questions for Reviewers
- Is the error message user-friendly?
- Should we add rate limiting to this endpoint?

### How to Test Locally
\`\`\`bash
git checkout feature-branch
npm install
npm run dev
# Visit http://localhost:3000/test-feature
\`\`\`
`;
}

// In-code comments for complex logic
const inCodeGuidanceExamples = {
  // Good: Explains why
  good: `
// Using exponential backoff to handle rate limiting
// Max retries: 3, delays: 1s, 2s, 4s
async function fetchWithRetry(url: string): Promise<Response> {
  // ...
}
`,

  // Bad: Explains what (obvious from code)
  bad: `
// Fetches URL with retry
async function fetchWithRetry(url: string): Promise<Response> {
  // ...
}
`
};

// Conversation starters for reviews
const conversationStarters = [
  'I went with X approach because Y. Open to alternatives if you see issues.',
  'This is a trade-off between A and B. I chose A because C.',
  'Not sure about this pattern - would appreciate feedback.',
  'This is complex due to X constraint. Happy to explain if unclear.'
];
```

## Use Cases

### Standard Feature PR Request

```bash
# 1. Self-review
git diff main...HEAD  # Review your changes

# 2. Run checks
npm test && npm run lint && npm run build

# 3. Update branch
git fetch origin main
git rebase origin/main

# 4. Push and create PR
git push origin feature-branch

gh pr create \
  --title "feat(auth): add JWT authentication" \
  --body-file .github/pr-template.md \
  --reviewer alice,bob \
  --label "feature,needs-review"

# 5. Add context comment
gh pr comment --body "Ready for review! Main areas to look at:
- Token generation in src/auth/tokens.ts
- Middleware in src/middleware/auth.ts"
```

## Best Practices

### Do's

- **Self-review first** - catch obvious issues yourself
- **Keep PRs small** - under 400 lines when possible
- **Write clear descriptions** - help reviewers understand context
- **Highlight key areas** - guide reviewers to important code
- **Choose reviewers wisely** - match expertise to needs
- **Be responsive** - address feedback promptly
- **Test thoroughly** - don't waste reviewer time on broken code
- **Include screenshots** - for UI changes

### Don'ts

- Don't submit PRs without testing
- Don't request review on WIP code
- Don't overload single reviewers
- Don't create massive PRs
- Don't leave cryptic commit messages
- Don't skip the description
- Don't ignore reviewer availability
- Don't rush reviewers

## References

- [Google Engineering Practices: Sending PRs for Review](https://google.github.io/eng-practices/review/developer/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [The Art of Code Review](https://www.alexandra-hill.com/2018/06/25/the-art-of-giving-and-receiving-code-reviews/)
- [GitHub PR Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
