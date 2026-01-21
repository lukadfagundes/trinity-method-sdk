# deploy-claude-setup.md

## Overview

The `deploy-claude-setup` module handles the deployment of Claude Code configuration files to the target project. This includes creating Claude Code settings, deploying the employee directory, and organizing slash commands into categorized directories for easy navigation.

**Module:** `src/cli/commands/deploy/claude-setup.ts`
**Purpose:** Deploy Claude Code configuration files to enable Trinity Method agent integration
**Category:** Deployment Command
**Dependencies:**

- `fs-extra` - File system operations
- `template-processor` - Template variable substitution
- `validate-path` - Path security validation

---

## Main Function

### `deployClaudeSetup()`

Deploys Claude Code configuration files including settings, employee directory, and categorized slash commands.

**Signature:**

```typescript
async function deployClaudeSetup(
  templatesPath: string,
  variables: Record<string, string>,
  spinner: Spinner
): Promise<{ filesDeployed: number; commandsDeployed: number }>;
```

**Parameters:**

- `templatesPath` (string) - Absolute path to the SDK's templates directory (e.g., `/path/to/sdk/src/templates`)
- `variables` (Record<string, string>) - Template variables for substitution in templates (e.g., `{ PROJECT_NAME: "myapp", FRAMEWORK: "Node.js" }`)
- `spinner` (Spinner) - Ora spinner instance for displaying deployment progress and status messages

**Returns:**

```typescript
Promise<{
  filesDeployed: number; // Total files deployed (settings, directory, commands)
  commandsDeployed: number; // Number of slash commands deployed
}>;
```

**Behavior:**

1. Creates empty Claude Code settings file (`.claude/settings.json`) if it doesn't exist
2. Deploys EMPLOYEE-DIRECTORY.md with template variable substitution
3. Creates 6 categorized subdirectories for slash commands:
   - `session` - Session management commands
   - `planning` - Planning and design commands
   - `execution` - Implementation commands
   - `investigation` - Investigation and audit commands
   - `infrastructure` - Infrastructure setup commands
   - `maintenance` - Maintenance and update commands
   - `utility` - Utility commands
4. Deploys all slash command templates (`.md.template` files) to appropriate category directories
5. Removes `.template` extension during deployment

**Error Handling:**

- Warns if EMPLOYEE-DIRECTORY template is not found
- Continues deployment even if individual templates are missing
- Uses `validatePath()` for security validation before writing files

**Example Usage:**

```typescript
import { deployClaudeSetup } from './deploy-claude-setup.js';

const result = await deployClaudeSetup(
  '/usr/local/lib/node_modules/trinity-method/src/templates',
  {
    PROJECT_NAME: 'myapp',
    FRAMEWORK: 'Node.js',
    SOURCE_DIR: 'src',
  },
  spinner
);

console.log(`Deployed ${result.filesDeployed} files`);
console.log(`Deployed ${result.commandsDeployed} slash commands`);
// Output:
// Deployed 22 files
// Deployed 20 slash commands
```

---

## Deployment Process

### Step 1: Claude Code Settings

**File Created:** `.claude/settings.json`

**Purpose:** Empty configuration file for users to customize Claude Code settings

**Content:**

```json
{}
```

**Behavior:**

- Only created if file doesn't already exist (idempotent)
- Uses `fs.writeJson()` with 2-space indentation
- Users can manually add custom settings after deployment

**Status Message:**

```
✔ Claude Code settings created (empty - customize as needed)
```

---

### Step 2: Employee Directory

**File Created:** `.claude/EMPLOYEE-DIRECTORY.md`

**Source Template:** `templates/.claude/EMPLOYEE-DIRECTORY.md.template`

**Purpose:** Comprehensive guide to the 19 Trinity Method agents and their roles

**Process:**

1. Reads template from SDK templates directory
2. Processes template with variable substitution (e.g., `{{PROJECT_NAME}}` → `"myapp"`)
3. Validates destination path for security (prevents directory traversal)
4. Writes processed content to `.claude/EMPLOYEE-DIRECTORY.md`

**Template Variables Used:**

- `PROJECT_NAME` - Name of the target project
- `FRAMEWORK` - Detected framework (e.g., "Node.js", "Python")
- `SOURCE_DIR` - Source code directory (e.g., "src", "lib")

**Status Messages:**

```
⠹ Deploying Employee Directory...
✔ Employee Directory deployed
```

**Warning Case:**

```
⚠ Employee Directory template not found
```

---

### Step 3: Slash Commands

**Directory Structure Created:**

```
.claude/commands/
├── session/          # Session management
├── planning/         # Planning and design
├── execution/        # Implementation
├── investigation/    # Investigation and audit
├── infrastructure/   # Infrastructure setup
├── maintenance/      # Maintenance and updates
└── utility/          # Utility commands
```

**Source Templates:** `templates/.claude/commands/{category}/*.md.template`

**Process:**

1. Creates 6 categorized subdirectories in `.claude/commands/`
2. For each category, reads all `.md.template` files from templates directory
3. Copies template files to destination category directories
4. Removes `.template` extension during deployment

**Example Commands by Category:**

#### Session Commands

- `trinity-init.md` - Initialize new session
- `trinity-end-session.md` - End current session

#### Planning Commands

- `trinity-plan.md` - Create implementation plan
- `trinity-design.md` - Create design document

#### Execution Commands

- `trinity-build.md` - Build feature/component
- `trinity-test.md` - Run tests

#### Investigation Commands

- `trinity-investigate.md` - Start investigation
- `trinity-audit.md` - Audit codebase

#### Infrastructure Commands

- `trinity-deploy-infra.md` - Deploy infrastructure

#### Maintenance Commands

- `trinity-update.md` - Update Trinity Method SDK
- `trinity-docs-update.md` - Update documentation

#### Utility Commands

- `trinity-readme.md` - Generate README
- `trinity-changelog.md` - Update CHANGELOG

**Status Message:**

```
✔ Deployed 20 Trinity slash commands (6 categories)
```

**Typical Deployment:**

- Total files deployed: 22 (1 settings + 1 directory + 20 commands)
- Total commands deployed: 20 slash commands

---

## File Security

### Path Validation

**Security Measure:** All destination paths validated using `validatePath()`

**Protection Against:**

- Directory traversal attacks (e.g., `../../etc/passwd`)
- Symlink attacks
- Path injection

**Example:**

```typescript
const destPath = validatePath('.claude/EMPLOYEE-DIRECTORY.md');
// Throws error if path is unsafe
await fs.writeFile(destPath, processed);
```

---

## Template Processing

### Variable Substitution

**Handled by:** `processTemplate()` utility

**Example Template:**

```markdown
# {{PROJECT_NAME}} - Employee Directory

**Framework:** {{FRAMEWORK}}
**Source Directory:** {{SOURCE_DIR}}
```

**After Processing:**

```markdown
# myapp - Employee Directory

**Framework:** Node.js
**Source Directory:** src
```

**Common Variables:**

- `PROJECT_NAME` - Project name from package.json
- `FRAMEWORK` - Detected framework (Node.js, Python, etc.)
- `SOURCE_DIR` - Source directory (src, lib, app, etc.)
- `TECH_STACK` - Technology stack details
- `VERSION` - Trinity Method SDK version

---

## Integration with Deployment Workflow

### Called From

**Main Deploy Command:** `src/cli/commands/deploy/index.ts`

**Deployment Sequence:**

```typescript
// Step 7 of 12 in deployment workflow
spinner.start('Step 7: Deploying Claude Code configuration...');
const claudeSetup = await deployClaudeSetup(templatesPath, variables, spinner);
progress.claudeFilesDeployed = claudeSetup.filesDeployed;
progress.commandsDeployed = claudeSetup.commandsDeployed;
```

**Depends On:**

- Step 5: Template variable extraction (`extractVariables()`)
- Directory structure must exist (`.claude/` created in Step 4)

**Required By:**

- Step 12: Summary display (uses `progress.claudeFilesDeployed` and `progress.commandsDeployed`)

---

## Error Scenarios

### Missing Template Directory

**Scenario:** Templates directory doesn't exist or is empty

**Behavior:**

- Displays warning: "Employee Directory template not found"
- Continues deployment (doesn't fail entire operation)
- Returns `filesDeployed: 1` (only settings.json created)

### Invalid Destination Path

**Scenario:** Path validation fails (security risk detected)

**Behavior:**

- `validatePath()` throws error
- Deployment halts immediately
- Error propagated to main deploy command

### Permission Denied

**Scenario:** Cannot write to `.claude/` directory (permissions issue)

**Behavior:**

- `fs.writeFile()` throws EACCES error
- Deployment fails with error message
- User must resolve permissions before retrying

---

## Command Categories

### Category Descriptions

#### 1. Session Commands

**Purpose:** Manage Trinity Method development sessions
**Examples:**

- Initialize new session with context loading
- End session with artifact archiving
- Review session progress

#### 2. Planning Commands

**Purpose:** Design and architecture planning
**Examples:**

- Create design documents
- Plan implementation strategies
- Define acceptance criteria

#### 3. Execution Commands

**Purpose:** Feature implementation and building
**Examples:**

- Build new features
- Implement designs
- Run test suites

#### 4. Investigation Commands

**Purpose:** Code investigation and auditing
**Examples:**

- Investigate bugs or issues
- Audit code quality
- Analyze performance

#### 5. Infrastructure Commands

**Purpose:** Infrastructure setup and deployment
**Examples:**

- Deploy infrastructure
- Configure CI/CD
- Setup development environment

#### 6. Maintenance Commands

**Purpose:** System maintenance and updates
**Examples:**

- Update Trinity Method SDK
- Update documentation
- Cleanup technical debt

#### 7. Utility Commands

**Purpose:** Utility and helper commands
**Examples:**

- Generate README files
- Update CHANGELOG
- Format code

---

## Best Practices

### For SDK Developers

1. **Template Naming Convention:**
   - Use `.md.template` extension for all templates
   - Name templates clearly (e.g., `trinity-build.md.template`)
   - Group templates by category in source

2. **Variable Substitution:**
   - Use consistent variable names across templates
   - Document required variables in template comments
   - Provide sensible defaults in `extractVariables()`

3. **Error Handling:**
   - Warn for missing templates (don't fail deployment)
   - Validate paths before file operations
   - Log detailed error context for debugging

4. **Testing:**
   - Test with missing templates directory
   - Verify category directory creation
   - Test template variable substitution accuracy

### For End Users

1. **Customization:**
   - Edit `.claude/settings.json` after deployment
   - Customize EMPLOYEE-DIRECTORY.md as needed
   - Add custom slash commands to appropriate categories

2. **Slash Command Organization:**
   - Use category directories to find commands quickly
   - Session commands for daily workflow
   - Investigation commands for debugging
   - Maintenance commands for updates

3. **Template Variables:**
   - Templates are already processed during deployment
   - No need to manually replace variables
   - All `{{VARIABLE}}` placeholders resolved automatically

---

## Related Documentation

- [deploy-command.md](deploy-command.md) - Main deployment orchestration
- [template-processor.md](template-processor.md) - Template variable substitution
- [validate-path.md](validate-path.md) - Path security validation
- [deploy-agents.md](deploy-agents.md) - Agent deployment (similar process)

---

## Version Information

**Module Version:** 2.1.0
**Last Updated:** 2026-01-21
**Status:** Production Ready
**Stability:** Stable
