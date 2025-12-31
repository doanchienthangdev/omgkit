---
description: Build Retrieval-Augmented Generation systems
allowed-tools: Task, Read, Write, Edit, Bash, Grep, Glob
argument-hint: <RAG system description>
---

# RAG Development Workflow

Build RAG system: **$ARGUMENTS**

## Workflow Steps

### Step 1: Research
**Agent:** @researcher
**Command:** `/planning:research "RAG best practices"`

- Study RAG architectures
- Evaluate chunking strategies
- Compare embedding models
- Review retrieval methods

### Step 2: Architecture Design
**Agent:** @architect

- Define system architecture
- Select components (vector DB, embeddings, LLM)
- Plan data pipeline
- Design API interface

### Step 3: Data Preparation
**Agent:** @fullstack-developer

- Implement document loaders
- Create chunking pipeline
- Handle different formats
- Clean and normalize text

### Step 4: Embedding Pipeline
**Agent:** @fullstack-developer

- Integrate embedding model
- Create batch processing
- Store in vector database
- Optimize indexing

### Step 5: Retrieval System
**Agent:** @fullstack-developer

- Implement semantic search
- Add hybrid retrieval (BM25 + vector)
- Build reranking pipeline
- Context assembly

### Step 6: Generation Pipeline
**Agent:** @fullstack-developer

- Create prompt templates
- Context injection
- LLM integration
- Response formatting

### Step 7: Evaluation
**Agent:** @tester

- Test retrieval accuracy (Recall@K, MRR)
- Measure answer quality
- Benchmark latency
- Analyze costs

## Progress Tracking
- [ ] Research complete
- [ ] Architecture designed
- [ ] Data pipeline ready
- [ ] Embeddings working
- [ ] Retrieval system built
- [ ] Generation working
- [ ] Evaluation passed

Execute each step sequentially. Show progress after each step.
