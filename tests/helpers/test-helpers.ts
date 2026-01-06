/**
 * Test Helpers - Utilities for Trinity Method SDK tests
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * Create a temporary test directory
 */
export async function createTempDir(): Promise<string> {
  const tmpDir = path.join(
    os.tmpdir(),
    `trinity-test-${Date.now()}-${Math.random().toString(36).substring(7)}`
  );
  await fs.ensureDir(tmpDir);
  return tmpDir;
}

/**
 * Clean up temporary directory
 */
export async function cleanupTempDir(dir: string): Promise<void> {
  if (await fs.pathExists(dir)) {
    await fs.remove(dir);
  }
}

/**
 * Create a mock Trinity deployment structure
 */
export async function createMockTrinityDeployment(
  targetDir: string,
  version: string = '2.0.4'
): Promise<void> {
  // Create trinity directory structure
  await fs.ensureDir(path.join(targetDir, 'trinity/knowledge-base'));
  await fs.ensureDir(path.join(targetDir, 'trinity/templates'));

  // Create VERSION file
  await fs.writeFile(path.join(targetDir, 'trinity/VERSION'), version);

  // Create user-managed knowledge base files
  await fs.writeFile(
    path.join(targetDir, 'trinity/knowledge-base/ARCHITECTURE.md'),
    '# Architecture\n\nUser custom architecture content'
  );
  await fs.writeFile(
    path.join(targetDir, 'trinity/knowledge-base/To-do.md'),
    '# To-Do\n\n- [ ] User task 1'
  );
  await fs.writeFile(
    path.join(targetDir, 'trinity/knowledge-base/ISSUES.md'),
    '# Issues\n\nUser custom issues'
  );
  await fs.writeFile(
    path.join(targetDir, 'trinity/knowledge-base/Technical-Debt.md'),
    '# Technical Debt\n\nUser custom debt tracking'
  );

  // Create SDK-managed knowledge base files
  await fs.writeFile(
    path.join(targetDir, 'trinity/knowledge-base/Trinity.md'),
    '# Trinity Method\n\nOld version content'
  );

  // Create .claude directory structure
  await fs.ensureDir(path.join(targetDir, '.claude/agents/leadership'));
  await fs.ensureDir(path.join(targetDir, '.claude/agents/planning'));
  await fs.ensureDir(path.join(targetDir, '.claude/agents/aj-team'));
  await fs.ensureDir(path.join(targetDir, '.claude/agents/deployment'));
  await fs.ensureDir(path.join(targetDir, '.claude/agents/audit'));
  await fs.ensureDir(path.join(targetDir, '.claude/commands'));

  // Create sample agent files
  await fs.writeFile(
    path.join(targetDir, '.claude/agents/leadership/aly-cto.md'),
    '# ALY - Old version'
  );

  // Create sample command file
  await fs.writeFile(
    path.join(targetDir, '.claude/commands/trinity-init.md'),
    '# Trinity Init - Old version'
  );
}

/**
 * Verify Trinity deployment structure exists
 */
export async function verifyTrinityStructure(targetDir: string): Promise<boolean> {
  const requiredPaths = [
    'trinity/VERSION',
    'trinity/knowledge-base',
    '.claude/agents/leadership',
    '.claude/agents/planning',
    '.claude/agents/aj-team',
    '.claude/commands',
  ];

  for (const requiredPath of requiredPaths) {
    if (!(await fs.pathExists(path.join(targetDir, requiredPath)))) {
      return false;
    }
  }

  return true;
}

/**
 * Read version from Trinity deployment
 */
export async function readVersion(targetDir: string): Promise<string> {
  const versionPath = path.join(targetDir, 'trinity/VERSION');
  if (!(await fs.pathExists(versionPath))) {
    throw new Error('VERSION file not found');
  }
  return (await fs.readFile(versionPath, 'utf8')).trim();
}

/**
 * Check if user files were preserved
 */
export async function verifyUserFilesPreserved(
  targetDir: string,
  expectedContent: Record<string, string>
): Promise<boolean> {
  for (const [file, content] of Object.entries(expectedContent)) {
    const filePath = path.join(targetDir, file);
    if (!(await fs.pathExists(filePath))) {
      return false;
    }
    const actualContent = await fs.readFile(filePath, 'utf8');
    if (!actualContent.includes(content)) {
      return false;
    }
  }
  return true;
}

/**
 * Count files in a directory recursively
 */
export async function countFiles(dir: string): Promise<number> {
  let count = 0;
  const items = await fs.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      count += await countFiles(fullPath);
    } else {
      count++;
    }
  }

  return count;
}

/**
 * Create a mock package.json with version
 */
export async function createMockPackageJson(targetDir: string, version: string): Promise<void> {
  const pkgPath = path.join(targetDir, 'package.json');
  await fs.writeFile(pkgPath, JSON.stringify({ version }, null, 2));
}
