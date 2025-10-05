/**
 * Context Detector for Investigation Wizard
 *
 * Automatically detects codebase context: framework, language, testing tools,
 * dependencies, and project structure to provide smart investigation defaults.
 *
 * @module wizard/ContextDetector
 * @version 1.0.0
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { InvestigationContext } from '@shared/types';

/**
 * Framework detection patterns
 */
const FRAMEWORK_PATTERNS: Record<string, { files: string[]; dependencies?: string[] }> = {
  'Next.js': {
    files: ['next.config.js', 'next.config.ts', 'next.config.mjs'],
    dependencies: ['next'],
  },
  'React': {
    files: ['src/App.tsx', 'src/App.jsx', 'public/index.html'],
    dependencies: ['react', 'react-dom'],
  },
  'Vue': {
    files: ['vue.config.js', 'src/App.vue'],
    dependencies: ['vue'],
  },
  'Angular': {
    files: ['angular.json', 'src/app/app.module.ts'],
    dependencies: ['@angular/core'],
  },
  'Express': {
    files: ['server.js', 'app.js', 'src/server.ts'],
    dependencies: ['express'],
  },
  'Nest.js': {
    files: ['nest-cli.json', 'src/main.ts'],
    dependencies: ['@nestjs/core'],
  },
  'Svelte': {
    files: ['svelte.config.js', 'src/App.svelte'],
    dependencies: ['svelte'],
  },
  'Gatsby': {
    files: ['gatsby-config.js', 'gatsby-node.js'],
    dependencies: ['gatsby'],
  },
};

/**
 * Testing framework patterns
 */
const TESTING_FRAMEWORK_PATTERNS: Record<string, { files: string[]; dependencies?: string[] }> = {
  'Jest': {
    files: ['jest.config.js', 'jest.config.ts'],
    dependencies: ['jest', '@jest/globals'],
  },
  'Mocha': {
    files: ['.mocharc.json', 'test/mocha.opts'],
    dependencies: ['mocha'],
  },
  'Vitest': {
    files: ['vitest.config.ts', 'vitest.config.js'],
    dependencies: ['vitest'],
  },
  'Cypress': {
    files: ['cypress.config.ts', 'cypress.config.js', 'cypress.json'],
    dependencies: ['cypress'],
  },
  'Playwright': {
    files: ['playwright.config.ts'],
    dependencies: ['@playwright/test'],
  },
  'Pytest': {
    files: ['pytest.ini', 'conftest.py'],
    dependencies: ['pytest'],
  },
};

/**
 * Language detection patterns
 */
const LANGUAGE_PATTERNS: Record<string, string[]> = {
  'TypeScript': ['tsconfig.json', '**/*.ts', '**/*.tsx'],
  'JavaScript': ['**/*.js', '**/*.jsx', '**/*.mjs'],
  'Python': ['**/*.py', 'requirements.txt', 'setup.py', 'pyproject.toml'],
  'Go': ['**/*.go', 'go.mod', 'go.sum'],
  'Rust': ['**/*.rs', 'Cargo.toml'],
  'Java': ['**/*.java', 'pom.xml', 'build.gradle'],
  'C#': ['**/*.cs', '**/*.csproj'],
};

/**
 * Detects codebase context for smart investigation setup
 */
export class ContextDetector {
  private codebasePath: string;

  constructor(codebasePath: string = process.cwd()) {
    this.codebasePath = codebasePath;
  }

  /**
   * Detect complete investigation context
   * @returns Investigation context with all detected information
   */
  async detectContext(): Promise<InvestigationContext> {
    const [framework, language, testingFramework, dependencies, codebaseSize] =
      await Promise.all([
        this.detectFramework(),
        this.detectLanguage(),
        this.detectTestingFramework(),
        this.detectDependencies(),
        this.calculateCodebaseSize(),
      ]);

    return {
      type: 'code-quality', // Default investigation type
      scope: ['src/**/*'], // Default scope
      framework,
      language,
      testingFramework,
      dependencies,
      codebaseSize,
    };
  }

  /**
   * Detect primary framework
   * @returns Framework name or 'Unknown'
   */
  async detectFramework(): Promise<string> {
    for (const [framework, pattern] of Object.entries(FRAMEWORK_PATTERNS)) {
      // Check for framework-specific files
      for (const file of pattern.files) {
        const exists = await this.fileExists(file);
        if (exists) {
          return framework;
        }
      }

      // Check for framework dependencies
      if (pattern.dependencies) {
        const hasDependency = await this.hasDependencies(pattern.dependencies);
        if (hasDependency) {
          return framework;
        }
      }
    }

    return 'Unknown';
  }

  /**
   * Detect primary programming language
   * @returns Language name or 'Unknown'
   */
  async detectLanguage(): Promise<string> {
    const languageScores: Record<string, number> = {};

    for (const [language, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
      let score = 0;

      for (const pattern of patterns) {
        const exists = await this.fileExists(pattern);
        if (exists) {
          score += pattern.includes('*') ? 10 : 50; // Config files score higher
        }
      }

      if (score > 0) {
        languageScores[language] = score;
      }
    }

    // Return language with highest score
    const sortedLanguages = Object.entries(languageScores).sort(
      (a, b) => b[1] - a[1]
    );

    return sortedLanguages.length > 0 ? sortedLanguages[0][0] : 'Unknown';
  }

  /**
   * Detect testing framework
   * @returns Testing framework name or 'None'
   */
  async detectTestingFramework(): Promise<string> {
    for (const [framework, pattern] of Object.entries(
      TESTING_FRAMEWORK_PATTERNS
    )) {
      // Check for test framework files
      for (const file of pattern.files) {
        const exists = await this.fileExists(file);
        if (exists) {
          return framework;
        }
      }

      // Check for test framework dependencies
      if (pattern.dependencies) {
        const hasDependency = await this.hasDependencies(pattern.dependencies);
        if (hasDependency) {
          return framework;
        }
      }
    }

    return 'None';
  }

  /**
   * Detect project dependencies
   * @returns Array of dependency names
   */
  async detectDependencies(): Promise<string[]> {
    const dependencies: string[] = [];

    // Check package.json (Node.js)
    const packageJsonPath = path.join(this.codebasePath, 'package.json');
    if (await this.fileExists('package.json')) {
      try {
        const content = await fs.readFile(packageJsonPath, 'utf8');
        const packageJson = JSON.parse(content);

        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };

        dependencies.push(...Object.keys(allDeps));
      } catch {
        // Ignore parse errors
      }
    }

    // Check requirements.txt (Python)
    if (await this.fileExists('requirements.txt')) {
      try {
        const content = await fs.readFile(
          path.join(this.codebasePath, 'requirements.txt'),
          'utf8'
        );
        const pythonDeps = content
          .split('\n')
          .filter((line) => line.trim() && !line.startsWith('#'))
          .map((line) => line.split('==')[0].split('>=')[0].trim());

        dependencies.push(...pythonDeps);
      } catch {
        // Ignore errors
      }
    }

    // Check go.mod (Go)
    if (await this.fileExists('go.mod')) {
      try {
        const content = await fs.readFile(
          path.join(this.codebasePath, 'go.mod'),
          'utf8'
        );
        const goDeps = content
          .split('\n')
          .filter((line) => line.trim().startsWith('require'))
          .map((line) => line.replace('require', '').trim().split(' ')[0]);

        dependencies.push(...goDeps);
      } catch {
        // Ignore errors
      }
    }

    return dependencies;
  }

  /**
   * Calculate codebase size (lines of code)
   * @returns Total lines of code
   */
  async calculateCodebaseSize(): Promise<number> {
    let totalLines = 0;

    try {
      const files = await this.findCodeFiles();

      for (const file of files) {
        try {
          const content = await fs.readFile(file, 'utf8');
          const lines = content.split('\n').length;
          totalLines += lines;
        } catch {
          // Skip files that can't be read
        }
      }
    } catch {
      return 0;
    }

    return totalLines;
  }

  /**
   * Suggest investigation scope based on context
   * @param context - Investigation context
   * @returns Suggested scope patterns
   */
  suggestScope(context: InvestigationContext): string[] {
    const scope: string[] = [];

    // Add source directories
    if (context.language === 'TypeScript' || context.language === 'JavaScript') {
      scope.push('src/**/*.{ts,tsx,js,jsx}');
      scope.push('!**/*.test.{ts,tsx,js,jsx}');
      scope.push('!**/*.spec.{ts,tsx,js,jsx}');
    } else if (context.language === 'Python') {
      scope.push('**/*.py');
      scope.push('!**/test_*.py');
      scope.push('!**/*_test.py');
    } else if (context.language === 'Go') {
      scope.push('**/*.go');
      scope.push('!**/*_test.go');
    }

    // Add framework-specific patterns
    if (context.framework === 'Next.js') {
      scope.push('pages/**/*');
      scope.push('app/**/*');
      scope.push('components/**/*');
    } else if (context.framework === 'React') {
      scope.push('src/components/**/*');
      scope.push('src/pages/**/*');
    }

    return scope.length > 0 ? scope : ['src/**/*'];
  }

  /**
   * Suggest investigation type based on context
   * @param context - Investigation context
   * @returns Suggested investigation type
   */
  suggestInvestigationType(
    context: InvestigationContext
  ):
    | 'security-audit'
    | 'performance-review'
    | 'architecture-review'
    | 'code-quality'
    | 'custom' {
    // If no tests, suggest code quality
    if (context.testingFramework === 'None') {
      return 'code-quality';
    }

    // If large codebase, suggest architecture review
    if (context.codebaseSize > 10000) {
      return 'architecture-review';
    }

    // Default to security audit for web frameworks
    if (
      ['Next.js', 'React', 'Express', 'Nest.js'].includes(context.framework)
    ) {
      return 'security-audit';
    }

    return 'custom';
  }

  /**
   * Suggest agents based on investigation type
   * @param investigationType - Type of investigation
   * @returns Array of suggested agent types
   */
  suggestAgents(
    investigationType: string
  ): ('TAN' | 'ZEN' | 'INO' | 'JUNO')[] {
    const agentMap: Record<string, ('TAN' | 'ZEN' | 'INO' | 'JUNO')[]> = {
      'security-audit': ['JUNO', 'INO', 'ZEN'],
      'performance-review': ['JUNO', 'TAN', 'ZEN'],
      'architecture-review': ['TAN', 'ZEN', 'INO'],
      'code-quality': ['JUNO', 'ZEN', 'INO'],
      custom: ['TAN', 'ZEN', 'INO', 'JUNO'],
    };

    return agentMap[investigationType] || ['TAN', 'ZEN', 'INO', 'JUNO'];
  }

  /**
   * Check if file exists
   * @param filePath - Relative file path
   * @returns True if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.codebasePath, filePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if dependencies exist in package.json
   * @param deps - Dependencies to check
   * @returns True if any dependency exists
   */
  private async hasDependencies(deps: string[]): Promise<boolean> {
    try {
      const packageJsonPath = path.join(this.codebasePath, 'package.json');
      const content = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(content);

      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      return deps.some((dep) => dep in allDeps);
    } catch {
      return false;
    }
  }

  /**
   * Find all code files in codebase
   * @returns Array of file paths
   */
  private async findCodeFiles(): Promise<string[]> {
    const codeFiles: string[] = [];

    const scanDirectory = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          // Skip common ignore directories
          if (
            entry.isDirectory() &&
            !['node_modules', '.git', 'dist', 'build', '.next'].includes(
              entry.name
            )
          ) {
            await scanDirectory(fullPath);
          } else if (entry.isFile() && this.isCodeFile(entry.name)) {
            codeFiles.push(fullPath);
          }
        }
      } catch {
        // Skip directories that can't be read
      }
    };

    await scanDirectory(this.codebasePath);
    return codeFiles;
  }

  /**
   * Check if file is a code file
   * @param filename - File name
   * @returns True if code file
   */
  private isCodeFile(filename: string): boolean {
    const codeExtensions = [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.py',
      '.go',
      '.rs',
      '.java',
      '.cs',
      '.cpp',
      '.c',
      '.h',
    ];

    return codeExtensions.some((ext) => filename.endsWith(ext));
  }

  /**
   * Get context summary for display
   * @param context - Investigation context
   * @returns Human-readable summary
   */
  getContextSummary(context: InvestigationContext): string {
    return `
Framework: ${context.framework}
Language: ${context.language}
Testing: ${context.testingFramework}
Dependencies: ${context.dependencies.length} packages
Codebase Size: ${context.codebaseSize.toLocaleString()} lines
    `.trim();
  }
}
