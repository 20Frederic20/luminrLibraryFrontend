import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user.model';
import { DataTableComponent } from '../../../../../shared/components/data-table/data-table.component';
import { ColumnDef } from '../../../../../shared/components/data-table/data-table.model';
import { DataTableActionDirective } from '../../../../../shared/components/data-table/data-table-action.directive';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, DataTableActionDirective],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<UserResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  columns: ColumnDef<UserResponse>[] = [
    { key: 'firstName', header: 'Prénom', class: 'font-semibold text-slate-900' },
    { key: 'lastName', header: 'Nom', class: 'font-semibold text-slate-900' },
    { key: 'email', header: 'Email' },
    {
      key: 'roles',
      header: 'Rôles',
      formatter: (user) => user.roles?.join(', ') || '-'
    },
    {
      key: 'active',
      header: 'Statut',
      formatter: (user) => user.active ? 'Actif' : 'Inactif'
    }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs:', err);
        this.errorMessage.set('Impossible de récupérer la liste des utilisateurs.');
        this.isLoading.set(false);
      }
    });
  }

  updateUser(user: UserResponse): void {
    this.router.navigate(['/admin/users/edit', user.id]);
  }

  deleteUser(user: UserResponse): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.users.update(list => list.filter(u => u.id !== user.id));
        },
        error: () => alert('Erreur lors de la suppression de l\'utilisateur.')
      });
    }
  }
}
