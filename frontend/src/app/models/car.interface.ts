import { Image } from './basic-object.interface';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  images: Image[];
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
  SEDAN = 'limuzina',
  CARAVAN = 'karavan',
  MONO = 'monovolumen',
  HATCHBACK = 'hatchback',
  CABRIO = 'kabriolet',
  COUPE = 'coupe',
  SUV = 'terensko vozilo / SUV',
  COMBI = 'kombibus',
}

export enum DriveType {
  FRONT_WHEEL_DRIVE = 'prednji',
  REAR_WHEEL_DRIVE = 'stražnji',
  FOUR_WHEEL_DRIVE = '4x4',
}

export enum Engine {
  DIESEL = 'dizel',
  GASOLINE = 'benzin',
  ELECTRIC = 'električni',
  HYBRID = 'hibrid',
}

export enum Transmission {
  MANUAL = 'ručni',
  AUTOMATIC = 'automatski',
}
