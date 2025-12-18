# Trinity Method SDK - CLI Flag Review

## Overview

This document reviews all CLI command flags in Trinity Method SDK, analyzing their purpose, current usage, and providing recommendations for retention or removal.

---

## Command: `trinity deploy`

### Flag: `--name <name>`
- **Type:** Optional string
- **Purpose:** Specify project name (auto-detected from directory if not specified)
- **Usage in code:** `options.name` → passed to `projectName` variable
- **Current behavior:** Prompts user if not provided and `--yes` not set
- **Recommendation:** ✅ **KEEP** - Useful for scripting/automation scenarios

### Flag: `--yes`
- **Type:** Boolean
- **Purpose:** Skip all interactive prompts (confirmation, linting setup, CI/CD prompts)
- **Usage in code:** `options.yes` → controls `if (!options.yes)` blocks throughout deployment
- **Current behavior:** Bypasses all `inquirer.prompt()` calls, uses defaults
- **Recommendation:** ✅ **KEEP** - Essential for CI/CD pipelines and automated deployments

### Flag: `--dry-run`
- **Type:** Boolean
- **Purpose:** Preview changes without writing files
- **Usage in code:** `options.dryRun` → checked before file write operations
- **Current behavior:** Passed to functions but **NOT consistently implemented**
- **Issues:**
  - Deploy command doesn't actually skip file writes when `--dry-run` is set
  - Update command checks `!options.dryRun` before writes (implemented correctly)
- **Recommendation:** ⚠️ **FIX OR REMOVE**
  - **Option A:** Implement dry-run properly in deploy command (wrap all `fs.writeFile/fs.copy` in `if (!options.dryRun)`)
  - **Option B:** Remove flag entirely if not needed
  - **Recommendation:** Remove - Complex to implement correctly, rarely used in practice

### Flag: `--force`
- **Type:** Boolean
- **Purpose:** Overwrite existing Trinity deployment
- **Usage in code:** `options.force` → bypasses "already deployed" check at line 81-87
- **Current behavior:** Allows redeployment without error if `trinity/` already exists
- **Recommendation:** ✅ **KEEP** - Necessary for updating/reinstalling Trinity

### Flag: `--skip-audit`
- **Type:** Boolean
- **Purpose:** Skip codebase metrics collection (faster deployment, uses placeholder values)
- **Usage in code:** `options.skipAudit` → controls codebase analysis at lines 314-332
- **Current behavior:** Skips file counting, TODO scanning, dependency detection
- **Recommendation:** ✅ **KEEP** - Useful for quick testing or projects where metrics aren't needed

### Flag: `--ci-deploy`
- **Type:** Boolean
- **Purpose:** Deploy CI/CD workflow templates for automated testing
- **Usage in code:** `options.ciDeploy` → set during interactive prompts (line 279) or directly via flag
- **Current behavior:** Triggers CI/CD template deployment at lines 797-831
- **Recommendation:** ✅ **KEEP** - Enables automation of CI/CD setup

---

## Command: `trinity update`

### Flag: `--all`
- **Type:** Boolean
- **Purpose:** Update all registered Trinity projects
- **Usage in code:** `options.all` → **NOT IMPLEMENTED**
- **Current behavior:** Flag is defined but never checked in code
- **Issues:** No multi-project registry exists, no code uses this flag
- **Recommendation:** ❌ **DELETE** - Non-functional feature, no implementation

### Flag: `--dry-run`
- **Type:** Boolean
- **Purpose:** Preview changes without writing files
- **Usage in code:** `options.dryRun` → checked before all file operations (lines 90-91, 96-97, 103-111, 123-124, 128-129)
- **Current behavior:** **Properly implemented** - skips file writes when true
- **Recommendation:** ✅ **KEEP** - Correctly implemented, useful for previewing updates

---

## Command: `trinity analytics`

### Flag: `--format <type>`
- **Type:** String (text | json)
- **Purpose:** Output format for analytics data
- **Usage in code:** `options.format` → determines display format
- **Current behavior:** Analytics command exists but functionality is **runtime-dependent** (not file-based)
- **Issues:** Analytics system (trinity/analytics/) created during deploy but no runtime implementation
- **Recommendation:** ⚠️ **EVALUATE**
  - Analytics system creates config files but has no active data collection
  - Command can't function without runtime analytics engine
  - **Recommendation:** Keep flag but document that analytics requires runtime integration

### Flag: `--period <period>`
- **Type:** String (e.g., "7d", "30d")
- **Purpose:** Time period for metrics display
- **Usage in code:** `options.period` → filters analytics data by time range
- **Current behavior:** Same as `--format` - runtime-dependent
- **Recommendation:** ⚠️ **EVALUATE** - Same as `--format`, keep but document limitations

---

## Command: `trinity crisis`

### Flag: `--type <type>`
- **Type:** String (build | test | runtime | dependency | security)
- **Purpose:** Specify crisis type, skip auto-detection
- **Usage in code:** `options.type` → passed to crisis detection/protocol system
- **Current behavior:** Crisis command and protocols fully implemented
- **Recommendation:** ✅ **KEEP** - Core functionality, allows direct crisis type specification

### Flag: `--health`
- **Type:** Boolean
- **Purpose:** Run quick health check
- **Usage in code:** `options.health` → triggers `quickHealthCheck()` function
- **Current behavior:** Validates system health, returns exit code
- **Recommendation:** ✅ **KEEP** - Useful for CI/CD health checks

### Flag: `--search <query>`
- **Type:** String
- **Purpose:** Search crisis archive for past incidents
- **Usage in code:** `options.search` → passed to `searchCrisisArchive()`
- **Current behavior:** Searches crisis documentation
- **Recommendation:** ✅ **KEEP** - Valuable for learning from past crises

### Flag: `--stats`
- **Type:** Boolean
- **Purpose:** View crisis statistics
- **Usage in code:** `options.stats` → triggers statistics display
- **Current behavior:** Shows crisis metrics
- **Recommendation:** ✅ **KEEP** - Useful for trend analysis

### Flag: `--list`
- **Type:** Boolean
- **Purpose:** List available crisis types
- **Usage in code:** `options.list` → displays crisis type catalog
- **Current behavior:** Shows 5 crisis types with descriptions
- **Recommendation:** ✅ **KEEP** - Helps users understand available crisis protocols

### Flag: `--help-crisis`
- **Type:** Boolean
- **Purpose:** Show detailed crisis management help
- **Usage in code:** `options.helpCrisis` → displays comprehensive help
- **Current behavior:** Extended help documentation
- **Recommendation:** ✅ **KEEP** - Provides detailed guidance for crisis management

---

## Unused/Orphaned Option Interfaces

### `ReviewOptions` (src/cli/types.ts:23-26)
- **Flags:** `--since <string>`, `--project <string>`
- **Purpose:** Unknown - no corresponding command
- **Usage:** **NOT USED ANYWHERE**
- **Recommendation:** ❌ **DELETE** - No command uses these options

### `InvestigateOptions` (src/cli/types.ts:28-34)
- **Flags:** `--type`, `--target`, `--scope`, `--learning`, `--verbose`
- **Purpose:** Investigation command options
- **Usage:** **NOT USED** - No `trinity investigate` command exists
- **Recommendation:** ❌ **DELETE** - Planned feature never implemented

### `DashboardOptions` (src/cli/types.ts:36-40)
- **Flags:** `--port`, `--host`, `--verbose`
- **Purpose:** Dashboard server options
- **Usage:** **NOT USED** - No `trinity dashboard` command exists
- **Recommendation:** ❌ **DELETE** - No corresponding command

### `AnalyzeOptions` (src/cli/types.ts:42-45)
- **Flags:** `--metrics`, `--verbose`
- **Purpose:** Unknown analysis command
- **Usage:** **NOT USED** - No `trinity analyze` command exists
- **Recommendation:** ❌ **DELETE** - No corresponding command

---

## Summary of Recommendations

### ✅ KEEP (17 flags)

**Deploy Command (5 flags):**
- `--name <name>` - Useful for automation
- `--yes` - Essential for CI/CD
- `--force` - Necessary for reinstallation
- `--skip-audit` - Performance optimization
- `--ci-deploy` - Enables CI/CD automation

**Update Command (1 flag):**
- `--dry-run` - Properly implemented, useful

**Analytics Command (2 flags):**
- `--format <type>` - Keep but document limitations
- `--period <period>` - Keep but document limitations

**Crisis Command (6 flags):**
- `--type <type>` - Core functionality
- `--health` - CI/CD integration
- `--search <query>` - Archive search
- `--stats` - Metrics display
- `--list` - Discovery
- `--help-crisis` - Documentation

**Status Command (0 flags):**
- No flags - simple status display

---

### ❌ DELETE (6 items)

**Deploy Command (1 flag):**
- `--dry-run` - Not properly implemented, complex to fix

**Update Command (1 flag):**
- `--all` - Non-functional, no implementation

**Unused Interfaces (4 types):**
- `ReviewOptions` - No command uses it
- `InvestigateOptions` - No command uses it
- `DashboardOptions` - No command uses it
- `AnalyzeOptions` - No command uses it

---

## Implementation Checklist

### Phase 1: Remove Unused Code
- [ ] Remove `--dry-run` from deploy command (src/cli/index.ts:29)
- [ ] Remove `dryRun` from `DeployOptions` interface (src/cli/types.ts:8)
- [ ] Remove `--all` from update command (src/cli/index.ts:38)
- [ ] Remove `all` from `UpdateOptions` interface (src/cli/types.ts:19)
- [ ] Delete `ReviewOptions` interface (src/cli/types.ts:23-26)
- [ ] Delete `InvestigateOptions` interface (src/cli/types.ts:28-34)
- [ ] Delete `DashboardOptions` interface (src/cli/types.ts:36-40)
- [ ] Delete `AnalyzeOptions` interface (src/cli/types.ts:42-45)

### Phase 2: Update Documentation
- [ ] Update README.md with current flag list
- [ ] Document analytics flag limitations
- [ ] Update crisis command examples

### Phase 3: Testing
- [ ] Test all remaining flags work correctly
- [ ] Verify no broken references to deleted flags
- [ ] Run build and pack to ensure clean compilation

---

## Flag Count Summary

| Command | Current Flags | Recommended Flags | Reduction |
|---------|--------------|-------------------|-----------|
| deploy | 6 | 5 | -1 |
| update | 2 | 1 | -1 |
| status | 0 | 0 | 0 |
| analytics | 2 | 2 | 0 |
| crisis | 6 | 6 | 0 |
| **TOTAL** | **16** | **14** | **-2** |

**Unused Interfaces:** 4 to delete

---

## Priority

**Priority:** MEDIUM
**Effort:** 1-2 hours
**Impact:** Code cleanliness, reduced confusion, smaller bundle size
**Breaking Changes:** None (removing non-functional features)
