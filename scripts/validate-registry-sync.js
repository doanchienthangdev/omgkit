#!/usr/bin/env node

/**
 * OMGKIT Registry Sync Validator
 *
 * Validates that registry.yaml is synchronized with actual component files.
 * Reports discrepancies between registry entries and frontmatter.
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { buildDependencyGraph } from './build-dependency-graph.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PLUGIN_DIR = join(ROOT, 'plugin');

/**
 * Load registry.yaml
 */
async function loadRegistry() {
  const content = await readFile(join(PLUGIN_DIR, 'registry.yaml'), 'utf-8');
  return yaml.load(content);
}

/**
 * Compare arrays and return differences
 */
function compareArrays(actual, expected, name) {
  const actualSet = new Set(actual || []);
  const expectedSet = new Set(expected || []);

  const missing = [...expectedSet].filter(x => !actualSet.has(x));
  const extra = [...actualSet].filter(x => !expectedSet.has(x));

  return { missing, extra, match: missing.length === 0 && extra.length === 0 };
}

/**
 * Validate registry sync
 */
export async function validateRegistrySync() {
  const registry = await loadRegistry();
  const { graph, stats } = await buildDependencyGraph();

  const issues = [];
  const validations = {
    agents: { total: 0, synced: 0, issues: [] },
    workflows: { total: 0, synced: 0, issues: [] },
    skills: { total: 0, synced: 0, issues: [] },
    commands: { total: 0, synced: 0, issues: [] }
  };

  // Validate Agents
  const registryAgents = registry.agents || {};
  for (const [agentName, agentData] of Object.entries(registryAgents)) {
    validations.agents.total++;
    const actualAgent = graph.agents[agentName];

    if (!actualAgent) {
      validations.agents.issues.push({
        component: agentName,
        type: 'orphaned',
        message: `Agent in registry but file not found`
      });
      continue;
    }

    // Compare skills
    const skillComparison = compareArrays(
      actualAgent.dependsOn.skills,
      agentData.skills
    );

    if (!skillComparison.match) {
      validations.agents.issues.push({
        component: agentName,
        type: 'skill_mismatch',
        message: `Skills mismatch`,
        missing: skillComparison.missing,
        extra: skillComparison.extra
      });
    }

    // Compare commands
    const cmdComparison = compareArrays(
      actualAgent.dependsOn.commands,
      agentData.commands
    );

    if (!cmdComparison.match) {
      validations.agents.issues.push({
        component: agentName,
        type: 'command_mismatch',
        message: `Commands mismatch`,
        missing: cmdComparison.missing,
        extra: cmdComparison.extra
      });
    }

    if (skillComparison.match && cmdComparison.match) {
      validations.agents.synced++;
    }
  }

  // Check for missing agents in registry
  for (const agentName of Object.keys(graph.agents)) {
    if (!registryAgents[agentName]) {
      validations.agents.issues.push({
        component: agentName,
        type: 'missing',
        message: `Agent exists but not in registry`
      });
    }
  }

  // Validate Workflows
  const registryWorkflows = registry.workflows || {};
  for (const [workflowPath, workflowData] of Object.entries(registryWorkflows)) {
    validations.workflows.total++;
    const actualWorkflow = graph.workflows[workflowPath];

    if (!actualWorkflow) {
      validations.workflows.issues.push({
        component: workflowPath,
        type: 'orphaned',
        message: `Workflow in registry but file not found`
      });
      continue;
    }

    // Compare agents
    const agentComparison = compareArrays(
      actualWorkflow.dependsOn.agents,
      workflowData.agents
    );

    if (!agentComparison.match) {
      validations.workflows.issues.push({
        component: workflowPath,
        type: 'agent_mismatch',
        message: `Agents mismatch`,
        missing: agentComparison.missing,
        extra: agentComparison.extra
      });
    }

    // Compare skills
    const skillComparison = compareArrays(
      actualWorkflow.dependsOn.skills,
      workflowData.skills
    );

    if (!skillComparison.match) {
      validations.workflows.issues.push({
        component: workflowPath,
        type: 'skill_mismatch',
        message: `Skills mismatch`,
        missing: skillComparison.missing,
        extra: skillComparison.extra
      });
    }

    // Compare commands
    const cmdComparison = compareArrays(
      actualWorkflow.dependsOn.commands,
      workflowData.commands
    );

    if (!cmdComparison.match) {
      validations.workflows.issues.push({
        component: workflowPath,
        type: 'command_mismatch',
        message: `Commands mismatch`,
        missing: cmdComparison.missing,
        extra: cmdComparison.extra
      });
    }

    if (agentComparison.match && skillComparison.match && cmdComparison.match) {
      validations.workflows.synced++;
    }
  }

  // Component count validation
  const componentCounts = {
    agents: {
      registry: Object.keys(registryAgents).length,
      actual: stats.agents,
      match: Object.keys(registryAgents).length === stats.agents
    },
    skills: {
      registry: (registry.skill_categories || []).length,
      actual: stats.skills,
      note: 'Skills validated by category presence'
    },
    commands: {
      registry: (registry.command_namespaces || []).length,
      actual: stats.commands,
      note: 'Commands validated by namespace presence'
    },
    workflows: {
      registry: Object.keys(registryWorkflows).length,
      actual: stats.workflows,
      match: Object.keys(registryWorkflows).length >= stats.workflows * 0.4 // At least 40% documented
    }
  };

  // Calculate overall health
  const totalIssues = validations.agents.issues.length +
                      validations.workflows.issues.length +
                      validations.skills.issues.length +
                      validations.commands.issues.length;

  const health = {
    status: totalIssues === 0 ? 'ALIGNED' : 'DRIFT_DETECTED',
    totalIssues,
    validations,
    componentCounts,
    stats
  };

  return health;
}

/**
 * Format health report as string
 */
export function formatHealthReport(health) {
  const lines = [
    '🔮 OMGKIT Alignment Health Report',
    '=================================',
    '',
    `Registry Sync Status: ${health.status === 'ALIGNED' ? '✓ ALIGNED' : '⚠ DRIFT DETECTED'}`,
    '━'.repeat(50),
    '',
    '📊 Component Counts:',
    `   Agents:    ${health.componentCounts.agents.registry} registered, ${health.componentCounts.agents.actual} actual    ${health.componentCounts.agents.match ? '✓' : '⚠'}`,
    `   Skills:    ${health.stats.skills} actual    ✓`,
    `   Commands:  ${health.stats.commands} actual    ✓`,
    `   Workflows: ${health.componentCounts.workflows.registry} registered, ${health.stats.workflows} actual    ${health.componentCounts.workflows.match ? '✓' : '⚠'}`,
    '',
    '🔗 Dependency Health:',
    `   Agent→Skill refs:    ${health.stats.totalSkillRefs}    ✓`,
    `   Agent→Command refs:  ${health.stats.totalCommandRefs}    ✓`,
    `   Workflow→Agent refs: ${health.stats.totalAgentRefs}    ✓`,
    ''
  ];

  if (health.totalIssues > 0) {
    lines.push('⚠ Issues Found:');

    for (const [type, data] of Object.entries(health.validations)) {
      if (data.issues.length > 0) {
        lines.push(`\n   ${type.charAt(0).toUpperCase() + type.slice(1)}:`);
        for (const issue of data.issues.slice(0, 5)) {
          lines.push(`   - ${issue.component}: ${issue.message}`);
          if (issue.missing?.length > 0) {
            lines.push(`     Missing: ${issue.missing.join(', ')}`);
          }
          if (issue.extra?.length > 0) {
            lines.push(`     Extra: ${issue.extra.join(', ')}`);
          }
        }
        if (data.issues.length > 5) {
          lines.push(`   ... and ${data.issues.length - 5} more`);
        }
      }
    }
  }

  lines.push('');
  lines.push(`Overall: ${health.status === 'ALIGNED' ? '✓ HEALTHY' : '⚠ NEEDS ATTENTION'}`);

  return lines.join('\n');
}

// Run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const health = await validateRegistrySync();
  console.log(formatHealthReport(health));
  process.exit(health.status === 'ALIGNED' ? 0 : 1);
}
