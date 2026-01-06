#!/usr/bin/env node

/**
 * OMGKIT mint.json Generator
 * Auto-generates Mintlify navigation from actual docs structure
 *
 * This ensures docs navigation is ALWAYS in sync with generated docs.
 * Single Source of Truth: plugin/ → docs/ → mint.json
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');
const MINT_JSON_PATH = join(DOCS_DIR, 'mint.json');

/**
 * Static configuration that doesn't change
 */
const STATIC_CONFIG = {
  "$schema": "https://mintlify.com/schema.json",
  "name": "OMGKIT Documentation",
  "logo": {
    "dark": "/logo/dark.svg",
    "light": "/logo/light.svg"
  },
  "favicon": "/favicon.svg",
  "colors": {
    "primary": "#7C3AED",
    "light": "#A78BFA",
    "dark": "#5B21B6",
    "anchors": {
      "from": "#7C3AED",
      "to": "#F59E0B"
    }
  },
  "topbarLinks": [
    {
      "name": "GitHub",
      "url": "https://github.com/doanchienthangdev/omgkit"
    }
  ],
  "topbarCtaButton": {
    "name": "Get Started",
    "url": "/getting-started/installation"
  },
  "tabs": [
    { "name": "Agents", "url": "agents" },
    { "name": "Commands", "url": "commands" },
    { "name": "Skills", "url": "skills" },
    { "name": "Workflows", "url": "workflows" }
  ],
  "anchors": [
    {
      "name": "npm Package",
      "icon": "npm",
      "url": "https://www.npmjs.com/package/omgkit"
    },
    {
      "name": "Community",
      "icon": "github",
      "url": "https://github.com/doanchienthangdev/omgkit/discussions"
    }
  ],
  "footerSocials": {
    "github": "https://github.com/doanchienthangdev/omgkit"
  },
  "feedback": {
    "thumbsRating": true,
    "suggestEdit": true,
    "raiseIssue": true
  },
  "redirects": [
    { "source": "/commands", "destination": "/commands/overview" },
    { "source": "/commands/all", "destination": "/commands/overview" },
    { "source": "/commands/all-commands", "destination": "/commands/overview" },
    { "source": "/skills", "destination": "/skills/overview" },
    { "source": "/skills/all", "destination": "/skills/overview" },
    { "source": "/workflows", "destination": "/workflows/overview" }
  ]
};

/**
 * Static navigation groups (manually maintained sections)
 */
const STATIC_NAVIGATION = [
  {
    "group": "Get Started",
    "pages": [
      "introduction",
      "getting-started/installation",
      "getting-started/quickstart",
      "getting-started/configuration"
    ]
  },
  {
    "group": "Core Concepts",
    "pages": [
      "concepts/omega-philosophy",
      "concepts/alignment-principle",
      "concepts/sprint-management",
      "concepts/ai-team",
      "concepts/artifacts"
    ]
  },
  {
    "group": "Modes",
    "pages": [
      "modes/overview",
      "modes/default",
      "modes/omega",
      "modes/autonomous",
      "modes/tutor",
      "modes/brainstorm",
      "modes/deep-research",
      "modes/implementation",
      "modes/review",
      "modes/orchestration",
      "modes/token-efficient"
    ]
  },
  {
    "group": "Autonomous Development",
    "pages": [
      "autonomous/overview",
      "autonomous/commands",
      "autonomous/archetypes"
    ]
  },
  {
    "group": "Reference",
    "pages": [
      "reference/cli",
      "reference/project-structure"
    ]
  },
  {
    "group": "Resources",
    "pages": [
      "resources/faq",
      "resources/contributing",
      "resources/before-commit",
      "resources/changelog"
    ]
  }
];

/**
 * Agent category groupings (based on AGENT_METADATA categories)
 */
const AGENT_CATEGORIES = {
  'Core Development': ['planner', 'researcher', 'debugger', 'tester', 'code-reviewer', 'scout'],
  'Operations': ['git-manager', 'docs-manager', 'project-manager', 'database-admin', 'ui-ux-designer', 'observability-engineer'],
  'Extended': ['fullstack-developer', 'cicd-manager', 'security-auditor', 'api-designer', 'vulnerability-scanner', 'pipeline-architect', 'devsecops'],
  'Creative': ['copywriter', 'brainstormer', 'journal-writer'],
  'Omega Exclusive': ['oracle', 'architect', 'sprint-master'],
  'Architecture': ['domain-decomposer', 'platform-engineer'],
  'Data & ML': ['data-engineer', 'ml-engineer', 'data-scientist-agent', 'experiment-analyst-agent', 'ml-engineer-agent', 'mlops-engineer-agent', 'model-optimizer-agent', 'production-engineer-agent', 'research-scientist-agent', 'ai-architect-agent'],
  'Performance': ['performance-engineer'],
  'Specialized': ['game-systems-designer', 'embedded-systems', 'scientific-computing']
};

/**
 * Skill category display names and order
 */
const SKILL_CATEGORY_ORDER = [
  'languages', 'frameworks', 'backend', 'databases', 'frontend', 'mobile', 'mobile-advanced',
  'devops', 'security', 'testing', 'tools', 'integrations', 'methodology', 'omega',
  'ai-engineering', 'ai-ml', 'ml-systems', 'autonomous', 'microservices', 'event-driven',
  'game', 'iot', 'simulation'
];

const SKILL_CATEGORY_NAMES = {
  'languages': 'Languages',
  'frameworks': 'Frameworks',
  'backend': 'Backend',
  'databases': 'Databases',
  'frontend': 'Frontend',
  'mobile': 'Mobile',
  'mobile-advanced': 'Mobile Advanced',
  'devops': 'DevOps',
  'security': 'Security',
  'testing': 'Testing',
  'tools': 'Tools',
  'integrations': 'Integrations',
  'methodology': 'Methodology',
  'omega': 'Omega Skills',
  'ai-engineering': 'AI Engineering',
  'ai-ml': 'AI-ML Operations',
  'ml-systems': 'ML Systems',
  'autonomous': 'Autonomous',
  'microservices': 'Microservices',
  'event-driven': 'Event-Driven',
  'game': 'Game Development',
  'iot': 'IoT',
  'simulation': 'Simulation'
};

/**
 * Workflow category display names
 */
const WORKFLOW_CATEGORY_NAMES = {
  'development': 'Development',
  'ai-engineering': 'AI Engineering',
  'ai-ml': 'AI-ML Workflows',
  'ml-systems': 'ML Systems Workflows',
  'omega': 'Omega',
  'sprint': 'Sprint',
  'security': 'Security',
  'database': 'Database',
  'api': 'API',
  'fullstack': 'Full Stack',
  'content': 'Content',
  'research': 'Research',
  'quality': 'Quality',
  'microservices': 'Microservices Workflows',
  'event-driven': 'Event-Driven Workflows',
  'game-dev': 'Game Development Workflows'
};

/**
 * Get all .mdx files in a directory
 */
async function getMdxFiles(dir) {
  try {
    const files = await readdir(dir);
    return files
      .filter(f => f.endsWith('.mdx'))
      .map(f => basename(f, '.mdx'))
      .sort();
  } catch {
    return [];
  }
}

/**
 * Check if a path is a directory
 */
async function isDirectory(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Get subdirectories in a directory
 */
async function getSubdirectories(dir) {
  try {
    const items = await readdir(dir);
    const dirs = [];
    for (const item of items) {
      if (await isDirectory(join(dir, item))) {
        dirs.push(item);
      }
    }
    return dirs.sort();
  } catch {
    return [];
  }
}

/**
 * Generate agents navigation
 */
async function generateAgentsNavigation() {
  const agentsDir = join(DOCS_DIR, 'agents');
  const allAgents = await getMdxFiles(agentsDir);

  const navigation = [];

  // Overview group
  navigation.push({
    "group": "Agents Overview",
    "pages": ["agents/overview"]
  });

  // Group agents by category
  for (const [category, expectedAgents] of Object.entries(AGENT_CATEGORIES)) {
    const categoryAgents = expectedAgents.filter(a => allAgents.includes(a));
    if (categoryAgents.length > 0) {
      navigation.push({
        "group": category,
        "pages": categoryAgents.map(a => `agents/${a}`)
      });
    }
  }

  // Find any uncategorized agents
  const categorizedAgents = new Set(Object.values(AGENT_CATEGORIES).flat());
  const uncategorized = allAgents.filter(a =>
    a !== 'overview' && !categorizedAgents.has(a)
  );

  if (uncategorized.length > 0) {
    navigation.push({
      "group": "Other Agents",
      "pages": uncategorized.map(a => `agents/${a}`)
    });
  }

  return navigation;
}

/**
 * Generate commands navigation
 */
async function generateCommandsNavigation() {
  const commandsDir = join(DOCS_DIR, 'commands');
  const allCommands = await getMdxFiles(commandsDir);

  // Group commands by their prefix/category from plugin structure
  const pluginCommandsDir = join(ROOT, 'plugin', 'commands');
  const commandCategories = await getSubdirectories(pluginCommandsDir);

  const navigation = [];

  // Commands overview
  navigation.push({
    "group": "Commands Overview",
    "pages": ["commands/overview"]
  });

  // Group by category
  const commandsByCategory = {};
  for (const cat of commandCategories) {
    const catDir = join(pluginCommandsDir, cat);
    try {
      const files = await readdir(catDir);
      const mdFiles = files.filter(f => f.endsWith('.md')).map(f => {
        let name = basename(f, '.md');
        // Avoid Mintlify reserved name conflict
        if (name === 'index') {
          name = 'context-index';
        }
        return name;
      });
      if (mdFiles.length > 0) {
        commandsByCategory[cat] = mdFiles.filter(cmd => allCommands.includes(cmd));
      }
    } catch {}
  }

  // Add categorized commands
  const categoryDisplayNames = {
    'dev': 'Development',
    'planning': 'Planning',
    'git': 'Git & Deploy',
    'quality': 'Quality',
    'context': 'Context',
    'design': 'Design',
    'omega': 'Omega',
    'sprint': 'Sprint',
    'alignment': 'Alignment',
    'auto': 'Autonomous',
    'domain': 'Domain',
    'perf': 'Performance',
    'platform': 'Platform',
    'security': 'Security',
    'sre': 'SRE',
    'ml': 'ML Commands',
    'game': 'Game',
    'iot': 'IoT',
    'data': 'Data',
    'workflow': 'Workflow Commands',
    'omgml': 'OMGML',
    'omgdata': 'OMGDATA',
    'omgfeature': 'OMGFEATURE',
    'omgtrain': 'OMGTRAIN',
    'omgoptim': 'OMGOPTIM',
    'omgdeploy': 'OMGDEPLOY',
    'omgops': 'OMGOPS'
  };

  const categoryOrder = [
    'dev', 'planning', 'git', 'quality', 'alignment', 'auto', 'domain', 'perf',
    'platform', 'security', 'context', 'design', 'omega', 'sprint', 'sre',
    'ml', 'game', 'iot', 'data', 'workflow',
    'omgml', 'omgdata', 'omgfeature', 'omgtrain', 'omgoptim', 'omgdeploy', 'omgops'
  ];

  // Track added commands to avoid duplicates
  const addedCommands = new Set();

  for (const cat of categoryOrder) {
    const cmds = commandsByCategory[cat];
    if (cmds && cmds.length > 0) {
      // Filter out commands already added to previous categories
      const uniqueCmds = cmds.filter(c => !addedCommands.has(c));
      if (uniqueCmds.length > 0) {
        navigation.push({
          "group": categoryDisplayNames[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
          "pages": uniqueCmds.sort().map(c => `commands/${c}`)
        });
        uniqueCmds.forEach(c => addedCommands.add(c));
      }
    }
  }

  // Add any uncategorized commands
  const categorizedCommands = new Set(Object.values(commandsByCategory).flat());
  const uncategorized = allCommands.filter(c =>
    c !== 'overview' && c !== 'all' && c !== 'all-commands' && !categorizedCommands.has(c)
  );

  if (uncategorized.length > 0) {
    navigation.push({
      "group": "Other Commands",
      "pages": uncategorized.map(c => `commands/${c}`)
    });
  }

  return navigation;
}

/**
 * Generate skills navigation by discovering actual skill categories
 */
async function generateSkillsNavigation() {
  const skillsDir = join(DOCS_DIR, 'skills');
  const pluginSkillsDir = join(ROOT, 'plugin', 'skills');

  const allSkills = await getMdxFiles(skillsDir);
  const skillCategories = await getSubdirectories(pluginSkillsDir);

  const navigation = [];

  // Skills overview
  navigation.push({
    "group": "Skills Overview",
    "pages": ["skills/overview"]
  });

  // Build skill to category mapping
  const skillToCategory = {};
  for (const cat of skillCategories) {
    const catDir = join(pluginSkillsDir, cat);
    try {
      const items = await readdir(catDir);
      for (const item of items) {
        const skillPath = join(catDir, item, 'SKILL.md');
        try {
          await stat(skillPath);
          skillToCategory[item] = cat;
        } catch {}
      }
    } catch {}
  }

  // Group skills by category
  const skillsByCategory = {};
  for (const skill of allSkills) {
    if (skill === 'overview') continue;
    const cat = skillToCategory[skill] || 'other';
    if (!skillsByCategory[cat]) {
      skillsByCategory[cat] = [];
    }
    skillsByCategory[cat].push(skill);
  }

  // Add navigation groups in order
  for (const cat of SKILL_CATEGORY_ORDER) {
    const skills = skillsByCategory[cat];
    if (skills && skills.length > 0) {
      navigation.push({
        "group": SKILL_CATEGORY_NAMES[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
        "pages": skills.sort().map(s => `skills/${s}`)
      });
    }
  }

  // Add any uncategorized skills
  const categorized = new Set(SKILL_CATEGORY_ORDER);
  for (const [cat, skills] of Object.entries(skillsByCategory)) {
    if (!categorized.has(cat) && skills.length > 0) {
      navigation.push({
        "group": SKILL_CATEGORY_NAMES[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
        "pages": skills.sort().map(s => `skills/${s}`)
      });
    }
  }

  return navigation;
}

/**
 * Generate workflows navigation by discovering actual workflow categories
 */
async function generateWorkflowsNavigation() {
  const workflowsDir = join(DOCS_DIR, 'workflows');
  const pluginWorkflowsDir = join(ROOT, 'plugin', 'workflows');

  const allWorkflows = await getMdxFiles(workflowsDir);
  const workflowCategories = await getSubdirectories(pluginWorkflowsDir);

  const navigation = [];

  // Workflows overview
  navigation.push({
    "group": "Workflows Overview",
    "pages": ["workflows/overview"]
  });

  // Build workflow to category mapping
  const workflowToCategory = {};
  for (const cat of workflowCategories) {
    const catDir = join(pluginWorkflowsDir, cat);
    try {
      const files = await readdir(catDir);
      const mdFiles = files.filter(f => f.endsWith('.md')).map(f => basename(f, '.md'));
      for (const wf of mdFiles) {
        workflowToCategory[wf] = cat;
      }
    } catch {}
  }

  // Group workflows by category
  const workflowsByCategory = {};
  for (const wf of allWorkflows) {
    if (wf === 'overview') continue;
    const cat = workflowToCategory[wf] || 'other';
    if (!workflowsByCategory[cat]) {
      workflowsByCategory[cat] = [];
    }
    workflowsByCategory[cat].push(wf);
  }

  // Add navigation groups
  const categoryOrder = [
    'development', 'ai-engineering', 'ai-ml', 'ml-systems', 'omega', 'sprint',
    'security', 'database', 'api', 'fullstack', 'content', 'research', 'quality',
    'microservices', 'event-driven', 'game-dev'
  ];

  for (const cat of categoryOrder) {
    const workflows = workflowsByCategory[cat];
    if (workflows && workflows.length > 0) {
      navigation.push({
        "group": WORKFLOW_CATEGORY_NAMES[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
        "pages": workflows.sort().map(w => `workflows/${w}`)
      });
    }
  }

  // Add any uncategorized workflows
  const categorized = new Set(categoryOrder);
  for (const [cat, workflows] of Object.entries(workflowsByCategory)) {
    if (!categorized.has(cat) && workflows.length > 0) {
      navigation.push({
        "group": WORKFLOW_CATEGORY_NAMES[cat] || cat.charAt(0).toUpperCase() + cat.slice(1),
        "pages": workflows.sort().map(w => `workflows/${w}`)
      });
    }
  }

  return navigation;
}

/**
 * Read current package.json version
 */
async function getVersion() {
  try {
    const pkg = JSON.parse(await readFile(join(ROOT, 'package.json'), 'utf-8'));
    return pkg.version;
  } catch {
    return '0.0.0';
  }
}

/**
 * Main function to generate mint.json
 */
async function generateMintJson() {
  console.log('Generating mint.json from docs structure...');

  const version = await getVersion();

  // Generate dynamic navigation
  const agentsNav = await generateAgentsNavigation();
  const commandsNav = await generateCommandsNavigation();
  const skillsNav = await generateSkillsNavigation();
  const workflowsNav = await generateWorkflowsNavigation();

  // Combine all navigation
  const navigation = [
    ...STATIC_NAVIGATION,
    ...agentsNav,
    ...commandsNav,
    ...skillsNav,
    ...workflowsNav
  ];

  // Build complete mint.json
  const mintJson = {
    ...STATIC_CONFIG,
    version,
    navigation
  };

  // Write mint.json
  await writeFile(MINT_JSON_PATH, JSON.stringify(mintJson, null, 2));

  // Count statistics
  const agentPages = agentsNav.reduce((acc, g) => acc + g.pages.length, 0);
  const commandPages = commandsNav.reduce((acc, g) => acc + g.pages.length, 0);
  const skillPages = skillsNav.reduce((acc, g) => acc + g.pages.length, 0);
  const workflowPages = workflowsNav.reduce((acc, g) => acc + g.pages.length, 0);

  console.log(`  Version: ${version}`);
  console.log(`  Agent pages: ${agentPages}`);
  console.log(`  Command pages: ${commandPages}`);
  console.log(`  Skill pages: ${skillPages}`);
  console.log(`  Workflow pages: ${workflowPages}`);
  console.log(`  Total navigation groups: ${navigation.length}`);
  console.log(`✓ mint.json generated successfully!`);

  return {
    agents: agentPages,
    commands: commandPages,
    skills: skillPages,
    workflows: workflowPages,
    groups: navigation.length
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMintJson().catch(err => {
    console.error('Error generating mint.json:', err);
    process.exit(1);
  });
}

export { generateMintJson };
