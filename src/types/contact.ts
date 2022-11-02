export interface Contact {
    type: string;
    name: string;
    email: string;
    phone_num: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    id?: number;
    company?: {
        id: number;
    };
}
  