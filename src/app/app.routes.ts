import { Routes } from '@angular/router';

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
        loadComponent: () => import('./features/publishers/components/publisher-form/publisher-form').then(m => m.PublisherForm)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
