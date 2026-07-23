import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../services/book.service';
import { BookResponse } from '../../models/book.model';
import { HeaderComponent } from '../../../../shared/layouts/header/header.component';
import { FooterComponent } from '../../../../shared/layouts/footer/footer.component';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './book-detail.component.html'
})
export class BookDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  book = signal<BookResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.fetchBookDetail(bookId);
    } else {
      this.errorMessage.set('Identifiant de livre invalide.');
      this.isLoading.set(false);
    }
  }

  fetchBookDetail(id: string): void {
    this.isLoading.set(true);
    this.bookService.getBookById(id).subscribe({
      next: (data) => {
        this.book.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement livre:', err);
        this.errorMessage.set('Impossible de charger les informations de ce livre.');
        this.isLoading.set(false);
      }
    });
  }
}
