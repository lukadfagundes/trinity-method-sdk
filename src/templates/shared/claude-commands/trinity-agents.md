---
description: Display Trinity agent directory and information
---

Display the Trinity Method Agent Directory with all 19 specialized agents.

**Important:** Claude doesn't "delegate" to agents. When you invoke an agent or slash command, Claude adopts that agent's persona and expertise to help you. All agents are Claude with specialized context and responsibilities.

## Agent Organization

Agents are organized in 5 subdirectories by role:

### 1. Leadership Team (3 agents)
Located in: `.claude/agents/leadership/`
- **ALY (Chief Technology Officer)** - Strategic planning and architecture decisions
- **AJ MAESTRO (Orchestration Lead)** - Workflow planning and agent coordination
- **AJ CC (Code Coordinator)** - Code quality and implementation oversight

### 2. Deployment Team (4 agents)
Located in: `.claude/agents/deployment/`
- **TAN (Structure Specialist)** - Trinity infrastructure deployment and verification
- **ZEN (Knowledge Base Specialist)** - Documentation and knowledge management
- **INO (Context Specialist)** - CLAUDE.md hierarchy and ISSUES.md database
- **EIN (CI/CD Specialist)** - Continuous integration and deployment pipelines

### 3. Audit Team (1 agent)
Located in: `.claude/agents/audit/`
- **JUNO (Quality Auditor)** - Comprehensive compliance audits and quality validation

### 4. Planning Team (4 agents)
Located in: `.claude/agents/planning/`
- **MON (Requirements Analyst)** - Scale determination and acceptance criteria
- **ROR (Design Architect)** - Technical design and ADR documentation
- **TRA (Work Planner)** - Implementation sequencing and BAS quality gates
- **EUS (Task Decomposer)** - Atomic task breakdown following TDD

### 5. AJ Implementation Team (7 agents)
Located in: `.claude/agents/aj-team/`
- **KIL (Task Executor)** - TDD implementation specialist (RED-GREEN-REFACTOR)
- **BAS (Quality Gate)** - 6-phase validation (Lint, Structure, Build, Test, Coverage, Practices)
- **DRA (Code Reviewer)** - Design Doc compliance validation
- **APO (Documentation Specialist)** - API documentation and inline comments
- **BON (Dependency Manager)** - Package management and security
- **CAP (Configuration Specialist)** - Environment and configuration files
- **URO (Refactoring Specialist)** - Code refactoring and technical debt reduction

## Usage

Ask which agent you want to learn more about, and Claude will read that agent's template from `.claude/agents/{subdirectory}/` and provide a detailed summary of their capabilities and responsibilities.

**Example:** "Tell me about MON's requirements analysis process"
