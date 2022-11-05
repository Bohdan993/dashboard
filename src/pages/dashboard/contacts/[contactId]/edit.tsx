import { useEffect, useCallback, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useMounted } from '../../../../hooks/use-mounted';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../../components/dashboard/dashboard-layout';
import { ContactEditForm } from '../../../../components/dashboard/contact/contact-edit-form';
import { contactsApi } from '../../../../api/contacts-api';
import type { Contact } from '../../../../types/contact';
import { useSelector } from '../../../../store';

const ContactEdit: NextPage = () => {
  const router = useRouter();
  const {contactId} = router.query;
  const isMounted = useMounted();
  const [contact, setContact] = useState<Contact | null>(null);
  const { activeCompany } = useSelector((state) => state.company);


  useEffect(() => {
    // gtm.push({ event: 'page_view' });
  }, []);

  const getContact = useCallback(async () => {
    try {
      const data = await contactsApi.getContact(Number(contactId), activeCompany?.id!);

      if (isMounted()) {
        setContact(data);
      }

    } catch (err) {
      console.error(err);
      setContact(null);
    }
  }, [isMounted, contactId, activeCompany]);

  useEffect(
    () => {
      if(activeCompany && activeCompany.id) { 
        getContact();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeCompany]
  );

  if(!activeCompany) {
    return null;
  }

  if (!contact) {
      return (<Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">
              Contact doesn't exist
            </Typography>
          </Box>
         </Container>
        </Box>);
  }


  return (
    <>
      <Head>
        <title>
          Dashboard: Contact Edit | Material Kit Pro
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
              Update contact id {contactId}
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
                Edit contact
              </Typography>
            </Breadcrumbs>
          </Box>
          <ContactEditForm 
              id={Number(contactId)} 
              contact={contact}
              company_id={activeCompany && activeCompany.id!}
            />
        </Container>
      </Box>
    </>
  );
};

ContactEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ContactEdit;
