import type { Project } from '../types/project';

const baseUrl:string = "https://my.platops.cloud";

type RegisterResponse = Promise<{
  accessToken: string;
}>;

type GetProjectsResponse = Promise<Project[]>;

type GetProjectsRequest = {};

type GetProjectResponse = Promise<Project>;

type CreateProjectRequest = Project;


class ProjectsApi {

    async createProject(request: CreateProjectRequest, company_id: number) : GetProjectResponse {
        const { name, start_date, end_date, resp_person, summary} = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/projects/create?company_id=${company_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'name': name,
                    'start_date': start_date,
                    'end_date': end_date,
                    'resp_person': resp_person,
                    'summary': summary
                })
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const project: Project = await res.json();
        
                if (!project) {
                    reject(new Error('Виникла помилка при створенні проекту'));
                    return;
                }
        
                resolve(project);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });

    }

    async getProjects(company_id: number, request?: GetProjectsRequest) : GetProjectsResponse {
        const accessToken = localStorage.getItem('accessToken');
        
        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/projects/?company_id=${company_id}`, {
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
        
                const projects: Project[] = await res.json();
        
                if (!projects) {
                    reject(new Error('Список проектів порожній'));
                    return;
                }
        
                resolve(projects);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async getProject(project_id: number, company_id: number) : GetProjectResponse {
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/projects/${project_id}?company_id=${company_id}`, {
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
        
                const project: Project = await res.json();
        
                if (!project) {
                    reject(new Error('Не вдалося завантажити компанію'));
                    return;
                }
        
                resolve(project);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateProject(project_id: number, company_id: number, request: CreateProjectRequest) : GetProjectResponse {
        const { name, start_date, end_date, resp_person, summary} = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/projects/${project_id}?company_id=${company_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'name': name,
                    'start_date': start_date,
                    'end_date': end_date,
                    'resp_person': resp_person,
                    'summary': summary
                })
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const project: Project = await res.json();
        
                if (!project) {
                    reject(new Error('Виникла помилка при редагуванні компанії'));
                    return;
                }
        
                resolve(project);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async deleteProject(project_id: number, company_id: number): Promise<void>{
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/projects/${project_id}?company_id=${company_id}`, {
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
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });

    }



 

}

export const projectsApi = new ProjectsApi();
