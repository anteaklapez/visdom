import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/modules/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Observable } from 'rxjs';
import { Car } from '../../models/car.interface';
import { Building } from '../../models/building.interface';
import { BasicObject } from '../../models/basic-object.interface';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Offer } from '../../models/offer.enum';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [MaterialModule, AsyncPipe, CommonModule],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.scss'
})
export class OfferDetailsComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _itemService = inject(ItemService);

  objectData$ = new 
    Observable<(Car | Building | BasicObject) | undefined>(undefined);

  selectedCategory: Offer = Offer.CARS;

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    const routePrefix = this._route.snapshot.url.slice(0, -1).map(segment => segment.path).join('/');
    
    if (id && !this._itemService.doesItemExist(id)) {
      this._router.navigate([`/${routePrefix}`]);
      return;
    }

    this.objectData$ = this._itemService.getItemById(id!);
    this.objectData$.subscribe(res => {
      console.log(res)
    })
  }
}
