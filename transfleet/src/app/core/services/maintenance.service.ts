import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MaintenanceRecord, MaintenanceCreateRequest, MaintenanceUpdateRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/maintenance`;

  getMaintenanceRecords(params?: {
    vehicleId?: string;
    status?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<{ records: MaintenanceRecord[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            httpParams = httpParams.set(key, value.toISOString());
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<{ records: MaintenanceRecord[]; total: number }>(this.API_URL, {
      params: httpParams
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des maintenances')))
    );
  }

  getMaintenanceRecordById(id: string): Observable<MaintenanceRecord> {
    return this.http.get<MaintenanceRecord>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Enregistrement non trouvé')))
    );
  }

  createMaintenanceRecord(data: MaintenanceCreateRequest): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceRecord>(this.API_URL, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la création de la maintenance')))
    );
  }

  updateMaintenanceRecord(id: string, data: MaintenanceUpdateRequest): Observable<MaintenanceRecord> {
    return this.http.patch<MaintenanceRecord>(`${this.API_URL}/${id}`, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour de la maintenance')))
    );
  }

  deleteMaintenanceRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression de la maintenance')))
    );
  }

  startMaintenance(id: string): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceRecord>(`${this.API_URL}/${id}/start`, {}).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du démarrage de la maintenance')))
    );
  }

  completeMaintenance(id: string, completedDate: Date, cost: number): Observable<MaintenanceRecord> {
    return this.http.post<MaintenanceRecord>(`${this.API_URL}/${id}/complete`, {
      completedDate,
      cost
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la finalisation de la maintenance')))
    );
  }

  getUpcomingMaintenance(days: number = 30): Observable<MaintenanceRecord[]> {
    return this.http.get<MaintenanceRecord[]>(`${this.API_URL}/upcoming`, {
      params: { days: days.toString() }
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des maintenances à venir')))
    );
  }

  getMaintenanceStatistics(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Observable<{
    totalCost: number;
    totalRecords: number;
    byType: Record<string, { count: number; cost: number }>;
    byStatus: Record<string, number>;
  }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value instanceof Date) {
          httpParams = httpParams.set(key, value.toISOString());
        }
      });
    }

    return this.http.get<{
      totalCost: number;
      totalRecords: number;
      byType: Record<string, { count: number; cost: number }>;
      byStatus: Record<string, number>;
    }>(`${this.API_URL}/statistics`, { params: httpParams }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des statistiques')))
    );
  }

  uploadDocument(id: string, file: File, type: string): Observable<MaintenanceRecord> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);

    return this.http.post<MaintenanceRecord>(`${this.API_URL}/${id}/documents`, formData).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de l\'upload du document')))
    );
  }
}
