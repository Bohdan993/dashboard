import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface AuthMethod {
    authMethod: 'google' | 'microsoft' | 'email' | null,
    authInstance?: object
} 

interface AppState {
  isLoginLoading: boolean,
  auth: AuthMethod
}

const initialState: AppState = {
    isLoginLoading: false,
    auth: {
        authMethod: null
    }
};

export const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    getLoginLoading(
      state: AppState,
      action: PayloadAction<boolean>
    ): void {
      state.isLoginLoading = action.payload;
    },
    getAuthMethod(
        state: AppState,
        action: PayloadAction<AuthMethod>
    ): void {
        state.auth = action.payload;
    }
  }
});

export const { reducer } = slice;
