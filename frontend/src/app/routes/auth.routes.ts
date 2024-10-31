import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'prijava',
    loadComponent: () =>
      import('../auth/login/login.component').then(
        (c) => c.LoginComponent
      ),
    title: 'Login',
  },
];
