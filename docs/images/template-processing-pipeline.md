# Template Processing Pipeline

```mermaid
flowchart LR
    subgraph "Template Sources"
        T1[Agent Templates<br/>src/templates/agents/]
        T2[Command Templates<br/>src/templates/shared/]
        T3[Knowledge Base Templates<br/>src/templates/knowledge-base/]
        T4[Framework Templates<br/>src/templates/linting/]
    end

    subgraph "User Configuration"
        CONFIG[User Input<br/>Project Name: my-app<br/>Framework: Node.js<br/>Linting: ESLint+Prettier<br/>CI/CD: GitHub Actions]
    end

    subgraph "Variable Registry"
        VARS["Variable Map<br/>PROJECT_NAME = my-app<br/>FRAMEWORK = Node.js<br/>PACKAGE_MANAGER = npm<br/>LINTING_TOOL = ESLint<br/>CI_PLATFORM = GitHub Actions<br/>CURRENT_DATE = 2025-12-28<br/>VERSION = 2.0.3"]
    end

    subgraph "Processing Engine"
        READER[Template Reader<br/>fs-extra.readFile]
        PARSER["Variable Parser<br/>Regex pattern matcher"]
        SUBSTITUTOR["Variable Substitutor<br/>Replace VAR with value"]
        VALIDATOR["Output Validator<br/>Check no unresolved variables"]
    end

    subgraph "Output Generation"
        WRITER[File Writer<br/>fs-extra.writeFile]
        PERMS[Permission Setter<br/>chmod for scripts]
    end

    subgraph "Deployed Files"
        OUT1[.claude/agents/KIL.md<br/>19 agent files]
        OUT2[.claude/commands/trinity-start.md<br/>20 command files]
        OUT3[trinity/knowledge-base/Trinity.md<br/>9 knowledge base files]
        OUT4[.eslintrc.js + .prettierrc<br/>Framework-specific configs]
    end

    CONFIG --> VARS
    T1 --> READER
    T2 --> READER
    T3 --> READER
    T4 --> READER

    READER --> PARSER
    VARS --> PARSER
    PARSER --> SUBSTITUTOR
    SUBSTITUTOR --> VALIDATOR

    VALIDATOR --> DECISION{All Variables<br/>Resolved?}
    DECISION -->|No| ERROR([❌ Unresolved Variables<br/>Deployment Failed])
    DECISION -->|Yes| WRITER

    WRITER --> PERMS
    PERMS --> OUT1
    PERMS --> OUT2
    PERMS --> OUT3
    PERMS --> OUT4

    style CONFIG fill:#e1f5ff
    style VARS fill:#fff4e1
    style SUBSTITUTOR fill:#f0e1ff
    style OUT1 fill:#e1ffe1
    style OUT2 fill:#e1ffe1
    style OUT3 fill:#e1ffe1
    style OUT4 fill:#e1ffe1
    style ERROR fill:#ffe1e1
```

## Variable Substitution Example

### Template File: `src/templates/knowledge-base/Trinity.md.template`

````markdown
# Trinity Method - {{PROJECT_NAME}}

**Framework:** {{FRAMEWORK}}
**Package Manager:** {{PACKAGE_MANAGER}}
**Deployed:** {{CURRENT_DATE}}
**Version:** {{VERSION}}

## Quick Start

```bash
{{PACKAGE_MANAGER}} install
{{PACKAGE_MANAGER}} test
```
````

## Linting

This project uses {{LINTING_TOOL}} for code quality.

````

### After Processing → `trinity/knowledge-base/Trinity.md`

```markdown
# Trinity Method - my-app

**Framework:** Node.js
**Package Manager:** npm
**Deployed:** 2025-12-29
**Version:** 2.0.3

## Quick Start

```bash
npm install
npm test
````

## Linting

This project uses ESLint for code quality.

```

## Supported Variables

| Variable | Source | Example Value |
|----------|--------|---------------|
| `{{PROJECT_NAME}}` | User input or package.json | `my-app` |
| `{{FRAMEWORK}}` | Auto-detected or user input | `Node.js`, `Python`, `Rust`, `Flutter`, `Go` |
| `{{PACKAGE_MANAGER}}` | Auto-detected from framework | `npm`, `yarn`, `pnpm`, `pip`, `cargo`, `flutter`, `go` |
| `{{LINTING_TOOL}}` | User selection | `ESLint`, `Black`, `Clippy`, `Dart Analyzer` |
| `{{CI_PLATFORM}}` | User selection | `GitHub Actions`, `GitLab CI`, `CircleCI`, `Jenkins` |
| `{{CURRENT_DATE}}` | System date | `2025-12-28` |
| `{{VERSION}}` | SDK version | `2.0.3` |
| `{{NODE_VERSION}}` | Minimum Node.js version | `16.9.0` |

## Processing Implementation

**Location**: `src/cli/utils/templateProcessor.ts`

**Key Functions**:
- `processTemplate(templatePath, variables)` - Main processing function
- `extractVariables(templateContent)` - Parse {{VAR}} syntax
- `substituteVariables(content, variableMap)` - Replace variables
- `validateOutput(processedContent)` - Ensure no unresolved variables

**Performance**:
- In-memory processing for speed
- Async/await for non-blocking I/O
- Average processing time: ~50-100ms per template
- Batch processing for multiple files: ~2-3 seconds for 64 files

## Error Handling

- **Unresolved Variables**: Deployment fails if any `{{VAR}}` remains after substitution
- **Missing Templates**: Error if source template file not found
- **Write Failures**: Automatic rollback on file system errors
- **Permission Errors**: Validation of write permissions before processing
```
