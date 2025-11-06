# Hook System Guide

**Trinity Method SDK v2.0 - Hook Philosophy & Configuration**
**Last Updated:** 2025-11-05

---

## Table of Contents

1. [Hook Philosophy](#hook-philosophy)
2. [Hook Types](#hook-types)
3. [When to Use Hooks](#when-to-use-hooks)
4. [Hook Design Patterns](#hook-design-patterns)
5. [Configuration Guide](#configuration-guide)
6. [Advanced Examples](#advanced-examples)
7. [Best Practices](#best-practices)

---

## Hook Philosophy

### What Are Hooks?

**Hooks are automation points** that execute custom shell commands in response to specific events during development workflows.

**Trinity Method Principle:** Automate repetitive tasks, enforce standards consistently, preserve knowledge automatically.

### Why Hooks Matter

**Without Hooks:**
- Manual session archiving (often forgotten)
- Inconsistent quality checks
- Lost knowledge between sessions
- Manual enforcement of standards

**With Hooks:**
- Automatic session archiving (never forgotten)
- Consistent quality enforcement
- Automatic knowledge preservation
- Standards enforced by automation

### Trinity Method Hook Philosophy

**1. Automate What You'd Forget**
```yaml
Examples:
  - Session archiving
  - Knowledge base updates
  - Metric collection
  - Pattern extraction
```

**2. Enforce What Matters**
```yaml
Examples:
  - Quality gates
  - Naming conventions
  - Documentation requirements
  - Security checks
```

**3. Preserve What You Learn**
```yaml
Examples:
  - Investigation documents
  - Patterns discovered
  - Issues resolved
  - Implementation notes
```

---

## Hook Types

### 1. Session Start Hook

**Purpose:** Prepare environment for new development session

**When It Runs:** At the beginning of a development session

**Typical Uses:**
```yaml
- Load previous session context
- Display To-do list
- Check for critical issues
- Remind of ongoing work
- Setup development environment
```

**Example:**
```bash
#!/bin/bash
# .claude/hooks/session-start.sh

echo "=== Trinity Method Session Start ==="
echo ""

# Display last session summary
if [ -d "trinity/sessions" ]; then
  LAST_SESSION=$(ls -t trinity/sessions | head -1)
  if [ -n "$LAST_SESSION" ]; then
    echo "📋 Last Session: $LAST_SESSION"
    if [ -f "trinity/sessions/$LAST_SESSION/session-retrospective.md" ]; then
      echo ""
      cat "trinity/sessions/$LAST_SESSION/session-retrospective.md"
    fi
  fi
fi

echo ""
echo "📝 Current Tasks (trinity/knowledge-base/To-do.md):"
head -20 trinity/knowledge-base/To-do.md

echo ""
echo "🚨 Critical Issues (trinity/knowledge-base/ISSUES.md):"
grep "Priority: P0" trinity/knowledge-base/ISSUES.md | head -5

echo ""
echo "Ready to start! What would you like to work on?"
```

---

### 2. Session End Hook

**Purpose:** Preserve session knowledge automatically

**When It Runs:** At the end of a development session

**Typical Uses:**
```yaml
- Archive session materials
- Extract patterns from session
- Update knowledge base
- Create session summary
- Commit work in progress
```

**Example:**
```bash
#!/bin/bash
# trinity-hooks/session-end-archive.sh

SESSION_DIR="trinity/sessions/$(date +%Y-%m-%d-%H-%M)"
mkdir -p "$SESSION_DIR"

echo "=== Archiving Trinity Method Session ==="
echo "Location: $SESSION_DIR"

# Copy investigation documents
if [ -d "trinity/investigations" ]; then
  cp trinity/investigations/*.md "$SESSION_DIR/" 2>/dev/null
  echo "✓ Investigations archived"
fi

# Copy work orders
if [ -d "trinity/work-orders" ]; then
  cp trinity/work-orders/*.md "$SESSION_DIR/" 2>/dev/null
  echo "✓ Work orders archived"
fi

# Create session summary
cat > "$SESSION_DIR/session-summary.md" <<EOF
# Session Summary

**Date:** $(date +%Y-%m-%d)
**Duration:** [Auto-calculated if tracked]

## Work Completed
$(git log --since="8 hours ago" --oneline)

## Files Changed
$(git diff --stat HEAD~5 HEAD 2>/dev/null | head -20)

## Patterns Discovered
[Auto-extracted by Learning System]

## Next Session
[Review To-do.md for next priorities]
EOF

echo "✓ Session summary created"
echo ""
echo "Session archived successfully!"
echo "Next session will load this context automatically."
```

---

### 3. Pre-Commit Hook

**Purpose:** Enforce quality before code enters repository

**When It Runs:** Before `git commit` completes

**Typical Uses:**
```yaml
- Run linters (ESLint, Prettier)
- Run formatters
- Run tests
- Check coverage
- Validate commit message format
```

**Example (.pre-commit-config.yaml):**
```yaml
# Trinity Method SDK uses Python's pre-commit framework
repos:
  - repo: local
    hooks:
      # ESLint
      - id: eslint
        name: ESLint
        entry: npm run lint
        language: system
        types: [javascript, typescript]
        pass_filenames: false

      # Prettier
      - id: prettier
        name: Prettier
        entry: npm run format:check
        language: system
        types: [javascript, typescript, json, markdown]
        pass_filenames: false

      # Tests
      - id: tests
        name: Run Tests
        entry: npm test
        language: system
        pass_filenames: false
        stages: [commit]

      # Commit message format
      - id: commit-msg
        name: Validate Commit Message
        entry: .claude/hooks/validate-commit-msg.sh
        language: system
        stages: [commit-msg]
```

---

### 4. Post-Commit Hook

**Purpose:** Actions to take after successful commit

**When It Runs:** After `git commit` succeeds

**Typical Uses:**
```yaml
- Update metrics
- Extract patterns
- Update knowledge base
- Notify team
- Trigger CI/CD
```

**Example:**
```bash
#!/bin/bash
# .git/hooks/post-commit

# Extract patterns from commit
COMMIT_MSG=$(git log -1 --pretty=%B)

if [[ $COMMIT_MSG == *"pattern:"* ]]; then
  echo "Pattern detected in commit, extracting..."
  # Trigger Learning System pattern extraction
fi

# Update Technical-Debt.md metrics
echo "Updating technical debt metrics..."
# Count TODOs, FIXMEs, etc.

echo "Post-commit actions complete!"
```

---

### 5. Custom Workflow Hooks

**Purpose:** Project-specific automation

**When It Runs:** On custom events/commands

**Typical Uses:**
```yaml
- Deployment preparation
- Database migration checks
- Documentation generation
- Metric collection
- Custom validations
```

**Example:**
```bash
#!/bin/bash
# trinity-hooks/pre-deploy.sh

echo "=== Pre-Deployment Checks ==="

# Run full test suite
echo "Running full test suite..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Deployment blocked."
  exit 1
fi

# Check coverage
echo "Checking test coverage..."
npm run test:coverage
COVERAGE=$(grep "All files" coverage/coverage-summary.json | grep -oP '\d+\.\d+' | head -1)
if (( $(echo "$COVERAGE < 80" | bc -l) )); then
  echo "❌ Coverage below 80%! Deployment blocked."
  exit 1
fi

# Run security audit
echo "Running security audit..."
npm audit --audit-level=high
if [ $? -ne 0 ]; then
  echo "⚠️  Security vulnerabilities found! Review required."
  exit 1
fi

echo "✅ All pre-deployment checks passed!"
```

---

## When to Use Hooks

### Use Hooks For:

**✅ Repetitive Tasks**
```yaml
Good:
  - Session archiving (every session end)
  - Linting (every commit)
  - Test running (every commit)
  - Metric collection (periodic)

Bad:
  - One-time setup tasks
  - Rare edge cases
  - Complex interactive workflows
```

**✅ Consistency Enforcement**
```yaml
Good:
  - Code formatting (always same)
  - Commit message format (always same)
  - Documentation requirements (always same)
  - Quality standards (always same)

Bad:
  - Context-dependent decisions
  - Creative work
  - Exploratory tasks
```

**✅ Knowledge Preservation**
```yaml
Good:
  - Automatic archiving
  - Pattern extraction
  - Metric tracking
  - Documentation updates

Bad:
  - Manual analysis
  - Strategic decisions
  - Creative documentation
```

### Don't Use Hooks For:

**❌ Long-Running Tasks**
```yaml
Avoid:
  - Full codebase analysis (minutes)
  - Heavy computations (slow commits)
  - External API calls (unreliable)
  - Large file operations (blocking)

Instead:
  - Run in CI/CD pipeline
  - Run as separate commands
  - Run on schedules
  - Run manually when needed
```

**❌ Tasks Requiring Interaction**
```yaml
Avoid:
  - User prompts in pre-commit hooks
  - Waiting for approval
  - Interactive wizards
  - Manual input required

Instead:
  - Use CLI commands
  - Use separate workflows
  - Ask before hook runs
```

**❌ Complex Logic**
```yaml
Avoid:
  - Multi-step decision trees
  - Complex state management
  - AI agent coordination (save for commands)
  - Error-prone operations

Instead:
  - Use dedicated scripts
  - Use agent workflows
  - Simplify hook logic
```

---

## Hook Design Patterns

### Pattern 1: Fail Fast

**Principle:** If hook detects problem, fail immediately with clear message.

```bash
#!/bin/bash
# Good: Fail fast pattern

set -e  # Exit on any error

echo "Running linter..."
npm run lint
# If lint fails, script exits immediately

echo "Running tests..."
npm test
# If tests fail, script exits immediately

echo "✅ All checks passed!"
```

**Why:** Don't waste time if early checks fail.

---

### Pattern 2: Graceful Degradation

**Principle:** If optional hook action fails, continue with warning.

```bash
#!/bin/bash
# Good: Graceful degradation

# Critical: Must succeed
npm test || exit 1

# Optional: Nice to have
npm run lint || echo "⚠️  Linting skipped (not critical)"

# Optional: Best effort
npm run type-check || echo "⚠️  Type checking skipped"

echo "✅ Core checks passed!"
```

**Why:** Don't block workflow for non-critical failures.

---

### Pattern 3: Idempotent Operations

**Principle:** Hook can run multiple times safely.

```bash
#!/bin/bash
# Good: Idempotent session archive

SESSION_DIR="trinity/sessions/$(date +%Y-%m-%d-%H-%M)"

# Create if doesn't exist
mkdir -p "$SESSION_DIR"

# Copy (overwrites if exists)
cp trinity/investigations/*.md "$SESSION_DIR/" 2>/dev/null || true

# Append (doesn't duplicate)
echo "Session: $(date)" >> "$SESSION_DIR/log.txt"
```

**Why:** Hooks may run multiple times (retries, failures).

---

### Pattern 4: Logging & Feedback

**Principle:** Always show what hook is doing.

```bash
#!/bin/bash
# Good: Clear logging

echo "=== Pre-Commit Quality Checks ==="
echo ""

echo "[1/4] Running linter..."
npm run lint
echo "✓ Linting passed"

echo "[2/4] Running formatter..."
npm run format:check
echo "✓ Formatting passed"

echo "[3/4] Running tests..."
npm test
echo "✓ Tests passed"

echo "[4/4] Checking coverage..."
npm run test:coverage
echo "✓ Coverage above threshold"

echo ""
echo "✅ All quality checks passed! Committing..."
```

**Why:** Users need to know what's happening and why it might be slow.

---

## Configuration Guide

### Setting Up Hooks in SDK

**1. Pre-commit Hooks (Recommended):**
```bash
# Install pre-commit framework
pip install pre-commit

# Install hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

**2. Session Hooks:**
```bash
# Session start (manual)
./trinity-hooks/session-start.sh

# Session end (manual or automatic)
./trinity-hooks/session-end-archive.sh
```

**3. Custom Hooks:**
```bash
# Create custom hook
touch trinity-hooks/my-custom-hook.sh
chmod +x trinity-hooks/my-custom-hook.sh

# Run manually
./trinity-hooks/my-custom-hook.sh

# Or integrate with workflow
```

### Hook Configuration Files

**pre-commit-config.yaml:**
```yaml
repos:
  - repo: local
    hooks:
      - id: trinity-quality-gates
        name: Trinity Quality Gates
        entry: ./trinity-hooks/quality-gates.sh
        language: system
        pass_filenames: false
        stages: [commit]
```

**package.json scripts:**
```json
{
  "scripts": {
    "trinity:session-start": "./trinity-hooks/session-start.sh",
    "trinity:session-end": "./trinity-hooks/session-end-archive.sh",
    "trinity:pre-deploy": "./trinity-hooks/pre-deploy.sh"
  }
}
```

---

## Advanced Examples

### Example 1: Automatic Pattern Extraction

```bash
#!/bin/bash
# trinity-hooks/extract-patterns.sh

echo "=== Pattern Extraction Hook ==="

# Get recent commits
RECENT_COMMITS=$(git log --since="1 day ago" --pretty=format:"%H")

for COMMIT in $RECENT_COMMITS; do
  # Check if commit message mentions pattern
  MSG=$(git log -1 --pretty=%B $COMMIT)

  if [[ $MSG == *"pattern:"* ]]; then
    # Extract pattern name
    PATTERN=$(echo "$MSG" | grep -oP 'pattern:\s*\K[^,]+')

    echo "Found pattern: $PATTERN in commit $COMMIT"

    # Create pattern document if doesn't exist
    PATTERN_FILE="trinity/patterns/extracted/${PATTERN// /-}.md"

    if [ ! -f "$PATTERN_FILE" ]; then
      # Create pattern template
      cat > "$PATTERN_FILE" <<EOF
# Pattern: $PATTERN

**Extracted from:** Commit $COMMIT
**Date:** $(date +%Y-%m-%d)

## Context
[Automatically extracted - requires manual refinement]

## Problem
[To be documented]

## Solution
$(git show $COMMIT --pretty="" --patch)

## Benefits
[To be documented]

## Related Patterns
[To be documented]
EOF

      echo "✓ Pattern document created: $PATTERN_FILE"
    fi
  fi
done
```

---

### Example 2: Metrics Dashboard Update

```bash
#!/bin/bash
# trinity-hooks/update-metrics.sh

echo "=== Updating Trinity Metrics ==="

# Count TODOs
TODO_COUNT=$(grep -r "TODO" src/ | wc -l)

# Count FIXMEs
FIXME_COUNT=$(grep -r "FIXME" src/ | wc -l)

# Count test files
TEST_COUNT=$(find tests/ -name "*.test.ts" | wc -l)

# Get test coverage
COVERAGE=$(npm run test:coverage --silent 2>&1 | grep "All files" | grep -oP '\d+\.\d+' | head -1)

# Update Technical-Debt.md
cat > trinity/knowledge-base/metrics-snapshot.json <<EOF
{
  "date": "$(date +%Y-%m-%d)",
  "todo_count": $TODO_COUNT,
  "fixme_count": $FIXME_COUNT,
  "test_count": $TEST_COUNT,
  "coverage": $COVERAGE
}
EOF

echo "✓ Metrics updated"
```

---

### Example 3: Investigation Reminder

```bash
#!/bin/bash
# trinity-hooks/investigation-reminder.sh

echo "=== Investigation Reminder ===" echo ""

# Check if there are uninvestigated changes
CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD | wc -l)

if [ $CHANGED_FILES -gt 5 ]; then
  echo "⚠️  Large change detected ($CHANGED_FILES files)"
  echo ""
  echo "Trinity Method Reminder:"
  echo "Have you created an investigation document?"
  echo ""
  echo "If not:"
  echo "  cp trinity/templates/INVESTIGATION-TEMPLATE.md \\"
  echo "     trinity/investigations/$(date +%Y-%m-%d)-[feature-name].md"
  echo ""
fi
```

---

## Best Practices

### 1. Keep Hooks Fast

**Goal:** <5 seconds for pre-commit hooks

```bash
# ❌ Bad: Slow hook
npm run lint        # 30 seconds
npm test            # 60 seconds
npm run build       # 45 seconds
# Total: 135 seconds (user frustrated)

# ✅ Good: Fast hook
npm run lint:staged  # Only changed files (5 seconds)
npm run test:changed # Only affected tests (10 seconds)
# Total: 15 seconds (acceptable)

# ✅ Better: CI/CD for slow checks
# Pre-commit: Quick checks only
# CI/CD: Full test suite after push
```

---

### 2. Provide Clear Errors

```bash
# ❌ Bad: Cryptic error
echo "Failed"
exit 1

# ✅ Good: Clear error
echo "❌ Linting failed!"
echo ""
echo "Found 3 errors in:"
echo "  - src/utils/helper.ts:42"
echo "  - src/services/user.ts:15"
echo ""
echo "Fix with: npm run lint:fix"
exit 1
```

---

### 3. Make Hooks Skippable (When Appropriate)

```bash
# Allow skip with --no-verify for emergencies
git commit --no-verify -m "hotfix: critical bug"

# But warn user
cat > .git/hooks/pre-commit <<'EOF'
#!/bin/bash
# Trinity Method Quality Gates

# Check if user is bypassing hooks
if [ -n "$SKIP_HOOKS" ]; then
  echo "⚠️  WARNING: Hooks bypassed with --no-verify"
  echo "This should only be used for emergencies!"
  exit 0
fi

# Run normal checks
./trinity-hooks/quality-gates.sh
EOF
```

---

### 4. Document Your Hooks

```markdown
# trinity-hooks/README.md

## Available Hooks

### session-start.sh
**Purpose:** Display session context
**When:** Start of development session
**Usage:** `npm run trinity:session-start`

### session-end-archive.sh
**Purpose:** Archive session materials
**When:** End of development session
**Usage:** `npm run trinity:session-end`

### quality-gates.sh
**Purpose:** Run quality checks
**When:** Pre-commit (automatic)
**Usage:** Automatic (via pre-commit)
```

---

## Conclusion

Hooks are **powerful automation** that make Trinity Method seamless. They:
- **Enforce standards** consistently
- **Preserve knowledge** automatically
- **Save time** on repetitive tasks
- **Reduce errors** through automation

**Trinity Method Philosophy:** Automate what you'd forget, enforce what matters, preserve what you learn.

---

**Trinity Method SDK: Hooks That Work for You**

*Automate consistently. Enforce systematically. Preserve automatically.*

---

**Document Version:** 2.0
**SDK Version:** 2.0.0
**Last Updated:** 2025-11-05
**Related:** [Best Practices](./best-practices.md), [Session Management](./session-management.md)
