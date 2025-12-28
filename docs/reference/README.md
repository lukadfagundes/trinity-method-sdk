# Reference Documentation

Reference materials for Trinity Method SDK - Quick lookup tables, command references, and cheat sheets.

## Available References

### Command References

- **[CLI Commands Reference](cli-commands.md)** - Complete Trinity CLI documentation
  - `trinity deploy` - Deployment command with all options
  - `trinity update` - Update command with backup/rollback
  - `trinity --version` - Version information
  - `trinity --help` - Help system
  - Exit codes, environment variables, configuration
  - Examples and troubleshooting

- **[Slash Commands Reference](slash-commands-reference.md)** - All 19 slash commands ⭐ **COMPREHENSIVE**
  - Session Management (3): `/trinity-start`, `/trinity-continue`, `/trinity-end`
  - Planning (4): `/trinity-requirements`, `/trinity-design`, `/trinity-decompose`, `/trinity-plan`
  - Execution (5): `/trinity-orchestrate`, `/trinity-audit`, `/trinity-readme`, `/trinity-docs`, `/trinity-changelog`
  - Investigation (3): `/trinity-create-investigation`, `/trinity-plan-investigation`, `/trinity-investigate-templates`
  - Infrastructure (1): `/trinity-init`
  - Utility (3): `/trinity-verify`, `/trinity-agents`, `/trinity-workorder`
  - Detailed usage, examples, and expected outputs for each command

### Quick Reference Cards

- **[Agent Quick Reference Card](agents-quick-reference.md)** - 19-agent team lookup table ⭐ **ESSENTIAL**
  - Planning Agents (4): MON, ROR, EUS, TRA
  - Execution Agents (3): KIL, BAS, DRA
  - Support Agents (4): APO, BON, CAP, URO
  - Leadership Agents (2): ALY, JUNO
  - Infrastructure Agents (6): TAN, ZEN, INO, EIN, AJ MAESTRO, AJ (CC)
  - Quick selection guide with decision tree
  - Agent workflow chains
  - BAS quality gate 6-phase breakdown
  - Common agent combinations

- **[Template Variables Reference](template-variables.md)** - All template variables for customization
  - Core variables: `{{PROJECT_NAME}}`, `{{FRAMEWORK}}`, `{{PACKAGE_MANAGER}}`
  - Optional variables: `{{LINTING_TOOL}}`, `{{CI_PLATFORM}}`, `{{NODE_VERSION}}`
  - Metadata variables: `{{CURRENT_DATE}}`, `{{VERSION}}`
  - Variable sources and auto-detection
  - Usage by file type (Markdown, YAML, configs)
  - Validation and troubleshooting

## Reference Summary

| Reference Type         | Files | Purpose                                  |
| ---------------------- | ----- | ---------------------------------------- |
| **CLI Commands**       | 1     | Trinity command-line interface reference |
| **Slash Commands**     | 1     | All 19 slash commands with examples      |
| **Agent Reference**    | 1     | Quick lookup for 19-agent team           |
| **Template Variables** | 1     | Variable substitution reference          |
| **Total**              | **4** | Complete Trinity reference library       |

## Quick Reference Guide

### For New Users

**Essential Reading Order:**

1. [Agent Quick Reference](agents-quick-reference.md) - Understand the 19-agent team
2. [Slash Commands Reference](slash-commands-reference.md) - Learn available commands
3. [CLI Commands](cli-commands.md) - Master trinity deploy/update

### For Deployment

**Deployment References:**

1. [CLI Commands](cli-commands.md) - Deployment process
2. [Template Variables](template-variables.md) - Customization options
3. [Agent Quick Reference](agents-quick-reference.md) - Post-deployment agents

### For Daily Use

**Most Referenced:**

1. [Agent Quick Reference](agents-quick-reference.md) - Which agent to use?
2. [Slash Commands Reference](slash-commands-reference.md) - Command syntax
3. [Template Variables](template-variables.md) - Customizing templates

## Framework Support Matrix

| Framework         | Linting                | Package Manager | CI/CD                                        | Status             |
| ----------------- | ---------------------- | --------------- | -------------------------------------------- | ------------------ |
| **Node.js/React** | ESLint + Prettier      | npm, yarn, pnpm | GitHub Actions, GitLab CI, CircleCI, Jenkins | ✅ Fully Supported |
| **Python**        | Black + Flake8 + isort | pip             | GitHub Actions, GitLab CI, CircleCI, Jenkins | ✅ Fully Supported |
| **Rust**          | Clippy + Rustfmt       | cargo           | GitHub Actions, GitLab CI                    | ✅ Fully Supported |
| **Flutter**       | Dart Analyzer          | flutter         | GitHub Actions, GitLab CI                    | ✅ Fully Supported |
| **Go**            | gofmt                  | go modules      | GitHub Actions, GitLab CI                    | ✅ Supported       |

See [Multi-Framework Guide](../guides/multi-framework-guide.md) for detailed framework documentation.

## External References

### Trinity Method Resources

- **Trinity Method Philosophy** - Investigation-first development methodology
- **Claude Code** - [claude.com/claude-code](https://claude.com/claude-code)
- **npm Package** - [@trinity-method/cli](https://www.npmjs.com/package/@trinity-method/cli)
- **GitHub Repository** - [lukadfagundes/trinity-method-sdk](https://github.com/lukadfagundes/trinity-method-sdk)

### Related Documentation

- **[Agent Guide](../guides/agent-guide.md)** - Comprehensive agent documentation
- **[Deployment Guide](../guides/deployment-guide.md)** - Advanced deployment scenarios
- **[Multi-Framework Guide](../guides/multi-framework-guide.md)** - Framework-specific deployment
- **[Investigation Guide](../guides/investigation-guide.md)** - Structured problem-solving

## Contributing Reference Documentation

Reference materials should be:

1. **Concise** - Quick lookup, not detailed explanations
2. **Tabular** - Use tables for quick scanning
3. **Complete** - Cover all options/variations
4. **Accurate** - Verify all information
5. **Cross-referenced** - Link to detailed guides

### Adding New References

1. Create reference document in this directory
2. Follow table/list format for scannability
3. Include quick examples
4. Add to this README with description
5. Cross-link from relevant guides

---

See [../README.md](../README.md) for complete documentation index.
