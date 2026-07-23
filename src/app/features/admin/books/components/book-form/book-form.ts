import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BookService } from '../../services/book.service';
import { CategoryService } from '../../../categories/services/category.service';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { AuthorService } from '../../../authors/services/author.service';

import { CategoryResponse } from '../../../categories/models/category.model';
import { PublisherResponse } from '../../../publishers/models/publisher.model';
import { AuthorResponse } from '../../../authors/models/author.model';
import { SaveBookRequest } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.html'
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private publisherService = inject(PublisherService);
  private authorService = inject(AuthorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  bookForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  bookId = signal<string | null>(null);

  categories = signal<CategoryResponse[]>([]);
  publishers = signal<PublisherResponse[]>([]);
  authors = signal<AuthorResponse[]>([]);

  isLoadingData = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.initForm();
    this.loadAllData();
  }

  private initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      isbn: ['', [Validators.required]],
      description: [''],
      publicationDate: [''],
      quantity: [1, [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]],
      publisherId: ['', [Validators.required]],
      authorIds: [[], [Validators.required]]
    });
  }

  private loadAllData(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.bookId.set(id);

      forkJoin({
        categories: this.categoryService.getCategories(),
        publishers: this.publisherService.getPublishers(),
        authors: this.authorService.getAuthors(),
        book: this.bookService.getBookById(id)
      }).subscribe({
        next: (res) => {
          this.categories.set(res.categories);
          this.publishers.set(res.publishers);
          this.authors.set(res.authors);

          this.bookForm.patchValue({
            title: res.book.title,
            isbn: res.book.isbn,
            description: res.book.description ?? '',
            publicationDate: res.book.publicationDate
              ? new Date(res.book.publicationDate).toISOString().split('T')[0]
              : '',
            quantity: res.book.quantity,
            categoryId: res.book.category?.id ?? '',
            publisherId: res.book.publisher?.id ?? '',
            authorIds: res.book.authors ? res.book.authors.map(a => a.id) : []
          });

          this.isLoadingData.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement des données :', err);
          this.errorMessage.set('Impossible de charger les informations du livre et ses références.');
          this.isLoadingData.set(false);
        }
      });
    } else {
      // Mode création : on charge uniquement les listes de référence
      forkJoin({
        categories: this.categoryService.getCategories(),
        publishers: this.publisherService.getPublishers(),
        authors: this.authorService.getAuthors()
      }).subscribe({
        next: (res) => {
          this.categories.set(res.categories);
          this.publishers.set(res.publishers);
          this.authors.set(res.authors);
          this.isLoadingData.set(false);
        },
        error: (err) => {
          console.error('Erreur chargement des références :', err);
          this.errorMessage.set('Erreur lors du chargement des catégories, éditeurs et auteurs.');
          this.isLoadingData.set(false);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload: SaveBookRequest = this.bookForm.value;

    const request$ = this.isEditMode() && this.bookId()
      ? this.bookService.updateBook(this.bookId()!, payload)
      : this.bookService.createBook(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/books']);
      },
      error: (err) => {
        console.error('Erreur enregistrement livre :', err);
        this.errorMessage.set('Une erreur est survenue lors de l\'enregistrement.');
        this.isSubmitting.set(false);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.bookForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
