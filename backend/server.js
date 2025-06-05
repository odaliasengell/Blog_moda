const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
});

// Manejo de errores del servidor
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requiere privilegios elevados`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind} ya está en uso`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('🔒 Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('🔒 Servidor cerrado');
    process.exit(0);
  });
});