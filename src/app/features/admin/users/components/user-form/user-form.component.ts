import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { RoleService } from '../../../../../core/services/role.service';
import { RoleResponse } from '../../../../../core/models/role.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm!: FormGroup;
  isEditMode = signal<boolean>(false);
  userId = signal<string | null>(null);

  isLoadingData = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');

  // Options de rôles disponibles
  availableRoles = signal<RoleResponse[]>([]);

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.userId.set(id);
      this.loadUserData(id);
    }

    this.roleService.getRoles().subscribe({
      next: (roles) => this.availableRoles.set(roles),
      error: (err) => console.error('Erreur chargement rôles:', err)
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      // Mot de passe requis uniquement à la création
      password: ['', this.isEditMode() ? [] : [Validators.required, Validators.minLength(6)]],
      roles: [['ROLE_USER'], [Validators.required]],
      active: [true]
    });
  }

  private loadUserData(id: string): void {
    this.isLoadingData.set(true);
    this.userForm.disable();

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        // En mode édition, le mot de passe n'est plus obligatoire
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();

        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roles: user.roles || ['ROLE_USER'],
          active: user.active ?? true
        });

        this.userForm.enable();
        this.isLoadingData.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement utilisateur :', err);
        this.errorMessage.set('Impossible de charger les données de l\'utilisateur.');
        this.userForm.enable();
        this.isLoadingData.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const formValue = this.userForm.value;

    // Si le mot de passe est vide en édition, on ne l'envoie pas dans le payload
    if (this.isEditMode() && !formValue.password) {
      delete formValue.password;
    }
    const payload: CreateUserRequest | UpdateUserRequest = formValue;

    const request$ = this.isEditMode() && this.userId()
      ? this.userService.updateUser(this.userId()!, payload as UpdateUserRequest)
      : this.userService.createUser(payload as CreateUserRequest);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/users']);
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
    const control = this.userForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
