import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/category.model';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ColumnDef } from '../../../../shared/components/data-table/data-table.model';
import { DataTableActionDirective } from '../../../../shared/components/data-table/data-table-action.directive';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, DataTableActionDirective],
  templateUrl: './category-list.html'
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);

  // Signals pour l'état réactif
  categories = signal<CategoryResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // Configuration des colonnes
  columns: ColumnDef<CategoryResponse>[] = [
    { key: 'name', header: 'Nom de la catégorie', class: 'font-semibold text-slate-900' },
    { key: 'description', header: 'Description' }
  ];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Erreur lors de la récupération des données.');
        this.isLoading.set(false);
      }
    });
  }

  deleteCategory(category: CategoryResponse): void {
    console.log('Suppression de :', category);
  }
}
