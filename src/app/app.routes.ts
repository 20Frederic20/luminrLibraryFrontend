import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

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

  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard//dashboard').then(m => m.Dashboard)
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
        loadComponent: () => import('./features/categories/components/category-form/category-form').then(m => m.CategoryForm)
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
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
