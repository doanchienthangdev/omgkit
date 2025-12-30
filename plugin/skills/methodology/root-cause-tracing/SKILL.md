---
name: root-cause-tracing
description: Systematic root cause analysis using 5 Whys, Fishbone diagrams, and evidence-based investigation
category: methodology
triggers:
  - root cause
  - 5 whys
  - fishbone diagram
  - debugging
  - incident analysis
  - post mortem
  - problem investigation
---

# Root Cause Tracing

Master **systematic root cause analysis** to find the true underlying causes of problems, not just symptoms. This skill provides frameworks for investigating issues deeply and preventing recurrence.

## Purpose

Find and eliminate true root causes:

- Distinguish symptoms from underlying causes
- Use structured investigation methodologies
- Trace causality chains to their origins
- Identify systemic factors that allow problems
- Prevent recurrence through proper fixes
- Document findings for organizational learning
- Build more resilient systems over time

## Features

### 1. The Root Cause Hierarchy

```markdown
## Understanding Cause Layers

┌─────────────────────────────────────────────────────────────────────────┐
│                      ROOT CAUSE HIERARCHY                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  SYMPTOM                                                                │
│  └── What you observe: "App crashed" "Users can't login"               │
│                                                                         │
│  PROXIMATE CAUSE                                                        │
│  └── Direct trigger: "Out of memory" "Database timeout"                │
│                                                                         │
│  CONTRIBUTING FACTORS                                                   │
│  └── Conditions that enabled: "No memory limits" "Slow query"          │
│                                                                         │
│  ROOT CAUSE                                                             │
│  └── Fundamental reason: "Memory leak in event handlers"               │
│                                                                         │
│  SYSTEMIC FACTORS                                                       │
│  └── Why it wasn't caught: "No memory monitoring" "Missing tests"      │
│                                                                         │
│                                                                         │
│  PRINCIPLE: Fix at the deepest level possible                          │
│  - Fixing symptoms: Problem returns                                     │
│  - Fixing proximate cause: Similar problems emerge                     │
│  - Fixing root cause: This specific problem prevented                  │
│  - Fixing systemic factors: Entire class of problems prevented         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. The 5 Whys Technique

```markdown
## 5 Whys: Iterative Causality Tracing

### The Method
Ask "Why?" repeatedly (typically 5 times) until you reach a fundamental cause.

### Example: Production Outage

Problem: Website went down for 2 hours

Why #1: Why did the website go down?
→ The application server ran out of memory and crashed.

Why #2: Why did it run out of memory?
→ The number of active connections grew unbounded.

Why #3: Why did connections grow unbounded?
→ Connection objects weren't being released after use.

Why #4: Why weren't connections being released?
→ The cleanup code in the finally block wasn't being executed
  due to an early return statement.

Why #5: Why wasn't this caught before production?
→ No test existed for the connection cleanup path, and code review
  missed the early return bypassing the finally block.

### Root Causes Identified:
1. Technical: Missing cleanup code execution (fix the bug)
2. Systemic: Missing test coverage for cleanup paths (add tests)
3. Process: Code review didn't catch early-return anti-pattern (add checklist)
```

```typescript
/**
 * 5 Whys Investigation Framework
 */

interface WhyStep {
  question: string;
  answer: string;
  evidence: string[];
  confidence: 'confirmed' | 'likely' | 'hypothesis';
}

interface FiveWhysAnalysis {
  problem: string;
  impactAssessment: ImpactAssessment;
  whys: WhyStep[];
  rootCauses: RootCause[];
  recommendations: Recommendation[];
}

function conductFiveWhys(problem: string): FiveWhysAnalysis {
  const analysis: FiveWhysAnalysis = {
    problem,
    impactAssessment: assessImpact(problem),
    whys: [],
    rootCauses: [],
    recommendations: []
  };

  let currentQuestion = `Why did ${problem}?`;
  let depth = 0;

  while (depth < 5) {
    const answer = investigateQuestion(currentQuestion);
    const evidence = gatherEvidence(answer);

    analysis.whys.push({
      question: currentQuestion,
      answer: answer.text,
      evidence: evidence.sources,
      confidence: evidence.confidence
    });

    // Check if we've reached a root cause
    if (isRootCause(answer)) {
      analysis.rootCauses.push({
        description: answer.text,
        type: classifyRootCause(answer),
        evidence: evidence
      });
    }

    currentQuestion = `Why ${answer.text}?`;
    depth++;
  }

  // Generate recommendations for each root cause
  analysis.recommendations = analysis.rootCauses.map(rc =>
    generateRecommendation(rc)
  );

  return analysis;
}
```

### 3. Fishbone (Ishikawa) Diagram

```markdown
## Fishbone Diagram: Category-Based Analysis

                        ┌──────────────────┐
                        │     PROBLEM      │
                        │  [Symptom Here]  │
                        └────────┬─────────┘
                                 │
    ┌────────────────────────────┼────────────────────────────┐
    │                            │                            │
    │   PEOPLE                   │                PROCESS     │
    │   ──────                   │                ───────     │
    │   • Skill gaps            │                • Missing   │
    │   • Communication         │                  steps     │
    │   • Training              │                • Unclear   │
    │   • Handoffs              │                  ownership │
    │          ╲                 │                 ╱          │
    │           ╲                │                ╱           │
    │            ╲               │               ╱            │
    │             ╲──────────────┼──────────────╱             │
    │              ╲             │             ╱              │
    │               ╲            │            ╱               │
    │                ╲           │           ╱                │
    │                 ╲──────────┼──────────╱                 │
    │                ╱           │           ╲                │
    │               ╱            │            ╲               │
    │              ╱             │             ╲              │
    │             ╱──────────────┼──────────────╲             │
    │            ╱               │               ╲            │
    │           ╱                │                ╲           │
    │          ╱                 │                 ╲          │
    │   TECHNOLOGY              │              ENVIRONMENT   │
    │   ──────────              │              ───────────   │
    │   • Code bugs              │              • Load        │
    │   • Dependencies          │              • Network     │
    │   • Infrastructure        │              • Third-party │
    │   • Configuration         │              • Timing      │
    │                            │                            │
    └────────────────────────────┴────────────────────────────┘

## Software-Specific Categories

1. CODE
   - Logic errors
   - Race conditions
   - Memory leaks
   - Error handling

2. DATA
   - Invalid input
   - Corrupt data
   - Missing data
   - Schema mismatches

3. CONFIGURATION
   - Wrong settings
   - Environment mismatch
   - Secrets/credentials
   - Feature flags

4. INFRASTRUCTURE
   - Resource exhaustion
   - Network issues
   - Service failures
   - Scaling problems

5. EXTERNAL
   - Third-party APIs
   - Dependencies
   - User behavior
   - Attack/abuse

6. PROCESS
   - Missing tests
   - Review gaps
   - Deployment issues
   - Monitoring blind spots
```

### 4. Evidence-Based Investigation

```typescript
/**
 * Evidence-Based Root Cause Investigation
 * Every hypothesis must be backed by data
 */

interface Evidence {
  type: 'log' | 'metric' | 'trace' | 'reproduction' | 'testimony';
  source: string;
  timestamp?: Date;
  data: unknown;
  reliability: 'high' | 'medium' | 'low';
}

interface Hypothesis {
  description: string;
  category: RootCauseCategory;
  evidence: {
    supporting: Evidence[];
    contradicting: Evidence[];
  };
  confidence: number; // 0-1
  testPlan?: string;
}

class RootCauseInvestigator {
  private hypotheses: Hypothesis[] = [];
  private evidence: Evidence[] = [];

  // Step 1: Gather all available evidence
  async gatherEvidence(incident: Incident): Promise<Evidence[]> {
    const evidence: Evidence[] = [];

    // Collect logs around incident time
    const logs = await this.queryLogs({
      startTime: incident.startTime.minus({ minutes: 30 }),
      endTime: incident.endTime.plus({ minutes: 30 }),
      services: incident.affectedServices
    });

    evidence.push(...logs.map(log => ({
      type: 'log' as const,
      source: log.service,
      timestamp: log.timestamp,
      data: log.message,
      reliability: 'high' as const
    })));

    // Collect metrics
    const metrics = await this.queryMetrics({
      metrics: ['error_rate', 'latency_p99', 'memory_usage', 'cpu_usage'],
      startTime: incident.startTime.minus({ hours: 1 }),
      endTime: incident.endTime.plus({ hours: 1 })
    });

    evidence.push(...metrics.map(m => ({
      type: 'metric' as const,
      source: m.name,
      timestamp: m.timestamp,
      data: m.value,
      reliability: 'high' as const
    })));

    // Collect traces for affected requests
    const traces = await this.queryTraces({
      traceIds: incident.affectedTraceIds.slice(0, 100)
    });

    evidence.push(...traces.map(t => ({
      type: 'trace' as const,
      source: t.serviceName,
      data: t.spans,
      reliability: 'high' as const
    })));

    this.evidence = evidence;
    return evidence;
  }

  // Step 2: Generate hypotheses based on evidence
  generateHypotheses(): Hypothesis[] {
    const hypotheses: Hypothesis[] = [];

    // Analyze log patterns
    const errorPatterns = this.findErrorPatterns(this.evidence);
    for (const pattern of errorPatterns) {
      hypotheses.push({
        description: `Error caused by: ${pattern.summary}`,
        category: this.categorizePattern(pattern),
        evidence: {
          supporting: pattern.matchingLogs,
          contradicting: []
        },
        confidence: pattern.frequency / this.evidence.length,
        testPlan: `Reproduce with: ${pattern.reproductionHint}`
      });
    }

    // Analyze metric anomalies
    const anomalies = this.findMetricAnomalies(this.evidence);
    for (const anomaly of anomalies) {
      hypotheses.push({
        description: `Resource issue: ${anomaly.metric} ${anomaly.direction}`,
        category: 'infrastructure',
        evidence: {
          supporting: [anomaly.evidence],
          contradicting: []
        },
        confidence: anomaly.deviation > 3 ? 0.8 : 0.5
      });
    }

    // Sort by confidence
    this.hypotheses = hypotheses.sort((a, b) => b.confidence - a.confidence);
    return this.hypotheses;
  }

  // Step 3: Test hypotheses
  async testHypothesis(hypothesis: Hypothesis): Promise<boolean> {
    if (!hypothesis.testPlan) {
      throw new Error('Hypothesis has no test plan');
    }

    // Attempt to reproduce in safe environment
    const result = await this.runReproduction(hypothesis.testPlan);

    if (result.reproduced) {
      hypothesis.confidence = Math.min(hypothesis.confidence + 0.3, 1);
      hypothesis.evidence.supporting.push({
        type: 'reproduction',
        source: 'test-environment',
        data: result,
        reliability: 'high'
      });
      return true;
    } else {
      hypothesis.confidence *= 0.5;
      return false;
    }
  }
}
```

### 5. Root Cause Analysis Template

```markdown
## Root Cause Analysis Report

### Incident Summary
- **Incident ID:** [INC-XXXX]
- **Date/Time:** [When it occurred]
- **Duration:** [How long it lasted]
- **Severity:** [Critical/High/Medium/Low]
- **Affected Systems:** [What was impacted]
- **User Impact:** [How users were affected]

---

### Timeline

| Time | Event | Source |
|------|-------|--------|
| 09:00 | First error logged | Application logs |
| 09:05 | Alert triggered | Monitoring system |
| 09:15 | Investigation started | On-call engineer |
| 09:30 | Root cause identified | Log analysis |
| 09:45 | Fix deployed | Deployment system |
| 10:00 | Service restored | Health checks |

---

### Symptom
**What was observed:**
[Describe the visible symptoms - error messages, user reports, alerts]

**Evidence:**
- [Log excerpt 1]
- [Metric screenshot 2]
- [User report 3]

---

### Proximate Cause
**Immediate trigger:**
[What directly caused the symptom]

**Evidence:**
- [Supporting evidence]

---

### Root Cause
**Underlying reason:**
[The fundamental cause that, if fixed, prevents recurrence]

**5 Whys Analysis:**
1. Why [symptom]? → [answer]
2. Why [answer 1]? → [answer]
3. Why [answer 2]? → [answer]
4. Why [answer 3]? → [answer]
5. Why [answer 4]? → [ROOT CAUSE]

**Evidence:**
- [Code snippet showing the bug]
- [Configuration showing the misconfiguration]

---

### Systemic Factors
**Why wasn't this caught earlier?**

1. **Testing Gap:** [What test would have caught this?]
2. **Monitoring Gap:** [What alert would have warned us?]
3. **Process Gap:** [What review would have prevented this?]

---

### Action Items

| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| Fix the immediate bug | @engineer | P0 | Today | Done |
| Add regression test | @engineer | P1 | This week | In Progress |
| Add monitoring | @sre | P1 | This week | Not Started |
| Update runbook | @sre | P2 | Next week | Not Started |
| Add code review checklist item | @lead | P2 | Next sprint | Not Started |

---

### Lessons Learned

1. **What we learned:** [Key insight]
2. **What we'll do differently:** [Process change]
3. **Similar risks to address:** [Other areas with same pattern]
```

### 6. Common Root Cause Patterns

```typescript
/**
 * Common root cause patterns in software systems
 */

const commonRootCausePatterns = {
  resourceExhaustion: {
    symptoms: [
      'Out of memory errors',
      'Connection pool exhausted',
      'File descriptor limit reached',
      'Thread pool saturation'
    ],
    commonCauses: [
      'Memory leaks (objects not garbage collected)',
      'Connection leaks (not closing connections)',
      'Unbounded queues or caches',
      'Missing resource limits'
    ],
    investigation: `
      1. Check resource usage metrics over time
      2. Look for steady growth patterns
      3. Identify what's holding resources
      4. Profile memory/connections in staging
    `,
    prevention: [
      'Set explicit resource limits',
      'Implement circuit breakers',
      'Add resource usage monitoring',
      'Use connection pooling with limits'
    ]
  },

  racingConditions: {
    symptoms: [
      'Intermittent failures',
      'Data inconsistency',
      'Deadlocks',
      'Lost updates'
    ],
    commonCauses: [
      'Missing synchronization',
      'Non-atomic operations',
      'Improper lock ordering',
      'Shared mutable state'
    ],
    investigation: `
      1. Look for concurrent access patterns
      2. Check for shared mutable state
      3. Review lock acquisition order
      4. Add detailed tracing to suspect areas
    `,
    prevention: [
      'Use immutable data structures',
      'Implement proper locking',
      'Use atomic operations',
      'Add concurrency tests'
    ]
  },

  cascadingFailures: {
    symptoms: [
      'Multiple services failing',
      'Rapid error propagation',
      'Timeout storms',
      'Complete outage from partial failure'
    ],
    commonCauses: [
      'Missing circuit breakers',
      'Synchronous dependencies',
      'No fallback mechanisms',
      'Shared resource contention'
    ],
    investigation: `
      1. Map the failure propagation path
      2. Identify the initial failure point
      3. Check for missing isolation
      4. Review timeout configurations
    `,
    prevention: [
      'Implement circuit breakers',
      'Add bulkhead patterns',
      'Use async communication',
      'Design for graceful degradation'
    ]
  },

  configurationErrors: {
    symptoms: [
      'Works in one environment, fails in another',
      'Feature behaves unexpectedly',
      'Connection failures',
      'Permission denied'
    ],
    commonCauses: [
      'Environment variable mismatch',
      'Missing or wrong credentials',
      'Feature flag misconfiguration',
      'Resource limits too low'
    ],
    investigation: `
      1. Compare configurations across environments
      2. Check recent configuration changes
      3. Verify secrets are present and correct
      4. Review feature flag states
    `,
    prevention: [
      'Use configuration validation',
      'Implement config diffing',
      'Require config reviews',
      'Test with production-like config'
    ]
  }
};
```

## Use Cases

### Production Incident Investigation

```typescript
async function investigateIncident(incidentId: string): Promise<RCAReport> {
  const investigator = new RootCauseInvestigator();

  // 1. Define the problem clearly
  const incident = await getIncident(incidentId);
  const problem = `${incident.summary} affecting ${incident.userCount} users`;

  // 2. Gather evidence
  await investigator.gatherEvidence(incident);

  // 3. Generate and rank hypotheses
  const hypotheses = investigator.generateHypotheses();

  // 4. Test top hypotheses
  for (const hypothesis of hypotheses.slice(0, 3)) {
    const confirmed = await investigator.testHypothesis(hypothesis);
    if (confirmed) {
      break;
    }
  }

  // 5. Document findings
  return generateRCAReport(investigator);
}
```

## Best Practices

### Do's

- **Gather evidence first** before forming hypotheses
- **Use structured methods** (5 Whys, Fishbone) consistently
- **Involve multiple perspectives** for complex issues
- **Document everything** for future reference
- **Look for systemic factors** not just immediate causes
- **Create actionable recommendations** with owners and deadlines
- **Share learnings** across the organization
- **Verify fixes** actually prevent recurrence

### Don'ts

- Don't stop at the first answer - dig deeper
- Don't blame individuals - look for systemic issues
- Don't skip evidence gathering
- Don't accept "human error" as root cause
- Don't confuse correlation with causation
- Don't rush to solutions before understanding the problem
- Don't ignore near-misses - investigate them too
- Don't let action items go untracked

## References

- [The Toyota Way: 5 Whys](https://en.wikipedia.org/wiki/Five_whys)
- [Ishikawa Diagram](https://en.wikipedia.org/wiki/Ishikawa_diagram)
- [Google SRE: Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [Learning from Incidents](https://www.learningfromincidents.io/)
