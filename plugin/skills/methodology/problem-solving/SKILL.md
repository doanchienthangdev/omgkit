---
name: problem-solving
description: Systematic 5-phase approaches when stuck on complex problems
category: methodology
triggers:
  - stuck
  - blocked
  - can't figure out
  - problem solving
  - not working
  - help me solve
  - troubleshooting
---

# Problem Solving

A **systematic 5-phase framework** for tackling complex problems when conventional approaches fail. This skill provides structured methods to break through blockers and find solutions efficiently.

## Purpose

When you're stuck, random attempts waste time and energy. This skill provides:

- Structured approach to unknown problems
- Multiple hypothesis generation
- Systematic elimination process
- Time-boxed investigation phases
- Clear escalation criteria
- Evidence-based decision making
- Team collaboration patterns

## The 5-Phase Framework

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PROBLEM-SOLVING FRAMEWORK                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────┐    ┌──────────────┐    ┌──────────┐                │
│   │  DEFINE  │───▶│  HYPOTHESIZE │───▶│   TEST   │                │
│   │ (5-10m)  │    │   (10-15m)   │    │ (boxed)  │                │
│   └──────────┘    └──────────────┘    └─────┬────┘                │
│                                              │                      │
│                           ┌──────────────────┘                      │
│                           ▼                                         │
│                    ┌──────────┐    ┌──────────┐                    │
│                    │  SOLVE   │───▶│ PREVENT  │                    │
│                    │  (impl)  │    │(post-fix)│                    │
│                    └──────────┘    └──────────┘                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Define (5-10 minutes)

```
BOUNDARY DEFINITION
==================
What IS the problem:
- [ ] Specific error/behavior observed
- [ ] Exact steps to reproduce
- [ ] When it started occurring
- [ ] Affected scope (users, features, environments)

What is NOT the problem:
- [ ] What still works correctly
- [ ] Unrelated symptoms
- [ ] Red herrings already eliminated

Success criteria:
- [ ] What does "solved" look like?
- [ ] How will we verify the fix?
```

### Phase 2: Hypothesize (10-15 minutes)

```
HYPOTHESIS GENERATION (minimum 3)
================================
H1: [Most likely] ________________________
    Evidence for: ________________________
    Evidence against: ____________________
    Test cost: Low / Medium / High

H2: [Second likely] ______________________
    Evidence for: ________________________
    Evidence against: ____________________
    Test cost: Low / Medium / High

H3: [Unlikely but possible] ______________
    Evidence for: ________________________
    Evidence against: ____________________
    Test cost: Low / Medium / High

RULE: Generate hypotheses BEFORE testing any of them.
```

### Phase 3: Test (Time-boxed per hypothesis)

```
HYPOTHESIS TESTING ORDER
========================
Sort by: (Evidence strength) × (1 / Test cost)

Test H1: [15 min box]
  Action: ________________________________
  Result: CONFIRMED / ELIMINATED / INCONCLUSIVE
  If inconclusive: Need more data on __________

Test H2: [15 min box]
  Action: ________________________________
  Result: CONFIRMED / ELIMINATED / INCONCLUSIVE

STOP when: Hypothesis confirmed OR all eliminated
```

### Phase 4: Solve (Implementation)

```
SOLUTION IMPLEMENTATION
=======================
Root cause: ______________________________
Solution approach: _______________________

Implementation checklist:
- [ ] Write the fix
- [ ] Verify fix addresses root cause (not symptom)
- [ ] Check for side effects
- [ ] Add test to prevent regression
- [ ] Document the issue and solution
```

### Phase 5: Prevent (Post-mortem)

```
PREVENTION ANALYSIS
===================
Why did this happen?
- Immediate cause: _______________________
- Contributing factors: __________________
- Systemic issues: _______________________

How do we prevent recurrence?
- [ ] Code changes
- [ ] Process changes
- [ ] Monitoring/alerting
- [ ] Documentation updates
```

## Features

### 1. Root Cause Hypothesis Generator

```typescript
interface Hypothesis {
  id: string;
  description: string;
  category: HypothesisCategory;
  evidenceFor: string[];
  evidenceAgainst: string[];
  testCost: 'low' | 'medium' | 'high';
  probability: number;
  status: 'pending' | 'confirmed' | 'eliminated' | 'inconclusive';
}

type HypothesisCategory =
  | 'data'
  | 'configuration'
  | 'timing'
  | 'resources'
  | 'external'
  | 'code_logic'
  | 'integration';

const hypothesisCategories: Record<HypothesisCategory, string[]> = {
  data: [
    'Invalid input data',
    'Data corruption',
    'Missing required data',
    'Encoding/format mismatch',
    'Stale/cached data'
  ],
  configuration: [
    'Environment variable missing',
    'Config file incorrect',
    'Feature flag state',
    'Permission misconfiguration',
    'Version mismatch'
  ],
  timing: [
    'Race condition',
    'Timeout too short',
    'Order of operations',
    'Async/await issue',
    'Deadlock'
  ],
  resources: [
    'Memory exhaustion',
    'Disk space',
    'Connection pool depleted',
    'Rate limiting',
    'CPU throttling'
  ],
  external: [
    'Third-party service down',
    'Network connectivity',
    'DNS resolution',
    'Certificate expiry',
    'API contract change'
  ],
  code_logic: [
    'Off-by-one error',
    'Null pointer exception',
    'Type coercion issue',
    'Boundary condition',
    'Logic inversion'
  ],
  integration: [
    'Version incompatibility',
    'Protocol mismatch',
    'Authentication failure',
    'Serialization error',
    'Schema drift'
  ]
};

class HypothesisEngine {
  private hypotheses: Map<string, Hypothesis> = new Map();

  generateFromSymptoms(symptoms: string[]): Hypothesis[] {
    const generated: Hypothesis[] = [];

    for (const category of Object.keys(hypothesisCategories) as HypothesisCategory[]) {
      const templates = hypothesisCategories[category];
      for (const template of templates) {
        if (this.matchesSymptoms(template, symptoms)) {
          generated.push({
            id: `${category}-${generated.length}`,
            description: template,
            category,
            evidenceFor: this.findSupportingEvidence(template, symptoms),
            evidenceAgainst: [],
            testCost: this.estimateTestCost(category),
            probability: 0,
            status: 'pending'
          });
        }
      }
    }

    return this.rankByPriority(generated);
  }

  private matchesSymptoms(template: string, symptoms: string[]): boolean {
    const keywords = template.toLowerCase().split(/\s+/);
    return symptoms.some(s =>
      keywords.some(k => s.toLowerCase().includes(k))
    );
  }

  private findSupportingEvidence(template: string, symptoms: string[]): string[] {
    return symptoms.filter(s =>
      template.toLowerCase().split(/\s+/).some(k =>
        s.toLowerCase().includes(k)
      )
    );
  }

  private estimateTestCost(category: HypothesisCategory): 'low' | 'medium' | 'high' {
    const costs: Record<HypothesisCategory, 'low' | 'medium' | 'high'> = {
      configuration: 'low',
      data: 'low',
      code_logic: 'medium',
      timing: 'high',
      resources: 'medium',
      external: 'low',
      integration: 'medium'
    };
    return costs[category];
  }

  private rankByPriority(hypotheses: Hypothesis[]): Hypothesis[] {
    return hypotheses.sort((a, b) => {
      // Priority = Evidence × (1 / Cost)
      const costMultiplier = { low: 3, medium: 2, high: 1 };
      const aScore = a.evidenceFor.length * costMultiplier[a.testCost];
      const bScore = b.evidenceFor.length * costMultiplier[b.testCost];
      return bScore - aScore;
    });
  }
}
```

### 2. Decision Tree Construction

```
START: Error occurs
  │
  ├── Is it reproducible?
  │     │
  │     ├── YES: Proceed to isolation
  │     │
  │     └── NO: Focus on logging/monitoring
  │           │
  │           ├── Add debug logging
  │           ├── Wait for recurrence
  │           └── Analyze patterns
  │
  └── Can you isolate the component?
        │
        ├── YES: Deep dive that component
        │
        └── NO: Binary search approach
              │
              ├── Disable half the system
              ├── Does error persist?
              └── Narrow down iteratively
```

### 3. Risk Assessment Matrix

```
┌────────────┬─────────────┬────────┬─────────────┬──────────┐
│ Hypothesis │ Probability │ Impact │ Test Effort │ Priority │
├────────────┼─────────────┼────────┼─────────────┼──────────┤
│ H1         │ High        │ High   │ Low         │ 1st      │
│ H2         │ Medium      │ High   │ Medium      │ 2nd      │
│ H3         │ Low         │ High   │ Low         │ 3rd      │
│ H4         │ High        │ Low    │ High        │ 4th      │
└────────────┴─────────────┴────────┴─────────────┴──────────┘
```

### 4. Time-Boxing Templates

```
INVESTIGATION TIME BOX: 2 hours total

Phase 1 (Define):      15 min  [■■■□□□□□□□□□]
Phase 2 (Hypothesize): 15 min  [■■■□□□□□□□□□]
Phase 3 (Test):        60 min  [■■■■■■■■■■■■]
Phase 4 (Solve):       20 min  [■■■■□□□□□□□□]
Phase 5 (Prevent):     10 min  [■■□□□□□□□□□□]

ESCALATION TRIGGER: If no progress after Phase 3, escalate.
```

### 5. Problem Solving State Machine

```typescript
interface ProblemState {
  phase: Phase;
  problem: ProblemDefinition;
  hypotheses: Hypothesis[];
  testResults: TestResult[];
  solution?: Solution;
  prevention?: PreventionPlan;
}

type Phase = 'define' | 'hypothesize' | 'test' | 'solve' | 'prevent';

interface ProblemDefinition {
  description: string;
  symptoms: string[];
  stepsToReproduce: string[];
  startedWhen: Date;
  affectedScope: string[];
  workingComponents: string[];
  successCriteria: string[];
}

interface TestResult {
  hypothesisId: string;
  action: string;
  result: 'confirmed' | 'eliminated' | 'inconclusive';
  evidence: string;
  duration: number;
}

interface Solution {
  rootCause: string;
  approach: string;
  implementation: string[];
  sideEffects: string[];
  regressionTest: string;
}

interface PreventionPlan {
  immediateCause: string;
  contributingFactors: string[];
  systemicIssues: string[];
  codeChanges: string[];
  processChanges: string[];
  monitoring: string[];
  documentation: string[];
}

class ProblemSolver {
  private state: ProblemState;
  private timeBox: Map<Phase, number>;

  constructor(problem: ProblemDefinition) {
    this.state = {
      phase: 'define',
      problem,
      hypotheses: [],
      testResults: []
    };

    this.timeBox = new Map([
      ['define', 10 * 60 * 1000],      // 10 minutes
      ['hypothesize', 15 * 60 * 1000], // 15 minutes
      ['test', 60 * 60 * 1000],        // 60 minutes
      ['solve', 20 * 60 * 1000],       // 20 minutes
      ['prevent', 10 * 60 * 1000]      // 10 minutes
    ]);
  }

  transitionTo(phase: Phase): void {
    const validTransitions: Record<Phase, Phase[]> = {
      define: ['hypothesize'],
      hypothesize: ['test', 'define'],
      test: ['solve', 'hypothesize'],
      solve: ['prevent', 'test'],
      prevent: []
    };

    if (!validTransitions[this.state.phase].includes(phase)) {
      throw new Error(
        `Invalid transition: ${this.state.phase} → ${phase}`
      );
    }

    this.state.phase = phase;
  }

  addHypothesis(h: Hypothesis): void {
    if (this.state.phase !== 'hypothesize') {
      throw new Error('Can only add hypotheses in hypothesize phase');
    }
    this.state.hypotheses.push(h);
  }

  recordTestResult(result: TestResult): void {
    if (this.state.phase !== 'test') {
      throw new Error('Can only record tests in test phase');
    }

    const hypothesis = this.state.hypotheses.find(
      h => h.id === result.hypothesisId
    );
    if (hypothesis) {
      hypothesis.status = result.result;
    }

    this.state.testResults.push(result);

    // Auto-transition if confirmed
    if (result.result === 'confirmed') {
      this.transitionTo('solve');
    }
  }

  shouldEscalate(): boolean {
    const allEliminated = this.state.hypotheses.every(
      h => h.status === 'eliminated'
    );
    const hasConfirmed = this.state.hypotheses.some(
      h => h.status === 'confirmed'
    );

    return allEliminated && !hasConfirmed;
  }
}
```

## Use Cases

### Stuck on Implementation

```
PROBLEM: Feature works locally but fails in staging

Phase 1 - Define:
  - Works: Local dev environment
  - Fails: Staging environment
  - Error: "Connection refused to service X"
  - Started: After last deployment

Phase 2 - Hypothesize:
  H1: Environment variable not set in staging
  H2: Network policy blocking connection
  H3: Service X not deployed to staging
  H4: Different service discovery mechanism

Phase 3 - Test:
  H1 Test: Check env vars → MISSING API_URL! ✓ CONFIRMED

Phase 4 - Solve:
  - Add API_URL to staging config
  - Verify connection works
  - Add config validation on startup

Phase 5 - Prevent:
  - Add env var validation script to CI
  - Document all required env vars
```

### Performance Bottleneck

```
PROBLEM: API response time degraded from 100ms to 2s

Phase 1 - Define:
  - Specific: GET /api/users endpoint
  - Started: Monday after deployment
  - Scope: All users, all requests

Phase 2 - Hypothesize:
  H1: N+1 query introduced
  H2: Missing database index
  H3: External API slowdown
  H4: Resource contention

Phase 3 - Test:
  H1: Query count check → 1 query, not N+1
  H2: EXPLAIN ANALYZE → Full table scan! ✓ CONFIRMED

Phase 4 - Solve:
  - Add index on users.organization_id
  - Response time: 2s → 50ms

Phase 5 - Prevent:
  - Add query performance tests
  - Require EXPLAIN for new queries in PR review
```

### Integration Failures

```
PROBLEM: Webhook deliveries failing intermittently

Phase 1 - Define:
  - Failure rate: ~5% of webhooks
  - No pattern in time/endpoint
  - Error: Timeout after 30s
  - Started: Gradual increase over 2 weeks

Phase 2 - Hypothesize:
  H1: Receiving servers slow
  H2: Our server resource exhaustion
  H3: Network issues
  H4: Payload size growth

Phase 3 - Test:
  H1: Check receiving server logs → Mixed results
  H2: Monitor our CPU/memory → Normal
  H3: Network packet loss test → Normal
  H4: Analyze payload sizes → 10x increase! ✓ CONFIRMED

Phase 4 - Solve:
  - Compress payloads
  - Increase timeout for large payloads
  - Add pagination for large datasets

Phase 5 - Prevent:
  - Add payload size monitoring
  - Set alerts for size thresholds
```

### Memory Leak Investigation

```
PROBLEM: Node.js service memory grows until crash

Phase 1 - Define:
  - Symptoms: Memory increases linearly, crashes at 4GB
  - Frequency: Every 6-8 hours under load
  - Started: After v2.1.0 release
  - Scope: All production instances

Phase 2 - Hypothesize:
  H1: Event listener not removed
  H2: Large object retained in closure
  H3: Cache without size limit
  H4: Stream not properly closed

Phase 3 - Test:
  H1: Heap snapshot shows listener growth → No
  H2: Check closures in new code → No obvious issues
  H3: Inspect cache sizes → Found it! 10M+ entries
  H4: Check stream handling → OK

Phase 4 - Solve:
  - Add LRU eviction to cache (max 100K entries)
  - Add cache stats endpoint for monitoring
  - Implement cache TTL

Phase 5 - Prevent:
  - Add memory usage tests
  - Alert when cache exceeds thresholds
  - Document cache sizing guidelines
```

## Best Practices

### Do's
- **Generate multiple hypotheses** before testing any
- **Test cheapest hypothesis first** when evidence is equal
- **Time-box each phase** to prevent rabbit holes
- **Document failed approaches** - they're valuable data
- **Escalate when time-boxed out** - don't hero-code
- **Verify root cause** not just symptoms
- **Add regression tests** for every fix

### Don'ts
- Don't test the first idea that comes to mind
- Don't spend 4 hours on 1 hypothesis
- Don't discard hypotheses without testing
- Don't fix symptoms without understanding root cause
- Don't skip the prevention phase
- Don't assume a fix works without verification
- Don't forget to document the solution

### Escalation Criteria

```
ESCALATE WHEN:
- [ ] Time box exceeded with no progress
- [ ] All hypotheses eliminated but problem persists
- [ ] Problem scope larger than initially understood
- [ ] Required access/knowledge not available
- [ ] Business impact exceeds threshold

ESCALATION FORMAT:
"I've investigated [problem] for [time].
 Tested hypotheses: [H1, H2, H3]
 Current status: [findings]
 Blocker: [what's needed]
 Ask: [specific help needed]"
```

### Collaboration Patterns

```typescript
interface EscalationRequest {
  problem: string;
  timeInvested: string;
  testedHypotheses: {
    hypothesis: string;
    result: string;
  }[];
  currentStatus: string;
  blocker: string;
  specificAsk: string;
}

function formatEscalation(req: EscalationRequest): string {
  return `
## Escalation: ${req.problem}

### Time Invested
${req.timeInvested}

### Hypotheses Tested
${req.testedHypotheses.map(h =>
  `- **${h.hypothesis}**: ${h.result}`
).join('\n')}

### Current Status
${req.currentStatus}

### Blocker
${req.blocker}

### Specific Ask
${req.specificAsk}
  `.trim();
}
```

## References

- **systematic-debugging** - Four-phase debugging with 95% fix rate
- **root-cause-tracing** - Deep investigation techniques
- **sequential-thinking** - Structure reasoning as numbered thoughts
- **brainstorming** - Generate more hypotheses
- **verification-before-completion** - Ensure fix is complete
- **testing-anti-patterns** - Avoid common testing mistakes

## Integration

Works seamlessly with debugging workflows:

```
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION FLOW                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Bug reported                                            │
│        ↓                                                    │
│  problem-solving Phase 1 (Define)                           │
│        ↓                                                    │
│  2. Reproduce                                               │
│        ↓                                                    │
│  systematic-debugging Phase 1 (Reproduce)                   │
│        ↓                                                    │
│  3. Investigate                                             │
│        ↓                                                    │
│  problem-solving Phases 2-3 (Hypothesize, Test)            │
│        ↓                                                    │
│  4. Fix                                                     │
│        ↓                                                    │
│  systematic-debugging Phase 3 (Fix)                         │
│        ↓                                                    │
│  5. Verify                                                  │
│        ↓                                                    │
│  verification-before-completion                             │
│        ↓                                                    │
│  6. Prevent                                                 │
│        ↓                                                    │
│  problem-solving Phase 5 (Prevent)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
