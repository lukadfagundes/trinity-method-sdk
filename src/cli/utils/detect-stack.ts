import { promises as fs } from 'fs';
import path from 'path';
import { Stack } from '../types.js';

// Common source directory names
const COMMON_SOURCE_DIRS = [
  'src',
  'lib',
  'app',
  'backend',
  'frontend',
  'server',
  'client',
  'database',
  'packages',
  'apps',
  'bot',
];

// Nested directory patterns (2-level and 3-level)
const NESTED_PATTERNS: string[][] = [
  // 2-level patterns - backend variations
  ['backend', 'src'],
  ['backend', 'lib'],
  ['backend', 'app'],
  // 2-level patterns - frontend variations
  ['frontend', 'src'],
  ['frontend', 'lib'],
  ['frontend', 'app'],
  // 2-level patterns - server/client variations
  ['server', 'src'],
  ['server', 'lib'],
  ['server', 'app'],
  ['client', 'src'],
  ['client', 'lib'],
  ['client', 'app'],
  // 2-level patterns - bot variations
  ['bot', 'src'],
  ['bot', 'lib'],
  ['bot', 'app'],
  // 2-level patterns - src nested
  ['src', 'backend'],
  ['src', 'frontend'],
  ['src', 'database'],
  ['src', 'server'],
  ['src', 'client'],
  ['src', 'bot'],

  // 3-level patterns - src nested deeply
  ['src', 'backend', 'src'],
  ['src', 'backend', 'lib'],
  ['src', 'backend', 'app'],
  ['src', 'frontend', 'src'],
  ['src', 'frontend', 'lib'],
  ['src', 'frontend', 'app'],
  ['src', 'database', 'src'],
  ['src', 'database', 'lib'],

  // 3-level patterns - frontend/backend with app
  ['frontend', 'app', 'lib'],
  ['frontend', 'app', 'src'],
  ['backend', 'app', 'lib'],
  ['backend', 'app', 'src'],
  ['server', 'app', 'lib'],
  ['server', 'app', 'src'],
  ['client', 'app', 'lib'],
  ['client', 'app', 'src'],
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

/**
 * Detect Flutter project
 */
async function detectFlutter(targetDir: string): Promise<Partial<Stack> | null> {
  if (await exists(path.join(targetDir, 'pubspec.yaml'))) {
    return {
      language: 'Dart',
      framework: 'Flutter',
      sourceDir: 'lib',
    };
  }
  return null;
}

/**
 * Detect Rust project
 */
async function detectRust(targetDir: string): Promise<Partial<Stack> | null> {
  if (await exists(path.join(targetDir, 'Cargo.toml'))) {
    return {
      language: 'Rust',
      framework: 'Generic',
      sourceDir: 'src',
    };
  }
  return null;
}

/**
 * Detect Go project
 */
async function detectGo(targetDir: string): Promise<Partial<Stack> | null> {
  if (await exists(path.join(targetDir, 'go.mod'))) {
    return {
      language: 'Go',
      framework: 'Generic',
      sourceDir: '.',
    };
  }
  return null;
}

/**
 * Detect Node.js/JavaScript framework
 */
async function detectNodeFramework(pkg: Record<string, unknown>): Promise<string> {
  const deps = pkg.dependencies as Record<string, unknown> | undefined;

  if (deps?.next) return 'Next.js';
  if (deps?.react) return 'React';
  if (deps?.vue) return 'Vue';
  if (deps?.['@angular/core']) return 'Angular';
  if (deps?.express) return 'Express';

  return 'Node.js';
}

/**
 * Detect package manager
 */
async function detectPackageManager(targetDir: string): Promise<string> {
  if (await exists(path.join(targetDir, 'pnpm-lock.yaml'))) return 'pnpm';
  if (await exists(path.join(targetDir, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

/**
 * Detect Node.js project
 */
async function detectNodeJs(targetDir: string): Promise<Partial<Stack> | null> {
  if (!(await exists(path.join(targetDir, 'package.json')))) {
    return null;
  }

  try {
    const pkgPath = path.join(targetDir, 'package.json');
    const pkgContent = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgContent);

    const framework = await detectNodeFramework(pkg);
    const packageManager = await detectPackageManager(targetDir);

    return {
      language: 'JavaScript/TypeScript',
      framework,
      sourceDir: framework === 'Angular' ? 'src/app' : 'src',
      packageManager,
    };
  } catch (parseError: unknown) {
    const { displayError, getErrorMessage } = await import('../utils/errors.js');
    displayError(`Error parsing package.json: ${getErrorMessage(parseError)}`);
    return null;
  }
}

/**
 * Detect Python project
 */
async function detectPython(targetDir: string): Promise<Partial<Stack> | null> {
  const hasPythonFiles =
    (await exists(path.join(targetDir, 'requirements.txt'))) ||
    (await exists(path.join(targetDir, 'setup.py'))) ||
    (await exists(path.join(targetDir, 'pyproject.toml')));

  if (!hasPythonFiles) {
    return null;
  }

  let framework = 'Generic';

  // Check for Flask
  if (await exists(path.join(targetDir, 'requirements.txt'))) {
    const reqContent = await fs.readFile(path.join(targetDir, 'requirements.txt'), 'utf8');
    if (reqContent.toLowerCase().includes('flask')) {
      framework = 'Flask';
    }
  }

  return {
    language: 'Python',
    framework,
    sourceDir: 'app',
  };
}

/**
 * Finalize source directories
 */
function finalizeSourceDirs(result: Stack): void {
  if (result.sourceDirs.length === 0) {
    result.sourceDirs = [result.sourceDir];
  } else if (!result.sourceDirs.includes(result.sourceDir)) {
    result.sourceDir = result.sourceDirs[0];
  }
}

export async function detectStack(targetDir: string = process.cwd()): Promise<Stack> {
  const result: Stack = {
    language: 'Unknown',
    framework: 'Generic',
    sourceDir: 'src',
    sourceDirs: [],
    packageManager: 'npm',
  };

  try {
    // Detector array pattern - order matters!
    // Check Flutter FIRST to avoid false positives when Trinity SDK creates package.json
    const detectors = [detectFlutter, detectRust, detectGo, detectNodeJs, detectPython];

    for (const detector of detectors) {
      const detected = await detector(targetDir);
      if (detected) {
        Object.assign(result, detected);
        break;
      }
    }
  } catch (error: unknown) {
    const { displayWarning, getErrorMessage } = await import('../utils/errors.js');
    displayWarning(`Error detecting stack: ${getErrorMessage(error)}`);
  }

  // Detect all source directories (monorepo support)
  result.sourceDirs = await detectSourceDirectories(targetDir);

  // Finalize source directories
  finalizeSourceDirs(result);

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
