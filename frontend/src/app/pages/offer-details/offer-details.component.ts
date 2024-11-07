import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { Offer } from '../../models/offer.enum';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';
import { IconsModule } from '../../shared/modules/icons.module';
import { Car, Engine } from '../../models/car.interface';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [MaterialModule, AsyncPipe, CommonModule, IconsModule],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferDetailsComponent implements OnInit, AfterViewInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _itemService = inject(ItemService);
  private readonly _platformId = inject(PLATFORM_ID);

  @ViewChild('myCarousel', { static: false }) myCarousel!: ElementRef;

  objectData$: Observable<any> = new Observable();

  fuelIcon!: string;
  selectedCategory: Offer = Offer.CARS;

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    this._rerouteIfIdInvalid(id!);
    this._getCurrentCategory();
    this._setObjectData(id!);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      Fancybox.bind('[data-fancybox="gallery"]');
      new Carousel(
        this.myCarousel.nativeElement,
        {
          Dots: false,
        },
        { Thumbs }
      );
    }
  }

  public get Offer() {
    return Offer;
  }

  private _rerouteIfIdInvalid(id: string) {
    const routePrefix = this._route.snapshot.url
      .slice(0, -1)
      .map((segment) => segment.path)
      .join('/');

    if (id && !this._itemService.doesItemExist(id)) {
      this._router.navigate([`/${routePrefix}`]);
      return;
    }
  }

  private _getCurrentCategory() {
    const routePath = this._route.snapshot.routeConfig?.path || '';
    const categoryMatch = routePath.match(
      /^ponuda\/(vozila|nekretnine|ostalo)/
    );

    if (categoryMatch) {
      const category = categoryMatch[1];
      if (category === 'vozila') {
        this.selectedCategory = Offer.CARS;
      } else if (category === 'nekretnine') {
        this.selectedCategory = Offer.BUILDINGS;
      } else if (category === 'ostalo') {
        this.selectedCategory = Offer.ELSE;
      }
    }
  }

  private _setObjectData(id: string) {
    switch (this.selectedCategory) {
      case Offer.CARS:
        this.objectData$ = this._itemService.cars$.pipe(
          map((cars) => {
            const car = cars.find((car) => car.id === id);
            this._getCarFuelTypeIcon(car);
            return car;
          })
        );
        break;
      case Offer.BUILDINGS:
        this.objectData$ = this._itemService.buildings$.pipe(
          map((buildings) => buildings.find((building) => building.id === id))
        );
        break;
      case Offer.ELSE:
        this.objectData$ = this._itemService.basicObjects$.pipe(
          map((objects) => objects.find((object) => object.id === id))
        );
        break;
    }

    this.objectData$.subscribe((res) => console.log(res));
  }

  private _getCarFuelTypeIcon(car: Car | undefined) {
    if (!car) return;
    switch (car.engine) {
      case Engine.DIESEL:
        this.fuelIcon = 'fuel';
        break;
      case Engine.ELECTRIC:
        this.fuelIcon = 'electricity';
        break;
      case Engine.HYBRID:
        this.fuelIcon = 'hybrid';
        break;
      case Engine.GASOLINE:
        this.fuelIcon = 'fuel';
        break;
      default:
        this.fuelIcon = 'fuel';
        break;
    }
  }
}
