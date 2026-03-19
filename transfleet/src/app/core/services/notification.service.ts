import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject, tap } from 'rxjs';
import { Notification, NotificationPreferences, NotificationCreateRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/notifications`;

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  getNotifications(params?: {
    isRead?: boolean;
    type?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }): Observable<{ notifications: Notification[]; total: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<{ notifications: Notification[]; total: number }>(this.API_URL, {
      params: httpParams
    }).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des notifications')))
    );
  }

  getNotificationById(id: string): Observable<Notification> {
    return this.http.get<Notification>(`${this.API_URL}/${id}`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Notification non trouvée')))
    );
  }

  markAsRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${this.API_URL}/${id}/read`, {}).pipe(
      tap(() => this.updateUnreadCount()),
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du marquage comme lu')))
    );
  }

  markAllAsRead(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/mark-all-read`, {}).pipe(
      tap(() => this.unreadCountSubject.next(0)),
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du marquage de toutes les notifications')))
    );
  }

  deleteNotification(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.updateUnreadCount()),
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la suppression de la notification')))
    );
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.API_URL}/unread-count`).pipe(
      tap(response => this.unreadCountSubject.next(response.count)),
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement du compteur')))
    );
  }

  updatePreferences(preferences: Partial<NotificationPreferences>): Observable<NotificationPreferences> {
    return this.http.patch<NotificationPreferences>(`${this.API_URL}/preferences`, preferences).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour des préférences')))
    );
  }

  getPreferences(): Observable<NotificationPreferences> {
    return this.http.get<NotificationPreferences>(`${this.API_URL}/preferences`).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors du chargement des préférences')))
    );
  }

  createNotification(data: NotificationCreateRequest): Observable<Notification> {
    return this.http.post<Notification>(this.API_URL, data).pipe(
      catchError(error => throwError(() => new Error(error.error?.message || 'Erreur lors de la création de la notification')))
    );
  }

  private updateUnreadCount(): void {
    this.getUnreadCount().subscribe();
  }
}
