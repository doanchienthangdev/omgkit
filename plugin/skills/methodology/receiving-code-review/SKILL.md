---
name: receiving-code-reviews
description: AI agent handles code review feedback professionally by categorizing, responding appropriately, and extracting learnings. Use when PR feedback arrives, addressing reviewer comments, or improving from feedback.
---

# Receiving Code Reviews

## Quick Start

1. **Pause** - Read all comments before responding; don't react immediately
2. **Categorize** - Sort by type: blocking, suggestion, question, nitpick, praise
3. **Prioritize** - Address blocking issues first, then questions, then suggestions
4. **Respond** - Acknowledge every comment with specific action or reasoning
5. **Learn** - Track recurring feedback patterns for improvement

## Features

| Feature | Description | Guide |
|---------|-------------|-------|
| Feedback Categories | Classify comment types | Blocking > Question > Suggestion > Nitpick |
| Response Templates | Professional reply patterns | Agree, disagree-with-reason, clarify, defer |
| Systematic Processing | Address all comments | Group related, post summary update |
| Learning Extraction | Identify improvement patterns | Track recurring categories |
| Anti-Patterns | Avoid defensive responses | No arguing, ignoring, or dismissiveness |
| Progress Tracking | Communicate resolution status | Addressed X, Discussing Y, Deferred Z |

## Common Patterns

```
# Feedback Category Priority
1. blocking - Must fix before merge
2. question - Answer to unblock discussion
3. suggestion - Consider and respond
4. nitpick - Fix if easy, discuss if not
5. praise - Thank the reviewer
6. fyi - Acknowledge

# Response Templates
AGREE:
"Good catch! Fixed in abc123."

DISAGREE (with reason):
"I considered this approach but chose current because:
- [reason 1]
- [reason 2]
What do you think given these trade-offs?"

CLARIFY:
"Could you elaborate on [point]? Want to understand fully."

DEFER:
"Good idea! Outside PR scope - created follow-up: [link]"
```

```
# Processing Workflow
1. Read ALL comments first (don't start responding)
2. Categorize and sort by priority
3. Group related comments together
4. Address blocking issues first
5. Answer questions to unblock
6. Consider suggestions thoughtfully
7. Post summary update:

## Review Response Summary
- Addressed: 8 comments
- Pending discussion: 2 comments
- Deferred (follow-up issues): 1 comment
Ready for another look!
```

## Best Practices

| Do | Avoid |
|----|-------|
| Read all comments before responding | Reacting immediately/defensively |
| Categorize by priority (blocking first) | Ignoring comments without explanation |
| Respond to every comment | Marking resolved without addressing |
| Be specific - reference commit hashes | Over-explaining simple changes |
| Thank reviewers for insights | Taking feedback personally |
| Ask for clarification when needed | Arguing about preferences endlessly |
| Learn from recurring feedback | Dismissing nitpicks dismissively |
| Re-request review when done | Delaying response to feedback |

## Related Skills

- `requesting-code-reviews` - How to request effective reviews
- `finishing-development-branches` - Complete PR preparation
- `verifying-before-completion` - Pre-review verification
- `solving-problems` - Handle tough feedback constructively
