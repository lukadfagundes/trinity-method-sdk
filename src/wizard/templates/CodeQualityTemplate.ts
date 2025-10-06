/**
 * Code Quality Investigation Template
 *
 * Pre-configured template for code quality analysis including code smell detection,
 * complexity analysis, test coverage review, and best practices compliance.
 *
 * @module wizard/templates/CodeQualityTemplate
 * @version 1.0.0
 */

import { InvestigationType, SuccessCriterion } from '../../shared/types';

import { InvestigationTemplate, TaskTemplate } from './InvestigationTemplate';

export class CodeQualityTemplate extends InvestigationTemplate {
  readonly id = 'code-quality';
  readonly name = 'Code Quality Analysis';
  readonly description =
    'Comprehensive code quality analysis including code smells, complexity metrics, test coverage, and best practices compliance';
  readonly type: InvestigationType = 'code-quality';

  readonly focusAreas = [
    'Code Smells & Anti-patterns',
    'Complexity Metrics',
    'Test Coverage',
    'Code Duplication',
    'Naming Conventions',
    'Documentation Quality',
    'Error Handling',
    'Best Practices Compliance',
  ];

  readonly defaultExclusions = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
  ];

  readonly estimatedDuration = 4320000; // 1.2 hours

  readonly successCriteria: SuccessCriterion[] = [
    {
      id: 'sc-quality-1',
      description: 'Identify all critical code smells and anti-patterns',
      type: 'quality',
      expected: 'Code smells categorized by severity',
      measurementMethod: 'Static analysis and manual review',
    },
    {
      id: 'sc-quality-2',
      description: 'Measure code complexity and identify high-risk areas',
      type: 'quality',
      expected: 'Complexity metrics with threshold violations',
      measurementMethod: 'Cyclomatic complexity analysis',
    },
    {
      id: 'sc-quality-3',
      description: 'Assess test coverage and identify gaps',
      type: 'quality',
      expected: 'Test coverage report with gap analysis',
      measurementMethod: 'Coverage tool analysis',
    },
  ];

  protected taskTemplates: TaskTemplate[] = [
    {
      id: 'quality-init',
      description: 'Initialize code quality analysis',
      agentType: 'JUNO',
      priority: 'critical',
      dependencies: [],
      estimatedDuration: 300000,
    },
    {
      id: 'quality-detect-code-smells',
      description: 'Detect code smells and anti-patterns',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['quality-init'],
      estimatedDuration: 900000,
    },
    {
      id: 'quality-analyze-complexity',
      description: 'Analyze cyclomatic complexity and identify complex functions',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['quality-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'quality-check-test-coverage',
      description: 'Analyze test coverage and identify untested code',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['quality-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'quality-detect-duplication',
      description: 'Detect code duplication and identify refactoring opportunities',
      agentType: 'JUNO',
      priority: 'medium',
      dependencies: ['quality-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'quality-review-naming',
      description: 'Review naming conventions and identifier quality',
      agentType: 'JUNO',
      priority: 'medium',
      dependencies: ['quality-init'],
      estimatedDuration: 300000,
    },
    {
      id: 'quality-check-documentation',
      description: 'Check documentation quality and completeness',
      agentType: 'ZEN',
      priority: 'medium',
      dependencies: ['quality-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'quality-review-error-handling',
      description: 'Review error handling patterns and exception management',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['quality-detect-code-smells'],
      estimatedDuration: 600000,
    },
    {
      id: 'quality-check-best-practices',
      description: 'Check compliance with framework/language best practices',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['quality-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'quality-generate-recommendations',
      description: 'Generate quality improvement recommendations',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: [
        'quality-detect-code-smells',
        'quality-analyze-complexity',
        'quality-check-test-coverage',
        'quality-detect-duplication',
        'quality-review-naming',
        'quality-check-documentation',
        'quality-review-error-handling',
        'quality-check-best-practices',
      ],
      estimatedDuration: 600000,
    },
    {
      id: 'quality-final-report',
      description: 'Create comprehensive code quality report',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: ['quality-generate-recommendations'],
      estimatedDuration: 300000,
    },
  ];
}
