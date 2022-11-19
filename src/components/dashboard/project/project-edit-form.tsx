import type { FC, MouseEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import type { Project } from '../../../types/project';
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
import { MobileDatePicker } from '@mui/x-date-pickers';

import { useDispatch } from '../../../store';
import { useAuth } from '../../../hooks/use-auth';
import { logout as reduxLogout } from '../../../thunks/company';
import { updateProject, deleteProject } from '../../../thunks/project';

interface ProjectEditFormProps {
    id: number;
    project: Project;
    company_id: number;
}


export const ProjectEditForm: FC<ProjectEditFormProps> = (props) => {
  const {id, company_id, project, ...rest} = props;
  const [show, setShow] = useState<boolean>(false);
  const { logout } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<Date | null>(new Date(project?.start_date));
  const [endDate, setEndDate] = useState<Date | null>(new Date(project?.end_date));


  useEffect(() => {
    setShow(false);
  } , [company_id]);
    

  const formik = useFormik({
    initialValues: {
      name: project?.name || '',
      resp_person: project?.resp_person || '',
      summary: project?.summary || '',
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(),
      resp_person: Yup.string().max(255).required(),
      summary: Yup.string().max(255).required()
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      const startDateObj = new Date(startDate!);
      const endDateObj = new Date(endDate!);

      const startDateValue: string = `${startDateObj.getFullYear()}-${(startDateObj.getMonth() + 1) < 10 ? ('0' + (startDateObj.getMonth() + 1)) : (startDateObj.getMonth() + 1)}-${startDateObj.getDate() < 10 ? ('0' + startDateObj.getDate()) : startDateObj.getDate()}`;
      const endDateValue: string = `${endDateObj.getFullYear()}-${(endDateObj.getMonth() + 1) < 10 ? ('0' + (endDateObj.getMonth() + 1)) : (endDateObj.getMonth() + 1)}-${endDateObj.getDate() < 10 ? ('0' + endDateObj.getDate()) : endDateObj.getDate()}`;

      console.log(startDateValue, endDateValue);
      try {
        await dispatch(updateProject({"project" : {
          "id": id,
          "name": values.name, 
          "start_date": startDateValue, 
          "end_date": endDateValue, 
          "resp_person": values.resp_person, 
          "summary": values.summary, 
      }, "company_id": company_id }))
        toast.success('Project updated!');
        router.push('/dashboard/projects').catch(console.error);
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

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>, projectId: number): Promise<void>  => {
    try {
      await dispatch(deleteProject({
        "projectId": projectId,
        "company_id": company_id
      }));
      toast.success('Project deleted!');
      router.push('/dashboard/projects').catch(console.error);
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
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            <TextField
                error={Boolean(formik.touched.resp_person && formik.errors.resp_person)}
                fullWidth
                helperText={formik.touched.resp_person && formik.errors.resp_person}
                label="Responsible Person"
                name="resp_person"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.resp_person}
              />
            <TextField
                error={Boolean(formik.touched.summary && formik.errors.summary)}
                fullWidth
                helperText={formik.touched.summary && formik.errors.summary}
                label="Summary"
                name="summary"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.summary}
              />
          <Box
            sx={{
              display: 'flex',
              mt: 4
            }}
          >
            <Box sx={{ mr: 2 }}>
              <MobileDatePicker
                label="Start Date"
                onChange={(newDate) => setStartDate(newDate)}
                renderInput={(inputProps) => (
                  <TextField 
                    {...inputProps} 
                  />
                )}
                value={startDate}
              />
            </Box>
            <MobileDatePicker
              label="End Date"
              onChange={(newDate) => setEndDate(newDate)}
              renderInput={(inputProps) => (
                <TextField 
                  {...inputProps} 
                />
              )}
              value={endDate}
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
            href="/dashboard/projects"
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
        subject={'project'}
        onConfirmHandler={(event) => handleConfirm(event, id)}
        onCancelHandler={handleCancel}
        show={show}
        setShow={setShow}
    />
  </>
  );
};
