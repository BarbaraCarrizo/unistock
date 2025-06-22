/* Redirige todas las rutas a index.html para SPA */
const express = require('express');
const path = require('path');
const app = express();

const staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor frontend escuchando en http://localhost:${PORT}`);
});
