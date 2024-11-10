import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import {
  BodyShape,
  Car,
  DriveType,
  Engine,
  Transmission,
} from '../../models/car.interface';

export interface DetailsItem {
  title: string;
  icon?: string;
  value: string | undefined;
}

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

  bodyShapeIcon!: string;
  driveTypeIcon!: string;
  transmissionIcon!: string;
  fuelIcon!: string;
  selectedCategory: Offer = Offer.CARS;
  carDetailsItems: DetailsItem[] | undefined = [];
  carOtherDetailsItems: DetailsItem[] | undefined = [];

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
            this.carDetailsItems = this._mapCarDetailsItems(car);
            this.carOtherDetailsItems = this._mapOtherDetailsItems(car);
            this._getCarFuelTypeIcon(car);
            this._getCarTransmissionTypeIcon(car);
            this._getCarBodyShapeIcon(car);
            this._getCarDriveTypeIcon(car);
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

  private _getCarTransmissionTypeIcon(car: Car | undefined) {
    if (!car) return;
    switch (car.transmission) {
      case Transmission.MANUAL:
        this.transmissionIcon = 'manual';
        break;
      case Transmission.AUTOMATIC:
        this.transmissionIcon = 'automatic';
        break;
      default:
        this.transmissionIcon = 'manual';
        break;
    }
  }

  private _getCarDriveTypeIcon(car: Car | undefined) {
    if (!car) return;
    switch (car.driveType) {
      case DriveType.FRONT_WHEEL_DRIVE:
        this.driveTypeIcon = 'front-drive';
        break;
      case DriveType.REAR_WHEEL_DRIVE:
        this.driveTypeIcon = 'back-drive';
        break;
      case DriveType.FOUR_WHEEL_DRIVE:
        this.driveTypeIcon = 'all-drive';
        break;
      default:
        this.driveTypeIcon = 'front-drive';
        break;
    }
  }

  private _getCarBodyShapeIcon(car: Car | undefined) {
    if (!car) return;
    switch (car.bodyShape) {
      case BodyShape.CABRIO:
        this.bodyShapeIcon = 'convertible';
        break;
      case BodyShape.CARAVAN:
        this.bodyShapeIcon = 'caravan';
        break;
      case BodyShape.COMBI:
        this.bodyShapeIcon = 'combi';
        break;
      case BodyShape.COUPE:
        this.bodyShapeIcon = 'coupe';
        break;
      case BodyShape.HATCHBACK:
        this.bodyShapeIcon = 'hatchback';
        break;
      case BodyShape.MONO:
        this.bodyShapeIcon = 'monovolumen';
        break;
      case BodyShape.SEDAN:
        this.bodyShapeIcon = 'sedan';
        break;
      case BodyShape.SUV:
        this.bodyShapeIcon = 'suv';
        break;
      default:
        this.bodyShapeIcon = 'sedan';
        break;
    }
  }

  private _mapCarDetailsItems(car: Car | undefined): DetailsItem[] | undefined {
    if (!car) return;
    return [
      { title: 'KILOMETRAŽA', icon: 'road', value: `${car.mileage} km` },
      { title: 'SNAGA MOTORA', icon: 'engine', value: `${car.power} kW` },
      { title: 'GODINA PROIZVODNJE', icon: 'calendar', value: car.productionYear },
      { title: 'MOTOR', icon: this.fuelIcon, value: car.engine },
      { title: 'MJENJAČ', icon: this.transmissionIcon, value: car.transmission },
      { title: 'VRSTA POGONA', icon: this.driveTypeIcon, value: car.driveType },
      { title: 'OBLIK VOZILA', icon: this.bodyShapeIcon, value: car.bodyShape },
      { title: 'BROJ VRATA', icon: 'car-door', value: String(car.doorNumber) },
      { title: 'BROJ SJEDALA', icon: 'car-seat', value: String(car.seatNumber) },
      { title: 'REGISTRIRAN DO', icon: 'calendar', value: car.registration },
      { title: 'CO2 EMISIJE', icon: 'emission', value: `${car.emission} g/km` },
      { title: 'LOKACIJA VOZILA', icon: 'location-pin', value: car.location },
    ];
  }

  private _mapOtherDetailsItems(car: Car | undefined): DetailsItem[] | undefined {
    if (!car) return;
    return [
      { title: 'Veličina motora', value: `${car.engineSize} L`  },
      { title: 'Godina modela', value: car.modelYear  },
      { title: 'Boja vozila', value: car.bodyColor  },
      { title: 'Boja unutrašnjost', value: car.interiorColor  },
      { title: 'Materijal unutrašnjost', value: car.interiorMaterial  },
      { title: 'Kategorija emisija', value: car.emissionsClass  }
    ];
  }
}
