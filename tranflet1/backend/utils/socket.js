'use strict';
const { Server } = require('socket.io');

let io = null;
const userSockets = new Map(); // Map userId -> socketId

/**
 * Initialise Socket.io avec le serveur HTTP
 * @param {http.Server} server
 * @returns {Server}
 */
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:4200',
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connecté: ${socket.id}`);

    // Enregistrer l'utilisateur quand il s'authentifie
    socket.on('authenticate', (userId) => {
      if (userId) {
        userSockets.set(userId.toString(), socket.id);
        socket.userId = userId.toString();
        console.log(`👤 Utilisateur ${userId} associé au socket ${socket.id}`);
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }
      console.log(`🔌 Socket déconnecté: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Récupère l'instance io
 * @returns {Server|null}
 */
function getIO() {
  return io;
}

/**
 * Notifie un utilisateur spécifique
 * @param {string|number} userId
 * @param {string} event
 * @param {*} data
 */
function notifyUser(userId, event, data) {
  if (!io) return;

  const socketId = userSockets.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`📢 Notification envoyée à l'utilisateur ${userId}: ${event}`);
  }
}

/**
 * Notifie tous les clients connectés
 * @param {string} event
 * @param {*} data
 */
function broadcast(event, data) {
  if (!io) return;
  io.emit(event, data);
}

module.exports = {
  initSocket,
  getIO,
  notifyUser,
  broadcast,
  userSockets
};
