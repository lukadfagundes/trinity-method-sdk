import { promises as fs } from 'fs';
import path from 'path';
import { Stack } from '../types.js';

export async function detectStack(targetDir: string = process.cwd()): Promise<Stack> {
  const result: Stack = {
    language: 'Unknown',
    framework: 'Generic',
    sourceDir: 'src',
    packageManager: 'npm'
  };

  try {
    // Check for Node.js/JavaScript
    if (await exists(path.join(targetDir, 'package.json'))) {
      result.language = 'JavaScript/TypeScript';

      const pkgPath = path.join(targetDir, 'package.json');
      const pkgContent = await fs.readFile(pkgPath, 'utf8');
      const pkg = JSON.parse(pkgContent);

      // Detect framework
      if (pkg.dependencies?.react) {
        result.framework = 'React';
      } else if (pkg.dependencies?.vue) {
        result.framework = 'Vue';
      } else if (pkg.dependencies?.['@angular/core']) {
        result.framework = 'Angular';
        result.sourceDir = 'src/app';
      } else if (pkg.dependencies?.next) {
        result.framework = 'Next.js';
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
    }
    // Check for Flutter
    else if (await exists(path.join(targetDir, 'pubspec.yaml'))) {
      result.language = 'Dart';
      result.framework = 'Flutter';
      result.sourceDir = 'lib';
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
  } catch (error: any) {
    console.error('Error detecting stack:', error.message);
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
