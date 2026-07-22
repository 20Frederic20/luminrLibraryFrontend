import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CategoryRequest, CategoryResponse } from '../models/category.model';
import { ApiResponse, Page } from '../../../core/models/api-response.model';
import { unwrapPage } from '../../../core/utils/rxjs-operator';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/categories';

  getCategories(): Observable<CategoryResponse[]> {
    return this.http
      .get<ApiResponse<Page<CategoryResponse>>>(this.apiUrl)
      .pipe(unwrapPage());
  }

  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.http.get<ApiResponse<CategoryResponse>>(`${this.apiUrl}/${id}`).pipe(
      map((response: ApiResponse<CategoryResponse>) => response.data)
    );
  }

  createCategory(categoryData: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<ApiResponse<CategoryResponse>>(this.apiUrl, categoryData).pipe(
      map((response: ApiResponse<CategoryResponse>) => response.data)
    );
  }

  updateCategory(id: string, categoryData: CategoryRequest): Observable<CategoryResponse> {
    return this.http.put<ApiResponse<CategoryResponse>>(`${this.apiUrl}/${id}`, categoryData).pipe(
      map((response: ApiResponse<CategoryResponse>) => response.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
