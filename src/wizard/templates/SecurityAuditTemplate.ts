/**
 * Security Audit Investigation Template
 *
 * Pre-configured template for comprehensive security audits including
 * vulnerability scanning, authentication/authorization review, input validation,
 * and security best practices validation.
 *
 * @module wizard/templates/SecurityAuditTemplate
 * @version 1.0.0
 */

import { InvestigationType, SuccessCriterion } from '@shared/types';

import { InvestigationTemplate, TaskTemplate } from './InvestigationTemplate';

/**
 * Security Audit investigation template
 */
export class SecurityAuditTemplate extends InvestigationTemplate {
  readonly id = 'security-audit';
  readonly name = 'Security Audit';
  readonly description =
    'Comprehensive security audit including vulnerability scanning, authentication/authorization review, input validation, and security best practices';
  readonly type: InvestigationType = 'security-audit';

  readonly focusAreas = [
    'Authentication & Authorization',
    'Input Validation & Sanitization',
    'Data Protection & Encryption',
    'Session Management',
    'Error Handling & Logging',
    'Dependency Vulnerabilities',
    'Security Headers & CORS',
    'SQL Injection & XSS Prevention',
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

  readonly estimatedDuration = 7200000; // 2 hours

  readonly successCriteria: SuccessCriterion[] = [
    {
      id: 'sc-security-1',
      description:
        'Identify all critical and high-severity security vulnerabilities',
      type: 'functional',
      expected: 'All critical/high issues documented',
      measurementMethod: 'Manual review of findings',
    },
    {
      id: 'sc-security-2',
      description: 'Verify authentication and authorization implementation',
      type: 'functional',
      expected: 'Secure authentication patterns identified',
      measurementMethod: 'Code review and pattern matching',
    },
    {
      id: 'sc-security-3',
      description: 'Check for common vulnerabilities (OWASP Top 10)',
      type: 'functional',
      expected: 'No OWASP Top 10 vulnerabilities',
      measurementMethod: 'Automated scanning + manual review',
    },
  ];

  protected taskTemplates: TaskTemplate[] = [
    // Phase 1: Initial Assessment
    {
      id: 'security-scan-init',
      description: 'Initialize security audit and scan project structure',
      agentType: 'TAN',
      priority: 'critical',
      dependencies: [],
      estimatedDuration: 300000, // 5 min
      timeout: 600000,
      canRetry: true,
      maxRetries: 3,
    },

    // Phase 2: Dependency Analysis
    {
      id: 'security-scan-dependencies',
      description:
        'Scan dependencies for known vulnerabilities using npm audit/safety',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['security-scan-init'],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 3: Authentication & Authorization (Parallel)
    {
      id: 'security-review-auth',
      description:
        'Review authentication implementation (JWT, sessions, OAuth)',
      agentType: 'JUNO',
      priority: 'critical',
      dependencies: ['security-scan-init'],
      estimatedDuration: 900000, // 15 min
      timeout: 1200000,
      canRetry: true,
      maxRetries: 2,
    },
    {
      id: 'security-review-authz',
      description:
        'Review authorization patterns and access control mechanisms',
      agentType: 'JUNO',
      priority: 'critical',
      dependencies: ['security-scan-init'],
      estimatedDuration: 900000, // 15 min
      timeout: 1200000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 4: Input Validation & Sanitization
    {
      id: 'security-check-input-validation',
      description:
        'Check input validation and sanitization across all endpoints',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['security-scan-init'],
      estimatedDuration: 900000, // 15 min
      timeout: 1200000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 5: Vulnerability Detection (Parallel)
    {
      id: 'security-detect-sql-injection',
      description: 'Detect potential SQL injection vulnerabilities',
      agentType: 'JUNO',
      priority: 'critical',
      dependencies: ['security-check-input-validation'],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },
    {
      id: 'security-detect-xss',
      description: 'Detect potential XSS vulnerabilities',
      agentType: 'JUNO',
      priority: 'critical',
      dependencies: ['security-check-input-validation'],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },
    {
      id: 'security-detect-csrf',
      description: 'Check CSRF protection mechanisms',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['security-check-input-validation'],
      estimatedDuration: 300000, // 5 min
      timeout: 600000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 6: Data Protection
    {
      id: 'security-review-data-protection',
      description:
        'Review data encryption, hashing, and sensitive data handling',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['security-review-auth'],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 7: Session & Cookies
    {
      id: 'security-review-session-management',
      description: 'Review session management and cookie security',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['security-review-auth'],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 8: Security Headers & CORS
    {
      id: 'security-check-headers',
      description:
        'Check security headers (CSP, HSTS, X-Frame-Options, etc.)',
      agentType: 'JUNO',
      priority: 'medium',
      dependencies: ['security-scan-init'],
      estimatedDuration: 300000, // 5 min
      timeout: 600000,
      canRetry: true,
      maxRetries: 2,
    },
    {
      id: 'security-check-cors',
      description: 'Review CORS configuration and potential issues',
      agentType: 'JUNO',
      priority: 'medium',
      dependencies: ['security-scan-init'],
      estimatedDuration: 300000, // 5 min
      timeout: 600000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 9: Error Handling & Logging
    {
      id: 'security-review-error-handling',
      description:
        'Review error handling for information disclosure risks',
      agentType: 'JUNO',
      priority: 'medium',
      dependencies: ['security-scan-init'],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 10: Secret Management
    {
      id: 'security-scan-secrets',
      description: 'Scan for hardcoded secrets, API keys, and credentials',
      agentType: 'JUNO',
      priority: 'critical',
      dependencies: ['security-scan-init'],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 11: Comprehensive Report
    {
      id: 'security-generate-report',
      description:
        'Generate comprehensive security audit report with findings and recommendations',
      agentType: 'ZEN',
      priority: 'high',
      dependencies: [
        'security-scan-dependencies',
        'security-review-auth',
        'security-review-authz',
        'security-detect-sql-injection',
        'security-detect-xss',
        'security-detect-csrf',
        'security-review-data-protection',
        'security-review-session-management',
        'security-check-headers',
        'security-check-cors',
        'security-review-error-handling',
        'security-scan-secrets',
      ],
      estimatedDuration: 600000, // 10 min
      timeout: 900000,
      canRetry: true,
      maxRetries: 2,
    },

    // Phase 12: Final Validation
    {
      id: 'security-final-validation',
      description:
        'Validate all findings and ensure completeness of audit',
      agentType: 'JUNO',
      priority: 'high',
      dependencies: ['security-generate-report'],
      estimatedDuration: 300000, // 5 min
      timeout: 600000,
      canRetry: true,
      maxRetries: 1,
    },
  ];

  /**
   * Customize template for specific framework
   * @param framework - Framework name
   */
  protected customizeForFramework(framework: string): void {
    // Add framework-specific security tasks
    if (framework === 'Next.js') {
      this.addTask({
        id: 'security-nextjs-api-routes',
        description: 'Review Next.js API routes security',
        agentType: 'JUNO',
        priority: 'high',
        dependencies: ['security-scan-init'],
        estimatedDuration: 600000,
        timeout: 900000,
        canRetry: true,
        maxRetries: 2,
      });

      this.addTask({
        id: 'security-nextjs-middleware',
        description: 'Review Next.js middleware security',
        agentType: 'JUNO',
        priority: 'high',
        dependencies: ['security-scan-init'],
        estimatedDuration: 300000,
        timeout: 600000,
        canRetry: true,
        maxRetries: 2,
      });
    } else if (framework === 'Express') {
      this.addTask({
        id: 'security-express-middleware',
        description: 'Review Express middleware security',
        agentType: 'JUNO',
        priority: 'high',
        dependencies: ['security-scan-init'],
        estimatedDuration: 600000,
        timeout: 900000,
        canRetry: true,
        maxRetries: 2,
      });
    }
  }
}
