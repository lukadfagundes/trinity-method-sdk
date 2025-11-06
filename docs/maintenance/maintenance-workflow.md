# Trinity SDK Maintenance Workflow

**System Health, Updates, and Continuous Improvement**
**Trinity Method SDK v2.0**
**Last Updated:** 2025-11-05

---

## Overview

Maintaining Trinity SDK involves regular health checks, dependency updates, baseline monitoring, and continuous process improvement. This workflow ensures long-term SDK effectiveness.

---

## Daily Maintenance (5-10 minutes)

### Health Check

```bash
# Quick status check
npx trinity status

# Check for errors in recent sessions
grep -r "ERROR" trinity/sessions/ --include="*.md" | tail -20

# Review To-do.md for urgent items
cat trinity/knowledge-base/To-do.md | head -50
```

**Action Items:**
- Address any P0 (Critical) issues immediately
- Schedule P1 (High) issues for next session
- Update To-do.md if new tasks discovered

---

## Weekly Maintenance (30-60 minutes)

### 1. Dependency Security Scan

```bash
# Check for vulnerabilities
npm audit

# Update vulnerable dependencies
npm audit fix

# For breaking changes, create work order
/trinity-workorder  # If manual updates needed
```

**BON Agent:**
```
BON: Running security scan...
  ❌ lodash@4.17.19 - CVE-2020-8203 (Moderate)
  ❌ express@4.17.1 - CVE-2022-24999 (High)

Recommended Updates:
  - lodash: 4.17.19 → 4.17.21
  - express: 4.17.1 → 4.18.2

BON: Would you like me to update these?
```

---

### 2. Performance Baseline Review

```bash
# Run benchmarks
npx trinity benchmark

# Compare to baseline
cat trinity/baselines/latest.json
```

**Action if regression detected:**
```
Performance Regression Detected:
  - GET /api/users: 145ms → 287ms (98% slower)
  - Investigation required

Create investigation: /trinity-create-investigation
```

---

### 3. Technical Debt Assessment

```bash
# Review technical debt log
cat trinity/knowledge-base/Technical-Debt.md

# Check for quick wins
grep "Quick Win" trinity/knowledge-base/Technical-Debt.md
```

**Schedule debt reduction:**
- Quick wins (<1 hour): Do immediately
- Medium items (1-4 hours): Schedule this week
- Large items (4+ hours): Plan for next sprint

---

### 4. Knowledge Base Sync

**ZEN Agent automatically maintains, but verify:**
```bash
# Check for outdated information
git log -1 --format="%ai" trinity/knowledge-base/ARCHITECTURE.md

# If >1 month old, review for updates
```

**Update if needed:**
- ARCHITECTURE.md - System changes
- PATTERNS.md - New patterns discovered
- ISSUES.md - Resolved issues to archive

---

## Monthly Maintenance (2-4 hours)

### 1. Comprehensive Audit

```bash
# JUNO comprehensive audit
/trinity-verify

# or full audit
npx trinity audit
```

**JUNO performs:**
- Security audit (OWASP Top 10)
- Performance analysis (all endpoints)
- Technical debt assessment
- Pattern extraction
- Architecture review

**Review audit report:**
```
trinity/audits/YYYY-MM-DD-monthly-audit.md
```

---

### 2. Learning System Review

```bash
# Check learning metrics
/trinity-learning-status

# Export patterns
/trinity-learning-export
```

**Evaluate:**
- Pattern confidence distribution
- Pattern reuse effectiveness
- Cross-session learning impact
- Strategy selection performance

**Action:**
- Archive low-confidence patterns (<0.5)
- Promote high-confidence patterns (>0.9)
- Share valuable patterns with team

---

### 3. Session Archive Cleanup

```bash
# Archive old sessions (>90 days)
find trinity/sessions/ -mtime +90 -type d -exec mv {} trinity/archive/ \;

# Compress archived sessions
tar -czf trinity/archive/sessions-Q1-2025.tar.gz trinity/archive/2025-01-*
```

**Retention policy:**
- Active sessions: 90 days in `trinity/sessions/`
- Archived sessions: Compressed in `trinity/archive/`
- Pattern data: Permanent in `trinity/learning/`

---

### 4. Dependency Updates (Non-Security)

```bash
# Check for outdated packages
npm outdated

# Update minor versions
npm update

# Test after updates
npm test && npm run build
```

**For major version updates:**
1. Review changelog for breaking changes
2. Create work order for migration
3. Test in separate branch
4. Update gradually (one major dependency at a time)

---

## Quarterly Maintenance (1 full day)

### 1. Trinity Method Effectiveness Review

**Metrics to evaluate:**
```yaml
Investigation Effectiveness:
  - % of implementations that required investigation: [Target: 100%]
  - Average investigation time: [Track trend]
  - Decisions overturned post-investigation: [Target: <5%]

Quality Metrics:
  - BAS gate pass rate: [Target: >95%]
  - Test coverage trend: [Target: ≥80%]
  - Production bugs: [Track trend, target: decreasing]

Productivity:
  - Time saved by Learning System: [Track total]
  - Pattern reuse rate: [Target: >70%]
  - Implementation velocity: [Tasks per hour, track trend]

Knowledge Management:
  - Knowledge Base updates: [Frequency]
  - Pattern confidence: [Average, target: >0.7]
  - Cross-session learning: [Patterns used from previous sessions]
```

**Action based on metrics:**
- Adjust quality gate thresholds if needed
- Refine investigation templates
- Update agent coordination patterns

---

### 2. Major Version Updates

**Plan major SDK updates:**
```bash
# Check SDK version
npm list @trinity-method/sdk

# Check for major updates
npm show @trinity-method/sdk versions

# Read migration guide
npx trinity docs migration
```

**Migration process:**
1. Review breaking changes
2. Create migration branch
3. Update SDK version
4. Update agent files if needed
5. Test all workflows
6. Update project CLAUDE.md if patterns changed
7. Merge after validation

---

### 3. Process Improvement

**Review Trinity Method implementation:**

**Questions to answer:**
- Are investigations consistently thorough?
- Are quality gates catching issues?
- Is the Knowledge Base staying current?
- Are sessions well-documented?
- Is technical debt being addressed?

**Identify improvements:**
- New agents needed?
- Better templates?
- Additional automation?
- Training for team members?

**Document improvements:**
```
trinity/lessons-learned/process-improvements/YYYY-MM-DD-quarterly-review.md
```

---

### 4. Team Training (if applicable)

**For teams using Trinity Method:**
- Review agent usage patterns
- Share successful investigations
- Demonstrate new features
- Collect feedback on pain points
- Update team documentation

---

## Automated Maintenance

### Pre-Commit Hooks (Automatic)

```yaml
pre-commit:
  - Linting (ESLint, Prettier)
  - Type checking (TypeScript)
  - Unit tests (Changed files)
  - Coverage check (New code ≥80%)
```

**Runs:** Every `git commit`
**Blocks commit if:** Any check fails

---

### Session-End Hook (Automatic)

```yaml
session-end:
  - Archive session files
  - Extract patterns
  - Update Knowledge Base
  - Create session summary
```

**Runs:** When you use `/trinity-end`
**Result:** Session preserved for future reference

---

### CI/CD Pipeline (Automatic)

```yaml
on_push:
  - BAS Phase 1: Linting
  - BAS Phase 3: Build
  - BAS Phase 4: Testing
  - BAS Phase 5: Coverage ≥80%

on_pull_request:
  - All above checks
  - DRA code review
  - Performance benchmarks

on_release_branch:
  - All above checks
  - JUNO comprehensive audit
```

**Runs:** Automatically on git push/PR
**Blocks merge if:** Any check fails

---

## Maintenance Checklist

### Daily ☑️
- [ ] Check `npx trinity status`
- [ ] Review recent session errors
- [ ] Address P0 (Critical) issues

### Weekly ☑️
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Check performance baselines
- [ ] Review technical debt for quick wins
- [ ] Sync Knowledge Base (ZEN automatic, verify)

### Monthly ☑️
- [ ] Run JUNO comprehensive audit
- [ ] Review learning system metrics
- [ ] Archive old sessions (>90 days)
- [ ] Update non-security dependencies

### Quarterly ☑️
- [ ] Trinity Method effectiveness review
- [ ] Major version update planning
- [ ] Process improvement session
- [ ] Team training (if applicable)

---

## Troubleshooting

### Issue: Hooks Not Running

**Symptom:** Pre-commit hook doesn't execute

**Solution:**
```bash
# Reinstall hooks
pre-commit uninstall
pre-commit install

# Test hooks
pre-commit run --all-files
```

---

### Issue: High Memory Usage

**Symptom:** Trinity cache using excessive memory

**Solution:**
```bash
# Clear cache
/trinity-cache-clear

# Adjust cache settings
/trinity-config
# Select: Cache Settings
# Reduce L1 cache size or TTL
```

---

### Issue: Slow Investigations

**Symptom:** ALY investigation takes too long

**Solution:**
- Check if Learning System has relevant patterns
- Use `/trinity-cache-warm` to pre-populate cache
- Review investigation scope (may be too broad)

---

## Related Documentation

- [Deploy Workflow](../workflows/deploy-workflow.md) - Initial setup
- [Session Workflow](../workflows/session-workflow.md) - Daily usage
- [Commands Reference](../commands/README.md) - Maintenance commands

---

**Maintain systematically. Monitor continuously. Improve iteratively.**
