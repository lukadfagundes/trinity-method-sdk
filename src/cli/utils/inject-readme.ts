import fs from 'fs-extra';

interface ReadmeInjectResult {
  success: boolean;
  message: string;
  injected?: boolean;
  skipped?: boolean;
  created?: boolean;
  error?: Error;
}

/**
 * Injects Trinity Method section into project README.md
 * @param variables - Template variables (PROJECT_NAME, FRAMEWORK, etc.)
 * @returns Result with success status and message
 */
export async function injectTrinityMethodSection(variables: Record<string, any>): Promise<ReadmeInjectResult> {
  const readmePath = 'README.md';

  try {
    // Check if README.md exists
    if (!await fs.pathExists(readmePath)) {
      return {
        success: false,
        message: 'README.md not found - skipping Trinity Method section injection',
        created: false
      };
    }

    // Read existing README
    const existingContent = await fs.readFile(readmePath, 'utf8');

    // Check if Trinity Method section already exists
    if (existingContent.includes('## 🔱 Trinity Method')) {
      return {
        success: true,
        message: 'Trinity Method section already exists in README.md',
        skipped: true
      };
    }

    // Generate Trinity Method section
    const trinitySection = generateTrinitySection(variables);

    // Append to README
    const newContent = existingContent + '\n\n' + trinitySection;
    await fs.writeFile(readmePath, newContent);

    return {
      success: true,
      message: 'Trinity Method section added to README.md',
      injected: true
    };

  } catch (error: any) {
    return {
      success: false,
      message: `Failed to inject Trinity Method section: ${error.message}`,
      error: error
    };
  }
}

/**
 * Generates Trinity Method section content
 * @param variables - Template variables
 * @returns Markdown content for Trinity Method section
 */
function generateTrinitySection(variables: Record<string, any>): string {
  const projectName = variables.PROJECT_NAME || 'this project';
  const framework = variables.FRAMEWORK || 'Unknown';
  const version = variables.TRINITY_VERSION || '1.0.0';

  return `## 🔱 Trinity Method

This project uses the **Trinity Method** - an investigation-first development methodology powered by AI agents.

### Quick Commands

#### Leadership Team
- **Aly (CTO)** - Strategic planning and work order creation
  \`\`\`bash
  /trinity-aly
  \`\`\`

- **AJ (Implementation Lead)** - Code execution and implementation
  \`\`\`bash
  /trinity-aj
  \`\`\`

#### Deployment Team
- **TAN (Structure Specialist)** - Directory architecture and organization
  \`\`\`bash
  /trinity-tan
  \`\`\`

- **ZEN (Knowledge Specialist)** - Documentation and knowledge base
  \`\`\`bash
  /trinity-zen
  \`\`\`

- **INO (Context Specialist)** - Codebase analysis and context building
  \`\`\`bash
  /trinity-ino
  \`\`\`

- **Ein (CI/CD Specialist)** - Continuous integration and deployment automation
  \`\`\`bash
  /trinity-ein
  \`\`\`

#### Audit Team
- **JUNO (Auditor)** - Quality assurance and comprehensive auditing
  \`\`\`bash
  /trinity-juno
  \`\`\`

### Documentation

All project knowledge is maintained in \`trinity/knowledge-base/\`:
- **ARCHITECTURE.md** - System design and technical decisions
- **ISSUES.md** - Known problems and their status
- **To-do.md** - Task tracking and priorities
- **Technical-Debt.md** - Debt management and refactoring plans
- **Trinity.md** - Trinity Method guidelines and protocols

### Session Management

Trinity Method uses investigation-first approach:
1. **Assess** - Understand current state
2. **Investigate** - Deep dive into root causes
3. **Plan** - Create comprehensive strategy
4. **Execute** - Implement with precision
5. **Verify** - Confirm success criteria met

Session archives are stored in \`trinity/sessions/\` for historical reference.

### Project Info

- **Framework:** ${framework}
- **Trinity Version:** ${version}
- **Agent Configuration:** \`.claude/\`
- **Knowledge Base:** \`trinity/knowledge-base/\`

### Getting Started

1. Review the [Employee Directory](.claude/EMPLOYEE-DIRECTORY.md) for agent details
2. Check [Trinity.md](trinity/knowledge-base/Trinity.md) for methodology guidelines
3. Open Claude Code and invoke agents as needed
4. Agents automatically access project context and documentation

---

*Deployed with Trinity Method SDK v${version}*`;
}
