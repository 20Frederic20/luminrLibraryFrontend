import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorService } from '../../services/author.service';
import { AuthorResponse } from '../../models/author.model';
import { HeaderComponent } from '../../../../shared/layouts/header/header.component';
import { FooterComponent } from '../../../../shared/layouts/footer/footer.component';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './author-detail.component.html'
})
export class AuthorDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authorService = inject(AuthorService);

  author = signal<AuthorResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const authorId = this.route.snapshot.paramMap.get('id');
    if (authorId) {
      this.fetchAuthorDetail(authorId);
    } else {
      this.errorMessage.set('Identifiant d\'auteur invalide.');
      this.isLoading.set(false);
    }
  }

  fetchAuthorDetail(id: string): void {
    this.isLoading.set(true);
    this.authorService.getAuthorById(id).subscribe({
      next: (data) => {
        this.author.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement auteur:', err);
        this.errorMessage.set('Impossible de charger les informations de cet auteur.');
        this.isLoading.set(false);
      }
    });
  }

  getInitials(firstName?: string, lastName?: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${f}${l}` || 'A';
  }
}
