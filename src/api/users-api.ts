import type { User } from '../types/user';
import {UnauthorizedError} from '../utils/unauthorized-error';

const baseUrl:string = "https://my.platops.cloud";

type GetUserResponse = Promise<User>;

type UpdateUserRequest = {
    email: string;
    first_name: string;
    last_name: string;
};

type UpdateUserAvatarRequest = {
    avatar: string;
};

class UsersApi {

    async updateUser(request: UpdateUserRequest) : GetUserResponse {
        const { email, first_name, last_name } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/users/me/update`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    'email': email,
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

    async updateUserAvatar(request: UpdateUserAvatarRequest) : GetUserResponse {
        const { avatar } = request;
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const formData  = new FormData();
                formData.append("avatar", avatar);

                const res = await fetch(`${baseUrl}/users/me/update-avatar`, {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData
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

    async deleteUser(): Promise<void>{
        const accessToken = localStorage.getItem('accessToken');

        return new Promise(async (resolve, reject) => {
            try {
                const res = await fetch(`${baseUrl}/users/delete`, {
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

export const usersApi = new UsersApi();
