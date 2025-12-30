---
description: Scan for security vulnerabilities
allowed-tools: Task, Read, Grep, Bash, Glob
---

# 🔒 Security Scan

Full security audit of the codebase.

## Scans
1. Dependency vulnerabilities (`npm audit`)
2. Hardcoded secrets
3. SQL injection patterns
4. XSS vulnerabilities
5. Insecure configurations

## Output
```markdown
## Security Report

### Risk Level: LOW | MEDIUM | HIGH

### Vulnerabilities
| Severity | Type | Location | Fix |

### Recommendations
1. [Action]
```
