import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { Offer } from '../../../models/offer.enum';
import { ItemService } from '../../../services/item.service';
import { MaterialModule } from '../../../shared/modules/material.module';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CarMake } from '../../../models/car-make.enum';

@Component({
  selector: 'app-offer-filter',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './offer-filter.component.html',
  styleUrl: './offer-filter.component.scss',
})
export class OfferFilterComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _route = inject(ActivatedRoute);
  private readonly _itemService = inject(ItemService);

  filteredCarBrand$!: Observable<string[] | undefined> | undefined;
  selectedCategory: Offer = Offer.CARS;
  filterForm!: FormGroup;

  ngOnInit(): void {
    this.filterForm = this._fb.group({
      brand: [''],
      priceFrom: ['', [Validators.min(0), Validators.max(10000000)]],
      priceTo: ['', [Validators.min(0), Validators.max(10000000)]],
      buildingAreaFrom: ['', [Validators.min(0), Validators.max(10000000)]],
      buildingAreaTo: ['', [Validators.min(0), Validators.max(10000000)]],
      mileageFrom: ['', [Validators.min(0), Validators.max(10000000)]],
      mileageTo: ['', [Validators.min(0), Validators.max(10000000)]],
      yearFrom: [{ value: '', disabled: true }],
      yearTo: [{ value: '', disabled: true }],
    });

    this.filteredCarBrand$ = this.filterForm.get('brand')?.valueChanges.pipe(
      startWith(''),
      map((brand) => this._filterCarBrand(brand || ''))
    );

    this._selectCategory();
  }

  onYearFromSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    this.filterForm.controls['yearFrom'].setValue(
      new Date(normalizedYear, 12, 0)
    );
    datepicker.close();
  }

  onYearToSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    this.filterForm.controls['yearTo'].setValue(
      new Date(normalizedYear, 12, 0)
    );
    datepicker.close();
  }

  onSubmit() {
    if (this.filterForm.valid) {
      const filterValues = this.filterForm.getRawValue();
      this._itemService.filterItems(filterValues, this.selectedCategory);
    }
  }

  onReset() {
    this.filterForm.reset();
    this._itemService.resetFilter(this.selectedCategory);
  }

  private _filterCarBrand(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this._getCarBrandList().filter((brand) =>
      brand.toLowerCase().includes(filterValue)
    );
  }

  private _getCarBrandList(): string[] {
    return Object.values(CarMake);
  }

  private _selectCategory() {
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
  }

  public get Offer() {
    return Offer; 
  }
}
