import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OfferFilterComponent } from './offer-filter/offer-filter.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';
import { Offer } from '../../models/offer.enum';
import { ItemService } from '../../services/item.service';
import { MaterialModule } from '../../shared/modules/material.module';
import { CarItemComponent } from './offer-items/car-item/car-item.component';
import { BuildingItemComponent } from './offer-items/building-item/building-item.component';
import { ElseItemComponent } from './offer-items/else-item/else-item.component';

@Component({
  selector: 'app-offer-container',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    OfferFilterComponent,
    AsyncPipe,
    RouterLink,
    CarItemComponent,
    BuildingItemComponent,
    ElseItemComponent
  ],
  templateUrl: './offer-container.component.html',
  styleUrl: './offer-container.component.scss',
})
export class OfferContainerComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _breakpointObserver = inject(BreakpointObserver);
  private readonly _platformId = inject(PLATFORM_ID);
  readonly itemService = inject(ItemService);

  rippleColor!: string;
  isSmallScreen$!: Observable<boolean>;
  selectedCategory: Offer = Offer.CARS;

  ngOnInit() {
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

    this.isSmallScreen$ = this._breakpointObserver
      .observe('(max-width: 749px)')
      .pipe(map((result) => result.matches));

    if (isPlatformBrowser(this._platformId)) {
      this.rippleColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--ripple')
        .trim();
    }
  }

  public get Offer() {
    return Offer;
  }
}
