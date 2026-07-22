import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

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
    this.loadDependenciesAndBookData();
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
      authorIds: [[], [Validators.required]] // Doit contenir au moins 1 auteur
    });
  }

  private loadDependenciesAndBookData(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // Charger les listes déroulantes en parallèle
    forkJoin({
      categories: this.categoryService.getCategories(),
      publishers: this.publisherService.getPublishers(),
      authors: this.authorService.getAuthors()
    }).subscribe({
      next: (res) => {
        this.categories.set(res.categories);
        this.publishers.set(res.publishers);
        this.authors.set(res.authors);

        if (id) {
          this.isEditMode.set(true);
          this.bookId.set(id);
          this.loadBookData(id);
        } else {
          this.isLoadingData.set(false);
        }
      },
      error: (err) => {
        console.error('Erreur chargement des références :', err);
        this.errorMessage.set('Erreur lors du chargement des données de référence (auteurs, éditeurs, catégories).');
        this.isLoadingData.set(false);
      }
    });
  }

  private loadBookData(id: string): void {
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          title: book.title,
          isbn: book.isbn,
          description: book.description,
          publicationDate: book.publicationDate,
          quantity: book.quantity,
          categoryId: book.category.id,
          publisherId: book.publisher.id,
          authorIds: book.authors.map(a => a.id) // Map vers les IDs
        });
        this.isLoadingData.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger les données du livre.');
        this.isLoadingData.set(false);
      }
    });
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
        this.router.navigate(['/books']);
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
