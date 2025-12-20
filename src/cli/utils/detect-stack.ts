import { promises as fs } from 'fs';
import path from 'path';
import { Stack } from '../types.js';

// Common source directory names
const COMMON_SOURCE_DIRS = [
  'src', 'lib', 'app', 'backend', 'frontend',
  'server', 'client', 'database', 'packages', 'apps'
];

// Nested directory patterns (2-level and 3-level)
const NESTED_PATTERNS: string[][] = [
  // 2-level patterns - backend variations
  ['backend', 'src'], ['backend', 'lib'], ['backend', 'app'],
  // 2-level patterns - frontend variations
  ['frontend', 'src'], ['frontend', 'lib'], ['frontend', 'app'],
  // 2-level patterns - server/client variations
  ['server', 'src'], ['server', 'lib'], ['server', 'app'],
  ['client', 'src'], ['client', 'lib'], ['client', 'app'],
  // 2-level patterns - src nested
  ['src', 'backend'], ['src', 'frontend'], ['src', 'database'], ['src', 'server'], ['src', 'client'],

  // 3-level patterns - src nested deeply
  ['src', 'backend', 'src'], ['src', 'backend', 'lib'], ['src', 'backend', 'app'],
  ['src', 'frontend', 'src'], ['src', 'frontend', 'lib'], ['src', 'frontend', 'app'],
  ['src', 'database', 'src'], ['src', 'database', 'lib'],

  // 3-level patterns - frontend/backend with app
  ['frontend', 'app', 'lib'], ['frontend', 'app', 'src'],
  ['backend', 'app', 'lib'], ['backend', 'app', 'src'],
  ['server', 'app', 'lib'], ['server', 'app', 'src'],
  ['client', 'app', 'lib'], ['client', 'app', 'src']
];

/**
 * Detect all source directories in the project (monorepo support)
 */
async function detectSourceDirectories(targetDir: string): Promise<string[]> {
  const foundDirs: string[] = [];

  // Check top-level directories
  for (const dir of COMMON_SOURCE_DIRS) {
    const dirPath = path.join(targetDir, dir);
    if (await exists(dirPath)) {
      foundDirs.push(dir);
    }
  }

  // Check 2-level nested patterns
  for (const pattern of NESTED_PATTERNS) {
    if (pattern.length === 2) {
      const [parent, child] = pattern;
      const fullPath = path.join(targetDir, parent, child);
      if (await exists(fullPath)) {
        const relativePath = `${parent}/${child}`;
        if (!foundDirs.includes(relativePath)) {
          foundDirs.push(relativePath);
        }
      }
    }
  }

  // Check 3-level nested patterns (also captures intermediate directories)
  for (const pattern of NESTED_PATTERNS) {
    if (pattern.length === 3) {
      const [level1, level2, level3] = pattern;
      const fullPath = path.join(targetDir, level1, level2, level3);
      if (await exists(fullPath)) {
        // Add the 3-level path
        const deepPath = `${level1}/${level2}/${level3}`;
        if (!foundDirs.includes(deepPath)) {
          foundDirs.push(deepPath);
        }
        // Also add intermediate 2-level path
        const intermediatePath = `${level1}/${level2}`;
        if (!foundDirs.includes(intermediatePath)) {
          foundDirs.push(intermediatePath);
        }
      }
    }
  }

  return foundDirs;
}

export async function detectStack(targetDir: string = process.cwd()): Promise<Stack> {
  const result: Stack = {
    language: 'Unknown',
    framework: 'Generic',
    sourceDir: 'src',
    sourceDirs: [],
    packageManager: 'npm'
  };

  try {
    // Check for Flutter FIRST (before package.json)
    // This prevents false positives when Trinity SDK creates package.json
    if (await exists(path.join(targetDir, 'pubspec.yaml'))) {
      result.language = 'Dart';
      result.framework = 'Flutter';
      result.sourceDir = 'lib';
    }
    // Check for Rust
    else if (await exists(path.join(targetDir, 'Cargo.toml'))) {
      result.language = 'Rust';
      result.framework = 'Generic';
      result.sourceDir = 'src';
    }
    // Check for Go
    else if (await exists(path.join(targetDir, 'go.mod'))) {
      result.language = 'Go';
      result.framework = 'Generic';
      result.sourceDir = '.';
    }
    // Check for Node.js/JavaScript
    // IMPORTANT: Check this AFTER other language-specific files to avoid false positives
    // (Trinity SDK installation may create package.json in non-Node projects)
    else if (await exists(path.join(targetDir, 'package.json'))) {
      try {
        const pkgPath = path.join(targetDir, 'package.json');
        const pkgContent = await fs.readFile(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgContent);

        result.language = 'JavaScript/TypeScript';

        // Detect framework (check Next.js BEFORE React since Next.js includes React)
        if (pkg.dependencies?.next) {
          result.framework = 'Next.js';
        } else if (pkg.dependencies?.react) {
          result.framework = 'React';
        } else if (pkg.dependencies?.vue) {
          result.framework = 'Vue';
        } else if (pkg.dependencies?.['@angular/core']) {
          result.framework = 'Angular';
          result.sourceDir = 'src/app';
        } else if (pkg.dependencies?.express) {
          result.framework = 'Express';
        } else {
          result.framework = 'Node.js';
        }

        // Detect package manager
        if (await exists(path.join(targetDir, 'pnpm-lock.yaml'))) {
          result.packageManager = 'pnpm';
        } else if (await exists(path.join(targetDir, 'yarn.lock'))) {
          result.packageManager = 'yarn';
        } else {
          result.packageManager = 'npm';
        }
      } catch (parseError: any) {
        console.error('Error parsing package.json:', parseError.message);
        // If package.json is malformed, treat as unknown project
        // (keep default result.language = 'Unknown', result.framework = 'Generic')
      }
    }
    // Check for Python
    else if (
      await exists(path.join(targetDir, 'requirements.txt')) ||
      await exists(path.join(targetDir, 'setup.py')) ||
      await exists(path.join(targetDir, 'pyproject.toml'))
    ) {
      result.language = 'Python';
      result.framework = 'Generic';

      // Check for Flask
      if (await exists(path.join(targetDir, 'requirements.txt'))) {
        const reqContent = await fs.readFile(path.join(targetDir, 'requirements.txt'), 'utf8');
        if (reqContent.toLowerCase().includes('flask')) {
          result.framework = 'Flask';
        }
      }

      result.sourceDir = 'app';
    }
  } catch (error: any) {
    console.error('Error detecting stack:', error.message);
  }

  // Detect all source directories (monorepo support)
  result.sourceDirs = await detectSourceDirectories(targetDir);

  // Ensure primary sourceDir is in sourceDirs array
  if (result.sourceDirs.length === 0) {
    result.sourceDirs = [result.sourceDir];
  } else if (!result.sourceDirs.includes(result.sourceDir)) {
    // If detected sourceDirs doesn't include the primary, use first detected as primary
    result.sourceDir = result.sourceDirs[0];
  }

  return result;
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
