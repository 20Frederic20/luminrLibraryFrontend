import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root' // Disponible partout dans l'application
})
export class AuthService {
  private http = inject(HttpClient);

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`/auth/login`, credentials).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('roles', JSON.stringify(response.data.roles));
        return response.data;
      })
    );
  }

  getUserRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }

  hasAnyRole(allowedRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.some(role => allowedRoles.includes(role));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`/auth/register`, userData);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Se déconnecter
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
  }
}
