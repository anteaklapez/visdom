import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MaterialModule } from './shared/modules/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    MaterialModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly _authService = inject(AuthService);

  isSidenavOpen: boolean = false;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this._authService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  toggleSideNav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  closeSideNav() {
    this.isSidenavOpen = false;
  }

  logOut() {
    this._authService.logOut();
    this.closeSideNav();
  }
}
