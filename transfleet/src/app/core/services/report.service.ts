import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/reports`;

  getVehicleUtilizationReport(params: {
    startDate: Date;
    endDate: Date;
    vehicleIds?: string[];
  }): Observable<{
    vehicleId: string;
    registrationNumber: string;
    totalTrips: number;
    totalDistance: number;
    totalDuration: number;
    fuelConsumption: number;
    utilizationRate: number;
  }[]> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate.toISOString())
      .set('endDate', params.endDate.toISOString());

    if (params.vehicleIds) {
      params.vehicleIds.forEach(id => {
        httpParams = httpParams.append('vehicleIds', id);
      });
    }

    return this.http.get<{
      vehicleId: string;
      registrationNumber: string;
      totalTrips: number;
      totalDistance: number;
      totalDuration: number;
      fuelConsumption: number;
      utilizationRate: number;
    }[]>(`${this.API_URL}/vehicle-utilization`, { params: httpParams }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement du rapport')))
    );
  }

  getDriverPerformanceReport(params: {
    startDate: Date;
    endDate: Date;
    driverIds?: string[];
  }): Observable<{
    driverId: string;
    fullName: string;
    totalTrips: number;
    totalDistance: number;
    averageRating: number;
    fuelEfficiency: number;
    safetyScore: number;
  }[]> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate.toISOString())
      .set('endDate', params.endDate.toISOString());

    if (params.driverIds) {
      params.driverIds.forEach(id => {
        httpParams = httpParams.append('driverIds', id);
      });
    }

    return this.http.get<{
      driverId: string;
      fullName: string;
      totalTrips: number;
      totalDistance: number;
      averageRating: number;
      fuelEfficiency: number;
      safetyScore: number;
    }[]>(`${this.API_URL}/driver-performance`, { params: httpParams }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement du rapport')))
    );
  }

  getCostAnalysisReport(params: {
    startDate: Date;
    endDate: Date;
  }): Observable<{
    fuelCosts: number;
    maintenanceCosts: number;
    otherCosts: number;
    totalCosts: number;
    byCategory: Record<string, number>;
    byMonth: Record<string, { fuel: number; maintenance: number; other: number }>;
  }> {
    const httpParams = new HttpParams()
      .set('startDate', params.startDate.toISOString())
      .set('endDate', params.endDate.toISOString());

    return this.http.get<{
      fuelCosts: number;
      maintenanceCosts: number;
      otherCosts: number;
      totalCosts: number;
      byCategory: Record<string, number>;
      byMonth: Record<string, { fuel: number; maintenance: number; other: number }>;
    }>(`${this.API_URL}/cost-analysis`, { params: httpParams }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement du rapport')))
    );
  }

  getTripReport(params: {
    startDate: Date;
    endDate: Date;
    status?: string;
  }): Observable<{
    totalTrips: number;
    completedTrips: number;
    cancelledTrips: number;
    averageDistance: number;
    averageDuration: number;
    byPurpose: Record<string, number>;
    byVehicle: Record<string, number>;
  }> {
    let httpParams = new HttpParams()
      .set('startDate', params.startDate.toISOString())
      .set('endDate', params.endDate.toISOString());

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<{
      totalTrips: number;
      completedTrips: number;
      cancelledTrips: number;
      averageDistance: number;
      averageDuration: number;
      byPurpose: Record<string, number>;
      byVehicle: Record<string, number>;
    }>(`${this.API_URL}/trips`, { params: httpParams }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement du rapport')))
    );
  }

  exportReport(reportType: string, params: {
    startDate: Date;
    endDate: Date;
    format: 'pdf' | 'excel' | 'csv';
  }): Observable<Blob> {
    const httpParams = new HttpParams()
      .set('startDate', params.startDate.toISOString())
      .set('endDate', params.endDate.toISOString())
      .set('format', params.format);

    return this.http.get(`${this.API_URL}/${reportType}/export`, {
      params: httpParams,
      responseType: 'blob'
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de l\'export du rapport')))
    );
  }

  getDashboardSummary(): Observable<{
    activeVehicles: number;
    activeDrivers: number;
    ongoingTrips: number;
    todayFuelCost: number;
    pendingMaintenance: number;
    unreadNotifications: number;
    alerts: string[];
  }> {
    return this.http.get<{
      activeVehicles: number;
      activeDrivers: number;
      ongoingTrips: number;
      todayFuelCost: number;
      pendingMaintenance: number;
      unreadNotifications: number;
      alerts: string[];
    }>(`${this.API_URL}/dashboard-summary`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement du résumé')))
    );
  }
}
