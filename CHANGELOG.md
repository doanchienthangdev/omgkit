# Changelog

All notable changes to OMGKIT will be documented in this file.

## [2.15.0] - 2026-01-02

### Changed
- **Architecture Alignment**: Fixed misalignment between agents, skills, commands, and workflows
- All agents now declare their skills and commands in frontmatter
- All workflow skills use proper `category/skill-name` format (e.g., `methodology/writing-plans`)
- Skill count updated to 128

### Added
- `plugin/registry.yaml` - Central registry for component mappings (Single Source of Truth)
- `tests/validation/alignment.test.js` - 212 validation tests for architecture alignment
- Agent frontmatter now includes `skills` and `commands` fields

### Fixed
- Workflows no longer confuse agents with skills in the `skills:` field
- All skill references now use correct `category/skill-name` paths
- All command references use proper `/namespace:command` format

---

## [2.14.0] - 2026-01-01

### Added
- Comprehensive gap analysis implementation
- New specialized workflows for microservices, event-driven, AI-ML, and game development
- Extended skill coverage to 128 skills

---

## [1.0.0] - 2024

### Added
- Initial release of OMGKIT

#### Agents (23)
- Core Development: planner, researcher, debugger, tester, code-reviewer, scout
- Operations: git-manager, docs-manager, project-manager, database-admin, ui-ux-designer
- Extended: fullstack-developer, cicd-manager, security-auditor, api-designer, vulnerability-scanner, pipeline-architect
- Creative: copywriter, brainstormer, journal-writer
- Omega: oracle, architect, sprint-master

#### Commands (58)
- Development: /feature, /fix, /fix:fast, /fix:hard, /fix:test, /fix:ci, /fix:logs, /review, /test, /tdd
- Planning: /plan, /plan:detailed, /plan:parallel, /brainstorm, /execute-plan, /research, /doc, /ask
- Git: /commit, /ship, /pr, /deploy, /cm, /cp
- Quality: /security-scan, /api-gen, /refactor, /optimize, /lint
- Context: /mode, /index, /load, /checkpoint, /spawn, /spawn:collect
- Design: /design:screenshot, /design:fast, /design:good, /content:cro, /content:enhance
- Omega: /10x, /100x, /1000x, /principles, /dimensions
- Sprint: /init, /vision:set, /vision:show, /sprint:new, /sprint:start, /sprint:current, /sprint:end, /backlog:add, /backlog:show, /backlog:prioritize, /team:run, /team:status, /team:ask

#### Skills (52)
- Languages: python, typescript, javascript
- Frameworks: fastapi, django, nextjs, react, vue, express, nestjs, rails, spring, laravel
- Databases: postgresql, mongodb, redis, prisma
- Frontend: tailwindcss, shadcn-ui, frontend-design, responsive, accessibility, threejs
- DevOps: docker, kubernetes, github-actions, aws
- Security: owasp, better-auth, oauth
- Testing: pytest, vitest, playwright
- Methodology: 14 development methodology skills
- Omega: omega-coding, omega-thinking, omega-testing, omega-architecture, omega-sprint

#### Modes (9)
- Standard: default, brainstorm, token-efficient, deep-research, implementation, review, orchestration
- Omega: omega, autonomous

#### Features
- Sprint Management with AI team autonomy
- 7 Omega Thinking Modes
- Vision and backlog management
- MCP server integrations
- CLI for install/init/doctor

---
*Think Omega. Build Omega. Be Omega.* 🔮
