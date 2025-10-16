# Hook Configuration Guide

## What Are Hooks?

Hooks are automated scripts that execute in response to specific events in Claude Code, such as tool calls, slash commands, or file operations. Trinity Method SDK uses hooks for session management, git operation prevention, knowledge base backups, and quality gate enforcement.

**Key Concept:** Hooks require **two-part setup** to work:
1. **Hook script creation** - Write the script in `trinity-hooks/`
2. **Hook registration** - Register in `.claude/settings.json` to trigger automatically

Creating a hook file is **not enough**. Without registration in `.claude/settings.json`, hooks will never execute.

## Why Hook Registration is Required

Claude Code's hook system uses an **event-driven architecture**:

- **Event source:** User actions (tool calls, commands, file operations)
- **Event registry:** `.claude/settings.json` hooks object
- **Event handler:** Hook script in `trinity-hooks/` or `.claude/hooks/`

Without a registry entry, Claude Code has no way to know:
1. When to trigger the hook
2. What pattern to match
3. Which script to execute

The hook files themselves are **passive** - they only execute when explicitly called by the hook system through registered triggers.

---

## Hook Types

Claude Code supports three hook types:

### 1. Stop Hooks

Trigger when a Claude Code session ends.

**Use cases:**
- Archive session work
- Clean up temporary files
- Generate session reports
- Update session logs

**Example:**

```json
{
  "hooks": {
    "Stop": {
      "*": "bash trinity-hooks/session-end-archive.sh"
    }
  }
}
```

### 2. PreToolUse Hooks

Trigger **before** a tool executes. Can block the action by returning exit code 1.

**Use cases:**
- Prevent git operations (commits, pushes, merges)
- Validate inputs before execution
- Enforce workflow policies
- Block destructive operations

**Example:**
```json
{
  "hooks": {
    "PreToolUse": {
      "Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh",
      "Bash(git push:*)": "bash trinity-hooks/prevent-git.sh"
    }
  }
}
```

### 3. PostToolUse Hooks

Trigger **after** a tool completes successfully.

**Use cases:**
- Backup files after edits
- Generate reports after builds
- Sync data after operations
- Run quality checks after tests

**Example:**
```json
{
  "hooks": {
    "PostToolUse": {
      "Edit(trinity/knowledge-base/*)": "bash trinity-hooks/backup-knowledge.sh",
      "Bash(npm run build:*)": "bash trinity-hooks/quality-gates.sh"
    }
  }
}
```

---

## Default Hooks in Trinity Method SDK

When you run `npx trinity deploy`, these hooks are automatically registered:

### 1. session-end-archive.sh
- **Type:** Stop
- **Trigger:** `*` (all session end events)
- **Purpose:** Archives session work to `trinity/archive/sessions/`
- **Status:** ✅ Pre-registered

### 2. prevent-git.sh
- **Type:** PreToolUse
- **Triggers:**
  - `Bash(git commit:*)`
  - `Bash(git push:*)`
  - `Bash(git merge:*)`
  - `Bash(git checkout -b:*)`
  - `Bash(git branch:*)`
- **Purpose:** Blocks git operations (ALY should handle commits)
- **Status:** ✅ Pre-registered

### 3. backup-knowledge.sh
- **Type:** PostToolUse
- **Triggers:**
  - `Edit(trinity/knowledge-base/*)`
  - `Write(trinity/knowledge-base/*)`
- **Purpose:** Backs up knowledge base edits to `trinity/archive/`
- **Status:** ✅ Pre-registered

### 4. quality-gates.sh
- **Type:** PostToolUse
- **Triggers:**
  - `Bash(npm run build:*)`
  - `Bash(npm test:*)`
- **Purpose:** Enforces quality standards on build/test operations
- **Status:** ✅ Pre-registered

---

## Trigger Pattern Syntax

### Bash Commands

Match specific bash commands:

```json
"Bash(npm run build:*)": "bash trinity-hooks/build-check.sh"
"Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh"
```

### File Operations

Match file edits, writes, or reads:

```json
"Edit(src/**/*.ts)": "bash trinity-hooks/code-quality.sh"
"Write(package.json)": "bash trinity-hooks/dep-check.sh"
"Read(.env)": "bash trinity-hooks/security-check.sh"
```

### Slash Commands

Match Trinity slash commands:

```json
"SlashCommand(/trinity-orchestrate)": "bash trinity-hooks/orchestrate-hook.sh"
"SlashCommand(/trinity-end)": "bash trinity-hooks/session-cleanup.sh"
```

### Wildcards

Match multiple patterns:

```json
"*": "bash trinity-hooks/log-all.sh"
"Bash(*:*)": "bash trinity-hooks/log-bash.sh"
"Edit(trinity/**/*.md)": "bash trinity-hooks/doc-backup.sh"
```

---

## Creating Custom Hooks

### Step 1: Create Hook Script

```bash
# Navigate to your project
cd /path/to/your/project

# Create hook script
touch trinity-hooks/my-custom-hook.sh
chmod +x trinity-hooks/my-custom-hook.sh

# Edit with your logic
nano trinity-hooks/my-custom-hook.sh
```

**Example hook script:**

```bash
#!/bin/bash
# trinity-hooks/my-custom-hook.sh

echo "[HOOK] Running custom validation..."

# Your hook logic here
if [ some_condition ]; then
  echo "[HOOK] Validation passed"
  exit 0  # Success - continue action
else
  echo "[HOOK] Validation failed - blocking action"
  exit 1  # Failure - block action (PreToolUse only)
fi
```

### Step 2: Copy to .claude/hooks/

```bash
cp trinity-hooks/my-custom-hook.sh .claude/hooks/
chmod +x .claude/hooks/my-custom-hook.sh
```

### Step 3: Register in .claude/settings.json ⭐ CRITICAL

Open `.claude/settings.json` and add your hook:

```json
{
  "hooks": {
    "PostToolUse": {
      "SlashCommand(/my-command)": "bash trinity-hooks/my-custom-hook.sh"
    }
  }
}
```

**Without this registration step, your hook will NEVER execute.**

---

## Managing Hooks with /trinity-hooks

View all hooks and their registration status:

```bash
/trinity-hooks
```

**Output example:**

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

---

## Testing Hooks

### Manual Test

Test the hook script directly:

```bash
bash trinity-hooks/my-custom-hook.sh
```

### Trigger Test

Test the hook through its registered trigger:

**For PostToolUse hooks:**
- Perform the action that triggers it
- Check that hook executes after action completes

**For PreToolUse hooks:**
- Attempt the action it should block
- Verify action is prevented if hook returns exit 1

**For Stop hooks:**
- End a Claude Code session
- Verify hook executes during session cleanup

### Verify Registration

Check that hook is registered:

```bash
cat .claude/settings.json | grep "my-custom-hook"
```

Expected output:
```
"SlashCommand(/my-command)": "bash trinity-hooks/my-custom-hook.sh"
```

---

## Hook Execution Flow

Understanding how hooks execute:

```
1. USER ACTION
   └─> User runs command, edits file, ends session, etc.

2. CLAUDE CODE CHECKS .claude/settings.json
   └─> Looks for matching trigger pattern in hooks object

3. IF MATCH FOUND
   └─> Execute registered hook script
       └─> Hook runs with exit code 0 (success) or 1 (failure)

4. HOOK RETURN HANDLING
   └─> Exit 0: Continue with action (PreToolUse) or complete (PostToolUse)
   └─> Exit 1: Block action (PreToolUse only) and show hook output
```

---

## Common Mistakes

### ❌ Creating hook without registration

```bash
# Created the hook
touch trinity-hooks/my-hook.sh
chmod +x trinity-hooks/my-hook.sh

# Forgot to add to .claude/settings.json
# Result: Hook never triggers ❌
```

**Fix:** Always register in `.claude/settings.json`

### ❌ Wrong trigger pattern

```json
"SlashCommand(trinity-orchestrate)": "..."  // Missing leading slash ❌
"SlashCommand(/trinity-orchestrate)": "..."  // Correct ✅
```

### ❌ Wrong hook type

```json
// Want to block git commits
"PostToolUse": {  // Wrong - action already happened ❌
  "Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh"
}

// Correct
"PreToolUse": {  // Correct - blocks before action ✅
  "Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh"
}
```

### ❌ Invalid JSON syntax

```json
{
  "hooks": {
    "PostToolUse": {
      "SlashCommand(/my-cmd)": "bash trinity-hooks/my-hook.sh"  // Missing comma if more entries follow
    }
  }
}
```

**Fix:** Validate JSON syntax after editing `.claude/settings.json`

### ❌ Forgetting chmod +x

```bash
touch trinity-hooks/my-hook.sh
# Forgot chmod +x
# Result: Permission denied error ❌
```

**Fix:** Always make hook scripts executable

---

## Checklist for New Hooks

When creating a custom hook, complete all steps:

- [ ] Create hook script in `trinity-hooks/[hook-name].sh`
- [ ] Make executable: `chmod +x trinity-hooks/[hook-name].sh`
- [ ] Test manually: `bash trinity-hooks/[hook-name].sh`
- [ ] Copy to `.claude/hooks/[hook-name].sh`
- [ ] Make executable: `chmod +x .claude/hooks/[hook-name].sh`
- [ ] Register in `.claude/settings.json` ⭐
- [ ] Choose correct trigger type (Stop, PreToolUse, PostToolUse)
- [ ] Define trigger pattern (slash command, bash, file operation)
- [ ] Validate JSON syntax in settings.json
- [ ] Test hook through trigger action
- [ ] Verify hook executes automatically
- [ ] Document in `trinity-hooks/README.md` (optional)

---

## Advanced Hook Configuration

### Multiple Triggers for One Hook

```json
{
  "hooks": {
    "PreToolUse": {
      "Bash(git commit:*)": "bash trinity-hooks/prevent-git.sh",
      "Bash(git push:*)": "bash trinity-hooks/prevent-git.sh",
      "Bash(git merge:*)": "bash trinity-hooks/prevent-git.sh"
    }
  }
}
```

### Multiple Hooks for Different Triggers

```json
{
  "hooks": {
    "PostToolUse": {
      "Bash(npm run build:*)": "bash trinity-hooks/build-notification.sh",
      "Bash(npm test:*)": "bash trinity-hooks/test-reporter.sh",
      "SlashCommand(/trinity-end)": "bash trinity-hooks/session-cleanup.sh"
    }
  }
}
```

### Combining Hook Types

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

---

## Troubleshooting

### Issue: Hook not triggering

**Symptoms:**
- Hook script exists in `trinity-hooks/` and `.claude/hooks/`
- Action is performed but hook doesn't execute

**Diagnosis:**
```bash
# Check if registered
cat .claude/settings.json | grep "hook-name"

# If no output, hook is not registered
```

**Solution:**
Register hook in `.claude/settings.json` with appropriate trigger pattern.

### Issue: Hook returns permission denied

**Symptoms:**
- Error: `Permission denied: trinity-hooks/hook-name.sh`

**Solution:**
```bash
chmod +x trinity-hooks/hook-name.sh
chmod +x .claude/hooks/hook-name.sh
```

### Issue: Hook blocks action unintentionally

**Symptoms:**
- PreToolUse hook prevents desired action

**Solution:**
- Check hook logic and exit codes
- Exit 0 allows action to continue
- Exit 1 blocks action
- Fix hook logic or change to PostToolUse if blocking not needed

### Issue: Invalid JSON in settings.json

**Symptoms:**
- Claude Code fails to load hooks
- Error messages about JSON parsing

**Solution:**
```bash
# Validate JSON syntax
cat .claude/settings.json | python -m json.tool

# If error, fix JSON syntax (missing commas, brackets, quotes)
```

---

## Additional Resources

- **Hook Command Reference:** `/trinity-hooks` in Claude Code
- **Trinity Hooks Library:** Check `trinity-hooks/README.md` in your project
- **Claude Code Hooks Documentation:** [https://docs.claude.com/claude-code/hooks](https://docs.claude.com/claude-code/hooks)
- **Settings Configuration:** `.claude/settings.json` in your project

---

## Next Steps

### Set Up Your First Custom Hook

1. Identify a workflow that needs automation
2. Create hook script following examples above
3. Register in `.claude/settings.json`
4. Test both manually and through trigger
5. Document in project's hook library

### Explore Advanced Patterns

- Chain multiple hooks for complex workflows
- Use environment variables in hook scripts
- Create project-specific hooks for team workflows
- Share hook patterns in `trinity/patterns/`

---

**You're now ready to configure and manage hooks in Trinity Method SDK!**

Use `/trinity-hooks` to view your hooks and their registration status.
