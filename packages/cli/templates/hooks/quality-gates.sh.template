#!/bin/bash
# Trinity Method - Quality Gates Hook
# Enforces Trinity Method quality standards

echo "[TRINITY HOOK]: Running quality gates..."

WARNINGS=0
ERRORS=0

# Check for CLAUDE.md updates
if git diff --cached --name-only 2>/dev/null | grep -q "CLAUDE.md"; then
  echo "✅ CLAUDE.md updated"
else
  echo "⚠️  Note: CLAUDE.md not updated this session"
  ((WARNINGS++))
fi

# Check for architecture documentation
if git diff --cached --name-only 2>/dev/null | grep -q "trinity/knowledge-base/ARCHITECTURE.md"; then
  echo "✅ Architecture documentation updated"
fi

# Check for To-do.md updates
if git diff --cached --name-only 2>/dev/null | grep -q "trinity/knowledge-base/To-do.md"; then
  echo "✅ To-do.md updated"
fi

# Verify no uncommitted investigations
if [ -d "trinity/investigations" ] && [ -n "$(ls -A trinity/investigations 2>/dev/null)" ]; then
  echo "⚠️  Warning: Uncommitted investigations exist in trinity/investigations/"
  echo "   Consider archiving to trinity/sessions/ or documenting in knowledge-base"
  ((WARNINGS++))
fi

# Check for untracked work orders
if [ -d "trinity/work-orders" ] && [ -n "$(ls -A trinity/work-orders 2>/dev/null)" ]; then
  echo "⚠️  Warning: Active work orders in trinity/work-orders/"
  echo "   Ensure work orders are completed or carried forward"
  ((WARNINGS++))
fi

# Verify trinity structure integrity
REQUIRED_DIRS=("trinity/knowledge-base" "trinity/sessions" "trinity/investigations" "trinity/patterns")
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    echo "❌ ERROR: Required directory missing: $dir"
    ((ERRORS++))
  fi
done

# Verify knowledge base completeness
REQUIRED_FILES=("trinity/knowledge-base/ARCHITECTURE.md" "trinity/knowledge-base/Trinity.md" "trinity/knowledge-base/To-do.md" "trinity/knowledge-base/ISSUES.md" "trinity/knowledge-base/Technical-Debt.md")
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ ERROR: Required file missing: $file"
    ((ERRORS++))
  fi
done

# Summary
echo ""
echo "[TRINITY HOOK]: Quality Gates Summary"
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"

if [ $ERRORS -gt 0 ]; then
  echo "❌ Quality gates FAILED - Critical errors found"
  exit 1
fi

if [ $WARNINGS -gt 0 ]; then
  echo "⚠️  Quality gates PASSED with warnings"
else
  echo "✅ Quality gates PASSED"
fi

exit 0
