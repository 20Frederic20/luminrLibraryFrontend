import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { AuthorRequest } from '../../models/author.model';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './author-form.component.html'
})
export class AuthorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authorService = inject(AuthorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  authorForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  authorId = signal<string | null>(null);

  isLoadingData = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.authorId.set(id);
      this.loadAuthorData(id);
    }
  }

  private initForm(): void {
    this.authorForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthPlace: [''],
      birthDate: ['']
    });
  }

  private loadAuthorData(id: string): void {
    this.isLoadingData.set(true);
    this.authorForm.disable(); // Verrouille le formulaire pendant le chargement

    this.authorService.getAuthorById(id).subscribe({
      next: (author) => {
        // Formatte la date au format YYYY-MM-DD requis par les inputs type="date"
        const formattedDate = author.birthDate
          ? new Date(author.birthDate).toISOString().split('T')[0]
          : '';

        this.authorForm.patchValue({
          firstName: author.firstName,
          lastName: author.lastName,
          birthPlace: author.birthPlace,
          birthDate: formattedDate
        });

        this.authorForm.enable();
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement auteur :', err);
        this.errorMessage.set('Impossible de charger les données de l\'auteur.');
        this.authorForm.enable();
        this.isLoadingData.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.authorForm.invalid) {
      this.authorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload: AuthorRequest = this.authorForm.value;

    const request$ = this.isEditMode() && this.authorId()
      ? this.authorService.updateAuthor(this.authorId()!, payload)
      : this.authorService.createAuthor(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/authors']);
      },
      error: (err) => {
        console.error('Erreur enregistrement :', err);
        if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Une erreur est survenue lors de l\'enregistrement.');
        }
        this.isSubmitting.set(false);
      }
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.authorForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
