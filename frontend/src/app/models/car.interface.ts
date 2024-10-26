export interface Car {
    name: string;
    model: string;
    brand: string;
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

enum Engine {
    DIESEL = 'dizel',
    GASOLINE = 'benzin',
    ELECTRIC = 'električni',
    HYBRID = 'hibrid'
}

enum Transmission {
    MANUAL = 'ručni',
    AUTOMATIC = 'automatik',
}