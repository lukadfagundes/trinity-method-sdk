# Universal Trinity Method Principles

**Framework-Agnostic Core Methodology**
**Trinity Method SDK v2.0**
**Last Updated:** 2025-11-05

---

## Overview

Trinity Method's core principles work with ANY AI coding agent or development environment. The methodology is tool-independent, using universal formats (Markdown, file systems) and timeless principles (investigation-first, evidence-based, quality-first).

---

## The Agent-Agnostic Vision

```
Trinity Method works with:
├─ Claude Code (Anthropic)         ✅ Native SDK integration
├─ GitHub Copilot Workspace        ✅ Markdown-based
├─ Cursor AI                        ✅ File-based
├─ Aider                            ✅ CLI-compatible
├─ Replit Agent                     ✅ Context files
├─ Devin                            ✅ Workflow compatible
└─ Any future AI coding agent      ✅ Standard formats

Same methodology, different agent - Maximum flexibility
```

---

## The Three Universal Layers

### Layer 1: Core Methodology (100% Agent-Agnostic)

**Trinity's core uses only universal formats:**

```yaml
Universal Components:
  ✅ Markdown documentation        # Readable by any agent
  ✅ File system organization      # Standard directories
  ✅ Investigation-first process   # Methodology, not technology
  ✅ Work order templates          # Just markdown files
  ✅ Quality standards             # Language/tool independent
  ✅ Knowledge base structure      # Hierarchical files
  ✅ Session archiving             # Timestamped directories
```

**Core Directory Structure:**
```
project/
├── trinity/
│   ├── knowledge-base/
│   │   ├── Trinity.md              # Methodology guide
│   │   ├── ARCHITECTURE.md         # System architecture
│   │   ├── To-do.md               # Task management
│   │   ├── ISSUES.md              # Problem tracking
│   │   └── PATTERNS.md            # Discovered patterns
│   ├── investigations/            # Investigation reports
│   ├── design-docs/               # Technical designs
│   ├── work-orders/               # Structured tasks
│   ├── sessions/                  # Session archives
│   └── audits/                    # Quality audits
└── TRINITY.md                      # Root methodology guide

Works with: ANY agent that can read markdown files
```

---

### Layer 2: Agent Adapters (Agent-Specific Enhancements)

**Each AI agent has specific capabilities - Trinity adapts:**

#### Claude Code Integration
```
.claude/
├── agents/                        # 18 specialized subagents
│   ├── leadership/
│   │   ├── aly-cto.md
│   │   └── aj-maestro.md
│   ├── planning/                  # MON, ROR, TRA, EUS
│   ├── execution/                 # KIL, BAS, DRA
│   ├── support/                   # APO, BON, CAP, URO
│   ├── deployment/                # TAN, ZEN, INO, Ein
│   └── audit/                     # JUNO
├── commands/                      # 24 slash commands
└── hooks/                         # Event-driven automation

Features:
✅ Automatic subagent invocation
✅ Event-driven hooks
✅ Context management
✅ Multi-agent coordination
```

#### Cursor AI Integration
```
.cursorrules                       # Custom behavior rules
.cursor/
└── trinity-rules.md              # Trinity-specific guidance

Features:
✅ Custom rules file
✅ Context-aware completions
✅ Investigation prompts
```

#### GitHub Copilot Integration
```
.github/
├── copilot-instructions.md       # Workspace instructions
└── workflows/
    └── trinity-quality.yml       # CI/CD integration

Features:
✅ Workspace instructions
✅ Pull request integration
✅ CI/CD automation
```

#### Aider Integration
```
.aider.conf.yml                   # Aider configuration
.aider/
└── architect.md                  # Architect mode instructions

Features:
✅ CLI-based workflow
✅ Git integration
✅ Architect mode for planning
```

---

### Layer 3: Universal CLI Tool

**Single interface for all agents:**

```bash
# Deploy for specific agent
npx @trinity-method/cli deploy --agent claude
npx @trinity-method/cli deploy --agent cursor
npx @trinity-method/cli deploy --agent copilot
npx @trinity-method/cli deploy --agent aider

# Deploy core only (universal)
npx @trinity-method/cli deploy --agent universal

# Works everywhere
npx @trinity-method/cli status
npx @trinity-method/cli audit
npx @trinity-method/cli analyze
```

---

## The Five Universal Principles

### Principle 1: Investigation Before Implementation

**Universal Truth:** Understanding the problem is more important than the tool solving it.

**How it works across agents:**
- **Claude Code:** ALY coordinates investigation with specialized agents
- **Cursor:** User creates investigation document, Cursor assists analysis
- **Copilot:** Investigation document in .github/investigations/
- **Aider:** Architect mode for investigation phase
- **Manual:** Investigation template filled by developer

**Files Created (Universal):**
```
trinity/investigations/YYYY-MM-DD-problem-name.md

## Problem
[Description]

## Current State
[Evidence]

## Options Considered
[Analysis]

## Decision
[Chosen approach with rationale]
```

---

### Principle 2: Evidence-Based Decisions

**Universal Truth:** Data beats opinions.

**How it works across agents:**
- **Claude Code:** BAS agent provides performance baselines, metrics
- **Cursor:** Developer runs benchmarks, documents in investigation
- **Copilot:** CI/CD captures metrics automatically
- **Aider:** Developer provides evidence via CLI
- **Manual:** Evidence documented in investigation reports

**Evidence Types (Universal):**
- Performance baselines (response times, memory usage)
- Test coverage percentages
- Error logs and stack traces
- User feedback and bug reports
- Dependency vulnerability scans

---

### Principle 3: Quality Cannot Be Bypassed

**Universal Truth:** Tests must pass. Coverage must be ≥80%. Code must be reviewed.

**How it works across agents:**
- **Claude Code:** BAS 6-phase quality gates after every task
- **Cursor:** Pre-commit hooks enforce quality
- **Copilot:** GitHub Actions workflows enforce gates
- **Aider:** Git hooks validate before commit
- **Manual:** Developer runs quality checks manually

**Quality Gates (Universal):**
```yaml
Gate 1: Linting (ESLint, Prettier)
Gate 2: Structure (function length, parameters, nesting)
Gate 3: Build (TypeScript compilation)
Gate 4: Testing (all tests must pass)
Gate 5: Coverage (≥80% threshold)
Gate 6: Best Practices (error handling, no console.log)
```

---

### Principle 4: Knowledge Must Be Preserved

**Universal Truth:** Work without documentation is work lost.

**How it works across agents:**
- **Claude Code:** ZEN agent maintains knowledge base automatically
- **Cursor:** Developer updates knowledge base files
- **Copilot:** GitHub wiki or docs/ directory
- **Aider:** Session notes in trinity/sessions/
- **Manual:** Developer documents manually

**Knowledge Artifacts (Universal):**
```
trinity/knowledge-base/
├── ARCHITECTURE.md              # System design
├── PATTERNS.md                  # Reusable patterns
├── To-do.md                    # Task backlog
└── ISSUES.md                   # Known problems

trinity/sessions/YYYY-MM-DD-HH-MM/
├── SESSION-SUMMARY.md          # What was accomplished
├── investigation.md            # Problem analysis
├── design-doc.md              # Technical design
└── implementation-notes.md     # Code changes
```

---

### Principle 5: Systematic Approach Over Shortcuts

**Universal Truth:** Methodical work is faster than rushed work (in total time).

**How it works across agents:**
- **Claude Code:** KIL enforces TDD (RED-GREEN-REFACTOR)
- **Cursor:** Developer follows TDD with Cursor's assistance
- **Copilot:** Write test first, Copilot suggests implementation
- **Aider:** TDD workflow in CLI
- **Manual:** Developer writes test, then implementation

**TDD Cycle (Universal):**
```
RED Phase:
  1. Write failing test
  2. Run test suite → ❌ FAIL
  3. Verify failure is for correct reason

GREEN Phase:
  1. Write minimal code to pass
  2. Run test suite → ✅ PASS
  3. No more, no less

REFACTOR Phase:
  1. Improve code quality
  2. Run test suite → ✅ STILL PASS
  3. Commit if all tests pass
```

---

## Agent-Specific vs Universal Features

### What Changes Across Agents

**Automation Level:**
- **High:** Claude Code (18 agents, automatic orchestration)
- **Medium:** Cursor, Copilot (context-aware suggestions)
- **Low:** Aider (CLI-based, manual workflow)
- **Manual:** Any editor (developer drives everything)

**Integration Depth:**
- **Claude Code:** Native subagents, hooks, coordination
- **Cursor:** Rules file, context
- **Copilot:** Workspace instructions, PR comments
- **Aider:** Configuration file, architect mode

---

### What Never Changes

**The Fundamental Law:**
> "No updates without investigation. No changes without Trinity consensus. No shortcuts without consequences."

This is true regardless of tool.

**The Three Pillars:**
1. **Investigation-First Development** - Tool-independent
2. **Evidence-Based Decisions** - Data is data
3. **Systematic Quality Assurance** - Tests, coverage, review

**The Core Workflow:**
```
Investigation → Design → Implementation → Review → Audit

Small Scale:  Investigation → Implementation → Review
Medium Scale: Investigation → Design → Implementation → Review
Large Scale:  Investigation → Design → Plan → Decompose → Implement → Review → Audit
```

This workflow works with ANY agent.

---

## Cross-Agent Patterns

### Pattern 1: Investigation Template (Universal)

```markdown
# Investigation: [Problem Name]

**Date:** YYYY-MM-DD
**Investigator:** [Name or Agent]
**Type:** Technical / Performance / UX / Security

---

## Problem Statement
[Clear description of what needs investigation]

## Current State
[Evidence about current system behavior]

## Root Cause Analysis
[Why is this happening?]

## Solution Options

### Option 1: [Name]
**Pros:** [List]
**Cons:** [List]
**Effort:** [Time estimate]
**Risk:** [Assessment]

### Option 2: [Name]
**Pros:** [List]
**Cons:** [List]
**Effort:** [Time estimate]
**Risk:** [Assessment]

## Recommendation
[Chosen option with rationale]

## Expected Outcomes
[Measurable success criteria]

---

**This template works with ANY agent or manual process.**
```

---

### Pattern 2: Work Order Template (Universal)

```markdown
# Work Order: WO-###

**Type:** Implementation / Bug Fix / Refactoring / Investigation
**Priority:** P0 / P1 / P2 / P3
**Estimated Time:** [Hours]
**Assigned To:** [Person or Agent]
**Dependencies:** [List]

---

## Objective
[What needs to be accomplished]

## Deliverables
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
- [ ] [Deliverable 3]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Testing Requirements
- [ ] Unit tests (≥80% coverage)
- [ ] Integration tests (if applicable)
- [ ] E2E tests (if applicable)
- [ ] Performance benchmarks

---

**This template works with ANY agent or manual process.**
```

---

### Pattern 3: Quality Gate Checklist (Universal)

```yaml
Pre-Commit Checklist:
  - [ ] All tests pass
  - [ ] Test coverage ≥80%
  - [ ] Linting passes (no errors)
  - [ ] Code formatted (Prettier)
  - [ ] No console.log in production code
  - [ ] Error handling present in async functions
  - [ ] Documentation updated (if public API changes)
  - [ ] ARCHITECTURE.md updated (if architecture changes)

This checklist applies regardless of tooling.
```

---

## Adopting Trinity Method

### With Claude Code (Easiest)

```bash
npm install --save-dev @trinity-method/sdk
npx trinity deploy --agent claude
```

**Result:** Full 18-agent system, automatic orchestration, hooks

---

### With Cursor (Simple)

```bash
npm install --save-dev @trinity-method/sdk
npx trinity deploy --agent cursor
```

**Result:** Core methodology + Cursor rules file

---

### With GitHub Copilot (Integrated)

```bash
npm install --save-dev @trinity-method/sdk
npx trinity deploy --agent copilot
```

**Result:** Core methodology + Copilot instructions + CI/CD

---

### With Aider (CLI-Friendly)

```bash
npm install --save-dev @trinity-method/sdk
npx trinity deploy --agent aider
```

**Result:** Core methodology + Aider configuration

---

### Manual (Any Editor)

```bash
npm install --save-dev @trinity-method/sdk
npx trinity deploy --agent universal
```

**Result:** Core methodology only (markdown files, templates, structure)

**Developer drives:**
- Investigations (fill templates manually)
- Work orders (create from templates)
- Quality gates (run scripts manually)
- Knowledge base (update files manually)

---

## The Universal Truth

**Trinity Method is a methodology, not a tool.**

The 18 agents in Claude Code are an *implementation* of the methodology, not the methodology itself.

**Core Methodology:**
- Investigation-first
- Evidence-based decisions
- TDD enforcement
- Quality gates
- Knowledge preservation
- Session archiving

**These principles work with:**
- Claude Code (best experience - automated)
- Cursor (good experience - assisted)
- Copilot (good experience - integrated)
- Aider (functional - CLI-driven)
- Manual (possible - developer-driven)
- Any future AI agent (adaptable)

---

## Migration Paths

### From Manual to Claude Code

1. Deploy universal Trinity: `npx trinity deploy --agent universal`
2. Use methodology manually (templates, structure)
3. When ready: `npx trinity deploy --agent claude`
4. Gain automation, agents, orchestration

---

### From Cursor to Claude Code

1. Already have trinity/ structure
2. Already following investigation-first
3. Install SDK: `npm install @trinity-method/sdk`
4. Deploy Claude version: `npx trinity deploy --agent claude`
5. Keep existing knowledge base (compatible)

---

### From Claude Code to Any Agent

1. Core methodology preserved in trinity/
2. Markdown files readable by any agent
3. Can switch agents without losing methodology
4. Redeploy for new agent: `npx trinity deploy --agent cursor`

---

## Related Documentation

- [Trinity Framework](./trinity-framework.md) - Investigation, Implementation, Knowledge trinities
- [Investigation-First Development](./investigation-first-complete.md) - Complete methodology
- [Best Practices](../best-practices.md) - Cross-agent patterns
- [Commands Reference](../commands/README.md) - CLI tools

---

**Trinity Method: One methodology. Any agent. Maximum flexibility.**
