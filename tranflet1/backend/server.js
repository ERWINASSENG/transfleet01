'use strict';
require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const http = require('http');
const { initSocket } = require('./utils/socket');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion MySQL établie');
    // sync only in development (en production utiliser migrations)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
    }
    
    // Créer le serveur HTTP
    const server = http.createServer(app);
    
    // Initialiser Socket.io
    initSocket(server);
    
    server.listen(PORT, () => {
      console.log(`🚀 TRANSFLET API démarrée sur le port ${PORT}`);
      console.log(`   Mode : ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Impossible de démarrer le serveur :', err.message);
    process.exit(1);
  }
})();
