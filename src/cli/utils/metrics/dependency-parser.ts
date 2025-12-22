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
 * Parse package.json dependencies
 */
async function parsePackageJson(): Promise<Partial<DependencyMetrics>> {
  if (!(await fs.pathExists('package.json'))) {
    return {};
  }

  const pkg = await fs.readJson('package.json');
  const dependencies = pkg.dependencies || {};
  const devDependencies = pkg.devDependencies || {};

  return {
    dependencies,
    devDependencies,
    dependencyCount: Object.keys(dependencies).length,
    devDependencyCount: Object.keys(devDependencies).length,
  };
}

/**
 * Parse pubspec.yaml dependencies (Flutter)
 */
async function parsePubspecYaml(): Promise<Partial<DependencyMetrics>> {
  if (!(await fs.pathExists('pubspec.yaml'))) {
    return {};
  }

  const yaml = await fs.readFile('pubspec.yaml', 'utf8');
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  const depMatch = yaml.match(/dependencies:\s*\n((?: {2}[^\s].*\n(?: {4}.*\n)*)*)/);
  const devDepMatch = yaml.match(/dev_dependencies:\s*\n((?: {2}[^\s].*\n(?: {4}.*\n)*)*)/);

  if (depMatch) {
    const deps = depMatch[1]
      .split('\n')
      .filter((line: string) => line.match(/^ {2}[^\s]/) && line.trim().length > 0);
    deps.forEach((dep: string) => {
      const [name] = dep.trim().split(':');
      dependencies[name] = 'latest';
    });
  }

  if (devDepMatch) {
    const devDeps = devDepMatch[1]
      .split('\n')
      .filter((line: string) => line.match(/^ {2}[^\s]/) && line.trim().length > 0);
    devDeps.forEach((dep: string) => {
      const [name] = dep.trim().split(':');
      devDependencies[name] = 'latest';
    });
  }

  return {
    dependencies,
    devDependencies,
    dependencyCount: Object.keys(dependencies).length,
    devDependencyCount: Object.keys(devDependencies).length,
  };
}

/**
 * Parse requirements.txt dependencies (Python)
 */
async function parseRequirementsTxt(): Promise<Partial<DependencyMetrics>> {
  if (!(await fs.pathExists('requirements.txt'))) {
    return {};
  }

  const reqs = await fs.readFile('requirements.txt', 'utf8');
  const deps = reqs
    .split('\n')
    .filter((line: string) => line.trim().length > 0 && !line.startsWith('#'));

  const dependencies: Record<string, string> = {};
  deps.forEach((dep: string) => {
    const [name] = dep.split(/[=<>]/);
    dependencies[name.trim()] = 'latest';
  });

  return {
    dependencies,
    dependencyCount: deps.length,
    devDependencies: {},
    devDependencyCount: 0,
  };
}

/**
 * Parse Cargo.toml dependencies (Rust)
 */
async function parseCargoToml(): Promise<Partial<DependencyMetrics>> {
  if (!(await fs.pathExists('Cargo.toml'))) {
    return {};
  }

  const toml = await fs.readFile('Cargo.toml', 'utf8');
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  const depMatch = toml.match(/\[dependencies\]\s*\n((?:\w+\s*[={].*(?:\n|$))*)/);
  const devDepMatch = toml.match(/\[dev-dependencies\]\s*\n((?:\w+\s*[={].*(?:\n|$))*)/);

  if (depMatch) {
    const deps = depMatch[1].split('\n').filter((line: string) => line.trim().length > 0);
    deps.forEach((dep: string) => {
      const [name] = dep.trim().split(/\s*[={]/);
      dependencies[name] = 'latest';
    });
  }

  if (devDepMatch) {
    const devDeps = devDepMatch[1].split('\n').filter((line: string) => line.trim().length > 0);
    devDeps.forEach((dep: string) => {
      const [name] = dep.trim().split(/\s*[={]/);
      devDependencies[name] = 'latest';
    });
  }

  return {
    dependencies,
    devDependencies,
    dependencyCount: Object.keys(dependencies).length,
    devDependencyCount: Object.keys(devDependencies).length,
  };
}

/**
 * Parser map - maps frameworks to their dependency parsers
 */
const DEPENDENCY_PARSERS: Record<string, () => Promise<Partial<DependencyMetrics>>> = {
  'Node.js': parsePackageJson,
  React: parsePackageJson,
  'Next.js': parsePackageJson,
  Flutter: parsePubspecYaml,
  Python: parseRequirementsTxt,
  Rust: parseCargoToml,
};

/**
 * Parse dependencies from framework-specific files
 * @param framework - Framework name
 * @returns Dependencies and counts
 */
export async function parseDependencies(framework: string): Promise<DependencyMetrics> {
  const defaultResult: DependencyMetrics = {
    dependencies: {},
    dependencyCount: 0,
    devDependencies: {},
    devDependencyCount: 0,
  };

  try {
    const parser = DEPENDENCY_PARSERS[framework];
    if (parser) {
      const parsed = await parser();
      return { ...defaultResult, ...parsed };
    }
  } catch (error: unknown) {
    const { displayWarning, getErrorMessage } = await import('../errors.js');
    displayWarning(`Error parsing dependencies: ${getErrorMessage(error)}`);
  }

  return defaultResult;
}
