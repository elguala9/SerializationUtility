#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const projectRoot = process.cwd();
const distDir     = path.join(projectRoot, 'dist');
const pkgPath     = path.join(projectRoot, 'package.json');
const pkg         = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

fg('**/*.js', { cwd: distDir }).then(jsFiles => {
  // Build per-file exports, stripping "src/" from keys
  const exportsMap = jsFiles.reduce((out, jsFile) => {
    const cleanName = jsFile
      .replace(/\.js$/, '')       // remove extension
      .replace(/^src\//, '');     // strip src/ prefix

    const jsPath  = `./dist/${jsFile}`;
    const dtsFile = jsFile.replace(/\.js$/, '.d.ts');
    const dtsPath = `./dist/${dtsFile}`;

    out[`./${cleanName}`] = fs.existsSync(path.join(distDir, dtsFile))
      ? { import: jsPath, types: dtsPath }
      : { import: jsPath };

    return out;
  }, {});

  // Define exports: no root index, wildcard covers dist/src
  pkg.exports = {
    './*': {
      import: './dist/src/*.js',
      types:  './dist/src/*.d.ts'
    },
    ...exportsMap
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ package.json exports updated:', Object.keys(pkg.exports));
});
