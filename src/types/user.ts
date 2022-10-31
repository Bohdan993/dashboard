// export interface User {
//   id: string;
//   avatar?: string;
//   email: string;
//   name: string;

//   [key: string]: any;
// }


export interface User {
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  avatar: string|null;
  is_email_verif: boolean;
  [key: string]: any;
}
