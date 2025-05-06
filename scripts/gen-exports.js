#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const projectRoot = process.cwd();
const distDir     = path.join(projectRoot, 'dist');
const pkgPath     = path.join(projectRoot, 'package.json');
const pkg         = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

(async () => {
  // Find all .js files under dist (including nested dirs)
  const jsFiles = await fg('**/*.js', { cwd: distDir });

  // Build exports mapping keys that exactly mirror file paths (minus .js extension)
  const exportsMap = jsFiles.reduce((out, jsFile) => {
    // e.g. "src/utils/helper.js" -> "src/utils/helper"
    const keyPath = jsFile.replace(/\.js$/, '');

    const jsPath  = `./dist/${jsFile}`;
    const dtsFile = jsFile.replace(/\.js$/, '.d.ts');

    // Check if corresponding .d.ts exists
    if (fs.existsSync(path.join(distDir, dtsFile))) {
      out[`./${keyPath}`] = { import: jsPath, types: `./dist/${dtsFile}` };
    } else {
      out[`./${keyPath}`] = { import: jsPath };
    }
    return out;
  }, {});

  // Replace exports section with explicit mappings
  pkg.exports = exportsMap;

  // Write back to package.json
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ package.json exports updated:', Object.keys(pkg.exports));
})();
