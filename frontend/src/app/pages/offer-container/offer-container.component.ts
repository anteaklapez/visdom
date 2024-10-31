import { Component } from '@angular/core';
import { OfferItemComponent } from './offer-list-item/offer-list-item.component';
import { OfferFilterComponent } from './offer-filter/offer-filter.component';
import { MaterialModule } from '../../shared/material.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-offer-container',
  standalone: true,
  imports: [MaterialModule, OfferItemComponent, OfferFilterComponent, RouterOutlet],
  templateUrl: './offer-container.component.html',
  styleUrl: './offer-container.component.scss',
})
export class OfferContainerComponent {}
