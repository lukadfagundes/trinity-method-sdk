/**
 * Framework Detection Module
 * Detects framework versions and package managers
 * @module cli/utils/metrics/framework-detector
 */

import fs from 'fs-extra';
import { execSync } from 'child_process';

/**
 * Detect React version from package.json
 */
async function detectReactVersion(): Promise<string> {
  if (!(await fs.pathExists('package.json'))) return 'Unknown';

  const pkg = await fs.readJson('package.json');
  if (pkg.dependencies?.react) {
    return pkg.dependencies.react.replace(/[\^~]/, '');
  }

  return detectNodeVersion();
}

/**
 * Detect Next.js version from package.json
 */
async function detectNextVersion(): Promise<string> {
  if (!(await fs.pathExists('package.json'))) return 'Unknown';

  const pkg = await fs.readJson('package.json');
  if (pkg.dependencies?.next) {
    return pkg.dependencies.next.replace(/[\^~]/, '');
  }

  return detectNodeVersion();
}

/**
 * Detect Node.js version
 */
function detectNodeVersion(): string {
  const nodeVersion = execSync('node --version', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
  return nodeVersion.trim();
}

/**
 * Detect Flutter version from pubspec.yaml
 */
async function detectFlutterVersion(): Promise<string> {
  if (!(await fs.pathExists('pubspec.yaml'))) return 'Unknown';

  const yaml = await fs.readFile('pubspec.yaml', 'utf8');
  const match = yaml.match(/sdk:\s*["']>=?(\d+\.\d+\.\d+)/);
  return match ? match[1] : 'Unknown';
}

/**
 * Detect Python version
 */
function detectPythonVersion(): string {
  const version = execSync('python --version 2>&1', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
  return version.trim().replace('Python ', '');
}

/**
 * Detect Rust version
 */
function detectRustVersion(): string {
  const version = execSync('rustc --version', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  });
  return version.trim().replace('rustc ', '');
}

/**
 * Framework version detector map
 */
const VERSION_DETECTORS: Record<string, () => Promise<string> | string> = {
  React: detectReactVersion,
  'Next.js': detectNextVersion,
  'Node.js': detectNodeVersion,
  Flutter: detectFlutterVersion,
  Python: detectPythonVersion,
  Rust: detectRustVersion,
};

/**
 * Detect framework version
 * @param framework - Framework name
 * @returns Version string
 */
export async function detectFrameworkVersion(framework: string): Promise<string> {
  try {
    const detector = VERSION_DETECTORS[framework];
    if (detector) {
      return await detector();
    }
  } catch {
    // Framework version detection failed
  }

  return 'Unknown';
}

/**
 * Detect package manager
 * @returns Package manager name
 */
export async function detectPackageManager(): Promise<string> {
  // Check in priority order (pnpm should be checked before npm/yarn)
  if (await fs.pathExists('pnpm-lock.yaml')) return 'pnpm';
  if (await fs.pathExists('yarn.lock')) return 'yarn';
  if (await fs.pathExists('package-lock.json')) return 'npm';
  if (await fs.pathExists('pubspec.yaml')) return 'pub';
  if (await fs.pathExists('requirements.txt')) return 'pip';
  if (await fs.pathExists('Cargo.toml')) return 'cargo';
  return 'Unknown';
}
