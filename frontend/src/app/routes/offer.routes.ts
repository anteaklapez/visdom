import { Routes } from '@angular/router';

export const offerRoutes: Routes = [
  {
    path: 'izrada/vozila',
    title: 'Vis Dom | Izrada Vozila',
    loadComponent: () =>
      import('../pages/offer-create/offer-create.component').then(
        (c) => c.OfferCreateComponent
      ),
  },
  {
    path: 'izrada/nekretnine',
    title: 'Vis Dom | Izrada Vozila',
    loadComponent: () =>
      import('../pages/offer-create/offer-create.component').then(
        (c) => c.OfferCreateComponent
      ),
  },
  {
    path: 'izrada/ostalo',
    title: 'Vis Dom | Izrada Vozila',
    loadComponent: () =>
      import('../pages/offer-create/offer-create.component').then(
        (c) => c.OfferCreateComponent
      ),
  },
  {
    path: 'ponuda/vozila',
    title: 'Vis Dom | Vozila',
    loadComponent: () =>
      import('../pages/offer-container/offer-container.component').then(
        (c) => c.OfferContainerComponent
      ),
  },
  {
    path: 'ponuda/nekretnine',
    title: 'Vis Dom | Nekretnine',
    loadComponent: () =>
      import('../pages/offer-container/offer-container.component').then(
        (c) => c.OfferContainerComponent
      ),
  },
  {
    path: 'ponuda/ostalo',
    title: 'Vis Dom | Ostalo',
    loadComponent: () =>
      import('../pages/offer-container/offer-container.component').then(
        (c) => c.OfferContainerComponent
      ),
  },
  {
    path: 'ponuda/vozila/:id',
    title: 'Vis Dom | Vozila',
    loadComponent: () =>
      import('../pages/offer-details/offer-details.component').then(
        (c) => c.OfferDetailsComponent
      ),
  },
  {
    path: 'ponuda/nekretnine/:id',
    title: 'Vis Dom | Nekretnine',
    loadComponent: () =>
      import('../pages/offer-details/offer-details.component').then(
        (c) => c.OfferDetailsComponent
      ),
  },
  {
    path: 'ponuda/ostalo/:id',
    title: 'Vis Dom | Ostalo',
    loadComponent: () =>
      import('../pages/offer-details/offer-details.component').then(
        (c) => c.OfferDetailsComponent
      ),
  },
];
