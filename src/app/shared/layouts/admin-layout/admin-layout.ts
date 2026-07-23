import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {
  // Signal pour gérer l'ouverture de la sidebar sur écran mobile
  isMobileSidebarOpen = signal<boolean>(false);
  authService = inject(AuthService);

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.set(!this.isMobileSidebarOpen());
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserName(): string | null {
    return this.authService.getUserEmail();
  }

  logout(): void {
    this.authService.logout();
  }
}
