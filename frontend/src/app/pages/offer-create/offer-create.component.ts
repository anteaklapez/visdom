import { Component, inject, OnInit } from '@angular/core';
import { Offer } from '../../models/offer.enum';
import { ActivatedRoute } from '@angular/router';
import { CarFormComponent } from './offer-create-forms/car-form/car-form.component';
import { BuildingFormComponent } from './offer-create-forms/building-form/building-form.component';
import { ElseFormComponent } from './offer-create-forms/else-form/else-form.component';

@Component({
  selector: 'app-offer-create',
  standalone: true,
  imports: [CarFormComponent, BuildingFormComponent, ElseFormComponent],
  templateUrl: './offer-create.component.html',
  styleUrl: './offer-create.component.scss',
})
export class OfferCreateComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  selectedCategory: Offer = Offer.CARS;

  ngOnInit(): void {
    this._route.url.subscribe((urlSegments) => {
      const path = urlSegments[1]?.path;
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

  public get Offer() {
    return Offer;
  }
}
