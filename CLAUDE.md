# CLAUDE.md - OMGKIT Project Rules

## Development Workflow Rules

### .devlogs/ Folder
**IMPORTANT**: All development plans, ideas, upgrade plans, and internal notes MUST go in `.devlogs/` folder:
- Plans (implementation plans, upgrade plans, migration plans)
- Ideas and brainstorming notes
- Internal development logs
- Task breakdowns and analysis

This folder is git-ignored and should NEVER be committed to the repository.

❌ **NEVER** put plans in `docs/` - that's for public documentation only
✅ **ALWAYS** put plans in `.devlogs/`

### Documentation (`docs/`)
The `docs/` folder is for Mintlify public documentation only:
- User-facing documentation
- API references
- Guides and tutorials
- Agent/command/skill documentation pages

### Commit Standards
- Use conventional commits: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
- Include scope: `feat(agents): description`
- End commit messages with the Omega signature

### Agent Development
- Agent specifications live in `plugin/agents/`
- Documentation is auto-generated via `npm run docs:generate`
- Follow BigTech standards established in agent specs

---

*Think Omega. Build Omega. Be Omega.* 🔮
