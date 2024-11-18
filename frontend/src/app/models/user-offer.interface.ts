import { Image } from "./basic-object.interface";

export interface UserOffer {
    id: string;
    objectId: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    description: string;
    image: Image[];
}