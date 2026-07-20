import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Le formulaire refait à l'image du RegisterRequest de Spring Boot
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      // L'objet envoyé correspond exactement aux champs de ta classe Java
      const userData = {
        firstName: this.registerForm.value.firstName!,
        lastName: this.registerForm.value.lastName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!
      };

      this.authService.register(userData).subscribe({
        next: () => {
          alert('Compte créé avec succès !');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => alert("Erreur lors de l'inscription.")
      });
    }
  }
}
