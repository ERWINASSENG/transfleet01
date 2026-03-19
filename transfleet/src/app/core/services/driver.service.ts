import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Driver, DriverCreateRequest, DriverUpdateRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/drivers`;

  getDrivers(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<{ drivers: Driver[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<{ drivers: Driver[]; total: number }>(this.API_URL, {
      params: httpParams
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des conducteurs')))
    );
  }

  getDriverById(id: string): Observable<Driver> {
    return this.http.get<Driver>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Conducteur non trouvé')))
    );
  }

  createDriver(data: DriverCreateRequest): Observable<Driver> {
    return this.http.post<Driver>(this.API_URL, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la création du conducteur')))
    );
  }

  updateDriver(id: string, data: DriverUpdateRequest): Observable<Driver> {
    return this.http.patch<Driver>(`${this.API_URL}/${id}`, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du conducteur')))
    );
  }

  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression du conducteur')))
    );
  }

  assignVehicle(driverId: string, vehicleId: string | null): Observable<Driver> {
    return this.http.patch<Driver>(`${this.API_URL}/${driverId}/vehicle`, { vehicleId }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de l\'attribution du véhicule')))
    );
  }

  updateStatus(driverId: string, status: Driver['status']): Observable<Driver> {
    return this.http.patch<Driver>(`${this.API_URL}/${driverId}/status`, { status }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du statut')))
    );
  }

  getAvailableDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.API_URL}/available`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des conducteurs disponibles')))
    );
  }

  getDriverStatistics(): Observable<{
    total: number;
    available: number;
    onTrip: number;
    offDuty: number;
    suspended: number;
    averageRating: number;
  }> {
    return this.http.get<{
      total: number;
      available: number;
      onTrip: number;
      offDuty: number;
      suspended: number;
      averageRating: number;
    }>(`${this.API_URL}/statistics`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des statistiques')))
    );
  }

  uploadDocument(driverId: string, file: File, type: string, expiryDate?: Date): Observable<Driver> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (expiryDate) {
      formData.append('expiryDate', expiryDate.toISOString());
    }

    return this.http.post<Driver>(`${this.API_URL}/${driverId}/documents`, formData).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de l\'upload du document')))
    );
  }
}
