import { MenuItem } from '../models/menu.model';

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Livres',
    icon: 'book-open',
    baseRoute: '/books',
    actions: [
      { label: 'Lister les livres', route: '/books', icon: 'list' },
      { label: 'Nouveau livre', route: '/books/new', icon: 'plus-circle' }
    ]
  },
  {
    title: 'Catégories',
    icon: 'tag',
    baseRoute: '/categories',
    actions: [
      { label: 'Lister les catégories', route: '/categories', icon: 'list' },
      { label: 'Nouvelle catégorie', route: '/categories/new', icon: 'plus-circle' }
    ]
  },
  {
    title: 'Auteurs',
    icon: 'user-group',
    baseRoute: '/authors',
    actions: [
      { label: 'Lister les auteurs', route: '/authors', icon: 'list' },
      { label: 'Nouvel auteur', route: '/authors/new', icon: 'plus-circle' }
    ]
  },
  {
    title: 'Éditeurs',
    icon: 'building-office',
    baseRoute: '/publishers',
    actions: [
      { label: 'Lister les éditeurs', route: '/publishers', icon: 'list' },
      { label: 'Nouvel éditeur', route: '/publishers/new', icon: 'plus-circle' }
    ]
  }
];
