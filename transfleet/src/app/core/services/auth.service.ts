import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { User, LoginRequest, LoginResponse, RegisterRequest } from '../models';
import { environment } from '../../../environments/environment';

// Re-export types for consumers
export type { User, LoginRequest, LoginResponse, RegisterRequest };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  isAuthenticated = computed(() => !!this.currentUserSubject.value);
  currentUser = computed(() => this.currentUserSubject.value);
  userRole = computed(() => this.currentUserSubject.value?.role ?? null);

  constructor() {
    effect(() => {
      const user = this.currentUserSubject.value;
      if (user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.token);
        this.currentUserSubject.next(response.user);
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erreur de connexion'));
      })
    );
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, data).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erreur d\'inscription'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/refresh`, {}).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/profile`, userData).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/change-password`, {
      oldPassword,
      newPassword
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  hasRole(role: string): boolean {
    return this.currentUserSubject.value?.role === role;
  }

  isManager(): boolean {
    return this.hasRole('manager') || this.hasRole('admin');
  }

  isDriver(): boolean {
    return this.hasRole('driver');
  }
}
