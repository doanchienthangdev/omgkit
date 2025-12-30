---
name: ai-system-evaluation
description: End-to-end AI system evaluation - model selection, benchmarks, cost/latency analysis, build vs buy decisions. Use when selecting models, designing eval pipelines, or making architecture decisions.
---

# AI System Evaluation

Evaluating AI systems end-to-end.

## Evaluation Criteria

### 1. Domain-Specific Capability

| Domain | Benchmarks |
|--------|------------|
| Math & Reasoning | GSM-8K, MATH |
| Code | HumanEval, MBPP |
| Knowledge | MMLU, ARC |
| Multi-turn Chat | MT-Bench |

### 2. Generation Quality

| Criterion | Measurement |
|-----------|-------------|
| Factual Consistency | NLI, SAFE, SelfCheckGPT |
| Coherence | AI judge rubric |
| Relevance | Semantic similarity |
| Fluency | Perplexity |

### 3. Cost & Latency

```python
@dataclass
class PerformanceMetrics:
    ttft: float      # Time to First Token (seconds)
    tpot: float      # Time Per Output Token
    throughput: float # Tokens/second

    def cost(self, input_tokens, output_tokens, prices):
        return input_tokens * prices["input"] + output_tokens * prices["output"]
```

## Model Selection Workflow

```
1. Define Requirements
   ├── Task type
   ├── Quality threshold
   ├── Latency requirements (<2s TTFT)
   ├── Cost budget
   └── Deployment constraints

2. Filter Options
   ├── API vs Self-hosted
   ├── Open source vs Proprietary
   └── Size constraints

3. Benchmark on Your Data
   ├── Create eval dataset (100+ examples)
   ├── Run experiments
   └── Analyze results

4. Make Decision
   └── Balance quality, cost, latency
```

## Build vs Buy

| Factor | API | Self-Host |
|--------|-----|-----------|
| Data Privacy | Less control | Full control |
| Performance | Best models | Slightly behind |
| Cost at Scale | Expensive | Amortized |
| Customization | Limited | Full control |
| Maintenance | Zero | Significant |

## Public Benchmarks

| Benchmark | Focus |
|-----------|-------|
| MMLU | Knowledge (57 subjects) |
| HumanEval | Code generation |
| GSM-8K | Math reasoning |
| TruthfulQA | Factuality |
| MT-Bench | Multi-turn chat |

**Caution**: Benchmarks can be gamed. Data contamination is common. Always evaluate on YOUR data.

## Best Practices

1. Test on domain-specific data
2. Measure both quality and cost
3. Consider latency requirements
4. Plan for fallback models
5. Re-evaluate periodically
