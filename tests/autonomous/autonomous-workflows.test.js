/**
 * Autonomous Workflows Test Suite
 *
 * Tests for workflows used in autonomous project development.
 * Validates YAML structure, steps, and workflow configuration.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const WORKFLOWS_DIR = path.join(__dirname, '..', '..', 'plugin', 'workflows', 'autonomous');

describe('Autonomous Workflows', () => {
  // List of expected workflows
  const expectedWorkflows = ['discovery', 'planning', 'execution'];

  describe('Workflow Files Exist', () => {
    expectedWorkflows.forEach((workflow) => {
      it(`should have ${workflow} workflow file`, () => {
        const workflowPath = path.join(WORKFLOWS_DIR, `${workflow}.yaml`);
        expect(fs.existsSync(workflowPath)).toBe(true);
      });
    });
  });

  describe('Workflow Structure', () => {
    expectedWorkflows.forEach((workflow) => {
      describe(`${workflow} workflow`, () => {
        let config;

        beforeAll(() => {
          const workflowPath = path.join(WORKFLOWS_DIR, `${workflow}.yaml`);
          const content = fs.readFileSync(workflowPath, 'utf8');
          config = yaml.load(content);
        });

        it('should have name field', () => {
          expect(config.name).toBeDefined();
          expect(typeof config.name).toBe('string');
        });

        it('should have id field matching filename', () => {
          expect(config.id).toBe(workflow);
        });

        it('should have description field', () => {
          expect(config.description).toBeDefined();
        });

        it('should have category field', () => {
          expect(config.category).toBe('autonomous');
        });

        it('should have version field', () => {
          expect(config.version).toBeDefined();
        });

        it('should have metadata', () => {
          expect(config.metadata).toBeDefined();
          expect(config.metadata.phase).toBeDefined();
        });

        it('should have inputs defined', () => {
          expect(config.inputs).toBeDefined();
        });

        it('should have outputs defined', () => {
          expect(config.outputs).toBeDefined();
        });
      });
    });
  });

  describe('Discovery Workflow', () => {
    let discovery;

    beforeAll(() => {
      const discoveryPath = path.join(WORKFLOWS_DIR, 'discovery.yaml');
      const content = fs.readFileSync(discoveryPath, 'utf8');
      discovery = yaml.load(content);
    });

    it('should have steps array', () => {
      expect(discovery.steps).toBeDefined();
      expect(Array.isArray(discovery.steps)).toBe(true);
    });

    it('should have welcome step', () => {
      const welcomeStep = discovery.steps.find((s) => s.id === 'welcome');
      expect(welcomeStep).toBeDefined();
    });

    it('should have vision interview step', () => {
      const visionStep = discovery.steps.find((s) => s.id === 'vision_interview');
      expect(visionStep).toBeDefined();
    });

    it('should have users interview step', () => {
      const usersStep = discovery.steps.find((s) => s.id === 'users_interview');
      expect(usersStep).toBeDefined();
    });

    it('should have features interview step', () => {
      const featuresStep = discovery.steps.find((s) => s.id === 'features_interview');
      expect(featuresStep).toBeDefined();
    });

    it('should have technical interview step', () => {
      const technicalStep = discovery.steps.find((s) => s.id === 'technical_interview');
      expect(technicalStep).toBeDefined();
    });

    it('should have risks interview step', () => {
      const risksStep = discovery.steps.find((s) => s.id === 'risks_interview');
      expect(risksStep).toBeDefined();
    });

    it('should have generate PRD step', () => {
      const prdStep = discovery.steps.find((s) => s.id === 'generate_prd');
      expect(prdStep).toBeDefined();
      expect(prdStep.output).toContain('prd.md');
    });

    it('should have checkpoint step', () => {
      const checkpointStep = discovery.steps.find((s) => s.id === 'checkpoint');
      expect(checkpointStep).toBeDefined();
      expect(checkpointStep.checkpoint).toBe(true);
    });

    it('should have adaptive rules', () => {
      expect(discovery.adaptive_rules).toBeDefined();
      expect(Array.isArray(discovery.adaptive_rules)).toBe(true);
    });

    it('should have quality checks', () => {
      expect(discovery.quality_checks).toBeDefined();
    });

    it('should have success criteria', () => {
      expect(discovery.success_criteria).toBeDefined();
    });

    it('should output PRD', () => {
      const prdOutput = discovery.outputs.find((o) => o.path.includes('prd.md'));
      expect(prdOutput).toBeDefined();
      expect(prdOutput.required).toBe(true);
    });

    it('should output state.yaml', () => {
      const stateOutput = discovery.outputs.find((o) => o.path.includes('state.yaml'));
      expect(stateOutput).toBeDefined();
    });
  });

  describe('Planning Workflow', () => {
    let planning;

    beforeAll(() => {
      const planningPath = path.join(WORKFLOWS_DIR, 'planning.yaml');
      const content = fs.readFileSync(planningPath, 'utf8');
      planning = yaml.load(content);
    });

    it('should depend on discovery', () => {
      expect(planning.metadata.depends_on).toContain('discovery');
    });

    it('should have steps array', () => {
      expect(planning.steps).toBeDefined();
      expect(Array.isArray(planning.steps)).toBe(true);
    });

    it('should have analyze PRD step', () => {
      const analyzeStep = planning.steps.find((s) => s.id === 'analyze_prd');
      expect(analyzeStep).toBeDefined();
    });

    it('should have design data model step', () => {
      const dataModelStep = planning.steps.find((s) => s.id === 'design_data_model');
      expect(dataModelStep).toBeDefined();
    });

    it('should have design API step', () => {
      const apiStep = planning.steps.find((s) => s.id === 'design_api');
      expect(apiStep).toBeDefined();
    });

    it('should have feature breakdown step', () => {
      const featuresStep = planning.steps.find((s) => s.id === 'break_down_features');
      expect(featuresStep).toBeDefined();
    });

    it('should have checkpoint step', () => {
      const checkpointStep = planning.steps.find((s) => s.id === 'checkpoint');
      expect(checkpointStep).toBeDefined();
      expect(checkpointStep.checkpoint).toBe(true);
    });

    it('should output schema.sql', () => {
      const schemaOutput = planning.outputs.find((o) => o.path.includes('schema.sql'));
      expect(schemaOutput).toBeDefined();
    });

    it('should output features.yaml', () => {
      const featuresOutput = planning.outputs.find((o) => o.path.includes('features.yaml'));
      expect(featuresOutput).toBeDefined();
      expect(featuresOutput.required).toBe(true);
    });

    it('should have decisions defined', () => {
      expect(planning.decisions).toBeDefined();
      expect(Array.isArray(planning.decisions)).toBe(true);
    });

    it('should have quality checks', () => {
      expect(planning.quality_checks).toBeDefined();
    });
  });

  describe('Execution Workflow', () => {
    let execution;

    beforeAll(() => {
      const executionPath = path.join(WORKFLOWS_DIR, 'execution.yaml');
      const content = fs.readFileSync(executionPath, 'utf8');
      execution = yaml.load(content);
    });

    it('should have dynamic phase', () => {
      expect(execution.metadata.phase).toBe('dynamic');
    });

    it('should have feature loop', () => {
      expect(execution.feature_loop).toBeDefined();
    });

    it('should source features from features.yaml', () => {
      expect(execution.feature_loop.source).toContain('features.yaml');
    });

    it('should have for_each_feature steps', () => {
      expect(execution.feature_loop.for_each_feature).toBeDefined();
      expect(Array.isArray(execution.feature_loop.for_each_feature)).toBe(true);
    });

    it('should have start_feature step', () => {
      const startStep = execution.feature_loop.for_each_feature.find(
        (s) => s.id === 'start_feature'
      );
      expect(startStep).toBeDefined();
    });

    it('should have implement_step', () => {
      const implementStep = execution.feature_loop.for_each_feature.find(
        (s) => s.id === 'implement_step'
      );
      expect(implementStep).toBeDefined();
    });

    it('should have write_tests step', () => {
      const testsStep = execution.feature_loop.for_each_feature.find((s) => s.id === 'write_tests');
      expect(testsStep).toBeDefined();
    });

    it('should have code_review step', () => {
      const reviewStep = execution.feature_loop.for_each_feature.find(
        (s) => s.id === 'code_review'
      );
      expect(reviewStep).toBeDefined();
    });

    it('should have complete_feature step', () => {
      const completeStep = execution.feature_loop.for_each_feature.find(
        (s) => s.id === 'complete_feature'
      );
      expect(completeStep).toBeDefined();
    });

    it('should have quality gates', () => {
      expect(execution.quality_gates).toBeDefined();
      expect(execution.quality_gates.after_feature).toBeDefined();
    });

    it('should have error handling', () => {
      expect(execution.error_handling).toBeDefined();
      expect(execution.error_handling.on_test_failure).toBeDefined();
      expect(execution.error_handling.on_build_failure).toBeDefined();
    });

    it('should define autonomy levels', () => {
      expect(execution.autonomy).toBeDefined();
      expect(execution.autonomy.level_0).toBeDefined();
      expect(execution.autonomy.level_3).toBeDefined();
    });

    it('should have memory updates', () => {
      expect(execution.memory).toBeDefined();
    });

    it('should have progress reporting', () => {
      expect(execution.reporting).toBeDefined();
      expect(execution.reporting.show_progress_bar).toBe(true);
    });
  });
});
