import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../features/admin/books/services/book.service';
import { BookResponse } from '../features/admin/books/models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private bookService = inject(BookService);

  // Signaux pour la gestion d'état des livres de la base
  books = signal<BookResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  // Couleurs de dégradés pour générer des couvertures visuelles variées aux livres sans images
  coverGradients = [
    'from-emerald-600 to-teal-800',
    'from-blue-600 to-indigo-900',
    'from-amber-600 to-orange-800',
    'from-purple-600 to-slate-900',
    'from-cyan-600 to-blue-800'
  ];

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.isLoading.set(true);
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des livres:', err);
        this.errorMessage.set('Impossible de charger les livres pour le moment.');
        this.isLoading.set(false);
      }
    });
  }

  // Helper pour attribuer un dégradé constant à chaque livre selon son ID ou index
  getCoverGradient(index: number): string {
    return this.coverGradients[index % this.coverGradients.length];
  }
}
