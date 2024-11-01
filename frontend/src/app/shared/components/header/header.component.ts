import { Component, EventEmitter, inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MaterialModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private readonly _platformId = inject(PLATFORM_ID);

  @Output() toggleSideNav: EventEmitter<void> = new EventEmitter();

  rippleColor!: string;

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.rippleColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--ripple')
        .trim();
    }
  }
  openMenu() {
    this.toggleSideNav.emit();
  }
}
