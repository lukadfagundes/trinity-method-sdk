/**
 * Framework Detection Module
 * Detects framework versions and package managers
 * @module cli/utils/metrics/framework-detector
 */

import fs from 'fs-extra';
import { execSync } from 'child_process';

/**
 * Detect framework version
 * @param framework - Framework name
 * @returns Version string
 */
export async function detectFrameworkVersion(framework: string): Promise<string> {
  try {
    if (framework === 'Node.js' || framework === 'React' || framework === 'Next.js') {
      if (await fs.pathExists('package.json')) {
        const pkg = await fs.readJson('package.json');

        // Try framework-specific version first
        if (framework === 'React' && pkg.dependencies?.react) {
          return pkg.dependencies.react.replace(/[\^~]/, '');
        }
        if (framework === 'Next.js' && pkg.dependencies?.next) {
          return pkg.dependencies.next.replace(/[\^~]/, '');
        }

        // Fall back to Node.js version
        const nodeVersion = execSync('node --version', {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore'],
        });
        return nodeVersion.trim();
      }
    } else if (framework === 'Flutter') {
      if (await fs.pathExists('pubspec.yaml')) {
        const yaml = await fs.readFile('pubspec.yaml', 'utf8');
        const match = yaml.match(/sdk:\s*["']>=?(\d+\.\d+\.\d+)/);
        if (match) return match[1];
      }
    } else if (framework === 'Python') {
      const version = execSync('python --version 2>&1', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      return version.trim().replace('Python ', '');
    } else if (framework === 'Rust') {
      const version = execSync('rustc --version', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      });
      return version.trim().replace('rustc ', '');
    }
  } catch (error) {
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
