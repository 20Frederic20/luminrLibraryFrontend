import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root' // Disponible partout dans l'application
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/auth'; // L'URL de ton Spring Boot

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Se déconnecter
  logout(): void {
    localStorage.removeItem('access_token');
  }
}
