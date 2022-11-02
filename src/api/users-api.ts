import type { User } from '../types/user';

const baseUrl:string = "http://api.platops.cloud:8001";

type RegisterResponse = Promise<{
  accessToken: string;
}>;

type GetUsersResponse = Promise<User[]>;

type GetUsersRequest = {};

type GetUserResponse = Promise<User>;

type CreateUserRequest = User;


class UsersApi {

    async updateUser(user_id: number, request: CreateUserRequest) : GetUserResponse {
        const { user_name, address_1, address_2, city, state, country, zip } = request;
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
                    'user_name': user_name,
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
        
                const user: User = await res.json();
        
                if (!user) {
                    reject(new Error('Виникла помилка при редагуванні компанії'));
                    return;
                }
        
                resolve(user);

            } catch (err) {
                console.error('[Auth Api]: ', err);
                reject(new Error('Internal server error'));
            }
        });
    }

    async updateUserAvatar(user_id: number, request: CreateUserRequest) : GetUserResponse {
        const { user_name, address_1, address_2, city, state, country, zip } = request;
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
                    'user_name': user_name,
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
        
                const user: User = await res.json();
        
                if (!user) {
                    reject(new Error('Виникла помилка при редагуванні компанії'));
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

export const usersApi = new UsersApi();
