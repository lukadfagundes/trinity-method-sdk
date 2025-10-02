# Trinity Method Slash Commands Guide

## Overview

The Trinity Method SDK deploys 8 specialized slash commands for Claude Code that streamline your investigation-first development workflow. These commands are available in the `.claude/commands/` directory after deployment.

## Available Slash Commands

### `/trinity-init`
**Purpose:** Complete Trinity Method integration

**What it does:**
1. Runs TAN agent (structure deployment)
2. Runs ZEN agent (knowledge base creation)
3. Runs INO agent (context establishment)
4. Runs JUNO agent (comprehensive audit)

**When to use:**
- First-time Trinity Method setup
- Post-deployment verification
- After major SDK updates

**Usage:**
```
/trinity-init
```

### `/trinity-verify`
**Purpose:** Verify Trinity Method installation completeness

**What it does:**
- Checks all required directories exist
- Verifies core documentation is present
- Validates agent deployment
- Confirms hook installation

**When to use:**
- After initial deployment
- Troubleshooting deployment issues
- Pre-work order verification

**Usage:**
```
/trinity-verify
```

### `/trinity-start`
**Purpose:** Begin a new Trinity Method workflow session

**What it does:**
- Creates session documentation
- Sets up investigation tracking
- Initializes work order context
- Prepares development environment

**When to use:**
- Start of each development session
- Beginning new work orders
- After breaks or context switches

**Usage:**
```
/trinity-start
```

### `/trinity-continue`
**Purpose:** Resume work after interruption

**What it does:**
- Reviews current session state via ALY agent
- Loads active work orders
- Restores investigation context
- Summarizes progress

**When to use:**
- After context loss or interruption
- Resuming from previous session
- Switching back to Trinity work

**Usage:**
```
/trinity-continue
```

### `/trinity-end`
**Purpose:** End session and archive work

**What it does:**
- Archives session to `trinity/archive/`
- Captures final state
- Updates knowledge base
- Generates session summary

**When to use:**
- End of development session
- Work order completion
- Before major context switches

**Usage:**
```
/trinity-end
```

### `/trinity-workorder`
**Purpose:** Create Trinity Method work orders interactively

**What it does:**
- Guides through work order creation
- Enforces work order format
- Generates proper WO-### numbering
- Places in `trinity/work-orders/`

**When to use:**
- Creating new tasks
- Formalizing requirements
- Structured project planning

**Usage:**
```
/trinity-workorder
```

### `/trinity-docs`
**Purpose:** Quick access to Trinity Method documentation

**What it does:**
- Displays available documentation
- Provides direct links to key docs
- Shows methodology overview
- References investigation templates

**When to use:**
- Learning Trinity Method
- Quick reference during work
- Finding specific documentation

**Usage:**
```
/trinity-docs
```

### `/trinity-agents`
**Purpose:** Display Trinity agent directory

**What it does:**
- Lists all 7 specialized agents
- Shows agent roles and capabilities
- Explains when to use each agent
- References EMPLOYEE-DIRECTORY.md

**When to use:**
- Understanding agent system
- Choosing right agent for task
- Team onboarding

**Usage:**
```
/trinity-agents
```

## Slash Command Workflow

### Typical Session Flow

```bash
# 1. Start new session
/trinity-start

# 2. Create work order for task
/trinity-workorder

# 3. Begin investigation and development
# ... work happens here ...

# 4. If interrupted, resume with:
/trinity-continue

# 5. End session when complete
/trinity-end
```

### First-Time Setup Flow

```bash
# 1. Deploy Trinity Method SDK
trinity deploy

# 2. Verify installation
/trinity-verify

# 3. Initialize all agents
/trinity-init

# 4. Review documentation
/trinity-docs

# 5. Understand agent system
/trinity-agents

# 6. Start first session
/trinity-start
```

## Command Customization

All slash commands are markdown files in `.claude/commands/` and can be customized for your workflow:

```bash
.claude/commands/
├── trinity-init.md
├── trinity-verify.md
├── trinity-start.md
├── trinity-continue.md
├── trinity-end.md
├── trinity-workorder.md
├── trinity-docs.md
└── trinity-agents.md
```

### Customization Examples

**Add project-specific context:**
```markdown
---
description: Start Trinity session for MyProject
---

Start a new Trinity Method development session for MyProject.

**Project Context:**
- Backend: FastAPI
- Database: PostgreSQL
- Team: 5 developers
```

**Integrate with existing tools:**
```markdown
---
description: End session and sync with Jira
---

End the Trinity Method session, archive work, and update related Jira tickets.
```

## Best Practices

### DO:
- ✅ Use `/trinity-start` at the beginning of each session
- ✅ Create work orders with `/trinity-workorder` for all tasks
- ✅ Run `/trinity-verify` after deployment
- ✅ Use `/trinity-continue` when resuming work
- ✅ End sessions with `/trinity-end` for proper archival

### DON'T:
- ❌ Skip session start/end commands (breaks continuity)
- ❌ Create work orders manually (use `/trinity-workorder`)
- ❌ Ignore verification failures (fix before proceeding)
- ❌ Forget to archive sessions (knowledge loss)

## Troubleshooting

### Slash Command Not Found

**Problem:** Command doesn't appear in Claude Code

**Solution:**
1. Verify `.claude/commands/` exists
2. Check file has proper YAML frontmatter:
   ```markdown
   ---
   description: Command description here
   ---
   ```
3. Restart Claude Code
4. Run `/trinity-verify` to diagnose

### Command Execution Errors

**Problem:** Command runs but fails

**Solution:**
1. Check Trinity directory structure exists
2. Verify agents are deployed (`.claude/agents/`)
3. Ensure CLAUDE.md is present
4. Review session state in `trinity/sessions/`

### Custom Commands Not Working

**Problem:** Modified command doesn't work as expected

**Solution:**
1. Verify YAML frontmatter is valid
2. Check for syntax errors in markdown
3. Ensure file permissions are correct
4. Test with original command first

## Advanced Usage

### Chaining Commands

For complex workflows, chain commands together:

```bash
# Complete setup and start work
/trinity-verify
/trinity-init
/trinity-start
/trinity-workorder
```

### Integration with Hooks

Slash commands work with Trinity hooks for automation:

```bash
# trinity-hooks/pre-session.sh
# Auto-runs before /trinity-start
echo "Preparing session environment..."
git pull origin dev
npm install
```

### Command Aliases

Create shorter aliases by duplicating command files:

```bash
# Create alias: /ti -> /trinity-init
cp .claude/commands/trinity-init.md .claude/commands/ti.md

# Create alias: /ts -> /trinity-start
cp .claude/commands/trinity-start.md .claude/commands/ts.md
```

## See Also

- [Getting Started Guide](../getting-started.md)
- [Work Order Guide](work-orders.md)
- [Agent System Guide](agents.md)
- [CLI Commands Reference](../api/cli-commands.md)
