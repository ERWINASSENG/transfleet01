import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Vehicle, VehicleCreateRequest, VehicleUpdateRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/vehicles`;

  getVehicles(params?: {
    status?: string;
    brand?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<{ vehicles: Vehicle[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<{ vehicles: Vehicle[]; total: number }>(this.API_URL, {
      params: httpParams
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des véhicules')))
    );
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Véhicule non trouvé')))
    );
  }

  createVehicle(data: VehicleCreateRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.API_URL, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la création du véhicule')))
    );
  }

  updateVehicle(id: string, data: VehicleUpdateRequest): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.API_URL}/${id}`, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du véhicule')))
    );
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression du véhicule')))
    );
  }

  assignDriver(vehicleId: string, driverId: string | null): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.API_URL}/${vehicleId}/assign`, { driverId }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de l\'attribution du conducteur')))
    );
  }

  updateMileage(vehicleId: string, mileage: number): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`${this.API_URL}/${vehicleId}/mileage`, { mileage }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du kilométrage')))
    );
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.API_URL}/available`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des véhicules disponibles')))
    );
  }

  getVehicleStatistics(): Observable<{
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
    outOfService: number;
    byFuelType: Record<string, number>;
  }> {
    return this.http.get<{
      total: number;
      available: number;
      inUse: number;
      maintenance: number;
      outOfService: number;
      byFuelType: Record<string, number>;
    }>(`${this.API_URL}/statistics`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des statistiques')))
    );
  }
}
