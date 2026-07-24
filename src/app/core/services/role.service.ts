import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { RoleResponse } from '../models/role.model';

@Injectable({
  providedIn: 'root' // Disponible partout dans l'application
})
export class RoleService {
  private http = inject(HttpClient);

  getRoles(): Observable<RoleResponse[]> {
    return this.http.get<ApiResponse<RoleResponse[]>>('/roles').pipe(
      map(response => response.data),
    );
  }
}
