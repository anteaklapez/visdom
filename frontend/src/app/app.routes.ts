import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      loadComponent: () =>
        import('./pages/offer-list/offer-list.component').then(
          (c) => c.OfferListComponent
        ),
      title: 'Offer List',
    },
    {
      path: 'ponuda/:offerId',
      loadComponent: () =>
        import('./pages/offer-item/offer-item.component').then(
          (c) => c.OfferItemComponent
        ),
      title: 'Offer Item',
    },
    {
      path: 'prijava',
      loadComponent: () =>
        import('./auth/login/login.component').then(
          (c) => c.LoginComponent
        ),
      title: 'Login',
    },
    {
      path: 'kontakt',
      loadComponent: () =>
        import('./pages/contact/contact.component').then(
          (c) => c.ContactComponent
        ),
      title: 'Login',
    },
    {
      path: 'izrada/:offerObject',
      loadComponent: () =>
        import('./pages/offer-create/offer-create.component').then(
          (c) => c.OfferCreateComponent
        ),
      title: 'Offer Create',
    },
    {
      path: '**',
      redirectTo: '',
      pathMatch: 'full',
    },
  ];
