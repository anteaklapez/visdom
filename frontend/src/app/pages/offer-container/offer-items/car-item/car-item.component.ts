import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { CommonModule } from '@angular/common';
import { Car, Engine } from '../../../../models/car.interface';
import { IconsModule } from '../../../../shared/modules/icons.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [MaterialModule, IconsModule, CommonModule, RouterLink],
  templateUrl: './car-item.component.html',
  styleUrls: [
    './car-item.component.scss',
    '../../offer-container.component.scss',
  ],
})
export class CarItemComponent implements OnInit {
  @Input() car!: Car;
  fuelIcon!: string;

  ngOnInit(): void {
    this._getCarFuelTypeIcon();
  }

  private _getCarFuelTypeIcon() {
    switch (this.car.engine) {
      case Engine.DIESEL:
        this.fuelIcon = 'fuel';
        break;
      case Engine.ELECTRIC:
        this.fuelIcon = 'electricity';
        break;
      case Engine.HYBRID:
        this.fuelIcon = 'hybrid';
        break;
      case Engine.GASOLINE:
        this.fuelIcon = 'fuel';
        break;
      default:
        this.fuelIcon = 'fuel';
        break;
    }
  }
}
