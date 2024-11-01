import { Component, Input } from '@angular/core';
import { Building } from '../../../../models/building.interface';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-building',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './building-item.component.html',
  styleUrls: [
    './building-item.component.scss',
    '../../offer-container.component.scss',
  ],
})
export class BuildingItemComponent {
  @Input() building!: Building;
}
