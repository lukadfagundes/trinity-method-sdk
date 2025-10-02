# Trinity CLI Commands Reference

Complete reference for all Trinity Method SDK command-line interface commands.

## Installation

```bash
# Global installation (recommended)
npm install -g @trinity-method/cli

# Verify installation
trinity --version
# Output: 1.0.0 (Trinity Method SDK)
```

## Command Overview

```bash
trinity deploy          # Deploy Trinity Method to project
trinity status          # Check deployment status
trinity update          # Update to latest SDK version
trinity review          # Review session history
trinity --version       # Show version
trinity --help          # Show help
```

---

## trinity deploy

Deploy Trinity Method structure and agents to your current project.

### Synopsis

```bash
trinity deploy [options]
```

### Description

Deploys the complete Trinity Method structure to your project including 7 specialized agents, 8 slash commands, hierarchical context files, and optional linting configuration.

### Options

| Option | Description | Default |
|--------|-------------|---------|
| --name <name> | Project name (used in templates) | Current directory name |
| --yes | Skip all confirmation prompts | false (interactive) |
| --dry-run | Preview changes without writing files | false |
| --force | Overwrite existing Trinity deployment | false |
| --skip-audit | Skip codebase metrics collection (faster) | false |
| --ci-deploy | Deploy CI/CD workflow templates | false |

### Examples

```bash
# Interactive deployment
trinity deploy

# Non-interactive with defaults
trinity deploy --yes

# Specify project name
trinity deploy --name "MyApp"

# Preview deployment
trinity deploy --dry-run

# Force overwrite
trinity deploy --force

# Skip metrics collection
trinity deploy --skip-audit

# With CI/CD templates
trinity deploy --ci-deploy
```

### Exit Codes

- 0 - Deployment successful
- 1 - Deployment failed

---

## trinity status

Check Trinity Method deployment status and health.

### Synopsis

```bash
trinity status
```

### Description

Verifies Trinity Method deployment and reports directory structure, agents, slash commands, and hooks.

### Exit Codes

- 0 - Trinity deployed and healthy
- 1 - Trinity not deployed or issues found

---

## trinity update

Update Trinity Method SDK to the latest version.

### Synopsis

```bash
trinity update [options]
```

### Description

Updates Trinity Method deployment to the latest SDK version while preserving user content.

### Options

| Option | Description | Default |
|--------|-------------|---------|
| --dry-run | Preview changes without writing files | false |
| --all | Update all registered projects | Not implemented |

### Exit Codes

- 0 - Update successful
- 1 - Update failed

---

## trinity review

Review archived Trinity Method sessions.

### Synopsis

```bash
trinity review [options]
```

### Description

Analyzes archived sessions and displays work orders, investigations, and patterns.

### Options

| Option | Description | Default |
|--------|-------------|---------|
| --since <date> | Review sessions since date (YYYY-MM-DD) | All sessions |
| --project <name> | Review specific project | Current project |

### Exit Codes

- 0 - Review successful
- 1 - No sessions found or error

---

## Global Options

```bash
trinity --version          # Show SDK version
trinity --help             # Show help for all commands
trinity <command> --help   # Show help for specific command
```

---

## See Also

- [Getting Started Guide](../getting-started.md)
- [Deployment Guide](../deployment-guide.md)
- [Slash Commands Reference](../guides/slash-commands.md)
