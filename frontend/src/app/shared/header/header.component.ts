import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../material.module';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MaterialModule
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
