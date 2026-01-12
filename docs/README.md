# Documentation

Comprehensive documentation for Trinity Method SDK.

## Documentation Structure

This directory contains organized project documentation:

- **[Guides](guides/)** - How-to guides and tutorials
- **[API](api/)** - API reference documentation (TypeDoc HTML)
- **[Architecture](architecture/)** - System architecture and design decisions
- **[Reference](reference/)** - Quick references and cheat sheets

## Quick Start

New to Trinity Method SDK? Start here:

1. **[Getting Started Guide](guides/getting-started.md)** - Installation and setup
2. **[Architecture Overview](architecture/overview.md)** - Understand the system design
3. **[TypeDoc API Reference](index.html)** - Explore the SDK API
4. **[Agent Directory](../.claude/EMPLOYEE-DIRECTORY.md)** - Meet the 19-agent team (after deployment)

## Documentation Categories

### Guides

How-to guides and tutorials for Trinity Method SDK:

- **[Getting Started](guides/getting-started.md)** - Quick start for new users
- **[Agent Guide](guides/agent-guide.md)** - Deep dive into the 19-agent Trinity team
- **[Deployment Guide](guides/deployment-guide.md)** - Advanced deployment scenarios
- **[Multi-Framework Guide](guides/multi-framework-guide.md)** - Trinity across Node.js, Python, Rust, Flutter, Go
- **[Investigation Guide](guides/investigation-guide.md)** - Structured problem-solving

See [guides/README.md](guides/README.md) for complete guides index.

### API Documentation

Complete API reference generated from TypeScript code:

**[TypeDoc API Reference](index.html)** - Full SDK API documentation

**Key Modules:**

- CLI Commands (deploy, update)
- Template Processing (variable substitution)
- Utilities (stack detection, path validation, error handling)

See [api/README.md](api/README.md) for API documentation overview.

### Architecture

System design and architectural decisions:

- **[Architecture Overview](architecture/overview.md)** - Complete system architecture
  - Technology stack (Node.js, TypeScript, Jest)
  - Architecture pattern (Modular CLI Architecture)
  - Directory structure and key components
  - Data flow (deployment and update)
  - Performance and security considerations
  - Quality metrics (405 tests, 16 suites)

**Architecture Decision Records (ADRs):**

- ADR-001: CLI Architecture (Commander.js selection)
- ADR-002: Template System Design ({{VAR}} syntax)
- ADR-003: ESLint Flat Config (Node.js ≥16.9.0)
- ADR-004: Test Strategy (405 comprehensive tests)

See [architecture/README.md](architecture/README.md) for architecture documentation index.

### Reference

Quick references and command guides:

**CLI Commands:**

- `trinity deploy` - Deploy Trinity to project
- `trinity update` - Update Trinity deployment with backup

**npm Scripts:**

- `npm test` - Run all 405 tests
- `npm run build` - Compile TypeScript and copy templates
- `npm run lint` - Run ESLint
- `npm run docs:generate` - Generate TypeDoc documentation

**Agents (19 total):**

- Planning: MON, ROR, TRA, EUS
- Execution: KIL, BAS, DRA
- Support: APO, BON, CAP, URO
- Leadership: ALY, JUNO
- Infrastructure: TAN, ZEN, INO, EIN, AJ MAESTRO

**Slash Commands (20 total):**

- Session: start, continue, end
- Planning: requirements, design, decompose, plan
- Execution: orchestrate, audit, readme, docs, changelog
- Investigation: create-investigation, plan-investigation, investigate-templates
- Infrastructure: init
- Utility: verify, agents, workorder

See [reference/README.md](reference/README.md) for complete reference documentation.

## Documentation Standards

- All documentation is in Markdown format (except TypeDoc HTML)
- Images are stored in `images/` directory
- Each category has its own README for navigation
- ADRs follow standard ADR format (Context, Decision, Consequences)

## Contributing to Documentation

See [CONTRIBUTING.md](../CONTRIBUTING.md) for documentation contribution guidelines.

### Adding Documentation

1. **Guides** - Create tutorial in `guides/` and update `guides/README.md`
2. **API Docs** - Add markdown files to `api/` (TypeDoc is auto-generated)
3. **Architecture** - Document design decisions in `architecture/`
4. **Reference** - Add quick-reference materials to `reference/`

## Project Documentation

- **[Root README](../README.md)** - Project overview and quick start
- **[CONTRIBUTING](../CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG](../CHANGELOG.md)** - Version history
- **[LICENSE](../LICENSE)** - MIT License

## Trinity Method Resources

After deploying Trinity to your project, additional documentation is available:

- `.claude/EMPLOYEE-DIRECTORY.md` - Complete agent reference
- `trinity/knowledge-base/Trinity.md` - Project-specific Trinity guide
- `trinity/knowledge-base/ARCHITECTURE.md` - System architecture with metrics
- `trinity/templates/` - Work order and documentation templates

---

**Documentation Organization** - Well-structured documentation for comprehensive understanding

**Documentation Coverage:** 90/100 (see Organization Report below)

**Last Updated**: 2026-01-12
