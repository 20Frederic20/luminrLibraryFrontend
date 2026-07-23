import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublisherService } from '../../services/publisher.service';
import { PublisherResponse } from '../../models/publisher.model';
import { DataTableComponent } from '../../../../../shared/components/data-table/data-table.component';
import { ColumnDef } from '../../../../../shared/components/data-table/data-table.model';
import { DataTableActionDirective } from '../../../../../shared/components/data-table/data-table-action.directive';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DataTableComponent, DataTableActionDirective],
  templateUrl: './publisher-list.html'
})
export class PublisherList implements OnInit {
  private publisherService = inject(PublisherService);

  publishers = signal<PublisherResponse[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  columns: ColumnDef<PublisherResponse>[] = [
    { key: 'code', header: 'Code', class: 'font-mono text-slate-700 text-xs font-semibold' },
    { key: 'name', header: 'Nom de la maison d\'édition', class: 'font-semibold text-slate-900' },
    { key: 'address', header: 'Adresse' }
  ];

  ngOnInit(): void {
    this.loadPublishers();
  }

  loadPublishers(): void {
    this.isLoading.set(true);
    this.publisherService.getPublishers().subscribe({
      next: (data) => {
        this.publishers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement éditeurs:', err);
        this.errorMessage.set('Impossible de récupérer la liste des éditeurs.');
        this.isLoading.set(false);
      }
    });
  }

  deletePublisher(publisher: PublisherResponse): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'éditeur "${publisher.name}" ?`)) {
      this.publisherService.deletePublisher(publisher.id).subscribe({
        next: () => {
          this.publishers.update(list => list.filter(p => p.id !== publisher.id));
        },
        error: (err) => {
          console.error('Erreur suppression éditeur:', err);
          alert('Erreur lors de la suppression de l\'éditeur.');
        }
      });
    }
  }
}
