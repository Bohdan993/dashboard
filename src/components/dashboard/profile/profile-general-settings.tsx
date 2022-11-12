import type { FC, MouseEvent, ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import type { User } from '../../../types/user';
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
import { DeleteConfirmationDialog } from '../../../components/dashboard/delete-confirmation-dialog'


const baseUrl: string = 'https://my.platops.cloud/';

interface ProfileGeneralSettingsProps {
  auth: {
    user: User;
    updateUser: (email: string, first_name: string, last_name: string) => Promise<void>;
    updateUserAvatar: (avatar: string) => Promise<void>;
    deleteUser: () => Promise<void>;
  };
}

export const ProfileGeneralSettings: FC<ProfileGeneralSettingsProps> = (props) => {
  const {auth , ...rest} = props;
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const { user, updateUser, updateUserAvatar, deleteUser } = auth;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  console.log(user);

  const formik = useFormik({
    initialValues: {
      email: user?.email || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().max(255).required(),
      first_name: Yup.string().max(255).required(),
      last_name: Yup.string().max(255).required(),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await updateUser(values.email, values.first_name, values.last_name);
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

  const handleConfirm = async (event: MouseEvent<HTMLButtonElement>): Promise<void>  => {
    try {
      await deleteUser();
      toast.success('User deleted!');
    } catch(err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>): void  => {
  }

  const handleUpdateUserAvatar = async(event: MouseEvent<HTMLButtonElement>) : Promise<void> => {
    try {
      await updateUserAvatar(selectedImage! as unknown as string);
      setSelectedImage(null);
      toast.success('User avatar updated!');
    } catch(err) {
      console.error(err);
      toast.error('Something went wrong!');
    }
  }

  const handleUpload = () : void => {
    inputRef.current!.click();
  }

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(event.target.files?.[0]!);
  }

  return (
    <>
    <form
      onSubmit={formik.handleSubmit}
      {...rest}
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
                  <input
                    ref={inputRef}
                    type="file"
                    accept='image/*'
                    name="myImage"
                    style={{display: 'none'}}
                    onChange={handleChange}
                  />
                  <Avatar
                    src={selectedImage ? URL.createObjectURL(selectedImage as unknown as Blob) : `${baseUrl}${user?.avatar}`}
                    onClick={handleUpload}
                    sx={{
                      height: 64,
                      mr: 2,
                      width: 64
                    }}
                  >
                    <UserCircleIcon fontSize="small" />
                  </Avatar>

                  <Button
                    disabled={!selectedImage}
                    onClick={handleUpdateUserAvatar}
                  >
                    Update Avatar
                  </Button>
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
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    required
                    name="email"
                    size="small"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    sx={{
                      flexGrow: 1,
                      mr: 3,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderStyle: 'dashed'
                      }
                    }}
                    value={formik.values.email}
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
    <DeleteConfirmationDialog
        id={user.id}
        subject={'user'}
        onConfirmHandler={(event) => handleConfirm(event)}
        onCancelHandler={handleCancel}
        show={show}
        setShow={setShow}
    />
    </>
  );
};
