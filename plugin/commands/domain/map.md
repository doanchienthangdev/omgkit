---
description: Create visual bounded context map and integration patterns
allowed-tools: Task, Read, Write, Grep, Glob
argument-hint: <bounded contexts or system>
---

# 🗺️ Context Mapping: $ARGUMENTS

Map contexts for: **$ARGUMENTS**

## Agent
Uses **domain-decomposer** agent for context mapping.

## Workflow
1. **Identify Contexts** - List all bounded contexts
2. **Map Relationships** - Define upstream/downstream
3. **Integration Patterns** - ACL, OHS, Conformist, etc.
4. **Visualize** - Generate context map diagram

## Context Relationship Types
- **Partnership** - Mutual cooperation
- **Shared Kernel** - Shared subset
- **Customer/Supplier** - Upstream/downstream
- **Conformist** - Follow upstream model
- **ACL** - Anti-corruption layer
- **Open Host Service** - Published API

## Outputs
- Context map diagram (Mermaid)
- Integration patterns per relationship
- Team ownership mapping
- Communication protocols

## Progress
- [ ] Contexts identified
- [ ] Relationships mapped
- [ ] Patterns assigned
- [ ] Diagram generated
- [ ] Documentation complete

Generate Mermaid diagram for context map.
