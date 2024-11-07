import { Component, Input } from '@angular/core';
import { BasicObject } from '../../../../models/basic-object.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/modules/material.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-else',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './else-item.component.html',
  styleUrls: [
    './else-item.component.scss',
    '../../offer-container.component.scss',
  ],
})
export class ElseItemComponent {
  @Input() basicObject!: BasicObject;
}
