# Project Artifacts

This folder contains **reference documents** that provide context for AI-assisted development.

## Purpose

Artifacts are **input context** for Claude Code and OMGKIT to understand your project. They are NOT execution instructions - they help AI understand the background, goals, and constraints of your project.

## What Goes Here

| Subfolder | Content | Examples |
|-----------|---------|----------|
| `data/` | Sample data, schemas, data dictionaries | `schema.sql`, `sample-users.json`, `data-dictionary.md` |
| `docs/` | Requirements, user stories, PRDs | `prd.md`, `user-stories.md`, `requirements.docx` |
| `knowledge/` | Glossary, business rules, domain knowledge | `glossary.md`, `business-rules.md`, `domain-model.md` |
| `research/` | Competitor analysis, market research | `competitors.md`, `market-analysis.pdf` |
| `assets/` | Reference images, templates, mockups | `wireframes/`, `logos/`, `templates/` |
| `examples/` | Code samples, reference implementations | `api-example.py`, `integration-sample/` |

## How AI Uses These Artifacts

When you run OMGKIT commands, the AI team will:

1. **Read artifacts** to understand project context
2. **Reference business rules** when making implementation decisions
3. **Follow naming conventions** from glossary and data dictionaries
4. **Align with requirements** in PRDs and user stories
5. **Use examples** as reference for coding patterns

## Artifacts vs Other Folders

| Folder | Purpose | Git Status | AI Usage |
|--------|---------|------------|----------|
| **artifacts/** | Reference context (input) | Committed | Read for understanding |
| **devlogs/** | Development work logs | Git-ignored | Internal tracking |
| **plans/** | Formal implementation plans | Committed | Execution guidance |
| **docs/** | Generated documentation | Committed | Output documentation |

## Best Practices

### 1. Keep It Organized

Create subfolders for different types of content:

```
artifacts/
├── data/
│   ├── sample-users.json
│   └── schema.sql
├── docs/
│   ├── prd.md
│   └── user-stories.md
├── knowledge/
│   ├── glossary.md
│   └── business-rules.md
└── research/
    └── competitor-analysis.md
```

### 2. Use Clear Naming

- Descriptive filenames: `user-authentication-requirements.md`
- Date prefix for versioned docs: `2024-12-prd-v2.md`
- Keep extensions consistent: `.md` for markdown, `.json` for data

### 3. Keep It Relevant

- Remove outdated documents
- Update artifacts when requirements change
- Link related documents together

### 4. Don't Put Execution Work Here

Execution work belongs elsewhere:
- Implementation plans go in `plans/`
- Development logs go in `devlogs/`
- Generated docs go in `docs/`

## Quick Start

1. Copy your project documents into appropriate subfolders
2. Run `/context:index` to refresh codebase context
3. AI will automatically reference these when executing commands

---

*Artifacts provide the "why" and "what" - AI handles the "how".*
