export interface Notification {
  id: string;
  userId: string;
  type: 'maintenance' | 'fuel' | 'trip' | 'alert' | 'system' | 'message';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  readAt?: Date;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  maintenanceAlerts: boolean;
  fuelAlerts: boolean;
  tripAlerts: boolean;
  systemAlerts: boolean;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface NotificationCreateRequest {
  userId: string;
  type: 'maintenance' | 'fuel' | 'trip' | 'alert' | 'system' | 'message';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  expiresAt?: Date;
}
