---
description: Create pull request
allowed-tools: Bash, Read
argument-hint: [title]
---

# 🔀 PR: $ARGUMENTS

Create pull request for current branch.

## Process
1. Get current branch
2. Analyze commits
3. Generate PR description
4. Create PR via gh CLI

## Command
```bash
gh pr create --title "Title" --body "Description"
```
