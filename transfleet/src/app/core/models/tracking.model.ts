export interface TrackingPoint {
  id: string;
  vehicleId: string;
  tripId?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  speed: number;
  heading?: number;
  accuracy?: number;
  timestamp: Date;
  ignitionStatus?: 'on' | 'off';
  odometer?: number;
  fuelLevel?: number;
  engineTemperature?: number;
}

export interface VehicleTrackingStatus {
  vehicleId: string;
  isOnline: boolean;
  lastSeen: Date;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  currentSpeed: number;
  currentTripId?: string;
  driverId?: string;
  engineStatus: 'running' | 'stopped' | 'unknown';
  batteryLevel?: number;
  signalStrength?: number;
}

export interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  coordinates: { latitude: number; longitude: number }[];
  radius?: number;
  vehicleIds: string[];
  alertOnEnter: boolean;
  alertOnExit: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackingHistoryRequest {
  vehicleId: string;
  startTime: Date;
  endTime: Date;
  interval?: number;
}
