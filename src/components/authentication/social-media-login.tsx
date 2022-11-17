import type { FC} from 'react';
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
import {
  serializeFunction
} from '../../utils/serialize-func';

const baseUrl: string = 'https://my.platops.cloud/';


export const SocialMediaLogin: FC = (props) => {
  const dispatch = useDispatch();
  const isMounted = useMounted();
  const router = useRouter();
  const { loginMS, loginGoogle } = useAuth();
  const { isLoginLoading } = useSelector((state) => state.app);
  const { auth } = useSelector((state) => state.app);

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

  const login2  = async (err: AuthError | null, data: any, msal: UserAgentApplication | undefined): Promise<void> => {
      console.log('DATA', data);
      console.log('MSALInstance', msal)
      try {
        dispatch(getLoginLoading({isLoginLoading: true}));
        if(err) { throw err };
        // await loginMS(data);
        if (isMounted()) {
          dispatch(getAuthMethod({
            auth: {
              authMethod: 'microsoft',
              authInstance: {
                logout: serializeFunction(msal?.logout.bind(msal))
              }
            }
          }));
          // const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
          // router.push(returnUrl).catch(console.error);
        }
      } catch(err) {
        window.sessionStorage.clear();
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
          variant="text"
          sx={{mr: 2}}
          onClick={login}
          href="#"
        >
          <GoogleIcon/>
        </Button>
        <MicrosoftLogin 
          clientId={'e9f6bb29-8d1c-4edf-b4dc-f6fad1c34b33'} 
          authCallback={auth?.authMethod === 'microsoft' ?  () => {} : login2}
          redirectUri={`http://localhost:3000/redirect.html`}
          // debug={true}
          // @ts-ignore
          children={ 
          <Button
            disabled={isLoginLoading}
            size="small"
            variant="text"
            href="#"
          >
            <MicrosoftIcon/>
          </Button>}
        />

      </Box>
    </div>
  );
};
