import type { FC } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';
import { useDispatch, useSelector } from '../../store';
import { getLoginLoading, getAuthMethod } from '../../thunks/app';

export const JWTLogin: FC = (props) => {
  const dispatch = useDispatch();
  const isMounted = useMounted();
  const router = useRouter();
  const { login } = useAuth();
  const { isLoginLoading } = useSelector((state) => state.app);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        dispatch(getLoginLoading({isLoginLoading: true}));
        await login(values.email, values.password);

        if (isMounted()) {
          dispatch(getAuthMethod({
            auth: {
              authMethod: 'email'
            }
          }));
          const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
          router.push(returnUrl).catch(console.error);
        }
      } catch (err) {
        console.error(err);
        if (isMounted()) {
          dispatch(getLoginLoading({isLoginLoading: false}));
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });


  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <TextField
        autoFocus
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        helperText={formik.touched.email && formik.errors.email}
        label="Email Address"
        margin="normal"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
      />
      <TextField
        error={Boolean(formik.touched.password && formik.errors.password)}
        fullWidth
        helperText={formik.touched.password && formik.errors.password}
        label="Password"
        margin="normal"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="password"
        value={formik.values.password}
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>
            {formik.errors.submit as string}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          disabled={isLoginLoading}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Log In
        </Button>
      </Box>
    </form>
  );
};
