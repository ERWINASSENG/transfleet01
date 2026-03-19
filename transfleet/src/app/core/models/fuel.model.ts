export interface FuelRecord {
  id: string;
  vehicleId: string;
  driverId: string;
  date: Date;
  quantity: number;
  pricePerUnit: number;
  totalCost: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  mileage: number;
  stationName?: string;
  stationLocation?: string;
  receiptUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FuelRecordCreateRequest {
  vehicleId: string;
  driverId: string;
  date: Date;
  quantity: number;
  pricePerUnit: number;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  mileage: number;
  stationName?: string;
  stationLocation?: string;
  notes?: string;
}

export interface FuelStatistics {
  vehicleId: string;
  totalCost: number;
  totalQuantity: number;
  averageConsumption: number;
  averagePricePerUnit: number;
  period: {
    start: Date;
    end: Date;
  };
}
