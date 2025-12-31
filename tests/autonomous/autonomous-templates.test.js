/**
 * Autonomous Templates Test Suite
 *
 * Tests for templates used in autonomous project development.
 * Validates YAML structure, required fields, and content completeness.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const TEMPLATES_DIR = path.join(__dirname, '..', '..', 'plugin', 'templates', 'autonomous');

describe('Autonomous Templates', () => {
  describe('Discovery Questions', () => {
    let questions;

    beforeAll(() => {
      const questionsPath = path.join(TEMPLATES_DIR, 'discovery-questions.yaml');
      const content = fs.readFileSync(questionsPath, 'utf8');
      questions = yaml.load(content);
    });

    it('should have valid YAML structure', () => {
      expect(questions).toBeDefined();
      expect(typeof questions).toBe('object');
    });

    it('should have version field', () => {
      expect(questions.version).toBeDefined();
    });

    it('should have all 5 discovery stages', () => {
      expect(questions.stages).toBeDefined();
      expect(questions.stages.length).toBe(5);
    });

    it('should have vision stage with questions', () => {
      const visionStage = questions.stages.find((s) => s.id === 'vision');
      expect(visionStage).toBeDefined();
      expect(visionStage.questions).toBeDefined();
      expect(visionStage.questions.length).toBeGreaterThan(0);
    });

    it('should have users stage with questions', () => {
      const usersStage = questions.stages.find((s) => s.id === 'users');
      expect(usersStage).toBeDefined();
      expect(usersStage.questions).toBeDefined();
    });

    it('should have features stage with questions', () => {
      const featuresStage = questions.stages.find((s) => s.id === 'features');
      expect(featuresStage).toBeDefined();
      expect(featuresStage.questions).toBeDefined();
    });

    it('should have technical stage with questions', () => {
      const technicalStage = questions.stages.find((s) => s.id === 'technical');
      expect(technicalStage).toBeDefined();
      expect(technicalStage.questions).toBeDefined();
    });

    it('should have risks stage with questions', () => {
      const risksStage = questions.stages.find((s) => s.id === 'risks');
      expect(risksStage).toBeDefined();
      expect(risksStage.questions).toBeDefined();
    });

    it('each question should have required fields', () => {
      questions.stages.forEach((stage) => {
        stage.questions.forEach((question) => {
          expect(question.id).toBeDefined();
          expect(question.question).toBeDefined();
          expect(question.type).toBeDefined();
        });
      });
    });

    it('choice questions should have options', () => {
      questions.stages.forEach((stage) => {
        stage.questions
          .filter((q) => q.type === 'single_choice' || q.type === 'multiple_choice')
          .forEach((question) => {
            expect(question.options).toBeDefined();
            expect(question.options.length).toBeGreaterThan(0);
          });
      });
    });
  });

  describe('PRD Template', () => {
    let template;

    beforeAll(() => {
      const templatePath = path.join(TEMPLATES_DIR, 'prd-template.md');
      template = fs.readFileSync(templatePath, 'utf8');
    });

    it('should have overview or summary section', () => {
      expect(template).toMatch(/overview|summary/i);
    });

    it('should have features section', () => {
      expect(template).toMatch(/features/i);
    });

    it('should have users section', () => {
      expect(template).toMatch(/user/i);
    });

    it('should have technical section', () => {
      expect(template).toMatch(/technical/i);
    });

    it('should use handlebars-style placeholders', () => {
      expect(template).toMatch(/\{\{[^}]+\}\}/);
    });
  });

  describe('State Schema', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'state-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should have version field', () => {
      expect(schema.version).toBeDefined();
    });

    it('should define schema structure', () => {
      expect(schema.schema).toBeDefined();
    });

    it('should have project schema', () => {
      expect(schema.schema.project).toBeDefined();
      expect(schema.schema.project.name).toBeDefined();
      expect(schema.schema.project.type).toBeDefined();
    });

    it('should have phase and status', () => {
      expect(schema.schema.phase).toBeDefined();
      expect(schema.schema.status).toBeDefined();
    });

    it('should define valid status values', () => {
      expect(schema.schema.status.enum).toBeDefined();
      expect(schema.schema.status.enum).toContain('ready');
      expect(schema.schema.status.enum).toContain('in_progress');
      expect(schema.schema.status.enum).toContain('checkpoint');
      expect(schema.schema.status.enum).toContain('blocked');
      expect(schema.schema.status.enum).toContain('completed');
    });

    it('should have checkpoint schema', () => {
      expect(schema.schema.checkpoint).toBeDefined();
      expect(schema.schema.checkpoint.pending).toBeDefined();
    });

    it('should have progress tracking', () => {
      expect(schema.schema.progress).toBeDefined();
      expect(schema.schema.progress.phases_completed).toBeDefined();
      expect(schema.schema.progress.features_completed).toBeDefined();
    });

    it('should define state transitions', () => {
      expect(schema.transitions).toBeDefined();
      expect(schema.transitions.ready).toBeDefined();
      expect(schema.transitions.in_progress).toBeDefined();
    });

    it('should have default state', () => {
      expect(schema.default_state).toBeDefined();
      expect(schema.default_state.phase).toBe('discovery');
      expect(schema.default_state.status).toBe('ready');
    });
  });

  describe('Features Schema', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'features-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should have version field', () => {
      expect(schema.version).toBeDefined();
    });

    it('should define feature schema', () => {
      expect(schema.schema).toBeDefined();
    });

    it('should have priorities structure', () => {
      expect(schema.schema.priorities).toBeDefined();
      expect(schema.schema.priorities.p0).toBeDefined();
      expect(schema.schema.priorities.p1).toBeDefined();
      expect(schema.schema.priorities.p2).toBeDefined();
    });

    it('should define feature fields', () => {
      expect(schema.schema.feature).toBeDefined();
      expect(schema.schema.feature.id).toBeDefined();
      expect(schema.schema.feature.name).toBeDefined();
      expect(schema.schema.feature.description).toBeDefined();
      expect(schema.schema.feature.priority).toBeDefined();
    });

    it('should have implementation details', () => {
      expect(schema.schema.feature.implementation).toBeDefined();
    });

    it('should have testing requirements', () => {
      expect(schema.schema.feature.testing).toBeDefined();
    });

    it('should have example feature', () => {
      expect(schema.example).toBeDefined();
      expect(schema.example.id).toBeDefined();
      expect(schema.example.name).toBeDefined();
    });
  });

  describe('Decision Framework', () => {
    let framework;

    beforeAll(() => {
      const frameworkPath = path.join(TEMPLATES_DIR, 'decision-framework.yaml');
      const content = fs.readFileSync(frameworkPath, 'utf8');
      framework = yaml.load(content);
    });

    it('should have version field', () => {
      expect(framework.version).toBeDefined();
    });

    it('should define all 5 autonomy levels', () => {
      expect(framework.autonomy_levels).toBeDefined();
      expect(framework.autonomy_levels.length).toBe(5);
    });

    it('should have level 0-4 with correct properties', () => {
      framework.autonomy_levels.forEach((level, index) => {
        expect(level.level).toBe(index);
        expect(level.name).toBeDefined();
        expect(level.description).toBeDefined();
        expect(level.action).toBeDefined();
        expect(level.examples).toBeDefined();
      });
    });

    it('should have classification rules', () => {
      expect(framework.classification_rules).toBeDefined();
      expect(framework.classification_rules.file_patterns).toBeDefined();
      expect(framework.classification_rules.content_patterns).toBeDefined();
      expect(framework.classification_rules.operations).toBeDefined();
    });

    it('should classify auth as level 3', () => {
      const authRule = framework.classification_rules.file_patterns.find((r) =>
        r.pattern.includes('auth')
      );
      expect(authRule).toBeDefined();
      expect(authRule.level).toBe(3);
    });

    it('should classify migrations as level 3', () => {
      const migrationRule = framework.classification_rules.file_patterns.find((r) =>
        r.pattern.includes('migrations')
      );
      expect(migrationRule).toBeDefined();
      expect(migrationRule.level).toBe(3);
    });

    it('should classify tests as level 0', () => {
      const testRule = framework.classification_rules.file_patterns.find((r) =>
        r.pattern.includes('tests')
      );
      expect(testRule).toBeDefined();
      expect(testRule.level).toBe(0);
    });

    it('should have decision templates', () => {
      expect(framework.decision_templates).toBeDefined();
      expect(framework.decision_templates.length).toBeGreaterThan(0);
    });

    it('should have decision workflow', () => {
      expect(framework.decision_workflow).toBeDefined();
      expect(framework.decision_workflow.capture).toBeDefined();
      expect(framework.decision_workflow.evaluate).toBeDefined();
      expect(framework.decision_workflow.present).toBeDefined();
      expect(framework.decision_workflow.record).toBeDefined();
    });
  });

  describe('Memory System', () => {
    let memory;

    beforeAll(() => {
      const memoryPath = path.join(TEMPLATES_DIR, 'memory-system.yaml');
      const content = fs.readFileSync(memoryPath, 'utf8');
      memory = yaml.load(content);
    });

    it('should have version field', () => {
      expect(memory.version).toBeDefined();
    });

    it('should define directory structure', () => {
      expect(memory.structure).toBeDefined();
      expect(memory.structure.base_path).toBe('.omgkit/memory');
      expect(memory.structure.directories).toBeDefined();
    });

    it('should have context, decisions, journal directories', () => {
      const dirs = memory.structure.directories;
      expect(dirs.context).toBeDefined();
      expect(dirs.decisions).toBeDefined();
      expect(dirs.journal).toBeDefined();
    });

    it('should define context files', () => {
      expect(memory.context_files).toBeDefined();
      expect(memory.context_files.length).toBeGreaterThan(0);
    });

    it('should have project-brief context file', () => {
      const projectBrief = memory.context_files.find((f) => f.id === 'project_brief');
      expect(projectBrief).toBeDefined();
      expect(projectBrief.template).toBeDefined();
    });

    it('should have decision template', () => {
      expect(memory.decision_template).toBeDefined();
      expect(memory.decision_template.template).toBeDefined();
    });

    it('should have journal template', () => {
      expect(memory.journal_template).toBeDefined();
      expect(memory.journal_template.template).toBeDefined();
    });

    it('should define memory limits', () => {
      expect(memory.limits).toBeDefined();
      expect(memory.limits.max_context_files).toBeDefined();
      expect(memory.limits.max_decisions_kept).toBeDefined();
    });

    it('should define session handling', () => {
      expect(memory.session).toBeDefined();
      expect(memory.session.start).toBeDefined();
      expect(memory.session.during).toBeDefined();
      expect(memory.session.end).toBeDefined();
    });
  });
});
