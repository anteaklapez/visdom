import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable } from 'rxjs';
import { BasicObject } from '../models/basic-object.interface';
import { Building } from '../models/building.interface';
import {
  Car,
} from '../models/car.interface';
import { UserOffer } from '../models/user-offer.interface';
import { Offer } from '../models/offer.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface FilterCriteria {
  brand?: string;
  priceFrom?: number;
  priceTo?: number;
  buildingAreaFrom?: number;
  buildingAreaTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  yearFrom?: Date;
  yearTo?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly _http = inject(HttpClient);

  private _allItems: (Car | Building | BasicObject)[] = [];

  _itemSubject$: BehaviorSubject<(Car | Building | BasicObject)[]> =
    new BehaviorSubject<(Car | Building | BasicObject)[]>([]);

  private _userOfferSubject$: BehaviorSubject<UserOffer[]> =
    new BehaviorSubject<UserOffer[]>([]);

  private _itemToEdit: (Car | Building | BasicObject) | null = null;

  setItemToEdit(data: (Car | Building | BasicObject) | null): void {
    this._itemToEdit = data;
  }

  getItemToEdit(): (Car | Building | BasicObject) | null {
    const temp = this._itemToEdit;
    this._itemToEdit = null;
    return temp;
  }

  createCar(car: Car): Observable<any> {
    return this._http.post(`${environment.apiUrl}/izrada/vozila`, car);
  }

  getCars(): Observable<Car[]> {
    return this._http.get<Car[]>(`${environment.apiUrl}/vozila`);
  }

  updateCar(car: Car): Observable<any> {
    return this._http.put(`${environment.apiUrl}/uredi/vozilo/${car.id}`, car);
  }

  deleteCar(id: string): Observable<any> {
    return this._http.delete(`${environment.apiUrl}/brisanje/vozilo/${id}`);
  }

  createBuilding(building: Building): Observable<any> {
    return this._http.post(`${environment.apiUrl}/izrada/nekretnine`, building);
  }

  getBuildings(): Observable<Building[]> {
    return this._http.get<Building[]>(`${environment.apiUrl}/nekretnine`);
  }

  updateBuilding(building: Building): Observable<any> {
    return this._http.put(`${environment.apiUrl}/uredi/nekretnina/${building.id}`, building);
  }

  deleteBuilding(id: string): Observable<any> {
    return this._http.delete(`${environment.apiUrl}/brisanje/nekretnina/${id}`);
  }

  createBasicObject(object: BasicObject): Observable<any> {
    return this._http.post(`${environment.apiUrl}/izrada/ostalo`, object);
  }

  getBasicObject(): Observable<BasicObject[]> {
    return this._http.get<BasicObject[]>(`${environment.apiUrl}/ostalo`);
  }

  updateBasicObject(object: BasicObject): Observable<any> {
    return this._http.put(`${environment.apiUrl}/uredi/ostalo/${object.id}`, object);
  }

  deleteBasicObject(id: string): Observable<any> {
    return this._http.delete(`${environment.apiUrl}/brisanje/ostalo/${id}`);
  }

  getUserOffersById(objectId: string): Observable<UserOffer[]> {
    return this._userOfferSubject$.pipe(
      map((items: UserOffer[]): UserOffer[] =>
        items.filter((item) => item.objectId === objectId)
      )
    );
  }

  deleteUserOfferByEmail(offer: UserOffer): Observable<UserOffer[]> {
    return this.getUserOffersById(offer.objectId).pipe(
      map((items: UserOffer[]): UserOffer[] =>
        items.filter((item) => item.id !== offer.objectId)
      )
    );
  }

  getItemById(
    id: string
  ): Observable<(Car | Building | BasicObject) | undefined> {
    return this._itemSubject$.pipe(
      map(
        (
          items: (Car | Building | BasicObject)[]
        ): (Car | Building | BasicObject) | undefined =>
          items.find((item) => item.id === id)
      )
    );
  }

  public doesItemExist(id: string): Observable<boolean> {
    return forkJoin([
      this.getCars(),      
      this.getBuildings(), 
      this.getBasicObject()
    ]).pipe(
      map(([cars, buildings, objects]) => {
        const foundInCars = cars.some(car => car.id === id);
        const foundInBuildings = buildings.some(b => b.id === id);
        const foundInObjects = objects.some(o => o.id === id);
  
        return foundInCars || foundInBuildings || foundInObjects;
      })
    );
  }

  filterItems(criteria: FilterCriteria, category: string): void {
    let filteredItems = this._allItems;

    // Filter by category
    if (category === Offer.CARS) {
      filteredItems = this._itemSubject$.getValue().filter((item) => 'engine' in item);
    } else if (category === Offer.BUILDINGS) {
      filteredItems = filteredItems.filter((item) => 'title' in item);
    } else {
      filteredItems = filteredItems.filter((item) => 'subject' in item);
    }

    // Apply brand filter (for cars)
    if (criteria.brand) {
      filteredItems = filteredItems.filter(
        (item) =>
          'brand' in item &&
          item.brand.toLowerCase().includes(criteria.brand!.toLowerCase())
      );
    }

    // Apply price range filter
    if (criteria.priceFrom) {
      filteredItems = filteredItems.filter(
        (item) => 'price' in item && item.price >= criteria.priceFrom!
      );
    }
    if (criteria.priceTo) {
      filteredItems = filteredItems.filter(
        (item) => 'price' in item && item.price <= criteria.priceTo!
      );
    }

    // Apply building area filter (for buildings)
    if (criteria.buildingAreaFrom) {
      filteredItems = filteredItems.filter(
        (item: any) =>
          'buildingArea' in item &&
          item.buildingArea >= criteria.buildingAreaFrom!
      );
    }
    if (criteria.buildingAreaTo) {
      filteredItems = filteredItems.filter(
        (item: any) =>
          'buildingArea' in item &&
          item.buildingArea <= criteria.buildingAreaTo!
      );
    }

    // Apply mileage filter (for cars)
    if (criteria.mileageFrom) {
      filteredItems = filteredItems.filter(
        (item: any) =>
          'mileage' in item && item.mileage >= criteria.mileageFrom!
      );
    }
    if (criteria.mileageTo) {
      filteredItems = filteredItems.filter(
        (item: any) => 'mileage' in item && item.mileage <= criteria.mileageTo!
      );
    }

    // Apply year filter
    if (criteria.yearFrom) {
      const yearFrom = criteria.yearFrom.getFullYear();
      filteredItems = filteredItems.filter((item) => {
        if ('productionYear' in item && item.productionYear) {
          return parseInt(item.productionYear, 10) >= yearFrom;
        }
        if ('buildYear' in item && item.buildYear) {
          return parseInt(item.buildYear, 10) >= yearFrom;
        }
        return true;
      });
    }

    if (criteria.yearTo) {
      const yearTo = criteria.yearTo.getFullYear();
      filteredItems = filteredItems.filter((item) => {
        if ('productionYear' in item && item.productionYear) {
          return parseInt(item.productionYear, 10) <= yearTo;
        }
        if ('buildYear' in item && item.buildYear) {
          return parseInt(item.buildYear, 10) <= yearTo;
        }
        return true;
      });
    }

    // Update the BehaviorSubject with filtered items
    this._itemSubject$.next(filteredItems);
  }

  resetFilter(): void {
    this._itemSubject$.next(this._allItems);
  }
}
