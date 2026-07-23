import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { BookResponse } from '../../models/book.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);

  books = signal<BookResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  searchQuery = signal<string>('');

  coverGradients = [
    'from-emerald-600 to-teal-800',
    'from-blue-600 to-indigo-900',
    'from-amber-600 to-orange-800',
    'from-purple-600 to-slate-900',
    'from-cyan-600 to-blue-800'
  ];

  // Filtrage prenant en compte la liste des auteurs
  filteredBooks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    return this.books().filter(book => {
      if (!query) return true;

      const matchesTitle = book.title?.toLowerCase().includes(query);
      const matchesIsbn = book.isbn?.toLowerCase().includes(query);
      const matchesCategory = book.category?.name?.toLowerCase().includes(query);
      const matchesPublisher = book.publisher?.name?.toLowerCase().includes(query);

      // Recherche dans la liste des auteurs
      const matchesAuthor = book.authors?.some(author =>
        `${author.firstName || ''} ${author.lastName || ''}`.toLowerCase().includes(query)
      );

      return matchesTitle || matchesIsbn || matchesCategory || matchesPublisher || matchesAuthor;
    });
  });

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
        console.error('Erreur catalogue:', err);
        this.errorMessage.set('Impossible de charger le catalogue.');
        this.isLoading.set(false);
      }
    });
  }

  // Formatage propre pour afficher la liste des auteurs séparée par des virgules
  getAuthorsString(book: BookResponse): string {
    if (!book.authors || book.authors.length === 0) return 'Auteur inconnu';
    return book.authors
      .map(a => `${a.firstName || ''} ${a.lastName || ''}`.trim())
      .join(', ');
  }

  getCoverGradient(index: number): string {
    return this.coverGradients[index % this.coverGradients.length];
  }
}
