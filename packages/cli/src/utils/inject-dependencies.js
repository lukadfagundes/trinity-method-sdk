import fs from 'fs-extra';
import chalk from 'chalk';

export async function injectLintingDependencies(dependencies, scripts, framework) {
  if (framework === 'Node.js' || framework === 'React' || framework === 'Next.js') {
    await injectNodeDependencies(dependencies, scripts);
  } else if (framework === 'Python') {
    await injectPythonDependencies(dependencies);
  }
  // Rust and Flutter have built-in tools, no injection needed
}

async function injectNodeDependencies(dependencies, scripts) {
  const packageJsonPath = 'package.json';

  if (!(await fs.pathExists(packageJsonPath))) {
    console.warn(
      chalk.yellow('   Warning: package.json not found, skipping dependency injection')
    );
    return;
  }

  const packageJson = await fs.readJson(packageJsonPath);

  // Add devDependencies
  packageJson.devDependencies = packageJson.devDependencies || {};

  dependencies.forEach((dep) => {
    // Handle scoped packages like @typescript-eslint/parser@^6.7.0
    const lastAtIndex = dep.lastIndexOf('@');
    const name = dep.substring(0, lastAtIndex);
    const version = dep.substring(lastAtIndex + 1);
    packageJson.devDependencies[name] = version;
  });
  
  // Add Scripts
  packageJson.scripts = packageJson.scripts || {};
  Object.entries(scripts).forEach(([name, command]) => {
    if (!packageJson.scripts[name]) {
      packageJson.scripts[name] = command;
    }
  });

  // Write back with formatting
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function injectPythonDependencies(dependencies) {
  const requirementsPath = 'requirements-dev.txt';

  // Create or append to requirements-dev.txt
  let content = '';
  if (await fs.pathExists(requirementsPath)) {
    content = await fs.readFile(requirementsPath, 'utf8');
  }

  dependencies.forEach((dep) => {
    if (!content.includes(dep.split('>=')[0])) {
      content += `${dep}\n`;
    }
  });

  await fs.writeFile(requirementsPath, content);
}
