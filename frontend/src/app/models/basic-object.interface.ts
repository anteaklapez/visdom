export interface BasicObject {
    id: string;
    subject: string;
    price: number;
    description: string;
    image: Image[];
}

export interface Image {
    id: string;
    full: string;
    small: string;
}