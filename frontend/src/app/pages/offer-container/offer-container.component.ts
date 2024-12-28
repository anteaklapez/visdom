import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
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
import { AuthService } from '../../services/auth.service';
import { Car } from '../../models/car.interface';
import { Building } from '../../models/building.interface';
import { BasicObject } from '../../models/basic-object.interface';

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
    ElseItemComponent,
  ],
  templateUrl: './offer-container.component.html',
  styleUrl: './offer-container.component.scss',
})
export class OfferContainerComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _breakpointObserver = inject(BreakpointObserver);
  readonly itemService = inject(ItemService);
  private readonly _authService = inject(AuthService);

  isSmallScreen$!: Observable<boolean>;
  selectedCategory: Offer = Offer.CARS;
  isLoggedIn: boolean = false;

  cars$ = {} as Observable<Car[]>;
  buildings$ = {} as Observable<Building[]>;
  basicObjects$ = {} as Observable<BasicObject[]>;
  filteredItems$ = this.itemService.filteredItems$;

  ngOnInit() {
    this._route.url.subscribe((urlSegments) => {
      const path = urlSegments[1]?.path;
      switch (path) {
        case Offer.CARS:
          this.selectedCategory = Offer.CARS;
          this.cars$ = this.itemService.filteredItems$ as Observable<Car[]>;
          break;
        case Offer.BUILDINGS:
          this.selectedCategory = Offer.BUILDINGS;
          this.buildings$ = this.itemService.filteredItems$ as Observable<Building[]>;
          break;
        case Offer.ELSE:
          this.selectedCategory = Offer.ELSE;
          this.basicObjects$ = this.itemService.filteredItems$ as Observable<BasicObject[]>;
          break;
        default:
          this.selectedCategory = Offer.CARS;
          this.cars$ = this.itemService.filteredItems$ as Observable<Car[]>;
          break;
      }
    });

    this.itemService.filterItems({}, this.selectedCategory);

    this._authService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.isSmallScreen$ = this._breakpointObserver
      .observe('(max-width: 749px)')
      .pipe(map((result) => result.matches));
  }

  public get Offer() {
    return Offer;
  }
}
