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


export const SocialMediaLogin: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { loginMS, loginGoogle } = useAuth();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const login = useGoogleLogin({
    onSuccess: async codeResponse => {
      try {
        setLoggedIn(true);
        await loginGoogle(codeResponse?.code);
        if (isMounted()) {
            const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
            router.push(returnUrl).catch(console.error);
        }
      } catch(err) {
        setLoggedIn(false);
        console.error(err);
      }

    },
    flow: 'auth-code'
  });

  const login2 = async (err: AuthError | null, data: any, msal: UserAgentApplication | undefined): Promise<void> =>  {
    try {
      setLoggedIn(true);
      console.log(data, err);
      if(err) { throw err };
      await loginMS(data);
      if (isMounted()) {
          const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
          router.push(returnUrl).catch(console.error);
      }

    } catch(err) {
      setLoggedIn(false);
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
          disabled={loggedIn}
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
          redirectUri={'https://localhost:8001/auth/azure-callback'}
          children={ 
          <Button
            disabled={loggedIn}
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
