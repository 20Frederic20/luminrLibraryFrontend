import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { CategoryRequest } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  // Signals pour l'état de l'interface
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  onSubmit(): void {
    // Re-réinitialiser le message d'erreur à chaque tentative
    this.errorMessage.set(null);

    // Si le formulaire n'est pas valide, on force l'affichage des erreurs inline
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const newCategory: CategoryRequest = {
      name: this.categoryForm.value.name!,
      description: this.categoryForm.value.description || undefined
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        // Redirection directe vers la liste
        this.router.navigate(['/categories']);
      },
      error: (err) => {
        this.isSubmitting.set(false);

        // Extraction fine du message d'erreur du backend
        if (err.status === 409) {
          this.errorMessage.set('Une catégorie avec ce nom existe déjà.');
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('Une erreur est survenue lors de l\'enregistrement. Veuillez réessayer.');
        }
      }
    });
  }
}
