#!/usr/bin/env node
/**
 * Sync version from package.json to registry.yaml
 *
 * This script ensures registry.yaml version always matches package.json
 * Run automatically during npm version lifecycle
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Read package.json version
const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const version = packageJson.version;

// Update registry.yaml
const registryPath = join(ROOT, 'plugin', 'registry.yaml');
let registry = readFileSync(registryPath, 'utf8');

// Update version field
registry = registry.replace(
  /^version:\s*["']?[\d.]+["']?$/m,
  `version: "${version}"`
);

// Update header comment version
registry = registry.replace(
  /^# Version:\s*[\d.]+$/m,
  `# Version: ${version}`
);

// Update header comment date
const today = new Date().toISOString().split('T')[0];
registry = registry.replace(
  /^# Updated:\s*[\d-]+$/m,
  `# Updated: ${today}`
);

writeFileSync(registryPath, registry, 'utf8');

console.log(`✓ Synced version ${version} to registry.yaml`);
