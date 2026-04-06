'use strict';
const { Trip, Vehicle, Driver, User, TrackingPoint } = require('../models');

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