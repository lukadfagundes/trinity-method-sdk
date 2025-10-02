export function processTemplate(content, variables) {
  let processed = content;

  // Replace all placeholders with provided variables
  // Use variables directly, with fallbacks for backwards compatibility
  const placeholders = {
    PROJECT_NAME: variables.PROJECT_NAME || variables.projectName || 'Unknown Project',
    TECH_STACK: variables.TECH_STACK || variables.techStack || 'Unknown',
    FRAMEWORK: variables.FRAMEWORK || variables.framework || 'Generic',
    SOURCE_DIR: variables.SOURCE_DIR || variables.sourceDir || 'src',
    DEPLOYMENT_TIMESTAMP: variables.DEPLOYMENT_TIMESTAMP || variables.timestamp || new Date().toISOString(),
    LANGUAGE: variables.LANGUAGE || variables.language || 'Unknown',
    PACKAGE_MANAGER: variables.PACKAGE_MANAGER || variables.packageManager || 'npm',
    TRINITY_VERSION: variables.TRINITY_VERSION || '1.0.0',
    TECHNOLOGY_STACK: variables.TECHNOLOGY_STACK || variables.TECH_STACK || variables.techStack || 'Unknown',
    PRIMARY_FRAMEWORK: variables.PRIMARY_FRAMEWORK || variables.FRAMEWORK || variables.framework || 'Generic',
    CURRENT_DATE: variables.CURRENT_DATE || new Date().toISOString().split('T')[0],
    PROJECT_VAR_NAME: variables.PROJECT_VAR_NAME || (variables.PROJECT_NAME || variables.projectName || 'project').toLowerCase().replace(/[^a-z0-9]/g, ''),
    TRINITY_HOME: variables.TRINITY_HOME || process.env.TRINITY_HOME || 'C:/Users/lukaf/Desktop/Dev Work/trinity-method',
  };

  // Replace each placeholder
  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`\{\{${key}\}\}`, 'g');
    processed = processed.replace(regex, value);
  }

  return processed;
}

export function extractVariables(stack, projectName) {
  return {
    projectName: projectName || 'My Project',
    techStack: `${stack.language} / ${stack.framework}`,
    framework: stack.framework,
    sourceDir: stack.sourceDir,
    language: stack.language,
    packageManager: stack.packageManager,
    timestamp: new Date().toISOString()
  };
}

/**
 * Format metrics for template variable replacement
 * @param {Object} metrics - Collected codebase metrics
 * @returns {Object} Formatted metric variables
 */
export function formatMetrics(metrics) {
  if (!metrics || Object.keys(metrics).length === 0) {
    // Return placeholders if no metrics collected (--skip-audit)
    return {
      // Code Quality - Placeholders
      TODO_COUNT: '{{TODO_COUNT}}',
      TODO_COMMENTS: '{{TODO_COMMENTS}}',
      FIXME_COUNT: '{{FIXME_COUNT}}',
      HACK_COUNT: '{{HACK_COUNT}}',
      CONSOLE_COUNT: '{{CONSOLE_COUNT}}',
      COMMENTED_BLOCKS: '{{COMMENTED_BLOCKS}}',

      // File Complexity - Placeholders
      TOTAL_FILES: '{{TOTAL_FILES}}',
      FILES_500: '{{FILES_500}}',
      FILES_1000: '{{FILES_1000}}',
      FILES_3000: '{{FILES_3000}}',
      AVG_LENGTH: '{{AVG_LENGTH}}',

      // Dependencies - Placeholders
      DEPENDENCY_COUNT: '{{DEPENDENCY_COUNT}}',
      DEV_DEPENDENCY_COUNT: '{{DEV_DEPENDENCY_COUNT}}',
      FRAMEWORK_VERSION: '{{FRAMEWORK_VERSION}}',
      PACKAGE_MANAGER: '{{PACKAGE_MANAGER}}',

      // Git - Placeholders
      COMMIT_COUNT: '{{COMMIT_COUNT}}',
      CONTRIBUTOR_COUNT: '{{CONTRIBUTOR_COUNT}}',
      LAST_COMMIT: '{{LAST_COMMIT}}',

      // Agent-only metrics (always placeholders)
      OVERALL_COVERAGE: '{{OVERALL_COVERAGE}}',
      UNIT_COVERAGE: '{{UNIT_COVERAGE}}',
      DEPRECATED_COUNT: '{{DEPRECATED_COUNT}}',
      ANTIPATTERN_COUNT: '{{ANTIPATTERN_COUNT}}',
      PERF_ISSUE_COUNT: '{{PERF_ISSUE_COUNT}}',
      SECURITY_COUNT: '{{SECURITY_COUNT}}',

      // Architecture placeholders (needs agent)
      COMPONENT_1: '{{COMPONENT_1}}',
      RESPONSIBILITY_1: '{{RESPONSIBILITY_1}}',
      BACKEND_FRAMEWORK: '{{BACKEND_FRAMEWORK}}',
      DATABASE_TYPE: '{{DATABASE_TYPE}}',
      AUTH_TYPE: '{{AUTH_TYPE}}',
      STYLING_SOLUTION: '{{STYLING_SOLUTION}}',
    };
  }

  // Return actual metrics
  return {
    // Code Quality - Scriptable
    TODO_COUNT: metrics.todoCount || 0,
    TODO_COMMENTS: metrics.todoComments || 0,
    FIXME_COUNT: metrics.fixmeComments || 0,
    HACK_COUNT: metrics.hackComments || 0,
    CONSOLE_COUNT: metrics.consoleStatements || 0,
    COMMENTED_BLOCKS: metrics.commentedCodeBlocks || 0,

    // File Complexity - Scriptable
    TOTAL_FILES: metrics.totalFiles || 0,
    FILES_500: metrics.filesOver500 || 0,
    FILES_1000: metrics.filesOver1000 || 0,
    FILES_3000: metrics.filesOver3000 || 0,
    AVG_LENGTH: Math.round(metrics.avgFileLength || 0),

    // Dependencies - Scriptable
    DEPENDENCY_COUNT: metrics.dependencyCount || 0,
    DEV_DEPENDENCY_COUNT: metrics.devDependencyCount || 0,
    FRAMEWORK_VERSION: metrics.frameworkVersion || 'Unknown',
    PACKAGE_MANAGER: metrics.packageManager || 'Unknown',

    // Git - Scriptable
    COMMIT_COUNT: metrics.commitCount || 0,
    CONTRIBUTOR_COUNT: metrics.contributors || 1,
    LAST_COMMIT: metrics.lastCommitDate || 'Unknown',

    // Agent-only metrics (always placeholders)
    OVERALL_COVERAGE: '{{OVERALL_COVERAGE}}',
    UNIT_COVERAGE: '{{UNIT_COVERAGE}}',
    DEPRECATED_COUNT: '{{DEPRECATED_COUNT}}',
    ANTIPATTERN_COUNT: '{{ANTIPATTERN_COUNT}}',
    PERF_ISSUE_COUNT: '{{PERF_ISSUE_COUNT}}',
    SECURITY_COUNT: '{{SECURITY_COUNT}}',

    // Architecture placeholders (needs agent)
    COMPONENT_1: '{{COMPONENT_1}}',
    RESPONSIBILITY_1: '{{RESPONSIBILITY_1}}',
    BACKEND_FRAMEWORK: '{{BACKEND_FRAMEWORK}}',
    DATABASE_TYPE: '{{DATABASE_TYPE}}',
    AUTH_TYPE: '{{AUTH_TYPE}}',
    STYLING_SOLUTION: '{{STYLING_SOLUTION}}',
  };
}
