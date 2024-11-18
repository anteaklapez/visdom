import { Image } from './basic-object.interface';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  image: Image[];
  price: number;
  type: string;
  mileage?: number;
  productionYear?: string;
  modelYear?: string;
  engineSize?: number;
  location?: string;
  description?: string;
  power?: number;
  engine?: Engine;
  transmission?: Transmission;
  driveType: DriveType;
  doorNumber?: number;
  seatNumber?: number;
  bodyShape: BodyShape;
  registration?: string;
  consumption?: number;
  bodyColor?: string;
  interiorColor?: string;
  interiorMaterial?: Interior;
  vin?: string;
  emission?: number;
  emissionsClass?: EmissionClass;
}

export enum EmissionClass {
  EURO_ZX = 'Euro ZX',
  EURO_1 = 'Euro 1',
  EURO_2 = 'Euro 2',
  EURO_3 = 'Euro 3',
  EURO_4 = 'Euro 4',
  EURO_5 = 'Euro 5',
  EURO_6 = 'Euro 6',
}

export enum Interior {
  LEATHER = 'Kožna',
  LENIN = 'Platnena',
  LEATHER_AND_LENIN = 'Kožna i platnena',
}

export enum BodyShape {
  SEDAN = 'Limuzina',
  CARAVAN = 'Karavan',
  MONO = 'Monovolumen',
  HATCHBACK = 'Hatchback',
  CABRIO = 'Kabriolet',
  COUPE = 'Coupe',
  SUV = 'Terensko vozilo / SUV',
  COMBI = 'Kombibus',
}

export enum DriveType {
  FRONT_WHEEL_DRIVE = 'Prednji',
  REAR_WHEEL_DRIVE = 'Stražnji',
  FOUR_WHEEL_DRIVE = '4x4',
}

export enum Engine {
  DIESEL = 'Dizel',
  GASOLINE = 'Benzin',
  ELECTRIC = 'Električni',
  HYBRID = 'Hibrid',
}

export enum Transmission {
  MANUAL = 'Ručni',
  AUTOMATIC = 'Automatski',
}
