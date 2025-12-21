/**
 * CLI Command Option Types
 */

export interface DeployOptions {
  name?: string;
  yes?: boolean;
  dryRun?: boolean;
  force?: boolean;
  skipAudit?: boolean;
  ciDeploy?: boolean;
  lintingTools?: LintingTool[];
  lintingDependencies?: string[];
  lintingScripts?: Record<string, string>;
  postInstallInstructions?: PostInstallInstruction[];
}

export interface UpdateOptions {
  all?: boolean;
  dryRun?: boolean;
}

export interface LintingTool {
  id: string;
  name: string;
  file: string;
  description?: string;
  template?: string;
  framework?: string;
  language?: string;
  recommended?: boolean;
  dependencies?: string[];
  scripts?: Record<string, string>;
  requiresTypeScript?: boolean;
  postInstall?: string;
}

export interface PostInstallInstruction {
  command: string;
  description?: string;
}

export interface Stack {
  framework: string;
  language: string;
  sourceDir: string; // Primary source directory (for backward compatibility)
  sourceDirs: string[]; // All detected source directories (monorepo support)
  packageManager?: string;
}

export interface CodebaseMetrics {
  // Code Quality Metrics
  todoCount: number;
  todoComments: number;
  fixmeComments: number;
  hackComments: number;
  consoleStatements: number;
  commentedCodeBlocks: number;

  // File Complexity Metrics
  totalFiles: number;
  filesOver500: number;
  filesOver1000: number;
  filesOver3000: number;
  avgFileLength: number;
  largestFiles: Array<{ file: string; lines: number }>;

  // Dependency Metrics
  dependencies: Record<string, string>;
  dependencyCount: number;
  devDependencies: Record<string, string>;
  devDependencyCount: number;

  // Git Metrics
  commitCount: number;
  contributors: number;
  lastCommitDate: string;

  // Framework-Specific
  frameworkVersion: string;
  packageManager: string;
}

export interface DeploymentStats {
  agents: number;
  templates: number;
  directories: number;
  files: number;
}
