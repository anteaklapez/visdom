import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../shared/modules/material.module';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  isSubmitting: boolean = false;
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.contactForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^\\+?\\d{0,13}')]],
      description: [''],
    });
  }

  onSubmit() {
    if (!this.contactForm.valid) return;
    this.isSubmitting = true;

    console.log('Uploaded form value:', this.contactForm.getRawValue());
    this.isSubmitting = false;
  }
}
