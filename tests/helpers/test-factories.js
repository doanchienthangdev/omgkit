/**
 * Test Factories
 *
 * Factory functions to create valid and invalid components for testing
 */

import { randomBytes } from 'crypto';

/**
 * Generate a unique ID for test isolation
 */
export function uniqueId(prefix = 'test') {
  return `${prefix}-${randomBytes(4).toString('hex')}`;
}

/**
 * Create valid agent frontmatter and content
 */
export function createValidAgent(overrides = {}) {
  const name = overrides.name || uniqueId('agent');
  const frontmatter = {
    name,
    description: overrides.description || `Test agent ${name} for automated testing purposes`,
    tools: overrides.tools || 'Read, Write, Bash, Glob',
    model: overrides.model || 'inherit',
    skills: overrides.skills || ['testing/omega-testing', 'methodology/tdd'],
    commands: overrides.commands || ['/dev:test', '/dev:implement'],
    ...overrides
  };

  const content = `---
name: ${frontmatter.name}
description: ${frontmatter.description}
tools: ${frontmatter.tools}
model: ${frontmatter.model}
skills:
${frontmatter.skills.map(s => `  - ${s}`).join('\n')}
commands:
${frontmatter.commands.map(c => `  - ${c}`).join('\n')}
---

# ${frontmatter.name}

${frontmatter.description}

## Responsibilities

1. Execute comprehensive testing strategies
2. Validate code quality and correctness
3. Report findings and recommendations
4. Maintain test coverage standards

## Skills Used

${frontmatter.skills.map(s => `- \`${s}\``).join('\n')}

## Commands Triggered

${frontmatter.commands.map(c => `- \`${c}\``).join('\n')}

## Usage Examples

### Basic Usage

Use this agent for testing scenarios.

### Advanced Usage

This agent can handle complex testing workflows.

## Quality Standards

- Ensure all tests pass
- Maintain coverage above 80%
- Follow testing best practices
- Document test rationale

## Notes

This is a test agent created by the test factory.
Additional lines to meet minimum requirements.
Line 50 content here.
`;

  return { frontmatter, content, name };
}

/**
 * Create valid skill frontmatter and content
 */
export function createValidSkill(overrides = {}) {
  const name = overrides.name || uniqueId('skill');
  const category = overrides.category || 'testing';
  const frontmatter = {
    name,
    description: overrides.description || `Claude implements ${name} for comprehensive testing. Use when building quality-first applications.`,
    ...overrides
  };

  const content = `---
name: ${frontmatter.name}
description: ${frontmatter.description}
---

# ${frontmatter.name} Skill

${frontmatter.description}

## Quick Start

1. Understand the testing requirements
2. Set up the testing framework
3. Write comprehensive tests
4. Run and validate results

## Core Features

### Feature 1: Test Generation
Generate tests automatically based on code analysis.

### Feature 2: Coverage Analysis
Analyze test coverage and identify gaps.

### Feature 3: Quality Metrics
Track and report quality metrics.

## Implementation Patterns

### Pattern 1: Unit Testing
\`\`\`javascript
describe('Component', () => {
  it('should work correctly', () => {
    expect(true).toBe(true);
  });
});
\`\`\`

### Pattern 2: Integration Testing
Integration tests verify component interactions.

## Anti-Patterns to Avoid

- Testing implementation details
- Flaky tests with timing issues
- Over-mocking dependencies
- Missing edge cases

## Related Skills

- methodology/tdd
- testing/property-testing
`;

  return { frontmatter, content, name, category, fullPath: `${category}/${name}` };
}

/**
 * Create valid command frontmatter and content
 */
export function createValidCommand(overrides = {}) {
  const name = overrides.name || uniqueId('cmd');
  const namespace = overrides.namespace || 'quality';
  const frontmatter = {
    description: overrides.description || `Execute ${name} command for testing`,
    'argument-hint': overrides['argument-hint'] || '<scope>',
    'allowed-tools': overrides['allowed-tools'] || 'Read, Write, Bash, Glob, Task',
    ...overrides
  };

  const content = `---
description: ${frontmatter.description}
argument-hint: ${frontmatter['argument-hint']}
allowed-tools: ${frontmatter['allowed-tools']}
---

# /${namespace}:${name}

${frontmatter.description}

## Usage

\`\`\`
/${namespace}:${name} <scope>
\`\`\`

## Arguments

- \`scope\`: The scope of the operation

## Examples

### Example 1
\`\`\`
/${namespace}:${name} all
\`\`\`

### Example 2
\`\`\`
/${namespace}:${name} specific-target
\`\`\`

## Notes

This command is part of the testing infrastructure.
`;

  return { frontmatter, content, name, namespace, fullPath: `/${namespace}:${name}` };
}

/**
 * Create valid workflow frontmatter and content
 */
export function createValidWorkflow(overrides = {}) {
  const name = overrides.name || uniqueId('workflow');
  const category = overrides.category || 'testing';
  const frontmatter = {
    name,
    description: overrides.description || `${name} workflow for comprehensive testing`,
    category,
    complexity: overrides.complexity || 'medium',
    'estimated-time': overrides['estimated-time'] || '1-2 hours',
    agents: overrides.agents || ['tester', 'code-reviewer'],
    skills: overrides.skills || ['testing/omega-testing', 'methodology/tdd'],
    commands: overrides.commands || ['/dev:test', '/quality:test-omega'],
    prerequisites: overrides.prerequisites || ['Test framework configured'],
    ...overrides
  };

  const content = `---
name: ${frontmatter.name}
description: ${frontmatter.description}
category: ${frontmatter.category}
complexity: ${frontmatter.complexity}
estimated-time: ${frontmatter['estimated-time']}
agents:
${frontmatter.agents.map(a => `  - ${a}`).join('\n')}
skills:
${frontmatter.skills.map(s => `  - ${s}`).join('\n')}
commands:
${frontmatter.commands.map(c => `  - ${c}`).join('\n')}
prerequisites:
${frontmatter.prerequisites.map(p => `  - ${p}`).join('\n')}
---

# ${frontmatter.name}

${frontmatter.description}

## Overview

This workflow guides you through comprehensive testing.

## Prerequisites

${frontmatter.prerequisites.map(p => `- ${p}`).join('\n')}

## Step 1: Analyze Requirements

**Agent**: ${frontmatter.agents[0]}

1. Review the codebase
2. Identify testing needs
3. Plan test strategy

## Step 2: Implement Tests

**Agent**: ${frontmatter.agents[0]}

1. Write unit tests
2. Write integration tests
3. Validate coverage

## Step 3: Review Results

**Agent**: ${frontmatter.agents[1] || frontmatter.agents[0]}

1. Review test results
2. Check coverage metrics
3. Approve or request changes

## Quality Gates

- [ ] All tests pass
- [ ] Coverage meets threshold
- [ ] No security vulnerabilities
- [ ] Performance within SLAs

## Related Workflows

- testing/test-driven-development
- testing/security-hardening
`;

  return { frontmatter, content, name, category, fullPath: `${category}/${name}` };
}

/**
 * Create malformed frontmatter for error testing
 */
export function createMalformedFrontmatter(type = 'unclosed') {
  const types = {
    unclosed: '---\nname: test\nskills:\n  - invalid',
    invalidYaml: '---\nname: test\nskills: [broken: syntax\n---',
    missingDelimiter: 'name: test\nskills:\n  - test',
    emptyFrontmatter: '---\n---\n# Content',
    onlyDelimiter: '---',
    invalidNesting: '---\nname: test\n  invalid:\n    nesting\n---',
    duplicateKeys: '---\nname: test1\nname: test2\n---',
  };

  return types[type] || types.unclosed;
}

/**
 * Create deeply nested directory structure
 */
export function createDeepNestingPath(depth = 10) {
  return Array(depth).fill('nested').join('/');
}

/**
 * Create large content for stress testing
 */
export function createLargeContent(lines = 1000) {
  const lineContent = 'This is a test line with some meaningful content for testing purposes.';
  return Array(lines).fill(lineContent).join('\n');
}

/**
 * Create component with specific line count
 */
export function createComponentWithLines(type, lineCount) {
  const baseComponent = type === 'agent' ? createValidAgent() :
                        type === 'skill' ? createValidSkill() :
                        type === 'command' ? createValidCommand() :
                        createValidWorkflow();

  const currentLines = baseComponent.content.split('\n').length;
  const additionalLines = Math.max(0, lineCount - currentLines);

  if (additionalLines > 0) {
    baseComponent.content += '\n' + Array(additionalLines).fill('# Additional line').join('\n');
  }

  return baseComponent;
}

/**
 * Create test fixtures directory structure
 */
export function createTestFixtureStructure() {
  return {
    agents: {
      'test-agent.md': createValidAgent().content,
    },
    skills: {
      testing: {
        'test-skill': {
          'SKILL.md': createValidSkill().content,
        },
      },
    },
    commands: {
      quality: {
        'test-cmd.md': createValidCommand().content,
      },
    },
    workflows: {
      testing: {
        'test-workflow.md': createValidWorkflow().content,
      },
    },
  };
}

export default {
  uniqueId,
  createValidAgent,
  createValidSkill,
  createValidCommand,
  createValidWorkflow,
  createMalformedFrontmatter,
  createDeepNestingPath,
  createLargeContent,
  createComponentWithLines,
  createTestFixtureStructure,
};
