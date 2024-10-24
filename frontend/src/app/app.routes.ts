import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OfferCreateComponent } from './pages/offer-create/offer-create.component';
import { OfferItemComponent } from './pages/offer-item/offer-item.component';
import { OfferListComponent } from './pages/offer-list/offer-list.component';

export const routes: Routes = [
  { path: '', component: OfferListComponent },
  { path: 'ponuda/:offerId', component: OfferItemComponent },
  { path: 'prijava', component: LoginComponent },
  { path: 'izrada/:offerObject', component: OfferCreateComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
