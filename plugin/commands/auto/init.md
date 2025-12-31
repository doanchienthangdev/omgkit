---
description: Initialize autonomous project with guided discovery brainstorming
allowed-tools: Task, Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion
argument-hint: <project idea or name>
---

# Autonomous Project Initialization

Initialize and discover requirements for: **$ARGUMENTS**

## Your Role

You are conducting a **Big-Tech level requirements discovery session**. Your goal is to deeply understand what the user wants to build before any code is written.

## Process Overview

1. **Welcome & Context** - Understand the initial idea
2. **Stage 1: Vision** - Why are we building this?
3. **Stage 2: Users** - Who will use it?
4. **Stage 3: Features** - What will it do?
5. **Stage 4: Technical** - How will it be built?
6. **Stage 5: Risks** - What could go wrong?
7. **Generate PRD** - Synthesize into formal document
8. **Initialize State** - Set up project structure

## Discovery Interview Guidelines

### How to Ask Questions

1. **Present options clearly** - Use the format:
   ```
   A. Option Name - Description
   B. Option Name - Description
   C. Option Name - Description
   D. Other - [Your custom answer]
   ```

2. **Allow open-ended responses** - Always include "Other" option

3. **Ask follow-up questions** - Dig deeper on important answers

4. **Summarize understanding** - Confirm before moving on

5. **Be conversational** - This is a dialogue, not an interrogation

### Question Flow

Load questions from: `plugin/templates/autonomous/discovery-questions.yaml`

For each stage:
1. Introduce the stage and its purpose
2. Ask questions one at a time (or in logical groups)
3. Adapt based on previous answers
4. Summarize before moving to next stage

### Adaptive Logic

- If **project_type = api** → Skip frontend questions
- If **project_type = cli** → Skip frontend and database scaling questions
- If **business_model = open_source** → Skip payment questions
- If **timeline = asap** → Focus only on MVP-essential questions
- If **user_scale = massive** → Add scalability deep-dive

## Stage 1: Vision & Strategic Context

Ask about:
- Problem being solved (with follow-ups)
- Solution vision
- Project type (SaaS, API, CLI, Library, Fullstack, Mobile)
- Business model
- What makes it different
- Timeline and constraints

## Stage 2: Users & Personas

Ask about:
- Primary user role and technical level
- What they want to achieve
- Their frustrations with current solutions
- Secondary user types
- Expected user scale
- Geographic distribution

## Stage 3: Features & Scope

Ask about:
- Core features (P0 must-haves)
- Feature categories (auth, payments, notifications, etc.)
- Nice-to-have features (P2)
- What's explicitly OUT of scope
- Non-functional requirements (performance, security, accessibility)
- Success metrics

## Stage 4: Technical Context

Ask about:
- Frontend framework preference
- Backend language/framework preference
- Database preference
- Authentication approach
- Hosting preference
- Payment provider (if applicable)
- External integrations
- Data requirements

## Stage 5: Risk Assessment

Ask about:
- Biggest technical risk
- Biggest market/business risk
- Key assumptions
- Validation approach
- MVP definition
- Launch criteria

## After Discovery

### 1. Generate PRD

Create comprehensive PRD at `.omgkit/generated/prd.md`:
- Use template from `plugin/templates/autonomous/prd-template.md`
- Fill in all sections from discovery answers
- Include all feature specifications
- Document technical decisions

### 2. Generate Technical Spec

Create technical specification at `.omgkit/generated/technical-spec.md`:
- Technology stack decisions with rationale
- High-level architecture
- Data model overview
- API surface overview
- Security considerations

### 3. Recommend Archetype

Based on project_type, recommend appropriate archetype:
- saas-mvp → SaaS Platform
- api-service → API Service
- cli-tool → CLI Tool
- library → Library/SDK
- fullstack-app → Full-Stack Application

### 4. Initialize State

Create `.omgkit/state.yaml`:
```yaml
version: 1
project:
  name: "[project name]"
  type: "[project type]"
  archetype: "[recommended archetype]"
  created_at: "[timestamp]"

phase: "discovery"
status: "checkpoint"

checkpoint:
  pending: true
  type: "phase"
  description: "Discovery complete. Review PRD before planning."

progress:
  phases_completed: ["discovery"]
  features_completed: []
```

### 5. Save Discovery Answers

Save raw answers at `.omgkit/generated/discovery-answers.yaml` for reference.

### 6. Initialize Memory

Create initial memory structure:
```
.omgkit/memory/
├── context/
│   └── project-brief.md
├── decisions/
└── journal/
    └── [date]-discovery.md
```

## Output Format

After completing discovery:

```
## Discovery Complete!

I've gathered comprehensive requirements for [Project Name].

### Summary
- **Project Type:** [type]
- **Business Model:** [model]
- **Timeline:** [timeline]
- **Primary User:** [user]

### Key Features (P0)
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

### Technical Stack (Recommended)
- Frontend: [framework]
- Backend: [framework]
- Database: [database]
- Hosting: [platform]

### Generated Artifacts
- `.omgkit/generated/prd.md` - Full PRD
- `.omgkit/generated/technical-spec.md` - Technical specification
- `.omgkit/generated/discovery-answers.yaml` - Raw answers
- `.omgkit/state.yaml` - Project state

### Next Steps
1. Review the PRD carefully
2. Run `/auto:approve` to proceed to planning
3. Or provide feedback to refine requirements

**CHECKPOINT:** Please review the PRD and approve to continue.
```

## Important Notes

1. **Never rush** - Take time to fully understand requirements
2. **Ask clarifying questions** - Don't assume
3. **Capture everything** - Better to have too much info than too little
4. **Be specific** - Vague requirements lead to vague implementations
5. **Confirm understanding** - Summarize back to the user
6. **Stay conversational** - This is a collaborative discovery

## Example Interaction

```
User: /auto:init freelancer invoicing app