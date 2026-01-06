# CLI Commands Reference

**Trinity Version:** 2.0.4
**Last Updated:** 2026-01-02

Complete reference for Trinity Method SDK command-line interface.

## Quick Reference

```bash
trinity deploy               # Deploy Trinity to project
trinity update               # Update Trinity deployment
trinity --version            # Show SDK version
trinity --help               # Show help information
```

---

## `trinity deploy`

Deploy Trinity Method to your project.

### Synopsis

```bash
trinity deploy [options]
```

### Description

Deploys 64 Trinity components to your project:

- 19 agents (`.claude/agents/`)
- 20 slash commands (`.claude/commands/`)
- Knowledge base (`trinity/knowledge-base/`)
- Investigation templates (`trinity/templates/`)
- Linting configurations (framework-specific)
- CI/CD workflows (platform-specific)

### Interactive Prompts

| Prompt             | Options                                                                   | Detection                                                                           |
| ------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Framework**      | Node.js, Python, Rust, Flutter, Go                                        | Auto-detected from package.json, requirements.txt, Cargo.toml, pubspec.yaml, go.mod |
| **Linting Tools**  | ESLint+Prettier, Black+Flake8+isort, Clippy+Rustfmt, Dart Analyzer, gofmt | Based on framework                                                                  |
| **CI/CD Platform** | GitHub Actions, GitLab CI, CircleCI, Jenkins, None                        | No auto-detection                                                                   |
| **Project Name**   | Free text input                                                           | Auto-detected from package.json/Cargo.toml/etc.                                     |

### Deployment Process

1. **Environment Validation** - Checks Node.js ≥16.9.0
2. **Existing Deployment Check** - Warns if Trinity already deployed
3. **Framework Detection** - Auto-detects or prompts for framework
4. **User Configuration** - Interactive prompts for linting, CI/CD, project name
5. **Template Processing** - Variable substitution ({{PROJECT_NAME}}, {{FRAMEWORK}}, etc.)
6. **Directory Creation** - Creates `.claude/`, `trinity/`, and subdirectories
7. **Component Deployment** - Deploys all 64 components
8. **.gitignore Update** - Adds Trinity entries
9. **Verification** - Confirms all components deployed

### Exit Codes

| Code | Meaning                                                |
| ---- | ------------------------------------------------------ |
| `0`  | Successful deployment                                  |
| `1`  | Error during deployment                                |
| `2`  | User canceled deployment                               |
| `3`  | Trinity already deployed (and user declined overwrite) |

### Examples

```bash
# Basic deployment
cd my-project
trinity deploy

# Deploy in current directory
trinity deploy

# Check if deployed before deploying
ls -la .claude/ trinity/  # If exists, Trinity deployed
trinity deploy            # Will prompt to overwrite
```

### Deployment Output

```
✅ Trinity Method Deployment

📦 Framework Detected: Node.js
📋 Project Name: my-app
🔧 Linting: ESLint + Prettier
🚀 CI/CD: GitHub Actions

Deploying Trinity components...
✓ Creating directory structure (14 directories)
✓ Deploying agents (19 files)
✓ Deploying slash commands (20 files)
✓ Deploying knowledge base (9 files)
✓ Deploying templates (12 files)
✓ Deploying linting configs (4 files)
✓ Deploying CI/CD workflows (1 file)
✓ Updating .gitignore

✅ Trinity deployed successfully! (64 components)

Next steps:
1. Install linting dependencies: npm install -D eslint prettier
2. Install pre-commit: pip install pre-commit && pre-commit install
3. Start your first session: /trinity-start
```

### Errors

| Error                      | Cause                           | Solution                            |
| -------------------------- | ------------------------------- | ----------------------------------- |
| `Node.js version too old`  | Node.js < 16.9.0                | Update Node.js: `nvm install 20`    |
| `Permission denied`        | No write access                 | Fix permissions: `chmod -R u+w .`   |
| `Trinity already deployed` | `.claude/` or `trinity/` exists | Run `trinity update` or remove dirs |
| `No framework detected`    | Missing manifest file           | Add package.json/Cargo.toml/etc.    |

---

## `trinity update`

Update Trinity deployment to latest version.

### Synopsis

```bash
trinity update [options]
```

### Description

Updates Trinity components while preserving user-created content:

- Creates timestamped backup
- Preserves ARCHITECTURE.md, ISSUES.md, To-do.md, Technical-Debt.md
- Deploys new templates
- Restores preserved content
- Verifies update success
- Optional backup cleanup

### Update Process

1. **Deployment Check** - Verifies Trinity is deployed
2. **Version Check** - Reads `trinity/VERSION`, compares with SDK version
3. **Backup Creation** - Creates `trinity/backups/backup-{timestamp}.tar.gz`
4. **Content Preservation** - Saves user files (ARCHITECTURE.md, ISSUES.md, etc.)
5. **Old Template Removal** - Removes outdated agent/command templates
6. **New Template Deployment** - Deploys latest templates
7. **Content Restoration** - Restores preserved user files
8. **Version Update** - Writes new version to `trinity/VERSION`
9. **Verification** - Confirms update success
10. **Backup Cleanup** - Optional removal of backup file

### Preserved Files

During update, these files are **preserved**:

- `trinity/knowledge-base/ARCHITECTURE.md`
- `trinity/knowledge-base/ISSUES.md`
- `trinity/knowledge-base/To-do.md`
- `trinity/knowledge-base/Technical-Debt.md`
- `trinity/sessions/` (all session files)
- `trinity/reports/` (all report files)
- `trinity/backups/` (all backup files)

### Overwritten Files

These files are **overwritten** with new versions:

- `.claude/agents/*` (all 19 agents)
- `.claude/commands/*` (all 20 commands)
- `trinity/knowledge-base/Trinity.md`
- `trinity/knowledge-base/TESTING-PRINCIPLES.md`
- `trinity/knowledge-base/CODING-PRINCIPLES.md`
- `trinity/templates/*` (all templates)
- Linting configs (eslint.config.js, pyproject.toml, etc.)
- CI/CD workflows

### Exit Codes

| Code | Meaning                                  |
| ---- | ---------------------------------------- |
| `0`  | Successful update                        |
| `1`  | Error during update (rollback triggered) |
| `2`  | User canceled update                     |
| `3`  | Trinity not deployed                     |
| `4`  | Already up-to-date                       |

### Examples

```bash
# Update Trinity
cd my-project
trinity update

# Check version before update
cat trinity/VERSION

# Update and keep backup
trinity update
# When prompted: "Remove backup?" → Select "No"

# List backups
ls -lh trinity/backups/
```

### Update Output

```
🔄 Trinity Method Update

📦 Current Version: 1.5.0
📦 Latest Version: 2.0.4

Creating backup...
✓ Backup created: trinity/backups/backup-2025-12-28T12-30-00.tar.gz

Preserving user content...
✓ ARCHITECTURE.md preserved
✓ ISSUES.md preserved
✓ To-do.md preserved
✓ Technical-Debt.md preserved

Updating Trinity components...
✓ Removing old templates
✓ Deploying new agents (19 files)
✓ Deploying new commands (20 files)
✓ Updating knowledge base
✓ Restoring user content

✅ Trinity updated successfully! (v2.0.4)

Remove backup? (y/N): N
Backup preserved: trinity/backups/backup-2025-12-28T12-30-00.tar.gz
```

### Rollback on Failure

If update fails, automatic rollback occurs:

```
❌ Update failed: Error deploying templates

🔄 Rolling back to previous version...
✓ Extracted backup: backup-2025-12-28T12-30-00.tar.gz
✓ Rollback complete

Trinity remains at version 1.5.0
Backup preserved for investigation
```

### Manual Rollback

To manually rollback:

```bash
# Navigate to backups
cd trinity/backups/

# List backups
ls -lh

# Extract desired backup
tar -xzf backup-2025-12-28T12-30-00.tar.gz -C ../../

# Verify version
cat ../../trinity/VERSION
```

### Errors

| Error                    | Cause                       | Solution                                       |
| ------------------------ | --------------------------- | ---------------------------------------------- |
| `Trinity not deployed`   | No `.claude/` or `trinity/` | Run `trinity deploy` first                     |
| `Already up-to-date`     | Current version matches SDK | No action needed                               |
| `Update failed`          | Deployment error            | Check error message, manual rollback if needed |
| `Backup creation failed` | Disk space / permissions    | Free space, fix permissions                    |

---

## `trinity --version`

Display Trinity Method SDK version.

### Synopsis

```bash
trinity --version
trinity -V
```

### Description

Shows the currently installed Trinity Method SDK version.

### Output

```
Trinity Method SDK v2.0.4
```

### Examples

```bash
# Check SDK version
trinity --version

# Check SDK version (short form)
trinity -V

# Compare with deployed version
trinity --version
cat trinity/VERSION
```

---

## `trinity --help`

Display help information.

### Synopsis

```bash
trinity --help
trinity -h
```

### Description

Shows available commands and options.

### Output

```
Usage: trinity [options] [command]

Investigation-first development methodology deployment tool

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  deploy          Deploy Trinity Method to your project
  update          Update Trinity deployment to latest version
  help [command]  display help for command

Examples:
  $ trinity deploy
  $ trinity update
  $ trinity --version

Documentation: https://github.com/lukadfagundes/trinity-method-sdk
```

### Examples

```bash
# Show help
trinity --help

# Show help (short form)
trinity -h

# Show help for specific command
trinity help deploy
trinity deploy --help
```

---

## Environment Variables

Trinity Method SDK currently does not use environment variables for configuration.

---

## Exit Code Summary

| Code | Meaning                         | Commands       |
| ---- | ------------------------------- | -------------- |
| `0`  | Success                         | All            |
| `1`  | General error                   | All            |
| `2`  | User canceled                   | deploy, update |
| `3`  | Already deployed / Not deployed | deploy, update |
| `4`  | Already up-to-date              | update         |

---

## Configuration Files

Trinity does not use a configuration file in v2.0. All configuration is done via interactive prompts during `trinity deploy`.

---

## Additional Resources

- [Getting Started Guide](../guides/getting-started.md)
- [Deployment Guide](../guides/deployment-guide.md)
- [Slash Commands Reference](slash-commands-reference.md)
- [Agent Guide](../guides/agent-guide.md)

---

**Trinity Method SDK v2.0.4** - Command-Line Interface Reference
