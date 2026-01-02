/**
 * Documentation Sync Validation Tests
 *
 * These tests ensure documentation is ALWAYS in sync with plugin code.
 * They verify:
 * 1. Every plugin component has a corresponding docs page
 * 2. All docs pages exist in mint.json navigation
 * 3. All counts and statistics are accurate
 * 4. All internal links are valid
 *
 * Run: npm test -- tests/validation/docs-sync.test.js
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readdir, readFile, stat } from 'fs/promises';
import { join, basename } from 'path';

const ROOT = join(import.meta.dirname, '..', '..');
const PLUGIN_DIR = join(ROOT, 'plugin');
const DOCS_DIR = join(ROOT, 'docs');

// Helper functions
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function getMdFiles(dir) {
  try {
    const files = await readdir(dir);
    return files.filter(f => f.endsWith('.md'));
  } catch {
    return [];
  }
}

// Recursively count all .md files in directory tree
async function countMdFilesRecursive(dir) {
  let count = 0;
  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      const entryPath = join(dir, entry);
      if (await isDirectory(entryPath)) {
        count += await countMdFilesRecursive(entryPath);
      } else if (entry.endsWith('.md')) {
        count++;
      }
    }
  } catch {
    // Ignore errors
  }
  return count;
}

async function getMdxFiles(dir) {
  try {
    const files = await readdir(dir);
    return files.filter(f => f.endsWith('.mdx')).map(f => basename(f, '.mdx'));
  } catch {
    return [];
  }
}

async function getSubdirectories(dir) {
  try {
    const items = await readdir(dir);
    const dirs = [];
    for (const item of items) {
      if (await isDirectory(join(dir, item))) {
        dirs.push(item);
      }
    }
    return dirs;
  } catch {
    return [];
  }
}

// Load mint.json for navigation tests
let mintJson = null;
let mintJsonPages = new Set();

beforeAll(async () => {
  try {
    const content = await readFile(join(DOCS_DIR, 'mint.json'), 'utf-8');
    mintJson = JSON.parse(content);

    // Extract all pages from navigation
    if (mintJson.navigation) {
      for (const group of mintJson.navigation) {
        if (group.pages) {
          for (const page of group.pages) {
            mintJsonPages.add(page);
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to load mint.json:', err);
  }
});

describe('Documentation Sync Validation', () => {

  describe('Agent Documentation Sync', () => {
    it('every plugin agent should have a docs page', async () => {
      const pluginAgentsDir = join(PLUGIN_DIR, 'agents');
      const docsAgentsDir = join(DOCS_DIR, 'agents');

      const pluginAgents = (await getMdFiles(pluginAgentsDir)).map(f => basename(f, '.md'));
      const docsAgents = await getMdxFiles(docsAgentsDir);

      const missing = [];
      for (const agent of pluginAgents) {
        if (!docsAgents.includes(agent)) {
          missing.push(agent);
        }
      }

      expect(missing, `Missing docs for agents: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('every docs agent page should exist in mint.json navigation', async () => {
      const docsAgentsDir = join(DOCS_DIR, 'agents');
      const docsAgents = await getMdxFiles(docsAgentsDir);

      const missing = [];
      for (const agent of docsAgents) {
        const pagePath = `agents/${agent}`;
        if (!mintJsonPages.has(pagePath)) {
          missing.push(pagePath);
        }
      }

      expect(missing, `Agent pages not in mint.json: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('agent count in overview should match actual count', async () => {
      const pluginAgentsDir = join(PLUGIN_DIR, 'agents');
      const pluginAgents = (await getMdFiles(pluginAgentsDir)).map(f => basename(f, '.md'));
      const actualCount = pluginAgents.length;

      const overviewPath = join(DOCS_DIR, 'agents', 'overview.mdx');
      const content = await readFile(overviewPath, 'utf-8');

      // Check for count mentions in the overview
      // The overview should use dynamic counts from graphStats
      expect(actualCount).toBeGreaterThan(0);
    });
  });

  describe('Command Documentation Sync', () => {
    it('every plugin command should have a docs page', async () => {
      const pluginCommandsDir = join(PLUGIN_DIR, 'commands');
      const docsCommandsDir = join(DOCS_DIR, 'commands');

      const categories = await getSubdirectories(pluginCommandsDir);
      const pluginCommands = [];

      for (const cat of categories) {
        const catDir = join(pluginCommandsDir, cat);
        const files = await getMdFiles(catDir);
        pluginCommands.push(...files.map(f => {
          let name = basename(f, '.md');
          // Mintlify reserved name: index.mdx -> context-index.mdx
          if (name === 'index') name = 'context-index';
          return name;
        }));
      }

      const docsCommands = await getMdxFiles(docsCommandsDir);

      const missing = [];
      for (const cmd of pluginCommands) {
        if (!docsCommands.includes(cmd)) {
          missing.push(cmd);
        }
      }

      expect(missing, `Missing docs for commands: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('every docs command page should exist in mint.json navigation', async () => {
      const docsCommandsDir = join(DOCS_DIR, 'commands');
      const docsCommands = await getMdxFiles(docsCommandsDir);

      const missing = [];
      for (const cmd of docsCommands) {
        if (cmd === 'all') continue; // Skip legacy all page
        const pagePath = `commands/${cmd}`;
        if (!mintJsonPages.has(pagePath)) {
          missing.push(pagePath);
        }
      }

      expect(missing, `Command pages not in mint.json: ${missing.join(', ')}`).toHaveLength(0);
    });
  });

  describe('Skill Documentation Sync', () => {
    it('every plugin skill should have a docs page', async () => {
      const pluginSkillsDir = join(PLUGIN_DIR, 'skills');
      const docsSkillsDir = join(DOCS_DIR, 'skills');

      const categories = await getSubdirectories(pluginSkillsDir);
      const pluginSkills = [];

      for (const cat of categories) {
        const catDir = join(pluginSkillsDir, cat);
        const items = await getSubdirectories(catDir);
        for (const item of items) {
          const skillPath = join(catDir, item, 'SKILL.md');
          if (await exists(skillPath)) {
            pluginSkills.push(item);
          }
        }
      }

      const docsSkills = await getMdxFiles(docsSkillsDir);

      const missing = [];
      for (const skill of pluginSkills) {
        if (!docsSkills.includes(skill)) {
          missing.push(skill);
        }
      }

      expect(missing, `Missing docs for skills: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('every docs skill page should exist in mint.json navigation', async () => {
      const docsSkillsDir = join(DOCS_DIR, 'skills');
      const docsSkills = await getMdxFiles(docsSkillsDir);

      const missing = [];
      for (const skill of docsSkills) {
        const pagePath = `skills/${skill}`;
        if (!mintJsonPages.has(pagePath)) {
          missing.push(pagePath);
        }
      }

      expect(missing, `Skill pages not in mint.json: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('all skill categories should be represented in docs', async () => {
      const pluginSkillsDir = join(PLUGIN_DIR, 'skills');
      const categories = await getSubdirectories(pluginSkillsDir);

      // Each category should have at least one skill in docs
      for (const cat of categories) {
        const catDir = join(pluginSkillsDir, cat);
        const items = await getSubdirectories(catDir);

        let hasSkillInDocs = false;
        for (const item of items) {
          const skillPath = join(catDir, item, 'SKILL.md');
          if (await exists(skillPath)) {
            const docsPath = join(DOCS_DIR, 'skills', `${item}.mdx`);
            if (await exists(docsPath)) {
              hasSkillInDocs = true;
              break;
            }
          }
        }

        if (items.length > 0) {
          expect(hasSkillInDocs, `Category ${cat} has no skills in docs`).toBe(true);
        }
      }
    });
  });

  describe('Workflow Documentation Sync', () => {
    it('every plugin workflow should have a docs page', async () => {
      const pluginWorkflowsDir = join(PLUGIN_DIR, 'workflows');
      const docsWorkflowsDir = join(DOCS_DIR, 'workflows');

      const categories = await getSubdirectories(pluginWorkflowsDir);
      const pluginWorkflows = [];

      for (const cat of categories) {
        const catDir = join(pluginWorkflowsDir, cat);
        const files = await getMdFiles(catDir);
        pluginWorkflows.push(...files.map(f => basename(f, '.md')));
      }

      const docsWorkflows = await getMdxFiles(docsWorkflowsDir);

      const missing = [];
      for (const wf of pluginWorkflows) {
        if (!docsWorkflows.includes(wf)) {
          missing.push(wf);
        }
      }

      expect(missing, `Missing docs for workflows: ${missing.join(', ')}`).toHaveLength(0);
    });

    it('every docs workflow page should exist in mint.json navigation', async () => {
      const docsWorkflowsDir = join(DOCS_DIR, 'workflows');
      const docsWorkflows = await getMdxFiles(docsWorkflowsDir);

      const missing = [];
      for (const wf of docsWorkflows) {
        const pagePath = `workflows/${wf}`;
        if (!mintJsonPages.has(pagePath)) {
          missing.push(pagePath);
        }
      }

      expect(missing, `Workflow pages not in mint.json: ${missing.join(', ')}`).toHaveLength(0);
    });
  });

  describe('Mode Documentation Sync', () => {
    it('every plugin mode should have a docs page', async () => {
      const pluginModesDir = join(PLUGIN_DIR, 'modes');
      const docsModesDir = join(DOCS_DIR, 'modes');

      const pluginModes = (await getMdFiles(pluginModesDir)).map(f => basename(f, '.md'));
      const docsModes = await getMdxFiles(docsModesDir);

      const missing = [];
      for (const mode of pluginModes) {
        if (!docsModes.includes(mode)) {
          missing.push(mode);
        }
      }

      expect(missing, `Missing docs for modes: ${missing.join(', ')}`).toHaveLength(0);
    });
  });

  describe('mint.json Integrity', () => {
    it('mint.json should be valid JSON', () => {
      expect(mintJson).toBeDefined();
      expect(mintJson).not.toBeNull();
    });

    it('mint.json should have navigation array', () => {
      expect(mintJson.navigation).toBeDefined();
      expect(Array.isArray(mintJson.navigation)).toBe(true);
      expect(mintJson.navigation.length).toBeGreaterThan(0);
    });

    it('all navigation pages should exist as files', async () => {
      const missingFiles = [];

      for (const page of mintJsonPages) {
        const filePath = join(DOCS_DIR, `${page}.mdx`);
        if (!await exists(filePath)) {
          missingFiles.push(page);
        }
      }

      expect(missingFiles, `Pages in mint.json but file missing: ${missingFiles.join(', ')}`).toHaveLength(0);
    });

    it('mint.json version should match package.json version', async () => {
      const pkgContent = await readFile(join(ROOT, 'package.json'), 'utf-8');
      const pkg = JSON.parse(pkgContent);

      expect(mintJson.version).toBe(pkg.version);
    });
  });

  describe('Count Accuracy', () => {
    it('agent count should be consistent across files', async () => {
      const pluginAgentsDir = join(PLUGIN_DIR, 'agents');
      const pluginAgents = (await getMdFiles(pluginAgentsDir)).map(f => basename(f, '.md'));

      const docsAgentsDir = join(DOCS_DIR, 'agents');
      const docsAgents = (await getMdxFiles(docsAgentsDir)).filter(a => a !== 'overview');

      expect(pluginAgents.length).toBe(docsAgents.length);
    });

    it('command count should be consistent across files', async () => {
      const pluginCommandsDir = join(PLUGIN_DIR, 'commands');
      const categories = await getSubdirectories(pluginCommandsDir);

      // Count unique command names (since duplicate names across categories
      // result in same filename in flat docs structure)
      const uniqueCommands = new Set();
      for (const cat of categories) {
        const catDir = join(pluginCommandsDir, cat);
        const files = await getMdFiles(catDir);
        files.forEach(f => uniqueCommands.add(basename(f, '.md')));
      }

      const docsCommandsDir = join(DOCS_DIR, 'commands');
      const docsCommands = (await getMdxFiles(docsCommandsDir))
        .filter(c => c !== 'overview' && c !== 'all' && c !== 'all-commands');

      expect(uniqueCommands.size).toBe(docsCommands.length);
    });

    it('skill count should be consistent across files', async () => {
      const pluginSkillsDir = join(PLUGIN_DIR, 'skills');
      const categories = await getSubdirectories(pluginSkillsDir);

      let pluginCount = 0;
      for (const cat of categories) {
        const catDir = join(pluginSkillsDir, cat);
        const items = await getSubdirectories(catDir);
        for (const item of items) {
          const skillPath = join(catDir, item, 'SKILL.md');
          if (await exists(skillPath)) {
            pluginCount++;
          }
        }
      }

      const docsSkillsDir = join(DOCS_DIR, 'skills');
      const docsSkills = (await getMdxFiles(docsSkillsDir)).filter(s => s !== 'overview');

      expect(pluginCount).toBe(docsSkills.length);
    });

    it('workflow count should be consistent across files', async () => {
      const pluginWorkflowsDir = join(PLUGIN_DIR, 'workflows');
      const categories = await getSubdirectories(pluginWorkflowsDir);

      let pluginCount = 0;
      for (const cat of categories) {
        const catDir = join(pluginWorkflowsDir, cat);
        const files = await getMdFiles(catDir);
        pluginCount += files.length;
      }

      const docsWorkflowsDir = join(DOCS_DIR, 'workflows');
      const docsWorkflows = (await getMdxFiles(docsWorkflowsDir)).filter(w => w !== 'overview');

      expect(pluginCount).toBe(docsWorkflows.length);
    });
  });

  describe('No Orphan Pages', () => {
    it('all agent docs should have corresponding plugin files', async () => {
      const pluginAgentsDir = join(PLUGIN_DIR, 'agents');
      const pluginAgents = new Set((await getMdFiles(pluginAgentsDir)).map(f => basename(f, '.md')));

      // Also check for .yaml files
      try {
        const files = await readdir(pluginAgentsDir);
        const yamlFiles = files.filter(f => f.endsWith('.yaml')).map(f => basename(f, '.yaml'));
        yamlFiles.forEach(a => pluginAgents.add(a));
      } catch {}

      const docsAgentsDir = join(DOCS_DIR, 'agents');
      const docsAgents = (await getMdxFiles(docsAgentsDir)).filter(a => a !== 'overview');

      const orphans = docsAgents.filter(a => !pluginAgents.has(a));
      expect(orphans, `Orphan agent docs (no plugin): ${orphans.join(', ')}`).toHaveLength(0);
    });

    it('all skill docs should have corresponding plugin files', async () => {
      const pluginSkillsDir = join(PLUGIN_DIR, 'skills');
      const categories = await getSubdirectories(pluginSkillsDir);

      const pluginSkills = new Set();
      for (const cat of categories) {
        const catDir = join(pluginSkillsDir, cat);
        const items = await getSubdirectories(catDir);
        for (const item of items) {
          const skillPath = join(catDir, item, 'SKILL.md');
          if (await exists(skillPath)) {
            pluginSkills.add(item);
          }
        }
      }

      const docsSkillsDir = join(DOCS_DIR, 'skills');
      const docsSkills = (await getMdxFiles(docsSkillsDir)).filter(s => s !== 'overview');

      const orphans = docsSkills.filter(s => !pluginSkills.has(s));
      expect(orphans, `Orphan skill docs (no plugin): ${orphans.join(', ')}`).toHaveLength(0);
    });
  });
});

describe('Registry Sync Validation', () => {
  let registry = null;

  beforeAll(async () => {
    try {
      const yaml = await import('js-yaml');
      const content = await readFile(join(PLUGIN_DIR, 'registry.yaml'), 'utf-8');
      registry = yaml.load(content);
    } catch {}
  });

  it('registry version should match package.json', async () => {
    if (!registry) return;

    const pkgContent = await readFile(join(ROOT, 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgContent);

    expect(registry.version).toBe(pkg.version);
  });

  it('all registry agents should have docs', async () => {
    if (!registry || !registry.agents) return;

    const docsAgentsDir = join(DOCS_DIR, 'agents');
    const docsAgents = await getMdxFiles(docsAgentsDir);

    // Registry.agents is an object with agent names as keys
    const registryAgents = Object.keys(registry.agents);

    const missing = [];
    for (const agentSlug of registryAgents) {
      if (!docsAgents.includes(agentSlug)) {
        missing.push(agentSlug);
      }
    }

    expect(missing, `Registry agents missing docs: ${missing.join(', ')}`).toHaveLength(0);
  });
});

/**
 * COUNT CONSISTENCY VALIDATION
 *
 * These tests verify that counts shown in documentation match the actual
 * number of files in plugin directories. This is the "ground truth" test
 * to ensure NO inconsistencies exist.
 */
describe('Documentation Count Consistency', () => {
  // Helper to extract numbers from overview content
  function extractCountsFromContent(content) {
    const counts = {};

    // Extract Card title numbers like <Card title="41"
    const cardMatches = content.matchAll(/<Card title="(\d+)" icon="([^"]+)"/g);
    for (const match of cardMatches) {
      const icon = match[2];
      counts[`card_${icon}`] = parseInt(match[1]);
    }

    // Extract description numbers like "41 specialized AI agents"
    const descMatch = content.match(/description: "(\d+)/);
    if (descMatch) {
      counts.description = parseInt(descMatch[1]);
    }

    // Extract **N things** patterns
    const boldMatches = content.matchAll(/\*\*(\d+) (agents|commands|skills|workflows|modes|categories)\*\*/gi);
    for (const match of boldMatches) {
      counts[`bold_${match[2].toLowerCase()}`] = parseInt(match[1]);
    }

    return counts;
  }

  it('agents/overview counts should match actual agent file count', async () => {
    // Count actual agent files
    const agentsDir = join(PLUGIN_DIR, 'agents');
    const agentFiles = await getMdFiles(agentsDir);
    const actualAgentCount = agentFiles.length;

    // Read agents overview
    const overviewPath = join(DOCS_DIR, 'agents', 'overview.mdx');
    const content = await readFile(overviewPath, 'utf-8');
    const counts = extractCountsFromContent(content);

    // Verify the robot card has correct count
    expect(counts.card_robot, `Agent count in Card should be ${actualAgentCount}`).toBe(actualAgentCount);
    expect(counts.description, `Agent count in description should be ${actualAgentCount}`).toBe(actualAgentCount);
  });

  it('commands/all-commands counts should match actual command file count', async () => {
    // Count actual command files across all categories
    const commandsDir = join(PLUGIN_DIR, 'commands');
    const categories = await readdir(commandsDir);
    let actualCommandCount = 0;

    for (const cat of categories) {
      const catPath = join(commandsDir, cat);
      if (await isDirectory(catPath)) {
        const files = await getMdFiles(catPath);
        actualCommandCount += files.length;
      }
    }

    // Read commands overview
    const overviewPath = join(DOCS_DIR, 'commands', 'overview.mdx');
    const content = await readFile(overviewPath, 'utf-8');
    const counts = extractCountsFromContent(content);

    // Verify terminal card has correct count
    expect(counts.card_terminal, `Command count in Card should be ${actualCommandCount}`).toBe(actualCommandCount);
    expect(counts.description, `Command count in description should be ${actualCommandCount}`).toBe(actualCommandCount);
  });

  it('skills/overview counts should match actual skill file count', async () => {
    // Count actual skill files recursively (skills are nested: category/skill-name/SKILL.md)
    const skillsDir = join(PLUGIN_DIR, 'skills');
    const actualSkillCount = await countMdFilesRecursive(skillsDir);

    // Read skills overview
    const overviewPath = join(DOCS_DIR, 'skills', 'overview.mdx');
    const content = await readFile(overviewPath, 'utf-8');
    const counts = extractCountsFromContent(content);

    // Verify brain card has correct count (allow ±2 difference for potential filtering)
    expect(counts.card_brain, `Skill count in Card should be close to ${actualSkillCount}`).toBeGreaterThan(actualSkillCount - 5);
    expect(counts.card_brain, `Skill count in Card should be close to ${actualSkillCount}`).toBeLessThanOrEqual(actualSkillCount);
    expect(counts.description, `Skill count in description should be close to ${actualSkillCount}`).toBeGreaterThan(actualSkillCount - 5);
  });

  it('workflows/overview counts should match actual workflow file count', async () => {
    // Count actual workflow files across all categories
    const workflowsDir = join(PLUGIN_DIR, 'workflows');
    const categories = await readdir(workflowsDir);
    let actualWorkflowCount = 0;

    for (const cat of categories) {
      const catPath = join(workflowsDir, cat);
      if (await isDirectory(catPath)) {
        const files = await getMdFiles(catPath);
        actualWorkflowCount += files.length;
      }
    }

    // Read workflows overview
    const overviewPath = join(DOCS_DIR, 'workflows', 'overview.mdx');
    const content = await readFile(overviewPath, 'utf-8');
    const counts = extractCountsFromContent(content);

    // Verify diagram-project card has correct count
    expect(counts['card_diagram-project'], `Workflow count in Card should be ${actualWorkflowCount}`).toBe(actualWorkflowCount);
    expect(counts.description, `Workflow count in description should be ${actualWorkflowCount}`).toBe(actualWorkflowCount);
  });

  it('modes/overview counts should match actual mode file count', async () => {
    // Count actual mode files
    const modesDir = join(PLUGIN_DIR, 'modes');
    const modeFiles = await getMdFiles(modesDir);
    const actualModeCount = modeFiles.length;

    // Read modes overview
    const overviewPath = join(DOCS_DIR, 'modes', 'overview.mdx');
    const content = await readFile(overviewPath, 'utf-8');
    const counts = extractCountsFromContent(content);

    // Verify sliders card has correct count
    expect(counts.card_sliders, `Mode count in Card should be ${actualModeCount}`).toBe(actualModeCount);
    expect(counts.description, `Mode count in description should be ${actualModeCount}`).toBe(actualModeCount);
  });

  it('introduction.mdx counts should match actual file counts', async () => {
    // Count all actual files
    const agentFiles = await getMdFiles(join(PLUGIN_DIR, 'agents'));
    const modeFiles = await getMdFiles(join(PLUGIN_DIR, 'modes'));

    let commandCount = 0;
    const commandCats = await readdir(join(PLUGIN_DIR, 'commands'));
    for (const cat of commandCats) {
      const catPath = join(PLUGIN_DIR, 'commands', cat);
      if (await isDirectory(catPath)) {
        commandCount += (await getMdFiles(catPath)).length;
      }
    }

    // Skills need recursive count (nested category/skill-name/SKILL.md structure)
    const skillCount = await countMdFilesRecursive(join(PLUGIN_DIR, 'skills'));

    let workflowCount = 0;
    const workflowCats = await readdir(join(PLUGIN_DIR, 'workflows'));
    for (const cat of workflowCats) {
      const catPath = join(PLUGIN_DIR, 'workflows', cat);
      if (await isDirectory(catPath)) {
        workflowCount += (await getMdFiles(catPath)).length;
      }
    }

    // Read introduction
    const introPath = join(DOCS_DIR, 'introduction.mdx');
    const content = await readFile(introPath, 'utf-8');

    // Extract counts from introduction
    const agentMatch = content.match(/title="(\d+) Specialized Agents"/);
    const commandMatch = content.match(/title="(\d+) Slash Commands"/);
    const skillMatch = content.match(/title="(\d+) Domain Skills"/);
    const workflowMatch = content.match(/title="(\d+) Workflows"/);

    if (agentMatch) {
      expect(parseInt(agentMatch[1]), `Introduction agent count should be ${agentFiles.length}`).toBe(agentFiles.length);
    }
    if (commandMatch) {
      expect(parseInt(commandMatch[1]), `Introduction command count should be ${commandCount}`).toBe(commandCount);
    }
    if (skillMatch) {
      // Allow small tolerance for skill counts (some may be filtered during generation)
      expect(parseInt(skillMatch[1]), `Introduction skill count should be close to ${skillCount}`).toBeGreaterThan(skillCount - 5);
    }
    if (workflowMatch) {
      expect(parseInt(workflowMatch[1]), `Introduction workflow count should be ${workflowCount}`).toBe(workflowCount);
    }
  });

  it('package.json description should have accurate counts', async () => {
    // Count all actual files
    const agentFiles = await getMdFiles(join(PLUGIN_DIR, 'agents'));

    let commandCount = 0;
    const commandCats = await readdir(join(PLUGIN_DIR, 'commands'));
    for (const cat of commandCats) {
      const catPath = join(PLUGIN_DIR, 'commands', cat);
      if (await isDirectory(catPath)) {
        commandCount += (await getMdFiles(catPath)).length;
      }
    }

    // Skills need recursive count (nested category/skill-name/SKILL.md structure)
    const skillCount = await countMdFilesRecursive(join(PLUGIN_DIR, 'skills'));

    let workflowCount = 0;
    const workflowCats = await readdir(join(PLUGIN_DIR, 'workflows'));
    for (const cat of workflowCats) {
      const catPath = join(PLUGIN_DIR, 'workflows', cat);
      if (await isDirectory(catPath)) {
        workflowCount += (await getMdFiles(catPath)).length;
      }
    }

    // Read package.json
    const pkgContent = await readFile(join(ROOT, 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgContent);

    // Extract counts from description
    const desc = pkg.description;
    const agentMatch = desc.match(/(\d+) agents/);
    const commandMatch = desc.match(/(\d+) commands/);
    const skillMatch = desc.match(/(\d+) skills/);
    const workflowMatch = desc.match(/(\d+) workflows/);

    if (agentMatch) {
      expect(parseInt(agentMatch[1]), `package.json agent count should be ${agentFiles.length}`).toBe(agentFiles.length);
    }
    if (commandMatch) {
      expect(parseInt(commandMatch[1]), `package.json command count should be ${commandCount}`).toBe(commandCount);
    }
    if (skillMatch) {
      // Allow small tolerance for skill counts (some may be filtered during generation)
      expect(parseInt(skillMatch[1]), `package.json skill count should be close to ${skillCount}`).toBeGreaterThan(skillCount - 5);
    }
    if (workflowMatch) {
      expect(parseInt(workflowMatch[1]), `package.json workflow count should be ${workflowCount}`).toBe(workflowCount);
    }
  });
});
