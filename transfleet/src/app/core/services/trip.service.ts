import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Trip, TripCreateRequest, TripUpdateRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/trips`;

  getTrips(params?: {
    status?: string;
    vehicleId?: string;
    driverId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Observable<{ trips: Trip[]; total: number }> {
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

    return this.http.get<{ trips: Trip[]; total: number }>(this.API_URL, {
      params: httpParams
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des trajets')))
    );
  }

  getTripById(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Trajet non trouvé')))
    );
  }

  createTrip(data: TripCreateRequest): Observable<Trip> {
    return this.http.post<Trip>(this.API_URL, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la création du trajet')))
    );
  }

  updateTrip(id: string, data: TripUpdateRequest): Observable<Trip> {
    return this.http.patch<Trip>(`${this.API_URL}/${id}`, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour du trajet')))
    );
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression du trajet')))
    );
  }

  startTrip(id: string): Observable<Trip> {
    return this.http.post<Trip>(`${this.API_URL}/${id}/start`, {}).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du démarrage du trajet')))
    );
  }

  completeTrip(id: string, actualDistance: number, actualDuration: number): Observable<Trip> {
    return this.http.post<Trip>(`${this.API_URL}/${id}/complete`, {
      actualDistance,
      actualDuration
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la finalisation du trajet')))
    );
  }

  cancelTrip(id: string, reason?: string): Observable<Trip> {
    return this.http.post<Trip>(`${this.API_URL}/${id}/cancel`, { reason }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de l\'annulation du trajet')))
    );
  }

  getActiveTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.API_URL}/active`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des trajets actifs')))
    );
  }

  getTripStatistics(params?: {
    startDate?: Date;
    endDate?: Date;
  }): Observable<{
    totalTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    totalDistance: number;
    totalDuration: number;
    averageDistance: number;
    averageDuration: number;
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
      totalTrips: number;
      completedTrips: number;
      cancelledTrips: number;
      totalDistance: number;
      totalDuration: number;
      averageDistance: number;
      averageDuration: number;
    }>(`${this.API_URL}/statistics`, { params: httpParams }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des statistiques')))
    );
  }
}
