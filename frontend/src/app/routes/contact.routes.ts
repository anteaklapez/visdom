import { Routes } from '@angular/router';

export const contactRoutes: Routes = [
  {
    path: 'kontakt',
    loadComponent: () =>
      import('../pages/contact/contact.component').then(
        (c) => c.ContactComponent
      ),
    title: 'Vis Dom | Kontakt',
  },
];
