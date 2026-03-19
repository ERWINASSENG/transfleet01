export interface Vehicle {
  id: string;
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  capacity: number;
  mileage: number;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  purchaseDate?: Date;
  purchasePrice?: number;
  insuranceExpiry?: Date;
  technicalInspectionExpiry?: Date;
  assignedDriverId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleCreateRequest {
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  capacity: number;
  mileage: number;
  purchaseDate?: Date;
  purchasePrice?: number;
  insuranceExpiry?: Date;
  technicalInspectionExpiry?: Date;
}

export interface VehicleUpdateRequest extends Partial<VehicleCreateRequest> {
  status?: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  assignedDriverId?: string | null;
}
