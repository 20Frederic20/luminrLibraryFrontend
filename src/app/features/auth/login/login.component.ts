import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // État de l'interface utilisateur (Signals)
  isSubmitting = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
  this.errorMessage.set(null);

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isSubmitting.set(true);

  const credentials = {
    email: this.loginForm.value.email!,
    password: this.loginForm.value.password!
  };

  // 1. Étape 1 : Connexion
  this.authService.login(credentials).subscribe({
    next: () => {
      // 2. Étape 2 : Récupération des infos utilisateur
      this.authService.loadUserProfile().subscribe({
        next: () => {
          this.isSubmitting.set(false);
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error('Erreur lors de la récupération du profil :', err);
          this.errorMessage.set('Impossible de charger votre profil utilisateur.');
        }
      });
    },
    error: (err) => {
      this.isSubmitting.set(false);
      if (err.status === 401) {
        this.errorMessage.set('Email ou mot de passe incorrect.');
      } else if (err.error?.message) {
        this.errorMessage.set(err.error.message);
      } else {
        this.errorMessage.set('Connexion impossible. Veuillez vérifier votre réseau.');
      }
    }
  });
}

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
