import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../shared/modules/material.module';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _http = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  isSubmitting: boolean = false;
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.contactForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?\\d{0,13}')]],
      message: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.contactForm.get('name')?.value);
    formData.append('email', this.contactForm.get('email')?.value);
    formData.append('phone', this.contactForm.get('phone')?.value);
    formData.append('message', this.contactForm.get('message')?.value);

    this._http
      .post(`${environment.apiUrl}/kontakt`, formData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          this._snackBar.open('Vaša poruka je poslana!', 'Zatvori', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.contactForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error submitting contact form:', error);
          let errorMessage = 'Greška prilikom slanja poruke.';

          this._snackBar.open(errorMessage, 'Zatvori', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        },
      });
  }
}
