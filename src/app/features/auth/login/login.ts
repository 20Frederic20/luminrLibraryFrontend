import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      // On récupère les valeurs saisies (username et password)
      const credentials = {
        username: this.loginForm.value.username!,
        password: this.loginForm.value.password!
      };

      // On envoie le tout à Spring Boot via notre service
      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Connexion réussie ! Token stocké.', response);
          // Rediriger l'utilisateur vers le dashboard après la connexion
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erreur de connexion (Identifiants incorrects, problème réseau...)', err);
          alert('Identifiants incorrects ou serveur injoignable.');
        }
      });
    }
  }
}
