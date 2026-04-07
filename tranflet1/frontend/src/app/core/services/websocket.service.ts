import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private intervalId: any = null;
  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  connect(): void {
    // Polling toutes les 3 secondes pour simuler le temps réel
    this.intervalId = setInterval(() => {
      this.listeners.get('new_notification')?.forEach(cb => cb({}));
    }, 3000);
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string): void {
    this.listeners.delete(event);
  }
}
