import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminLayout } from './shared/layouts/admin-layout/admin-layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'books',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/books/components/book-list/book-list.component').then(m => m.BookListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/books/components/book-detail/book-detail.component').then(m => m.BookDetailComponent)
      }
    ]
  },

  {
    path: 'authors',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/authors/components/author-list/author-list.component').then(m => m.AuthorListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/authors/components/author-detail/author-detail.component').then(m => m.AuthorDetailComponent)
      }
    ]
  },

  // 1. ROUTES D'AUTHENTIFICATION (Hors AdminLayout : Plein écran sans Sidebar)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
      }
    ]
  },

  // 2. ROUTES ADMINISTRATIVES (Sous AdminLayout : Avec Sidebar et Topbar)
  {
    path: 'admin',
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
            loadComponent: () => import('./features/admin/authors/components/author-list/author-list.component').then(m => m.AuthorListComponent)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN'] },
            loadComponent: () => import('./features/admin/authors/components/author-form/author-form.component').then(m => m.AuthorFormComponent)
          }
        ]
      },

      {
        path: 'publishers',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin/publishers/components/publisher-list/publisher-list').then(m => m.PublisherList)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN'] },
            loadComponent: () => import('./features/admin/publishers/components/publisher-form/publisher-form').then(m => m.PublisherForm)
          }
        ]
      },

      {
        path: 'categories',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin/categories/components/category-list/category-list').then(m => m.CategoryList)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN'] },
            loadComponent: () => import('./features/admin/categories/components/category-form/category-form.component').then(m => m.CategoryFormComponent)
          }
        ]
      },

      {
        path: 'books',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/admin/books/components/book-list/book-list').then(m => m.BookList)
          },
          {
            path: 'new',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN', 'MANAGER'] },
            loadComponent: () => import('./features/admin/books/components/book-form/book-form').then(m => m.BookForm)
          },
          {
            path: 'edit/:id',
            canActivate: [authGuard, roleGuard],
            data: { expectedRoles: ['ADMIN', 'MANAGER'] },
            loadComponent: () => import('./features/admin/books/components/book-form/book-form').then(m => m.BookForm)
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
