import type { Project } from '../types/project';

const baseUrl:string = "http://api.platops.cloud:8001";

type RegisterResponse = Promise<{
  accessToken: string;
}>;

type GetCompaniesResponse = Promise<Project[]>;

type GetCompaniesRequest = {};

type GetProjectResponse = Promise<Project>;

type CreateProjectRequest = Project;


class CompaniesApi {

    async createProject(request: CreateProjectRequest) : GetProjectResponse {
        const { project_name, address_1, address_2, city, state, country, zip } = request;

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    'project_name': project_name,
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
        
                const Project: Project = await res.json();
        
                if (!Project) {
                    reject(new Error('Виникла помилка при створенні компанії'));
                    return;
                }
        
                resolve(Project);

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
        
                const companies: Project[] = await res.json();
        
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

    async getProject(Project_id: number) : GetProjectResponse {

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/companies/${Project_id}`, {
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
        
                const Project: Project = await res.json();
        
                if (!Project) {
                    reject(new Error('Не вдалося завантажити компанію'));
                    return;
                }
        
                resolve(Project);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateProject(Project_id: number, request: CreateProjectRequest){

    }

    async deleteProject(Project_id: number): Promise<void>{


    }



 

}

export const companiesApi = new CompaniesApi();
