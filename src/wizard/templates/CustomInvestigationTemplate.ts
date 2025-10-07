/**
 * Custom Investigation Template
 *
 * Flexible template for user-defined custom investigations.
 * Provides minimal structure while allowing full customization of
 * investigation goals, scope, and agent assignments.
 *
 * @module wizard/templates/CustomInvestigationTemplate
 * @version 1.0.0
 */

import { InvestigationType, SuccessCriterion } from '../../shared/types';

import { InvestigationTemplate, TaskTemplate } from './InvestigationTemplate';

export class CustomInvestigationTemplate extends InvestigationTemplate {
  readonly id = 'custom';
  readonly name = 'Custom Investigation';
  readonly description =
    'User-defined custom investigation with flexible goals, scope, and agent assignments';
  readonly type: InvestigationType = 'custom';

  readonly focusAreas = ['Custom Analysis', 'User-Defined Objectives'];

  readonly defaultExclusions = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
  ];

  readonly estimatedDuration = 3600000; // 1 hour default

  readonly successCriteria: SuccessCriterion[] = [
    {
      id: 'sc-custom-1',
      description: 'Complete user-defined investigation objectives',
      type: 'quality',
      expected: 'Investigation goals achieved',
      measurementMethod: 'Manual review against defined criteria',
    },
  ];

  protected taskTemplates: TaskTemplate[] = [
    {
      id: 'custom-init',
      description: 'Initialize custom investigation',
      agentType: 'TAN',
      priority: 'high',
      dependencies: [],
      estimatedDuration: 600000,
    },
    {
      id: 'custom-execute',
      description: 'Execute custom investigation tasks',
      agentType: 'TAN',
      priority: 'high',
      dependencies: ['custom-init'],
      estimatedDuration: 1800000,
    },
    {
      id: 'custom-report',
      description: 'Generate custom investigation report',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: ['custom-execute'],
      estimatedDuration: 600000,
    },
  ];
}
