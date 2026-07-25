import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AuthResponse } from '../models/auth.model';
import { ApiResponse } from '../models/api-response.model';
import { UserResponse } from '../../features/admin/users/models/user.model';

@Injectable({
  providedIn: 'root' // Disponible partout dans l'application
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly USER_KEY = 'user_profile';

  private currentUserSignal = signal<UserResponse | null>(this.getUserFromStorage());

  private getUserFromStorage(): UserResponse | null {
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  }



  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`/auth/login`, credentials).pipe(
      map(response => {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('roles', JSON.stringify(response.data.roles));
        this.loadUserProfile();
        return response.data;
      })
    );
  }

  loadUserProfile() {
    return this.http.get<ApiResponse<UserResponse>>('/auth/me').pipe(
      tap(
        response => {
          this.setSessionUser(response.data);
        }
      )
    );
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSignal();
  }
  setSessionUser(user: UserResponse): void {
    this.currentUserSignal.set(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
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

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  // Se déconnecter
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.USER_KEY);
  }
}
