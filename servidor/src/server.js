import dotenv from 'dotenv';
import os from 'os';
import app from "./app.js";
import { testConnection } from "./db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

// Función para obtener la IP local
const getLocalIP = () => {
  const networkInterfaces = os.networkInterfaces();
  for (const name of Object.keys(networkInterfaces)) {
    for (const iface of networkInterfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Iniciar servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Iniciar servidor en todas las interfaces (0.0.0.0)
    app.listen(PORT, '0.0.0.0', () => {
      const localIP = getLocalIP();
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📱 From mobile/network: http://${localIP}:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();