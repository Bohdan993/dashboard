import type { User } from '../types/user';

const baseUrl:string = "http://api.platops.cloud:8001";

type GetUserResponse = Promise<User>;

type UpdateUserRequest = User;

type GetUserRequest = {};

class UsersApi {

    async getUser(request?: GetUserRequest): GetUserResponse {
        const accessToken = localStorage.getItem('accessToken');
    
        return new Promise(async (resolve, reject) => {
          try {
    
            const res = await fetch(`${baseUrl}/users/me`, {
              method: "GET",
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            })
    
            if(!res.ok && res.status!==200)
            {
               throw new Error(String(res.status));
            }
    
            const user: User = await res.json();
    
            if (!user) {
              reject(new Error('Invalid authorization token'));
              return;
            }
    
            resolve(user);
          } catch (err) {
            console.error('[Auth Api]: ', err);
            reject(new Error('Internal server error'));
          }
        });
      }

    async updateUser(user_id: number, request: UpdateUserRequest) : GetUserResponse {
        const { user_name, first_name, last_name } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/users/${user_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'email': user_name,
                    'first_name': first_name,
                    'last_name': last_name
                })
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const user: User = await res.json();
        
                if (!user) {
                    reject(new Error('Виникла помилка при редагуванні користувача'));
                    return;
                }
        
                resolve(user);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateUserAvatar(user_id: number, request: UpdateUserRequest) : GetUserResponse {
        const { avatar } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/users/${user_id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: {
                    'avatar': avatar,
                    }
                })
        
                if(!res.ok && res.status!==200)
                {
                    throw new Error(String(res.status));
                }
        
                const user: User = await res.json();
        
                if (!user) {
                    reject(new Error('Виникла помилка при редагуванні аватару користувача'));
                    return;
                }
        
                resolve(user);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async deleteUser(user_id: number): Promise<void>{
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/users/${user_id}`, {
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
                    reject(new Error('Виникла помилка при видаленні користувача'));
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

export const usersApi = new UsersApi();
