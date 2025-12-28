# Trinity Deployment Architecture

```mermaid
graph TB
    subgraph "User Project"
        USER[User runs 'trinity deploy']
    end

    subgraph "Trinity CLI"
        CLI[CLI Entry Point<br/>dist/cli/index.js]
        DETECT[Framework Detection<br/>Node.js/Python/Rust/Flutter/Go]
        CONFIG[Interactive Configuration<br/>Linting & CI/CD Selection]
        PROCESS[Template Processing Engine<br/>Variable Substitution]
    end

    subgraph "Template Sources"
        AGENTS[Agent Templates<br/>src/templates/agents/]
        COMMANDS[Command Templates<br/>src/templates/shared/]
        KB[Knowledge Base Templates<br/>src/templates/knowledge-base/]
        INVEST[Investigation Templates<br/>src/templates/investigations/]
        LINT[Linting Templates<br/>src/templates/linting/]
        CI[CI/CD Templates<br/>src/templates/ci/]
    end

    subgraph "Deployed Components (64 total)"
        subgraph ".claude/"
            A1[19 Agents<br/>Planning: MON, ROR, TRA, EUS<br/>Execution: KIL, BAS, DRA<br/>Support: APO, BON, CAP, URO<br/>Leadership: ALY, JUNO<br/>Infrastructure: TAN, ZEN, INO, EIN, AJ]
            C1[20 Slash Commands<br/>Session/Planning/Execution<br/>Investigation/Utility]
            ED[EMPLOYEE-DIRECTORY.md]
        end

        subgraph "trinity/"
            KB1[Knowledge Base<br/>9 Files: Trinity.md, ARCHITECTURE.md<br/>ISSUES.md, To-do.md, etc.]
            TEMP[Templates<br/>Work Orders & Investigations]
            SESS[Sessions Directory]
            REP[Reports Directory]
        end

        LINTFILES[Linting Config<br/>ESLint/Prettier/Black/Flake8<br/>Clippy/Rustfmt/Dart Analyzer]
        CIFILES[CI/CD Workflows<br/>GitHub Actions/GitLab CI<br/>CircleCI/Jenkins]
    end

    USER --> CLI
    CLI --> DETECT
    DETECT --> CONFIG
    CONFIG --> PROCESS

    PROCESS --> AGENTS
    PROCESS --> COMMANDS
    PROCESS --> KB
    PROCESS --> INVEST
    PROCESS --> LINT
    PROCESS --> CI

    AGENTS --> A1
    COMMANDS --> C1
    COMMANDS --> ED
    KB --> KB1
    INVEST --> TEMP
    LINT --> LINTFILES
    CI --> CIFILES

    A1 --> COMPLETE[✅ Trinity Deployment Complete<br/>64 Components Deployed]
    C1 --> COMPLETE
    ED --> COMPLETE
    KB1 --> COMPLETE
    TEMP --> COMPLETE
    SESS --> COMPLETE
    REP --> COMPLETE
    LINTFILES --> COMPLETE
    CIFILES --> COMPLETE

    style USER fill:#e1f5ff
    style CLI fill:#fff4e1
    style COMPLETE fill:#e1ffe1
    style A1 fill:#f0e1ff
    style C1 fill:#f0e1ff
    style KB1 fill:#ffe1f0
```

## Deployment Flow

1. **User Initiation**: User runs `trinity deploy` in their project directory
2. **Framework Detection**: CLI detects project framework (Node.js, Python, Rust, Flutter, Go)
3. **Interactive Configuration**: User selects linting tools and CI/CD platform
4. **Template Processing**: Variable substitution ({{PROJECT_NAME}}, {{FRAMEWORK}}, etc.)
5. **Component Deployment**: 64 components deployed to `.claude/` and `trinity/` directories
6. **Validation**: Directory structure verified, .gitignore updated

## Components Deployed

- **19 Agents** → `.claude/agents/`
- **20 Slash Commands** → `.claude/commands/`
- **Employee Directory** → `.claude/EMPLOYEE-DIRECTORY.md`
- **9 Knowledge Base Files** → `trinity/knowledge-base/`
- **Investigation Templates** → `trinity/templates/`
- **Framework-specific Linting** → Root directory (ESLint, Black, Clippy, etc.)
- **CI/CD Workflows** → `.github/workflows/`, `.gitlab-ci.yml`, etc.
