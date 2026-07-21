import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { BookResponse } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {
  private bookService = inject(BookService);

  books: BookResponse[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des livres', err);
        this.errorMessage = 'Impossible de charger le catalogue de livres. Vérifiez que le backend est démarré.';
        this.isLoading = false;
      }
    });
  }

  deleteBook(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          // On retire le livre supprimé du tableau local pour rafraîchir l'affichage sans recharger la page
          this.books = this.books.filter(b => b.id !== id);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du livre', err);
          alert('Impossible de supprimer le livre.');
        }
      });
    }
  }
}
