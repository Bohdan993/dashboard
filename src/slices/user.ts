import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../types/user';

interface UserState {
  user: User | null;
}

const initialState: UserState = {
    user: null
};

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser(
      state: UserState,
      action: PayloadAction<User>
    ): void {
      state.user = action.payload;
    },
    updateUser(
      state: UserState,
      action: PayloadAction<User>
    ): void {
      const user = action.payload;

      state.user = user;
    },
    updateUserAvatar(
        state: UserState,
        action: PayloadAction<User>
      ): void {
        const user = action.payload;
  
        state.user!.avatar = user.avatar;
      },
    deleteUser(
      state: UserState
    ): void {
      state.user = null;
    }
  }
});

export const { reducer } = slice;
