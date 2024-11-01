import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { CarMake } from '../../../../models/car-make.enum';
import { getCarModels } from '../../../../models/car-model.enum';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, AsyncPipe],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss',
})
export class CarFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _platformId = inject(PLATFORM_ID);

  filteredCarBrand$!: Observable<string[] | undefined> | undefined;
  filteredCarModel$!: Observable<string[] | undefined> | undefined;
  carsForm!: FormGroup;
  rippleColor!: string;

  ngOnInit(): void {
    this.carsForm = this._fb.group({
      name: ['', Validators.required],
      brand: new FormControl('', Validators.required),
      model: new FormControl({ value: '', disabled: true }, Validators.required),
      image: ['', Validators.required],
      price: ['', [Validators.min(0), Validators.max(10000000), Validators.required]],
      modelYear:  [{ value: '', disabled: true }],
      productionYear:  [{ value: '', disabled: true }],
      engineSize: ['', [Validators.min(0), Validators.max(10000000)]],
      location: [''],
      description: [''],
      power: ['', [Validators.min(0), Validators.max(10000000)]],
      engine: [''],
      transmission: [''],
    }); 

    this.filteredCarBrand$ = this.carsForm.get('brand')?.valueChanges.pipe(
      startWith(''),
      map(brand => this._filterCarBrand(brand || '')),
    );
    
    this.filteredCarModel$ = this.carsForm.get('model')?.valueChanges.pipe(
      startWith(''),
      map(model => this._filterMarModel(model || '')),
    );

    if (isPlatformBrowser(this._platformId)) {
      this.rippleColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--ripple')
        .trim();
    }
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
    return this._getCarBrandList().filter(brand => brand.toLowerCase().includes(filterValue));
  }
  
  private _filterMarModel(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._getCarModelList().filter(model => model.toLowerCase().includes(filterValue));
  }

  private _getCarBrandList(): string[] {
    return Object.values(CarMake);
  }

  private _getCarModelList(): string[] {
    return getCarModels(this.carsForm.get('brand')?.value);
  }

  onSubmit() {
    if (this.carsForm.valid) {
      console.log('Form Submitted:', this.carsForm.value);
    }
  }
}
