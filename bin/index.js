#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const pacote = require('pacote');
const { execSync } = require('child_process');

(async function () {
  const [, , rawName, ...rest] = process.argv;
  const appName = rawName || 'ts-console-app';
  const autoInstall = rest.includes('--install') || rest.includes('-i');

  const target = path.resolve(process.cwd(), appName);
  if (fs.existsSync(target) && (await fs.readdir(target)).length) {
    console.error(`❌ Cílová složka "${appName}" není prázdná.`);
    process.exit(2);
  }

  console.log(`📦 Vytvářím projekt z @pslib/console-app do ./${appName} …`);
  await fs.mkdirp(target);

  // Stáhne a rozbalí obsah publikovaného balíčku do cíle
  await pacote.extract('@pslib/console-app@latest', target);

  // Přepiš name v package.json
  const pkgPath = path.join(target, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  pkg.name = appName;
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

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
  # VS Code: F5 → "Run (ts-node)" nebo "Run (compiled JS)"
`);
})();