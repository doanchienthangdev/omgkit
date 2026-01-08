/**
 * OMGKIT Theme Generator Factory
 * Unified export interface for all theme formats
 *
 * @module lib/generators
 */

import { generateCSS } from './css.generator.js';
import { generateSCSS } from './scss.generator.js';
import { generateTailwindV2 } from './tailwind.generator.js';
import { generateFigmaTokens } from './figma.generator.js';
import { generateStyleDictionary } from './style-dictionary.generator.js';

/**
 * Available generator definitions
 */
export const GENERATORS = {
  css: {
    name: 'CSS',
    description: 'CSS variables with @layer base',
    fn: generateCSS,
    ext: '.css',
    mimeType: 'text/css'
  },
  scss: {
    name: 'SCSS',
    description: 'Sass variables and mixins',
    fn: generateSCSS,
    ext: '.scss',
    mimeType: 'text/x-scss'
  },
  tailwind: {
    name: 'Tailwind',
    description: 'Tailwind CSS configuration',
    fn: generateTailwindV2,
    ext: '.js',
    mimeType: 'application/javascript'
  },
  figma: {
    name: 'Figma',
    description: 'Figma design tokens',
    fn: generateFigmaTokens,
    ext: '.json',
    mimeType: 'application/json'
  },
  'style-dictionary': {
    name: 'Style Dictionary',
    description: 'Style Dictionary design tokens',
    fn: generateStyleDictionary,
    ext: '.json',
    mimeType: 'application/json'
  }
};

/**
 * Get list of available generator formats
 * @returns {string[]} Array of format names
 */
export function getAvailableFormats() {
  return Object.keys(GENERATORS);
}

/**
 * Get generator info by format
 * @param {string} format - Generator format name
 * @returns {Object|null} Generator info or null
 */
export function getGeneratorInfo(format) {
  return GENERATORS[format] || null;
}

/**
 * Generate theme output in specified format
 * @param {Object} theme - Theme object (v1 or v2)
 * @param {string} format - Output format
 * @param {Object} options - Generator-specific options
 * @returns {string|Object} Generated output
 * @throws {Error} If format is not supported
 */
export function generateTheme(theme, format, options = {}) {
  const generator = GENERATORS[format];

  if (!generator) {
    const available = getAvailableFormats().join(', ');
    throw new Error(`Unknown format: ${format}. Available: ${available}`);
  }

  return generator.fn(theme, options);
}

/**
 * Generate theme in all available formats
 * @param {Object} theme - Theme object (v1 or v2)
 * @param {Object} options - Generator options
 * @returns {Object} Map of format -> output
 */
export function generateAllFormats(theme, options = {}) {
  const results = {};

  for (const [format, generator] of Object.entries(GENERATORS)) {
    try {
      results[format] = {
        content: generator.fn(theme, options),
        ext: generator.ext,
        mimeType: generator.mimeType,
        success: true
      };
    } catch (error) {
      results[format] = {
        content: null,
        ext: generator.ext,
        error: error.message,
        success: false
      };
    }
  }

  return results;
}

/**
 * Get file extension for format
 * @param {string} format - Generator format
 * @returns {string} File extension (with dot)
 */
export function getFormatExtension(format) {
  return GENERATORS[format]?.ext || '.txt';
}

// Re-export individual generators
export { generateCSS } from './css.generator.js';
export { generateSCSS } from './scss.generator.js';
export { generateTailwindV2 } from './tailwind.generator.js';
export { generateFigmaTokens } from './figma.generator.js';
export { generateStyleDictionary } from './style-dictionary.generator.js';
