# Trinity Method SDK Customization Guide

## Overview

Trinity Method SDK is designed for maximum adaptability across different frameworks, team structures, project types, and industry requirements. This guide explains how to customize Trinity Method implementation for specific needs and contexts while maintaining investigation-first principles.

## What Can Be Customized

- **Investigation templates** - Add framework/domain-specific debugging steps
- **Work order templates** - Modify structure for team workflow
- **Slash commands** - Create custom commands in `.claude/commands/`
- **Agents** - Customize agent prompts in `.claude/agents/`
- **Hooks** - Customize session management in `trinity-hooks/`
- **Linting** - Configure ESLint, Prettier, and pre-commit hooks

## FRAMEWORK-SPECIFIC CUSTOMIZATIONS

### React/Next.js Customization

#### Component-Specific Patterns
```markdown
# React Component Investigation Template Customization

## React-Specific Debug Points
1. **Component Re-render Analysis**
   - Use React DevTools Profiler
   - Check unnecessary re-renders with why-did-you-render
   - Analyze hook dependencies and useCallback/useMemo usage

2. **State Management Debug Flow**
   - Redux DevTools for Redux applications
   - Zustand DevTools for Zustand stores
   - Context Provider debug with React DevTools

3. **Next.js Specific Issues**
   - SSR hydration mismatches
   - API route debugging
   - Static generation issues
   - Image optimization problems
```

#### Performance Baselines Customization
```markdown
# React/Next.js Performance Targets

## Framework-Specific Metrics
- **Component Render Time**: < 16ms (60fps)
- **Hook Execution Time**: < 1ms
- **Context Provider Updates**: < 5ms
- **Next.js Page Transitions**: < 200ms
- **API Route Response**: < 100ms

## React DevTools Integration
- Enable Profiler for production builds
- Track component render reasons
- Monitor Suspense boundaries
- Analyze bundle sizes with Next.js analyzer
```

#### Crisis Recovery Customization
```markdown
# React/Next.js Emergency Procedures

## React-Specific Crisis Scenarios
1. **Infinite Re-render Loop**
   ```bash
   # Immediate actions
   1. Check React DevTools for component causing loop
   2. Disable problematic useEffect temporarily
   3. Add dependency array debugging
   4. Implement circuit breaker pattern
   ```

2. **Next.js Build Failure**
   ```bash
   # Recovery steps
   1. Check for TypeScript errors: npx tsc --noEmit
   2. Verify API routes: npm run build
   3. Clear Next.js cache: rm -rf .next
   4. Check environment variables
   ```
```

### Vue/Nuxt Customization

#### Vue-Specific Patterns
```markdown
# Vue Component Investigation Template

## Vue-Specific Debug Points
1. **Composition API Analysis**
   - Reactive reference tracking
   - Computed property dependencies
   - Watch effect optimization
   - Lifecycle hook execution order

2. **Nuxt.js Specific Issues**
   - Server-side rendering context
   - Nuxt module conflicts
   - Auto-import resolution
   - Hydration state management
```

### Angular Customization

#### Angular-Specific Patterns
```markdown
# Angular Component Investigation Template

## Angular-Specific Debug Points
1. **Component Lifecycle Analysis**
   - Change detection cycles
   - OnPush strategy optimization
   - NgZone integration issues
   - Dependency injection problems

2. **NgRx State Management**
   - Action dispatch debugging
   - Reducer state transitions
   - Effect error handling
   - Selector performance
```

### Python/FastAPI Customization

#### API-Specific Patterns
```markdown
# Python/FastAPI Investigation Template

## FastAPI-Specific Debug Points
1. **Async Performance Analysis**
   - Event loop utilization
   - Database connection pooling
   - Async/await optimization
   - Concurrent request handling

2. **SQLAlchemy Debugging**
   - Query performance analysis
   - Relationship loading strategies
   - Transaction management
   - Connection pool monitoring
```

## TEAM-SPECIFIC CUSTOMIZATIONS

### Small Team (2-5 developers)

#### Simplified Processes
```markdown
# Small Team Trinity Method Adaptation

## Streamlined Investigation Process
1. **Direct Communication Protocols**
   - Immediate verbal escalation for critical issues
   - Shared screen debugging sessions
   - Real-time knowledge sharing

2. **Simplified Crisis Management**
   - Single point of contact for emergencies
   - Simplified escalation matrix
   - Cross-training for all critical systems

## Modified Templates
- Reduced documentation overhead
- Focus on essential debugging steps
- Simplified quality gates
- Direct feedback loops
```

### Large Team (20+ developers)

#### Enterprise Processes
```markdown
# Large Team Trinity Method Adaptation

## Structured Investigation Process
1. **Formal Escalation Procedures**
   - Multiple escalation tiers
   - Documented handoff procedures
   - Cross-team communication protocols
   - Incident commander assignment

2. **Knowledge Management**
   - Centralized knowledge base
   - Regular knowledge sharing sessions
   - Expert identification and consultation
   - Cross-team pattern sharing

## Enhanced Templates
- Detailed documentation requirements
- Multi-level approval processes
- Comprehensive audit trails
- Formal review procedures
```

### Distributed Team Customization

#### Remote-First Adaptations
```markdown
# Distributed Team Trinity Method Adaptation

## Asynchronous Investigation Process
1. **Documentation-Heavy Approach**
   - Detailed written investigations
   - Comprehensive session documentation
   - Time-zone aware escalation procedures
   - Asynchronous knowledge sharing

2. **Communication Protocols**
   - Video recording for complex debugging
   - Shared investigation workspaces
   - Timezone overlap coordination
   - Async code review processes

## Modified Crisis Procedures
- 24/7 coverage rotation
- Regional emergency contacts
- Remote debugging tooling
- Distributed incident response
```

## PROJECT TYPE CUSTOMIZATIONS

### E-commerce Applications

#### Domain-Specific Adaptations
```markdown
# E-commerce Trinity Method Customization

## E-commerce Specific Investigation Templates
1. **Payment Processing Issues**
   - Payment gateway integration debugging
   - Transaction state verification
   - PCI compliance validation
   - Fraud detection analysis

2. **Performance Critical Areas**
   - Product catalog loading performance
   - Search functionality optimization
   - Cart and checkout flow analysis
   - Inventory synchronization debugging

## Compliance Requirements
- PCI DSS compliance monitoring
- GDPR data handling procedures
- Financial audit trail maintenance
- Security incident reporting
```

### Healthcare Applications

#### Regulatory Adaptations
```markdown
# Healthcare Trinity Method Customization

## HIPAA Compliance Integration
1. **Data Protection Procedures**
   - PHI handling investigation protocols
   - Audit trail maintenance
   - Access control verification
   - Encryption validation procedures

2. **Security-First Crisis Management**
   - Breach notification procedures
   - Regulatory reporting requirements
   - Patient data protection protocols
   - Compliance team involvement

## Specialized Performance Metrics
- Real-time monitoring system uptime
- Clinical decision support response times
- Patient data retrieval performance
- Integration with medical device APIs
```

### Financial Services

#### Financial Compliance
```markdown
# Financial Services Trinity Method Customization

## Regulatory Compliance
1. **SOX Compliance Integration**
   - Financial data integrity verification
   - Change management procedures
   - Audit trail requirements
   - Segregation of duties validation

2. **High Availability Requirements**
   - Zero-downtime deployment procedures
   - Real-time failover testing
   - Business continuity planning
   - Disaster recovery validation

## Risk Management Integration
- Operational risk assessment
- Technology risk monitoring
- Cybersecurity threat analysis
- Vendor risk management
```

### SaaS/Multi-Tenant Applications

#### Multi-Tenancy Adaptations
```markdown
# SaaS Multi-Tenant Trinity Method Customization

## Tenant-Specific Investigation
1. **Tenant Isolation Debugging**
   - Data isolation verification
   - Resource allocation analysis
   - Performance per tenant monitoring
   - Security boundary validation

2. **Scalability Investigation**
   - Tenant onboarding performance
   - Resource scaling procedures
   - Database partitioning analysis
   - Cache invalidation strategies

## SaaS Metrics Integration
- Tenant-specific performance baselines
- Churn risk indicators
- Feature usage analytics
- Subscription health monitoring
```

## INDUSTRY-SPECIFIC CUSTOMIZATIONS

### FinTech Customization

#### Regulatory Framework Integration
```markdown
# FinTech Trinity Method Customization

## Financial Regulation Compliance
1. **SOX/SOC 2 Integration**
   - Control effectiveness testing
   - Risk assessment procedures
   - Vendor management protocols
   - Data governance frameworks

2. **Financial Crime Prevention**
   - Anti-money laundering (AML) monitoring
   - Know Your Customer (KYC) validation
   - Fraud detection system integration
   - Suspicious activity reporting

## High-Frequency Performance Requirements
- Sub-millisecond latency targets
- Real-time risk calculation
- Market data processing optimization
- Transaction throughput maximization
```

### HealthTech Customization

#### Medical Device Integration
```markdown
# HealthTech Trinity Method Customization

## Medical Device Compliance
1. **FDA Validation Requirements**
   - Software as Medical Device (SaMD) procedures
   - Clinical validation protocols
   - Risk management procedures (ISO 14971)
   - Quality management system integration

2. **Interoperability Standards**
   - HL7 FHIR implementation
   - DICOM integration testing
   - Medical device API validation
   - Clinical workflow optimization

## Patient Safety Integration
- Clinical decision support validation
- Patient data accuracy verification
- Medical alert system testing
- Emergency response procedures
```

### EdTech Customization

#### Educational Compliance
```markdown
# EdTech Trinity Method Customization

## Student Data Protection
1. **FERPA Compliance**
   - Student record protection procedures
   - Parental consent management
   - Data retention policies
   - Third-party data sharing protocols

2. **Accessibility Requirements**
   - WCAG 2.1 AAA compliance for educational content
   - Screen reader optimization
   - Keyboard navigation requirements
   - Multiple language support

## Learning Analytics Integration
- Student performance monitoring
- Learning outcome measurement
- Engagement analytics
- Personalization algorithm validation
```

## TECHNOLOGY INTEGRATION CUSTOMIZATIONS

### CI/CD Pipeline Integration

#### DevOps Workflow Customization
```markdown
# CI/CD Trinity Method Integration

## Automated Quality Gates
1. **Pipeline Integration Points**
   ```yaml
   # Trinity Method Quality Gates
   trinity-method-validation:
     runs-on: ubuntu-latest
     steps:
       - name: Run Trinity Investigation Templates
         run: |
           # Automated debugging template execution
           ./trinity-debug-automation.sh
           
       - name: Performance Baseline Validation
         run: |
           # Performance regression testing
           ./trinity-performance-check.sh
           
       - name: Crisis Procedure Validation
         run: |
           # Emergency procedure testing
           ./trinity-crisis-simulation.sh
   ```

2. **Deployment Integration**
   - Pre-deployment Trinity Method validation
   - Post-deployment performance verification
   - Automated rollback trigger points
   - Performance baseline updates
```

### Monitoring and Observability

#### APM Integration
```markdown
# APM Trinity Method Integration

## Observability-Driven Debugging
1. **Distributed Tracing Integration**
   - Trinity Method trace annotation
   - Performance bottleneck identification
   - Cross-service debugging procedures
   - Error correlation analysis

2. **Metrics-Driven Investigation**
   - SLA violation investigation procedures
   - Performance degradation analysis
   - Resource utilization investigation
   - User experience impact assessment

## Custom Metrics Integration
- Trinity Method methodology adoption metrics
- Investigation template effectiveness
- Crisis response time measurement
- Knowledge retention tracking
```

### Security Tool Integration

#### Security-First Customization
```markdown
# Security-Integrated Trinity Method

## Security Scanning Integration
1. **SAST/DAST Integration**
   - Security vulnerability investigation procedures
   - Penetration testing result analysis
   - Compliance violation resolution
   - Security incident response integration

2. **Threat Intelligence Integration**
   - Zero-day vulnerability response procedures
   - Security advisory investigation
   - Threat landscape adaptation
   - Security baseline updates

## Security Metrics Integration
- Security posture measurement
- Vulnerability remediation tracking
- Security training effectiveness
- Incident response time analysis
```

## Customization Implementation Process

### Step 1: Assess Your Needs

```bash
# Review current project structure
ls -la

# Check existing Trinity deployment
trinity status

# Identify customization areas:
# - Framework requirements (React, Vue, Python, etc.)
# - Team size/structure (small/medium/large)
# - Industry compliance (HIPAA, PCI-DSS, SOX, etc.)
# - Integration needs (CI/CD, monitoring, etc.)
```

### Step 2: Create Custom Templates

```bash
# Copy base template to customize
cp trinity/templates/INVESTIGATION-TEMPLATE.md \
   trinity/templates/CUSTOM-INVESTIGATION-TEMPLATE.md

# Edit with your additions:
# - Framework-specific debugging steps
# - Compliance checkpoints
# - Team-specific sections
# - Performance baselines
```

**Example: React-Specific Investigation Template**

Create `trinity/templates/REACT-INVESTIGATION-TEMPLATE.md`:

```markdown
# React Investigation Template

## Component Analysis
- [ ] Identified component causing issue
- [ ] Analyzed component lifecycle
- [ ] Checked for unnecessary re-renders (React DevTools)
- [ ] Verified hook dependencies
- [ ] Reviewed prop drilling vs context usage

## Performance Investigation
- [ ] Used React DevTools Profiler
- [ ] Checked bundle size
- [ ] Analyzed hydration performance (Next.js)
- [ ] Verified Server vs Client Components
- [ ] Checked for waterfall requests

## State Management
- [ ] Identified state location (local/global)
- [ ] Verified state update patterns
- [ ] Checked for stale closure issues
- [ ] Analyzed context re-render impact
- [ ] Reviewed selectors (Zustand/Redux)
```

### Step 3: Update Context Files

Add customizations to `src/CLAUDE.md`:

```markdown
## Custom Trinity Patterns

### React/Next.js Debugging Pattern
All React components must include Trinity debugging:

\`\`\`typescript
'use client';

import { useEffect, useRef } from 'react';

export default function MyComponent() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log('[TRINITY COMPONENT]', {
      component: 'MyComponent',
      renderCount: renderCount.current
    });

    if (renderCount.current > 10) {
      console.warn('[TRINITY PERFORMANCE]', {
        warning: 'Excessive re-renders',
        count: renderCount.current
      });
    }
  });

  return <div>Component content</div>;
}
\`\`\`

### Node.js Express Middleware
\`\`\`javascript
const trinityMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const requestId = Date.now().toString();

  console.log('[TRINITY REQUEST]', {
    requestId,
    method: req.method,
    path: req.path
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log('[TRINITY RESPONSE]', {
      requestId,
      status: res.statusCode,
      duration: \`\${duration}ms\`
    });
  });

  next();
};

app.use(trinityMiddleware);
\`\`\`
```

### Step 4: Create Custom Slash Commands

Create `.claude/commands/custom-investigate.md`:

```markdown
---
description: Run custom investigation with my template
---

Start investigation using custom template:

1. Copy custom template: \`cp trinity/templates/REACT-INVESTIGATION-TEMPLATE.md trinity/investigations/YYYY-MM-DD-topic.md\`
2. Fill in investigation points
3. Document findings
4. Update work order with results
```

### Step 5: Customize CI/CD Integration

Create `.github/workflows/trinity-validation.yml`:

```yaml
name: Trinity Validation

on:
  pull_request:
    branches: [main, dev]

jobs:
  trinity-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Check Work Order
        run: |
          PR_BODY="\${{ github.event.pull_request.body }}"
          if ! echo "$PR_BODY" | grep -q "WO-[0-9]\\+"; then
            echo "Error: PR must reference work order (WO-XXX)"
            exit 1
          fi

      - name: Verify Trinity Debugging
        run: |
          if git diff origin/main...HEAD | grep -q "console.log.*TRINITY"; then
            echo "✓ Trinity debugging patterns found"
          else
            echo "Warning: No Trinity debugging detected"
          fi
```

### Step 6: Test and Iterate

```bash
# Try your customizations
/trinity-start

# Create work order with custom template
/trinity-workorder

# Gather team feedback
# Refine based on usage
# Update documentation in trinity/knowledge-base/
```

## Best Practices for Customization

### ✅ DO:

- **Preserve core principles** - Keep investigation-first approach
- **Document customizations** - Add to `trinity/knowledge-base/Trinity.md`
- **Test with team** - Pilot customizations before full rollout
- **Version control** - Commit customizations to git
- **Share patterns** - Add successful customizations to `trinity/patterns/`

### ❌ DON'T:

- **Skip investigation** - Never remove investigation requirements
- **Over-complicate** - Keep templates simple and actionable
- **Ignore SDK updates** - Check for updates: `npm update -g @trinity-method/cli`
- **Modify SDK templates directly** - Copy and customize instead
- **Remove debugging** - Keep Trinity debugging patterns

## Team-Specific Adaptations

### Small Teams (2-5 developers)

**Streamlined Work Orders:**

```markdown
# Work Order: WO-XXX - [Task]

## Objective
[1-2 sentence description]

## Quick Investigation
- Current state: [Brief]
- Approach: [What you'll do]
- Risks: [Key edge cases]

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Done When
- [ ] Feature works
- [ ] Tests pass
- [ ] Reviewed by teammate
```

### Large Teams (15+ developers)

**Enterprise Work Orders:**

```markdown
# Work Order: WO-XXX - [Task]

## Metadata
- **Created by:** [Name]
- **Epic:** [EPIC-XXX]
- **Sprint:** [Number]

## Investigation
- **Lead:** [Name]
- **Document:** trinity/investigations/YYYY-MM-DD-topic.md
- **Reviews:** Architecture [ ] Security [ ]

## Acceptance Criteria
- [ ] Functional tests pass
- [ ] Unit tests >80% coverage
- [ ] Performance within SLA
- [ ] Security scan passed
- [ ] Documentation complete

## Approvals
- [ ] Tech Lead: [Name]
- [ ] Security: [Name]
- [ ] QA Lead: [Name]
```

## Industry-Specific Customizations

### Healthcare (HIPAA)

Add to all investigation templates:

```markdown
## HIPAA Compliance Checklist
- [ ] PHI identified and encrypted
- [ ] Access controls verified
- [ ] Audit logging enabled
- [ ] BAA with vendors confirmed
- [ ] Privacy officer notified
```

### FinTech (Financial Services)

Add to all investigation templates:

```markdown
## Financial Compliance Checklist
- [ ] Data accuracy verified (2 decimals)
- [ ] Transaction integrity confirmed
- [ ] Audit trail complete
- [ ] SOX controls tested
- [ ] Regulatory reporting ready
```

### E-commerce

Add to performance baselines:

```markdown
## E-commerce Performance Targets
- Product listing: < 1s load time
- Search results: < 500ms
- Checkout steps: < 2s each
- Cart operations: < 200ms
- Payment processing: < 3s
```

## Monitoring Integration

### DataDog Trinity Logging

Add to `trinity/patterns/monitoring.md`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {
    service: 'trinity-service',
    session: process.env.TRINITY_SESSION_ID
  }
});

function trinityLog(category, action, metadata) {
  logger.info({
    trinity_category: category,
    trinity_action: action,
    ...metadata
  });
}

// Usage
trinityLog('REQUEST', 'API_CALL', {
  method: 'POST',
  path: '/api/users',
  duration: 123
});
```

## Getting Help

### Documentation
- Review `examples/` directory for framework patterns
- Check `docs/` for detailed guides
- Read `trinity/knowledge-base/Trinity.md` in your project

### CLI Commands
```bash
trinity status        # Check deployment status
trinity deploy --help # See deployment options
```

### In Claude Code
```bash
/trinity-docs         # Access Trinity documentation
/trinity-agents       # View agent capabilities
/trinity-verify       # Verify deployment
```

### Community
- GitHub Issues: [Trinity Method SDK](https://github.com/lukadfagundes/trinity-method-sdk/issues)
- Share your customizations with the community

## See Also

- [Getting Started](getting-started.md) - Initial setup and deployment
- [Implementation Guide](implementation-guide.md) - Methodology details
- [Work Orders Guide](guides/work-orders.md) - Work order system
- [Slash Commands](guides/slash-commands.md) - Command reference
- [CLI Commands](api/cli-commands.md) - CLI reference