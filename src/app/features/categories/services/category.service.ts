import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryRequest, CategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/categories';

  getCategories(): Observable<CategoryResponse[]> {
    return this.http.get<CategoryResponse[]>(this.apiUrl);
  }

  createCategory(categoryData: CategoryRequest): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.apiUrl, categoryData);
  }
}
