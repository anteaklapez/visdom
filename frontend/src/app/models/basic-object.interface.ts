export interface BasicObject {
    id: string;
    subject: string;
    price: number;
    description: string;
    images: Image[];
}

export interface Image {
    id: string;
    full: string;
    small: string;
}