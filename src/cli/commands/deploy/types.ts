/**
 * Shared types for deploy command modules
 */

import type { Ora } from 'ora';
import type { DeployOptions, Stack, CodebaseMetrics, LintingTool, PostInstallInstruction } from '../../types.js';

export type { DeployOptions, Stack, CodebaseMetrics, LintingTool, PostInstallInstruction };

/**
 * Configuration collected during deploy setup
 */
export interface DeployConfig {
  projectName: string;
  stack: Stack;
  metrics: CodebaseMetrics;
  lintingTools: LintingTool[];
  lintingDependencies: string[];
  lintingScripts: Record<string, string>;
  postInstallInstructions: PostInstallInstruction[];
  enableLinting: boolean;
  enableCICD: boolean;
  enableWorkOrders: boolean;
  enableInvestigations: boolean;
  enableDocs: boolean;
}

/**
 * Statistics tracked during deployment
 */
export interface DeploymentProgress {
  directories?: number;
  agentsDeployed: number;
  commandsDeployed: number;
  knowledgeBaseFiles: number;
  templatesDeployed: number;
  rootFilesDeployed: number;
}

/**
 * Shared spinner instance passed between modules
 */
export type Spinner = Ora;
