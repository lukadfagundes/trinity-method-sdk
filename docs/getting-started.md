# Getting Started with Trinity Method SDK

## What is Trinity Method SDK?

Trinity Method SDK is an **investigation-first development methodology** designed exclusively for [Claude Code](https://claude.com/claude-code), Anthropic's AI pair programming environment. It transforms how you work with AI by enforcing systematic investigation before implementation, creating persistent knowledge across sessions, and deploying 18 specialized AI agents in the v2.0 architecture.

### Why Trinity Method?

**The Problem:**
- AI jumps straight to code without understanding context
- No investigation before implementation
- Knowledge lost between sessions
- Inconsistent code quality
- Manual project setup for every repo

**The Solution:**
- 🔍 **Investigation-first**: Understand before building
- 📚 **Persistent knowledge**: Never lose context
- 🤖 **18 Specialized agents (v2.0)**: AI-orchestrated development with planning, execution, and support layers
- 📋 **Work order system**: Structured task management
- 🚀 **90-second deployment**: Production-ready structure instantly

## Installation

### Prerequisites

- **Node.js**: 16.0.0 or higher
- **Claude Code**: Latest version
- **Git**: For version control (recommended)

### Global Installation

```bash
npm install -g @trinity-method/cli
```

Verify installation:

```bash
trinity --version
# Output: 1.0.0 (Trinity Method SDK)
```

### Development Installation

For development or contribution:

```bash
git clone https://github.com/lukadfagundes/trinity-method-sdk.git
cd trinity-method-sdk/packages/cli
npm install
npm link
```

## Quick Start (5 Minutes)

### Step 1: Deploy to Your Project

Navigate to your project:

```bash
cd /path/to/your/project
```

Deploy Trinity Method:

```bash
trinity deploy
```

**Interactive prompts:**

1. **Project name?** (defaults to directory name)
   ```
   ? What is your project name? MyAwesomeApp
   ```

2. **Linting setup?**
   ```
   ? Would you like to set up linting tools?
   ❯ Recommended (ESLint + Prettier + Pre-commit hooks)
     Custom (choose your tools)
     Skip (no linting setup)
   ```

**What happens (v2.0):**
- ✅ Creates `trinity/` directory structure with knowledge base
- ✅ Creates `.claude/` directory with 18 agents (v2.0 architecture)
- ✅ Deploys 26 slash commands to `.claude/commands/`
- ✅ Creates `trinity-hooks/` for session management
- ✅ Generates `CLAUDE.md` and `TRINITY.md`
- ✅ Deploys 4 best practices documents (CODING-PRINCIPLES, TESTING-PRINCIPLES, AI-DEVELOPMENT-GUIDE, DOCUMENTATION-CRITERIA)
- ✅ Configures linting tools (if selected)
- ✅ Deploys in ~10 seconds

### Step 2: Verify Deployment

Check deployment status:

```bash
trinity status
```

**Expected output:**
```
Trinity Method SDK Status

Project: MyAwesomeApp
Version: 1.0.0
Deployed: 2025-10-02

Structure:
✓ trinity/knowledge-base/
✓ trinity/work-orders/
✓ trinity/investigations/
✓ trinity/patterns/
✓ trinity/sessions/
✓ trinity/templates/
✓ .claude/agents/ (18 agents)
✓ .claude/commands/ (18 slash commands)

Agents:
✓ ALY (CTO) - Strategic leadership
✓ AJ (Chief Code) - Implementation
✓ TAN - Structure deployment
✓ ZEN - Knowledge base
✓ INO - Context hierarchy
✓ EIN - CI/CD automation
✓ JUNO - Quality auditor

Status: Ready
```

### Step 3: Install Linting Dependencies

If you selected linting during deployment:

**Node.js/TypeScript projects:**
```bash
npm install
```

**Python projects:**
```bash
pip install -r requirements-dev.txt
```

**Setup pre-commit hooks** (one-time):
```bash
pip install pre-commit
pre-commit install
```

### Step 4: Initialize Trinity Agents

In Claude Code, run:

```bash
/trinity-init
```

This will:
1. Run **TAN** agent (structure verification)
2. Run **ZEN** agent (knowledge base setup)
3. Run **INO** agent (context hierarchy)
4. Run **JUNO** agent (quality audit)

**You're ready to start development!**

## What Gets Deployed

### Complete Directory Structure

```
your-project/
├── CLAUDE.md                    # Global project context for AI
├── TRINITY.md                   # Trinity Method guide
├── .eslintrc.json              # ESLint config (if selected)
├── .prettierrc.json            # Prettier config (if selected)
├── .pre-commit-config.yaml     # Pre-commit hooks (if selected)
│
├── trinity/                     # Trinity Method core
│   ├── CLAUDE.md               # Trinity enforcement context
│   ├── VERSION                 # SDK version tracking
│   ├── knowledge-base/
│   │   ├── ARCHITECTURE.md     # System architecture docs
│   │   ├── ISSUES.md           # Known issues tracker
│   │   ├── To-do.md            # Task management
│   │   ├── Technical-Debt.md   # Debt tracking with metrics
│   │   └── Trinity.md          # Project-specific guide
│   ├── investigations/         # Investigation work products
│   ├── patterns/               # Reusable solution patterns
│   ├── sessions/               # Active session artifacts
│   ├── templates/              # 6 work order templates (.md)
│   │   ├── INVESTIGATION-TEMPLATE.md
│   │   ├── IMPLEMENTATION-TEMPLATE.md
│   │   ├── ANALYSIS-TEMPLATE.md
│   │   ├── AUDIT-TEMPLATE.md
│   │   ├── PATTERN-TEMPLATE.md
│   │   └── VERIFICATION-TEMPLATE.md
│   └── work-orders/            # Active work orders
│
├── .claude/                     # Claude Code integration
│   ├── agents/                 # 7 specialized AI agents
│   │   ├── leadership/
│   │   │   ├── trinity-cc.md   # AJ (Chief Code)
│   │   │   └── trinity-cto.md  # ALY (CTO)
│   │   ├── deployment/
│   │   │   ├── trinity-tan.md  # TAN (Structure)
│   │   │   ├── trinity-zen.md  # ZEN (Knowledge)
│   │   │   ├── trinity-ino.md  # INO (Context)
│   │   │   └── ein-cicd.md     # EIN (CI/CD)
│   │   └── audit/
│   │       └── trinity-juno.md # JUNO (Auditor)
│   ├── commands/               # 8 Trinity slash commands
│   │   ├── trinity-init.md
│   │   ├── trinity-verify.md
│   │   ├── trinity-start.md
│   │   ├── trinity-continue.md
│   │   ├── trinity-end.md
│   │   ├── trinity-workorder.md
│   │   ├── trinity-docs.md
│   │   └── trinity-agents.md
│   ├── hooks/                  # Claude Code automation
│   │   ├── user-prompt-submit.sh
│   │   └── tool-bash.sh
│   ├── EMPLOYEE-DIRECTORY.md   # Agent documentation
│   └── settings.json           # Claude Code configuration
│
├── trinity-hooks/              # Session management
│   ├── session-end-archive.sh
│   └── prevent-git.sh
│
└── src/ (or lib/)
    └── CLAUDE.md               # Technology-specific context
```

### Hierarchical Context System

Trinity deploys a **3-tier CLAUDE.md hierarchy**:

1. **Root CLAUDE.md** - Global project context
2. **trinity/CLAUDE.md** - Trinity Method enforcement
3. **src/CLAUDE.md** - Technology-specific rules

This ensures AI agents always have the right context at the right level.

## Your First Session

### 1. Start a Session

```bash
/trinity-start
```

This creates session documentation in `trinity/sessions/` and prepares the work environment.

### 2. Create a Work Order

```bash
/trinity-workorder
```

Follow the interactive prompts to create a formalized work order. Example:

```markdown
# Work Order: WO-001 - Add User Authentication

## Objective
Implement JWT-based user authentication system

## Investigation Required
1. Research authentication best practices
2. Analyze current user model
3. Identify security requirements

## Implementation Steps
1. Create authentication endpoints
2. Implement JWT token generation
3. Add authentication middleware
4. Write tests

## Acceptance Criteria
- [ ] User can register and login
- [ ] JWT tokens expire after 24 hours
- [ ] All tests pass (>80% coverage)
- [ ] API documentation updated
```

### 3. Conduct Investigation

Before coding, investigate:

```markdown
# Investigation: User Authentication

## Current State
- No authentication system exists
- User model has email and password fields
- No session management

## Best Practices Research
- JWT with refresh tokens recommended
- bcrypt for password hashing
- HTTPS-only cookies for tokens

## Edge Cases Identified
- [ ] Password reset flow
- [ ] Token refresh mechanism
- [ ] Concurrent login sessions
- [ ] Account lockout after failed attempts

## Approach Decided
Use JWT with httpOnly cookies, 24-hour access tokens,
7-day refresh tokens, bcrypt with 10 rounds.
```

Save investigation to `trinity/investigations/2025-10-02-user-auth.md`

### 4. Implement with Debugging

Now implement with Trinity debugging patterns:

```javascript
// Example: Authentication with Trinity debugging
function authenticateUser(email, password) {
  console.log('[TRINITY AUTH]', {
    action: 'authenticateUser',
    email: email,
    timestamp: new Date().toISOString()
  });

  try {
    const user = findUserByEmail(email);

    if (!user) {
      console.warn('[TRINITY AUTH FAIL]', {
        reason: 'User not found',
        email: email
      });
      return null;
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);

    console.log('[TRINITY AUTH]', {
      action: 'authenticateUser',
      success: isValid,
      userId: user.id
    });

    return isValid ? user : null;
  } catch (error) {
    console.error('[TRINITY AUTH ERROR]', {
      error: error.message,
      email: email
    });
    throw error;
  }
}
```

### 5. End Session

```bash
/trinity-end
```

This archives the session to `trinity/archive/` with:
- Session summary
- Work completed
- Investigations conducted
- Patterns discovered

## Daily Workflow

### Morning Routine

```bash
# 1. Start session
/trinity-start

# 2. Review current work
cat trinity/knowledge-base/To-do.md

# 3. Check for any issues
cat trinity/knowledge-base/ISSUES.md
```

### During Work

```bash
# Create work orders for tasks
/trinity-workorder

# Use agents for specific tasks
# - ALY for strategic decisions
# - AJ for implementation
# - JUNO for code review

# Document investigations
# Save to trinity/investigations/
```

### End of Day

```bash
# Archive session
/trinity-end

# Review what was accomplished
trinity review

# Commit work (if ready)
git add .
git commit -m "WO-001: User authentication implementation"
```

## Available Commands

### Core Commands

```bash
trinity deploy          # Deploy Trinity Method to project
trinity status          # Check deployment status
trinity update          # Update to latest SDK version
trinity review          # Review session history
trinity --version       # Show SDK version
trinity --help          # Show help
```

### Slash Commands (in Claude Code)

```bash
/trinity-init           # Initialize all Trinity agents
/trinity-verify         # Verify installation
/trinity-start          # Start new session
/trinity-continue       # Resume after interruption
/trinity-end            # End and archive session
/trinity-workorder      # Create work order
/trinity-docs           # Access documentation
/trinity-agents         # List available agents
```

## Common Tasks

### Updating Trinity Method

```bash
trinity update
```

This updates:
- SDK templates
- Agent definitions
- Slash commands
- Hooks

**Preserves:**
- Your investigations
- Work orders
- Session history
- Custom patterns
- Knowledge base content

### Reviewing Sessions

```bash
trinity review
```

Shows:
- Recent sessions
- Work orders completed
- Investigations conducted
- Patterns discovered

### Checking Deployment Health

```bash
trinity status
```

Verifies:
- All directories exist
- Agents deployed correctly
- Slash commands available
- Hooks configured
- Version information

## Troubleshooting

### Issue: Slash commands not appearing

**Cause:** Claude Code hasn't loaded the commands

**Solution:**
1. Restart Claude Code
2. Run `/trinity-verify` to check installation
3. Ensure `.claude/commands/` contains all 8 `.md` files
4. Check that each file has YAML frontmatter:
   ```yaml
   ---
   description: Command description
   ---
   ```

### Issue: Linting not working

**Cause:** Dependencies not installed

**Solution:**
```bash
# Node.js projects
npm install

# Python projects
pip install -r requirements-dev.txt

# Setup pre-commit hooks
pip install pre-commit
pre-commit install
```

### Issue: Agents not accessible

**Cause:** Agents not deployed or incorrect directory

**Solution:**
1. Check `.claude/agents/` exists
2. Run `trinity status` to verify
3. Re-deploy if needed: `trinity deploy --force`

### Issue: Trinity already deployed error

**Cause:** Existing `trinity/` directory found

**Solution:**
```bash
# Check what's deployed
trinity status

# Force re-deploy (WARNING: overwrites templates)
trinity deploy --force

# Or manually remove and re-deploy
rm -rf trinity/ .claude/ trinity-hooks/
trinity deploy
```

## Best Practices

### ✅ DO:

- **Always investigate first** - Use investigation templates before coding
- **Create work orders** - Formalize all non-trivial tasks
- **Use slash commands** - `/trinity-start`, `/trinity-end` for every session
- **Document patterns** - Save reusable solutions to `trinity/patterns/`
- **Review sessions** - Use `trinity review` to track progress
- **Update regularly** - Keep SDK current with `trinity update`

### ❌ DON'T:

- **Skip investigation** - Never jump straight to implementation
- **Ignore work orders** - Don't work without formalized tasks
- **Forget to archive** - Always end sessions with `/trinity-end`
- **Modify templates directly** - Copy and customize instead
- **Delete investigations** - Archive is permanent knowledge
- **Commit without debugging** - Always include Trinity debugging

## Next Steps

### Learn the Methodology

1. **Read the guides:**
   - [Investigation-First Methodology](methodology/investigation-first.md)
   - [Work Orders Guide](guides/work-orders.md)
   - [CC Work Order Protocol](methodology/cc-work-order-protocol.md)

2. **Explore slash commands:**
   - [Slash Commands Guide](guides/slash-commands.md)

3. **Understand the agents:**
   - Read `.claude/EMPLOYEE-DIRECTORY.md`
   - Review agent prompts in `.claude/agents/`

### Advanced Topics

- [Deployment Guide](deployment-guide.md) - Advanced deployment options
- [Implementation Guide](implementation-guide.md) - Detailed methodology
- [Customization Guide](customization-guide.md) - Tailor Trinity to your needs
- [CLI Commands Reference](api/cli-commands.md) - Complete command documentation

### Examples

Check out framework-specific examples:
- [React/Next.js Example](../examples/framework-specific/react-nextjs/README.md)
- [Node.js/Express Example](../examples/framework-specific/nodejs-express/README.md)
- [Python/FastAPI Example](../examples/framework-specific/python-fastapi/README.md)
- [Mobile Apps Example](../examples/project-types/mobile-apps/README.md)

## Getting Help

### Documentation

- **This guide**: Quick start and basics
- **Full docs**: `docs/` directory in SDK
- **Examples**: `examples/` directory with real implementations
- **In-project**: Read `TRINITY.md` after deployment

### Community

- **Issues**: [GitHub Issues](https://github.com/lukadfagundes/trinity-method-sdk/issues)
- **Discussions**: Share patterns and ask questions

### Within Claude Code

```bash
# Quick reference
/trinity-docs

# Agent directory
/trinity-agents

# Verify installation
/trinity-verify
```

---

**You're now ready to start investigation-first development with Trinity Method!**

Run `trinity deploy` in your project to begin.