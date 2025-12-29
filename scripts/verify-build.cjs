#!/usr/bin/env node
/**
 * Verify build artifacts exist
 * Used in CI to ensure templates are copied correctly
 */

const fs = require('fs');
const path = require('path');

const templatesPath = path.join('dist', 'templates', 'linting', 'nodejs');

if (!fs.existsSync(templatesPath)) {
  console.error('❌ ERROR: Templates missing at', templatesPath);
  console.error('Build may have failed to copy templates');
  process.exit(1);
}

console.log('✅ Templates verified at', templatesPath);

// List some template files to confirm
const files = fs.readdirSync(templatesPath);
console.log(`Found ${files.length} template files:`, files.slice(0, 3).join(', '));
