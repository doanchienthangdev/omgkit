---
description: Create embeddings for text, images, and categorical features using pretrained or custom models
allowed-tools: Task, Read, Write, Bash, Grep, Glob
argument-hint: <data_type> [--model <model>]
---

# Feature Embeddings: $ARGUMENTS

Create embeddings: **$ARGUMENTS**

## Agent
Uses **feature-engineer-agent** for embedding generation.

## Parameters
- **data_type**: text | image | categorical
- **model**: Embedding model name (e.g., sentence-transformers, CLIP)

## Embedding Types

### Text Embeddings
- Sentence Transformers
- OpenAI embeddings
- Cohere embeddings
- Custom fine-tuned models
- Word2Vec/FastText

### Image Embeddings
- CLIP
- ResNet features
- EfficientNet
- ViT (Vision Transformer)

### Categorical Embeddings
- Entity embeddings
- Neural network learned
- Co-occurrence based

## Code Template
```python
from omgkit.features import EmbeddingGenerator

generator = EmbeddingGenerator()

# Text embeddings
text_embeddings = generator.embed(
    data_path="data/processed/texts.parquet",
    data_type="text",
    model="sentence-transformers/all-MiniLM-L6-v2",
    column="description",
    batch_size=32,
    output_path="data/features/text_embeddings.parquet"
)

# Image embeddings
image_embeddings = generator.embed(
    data_path="data/processed/images/",
    data_type="image",
    model="openai/clip-vit-base-patch32",
    batch_size=16,
    output_path="data/features/image_embeddings.parquet"
)

# Categorical embeddings
cat_embeddings = generator.embed(
    data_path="data/processed/categories.parquet",
    data_type="categorical",
    model="entity_embedding",
    columns=["category", "brand", "seller"],
    embedding_dim=32,
    output_path="data/features/cat_embeddings.parquet"
)
```

## Model Options
- OpenAI: text-embedding-ada-002
- Sentence Transformers: all-MiniLM-L6-v2
- CLIP: openai/clip-vit-base-patch32
- Custom: fine-tuned models

## Output
- Embedding vectors
- Metadata mapping
- Dimensionality info
- Quality metrics

## Progress
- [ ] Model loaded
- [ ] Data processed
- [ ] Embeddings generated
- [ ] Quality validated
- [ ] Output saved

Generate dense vector representations for ML tasks.
