/**
 * Architecture Analysis Investigation Template
 *
 * Pre-configured template for comprehensive architecture review including
 * structure assessment, design pattern detection, dependency analysis,
 * and architecture documentation.
 *
 * @module wizard/templates/ArchitectureAnalysisTemplate
 * @version 1.0.0
 */

import { InvestigationType, SuccessCriterion } from '../../shared/types';

import { InvestigationTemplate, TaskTemplate } from './InvestigationTemplate';

export class ArchitectureAnalysisTemplate extends InvestigationTemplate {
  readonly id = 'architecture-review';
  readonly name = 'Architecture Analysis';
  readonly description =
    'Comprehensive architecture review including structure assessment, design patterns, dependency analysis, and documentation';
  readonly type: InvestigationType = 'architecture-review';

  readonly focusAreas = [
    'Project Structure & Organization',
    'Design Patterns & Principles',
    'Dependency Management',
    'Module Boundaries',
    'Code Organization',
    'Architectural Patterns',
    'Scalability & Maintainability',
    'Technical Debt Assessment',
  ];

  readonly defaultExclusions = [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
  ];

  readonly estimatedDuration = 5400000; // 1.5 hours

  readonly successCriteria: SuccessCriterion[] = [
    {
      id: 'sc-arch-1',
      description: 'Document current architecture and structure',
      type: 'functional',
      expected: 'Architecture diagram and documentation created',
      measurementMethod: 'Documentation review',
    },
    {
      id: 'sc-arch-2',
      description: 'Identify architectural patterns and anti-patterns',
      type: 'quality',
      expected: 'At least 5 patterns documented',
      measurementMethod: 'Pattern analysis',
    },
    {
      id: 'sc-arch-3',
      description: 'Assess technical debt and provide improvement roadmap',
      type: 'quality',
      expected: 'Technical debt assessment with prioritized improvements',
      measurementMethod: 'Debt analysis and recommendations',
    },
  ];

  protected taskTemplates: TaskTemplate[] = [
    {
      id: 'arch-init',
      description: 'Initialize architecture analysis and scan project structure',
      agentType: 'TAN',
      priority: 'critical',
      dependencies: [],
      estimatedDuration: 300000,
    },
    {
      id: 'arch-analyze-structure',
      description: 'Analyze project structure and folder organization',
      agentType: 'TAN',
      priority: 'high',
      dependencies: ['arch-init'],
      estimatedDuration: 600000,
    },
    {
      id: 'arch-map-dependencies',
      description: 'Map dependency graph and identify coupling issues',
      agentType: 'TAN',
      priority: 'high',
      dependencies: ['arch-init'],
      estimatedDuration: 900000,
    },
    {
      id: 'arch-identify-patterns',
      description: 'Identify design patterns and architectural patterns in use',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: ['arch-analyze-structure'],
      estimatedDuration: 900000,
    },
    {
      id: 'arch-detect-antipatterns',
      description: 'Detect architectural anti-patterns and code smells',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['arch-identify-patterns'],
      estimatedDuration: 600000,
    },
    {
      id: 'arch-analyze-modules',
      description: 'Analyze module boundaries and separation of concerns',
      agentType: 'TAN',
      priority: 'medium',
      dependencies: ['arch-map-dependencies'],
      estimatedDuration: 600000,
    },
    {
      id: 'arch-assess-scalability',
      description: 'Assess scalability and maintainability of architecture',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['arch-analyze-modules', 'arch-identify-patterns'],
      estimatedDuration: 600000,
    },
    {
      id: 'arch-assess-technical-debt',
      description: 'Assess technical debt and calculate debt ratio',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['arch-detect-antipatterns'],
      estimatedDuration: 600000,
    },
    {
      id: 'arch-create-diagram',
      description: 'Create architecture diagram and documentation',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: [
        'arch-analyze-structure',
        'arch-map-dependencies',
        'arch-identify-patterns',
      ],
      estimatedDuration: 900000,
    },
    {
      id: 'arch-generate-recommendations',
      description: 'Generate improvement recommendations and refactoring roadmap',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: [
        'arch-detect-antipatterns',
        'arch-assess-scalability',
        'arch-assess-technical-debt',
      ],
      estimatedDuration: 600000,
    },
    {
      id: 'arch-final-report',
      description: 'Create comprehensive architecture analysis report',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: ['arch-create-diagram', 'arch-generate-recommendations'],
      estimatedDuration: 300000,
    },
  ];
}
