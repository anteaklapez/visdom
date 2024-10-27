import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-offer-filter',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './offer-filter.component.html',
  styleUrl: './offer-filter.component.scss',
})
export class OfferFilterComponent implements OnInit {
  readonly fb = inject(FormBuilder);

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
}
