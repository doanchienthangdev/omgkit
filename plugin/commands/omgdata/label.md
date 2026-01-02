---
description: Label data using manual annotation, weak supervision, active learning, or automated labeling
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <strategy> [--config <config>]
---

# Data Labeling: $ARGUMENTS

Label data using: **$ARGUMENTS**

## Agent
Uses **data-engineer-agent** for data labeling workflows.

## Parameters
- **strategy**: manual | weak_supervision | active_learning | auto_label
- **config**: Path to labeling configuration

## Labeling Strategies

### Manual
- Export to Label Studio format
- Human annotation interface
- Quality assurance workflows
- Inter-annotator agreement

### Weak Supervision
- Labeling functions with Snorkel
- Programmatic labeling rules
- Probabilistic label model
- Noise-aware training

### Active Learning
- Uncertainty sampling
- Query-by-committee
- Prioritized labeling queue
- Model-in-the-loop

### Auto Label
- Pretrained model inference
- Confidence thresholding
- Human review for low confidence
- Continuous improvement

## Code Template
```python
from omgkit.data import DataLabeler

labeler = DataLabeler(strategy="weak_supervision")

@labeler.labeling_function()
def lf_keyword_spam(x):
    spam_keywords = ["free", "win", "click here", "urgent"]
    if any(kw in x.text.lower() for kw in spam_keywords):
        return "SPAM"
    return "ABSTAIN"

@labeler.labeling_function()
def lf_length(x):
    if len(x.text) < 10:
        return "SPAM"
    return "ABSTAIN"

labels = labeler.label(
    data_path="data/raw/emails.parquet",
    labeling_functions=[lf_keyword_spam, lf_length],
    output_path="data/labeled/emails_labeled.parquet"
)
```

## Metrics
- Label coverage
- Label accuracy (if ground truth available)
- Annotator agreement
- Model confidence distribution

## Progress
- [ ] Strategy configured
- [ ] Labeling functions defined
- [ ] Labels generated
- [ ] Quality assessed
- [ ] Output saved

Maximize label quality with minimal manual effort.
