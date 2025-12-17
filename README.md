# @pslib/create-ts-console

Scaffolder pro založení TypeScript konzolové aplikace. Vytvoří projekt podle šablony @pslib/console-app (obsahuje TypeScript, ts-node, Vitest, Prettier a připravené ladění ve VS Code).

## Požadavky

Node.js ≥ 20 (obsahuje i npm)

Ověření: 
````
node -v
npm -v
````

## Rychlý start

Vytvoření nového projektu moje-app:

````
npm create @pslib/ts-console@latest moje-app
cd moje-app
npm install
npm run dev
````

## Automatická instalace závislostí (volitelné)
````
npm create @pslib/ts-console@latest -- moje-app --install
````

## Alternativní spuštění
````
npx create-ts-console moje-app
npx create-ts-console moje-app --install
````
````
npx -p @pslib/create-ts-console create-ts-console moje-app
npx -p @pslib/create-ts-console create-ts-console moje-app --install
````