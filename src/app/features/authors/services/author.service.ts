import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorRequest, AuthorResponse } from '../models/author.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/authors'; // L'URL de ton contrôleur Java

  // Récupérer la liste des auteurs (renvoie un tableau d'AuthorResponse)
  getAuthors(): Observable<AuthorResponse[]> {
    return this.http.get<AuthorResponse[]>(this.apiUrl);
  }

  // Créer un nouvel auteur (prend un AuthorRequest en paramètre)
  createAuthor(authorData: AuthorRequest): Observable<AuthorResponse> {
    return this.http.post<AuthorResponse>(this.apiUrl, authorData);
  }

  // Récupérer un auteur par ID
  getAuthorById(id: string): Observable<AuthorResponse> {
    return this.http.get<AuthorResponse>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un auteur (prend un AuthorRequest en paramètre)
  updateAuthor(id: string, authorData: AuthorRequest): Observable<AuthorResponse> {
    return this.http.put<AuthorResponse>(`${this.apiUrl}/${id}`, authorData);
  }

  // Supprimer un auteur par ID
  deleteAuthor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
