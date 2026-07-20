import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);

  // Tableau local stockant les CategoryResponse (avec UUID)
  categories: CategoryResponse[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des catégories', err);
        this.errorMessage = 'Impossible de charger les catégories. Vérifiez la connexion avec le serveur.';
        this.isLoading = false;
      }
    });
  }
}
