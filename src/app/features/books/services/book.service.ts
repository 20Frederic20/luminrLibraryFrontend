import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookResponse, SaveBookRequest } from '../models/book.model';
import { ApiResponse, Page } from '../../../core/models/api-response.model';
import { unwrapData, unwrapPage } from '../../../core/utils/rxjs-operator';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/books'; // Adapte selon ton URL backend

  // Récupérer tous les livres
  getBooks(): Observable<BookResponse[]> {
    return this.http
      .get<ApiResponse<Page<BookResponse>>>(this.apiUrl)
      .pipe(unwrapPage());
  }

  // Récupérer un livre par son UUID
  getBookById(id: string): Observable<BookResponse> {
    return this.http.get<ApiResponse<BookResponse>>(`${this.apiUrl}/${id}`).pipe(unwrapData());
  }

  // Créer un nouveau livre (CreateBookRequest)
  createBook(bookData: SaveBookRequest): Observable<BookResponse> {
    return this.http.post<BookResponse>(this.apiUrl, bookData);
  }

  // Mettre à jour un livre existant (UpdateBookRequest)
  updateBook(id: string, bookData: SaveBookRequest): Observable<BookResponse> {
    return this.http.put<BookResponse>(`${this.apiUrl}/${id}`, bookData);
  }

  // Supprimer un livre
  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
