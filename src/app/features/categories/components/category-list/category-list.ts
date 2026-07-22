import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryResponse } from '../../models/category.model';
import { DataLoaderComponent } from '../../../../shared/components/data-loader/data-loader.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DataLoaderComponent],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {
  private categoryService = inject(CategoryService);

  categories: CategoryResponse[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de contacter le serveur.';
        this.isLoading = false;
      }
    });
  }
}
