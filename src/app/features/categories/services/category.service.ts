import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  CategoryResponse } from '../models/category.model';
import { ApiResponse, Page } from '../../../core/models/api-response.model';
import { unwrapData, unwrapPage } from '../../../core/utils/rxjs-operator';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(): Observable<CategoryResponse[]> {
    return this.http
      .get<ApiResponse<Page<CategoryResponse>>>('/categories')
      .pipe(unwrapPage());
  }

  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.http.get<ApiResponse<CategoryResponse>>(`/categories/${id}`).pipe(
      unwrapData()
    );
  }
}
