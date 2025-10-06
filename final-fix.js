#!/usr/bin/env node

/**
 * Final fix for all action parameter closing braces
 */

const fs = require('fs');
const path = require('path');

const testFiles = [
  './tests/unit/hooks/TrinityHookLibrary.spec.ts',
  './tests/unit/hooks/HookValidator.spec.ts',
  './tests/unit/hooks/HookExecutor.spec.ts',
];

function fixActionBraces(content) {
  // Fix patterns like: parameters: { command: '...' },\n        enabled:
  // Should be: parameters: { command: '...' } },\n        enabled:
  content = content.replace(
    /(parameters:\s*\{\s*command:\s*'[^']*'\s*),(\s+enabled:)/g,
    '$1 }$2'
  );

  // Fix patterns like: parameters: { command: '...' },\n        timeout:
  content = content.replace(
    /(parameters:\s*\{\s*command:\s*'[^']*'\s*),(\s+timeout:)/g,
    '$1 },$2'
  );

  // Fix patterns like: parameters: { command: '...' },\n        resourceLimits:
  content = content.replace(
    /(parameters:\s*\{\s*command:\s*'[^']*'\s*),(\s+resourceLimits:)/g,
    '$1 },$2'
  );

  // Fix action objects that don't close before enabled/safetyLevel
  // Pattern: action: {\n    type: 'command-run', parameters: { command: '...' }\n      },\n        enabled:
  content = content.replace(
    /(action:\s*\{\s*type:\s*'command-run',\s*parameters:\s*\{\s*command:\s*'[^']*'\s*\}\s*)(,?\s+enabled:)/g,
    '$1 },$2'
  );

  // Fix: action: {\n    type: 'command-run', parameters: { command: '...' }\n  },
  content = content.replace(
    /(type:\s*'command-run',\s*parameters:\s*\{\s*command:\s*'[^']*'\s*\}\s+)(\},)/g,
    '$1 }$2'
  );

  return content;
}

function main() {
  console.log('Final fix for action braces...\n');

  for (const file of testFiles) {
    const fullPath = path.resolve(file);
    console.log(`Processing: ${file}`);

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      content = fixActionBraces(content);

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`  ✓ Updated ${file}`);
      } else {
        console.log(`  - No changes needed`);
      }
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }

  console.log('\nDone!');
}

main();
