---
description: Systematic playtesting workflow for game quality
triggers:
  - manual
  - game:playtest
agents:
  - game-systems-designer
  - tester
---

# Playtesting Workflow

Conduct effective playtesting to improve game quality.

## Prerequisites
- [ ] Playable build available
- [ ] Testing environment set up
- [ ] Playtesters identified

## Phase 1: Playtest Planning

### Step 1.1: Define Objectives
```yaml
agent: game-systems-designer
action: define
objectives:
  types:
    - Usability: Can players figure it out?
    - Fun: Is it enjoyable?
    - Balance: Is difficulty appropriate?
    - Progression: Is pacing good?
    - Polish: What needs refinement?
  specific_questions:
    - List 3-5 specific questions to answer
```

### Step 1.2: Select Playtesters
```yaml
agent: game-systems-designer
action: select
criteria:
  internal:
    - Fresh eyes (haven't seen game)
    - Different skill levels
    - Different gaming preferences
  external:
    - Target audience match
    - Diverse backgrounds
    - Mix of experienced/casual
```

### Step 1.3: Prepare Environment
```yaml
agent: tester
action: setup
environment:
  - Stable build (no known crashes)
  - Consistent hardware
  - Recording setup
  - Observation setup
  - Survey tools
```

## Phase 2: Data Collection Setup

### Step 2.1: Telemetry Implementation
```yaml
agent: tester
action: implement
metrics:
  - Play time per session
  - Deaths/failures per area
  - Resource usage
  - Feature usage
  - Path taken
  - Time per objective
tools:
  - Unity Analytics
  - GameAnalytics
  - Custom telemetry
```

### Step 2.2: Observation Protocol
```yaml
agent: game-systems-designer
action: define
observation:
  - Think-aloud protocol
  - Observer notes template
  - Video/audio recording
  - Screen capture
  - Eye tracking (if available)
```

### Step 2.3: Survey Preparation
```yaml
agent: game-systems-designer
action: prepare
surveys:
  pre_play:
    - Gaming experience
    - Genre preferences
    - Expectations
  during_play:
    - Confusion points
    - Frustration moments
  post_play:
    - Overall enjoyment
    - Difficulty perception
    - Likelihood to continue
    - Feature feedback
```

## Phase 3: Playtest Execution

### Step 3.1: Conduct Sessions
```yaml
agent: tester
action: facilitate
session_structure:
  1. Introduction: Explain process, sign consent
  2. Pre-survey: Background questions
  3. Free play: Minimal guidance
  4. Observation: Note behaviors
  5. Probe questions: Clarify observations
  6. Post-survey: Collect feedback
  7. Debrief: Open discussion
```

### Step 3.2: Documentation
```yaml
agent: tester
action: document
per_session:
  - Timestamp key events
  - Note confusion points
  - Record quotes
  - Mark bugs encountered
  - Note suggestions
```

## Phase 4: Analysis

### Step 4.1: Quantitative Analysis
```yaml
agent: game-systems-designer
action: analyze
metrics:
  - Completion rates
  - Time distributions
  - Failure hotspots
  - Feature adoption
  - Progression curves
visualization:
  - Heat maps
  - Funnel charts
  - Time graphs
```

### Step 4.2: Qualitative Analysis
```yaml
agent: game-systems-designer
action: analyze
methods:
  - Affinity mapping
  - Theme identification
  - Pain point ranking
  - Suggestion categorization
  - Quote compilation
```

### Step 4.3: Insight Synthesis
```yaml
agent: game-systems-designer
action: synthesize
outputs:
  - Key findings summary
  - Priority issues list
  - Actionable recommendations
  - Design questions answered
  - New questions raised
```

## Phase 5: Action Planning

### Step 5.1: Prioritize Findings
```yaml
agent: game-systems-designer
action: prioritize
criteria:
  - Impact on player experience
  - Frequency of occurrence
  - Effort to address
  - Alignment with vision
categories:
  - Critical: Must fix before next test
  - High: Address this iteration
  - Medium: Backlog for future
  - Low: Nice to have
```

### Step 5.2: Create Action Items
```yaml
agent: game-systems-designer
action: plan
per_finding:
  - Issue description
  - Proposed solution
  - Assigned owner
  - Target milestone
  - Validation criteria
```

### Step 5.3: Plan Follow-up Testing
```yaml
agent: game-systems-designer
action: plan
next_playtest:
  - Verify fixes
  - Test new content
  - New questions
  - Different audience segment
```

## Outputs
- [ ] Playtest plan
- [ ] Data collection setup
- [ ] Session recordings
- [ ] Analysis report
- [ ] Action items

## Quality Gates
- Objectives answered
- Representative sample tested
- Data properly collected
- Actionable insights generated
- Follow-up planned
