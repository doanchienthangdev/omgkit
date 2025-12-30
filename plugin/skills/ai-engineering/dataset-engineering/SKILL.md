---
name: dataset-engineering
description: Building and processing datasets - data quality, curation, deduplication, synthesis, annotation, formatting. Use when creating training data, improving data quality, or generating synthetic data.
---

# Dataset Engineering Skill

Building high-quality datasets for AI applications.

## Data Quality Dimensions

| Dimension | Description | Check |
|-----------|-------------|-------|
| Accuracy | Data is correct | Validation |
| Completeness | No missing values | Schema check |
| Consistency | No contradictions | Dedup |
| Timeliness | Up-to-date | Timestamps |
| Relevance | Matches use case | Filtering |

## Data Curation Pipeline

```python
class DataCurationPipeline:
    def run(self, raw_data):
        # 1. Inspect
        self.inspect(raw_data)

        # 2. Deduplicate
        data = self.deduplicator.dedupe(raw_data)

        # 3. Clean and filter
        data = self.cleaner.clean(data)
        data = self.filter.filter(data)

        # 4. Format
        return self.formatter.format(data)
```

## Deduplication

```python
from datasketch import MinHash, MinHashLSH

class Deduplicator:
    def __init__(self, threshold=0.8):
        self.lsh = MinHashLSH(threshold=threshold, num_perm=128)

    def minhash(self, text):
        m = MinHash(num_perm=128)
        for word in text.split():
            m.update(word.encode('utf8'))
        return m

    def dedupe(self, docs):
        unique = []
        for i, doc in enumerate(docs):
            mh = self.minhash(doc["text"])
            if not self.lsh.query(mh):
                self.lsh.insert(f"doc_{i}", mh)
                unique.append(doc)
        return unique
```

## Data Synthesis

### AI-Powered QA Generation
```python
def generate_qa(document, model, n=5):
    prompt = f"""Generate {n} QA pairs from:

{document}

Format: [{{"question": "...", "answer": "..."}}]"""

    return json.loads(model.generate(prompt))
```

### Self-Instruct
```python
def self_instruct(seeds, model, n=100):
    generated = []

    for _ in range(n):
        samples = random.sample(seeds + generated[-20:], 5)
        prompt = f"Examples:\n{format(samples)}\n\nNew task:"

        new = model.generate(prompt)
        if is_valid(new) and is_diverse(new, generated):
            generated.append(new)

    return generated
```

### Data Augmentation
```python
def augment_text(text):
    methods = [
        lambda t: synonym_replace(t),
        lambda t: back_translate(t),
        lambda t: model.rephrase(t)
    ]
    return random.choice(methods)(text)
```

## Data Formatting

### Instruction Format
```python
def format_instruction(example):
    return f"""### Instruction:
{example['instruction']}

### Input:
{example.get('input', '')}

### Response:
{example['output']}"""
```

### Chat Format
```python
def format_chat(conversation):
    return [
        {"role": turn["role"], "content": turn["content"]}
        for turn in conversation
    ]
```

## Best Practices

1. Inspect data before processing
2. Deduplicate before expensive operations
3. Use multiple synthesis methods
4. Validate synthetic data quality
5. Track data lineage
