import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublisherService } from '../../services/publisher.service';
import { PublisherResponse } from '../../models/publisher.model';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './publisher-list.html',
  styleUrl: './publisher-list.css'
})
export class PublisherList implements OnInit {
  private publisherService = inject(PublisherService);

  publishers: PublisherResponse[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPublishers();
  }

  loadPublishers(): void {
    this.publisherService.getPublishers().subscribe({
      next: (data) => {
        this.publishers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement des éditeurs', err);
        this.errorMessage = 'Impossible de charger la liste des éditeurs.';
        this.isLoading = false;
      }
    });
  }
}
