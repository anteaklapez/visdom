import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BasicObject } from '../models/basic-object.interface';
import { Building, BuildingType, Floors } from '../models/building.interface';
import {
  BodyShape,
  Car,
  DriveType,
  EmissionClass,
  Engine,
  Interior,
  Transmission,
} from '../models/car.interface';
import { UserOffer } from '../models/user-offer.interface';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private _itemSubject$: BehaviorSubject<(Car | Building | BasicObject)[]> =
    new BehaviorSubject<(Car | Building | BasicObject)[]>([
      {
        name: 'Pravo dobri vw',
        brand: 'VW',
        model: 'Golf 8',
        image: [
          {
            id: 'q1VkBFq',
            full: 'https://i.ibb.co/zfDGsH9/ea9cec680629.png',
            small: 'https://i.ibb.co/q1VkBFq/ea9cec680629.png',
          },
          {
            id: 'C1fm9fC',
            full: 'https://i.ibb.co/3rn4Fn6/6699cf055172.png',
            small: 'https://i.ibb.co/C1fm9fC/6699cf055172.png',
          },
          {
            id: 'F8pqwzM',
            full: 'https://i.ibb.co/9yP3TWL/fae007a4ac10.png',
            small: 'https://i.ibb.co/F8pqwzM/fae007a4ac10.png',
          },
        ],
        price: 30000,
        mileage: 178500,
        engineSize: 2,
        location: 'Zagreb',
        productionYear: '2016',
        type: 'TSI DSG',
        modelYear: '2016',
        description: 'Pravo dobar auto\nBato ima ga se',
        power: 100,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
        driveType: DriveType.FRONT_WHEEL_DRIVE,
        doorNumber: 5,
        seatNumber: 5,
        bodyShape: BodyShape.HATCHBACK,
        registration: '04/2025',
        consumption: 6.5,
        bodyColor: 'plava',
        interiorColor: 'crna',
        interiorMaterial: Interior.LEATHER,
        vin: 'WVWZZZ1KZDP123456',
        emission: 120,
        emissionsClass: EmissionClass.EURO_6,
        id: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
      },
      {
        id: 'sauce',
        location: 'Dubrovnik',
        title: 'Luxury Villa with Sea View',
        price: 2500000,
        image: [
          {
            id: 'asdasd',
            full: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/473296975.jpg?k=d66796d0c65d527bfc9b69bd22ca75728ff4ea96bf319667f059f1c709f14adb&o=&hp=1',
            small:
              'https://cf.bstatic.com/xdata/images/hotel/max1024x768/473296975.jpg?k=d66796d0c65d527bfc9b69bd22ca75728ff4ea96bf319667f059f1c709f14adb&o=&hp=1',
          },
        ],
        roomNumber: 6,
        buildingArea: 450,
        gardenArea: 300,
        buildYear: '2015',
        buildingType: BuildingType.LUXURY_VILLA,
        description:
          'A stunning luxury villa with a breathtaking view of the Adriatic Sea. Includes a private pool, spacious garden, and modern amenities.',
        floors: Floors.TWO_FLOOR,
        bathroomNumber: 4,
      },
      {
        id: 'a',
        name: 'Volkswagen T-Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        image: [
          {
            id: 'asdasds',
            full: 'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
            small:
              'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
          },
        ],
        price: 28399,
        mileage: 57617,
        productionYear: '2021',
        modelYear: '2021',
        engineSize: 1.5,
        location: 'Zagreb',
        type: 'TSI DSG',
        description:
          'A well-maintained SUV with a powerful engine and automatic transmission, ideal for city and highway driving.',
        power: 110,
        engine: Engine.DIESEL,
        transmission: Transmission.AUTOMATIC,
        driveType: DriveType.FOUR_WHEEL_DRIVE,
        doorNumber: 5,
        seatNumber: 5,
        bodyShape: BodyShape.SUV,
        registration: '10/2024',
        consumption: 7.0,
        bodyColor: 'bijela',
        interiorColor: 'siva',
        interiorMaterial: Interior.LEATHER_AND_LENIN,
        vin: 'WVWZZZ1KZDP654321',
        emission: 105,
        emissionsClass: EmissionClass.EURO_6,
      },
      {
        id: 'aff',
        name: 'Volkswagen T-Roc 1.5',
        model: '1.5 TSI DSG',
        brand: 'Volkswagen',
        type: 'TSI DSG',
        image: [
          {
            id: 'asdasd',
            full: 'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
            small:
              'https://storage.alpha-analytics.cz/resize/a58fb3f2-706b-45a5-9fd1-b3e7101e5ad9?ts=1729938317&width=277&height=208&fit=cover&withoutEnlargement=false',
          },
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
        engine: Engine.HYBRID,
        transmission: Transmission.AUTOMATIC,
        driveType: DriveType.REAR_WHEEL_DRIVE,
        doorNumber: 5,
        seatNumber: 5,
        bodyShape: BodyShape.SUV,
        registration: '11/2022',
        consumption: 6.8,
        bodyColor: 'crvena',
        interiorColor: 'crna',
        interiorMaterial: Interior.LEATHER,
        vin: 'WVWZZZ1KZDP987654',
        emission: 115,
        emissionsClass: EmissionClass.EURO_5,
      },
      {
        id: 'c3bd93b2-8727-493c-b3be-c40z42f38de3',
        subject: 'drvo',
        price: 2899,
        description: '20m drva',
        image: [
          {
            id: 'sauce',
            full: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQc9dZn33Wnk-j0sXZ19f8NiMZpJys7nTlA&s',
            small:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQc9dZn33Wnk-j0sXZ19f8NiMZpJys7nTlA&s',
          },
        ],
      }
    ]);

  private _userOfferSubject$: BehaviorSubject<UserOffer[]> =
    new BehaviorSubject<UserOffer[]>([
      {
        objectId: 'sauce',
        id: 'c3bd93b2',
        name: 'nekretnina filip',
        email: 'a@g.c',
        phone: '055796432',
        location: 'Samobor',
        description: 'Opis nekretnine pravo dobar',
        image: [
          {
            id: 'sauce',
            full: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQc9dZn33Wnk-j0sXZ19f8NiMZpJys7nTlA&s',
            small:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQc9dZn33Wnk-j0sXZ19f8NiMZpJys7nTlA&s',
          },
        ],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3bd93b21',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3bd93b12',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3bd9311b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c31bd93b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3b11112d93b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: '12c3bd93b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c43bd93b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3bd934b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: '7c3bd93b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3b7d93b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3bd9377b2',
        name: 'dsa',
        email: 'a@g.c',
        phone: '123',
        location: 'Zagreb',
        description: 'Opise neki',
        image: [],
      },
      {
        objectId: 'c3bd93b2-8727-493c-b3be-c40b42f38de3',
        id: 'c3bd893b2',
        name: 'mirko',
        email: 'markjo@g.c',
        phone: '+3859977903543',
        location: 'Rijeka',
        description: 'Mnoge stvari barem puno vrijedne',
        image: [
          {
            id: 'FBxQy8k',
            full: 'https://i.ibb.co/9q8x1ym/3c588d61fedf.png',
            small: 'https://i.ibb.co/FBxQy8k/3c588d61fedf.png',
          },
          {
            id: 'PY8G6RB',
            full: 'https://i.ibb.co/RSWTD1L/3fea936a9927.png',
            small: 'https://i.ibb.co/PY8G6RB/3fea936a9927.png',
          },
          {
            id: '4M6FqZ37',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ36',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ35',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ34',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ33',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ32',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ31',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ3100000',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ31',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ31',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ31',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ31',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ31',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
          {
            id: '4M6FqZ31',
            full: 'https://i.ibb.co/Dkx1JDT/85848b297f61.png',
            small: 'https://i.ibb.co/4M6FqZ3/85848b297f61.png',
          },
        ],
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

  doesItemExist(id: string): boolean {
    return this._itemSubject$.value.some((item) => item.id === id);
  }
}
