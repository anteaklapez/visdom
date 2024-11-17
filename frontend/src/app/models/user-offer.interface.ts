import { Image } from "./basic-object.interface";

export interface UserOffer {
    id: string;
    offerId: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    description: string;
    image: Image[];
}