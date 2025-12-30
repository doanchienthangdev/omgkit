---
name: ai-architecture
description: AI application architecture - gateway, orchestration, model routing, observability, deployment patterns. Use when designing AI systems, scaling applications, or building production infrastructure.
---

# AI Architecture Skill

Designing production AI applications.

## Reference Architecture

```
┌─────────────────────────────────────────────────────┐
│  CLIENT LAYER (Web, Mobile, API, CLI)               │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│  GATEWAY LAYER                                       │
│  Rate Limiter | Auth | Input Guard                  │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│  ORCHESTRATION LAYER                                 │
│  Router | Cache | Context | Agent | Output Guard    │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│  MODEL LAYER                                         │
│  Primary LLM | Fallback | Specialized               │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────┴─────────────────────────────┐
│  DATA LAYER                                          │
│  Vector DB | SQL DB | Cache                         │
└─────────────────────────────────────────────────────┘
```

## Model Router

```python
class ModelRouter:
    def __init__(self):
        self.models = {
            "gpt-4": {"cost": 0.03, "quality": 0.95, "latency": 2.0},
            "gpt-3.5": {"cost": 0.002, "quality": 0.80, "latency": 0.5},
        }
        self.classifier = load_complexity_classifier()

    def route(self, query, constraints):
        complexity = self.classifier.predict(query)

        if complexity == "simple" and constraints.get("cost_sensitive"):
            return "gpt-3.5"
        elif complexity == "complex":
            return "gpt-4"
        else:
            return "gpt-3.5"

    def with_fallback(self, query, primary, fallbacks):
        for model in [primary] + fallbacks:
            try:
                response = self.call(model, query)
                if self.validate(response):
                    return response
            except:
                continue
        raise Exception("All models failed")
```

## Context Enhancement

```python
class ContextEnhancer:
    def enhance(self, query, history):
        # Retrieve
        docs = self.retriever.retrieve(query, k=10)

        # Rerank
        docs = self.rerank(query, docs)[:5]

        # Compress if needed
        context = self.format(docs)
        if len(context) > 4000:
            context = self.summarize(context)

        # Add history
        history_context = self.format_history(history[-5:])

        return {
            "retrieved": context,
            "history": history_context
        }
```

## Observability

```python
from opentelemetry import trace
from prometheus_client import Counter, Histogram

REQUESTS = Counter('ai_requests', 'Total', ['model', 'status'])
LATENCY = Histogram('ai_latency', 'Latency', ['model'])
TOKENS = Counter('ai_tokens', 'Tokens', ['model', 'type'])

tracer = trace.get_tracer(__name__)

class ObservableClient:
    def generate(self, prompt, model):
        with tracer.start_as_current_span("ai_generate") as span:
            span.set_attribute("model", model)

            start = time.time()
            try:
                response = self.client.generate(prompt, model)

                REQUESTS.labels(model=model, status="ok").inc()
                LATENCY.labels(model=model).observe(time.time()-start)
                TOKENS.labels(model=model, type="in").inc(count(prompt))
                TOKENS.labels(model=model, type="out").inc(count(response))

                return response
            except Exception as e:
                REQUESTS.labels(model=model, status="error").inc()
                raise
```

## Best Practices

1. Add gateway for rate limiting/auth
2. Use model router for cost optimization
3. Implement fallback chains
4. Add comprehensive observability
5. Cache at multiple levels
