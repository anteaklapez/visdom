import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
} from 'rxjs';
import { BasicObject } from '../models/basic-object.interface';
import { Building } from '../models/building.interface';
import { Car } from '../models/car.interface';
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

  private _filteredItemsSubject$ = new BehaviorSubject<
    (Car | Building | BasicObject)[]
  >([]);
  public filteredItems$ = this._filteredItemsSubject$.asObservable();

  private _userOfferSubject$: BehaviorSubject<UserOffer[]> =
    new BehaviorSubject<UserOffer[]>([]);

  private _itemToEdit: (Car | Building | BasicObject) | null = null;

  // Caching variables
  private _carsCache: Car[] | null = null;
  private _buildingsCache: Building[] | null = null;
  private _basicObjectsCache: BasicObject[] | null = null;

  // Observable cache subjects
  private _carsCacheSubject$ = new BehaviorSubject<Car[] | null>(null);
  private _buildingsCacheSubject$ = new BehaviorSubject<Building[] | null>(
    null
  );
  private _basicObjectsCacheSubject$ = new BehaviorSubject<
    BasicObject[] | null
  >(null);

  // Reactive accessors
  get cars$(): Observable<Car[]> {
    return this._carsCacheSubject$
      .asObservable()
      .pipe(map((cache) => cache || []));
  }

  get buildings$(): Observable<Building[]> {
    return this._buildingsCacheSubject$
      .asObservable()
      .pipe(map((cache) => cache || []));
  }

  get basicObjects$(): Observable<BasicObject[]> {
    return this._basicObjectsCacheSubject$
      .asObservable()
      .pipe(map((cache) => cache || []));
  }

  // Fetch cars with caching
  getCars(): Observable<Car[]> {
    if (this._carsCache) {
      return of(this._carsCache);
    }
    return this._http.get<Car[]>(`${environment.apiUrl}/vozila`).pipe(
      map((data) => {
        this._carsCache = data;
        this._carsCacheSubject$.next(data);
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching cars:', error);
        return of([] as Car[]);
      })
    );
  }

  // Fetch buildings with caching
  getBuildings(): Observable<Building[]> {
    if (this._buildingsCache) {
      return of(this._buildingsCache);
    }
    return this._http.get<Building[]>(`${environment.apiUrl}/nekretnine`).pipe(
      map((data) => {
        this._buildingsCache = data;
        this._buildingsCacheSubject$.next(data);
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching buildings:', error);
        return of([] as Building[]);
      })
    );
  }

  // Fetch basic objects with caching
  getBasicObject(): Observable<BasicObject[]> {
    if (this._basicObjectsCache) {
      return of(this._basicObjectsCache);
    }
    return this._http.get<BasicObject[]>(`${environment.apiUrl}/ostalo`).pipe(
      map((data) => {
        this._basicObjectsCache = data;
        this._basicObjectsCacheSubject$.next(data);
        return data;
      }),
      catchError((error) => {
        console.error('Error fetching basic objects:', error);
        return of([] as BasicObject[]);
      })
    );
  }

  // Clear specific cache after modification
  private clearCache(type: 'cars' | 'buildings' | 'basicObjects'): void {
    if (type === 'cars') {
      this._carsCache = null;
      this._carsCacheSubject$.next(null);
    } else if (type === 'buildings') {
      this._buildingsCache = null;
      this._buildingsCacheSubject$.next(null);
    } else if (type === 'basicObjects') {
      this._basicObjectsCache = null;
      this._basicObjectsCacheSubject$.next(null);
    }
  }

  // Clear all caches (optional utility)
  clearAllCaches(): void {
    this.clearCache('cars');
    this.clearCache('buildings');
    this.clearCache('basicObjects');
  }

  // CRUD operations for cars
  createCar(car: Car): Observable<any> {
    return this._http
      .post(`${environment.apiUrl}/izrada/vozila`, car)
      .pipe(map(() => this.clearCache('cars')));
  }

  updateCar(car: Car): Observable<any> {
    return this._http
      .put(`${environment.apiUrl}/uredi/vozilo/${car.id}`, car)
      .pipe(map(() => this.clearCache('cars')));
  }

  deleteCar(id: string): Observable<any> {
    return this._http
      .delete(`${environment.apiUrl}/brisanje/vozilo/${id}`)
      .pipe(map(() => this.clearCache('cars')));
  }

  // CRUD operations for buildings
  createBuilding(building: Building): Observable<any> {
    return this._http
      .post(`${environment.apiUrl}/izrada/nekretnine`, building)
      .pipe(map(() => this.clearCache('buildings')));
  }

  updateBuilding(building: Building): Observable<any> {
    return this._http
      .put(`${environment.apiUrl}/uredi/nekretnina/${building.id}`, building)
      .pipe(map(() => this.clearCache('buildings')));
  }

  deleteBuilding(id: string): Observable<any> {
    return this._http
      .delete(`${environment.apiUrl}/brisanje/nekretnina/${id}`)
      .pipe(map(() => this.clearCache('buildings')));
  }

  // CRUD operations for basic objects
  createBasicObject(object: BasicObject): Observable<any> {
    return this._http
      .post(`${environment.apiUrl}/izrada/ostalo`, object)
      .pipe(map(() => this.clearCache('basicObjects')));
  }

  updateBasicObject(object: BasicObject): Observable<any> {
    return this._http
      .put(`${environment.apiUrl}/uredi/ostalo/${object.id}`, object)
      .pipe(map(() => this.clearCache('basicObjects')));
  }

  deleteBasicObject(id: string): Observable<any> {
    return this._http
      .delete(`${environment.apiUrl}/brisanje/ostalo/${id}`)
      .pipe(map(() => this.clearCache('basicObjects')));
  }

  createUserOffer(userOffer: UserOffer): Observable<any> {
    return this._http.post(`${environment.apiUrl}/izrada/ponuda`, userOffer);
  }

  getUserOffer(itemId: string): Observable<UserOffer[]> {
    return this._http.get<UserOffer[]>(`${environment.apiUrl}/ponude/${itemId}`);
  }

  deleteUserOffer(id: string): Observable<any> {
    return this._http.delete(`${environment.apiUrl}/brisanje/ponuda/${id}`);
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

  setItemToEdit(data: (Car | Building | BasicObject) | null): void {
    this._itemToEdit = data;
  }

  getItemToEdit(): (Car | Building | BasicObject) | null {
    const temp = this._itemToEdit;
    this._itemToEdit = null;
    return temp;
  }

  doesItemExist(id: string): Observable<boolean> {
    return forkJoin([
      this.getCars(),
      this.getBuildings(),
      this.getBasicObject(),
    ]).pipe(
      map(([cars, buildings, objects]) => {
        const foundInCars = cars.some((car) => car.id === id);
        const foundInBuildings = buildings.some((b) => b.id === id);
        const foundInObjects = objects.some((o) => o.id === id);

        return foundInCars || foundInBuildings || foundInObjects;
      })
    );
  }

  filterItems(criteria: FilterCriteria, category: string): void {
    forkJoin([
      this.getCars().pipe(
        catchError((error) => {
          console.error('Error fetching cars:', error);
          return of([] as Car[]); // Return an empty array if there's an error
        })
      ),
      this.getBuildings().pipe(
        catchError((error) => {
          console.error('Error fetching buildings:', error);
          return of([] as Building[]); // Return an empty array if there's an error
        })
      ),
      this.getBasicObject().pipe(
        catchError((error) => {
          console.error('Error fetching basic objects:', error);
          return of([] as BasicObject[]); // Return an empty array if there's an error
        })
      ),
    ]).subscribe(([cars, buildings, objects]) => {
      let filteredItems: any = [];

      // Filter by category
      if (category === Offer.CARS) {
        filteredItems = cars;
      } else if (category === Offer.BUILDINGS) {
        filteredItems = buildings;
      } else {
        filteredItems = objects;
      }

      // Apply brand filter (for cars)
      if (criteria.brand) {
        filteredItems = filteredItems.filter(
          (item: any) =>
            'brand' in item &&
            item.brand.toLowerCase().includes(criteria.brand!.toLowerCase())
        );
      }

      // Apply price range filter
      if (criteria.priceFrom) {
        filteredItems = filteredItems.filter(
          (item: any) => 'price' in item && item.price >= criteria.priceFrom!
        );
      }
      if (criteria.priceTo) {
        filteredItems = filteredItems.filter(
          (item: any) => 'price' in item && item.price <= criteria.priceTo!
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
          (item: any) =>
            'mileage' in item && item.mileage <= criteria.mileageTo!
        );
      }

      // Apply year filter
      if (criteria.yearFrom) {
        const yearFrom = criteria.yearFrom.getFullYear();
        filteredItems = filteredItems.filter((item: any) => {
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
        filteredItems = filteredItems.filter((item: any) => {
          if ('productionYear' in item && item.productionYear) {
            return parseInt(item.productionYear, 10) <= yearTo;
          }
          if ('buildYear' in item && item.buildYear) {
            return parseInt(item.buildYear, 10) <= yearTo;
          }
          return true;
        });
      }

      this._filteredItemsSubject$.next(filteredItems);
    });
  }

  resetFilter(selectedCategory: string): void {
    this.filterItems({}, selectedCategory);
  }
}
