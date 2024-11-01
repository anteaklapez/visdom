import { Routes } from '@angular/router';

export const offerRoutes: Routes = [
  {
    path: 'izrada/vozila',
    title: 'Visdom | Izrada Vozila',
    loadComponent: () =>
      import('../pages/offer-create/offer-create.component').then(
        (c) => c.OfferCreateComponent
      ),
  },
  {
    path: 'izrada/nekretnine',
    title: 'Visdom | Izrada Vozila',
    loadComponent: () =>
      import('../pages/offer-create/offer-create.component').then(
        (c) => c.OfferCreateComponent
      ),
  },
  {
    path: 'izrada/ostalo',
    title: 'Visdom | Izrada Vozila',
    loadComponent: () =>
      import('../pages/offer-create/offer-create.component').then(
        (c) => c.OfferCreateComponent
      ),
  },
  {
    path: 'ponuda/vozila',
    title: 'Visdom | Vozila',
    loadComponent: () =>
      import('../pages/offer-container/offer-container.component').then(
        (c) => c.OfferContainerComponent
      ),
  },
  {
    path: 'ponuda/nekretnine',
    title: 'Visdom | Nekretnine',
    loadComponent: () =>
      import('../pages/offer-container/offer-container.component').then(
        (c) => c.OfferContainerComponent
      ),
  },
  {
    path: 'ponuda/ostalo',
    title: 'Visdom | Ostalo',
    loadComponent: () =>
      import('../pages/offer-container/offer-container.component').then(
        (c) => c.OfferContainerComponent
      ),
  },
  {
    path: 'ponuda/vozila/:id',
    title: 'Visdom | Vozila',
    loadComponent: () =>
      import('../pages/offer-details/offer-details.component').then(
        (c) => c.OfferDetailsComponent
      ),
  },
  {
    path: 'ponuda/nekretnine/:id',
    title: 'Visdom | Nekretnine',
    loadComponent: () =>
      import('../pages/offer-details/offer-details.component').then(
        (c) => c.OfferDetailsComponent
      ),
  },
  {
    path: 'ponuda/ostalo/:id',
    title: 'Visdom | Ostalo',
    loadComponent: () =>
      import('../pages/offer-details/offer-details.component').then(
        (c) => c.OfferDetailsComponent
      ),
  },
];
