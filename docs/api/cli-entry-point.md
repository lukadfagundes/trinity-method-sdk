# CLI Entry Point API Reference

**Module:** `src/cli/index.ts`
**Purpose:** Main CLI entry point - Commander.js program setup and command registration
**Priority:** HIGH (Core module)

---

## Overview

The CLI entry point initializes the Commander.js program, registers all commands (`deploy`, `update`), and parses command-line arguments. This is the authoritative source for all CLI command names, descriptions, and option flags.

---

## Program Setup

```typescript
import { program } from 'commander';

program
  .name('trinity')
  .description('Trinity Method SDK - Investigation-first development with AI agents')
  .version(`${pkg.version} (Trinity Method SDK)`, '-v, --version', 'Output the current version');
```

**Version Source:** Read from `../../package.json` relative to the compiled output.

**Version Flag:** `-v, --version` (lowercase `v`)

**Version Output Format:** `2.1.0 (Trinity Method SDK)`

---

## Commands

### `deploy`

**Description:** `'Deploy Trinity Method to current project'`

**Options:**

| Flag            | Type      | Description                                                  |
| --------------- | --------- | ------------------------------------------------------------ |
| `--name <name>` | `string`  | Project name (auto-detected if not specified)                |
| `--yes`         | `boolean` | Skip confirmation prompts                                    |
| `--dry-run`     | `boolean` | Preview changes without writing files                        |
| `--force`       | `boolean` | Overwrite existing Trinity deployment                        |
| `--skip-audit`  | `boolean` | Skip codebase metrics collection (faster, uses placeholders) |
| `--ci-deploy`   | `boolean` | Deploy CI/CD workflow templates for automated testing        |

**Handler:** `errorHandler.wrap(deploy)` from `./commands/deploy/index.js`

---

### `update`

**Description:** `'Update Trinity Method to latest version'`

**Options:**

| Flag        | Type      | Description                             |
| ----------- | --------- | --------------------------------------- |
| `--all`     | `boolean` | Update all registered Trinity projects  |
| `--dry-run` | `boolean` | Preview changes without writing files   |
| `--force`   | `boolean` | Force update even if already up to date |

**Handler:** `errorHandler.wrap(update)` from `./commands/update.js`

---

## Dependencies

| Module                       | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `commander`                  | CLI framework for command parsing         |
| `./commands/deploy/index.js` | Deploy command implementation             |
| `./commands/update.js`       | Update command implementation             |
| `./utils/error-handler.js`   | Error wrapping for async command handlers |

---

## Error Handling

All command handlers are wrapped with `errorHandler.wrap()`, which catches unhandled promise rejections and displays user-friendly error messages.

---

## Exit Codes

| Code | Meaning                        |
| ---- | ------------------------------ |
| `0`  | Success                        |
| `1`  | Error during command execution |

---

## Related Documentation

- [CLI Commands Reference](../reference/cli-commands.md) - User-facing command documentation
- [CLI Types](types/cli-types.md) - TypeScript interfaces for command options
- [Deploy Command API](deploy/deploy-command.md) - Deploy implementation details
- [Update Command API](update/update-command.md) - Update implementation details

---

**Last Updated:** 2026-02-23
**Trinity Version:** 2.1.0
**Module Stability:** Stable (production-ready)
