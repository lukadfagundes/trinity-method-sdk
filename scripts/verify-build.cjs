#!/usr/bin/env node
/**
 * Verify build artifacts exist
 * Used in CI to ensure templates are copied correctly
 */

const fs = require('fs');
const path = require('path');

// Verify templates directory structure exists
const requiredPaths = [
  path.join('dist', 'templates'),
  path.join('dist', 'templates', '.claude'),
  path.join('dist', 'templates', '.claude', 'agents'),
  path.join('dist', 'templates', '.claude', 'commands'),
  path.join('dist', 'templates', 'trinity'),
  path.join('dist', 'templates', 'root'),
  path.join('dist', 'templates', 'root', 'linting', 'nodejs'),
  path.join('dist', 'templates', 'source'),
  path.join('dist', 'templates', 'ci'),
];

let hasErrors = false;

for (const checkPath of requiredPaths) {
  if (!fs.existsSync(checkPath)) {
    console.error('❌ ERROR: Required path missing:', checkPath);
    hasErrors = true;
  } else {
    console.log('✅', checkPath);
  }
}

if (hasErrors) {
  console.error('\n❌ Build verification failed: Templates not copied correctly');
  process.exit(1);
}

// Verify some key template files exist
const keyTemplates = [
  path.join('dist', 'templates', 'root', 'CLAUDE.md.template'),
  path.join('dist', 'templates', 'root', 'linting', 'nodejs', '.eslintrc-typescript.json.template'),
  path.join('dist', 'templates', '.claude', 'agents', 'leadership', 'aly-cto.md.template'),
];

for (const templateFile of keyTemplates) {
  if (!fs.existsSync(templateFile)) {
    console.error('❌ ERROR: Key template missing:', templateFile);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error('\n❌ Build verification failed: Key templates missing');
  process.exit(1);
}

console.log('\n✅ Build verification passed: All templates copied correctly');
