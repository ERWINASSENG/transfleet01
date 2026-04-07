import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private authService = inject(AuthService);

  connect(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    // Remove /api suffix for WebSocket connection
    const baseUrl = (environment.apiUrl || 'http://localhost:5000').replace('/api', '');
    this.socket = io(baseUrl, {
      transports: ['websocket'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connecté');
      // Authentifier l'utilisateur
      this.socket?.emit('authenticate', user.id);
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket déconnecté');
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  off(event: string): void {
    this.socket?.off(event);
  }
}
