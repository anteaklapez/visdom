import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BasicObject } from '../models/basic-object.interface';
import { Building, BuildingType } from '../models/building.interface';
import { Car, Engine, Transmission } from '../models/car.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private _itemSubject$: BehaviorSubject<(Car | Building | BasicObject)[]> =
    new BehaviorSubject<(Car | Building | BasicObject)[]>([
      {
        id: 'sauce',
        location: 'Dubrovnik',
        title: 'Luxury Villa with Sea View',
        price: 2500000,
        image: ['https://cf.bstatic.com/xdata/images/hotel/max1024x768/473296975.jpg?k=d66796d0c65d527bfc9b69bd22ca75728ff4ea96bf319667f059f1c709f14adb&o=&hp=1'],
        roomNumber: 6,
        buildingArea: 450,
        gardenArea: 300,
        buildYear: '2015',
        buildingType: BuildingType.LUXURY_VILLA,
        description:
          'A stunning luxury villa with a breathtaking view of the Adriatic Sea. Includes a private pool, spacious garden, and modern amenities.',
      },
      {
        id: 'a',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'aff',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'att',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'arr',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'aee',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'aww',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'aqq',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'ass',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'add',
        name: 'Volkswagen T-Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5 Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'as',
        name: 'Volkswagen T-Roc 1.5 TSI DSG 110 kW',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
      {
        id: 'asd',
        name: 'Volkswagen T-Roc 1.5 TSI DSG 110 kW',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
      },
    ]);

  get allItems$(): Observable<(Car | Building | BasicObject)[]> {
    return this._itemSubject$.asObservable();
  }

  get cars$(): Observable<Car[]> {
    return this._itemSubject$.pipe(
      map((items: (Car | Building | BasicObject)[]): Car[] =>
        items.filter((item): item is Car => 'engine' in item)
      )
    );
  }

  get buildings$(): Observable<Building[]> {
    return this._itemSubject$.pipe(
      map((items: (Car | Building | BasicObject)[]): Building[] =>
        items.filter((item): item is Building => 'title' in item)
      )
    );
  }

  get basicObjects$(): Observable<BasicObject[]> {
    return this._itemSubject$.pipe(
      map((items: (Car | Building | BasicObject)[]): BasicObject[] =>
        items.filter((item): item is BasicObject => 'subject' in item)
      )
    );
  }
}
