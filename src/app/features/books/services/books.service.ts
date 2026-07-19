// features/books/services/book.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/books.model';

@Injectable({
  providedIn: 'root' // Rend le service disponible partout
})
export class BookService {
  // On injecte le client HTTP d'Angular
  private http = inject(HttpClient);

  // URL de ton contrôleur @RestController Spring Boot
  private apiUrl = 'http://localhost:8080/api/books';

  // Cette méthode retourne un Observable (un flux de données) contenant un tableau de livres
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }
}