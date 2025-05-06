#!/usr/bin/env node
import fs       from 'fs';
import path     from 'path';
import fg       from 'fast-glob';

const projectRoot = process.cwd();
const distDir     = path.join(projectRoot, 'dist');
const pkgPath     = path.join(projectRoot, 'package.json');
const pkg         = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// prendi tutti i .js e verifica se esiste il corrispondente .d.ts
fg('**/*.js', { cwd: distDir }).then(jsFiles => {
  const exportsMap = jsFiles.reduce((o, jsFile) => {
    const base = jsFile.replace(/\.js$/, '');              // es: "foo/bar"
    const jsPath = `./dist/${jsFile}`;                     // "./dist/foo/bar.js"
    const dtsPath = `./dist/${base}.d.ts`;                 // "./dist/foo/bar.d.ts"
    // crea l’entry export con import + types
    o[`./${base}`] = fs.existsSync(path.join(distDir, `${base}.d.ts`))
      ? { import: jsPath, types: dtsPath }
      : { import: jsPath };
    return o;
  }, {});

  pkg.exports = { ...(pkg.exports||{}), ...exportsMap };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('✅ exports aggiornati con', Object.keys(exportsMap));
});
