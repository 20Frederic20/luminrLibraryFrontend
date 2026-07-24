import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/user.model';
import { ApiResponse, Page } from '../../../../core/models/api-response.model';
import { unwrapData, unwrapPage } from '../../../../core/utils/rxjs-operator';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<UserResponse[]> {
    return this.http
      .get<ApiResponse<Page<UserResponse>>>('/users')
      .pipe(unwrapPage());
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<ApiResponse<UserResponse>>(`/users/${id}`).pipe(
      unwrapData()
    );
  }

  createUser(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>('/users', request);
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`/users/${id}`, request);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`/users/${id}`);
  }
}
