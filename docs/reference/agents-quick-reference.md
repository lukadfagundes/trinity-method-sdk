# Agent Quick Reference Card

**Trinity Version:** 2.0.7
**Last Updated:** 2026-01-02

Quick lookup table for Trinity's 19-agent team.

## Planning Agents (4)

| Agent   | Role                 | When to Use                                    | Tools             | Command                 |
| ------- | -------------------- | ---------------------------------------------- | ----------------- | ----------------------- |
| **MON** | Requirements Analyst | Define requirements, scale determination       | Read, Write, Edit | `/trinity-requirements` |
| **ROR** | Design Architect     | Technical design, ADRs                         | Read, Write, Edit | `/trinity-design`       |
| **EUS** | Task Decomposer      | Break down into atomic tasks, TDD cycles       | Read, Write, Edit | `/trinity-decompose`    |
| **TRA** | Work Planner         | Implementation sequencing, timeline estimation | Read, Write, Edit | `/trinity-plan`         |

## Execution Agents (3)

| Agent   | Role          | When to Use                                        | Tools                                          | Command                      |
| ------- | ------------- | -------------------------------------------------- | ---------------------------------------------- | ---------------------------- |
| **KIL** | Task Executor | Implement tasks following TDD (RED-GREEN-REFACTOR) | Read, Write, Edit, Glob, Grep, Bash, TodoWrite | (via `/trinity-orchestrate`) |
| **BAS** | Quality Gate  | Validate code quality (6-phase validation)         | Bash, Read, Edit, TodoWrite                    | (automatic after KIL)        |
| **DRA** | Code Reviewer | Design Doc compliance, quality escalation          | Read, Edit, Glob, Grep, TodoWrite              | (escalation scenarios)       |

## Support Agents (4)

| Agent   | Role                     | When to Use                                | Tools                        | Command                                                  |
| ------- | ------------------------ | ------------------------------------------ | ---------------------------- | -------------------------------------------------------- |
| **APO** | Documentation Specialist | Create/organize docs, README, CHANGELOG    | Read, Edit, Write            | `/trinity-readme`, `/trinity-docs`, `/trinity-changelog` |
| **BON** | Dependency Manager       | Add/update dependencies, security audits   | Bash, Read, Edit             | (direct invocation)                                      |
| **CAP** | Configuration Specialist | Manage config files, environment variables | Read, Write, Edit, Bash      | (direct invocation)                                      |
| **URO** | Refactoring Specialist   | Refactor code, reduce technical debt       | Read, Edit, Grep, Glob, Bash | (direct invocation)                                      |

## Leadership Agents (2)

| Agent    | Role                     | When to Use                                 | Tools                  | Command                                               |
| -------- | ------------------------ | ------------------------------------------- | ---------------------- | ----------------------------------------------------- |
| **ALY**  | Chief Technology Officer | Session management, strategic oversight     | Read, Write, Edit      | `/trinity-start`, `/trinity-continue`, `/trinity-end` |
| **JUNO** | Quality Auditor          | Audit Trinity deployment, quality assurance | Read, Bash, Glob, Grep | `/trinity-audit`                                      |

## Infrastructure Agents (6)

| Agent          | Role                      | When to Use                                   | Tools                        | Command                |
| -------------- | ------------------------- | --------------------------------------------- | ---------------------------- | ---------------------- |
| **TAN**        | Structure Specialist      | Verify Trinity folder structure               | Bash, Read, Edit, Glob, Grep | `/trinity-verify`      |
| **ZEN**        | Knowledge Base Specialist | Create comprehensive project documentation    | All tools                    | (direct invocation)    |
| **INO**        | Context Specialist        | Manage CLAUDE.md hierarchy, ISSUES.md         | Read, Write, Edit, Bash      | (direct invocation)    |
| **EIN**        | CI/CD Specialist          | Setup CI/CD pipelines with BAS quality gates  | Read, Write, Edit, Bash      | (direct invocation)    |
| **AJ MAESTRO** | Orchestration Coordinator | Coordinate multi-agent workflows              | All tools                    | `/trinity-orchestrate` |
| **AJ (CC)**    | Collaboration Coordinator | Support AJ MAESTRO with complex orchestration | All tools                    | (supports AJ MAESTRO)  |

---

## Quick Selection Guide

```
NEW FEATURE (complex)
└─> /trinity-orchestrate (AJ MAESTRO)
    └─> Full workflow: MON → ROR → EUS → TRA → KIL → BAS

REQUIREMENTS ANALYSIS
└─> /trinity-requirements (MON)

TECHNICAL DESIGN
└─> /trinity-design (ROR)

TASK BREAKDOWN
└─> /trinity-decompose (EUS)

IMPLEMENTATION PLAN
└─> /trinity-plan (TRA)

DOCUMENTATION
├─> /trinity-readme (APO)
├─> /trinity-docs (APO)
└─> /trinity-changelog (APO)

SESSION MANAGEMENT
├─> /trinity-start (ALY)
├─> /trinity-continue (ALY)
└─> /trinity-end (ALY)

QUALITY AUDIT
└─> /trinity-audit (JUNO)

STRUCTURE VERIFICATION
└─> /trinity-verify (TAN)

REFACTORING
└─> URO (direct invocation)
```

---

## Agent Workflow Chains

### Full Planning Chain

```
MON (Requirements) → ROR (Design) → EUS (Decompose) → TRA (Plan)
```

### Execution Loop

```
KIL (Execute Task) → BAS (Validate) → [Pass] → Next Task
                                   → [Fail] → KIL (Fix)
```

### Orchestrated Workflow

```
AJ MAESTRO → MON → ROR → EUS → TRA → KIL → BAS (loop) → DRA → Complete
```

---

## BAS Quality Gate 6 Phases

| Phase         | Check                       | Failure Action          |
| ------------- | --------------------------- | ----------------------- |
| 1. Syntax     | Code compiles/parses        | KIL fixes syntax        |
| 2. Type Check | Static types valid          | KIL fixes types         |
| 3. Linting    | ESLint/Clippy/Black passes  | KIL fixes lint errors   |
| 4. Format     | Prettier/Rustfmt compliant  | KIL formats code        |
| 5. Tests      | All tests pass              | KIL fixes failing tests |
| 6. Build      | Project builds successfully | KIL fixes build errors  |

---

## Common Agent Combinations

| Task                           | Agents Used                                    |
| ------------------------------ | ---------------------------------------------- |
| **Plan and implement feature** | AJ MAESTRO → MON → ROR → EUS → TRA → KIL → BAS |
| **Update documentation**       | APO                                            |
| **Add dependency**             | BON                                            |
| **Refactor codebase**          | URO → BAS                                      |
| **Setup CI/CD**                | EIN → BAS                                      |
| **Start Trinity session**      | ALY                                            |
| **Audit deployment**           | JUNO                                           |

---

## Further Reading

- [Agent Guide (Detailed)](../guides/agent-guide.md) - Comprehensive agent documentation
- [Slash Commands Reference](slash-commands-reference.md) - All 20 slash commands
- [CLI Commands](cli-commands.md) - Trinity CLI reference

---

**Trinity Method SDK v2.0.7** - 19-Agent Team Quick Reference
