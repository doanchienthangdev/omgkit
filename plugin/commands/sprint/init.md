---
description: Initialize OMGKIT in project
allowed-tools: Bash, Write
---

# 🔮 Initialize OMGKIT

Create `.omgkit/` directory structure.

## Creates
```
.omgkit/
├── config.yaml
├── settings.json
├── sprints/
│   ├── vision.yaml
│   └── backlog.yaml
├── plans/
├── docs/
├── logs/
├── devlogs/
│   └── README.md
├── stdrules/
│   ├── README.md
│   ├── BEFORE_COMMIT.md
│   ├── SKILL_STANDARDS.md
│   └── TESTING_STANDARDS.md
└── artifacts/
    └── README.md
OMEGA.md
CLAUDE.md
```

## Artifacts Folder

The `.omgkit/artifacts/` folder stores **reference documents** that provide context for AI-assisted development:

| Subfolder | Purpose |
|-----------|---------|
| `data/` | Sample data, schemas, data dictionaries |
| `docs/` | Requirements, user stories, PRDs |
| `knowledge/` | Glossary, business rules, domain knowledge |
| `research/` | Competitor analysis, market research |
| `assets/` | Reference images, templates, mockups |
| `examples/` | Code samples, reference implementations |

> **Note:** Artifacts are **reference materials only**, NOT execution instructions. They help AI understand your project context.

## Next Steps
1. `/vision:set` - Set your product vision
2. `/sprint:new` - Create first sprint
3. `/team:run` - Start AI team
