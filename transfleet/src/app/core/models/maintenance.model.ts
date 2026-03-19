export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  cost?: number;
  serviceProvider?: string;
  serviceProviderAddress?: string;
  serviceProviderPhone?: string;
  parts?: MaintenancePart[];
  laborCost?: number;
  partsCost?: number;
  documents?: MaintenanceDocument[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenancePart {
  id: string;
  name: string;
  reference?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MaintenanceDocument {
  id: string;
  type: 'invoice' | 'quote' | 'report' | 'photo';
  url: string;
  uploadedAt: Date;
}

export interface MaintenanceCreateRequest {
  vehicleId: string;
  type: 'routine' | 'repair' | 'inspection' | 'emergency';
  description: string;
  scheduledDate: Date;
  serviceProvider?: string;
  serviceProviderAddress?: string;
  serviceProviderPhone?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface MaintenanceUpdateRequest {
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  completedDate?: Date;
  cost?: number;
  parts?: MaintenancePart[];
  laborCost?: number;
  partsCost?: number;
  notes?: string;
}
