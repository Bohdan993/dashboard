import type { Contact } from '../types/contact';

const baseUrl:string = "https://my.platops.cloud";

type GetContactsResponse = Promise<Contact[]>;

type GetContactsRequest = {};

type GetContactResponse = Promise<Contact>;

type CreateContactRequest = Contact;


class ContactsApi {

    async createContact(request: CreateContactRequest, company_id: number) : GetContactResponse {
        const { type, name, email, phone_num, address_1, address_2, city, state, country, zip } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/contacts/add?company_id=${company_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'type': type,
                    'name': name,
                    'email': email,
                    'phone_num': phone_num,
                    'address_1': address_1,
                    'address_2': address_2,
                    'city': city,
                    'state': state,
                    'country': country,
                    'zip': zip
                })
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const contact: Contact = await res.json();
        
                if (!contact) {
                    reject(new Error('Виникла помилка при створенні контакту'));
                    return;
                }
        
                resolve(contact);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });

    }

    async getContacts(company_id: number, request?: GetContactsRequest) : GetContactsResponse {
        const accessToken = localStorage.getItem('accessToken');
        
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/contacts/list?company_id=${company_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const contacts: Contact[] = await res.json();
        
                if (!contacts) {
                    reject(new Error('Список контактів порожній'));
                    return;
                }
        
                resolve(contacts);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async getContact(contact_id: number, company_id: number) : GetContactResponse {
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/contacts/${contact_id}?company_id=${company_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const contact: Contact = await res.json();
        
                if (!contact) {
                    reject(new Error('Не вдалося завантажити контакт'));
                    return;
                }
        
                resolve(contact);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateContact(contact_id: number, company_id: number, request: CreateContactRequest) : GetContactResponse {
        const { type, name, email, phone_num, address_1, address_2, city, state, country, zip } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/contacts/update${contact_id}?company_id=${company_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'type': type,
                    'name': name,
                    'email': email,
                    'phone_num': phone_num,
                    'address_1': address_1,
                    'address_2': address_2,
                    'city': city,
                    'state': state,
                    'country': country,
                    'zip': zip
                })
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const contact: Contact = await res.json();
        
                if (!contact) {
                    reject(new Error('Виникла помилка при редагуванні контакту'));
                    return;
                }
        
                resolve(contact);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async deleteContact(contact_id: number, company_id: number,): Promise<void>{
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/contacts/${contact_id}?company_id=${company_id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const json: {msg: number; detail: string} = await res.json();
        
                if (!json) {
                    reject(new Error('Виникла помилка при видаленні контакту'));
                    return;
                }
        
                resolve();

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });

    }



 

}

export const contactsApi = new ContactsApi();
