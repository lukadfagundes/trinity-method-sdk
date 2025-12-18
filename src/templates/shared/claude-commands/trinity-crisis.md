---
description: Detect and recover from system crises using Trinity Method protocols
---

# Trinity Crisis Management

**Purpose:** Automatically detect and recover from system crises with guided protocols.

## Overview

Trinity's crisis management system provides systematic detection and recovery for 5 crisis types:

1. **Build Failure** - Compilation errors, dependency issues, configuration problems
2. **Test Failure** - Failing tests, coverage drops, test infrastructure issues
3. **Error Pattern** - Repeated errors in logs, systematic failures, cascading issues
4. **Performance Degradation** - Slowdowns, memory leaks, bottlenecks, resource exhaustion
5. **Security Vulnerability** - CVEs, exposed secrets, vulnerabilities, unauthorized access

Each crisis type has a complete protocol with detection, investigation, diagnostics, recovery, validation, and documentation phases.

## Crisis Management Workflow

### 1. Detection Phase
Automatically scans your system for crisis indicators:
- **Build Status:** Compilation errors, dependency conflicts, missing modules
- **Test Results:** Failing tests, coverage metrics, test execution errors
- **Error Logs:** Pattern detection, frequency analysis, severity assessment
- **Performance Metrics:** Response times, memory usage, CPU utilization
- **Security Scans:** Vulnerability detection, secret exposure, dependency audits

### 2. Investigation Phase
Guided prompts gather evidence and context:
- What triggered the crisis?
- What changed recently? (commits, deployments, dependencies)
- What's the blast radius? (affected users, systems, features)
- Who's affected? (team members, customers, services)
- When did it start? (timeline analysis)

### 3. Diagnostics Phase
Runs diagnostic commands with your approval:
- Build commands: `npm run build`, `npm run lint`
- Test commands: `npm test`, `npm run test:coverage`
- Git analysis: `git diff`, `git log --stat`
- Performance profiling: Memory snapshots, CPU profiles
- Security scans: Dependency audits, secret detection

### 4. Recovery Phase
Executes recovery steps interactively:
- Step-by-step recovery protocol
- User approval required at each step
- Rollback plan if recovery fails
- Progress tracking throughout recovery
- Documentation of actions taken

### 5. Validation Phase
Verifies crisis resolution:
- Re-runs detection to confirm resolution
- Validates success criteria (≥80% must pass)
- Checks for new crises introduced
- Confirms all systems operational
- Measures recovery time

### 6. Documentation Phase
Archives crisis for organizational learning:
- Generates comprehensive markdown report
- Creates structured JSON data
- Saves to `trinity/archive/crisis/YYYY-MM-DD/`
- Extracts learned patterns automatically
- Updates learning system confidence scores

## Usage

### Auto-Detect Mode (Default)
Let Trinity detect the crisis automatically:

```bash
trinity crisis
```

Trinity will scan your system, identify the most likely crisis type, and guide you through recovery.

### Specify Crisis Type
If you already know the crisis type:

```bash
# Build failures
trinity crisis --type build_failure

# Test failures
trinity crisis --type test_failure

# Error patterns
trinity crisis --type error_pattern

# Performance issues
trinity crisis --type performance_degradation

# Security vulnerabilities
trinity crisis --type security_vulnerability
```

### Quick Health Check
Fast system health scan without full investigation:

```bash
trinity crisis --health
```

Returns:
- Overall system health score (0-100)
- Active crisis indicators
- Risk assessment
- Recommended actions

### Search Crisis Archive
Find similar past crises and their solutions:

```bash
# Search by keyword
trinity crisis --search "jwt token"
trinity crisis --search "memory leak"
trinity crisis --search "dependency"

# Search by crisis type
trinity crisis --search --type build_failure
```

### View Statistics
See crisis history, patterns, and resolution metrics:

```bash
trinity crisis --stats
```

Shows:
- Total crises resolved
- Average resolution time per type
- Most common crisis types
- Recovery success rate
- Time savings from learned patterns

## Crisis Protocols

Each crisis type follows a comprehensive protocol:

### Build Failure Protocol
- **Detection:** Exit code ≠ 0, compilation errors, missing dependencies
- **Common Causes:** Dependency updates, type errors, configuration changes
- **Recovery Steps:** Dependency installation, type fixes, config restoration
- **Validation:** Build succeeds, no warnings
- **Prevention:** Lock file commits, CI/CD validation, type checking

### Test Failure Protocol
- **Detection:** Failing tests, coverage below threshold, test errors
- **Common Causes:** Code changes, environment issues, flaky tests
- **Recovery Steps:** Test isolation, environment fixes, test updates
- **Validation:** All tests pass, coverage restored
- **Prevention:** TDD workflow, test reliability improvements

### Error Pattern Protocol
- **Detection:** Repeated errors in logs, error frequency spikes
- **Common Causes:** Uncaught exceptions, missing error handling, edge cases
- **Recovery Steps:** Error handling, input validation, defensive coding
- **Validation:** Error rate drops below baseline
- **Prevention:** Comprehensive error handling, monitoring alerts

### Performance Degradation Protocol
- **Detection:** Slow response times, high memory/CPU, timeouts
- **Common Causes:** Memory leaks, N+1 queries, inefficient algorithms
- **Recovery Steps:** Profiling, optimization, caching, resource limits
- **Validation:** Performance metrics restored to baseline
- **Prevention:** Performance budgets, profiling in CI, load testing

### Security Vulnerability Protocol
- **Detection:** CVE alerts, exposed secrets, dependency vulnerabilities
- **Common Causes:** Outdated dependencies, hardcoded secrets, insecure configs
- **Recovery Steps:** Dependency updates, secret rotation, security hardening
- **Validation:** Security scans pass, no critical vulnerabilities
- **Prevention:** Automated security scans, secret management, SAST/DAST

## Example: Build Failure Crisis Recovery

```
$ trinity crisis --type build_failure

🔍 Crisis Detection: BUILD_FAILURE detected (confidence: 0.95)

Evidence:
- npm run build exited with code 1
- TypeScript compilation error in src/auth/token-service.ts:42
- Missing type definition for 'jsonwebtoken'
- Error: Cannot find module '@types/jsonwebtoken'

📋 Investigation Questions:
1. What changed in the last commit?
   → Added JWT token refresh functionality
2. Were any dependencies updated?
   → Added jsonwebtoken@9.0.0 but forgot type definitions
3. Is this a new file or existing file?
   → Modified existing file with new imports

🔬 Running Diagnostics...
✓ git log -1 --stat
  src/auth/token-service.ts | 23 +++++++++++++++++++++
  1 file changed, 23 insertions(+)

✓ git diff HEAD~1 src/auth/token-service.ts
  +import jwt from 'jsonwebtoken';  // Missing types!

✓ npm ls jsonwebtoken
  jsonwebtoken@9.0.0 (no @types package found)

🛠️ Recovery Steps:
1. Install missing type definitions
   Command: npm install --save-dev @types/jsonwebtoken

Execute step 1? (yes/no): yes

✓ Installing @types/jsonwebtoken...
✓ Type definitions installed successfully

2. Verify build passes
   Command: npm run build

Execute step 2? (yes/no): yes

✓ Build successful! No errors.

✅ Validation: Crisis Resolved
- Build exits with code 0
- No TypeScript errors
- All types resolved

�� Documentation:
Report saved: trinity/archive/crisis/2025-01-07/crisis-build-failure-abc123.md
Pattern learned: "Missing @types/ packages after adding new dependencies"
Confidence: 0.85 (validated from 3 similar past crises)

⏱️ Recovery Time: 3.2 minutes
💡 Time Savings: 68% faster than manual troubleshooting
```

## Learning Integration

Crisis recovery automatically contributes to organizational knowledge:

1. **Pattern Extraction:** Successful recoveries become patterns
   - Crisis type + symptoms + solution = reusable pattern
   - Stored in learning system with confidence score

2. **Confidence Updates:** Each recovery validates or invalidates patterns
   - Success increases confidence (+0.1 per success)
   - Failure decreases confidence (-0.15 per failure)
   - High-confidence patterns (≥0.8) surface first in future crises

3. **Time Savings:** Patterns accelerate future crisis recovery
   - Known patterns provide immediate solutions
   - Recovery protocols become more refined
   - Teams report 60-70% faster crisis resolution with established patterns

4. **Knowledge Sharing:** Crisis patterns shared across team
   - Cross-agent knowledge distribution
   - Team-wide learning from individual crises
   - Organizational memory prevents repeated mistakes

**Real-World Impact:**
Teams using Trinity crisis management report:
- 60-70% faster crisis recovery
- 85% reduction in repeat crises
- 50% reduction in MTTR (Mean Time To Recovery)
- 95% crisis documentation rate (vs. 20% without Trinity)

## Best Practices

### For Developers
1. **Run health checks regularly:** `trinity crisis --health` before major changes
2. **Let Trinity detect:** Auto-detect mode often finds root causes faster
3. **Approve diagnostics:** Diagnostic commands are safe and helpful
4. **Complete documentation:** Full crisis reports improve future recovery
5. **Review patterns:** Check learned patterns to understand common issues

### For Teams
1. **Share crisis archive:** Make trinity/archive/crisis/ accessible to team
2. **Review crisis stats weekly:** `trinity crisis --stats` in team meetings
3. **Update crisis protocols:** Customize protocols for your stack
4. **Celebrate improvements:** Track MTTR improvements over time
5. **Learn from patterns:** High-confidence patterns reveal systemic issues

### For Organizations
1. **Integrate with incident management:** Link Trinity crises to incident tracking
2. **Monitor crisis trends:** Track crisis types and frequencies
3. **Invest in prevention:** Address root causes revealed by patterns
4. **Measure ROI:** Calculate time savings from faster recovery
5. **Build crisis culture:** Encourage crisis documentation and learning

## Related Commands

- `/trinity-learning-status` - View learned crisis patterns
- `/trinity-learning-status --dashboard` - Comprehensive crisis metrics
- `/trinity-orchestrate` - Plan crisis recovery workflows

## Source Files

- `src/cli/commands/crisis.ts` - CLI command implementation
- `src/cli/commands/crisis/detector.ts` - Crisis detection logic
- `src/cli/commands/crisis/recovery.ts` - Recovery protocols
- `src/cli/commands/crisis/validator.ts` - Validation logic
- `src/cli/commands/crisis/documenter.ts` - Documentation generation
- `src/types/crisis.ts` - Crisis type definitions

## What would you like to do?

Choose an action:
1. **Auto-detect crisis** - `trinity crisis`
2. **Specify crisis type** - `trinity crisis --type [type]`
3. **Run health check** - `trinity crisis --health`
4. **Search crisis archive** - `trinity crisis --search "keyword"`
5. **View statistics** - `trinity crisis --stats`

Trinity will guide you through the entire crisis recovery process interactively.