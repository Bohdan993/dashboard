import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../api/auth-api';
import { usersApi } from '../api/users-api';
import type { User } from '../types/user';

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export interface AuthContextValue extends State {
  platform: 'JWT';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // loginMS: (response: any) => Promise<void>;
  loginGoogle: (response: any) => Promise<void>;
  register: (email: string, first_name: string, last_name: string, password: string) => Promise<void>;
  updateUser: (email: string, first_name: string, last_name: string) => Promise<void>;
  updateUserAvatar: (avatar: string) => Promise<void>;
  deleteUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// type GoogleData = {
//   email: string;
//   first_name: string;
//   last_name: string;
// }

enum ActionType {
  INITIALIZE = 'INITIALIZE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_USER_AVATAR = 'UPDATE_USER_AVATAR',
  DELETE_USER = 'DELETE_USER'
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: ActionType.LOGIN;
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: ActionType.LOGOUT;
};

type RegisterAction = {
  type: ActionType.REGISTER;
  payload: {
    user: User;
  };
};

type UpdateUserAction = {
  type: ActionType.UPDATE_USER;
  payload: {
    user: User;
  };
};

type UpdateUserAvatarAction = {
  type: ActionType.UPDATE_USER_AVATAR;
  payload: {
    avatar: string;
  };
};

type DeleteUserAction = {
  type: ActionType.DELETE_USER;
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | UpdateUserAction
  | UpdateUserAvatarAction
  | DeleteUserAction

type Handler = (state: State, action: any) => State;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state: State, action: RegisterAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  UPDATE_USER: (state: State, action: UpdateUserAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      user
    };
  },
  UPDATE_USER_AVATAR: (state: State, action: UpdateUserAvatarAction): State => {
    const { avatar } = action.payload;
    const oldUser: User = state.user!;
    const user = {...oldUser, avatar};
    return {
      ...state,
      user
    };
  },
  DELETE_USER: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'JWT',
  login: () => Promise.resolve(),
  // loginMS: () => Promise.resolve(),
  loginGoogle: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  updateUser: () => Promise.resolve(),
  updateUserAvatar: () => Promise.resolve(),
  deleteUser: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const accessToken = globalThis.localStorage.getItem('accessToken');

        if (accessToken) {
          const user = await authApi.me({ accessToken });

          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: ActionType.INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {


      const { accessToken } = await authApi.login({ email, password });
      const user = await authApi.me({ accessToken });
  
      localStorage.setItem('accessToken', accessToken);
  
      dispatch({
        type: ActionType.LOGIN,
        payload: {
          user
        }
      });


  };

  // const loginMS = async (code: string): Promise<void> => {
  //   const { accessToken } = await authApi.loginMS();
  //   const user = await authApi.me({ accessToken });

  //   localStorage.setItem('accessToken', accessToken);

  //   dispatch({
  //     type: ActionType.LOGIN,
  //     payload: {
  //       user
  //     }
  //   });
  // };

  const loginGoogle = async (code: string): Promise<void> => {

    const { accessToken } = await authApi.loginGoogle(code);
    const user = await authApi.me({ accessToken });

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: ActionType.LOGIN,
      payload: {
        user
      }
    });
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    dispatch({ type: ActionType.LOGOUT });
  };

  const register = async (
    email: string,
    first_name: string,
    last_name: string,
    password: string
  ): Promise<void> => {
    const { accessToken } = await authApi.register({ email, first_name, last_name, password });
    const user = await authApi.me({ accessToken });

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: ActionType.REGISTER,
      payload: {
        user
      }
    });
  };

  const updateUser = async (email: string, first_name: string, last_name: string): Promise<void> => {

    const user = await usersApi.updateUser({
      "email": email,
      "first_name": first_name,
      "last_name": last_name
    });


    dispatch({
      type: ActionType.UPDATE_USER,
      payload: {
        user
      }
    });
  }

  const updateUserAvatar = async (avatar: string): Promise<void> => {

    const user = await usersApi.updateUserAvatar({
      "avatar" : avatar
    });

    const newAvatar = user.avatar;

    dispatch({
      type: ActionType.UPDATE_USER_AVATAR,
      payload: {
        "avatar" : newAvatar
      }
    });
  }

  const deleteUser = async (): Promise<void> => {
    await usersApi.deleteUser();
    localStorage.removeItem('accessToken');
    dispatch({
      type: ActionType.DELETE_USER
    });
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'JWT',
        login,
        logout,
        register,
        // loginMS,
        loginGoogle,
        updateUser,
        updateUserAvatar,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
