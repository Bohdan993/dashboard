import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { GuestGuard } from '../components/authentication/guest-guard';
import { JWTLogin } from '../components/authentication/jwt-login';
import { SocialMediaLogin } from '../components/authentication/social-media-login';
import { Logo } from '../components/logo';
import { useAuth } from '../hooks/use-auth';


type Platform = 'Amplify' | 'Auth0' | 'Firebase' | 'JWT';


const Login: NextPage = () => {
  const router = useRouter();
  const { platform }: { platform: Platform } = useAuth();
  const { disableGuard } = router.query;


  return (
    <>
      <Head>
        <title>
          Login | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px'
            }
          }}
        >
          <Card
            elevation={16}
            sx={{ p: 4 }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">
                Log in
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ mt: 2 }}
                variant="body2"
              >
                Sign in on the internal platform
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              {platform === 'JWT' && <JWTLogin />}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography
                color="textSecondary"
                variant="body2"
              >
                Or via
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              <SocialMediaLogin/>
            </Box>
            <Divider sx={{ my: 3 }} />
            <div>
              <NextLink
                href={
                  disableGuard
                    ? `/register?disableGuard=${disableGuard}`
                    : '/register'
                }
                passHref
              >
                <Link
                  color="textSecondary"
                  variant="body2"
                >
                  Create new account
                </Link>
              </NextLink>
            </div>
            {platform === 'Amplify' && (
              <Box sx={{ mt: 1 }}>
                <NextLink
                  href={
                    disableGuard
                      ? `/authentication/password-recovery?disableGuard=${disableGuard}`
                      : '/authentication/password-recovery'
                  }
                  passHref
                >
                  <Link
                    color="textSecondary"
                    variant="body2"
                  >
                    Forgot password
                  </Link>
                </NextLink>
              </Box>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default Login;
