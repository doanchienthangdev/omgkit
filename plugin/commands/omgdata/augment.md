---
description: Augment data to increase diversity and quantity for image, text, tabular, audio, and timeseries
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <data_type> [--techniques <techniques>] [--factor <factor>]
---

# Data Augmentation: $ARGUMENTS

Augment data: **$ARGUMENTS**

## Agent
Uses **data-engineer-agent** for data augmentation.

## Parameters
- **data_type**: image | text | tabular | audio | timeseries
- **techniques**: Comma-separated list of techniques
- **factor**: Augmentation multiplier (default: 2.0)

## Techniques by Type

### Image
- random_flip, random_rotation
- random_crop, color_jitter
- gaussian_noise, cutout
- mixup, cutmix

### Text
- synonym_replacement
- random_insertion/swap/deletion
- back_translation
- contextual_augmentation (BERT)

### Tabular
- SMOTE for imbalanced data
- noise_injection
- mixup
- feature_permutation

### Audio
- time_stretch, pitch_shift
- add_noise, time_shift
- spectrogram augmentation

### Timeseries
- window_slicing
- magnitude_warping
- time_warping
- jittering

## Code Template
```python
from omgkit.data import DataAugmenter
import albumentations as A

augmenter = DataAugmenter(data_type="image")

transform = augmenter.create_pipeline([
    A.RandomRotate90(p=0.5),
    A.Flip(p=0.5),
    A.RandomBrightnessContrast(p=0.3),
    A.GaussNoise(var_limit=(10, 50), p=0.2),
    A.CoarseDropout(max_holes=8, max_height=32, max_width=32, p=0.3)
])

augmented_data = augmenter.augment(
    data_path="data/processed/train_images/",
    transform=transform,
    factor=3.0,
    output_path="data/augmented/train_images/"
)
```

## Best Practices
- Preserve label integrity
- Match augmentation to task
- Balance augmentation strength
- Validate augmented samples

## Progress
- [ ] Data loaded
- [ ] Techniques configured
- [ ] Augmentation applied
- [ ] Quality validated
- [ ] Output saved

Increase training data diversity while maintaining quality.
