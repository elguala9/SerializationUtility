#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const projectRoot = process.cwd();
const distDir     = path.join(projectRoot, 'dist');
const pkgPath     = path.join(projectRoot, 'package.json');
const pkg         = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

(async () => {
  // Scan all .js files under dist (including nested dirs)
  const jsFiles = await fg('**/*.js', { cwd: distDir });

  // Build per-file exports, stripping "src/" prefix
  const exportsMap = jsFiles.reduce((out, jsFile) => {
    // "src/Serialization.js" -> "src/Serialization"
    const subpath = jsFile.replace(/\.js$/, '');
    const key     = `./${subpath}`;
    const jsPath  = `./dist/${jsFile}`;          // actual ESM file
    const dtsFile = jsFile.replace(/\.js$/, '.d.ts');
    const hasTypes = fs.existsSync(path.join(distDir, dtsFile));

    // Map both import and require to same file, plus types if present
    out[key] = {
      import: jsPath,
      require: jsPath,
      ...(hasTypes ? { types: `./dist/${dtsFile}` } : {})
    };
    return out;
  }, {});

  // Wildcard mapping for any subpath under src
  /*const wildcard = {
    './*': {
      import: './dist/src/*.js',
      require: './dist/src/*.js',
      types:  './dist/src/*.d.ts'
    }
  };*/

  // Replace exports with wildcard + explicit entries
  pkg.exports = {
    //...wildcard,
    ...exportsMap
  };

  // Write back
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ package.json exports updated:', Object.keys(pkg.exports));
})();
