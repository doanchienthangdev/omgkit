---
description: Initialize ML project with standard structure, configs, experiment tracking, and best practices
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <project_type> [--template <template>]
---

# ML Project Init: $ARGUMENTS

Initialize ML project: **$ARGUMENTS**

## Agent
Uses **ml-engineer** agent with data engineering skills.

## Parameters
- **project_type**: classification | regression | detection | segmentation | nlp | timeseries | recommendation
- **template**: minimal | standard | production | research (default: standard)

## Project Structure Created
```
project/
├── config/
│   ├── config.yaml           # Main config
│   ├── model_config.yaml     # Model hyperparameters
│   └── data_config.yaml      # Data processing config
├── data/
│   ├── raw/                  # Raw data
│   ├── processed/            # Processed data
│   ├── features/             # Feature store
│   └── .dvc/                 # DVC tracking
├── src/
│   ├── data/                 # Data processing
│   ├── features/             # Feature engineering
│   ├── models/               # Model definitions
│   ├── training/             # Training scripts
│   └── serving/              # Inference code
├── notebooks/                # Jupyter notebooks
├── tests/                    # Unit tests
├── pipelines/                # CI/CD pipelines
├── mlruns/                   # MLflow tracking
└── artifacts/                # Model artifacts
```

## Actions
1. Create standard directory structure
2. Generate configuration files
3. Setup experiment tracking (MLflow/W&B)
4. Initialize DVC for data versioning
5. Create README with project guidelines
6. Setup virtual environment
7. Install base dependencies

## Progress
- [ ] Directory structure created
- [ ] Config files generated
- [ ] Experiment tracking setup
- [ ] DVC initialized
- [ ] README created
- [ ] Environment configured

Initialize with best practices for production ML.
