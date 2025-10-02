/**
 * Codebase Metrics Collection Utility
 * Trinity Method SDK - Hybrid Audit System
 *
 * Collects scriptable metrics from codebase without semantic analysis.
 * Designed for cross-platform compatibility (Node.js, Flutter, React, Python, Rust).
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

/**
 * Main entry point for metrics collection
 * @param {string} sourceDir - Source code directory (src/, lib/, app/)
 * @param {string} framework - Detected framework (Node.js, Flutter, React, Python, Rust)
 * @returns {Object} Collected metrics
 */
async function collectCodebaseMetrics(sourceDir, framework) {
  console.log(`   Collecting metrics from ${sourceDir} (${framework})...`);

  const metrics = {
    // Code Quality Metrics
    todoCount: 0,
    todoComments: 0,
    fixmeComments: 0,
    hackComments: 0,
    consoleStatements: 0,
    commentedCodeBlocks: 0,

    // File Complexity Metrics
    totalFiles: 0,
    filesOver500: 0,
    filesOver1000: 0,
    filesOver3000: 0,
    avgFileLength: 0,
    largestFiles: [],

    // Dependency Metrics
    dependencies: {},
    dependencyCount: 0,
    devDependencies: {},
    devDependencyCount: 0,

    // Git Metrics
    commitCount: 0,
    contributors: 0,
    lastCommitDate: 'Unknown',

    // Framework-Specific
    frameworkVersion: 'Unknown',
    packageManager: 'Unknown',
  };

  try {
    // Code Quality Metrics
    metrics.todoComments = await countPattern(sourceDir, /\/\/\s*TODO|#\s*TODO/gi);
    metrics.fixmeComments = await countPattern(sourceDir, /\/\/\s*FIXME|#\s*FIXME/gi);
    metrics.hackComments = await countPattern(sourceDir, /\/\/\s*HACK|#\s*HACK/gi);
    metrics.todoCount = metrics.todoComments + metrics.fixmeComments + metrics.hackComments;

    metrics.consoleStatements = await countPattern(sourceDir, /console\.(log|warn|error|debug|info)/gi);
    metrics.commentedCodeBlocks = await countCommentedCode(sourceDir);

    // File Complexity Metrics
    const fileStats = await analyzeFileComplexity(sourceDir);
    metrics.totalFiles = fileStats.totalFiles;
    metrics.filesOver500 = fileStats.filesOver500;
    metrics.filesOver1000 = fileStats.filesOver1000;
    metrics.filesOver3000 = fileStats.filesOver3000;
    metrics.avgFileLength = fileStats.avgFileLength;
    metrics.largestFiles = fileStats.largestFiles;

    // Dependency Metrics
    const deps = await parseDependencies(framework);
    metrics.dependencies = deps.dependencies;
    metrics.dependencyCount = deps.dependencyCount;
    metrics.devDependencies = deps.devDependencies;
    metrics.devDependencyCount = deps.devDependencyCount;

    // Git Metrics (optional)
    try {
      metrics.commitCount = await getCommitCount();
      metrics.contributors = await getContributorCount();
      metrics.lastCommitDate = await getLastCommitDate();
    } catch (error) {
      // Git not available or not a git repo
      console.log('   Git metrics unavailable (not a git repository)');
    }

    // Framework-Specific
    metrics.frameworkVersion = await detectFrameworkVersion(framework);
    metrics.packageManager = await detectPackageManager();

  } catch (error) {
    console.error('   Error collecting metrics:', error.message);
    throw error;
  }

  return metrics;
}

/**
 * Count occurrences of a pattern in source files
 * @param {string} dir - Directory to search
 * @param {RegExp} pattern - Pattern to match
 * @returns {number} Count of matches
 */
async function countPattern(dir, pattern) {
  if (!await fs.pathExists(dir)) {
    return 0;
  }

  try {
    // Get all source files
    const files = glob.sync(`${dir}/**/*.{js,jsx,ts,tsx,dart,py,rs}`, {
      ignore: ['**/node_modules/**', '**/build/**', '**/.dart_tool/**', '**/dist/**', '**/__pycache__/**']
    });

    let count = 0;
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const matches = content.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }

    return count;
  } catch (error) {
    console.error(`   Error counting pattern: ${error.message}`);
    return 0;
  }
}

/**
 * Count commented code blocks (heuristic: 3+ consecutive comment lines)
 * @param {string} dir - Directory to search
 * @returns {number} Estimated count of commented code blocks
 */
async function countCommentedCode(dir) {
  if (!await fs.pathExists(dir)) {
    return 0;
  }

  try {
    const files = glob.sync(`${dir}/**/*.{js,jsx,ts,tsx,dart,py,rs}`, {
      ignore: ['**/node_modules/**', '**/build/**', '**/.dart_tool/**', '**/dist/**', '**/__pycache__/**']
    });

    let blockCount = 0;
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const lines = content.split('\n');

      let consecutiveComments = 0;
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
          consecutiveComments++;
          if (consecutiveComments === 3) {
            blockCount++;
          }
        } else {
          consecutiveComments = 0;
        }
      }
    }

    return blockCount;
  } catch (error) {
    console.error(`   Error counting commented code: ${error.message}`);
    return 0;
  }
}

/**
 * Analyze file complexity metrics
 * @param {string} dir - Directory to analyze
 * @returns {Object} File complexity metrics
 */
async function analyzeFileComplexity(dir) {
  if (!await fs.pathExists(dir)) {
    return {
      totalFiles: 0,
      filesOver500: 0,
      filesOver1000: 0,
      filesOver3000: 0,
      avgFileLength: 0,
      largestFiles: []
    };
  }

  try {
    const files = glob.sync(`${dir}/**/*.{js,jsx,ts,tsx,dart,py,rs}`, {
      ignore: ['**/node_modules/**', '**/build/**', '**/.dart_tool/**', '**/dist/**', '**/__pycache__/**']
    });

    const fileSizes = [];
    let filesOver500 = 0;
    let filesOver1000 = 0;
    let filesOver3000 = 0;
    let totalLines = 0;

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      const lineCount = content.split('\n').length;
      totalLines += lineCount;

      fileSizes.push({ file: path.relative(dir, file), lines: lineCount });

      if (lineCount > 500) filesOver500++;
      if (lineCount > 1000) filesOver1000++;
      if (lineCount > 3000) filesOver3000++;
    }

    // Sort by size and get top 10
    fileSizes.sort((a, b) => b.lines - a.lines);
    const largestFiles = fileSizes.slice(0, 10);

    return {
      totalFiles: files.length,
      filesOver500,
      filesOver1000,
      filesOver3000,
      avgFileLength: files.length > 0 ? Math.round(totalLines / files.length) : 0,
      largestFiles
    };
  } catch (error) {
    console.error(`   Error analyzing file complexity: ${error.message}`);
    return {
      totalFiles: 0,
      filesOver500: 0,
      filesOver1000: 0,
      filesOver3000: 0,
      avgFileLength: 0,
      largestFiles: []
    };
  }
}

/**
 * Parse dependencies from framework-specific files
 * @param {string} framework - Framework name
 * @returns {Object} Dependencies and counts
 */
async function parseDependencies(framework) {
  const result = {
    dependencies: {},
    dependencyCount: 0,
    devDependencies: {},
    devDependencyCount: 0
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
        const depMatch = yaml.match(/dependencies:\s*\n((?:  \w+:.*\n)*)/);
        const devDepMatch = yaml.match(/dev_dependencies:\s*\n((?:  \w+:.*\n)*)/);

        if (depMatch) {
          const deps = depMatch[1].split('\n').filter(line => line.trim().length > 0);
          result.dependencyCount = deps.length;
          deps.forEach(dep => {
            const [name] = dep.trim().split(':');
            result.dependencies[name] = 'latest';
          });
        }

        if (devDepMatch) {
          const devDeps = devDepMatch[1].split('\n').filter(line => line.trim().length > 0);
          result.devDependencyCount = devDeps.length;
          devDeps.forEach(dep => {
            const [name] = dep.trim().split(':');
            result.devDependencies[name] = 'latest';
          });
        }
      }
    } else if (framework === 'Python') {
      // Parse requirements.txt
      if (await fs.pathExists('requirements.txt')) {
        const reqs = await fs.readFile('requirements.txt', 'utf8');
        const deps = reqs.split('\n').filter(line => line.trim().length > 0 && !line.startsWith('#'));
        result.dependencyCount = deps.length;
        deps.forEach(dep => {
          const [name] = dep.split(/[=<>]/);
          result.dependencies[name.trim()] = 'latest';
        });
      }
    } else if (framework === 'Rust') {
      // Parse Cargo.toml
      if (await fs.pathExists('Cargo.toml')) {
        const toml = await fs.readFile('Cargo.toml', 'utf8');
        const depMatch = toml.match(/\[dependencies\]\s*\n((?:\w+\s*=.*\n)*)/);
        const devDepMatch = toml.match(/\[dev-dependencies\]\s*\n((?:\w+\s*=.*\n)*)/);

        if (depMatch) {
          const deps = depMatch[1].split('\n').filter(line => line.trim().length > 0);
          result.dependencyCount = deps.length;
          deps.forEach(dep => {
            const [name] = dep.trim().split(/\s*=/);
            result.dependencies[name] = 'latest';
          });
        }

        if (devDepMatch) {
          const devDeps = devDepMatch[1].split('\n').filter(line => line.trim().length > 0);
          result.devDependencyCount = devDeps.length;
          devDeps.forEach(dep => {
            const [name] = dep.trim().split(/\s*=/);
            result.devDependencies[name] = 'latest';
          });
        }
      }
    }
  } catch (error) {
    console.error(`   Error parsing dependencies: ${error.message}`);
  }

  return result;
}

/**
 * Get total commit count
 * @returns {number} Commit count
 */
async function getCommitCount() {
  try {
    const count = execSync('git rev-list --count HEAD', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return parseInt(count.trim(), 10);
  } catch (error) {
    return 0;
  }
}

/**
 * Get contributor count
 * @returns {number} Contributor count
 */
async function getContributorCount() {
  try {
    const output = execSync('git shortlog -sn --all', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const lines = output.trim().split('\n').filter(line => line.length > 0);
    return lines.length;
  } catch (error) {
    return 1;
  }
}

/**
 * Get last commit date
 * @returns {string} Last commit date (ISO format)
 */
async function getLastCommitDate() {
  try {
    const date = execSync('git log -1 --format=%cI', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    return date.trim();
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Detect framework version
 * @param {string} framework - Framework name
 * @returns {string} Version string
 */
async function detectFrameworkVersion(framework) {
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
        const nodeVersion = execSync('node --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        return nodeVersion.trim();
      }
    } else if (framework === 'Flutter') {
      if (await fs.pathExists('pubspec.yaml')) {
        const yaml = await fs.readFile('pubspec.yaml', 'utf8');
        const match = yaml.match(/sdk:\s*["']>=?(\d+\.\d+\.\d+)/);
        if (match) return match[1];
      }
    } else if (framework === 'Python') {
      const version = execSync('python --version 2>&1', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      return version.trim().replace('Python ', '');
    } else if (framework === 'Rust') {
      const version = execSync('rustc --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
      return version.trim().replace('rustc ', '');
    }
  } catch (error) {
    // Framework version detection failed
  }

  return 'Unknown';
}

/**
 * Detect package manager
 * @returns {string} Package manager name
 */
async function detectPackageManager() {
  if (await fs.pathExists('package-lock.json')) return 'npm';
  if (await fs.pathExists('yarn.lock')) return 'yarn';
  if (await fs.pathExists('pnpm-lock.yaml')) return 'pnpm';
  if (await fs.pathExists('pubspec.yaml')) return 'pub';
  if (await fs.pathExists('requirements.txt')) return 'pip';
  if (await fs.pathExists('Cargo.toml')) return 'cargo';
  return 'Unknown';
}

export {
  collectCodebaseMetrics,
  countPattern,
  analyzeFileComplexity,
  parseDependencies,
  detectFrameworkVersion,
  detectPackageManager
};
