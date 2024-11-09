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
import { Image } from '../../../../models/basic-object.interface';
import * as uuid from 'uuid';

const DEFAULT_IMAGE_FULL = environment.defaultImageFull;
const DEFAULT_IMAGE_SMALL = environment.defaultImageSmall;

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, AsyncPipe],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss',
})
export class CarFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _imgbbService = inject(ImgbbService);

  filteredCarBrand$!: Observable<string[] | undefined> | undefined;
  filteredCarModel$!: Observable<string[] | undefined> | undefined;
  isDragging: boolean = false;
  isSubmitting: boolean = false;
  carsForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  images: string[] = [];
  selectedFiles: File[] = [];

  ngOnInit(): void {
    this.carsForm = this._fb.group({
      name: ['', Validators.required],
      brand: new FormControl('', Validators.required),
      model: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      image: [[]],
      price: [
        '',
        [Validators.min(0), Validators.max(10000000), Validators.required],
      ],
      modelYear: [{ value: '', disabled: true }],
      productionYear: [{ value: '', disabled: true }],
      engineSize: ['', [Validators.min(0), Validators.max(10000000)]],
      location: [''],
      description: [''],
      mileage: ['', [Validators.min(0), Validators.max(10000000)]],
      power: ['', [Validators.min(0), Validators.max(10000000)]],
      engine: [''],
      transmission: [''],
    });

    this.filteredCarBrand$ = this.carsForm.get('brand')?.valueChanges.pipe(
      startWith(''),
      map((brand) => this._filterCarBrand(brand || ''))
    );

    this.filteredCarModel$ = this.carsForm.get('model')?.valueChanges.pipe(
      startWith(''),
      map((model) => this._filterMarModel(model || ''))
    );
  }

  onCarMakeSelected(): void {
    this.carsForm.get('model')?.enable();
    this.carsForm.get('model')?.setValue('');
  }

  onModelYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear().toString();
    this.carsForm.controls['modelYear'].setValue(normalizedYear);
    datepicker.close();
  }

  onProductionYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear().toString();
    this.carsForm.controls['productionYear'].setValue(normalizedYear);
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

  private _getCarBrandList(): string[] {
    return Object.values(CarMake);
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

  onSubmit() {
    if (!this.carsForm.valid) return;
    this.isSubmitting = true;
    this.carsForm.value.id = uuid.v4();

    if (this.images.length > 0) {
      const uploadObservables = this.images.map((image) =>
        this._imgbbService.uploadToImgbb(image)
      );

      forkJoin(uploadObservables).subscribe({
        next: (responses) => {
          this.carsForm.value.image = responses.map((response) => {
            return {
              id: response.data.id,
              full: response.data.image.url,
              small: response.data.thumb.url,
            } as Image;
          });
        },
        error: (err) => {
          console.error('Upload Error:', err);
          this.isSubmitting = false;
        },
        complete: () => {
          console.log('Uploaded form value:', this.carsForm.getRawValue());
          this.isSubmitting = false;
        },
      });
    } else {
      this.carsForm.value.image = [
        {
          id: uuid.v4(),
          full: DEFAULT_IMAGE_FULL,
          small: DEFAULT_IMAGE_SMALL,
        } as Image,
      ];
      this.isSubmitting = false;
    }
  }
}
