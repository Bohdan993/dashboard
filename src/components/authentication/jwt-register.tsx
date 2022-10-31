import type { FC } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Checkbox, FormHelperText, Link, TextField, Typography } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';

export const JWTRegister: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { register } = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      policy: false,
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      first_name: Yup
        .string()
        .max(255)
        .required('First Name is required'),
      last_name: Yup
        .string()
        .max(255)
        .required('Last Name is required'),
      password: Yup
        .string()
        .min(6)
        .max(255)
        .required('Password is required'),
      policy: Yup
        .boolean()
        .oneOf([true], 'This field must be checked')
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await register(values.email, values.first_name, values.last_name, values.password);

        if (isMounted()) {
          const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
          router.push(returnUrl).catch(console.error);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
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
        error={Boolean(formik.touched.first_name && formik.errors.first_name)}
        fullWidth
        helperText={formik.touched.first_name && formik.errors.first_name}
        label="First Name"
        margin="normal"
        name="first_name"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.first_name}
      />
      <TextField
        error={Boolean(formik.touched.last_name && formik.errors.last_name)}
        fullWidth
        helperText={formik.touched.last_name && formik.errors.last_name}
        label="Last Name"
        margin="normal"
        name="last_name"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values.last_name}
      />
      <TextField
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
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          ml: -1,
          mt: 2
        }}
      >
        <Checkbox
          checked={formik.values.policy}
          name="policy"
          onChange={formik.handleChange}
        />
        <Typography
          color="textSecondary"
          variant="body2"
        >
          I have read the
          {' '}
          <Link
            component="a"
            href="#"
          >
            Terms and Conditions
          </Link>
        </Typography>
      </Box>
      {Boolean(formik.touched.policy && formik.errors.policy) && (
        <FormHelperText error>
          {formik.errors.policy}
        </FormHelperText>
      )}
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>
            {formik.errors.submit as string}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Register
        </Button>
      </Box>
    </form>
  );
};
