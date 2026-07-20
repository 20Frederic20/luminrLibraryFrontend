import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService } from '../../services/author.service';
import { AuthorResponse } from '../../models/author.model';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './author-list.html',
  styleUrl: './author-list.css'
})
export class AuthorList implements OnInit {
  // On injecte notre service d'auteurs
  private authorService = inject(AuthorService);

  // Notre tableau local pour stocker les auteurs reçus de Spring Boot
  authors: AuthorResponse[] = [];

  // Variables optionnelles pour gérer l'expérience utilisateur
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadAuthors();
  }

  // Fonction pour appeler le backend Spring Boot
  loadAuthors(): void {
    this.authorService.getAuthors().subscribe({
      next: (data) => {
        this.authors = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des auteurs', err);
        this.errorMessage = 'Impossible de charger la liste des auteurs. Vérifiez que le backend Java est démarré.';
        this.isLoading = false;
      }
    });
  }
}
