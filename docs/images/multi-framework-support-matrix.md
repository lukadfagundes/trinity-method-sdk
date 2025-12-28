# Multi-Framework Support Matrix

## Framework Support Overview

```mermaid
graph TB
    subgraph "Trinity Method SDK"
        CORE[Trinity Core<br/>19 Agents + 20 Commands<br/>Investigation Templates<br/>Knowledge Base]
    end

    subgraph "Framework Detection"
        DETECT[Auto-Detection Engine<br/>Scans: package.json, requirements.txt<br/>Cargo.toml, pubspec.yaml, go.mod]
    end

    subgraph "Supported Frameworks"
        NODE[Node.js/React<br/>✅ Fully Supported]
        PYTHON[Python<br/>✅ Fully Supported]
        RUST[Rust<br/>✅ Fully Supported]
        FLUTTER[Flutter<br/>✅ Fully Supported]
        GO[Go<br/>✅ Supported]
    end

    subgraph "Framework-Specific Components"
        NODE_LINT[ESLint + Prettier<br/>eslint.config.js<br/>.prettierrc]
        PYTHON_LINT[Black + Flake8 + isort<br/>pyproject.toml<br/>.flake8<br/>.isort.cfg]
        RUST_LINT[Clippy + Rustfmt<br/>clippy.toml<br/>rustfmt.toml]
        FLUTTER_LINT[Dart Analyzer<br/>analysis_options.yaml]
        GO_LINT[gofmt<br/>Go standard tooling]

        NODE_CI[GitHub Actions<br/>Node.js workflow]
        PYTHON_CI[GitHub Actions<br/>Python workflow]
        RUST_CI[GitHub Actions<br/>Rust workflow]
        FLUTTER_CI[GitHub Actions<br/>Flutter workflow]
        GO_CI[GitHub Actions<br/>Go workflow]
    end

    CORE --> DETECT
    DETECT --> NODE
    DETECT --> PYTHON
    DETECT --> RUST
    DETECT --> FLUTTER
    DETECT --> GO

    NODE --> NODE_LINT
    NODE --> NODE_CI
    PYTHON --> PYTHON_LINT
    PYTHON --> PYTHON_CI
    RUST --> RUST_LINT
    RUST --> RUST_CI
    FLUTTER --> FLUTTER_LINT
    FLUTTER --> FLUTTER_CI
    GO --> GO_LINT
    GO --> GO_CI

    style CORE fill:#e1f5ff
    style NODE fill:#e1ffe1
    style PYTHON fill:#e1ffe1
    style RUST fill:#e1ffe1
    style FLUTTER fill:#e1ffe1
    style GO fill:#fff4e1
    style NODE_LINT fill:#f0e1ff
    style PYTHON_LINT fill:#f0e1ff
    style RUST_LINT fill:#f0e1ff
    style FLUTTER_LINT fill:#f0e1ff
    style GO_LINT fill:#f0e1ff
```

## Framework Compatibility Matrix

| Feature                 | Node.js | Python | Rust | Flutter | Go  |
| ----------------------- | ------- | ------ | ---- | ------- | --- |
| **Core Trinity**        |
| 19 Agents               | ✅      | ✅     | ✅   | ✅      | ✅  |
| 20 Slash Commands       | ✅      | ✅     | ✅   | ✅      | ✅  |
| Investigation Templates | ✅      | ✅     | ✅   | ✅      | ✅  |
| Knowledge Base          | ✅      | ✅     | ✅   | ✅      | ✅  |
| **Linting**             |
| ESLint + Prettier       | ✅      | ❌     | ❌   | ❌      | ❌  |
| Black + Flake8 + isort  | ❌      | ✅     | ❌   | ❌      | ❌  |
| Clippy + Rustfmt        | ❌      | ❌     | ✅   | ❌      | ❌  |
| Dart Analyzer           | ❌      | ❌     | ❌   | ✅      | ❌  |
| gofmt                   | ❌      | ❌     | ❌   | ❌      | ✅  |
| **Pre-commit Hooks**    | ✅      | ✅     | ✅   | ✅      | ⚠️  |
| **CI/CD**               |
| GitHub Actions          | ✅      | ✅     | ✅   | ✅      | ✅  |
| GitLab CI               | ✅      | ✅     | ✅   | ✅      | ✅  |
| CircleCI                | ✅      | ✅     | ⚠️   | ⚠️      | ⚠️  |
| Jenkins                 | ✅      | ✅     | ⚠️   | ⚠️      | ⚠️  |
| **Package Managers**    |
| npm/yarn/pnpm           | ✅      | ❌     | ❌   | ❌      | ❌  |
| pip                     | ❌      | ✅     | ❌   | ❌      | ❌  |
| cargo                   | ❌      | ❌     | ✅   | ❌      | ❌  |
| flutter                 | ❌      | ❌     | ❌   | ✅      | ❌  |
| go modules              | ❌      | ❌     | ❌   | ❌      | ✅  |

**Legend:**

- ✅ Fully Supported
- ⚠️ Partial Support (community templates available)
- ❌ Not Applicable

## Framework Detection Logic

```mermaid
flowchart TD
    START([Detection Start]) --> CHECK_PKG{package.json<br/>exists?}

    CHECK_PKG -->|Yes| NODE_DETECT[Framework: Node.js<br/>PM: npm/yarn/pnpm]
    CHECK_PKG -->|No| CHECK_REQ{requirements.txt or<br/>pyproject.toml exists?}

    CHECK_REQ -->|Yes| PYTHON_DETECT[Framework: Python<br/>PM: pip]
    CHECK_REQ -->|No| CHECK_CARGO{Cargo.toml<br/>exists?}

    CHECK_CARGO -->|Yes| RUST_DETECT[Framework: Rust<br/>PM: cargo]
    CHECK_CARGO -->|No| CHECK_FLUTTER{pubspec.yaml<br/>exists?}

    CHECK_FLUTTER -->|Yes| FLUTTER_DETECT[Framework: Flutter<br/>PM: flutter]
    CHECK_FLUTTER -->|No| CHECK_GO{go.mod<br/>exists?}

    CHECK_GO -->|Yes| GO_DETECT[Framework: Go<br/>PM: go]
    CHECK_GO -->|No| UNKNOWN[No Framework Detected<br/>Prompt User]

    NODE_DETECT --> APPLY[Apply Framework-Specific Templates]
    PYTHON_DETECT --> APPLY
    RUST_DETECT --> APPLY
    FLUTTER_DETECT --> APPLY
    GO_DETECT --> APPLY
    UNKNOWN --> PROMPT[User Manual Selection]
    PROMPT --> APPLY

    style START fill:#e1f5ff
    style NODE_DETECT fill:#e1ffe1
    style PYTHON_DETECT fill:#e1ffe1
    style RUST_DETECT fill:#e1ffe1
    style FLUTTER_DETECT fill:#e1ffe1
    style GO_DETECT fill:#e1ffe1
    style UNKNOWN fill:#fff4e1
    style APPLY fill:#f0e1ff
```

## Framework-Specific Template Deployment

### Node.js/React

**Deployed Files:**

- `.eslintrc.js` or `eslint.config.js` (flat config)
- `.prettierrc`
- `.eslintignore`
- `.prettierignore`
- `.pre-commit-config.yaml` (ESLint + Prettier hooks)
- `.github/workflows/nodejs.yml` (CI workflow)

**Package Manager Detection:**

1. Check for `package-lock.json` → npm
2. Check for `yarn.lock` → yarn
3. Check for `pnpm-lock.yaml` → pnpm
4. Default: npm

### Python

**Deployed Files:**

- `pyproject.toml` (Black + isort config)
- `.flake8`
- `.isort.cfg`
- `.pre-commit-config.yaml` (Black + Flake8 + isort hooks)
- `.github/workflows/python.yml` (CI workflow)

**Python Version Detection:**

- Read from `pyproject.toml` or `setup.py`
- Default: 3.8+

### Rust

**Deployed Files:**

- `clippy.toml`
- `rustfmt.toml`
- `.pre-commit-config.yaml` (Clippy + Rustfmt hooks)
- `.github/workflows/rust.yml` (CI workflow)

**Edition Detection:**

- Read from `Cargo.toml`
- Default: 2021 edition

### Flutter

**Deployed Files:**

- `analysis_options.yaml`
- `.pre-commit-config.yaml` (Dart Analyzer hooks)
- `.github/workflows/flutter.yml` (CI workflow)

**Flutter Version:**

- Detected from `pubspec.yaml`
- Default: Latest stable

### Go

**Deployed Files:**

- `.github/workflows/go.yml` (CI workflow with gofmt)
- Basic pre-commit support

**Go Version:**

- Read from `go.mod`
- Default: 1.21+

## CI/CD Platform Support

| Platform           | Template Location      | Supported Frameworks                   |
| ------------------ | ---------------------- | -------------------------------------- |
| **GitHub Actions** | `.github/workflows/`   | Node.js, Python, Rust, Flutter, Go     |
| **GitLab CI**      | `.gitlab-ci.yml`       | Node.js, Python, Rust, Flutter, Go     |
| **CircleCI**       | `.circleci/config.yml` | Node.js, Python (others via community) |
| **Jenkins**        | `Jenkinsfile`          | Node.js, Python (others via community) |

## Extension Points

Trinity Method SDK can be extended to support additional frameworks by:

1. **Adding Framework Detection**: Update `src/cli/utils/stackDetection.ts`
2. **Creating Templates**: Add framework-specific templates to `src/templates/linting/`
3. **Updating Variable Maps**: Add framework variables to template processor
4. **Adding CI/CD Workflows**: Create platform-specific workflow templates

## Community Contributions

Community-contributed framework support available for:

- **Java** (Maven/Gradle)
- **C#/.NET** (.NET CLI)
- **PHP** (Composer)
- **Ruby** (Bundler)

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for framework contribution guidelines.
