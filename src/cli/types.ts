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
}

export interface PostInstallInstruction {
  command: string;
  description?: string;
}

export interface Stack {
  framework: string;
  language: string;
  sourceDir: string;           // Primary source directory (for backward compatibility)
  sourceDirs: string[];        // All detected source directories (monorepo support)
  packageManager?: string;
}

export interface CodebaseMetrics {
  totalFiles: number;
  todoCount: number;
  filesOver500: number;
  dependencyCount: number;
  [key: string]: any;
}

export interface DeploymentStats {
  agents: number;
  templates: number;
  directories: number;
  files: number;
}
