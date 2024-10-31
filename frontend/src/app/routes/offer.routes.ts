import { Routes } from '@angular/router';

export const offerRoutes: Routes = [
  {
    path: 'ponuda',
    loadComponent: () =>
      import('../pages/offer-container/offer-container.component').then(
        (c) => c.OfferContainerComponent
      ),
    title: 'Offer List',
    children: [
      {
        path: 'vozila',
        loadComponent: () =>
          import('../pages/offer-container/offer-list-item/offer-list-item.component').then(
            (c) => c.OfferItemComponent
          ),
      },
      {
        path: 'nekretnine',
        loadComponent: () =>
          import('../pages/offer-container/offer-list-item/offer-list-item.component').then(
            (c) => c.OfferItemComponent
          ),
      },
      {
        path: 'ostalo',
        loadComponent: () =>
          import('../pages/offer-container/offer-list-item/offer-list-item.component').then(
            (c) => c.OfferItemComponent
          ),
      },
      {
        path: 'vozila/:id',
        loadComponent: () =>
          import('../pages/offer-details/offer-details.component').then(
            (c) => c.OfferDetailsComponent
          ),
      },
      {
        path: 'nekretnine/:id',
        loadComponent: () =>
          import('../pages/offer-details/offer-details.component').then(
            (c) => c.OfferDetailsComponent
          ),
      },
      {
        path: 'ostalo/:id',
        loadComponent: () =>
          import('../pages/offer-details/offer-details.component').then(
            (c) => c.OfferDetailsComponent
          ),
      },
    ],
  },
];
