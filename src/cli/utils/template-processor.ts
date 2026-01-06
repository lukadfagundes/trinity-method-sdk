import { Stack, CodebaseMetrics } from '../types.js';

/**
 * Convert value to string safely
 */
function toString(value: string | number | undefined): string {
  return value !== undefined ? String(value) : '';
}

/**
 * Resolve PROJECT_VAR_NAME variable
 */
function resolveProjectVarName(variables: Record<string, string | number>): string {
  return (
    toString(variables.PROJECT_VAR_NAME) ||
    String(variables.PROJECT_NAME || variables.projectName || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
  );
}

/**
 * Variable resolvers - maps placeholder names to resolution functions
 */
const VARIABLE_RESOLVERS: Record<string, (vars: Record<string, string | number>) => string> = {
  PROJECT_NAME: (v) => toString(v.PROJECT_NAME || v.projectName) || 'Unknown Project',
  TECH_STACK: (v) => toString(v.TECH_STACK || v.techStack) || 'Unknown',
  FRAMEWORK: (v) => toString(v.FRAMEWORK || v.framework) || 'Generic',
  SOURCE_DIR: (v) => toString(v.SOURCE_DIR || v.sourceDir) || 'src',
  DEPLOYMENT_TIMESTAMP: (v) =>
    toString(v.DEPLOYMENT_TIMESTAMP || v.timestamp) || new Date().toISOString(),
  LANGUAGE: (v) => toString(v.LANGUAGE || v.language) || 'Unknown',
  PACKAGE_MANAGER: (v) => toString(v.PACKAGE_MANAGER || v.packageManager) || 'npm',
  TRINITY_VERSION: (v) => toString(v.TRINITY_VERSION) || '2.0.6',
  TECHNOLOGY_STACK: (v) => toString(v.TECHNOLOGY_STACK || v.TECH_STACK || v.techStack) || 'Unknown',
  PRIMARY_FRAMEWORK: (v) =>
    toString(v.PRIMARY_FRAMEWORK || v.FRAMEWORK || v.framework) || 'Generic',
  CURRENT_DATE: (v) => toString(v.CURRENT_DATE) || new Date().toISOString().split('T')[0],
  PROJECT_VAR_NAME: (v) => resolveProjectVarName(v),
  TRINITY_HOME: (v) =>
    toString(v.TRINITY_HOME) ||
    process.env.TRINITY_HOME ||
    'C:/Users/lukaf/Desktop/Dev Work/trinity-method',
};

export function processTemplate(
  content: string,
  variables: Record<string, string | number>
): string {
  let processed = content;

  // Replace each placeholder using resolver functions
  for (const [key, resolver] of Object.entries(VARIABLE_RESOLVERS)) {
    const value = resolver(variables);
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    processed = processed.replace(regex, value);
  }

  return processed;
}

export function extractVariables(stack: Stack, projectName: string): Record<string, string> {
  return {
    projectName: projectName || 'My Project',
    techStack: `${stack.language} / ${stack.framework}`,
    framework: stack.framework,
    sourceDir: stack.sourceDir,
    language: stack.language,
    packageManager: stack.packageManager || 'npm',
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get placeholder metrics object
 */
function getPlaceholderMetrics(): Record<string, string> {
  return {
    // Code Quality
    TODO_COUNT: '{{TODO_COUNT}}',
    TODO_COMMENTS: '{{TODO_COMMENTS}}',
    FIXME_COUNT: '{{FIXME_COUNT}}',
    HACK_COUNT: '{{HACK_COUNT}}',
    CONSOLE_COUNT: '{{CONSOLE_COUNT}}',
    COMMENTED_BLOCKS: '{{COMMENTED_BLOCKS}}',
    // File Complexity
    TOTAL_FILES: '{{TOTAL_FILES}}',
    FILES_500: '{{FILES_500}}',
    FILES_1000: '{{FILES_1000}}',
    FILES_3000: '{{FILES_3000}}',
    AVG_LENGTH: '{{AVG_LENGTH}}',
    // Dependencies
    DEPENDENCY_COUNT: '{{DEPENDENCY_COUNT}}',
    DEV_DEPENDENCY_COUNT: '{{DEV_DEPENDENCY_COUNT}}',
    FRAMEWORK_VERSION: '{{FRAMEWORK_VERSION}}',
    PACKAGE_MANAGER: '{{PACKAGE_MANAGER}}',
    // Git
    COMMIT_COUNT: '{{COMMIT_COUNT}}',
    CONTRIBUTOR_COUNT: '{{CONTRIBUTOR_COUNT}}',
    LAST_COMMIT: '{{LAST_COMMIT}}',
    // Agent-only
    OVERALL_COVERAGE: '{{OVERALL_COVERAGE}}',
    UNIT_COVERAGE: '{{UNIT_COVERAGE}}',
    DEPRECATED_COUNT: '{{DEPRECATED_COUNT}}',
    ANTIPATTERN_COUNT: '{{ANTIPATTERN_COUNT}}',
    PERF_ISSUE_COUNT: '{{PERF_ISSUE_COUNT}}',
    SECURITY_COUNT: '{{SECURITY_COUNT}}',
    // Architecture
    COMPONENT_1: '{{COMPONENT_1}}',
    RESPONSIBILITY_1: '{{RESPONSIBILITY_1}}',
    BACKEND_FRAMEWORK: '{{BACKEND_FRAMEWORK}}',
    DATABASE_TYPE: '{{DATABASE_TYPE}}',
    AUTH_TYPE: '{{AUTH_TYPE}}',
    STYLING_SOLUTION: '{{STYLING_SOLUTION}}',
  };
}

/**
 * Get agent-only placeholder metrics
 */
function getAgentOnlyPlaceholders(): Record<string, string> {
  return {
    OVERALL_COVERAGE: '{{OVERALL_COVERAGE}}',
    UNIT_COVERAGE: '{{UNIT_COVERAGE}}',
    DEPRECATED_COUNT: '{{DEPRECATED_COUNT}}',
    ANTIPATTERN_COUNT: '{{ANTIPATTERN_COUNT}}',
    PERF_ISSUE_COUNT: '{{PERF_ISSUE_COUNT}}',
    SECURITY_COUNT: '{{SECURITY_COUNT}}',
    COMPONENT_1: '{{COMPONENT_1}}',
    RESPONSIBILITY_1: '{{RESPONSIBILITY_1}}',
    BACKEND_FRAMEWORK: '{{BACKEND_FRAMEWORK}}',
    DATABASE_TYPE: '{{DATABASE_TYPE}}',
    AUTH_TYPE: '{{AUTH_TYPE}}',
    STYLING_SOLUTION: '{{STYLING_SOLUTION}}',
  };
}

/**
 * Format code quality metrics
 */
function formatCodeQualityMetrics(metrics: CodebaseMetrics): Record<string, number> {
  return {
    TODO_COUNT: metrics.todoCount || 0,
    TODO_COMMENTS: metrics.todoComments || 0,
    FIXME_COUNT: metrics.fixmeComments || 0,
    HACK_COUNT: metrics.hackComments || 0,
    CONSOLE_COUNT: metrics.consoleStatements || 0,
    COMMENTED_BLOCKS: metrics.commentedCodeBlocks || 0,
  };
}

/**
 * Format file complexity metrics
 */
function formatFileComplexityMetrics(metrics: CodebaseMetrics): Record<string, number> {
  return {
    TOTAL_FILES: metrics.totalFiles || 0,
    FILES_500: metrics.filesOver500 || 0,
    FILES_1000: metrics.filesOver1000 || 0,
    FILES_3000: metrics.filesOver3000 || 0,
    AVG_LENGTH: Math.round(metrics.avgFileLength || 0),
  };
}

/**
 * Format dependency metrics
 */
function formatDependencyMetrics(metrics: CodebaseMetrics): Record<string, string | number> {
  return {
    DEPENDENCY_COUNT: metrics.dependencyCount || 0,
    DEV_DEPENDENCY_COUNT: metrics.devDependencyCount || 0,
    FRAMEWORK_VERSION: metrics.frameworkVersion || 'Unknown',
    PACKAGE_MANAGER: metrics.packageManager || 'Unknown',
  };
}

/**
 * Format git metrics
 */
function formatGitMetrics(metrics: CodebaseMetrics): Record<string, string | number> {
  return {
    COMMIT_COUNT: metrics.commitCount || 0,
    CONTRIBUTOR_COUNT: metrics.contributors || 1,
    LAST_COMMIT: metrics.lastCommitDate || 'Unknown',
  };
}

/**
 * Format actual metrics from codebase
 */
function formatActualMetrics(metrics: CodebaseMetrics): Record<string, string | number> {
  return {
    ...formatCodeQualityMetrics(metrics),
    ...formatFileComplexityMetrics(metrics),
    ...formatDependencyMetrics(metrics),
    ...formatGitMetrics(metrics),
    ...getAgentOnlyPlaceholders(),
  };
}

/**
 * Format metrics for template variable replacement
 * @param metrics - Collected codebase metrics
 * @returns Formatted metric variables
 */
export function formatMetrics(metrics?: CodebaseMetrics): Record<string, string | number> {
  if (!metrics || Object.keys(metrics).length === 0) {
    return getPlaceholderMetrics();
  }

  return formatActualMetrics(metrics);
}
