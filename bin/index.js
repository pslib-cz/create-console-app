#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const pacote = require('pacote');
const { execSync } = require('child_process');

(async function () {
  const args = process.argv.slice(2);
  const nameArg = args.find(a => !a.startsWith('-'));
  const flags = new Set(args.filter(a => a.startsWith('-')));
  const appName = nameArg || 'ts-console-app';

  const autoInstall =
    flags.has('--install') ||
    flags.has('-i') ||
    process.env.npm_config_install === 'true' ||
    process.env.npm_config_install === '1' ||
    process.env.npm_config_pslib_install === 'true' ||
    process.env.npm_config_pslib_install === '1';

  const target = path.resolve(process.cwd(), appName);
  if (fs.existsSync(target) && (await fs.readdir(target)).length) {
    console.error(`❌ Cílová složka "${appName}" není prázdná.`);
    process.exit(2);
  }

  console.log(`📦 Vytvářím projekt z @pslib/console-app do ./${appName} …`);
  await fs.mkdirp(target);
  await pacote.extract('@pslib/console-app@latest', target);

  const pkgPath = path.join(target, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  pkg.name = appName;
  pkg.private = true; 
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  const gi = ['node_modules/', 'dist/', '.env', '.DS_Store'].join('\n') + '\n';
  await fs.writeFile(path.join(target, '.gitignore'), gi, 'utf8');

  console.log('✅ Struktura hotová.');
  if (autoInstall) {
    try {
      console.log('📥 Instalace závislostí (npm install)…');
      execSync('npm install', { cwd: target, stdio: 'inherit' });
    } catch (e) {
      console.warn('⚠️ Instalace selhala. Proveďte ji ručně.');
    }
  }

  console.log(`
Další kroky:
  cd ${appName}
  ${autoInstall ? '' : 'npm install'}
  npm run dev
  # VS Code: F5 → "Attach (ts-node-dev)" / "Run (compiled JS)"
`);
})();