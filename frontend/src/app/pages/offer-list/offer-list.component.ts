import { Component } from '@angular/core';
import { OfferItemComponent } from '../offer-item/offer-item.component';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [OfferItemComponent],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss'
})
export class OfferListComponent {

}
