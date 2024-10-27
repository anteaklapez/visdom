import { Component } from '@angular/core';
import { OfferItemComponent } from '../offer-item/offer-item.component';
import { OfferFilterComponent } from './offer-filter/offer-filter.component';
import { MaterialModule } from '../../shared/material.module';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [MaterialModule, OfferItemComponent, OfferFilterComponent],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss',
})
export class OfferListComponent {}
