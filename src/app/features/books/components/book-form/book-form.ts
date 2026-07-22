import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { BookService } from '../../services/book.service';
import { CategoryService } from '../../../categories/services/category.service';
import { PublisherService } from '../../../publishers/services/publisher.service';
import { AuthorService } from '../../../authors/services/author.service';

import { SaveBookRequest } from '../../models/book.model';
import { CategoryResponse } from '../../../categories/models/category.model';
import { PublisherResponse } from '../../../publishers/models/publisher.model';
import { AuthorResponse } from '../../../authors/models/author.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private publisherService = inject(PublisherService);
  private authorService = inject(AuthorService);
  private router = inject(Router);

  // Listes pour alimenter les <select>
  categories: CategoryResponse[] = [];
  publishers: PublisherResponse[] = [];
  authors: AuthorResponse[] = [];

  isLoadingData = true;

  // Formulaire réactif calqué sur CreateBookRequest.java
  bookForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    isbn: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    publicationDate: new FormControl(''),
    quantity: new FormControl(1, [Validators.required, Validators.min(0)]),
    categoryId: new FormControl('', [Validators.required]),
    publisherId: new FormControl('', [Validators.required]),
    authorIds: new FormControl<string[]>([])
  });

  ngOnInit(): void {
    // Chargement en parallèle des référentiels
    forkJoin({
      categories: this.categoryService.getCategories(),
      publishers: this.publisherService.getPublishers(),
      authors: this.authorService.getAuthors()
    }).subscribe({
      next: (res) => {
        this.categories = res.categories;
        this.publishers = res.publishers;
        this.authors = res.authors;
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des référentiels', err);
        alert('Impossible de charger les dépendances du formulaire.');
        this.isLoadingData = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      const formVal = this.bookForm.value;

      const newBook: SaveBookRequest = {
        title: formVal.title!,
        isbn: formVal.isbn!,
        description: formVal.description || undefined,
        publicationDate: formVal.publicationDate || undefined,
        quantity: formVal.quantity!,
        categoryId: formVal.categoryId!,
        publisherId: formVal.publisherId!,
        authorIds: formVal.authorIds || []
      };

      this.bookService.createBook(newBook).subscribe({
        next: () => {
          alert('Livre enregistré avec succès !');
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Erreur lors de la création du livre', err);
          alert('Erreur lors de l\'enregistrement.');
        }
      });
    }
  }
}
