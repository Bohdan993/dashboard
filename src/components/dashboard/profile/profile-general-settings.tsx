import type { FC, MouseEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from '../../../store';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { UserCircle as UserCircleIcon } from '../../../icons/user-circle';
import { updateUser } from '../../../thunks/user';

export const ProfileGeneralSettings: FC = (props) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    name: 'Anika Visser'
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().max(255).required(),
      first_name: Yup.string().max(255).required(),
      last_name: Yup.string().max(255).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await dispatch(updateUser({
            "email": values.email, 
            "first_name": values.first_name, 
            "last_name": values.last_name
        }))
        toast.success('Profile updated!');
        router.push('/dashboard').catch(console.error);
        
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>): void => {
      setShow(true);
  }

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <Box
        sx={{ mt: 4 }}
      >
        <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={4}
                xs={12}
              >
                <Typography variant="h6">
                  Basic details
                </Typography>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    sx={{
                      height: 64,
                      mr: 2,
                      width: 64
                    }}
                  >
                    <UserCircleIcon fontSize="small" />
                  </Avatar>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 3,
                    alignItems: 'center'
                  }}
                >
                  <TextField
                    label="Email Address"
                    required
                    size="small"
                    sx={{
                      flexGrow: 1,
                      mr: 3,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed'
                      }
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 3,
                    alignItems: 'center'
                  }}
                >
                  <TextField
                    error={Boolean(formik.touched.first_name && formik.errors.first_name)}
                    fullWidth
                    helperText={formik.touched.first_name && formik.errors.first_name}
                    label="First Name"
                    name="first_name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    size="small"
                    sx={{
                      flexGrow: 1,
                      mr: 3
                    }}
                    value={formik.values.first_name}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 3,
                    alignItems: 'center'
                  }}
                >
                  <TextField
                    error={Boolean(formik.touched.last_name && formik.errors.last_name)}
                    fullWidth
                    helperText={formik.touched.last_name && formik.errors.last_name}
                    label="Last Name"
                    name="last_name"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    size="small"
                    sx={{
                      flexGrow: 1,
                      mr: 3
                    }}
                    value={formik.values.last_name}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              mx: -1,
              mb: -1,
              mt: 3
            }}
          >
            <Button
              color="error"
              onClick={handleDelete}
              sx={{
                m: 1,
                mr: 'auto'
              }}
            >
              Delete
            </Button>
            <NextLink
              href="/dashboard"
              passHref
            >
              <Button
                component="a"
                sx={{
                  m: 1
                }}
                variant="outlined"
              >
                Cancel
              </Button>
            </NextLink>
            <Button
              sx={{ m: 1 }}
              type="submit"
              variant="contained"
            >
              Update
            </Button>
          </Box>
      </Box>
    </form>
  );
};
