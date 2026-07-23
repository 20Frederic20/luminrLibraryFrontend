import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { AuthorResponse } from '../../models/author.model';
import { DataTableComponent } from '../../../../../shared/components/data-table/data-table.component';
import { ColumnDef } from '../../../../../shared/components/data-table/data-table.model';
import { DataTableActionDirective } from '../../../../../shared/components/data-table/data-table-action.directive';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, DataTableActionDirective],
  templateUrl: './author-list.component.html'
})
export class AuthorListComponent implements OnInit {
  private authorService = inject(AuthorService);
  private router = inject(Router)

  authors = signal<AuthorResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Configuration des colonnes calquée sur ton modèle AuthorResponse
  columns: ColumnDef<AuthorResponse>[] = [
    { key: 'firstName', header: 'Prénom', class: 'font-semibold text-slate-900' },
    { key: 'lastName', header: 'Nom', class: 'font-semibold text-slate-900' },
    { key: 'birthPlace', header: 'Lieu de naissance' },
    { key: 'birthDate', header: 'Date de naissance' }
  ];

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.isLoading.set(true);
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement auteurs:', err);
        this.errorMessage.set('Impossible de récupérer la liste des auteurs.');
        this.isLoading.set(false);
      }
    });
  }

  updateAuthor(author: AuthorResponse): void {
    this.router.navigate(['/admin/authors', author.id]);
  }

  deleteAuthor(author: AuthorResponse): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'auteur ${author.firstName} ${author.lastName} ?`)) {
      this.authorService.deleteAuthor(author.id).subscribe({
        next: () => {
          this.authors.update(list => list.filter(a => a.id !== author.id));
        },
        error: () => alert('Erreur lors de la suppression de l\'auteur.')
      });
    }
  }
}
