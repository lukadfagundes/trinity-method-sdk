import { LintingTool, PostInstallInstruction } from '../types.js';

export const lintingTools: Record<string, LintingTool[]> = {
  'Node.js': [
    {
      id: 'eslint',
      name: 'ESLint',
      description: 'JavaScript/TypeScript linter',
      file: '.eslintrc.json',
      recommended: true,
      dependencies: ['eslint@^8.50.0'],
      scripts: {
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
      },
    },
    {
      id: 'prettier',
      name: 'Prettier',
      description: 'Code formatter',
      file: '.prettierrc.json',
      recommended: true,
      dependencies: ['prettier@^3.0.0'],
      scripts: {
        format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
        'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,md}"',
      },
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
    },
    {
      id: 'typescript-eslint',
      name: 'TypeScript ESLint',
      description: 'TypeScript-specific linting',
      file: 'extends typescript in .eslintrc.json',
      recommended: false, // Only if TypeScript detected
      dependencies: [
        '@typescript-eslint/parser@^6.7.0',
        '@typescript-eslint/eslint-plugin@^6.7.0',
      ],
    },
  ],

  'React': [
    {
      id: 'eslint',
      name: 'ESLint',
      description: 'JavaScript/TypeScript linter',
      file: '.eslintrc.json',
      recommended: true,
      dependencies: ['eslint@^8.50.0', 'eslint-plugin-react@^7.33.0'],
      scripts: {
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
      },
    },
    {
      id: 'prettier',
      name: 'Prettier',
      description: 'Code formatter',
      file: '.prettierrc.json',
      recommended: true,
      dependencies: ['prettier@^3.0.0'],
      scripts: {
        format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
        'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,md}"',
      },
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
    },
    {
      id: 'typescript-eslint',
      name: 'TypeScript ESLint',
      description: 'TypeScript-specific linting',
      file: 'extends typescript in .eslintrc.json',
      recommended: false,
      dependencies: [
        '@typescript-eslint/parser@^6.7.0',
        '@typescript-eslint/eslint-plugin@^6.7.0',
      ],
    },
  ],

  'Python': [
    {
      id: 'black',
      name: 'Black',
      description: 'Python code formatter',
      file: 'pyproject.toml',
      recommended: true,
      dependencies: ['black>=23.0.0'],
    },
    {
      id: 'flake8',
      name: 'Flake8',
      description: 'Python linter',
      file: '.flake8',
      recommended: true,
      dependencies: ['flake8>=6.0.0'],
    },
    {
      id: 'isort',
      name: 'isort',
      description: 'Import sorter',
      file: 'pyproject.toml',
      recommended: true,
      dependencies: ['isort>=5.12.0'],
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: ['pre-commit>=3.3.0'],
    },
  ],

  'Flutter': [
    {
      id: 'dartanalyzer',
      name: 'Dart Analyzer',
      description: 'Dart/Flutter linter',
      file: 'analysis_options.yaml',
      recommended: true,
      dependencies: [], // Built into Dart SDK
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
    },
  ],

  'Rust': [
    {
      id: 'clippy',
      name: 'Clippy',
      description: 'Rust linter',
      file: 'clippy.toml',
      recommended: true,
      dependencies: [], // Built into Rust toolchain
    },
    {
      id: 'rustfmt',
      name: 'Rustfmt',
      description: 'Rust formatter',
      file: 'rustfmt.toml',
      recommended: true,
      dependencies: [], // Built into Rust toolchain
    },
    {
      id: 'precommit',
      name: 'Pre-commit hooks',
      description: 'Git hooks for code quality',
      file: '.pre-commit-config.yaml',
      recommended: true,
      dependencies: [],
    },
  ],
};

export function getToolsForFramework(framework: string, language: string): LintingTool[] {
  // Special handling for TypeScript
  const tools = lintingTools[framework] || lintingTools['Node.js'] || [];

  if (language === 'TypeScript') {
    return tools.map((tool) => {
      if ((tool as any).requiresTypeScript) {
        return { ...tool, recommended: true };
      }
      return tool;
    });
  }

  return tools.filter((tool) => !(tool as any).requiresTypeScript);
}

export function getRecommendedTools(framework: string, language: string): LintingTool[] {
  const tools = getToolsForFramework(framework, language);
  return tools.filter((tool) => tool.recommended);
}

export function getDependenciesForTools(selectedTools: LintingTool[]): string[] {
  return selectedTools.flatMap((tool) => tool.dependencies || []);
}

export function getScriptsForTools(selectedTools: LintingTool[]): Record<string, string> {
  const scripts: Record<string, string> = {};
  selectedTools.forEach((tool) => {
    if (tool.scripts) {
      Object.assign(scripts, tool.scripts);
    }
  });
  return scripts;
}

export function getPostInstallInstructions(selectedTools: LintingTool[], framework: string): PostInstallInstruction[] {
  const instructions: PostInstallInstruction[] = [];

  selectedTools.forEach((tool) => {
    const postInstall = (tool as any).postInstall;
    if (postInstall) {
      instructions.push({
        command: postInstall,
        description: `Setup ${tool.name}`
      });
    }
  });

  return instructions;
}
