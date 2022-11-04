import type { FC } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useDispatch } from '../../../store';
import { createCompany } from '../../../thunks/company';


export const CompanyCreateForm: FC = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      company_name: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      submit: null
    },
    validationSchema: Yup.object({
      company_name: Yup.string().max(255).required(),
      address_1: Yup.string().max(255).required(),
      address_2: Yup.string().max(255).required(),
      city: Yup.string().max(255).required(),
      state: Yup.string().max(255).required(),
      country: Yup.string().max(255).required(),
      zip: Yup.string().max(255).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await dispatch(createCompany({
            "company_name": values.company_name, 
            "address_1": values.address_1, 
            "address_2": values.address_2, 
            "city": values.city, 
            "state": values.state, 
            "country": values.country, 
            "zip": values.zip
        }))
        toast.success('Company created!');
        router.push('/dashboard/companies').catch(console.error);
        
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong!');
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...props}
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
                Basic info
              </Typography>
            </Grid>
            <Grid
              item
              md={8}
              xs={12}
            >
              <TextField
                error={Boolean(formik.touched.company_name && formik.errors.company_name)}
                fullWidth
                helperText={formik.touched.company_name && formik.errors.company_name}
                label="Company Name"
                name="company_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.company_name}
              />
              <TextField
                error={Boolean(formik.touched.address_1 && formik.errors.address_1)}
                fullWidth
                helperText={formik.touched.address_1 && formik.errors.address_1}
                label="Address 1"
                name="address_1"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.address_1}
              />
            <TextField
                error={Boolean(formik.touched.address_2 && formik.errors.address_2)}
                fullWidth
                helperText={formik.touched.address_2 && formik.errors.address_2}
                label="Address 2"
                name="address_2"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.address_2}
              />
            <TextField
                error={Boolean(formik.touched.city && formik.errors.city)}
                fullWidth
                helperText={formik.touched.city && formik.errors.city}
                label="City"
                name="city"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.city}
              />
            <TextField
                error={Boolean(formik.touched.state && formik.errors.state)}
                fullWidth
                helperText={formik.touched.state && formik.errors.state}
                label="State"
                name="state"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.state}
              />
            <TextField
                error={Boolean(formik.touched.country && formik.errors.country)}
                fullWidth
                helperText={formik.touched.country && formik.errors.country}
                label="Country"
                name="country"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.country}
              />
            <TextField
                error={Boolean(formik.touched.zip && formik.errors.zip)}
                fullWidth
                helperText={formik.touched.zip && formik.errors.zip}
                label="Zip"
                name="zip"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.zip}
              />
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
        <NextLink
          href="/dashboard/companies"
          passHref
        >
          <Button
            component="a"
            sx={{
              m: 1,
              mr: 'auto'
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
          Create
        </Button>
      </Box>
    </form>
  );
};
