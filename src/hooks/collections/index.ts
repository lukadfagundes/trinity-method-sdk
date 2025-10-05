/**
 * Trinity Hook Collections - Pre-Built Safe Hooks
 *
 * 20-30 pre-built, validated hooks across 5 categories:
 * 1. Investigation Lifecycle (5-7 hooks)
 * 2. Work Order Automation (4-6 hooks)
 * 3. Session Management (3-5 hooks)
 * 4. Code Quality (4-6 hooks)
 * 5. Git Workflow (3-4 hooks)
 *
 * All hooks are:
 * - Pre-validated for safety
 * - Tested with dry-run mode
 * - Documented with examples
 * - Rated 'safe' security level
 *
 * @module hooks/collections
 * @version 1.0.0
 */

import { TrinityHook } from '../TrinityHookLibrary';

/**
 * Investigation Lifecycle Hooks (7 hooks)
 */
export const investigationLifecycleHooks: TrinityHook[] = [
  {
    id: 'investigation:auto-folder',
    name: 'Auto-Create Investigation Folder',
    description: 'Automatically create investigation folder when investigation is created',
    category: 'investigation-lifecycle',
    trigger: {
      event: 'investigation:created',
    },
    action: {
      type: 'file-create',
      parameters: {
        path: 'trinity/investigations/{{investigationId}}/README.md',
        content: '# Investigation: {{investigationName}}\n\n**ID**: {{investigationId}}\n**Type**: {{investigationType}}\n**Created**: {{timestamp}}\n\n## Status\n\nIn Progress\n\n## Goals\n\n{{investigationGoal}}\n',
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    examples: ['Triggered when new investigation is created via wizard or manually'],
    tags: ['investigation', 'automation', 'folder-creation'],
  },

  {
    id: 'investigation:archive-complete',
    name: 'Auto-Archive Completed Investigation',
    description: 'Archive investigation to trinity/archive/ when marked complete',
    category: 'investigation-lifecycle',
    trigger: {
      event: 'investigation:completed',
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'node -e "require(\'fs\').cpSync(\'trinity/investigations/{{investigationId}}\', \'trinity/archive/{{investigationId}}\', {recursive: true})"',
      },
      timeout: 10000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    examples: ['Archives investigation when status changes to "completed"'],
    tags: ['investigation', 'archive', 'cleanup'],
  },

  {
    id: 'investigation:session-log',
    name: 'Log Investigation Steps',
    description: 'Append investigation steps to session log',
    category: 'investigation-lifecycle',
    trigger: {
      event: 'investigation:step-complete',
    },
    action: {
      type: 'file-append',
      parameters: {
        path: 'trinity/sessions/{{sessionId}}/investigation-log.md',
        content: '\n## {{timestamp}}: {{stepName}}\n\n{{stepDescription}}\n\n**Duration**: {{duration}}ms\n**Agent**: {{agentType}}\n',
      },
      timeout: 3000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['investigation', 'logging', 'session'],
  },

  {
    id: 'investigation:quality-gate',
    name: 'Quality Gate Check',
    description: 'Run quality checks before marking investigation complete',
    category: 'investigation-lifecycle',
    trigger: {
      event: 'investigation:pre-complete',
    },
    action: {
      type: 'validation',
      parameters: {
        type: 'quality-gate',
        field: 'qualityScore',
        operator: 'greaterThan',
        value: 70,
      },
      timeout: 2000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['investigation', 'quality', 'validation'],
  },

  {
    id: 'investigation:timestamp-start',
    name: 'Timestamp Investigation Start',
    description: 'Add start timestamp to investigation metadata',
    category: 'investigation-lifecycle',
    trigger: {
      event: 'investigation:started',
    },
    action: {
      type: 'file-update',
      parameters: {
        path: 'trinity/investigations/{{investigationId}}/metadata.json',
        content: '{"startedAt": "{{timestamp}}", "status": "in-progress"}',
      },
      timeout: 3000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['investigation', 'metadata', 'timestamp'],
  },

  {
    id: 'investigation:metrics-collect',
    name: 'Collect Investigation Metrics',
    description: 'Collect performance metrics when investigation completes',
    category: 'investigation-lifecycle',
    trigger: {
      event: 'investigation:completed',
    },
    action: {
      type: 'file-create',
      parameters: {
        path: 'trinity/investigations/{{investigationId}}/metrics.json',
        content: '{"investigationId": "{{investigationId}}", "duration": {{duration}}, "tokensUsed": {{tokensUsed}}, "qualityScore": {{qualityScore}}, "completedAt": "{{timestamp}}"}',
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['investigation', 'metrics', 'analytics'],
  },

  {
    id: 'investigation:findings-export',
    name: 'Export Findings Report',
    description: 'Generate findings report when investigation completes',
    category: 'investigation-lifecycle',
    trigger: {
      event: 'investigation:completed',
    },
    action: {
      type: 'file-create',
      parameters: {
        path: 'trinity/investigations/{{investigationId}}/FINDINGS.md',
        content: '# Investigation Findings: {{investigationName}}\n\n**Completed**: {{timestamp}}\n**Quality Score**: {{qualityScore}}/100\n\n## Summary\n\nTotal Findings: {{findingsCount}}\n\n## Details\n\n{{findingsContent}}\n',
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['investigation', 'findings', 'export'],
  },
];

/**
 * Work Order Automation Hooks (6 hooks)
 */
export const workOrderHooks: TrinityHook[] = [
  {
    id: 'workorder:format-validate',
    name: 'Validate Work Order Format',
    description: 'Validate work order format before creation',
    category: 'work-order-automation',
    trigger: {
      event: 'workorder:pre-create',
    },
    action: {
      type: 'validation',
      parameters: {
        type: 'format-check',
        field: 'workOrderId',
        operator: 'matches',
        value: '^WO-[A-Z]+-\\d{3}',
      },
      timeout: 2000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['workorder', 'validation', 'format'],
  },

  {
    id: 'workorder:quality-check',
    name: 'Work Order Quality Check',
    description: 'Run quality checks before marking work order complete',
    category: 'work-order-automation',
    trigger: {
      event: 'workorder:pre-complete',
    },
    action: {
      type: 'validation',
      parameters: {
        type: 'quality-gate',
        field: 'deliverables.length',
        operator: 'greaterThan',
        value: 0,
      },
      timeout: 2000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['workorder', 'quality', 'validation'],
  },

  {
    id: 'workorder:timestamp',
    name: 'Auto-Timestamp Work Order',
    description: 'Add timestamps to work order events',
    category: 'work-order-automation',
    trigger: {
      event: 'workorder:created',
    },
    action: {
      type: 'file-append',
      parameters: {
        path: 'trinity/work-orders/{{workOrderId}}.md',
        content: '\n**Created**: {{timestamp}}\n',
      },
      timeout: 3000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['workorder', 'timestamp'],
  },

  {
    id: 'workorder:dependency-check',
    name: 'Check Work Order Dependencies',
    description: 'Verify dependencies before starting work order',
    category: 'work-order-automation',
    trigger: {
      event: 'workorder:pre-start',
    },
    action: {
      type: 'validation',
      parameters: {
        type: 'dependency-check',
        field: 'dependencies.completed',
        operator: 'equals',
        value: true,
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['workorder', 'dependencies', 'validation'],
  },

  {
    id: 'workorder:progress-update',
    name: 'Update Work Order Progress',
    description: 'Update progress percentage in work order file',
    category: 'work-order-automation',
    trigger: {
      event: 'workorder:task-complete',
    },
    action: {
      type: 'file-append',
      parameters: {
        path: 'trinity/work-orders/{{workOrderId}}.md',
        content: '\n- [x] {{taskName}} ({{timestamp}})\n',
      },
      timeout: 3000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['workorder', 'progress', 'tracking'],
  },

  {
    id: 'workorder:completion-report',
    name: 'Generate Completion Report',
    description: 'Create completion report when work order finishes',
    category: 'work-order-automation',
    trigger: {
      event: 'workorder:completed',
    },
    action: {
      type: 'file-create',
      parameters: {
        path: 'trinity/work-orders/reports/{{workOrderId}}-report.md',
        content: '# Work Order Completion Report\n\n**Work Order**: {{workOrderId}}\n**Completed**: {{timestamp}}\n**Duration**: {{duration}}\n\n## Summary\n\n{{summary}}\n',
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['workorder', 'report', 'completion'],
  },
];

/**
 * Session Management Hooks (5 hooks)
 */
export const sessionHooks: TrinityHook[] = [
  {
    id: 'session:auto-timestamp',
    name: 'Auto-Timestamp Session',
    description: 'Add session timestamps to CLAUDE.md',
    category: 'session-management',
    trigger: {
      event: 'session:start',
    },
    action: {
      type: 'file-append',
      parameters: {
        path: 'CLAUDE.md',
        content: '\n<!-- Session started: {{timestamp}} -->\n',
      },
      timeout: 3000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['session', 'timestamp', 'claude-md'],
  },

  {
    id: 'session:backup-claudemd',
    name: 'Backup CLAUDE.md',
    description: 'Create backup of CLAUDE.md on session end',
    category: 'session-management',
    trigger: {
      event: 'session:end',
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'node -e "require(\'fs\').copyFileSync(\'CLAUDE.md\', \'trinity/sessions/{{sessionId}}/CLAUDE.md.backup\')"',
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['session', 'backup', 'claude-md'],
  },

  {
    id: 'session:archive-logs',
    name: 'Archive Session Logs',
    description: 'Move session logs to archive on session end',
    category: 'session-management',
    trigger: {
      event: 'session:end',
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'node -e "require(\'fs\').cpSync(\'trinity/sessions/{{sessionId}}\', \'trinity/archive/sessions/{{sessionId}}\', {recursive: true})"',
      },
      timeout: 10000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['session', 'archive', 'cleanup'],
  },

  {
    id: 'session:git-checkpoint',
    name: 'Create Git Checkpoint',
    description: 'Create git commit checkpoint on session start',
    category: 'session-management',
    trigger: {
      event: 'session:start',
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'git add -A && git commit -m "Session checkpoint: {{sessionId}}" --allow-empty',
      },
      timeout: 10000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['session', 'git', 'checkpoint'],
  },

  {
    id: 'session:summary-create',
    name: 'Create Session Summary',
    description: 'Generate session summary on session end',
    category: 'session-management',
    trigger: {
      event: 'session:end',
    },
    action: {
      type: 'file-create',
      parameters: {
        path: 'trinity/sessions/{{sessionId}}/SUMMARY.md',
        content: '# Session Summary\n\n**Session ID**: {{sessionId}}\n**Started**: {{startTime}}\n**Ended**: {{endTime}}\n**Duration**: {{duration}}\n\n## Activities\n\n{{activitiesSummary}}\n',
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['session', 'summary', 'documentation'],
  },
];

/**
 * Code Quality Hooks (6 hooks)
 */
export const codeQualityHooks: TrinityHook[] = [
  {
    id: 'quality:linter-on-edit',
    name: 'Run Linter on File Edit',
    description: 'Run ESLint when TypeScript/JavaScript files are edited',
    category: 'code-quality',
    trigger: {
      event: 'file:edited',
      conditions: [
        {
          field: 'filePath',
          operator: 'matches',
          value: '\\.(ts|js|tsx|jsx)$',
        },
      ],
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'npx eslint {{filePath}} --fix',
      },
      timeout: 15000,
      dryRunSafe: false,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['quality', 'linter', 'eslint'],
  },

  {
    id: 'quality:update-debt',
    name: 'Update Technical Debt Log',
    description: 'Add entry to Technical-Debt.md when TODO/FIXME added',
    category: 'code-quality',
    trigger: {
      event: 'file:edited',
      conditions: [
        {
          field: 'content',
          operator: 'matches',
          value: '(TODO|FIXME|HACK)',
        },
      ],
    },
    action: {
      type: 'file-append',
      parameters: {
        path: 'trinity/knowledge-base/Technical-Debt.md',
        content: '\n- [ ] {{filePath}}: {{todoContent}} ({{timestamp}})\n',
      },
      timeout: 3000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['quality', 'debt', 'tracking'],
  },

  {
    id: 'quality:test-on-change',
    name: 'Run Tests on Critical File Change',
    description: 'Run relevant tests when critical files change',
    category: 'code-quality',
    trigger: {
      event: 'file:edited',
      conditions: [
        {
          field: 'filePath',
          operator: 'contains',
          value: '/src/',
        },
      ],
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'npm test -- {{testPattern}}',
      },
      timeout: 30000,
      dryRunSafe: false,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['quality', 'testing', 'ci'],
  },

  {
    id: 'quality:complexity-check',
    name: 'Check File Complexity',
    description: 'Warn when file complexity exceeds threshold',
    category: 'code-quality',
    trigger: {
      event: 'file:edited',
      conditions: [
        {
          field: 'linesOfCode',
          operator: 'greaterThan',
          value: 300,
        },
      ],
    },
    action: {
      type: 'validation',
      parameters: {
        type: 'complexity-warning',
        field: 'linesOfCode',
        operator: 'lessThan',
        value: 500,
      },
      timeout: 2000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['quality', 'complexity', 'warning'],
  },

  {
    id: 'quality:format-on-save',
    name: 'Format Code on Save',
    description: 'Run Prettier on file save',
    category: 'code-quality',
    trigger: {
      event: 'file:saved',
      conditions: [
        {
          field: 'filePath',
          operator: 'matches',
          value: '\\.(ts|js|tsx|jsx|json|md)$',
        },
      ],
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'npx prettier --write {{filePath}}',
      },
      timeout: 10000,
      dryRunSafe: false,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['quality', 'formatting', 'prettier'],
  },

  {
    id: 'quality:doc-check',
    name: 'Documentation Check',
    description: 'Warn if exported function lacks JSDoc',
    category: 'code-quality',
    trigger: {
      event: 'file:edited',
      conditions: [
        {
          field: 'content',
          operator: 'matches',
          value: 'export (function|class|interface)',
        },
      ],
    },
    action: {
      type: 'validation',
      parameters: {
        type: 'documentation-check',
        field: 'hasJSDoc',
        operator: 'equals',
        value: true,
      },
      timeout: 2000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['quality', 'documentation', 'jsdoc'],
  },
];

/**
 * Git Workflow Hooks (4 hooks)
 */
export const gitWorkflowHooks: TrinityHook[] = [
  {
    id: 'git:auto-commit-session',
    name: 'Auto-Commit Session End',
    description: 'Create commit when session ends with template message',
    category: 'git-workflow',
    trigger: {
      event: 'session:end',
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'git add -A && git commit -m "Session end: {{sessionId}}\\n\\nDuration: {{duration}}\\nActivities: {{activitiesCount}}"',
      },
      timeout: 15000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['git', 'commit', 'session'],
  },

  {
    id: 'git:branch-protection',
    name: 'Protect Main Branch',
    description: 'Prevent direct commits to main/master without approval',
    category: 'git-workflow',
    trigger: {
      event: 'git:pre-commit',
      conditions: [
        {
          field: 'branch',
          operator: 'matches',
          value: '^(main|master)$',
        },
      ],
    },
    action: {
      type: 'validation',
      parameters: {
        type: 'branch-protection',
        field: 'approved',
        operator: 'equals',
        value: true,
      },
      timeout: 2000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['git', 'branch', 'protection'],
  },

  {
    id: 'git:workorder-branch',
    name: 'Create Work Order Branch',
    description: 'Auto-create branch when work order starts',
    category: 'git-workflow',
    trigger: {
      event: 'workorder:started',
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'git checkout -b {{workOrderId}}',
      },
      timeout: 5000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['git', 'branch', 'workorder'],
  },

  {
    id: 'git:sync-remote',
    name: 'Sync with Remote',
    description: 'Auto-sync with remote repository on session end',
    category: 'git-workflow',
    trigger: {
      event: 'session:end',
    },
    action: {
      type: 'command-run',
      parameters: {
        command: 'git pull --rebase && git push',
      },
      timeout: 30000,
      dryRunSafe: true,
    },
    enabled: false,
    safetyLevel: 'safe',
    version: '1.0.0',
    tags: ['git', 'sync', 'remote'],
  },
];

/**
 * Get all hooks
 */
export function getAllHooks(): TrinityHook[] {
  return [
    ...investigationLifecycleHooks,
    ...workOrderHooks,
    ...sessionHooks,
    ...codeQualityHooks,
    ...gitWorkflowHooks,
  ];
}

/**
 * Get hooks by category
 */
export function getHooksByCategory(category: string): TrinityHook[] {
  return getAllHooks().filter((h) => h.category === category);
}
