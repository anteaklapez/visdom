import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../modules/material.module';
import { CdkMenuTrigger, CdkMenu, CdkMenuItem } from '@angular/cdk/menu';

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
export class HeaderComponent {
  @Output() toggleSideNav: EventEmitter<void> = new EventEmitter();

  openMenu() {
    this.toggleSideNav.emit();
  }
}
