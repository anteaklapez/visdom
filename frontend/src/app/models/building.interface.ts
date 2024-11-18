import { Image } from "./basic-object.interface";

export interface Building {
  id: string;
  location: string;
  title: string;
  price: number;
  image: Image[];
  roomNumber?: number;
  buildingArea?: number;
  gardenArea?: number;
  buildYear?: string;
  buildingType?: BuildingType;
  description?: string;
  floors?: Floors;
  bathroomNumber?: number;
}

export enum Floors {
  BASE_FLOOR = 'Prizemnica',
  HIGH_FLOOR = 'Visoka prizemnica',
  ONE_FLOOR = 'Katnica',
  TWO_FLOOR = 'Dvokatnica',
  MULTY_FLOOR = 'Višekatnica'
}

export enum BuildingType {
  DETACHED_HOUSE = 'Samostojeća kuća',
  SEMI_DETACHED_HOUSE = 'Dvojna kuća (poluugrađena)',
  TERRACED_HOUSE = 'Kuća u nizu',
  VILLA = 'Vila',
  APARTMENT_HOUSE = 'Apartmanska kuća',
  COTTAGE = 'Vikendica',
  TWO_STORY_HOUSE = 'Katnica',
  SINGLE_STORY_HOUSE = 'Prizemnica',
  HOUSE_WITH_ATTIC = 'Kuća s potkrovljem',
  TWO_LEVEL_HOUSE = 'Kuća na kat',
  LUXURY_VILLA = 'Luksuzna vila',
  RURAL_HOUSE = 'Ruralna kuća (seoska kuća)',
  PREFAB_HOUSE = 'Montažna kuća',
  WOODEN_HOUSE = 'Drvena kuća',
  STONE_HOUSE = 'Kamena kuća',
  URBAN_VILLA = 'Urbana vila',
  TWO_FLOOR_HOUSE = 'Dvokatnica',
  SMART_HOME = 'Pametna kuća (smart home)',
  MULTI_UNIT_BUILDING = 'Zgrada s više stambenih jedinica',
  SEASIDE_HOUSE = 'Kuća na obali',
  LOFT_HOUSE = 'Loft kuća',
  FLAT_ROOF_HOUSE = 'Kuća s ravnim krovom',
  HOUSE_WITH_POOL = 'Kuća s bazenom',
}
