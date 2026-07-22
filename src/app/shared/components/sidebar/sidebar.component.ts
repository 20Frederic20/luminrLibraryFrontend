import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MENU_ITEMS } from '../../../core/config/menu.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  menuItems = MENU_ITEMS;
  // Signal pour suivre quel menu est ouvert
  openMenuIndex = signal<number | null>(0); // 0 ouvre le premier par défaut

  toggleMenu(index: number) {
    this.openMenuIndex.set(this.openMenuIndex() === index ? null : index);
  }
}
