// Copia archivos del frontend a backend/src/main/resources/static

const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, '../backend/src/main/resources/static');

// Crea la carpeta destino si no existe
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Lista de archivos a copiar
const files = ['index.html', 'style.css', 'script.js'];

files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`${file} copiado a static`);
  } else {
    console.warn(`${file} NO encontrado en frontend`);
  }
});