import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  // Données simulées pour les KPIs (à connecter plus tard à tes services)
  stats = signal({
    totalBooks: 1420,
    borrowedBooks: 84,
    activeMembers: 312,
    overdueReturns: 5
  });

  // Liste des alertes de stock faible (E)
  lowStockBooks = signal([
    { id: '1', title: 'Clean Code: A Handbook of Agile Software', isbn: '978-0132350884', available: 0, total: 5 },
    { id: '2', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', isbn: '978-0201633610', available: 1, total: 3 },
    { id: '3', title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software', isbn: '978-0321125217', available: 1, total: 4 }
  ]);

  ngOnInit(): void {
    // Ici, tu pourras appeler tes services pour récupérer les vraies données du backend
  }
}
