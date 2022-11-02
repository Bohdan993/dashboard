import type { FC } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, FormHelperText, TextField } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import { Google as GoogleIcon } from '../../icons/google';
import { Microsoft as MicrosoftIcon } from '../../icons/microsoft';
import { useGoogleLogin } from '@react-oauth/google';
// import GoogleLogin from 'react-google-login';
// import { gapi } from "gapi-script";



type GoogleData = {
  email: string;
  first_name: string;
  last_name: string;
}

export const SocialMediaLogin: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { loginMS, loginGoogle } = useAuth();

  const login = useGoogleLogin({
    onSuccess: codeResponse => loginGoogle(codeResponse),
    flow: 'auth-code',
  });

  const onClick = async (type: 'microsoft' | 'google', e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    try {
        if(type === 'google') {
            await loginGoogle();
        } else {
            await loginMS();
        }

        if (isMounted()) {
            const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
            router.push(returnUrl).catch(console.error);
        }
    } catch(err) {
      console.error(err);
    }
  }

  
  const onGoogleLoginFailure = (response: any) => {
    console.log(response);
  }

  // useEffect(() => {
  //   function start() {
  //     gapi.auth2.init({
  //       client_id: "1030243889898-4e6dm149nqvst7ru154gmbfh05sc4c6f.apps.googleusercontent.com"
  //     })
  //   }
  //   gapi.load('auth2', start)
  // }, [])

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
        {/* <GoogleLogin
            clientId="1030243889898-4e6dm149nqvst7ru154gmbfh05sc4c6f.apps.googleusercontent.com"
            render={renderProps => (

            )}
            buttonText="Login"
            onSuccess={loginGoogle}
            onFailure={onGoogleLoginFailure}
            cookiePolicy={'single_host_origin'}
        /> */}
        <Button
          disabled={false}
          size="small"
          type="button"
          variant="text"
          sx={{mr: 2}}
          onClick={() => login()}
        >
          <GoogleIcon/>
        </Button>
        <Button
          disabled={false}
          size="small"
          type="button"
          variant="text"
          onClick={(e)=>onClick('microsoft', e)}
        >
          <MicrosoftIcon/>
        </Button>
      </Box>
    </div>
  );
};
