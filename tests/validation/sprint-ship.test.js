/**
 * Sprint Ship Command Tests
 *
 * Comprehensive validation tests for /sprint:ship command
 * - Command frontmatter validation
 * - Configuration validation
 * - Integration tests
 * - Documentation alignment
 */

import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const PLUGIN_DIR = path.join(process.cwd(), 'plugin');
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const DOCS_DIR = path.join(process.cwd(), 'docs');

describe('Sprint Ship Command', () => {
  let shipCommand;
  let workflowTemplate;
  let registryYaml;

  beforeAll(() => {
    // Load ship command
    const shipPath = path.join(PLUGIN_DIR, 'commands/sprint/ship.md');
    if (fs.existsSync(shipPath)) {
      shipCommand = fs.readFileSync(shipPath, 'utf-8');
    }

    // Load workflow template
    const workflowPath = path.join(TEMPLATES_DIR, 'omgkit/workflow.yaml');
    if (fs.existsSync(workflowPath)) {
      const content = fs.readFileSync(workflowPath, 'utf-8');
      workflowTemplate = yaml.load(content);
    }

    // Load registry
    const registryPath = path.join(PLUGIN_DIR, 'registry.yaml');
    if (fs.existsSync(registryPath)) {
      const content = fs.readFileSync(registryPath, 'utf-8');
      registryYaml = yaml.load(content);
    }
  });

  describe('Command File Exists', () => {
    it('should have ship.md in sprint commands', () => {
      const shipPath = path.join(PLUGIN_DIR, 'commands/sprint/ship.md');
      expect(fs.existsSync(shipPath)).toBe(true);
    });

    it('should have non-empty content', () => {
      expect(shipCommand).toBeDefined();
      expect(shipCommand.length).toBeGreaterThan(100);
    });
  });

  describe('Command Frontmatter', () => {
    let frontmatter;

    beforeAll(() => {
      if (shipCommand) {
        const match = shipCommand.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
          frontmatter = yaml.load(match[1]);
        }
      }
    });

    it('should have valid frontmatter', () => {
      expect(frontmatter).toBeDefined();
    });

    it('should have description field', () => {
      expect(frontmatter.description).toBeDefined();
      expect(frontmatter.description).toContain('sprint');
    });

    it('should have allowed-tools field', () => {
      expect(frontmatter['allowed-tools']).toBeDefined();
      expect(frontmatter['allowed-tools']).toContain('Bash');
    });

    it('should have argument-hint field', () => {
      expect(frontmatter['argument-hint']).toBeDefined();
      expect(frontmatter['argument-hint']).toContain('message');
    });

    it('should support --skip-tests option', () => {
      expect(frontmatter['argument-hint']).toContain('--skip-tests');
    });

    it('should support --no-pr option', () => {
      expect(frontmatter['argument-hint']).toContain('--no-pr');
    });

    it('should support --force option', () => {
      expect(frontmatter['argument-hint']).toContain('--force');
    });

    it('should have ship configuration section', () => {
      expect(frontmatter.ship).toBeDefined();
    });

    it('should have auto_test in ship config', () => {
      expect(frontmatter.ship.auto_test).toBe(true);
    });

    it('should have auto_pr in ship config', () => {
      expect(frontmatter.ship.auto_pr).toBe(true);
    });

    it('should have commit_prefix in ship config', () => {
      expect(frontmatter.ship.commit_prefix).toBeDefined();
      expect(frontmatter.ship.commit_prefix).toContain('sprint');
    });

    it('should have related_skills array', () => {
      expect(Array.isArray(frontmatter.related_skills)).toBe(true);
      expect(frontmatter.related_skills.length).toBeGreaterThan(0);
    });

    it('should have related_commands array', () => {
      expect(Array.isArray(frontmatter.related_commands)).toBe(true);
      expect(frontmatter.related_commands.length).toBeGreaterThan(0);
    });

    it('should reference /sprint:sprint-end', () => {
      expect(frontmatter.related_commands).toContain('/sprint:sprint-end');
    });

    it('should reference /git:ship', () => {
      expect(frontmatter.related_commands).toContain('/git:ship');
    });
  });

  describe('Command Content', () => {
    it('should have overview section', () => {
      expect(shipCommand).toMatch(/## Overview/i);
    });

    it('should have options section', () => {
      expect(shipCommand).toMatch(/## Options/i);
    });

    it('should have workflow diagram', () => {
      expect(shipCommand).toMatch(/## Workflow Diagram/i);
    });

    it('should have configuration section', () => {
      expect(shipCommand).toMatch(/## Configuration/i);
    });

    it('should have examples section', () => {
      expect(shipCommand).toMatch(/## Examples/i);
    });

    it('should have error handling section', () => {
      expect(shipCommand).toMatch(/## Error Handling/i);
    });

    it('should have best practices section', () => {
      expect(shipCommand).toMatch(/## Best Practices/i);
    });

    it('should describe 6 phases', () => {
      expect(shipCommand).toMatch(/PHASE 1.*VALIDATION/i);
      expect(shipCommand).toMatch(/PHASE 2.*TESTING/i);
      expect(shipCommand).toMatch(/PHASE 3.*SPRINT END/i);
      expect(shipCommand).toMatch(/PHASE 4.*GIT/i);
      expect(shipCommand).toMatch(/PHASE 5.*PR|CI/i);
      expect(shipCommand).toMatch(/PHASE 6.*REPORT/i);
    });

    it('should have minimum 50 lines', () => {
      const lines = shipCommand.split('\n').length;
      expect(lines).toBeGreaterThan(50);
    });
  });

  describe('Workflow Template Configuration', () => {
    it('should have ship section in workflow.yaml', () => {
      expect(workflowTemplate.ship).toBeDefined();
    });

    it('should have auto_test setting', () => {
      expect(workflowTemplate.ship.auto_test).toBeDefined();
      expect(typeof workflowTemplate.ship.auto_test).toBe('boolean');
    });

    it('should have test_command setting', () => {
      expect(workflowTemplate.ship.test_command).toBeDefined();
      expect(workflowTemplate.ship.test_command).toContain('npm test');
    });

    it('should have create_pr setting', () => {
      expect(workflowTemplate.ship.create_pr).toBeDefined();
      expect(typeof workflowTemplate.ship.create_pr).toBe('boolean');
    });

    it('should have pr configuration', () => {
      expect(workflowTemplate.ship.pr).toBeDefined();
    });

    it('should have pr.draft setting', () => {
      expect(workflowTemplate.ship.pr.draft).toBeDefined();
      expect(typeof workflowTemplate.ship.pr.draft).toBe('boolean');
    });

    it('should have pr.reviewers array', () => {
      expect(Array.isArray(workflowTemplate.ship.pr.reviewers)).toBe(true);
    });

    it('should have pr.labels array', () => {
      expect(Array.isArray(workflowTemplate.ship.pr.labels)).toBe(true);
    });

    it('should have sprint-complete label by default', () => {
      expect(workflowTemplate.ship.pr.labels).toContain('sprint-complete');
    });

    it('should have commit configuration', () => {
      expect(workflowTemplate.ship.commit).toBeDefined();
    });

    it('should have commit.prefix setting', () => {
      expect(workflowTemplate.ship.commit.prefix).toBeDefined();
    });

    it('should have commit.include_retrospective setting', () => {
      expect(workflowTemplate.ship.commit.include_retrospective).toBeDefined();
    });

    it('should have commit.include_metrics setting', () => {
      expect(workflowTemplate.ship.commit.include_metrics).toBeDefined();
    });

    it('should have behavior configuration', () => {
      expect(workflowTemplate.ship.behavior).toBeDefined();
    });

    it('should have allow_incomplete setting', () => {
      expect(workflowTemplate.ship.behavior.allow_incomplete).toBeDefined();
      expect(workflowTemplate.ship.behavior.allow_incomplete).toBe(false);
    });

    it('should have archive_sprint setting', () => {
      expect(workflowTemplate.ship.behavior.archive_sprint).toBeDefined();
      expect(workflowTemplate.ship.behavior.archive_sprint).toBe(true);
    });

    it('should have pre_commit_checks setting', () => {
      expect(workflowTemplate.ship.behavior.pre_commit_checks).toBeDefined();
    });
  });

  describe('Registry Integration', () => {
    it('should be registered in sprint-master agent', () => {
      const sprintMaster = registryYaml.agents['sprint-master'];
      expect(sprintMaster).toBeDefined();
      expect(sprintMaster.commands).toContain('/sprint:ship');
    });

    it('should be in sprint-execution workflow', () => {
      const workflow = registryYaml.workflows['sprint/sprint-execution'];
      expect(workflow).toBeDefined();
      expect(workflow.commands).toContain('/sprint:ship');
    });

    it('should be in sprint-retrospective workflow', () => {
      const workflow = registryYaml.workflows['sprint/sprint-retrospective'];
      expect(workflow).toBeDefined();
      expect(workflow.commands).toContain('/sprint:ship');
    });
  });

  describe('Agent File Integration', () => {
    let sprintMasterContent;

    beforeAll(() => {
      const agentPath = path.join(PLUGIN_DIR, 'agents/sprint-master.md');
      if (fs.existsSync(agentPath)) {
        sprintMasterContent = fs.readFileSync(agentPath, 'utf-8');
      }
    });

    it('should have /sprint:ship in sprint-master commands', () => {
      expect(sprintMasterContent).toContain('/sprint:ship');
    });
  });

  describe('Workflow Files Integration', () => {
    let sprintExecutionContent;
    let sprintRetroContent;

    beforeAll(() => {
      const execPath = path.join(PLUGIN_DIR, 'workflows/sprint/sprint-execution.md');
      const retroPath = path.join(PLUGIN_DIR, 'workflows/sprint/sprint-retrospective.md');

      if (fs.existsSync(execPath)) {
        sprintExecutionContent = fs.readFileSync(execPath, 'utf-8');
      }
      if (fs.existsSync(retroPath)) {
        sprintRetroContent = fs.readFileSync(retroPath, 'utf-8');
      }
    });

    it('should have /sprint:ship in sprint-execution workflow', () => {
      expect(sprintExecutionContent).toContain('/sprint:ship');
    });

    it('should have /sprint:ship in sprint-retrospective workflow', () => {
      expect(sprintRetroContent).toContain('/sprint:ship');
    });

    it('should have Ship step in sprint-execution workflow', () => {
      expect(sprintExecutionContent).toMatch(/Step.*Ship/i);
    });
  });

  describe('Related Skills Validation', () => {
    let frontmatter;

    beforeAll(() => {
      if (shipCommand) {
        const match = shipCommand.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
          frontmatter = yaml.load(match[1]);
        }
      }
    });

    it('should reference project-orchestration skill', () => {
      expect(frontmatter.related_skills.some(s => s.includes('project-orchestration'))).toBe(true);
    });

    it('should reference omega-sprint skill', () => {
      expect(frontmatter.related_skills.some(s => s.includes('omega-sprint'))).toBe(true);
    });

    it('should reference workflow-config skill', () => {
      expect(frontmatter.related_skills.some(s => s.includes('workflow-config'))).toBe(true);
    });

    it('all related skills should exist', () => {
      const skillsDir = path.join(PLUGIN_DIR, 'skills');

      frontmatter.related_skills.forEach(skill => {
        const skillPath = path.join(skillsDir, skill, 'SKILL.md');
        expect(fs.existsSync(skillPath)).toBe(true);
      });
    });
  });

  describe('Related Commands Validation', () => {
    let frontmatter;

    beforeAll(() => {
      if (shipCommand) {
        const match = shipCommand.match(/^---\n([\s\S]*?)\n---/);
        if (match) {
          frontmatter = yaml.load(match[1]);
        }
      }
    });

    it('all related commands should exist', () => {
      const commandsDir = path.join(PLUGIN_DIR, 'commands');

      frontmatter.related_commands.forEach(cmd => {
        // Parse command like /sprint:sprint-end -> sprint/sprint-end.md
        const parts = cmd.replace('/', '').split(':');
        const namespace = parts[0];
        const name = parts[1];
        const cmdPath = path.join(commandsDir, namespace, `${name}.md`);
        expect(fs.existsSync(cmdPath)).toBe(true);
      });
    });
  });

  describe('Options Completeness', () => {
    it('should document message option', () => {
      expect(shipCommand).toMatch(/message.*commit message/i);
    });

    it('should document --skip-tests option', () => {
      expect(shipCommand).toMatch(/--skip-tests.*skip.*test/i);
    });

    it('should document --no-pr option', () => {
      expect(shipCommand).toMatch(/--no-pr.*without.*pr/i);
    });

    it('should document --force option', () => {
      expect(shipCommand).toMatch(/--force.*incomplete/i);
    });
  });

  describe('Examples Completeness', () => {
    it('should have basic usage example', () => {
      expect(shipCommand).toMatch(/\/sprint:ship\s*$/m);
    });

    it('should have example with message', () => {
      expect(shipCommand).toMatch(/\/sprint:ship\s+"[^"]+"/);
    });

    it('should have example with --skip-tests', () => {
      expect(shipCommand).toMatch(/\/sprint:ship.*--skip-tests/);
    });

    it('should have example with --no-pr', () => {
      expect(shipCommand).toMatch(/\/sprint:ship.*--no-pr/);
    });

    it('should have example with --force', () => {
      expect(shipCommand).toMatch(/\/sprint:ship.*--force/);
    });

    it('should have full workflow example', () => {
      expect(shipCommand).toMatch(/\/sprint:sprint-new/);
      expect(shipCommand).toMatch(/\/sprint:team-run/);
      expect(shipCommand).toMatch(/\/sprint:ship/);
    });
  });

  describe('Error Scenarios', () => {
    it('should document no active sprint error', () => {
      expect(shipCommand).toMatch(/no active sprint/i);
    });

    it('should document tests failed error', () => {
      expect(shipCommand).toMatch(/tests failed/i);
    });

    it('should document incomplete tasks warning', () => {
      expect(shipCommand).toMatch(/incomplete.*tasks/i);
    });
  });

  describe('Command Alignment with Sprint Lifecycle', () => {
    it('should mention sprint-new for creating sprints', () => {
      expect(shipCommand).toMatch(/sprint-new/);
    });

    it('should mention sprint-end for ending sprints', () => {
      expect(shipCommand).toMatch(/sprint-end/);
    });

    it('should mention team-run for executing sprints', () => {
      expect(shipCommand).toMatch(/team-run/);
    });
  });

  describe('Security Considerations', () => {
    it('should not contain actual secrets or credentials', () => {
      // Check for actual credential patterns, not documentation mentions
      expect(shipCommand).not.toMatch(/password\s*[:=]\s*["'][^"']+["']/i);
      expect(shipCommand).not.toMatch(/api_key\s*[:=]\s*["'][^"']+["']/i);
      expect(shipCommand).not.toMatch(/secret\s*[:=]\s*["'][^"']+["']/i);
    });

    it('should warn about skipping tests', () => {
      expect(shipCommand).toMatch(/not recommended|caution|warning/i);
    });
  });

  describe('Command Count Consistency', () => {
    it('should have consistent command count after adding ship', () => {
      // Count sprint commands
      const sprintCmdDir = path.join(PLUGIN_DIR, 'commands/sprint');
      const sprintCommands = fs.readdirSync(sprintCmdDir).filter(f => f.endsWith('.md'));

      // Should now be 14 (was 13 before ship)
      expect(sprintCommands).toContain('ship.md');
      expect(sprintCommands.length).toBe(14);
    });
  });
});
