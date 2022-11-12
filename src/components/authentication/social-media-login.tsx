import type { FC } from 'react';
import { useState } from 'react';
import { AuthError, UserAgentApplication } from "msal";
import { useRouter } from 'next/router';
import { Box, Button} from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import { Google as GoogleIcon } from '../../icons/google';
import { Microsoft as MicrosoftIcon } from '../../icons/microsoft';
import { useGoogleLogin } from '@react-oauth/google';
import MicrosoftLogin from "react-microsoft-login";
import { useDispatch, useSelector } from '../../store';
import { getLoginLoading, getAuthMethod } from '../../thunks/app';

const baseUrl: string = 'https://my.platops.cloud/';


export const SocialMediaLogin: FC = (props) => {
  const dispatch = useDispatch();
  const isMounted = useMounted();
  const router = useRouter();
  const { loginMS, loginGoogle } = useAuth();
  const { isLoginLoading } = useSelector((state) => state.app);

  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      try {
        dispatch(getLoginLoading({isLoginLoading: true}));
        await loginGoogle(codeResponse?.code);
        if (isMounted()) {
            dispatch(getAuthMethod({
              auth: {
                authMethod: 'google'
              }
            }));
            const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
            router.push(returnUrl).catch(console.error);
        }
      } catch(err) {
        dispatch(getLoginLoading({isLoginLoading: false}));
        console.error(err);
      }

    },
    flow: 'auth-code'
  });

  const login2 = async (err: AuthError | null, data: any, msal: UserAgentApplication | undefined): Promise<void> =>  {
    try {
      dispatch(getLoginLoading({isLoginLoading: true}));
      console.log(data, err);
      if(err) { throw err };
      await loginMS(data);
      if (isMounted()) {
          dispatch(getAuthMethod({
            auth: {
              authMethod: 'microsoft',
              authInstance: msal
            }
          }));
          const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
          router.push(returnUrl).catch(console.error);
      }

    } catch(err) {
      dispatch(getLoginLoading({isLoginLoading: false}));
      console.error(err);
    }
  };


  return (
    <div
      {...props}
    >
      <Box sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        }}>
        <Button
          disabled={isLoginLoading}
          size="small"
          type="button"
          variant="text"
          sx={{mr: 2}}
          onClick={login}
        >
          <GoogleIcon/>
        </Button>
        <MicrosoftLogin 
          clientId={'507dbab6-053a-4025-abb5-02f5df7e04cb'} 
          authCallback={login2}
          redirectUri={`https://localhost:8001/auth/azure-callback`}
          children={ 
          <Button
            disabled={isLoginLoading}
            size="small"
            type="button"
            variant="text"
          >
            <MicrosoftIcon/>
          </Button>}
        />
      </Box>
    </div>
  );
};
