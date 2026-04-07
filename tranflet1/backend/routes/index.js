'use strict';
const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// Imports des contrôleurs
const auth = require('../controllers/auth.controller');
const trip = require('../controllers/trip.controller');
const track = require('../controllers/tracking.controller');
const vehicle = require('../controllers/vehicle.controller');
const driver = require('../controllers/driver.controller');
const fuel = require('../controllers/fuel.controller');
const maintenance = require('../controllers/maintenance.controller');
const report = require('../controllers/report.controller'); 
const notification = require('../controllers/notification.controller');
const user = require('../controllers/user.controller'); 

const any = [authenticate];

// --- AUTHENTIFICATION ---
router.post('/auth/login', auth.login);
router.put('/auth/password', authenticate, auth.changePassword);

// --- DASHBOARD (Rétabli pour Aminata Diallo) ---
router.get('/reports/dashboard', ...any, report.dashboard);

// --- VÉHICULES ---
router.get('/vehicles', ...any, vehicle.list);
router.post('/vehicles', ...any, vehicle.create);
router.get('/vehicles/:id', ...any, vehicle.get);
router.put('/vehicles/:id', ...any, vehicle.update);
router.delete('/vehicles/:id', ...any, vehicle.remove);

// --- CHAUFFEURS ---
router.get('/drivers', ...any, driver.list);
router.post('/drivers', ...any, driver.create);
router.get('/drivers/:id', ...any, driver.get);
router.put('/drivers/:id', ...any, driver.update);
router.delete('/drivers/:id', ...any, driver.remove);

// --- CARBURANT (FUEL) ---
router.get('/fuel', ...any, fuel.list);
router.post('/fuel', ...any, fuel.create);
router.get('/fuel/:id', ...any, fuel.get);
router.put('/fuel/:id', ...any, fuel.update);
router.delete('/fuel/:id', ...any, fuel.remove);
router.get('/fuel/stats', ...any, fuel.stats);

// --- TRAJETS (TRIPS) ---
router.get('/trips', ...any, trip.list);
router.post('/trips', ...any, trip.create);
router.put('/trips/:id', ...any, trip.update);
router.delete('/trips/:id', ...any, trip.remove);
router.post('/trips/:id/start', ...any, trip.start);
router.post('/trips/:id/complete', ...any, trip.complete);
router.post('/trips/:id/cancel', ...any, trip.cancel);
router.post('/trips/:id/accept', ...any, trip.accept);
router.post('/trips/:id/decline', ...any, trip.decline);

// --- TRACKING (Lecture seule pour éviter les crashs) ---
router.get('/tracking', ...any, track.latest);

// --- MAINTENANCE ---
router.get('/maintenance', ...any, maintenance.list);
router.post('/maintenance', ...any, maintenance.create);
router.get('/maintenance/:id', ...any, maintenance.get);
router.put('/maintenance/:id', ...any, maintenance.update);
router.delete('/maintenance/:id', ...any, maintenance.remove);
router.get('/maintenance/upcoming', ...any, maintenance.upcoming);

// --- UTILISATEURS ---
router.get('/users', ...any, user.list);
router.post('/users/manager', ...any, user.createManager);
router.post('/users/driver', ...any, user.createDriver);
router.delete('/users/:id', ...any, user.remove);
router.post('/users/:id/reset-password', ...any, user.resetPassword);

// --- NOTIFICATIONS ---
router.get('/notifications', ...any, notification.list);
router.get('/notifications/unread-count', ...any, notification.unreadCount);
router.post('/notifications', ...any, notification.create);
router.put('/notifications/:id/read', ...any, notification.markRead);
router.put('/notifications/mark-all-read', ...any, notification.markAllRead);
router.delete('/notifications/:id', ...any, notification.remove);

module.exports = router;