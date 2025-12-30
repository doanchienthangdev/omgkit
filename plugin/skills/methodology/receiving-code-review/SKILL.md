---
name: receiving-code-review
description: Handle code review feedback professionally and productively to improve code quality
category: methodology
triggers:
  - receiving review
  - code review feedback
  - review comments
  - addressing feedback
  - PR feedback
  - review response
  - handling criticism
---

# Receiving Code Review

Handle **code review feedback** professionally and productively to improve code quality and grow as a developer. This skill provides frameworks for processing feedback, responding appropriately, and learning from reviews.

## Purpose

Turn code reviews into growth opportunities:

- Process feedback objectively without defensiveness
- Distinguish between required changes and suggestions
- Respond to comments professionally and clearly
- Learn patterns and improve from feedback
- Maintain productive reviewer relationships
- Track and address all feedback systematically
- Extract maximum learning value from reviews

## Features

### 1. The Feedback Processing Framework

```markdown
## Receiving Code Review Mindset

┌─────────────────────────────────────────────────────────────────────────┐
│                      CODE REVIEW FEEDBACK MODEL                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  REMEMBER: Feedback is about the CODE, not about YOU                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    FEEDBACK RECEIVED                             │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│                             ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              1. PAUSE - Don't React Immediately                  │   │
│  │                 Read carefully, understand fully                 │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│                             ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              2. CATEGORIZE - What type of feedback?              │   │
│  │                 Required │ Suggested │ Question │ FYI           │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│                             ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              3. RESPOND - Acknowledge and address                │   │
│  │                 Agree │ Discuss │ Clarify                       │   │
│  └──────────────────────────┬──────────────────────────────────────┘   │
│                             │                                           │
│                             ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              4. LEARN - Extract patterns and lessons             │   │
│  │                 Document │ Practice │ Share                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Feedback Categorization

```typescript
/**
 * Categorize review comments to prioritize response
 */

type FeedbackCategory =
  | 'blocking'    // Must fix before merge
  | 'suggestion'  // Recommended improvement
  | 'question'    // Needs clarification
  | 'nitpick'     // Minor style issue
  | 'praise'      // Positive feedback
  | 'fyi';        // Informational

interface ReviewComment {
  id: string;
  author: string;
  content: string;
  file?: string;
  line?: number;
  category: FeedbackCategory;
  status: 'pending' | 'addressed' | 'wontfix' | 'discussing';
}

function categorizeComment(comment: string, context: ReviewContext): FeedbackCategory {
  // Blocking indicators
  const blockingPatterns = [
    /must|required|needs to|has to|should not/i,
    /security|vulnerability|bug|broken/i,
    /please fix|critical|blocking/i
  ];

  // Question indicators
  const questionPatterns = [
    /\?$/,
    /^(why|what|how|could you|can you|would you)/i,
    /wondering|curious|not sure/i
  ];

  // Suggestion indicators
  const suggestionPatterns = [
    /consider|might want|could|maybe|alternatively/i,
    /^(nit|minor|optional|suggestion)/i
  ];

  // Praise indicators
  const praisePatterns = [
    /nice|great|good|love|excellent|clever|clean/i,
    /👍|🎉|✨|💯/
  ];

  if (blockingPatterns.some(p => p.test(comment))) return 'blocking';
  if (questionPatterns.some(p => p.test(comment))) return 'question';
  if (praisePatterns.some(p => p.test(comment))) return 'praise';
  if (suggestionPatterns.some(p => p.test(comment))) return 'suggestion';

  return 'suggestion'; // Default to suggestion
}

// Priority order for addressing comments
const addressingPriority = [
  'blocking',   // Fix these first
  'question',   // Answer to unblock discussion
  'suggestion', // Consider and respond
  'nitpick',    // Fix if easy, discuss if not
  'praise',     // Thank the reviewer
  'fyi'         // Acknowledge
];
```

### 3. Response Templates

```typescript
/**
 * Professional response templates for different feedback types
 */

const responseTemplates = {
  // Agreement - Simple and direct
  agree: {
    simple: "Good catch! Fixed in {commit}.",
    withContext: "Agreed - I missed this case. Fixed in {commit}.",
    withThanks: "Thanks for catching this! Fixed in {commit}."
  },

  // Disagreement - Respectful with reasoning
  disagree: {
    withAlternative: `
I considered this approach, but chose the current implementation because:
- {reason1}
- {reason2}

What do you think about keeping it as-is given these trade-offs?`,

    withData: `
I ran some benchmarks on both approaches:
- Current: {metric1}
- Suggested: {metric2}

The current approach seems better for our use case. Thoughts?`,

    partial: `
Good point about {aspect}. I've addressed that part.

For {other_aspect}, I'd prefer to keep the current approach because {reason}.
Let me know if you feel strongly about changing it.`
  },

  // Clarification - Ask specific questions
  clarify: {
    needsMore: "Could you elaborate on {specific_point}? I want to make sure I understand the concern.",
    example: "Do you have an example of the pattern you'd prefer? That would help me understand.",
    context: "I may be missing some context - could you explain why {approach} is preferred here?"
  },

  // Questions - Answer directly
  answer: {
    withReason: "Great question! I chose this because {reason}.",
    withTradeoff: "Good catch - there's a trade-off here. {explanation}. I went with this approach because {reasoning}.",
    withDoc: "This is documented in {location}. The reason is {explanation}."
  },

  // Deferral - Valid reasons to defer
  defer: {
    scopeCreep: "That's a good idea! It's outside the scope of this PR - I'll create a follow-up issue: {issue_link}",
    needsDiscussion: "This deserves a broader discussion. Let's sync about it in {meeting/channel}.",
    complexChange: "Agreed this should change, but it's a larger refactor. Created {issue_link} to track."
  }
};

// Example responses
const exampleResponses = {
  // Reviewer: "This could be simplified using Array.map instead of the for loop"
  agreeAndFix: "Good call! Refactored to use map - much cleaner. Fixed in abc123.",

  // Reviewer: "Why not use a switch statement here?"
  disagreeWithReason: `
I considered a switch, but the if-else works better here because:
- The conditions aren't simple value comparisons
- We need to check ranges (age > 18)
- The logic may expand to more complex conditions

Happy to discuss if you see issues with this approach.`,

  // Reviewer: "Consider adding error handling"
  partialAgree: `
Good point! Added try/catch for the network calls.

For the local operations, I've kept them without explicit try/catch since errors there indicate bugs we'd want to surface immediately. Let me know if you'd prefer explicit handling there too.`
};
```

### 4. Addressing Comments Systematically

```typescript
/**
 * Process all comments systematically
 */

interface ReviewSession {
  prId: string;
  comments: ReviewComment[];
  status: 'in_progress' | 'complete' | 'blocked';
}

class ReviewResponseManager {
  private session: ReviewSession;

  async processAllComments(): Promise<void> {
    // 1. Read all comments first (don't start responding immediately)
    const allComments = await this.fetchAllComments();

    // 2. Categorize and sort by priority
    const categorized = allComments
      .map(c => ({ ...c, category: categorizeComment(c.content) }))
      .sort((a, b) =>
        addressingPriority.indexOf(a.category) -
        addressingPriority.indexOf(b.category)
      );

    // 3. Group related comments
    const grouped = this.groupRelatedComments(categorized);

    // 4. Address each group
    for (const group of grouped) {
      await this.addressCommentGroup(group);
    }

    // 5. Post summary update
    await this.postSummaryUpdate();
  }

  private async addressCommentGroup(comments: ReviewComment[]): Promise<void> {
    // Address the primary comment
    const primary = comments[0];

    switch (primary.category) {
      case 'blocking':
        await this.fixAndRespond(primary);
        break;
      case 'question':
        await this.answerQuestion(primary);
        break;
      case 'suggestion':
        await this.considerSuggestion(primary);
        break;
      case 'nitpick':
        await this.handleNitpick(primary);
        break;
      case 'praise':
        await this.acknowledgepraise(primary);
        break;
    }

    // Mark as addressed
    primary.status = 'addressed';
  }

  private async postSummaryUpdate(): Promise<void> {
    const addressed = this.session.comments.filter(c => c.status === 'addressed');
    const pending = this.session.comments.filter(c => c.status === 'pending');
    const wontfix = this.session.comments.filter(c => c.status === 'wontfix');

    await this.postComment(`
## Review Response Summary

✅ Addressed: ${addressed.length} comments
⏳ Pending discussion: ${pending.length} comments
🔜 Deferred: ${wontfix.length} comments (see follow-up issues)

Ready for another look when you have time!
    `);
  }
}
```

### 5. Learning from Reviews

```typescript
/**
 * Extract learning value from reviews
 */

interface ReviewLesson {
  category: string;
  pattern: string;
  example: string;
  prevention: string;
}

class ReviewLearningSystem {
  private lessons: ReviewLesson[] = [];

  extractLessons(review: ReviewSession): ReviewLesson[] {
    const lessons: ReviewLesson[] = [];

    for (const comment of review.comments) {
      if (comment.category === 'blocking' || comment.category === 'suggestion') {
        const lesson = this.analyzeForLesson(comment);
        if (lesson) {
          lessons.push(lesson);
        }
      }
    }

    return lessons;
  }

  private analyzeForLesson(comment: ReviewComment): ReviewLesson | null {
    // Common lesson patterns
    const patterns = {
      security: {
        triggers: ['injection', 'xss', 'auth', 'security', 'sanitize'],
        category: 'Security',
        prevention: 'Use parameterized queries, validate input, encode output'
      },
      performance: {
        triggers: ['n+1', 'loop', 'inefficient', 'slow', 'memory'],
        category: 'Performance',
        prevention: 'Profile before optimizing, batch operations, use appropriate data structures'
      },
      errorHandling: {
        triggers: ['error', 'exception', 'try', 'catch', 'handle'],
        category: 'Error Handling',
        prevention: 'Always handle errors, use typed errors, log appropriately'
      },
      testing: {
        triggers: ['test', 'coverage', 'edge case', 'mock'],
        category: 'Testing',
        prevention: 'Test edge cases, use meaningful assertions, avoid flaky tests'
      },
      naming: {
        triggers: ['name', 'unclear', 'confusing', 'rename'],
        category: 'Naming',
        prevention: 'Use descriptive names, follow conventions, be consistent'
      }
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      if (pattern.triggers.some(t =>
        comment.content.toLowerCase().includes(t)
      )) {
        return {
          category: pattern.category,
          pattern: comment.content,
          example: comment.file ? `${comment.file}:${comment.line}` : 'N/A',
          prevention: pattern.prevention
        };
      }
    }

    return null;
  }

  // Track recurring feedback
  trackPatterns(): RecurringPattern[] {
    const patternCounts = new Map<string, number>();

    for (const lesson of this.lessons) {
      const key = lesson.category;
      patternCounts.set(key, (patternCounts.get(key) || 0) + 1);
    }

    return Array.from(patternCounts.entries())
      .filter(([_, count]) => count >= 2)
      .map(([category, count]) => ({
        category,
        count,
        suggestion: `Focus on improving ${category.toLowerCase()} skills`
      }));
  }
}
```

### 6. Common Anti-Patterns to Avoid

```markdown
## Review Response Anti-Patterns

### ❌ DON'T: Defensive Responses

Bad:
> "Well, it works fine on my machine and I've tested it extensively."

Good:
> "I see the issue now - I was testing in a different environment. Fixed in abc123."


### ❌ DON'T: Ignoring Comments

Bad:
> *No response, just mark as resolved*

Good:
> "Addressed this by extracting the logic into a helper function. The tests now cover the edge case too."


### ❌ DON'T: Dismissive Responses

Bad:
> "That's just a style preference, not important."

Good:
> "I see the benefit for consistency. Changed to match the team style."


### ❌ DON'T: Over-Explaining

Bad:
> *Three paragraphs explaining why you chose a variable name*

Good:
> "Renamed to userAccountStatus - clearer. Good catch."


### ❌ DON'T: Passive-Aggressive

Bad:
> "I guess we can do it your way if you insist..."

Good:
> "That approach does handle the edge case better. Updated."


### ✅ DO: Be Grateful

Good:
> "Thanks for the thorough review! I learned a new pattern from your suggestion about X."


### ✅ DO: Take Ownership

Good:
> "You're right, I should have caught this. Added a test to prevent regression."
```

## Use Cases

### Handling a Tough Review

```typescript
// Scenario: PR receives 20+ comments, some critical

async function handleToughReview(prId: string): Promise<void> {
  const manager = new ReviewResponseManager(prId);

  // Step 1: Don't panic, read everything first
  const allComments = await manager.fetchAllComments();
  console.log(`Received ${allComments.length} comments`);

  // Step 2: Categorize to understand scope
  const breakdown = categorizeAll(allComments);
  console.log(`
    Blocking: ${breakdown.blocking}
    Questions: ${breakdown.questions}
    Suggestions: ${breakdown.suggestions}
    Nitpicks: ${breakdown.nitpicks}
  `);

  // Step 3: Address blocking issues first
  for (const blocking of breakdown.blocking) {
    await fixBlockingIssue(blocking);
  }

  // Step 4: Answer questions to unblock discussion
  for (const question of breakdown.questions) {
    await answerQuestion(question);
  }

  // Step 5: Address suggestions thoughtfully
  for (const suggestion of breakdown.suggestions) {
    if (suggestion.isValid) {
      await implementSuggestion(suggestion);
    } else {
      await explainAlternative(suggestion);
    }
  }

  // Step 6: Quick fixes for nitpicks
  for (const nitpick of breakdown.nitpicks) {
    await quickFix(nitpick);
  }

  // Step 7: Post summary and re-request review
  await postSummary();
  await requestReReview();
}
```

## Best Practices

### Do's

- **Read all comments before responding** - understand the full picture
- **Categorize by priority** - blocking issues first
- **Respond to every comment** - even if just acknowledging
- **Be specific in responses** - reference commit hashes
- **Thank reviewers** for their time and insights
- **Learn from feedback** - track patterns
- **Follow up promptly** - don't let PRs stale
- **Ask for clarification** when needed

### Don'ts

- Don't take feedback personally
- Don't respond defensively or emotionally
- Don't ignore comments without explanation
- Don't mark as resolved without addressing
- Don't argue about preferences endlessly
- Don't dismiss nitpicks dismissively
- Don't forget to re-request review
- Don't delay addressing feedback

## References

- [The Art of Receiving Code Reviews](https://mtlynch.io/code-review-love/)
- [How to Make Good Code Reviews Better](https://stackoverflow.blog/2019/09/30/how-to-make-good-code-reviews-better/)
- [Google Code Review Guidelines](https://google.github.io/eng-practices/review/)
