import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminLayout } from './shared/layouts/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  // 1. ROUTES D'AUTHENTIFICATION (Hors AdminLayout : Plein écran sans Sidebar)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
      }
    ]
  },

  // 2. ROUTES ADMINISTRATIVES (Sous AdminLayout : Avec Sidebar et Topbar)
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      {
        path: 'authors',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/authors/components/author-list/author-list').then(m => m.AuthorList)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN'] },
            loadComponent: () => import('./features/authors/components/author-form/author-form').then(m => m.AuthorForm)
          }
        ]
      },

      {
        path: 'publishers',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/publishers/components/publisher-list/publisher-list').then(m => m.PublisherList)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN'] },
            loadComponent: () => import('./features/publishers/components/publisher-form/publisher-form').then(m => m.PublisherForm)
          }
        ]
      },

      {
        path: 'categories',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/categories/components/category-list/category-list').then(m => m.CategoryList)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN'] },
            loadComponent: () => import('./features/categories/components/category-form/category-form.component').then(m => m.CategoryFormComponent)
          }
        ]
      },

      {
        path: 'books',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/books/components/book-list/book-list').then(m => m.BookList)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN', 'MANAGER'] },
            loadComponent: () => import('./features/books/components/book-form/book-form').then(m => m.BookForm)
          },
          {
            path: 'edit/:id',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN', 'MANAGER'] },
            loadComponent: () => import('./features/books/components/book-form/book-form').then(m => m.BookForm)
          }
        ]
      }
    ]
  },

  // 3. WILDCARD (Redirection par défaut)
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
