---
description: Version data with DVC for reproducibility - commit, checkout, diff, and history operations
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <action> [--message <message>]
---

# Data Version: $ARGUMENTS

Version data: **$ARGUMENTS**

## Agent
Uses **data-engineer-agent** for data versioning with DVC.

## Parameters
- **action**: commit | checkout | diff | history
- **message**: Version commit message

## Actions

### Commit
- Track changes with DVC
- Create git commit with data hash
- Push to remote storage
- Tag version

### Checkout
- Restore specific data version
- Download from remote storage
- Verify data integrity

### Diff
- Compare data versions
- Show added/removed files
- Statistical differences

### History
- Show version history
- List all data commits
- Display metadata

## Code Template
```python
from omgkit.data import DataVersioner

versioner = DataVersioner()

# Commit new version
versioner.commit(
    data_paths=["data/processed/"],
    message="Added augmented training data v1.2",
    tags=["training", "augmented"]
)

# Checkout specific version
versioner.checkout(version="v1.1.0")

# Compare versions
diff = versioner.diff(v1="v1.0.0", v2="v1.2.0")
print(diff)

# Show history
history = versioner.history()
for version in history:
    print(f"{version.tag}: {version.message} ({version.date})")
```

## Best Practices
- Version data with each significant change
- Include meaningful commit messages
- Tag releases for reproducibility
- Link data versions to model versions

## Remote Storage
- S3, GCS, Azure Blob
- SSH/SFTP servers
- Local network storage

## Progress
- [ ] Action validated
- [ ] DVC operation executed
- [ ] Remote synced
- [ ] Git updated
- [ ] Verification complete

Enable full data reproducibility and lineage tracking.
