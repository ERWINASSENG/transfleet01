import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { TrackingPoint, VehicleTrackingStatus, Geofence, TrackingHistoryRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/tracking`;
  private readonly WS_URL = environment.apiUrl.replace('http', 'ws') + '/tracking/ws';

  private wsSubject: WebSocketSubject<TrackingPoint> | null = null;

  getVehicleStatus(vehicleId: string): Observable<VehicleTrackingStatus> {
    return this.http.get<VehicleTrackingStatus>(`${this.API_URL}/vehicles/${vehicleId}/status`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement du statut')))
    );
  }

  getAllVehiclesStatus(): Observable<VehicleTrackingStatus[]> {
    return this.http.get<VehicleTrackingStatus[]>(`${this.API_URL}/vehicles/status`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des statuts')))
    );
  }

  getTrackingHistory(request: TrackingHistoryRequest): Observable<TrackingPoint[]> {
    const params = new HttpParams()
      .set('startTime', request.startTime.toISOString())
      .set('endTime', request.endTime.toISOString())
      .set('interval', (request.interval || 60).toString());

    return this.http.get<TrackingPoint[]>(`${this.API_URL}/vehicles/${request.vehicleId}/history`, { params }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement de l\'historique')))
    );
  }

  connectToRealTimeTracking(): WebSocketSubject<TrackingPoint> | null {
    if (!this.wsSubject) {
      try {
        this.wsSubject = webSocket<TrackingPoint>(this.WS_URL);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        return null;
      }
    }
    return this.wsSubject;
  }

  disconnectFromRealTimeTracking(): void {
    if (this.wsSubject) {
      this.wsSubject.complete();
      this.wsSubject = null;
    }
  }

  subscribeToVehicle(vehicleId: string): void {
    if (this.wsSubject) {
      this.wsSubject.next({ type: 'subscribe', vehicleId } as unknown as TrackingPoint);
    }
  }

  unsubscribeFromVehicle(vehicleId: string): void {
    if (this.wsSubject) {
      this.wsSubject.next({ type: 'unsubscribe', vehicleId } as unknown as TrackingPoint);
    }
  }

  getGeofences(): Observable<Geofence[]> {
    return this.http.get<Geofence[]>(`${this.API_URL}/geofences`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des géofences')))
    );
  }

  createGeofence(geofence: Omit<Geofence, 'id' | 'createdAt' | 'updatedAt'>): Observable<Geofence> {
    return this.http.post<Geofence>(`${this.API_URL}/geofences`, geofence).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la création de la géofence')))
    );
  }

  updateGeofence(id: string, geofence: Partial<Geofence>): Observable<Geofence> {
    return this.http.patch<Geofence>(`${this.API_URL}/geofences/${id}`, geofence).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour de la géofence')))
    );
  }

  deleteGeofence(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/geofences/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression de la géofence')))
    );
  }

  getCurrentLocation(vehicleId: string): Observable<TrackingPoint> {
    return this.http.get<TrackingPoint>(`${this.API_URL}/vehicles/${vehicleId}/location`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement de la localisation')))
    );
  }
}
