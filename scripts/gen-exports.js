#!/usr/bin/env node
import fs   from 'fs';
import path from 'path';
import fg   from 'fast-glob';

const projectRoot = process.cwd();
const distDir     = path.join(projectRoot, 'dist');
const pkgPath     = path.join(projectRoot, 'package.json');
const pkg         = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

fg('**/*.js', { cwd: distDir }).then(jsFiles => {
  // Build per-file exports, stripping "src/" if present
  const exportsMap = jsFiles.reduce((out, jsFile) => {
    // remove extension and strip leading "src/"
    const base = jsFile
      .replace(/\.js$/, '')        // "src/Serialization" or "Utility"
      .replace(/^src\//, '');      // now "Serialization" or "Utility"

    const jsPath  = `./dist/${jsFile}`;         // "./dist/src/Serialization.js"
    const dtsPath = `./dist/${jsFile.replace(/\.js$/, '.d.ts')}`;

    out[`./${base}`] = fs.existsSync(path.join(distDir, `${base}.d.ts`))
      ? { import: jsPath, types: dtsPath }
      : { import: jsPath };

    return out;
  }, {});

  // Merge in wildcard export and main entry
  pkg.exports = {
    // entry-point
    '.': {
      import: './dist/index.js',
      types:  './dist/index.d.ts'
    },

    // wildcard: any subpath
    './*': {
      import: './dist/*.js',
      types:  './dist/*.d.ts'
    },

    // then all your explicit entries
    ...exportsMap
  };

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ package.json exports updated:', Object.keys(pkg.exports));
});
