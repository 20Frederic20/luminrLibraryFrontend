import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/category.model';
import { HeaderComponent } from '../../../../shared/layouts/header/header.component';
import { FooterComponent } from '../../../../shared/layouts/footer/footer.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './category-detail.component.html'
})
export class CategoryDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);

  category = signal<CategoryResponse | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    if (categoryId) {
      this.fetchCategoryDetail(categoryId);
    } else {
      this.errorMessage.set('Identifiant de catégorie invalide.');
      this.isLoading.set(false);
    }
  }

  fetchCategoryDetail(id: string): void {
    this.isLoading.set(true);
    this.categoryService.getCategoryById(id).subscribe({
      next: (data) => {
        this.category.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement catégorie:', err);
        this.errorMessage.set('Impossible de charger les informations de cette catégorie.');
        this.isLoading.set(false);
      }
    });
  }
}
