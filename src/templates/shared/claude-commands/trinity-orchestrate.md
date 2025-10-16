---
description: Orchestrate implementation using AJ MAESTRO and 11-agent team
---

# Trinity Orchestration - AJ MAESTRO

**Purpose:** Orchestrate complex implementations using the AJ MAESTRO 11-agent team with scale-based workflows.

## Scale-Based Orchestration

AJ MAESTRO automatically determines implementation scale and coordinates the appropriate workflow:

### Small Scale (1-2 files, 0 stop points)
- Direct execution by KIL with BAS quality gate
- Minimal coordination overhead
- Fast iteration cycle

### Medium Scale (3-5 files, 2 stop points)
- **Stop 1:** Design approval (ROR)
- Implementation by KIL with BAS gates
- **Stop 2:** Final review (DRA + user approval)

### Large Scale (6+ files, 4 stop points)
- **Stop 1:** Requirements review (MON)
- **Stop 2:** Design approval (ROR)
- **Stop 3:** Plan approval (TRA)
- Implementation with full BAS 6-phase gates
- **Stop 4:** Comprehensive review (DRA + JUNO audit)

## The 11-Agent Team

**Planning Layer:**
- **MON** - Requirements analysis
- **ROR** - Technical design & ADRs
- **TRA** - Work planning
- **EUS** - Task decomposition

**Execution Layer:**
- **KIL** - TDD implementation (RED-GREEN-REFACTOR)
- **BAS** - 6-phase quality gate
- **DRA** - Code review & Design Doc compliance

**Support Layer:**
- **APO** - API documentation
- **BON** - Dependency management
- **CAP** - Configuration files
- **URO** - Code refactoring

## Usage

Describe your implementation task and AJ MAESTRO will:
1. Determine scale (Small/Medium/Large)
2. Coordinate appropriate planning agents
3. Execute with quality gates
4. Ensure compliance and testing

**What would you like AJ MAESTRO to implement?**
