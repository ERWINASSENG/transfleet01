export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  yearsOfExperience: number;
  rating: number;
  status: 'available' | 'on_trip' | 'off_duty' | 'suspended';
  currentVehicleId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  documents: DriverDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverDocument {
  id: string;
  type: 'license' | 'medical_certificate' | 'insurance' | 'background_check';
  documentUrl: string;
  expiryDate?: Date;
  uploadedAt: Date;
}

export interface DriverCreateRequest {
  userId: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  yearsOfExperience: number;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface DriverUpdateRequest extends Partial<DriverCreateRequest> {
  status?: 'available' | 'on_trip' | 'off_duty' | 'suspended';
  currentVehicleId?: string | null;
}
