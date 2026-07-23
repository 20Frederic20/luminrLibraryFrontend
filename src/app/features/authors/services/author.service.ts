import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorRequest, AuthorResponse } from '../models/author.model';
import { ApiResponse, Page } from '../../../core/models/api-response.model';
import { unwrapPage } from '../../../core/utils/rxjs-operator';

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

  // Créer un nouvel auteur (prend un AuthorRequest en paramètre)
  createAuthor(authorData: AuthorRequest): Observable<AuthorResponse> {
    return this.http.post<AuthorResponse>('/authors', authorData);
  }

  // Récupérer un auteur par ID
  getAuthorById(id: string): Observable<AuthorResponse> {
    return this.http.get<AuthorResponse>(`/authors/${id}`);
  }

  // Mettre à jour un auteur (prend un AuthorRequest en paramètre)
  updateAuthor(id: string, authorData: AuthorRequest): Observable<AuthorResponse> {
    return this.http.put<AuthorResponse>(`/authors/${id}`, authorData);
  }

  // Supprimer un auteur par ID
  deleteAuthor(id: string): Observable<void> {
    return this.http.delete<void>(`/authors/${id}`);
  }
}
