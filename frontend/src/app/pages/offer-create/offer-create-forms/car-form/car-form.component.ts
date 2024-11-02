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
import * as uuid from 'uuid';
import { ImgurService } from '../../../../services/imgur.service';

const DEFAULT_IMAGE = environment.defaultImage;

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, AsyncPipe],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss',
})
export class CarFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _imgurService = inject(ImgurService);

  filteredCarBrand$!: Observable<string[] | undefined> | undefined;
  filteredCarModel$!: Observable<string[] | undefined> | undefined;
  isDragging: boolean = false;
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
    const normalizedYear = date.getFullYear();
    this.carsForm.controls['modelYear'].setValue(
      new Date(normalizedYear, 12, 0)
    );
    datepicker.close();
  }

  onProductionYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    this.carsForm.controls['productionYear'].setValue(
      new Date(normalizedYear, 12, 0)
    );
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
    if (input.files && input.files?.length) {
      this.selectedFiles = Array.from(input.files);

      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.images.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
      this.selectedFiles = [];
    }
  }

  onSubmit() {
    if (this.carsForm.valid) {
      this.carsForm.value.id = uuid.v4();
      console.log(this.images)
      if (this.images.length > 0) {
        const uploadObservables = this.images.map(image =>
          this._imgurService.uploadXhr(image)
        );
  
        forkJoin(uploadObservables).subscribe({
          next: (urls) => {
            this.carsForm.value.image = urls.length ? urls : [DEFAULT_IMAGE];
            console.log('Form Submitted:', this.carsForm.value);
          },
          error: (err) => {
            console.error('Upload Error:', err);
          }
        });
      } else {
        this.carsForm.value.image = [DEFAULT_IMAGE];
        console.log('Form Submitted:', this.carsForm.value);
      }
    }
  }  
}
