import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/category.model';
import { HeaderComponent } from '../../../../shared/layouts/header/header.component';
import { FooterComponent } from '../../../../shared/layouts/footer/footer.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<CategoryResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  searchQuery = signal<string>('');

  // Filtrage réactif par nom ou description
  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();

    return this.categories().filter(category => {
      if (!query) return true;

      const nameMatch = category.name?.toLowerCase().includes(query);
      const descMatch = category.description?.toLowerCase().includes(query);

      return nameMatch || descMatch;
    });
  });

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.errorMessage.set('Impossible de charger les catégories.');
        this.isLoading.set(false);
      }
    });
  }
}
