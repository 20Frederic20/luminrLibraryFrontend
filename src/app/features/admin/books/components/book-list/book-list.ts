import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { BookResponse } from '../../models/book.model';
import { DataTableComponent } from '../../../../../shared/components/data-table/data-table.component';
import { ColumnDef } from '../../../../../shared/components/data-table/data-table.model';
import { DataTableActionDirective } from '../../../../../shared/components/data-table/data-table-action.directive';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, DataTableActionDirective],
  templateUrl: './book-list.html'
})
export class BookList implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);

  books = signal<BookResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  columns: ColumnDef<BookResponse>[] = [
    { key: 'isbn', header: 'ISBN', class: 'font-mono text-xs text-slate-600 font-semibold' },
    { key: 'title', header: 'Titre', class: 'font-bold text-slate-900' },
    { key: 'category', header: 'Catégorie', formatter: (b) => b.category?.name || '-' },
    { key: 'publisher', header: 'Éditeur', formatter: (b) => b.publisher?.name || '-' },
    { key: 'authors', header: 'Auteur(s)', formatter: (b) => b.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ') }
  ];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading.set(true);
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement des livres :', err);
        this.errorMessage.set('Impossible de charger le catalogue de livres.');
        this.isLoading.set(false);
      }
    });
  }

  updateBook(book: BookResponse): void {
    this.router.navigate(['/admin/books/edit', book.id]);
  }

  deleteBook(book: BookResponse): void {
    if (confirm(`Voulez-vous supprimer le livre "${book.title}" ?`)) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => {
          this.books.update(list => list.filter(b => b.id !== book.id));
        },
        error: () => alert('Erreur lors de la suppression du livre.')
      });
    }
  }
}
