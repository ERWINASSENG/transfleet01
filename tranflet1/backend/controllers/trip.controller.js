'use strict';
const { Trip, Driver, Vehicle, User, Notification } = require('../models');
const { notifyUser } = require('../utils/socket');

// Positions de démo à Douala
const demoPositions = [
  { lat: 4.0485, lng: 9.7125 }, { lat: 4.0520, lng: 9.7001 },
  { lat: 4.0610, lng: 9.7310 }, { lat: 4.0390, lng: 9.7200 }
];

const tripIncludes = [
  { model: Vehicle, as: 'vehicle', attributes: ['id', 'plate', 'brand', 'model'] },
  { model: Driver, as: 'driver', include: [{ model: User, as: 'user', attributes: ['first_name', 'last_name'] }] }
];

exports.list = async (req, res, next) => {
  try {
    const trips = await Trip.findAll({ include: tripIncludes, order: [['created_at', 'DESC']] });
    res.json({ data: trips });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, status: 'planned' });
    
    // Récupérer le chauffeur pour obtenir son user_id
    const driver = await Driver.findByPk(req.body.driver_id, { include: [{ model: User, as: 'user' }] });
    
    // Créer une notification pour le chauffeur
    if (driver && driver.user) {
      await Notification.create({
        sender_id: req.user?.id,
        recipient_id: driver.user_id,
        type: 'info',
        title: 'Nouveau trajet planifié',
        message: `Un trajet de ${req.body.from_location} vers ${req.body.to_location} a été planifié pour vous`,
        target_role: 'driver',
        action_url: `/trips`
      });
      
      // Notification en temps réel via WebSocket
      notifyUser(driver.user_id, 'new_trip', {
        title: 'Nouveau trajet planifié',
        message: `Un trajet de ${req.body.from_location} vers ${req.body.to_location} a été planifié pour vous`,
        trip_id: trip.id
      });
    }
    
    res.status(201).json(trip);
  } catch (error) { next(error); }
};

exports.start = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Non trouvé' });

    await trip.update({ status: 'in_progress', actual_start: new Date() });

    const pos = demoPositions[Math.floor(Math.random() * demoPositions.length)];
    await TrackingPoint.create({
      vehicle_id: trip.vehicle_id,
      trip_id: trip.id,
      latitude: pos.lat,
      longitude: pos.lng,
      speed: 50,
      recorded_at: new Date()
    });

    res.json({ message: "Trajet démarré avec succès" });
  } catch (error) { next(error); }
};

exports.complete = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Non trouvé' });
    
    const { actual_distance, actual_duration, fuel_used, notes } = req.body;
    await trip.update({
      status: 'completed',
      actual_end: new Date(),
      actual_distance,
      actual_duration,
      fuel_used,
      notes
    });
    
    res.json({ message: "Trajet terminé avec succès" });
  } catch (error) { next(error); }
};

exports.cancel = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Non trouvé' });
    
    await trip.update({ status: 'cancelled', notes: req.body.reason || trip.notes });
    res.json({ message: "Trajet annulé avec succès" });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Non trouvé' });
    
    await trip.update(req.body);
    const updated = await Trip.findByPk(trip.id, { include: tripIncludes });
    res.json(updated);
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Non trouvé' });
    
    await trip.destroy();
    res.status(204).send();
  } catch (error) { next(error); }
};

// --- ACCEPTER / REFUSER TRAJET (Chauffeur) ---

exports.accept = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id, { include: tripIncludes });
    if (!trip) return res.status(404).json({ message: 'Trajet non trouvé' });
    
    if (trip.status !== 'planned') {
      return res.status(400).json({ message: 'Ce trajet ne peut plus être accepté' });
    }
    
    await trip.update({ status: 'in_progress', actual_start: new Date() });
    
    // Notifier le manager que le chauffeur a accepté (seulement si created_by existe)
    if (trip.created_by) {
      const driver = await Driver.findByPk(trip.driver_id, { include: [{ model: User, as: 'user' }] });
      const driverName = driver?.user ? `${driver.user.first_name} ${driver.user.last_name}` : 'Le chauffeur';
      
      await Notification.create({
        sender_id: req.user?.id || null,
        recipient_id: trip.created_by,
        type: 'success',
        title: 'Trajet accepté',
        message: `${driverName} a accepté le trajet ${trip.from_location} → ${trip.to_location}`,
        target_role: 'manager',
        action_url: `/trips`
      });
      
      // Notification en temps réel via WebSocket
      notifyUser(trip.created_by, 'trip_accepted', {
        title: 'Trajet accepté',
        message: `${driverName} a accepté le trajet ${trip.from_location} → ${trip.to_location}`,
        trip_id: trip.id
      });
      // Émettre aussi new_notification pour le badge
      notifyUser(trip.created_by, 'new_notification', {});
    }
    
    const updated = await Trip.findByPk(trip.id, { include: tripIncludes });
    res.json({ message: "Trajet accepté", trip: updated });
  } catch (error) { next(error); }
};

exports.decline = async (req, res, next) => {
  try {
    const trip = await Trip.findByPk(req.params.id, { include: tripIncludes });
    if (!trip) return res.status(404).json({ message: 'Trajet non trouvé' });
    
    if (trip.status !== 'planned') {
      return res.status(400).json({ message: 'Ce trajet ne peut plus être refusé' });
    }
    
    const reason = req.body.reason || 'Aucune raison fournie';
    await trip.update({ status: 'cancelled', notes: `Refusé par le chauffeur: ${reason}` });
    
    // Notifier le manager que le chauffeur a refusé (seulement si created_by existe)
    if (trip.created_by) {
      const driver = await Driver.findByPk(trip.driver_id, { include: [{ model: User, as: 'user' }] });
      const driverName = driver?.user ? `${driver.user.first_name} ${driver.user.last_name}` : 'Le chauffeur';
      
      await Notification.create({
        sender_id: req.user?.id || null,
        recipient_id: trip.created_by,
        type: 'warning',
        title: 'Trajet refusé',
        message: `${driverName} a refusé le trajet ${trip.from_location} → ${trip.to_location}. Raison: ${reason}`,
        target_role: 'manager',
        action_url: `/trips`
      });
      
      // Notification en temps réel via WebSocket
      notifyUser(trip.created_by, 'trip_declined', {
        title: 'Trajet refusé',
        message: `${driverName} a refusé le trajet ${trip.from_location} → ${trip.to_location}. Raison: ${reason}`,
        trip_id: trip.id,
        reason: reason
      });
      // Émettre aussi new_notification pour le badge
      notifyUser(trip.created_by, 'new_notification', {});
    }
    
    const updated = await Trip.findByPk(trip.id, { include: tripIncludes });
    res.json({ message: "Trajet refusé", trip: updated });
  } catch (error) { next(error); }
};