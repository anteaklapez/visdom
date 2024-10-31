import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute } from '@angular/router';
import { Offer } from '../../../models/offer.enum';

@Component({
  selector: 'app-offer-list-item',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './offer-list-item.component.html',
  styleUrl: './offer-list-item.component.scss',
})
export class OfferItemComponent {
  readonly itemService = inject(ItemService);
  readonly route = inject(ActivatedRoute);
  selectedCategory: Offer = Offer.CARS;

  public get Offer() {
    return Offer; 
  }

  ngOnInit() {
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      switch (path) {
        case Offer.CARS:
          this.selectedCategory = Offer.CARS;
          break;
        case Offer.BUILDINGS:
          this.selectedCategory = Offer.BUILDINGS;
          break;
        case Offer.ELSE:
          this.selectedCategory = Offer.ELSE;
          break;
        default:
          this.selectedCategory = Offer.CARS;
          break;
      }
    });
  }
}
