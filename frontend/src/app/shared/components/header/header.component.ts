import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideNav: EventEmitter<void> = new EventEmitter();
  private readonly _authService = inject(AuthService);

  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this._authService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  openMenu() {
    this.toggleSideNav.emit();
  }

  logOut() {
    this._authService.logOut();
  }
}
