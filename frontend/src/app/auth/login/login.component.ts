import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../shared/modules/material.module';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _router = inject(Router);

  isSubmitting: boolean = false;
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) return;
    this.isSubmitting = true;

    this._authService
    .getToken(this.loginForm.value.username, this.loginForm.value.password)
    .subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this._authService.setLoggedIn(true);
        this._router.navigate(['ponuda/vozila']);
      },
      error: (err) => {
        this._snackBar.open(`Greška: ${err.status}`, 'Zatvori');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
