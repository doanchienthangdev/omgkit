---
name: finishing-development-branch
description: Completing a development branch. Use when wrapping up feature work.
---

# Finishing Development Branch Skill

## Checklist

### Code Complete
- [ ] All tasks done
- [ ] Tests written
- [ ] Docs updated
- [ ] No TODOs left

### Quality
- [ ] Tests passing
- [ ] Lint passing
- [ ] Type check passing
- [ ] Self-reviewed

### Git
- [ ] Clean commit history
- [ ] Meaningful messages
- [ ] Rebased on main
- [ ] No merge conflicts

### PR
- [ ] Description complete
- [ ] Reviewers assigned
- [ ] Labels added

## Final Steps
```bash
git fetch origin main
git rebase origin/main
npm test
npm run build
git push origin feature-branch
gh pr create
```
