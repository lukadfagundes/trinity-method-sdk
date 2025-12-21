/**
 * Dependency Parsing Module
 * Parses dependencies from framework-specific files (package.json, pubspec.yaml, etc.)
 * @module cli/utils/metrics/dependency-parser
 */

import fs from 'fs-extra';

/**
 * Dependency metrics
 */
export interface DependencyMetrics {
  dependencies: Record<string, string>;
  dependencyCount: number;
  devDependencies: Record<string, string>;
  devDependencyCount: number;
}

/**
 * Parse dependencies from framework-specific files
 * @param framework - Framework name
 * @returns Dependencies and counts
 */
export async function parseDependencies(framework: string): Promise<DependencyMetrics> {
  const result: DependencyMetrics = {
    dependencies: {},
    dependencyCount: 0,
    devDependencies: {},
    devDependencyCount: 0,
  };

  try {
    if (framework === 'Node.js' || framework === 'React' || framework === 'Next.js') {
      // Parse package.json
      if (await fs.pathExists('package.json')) {
        const pkg = await fs.readJson('package.json');
        result.dependencies = pkg.dependencies || {};
        result.devDependencies = pkg.devDependencies || {};
        result.dependencyCount = Object.keys(result.dependencies).length;
        result.devDependencyCount = Object.keys(result.devDependencies).length;
      }
    } else if (framework === 'Flutter') {
      // Parse pubspec.yaml
      if (await fs.pathExists('pubspec.yaml')) {
        const yaml = await fs.readFile('pubspec.yaml', 'utf8');

        // Parse dependencies section (handle both simple and nested entries)
        const depMatch = yaml.match(/dependencies:\s*\n((?: {2}[^\s].*\n(?: {4}.*\n)*)*)/);
        const devDepMatch = yaml.match(/dev_dependencies:\s*\n((?: {2}[^\s].*\n(?: {4}.*\n)*)*)/);

        if (depMatch) {
          // Count top-level dependencies (lines starting with 2 spaces, not 4+)
          const deps = depMatch[1].split('\n').filter((line: string) => {
            return line.match(/^ {2}[^\s]/) && line.trim().length > 0;
          });
          result.dependencyCount = deps.length;
          deps.forEach((dep: string) => {
            const [name] = dep.trim().split(':');
            result.dependencies[name] = 'latest';
          });
        }

        if (devDepMatch) {
          const devDeps = devDepMatch[1].split('\n').filter((line: string) => {
            return line.match(/^ {2}[^\s]/) && line.trim().length > 0;
          });
          result.devDependencyCount = devDeps.length;
          devDeps.forEach((dep: string) => {
            const [name] = dep.trim().split(':');
            result.devDependencies[name] = 'latest';
          });
        }
      }
    } else if (framework === 'Python') {
      // Parse requirements.txt
      if (await fs.pathExists('requirements.txt')) {
        const reqs = await fs.readFile('requirements.txt', 'utf8');
        const deps = reqs
          .split('\n')
          .filter((line: string) => line.trim().length > 0 && !line.startsWith('#'));
        result.dependencyCount = deps.length;
        deps.forEach((dep: string) => {
          const [name] = dep.split(/[=<>]/);
          result.dependencies[name.trim()] = 'latest';
        });
      }
    } else if (framework === 'Rust') {
      // Parse Cargo.toml
      if (await fs.pathExists('Cargo.toml')) {
        const toml = await fs.readFile('Cargo.toml', 'utf8');

        // Match dependencies section - handle both simple (=) and complex ({) syntax
        // Also handle last line without trailing newline
        const depMatch = toml.match(/\[dependencies\]\s*\n((?:\w+\s*[={].*(?:\n|$))*)/);
        const devDepMatch = toml.match(/\[dev-dependencies\]\s*\n((?:\w+\s*[={].*(?:\n|$))*)/);

        if (depMatch) {
          const deps = depMatch[1].split('\n').filter((line: string) => line.trim().length > 0);
          result.dependencyCount = deps.length;
          deps.forEach((dep: string) => {
            const [name] = dep.trim().split(/\s*[={]/);
            result.dependencies[name] = 'latest';
          });
        }

        if (devDepMatch) {
          const devDeps = devDepMatch[1]
            .split('\n')
            .filter((line: string) => line.trim().length > 0);
          result.devDependencyCount = devDeps.length;
          devDeps.forEach((dep: string) => {
            const [name] = dep.trim().split(/\s*[={]/);
            result.devDependencies[name] = 'latest';
          });
        }
      }
    }
  } catch (error: unknown) {
    const { displayWarning, getErrorMessage } = await import('../errors.js');
    displayWarning(`Error parsing dependencies: ${getErrorMessage(error)}`);
  }

  return result;
}
