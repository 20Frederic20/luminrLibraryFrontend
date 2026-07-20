import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Si l'utilisateur ne tape rien, on le redirige directement vers le login
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  // 2. Groupe "auth" : Toutes les routes d'authentification sont regroupées ici
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

  // 3. Espace connecté : Le tableau de bord principal
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard//dashboard').then(m => m.Dashboard)
  },

  // 4. Page inconnue (Erreur 404) : Redirection de sécurité vers le login
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
