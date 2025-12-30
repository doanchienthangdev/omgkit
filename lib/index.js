/**
 * OMGKIT - Omega-Level Development Kit
 *
 * Main library exports for programmatic usage
 */

export {
  // Configuration
  setPackageRoot,
  getPackageRoot,
  getPluginDir,
  getVersion,

  // Status checks
  isPluginInstalled,
  isProjectInitialized,

  // Core operations
  installPlugin,
  initProject,
  doctor,
  uninstallPlugin,
  listComponents,

  // Utilities
  countFiles,
  listDir,
  parseFrontmatter,
  validatePluginFile,

  // Constants
  COLORS,
  BANNER,
  log
} from './cli.js';
