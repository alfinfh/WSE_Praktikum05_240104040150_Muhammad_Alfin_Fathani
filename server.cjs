const app = require('./app.cjs');
const PORT = 3200;
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server: http://127.0.0.1:${PORT}`);
  console.log('Katalog: /api/buku');
  console.log('Swagger UI: /docs/');
  console.log('Dashboard: /');
});
server.on('error', error => { console.error('Server gagal:', error.code, error.message); process.exitCode = 1; });
