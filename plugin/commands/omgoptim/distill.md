---
description: Knowledge distillation from teacher model to smaller student model for efficient deployment
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: "[--teacher <path>] [--student_config <config>]"
---

# Knowledge Distillation: $ARGUMENTS

Distill knowledge: **$ARGUMENTS**

## Agent
Uses **performance-engineer-agent** for knowledge distillation.

## Parameters
- **teacher**: Path to teacher (large) model
- **student_config**: Path to student model configuration

## Distillation Types

### Response-Based
- Match soft labels
- Temperature scaling
- KL divergence loss

### Feature-Based
- Match intermediate layers
- Attention transfer
- Hidden state matching

### Relation-Based
- Match pairwise relations
- Graph distillation
- Contrastive learning

## Code Template
```python
from omgkit.optimization import KnowledgeDistiller

distiller = KnowledgeDistiller()

# Define student model (smaller)
student = distiller.create_student(
    architecture="mlp",
    hidden_dims=[64, 32],  # Smaller than teacher
    output_dim=10
)

# Distill
distilled_model = distiller.distill(
    teacher_path="models/teacher_large.pt",
    student=student,
    train_data="data/splits/train.parquet",
    temperature=4.0,
    alpha=0.5,  # Weight for distillation loss
    epochs=50
)

# Compare
distiller.compare(
    teacher="models/teacher_large.pt",
    student=distilled_model,
    test_data="data/splits/test.parquet"
)
```

## Hyperparameters
- **Temperature**: Higher = softer labels (typically 2-10)
- **Alpha**: Balance between hard and soft labels
- **Loss**: KL divergence + cross-entropy

## Benefits
- Smaller model size
- Faster inference
- Lower memory
- Maintained accuracy

## Comparison Output
- Size comparison
- Speed comparison
- Accuracy comparison
- Layer-by-layer analysis

## Progress
- [ ] Teacher loaded
- [ ] Student created
- [ ] Distillation training
- [ ] Quality validated
- [ ] Report generated

Transfer knowledge from large to small model efficiently.
