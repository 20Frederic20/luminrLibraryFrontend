import { MenuItem } from '../models/menu.model';

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'Livres',
    icon: 'book-open',
    baseRoute: '/admin/books',
    actions: [
      { label: 'Lister les livres', route: '/admin/books', icon: 'list' },
      { label: 'Nouveau livre', route: '/admin/books/new', icon: 'plus-circle' }
    ]
  },
  {
    title: 'Catégories',
    icon: 'tag',
    baseRoute: '/admin/categories',
    actions: [
      { label: 'Lister les catégories', route: '/admin/categories', icon: 'list' },
      { label: 'Nouvelle catégorie', route: '/admin/categories/new', icon: 'plus-circle' }
    ]
  },
  {
    title: 'Auteurs',
    icon: 'user-group',
    baseRoute: '/admin/authors',
    actions: [
      { label: 'Lister les auteurs', route: '/admin/authors', icon: 'list' },
      { label: 'Nouvel auteur', route: '/admin/authors/new', icon: 'plus-circle' }
    ]
  },
  {
    title: 'Éditeurs',
    icon: 'building-office',
    baseRoute: '/admin/publishers',
    actions: [
      { label: 'Lister les éditeurs', route: '/admin/publishers', icon: 'list' },
      { label: 'Nouvel éditeur', route: '/admin/publishers/new', icon: 'plus-circle' }
    ]
  },
  {
    title: 'Utilisateurs',
    icon: 'users',
    baseRoute: '/admin/users',
    actions: [
      { label: 'Lister les utilisateurs', route: '/admin/users', icon: 'list' },
      { label: 'Nouvel utilisateur', route: '/admin/users/new', icon: 'plus-circle' }
    ]
  }
];
