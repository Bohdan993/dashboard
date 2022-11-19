import type { Company } from '../types/company';
import {UnauthorizedError} from '../utils/unauthorized-error';
const baseUrl:string = "https://my.platops.cloud";

type GetCompaniesResponse = Promise<Company[]>;

type GetCompaniesRequest = {};

type GetCompanyResponse = Promise<Company>;

type CreateCompanyRequest = Company;


class CompaniesApi {

    async createCompany(request: CreateCompanyRequest) : GetCompanyResponse {
        const { company_name, address_1, address_2, city, state, country, zip } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'company_name': company_name,
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
        
                const company: Company = await res.json();
        
                if (!company) {
                    reject(new Error('Виникла помилка при створенні компанії'));
                    return;
                }
        
                resolve(company);

            } catch (err) {
                if(err.message === "403") {
                    console.error('[Invalid token or expired token]: ', err);
                    reject(new UnauthorizedError(err.message));
                } else {
                    console.error('[Auth Api]: ', err);
                    reject(new Error('Internal server error'));
                }

            }
        });

    }

    async getCompanies(request?: GetCompaniesRequest) : GetCompaniesResponse {
        const accessToken = localStorage.getItem('accessToken');
        
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/list`, {
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
        
                const companies: Company[] = await res.json();
        
                if (!companies) {
                    reject(new Error('Список компаній порожній'));
                    return;
                }
        
                resolve(companies);

            } catch (err) {
                if(err.message === "403") {
                    console.error('[Invalid token or expired token]: ', err);
                    reject(new UnauthorizedError(err.message));
                } else {
                    console.error('[Auth Api]: ', err);
                    reject(new Error('Internal server error'));
                }
            }
        });
    }

    async getCompany(company_id: number) : GetCompanyResponse {
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/${company_id}`, {
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
        
                const company: Company = await res.json();
        
                if (!company) {
                    reject(new Error('Не вдалося завантажити компанію'));
                    return;
                }
        
                resolve(company);

            } catch (err) {
                if(err.message === "403") {
                    console.error('[Invalid token or expired token]: ', err);
                    reject(new UnauthorizedError(err.message));
                } else {
                    console.error('[Auth Api]: ', err);
                    reject(new Error('Internal server error'));
                }
            }
        });
    }

    async updateCompany(company_id: number, request: CreateCompanyRequest) : GetCompanyResponse {
        const { company_name, address_1, address_2, city, state, country, zip } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/${company_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'company_name': company_name,
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
        
                const company: Company = await res.json();
        
                if (!company) {
                    reject(new Error('Виникла помилка при редагуванні компанії'));
                    return;
                }
        
                resolve(company);

            } catch (err) {
                if(err.message === "403") {
                    console.error('[Invalid token or expired token]: ', err);
                    reject(new UnauthorizedError(err.message));
                } else {
                    console.error('[Auth Api]: ', err);
                    reject(new Error('Internal server error'));
                }
            }
        });
    }

    async deleteCompany(company_id: number): Promise<void>{
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/${company_id}`, {
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
                    reject(new Error('Виникла помилка при видаленні компанії'));
                    return;
                }
        
                resolve();

            } catch (err) {
                if(err.message === "403") {
                    console.error('[Invalid token or expired token]: ', err);
                    reject(new UnauthorizedError(err.message));
                } else {
                    console.error('[Auth Api]: ', err);
                    reject(new Error('Internal server error'));
                }
            }
        });

    }



 

}

export const companiesApi = new CompaniesApi();
