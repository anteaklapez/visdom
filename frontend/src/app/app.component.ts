import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MaterialModule } from './shared/modules/material.module';
import { MatDrawer } from '@angular/material/sidenav';
import { isPlatformBrowser } from '@angular/common';

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
  @ViewChild('drawer') drawer!: MatDrawer;
  private readonly _platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      window.addEventListener('load', function () {
        setTimeout(function () {
          window.scrollTo(0, 1);
        }, 0);
      });
    }
  }

  toggleSideNav() {
    this.drawer.toggle();
  }
}
