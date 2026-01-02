---
name: Full ML Lifecycle Workflow
description: Complete end-to-end ML lifecycle workflow orchestrating all phases from problem definition through production monitoring and continuous improvement.
category: ml-systems
complexity: medium
agents:
  - ai-architect-agent
  - data-scientist-agent
  - ml-engineer-agent
  - research-scientist-agent
  - model-optimizer-agent
  - production-engineer-agent
  - mlops-engineer-agent
  - experiment-analyst-agent
---

# Full ML Lifecycle Workflow

End-to-end ML project lifecycle management.

## Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FULL ML LIFECYCLE WORKFLOW                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ PHASE 1: DISCOVERY & PLANNING                                       ││
│  │ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             ││
│  │ │ Problem  │→│ Data     │→│ Feasibility│→│ Project  │             ││
│  │ │ Framing  │  │ Audit    │  │ Study    │  │ Plan     │             ││
│  │ └──────────┘  └──────────┘  └──────────┘  └──────────┘             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ PHASE 2: DATA & FEATURE ENGINEERING                                 ││
│  │ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             ││
│  │ │ Data     │→│ Data     │→│ Feature  │→│ Feature  │             ││
│  │ │ Collection│  │ Prep     │  │ Eng      │  │ Store    │             ││
│  │ └──────────┘  └──────────┘  └──────────┘  └──────────┘             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ PHASE 3: MODEL DEVELOPMENT                                          ││
│  │ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             ││
│  │ │ Baseline │→│ Model    │→│ Hyper-   │→│ Evaluation│             ││
│  │ │ Models   │  │ Training │  │ tuning   │  │          │             ││
│  │ └──────────┘  └──────────┘  └──────────┘  └──────────┘             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ PHASE 4: OPTIMIZATION & DEPLOYMENT                                  ││
│  │ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             ││
│  │ │ Model    │→│ Packaging│→│ Staging  │→│ Production│             ││
│  │ │ Optim    │  │          │  │          │  │          │             ││
│  │ └──────────┘  └──────────┘  └──────────┘  └──────────┘             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                    ↓                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ PHASE 5: OPERATIONS & CONTINUOUS IMPROVEMENT                        ││
│  │ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             ││
│  │ │ Monitoring│→│ Drift    │→│ Retrain  │→│ Iterate  │  ↺          ││
│  │ │          │  │ Detection│  │          │  │          │             ││
│  │ └──────────┘  └──────────┘  └──────────┘  └──────────┘             ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Steps

This workflow consists of 5 major phases:

1. **Phase 1: Discovery & Planning** - Problem framing, data audit, feasibility, project plan
2. **Phase 2: Data & Feature Engineering** - Data collection, preparation, feature engineering
3. **Phase 3: Model Development** - Baseline, training, hyperparameter tuning, evaluation
4. **Phase 4: Optimization & Deployment** - Model optimization, packaging, staging, production
5. **Phase 5: Operations & Continuous Improvement** - Monitoring, drift detection, retraining

## Phase 1: Discovery & Planning

### Step 1.1: Problem Framing
**Agent**: ai-architect-agent

**Actions**:
```bash
# Initialize ML project
/omgml:init <project_name> --template <type>
```

**Deliverables**:
- Problem statement document
- Success metrics definition
- Business requirements
- Constraints and assumptions

**Template**:
```markdown
# ML Project Brief

## Business Problem
[Clear description of the business problem]

## ML Objective
- **Type**: Classification / Regression / Ranking / etc.
- **Target**: [What we're predicting]
- **Success Metric**: [Primary metric, e.g., AUC > 0.85]

## Constraints
- Latency: [e.g., < 100ms p99]
- Throughput: [e.g., 1000 QPS]
- Model Size: [e.g., < 100MB for edge]

## Timeline
- Discovery: Week 1-2
- Development: Week 3-6
- Deployment: Week 7-8
```

### Step 1.2: Data Audit
**Agent**: data-scientist-agent

**Actions**:
```bash
/omgdata:validate --audit --report data_audit.html
```

**Checklist**:
- [ ] Data sources identified
- [ ] Data quality assessed
- [ ] Volume sufficient for ML
- [ ] Labels available or obtainable
- [ ] Privacy/compliance reviewed

### Step 1.3: Feasibility Study
**Agent**: research-scientist-agent

**Actions**:
- Literature review
- Similar problem analysis
- Quick prototyping
- Risk assessment

**Output**:
```python
feasibility = {
    'technical_feasibility': 0.8,  # 0-1 score
    'data_readiness': 0.7,
    'similar_solutions_exist': True,
    'estimated_accuracy': '85-90%',
    'risks': ['data quality', 'concept drift'],
    'recommendation': 'Proceed with Phase 2'
}
```

### Step 1.4: Project Plan
**Agent**: ai-architect-agent

**Deliverables**:
- Architecture design
- Resource requirements
- Timeline and milestones
- Risk mitigation plan

## Phase 2: Data & Feature Engineering

### Step 2.1: Data Collection
**Agent**: ml-engineer-agent

**Actions**:
```bash
/omgdata:collect --sources sources.yaml --output raw/
```

**Workflow**: data-preparation-workflow

### Step 2.2: Data Preparation
**Agent**: data-scientist-agent

**Actions**:
```bash
/omgdata:validate --schema schema.yaml
/omgdata:label --strategy weak_supervision
/omgdata:augment --strategy smote
/omgdata:split --train 0.7 --val 0.15 --test 0.15
```

### Step 2.3: Feature Engineering
**Agent**: data-scientist-agent

**Actions**:
```bash
/omgfeature:extract --config features.yaml
/omgfeature:select --method mutual_info --k 50
```

### Step 2.4: Feature Store
**Agent**: ml-engineer-agent

**Actions**:
```bash
/omgfeature:store --name project_features --version v1
```

## Phase 3: Model Development

### Step 3.1: Baseline Models
**Agent**: data-scientist-agent

**Actions**:
```bash
/omgtrain:baseline --data features.parquet --target label
```

**Workflow**: model-development-workflow

### Step 3.2: Model Training
**Agent**: research-scientist-agent

**Actions**:
```bash
/omgtrain:train --config experiment.yaml
```

### Step 3.3: Hyperparameter Tuning
**Agent**: research-scientist-agent

**Actions**:
```bash
/omgtrain:tune --model xgboost --trials 100
```

**Workflow**: hyperparameter-tuning-workflow

### Step 3.4: Evaluation
**Agent**: experiment-analyst-agent

**Actions**:
```bash
/omgtrain:evaluate --comprehensive --fairness --robustness
/omgtrain:compare --experiments baseline,v1,v2
```

**Workflow**: model-evaluation-workflow

## Phase 4: Optimization & Deployment

### Step 4.1: Model Optimization
**Agent**: model-optimizer-agent

**Actions**:
```bash
/omgoptim:profile --model best_model.pt
/omgoptim:quantize --precision int8
/omgoptim:prune --sparsity 0.5
```

**Workflow**: model-optimization-workflow

### Step 4.2: Packaging
**Agent**: production-engineer-agent

**Actions**:
```bash
/omgdeploy:package --model optimized.pt --handler handler.py
```

### Step 4.3: Staging Deployment
**Agent**: mlops-engineer-agent

**Actions**:
```bash
/omgdeploy:serve --env staging --config staging.yaml
```

### Step 4.4: Production Deployment
**Agent**: mlops-engineer-agent

**Actions**:
```bash
/omgdeploy:cloud --env production --strategy canary
```

**Workflow**: model-deployment-workflow

## Phase 5: Operations & Continuous Improvement

### Step 5.1: Monitoring
**Agent**: mlops-engineer-agent

**Actions**:
```bash
/omgops:monitor --config monitoring.yaml
/omgops:pipeline --action status
```

**Workflow**: monitoring-drift-workflow

### Step 5.2: Drift Detection
**Agent**: experiment-analyst-agent

**Actions**:
```bash
/omgops:drift --reference baseline.parquet --window 7d
```

### Step 5.3: Retraining
**Agent**: ml-engineer-agent

**Actions**:
```bash
/omgops:retrain --trigger drift --priority high
```

**Workflow**: retraining-workflow

### Step 5.4: Continuous Improvement
**Agent**: ai-architect-agent

**Feedback Loop**:
- Collect production feedback
- Analyze failure modes
- Identify improvement opportunities
- Plan next iteration

## Project Governance

### Checkpoints

| Phase | Checkpoint | Approval |
|-------|------------|----------|
| 1 | Feasibility approved | Product + Engineering Lead |
| 2 | Data ready | Data Team Lead |
| 3 | Model meets criteria | ML Team Lead |
| 4 | Staging validated | QA + MLOps |
| 5 | Production stable | All stakeholders |

### Documentation

```
project/
├── docs/
│   ├── problem_statement.md
│   ├── data_dictionary.md
│   ├── model_card.md
│   └── runbook.md
├── reports/
│   ├── feasibility_study.pdf
│   ├── evaluation_report.pdf
│   └── deployment_report.pdf
└── decisions/
    ├── adr-001-model-choice.md
    └── adr-002-deployment-strategy.md
```

## Success Metrics

```python
project_success_criteria = {
    'model_performance': {
        'accuracy': '>= 0.90',
        'f1': '>= 0.85',
        'latency_p99': '<= 100ms'
    },
    'operational': {
        'uptime': '>= 99.9%',
        'drift_detection': '< 24h',
        'retraining_time': '< 4h'
    },
    'business': {
        'adoption_rate': '>= 80%',
        'cost_reduction': '>= 20%',
        'decision_quality': 'improved'
    }
}
```

## Artifacts

- `project_plan.md` - Project documentation
- `architecture.png` - System architecture
- `model_card.md` - Model documentation
- `runbook.md` - Operational procedures
- `decisions/` - Architecture Decision Records

## Related Workflows

This workflow orchestrates:
- data-preparation-workflow
- model-development-workflow
- hyperparameter-tuning-workflow
- model-evaluation-workflow
- model-optimization-workflow
- model-deployment-workflow
- monitoring-drift-workflow
- retraining-workflow

## Quality Gates

- [ ] All steps completed successfully
- [ ] Metrics meet defined thresholds
- [ ] Documentation updated
- [ ] Artifacts versioned and stored
- [ ] Stakeholder approval obtained
