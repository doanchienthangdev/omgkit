# Before-Commit Checklist

This checklist defines validation rules and quality standards that must be met before committing changes to this project.

## Quick Check

Run before every commit:

```bash
# Run tests
npm test

# Check for linting errors
npm run lint

# Build the project
npm run build
```

---

## 1. Code Quality

### 1.1 Tests
- [ ] All existing tests pass
- [ ] New code has appropriate tests
- [ ] Test coverage meets project threshold
- [ ] No skipped tests without documented reason

### 1.2 Linting & Formatting
- [ ] No linting errors (`npm run lint`)
- [ ] Code follows project style guide
- [ ] Consistent formatting applied
- [ ] No unused imports or variables

### 1.3 Type Safety (if applicable)
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Proper types for function parameters and returns
- [ ] No `any` types without justification
- [ ] Interface definitions for complex objects

### 1.4 Build
- [ ] Project builds successfully (`npm run build`)
- [ ] No build warnings (or documented exceptions)
- [ ] Bundle size within acceptable limits

---

## 2. Git Standards

### 2.1 Conventional Commits
Use the format: `type(scope): description`

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |
| `revert` | Revert previous commit |

**Examples:**
```
feat(auth): add social login support
fix(api): handle null response from server
docs(readme): update installation instructions
refactor(utils): simplify date formatting logic
```

### 2.2 Commit Message Guidelines
- [ ] First line under 72 characters
- [ ] Use imperative mood ("add" not "added")
- [ ] Reference issues when applicable (`#123`)
- [ ] Separate subject from body with blank line
- [ ] Explain "what" and "why" (not "how")

### 2.3 Branch Hygiene
- [ ] Working on correct branch
- [ ] Branch is up-to-date with main/master
- [ ] No merge conflicts
- [ ] Feature branch naming: `feature/description`
- [ ] Fix branch naming: `fix/description`

---

## 3. Security

### 3.1 Credentials & Secrets
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No tokens in code
- [ ] `.env` files not committed
- [ ] Secrets in environment variables only

### 3.2 Dependencies
- [ ] No known vulnerabilities (`npm audit`)
- [ ] Dependencies from trusted sources
- [ ] Lock file (`package-lock.json`) updated
- [ ] No unnecessary dependencies added

### 3.3 Input Validation
- [ ] User inputs sanitized
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities addressed
- [ ] CSRF protection in place (if applicable)

---

## 4. Documentation

### 4.1 Code Documentation
- [ ] Complex logic has comments
- [ ] Public APIs have JSDoc/docstrings
- [ ] README updated for new features
- [ ] Breaking changes documented

### 4.2 Changelog
- [ ] CHANGELOG.md updated for user-facing changes
- [ ] Version number updated if releasing
- [ ] Migration guide for breaking changes

### 4.3 API Documentation
- [ ] New endpoints documented
- [ ] Request/response examples provided
- [ ] Error responses documented

---

## 5. Performance

### 5.1 Code Efficiency
- [ ] No obvious performance regressions
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Appropriate caching in place

### 5.2 Assets
- [ ] Images optimized
- [ ] Large files not committed (use LFS if needed)
- [ ] Bundle size checked
- [ ] Lazy loading where appropriate

---

## 6. Review Checklist

### 6.1 Self-Review
- [ ] Code reviewed by yourself
- [ ] Changes match requirements
- [ ] Edge cases handled
- [ ] Error handling in place
- [ ] Logging appropriate (not excessive)

### 6.2 Code Smell Check
- [ ] No duplicate code
- [ ] Functions are single-purpose
- [ ] Naming is clear and consistent
- [ ] No magic numbers/strings
- [ ] Appropriate abstraction level

### 6.3 Testing Mindset
- [ ] "What could go wrong?" considered
- [ ] Boundary conditions tested
- [ ] Error paths tested
- [ ] Happy path works

---

## 7. Environment-Specific

### 7.1 Development
- [ ] Works in development environment
- [ ] Dev dependencies separate from prod

### 7.2 Production Readiness
- [ ] Feature flags for incomplete features
- [ ] Backwards compatibility maintained
- [ ] Rollback plan exists
- [ ] Monitoring in place for new features

---

## Quick Reference Commands

```bash
# Run all checks
npm test && npm run lint && npm run build

# Check for security issues
npm audit

# Format code
npm run format

# Type check (TypeScript)
npx tsc --noEmit

# Git status
git status

# Stage changes
git add -A

# Commit with conventional format
git commit -m "type(scope): description"
```

---

## AI-Assisted Development

When using OMGKIT AI agents:

1. **Review AI-generated code** before committing
2. **Run tests** after AI modifications
3. **Check for sensitive data** in AI outputs
4. **Validate logic** - AI can make mistakes

---

## Customization

Add project-specific rules below this line:

---

<!-- PROJECT-SPECIFIC RULES -->
