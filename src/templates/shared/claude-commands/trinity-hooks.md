---
description: Manage Trinity Hook Library for safe workflow automation
---

Manage the Trinity Method Hook Library - view, enable, disable, test hooks, and register hooks in `.claude/settings.json`.

## ⚠️ CRITICAL: Hook Registration Required

**Hooks must be registered in `.claude/settings.json` to work!**

Creating a hook script in `trinity-hooks/` or `.claude/hooks/` is **NOT enough**. The hook will only execute if registered in `.claude/settings.json` with the appropriate trigger pattern.

## Hook Registration Syntax

Hooks are registered in `.claude/settings.json` under the `hooks` object:

```json
{
  "hooks": {
    "Stop": {
      "*": "bash trinity-hooks/session-end-archive.sh"
    },
    "PreToolUse": {
      "Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh"
    },
    "PostToolUse": {
      "Edit(trinity/knowledge-base/*)": "bash trinity-hooks/backup-knowledge.sh"
    }
  }
}
```

**Hook Types:**
- **Stop**: Triggers when session ends
- **PreToolUse**: Triggers BEFORE tool executes (can block action)
- **PostToolUse**: Triggers AFTER tool completes

## Default Hooks (Pre-Registered)

These hooks are automatically registered in `.claude/settings.json` when you run `npx trinity deploy`:

### 1. session-end-archive.sh
- **Type**: Stop
- **Trigger**: `*` (all session end events)
- **Purpose**: Archives session work to `trinity/archive/sessions/`
- **Status**: ✅ Registered

### 2. prevent-git.sh
- **Type**: PreToolUse
- **Triggers**:
  - `Bash(git commit:*)`
  - `Bash(git push:*)`
  - `Bash(git merge:*)`
  - `Bash(git checkout -b:*)`
  - `Bash(git branch:*)`
- **Purpose**: Blocks git operations (ALY should handle commits)
- **Status**: ✅ Registered

### 3. backup-knowledge.sh
- **Type**: PostToolUse
- **Triggers**:
  - `Edit(trinity/knowledge-base/*)`
  - `Write(trinity/knowledge-base/*)`
- **Purpose**: Backs up knowledge base edits to `trinity/archive/`
- **Status**: ✅ Registered

### 4. quality-gates.sh
- **Type**: PostToolUse
- **Triggers**:
  - `Bash(npm run build:*)`
  - `Bash(npm test:*)`
- **Purpose**: Enforces quality standards on build/test
- **Status**: ✅ Registered

## Hook Management

Display all hooks with registration status:

## Creating Custom Hooks

When creating a new hook, you must complete **TWO steps**:

### Step 1: Create Hook Script

```bash
# 1. Create script in trinity-hooks/
touch trinity-hooks/my-custom-hook.sh
chmod +x trinity-hooks/my-custom-hook.sh

# 2. Write hook logic
# (exit 0 for success, exit 1 for failure/block)

# 3. Copy to .claude/hooks/
cp trinity-hooks/my-custom-hook.sh .claude/hooks/
chmod +x .claude/hooks/my-custom-hook.sh
```

### Step 2: Register Hook in .claude/settings.json ⭐ CRITICAL

```json
{
  "hooks": {
    "PostToolUse": {
      "SlashCommand(/my-command)": "bash trinity-hooks/my-custom-hook.sh"
    }
  }
}
```

**Without registration, the hook will NOT execute!**

## Trigger Pattern Examples

**Bash Commands:**
```json
"Bash(npm run build:*)": "bash trinity-hooks/build-check.sh"
"Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh"
```

**File Operations:**
```json
"Edit(src/**/*.ts)": "bash trinity-hooks/code-quality.sh"
"Write(package.json)": "bash trinity-hooks/dep-check.sh"
```

**Slash Commands:**
```json
"SlashCommand(/trinity-orchestrate)": "bash trinity-hooks/orchestrate-hook.sh"
"SlashCommand(/trinity-end)": "bash trinity-hooks/session-cleanup.sh"
```

**Wildcards:**
```json
"*": "bash trinity-hooks/log-all.sh"
"Bash(*:*)": "bash trinity-hooks/log-bash.sh"
```

## Hook Status Display

When you run this command, see:

```
TRINITY HOOK LIBRARY
====================

Default Hooks (Registered):
  ✅ session-end-archive.sh (ACTIVE)
     Type: Stop
     Trigger: * (all session ends)

  ✅ prevent-git.sh (ACTIVE)
     Type: PreToolUse
     Triggers: git commit, push, merge, branch operations

  ✅ backup-knowledge.sh (ACTIVE)
     Type: PostToolUse
     Triggers: Edit/Write trinity/knowledge-base/*

  ✅ quality-gates.sh (ACTIVE)
     Type: PostToolUse
     Triggers: npm run build/test

Custom Hooks:
  ⚠️  my-custom-hook.sh (NOT REGISTERED)
     File: trinity-hooks/my-custom-hook.sh
     Status: Created but not registered - will not trigger
     Action: Add registration entry to .claude/settings.json
```

## Testing Hooks

**Manual test:**
```bash
bash trinity-hooks/[hook-name].sh
```

**Trigger test:**
- For PostToolUse hooks: Perform the action that triggers it
- For PreToolUse hooks: Attempt the action it should block
- For Stop hooks: End a Claude Code session

**Verify registration:**
```bash
cat .claude/settings.json | grep "[hook-name]"
```

## Common Mistakes

❌ Creating hook file without registering in settings.json
❌ Wrong trigger pattern (missing `/` in slash commands)
❌ Wrong hook type (PreToolUse vs PostToolUse)
❌ Invalid JSON syntax in settings.json
❌ Forgetting `chmod +x` on hook script

## Safety Features

- Hook validation before execution
- Exit code 1 blocks action (PreToolUse only)
- Hook execution logs available
- JSON validation for settings.json

## Additional Resources

- **Configuration Guide:** `docs/HOOK-CONFIGURATION-GUIDE.md`
- **Hook Scripts:** `trinity-hooks/*.sh`
- **Settings:** `.claude/settings.json`
- **Claude Code Hooks Docs:** https://docs.claude.com/claude-code/hooks
