import type { FC, MouseEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import type { Contact } from '../../../types/contact';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DeleteConfirmationDialog } from '../../../components/dashboard/delete-confirmation-dialog'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';

import { useDispatch } from '../../../store';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';
import { updateContact, deleteContact } from '../../../thunks/contact';

type Option = {
  text: string;
  value: string;
};

const types: Option[] = [
  { text: 'Administrative', value: 'administrative' },
  { text: 'Billing', value: 'billing' },
  { text: 'Technical', value: 'technical' }
];


interface ContactEditFormProps {
    id: number;
    contact: Contact;
    company_id: number;
}


export const ContactEditForm: FC<ContactEditFormProps> = (props) => {
  const {id, company_id, contact, ...rest} = props;
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();
  const { logout } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    setShow(false);
  } , [company_id]);
    

  const formik = useFormik({
    initialValues: {
      type: { text: (contact?.type.charAt(0).toUpperCase() +  contact?.type.substr(1)) || '', value: contact?.type || '' },
      name: contact?.name || '',
      email: contact?.email || '',
      phone_num: contact?.phone_num || '',
      address_1: contact?.address_1 || '',
      address_2: contact?.address_2 || '',
      city: contact?.city || '',
      state: contact?.state || '',
      country: contact?.country || '',
      zip: contact?.zip || '',
      submit: null,
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
        await dispatch(updateContact({"contact" : {
          "id": id,
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
        toast.success('Contact updated!');
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


  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>): void => {
      setShow(true);
  }

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>, contactId: number): Promise<void>  => {
    try {
      await dispatch(deleteContact({
        "contactId": contactId,
        "company_id": company_id
      }));
      toast.success('Contact deleted!');
      router.push('/dashboard/contacts').catch(console.error);
    } catch(err) {
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
    }
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>): void  => {
  }


  return (
    <>
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
            href="/dashboard/contacts"
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
      </form>
      <DeleteConfirmationDialog
        id={id}
        subject={'contact'}
        onConfirmHandler={(event) => handleConfirm(event, id)}
        onCancelHandler={handleCancel}
        show={show}
        setShow={setShow}
    />
  </>
  );
};
