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
    email: new FormControl('', [Validators.required, Validators.email]), // Remplacé username par email
    password: new FormControl('', [Validators.required])
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email!, // Remplacé username par email
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => alert('Identifiants incorrects.')
      });
    }
  }
}
