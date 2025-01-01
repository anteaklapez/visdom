import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CarMake } from '../../../../models/car-make.enum';
import { getCarModels } from '../../../../models/car-model.enum';
import { MatDatepicker } from '@angular/material/datepicker';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from '../../../../../environments/environment';
import { ImgbbService } from '../../../../services/imgbb.service';
import * as uuid from 'uuid';
import { IconsModule } from '../../../../shared/modules/icons.module';
import { BodyShape, Car, EmissionClass, Interior } from '../../../../models/car.interface';
import { ItemService } from '../../../../services/item.service';
import { Router } from '@angular/router';

const DEFAULT_IMAGE_FULL = environment.defaultImageFull;
const DEFAULT_IMAGE_SMALL = environment.defaultImageSmall;

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, IconsModule, AsyncPipe],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss',
})
export class CarFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _imgbbService = inject(ImgbbService);
  private readonly _itemService = inject(ItemService);
  private readonly _router = inject(Router);

  filteredCarBrand$!: Observable<string[] | undefined> | undefined;
  filteredCarModel$!: Observable<string[] | undefined> | undefined;
  isDragging: boolean = false;
  isSubmitting: boolean = false;
  carsForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  images: string[] = [];
  selectedFiles: File[] = [];
  registrationOptions: string[] = [];
  title: string = 'DODAVANJE VOZILA';
  dataToEdit: Car | null = null;

  ngOnInit(): void {
    const data = this._itemService.getItemToEdit() as Car | null;
    this.dataToEdit = data;

    this.carsForm = this._fb.group({
      name: [null, Validators.required],
      brand: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      model: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
      images: [[]],
      price: [
        null,
        [Validators.min(0), Validators.max(10000000), Validators.required],
      ],
      modelYear: [{ value: null, disabled: false }],
      productionYear: [{ value: null, disabled: false }],
      registration: [null],
      engineSize: [null, [Validators.min(0), Validators.max(10000000)]],
      location: [null],
      description: [null],
      mileage: [null, [Validators.min(0), Validators.max(10000000), Validators.pattern('^[0-9]+$')]],
      power: [null, [Validators.min(0), Validators.max(10000000)]],
      engine: [null],
      transmission: [null],
      seatNumber: [null],
      doorNumber: [null],
      bodyShape: [null],
      consumption: [null],
      driveType: [null],
      interiorMaterial: [null],
      bodyColor: [null],
      vin: [null],
      emission: [null],
      emissionsClass: [null],
      interiorColor: [null],
    });

    if (data) {
      this.title = 'UREĐIVANJE VOZILA'

      this.carsForm.patchValue({
        name: data.name,
        brand: data.brand,
        type: data.type,
        model: data.model,
        price: data.price,
        modelYear: new Date((data.modelYear as any), 0, 1),
        productionYear: new Date((data.productionYear as any), 0, 1),
        registration: data.registration,
        engineSize: data.engineSize,
        location: data.location,
        description: data.description,
        mileage: data.mileage,
        power: data.power,
        engine: data.engine,
        transmission: data.transmission,
        seatNumber: data.seatNumber,
        doorNumber: data.doorNumber,
        bodyShape: data.bodyShape,
        consumption: data.consumption,
        driveType: data.driveType,
        interiorMaterial: data.interiorMaterial,
        bodyColor: data.bodyColor,
        vin: data.vin,
        emission: data.emission,
        emissionsClass: data.emissionsClass,
        interiorColor: data.interiorColor,
      });

      if (data && data.images) {
        this.images = data.images.map((img: any) => img.full);
        this.carsForm.get('images')?.setValue(this.images);
      }
    }

    this.filteredCarBrand$ = this.carsForm.get('brand')?.valueChanges.pipe(
      startWith(''),
      map((brand) => this._filterCarBrand(brand || ''))
    );

    this.filteredCarModel$ = this.carsForm.get('model')?.valueChanges.pipe(
      startWith(''),
      map((model) => this._filterMarModel(model || ''))
    );

    this._generateRegistrationOptions();
  }

  onCarMakeSelected(): void {
    this.carsForm.get('model')?.enable();
    this.carsForm.get('model')?.setValue('');
  }

  onModelYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    this.carsForm.controls['modelYear'].setValue(date);
    datepicker.close();
  }

  onProductionYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    this.carsForm.controls['productionYear'].setValue(date);
    datepicker.close();
  }

  private _filterCarBrand(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._getCarBrandList().filter((brand) =>
      brand.toLowerCase().includes(filterValue)
    );
  }

  private _filterMarModel(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._getCarModelList().filter((model) =>
      model.toLowerCase().includes(filterValue)
    );
  }

  private _generateRegistrationOptions(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); 
    const currentYear = currentDate.getFullYear();

    for (let i = 0; i < 13; i++) {
      const nextMonth = (currentMonth + i) % 12;
      const nextYear = currentYear + Math.floor((currentMonth + i) / 12);
      const formattedMonth = String(nextMonth + 1).padStart(2, '0');
      const formattedYear = nextYear.toString();

      this.registrationOptions.push(`${formattedMonth}/${formattedYear}`);
    }
  }

  private _getCarBrandList(): string[] {
    return Object.values(CarMake);
  }

  get emissionClassOptions() {
    return Object.entries(EmissionClass).map(([key, value]) => ({ key, value }));
  }

  get interiorMaterialOptions() {
    return Object.entries(Interior).map(([key, value]) => ({ key, value }));
  }
 
  get bodyShapeOptions() {
    return Object.entries(BodyShape).map(([key, value]) => ({ key, value }));
  }

  private _getCarModelList(): string[] {
    return getCarModels(this.carsForm.get('brand')?.value);
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
    this.carsForm.get('images')?.setValue(this.images);
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

  private _convertDateSelectionToString() {
    const modelYear = this.carsForm.get('modelYear')?.value;
    const productionYear = this.carsForm.get('productionYear')?.value;
  
    if (modelYear instanceof Date) {
      this.carsForm.get('modelYear')?.setValue(modelYear.getFullYear().toString());
    } else {
      this.carsForm.get('modelYear')?.setValue(null);
    }
  
    if (productionYear instanceof Date) {
      this.carsForm.get('productionYear')?.setValue(productionYear.getFullYear().toString());
    } else {
      this.carsForm.get('productionYear')?.setValue(null);
    }
  }
  
  onSubmit() {
    if (!this.carsForm.valid) return;
    this.isSubmitting = true;
  
    this._convertDateSelectionToString();
  
    const carData = this.carsForm.getRawValue();  
  
    if (this.images.length > 0) {
      const uploadObservables = this.images.map((image) =>
        this._imgbbService.uploadToImgbb(image)
      );
  
      forkJoin(uploadObservables).subscribe({
        next: (responses) => {
          const uploadedImages = responses.map((response) => ({
            id: uuid.v4(),
            full: response.data.image.url,
            small: response.data.thumb.url,
          }));
  
          carData.images = uploadedImages;
  
          if (this.dataToEdit) {
            this._updateCar(this.dataToEdit.id, carData);
          } else {
            this._createCar(carData);
          }
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.isSubmitting = false;
        },
      });
    } else {
      if (this.dataToEdit?.images) {
        carData.images = this.dataToEdit.images;
      } else {
        carData.images = [
          {
            id: uuid.v4(),
            full: DEFAULT_IMAGE_FULL,
            small: DEFAULT_IMAGE_SMALL,
          },
        ];
      }
  
      if (this.dataToEdit) {
        this._updateCar(this.dataToEdit.id, carData);
      } else {
        this._createCar(carData);
      }
    }
  }
  
  private _updateCar(carId: string, carData: Car) {
    this._itemService.updateCar({ ...carData, id: carId }).subscribe({
      next: (res) => {
        this._router.navigate(['/ponuda/vozila']);
      },
      error: (err) => {
        console.error('Error updating car:', err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  private _createCar(carData: Car) {
    this._itemService.createCar(carData).subscribe({
      next: (res) => {
        this._router.navigate(['/ponuda/vozila']);
      },
      error: (err) => {
        console.error('Error creating car:', err);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
