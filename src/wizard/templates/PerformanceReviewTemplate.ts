/**
 * Performance Review Investigation Template
 *
 * Pre-configured template for performance analysis including profiling,
 * bottleneck identification, optimization recommendations, and load testing.
 *
 * @module wizard/templates/PerformanceReviewTemplate
 * @version 1.0.0
 */

import { InvestigationType, SuccessCriterion } from '../../shared/types';

import { InvestigationTemplate, TaskTemplate } from './InvestigationTemplate';

export class PerformanceReviewTemplate extends InvestigationTemplate {
  readonly id = 'performance-review';
  readonly name = 'Performance Review';
  readonly description =
    'Comprehensive performance analysis including profiling, bottleneck identification, optimization recommendations, and performance testing';
  readonly type: InvestigationType = 'performance-review';

  readonly focusAreas = [
    'Runtime Performance',
    'Memory Usage & Leaks',
    'Database Query Optimization',
    'API Response Times',
    'Bundle Size & Load Time',
    'Rendering Performance',
    'Caching Strategies',
    'Resource Utilization',
  ];

  readonly defaultExclusions = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
    '**/*.test.*',
    '**/*.spec.*',
  ];

  readonly estimatedDuration = 5400000; // 1.5 hours

  readonly successCriteria: SuccessCriterion[] = [
    {
      id: 'sc-perf-1',
      description: 'Identify top 5 performance bottlenecks',
      type: 'performance',
      expected: 'Top 5 bottlenecks documented with impact analysis',
      measurementMethod: 'Profiling and analysis',
    },
    {
      id: 'sc-perf-2',
      description: 'Measure baseline performance metrics',
      type: 'performance',
      expected: 'Response times, memory usage, and load times measured',
      measurementMethod: 'Performance monitoring tools',
    },
    {
      id: 'sc-perf-3',
      description: 'Provide actionable optimization recommendations',
      type: 'performance',
      expected: 'At least 5 optimization recommendations with estimated impact',
      measurementMethod: 'Manual review of recommendations',
    },
  ];

  protected taskTemplates: TaskTemplate[] = [
    {
      id: 'perf-init',
      description: 'Initialize performance review and establish baseline metrics',
      agentType: 'TAN',
      priority: 'critical',
      dependencies: [],
      estimatedDuration: 300000,
    },
    {
      id: 'perf-analyze-bundle',
      description: 'Analyze bundle size and identify large dependencies',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['perf-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'perf-profile-runtime',
      description: 'Profile runtime performance and identify slow functions',
      agentType: 'JUNO',
      priority: 'critical',
      dependencies: ['perf-init'],
      estimatedDuration: 900000,
    },
    {
      id: 'perf-analyze-memory',
      description: 'Analyze memory usage and detect potential memory leaks',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['perf-init'],
      estimatedDuration: 900000,
    },
    {
      id: 'perf-review-db-queries',
      description: 'Review database queries for N+1 problems and optimization opportunities',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['perf-init'],
      estimatedDuration: 900000,
    },
    {
      id: 'perf-analyze-api-response',
      description: 'Analyze API response times and identify slow endpoints',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['perf-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'perf-review-caching',
      description: 'Review caching strategies and identify optimization opportunities',
      agentType: 'TAN',
      priority: 'medium',
      dependencies: ['perf-analyze-api-response', 'perf-review-db-queries'],
      estimatedDuration: 600000,
    },
    {
      id: 'perf-analyze-rendering',
      description: 'Analyze rendering performance and component re-renders',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['perf-profile-runtime'],
      estimatedDuration: 600000,
    },
    {
      id: 'perf-generate-recommendations',
      description: 'Generate optimization recommendations with estimated impact',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: [
        'perf-analyze-bundle',
        'perf-profile-runtime',
        'perf-analyze-memory',
        'perf-review-db-queries',
        'perf-analyze-api-response',
        'perf-review-caching',
        'perf-analyze-rendering',
      ],
      estimatedDuration: 600000,
    },
    {
      id: 'perf-final-report',
      description: 'Create comprehensive performance review report',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: ['perf-generate-recommendations'],
      estimatedDuration: 300000,
    },
  ];
}
