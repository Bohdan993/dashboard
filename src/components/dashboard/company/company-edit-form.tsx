import type { FC, MouseEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { companiesApi } from '../../../api/companies-api';
import NextLink from 'next/link';
import type { Company } from '../../../types/company';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { DeleteConfirmationDialog } from '../../../components/dashboard/delete-confirmation-dialog'
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
import { updateCompany, deleteCompany } from '../../../thunks/company';

interface CompanyEditFormProps {
    id: number;
    company: Company;
}


export const CompanyEditForm: FC<CompanyEditFormProps> = (props) => {
  const {id, company, ...rest} = props;
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
    

  const formik = useFormik({
    initialValues: {
      company_name: company?.company_name || '',
      address_1: company?.address_1 || '',
      address_2: company?.address_2 || '',
      city: company?.city || '',
      state: company?.state || '',
      country: company?.country || '',
      zip: company?.zip || '',
      submit: null
    },
    validationSchema: Yup.object({
      company_name: Yup.string().max(255).required(),
      address_1: Yup.string().max(255).required(),
      address_2: Yup.string().max(255),
      city: Yup.string().max(255).required(),
      state: Yup.string().max(255).required(),
      country: Yup.string().max(255).required(),
      zip: Yup.string().max(255).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await dispatch(updateCompany({
          "id": id,
          "company_name": values.company_name, 
          "address_1": values.address_1, 
          "address_2": values.address_2, 
          "city": values.city, 
          "state": values.state, 
          "country": values.country, 
          "zip": values.zip
        }))
        toast.success('Company updated!');
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


  const handleDelete = (
    event: MouseEvent<HTMLButtonElement>): void => {
      setShow(true);
  }

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>, companyId: number): Promise<void>  => {
    try {
      await dispatch(deleteCompany({
        "companyId": companyId
      }));
      toast.success('Company deleted!');
      router.push('/dashboard/companies').catch(console.error);
    } catch(err) {
      console.error(err);
      toast.error('Something went wrong!');
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
            href="/dashboard/companies"
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
          subject={'company'}
          onConfirmHandler={(event) => handleConfirm(event, id)}
          onCancelHandler={handleCancel}
          show={show}
          setShow={setShow}
      />
  </>
  );
};
