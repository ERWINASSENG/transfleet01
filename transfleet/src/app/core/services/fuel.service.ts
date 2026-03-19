import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { FuelRecord, FuelRecordCreateRequest, FuelStatistics } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FuelService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/fuel`;

  getFuelRecords(params?: {
    vehicleId?: string;
    driverId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<{ records: FuelRecord[]; total: number }> {
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

    return this.http.get<{ records: FuelRecord[]; total: number }>(this.API_URL, {
      params: httpParams
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des consommations')))
    );
  }

  getFuelRecordById(id: string): Observable<FuelRecord> {
    return this.http.get<FuelRecord>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Enregistrement non trouvé')))
    );
  }

  createFuelRecord(data: FuelRecordCreateRequest): Observable<FuelRecord> {
    return this.http.post<FuelRecord>(this.API_URL, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la création de l\'enregistrement')))
    );
  }

  updateFuelRecord(id: string, data: Partial<FuelRecordCreateRequest>): Observable<FuelRecord> {
    return this.http.patch<FuelRecord>(`${this.API_URL}/${id}`, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour de l\'enregistrement')))
    );
  }

  deleteFuelRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression de l\'enregistrement')))
    );
  }

  getFuelStatistics(vehicleId: string, params: {
    startDate: Date;
    endDate: Date;
  }): Observable<FuelStatistics> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate.toISOString())
      .set('endDate', params.endDate.toISOString());

    return this.http.get<FuelStatistics>(`${this.API_URL}/statistics/${vehicleId}`, {
      params: httpParams
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des statistiques')))
    );
  }

  getGlobalStatistics(params: {
    startDate: Date;
    endDate: Date;
  }): Observable<{
    totalCost: number;
    totalQuantity: number;
    byFuelType: Record<string, { quantity: number; cost: number }>;
    byVehicle: Record<string, { quantity: number; cost: number }>;
  }> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate.toISOString())
      .set('endDate', params.endDate.toISOString());

    return this.http.get<{
      totalCost: number;
      totalQuantity: number;
      byFuelType: Record<string, { quantity: number; cost: number }>;
      byVehicle: Record<string, { quantity: number; cost: number }>;
    }>(`${this.API_URL}/statistics/global`, { params: httpParams }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des statistiques globales')))
    );
  }

  uploadReceipt(id: string, file: File): Observable<FuelRecord> {
    const formData = new FormData();
    formData.append('receipt', file);

    return this.http.post<FuelRecord>(`${this.API_URL}/${id}/receipt`, formData).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de l\'upload du reçu')))
    );
  }
}
