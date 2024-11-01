export interface Car {
    id: string;
    name: string;
    brand: string;
    model: string;
    image: string[];
    price: number;
    mileage?: number;
    productionYear?: string;
    modelYear?: string;
    engineSize?: number;
    location?: string;
    description?: string;
    power?: number;
    engine?: Engine;
    transmission?: Transmission;
}

export enum Engine {
    DIESEL = 'dizel',
    GASOLINE = 'benzin',
    ELECTRIC = 'električni',
    HYBRID = 'hibrid'
}

export enum Transmission {
    MANUAL = 'ručni',
    AUTOMATIC = 'automatski',
}