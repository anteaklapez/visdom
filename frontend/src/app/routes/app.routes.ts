import { Routes } from '@angular/router';
import { authRoutes } from './auth.routes';
import { contactRoutes } from './contact.routes';
import { offerRoutes } from './offer.routes';

export const appRoutes: Routes = [
  ...offerRoutes,
  ...contactRoutes,
  ...authRoutes,
  {
    path: '**',
    redirectTo: 'ponuda/vozila',
    pathMatch: 'full',
  },
];
