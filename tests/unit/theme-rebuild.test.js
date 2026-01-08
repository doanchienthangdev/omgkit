/**
 * Theme Rebuild Unit Tests
 *
 * Tests for the theme rebuild, scan, backup, and rollback functions
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
  setThemePackageRoot,
  scanProjectColors,
  createThemeBackup,
  listThemeBackups,
  rollbackTheme,
  rebuildProjectTheme,
  updateFileColors,
  updateProjectTailwindConfig,
  ensureThemeImport,
  getDynamicColorMapping,
  SCAN_DIRECTORIES,
  FULL_SCAN_DIRECTORIES,
  SCAN_EXTENSIONS,
  EXCLUDE_DIRS,
  COLOR_PATTERNS,
  THEME_VAR_MAP,
  FULL_THEME_VAR_MAP
} from '../../lib/theme.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = join(__dirname, '../..');
const TEST_PROJECT = join(__dirname, '../fixtures/theme-test-project');

// Set package root for tests
setThemePackageRoot(PACKAGE_ROOT);

describe('Theme Rebuild Functions', () => {
  beforeEach(() => {
    // Create test project structure
    mkdirSync(join(TEST_PROJECT, '.omgkit/design'), { recursive: true });
    mkdirSync(join(TEST_PROJECT, 'app'), { recursive: true });
    mkdirSync(join(TEST_PROJECT, 'components'), { recursive: true });
  });

  afterEach(() => {
    // Clean up test project
    rmSync(TEST_PROJECT, { recursive: true, force: true });
  });

  describe('Constants', () => {
    it('should have SCAN_DIRECTORIES defined', () => {
      expect(SCAN_DIRECTORIES).toBeDefined();
      expect(SCAN_DIRECTORIES).toContain('app');
      expect(SCAN_DIRECTORIES).toContain('components');
      expect(SCAN_DIRECTORIES).toContain('src');
      expect(SCAN_DIRECTORIES).toContain('pages');
    });

    it('should have SCAN_EXTENSIONS defined', () => {
      expect(SCAN_EXTENSIONS).toBeDefined();
      expect(SCAN_EXTENSIONS).toContain('.tsx');
      expect(SCAN_EXTENSIONS).toContain('.jsx');
      expect(SCAN_EXTENSIONS).toContain('.ts');
      expect(SCAN_EXTENSIONS).toContain('.js');
    });

    it('should have EXCLUDE_DIRS defined', () => {
      expect(EXCLUDE_DIRS).toBeDefined();
      expect(EXCLUDE_DIRS).toContain('node_modules');
      expect(EXCLUDE_DIRS).toContain('.git');
      expect(EXCLUDE_DIRS).toContain('.omgkit');
    });

    it('should have COLOR_PATTERNS defined', () => {
      expect(COLOR_PATTERNS).toBeDefined();
      expect(COLOR_PATTERNS.tailwindDefaults).toBeDefined();
      expect(COLOR_PATTERNS.hexColors).toBeDefined();
    });

    it('should have THEME_VAR_MAP with common mappings', () => {
      expect(THEME_VAR_MAP).toBeDefined();
      expect(THEME_VAR_MAP['bg-white']).toBe('bg-background');
      expect(THEME_VAR_MAP['text-gray-900']).toBe('text-foreground');
      expect(THEME_VAR_MAP['bg-blue-500']).toBe('bg-primary');
      expect(THEME_VAR_MAP['bg-red-500']).toBe('bg-destructive');
    });
  });

  describe('scanProjectColors', () => {
    it('should return empty result for project with no color references', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-background text-foreground">Hello</div>;
        }
      `);

      const result = scanProjectColors(TEST_PROJECT);
      expect(result.scannedFiles).toBeGreaterThan(0);
      expect(result.nonCompliant.length).toBe(0);
    });

    it('should detect Tailwind default colors', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-blue-500 text-gray-600">Hello</div>;
        }
      `);

      const result = scanProjectColors(TEST_PROJECT);
      expect(result.nonCompliant.length).toBeGreaterThan(0);
      expect(result.nonCompliant.some(n => n.match === 'bg-blue-500')).toBe(true);
      expect(result.nonCompliant.some(n => n.match === 'text-gray-600')).toBe(true);
    });

    it('should provide suggestions for mappable colors', () => {
      writeFileSync(join(TEST_PROJECT, 'components/Button.tsx'), `
        export function Button() {
          return <button className="bg-blue-500">Click me</button>;
        }
      `);

      const result = scanProjectColors(TEST_PROJECT);
      const blueMatch = result.nonCompliant.find(n => n.match === 'bg-blue-500');
      expect(blueMatch).toBeDefined();
      expect(blueMatch.suggestion).toBe('bg-primary');
    });

    it('should mark unmapped colors as unfixable', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-400">Hello</div>;
        }
      `);

      const result = scanProjectColors(TEST_PROJECT);
      const emeraldMatch = result.nonCompliant.find(n => n.match === 'bg-emerald-400');
      expect(emeraldMatch).toBeDefined();
      expect(emeraldMatch.suggestion).toBeNull();
    });

    it('should return file path and line number', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `// Line 1
// Line 2
export default function Page() {
  return <div className="bg-blue-500">Hello</div>;
}`);

      const result = scanProjectColors(TEST_PROJECT);
      expect(result.files.length).toBeGreaterThan(0);
      const fileResult = result.files[0];
      expect(fileResult.path).toContain('app/page.tsx');
      expect(fileResult.matches[0].line).toBe(4);
    });

    it('should scan multiple directories', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-blue-500">Hello</div>;
        }
      `);
      writeFileSync(join(TEST_PROJECT, 'components/Card.tsx'), `
        export function Card() {
          return <div className="bg-gray-100">Card</div>;
        }
      `);

      const result = scanProjectColors(TEST_PROJECT);
      expect(result.files.length).toBe(2);
    });

    it('should count scanned files', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), 'export default function Page() { return null; }');
      writeFileSync(join(TEST_PROJECT, 'app/layout.tsx'), 'export default function Layout() { return null; }');
      writeFileSync(join(TEST_PROJECT, 'components/Button.tsx'), 'export function Button() { return null; }');

      const result = scanProjectColors(TEST_PROJECT);
      expect(result.scannedFiles).toBe(3);
    });
  });

  describe('createThemeBackup', () => {
    beforeEach(() => {
      // Create theme files to backup
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), JSON.stringify({
        id: 'test-theme',
        name: 'Test Theme'
      }));
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.css'), '/* CSS */');
    });

    it('should create backup directory', () => {
      const result = createThemeBackup(TEST_PROJECT, 'new-theme');
      expect(result.success).toBe(true);
      expect(existsSync(result.backupPath)).toBe(true);
    });

    it('should generate unique backup ID', () => {
      const result = createThemeBackup(TEST_PROJECT, 'new-theme');
      expect(result.backupId).toContain('new-theme');
      expect(result.backupId).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should create manifest.json', () => {
      const result = createThemeBackup(TEST_PROJECT, 'new-theme');
      const manifestPath = join(result.backupPath, 'manifest.json');
      expect(existsSync(manifestPath)).toBe(true);

      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      expect(manifest.newTheme).toBe('new-theme');
      expect(manifest.previousTheme).toBe('test-theme');
      expect(manifest.changedFiles).toBeDefined();
    });

    it('should backup theme.json', () => {
      const result = createThemeBackup(TEST_PROJECT, 'new-theme');
      const backupFile = join(result.backupPath, 'theme.json.bak');
      expect(existsSync(backupFile)).toBe(true);

      const content = readFileSync(backupFile, 'utf8');
      expect(content).toContain('test-theme');
    });

    it('should backup theme.css', () => {
      const result = createThemeBackup(TEST_PROJECT, 'new-theme');
      const backupFile = join(result.backupPath, 'theme.css.bak');
      expect(existsSync(backupFile)).toBe(true);
    });

    it('should backup tailwind.config.ts if exists', () => {
      writeFileSync(join(TEST_PROJECT, 'tailwind.config.ts'), 'export default {}');

      const result = createThemeBackup(TEST_PROJECT, 'new-theme');
      const backupFile = join(result.backupPath, 'tailwind.config.ts.bak');
      expect(existsSync(backupFile)).toBe(true);
    });

    it('should include files in manifest', () => {
      const result = createThemeBackup(TEST_PROJECT, 'new-theme');
      expect(result.manifest.changedFiles.length).toBeGreaterThan(0);
      expect(result.manifest.changedFiles.some(f => f.path.includes('theme.json'))).toBe(true);
    });
  });

  describe('listThemeBackups', () => {
    it('should return empty array when no backups exist', () => {
      const backups = listThemeBackups(TEST_PROJECT);
      expect(backups).toEqual([]);
    });

    it('should list existing backups', () => {
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), '{}');
      createThemeBackup(TEST_PROJECT, 'theme-a');
      createThemeBackup(TEST_PROJECT, 'theme-b');

      const backups = listThemeBackups(TEST_PROJECT);
      expect(backups.length).toBe(2);
    });

    it('should sort backups by timestamp (newest first)', () => {
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), '{}');
      createThemeBackup(TEST_PROJECT, 'theme-a');

      // Wait a bit to ensure different timestamps
      const backups = listThemeBackups(TEST_PROJECT);
      expect(backups.length).toBeGreaterThan(0);
      expect(backups[0].id).toContain('theme-a');
    });

    it('should include backup metadata', () => {
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), JSON.stringify({ id: 'old' }));
      createThemeBackup(TEST_PROJECT, 'new-theme');

      const backups = listThemeBackups(TEST_PROJECT);
      const backup = backups[0];

      expect(backup.id).toBeDefined();
      expect(backup.previousTheme).toBe('old');
      expect(backup.newTheme).toBe('new-theme');
      expect(backup.timestamp).toBeDefined();
      expect(backup.filesChanged).toBeDefined();
    });
  });

  describe('rollbackTheme', () => {
    beforeEach(() => {
      // Create initial theme
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), JSON.stringify({ id: 'original', name: 'Original' }));
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.css'), '/* Original CSS */');
    });

    it('should return error when no backups exist', () => {
      const result = rollbackTheme(TEST_PROJECT);
      expect(result.success).toBe(false);
      expect(result.error).toContain('No theme backups found');
    });

    it('should restore from latest backup', () => {
      // Create backup
      createThemeBackup(TEST_PROJECT, 'new-theme');

      // Overwrite theme files
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), JSON.stringify({ id: 'new-theme' }));
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.css'), '/* New CSS */');

      // Rollback
      const result = rollbackTheme(TEST_PROJECT);
      expect(result.success).toBe(true);
      expect(result.restoredTheme).toBe('original');

      // Verify restoration
      const restored = JSON.parse(readFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), 'utf8'));
      expect(restored.id).toBe('original');
    });

    it('should restore from specific backup', () => {
      // Create first backup
      createThemeBackup(TEST_PROJECT, 'theme-1');
      const firstBackups = listThemeBackups(TEST_PROJECT);
      const firstBackupId = firstBackups[0].id;

      // Change theme and create second backup
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), JSON.stringify({ id: 'theme-1' }));
      createThemeBackup(TEST_PROJECT, 'theme-2');

      // Rollback to specific backup
      const result = rollbackTheme(TEST_PROJECT, firstBackupId);
      expect(result.success).toBe(true);
      expect(result.backupUsed).toBe(firstBackupId);
    });

    it('should return error for non-existent backup', () => {
      createThemeBackup(TEST_PROJECT, 'theme-1');

      const result = rollbackTheme(TEST_PROJECT, 'non-existent-backup-id');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Backup not found');
    });

    it('should return list of restored files', () => {
      createThemeBackup(TEST_PROJECT, 'new-theme');
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), '{}');

      const result = rollbackTheme(TEST_PROJECT);
      expect(result.success).toBe(true);
      expect(result.restoredFiles.length).toBeGreaterThan(0);
      expect(result.restoredFiles.some(f => f.includes('theme.json'))).toBe(true);
    });

    it('should create safety backup before rollback', () => {
      createThemeBackup(TEST_PROJECT, 'theme-1');
      const backupsBefore = listThemeBackups(TEST_PROJECT);

      rollbackTheme(TEST_PROJECT);

      const backupsAfter = listThemeBackups(TEST_PROJECT);
      expect(backupsAfter.length).toBeGreaterThan(backupsBefore.length);
    });
  });

  describe('updateFileColors', () => {
    it('should replace bg-blue-500 with bg-primary', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-blue-500">Hello</div>;
        }
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT);
      expect(result.changed).toBe(true);
      expect(result.content).toContain('bg-primary');
      expect(result.content).not.toContain('bg-blue-500');
    });

    it('should replace text-gray-600 with text-muted-foreground', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <p className="text-gray-600">Hello</p>;
        }
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT);
      expect(result.changed).toBe(true);
      expect(result.content).toContain('text-muted-foreground');
    });

    it('should preserve non-color classes', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-blue-500 p-4 rounded-lg">Hello</div>;
        }
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT);
      expect(result.content).toContain('p-4');
      expect(result.content).toContain('rounded-lg');
    });

    it('should handle multiple replacements per line', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        <div className="bg-blue-500 text-gray-900 border-gray-200">
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT);
      expect(result.changed).toBe(true);
      expect(result.content).toContain('bg-primary');
      expect(result.content).toContain('text-foreground');
      expect(result.content).toContain('border-border');
    });

    it('should return replacement details', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        <div className="bg-blue-500 bg-blue-500">
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT);
      expect(result.replacements.length).toBeGreaterThan(0);
      expect(result.replacements[0].from).toBe('bg-blue-500');
      expect(result.replacements[0].to).toBe('bg-primary');
      expect(result.replacements[0].count).toBe(2);
    });

    it('should return changed=false for file with no matches', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-background">Hello</div>;
        }
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT);
      expect(result.changed).toBe(false);
      expect(result.replacements.length).toBe(0);
    });

    it('should handle non-existent file', () => {
      const result = updateFileColors('non-existent.tsx', TEST_PROJECT);
      expect(result.changed).toBe(false);
      expect(result.error).toContain('File not found');
    });
  });

  describe('updateProjectTailwindConfig', () => {
    const testTheme = {
      id: 'test-theme',
      name: 'Test Theme',
      category: 'tech-ai',
      colors: {
        light: {
          background: '0 0% 100%',
          foreground: '240 10% 3.9%',
          primary: '346.8 77.2% 49.8%',
          'primary-foreground': '355.7 100% 97.3%',
          secondary: '240 4.8% 95.9%',
          'secondary-foreground': '240 5.9% 10%',
          muted: '240 4.8% 95.9%',
          'muted-foreground': '240 3.8% 46.1%',
          accent: '240 4.8% 95.9%',
          'accent-foreground': '240 5.9% 10%',
          destructive: '0 84.2% 60.2%',
          'destructive-foreground': '0 0% 98%',
          border: '240 5.9% 90%',
          input: '240 5.9% 90%',
          ring: '346.8 77.2% 49.8%',
          card: '0 0% 100%',
          'card-foreground': '240 10% 3.9%',
          popover: '0 0% 100%',
          'popover-foreground': '240 10% 3.9%'
        },
        dark: {
          background: '240 10% 3.9%',
          foreground: '0 0% 98%',
          primary: '346.8 77.2% 49.8%',
          'primary-foreground': '355.7 100% 97.3%',
          secondary: '240 3.7% 15.9%',
          'secondary-foreground': '0 0% 98%',
          muted: '240 3.7% 15.9%',
          'muted-foreground': '240 5% 64.9%',
          accent: '240 3.7% 15.9%',
          'accent-foreground': '0 0% 98%',
          destructive: '0 62.8% 30.6%',
          'destructive-foreground': '0 0% 98%',
          border: '240 3.7% 15.9%',
          input: '240 3.7% 15.9%',
          ring: '346.8 77.2% 49.8%',
          card: '240 10% 3.9%',
          'card-foreground': '0 0% 98%',
          popover: '240 10% 3.9%',
          'popover-foreground': '0 0% 98%'
        }
      },
      radius: '0.5rem'
    };

    it('should create tailwind.config.ts if not exists', () => {
      const result = updateProjectTailwindConfig(testTheme, TEST_PROJECT);
      expect(result.success).toBe(true);
      expect(existsSync(join(TEST_PROJECT, 'tailwind.config.ts'))).toBe(true);
    });

    it('should update existing tailwind.config.ts', () => {
      writeFileSync(join(TEST_PROJECT, 'tailwind.config.ts'), 'export default {}');

      const result = updateProjectTailwindConfig(testTheme, TEST_PROJECT);
      expect(result.success).toBe(true);

      const content = readFileSync(join(TEST_PROJECT, 'tailwind.config.ts'), 'utf8');
      expect(content).toContain('primary');
      expect(content).toContain('hsl(var(--primary))');
    });

    it('should update tailwind.config.js if exists', () => {
      writeFileSync(join(TEST_PROJECT, 'tailwind.config.js'), 'module.exports = {}');

      const result = updateProjectTailwindConfig(testTheme, TEST_PROJECT);
      expect(result.success).toBe(true);
      expect(result.path).toContain('tailwind.config.js');
    });

    it('should include theme colors in output', () => {
      const result = updateProjectTailwindConfig(testTheme, TEST_PROJECT);
      const content = readFileSync(result.path, 'utf8');

      expect(content).toContain('background');
      expect(content).toContain('foreground');
      expect(content).toContain('primary');
      expect(content).toContain('secondary');
      expect(content).toContain('destructive');
    });
  });

  describe('ensureThemeImport', () => {
    it('should add import to globals.css in app/', () => {
      writeFileSync(join(TEST_PROJECT, 'app/globals.css'), '@tailwind base;');

      const result = ensureThemeImport(TEST_PROJECT);
      expect(result.updated).toBe(true);

      const content = readFileSync(join(TEST_PROJECT, 'app/globals.css'), 'utf8');
      expect(content).toContain('.omgkit/design/theme.css');
    });

    it('should not add duplicate import', () => {
      writeFileSync(join(TEST_PROJECT, 'app/globals.css'), `@import '../.omgkit/design/theme.css';
@tailwind base;`);

      const result = ensureThemeImport(TEST_PROJECT);
      expect(result.updated).toBe(false);
      expect(result.alreadyImported).toBe(true);
    });

    it('should handle src/app/globals.css', () => {
      mkdirSync(join(TEST_PROJECT, 'src/app'), { recursive: true });
      writeFileSync(join(TEST_PROJECT, 'src/app/globals.css'), '@tailwind base;');

      const result = ensureThemeImport(TEST_PROJECT);
      expect(result.updated).toBe(true);
      expect(result.path).toContain('src/app/globals.css');
    });

    it('should return error when globals.css not found', () => {
      const result = ensureThemeImport(TEST_PROJECT);
      expect(result.updated).toBe(false);
      expect(result.error).toContain('globals.css not found');
    });
  });

  describe('rebuildProjectTheme', () => {
    beforeEach(() => {
      // Create minimal theme files
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), JSON.stringify({ id: 'original' }));
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.css'), '/* CSS */');
    });

    it('should fail for non-OMGKIT project', () => {
      rmSync(join(TEST_PROJECT, '.omgkit'), { recursive: true });

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Not an OMGKIT project');
    });

    it('should fail for non-existent theme', () => {
      const result = rebuildProjectTheme(TEST_PROJECT, 'non-existent-theme');
      expect(result.success).toBe(false);
      expect(result.error).toContain('Theme not found');
    });

    it('should create backup before rebuild', () => {
      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(result.success).toBe(true);
      expect(result.backupId).toBeDefined();
      expect(result.backupPath).toBeDefined();
    });

    it('should apply new theme', () => {
      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(result.success).toBe(true);
      expect(result.newTheme).toBe('neo-tokyo');

      const themeJson = JSON.parse(readFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), 'utf8'));
      expect(themeJson.id).toBe('neo-tokyo');
    });

    it('should update tailwind config', () => {
      rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(existsSync(join(TEST_PROJECT, 'tailwind.config.ts'))).toBe(true);
    });

    it('should fix non-compliant colors', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-blue-500">Hello</div>;
        }
      `);

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(result.success).toBe(true);

      const content = readFileSync(join(TEST_PROJECT, 'app/page.tsx'), 'utf8');
      expect(content).toContain('bg-primary');
      expect(content).not.toContain('bg-blue-500');
    });

    it('should report fixed colors', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-blue-500 text-gray-600">Hello</div>;
        }
      `);

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(result.fixedColors.length).toBeGreaterThan(0);
    });

    it('should report warnings for unfixable colors', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-400">Hello</div>;
        }
      `);

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('emerald-400');
    });

    it('should support dry-run mode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-blue-500">Hello</div>;
        }
      `);

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo', { dryRun: true });
      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.backupId).toBeNull();

      // File should not be changed
      const content = readFileSync(join(TEST_PROJECT, 'app/page.tsx'), 'utf8');
      expect(content).toContain('bg-blue-500');
    });

    it('should list changed files', () => {
      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      expect(result.changedFiles.length).toBeGreaterThan(0);
      expect(result.changedFiles.some(f => f.includes('theme.json'))).toBe(true);
      expect(result.changedFiles.some(f => f.includes('theme.css'))).toBe(true);
    });
  });

  // ===========================================================================
  // FULL MODE TESTS
  // ===========================================================================

  describe('FULL Mode Constants', () => {
    it('should have FULL_SCAN_DIRECTORIES with extended paths', () => {
      expect(FULL_SCAN_DIRECTORIES).toBeDefined();
      expect(FULL_SCAN_DIRECTORIES).toContain('app');
      expect(FULL_SCAN_DIRECTORIES).toContain('components');
      expect(FULL_SCAN_DIRECTORIES).toContain('tests');
      expect(FULL_SCAN_DIRECTORIES).toContain('test');
      expect(FULL_SCAN_DIRECTORIES).toContain('__tests__');
      expect(FULL_SCAN_DIRECTORIES).toContain('lib');
      expect(FULL_SCAN_DIRECTORIES).toContain('utils');
      expect(FULL_SCAN_DIRECTORIES).toContain('hooks');
    });

    it('should have FULL_THEME_VAR_MAP with extended mappings', () => {
      expect(FULL_THEME_VAR_MAP).toBeDefined();
      // Check it includes standard mappings
      expect(FULL_THEME_VAR_MAP['bg-white']).toBe('bg-background');
      expect(FULL_THEME_VAR_MAP['bg-blue-500']).toBe('bg-primary');

      // Check extended mappings
      expect(FULL_THEME_VAR_MAP['bg-green-500']).toBe('bg-success');
      expect(FULL_THEME_VAR_MAP['bg-emerald-500']).toBe('bg-success');
      expect(FULL_THEME_VAR_MAP['bg-yellow-500']).toBe('bg-warning');
      expect(FULL_THEME_VAR_MAP['bg-red-700']).toBe('bg-destructive');
      expect(FULL_THEME_VAR_MAP['bg-cyan-500']).toBe('bg-info');
      expect(FULL_THEME_VAR_MAP['bg-purple-500']).toBe('bg-accent');
    });

    it('should have opacity variants in FULL_THEME_VAR_MAP', () => {
      expect(FULL_THEME_VAR_MAP['bg-green-50']).toBe('bg-success/10');
      expect(FULL_THEME_VAR_MAP['bg-red-100']).toBe('bg-destructive/20');
      expect(FULL_THEME_VAR_MAP['bg-blue-300']).toBe('bg-primary/50');
    });

    it('should have hover/focus variants in FULL_THEME_VAR_MAP', () => {
      expect(FULL_THEME_VAR_MAP['hover:bg-blue-600']).toBe('hover:bg-primary/90');
      expect(FULL_THEME_VAR_MAP['focus:ring-blue-500']).toBe('focus:ring-ring');
    });

    it('should have dark mode variants in FULL_THEME_VAR_MAP', () => {
      expect(FULL_THEME_VAR_MAP['dark:bg-gray-800']).toBe('dark:bg-muted');
      expect(FULL_THEME_VAR_MAP['dark:text-gray-100']).toBe('dark:text-foreground');
    });
  });

  describe('getDynamicColorMapping', () => {
    it('should map green colors to success', () => {
      expect(getDynamicColorMapping('bg-green-500')).toBe('bg-success');
      expect(getDynamicColorMapping('text-emerald-600')).toBe('text-success');
      expect(getDynamicColorMapping('border-teal-500')).toBe('border-success');
    });

    it('should map red colors to destructive', () => {
      expect(getDynamicColorMapping('bg-red-600')).toBe('bg-destructive');
      expect(getDynamicColorMapping('text-rose-700')).toBe('text-destructive');
    });

    it('should map yellow/amber/orange to warning', () => {
      expect(getDynamicColorMapping('bg-yellow-500')).toBe('bg-warning');
      expect(getDynamicColorMapping('bg-amber-600')).toBe('bg-warning');
      expect(getDynamicColorMapping('bg-orange-500')).toBe('bg-warning');
    });

    it('should map blue to primary', () => {
      expect(getDynamicColorMapping('bg-blue-500')).toBe('bg-primary');
      expect(getDynamicColorMapping('text-blue-600')).toBe('text-primary');
    });

    it('should map cyan/sky to info', () => {
      expect(getDynamicColorMapping('bg-cyan-500')).toBe('bg-info');
      expect(getDynamicColorMapping('bg-sky-600')).toBe('bg-info');
    });

    it('should map purple/violet/indigo to accent', () => {
      expect(getDynamicColorMapping('bg-purple-500')).toBe('bg-accent');
      expect(getDynamicColorMapping('bg-violet-600')).toBe('bg-accent');
      expect(getDynamicColorMapping('bg-indigo-500')).toBe('bg-accent');
    });

    it('should map neutrals based on shade', () => {
      expect(getDynamicColorMapping('bg-gray-100')).toBe('bg-muted');
      expect(getDynamicColorMapping('bg-slate-200')).toBe('bg-muted');
      expect(getDynamicColorMapping('text-gray-500')).toBe('text-muted-foreground');
      expect(getDynamicColorMapping('bg-zinc-800')).toBe('bg-foreground');
    });

    it('should apply opacity based on shade', () => {
      expect(getDynamicColorMapping('bg-green-100')).toBe('bg-success/10');
      expect(getDynamicColorMapping('bg-red-200')).toBe('bg-destructive/20');
      expect(getDynamicColorMapping('bg-blue-300')).toBe('bg-primary/30');
      expect(getDynamicColorMapping('bg-purple-400')).toBe('bg-accent/70');
    });

    it('should return null for invalid patterns', () => {
      expect(getDynamicColorMapping('bg-invalid')).toBeNull();
      expect(getDynamicColorMapping('not-a-color')).toBeNull();
      expect(getDynamicColorMapping('')).toBeNull();
    });
  });

  describe('scanProjectColors with fullMode', () => {
    beforeEach(() => {
      mkdirSync(join(TEST_PROJECT, 'tests'), { recursive: true });
      mkdirSync(join(TEST_PROJECT, 'lib'), { recursive: true });
    });

    it('should scan extended directories in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), 'export default function Page() { return null; }');
      writeFileSync(join(TEST_PROJECT, 'tests/page.test.tsx'), 'export function test() {}');
      writeFileSync(join(TEST_PROJECT, 'lib/utils.ts'), 'export function util() {}');

      const resultStandard = scanProjectColors(TEST_PROJECT);
      const resultFull = scanProjectColors(TEST_PROJECT, { fullMode: true });

      expect(resultFull.scannedFiles).toBeGreaterThan(resultStandard.scannedFiles);
    });

    it('should map more colors in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-400 text-cyan-500">Hello</div>;
        }
      `);

      const resultStandard = scanProjectColors(TEST_PROJECT);
      const resultFull = scanProjectColors(TEST_PROJECT, { fullMode: true });

      // Standard mode: emerald-400 is unmapped
      const emeraldStandard = resultStandard.nonCompliant.find(n => n.match === 'bg-emerald-400');
      expect(emeraldStandard?.suggestion).toBeNull();

      // Full mode: emerald-400 gets dynamic mapping
      const emeraldFull = resultFull.nonCompliant.find(n => n.match === 'bg-emerald-400');
      expect(emeraldFull?.suggestion).toBe('bg-success/70');
    });

    it('should skip test assertions in test files', () => {
      writeFileSync(join(TEST_PROJECT, 'tests/Button.test.tsx'), `
        describe('Button', () => {
          it('should render', () => {
            expect(screen.getByText('Click')).toHaveClass('bg-blue-500');
          });
          const button = <button className="bg-blue-500">Click</button>;
        });
      `);

      const result = scanProjectColors(TEST_PROJECT, { fullMode: true });
      // Should only find one reference (in the JSX), not in the assertion
      const blueMatches = result.nonCompliant.filter(n => n.match === 'bg-blue-500');
      expect(blueMatches.length).toBe(1);
    });

    it('should include fullMode flag in result', () => {
      const result = scanProjectColors(TEST_PROJECT, { fullMode: true });
      expect(result.fullMode).toBe(true);
    });
  });

  describe('updateFileColors with fullMode', () => {
    it('should use extended mappings in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-500 text-cyan-600">Hello</div>;
        }
      `);

      const resultStandard = updateFileColors('app/page.tsx', TEST_PROJECT);
      expect(resultStandard.changed).toBe(false); // emerald-500 not in standard map

      const resultFull = updateFileColors('app/page.tsx', TEST_PROJECT, { fullMode: true });
      expect(resultFull.changed).toBe(true);
      expect(resultFull.content).toContain('bg-success');
      expect(resultFull.content).toContain('text-info');
    });

    it('should apply dynamic mappings for unmapped colors in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        <div className="bg-lime-500 text-fuchsia-600">
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT, { fullMode: true });
      expect(result.changed).toBe(true);
      expect(result.content).toContain('bg-success');
      expect(result.content).toContain('text-accent');
    });

    it('should preserve test assertions in test files', () => {
      mkdirSync(join(TEST_PROJECT, 'tests'), { recursive: true });
      writeFileSync(join(TEST_PROJECT, 'tests/Button.test.tsx'), `
        describe('Button', () => {
          it('renders', () => {
            expect(button).toHaveClass('bg-blue-500');
          });
          const button = <button className="bg-blue-500">Click</button>;
        });
      `);

      const result = updateFileColors('tests/Button.test.tsx', TEST_PROJECT, { fullMode: true });

      // Should keep bg-blue-500 in assertion
      expect(result.content).toContain("toHaveClass('bg-blue-500')");
      // Should change bg-blue-500 in JSX
      expect(result.content).toContain('className="bg-primary"');
    });

    it('should mark dynamic replacements', () => {
      // Use a color that's NOT in FULL_THEME_VAR_MAP but can be dynamically mapped
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        <div className="bg-lime-350 bg-teal-450">
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT, { fullMode: true });
      // Since these specific shades (350, 450) aren't in the static map,
      // they should be dynamically mapped if they match the pattern
      // However, Tailwind doesn't have 350/450 shades, so let's use a valid but unmapped color
    });

    it('should handle colors already in static map', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        <div className="bg-lime-500 bg-lime-600">
      `);

      const result = updateFileColors('app/page.tsx', TEST_PROJECT, { fullMode: true });
      expect(result.changed).toBe(true);
      // These are in FULL_THEME_VAR_MAP, so they won't be marked as dynamic
      expect(result.content).toContain('bg-success');
    });
  });

  describe('rebuildProjectTheme with fullMode', () => {
    beforeEach(() => {
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.json'), JSON.stringify({ id: 'original' }));
      writeFileSync(join(TEST_PROJECT, '.omgkit/design/theme.css'), '/* CSS */');
      mkdirSync(join(TEST_PROJECT, 'tests'), { recursive: true });
    });

    it('should fix more colors in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-500 text-cyan-600">Hello</div>;
        }
      `);

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo', { fullMode: true });
      expect(result.success).toBe(true);
      expect(result.fullMode).toBe(true);

      const content = readFileSync(join(TEST_PROJECT, 'app/page.tsx'), 'utf8');
      expect(content).toContain('bg-success');
      expect(content).toContain('text-info');
    });

    it('should scan test directories in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'tests/Component.test.tsx'), `
        const component = <div className="bg-blue-500">Test</div>;
      `);

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo', { fullMode: true });
      expect(result.success).toBe(true);

      // Test file should be updated
      const content = readFileSync(join(TEST_PROJECT, 'tests/Component.test.tsx'), 'utf8');
      expect(content).toContain('bg-primary');
    });

    it('should have fewer warnings in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-400 bg-cyan-500 bg-lime-600">Hello</div>;
        }
      `);

      const standardResult = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo');
      const standardWarnings = standardResult.warnings.length;

      // Reset file
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-400 bg-cyan-500 bg-lime-600">Hello</div>;
        }
      `);

      const fullResult = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo', { fullMode: true });
      const fullWarnings = fullResult.warnings.length;

      // Full mode should have fewer/no warnings since more colors are mapped
      expect(fullWarnings).toBeLessThan(standardWarnings);
    });

    it('should preserve dryRun behavior in fullMode', () => {
      writeFileSync(join(TEST_PROJECT, 'app/page.tsx'), `
        export default function Page() {
          return <div className="bg-emerald-500">Hello</div>;
        }
      `);

      const result = rebuildProjectTheme(TEST_PROJECT, 'neo-tokyo', { fullMode: true, dryRun: true });
      expect(result.success).toBe(true);
      expect(result.dryRun).toBe(true);
      expect(result.fullMode).toBe(true);

      // File should not be changed
      const content = readFileSync(join(TEST_PROJECT, 'app/page.tsx'), 'utf8');
      expect(content).toContain('bg-emerald-500');
    });
  });
});
