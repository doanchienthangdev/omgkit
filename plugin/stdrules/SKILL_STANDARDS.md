# OMGKIT Skill Standards v2.0

> Aligned with Claude Platform Official Best Practices
> Source: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

This document defines the quality standards for all OMGKIT skills based on Claude's official skill authoring guidelines.

---

## Core Principles

### 1. Concise is Key

The context window is a public good. Your Skill shares it with:
- System prompt
- Conversation history
- Other Skills' metadata
- User's actual request

**Default assumption**: Claude is already very smart. Only add context Claude doesn't already have.

Challenge each piece of information:
- "Does Claude really need this explanation?"
- "Can I assume Claude knows this?"
- "Does this paragraph justify its token cost?"

### 2. Progressive Disclosure

SKILL.md serves as an overview that points Claude to detailed materials as needed:
- Keep SKILL.md body **under 500 lines**
- Split content into separate files when approaching this limit
- Claude reads files only when needed

### 3. Degrees of Freedom

Match specificity to task fragility:

| Freedom Level | When to Use | Example |
|---------------|-------------|---------|
| **High** (text instructions) | Multiple valid approaches | Code review guidelines |
| **Medium** (pseudocode/params) | Preferred pattern exists | Report templates |
| **Low** (specific scripts) | Operations are fragile | Database migrations |

---

## Frontmatter Requirements

```yaml
---
name: skill-name
description: Third-person description of what it does and when to use it
---
```

### Name Rules
- Maximum **64 characters**
- Lowercase letters, numbers, hyphens only
- No XML tags, no reserved words ("anthropic", "claude")
- **Recommended**: Use gerund form (verb + -ing)

**Good names** (gerund form):
- `processing-pdfs`
- `analyzing-data`
- `managing-databases`
- `testing-code`

**Acceptable alternatives**:
- Noun phrases: `pdf-processing`, `data-analysis`
- Action-oriented: `process-pdfs`, `analyze-data`

**Avoid**:
- Vague: `helper`, `utils`, `tools`
- Generic: `documents`, `data`, `files`

### Description Rules
- Maximum **1024 characters**
- **Must be third person** (not "I can" or "You can use")
- Include BOTH what it does AND when to use it
- Be specific, include key terms

**Good descriptions**:
```yaml
# Good - specific and includes trigger context
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.

# Good - includes specific triggers
description: Generates descriptive commit messages by analyzing git diffs. Use when the user asks for help writing commit messages or reviewing staged changes.
```

**Bad descriptions**:
```yaml
description: Helps with documents  # Too vague
description: Processes data  # No trigger context
description: I can help you with PDFs  # Wrong person
```

---

## Skill Structure

### Minimal SKILL.md (Recommended for Most Skills)

```markdown
---
name: processing-pdfs
description: Extracts text and tables from PDF files, fills forms, merges documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---

# Processing PDFs

## Quick Start

Extract text with pdfplumber:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## Features

- **Text extraction**: Use pdfplumber for text
- **Table extraction**: See [TABLES.md](TABLES.md)
- **Form filling**: See [FORMS.md](FORMS.md)
- **Merging**: See [MERGE.md](MERGE.md)

## Workflows

### Standard Extraction
1. Load PDF with pdfplumber
2. Extract text from each page
3. Clean and format output

For advanced workflows, see [WORKFLOWS.md](WORKFLOWS.md).
```

### Directory Structure for Complex Skills

```
skill-name/
├── SKILL.md              # Main instructions (<500 lines)
├── REFERENCE.md          # API reference (loaded as needed)
├── EXAMPLES.md           # Usage examples (loaded as needed)
├── WORKFLOWS.md          # Complex workflows (loaded as needed)
└── scripts/
    ├── utility.py        # Utility script (executed, not loaded)
    └── validate.py       # Validation script
```

---

## Content Guidelines

### What to Include

1. **Quick start** - Minimal code to get started
2. **Feature overview** - Brief descriptions with links to details
3. **Common workflows** - Step-by-step for typical tasks
4. **References to detailed files** - For advanced content

### What NOT to Include

1. **Explanations of basic concepts** - Claude knows what PDFs are
2. **Multiple library options** - Pick one default, mention alternatives only if necessary
3. **Verbose descriptions** - Be direct and concise
4. **Time-sensitive information** - Use "old patterns" section if needed

### Example: Concise vs Verbose

**Good (≈50 tokens)**:
```markdown
## Extract PDF Text

Use pdfplumber for text extraction:
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
```

**Bad (≈150 tokens)**:
```markdown
## Extract PDF Text

PDF (Portable Document Format) files are a common file format that contains
text, images, and other content. To extract text from a PDF, you'll need to
use a library. There are many libraries available for PDF processing, but we
recommend pdfplumber because it's easy to use and handles most cases well.
First, you'll need to install it using pip. Then you can use the code below...
```

---

## Progressive Disclosure Patterns

### Pattern 1: High-Level Guide with References

```markdown
---
name: processing-documents
description: Processes various document formats including PDF, DOCX, and XLSX. Use when working with documents or file conversion.
---

# Document Processing

## Quick Reference

| Format | Library | Guide |
|--------|---------|-------|
| PDF | pdfplumber | [PDF.md](PDF.md) |
| DOCX | python-docx | [DOCX.md](DOCX.md) |
| XLSX | openpyxl | [XLSX.md](XLSX.md) |

## Common Operations

**Extract text**: See format-specific guide above
**Convert formats**: See [CONVERT.md](CONVERT.md)
**Batch processing**: See [BATCH.md](BATCH.md)
```

### Pattern 2: Domain-Specific Organization

```
bigquery-skill/
├── SKILL.md
└── reference/
    ├── finance.md
    ├── sales.md
    └── product.md
```

```markdown
# BigQuery Analysis

## Datasets

| Domain | Schema | Guide |
|--------|--------|-------|
| Finance | revenue, billing | [reference/finance.md](reference/finance.md) |
| Sales | opportunities, pipeline | [reference/sales.md](reference/sales.md) |
| Product | API usage, features | [reference/product.md](reference/product.md) |
```

### Pattern 3: Conditional Details

```markdown
# DOCX Processing

## Creating Documents
Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing Documents
For simple edits, modify XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

---

## Workflows and Feedback Loops

### Use Checklists for Complex Tasks

```markdown
## Form Processing Workflow

Copy this checklist and track progress:

```
Progress:
- [ ] Step 1: Analyze form (run analyze_form.py)
- [ ] Step 2: Create field mapping (edit fields.json)
- [ ] Step 3: Validate mapping (run validate_fields.py)
- [ ] Step 4: Fill form (run fill_form.py)
- [ ] Step 5: Verify output (run verify_output.py)
```

**Step 1**: Run `python scripts/analyze_form.py input.pdf`
**Step 2**: Edit `fields.json` with values
**Step 3**: Run `python scripts/validate_fields.py fields.json`
**Step 4**: Run `python scripts/fill_form.py input.pdf fields.json output.pdf`
**Step 5**: Run `python scripts/verify_output.py output.pdf`

If verification fails, return to Step 2.
```

### Implement Validation Loops

```markdown
## Edit Process

1. Make edits to document
2. **Validate immediately**: `python validate.py`
3. If validation fails:
   - Review error message
   - Fix issues
   - Run validation again
4. **Only proceed when validation passes**
5. Save output
```

---

## Reference Files (for Detailed Content)

Keep references **one level deep** from SKILL.md:

**Good** (one level):
```
SKILL.md → reference.md → (no further links)
SKILL.md → examples.md → (no further links)
```

**Bad** (too deep):
```
SKILL.md → advanced.md → details.md → (lost information)
```

### Structure Long Reference Files

For files >100 lines, include table of contents:

```markdown
# API Reference

## Contents
- Authentication
- Core Methods
- Advanced Features
- Error Handling
- Examples

## Authentication
...
```

---

## Anti-Patterns to Avoid

### ❌ Avoid Windows Paths
```markdown
# Bad
scripts\helper.py

# Good
scripts/helper.py
```

### ❌ Avoid Too Many Options
```markdown
# Bad
"You can use pypdf, or pdfplumber, or PyMuPDF, or pdf2image..."

# Good
"Use pdfplumber for text extraction.
For scanned PDFs requiring OCR, use pdf2image with pytesseract instead."
```

### ❌ Avoid Time-Sensitive Info
```markdown
# Bad
"If before August 2025, use old API..."

# Good
## Current Method
Use v2 API endpoint.

## Legacy (Deprecated)
<details>
<summary>v1 API (deprecated 2025-08)</summary>
Old endpoint details...
</details>
```

### ❌ Avoid Inconsistent Terminology
```markdown
# Bad
Mix of "API endpoint", "URL", "route", "path"

# Good
Always use "API endpoint" consistently
```

---

## Skill Length Guidelines

| Skill Type | SKILL.md Max | Use Reference Files When |
|------------|--------------|--------------------------|
| Simple | 100 lines | Rarely needed |
| Standard | 200-300 lines | 1-2 reference files |
| Complex | 400-500 lines | 3+ reference files |

**Hard limit**: SKILL.md body should never exceed 500 lines.

---

## Testing Checklist

Before finalizing a skill:

### Core Quality
- [ ] Name uses gerund form (or acceptable alternative)
- [ ] Name is ≤64 characters, lowercase, hyphens only
- [ ] Description is third person
- [ ] Description includes what it does AND when to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Only essential context included (Claude already knows basics)
- [ ] References are one level deep
- [ ] No time-sensitive information
- [ ] Consistent terminology throughout

### Structure
- [ ] Quick start section with minimal code
- [ ] Feature overview with links to details
- [ ] Workflows have clear steps
- [ ] Complex content in separate reference files

### If Includes Scripts
- [ ] Scripts handle errors explicitly
- [ ] No "voodoo constants" (all values justified)
- [ ] Clear whether to execute or read scripts
- [ ] Forward slashes in all paths

---

## Migration from v1 Skills

To convert existing verbose skills:

1. **Extract quick start**: Keep only the minimal getting-started code
2. **Create reference files**: Move detailed content to REFERENCE.md, EXAMPLES.md, etc.
3. **Simplify descriptions**: Remove explanations Claude already knows
4. **Add navigation**: Replace inline content with links to reference files
5. **Verify length**: Ensure SKILL.md is under 500 lines

### Example Migration

**Before (v1 - 800 lines)**:
```markdown
# MongoDB

MongoDB is a document database... [200 lines of explanation]

## Schema Design
[300 lines of patterns and examples]

## Query Optimization
[200 lines of techniques]

## Best Practices
[100 lines of do's and don'ts]
```

**After (v2 - 150 lines)**:
```markdown
# MongoDB

## Quick Start

```python
from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017/")
db = client["mydb"]
```

## Features

| Feature | Guide |
|---------|-------|
| Schema Design | [SCHEMA.md](SCHEMA.md) |
| Query Optimization | [QUERIES.md](QUERIES.md) |
| Indexing | [INDEXES.md](INDEXES.md) |
| Transactions | [TRANSACTIONS.md](TRANSACTIONS.md) |

## Common Patterns

- **CRUD operations**: See Quick Start above
- **Aggregation**: See [AGGREGATION.md](AGGREGATION.md)
- **Replication**: See [REPLICATION.md](REPLICATION.md)
```

---

*Version: 2.0*
*Based on: Claude Platform Best Practices (2025)*
*Last Updated: 2024-12-31*
