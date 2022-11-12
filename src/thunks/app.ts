import { slice } from '../slices/app';
import { AppThunk } from '../store';

type GetLoginLoadingParams = {
    isLoginLoading: boolean;
};

export const getLoginLoading = (params: GetLoginLoadingParams): AppThunk => (dispatch): void => {
    dispatch(slice.actions.getLoginLoading(params.isLoginLoading));
};

interface AuthMethod {
    authMethod: 'google' | 'microsoft' | 'email' | null,
    authInstance?: object
} 

type GetAuthMethodParams = {
    auth: AuthMethod;
};

export const getAuthMethod = (params: GetAuthMethodParams): AppThunk => (dispatch): void => {
    dispatch(slice.actions.getAuthMethod(params.auth));
};      