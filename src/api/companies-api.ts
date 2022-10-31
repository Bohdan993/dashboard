import type { Company } from '../types/company';

const baseUrl:string = "http://api.platops.cloud:8001";

type RegisterResponse = Promise<{
  accessToken: string;
}>;

type GetCompaniesResponse = Promise<Company[]>;

type GetCompaniesRequest = {};

type GetCompanyResponse = Promise<Company>;

type CreateCompanyRequest = Company;


class CompaniesApi {

    async createCompany(request: CreateCompanyRequest) : GetCompanyResponse {
        const { company_name, address_1, address_2, city, state, country, zip } = request;

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
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
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });

    }

    async getCompanies(request?: GetCompaniesRequest) : GetCompaniesResponse {

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/list`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
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
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async getCompany(company_id: number) : GetCompanyResponse {

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/${company_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
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
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateCompany(company_id: number, request: CreateCompanyRequest){

    }

    async deleteCompany(company_id: number): Promise<void>{


    }



 

}

export const companiesApi = new CompaniesApi();
