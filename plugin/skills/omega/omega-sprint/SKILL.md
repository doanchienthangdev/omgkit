---
name: omega-sprint
description: AI-native sprint management with autonomous agent orchestration and continuous delivery cycles
category: omega
triggers:
  - omega sprint
  - sprint planning
  - AI team management
  - agent orchestration
  - sprint execution
  - autonomous development
  - team coordination
---

# Omega Sprint

Execute **AI-native sprint management** with autonomous agent orchestration, intelligent task routing, and continuous delivery cycles. This skill provides frameworks for running high-velocity development sprints with AI teams.

## Purpose

Master AI-native sprint execution:

- Plan and execute sprints with AI agent teams
- Route tasks to optimal agents automatically
- Achieve continuous delivery with zero-friction releases
- Maintain quality through automated gates
- Learn and improve sprint-over-sprint
- Scale development capacity infinitely
- Coordinate human-AI collaboration seamlessly

## Features

### 1. AI-Native Sprint Lifecycle

```markdown
## The Omega Sprint Cycle

┌─────────────────────────────────────────────────────────────────────────┐
│                      OMEGA SPRINT LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐         │
│   │  VISION │────→│  PLAN   │────→│ EXECUTE │────→│ DELIVER │         │
│   └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘         │
│        │               │               │               │               │
│        ▼               ▼               ▼               ▼               │
│   Define what      Break into      AI agents      Ship to            │
│   success looks    agent-ready     work in        production         │
│   like             tasks           parallel                           │
│        │               │               │               │               │
│        └───────────────┴───────────────┴───────────────┘               │
│                              │                                          │
│                              ▼                                          │
│                      ┌─────────────┐                                    │
│                      │  RETROSPECT │                                    │
│                      └──────┬──────┘                                    │
│                             │                                           │
│                             ▼                                           │
│                    Learn, adapt, improve                               │
│                    Feed into next sprint                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

Key Differences from Traditional Sprints:
- Tasks sized for AI execution (hours, not days)
- Parallel execution by agent swarm
- Continuous integration throughout
- Automated quality gates
- Zero context-switching cost
```

### 2. Vision Setting Framework

```typescript
/**
 * Sprint Vision: Define what success looks like
 * Clear vision enables autonomous agent decision-making
 */

interface SprintVision {
  // What are we building?
  objective: string;

  // Why does it matter?
  businessValue: string;

  // How do we know we're done?
  successCriteria: SuccessCriterion[];

  // What are the boundaries?
  scope: ScopeDefinition;

  // What quality standards apply?
  qualityGates: QualityGate[];
}

interface SuccessCriterion {
  metric: string;
  target: string | number;
  measurement: 'automated' | 'manual';
}

interface ScopeDefinition {
  included: string[];
  excluded: string[];
  assumptions: string[];
  risks: Risk[];
}

// Vision Template
const sprintVision: SprintVision = {
  objective: "Implement user authentication with OAuth2 providers",

  businessValue: "Enable users to sign in with existing accounts, reducing signup friction by 60%",

  successCriteria: [
    {
      metric: "OAuth providers supported",
      target: 3, // Google, GitHub, Discord
      measurement: "automated"
    },
    {
      metric: "Auth flow completion rate",
      target: "95%",
      measurement: "automated"
    },
    {
      metric: "Security audit passed",
      target: "OWASP compliance",
      measurement: "manual"
    }
  ],

  scope: {
    included: [
      "OAuth2 provider integration",
      "Session management",
      "User profile creation",
      "Token refresh logic"
    ],
    excluded: [
      "Password-based auth",
      "2FA implementation",
      "Admin user management"
    ],
    assumptions: [
      "Database schema already supports user records",
      "Frontend auth UI components exist"
    ],
    risks: [
      {
        description: "OAuth provider API changes",
        probability: "low",
        impact: "medium",
        mitigation: "Use official SDKs with version pinning"
      }
    ]
  },

  qualityGates: [
    { type: 'coverage', threshold: 80 },
    { type: 'security-scan', threshold: 'no-critical' },
    { type: 'performance', threshold: 'p99 < 200ms' }
  ]
};
```

### 3. Intelligent Task Breakdown

```typescript
/**
 * Break vision into agent-executable tasks
 * Tasks should be atomic, testable, and independent
 */

interface SprintTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTokens: number; // AI work estimation
  dependencies: string[];
  acceptanceCriteria: string[];
  suggestedAgent: AgentType;
  testStrategy: TestStrategy;
}

type TaskType =
  | 'feature' // New functionality
  | 'bugfix' // Fix existing issues
  | 'refactor' // Improve code quality
  | 'test' // Add/improve tests
  | 'docs' // Documentation
  | 'research' // Investigation/spike
  | 'config'; // Configuration changes

// Task breakdown algorithm
class TaskBreaker {
  async breakdownFeature(feature: string): Promise<SprintTask[]> {
    const analysis = await this.analyzeFeature(feature);

    return [
      // Layer 1: Foundation
      ...this.generateFoundationTasks(analysis),
      // Layer 2: Core implementation
      ...this.generateImplementationTasks(analysis),
      // Layer 3: Integration
      ...this.generateIntegrationTasks(analysis),
      // Layer 4: Quality
      ...this.generateQualityTasks(analysis)
    ];
  }

  private generateFoundationTasks(analysis: FeatureAnalysis): SprintTask[] {
    return [
      {
        id: 'foundation-types',
        title: 'Define TypeScript interfaces and types',
        description: 'Create type definitions for all new entities and operations',
        type: 'feature',
        priority: 'critical',
        estimatedTokens: 5000,
        dependencies: [],
        acceptanceCriteria: [
          'All interfaces exported',
          'JSDoc comments on all types',
          'Strict mode compliant'
        ],
        suggestedAgent: 'architect',
        testStrategy: { type: 'type-check', coverage: 100 }
      },
      {
        id: 'foundation-schema',
        title: 'Create database schema migrations',
        description: 'Add necessary tables/columns for the feature',
        type: 'feature',
        priority: 'critical',
        estimatedTokens: 3000,
        dependencies: ['foundation-types'],
        acceptanceCriteria: [
          'Migration runs without errors',
          'Rollback tested',
          'Indexes added for query patterns'
        ],
        suggestedAgent: 'fullstack-developer',
        testStrategy: { type: 'migration-test', rollback: true }
      }
    ];
  }

  private generateImplementationTasks(analysis: FeatureAnalysis): SprintTask[] {
    // Generate implementation tasks based on feature analysis
    return analysis.components.map(component => ({
      id: `impl-${component.name}`,
      title: `Implement ${component.name}`,
      description: component.description,
      type: 'feature' as TaskType,
      priority: 'high',
      estimatedTokens: component.complexity * 2000,
      dependencies: component.dependencies,
      acceptanceCriteria: component.acceptance,
      suggestedAgent: this.selectAgent(component),
      testStrategy: { type: 'unit', coverage: 80 }
    }));
  }
}

// Example: OAuth feature breakdown
const oauthTasks: SprintTask[] = [
  {
    id: 'oauth-types',
    title: 'Define OAuth type definitions',
    type: 'feature',
    priority: 'critical',
    estimatedTokens: 3000,
    dependencies: [],
    suggestedAgent: 'architect',
    // ... rest of task definition
  },
  {
    id: 'oauth-google',
    title: 'Implement Google OAuth provider',
    type: 'feature',
    priority: 'high',
    estimatedTokens: 8000,
    dependencies: ['oauth-types'],
    suggestedAgent: 'fullstack-developer',
    // ... rest of task definition
  },
  // Additional parallel tasks...
];
```

### 4. Agent Routing System

```typescript
/**
 * Route tasks to optimal agents based on capabilities
 * Enables parallel execution and specialization
 */

interface AgentProfile {
  type: AgentType;
  capabilities: string[];
  specializations: string[];
  maxConcurrentTasks: number;
  averageTokensPerHour: number;
}

type AgentType =
  | 'architect' // System design, interfaces
  | 'fullstack-developer' // Feature implementation
  | 'frontend-developer' // UI/UX implementation
  | 'backend-developer' // API/server implementation
  | 'debugger' // Bug investigation and fixes
  | 'tester' // Test creation and QA
  | 'docs-manager' // Documentation
  | 'oracle' // Research and analysis
  | 'reviewer'; // Code review

const agentProfiles: Map<AgentType, AgentProfile> = new Map([
  ['architect', {
    type: 'architect',
    capabilities: ['system-design', 'api-design', 'type-definition'],
    specializations: ['distributed-systems', 'performance'],
    maxConcurrentTasks: 2,
    averageTokensPerHour: 15000
  }],
  ['fullstack-developer', {
    type: 'fullstack-developer',
    capabilities: ['feature-implementation', 'integration', 'crud'],
    specializations: ['react', 'node', 'database'],
    maxConcurrentTasks: 3,
    averageTokensPerHour: 20000
  }],
  ['debugger', {
    type: 'debugger',
    capabilities: ['bug-investigation', 'root-cause-analysis', 'hotfix'],
    specializations: ['performance', 'memory', 'race-conditions'],
    maxConcurrentTasks: 2,
    averageTokensPerHour: 12000
  }],
  ['tester', {
    type: 'tester',
    capabilities: ['unit-tests', 'integration-tests', 'e2e-tests'],
    specializations: ['test-strategy', 'mocking', 'coverage'],
    maxConcurrentTasks: 4,
    averageTokensPerHour: 18000
  }]
]);

class AgentRouter {
  private taskQueue: PriorityQueue<SprintTask>;
  private agentPool: Map<AgentType, Agent[]>;

  async routeTask(task: SprintTask): Promise<Agent> {
    // 1. Find capable agents
    const capableAgents = this.findCapableAgents(task);

    // 2. Score agents by fit
    const scoredAgents = capableAgents.map(agent => ({
      agent,
      score: this.calculateFitScore(agent, task)
    }));

    // 3. Select best available agent
    const best = scoredAgents
      .filter(a => a.agent.isAvailable())
      .sort((a, b) => b.score - a.score)[0];

    if (!best) {
      // Queue for next available
      await this.queueForAgent(task, scoredAgents[0].agent.type);
      return this.waitForAgent(task);
    }

    return best.agent;
  }

  private calculateFitScore(agent: Agent, task: SprintTask): number {
    let score = 0;

    // Base capability match
    const profile = agentProfiles.get(agent.type)!;
    const capabilityMatch = this.matchCapabilities(profile, task);
    score += capabilityMatch * 40;

    // Specialization bonus
    const specializationMatch = this.matchSpecializations(profile, task);
    score += specializationMatch * 30;

    // Current load factor
    const loadFactor = 1 - (agent.currentTasks / profile.maxConcurrentTasks);
    score += loadFactor * 20;

    // Context continuity bonus (same feature = less context switching)
    if (agent.hasContextFor(task.relatedFeature)) {
      score += 10;
    }

    return score;
  }
}

// Routing configuration by task type
const routingRules: Record<TaskType, AgentType[]> = {
  feature: ['fullstack-developer', 'frontend-developer', 'backend-developer'],
  bugfix: ['debugger', 'fullstack-developer'],
  refactor: ['architect', 'fullstack-developer'],
  test: ['tester'],
  docs: ['docs-manager'],
  research: ['oracle', 'architect'],
  config: ['fullstack-developer', 'backend-developer']
};
```

### 5. Autonomy Levels & Checkpoints

```typescript
/**
 * Define autonomy levels for sprint execution
 * Balance speed with human oversight
 */

type AutonomyLevel = 'full-auto' | 'semi-auto' | 'supervised' | 'manual';

interface AutonomyConfig {
  level: AutonomyLevel;
  checkpoints: Checkpoint[];
  escalationRules: EscalationRule[];
  approvalRequired: ApprovalTrigger[];
}

interface Checkpoint {
  trigger: CheckpointTrigger;
  action: 'pause' | 'notify' | 'review';
  timeout?: number; // Auto-continue after timeout
}

type CheckpointTrigger =
  | 'task-complete'
  | 'phase-complete'
  | 'error-threshold'
  | 'token-threshold'
  | 'time-threshold'
  | 'security-concern'
  | 'breaking-change';

const autonomyConfigs: Record<AutonomyLevel, AutonomyConfig> = {
  'full-auto': {
    level: 'full-auto',
    checkpoints: [
      { trigger: 'phase-complete', action: 'notify' },
      { trigger: 'error-threshold', action: 'pause' }
    ],
    escalationRules: [
      { condition: 'security-vulnerability', action: 'pause-and-alert' }
    ],
    approvalRequired: ['production-deploy', 'breaking-api-change']
  },

  'semi-auto': {
    level: 'semi-auto',
    checkpoints: [
      { trigger: 'task-complete', action: 'notify' },
      { trigger: 'phase-complete', action: 'review', timeout: 3600 }
    ],
    escalationRules: [
      { condition: 'test-failure', action: 'pause' },
      { condition: 'coverage-drop', action: 'notify' }
    ],
    approvalRequired: ['merge-to-main', 'production-deploy']
  },

  'supervised': {
    level: 'supervised',
    checkpoints: [
      { trigger: 'task-complete', action: 'review' }
    ],
    escalationRules: [
      { condition: 'any-error', action: 'pause' }
    ],
    approvalRequired: ['all-merges', 'all-deploys']
  },

  'manual': {
    level: 'manual',
    checkpoints: [
      { trigger: 'task-complete', action: 'pause' }
    ],
    escalationRules: [],
    approvalRequired: ['every-action']
  }
};

// Sprint execution with autonomy control
class SprintExecutor {
  private autonomy: AutonomyConfig;
  private agents: AgentRouter;

  async executeSprint(
    tasks: SprintTask[],
    autonomyLevel: AutonomyLevel
  ): Promise<SprintResult> {
    this.autonomy = autonomyConfigs[autonomyLevel];

    // Sort tasks by dependency graph
    const orderedTasks = this.topologicalSort(tasks);

    // Group into parallelizable batches
    const batches = this.createParallelBatches(orderedTasks);

    const results: TaskResult[] = [];

    for (const batch of batches) {
      // Execute batch in parallel
      const batchResults = await Promise.all(
        batch.map(task => this.executeTask(task))
      );

      results.push(...batchResults);

      // Check for phase checkpoint
      if (this.isPhaseComplete(batch)) {
        await this.handleCheckpoint('phase-complete', batchResults);
      }
    }

    return this.compileSprintResult(results);
  }

  private async handleCheckpoint(
    trigger: CheckpointTrigger,
    context: unknown
  ): Promise<void> {
    const checkpoint = this.autonomy.checkpoints.find(
      cp => cp.trigger === trigger
    );

    if (!checkpoint) return;

    switch (checkpoint.action) {
      case 'pause':
        await this.pauseAndWaitForApproval(trigger, context);
        break;
      case 'review':
        const approved = await this.requestReview(trigger, context);
        if (!approved && !checkpoint.timeout) {
          await this.pauseAndWaitForApproval(trigger, context);
        }
        break;
      case 'notify':
        await this.sendNotification(trigger, context);
        break;
    }
  }
}
```

### 6. Sprint Metrics & Analytics

```typescript
/**
 * Track sprint performance for continuous improvement
 */

interface SprintMetrics {
  // Velocity
  tasksCompleted: number;
  tasksPlanned: number;
  velocityRatio: number;

  // Quality
  bugsIntroduced: number;
  testCoverage: number;
  codeQualityScore: number;

  // Efficiency
  totalTokensUsed: number;
  tokensPerTask: number;
  parallelizationRatio: number;

  // Time
  cycleTime: Duration;
  leadTime: Duration;
  blockedTime: Duration;

  // Agent performance
  agentUtilization: Map<AgentType, number>;
  agentEfficiency: Map<AgentType, number>;
}

class SprintAnalytics {
  async generateSprintReport(sprintId: string): Promise<SprintReport> {
    const sprint = await this.getSprint(sprintId);
    const tasks = await this.getSprintTasks(sprintId);
    const metrics = await this.calculateMetrics(sprint, tasks);

    return {
      summary: this.generateSummary(metrics),
      metrics,
      insights: this.generateInsights(metrics, sprint),
      recommendations: this.generateRecommendations(metrics)
    };
  }

  private generateInsights(
    metrics: SprintMetrics,
    sprint: Sprint
  ): SprintInsight[] {
    const insights: SprintInsight[] = [];

    // Velocity insights
    if (metrics.velocityRatio < 0.8) {
      insights.push({
        type: 'velocity',
        severity: 'warning',
        message: 'Sprint velocity below target',
        analysis: this.analyzeVelocityDrop(metrics, sprint),
        suggestion: 'Consider smaller task breakdown or capacity adjustment'
      });
    }

    // Quality insights
    if (metrics.bugsIntroduced > sprint.previousBugs) {
      insights.push({
        type: 'quality',
        severity: 'warning',
        message: 'Bug introduction rate increased',
        analysis: this.analyzeBugPatterns(sprint),
        suggestion: 'Review test coverage in affected areas'
      });
    }

    // Efficiency insights
    if (metrics.parallelizationRatio < 0.6) {
      insights.push({
        type: 'efficiency',
        severity: 'info',
        message: 'Low parallelization achieved',
        analysis: 'Many tasks have sequential dependencies',
        suggestion: 'Break down tasks further to enable parallel execution'
      });
    }

    return insights;
  }

  private generateRecommendations(
    metrics: SprintMetrics
  ): SprintRecommendation[] {
    return [
      // Task sizing recommendations
      ...this.taskSizingRecommendations(metrics),
      // Agent allocation recommendations
      ...this.agentAllocationRecommendations(metrics),
      // Process improvement recommendations
      ...this.processRecommendations(metrics)
    ];
  }
}

// Real-time sprint dashboard
interface SprintDashboard {
  currentPhase: SprintPhase;
  progress: ProgressMetrics;
  activeAgents: ActiveAgent[];
  blockers: Blocker[];
  timeline: TimelineEvent[];
}

const dashboardTemplate = `
┌─────────────────────────────────────────────────────────────────────────┐
│                    SPRINT DASHBOARD: ${sprintName}                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PROGRESS                    QUALITY                 AGENTS             │
│  ═════════                   ═══════                 ══════             │
│  ████████░░ 80%              Coverage: 87%          🟢 arch: idle       │
│  24/30 tasks                 Bugs: 2                🔵 dev-1: working   │
│                              Security: ✓            🔵 dev-2: working   │
│  CURRENT PHASE: Execute      Perf: ✓                🟡 tester: queued   │
│                                                                         │
│  TIMELINE                                                               │
│  ════════                                                               │
│  09:00 ───●─── Sprint started                                          │
│  09:15 ───●─── Foundation phase complete                               │
│  11:30 ───●─── Implementation 60%                                      │
│  12:00 ───○─── NOW                                                     │
│  14:00 ───○─── Integration phase (est.)                                │
│  16:00 ───○─── Sprint end (target)                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
`;
```

### 7. Retrospective Framework

```markdown
## Omega Sprint Retrospective

### Sprint Summary
- Sprint: [Name/Number]
- Duration: [Start] - [End]
- Velocity: [X/Y tasks, Z%]
- Quality: [Coverage %, Bugs introduced]

### What Went Well (WWW)
Document successes to replicate:

1. **[Success Title]**
   - What happened: [Description]
   - Why it worked: [Analysis]
   - How to replicate: [Action]

### What Could Improve (WCI)
Document challenges to address:

1. **[Challenge Title]**
   - What happened: [Description]
   - Root cause: [Analysis]
   - Proposed solution: [Action]

### Agent Performance Review

| Agent | Tasks | Tokens | Efficiency | Notes |
|-------|-------|--------|------------|-------|
| architect | 5 | 45K | 95% | Excellent type definitions |
| fullstack-1 | 12 | 180K | 87% | Context switches costly |
| tester | 8 | 72K | 92% | Good coverage strategy |

### Action Items for Next Sprint

| Action | Owner | Priority | Due |
|--------|-------|----------|-----|
| [Action 1] | [Who] | High | Sprint+1 |
| [Action 2] | [Who] | Medium | Sprint+1 |

### Sprint-over-Sprint Trends

```
Velocity:  ▅▆▇█▇ (trending up)
Quality:   ▇▇▇▇█ (stable high)
Efficiency:▄▅▆▇█ (improving)
```

### Key Learnings
1. [Learning that applies to future sprints]
2. [Pattern to encode in agent prompts]
3. [Process improvement to implement]
```

## Use Cases

### Feature Development Sprint

```typescript
/**
 * Complete sprint for building a new feature
 */

async function runFeatureSprint(feature: FeatureRequest): Promise<void> {
  const sprintManager = new SprintManager();

  // Phase 1: Vision
  const vision = await sprintManager.defineVision({
    objective: feature.description,
    successCriteria: feature.acceptance,
    scope: await sprintManager.analyzeScope(feature)
  });

  // Phase 2: Plan
  const tasks = await sprintManager.breakdownTasks(vision);
  await sprintManager.validateDependencies(tasks);
  await sprintManager.estimateCapacity(tasks);

  // Phase 3: Execute
  const result = await sprintManager.executeSprint(tasks, {
    autonomyLevel: 'semi-auto',
    qualityGates: [
      { type: 'test-coverage', threshold: 80 },
      { type: 'no-critical-bugs' },
      { type: 'performance-regression', threshold: '10%' }
    ]
  });

  // Phase 4: Deliver
  if (result.allGatesPassed) {
    await sprintManager.deployToStaging();
    await sprintManager.runSmokeTests();
    await sprintManager.deployToProduction();
  }

  // Phase 5: Retrospect
  const retro = await sprintManager.generateRetrospective(result);
  await sprintManager.applyLearnings(retro);
}
```

### Bug Fix Sprint

```typescript
/**
 * Rapid bug fix sprint with debugging focus
 */

async function runBugFixSprint(bugs: Bug[]): Promise<void> {
  const sprint = new SprintManager();

  // Prioritize by severity
  const prioritized = bugs.sort((a, b) =>
    severityScore(b.severity) - severityScore(a.severity)
  );

  // Route to debugger agents
  const tasks = prioritized.map(bug => ({
    id: `fix-${bug.id}`,
    title: `Fix: ${bug.title}`,
    type: 'bugfix' as TaskType,
    priority: mapSeverityToPriority(bug.severity),
    suggestedAgent: 'debugger' as AgentType,
    acceptanceCriteria: [
      'Bug no longer reproducible',
      'Regression test added',
      'No new bugs introduced'
    ]
  }));

  // Execute with higher oversight for critical bugs
  await sprint.executeSprint(tasks, {
    autonomyLevel: hasCriticalBugs(bugs) ? 'supervised' : 'semi-auto'
  });
}
```

## Best Practices

### Do's

- **Define clear success criteria** before starting the sprint
- **Break tasks small enough** for single-agent execution
- **Enable maximum parallelization** through loose coupling
- **Set appropriate autonomy levels** based on risk
- **Track metrics consistently** for improvement
- **Run retrospectives** after every sprint
- **Encode learnings** into agent prompts
- **Use quality gates** to prevent regressions
- **Maintain sprint rhythm** for predictability
- **Celebrate wins** to build momentum

### Don'ts

- Don't start without clear vision and scope
- Don't create tasks with circular dependencies
- Don't skip quality gates under time pressure
- Don't ignore retrospective insights
- Don't over-commit capacity
- Don't context-switch agents unnecessarily
- Don't deploy without automated tests
- Don't skip the retrospective phase
- Don't let blockers sit unaddressed
- Don't forget to update documentation

## References

- [Agile Manifesto](https://agilemanifesto.org/)
- [Scrum Guide](https://scrumguides.org/)
- [Shape Up](https://basecamp.com/shapeup)
- [Accelerate (DORA Metrics)](https://itrevolution.com/book/accelerate/)
- [Team Topologies](https://teamtopologies.com/)
