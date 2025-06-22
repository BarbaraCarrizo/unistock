const fs = require('fs');
const path = require('path');

function moveRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (fs.lstatSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
      moveRecursive(path.join(src, file), path.join(dest, file));
    }
    fs.rmdirSync(src);
  } else {
    fs.renameSync(src, dest);
  }
}

// 1. Backend
moveRecursive('c:/Users/barba/unistock/unistock/src', 'c:/Users/barba/unistock/backend/src');
moveRecursive('c:/Users/barba/unistock/unistock/pom.xml', 'c:/Users/barba/unistock/backend/pom.xml');
moveRecursive('c:/Users/barba/unistock/unistock/mvnw', 'c:/Users/barba/unistock/backend/mvnw');
moveRecursive('c:/Users/barba/unistock/unistock/mvnw.cmd', 'c:/Users/barba/unistock/backend/mvnw.cmd');
moveRecursive('c:/Users/barba/unistock/unistock/.mvn', 'c:/Users/barba/unistock/backend/.mvn');
moveRecursive('c:/Users/barba/unistock/unistock/HELP.md', 'c:/Users/barba/unistock/backend/HELP.md');
moveRecursive('c:/Users/barba/unistock/unistock/data', 'c:/Users/barba/unistock/backend/data');
moveRecursive('c:/Users/barba/unistock/unistock/target', 'c:/Users/barba/unistock/backend/target');

// 2. Frontend
moveRecursive('c:/Users/barba/unistock/unistock/frontend', 'c:/Users/barba/unistock/frontend');

// 3. Eliminar carpeta vacía
try { fs.rmdirSync('c:/Users/barba/unistock/unistock'); } catch {}

console.log('Archivos movidos.');
