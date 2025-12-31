/**
 * Autonomous Artifacts System Test Suite
 *
 * Tests for the artifacts system used in autonomous development.
 * Validates schema structure, artifact types, and context injection rules.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const TEMPLATES_DIR = path.join(
  __dirname,
  '..',
  '..',
  'plugin',
  'templates',
  'autonomous'
);

describe('Autonomous Artifacts System', () => {
  describe('Artifacts Schema File', () => {
    const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');

    it('should have artifacts-schema.yaml file', () => {
      expect(fs.existsSync(schemaPath)).toBe(true);
    });

    describe('Schema Structure', () => {
      let schema;

      beforeAll(() => {
        const content = fs.readFileSync(schemaPath, 'utf8');
        schema = yaml.load(content);
      });

      it('should have name field', () => {
        expect(schema.name).toBeDefined();
        expect(typeof schema.name).toBe('string');
      });

      it('should have version field', () => {
        expect(schema.version).toBeDefined();
      });

      it('should have description field', () => {
        expect(schema.description).toBeDefined();
      });

      it('should have directory_structure configuration', () => {
        expect(schema.directory_structure).toBeDefined();
        expect(schema.directory_structure.root).toBeDefined();
        expect(schema.directory_structure.subdirectories).toBeDefined();
      });

      it('should have artifact_types array', () => {
        expect(schema.artifact_types).toBeDefined();
        expect(Array.isArray(schema.artifact_types)).toBe(true);
        expect(schema.artifact_types.length).toBeGreaterThan(0);
      });

      it('should have context_injection configuration', () => {
        expect(schema.context_injection).toBeDefined();
        expect(schema.context_injection.rules).toBeDefined();
        expect(schema.context_injection.limits).toBeDefined();
      });

      it('should have auto_detection configuration', () => {
        expect(schema.auto_detection).toBeDefined();
        expect(schema.auto_detection.enabled).toBeDefined();
      });
    });
  });

  describe('Directory Structure', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should define root directory', () => {
      expect(schema.directory_structure.root).toBe('.omgkit/artifacts');
    });

    it('should have expected subdirectories', () => {
      const expectedDirs = ['data', 'docs', 'knowledge', 'research', 'assets', 'examples'];
      const dirNames = schema.directory_structure.subdirectories.map((d) => d.name);

      expectedDirs.forEach((dir) => {
        expect(dirNames).toContain(dir);
      });
    });

    it('each subdirectory should have description and auto_detect', () => {
      schema.directory_structure.subdirectories.forEach((dir) => {
        expect(dir.name).toBeDefined();
        expect(dir.description).toBeDefined();
        expect(dir.auto_detect).toBeDefined();
      });
    });
  });

  describe('Artifact Types', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should have at least 10 artifact types', () => {
      expect(schema.artifact_types.length).toBeGreaterThanOrEqual(10);
    });

    it('each artifact type should have required fields', () => {
      schema.artifact_types.forEach((type) => {
        expect(type.id).toBeDefined();
        expect(type.category).toBeDefined();
        expect(type.name).toBeDefined();
        expect(type.description).toBeDefined();
        expect(type.file_patterns).toBeDefined();
        expect(Array.isArray(type.file_patterns)).toBe(true);
      });
    });

    it('each artifact type should have phase_relevance', () => {
      schema.artifact_types.forEach((type) => {
        expect(type.phase_relevance).toBeDefined();
        expect(Array.isArray(type.phase_relevance)).toBe(true);
      });
    });

    it('each artifact type should have context_injection config', () => {
      schema.artifact_types.forEach((type) => {
        expect(type.context_injection).toBeDefined();
      });
    });

    it('should have sample_data artifact type', () => {
      const sampleData = schema.artifact_types.find((t) => t.id === 'sample_data');
      expect(sampleData).toBeDefined();
      expect(sampleData.category).toBe('data');
    });

    it('should have requirements artifact type', () => {
      const requirements = schema.artifact_types.find((t) => t.id === 'requirements');
      expect(requirements).toBeDefined();
      expect(requirements.category).toBe('docs');
    });

    it('should have domain_glossary artifact type', () => {
      const glossary = schema.artifact_types.find((t) => t.id === 'domain_glossary');
      expect(glossary).toBeDefined();
      expect(glossary.category).toBe('knowledge');
    });

    it('should have technology_review artifact type', () => {
      const review = schema.artifact_types.find((t) => t.id === 'technology_review');
      expect(review).toBeDefined();
      expect(review.category).toBe('research');
    });

    it('should have code_examples artifact type', () => {
      const examples = schema.artifact_types.find((t) => t.id === 'code_examples');
      expect(examples).toBeDefined();
      expect(examples.category).toBe('examples');
    });
  });

  describe('Artifact Categories', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    const expectedCategories = ['data', 'docs', 'knowledge', 'research', 'assets', 'examples'];

    expectedCategories.forEach((category) => {
      it(`should have at least one artifact type in ${category} category`, () => {
        const categoryTypes = schema.artifact_types.filter((t) => t.category === category);
        expect(categoryTypes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Context Injection Rules', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should have injection rules', () => {
      expect(schema.context_injection.rules).toBeDefined();
      expect(Array.isArray(schema.context_injection.rules)).toBe(true);
      expect(schema.context_injection.rules.length).toBeGreaterThan(0);
    });

    it('each rule should have name, description, trigger, and selection', () => {
      schema.context_injection.rules.forEach((rule) => {
        expect(rule.name).toBeDefined();
        expect(rule.description).toBeDefined();
        expect(rule.trigger).toBeDefined();
        expect(rule.selection).toBeDefined();
      });
    });

    it('should have size limits', () => {
      expect(schema.context_injection.limits).toBeDefined();
      expect(schema.context_injection.limits.max_total_kb).toBeDefined();
      expect(schema.context_injection.limits.max_per_artifact_kb).toBeDefined();
      expect(schema.context_injection.limits.max_artifacts_per_injection).toBeDefined();
    });

    it('should have summarization config', () => {
      expect(schema.context_injection.summarization).toBeDefined();
      expect(schema.context_injection.summarization.enabled).toBeDefined();
    });
  });

  describe('Auto-Detection Configuration', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should have auto-detection enabled by default', () => {
      expect(schema.auto_detection.enabled).toBe(true);
    });

    it('should scan on init', () => {
      expect(schema.auto_detection.scan_on_init).toBe(true);
    });

    it('should have excluded patterns', () => {
      expect(schema.auto_detection.excluded_patterns).toBeDefined();
      expect(Array.isArray(schema.auto_detection.excluded_patterns)).toBe(true);
      expect(schema.auto_detection.excluded_patterns).toContain('node_modules/**');
      expect(schema.auto_detection.excluded_patterns).toContain('.git/**');
    });
  });

  describe('State Schema Integration', () => {
    let stateSchema;

    beforeAll(() => {
      const stateSchemaPath = path.join(TEMPLATES_DIR, 'state-schema.yaml');
      const content = fs.readFileSync(stateSchemaPath, 'utf8');
      stateSchema = yaml.load(content);
    });

    it('state schema should have artifacts section', () => {
      expect(stateSchema.schema.artifacts).toBeDefined();
    });

    it('artifacts section should have scanned field', () => {
      expect(stateSchema.schema.artifacts.scanned).toBeDefined();
    });

    it('artifacts section should have count field', () => {
      expect(stateSchema.schema.artifacts.count).toBeDefined();
    });

    it('artifacts section should have categories field', () => {
      expect(stateSchema.schema.artifacts.categories).toBeDefined();
    });

    it('artifacts section should have index field', () => {
      expect(stateSchema.schema.artifacts.index).toBeDefined();
    });

    it('artifacts section should have active_context field', () => {
      expect(stateSchema.schema.artifacts.active_context).toBeDefined();
    });

    it('default state should include artifacts', () => {
      expect(stateSchema.default_state.artifacts).toBeDefined();
      expect(stateSchema.default_state.artifacts.scanned).toBe(false);
      expect(stateSchema.default_state.artifacts.count).toBe(0);
      expect(stateSchema.default_state.artifacts.index).toEqual([]);
    });
  });

  describe('Artifact Metadata Schema', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should have artifact_metadata definition', () => {
      expect(schema.artifact_metadata).toBeDefined();
    });

    it('should have required fields', () => {
      expect(schema.artifact_metadata.required_fields).toBeDefined();
      expect(Array.isArray(schema.artifact_metadata.required_fields)).toBe(true);
      expect(schema.artifact_metadata.required_fields).toContain('id');
      expect(schema.artifact_metadata.required_fields).toContain('type');
      expect(schema.artifact_metadata.required_fields).toContain('path');
    });

    it('should have optional fields', () => {
      expect(schema.artifact_metadata.optional_fields).toBeDefined();
      expect(Array.isArray(schema.artifact_metadata.optional_fields)).toBe(true);
    });
  });

  describe('CLI Commands', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should define CLI commands', () => {
      expect(schema.cli_commands).toBeDefined();
      expect(Array.isArray(schema.cli_commands)).toBe(true);
    });

    it('should have artifacts:scan command', () => {
      const scanCmd = schema.cli_commands.find((c) => c.name === 'artifacts:scan');
      expect(scanCmd).toBeDefined();
    });

    it('should have artifacts:list command', () => {
      const listCmd = schema.cli_commands.find((c) => c.name === 'artifacts:list');
      expect(listCmd).toBeDefined();
    });

    it('each command should have name and description', () => {
      schema.cli_commands.forEach((cmd) => {
        expect(cmd.name).toBeDefined();
        expect(cmd.description).toBeDefined();
      });
    });
  });

  describe('Example Index Entry', () => {
    let schema;

    beforeAll(() => {
      const schemaPath = path.join(TEMPLATES_DIR, 'artifacts-schema.yaml');
      const content = fs.readFileSync(schemaPath, 'utf8');
      schema = yaml.load(content);
    });

    it('should have example_index_entry', () => {
      expect(schema.example_index_entry).toBeDefined();
    });

    it('example should have required fields', () => {
      expect(schema.example_index_entry.id).toBeDefined();
      expect(schema.example_index_entry.type).toBeDefined();
      expect(schema.example_index_entry.name).toBeDefined();
      expect(schema.example_index_entry.path).toBeDefined();
    });

    it('example should demonstrate metadata structure', () => {
      expect(schema.example_index_entry.created_at).toBeDefined();
      expect(schema.example_index_entry.checksum).toBeDefined();
      expect(schema.example_index_entry.metadata).toBeDefined();
    });
  });
});
