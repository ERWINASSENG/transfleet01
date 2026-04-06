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

const any = [authenticate];

// --- AUTHENTIFICATION ---
router.post('/auth/login', auth.login);

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

// --- TRACKING (Lecture seule pour éviter les crashs) ---
router.get('/tracking', ...any, track.latest);

// --- MAINTENANCE ---
router.get('/maintenance', ...any, maintenance.list);
router.post('/maintenance', ...any, maintenance.create);
router.get('/maintenance/:id', ...any, maintenance.get);
router.put('/maintenance/:id', ...any, maintenance.update);
router.delete('/maintenance/:id', ...any, maintenance.remove);
router.get('/maintenance/upcoming', ...any, maintenance.upcoming);

// --- ÉVITER LES ERREURS 404 DANS LA CONSOLE ---
router.get('/notifications', ...any, (req, res) => res.json({ data: [] }));

module.exports = router;