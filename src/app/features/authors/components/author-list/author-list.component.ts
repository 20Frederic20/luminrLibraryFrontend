import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../services/author.service';
import { AuthorResponse } from '../../models/author.model';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './author-list.component.html'
})
export class AuthorListComponent implements OnInit {
  private authorService = inject(AuthorService);

  authors = signal<AuthorResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  searchQuery = signal<string>('');

  // Filtrage réactif par nom, prénom ou lieu de naissance
  filteredAuthors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    return this.authors().filter(author => {
      if (!query) return true;

      const fullName = `${author.firstName || ''} ${author.lastName || ''}`.toLowerCase();
      const birthPlace = author.birthPlace?.toLowerCase() || '';

      return fullName.includes(query) || birthPlace.includes(query);
    });
  });

  ngOnInit(): void {
    this.fetchAuthors();
  }

  fetchAuthors(): void {
    this.isLoading.set(true);
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement auteurs:', err);
        this.errorMessage.set('Impossible de charger la liste des auteurs.');
        this.isLoading.set(false);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${f}${l}` || 'A';
  }
}
