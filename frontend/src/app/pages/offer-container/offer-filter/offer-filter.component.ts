import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute } from '@angular/router';
import { Offer } from '../../../models/offer.enum';

@Component({
  selector: 'app-offer-filter',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './offer-filter.component.html',
  styleUrl: './offer-filter.component.scss',
})
export class OfferFilterComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly itemService = inject(ItemService);
  readonly route = inject(ActivatedRoute);

  selectedCategory: Offer = Offer.CARS;
  filterForm!: FormGroup;

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      priceFrom: ['', [Validators.min(0), Validators.max(10000000)]],
      priceTo: ['', [Validators.min(0), Validators.max(10000000)]],
      mileageFrom: ['', [Validators.min(0), Validators.max(10000000)]],
      mileageTo: ['', [Validators.min(0), Validators.max(10000000)]],
      yearFrom: [{ value: '', disabled: true }],
      yearTo: [{ value: '', disabled: true }],
    });

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
      console.log('Form Submitted:', this.filterForm.value);
    }
  }

  private _selectCategory() {
    this.route.url.subscribe((urlSegments) => {
      const path = urlSegments[0]?.path;
      console.log(path, 'offer filter')
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
