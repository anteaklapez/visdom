import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CarMake } from '../../../../models/car-make.enum';
import { getCarModels } from '../../../../models/car-model.enum';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, AsyncPipe],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss',
})
export class CarFormComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  filteredCarBrand$!: Observable<string[] | undefined> | undefined;
  filteredCarModel$!: Observable<string[] | undefined> | undefined;
  carsForm!: FormGroup;

  ngOnInit(): void {
    this.carsForm = this._fb.group({
      brand: new FormControl(''),
      model: new FormControl({ value: '', disabled: true }),
    }); 

    this.filteredCarBrand$ = this.carsForm.get('brand')?.valueChanges.pipe(
      startWith(''),
      map(brand => this._filterCarBrand(brand || '')),
    );
    
    this.filteredCarModel$ = this.carsForm.get('model')?.valueChanges.pipe(
      startWith(''),
      map(model => this._filterMarModel(model || '')),
    );
  }

  onCarMakeSelected(): void {
    this.carsForm.get('model')?.enable();
    this.carsForm.get('model')?.setValue('');
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
