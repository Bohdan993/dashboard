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
  Typography,
  Autocomplete,
} from '@mui/material';
import { useDispatch } from '../../../store';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';
import { createContact } from '../../../thunks/contact';

type Option = {
  text: string;
  value: string;
};

const types: Option[] = [
  { text: 'Administrative', value: 'administrative' },
  { text: 'Billing', value: 'billing' },
  { text: 'Technical', value: 'technical' }
];

interface ContactCreateFormProps  {
  company_id: number;
}

export const ContactCreateForm: FC<ContactCreateFormProps> = (props) => {
  const {company_id, ...rest} = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { logout } = useAuth();
  const formik = useFormik({
    initialValues: {
      type: { text: '', value: '' },
      name: '',
      email: '',
      phone_num: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      submit: null
    },
    validationSchema: Yup.object({
      type: Yup.object({
        value:  Yup.string().max(255).required('Type is a required field'),
        text:  Yup.string().max(255).required()
      }),
      name: Yup.string().max(255).required(),
      email: Yup.string().email("Invalid email format").max(255).required(),
      phone_num: Yup.string().max(255).required(),
      address_1: Yup.string().max(255).required(),
      address_2: Yup.string().max(255),
      city: Yup.string().max(255).required(),
      state: Yup.string().max(255).required(),
      country: Yup.string().max(255).required(),
      zip: Yup.string().max(255).required()
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      
      try {
        await dispatch(createContact({"contact" : {
            "type": values.type.value,
            "name": values.name,
            "email": values.email,
            "phone_num": values.phone_num,
            "address_1": values.address_1,
            "address_2": values.address_2,
            "city": values.city,
            "state": values.state,
            "country": values.country,
            "zip": values.zip
        }, "company_id": company_id }))
        toast.success('Contact created!');
        router.push('/dashboard/contacts').catch(console.error);
        
      } catch (err) {
        if(err.name === 'UnauthorizedError') {
          console.error(err);
          toast.error('Unauthorized!');
          try {
            router.push('/').then(async () => {
              await logout();
              dispatch(reduxLogout());
            }).catch(console.error);
          } catch (err) {
            console.error(err);
            toast.error('Unable to logout.');
          }
        } else {
          console.error(err);
          toast.error('Something went wrong!');
        }
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  console.log(formik);

  return (
    <form
      onSubmit={formik.handleSubmit}
      {...rest}
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
            <Autocomplete
              getOptionLabel={(option: Option) => option.text}
              options={types}
              isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
              value={formik.values.type}
              onChange={(e, value) => {
                formik.setFieldValue(
                  "type",
                  value !== null ? value : formik.initialValues.type
                );
              }}
              renderInput={(params): JSX.Element => (
                <TextField
                  {...params}
                  fullWidth
                  label="Type"
                  helperText={formik.touched.type && formik.errors.type?.value}
                  error={Boolean(formik.touched.type && formik.errors.type)}
                />
              )}
            />
            <TextField
              error={Boolean(formik.touched.name && formik.errors.name)}
              fullWidth
              helperText={formik.touched.name && formik.errors.name}
              label="Name"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{ mt: 2 }}
              value={formik.values.name}
            />
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.email}
              sx={{ mt: 2 }}
              type="email"
            />
            <TextField
              error={Boolean(formik.touched.phone_num && formik.errors.phone_num)}
              fullWidth
              helperText={formik.touched.phone_num && formik.errors.phone_num}
              label="Phone Number"
              name="phone_num"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.phone_num}
              sx={{ mt: 2 }}
              type="tel"
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
          href="/dashboard/contacts"
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
