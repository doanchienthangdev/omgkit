/**
 * Autonomous Archetypes Test Suite
 *
 * Tests for project archetypes used in autonomous development.
 * Validates YAML structure, required phases, and consistency.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ARCHETYPES_DIR = path.join(
  __dirname,
  '..',
  '..',
  'plugin',
  'templates',
  'autonomous',
  'archetypes'
);

describe('Autonomous Archetypes', () => {
  // List of expected archetypes (12 total: 5 original + 7 new)
  const expectedArchetypes = [
    'saas-mvp', 'api-service', 'cli-tool', 'library', 'fullstack-app',
    'mobile-app', 'ai-powered-app', 'ai-model-building', 'desktop-app',
    'iot-app', 'game-app', 'simulation-app'
  ];

  describe('Archetype Files Exist', () => {
    expectedArchetypes.forEach((archetype) => {
      it(`should have ${archetype} archetype file`, () => {
        const archetypePath = path.join(ARCHETYPES_DIR, `${archetype}.yaml`);
        expect(fs.existsSync(archetypePath)).toBe(true);
      });
    });
  });

  describe('Archetype Structure', () => {
    expectedArchetypes.forEach((archetype) => {
      describe(`${archetype}`, () => {
        let config;

        beforeAll(() => {
          const archetypePath = path.join(ARCHETYPES_DIR, `${archetype}.yaml`);
          const content = fs.readFileSync(archetypePath, 'utf8');
          config = yaml.load(content);
        });

        it('should have name field', () => {
          expect(config.name).toBeDefined();
          expect(typeof config.name).toBe('string');
        });

        it('should have id field matching filename', () => {
          expect(config.id).toBe(archetype);
        });

        it('should have description field', () => {
          expect(config.description).toBeDefined();
          expect(typeof config.description).toBe('string');
        });

        it('should have defaults configuration', () => {
          expect(config.defaults).toBeDefined();
        });

        it('should have phases array', () => {
          expect(config.phases).toBeDefined();
          expect(Array.isArray(config.phases)).toBe(true);
          expect(config.phases.length).toBeGreaterThan(0);
        });

        it('should have discovery phase first', () => {
          const discoveryPhase = config.phases.find((p) => p.id === 'discovery');
          expect(discoveryPhase).toBeDefined();
          expect(discoveryPhase.order).toBe(1);
        });

        it('each phase should have required fields', () => {
          config.phases.forEach((phase) => {
            expect(phase.id).toBeDefined();
            expect(phase.name).toBeDefined();
            expect(phase.order).toBeDefined();
          });
        });

        it('phases should be in order', () => {
          for (let i = 1; i < config.phases.length; i++) {
            expect(config.phases[i].order).toBeGreaterThanOrEqual(config.phases[i - 1].order);
          }
        });

        it('should have quality_gates configuration', () => {
          expect(config.quality_gates).toBeDefined();
        });

        it('should have autonomy configuration', () => {
          // New archetypes use autonomy_rules instead of autonomy.rules
          const hasAutonomy = config.autonomy !== undefined;
          const hasAutonomyRules = config.autonomy_rules !== undefined;
          expect(hasAutonomy || hasAutonomyRules).toBe(true);
        });
      });
    });
  });

  describe('Archetype Consistency', () => {
    const allArchetypes = {};

    beforeAll(() => {
      expectedArchetypes.forEach((archetype) => {
        const archetypePath = path.join(ARCHETYPES_DIR, `${archetype}.yaml`);
        const content = fs.readFileSync(archetypePath, 'utf8');
        allArchetypes[archetype] = yaml.load(content);
      });
    });

    it('all archetypes should have discovery phase', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        const discoveryPhase = archetype.phases.find((p) => p.id === 'discovery');
        expect(discoveryPhase).toBeDefined();
      });
    });

    it('all archetypes should have planning or design phase', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        // Different archetypes use different names for the planning phase:
        // planning, design, modeling, or exploration (for ML archetypes)
        const planningPhase = archetype.phases.find((p) =>
          p.id === 'planning' || p.id === 'design' || p.id === 'modeling' || p.id === 'exploration'
        );
        expect(planningPhase).toBeDefined();
      });
    });

    it('discovery phase should have checkpoint', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        const discoveryPhase = archetype.phases.find((p) => p.id === 'discovery');
        expect(discoveryPhase.checkpoint).toBe(true);
      });
    });

    it('planning/design phase should have checkpoint', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        const planningPhase = archetype.phases.find((p) =>
          p.id === 'planning' || p.id === 'design' || p.id === 'modeling' || p.id === 'exploration'
        );
        expect(planningPhase.checkpoint).toBe(true);
      });
    });

    it('all archetypes should have unique IDs', () => {
      const ids = Object.values(allArchetypes).map((a) => a.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('quality gates should have after_feature check', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        expect(archetype.quality_gates.after_feature).toBeDefined();
      });
    });

    it('autonomy rules (when defined) should have patterns and levels', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        // Check for both old (autonomy.rules) and new (autonomy_rules) structure
        const rules = archetype.autonomy?.rules || archetype.autonomy_rules || [];
        if (rules.length > 0) {
          rules.forEach((rule) => {
            // Rules should have patterns or pattern
            const hasPatterns = rule.patterns !== undefined || rule.pattern !== undefined;
            const hasActions = rule.actions !== undefined;
            expect(hasPatterns || hasActions).toBe(true);
            expect(rule.level).toBeDefined();
          });
        }
        // Archetypes should have either default_level or autonomy_rules
        const hasDefaultLevel = archetype.autonomy?.default_level !== undefined;
        const hasAutonomyRules = archetype.autonomy_rules !== undefined;
        expect(hasDefaultLevel || hasAutonomyRules).toBe(true);
      });
    });
  });

  describe('SaaS MVP Archetype Specifics', () => {
    let saas;

    beforeAll(() => {
      const saasPath = path.join(ARCHETYPES_DIR, 'saas-mvp.yaml');
      const content = fs.readFileSync(saasPath, 'utf8');
      saas = yaml.load(content);
    });

    it('should have payments phase', () => {
      const paymentsPhase = saas.phases.find((p) => p.id === 'payments');
      expect(paymentsPhase).toBeDefined();
    });

    it('should have hardening phase', () => {
      const hardeningPhase = saas.phases.find((p) => p.id === 'hardening');
      expect(hardeningPhase).toBeDefined();
    });

    it('should have deployment phase', () => {
      const deploymentPhase = saas.phases.find((p) => p.id === 'deployment');
      expect(deploymentPhase).toBeDefined();
    });

    it('should have auth in high autonomy level', () => {
      const authRule = saas.autonomy.rules?.find((r) => r.patterns?.includes('**/auth/**'));
      expect(authRule).toBeDefined();
      expect(authRule.level).toBe(3);
    });
  });

  describe('API Service Archetype Specifics', () => {
    let api;

    beforeAll(() => {
      const apiPath = path.join(ARCHETYPES_DIR, 'api-service.yaml');
      const content = fs.readFileSync(apiPath, 'utf8');
      api = yaml.load(content);
    });

    it('should have backend defaults', () => {
      expect(api.defaults.backend).toBeDefined();
    });

    it('should have database defaults', () => {
      expect(api.defaults.database).toBeDefined();
    });

    it('should have core API implementation phase', () => {
      const corePhase = api.phases.find((p) => p.id === 'core');
      expect(corePhase).toBeDefined();
    });
  });

  describe('CLI Tool Archetype Specifics', () => {
    let cli;

    beforeAll(() => {
      const cliPath = path.join(ARCHETYPES_DIR, 'cli-tool.yaml');
      const content = fs.readFileSync(cliPath, 'utf8');
      cli = yaml.load(content);
    });

    it('should have language defaults', () => {
      expect(cli.defaults.language).toBeDefined();
    });

    it('should have runtime defaults', () => {
      expect(cli.defaults.runtime).toBeDefined();
    });

    it('should have command implementation phase', () => {
      const corePhase = cli.phases.find((p) => p.id === 'core');
      expect(corePhase).toBeDefined();
    });

    it('should have packaging phase', () => {
      const packagingPhase = cli.phases.find((p) => p.id === 'packaging');
      expect(packagingPhase).toBeDefined();
    });
  });

  describe('Library Archetype Specifics', () => {
    let library;

    beforeAll(() => {
      const libraryPath = path.join(ARCHETYPES_DIR, 'library.yaml');
      const content = fs.readFileSync(libraryPath, 'utf8');
      library = yaml.load(content);
    });

    it('should have documentation phase', () => {
      const docsPhase = library.phases.find((p) => p.id === 'documentation');
      expect(docsPhase).toBeDefined();
    });

    it('should have high coverage threshold', () => {
      expect(library.quality_gates.before_publish).toBeDefined();
      const coverageGate = library.quality_gates.before_publish.find(
        (g) => g.coverage_threshold !== undefined
      );
      expect(coverageGate).toBeDefined();
      expect(coverageGate.coverage_threshold).toBeGreaterThanOrEqual(90);
    });

    it('should have build defaults', () => {
      expect(library.defaults.build).toBeDefined();
    });
  });

  describe('Fullstack App Archetype Specifics', () => {
    let fullstack;

    beforeAll(() => {
      const fullstackPath = path.join(ARCHETYPES_DIR, 'fullstack-app.yaml');
      const content = fs.readFileSync(fullstackPath, 'utf8');
      fullstack = yaml.load(content);
    });

    it('should have frontend defaults', () => {
      expect(fullstack.defaults.frontend).toBeDefined();
    });

    it('should have backend defaults', () => {
      expect(fullstack.defaults.backend).toBeDefined();
    });

    it('should have database defaults', () => {
      expect(fullstack.defaults.database).toBeDefined();
    });

    it('should have separate backend and frontend phases', () => {
      const backendPhase = fullstack.phases.find((p) => p.id === 'backend');
      const frontendPhase = fullstack.phases.find((p) => p.id === 'frontend');
      expect(backendPhase).toBeDefined();
      expect(frontendPhase).toBeDefined();
    });

    it('should have integration phase', () => {
      const integrationPhase = fullstack.phases.find((p) => p.id === 'integration');
      expect(integrationPhase).toBeDefined();
    });
  });

  // New archetypes tests
  describe('Mobile App Archetype Specifics', () => {
    let mobile;

    beforeAll(() => {
      const mobilePath = path.join(ARCHETYPES_DIR, 'mobile-app.yaml');
      const content = fs.readFileSync(mobilePath, 'utf8');
      mobile = yaml.load(content);
    });

    it('should have framework defaults', () => {
      expect(mobile.defaults.framework).toBeDefined();
    });

    it('should have alternatives for frameworks', () => {
      expect(mobile.alternatives).toBeDefined();
      expect(mobile.alternatives.framework).toBeDefined();
    });

    it('should have native_features phase', () => {
      const nativePhase = mobile.phases.find((p) => p.id === 'native_features');
      expect(nativePhase).toBeDefined();
    });

    it('should have deployment phase for app stores', () => {
      const deployPhase = mobile.phases.find((p) => p.id === 'deployment');
      expect(deployPhase).toBeDefined();
    });

    it('should have discovery_additions for mobile-specific questions', () => {
      expect(mobile.discovery_additions).toBeDefined();
      expect(mobile.discovery_additions.length).toBeGreaterThan(0);
    });
  });

  describe('AI-Powered App Archetype Specifics', () => {
    let aiApp;

    beforeAll(() => {
      const aiPath = path.join(ARCHETYPES_DIR, 'ai-powered-app.yaml');
      const content = fs.readFileSync(aiPath, 'utf8');
      aiApp = yaml.load(content);
    });

    it('should have ai_provider defaults', () => {
      expect(aiApp.defaults.ai_provider).toBeDefined();
    });

    it('should have vector_db defaults', () => {
      expect(aiApp.defaults.vector_db).toBeDefined();
    });

    it('should have advanced_features phase', () => {
      const advancedPhase = aiApp.phases.find((p) => p.id === 'advanced_features');
      expect(advancedPhase).toBeDefined();
    });

    it('should have safety phase', () => {
      const safetyPhase = aiApp.phases.find((p) => p.id === 'safety');
      expect(safetyPhase).toBeDefined();
    });

    it('should have alternatives for AI providers', () => {
      expect(aiApp.alternatives.ai_provider).toBeDefined();
      expect(aiApp.alternatives.ai_provider.length).toBeGreaterThan(1);
    });
  });

  describe('AI Model Building Archetype Specifics', () => {
    let aiModel;

    beforeAll(() => {
      const aiModelPath = path.join(ARCHETYPES_DIR, 'ai-model-building.yaml');
      const content = fs.readFileSync(aiModelPath, 'utf8');
      aiModel = yaml.load(content);
    });

    it('should have framework defaults for ML', () => {
      expect(aiModel.defaults.framework).toBeDefined();
    });

    it('should have experiment_tracking defaults', () => {
      expect(aiModel.defaults.experiment_tracking).toBeDefined();
    });

    it('should have data_engineering phase', () => {
      const dataPhase = aiModel.phases.find((p) => p.id === 'data_engineering');
      expect(dataPhase).toBeDefined();
    });

    it('should have training phase', () => {
      const trainingPhase = aiModel.phases.find((p) => p.id === 'training');
      expect(trainingPhase).toBeDefined();
    });

    it('should have evaluation phase', () => {
      const evalPhase = aiModel.phases.find((p) => p.id === 'evaluation');
      expect(evalPhase).toBeDefined();
    });

    it('should have monitoring phase', () => {
      const monitoringPhase = aiModel.phases.find((p) => p.id === 'monitoring');
      expect(monitoringPhase).toBeDefined();
    });
  });

  describe('Desktop App Archetype Specifics', () => {
    let desktop;

    beforeAll(() => {
      const desktopPath = path.join(ARCHETYPES_DIR, 'desktop-app.yaml');
      const content = fs.readFileSync(desktopPath, 'utf8');
      desktop = yaml.load(content);
    });

    it('should have framework defaults', () => {
      expect(desktop.defaults.framework).toBeDefined();
    });

    it('should have native_integration phase', () => {
      const nativePhase = desktop.phases.find((p) => p.id === 'native_integration');
      expect(nativePhase).toBeDefined();
    });

    it('should have packaging phase', () => {
      const packagingPhase = desktop.phases.find((p) => p.id === 'packaging');
      expect(packagingPhase).toBeDefined();
    });

    it('should have alternatives for desktop frameworks', () => {
      expect(desktop.alternatives.framework).toBeDefined();
      expect(desktop.alternatives.framework.length).toBeGreaterThan(1);
    });
  });

  describe('IoT App Archetype Specifics', () => {
    let iot;

    beforeAll(() => {
      const iotPath = path.join(ARCHETYPES_DIR, 'iot-app.yaml');
      const content = fs.readFileSync(iotPath, 'utf8');
      iot = yaml.load(content);
    });

    it('should have protocol defaults', () => {
      expect(iot.defaults.protocol).toBeDefined();
    });

    it('should have backend phase', () => {
      const backendPhase = iot.phases.find((p) => p.id === 'backend');
      expect(backendPhase).toBeDefined();
    });

    it('should have dashboard phase', () => {
      const dashboardPhase = iot.phases.find((p) => p.id === 'dashboard');
      expect(dashboardPhase).toBeDefined();
    });

    it('should have edge_computing phase', () => {
      const edgePhase = iot.phases.find((p) => p.id === 'edge_computing');
      expect(edgePhase).toBeDefined();
    });

    it('should have security phase', () => {
      const securityPhase = iot.phases.find((p) => p.id === 'security');
      expect(securityPhase).toBeDefined();
    });
  });

  describe('Game App Archetype Specifics', () => {
    let game;

    beforeAll(() => {
      const gamePath = path.join(ARCHETYPES_DIR, 'game-app.yaml');
      const content = fs.readFileSync(gamePath, 'utf8');
      game = yaml.load(content);
    });

    it('should have engine defaults', () => {
      expect(game.defaults.engine).toBeDefined();
    });

    it('should have design phase for GDD', () => {
      const designPhase = game.phases.find((p) => p.id === 'design');
      expect(designPhase).toBeDefined();
    });

    it('should have core_gameplay phase', () => {
      const corePhase = game.phases.find((p) => p.id === 'core_gameplay');
      expect(corePhase).toBeDefined();
    });

    it('should have content phase', () => {
      const contentPhase = game.phases.find((p) => p.id === 'content');
      expect(contentPhase).toBeDefined();
    });

    it('should have polish phase', () => {
      const polishPhase = game.phases.find((p) => p.id === 'polish');
      expect(polishPhase).toBeDefined();
    });

    it('should have optional multiplayer phase', () => {
      const multiplayerPhase = game.phases.find((p) => p.id === 'multiplayer');
      expect(multiplayerPhase).toBeDefined();
      expect(multiplayerPhase.optional).toBe(true);
    });
  });

  describe('Simulation App Archetype Specifics', () => {
    let simulation;

    beforeAll(() => {
      const simulationPath = path.join(ARCHETYPES_DIR, 'simulation-app.yaml');
      const content = fs.readFileSync(simulationPath, 'utf8');
      simulation = yaml.load(content);
    });

    it('should have language defaults', () => {
      expect(simulation.defaults.language).toBeDefined();
    });

    it('should have compute defaults', () => {
      expect(simulation.defaults.compute).toBeDefined();
    });

    it('should have modeling phase', () => {
      const modelingPhase = simulation.phases.find((p) => p.id === 'modeling');
      expect(modelingPhase).toBeDefined();
    });

    it('should have core_simulation phase', () => {
      const corePhase = simulation.phases.find((p) => p.id === 'core_simulation');
      expect(corePhase).toBeDefined();
    });

    it('should have visualization phase', () => {
      const vizPhase = simulation.phases.find((p) => p.id === 'visualization');
      expect(vizPhase).toBeDefined();
    });

    it('should have validation phase', () => {
      const validationPhase = simulation.phases.find((p) => p.id === 'validation');
      expect(validationPhase).toBeDefined();
    });

    it('should have optimization phase', () => {
      const optimizationPhase = simulation.phases.find((p) => p.id === 'optimization');
      expect(optimizationPhase).toBeDefined();
    });
  });
});
