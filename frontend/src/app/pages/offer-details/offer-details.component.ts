import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { forkJoin, map, Observable, Subscription, take } from 'rxjs';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { Offer } from '../../models/offer.enum';
import { Carousel, Fancybox } from '@fancyapps/ui';
import { Thumbs } from '@fancyapps/ui/dist/carousel/carousel.thumbs.esm.js';
import { IconsModule } from '../../shared/modules/icons.module';
import { BasicObject, Image } from '../../models/basic-object.interface';
import {
  BodyShape,
  Car,
  DriveType,
  Engine,
  Transmission,
} from '../../models/car.interface';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ImgbbService } from '../../services/imgbb.service';
import { UserOffer } from '../../models/user-offer.interface';
import { Building } from '../../models/building.interface';
import { AuthService } from '../../services/auth.service';

export interface DetailsItem {
  title: string;
  icon?: string;
  value: string | undefined;
}

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [
    MaterialModule,
    AsyncPipe,
    CommonModule,
    IconsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './offer-details.component.html',
  styleUrls: [
    './offer-details.component.scss',
    '../offer-create/offer-create-forms/car-form/car-form.component.scss',
  ],
})
export class OfferDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly _router = inject(Router);
  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _itemService = inject(ItemService);
  private readonly _imgbbService = inject(ImgbbService);
  private readonly _authService = inject(AuthService);
  private readonly _platformId = inject(PLATFORM_ID);

  @ViewChild('myCarousel', { static: false }) myCarousel!: ElementRef;
  @ViewChild('createOfferSection') createOfferSection!: ElementRef;

  objectData$: Observable<any> = new Observable();
  userOffersData$: Observable<UserOffer[]> = new Observable();
  userOfferSubscription: Subscription = new Subscription();

  bodyShapeIcon!: string;
  driveTypeIcon!: string;
  transmissionIcon!: string;
  fuelIcon!: string;
  selectedCategory: Offer = Offer.CARS;
  carDetailsItems: DetailsItem[] | undefined = [];
  carOtherDetailsItems: DetailsItem[] | undefined = [];
  buildingDetailsItems: DetailsItem[] | undefined = [];
  buildingOtherDetailsItems: DetailsItem[] | undefined = [];
  createOfferForm!: FormGroup;
  isSubmitting: boolean = false;
  isDragging: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;
  images: string[] = [];
  selectedFiles: File[] = [];

  id: string | null = null;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this._authService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.id = this._route.snapshot.paramMap.get('id');
    this._rerouteIfIdInvalid(this.id!);
    this._getCurrentCategory();
    this._setObjectData(this.id!);
    this.userOffersData$ = this._itemService.getUserOffersById(this.id!);

    this.createOfferForm = this._fb.group({
      id: [this.id],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?\\d{0,13}')]],
      location: [''],
      description: [''],
      image: [[]],
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.userOfferSubscription = this.userOffersData$.subscribe(
        (userOffers: UserOffer[]) => {
          userOffers.forEach((offer) => {
            if (offer.email) {
              Fancybox.bind(`[data-fancybox="${offer.email}"]`);
            }
          });
        }
      );

      Fancybox.bind('[data-fancybox="gallery"]');
      if (this.myCarousel) {
        new Carousel(
          this.myCarousel.nativeElement,
          {
            Dots: false,
          },
          { Thumbs }
        );
      }
    }
  }

  scrollToCreateOffer() {
    if (isPlatformBrowser(this._platformId)) {
      this.createOfferSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  onClearImages() {
    this.images = [];
    this.selectedFiles = [];
  }

  onDeleteImage(image: string) {
    this.images = this.images.filter((i) => i !== image);
    this.selectedFiles = this.selectedFiles.filter((f) => f.name !== image);
  }

  onImageDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }

  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded() {
    this.isDragging = false;
  }

  onFileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const selectedFiles = Array.from(input.files);

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageDataUrl = reader.result as string;

          if (!this.images.includes(imageDataUrl)) {
            this.images.push(imageDataUrl);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean | null {
    const control = this.createOfferForm.get(fieldName);
    return control && control.invalid && (control.dirty || control.touched);
  }

  getFieldErrors(fieldName: string): any {
    const control = this.createOfferForm.get(fieldName);
    return control ? control.errors : null;
  }

  deleteUserOffer(offer: UserOffer) {
    const confirmation = window.confirm(
      'Jeste li sigurni da želite obrisati ovu ponudu?'
    );

    if (confirmation) {
      this.userOffersData$ = this._itemService.deleteUserOfferByEmail(offer);
    }
  }

  editOffer() {
    this.objectData$.pipe(take(1)).subscribe((data) => {
      this.navigateToEditPage(data);
    });
  }

  deleteOffer() {
    const confirmation = window.confirm(
      'Jeste li sigurni da želite obrisati ovaj oglas?'
    );
    if (!confirmation) return;
  
    switch (this.selectedCategory) {
      case Offer.CARS:
        this._itemService.deleteCar(this.id!).subscribe(() => {
          this._router.navigate(['/ponuda/vozila']);
        });
        break;
  
      case Offer.BUILDINGS:
        this._itemService.deleteBuilding(this.id!).subscribe(() => {
          this._router.navigate(['/ponuda/nekretnine']);
        });
        break;
  
      case Offer.ELSE:
        this._itemService.deleteBasicObject(this.id!).subscribe(() => {
          this._router.navigate(['/ponuda/ostalo']);
        });
        break;
    }
  }  

  navigateToEditPage(objectData: Car | Building | BasicObject): void {
    this._itemService.setItemToEdit(objectData);

    const url = 'engine' in objectData
      ? '/izrada/vozila'
      : 'buildingArea' in objectData
      ? '/izrada/nekretnine'
      : '/izrada/ostalo';
  
    this._router.navigate([url]);
  }

  onSubmit() {
    if (!this.createOfferForm.valid) return;
    this.isSubmitting = true;

    const uploadObservables = this.images.map((image) =>
      this._imgbbService.uploadToImgbb(image)
    );

    forkJoin(uploadObservables).subscribe({
      next: (responses) => {
        const uploadedImages = responses.map((response) => {
          return {
            id: response.data.id,
            full: response.data.image.url,
            small: response.data.thumb.url,
          } as Image;
        });
        this.createOfferForm.get('image')?.setValue(uploadedImages);
      },
      error: (err) => {
        console.error('Upload Error:', err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
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
        this.objectData$ = this._itemService.getCars().pipe(
          map((cars) => {
            const car = cars.find((car) => car.id === id);
            this._getCarFuelTypeIcon(car);
            this._getCarTransmissionTypeIcon(car);
            this._getCarBodyShapeIcon(car);
            this._getCarDriveTypeIcon(car);
            this.carOtherDetailsItems = this._mapOtherDetailsItems(car);
            this.carDetailsItems = this._mapCarDetailsItems(car);
            return car;
          })
        );
        break;
      case Offer.BUILDINGS:
        this.objectData$ = this._itemService.getBuildings().pipe(
          map((buildings) => {
            const building = buildings.find((building) => building.id === id);
            this.buildingDetailsItems = this._mapBuildingDetailsItems(building);
            this.buildingOtherDetailsItems =
              this._mapBuildingOtherDetailsItems(building);
            return building;
          })
        );
        break;
      case Offer.ELSE:
        this.objectData$ = this._itemService.getBasicObject().pipe(
          map((objects) => objects.find((object) => object.id === id))
        );
        break;
    }
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
      {
        title: 'GODINA PROIZVODNJE',
        icon: 'calendar',
        value: car.productionYear,
      },
      { title: 'MOTOR', icon: this.fuelIcon, value: car.engine },
      {
        title: 'MJENJAČ',
        icon: this.transmissionIcon,
        value: car.transmission,
      },
      { title: 'VRSTA POGONA', icon: this.driveTypeIcon, value: car.driveType },
      { title: 'OBLIK VOZILA', icon: this.bodyShapeIcon, value: car.bodyShape },
      { title: 'BROJ VRATA', icon: 'car-door', value: String(car.doorNumber) },
      {
        title: 'BROJ SJEDALA',
        icon: 'car-seat',
        value: String(car.seatNumber),
      },
      { title: 'REGISTRIRAN DO', icon: 'calendar', value: car.registration },
      { title: 'CO2 EMISIJE', icon: 'emission', value: `${car.emission} g/km` },
      { title: 'LOKACIJA VOZILA', icon: 'location-pin', value: car.location },
    ];
  }

  private _mapOtherDetailsItems(
    car: Car | undefined
  ): DetailsItem[] | undefined {
    if (!car) return;
    return [
      { title: 'Veličina motora', value: `${car.engineSize} L` },
      { title: 'Godina modela', value: car.modelYear },
      { title: 'Boja vozila', value: car.bodyColor },
      { title: 'Boja unutrašnjosti', value: car.interiorColor },
      { title: 'Materijal unutrašnjosti', value: car.interiorMaterial },
      { title: 'Kategorija emisija', value: car.emissionsClass },
    ];
  }

  private _mapBuildingDetailsItems(
    building: Building | undefined
  ): DetailsItem[] | undefined {
    if (!building) return;
    return [
      {
        title: 'BROJ SPAVAĆIH SOBA',
        icon: 'bed',
        value: String(building.roomNumber),
      },
      {
        title: 'BROJ KUPAONICA',
        icon: 'bath',
        value: String(building.bathroomNumber),
      },
      {
        title: 'POVRŠINA OBJEKTA',
        icon: 'house',
        value: `${String(building.buildingArea)} m²`,
      },
      {
        title: 'POVRŠINA OKĆNICE',
        icon: 'garden',
        value: `${String(building.gardenArea)} m²`,
      },
    ];
  }

  private _mapBuildingOtherDetailsItems(
    building: Building | undefined
  ): DetailsItem[] | undefined {
    if (!building) return;
    return [
      { title: 'Broj kata', value: building.floors },
      { title: 'Godina izgradnje', value: building.buildYear },
      { title: 'Vrsta građevine', value: building.buildingType },
    ];
  }

  ngOnDestroy(): void {
    this.userOfferSubscription.unsubscribe();
  }
}
