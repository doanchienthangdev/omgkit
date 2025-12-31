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
  // List of expected archetypes
  const expectedArchetypes = ['saas-mvp', 'api-service', 'cli-tool', 'library', 'fullstack-app'];

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
          expect(config.autonomy).toBeDefined();
          expect(config.autonomy.default_level).toBeDefined();
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

    it('all archetypes should have planning phase', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        const planningPhase = archetype.phases.find((p) => p.id === 'planning');
        expect(planningPhase).toBeDefined();
      });
    });

    it('discovery phase should have checkpoint', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        const discoveryPhase = archetype.phases.find((p) => p.id === 'discovery');
        expect(discoveryPhase.checkpoint).toBe(true);
      });
    });

    it('planning phase should have checkpoint', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        const planningPhase = archetype.phases.find((p) => p.id === 'planning');
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

    it('autonomy rules (when defined) should have patterns/actions and levels', () => {
      Object.values(allArchetypes).forEach((archetype) => {
        if (archetype.autonomy.rules && archetype.autonomy.rules.length > 0) {
          archetype.autonomy.rules.forEach((rule) => {
            // Rules should have either patterns or actions
            const hasPatterns = rule.patterns !== undefined;
            const hasActions = rule.actions !== undefined;
            expect(hasPatterns || hasActions).toBe(true);
            expect(rule.level).toBeDefined();
          });
        }
        // Archetypes without rules are valid - they use default_level
        expect(archetype.autonomy.default_level).toBeDefined();
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
});
