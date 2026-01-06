# Multi-Framework Guide: Trinity Across Languages

**Trinity Version:** 2.0.7
**Last Updated:** 2026-01-02

## Overview

Trinity Method SDK is globally designed to provide investigation-first development methodology support for most known project frameworks. While this guide focuses on the five frameworks with pre-configured templates (Node.js, Python, Rust, Flutter, and Go), Trinity's agent-based architecture and customizable deployment system can adapt to any programming language or framework.

This guide shows framework-specific deployment, linting configuration, CI/CD setup, and migration strategies for the officially supported frameworks.

## Supported Frameworks

| Framework         | Linting                | Package Manager | CI/CD                                        | Status             |
| ----------------- | ---------------------- | --------------- | -------------------------------------------- | ------------------ |
| **Node.js/React** | ESLint + Prettier      | npm, yarn, pnpm | GitHub Actions, GitLab CI, CircleCI, Jenkins | ✅ Fully Supported |
| **Python**        | Black + Flake8 + isort | pip             | GitHub Actions, GitLab CI, CircleCI, Jenkins | ✅ Fully Supported |
| **Rust**          | Clippy + Rustfmt       | cargo           | GitHub Actions, GitLab CI                    | ✅ Fully Supported |
| **Flutter**       | Dart Analyzer          | flutter         | GitHub Actions, GitLab CI                    | ✅ Fully Supported |
| **Go**            | gofmt                  | go modules      | GitHub Actions, GitLab CI                    | ✅ Supported       |

### Adapting Trinity to Other Frameworks

Trinity's 19-agent system and investigation-first methodology are framework-agnostic. For frameworks not listed above (Java, C#, PHP, Ruby, Kotlin, Swift, etc.), Trinity can still be deployed:

1. **Manual Deployment**: Select the closest framework during `trinity deploy`, then customize linting configs and CI/CD workflows post-deployment
2. **Core Trinity Components**: The 19 agents, 20 slash commands, investigation templates, and knowledge base work with any language
3. **Custom Configuration**: Edit deployed linting configs and CI/CD workflows to match your framework's tooling

**Example**: For a Java project, you might select "Node.js" during deployment, then replace `eslint.config.js` with `checkstyle.xml` and modify `.github/workflows/` to use Maven/Gradle.

---

## Node.js / React Deployment

### Prerequisites

```bash
node --version  # ≥16.9.0 required
npm --version   # or yarn/pnpm
```

### Deployment

```bash
cd your-nodejs-project
trinity deploy
# Select: Node.js → ESLint + Prettier → GitHub Actions → [project-name]
```

### Deployed Components

```
project/
├── eslint.config.js           # Flat config (ESLint 9.0+)
├── .prettierrc                # Prettier configuration
├── .prettierignore            # Prettier ignore patterns
├── .pre-commit-config.yaml    # ESLint + Prettier hooks
├── .github/workflows/nodejs.yml  # CI/CD workflow
├── .claude/                   # 19 agents + 20 commands
└── trinity/                   # Knowledge base
```

### Post-Deployment Setup

```bash
# Install linting dependencies
npm install -D eslint @eslint/js \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  prettier

# Install pre-commit
pip install pre-commit
pre-commit install

# Verify linting
npm run lint

# Run tests (if configured)
npm test
```

### Package Manager Detection

Trinity auto-detects package manager:

- `package-lock.json` → npm
- `yarn.lock` → yarn
- `pnpm-lock.yaml` → pnpm

### TypeScript Configuration

If using TypeScript, Trinity deploys:

- `eslint.config.js` with TypeScript parser
- Type-aware linting rules
- Pre-commit type checking

### React-Specific

For React projects, manually add React plugin:

```bash
npm install -D eslint-plugin-react
```

Update `eslint.config.js`:

```javascript
import react from 'eslint-plugin-react';

export default [
  // ... existing config
  {
    plugins: { react },
    rules: {
      'react/prop-types': 'warn',
      'react/react-in-jsx-scope': 'off', // React 17+
    },
  },
];
```

---

## Python Deployment

### Prerequisites

```bash
python --version  # ≥3.8 recommended
pip --version
```

### Deployment

```bash
cd your-python-project
trinity deploy
# Select: Python → Black + Flake8 + isort → GitHub Actions → [project-name]
```

### Deployed Components

```
project/
├── pyproject.toml             # Black + isort config
├── .flake8                    # Flake8 configuration
├── .isort.cfg                 # isort configuration
├── .pre-commit-config.yaml    # Black + Flake8 + isort hooks
├── .github/workflows/python.yml  # CI/CD workflow
├── .claude/                   # 19 agents + 20 commands
└── trinity/                   # Knowledge base
```

### Post-Deployment Setup

```bash
# Install linting tools
pip install black flake8 isort pre-commit

# Install pre-commit hooks
pre-commit install

# Run linting
black .
flake8
isort .

# Run tests (if using pytest)
pytest
```

### Python Version Detection

Trinity reads Python version from:

1. `pyproject.toml` (`requires-python`)
2. `setup.py` (`python_requires`)
3. Default: `3.8+`

### Virtual Environment Support

Trinity works with virtualenv, venv, conda:

```bash
# Create venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Deploy Trinity
trinity deploy

# Linting tools installed in venv
pip install black flake8 isort
```

---

## Rust Deployment

### Prerequisites

```bash
rustc --version
cargo --version
```

### Deployment

```bash
cd your-rust-project
trinity deploy
# Select: Rust → Clippy + Rustfmt → GitHub Actions → [project-name]
```

### Deployed Components

```
project/
├── clippy.toml                # Clippy configuration
├── rustfmt.toml               # Rustfmt configuration
├── .pre-commit-config.yaml    # Clippy + Rustfmt hooks
├── .github/workflows/rust.yml # CI/CD workflow
├── .claude/                   # 19 agents + 20 commands
└── trinity/                   # Knowledge base
```

### Post-Deployment Setup

```bash
# Install Rust components
rustup component add clippy rustfmt

# Install pre-commit (requires Python)
pip install pre-commit
pre-commit install

# Run linting
cargo clippy
cargo fmt

# Run tests
cargo test
```

### Rust Edition Detection

Trinity reads edition from `Cargo.toml`:

```toml
[package]
edition = "2021"  # Trinity detects this
```

### Workspace Support

For Rust workspaces:

```bash
# Deploy at workspace root
cd my-workspace
trinity deploy

# Clippy and Rustfmt apply to all workspace members
```

---

## Flutter Deployment

### Prerequisites

```bash
flutter --version
flutter doctor  # Verify setup
```

### Deployment

```bash
cd your-flutter-project
trinity deploy
# Select: Flutter → Dart Analyzer → GitHub Actions → [project-name]
```

### Deployed Components

```
project/
├── analysis_options.yaml      # Dart Analyzer config
├── .pre-commit-config.yaml    # Dart Analyzer hooks
├── .github/workflows/flutter.yml  # CI/CD workflow
├── .claude/                   # 19 agents + 20 commands
└── trinity/                   # Knowledge base
```

### Post-Deployment Setup

```bash
# Install pre-commit (requires Python)
pip install pre-commit
pre-commit install

# Run analysis
flutter analyze

# Run tests
flutter test

# Check formatting
dart format .
```

### Flutter Version Detection

Trinity reads Flutter/Dart version from `pubspec.yaml`:

```yaml
environment:
  sdk: '>=3.0.0 <4.0.0' # Trinity detects this
```

---

## Go Deployment

### Prerequisites

```bash
go version  # ≥1.21 recommended
```

### Deployment

```bash
cd your-go-project
trinity deploy
# Select: Go → gofmt → GitHub Actions → [project-name]
```

### Deployed Components

```
project/
├── .github/workflows/go.yml   # CI/CD workflow (includes gofmt)
├── .claude/                   # 19 agents + 20 commands
└── trinity/                   # Knowledge base
```

### Post-Deployment Setup

```bash
# gofmt is built into Go toolchain
gofmt -w .

# Optional: Install golangci-lint for advanced linting
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
golangci-lint run

# Run tests
go test ./...
```

### Go Module Detection

Trinity reads module from `go.mod`:

```go
module github.com/user/project  // Trinity detects this
go 1.21                          // Version detected
```

---

## Migration Between Frameworks

### Scenario: Migrating from Node.js to Rust

**Step 1: Remove Node.js Trinity Components**

```bash
# Backup customizations
cp -r trinity/knowledge-base/ trinity-backup/

# Remove framework-specific files
rm eslint.config.js .prettierrc .pre-commit-config.yaml
rm -rf .github/workflows/
```

**Step 2: Update Project to Rust**

```bash
# Initialize Rust project
cargo init

# Copy application logic (manual migration required)
```

**Step 3: Redeploy Trinity for Rust**

```bash
trinity deploy
# Select: Rust → Clippy + Rustfmt → GitHub Actions
```

**Step 4: Restore Customizations**

```bash
# Restore preserved knowledge base content
cp trinity-backup/ARCHITECTURE.md trinity/knowledge-base/
cp trinity-backup/ISSUES.md trinity/knowledge-base/
```

### Scenario: Adding Trinity to Existing Multi-Language Project

**Example: Node.js frontend + Python backend**

**Option 1: Deploy at Root (Monorepo)**

```bash
# Deploy at monorepo root
cd my-project
trinity deploy
# Select: Node.js (primary) → ESLint → GitHub Actions

# Manually add Python linting to backend/
cd backend/
pip install black flake8
# Add Python linting to root .pre-commit-config.yaml
```

**Option 2: Deploy Per-Language (Separate)**

```bash
# Deploy to frontend
cd my-project/frontend
trinity deploy
# Select: Node.js → ESLint → GitHub Actions

# Deploy to backend
cd ../backend
trinity deploy
# Select: Python → Black → GitHub Actions
```

---

## Framework-Specific CI/CD

### GitHub Actions Workflows

**Node.js Workflow** (`.github/workflows/nodejs.yml`):

```yaml
name: Node.js CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

**Python Workflow** (`.github/workflows/python.yml`):

```yaml
name: Python CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.8', '3.9', '3.10', '3.11']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install -r requirements.txt
      - run: black --check .
      - run: flake8
      - run: pytest
```

**Rust Workflow** (`.github/workflows/rust.yml`):

```yaml
name: Rust CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rust-lang/setup-rust-toolchain@v1
      - run: cargo clippy -- -D warnings
      - run: cargo fmt --check
      - run: cargo test
      - run: cargo build --release
```

---

## Best Practices

### 1. Choose Primary Framework for Monorepos

Deploy Trinity once at root with primary framework selection.

### 2. Use Framework-Native Tools

- Node.js: ESLint + Prettier
- Python: Black + Flake8 + isort
- Rust: Clippy + Rustfmt
- Flutter: Dart Analyzer
- Go: gofmt + golangci-lint

### 3. Configure Pre-Commit Hooks

Always install and use pre-commit hooks for quality enforcement.

### 4. CI/CD Per Framework

Use framework-specific CI/CD workflows for proper testing.

### 5. Version Consistency

Ensure CI/CD uses same language versions as local development.

---

## Troubleshooting

### Framework Not Detected

**Solution:** Ensure manifest file exists in deployment directory:

- Node.js: `package.json`
- Python: `requirements.txt` or `pyproject.toml`
- Rust: `Cargo.toml`
- Flutter: `pubspec.yaml`
- Go: `go.mod`

### Linting Conflicts

**Solution:** Remove existing linting configs before deploying Trinity:

```bash
mv .eslintrc.js .eslintrc.js.backup
trinity deploy
# Merge rules manually if needed
```

### Pre-Commit Hooks Not Running

**Solution:**

```bash
# Reinstall hooks
pre-commit uninstall
pre-commit install

# Test hooks
pre-commit run --all-files
```

---

## Additional Resources

- [Getting Started Guide](getting-started.md)
- [Deployment Guide](deployment-guide.md)
- [Multi-Framework Support Matrix](../images/multi-framework-support-matrix.md)
- [CLI Commands Reference](../reference/cli-commands.md)

---

**Trinity Method SDK v2.0.7** - Investigation-first development for all frameworks
