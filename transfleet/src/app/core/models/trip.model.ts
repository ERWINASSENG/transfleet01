export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  startLocation: Location;
  endLocation: Location;
  waypoints?: Location[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  estimatedDistance: number;
  actualDistance?: number;
  estimatedDuration: number;
  actualDuration?: number;
  purpose: string;
  passengers?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface TripCreateRequest {
  vehicleId: string;
  driverId: string;
  startLocation: Location;
  endLocation: Location;
  waypoints?: Location[];
  estimatedDistance: number;
  estimatedDuration: number;
  purpose: string;
  passengers?: number;
  notes?: string;
  scheduledStartTime?: Date;
}

export interface TripUpdateRequest {
  status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  endTime?: Date;
  actualDistance?: number;
  actualDuration?: number;
  notes?: string;
}
