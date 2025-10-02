#!/bin/bash
# Trinity Method - Deployment Verification Script

echo "═══════════════════════════════════════════════════════════════"
echo "    TRINITY METHOD DEPLOYMENT VERIFICATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""

PASS=0
FAIL=0

check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1"
    ((PASS++))
  else
    echo "❌ MISSING: $1"
    ((FAIL++))
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo "✅ $1/"
    ((PASS++))
  else
    echo "❌ MISSING: $1/"
    ((FAIL++))
  fi
}

echo "ROOT FILES:"
check_file "TRINITY.md"
check_file "CLAUDE.md"

echo ""
echo "HIERARCHICAL CLAUDE.md SYSTEM:"
check_file "trinity/CLAUDE.md"

# Detect source directory and check for CLAUDE.md
if [ -f "pubspec.yaml" ]; then
  check_file "lib/CLAUDE.md"
elif [ -f "package.json" ]; then
  check_file "src/CLAUDE.md"
elif [ -f "requirements.txt" ] || [ -f "setup.py" ]; then
  check_file "app/CLAUDE.md"
elif [ -f "Cargo.toml" ]; then
  check_file "src/CLAUDE.md"
else
  echo "⚠️  Unknown framework - cannot verify source CLAUDE.md"
fi

echo ""
echo "TRINITY STRUCTURE:"
check_file "trinity/VERSION"
check_dir "trinity/knowledge-base"
check_dir "trinity/investigations"
check_dir "trinity/work-orders"
check_dir "trinity/patterns"
check_dir "trinity/sessions"
check_dir "trinity/templates"

echo ""
echo "KNOWLEDGE BASE:"
check_file "trinity/knowledge-base/ARCHITECTURE.md"
check_file "trinity/knowledge-base/Trinity.md"
check_file "trinity/knowledge-base/To-do.md"
check_file "trinity/knowledge-base/ISSUES.md"
check_file "trinity/knowledge-base/Technical-Debt.md"

echo ""
echo "WORK ORDER TEMPLATES:"
check_file "trinity/templates/INVESTIGATION-TEMPLATE.md"
check_file "trinity/templates/IMPLEMENTATION-TEMPLATE.md"
check_file "trinity/templates/ANALYSIS-TEMPLATE.md"
check_file "trinity/templates/AUDIT-TEMPLATE.md"
check_file "trinity/templates/PATTERN-TEMPLATE.md"
check_file "trinity/templates/VERIFICATION-TEMPLATE.md"

echo ""
echo "CLAUDE CODE - AGENTS:"
check_dir ".claude/agents/leadership"
check_file ".claude/agents/leadership/trinity-cto.md"
check_file ".claude/agents/leadership/trinity-cc.md"
check_dir ".claude/agents/deployment"
check_file ".claude/agents/deployment/tan-structure.md"
check_file ".claude/agents/deployment/zen-knowledge.md"
check_file ".claude/agents/deployment/ino-context.md"
check_dir ".claude/agents/audit"
check_file ".claude/agents/audit/juno-auditor.md"

echo ""
echo "CLAUDE CODE - HOOKS:"
check_dir ".claude/hooks"
check_file ".claude/hooks/session-end-archive.sh"
check_file ".claude/hooks/quality-gates.sh"
check_file ".claude/hooks/prevent-git.sh"
check_file ".claude/hooks/backup-knowledge.sh"
check_file ".claude/settings.json"
check_file ".claude/EMPLOYEE-DIRECTORY.md"

echo ""
echo "TRINITY HOOKS:"
check_dir "trinity-hooks"
check_file "trinity-hooks/session-end-archive.sh"
check_file "trinity-hooks/quality-gates.sh"
check_file "trinity-hooks/prevent-git.sh"
check_file "trinity-hooks/backup-knowledge.sh"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "VERIFICATION RESULTS:"
echo "✅ PASSED: $PASS"
echo "❌ FAILED: $FAIL"
echo "═══════════════════════════════════════════════════════════════"

if [ $FAIL -eq 0 ]; then
  echo "🎉 DEPLOYMENT 100% COMPLETE!"
  exit 0
else
  echo "⚠️  DEPLOYMENT INCOMPLETE"
  exit 1
fi
