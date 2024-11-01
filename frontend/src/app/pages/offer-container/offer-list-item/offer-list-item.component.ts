import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute } from '@angular/router';
import { Offer } from '../../../models/offer.enum';
import { OfferFilterComponent } from '../offer-filter/offer-filter.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-offer-list-item',
  standalone: true,
  imports: [CommonModule, MaterialModule, OfferFilterComponent, AsyncPipe],
  templateUrl: './offer-list-item.component.html',
  styleUrl: './offer-list-item.component.scss',
})
export class OfferItemComponent {
  readonly itemService = inject(ItemService);
  readonly route = inject(ActivatedRoute);
  private readonly _breakpointObserver = inject(BreakpointObserver);

  isSmallScreen$!: Observable<boolean>;
  selectedCategory: Offer = Offer.CARS;

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

    this.isSmallScreen$ = this._breakpointObserver
      .observe('(max-width: 749px)')
      .pipe(map((result) => result.matches));
  }

  public get Offer() {
    return Offer;
  }
}
