// Copia de index.html a static
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'index.html');
const dest = path.join(__dirname, '../src/main/resources/static/index.html');

fs.copyFileSync(src, dest);
console.log('index.html copiado a static');

// Copia de style.css y script.js
['style.css', 'script.js'].forEach(file => {
  fs.copyFileSync(
    path.join(__dirname, file),
    path.join(__dirname, '../src/main/resources/static', file)
  );
  console.log(`${file} copiado a static`);
});
