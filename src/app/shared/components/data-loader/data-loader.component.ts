import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- État Chargement -->
    @if (isLoading) {
      <div class="flex flex-col items-center justify-center p-12 space-y-3">
        <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="text-sm font-medium text-slate-500">{{ loadingText }}</p>
      </div>
    }

    <!-- État Erreur -->
    @if (!isLoading && errorMessage) {
      <div class="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
        {{ errorMessage }}
      </div>
    }

    <!-- État Vide -->
    @if (!isLoading && !errorMessage && isEmpty) {
      <div class="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
        <p class="text-slate-500 font-medium">{{ emptyMessage }}</p>
        <ng-content select="[empty-action]"></ng-content>
      </div>
    }
  `
})
export class DataLoaderComponent {
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() isEmpty = false;
  @Input() loadingText = 'Chargement des données...';
  @Input() emptyMessage = 'Aucune donnée disponible.';
}
