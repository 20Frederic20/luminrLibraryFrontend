import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorResponse } from '../models/author.model';
import { ApiResponse, Page } from '../../../core/models/api-response.model';
import { unwrapPage } from '../../../core/utils/rxjs-operator';
import { unwrapData } from '../../../core/utils/rxjs-operator';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);

  // Récupérer la liste des auteurs (renvoie un tableau d'AuthorResponse)
  getAuthors(): Observable<AuthorResponse[]> {
    return this.http
          .get<ApiResponse<Page<AuthorResponse>>>('/authors')
          .pipe(unwrapPage());
  }

  // Récupérer un auteur par ID
  getAuthorById(id: string): Observable<AuthorResponse> {
    return this.http.get<ApiResponse<AuthorResponse>>(`/authors/${id}`).pipe(
      unwrapData()
    );
  }
}
