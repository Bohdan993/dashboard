import type { User } from '../types/user';


const baseUrl:string = "http://api.platops.cloud:8001";

type GoogleData = {
  email: string;
  first_name: string;
  last_name: string;
}

type TokenData = {
  access_token: string;
  token_type: string;
}

type LoginRequest = {
  email: string;
  password: string;
}

type LoginResponse = Promise<{
  accessToken: string;
}>;

type RegisterRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

type RegisterResponse = Promise<{
  accessToken: string;
}>;

type MeRequest = {
  accessToken: string
};

type MeResponse = Promise<User>;

class AuthApi {
  async login(request: LoginRequest): LoginResponse {
    const { email, password } = request;

    return new Promise(async (resolve, reject) => {
      try {

        const res = await fetch(`${baseUrl}/auth/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            'email': email,
            'password': password
          })
        })

        if(!res.ok && res.status!==200)
        {
           throw new Error(String(res.status));
        }

        const data: TokenData = await res.json();

        if (!data) {
          reject(new Error('Логін та/або пароль введено не вірно.'));
          return;
        }

        resolve({ accessToken: data.access_token });
      } catch (err) {
        if(err?.message == 401) {
            console.error('[Auth Api]: ', err);
            reject(new Error('Логін та/або пароль введено не вірно.'));
        } 
        else {
            console.error('[Auth Api]: ', err);
            reject(new Error('Internal server error'));
        } 
      }
    });
  }

  async loginMS(): LoginResponse {

    return new Promise(async (resolve, reject) => {
      try {        
        const res = await fetch(`${baseUrl}/auth/login-microsoft`, {
          method: "GET",
          headers: {
            'accept': 'application/json'
          },
        })

        const data: TokenData = await res.json();

        if (!data) {
          reject(new Error('Please check your email and password'));
          return;
        }

        resolve({ accessToken: data.access_token });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async validateTokenAndObtainSession ({ data, idToken }: {data: GoogleData; idToken: string}): LoginResponse {

    return new Promise(async (resolve, reject) => {
      try {      
        const headers = {
          Authorization: idToken,
          'Content-Type': 'application/json'
        };

        const res = await fetch(`${baseUrl}/auth/login-google`, {
          method: "POST",
          headers,
          body: JSON.stringify(data)
        })

        const token: TokenData = await res.json();

        if (!data) {
          reject(new Error('Please check your email and password'));
          return;
        }

        resolve({ accessToken: token.access_token });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });

  };

  async loginGoogle({idToken, data}: {data: GoogleData; idToken: string}): LoginResponse {

    let _this = this;

    return new Promise(async (resolve, reject) => {
      try {

        const { accessToken } = await _this.validateTokenAndObtainSession({data, idToken});

        if (!accessToken) {
          reject(new Error('Please check your email and password'));
          return;
        }

        resolve({ accessToken });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async register(request: RegisterRequest): RegisterResponse {
    const { email, first_name, last_name, password } = request;

    return new Promise(async (resolve, reject) => {
      try {
        // Check if a user already exists
        const res = await fetch(`${baseUrl}/auth/register`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          },
          body: JSON.stringify({
            'email': email,
            'password_hash': password,
            'first_name': first_name,
            'last_name': last_name
          })
        })

        if(!res.ok && res.status!==200)
        {
          const err = await res.json();
          throw new Error(String(err?.detail));
        }

        const data: TokenData = await res.json();

        if (!data) {
          reject(new Error('Заповніть всі поля правильно.'));
          return;
        }

        resolve({ accessToken: data.access_token });
      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error(err?.message));
      }
    });
  }

  me(request: MeRequest): MeResponse {
    const { accessToken } = request;

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
}

export const authApi = new AuthApi();
