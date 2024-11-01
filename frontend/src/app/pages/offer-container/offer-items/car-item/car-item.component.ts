import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { CommonModule } from '@angular/common';
import { Car } from '../../../../models/car.interface';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './car-item.component.html',
  styleUrls: [
    './car-item.component.scss',
    '../../offer-container.component.scss',
  ],
})
export class CarItemComponent {
  @Input() car!: Car;
}
