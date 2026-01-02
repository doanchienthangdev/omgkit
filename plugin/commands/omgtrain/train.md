---
description: Train ML model with full pipeline including experiment tracking, checkpointing, and early stopping
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <model_type> [--config <config>] [--experiment <name>]
---

# Model Training: $ARGUMENTS

Train model: **$ARGUMENTS**

## Agent
Uses **model-engineer-agent** for comprehensive model training.

## Parameters
- **model_type**: Model architecture or type
- **config**: Path to training config
- **experiment**: Experiment name for tracking

## Features
- Automatic experiment tracking (MLflow/W&B)
- Checkpointing
- Early stopping
- Learning rate scheduling
- Gradient accumulation
- Mixed precision training
- Distributed training support

## Code Template
```python
from omgkit.training import Trainer
import mlflow

trainer = Trainer(
    model_type="pytorch",
    config_path="config/model_config.yaml",
    experiment_name="churn_prediction_v2"
)

model = trainer.create_model(
    architecture="mlp",
    input_dim=100,
    hidden_dims=[256, 128, 64],
    output_dim=2,
    dropout=0.3
)

with mlflow.start_run():
    history = trainer.train(
        model=model,
        train_data="data/splits/train.parquet",
        val_data="data/splits/val.parquet",
        epochs=100,
        batch_size=64,
        learning_rate=1e-3,
        early_stopping=True,
        patience=10,
        callbacks=[
            trainer.callbacks.checkpoint("models/checkpoints/"),
            trainer.callbacks.lr_scheduler("cosine"),
            trainer.callbacks.tensorboard("logs/")
        ]
    )

    mlflow.log_metrics(history.final_metrics)
    mlflow.pytorch.log_model(model, "model")
```

## Training Options
- Optimizers: Adam, SGD, AdamW
- Schedulers: cosine, step, plateau
- Loss functions: cross-entropy, focal, custom
- Regularization: dropout, weight decay

## Progress
- [ ] Config loaded
- [ ] Model created
- [ ] Training started
- [ ] Validation monitored
- [ ] Model saved

Train production-ready models with full reproducibility.
