import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ContactCreateForm } from '../../../components/dashboard/contact/contact-create-form';
import { useSelector } from '../../../store';


const ContactCreate: NextPage = () => {

  const { activeCompany } = useSelector((state) => state.company);

  useEffect(() => {
    // gtm.push({ event: 'page_view' });
  }, []);

  if(!activeCompany) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Dashboard: Contact Create | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">
              Create a new contact
            </Typography>
            <Breadcrumbs
              separator="/"
              sx={{ mt: 1 }}
            >
              <NextLink
                href="/dashboard"
                passHref
              >
                <Link variant="subtitle2">
                  Dashboard
                </Link>
              </NextLink>
              <NextLink
                href="/dashboard/contacts"
                passHref
              >
                <Link variant="subtitle2">
                  Contacts
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                New contact
              </Typography>
            </Breadcrumbs>
          </Box>
          <ContactCreateForm 
            company_id={activeCompany && activeCompany.id!}
          />
        </Container>
      </Box>
    </>
  );
};

ContactCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ContactCreate;
