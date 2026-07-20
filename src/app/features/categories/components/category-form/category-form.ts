import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryRequest } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css'
})
export class CategoryFormComponent {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  // Configuration du formulaire calquée sur CategoryRequest.java
  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('') // Optionnel
  });

  onSubmit(): void {
    if (this.categoryForm.valid) {
      // Construction de la requête correspondante au backend
      const newCategory: CategoryRequest = {
        name: this.categoryForm.value.name!,
        // Si la description est vide, on envoie undefined ou une chaîne vide
        description: this.categoryForm.value.description || undefined
      };

      // Envoi HTTP POST via notre service
      this.categoryService.createCategory(newCategory).subscribe({
        next: (response) => {
          console.log('Catégorie créée avec succès !', response);
          alert('Catégorie enregistrée !');
          // Retour automatique à la liste des catégories
          this.router.navigate(['/categories']);
        },
        error: (err) => {
          console.error("Erreur lors de la création de la catégorie", err);
          alert("Impossible d'enregistrer la catégorie. Vérifiez les données ou le serveur.");
        }
      });
    }
  }
}
