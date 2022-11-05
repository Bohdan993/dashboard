import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/material';
import { AuthGuard } from '../../../components/authentication/auth-guard';
import { DashboardLayout } from '../../../components/dashboard/dashboard-layout';
import { ProjectCreateForm } from '../../../components/dashboard/project/project-create-form';
import { useSelector } from '../../../store';


const ProjectCreate: NextPage = () => {

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
          Dashboard: Project Create | Material Kit Pro
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
              Create a new project
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
                href="/dashboard/projects"
                passHref
              >
                <Link variant="subtitle2">
                  Projects
                </Link>
              </NextLink>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                New project
              </Typography>
            </Breadcrumbs>
          </Box>
          <ProjectCreateForm 
            company_id={activeCompany && activeCompany.id!}
          />
        </Container>
      </Box>
    </>
  );
};

ProjectCreate.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProjectCreate;
