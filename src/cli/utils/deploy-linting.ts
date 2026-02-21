import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { processTemplate } from './template-processor.js';
import { validatePath } from './validate-path.js';
import { LintingTool, Stack } from '../types.js';

export async function deployLintingTool(
  tool: LintingTool,
  stack: Stack,
  templatesPath: string,
  variables: Record<string, string | number>
): Promise<void> {
  const frameworkDir = getFrameworkDirectory(stack.framework);
  const templateDir = path.join(templatesPath, 'root/linting', frameworkDir);

  switch (tool.id) {
    case 'eslint':
    case 'eslint-typescript': // Alias for eslint with TypeScript (backward compatibility)
      await deployESLint(tool, stack, templateDir, variables);
      break;
    case 'prettier':
      await deployPrettier(tool, templateDir, variables);
      break;
    case 'precommit':
      await deployPreCommit(tool, stack, templateDir, variables);
      break;
    case 'typescript-eslint':
      await deployTypeScriptESLint(tool, stack, templateDir, variables);
      break;
    case 'black':
    case 'flake8':
    case 'isort':
      await deployPythonTool(tool, templateDir, variables);
      break;
    case 'dartanalyzer':
      await deployDartAnalyzer(tool, templateDir, variables);
      break;
    case 'clippy':
    case 'rustfmt':
      await deployRustTool(tool, templateDir, variables);
      break;
    default:
      console.warn(`Unknown linting tool: ${tool.id}`);
  }
}

function getFrameworkDirectory(framework: string): string {
  const frameworkMap: Record<string, string> = {
    'Node.js': 'nodejs',
    React: 'nodejs',
    'Next.js': 'nodejs',
    Python: 'python',
    Flutter: 'flutter',
    Rust: 'rust',
  };
  return frameworkMap[framework] || 'nodejs';
}

async function deployESLint(
  tool: LintingTool,
  stack: Stack,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  let templateFile: string;

  if (stack.language === 'TypeScript') {
    templateFile = '.eslintrc-typescript.json.template';
  } else if ('moduleType' in stack && (stack as { moduleType?: string }).moduleType === 'esm') {
    templateFile = '.eslintrc-esm.json.template';
  } else {
    templateFile = '.eslintrc-commonjs.json.template';
  }

  const templatePath = path.join(templateDir, templateFile);
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);

  // Validate destination path for security
  const destPath = validatePath('.eslintrc.json');
  await fs.writeFile(destPath, processed);
}

async function deployPrettier(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const templatePath = path.join(templateDir, '.prettierrc.json.template');
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);

  // Validate destination path for security
  const destPath = validatePath('.prettierrc.json');
  await fs.writeFile(destPath, processed);
}

async function deployPreCommit(
  tool: LintingTool,
  stack: Stack,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  // Skip if existing pre-commit setup detected
  if (await hasExistingPreCommitSetup()) {
    console.warn(
      chalk.yellow('   Existing pre-commit configuration detected, skipping deployment')
    );
    return;
  }

  const framework = stack.framework;
  if (framework === 'Node.js' || framework === 'React' || framework === 'Next.js') {
    await deployHuskyPreCommit(tool, templateDir, variables);
  } else {
    await deployPythonPreCommit(tool, templateDir, variables);
  }
}

async function hasExistingPreCommitSetup(): Promise<boolean> {
  // Check for .husky/ directory
  if (await fs.pathExists('.husky')) {
    return true;
  }

  // Check for .pre-commit-config.yaml
  if (await fs.pathExists('.pre-commit-config.yaml')) {
    return true;
  }

  // Check package.json for husky or lint-staged
  if (await fs.pathExists('package.json')) {
    const pkg = await fs.readJson('package.json');
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    if (allDeps.husky || allDeps['lint-staged']) {
      return true;
    }
  }

  return false;
}

async function deployHuskyPreCommit(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  // Create .husky directory
  await fs.ensureDir('.husky');

  // Deploy pre-commit hook from template
  const templatePath = path.join(templateDir, '.husky-pre-commit.template');
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);

  const destPath = validatePath('.husky/pre-commit');
  await fs.writeFile(destPath, processed, { mode: 0o755 });

  // Add lint-staged config to package.json
  await addLintStagedConfig();
}

async function addLintStagedConfig(): Promise<void> {
  const packageJsonPath = 'package.json';
  if (!(await fs.pathExists(packageJsonPath))) {
    return;
  }

  const pkg = await fs.readJson(packageJsonPath);
  if (pkg['lint-staged']) {
    return; // Already has lint-staged config
  }

  pkg['lint-staged'] = {
    '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
    '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
    '*.{json,md,yml,yaml}': ['prettier --write'],
  };

  await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
}

async function deployPythonPreCommit(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const templatePath = path.join(templateDir, '.pre-commit-config.yaml.template');
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);

  // Validate destination path for security
  const destPath = validatePath('.pre-commit-config.yaml');
  await fs.writeFile(destPath, processed);
}

async function deployTypeScriptESLint(
  _tool: LintingTool,
  _stack: Stack,
  _templateDir: string,
  _variables: Record<string, string | number>
): Promise<void> {
  // Modify existing .eslintrc.json to add TypeScript support
  const eslintPath = '.eslintrc.json';
  if (await fs.pathExists(eslintPath)) {
    const config = await fs.readJson(eslintPath);
    config.extends = config.extends || [];
    if (!config.extends.includes('plugin:@typescript-eslint/recommended')) {
      config.extends.push('plugin:@typescript-eslint/recommended');
    }
    config.parser = '@typescript-eslint/parser';
    config.plugins = config.plugins || [];
    if (!config.plugins.includes('@typescript-eslint')) {
      config.plugins.push('@typescript-eslint');
    }
    await fs.writeJson(eslintPath, config, { spaces: 2 });
  }
}

async function deployPythonTool(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  if (tool.id === 'black' || tool.id === 'isort') {
    // Both go in pyproject.toml
    const templatePath = path.join(templateDir, 'pyproject.toml.template');
    const content = await fs.readFile(templatePath, 'utf8');
    const processed = processTemplate(content, variables);

    // Validate destination path for security
    const destPath = validatePath('pyproject.toml');
    await fs.writeFile(destPath, processed);
  } else if (tool.id === 'flake8') {
    const templatePath = path.join(templateDir, '.flake8.template');
    const content = await fs.readFile(templatePath, 'utf8');
    const processed = processTemplate(content, variables);

    // Validate destination path for security
    const destPath = validatePath('.flake8');
    await fs.writeFile(destPath, processed);
  }
}

async function deployDartAnalyzer(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const templatePath = path.join(templateDir, 'analysis_options.yaml.template');
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);

  // Validate destination path for security
  const destPath = validatePath('analysis_options.yaml');
  await fs.writeFile(destPath, processed);
}

async function deployRustTool(
  tool: LintingTool,
  templateDir: string,
  variables: Record<string, string | number>
): Promise<void> {
  const filename = tool.id === 'clippy' ? 'clippy.toml' : 'rustfmt.toml';
  const templatePath = path.join(templateDir, `${filename}.template`);
  const content = await fs.readFile(templatePath, 'utf8');
  const processed = processTemplate(content, variables);

  // Validate destination path for security
  const destPath = validatePath(filename);
  await fs.writeFile(destPath, processed);
}
