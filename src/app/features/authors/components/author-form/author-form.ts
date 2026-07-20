import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { AuthorRequest } from '../../models/author.model';

@Component({
  selector: 'app-author-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css'
})
export class AuthorForm {
  private authorService = inject(AuthorService);
  private router = inject(Router);

  // Configuration du formulaire calquée sur AuthorRequest.java
  authorForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    birthPlace: new FormControl(''), // Optionnel
    birthDate: new FormControl('')   // Optionnel
  });

  onSubmit(): void {
    if (this.authorForm.valid) {
      const newAuthor: AuthorRequest = {
        firstName: this.authorForm.value.firstName!,
        lastName: this.authorForm.value.lastName!,
        birthPlace: this.authorForm.value.birthPlace || undefined,
        birthDate: this.authorForm.value.birthDate || undefined
      };

      this.authorService.createAuthor(newAuthor).subscribe({
        next: (response) => {
          console.log('Auteur créé avec succès !', response);
          alert('Auteur enregistré !');
          this.router.navigate(['/authors']);
        },
        error: (err) => {
          console.error("Erreur lors de la création de l'auteur", err);
          alert("Impossible d'enregistrer l'auteur. Vérifiez les données ou la connexion avec Spring Boot.");
        }
      });
    }
  }
}
